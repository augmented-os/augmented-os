# schema_migrations

## Overview

This table serves as an audit log, recording the history and status of attempts to apply tenant schema changes within the Business Store Service (BSS). Each time the service tries to apply a specific version of a tenant's schema (as defined in the `tenant_schemas` table), a record is created here documenting the process and outcome. This table is owned and managed exclusively by the Business Store Service.

## Key Concepts

* **Migration Attempt:** An instance of the BSS attempting to apply DDL changes corresponding to a specific `tenant_schemas` version.
* **Audit Trail:** Provides a historical log of schema changes applied per tenant, useful for debugging, compliance, and understanding schema evolution.
* **Status Tracking:** Records whether a migration attempt was successful, failed, or is pending, along with details about the outcome.

## Schema Structure

```json
{
  "record": {
    "migration_id": "uuid",        // Unique identifier for this migration attempt (PK)
    "tenant_schema_id": "uuid",    // Foreign key linking to the tenant_schemas record being applied
    "tenant_id": "uuid",           // Identifier for the tenant (denormalized for easier querying)
    "version_applied": "integer",  // Schema version number attempted (denormalized)
    "status": "string",            // Status of the migration attempt ('pending', 'success', 'failed')
    "details": "string | object | null", // Details about the migration (e.g., error message, steps taken)
    "applied_by": "string | null", // Identifier of the user or service that initiated the migration
    "created_at": "string",        // ISO8601 timestamp when the migration attempt started/was recorded
    "updated_at": "string"         // ISO8601 timestamp when the record was last updated (e.g., status change)
  }
}
```

## Audit Logging

This table provides an immutable (or mostly append-only) log of schema management activities.

* **Traceability:** Records link directly to the specific schema version attempted via `tenant_schema_id`. Including denormalized `tenant_id` and `version_applied` aids direct querying of history without extra joins.
* **Details:** The `details` column (potentially TEXT or JSONB) can store valuable context, such as error messages and stack traces on failure, or a summary of DDL operations performed on success.
* **Initiator:** The `applied_by` field helps identify whether a change was triggered by a specific user API call, an automated process, or an administrator action.

## Example data:

```json
{
  "record": {
    "migration_id": "f1e2d3c4-b5a6-7890-4321-abcdef123456",
    "tenant_schema_id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    "tenant_id": "tenant-abc-123",
    "version_applied": 3,
    "status": "success",
    "details": "Applied schema version 3. Created table 'payments'. Added column 'due_date' to 'invoices'.",
    "applied_by": "user:admin@example.com",
    "created_at": "2024-03-15T10:28:00Z",
    "updated_at": "2024-03-15T10:30:05Z"
  }
}
```

## Migration Status and Diagnostics

Tracking the outcome of each migration attempt is crucial for operational monitoring.

* `status` Field: Indicates the final state of the migration attempt. Common values would be `pending` (job initiated but not finished), `success` (DDL applied without errors), `failed` (errors occurred during application). Using a constrained set of values (e.g., via a CHECK constraint or ENUM type) is recommended.
* **Troubleshooting:** When `status` is `failed`, the `details` column becomes essential for diagnosing the root cause, guiding manual intervention or fixes to the schema definition.

## Database Schema

Table: `business_store_service.schema_migrations`

| Column | Type | Nullable | Default | Description |
|----|----|----|----|----|
| migration_id | UUID | No | `gen_random_uuid()` | Primary key for this migration log record |
| tenant_schema_id | UUID | No |    | Foreign key to the business_store_service.tenant_schemas record this migration corresponds to |
| tenant_id | UUID | No |    | Denormalized tenant identifier for easier querying |
| version_applied | INTEGER | No |    | Denormalized schema version number attempted |
| status | TEXT | No | `'pending'` | Status of the migration attempt (e.g., 'pending', 'success', 'failed') |
| details | TEXT | Yes |    | Details about the migration outcome (errors, summary) |
| applied_by | VARCHAR(255) | Yes |    | Identifier of the user or service initiating the migration |
| created_at | TIMESTAMP WITH TIME ZONE | No | `CURRENT_TIMESTAMP` | Timestamp when the migration attempt was recorded |
| updated_at | TIMESTAMP WITH TIME ZONE | No | `CURRENT_TIMESTAMP` | Timestamp when the record (e.g., status) was last updated |

**Indexes:**

| Name | Columns | Type | Description |
|----|----|----|----|
| schema_migrations_pkey | (migration_id) | PRIMARY KEY | Primary key constraint |
| schema_migrations_tenant_id_idx | (tenant_id) | BTREE | Index for retrieving migration history per tenant |
| schema_migrations_schema_id_idx | (tenant_schema_id) | BTREE | Index for finding migrations related to a specific schema version |
| schema_migrations_created_at_idx | (created_at) | BTREE | Index for time-based queries of migration history |

**Foreign Keys:**

| Column | References | On Delete | Description |
|----|----|----|----|
| tenant_schema_id | business_store_service.tenant_schemas(schema_id) | RESTRICT | Links migration record to the specific schema version being applied |

**Constraints:**

| Name | Type | Columns | Condition | Description |
|----|----|----|----|----|
| schema_migrations_pkey | PRIMARY KEY | (migration_id) |    | Primary key constraint |
| schema_migrations_status_chk | CHECK | (status) | `status IN ('pending', 'success', 'failed')` | Ensures status is one of the allowed values |

## Usage Patterns

**Common Queries**

```sql
-- Get migration history for a specific tenant, most recent first
SELECT migration_id, version_applied, status, details, created_at
FROM business_store_service.schema_migrations
WHERE tenant_id = $1
ORDER BY created_at DESC
LIMIT 50;

-- Find failed migrations for a specific tenant schema version
SELECT migration_id, details, created_at
FROM business_store_service.schema_migrations
WHERE tenant_schema_id = $1 AND status = 'failed';
```

**Insert Example**

```sql
-- Record the start of a migration attempt
INSERT INTO business_store_service.schema_migrations (tenant_schema_id, tenant_id, version_applied, status, applied_by)
VALUES ($1, $2, $3, 'pending', $4);
-- Returning migration_id might be useful
```

**Update Example**

```sql
-- Update the status and details upon completion (success or failure)
UPDATE business_store_service.schema_migrations
SET status = $2, details = $3, updated_at = CURRENT_TIMESTAMP
WHERE migration_id = $1;
```

## Performance Considerations

* **Write Pattern:** This table is primarily append-only. Inserts should be fast. Updates are less frequent, mainly to change the `status`.
* **Querying:** Queries typically filter by `tenant_id` and/or `created_at`. Indexing these columns is essential for performance as the table grows.
* **Table Growth:** Over time, this table could grow large if schema updates are frequent across many tenants. Consider partitioning by `tenant_id` or `created_at` (e.g., monthly or quarterly) if performance degrades due to size. Data archiving/purging policies might be needed for very old records if not required for long-term audit.

## Ownership and Responsibility

This table is owned by the **Business Store Service**. Any changes to the schema must be reviewed by the **\[Backend Platform Team / BSS Team\]**.

## Migrations and Schema Evolution

Standard database migration tools should be used. Common changes might involve adding new status types (requiring updates to the CHECK constraint) or adding columns for more detailed logging. Removing data should be done cautiously according to defined retention policies.

## Environment-Specific Configuration

| Environment | Partitioning | Retention Policy | Special Considerations |
|----|----|----|----|
| Development | None | Keep recent (e.g., last 30 days) | Lower volume |
| Testing | None | Keep per-test-run or short term | Populated during test execution |
| Production | Consider by date/tenant ID | Define based on audit requirements | Potential for high volume; backups |

## Related Documentation

* `tenant_schemas` - The source schema definitions that trigger these migration records.
* Business Store Service Data Model - Overall BSS data approach.
* Observability Service - Logs/metrics from BSS might correlate with these records.

## Table Structure

| Column | Type | Nullable | Default | Description |
|----|----|----|----|----|
| migration_id | UUID | No | gen_random_uuid() | Primary key for this migration log record |
| tenant_schema_id | UUID | No |    | Foreign key to the business_store_service.tenant_schemas record this migration corresponds to |
| tenant_id | UUID | No |    | Denormalized tenant identifier for easier querying |
| version_applied | INTEGER | No |    | Denormalized schema version number attempted |
| status | TEXT | No | 'pending' | Status of the migration attempt (e.g., 'pending', 'success', 'failed') |
| details | TEXT | Yes |    | Details about the migration outcome (errors, summary) |
| applied_by | VARCHAR(255) | Yes |    | Identifier of the user or service initiating the migration |
| created_at | TIMESTAMP WITH TIME ZONE | No | CURRENT_TIMESTAMP | Timestamp when the migration attempt was recorded |
| updated_at | TIMESTAMP WITH TIME ZONE | No | CURRENT_TIMESTAMP | Timestamp when the record (e.g., status) was last updated |

## Indexes

| Name | Columns | Type | Description |
|----|----|----|----|
| schema_migrations_pkey | (migration_id) | PRIMARY KEY | Primary key constraint |
| schema_migrations_tenant_id_idx | (tenant_id) | BTREE | Index for retrieving migration history per tenant |
| schema_migrations_schema_id_idx | (tenant_schema_id) | BTREE | Index for finding migrations related to a specific schema version |
| schema_migrations_created_at_idx | (created_at) | BTREE | Index for time-based queries of migration history |

## Foreign Keys

| Column | References | On Delete | Description |
|----|----|----|----|
| tenant_schema_id | business_store_service.tenant_schemas(schema_id) | RESTRICT | Links migration record to the specific schema version being applied |

## Constraints

| Name | Type | Columns | Condition | Description |
|----|----|----|----|----|
| schema_migrations_pkey | PRIMARY KEY | (migration_id) |    | Primary key constraint |
| schema_migrations_status_chk | CHECK | (status) | `status IN ('pending', 'success', 'failed')` | Ensures status is one of the allowed values |

## Usage Patterns

**Common Queries**

```sql
-- Get migration history for a specific tenant, most recent first
SELECT migration_id, version_applied, status, details, created_at FROM business_store_service.schema_migrations WHERE tenant_id = $1 ORDER BY created_at DESC LIMIT 50;

-- Find failed migrations for a specific tenant schema version
SELECT migration_id, details, created_at FROM business_store_service.schema_migrations WHERE tenant_schema_id = $1 AND status = 'failed';
```

**Insert Example**

```sql
INSERT INTO business_store_service.schema_migrations (tenant_schema_id, tenant_id, version_applied, status, applied_by) VALUES ($1, $2, $3, 'pending', $4);
```

**Update Example**

```sql
UPDATE business_store_service.schema_migrations SET status = $2, details = $3, updated_at = CURRENT_TIMESTAMP WHERE migration_id = $1;
```

## Performance Considerations

* Append-heavy workload.
* Requires indexes on `tenant_id` and `created_at` for efficient history lookup.
* Potential for large table size over time; consider partitioning or archiving.

## Related Tables

* `tenant_schemas`: Contains the schema definitions whose application is logged here.


