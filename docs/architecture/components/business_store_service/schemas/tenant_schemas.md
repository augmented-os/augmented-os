# tenant_schemas

## Overview

This table stores the JSON schema definitions provided by each tenant to the Business Store Service (BSS). It acts as the central metadata repository for tenant data models, tracking the schema content, its version, and when it was successfully applied to the tenant's PostgreSQL schema. This table is owned and managed exclusively by the Business Store Service.

## Key Concepts

* **Tenant Schema Definition:** The JSON document provided by a tenant that describes their desired database tables, columns, types, and relationships.
* **Schema Versioning:** Each modification to a tenant's schema results in a new version number, allowing tracking of changes over time and potentially enabling rollback or comparison.
* **Applied State:** Records the timestamp when a specific schema version was successfully translated and applied as DDL to the tenant's physical database schema.

## Schema Structure

```json
{
  "record": {
    "schema_id": "uuid",           // Unique identifier for this specific schema version record (PK)
    "tenant_id": "uuid",           // Identifier for the tenant owning this schema
    "version": "integer",          // Monotonically increasing version number for the tenant's schema
    "schema_json": "object",       // The JSON object defining the tenant's database schema
    "applied_at": "string | null", // ISO8601 timestamp when this version was applied, or null if pending/failed
    "created_at": "string",        // ISO8601 timestamp when this schema version record was created
    "updated_at": "string"         // ISO8601 timestamp when this record was last updated
  }
}
```

## Schema Storage and Versioning

This table's core function is to persist the tenant-provided JSON schema definitions.

* `schema_json` Column: Stores the complete JSON definition submitted by the tenant. Using the `JSONB` type in PostgreSQL is recommended for storage efficiency and potential querying/indexing capabilities within the JSON structure itself, although this is not a primary use case.
* `tenant_id` Column: Links the schema definition to the specific tenant it belongs to. This is critical for multi-tenant isolation of schema metadata.
* `version` Column: Tracks the evolution of a tenant's schema. Each time a tenant successfully submits an update via the `PUT /schema` API, a new row should be inserted with an incremented version number. This provides a history of schema changes.

## Example data:

```json
{
  "record": {
    "schema_id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    "tenant_id": "tenant-abc-123",
    "version": 3,
    "schema_json": {
      "entities": {
        "customers": { "properties": { "id": { "type": "uuid"}, "name": {"type": "text"} }, "primaryKey": "id" },
        "invoices": { "properties": { "id": {"type": "uuid"}, "customer_id": {"type": "uuid"}, "amount": {"type": "numeric"} }, "primaryKey": "id"}
      }
    },
    "applied_at": "2024-03-15T10:30:00Z",
    "created_at": "2024-03-15T10:25:00Z",
    "updated_at": "2024-03-15T10:30:05Z"
  }
}
```

## Application State and Locking

Tracking when a schema is applied and ensuring consistency during updates are key operational aspects.

* `applied_at` Timestamp: This timestamp indicates that the Business Store Service successfully processed the `schema_json` for this `version` and applied the corresponding DDL changes to the tenant's physical database schema (e.g., `tenant_tenant-abc-123`). A `NULL` value might indicate a newly submitted schema that is pending application or one that failed during the application process (though failures might be better tracked in `schema_migrations`).
* **Concurrency Control:** The combination of `tenant_id` and `version` must be unique. This prevents inserting duplicate versions. Updates to apply a schema might use optimistic locking based on the `version` or `updated_at` timestamp to prevent race conditions if multiple application attempts occur.

## Database Schema

Table: `business_store_service.tenant_schemas`

| Column | Type | Nullable | Default | Description |
|----|----|----|----|----|
| schema_id | UUID | No | `gen_random_uuid()` | Primary key for this specific schema version record |
| tenant_id | UUID | No |    | Foreign key identifying the tenant |
| version | INTEGER | No |    | Monotonically increasing schema version number per tenant |
| schema_json | JSONB | No |    | The tenant's JSON schema definition |
| applied_at | TIMESTAMP WITH TIME ZONE | Yes |    | Timestamp when this schema version was successfully applied to the database |
| created_at | TIMESTAMP WITH TIME ZONE | No | `CURRENT_TIMESTAMP` | Timestamp when the record was created |
| updated_at | TIMESTAMP WITH TIME ZONE | No | `CURRENT_TIMESTAMP` | Timestamp when the record was last updated |

**Indexes:**

| Name | Columns | Type | Description |
|----|----|----|----|
| tenant_schemas_pkey | (schema_id) | PRIMARY KEY | Primary key constraint |
| tenant_schemas_tenant_id_idx | (tenant_id) | BTREE | Index for quickly finding schemas for a tenant |
| tenant_schemas_tenant_ver_uniq | (tenant_id, version) | UNIQUE | Ensures version number is unique per tenant |

**Foreign Keys:**

*(None explicitly defined within this table schema,* `tenant_id` logically refers to a tenant managed likely by the Auth Service)

**Constraints:**

| Name | Type | Columns | Condition | Description |
|----|----|----|----|----|
| tenant_schemas_pkey | PRIMARY KEY | (schema_id) |    | Primary key constraint |
| tenant_schemas_tenant_ver_uniq | UNIQUE | (tenant_id, version) |    | Ensures version number is unique per tenant |
| tenant_schemas_version_check | CHECK | (version) | `version > 0` | Ensure version is positive |

## Usage Patterns

**Common Queries**

```sql
-- Get the latest applied schema version for a specific tenant
SELECT schema_json, version
FROM business_store_service.tenant_schemas
WHERE tenant_id = $1 AND applied_at IS NOT NULL
ORDER BY version DESC
LIMIT 1;

-- Get a specific schema version for a tenant
SELECT schema_id, schema_json, applied_at
FROM business_store_service.tenant_schemas
WHERE tenant_id = $1 AND version = $2;
```

**Insert Example**

```sql
-- Insert a new schema version for a tenant (applied_at is initially NULL)
INSERT INTO business_store_service.tenant_schemas (tenant_id, version, schema_json)
VALUES ($1, $2, $3);
```

**Update Example**

```sql
-- Mark a specific schema version as applied
UPDATE business_store_service.tenant_schemas
SET applied_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
WHERE tenant_id = $1 AND version = $2;
```

## Performance Considerations

* **Indexing:** Indexes on `(tenant_id, version)` are critical for efficiently retrieving the current or specific schema versions for a tenant. The index on `tenant_id` alone supports finding all historical versions.
* **JSONB Size:** The `schema_json` column could potentially store large JSON objects if tenants define very complex schemas. This could impact storage size and backup times, but retrieval performance for the JSON itself is generally good with JSONB.
* **Query Frequency:** This table is likely read whenever the BSS needs to validate incoming data against a tenant's schema or perform schema-aware operations. Caching the latest applied schema in the BSS application memory can significantly reduce read load on this table. Writes occur only when schemas are updated.

## Ownership and Responsibility

This table is owned by the **Business Store Service**. Any changes to the schema must be reviewed by the **\[Backend Platform Team / BSS Team\]**.

## Migrations and Schema Evolution

Schema migrations for this table itself (e.g., adding new metadata columns) should be handled using standard database migration tools (like Flyway, Liquibase, etc.). Adding nullable columns is generally backward compatible. Changing the `schema_json` column type or fundamentally altering the versioning mechanism would require careful planning.

## Environment-Specific Configuration

| Environment | Partitioning | Retention Policy | Special Considerations |
|----|----|----|----|
| Development | None | Keep indefinitely | May contain test/example schemas |
| Testing | None | Keep indefinitely | Populated during integration tests |
| Production | None | Keep historical indefinitely | Critical metadata; requires backup & DR |

## Related Documentation

* `schema_migrations` - Tracks the history of applying these schema versions.
* Business Store Service Data Model - Describes the overall BSS data approach.
* Auth Service - Manages tenant identities referenced by `tenant_id`.

## Table Structure

| Column | Type | Nullable | Default | Description |
|----|----|----|----|----|
| schema_id | UUID | No | gen_random_uuid() | Primary key for this specific schema version record |
| tenant_id | UUID | No |    | Foreign key identifying the tenant |
| version | INTEGER | No |    | Monotonically increasing schema version number per tenant |
| schema_json | JSONB | No |    | The tenant's JSON schema definition |
| applied_at | TIMESTAMP WITH TIME ZONE | Yes |    | Timestamp when this schema version was successfully applied to the database |
| created_at | TIMESTAMP WITH TIME ZONE | No | CURRENT_TIMESTAMP | Timestamp when the record was created |
| updated_at | TIMESTAMP WITH TIME ZONE | No | CURRENT_TIMESTAMP | Timestamp when the record was last updated |

## Indexes

| Name | Columns | Type | Description |
|----|----|----|----|
| tenant_schemas_pkey | (schema_id) | PRIMARY KEY | Primary key constraint |
| tenant_schemas_tenant_id_idx | (tenant_id) | BTREE | Index for quickly finding schemas for a tenant |
| tenant_schemas_tenant_ver_uniq | (tenant_id, version) | UNIQUE | Ensures version number is unique per tenant |

## Foreign Keys

*(None defined)*

## Constraints

| Name | Type | Columns | Condition | Description |
|----|----|----|----|----|
| tenant_schemas_pkey | PRIMARY KEY | (schema_id) |    | Primary key constraint |
| tenant_schemas_tenant_ver_uniq | UNIQUE | (tenant_id, version) |    | Ensures version number is unique per tenant |
| tenant_schemas_version_check | CHECK | (version) | `version > 0` | Ensure version is positive |

## Usage Patterns

**Common Queries**

```sql
-- Get the latest applied schema version for a specific tenant
SELECT schema_json, version FROM business_store_service.tenant_schemas WHERE tenant_id = $1 AND applied_at IS NOT NULL ORDER BY version DESC LIMIT 1;

-- Get a specific schema version for a tenant
SELECT schema_id, schema_json, applied_at FROM business_store_service.tenant_schemas WHERE tenant_id = $1 AND version = $2;
```

**Insert Example**

```sql
INSERT INTO business_store_service.tenant_schemas (tenant_id, version, schema_json) VALUES ($1, $2, $3);
```

**Update Example**

```sql
UPDATE business_store_service.tenant_schemas SET applied_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE tenant_id = $1 AND version = $2;
```

## Performance Considerations

* Critical indexes: `(tenant_id, version)` and `(tenant_id)`.
* Potential impact of large `schema_json` values on storage.
* Read frequency mitigated by application-level caching in BSS.
* Writes are infrequent (only on schema updates).

## Related Tables

* `schema_migrations`: Records the outcome of attempts to apply schemas stored here.


