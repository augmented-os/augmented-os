# Tenant Schema Management

## Overview

The **Tenant Schema Management** module is a core component of the Business Store Service responsible for handling the lifecycle of tenant-specific database schemas. Its primary responsibilities include:

* Creating a new PostgreSQL schema for each tenant upon onboarding (and initializing default tables if any).
* Translating tenant-provided JSON Schema definitions into concrete SQL DDL statements to create or alter tables within the tenant’s schema.
* Managing updates to the tenant’s schema over time, including migrations when the JSON Schema changes (e.g., new fields or tables).
* Validating the consistency of tenant schemas and ensuring that all required fields (like `tenant_id` and primary keys) are present in every table.
* Interfacing with the Validation Service to ensure that incoming JSON Schemas are syntactically and semantically valid before applying them.

## Key Responsibilities

* **Schema Creation**: Provision new schemas (e.g., `tenant_<tenantId>`) and apply an initial schema (which might be empty or a minimal default structure).
* **Schema Application**: For each JSON Schema provided by a tenant (through an API call or config file), parse it and execute SQL statements to create corresponding tables and columns.
* **Migration Management**: Compare new JSON Schema versions to the existing applied schema and determine migration steps (add/modify columns, create/drop tables). Ensure migrations are ACID-compliant and, if possible, run in a transaction or under a maintenance lock for that tenant’s schema.
* **Integrity Enforcement**: Ensure each table has a primary key, a `tenant_id` column, and appropriate foreign keys for relations (matching references defined in JSON Schema, e.g., linking `invoice.customer_id` to `customer.customer_id`).
* **Metadata Updates**: After applying a schema or migration, update the metadata repository (e.g., increment schema version, log changes in `schema_migrations` table, record timestamp and user who initiated change).

## Implementation Approach

The Tenant Schema Management follows these design principles:




1. **Idempotency** – Schema creation and updates are designed to be idempotent. Applying the same schema twice results in the same final database state without errors (e.g., creating a table that already exists is handled gracefully).
2. **Modularity** – The module isolates tenant DDL operations. It builds a list of SQL commands and executes them, rolling back if any fail, to avoid partial schema states.
3. **Validation First** – Always validate JSON Schema input via the Validation Service or local checks before attempting to apply changes, preventing invalid database states.
4. **Auditability** – Every schema change is logged (who did it, what changed). It supports debugging and compliance by providing a clear history of schema evolution per tenant.
5. **Performance Aware** – Large migrations (affecting tables with millions of rows) are designed to be handled carefully (possibly in batches or with minimal locking). In some cases, the module might schedule migrations during off-peak hours via the Task Execution Service to reduce live impact.

## Schema Application Workflow

```plaintext
New JSON Schema Input
           ▼
┌──────────────────────┐       ┌────────────────────┐
│  Validation Service  │◄───►  │ Tenant Schema Mgmt │
│   (Schema Check)     │       │    Module          │
└──────────────────────┘       └─────────┬──────────┘
                                         ▼
                              Parse JSON Schema (structures, types)
                                         ▼
                               Generate SQL DDL (CREATE/ALTER)
                                         ▼
                             Apply DDL in tenant_<ID> schema
                                         ▼
                          Update Metadata (tenant_schemas table)
```

**Sequence**: When a tenant updates their data model via an API call (with a JSON Schema payload), the Business Store Service will first call the **Validation Service** to ensure the JSON Schema is valid. Once validated, the Tenant Schema Management module:




1. Parses the JSON Schema (identifies entities, fields, data types, constraints).
2. Compares with the current schema version (from metadata) to determine differences.
3. Prepares SQL statements. For example, if a new field `tax_amount` is added to `invoices`, it prepares `ALTER TABLE tenant_X.invoices ADD COLUMN tax_amount NUMERIC;`.
4. Executes all statements inside a database transaction (if supported for DDL; Postgres allows transactional DDL for most operations).
5. If any statement fails, rolls back and returns an error (no partial schema changes occur).
6. If all succeed, updates the `tenant_schemas` metadata entry for this tenant’s schema (bumping version, storing the new JSON Schema blob, etc.), and logs a record in `schema_migrations`.

### Example: Adding a New Table

* Tenant initially has only `customers` and `invoices`. They update their JSON Schema to add a new entity `Payment`.
* The module sees `payments` table doesn’t exist, generates `CREATE TABLE tenant_X.payments (...)` with appropriate columns and foreign key linking `invoice_id` to `invoices.invoice_id`.
* After creation, it logs that version increased (e.g., v2 -> v3) and notes the addition of `payments` table.

### Example: Adding a New Column

* Tenant adds a field `due_date` to invoices in the JSON Schema.
* Module generates `ALTER TABLE tenant_X.invoices ADD COLUMN due_date DATE;` and executes it. If `invoices` already have data, the new column is added as NULL for existing rows unless a default is specified in JSON Schema (in which case it would use `ADD COLUMN ... DEFAULT ...`).
* Metadata updated (e.g., version v3 -> v4).

## Edge Cases and Error Handling

The implementation addresses the following edge cases:

| Scenario | Handling Approach |
|----|----|
| JSON Schema invalid or unsupported | The Validation Service (or internal validator) rejects it with error details, **no changes** applied to DB. User must correct the schema. |
| Conflicting Changes (e.g., field type change from string to number) | If incompatible, the module may create a new column for the new type, migrate data from old column (with conversion if possible), then drop the old column in a later migration step. Logged as a complex migration. |
| Network/DB Failure during migration | If DB connection fails mid-way, transaction rollback ensures schema remains at previous version. The metadata is not updated, so next attempt will reapply. The system may mark the tenant as “migration required” for retry later (possibly via Task Execution Service). |
| Concurrent Schema Updates | BSS should serialize schema changes per tenant. If two updates happen nearly simultaneously, one will be applied first; the second is either rejected (if version mismatch) or queued to retry after the first completes. Optimistic locking using schema version in the metadata can enforce this. |
| Large Data Backfill Needs | If adding a new NOT NULL column without default, existing rows violate NOT NULL. The module will either (a) reject such schema updates or (b) fill a default before adding NOT NULL constraint. Generally, adding a NOT NULL field requires a default or a two-step migration (add nullable column, populate, then alter to NOT NULL). |

## Performance Considerations

Applying a schema for a tenant with very large tables is potentially slow. To mitigate this:

* **Online DDL**: Where possible, use PostgreSQL features for non-blocking index creation (CONCURRENTLY) and avoid heavy locks. The module might detect table size and adjust strategy (e.g., do not lock table for a long time).
* **Async Migrations**: For complex changes (like splitting a column or data format changes), the module will integrate with the Task Execution Service to perform data migrations asynchronously. For instance, it could add a new column, copy data in batches via a background task, then remove the old column in a follow-up operation.
* **Version Flags**: If a new schema is applied but data migration is ongoing, the metadata can mark that tenant’s schema as in “transitional” state, so the service can still operate (perhaps writing to both old and new columns) until migration is done.

### Benchmarks

While exact numbers depend on environment, the module aims for the following performance:

| Operation | Average Time (for moderate schema) | P99 Time (for large schema) |
|----|----|----|
| Initial schema creation | \~200 ms | 500 ms (includes metadata) |
| Add simple column | \~50 ms | 100 ms |
| Add table (with index & FK) | \~100 ms | 250 ms (more if multi-index) |
| Complex migration (type change w/ data) | depends (usually offloaded to async task) | N/A (or high, done asynchronously) |

*(These are illustrative; actual performance tuning and measurement should be done in the deployed environment.)*

## Related Documentation

* **Data Model** – Describes the structure of tenant data and how JSON Schema translates to tables (useful to understand what Tenant Schema Management acts on).
* **Validation Service** (separate component) – How JSON Schema validation works, ensuring that invalid schemas do not reach this module.
* **Security & Isolation** – Some RLS policies are created when schemas/tables are created. Tenant Schema Management collaborates with the Security module to attach proper RLS to each new table (see Security & Isolation documentation).
* **API Reference (Schema Endpoints)** – The endpoints (e.g., `PUT /schema`) that trigger this module, with examples.


