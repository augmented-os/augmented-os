# Database Architecture

## Overview

This document provides a high-level overview of the database architecture for the Augmented OS platform. The system uses PostgreSQL as the primary database technology, leveraging its robust features for storing structured data, JSON documents, and handling complex relationships.

## Technology Stack

* **Database Engine**: PostgreSQL 14+
* **Extensions**:
  * `pgcrypto` - For encryption of sensitive data
  * `uuid-ossp` - For UUID generation
  * `pg_trgm` - For text search capabilities
  * `ltree` - For hierarchical data structures (used in workflows)
  * `temporal_tables` - For time-based versioning of records

## Schema Design Principles

The database schema follows these core principles:

1. **Separation of Definitions and Instances** - Clear distinction between component definitions (templates) and their runtime instances
2. **JSON for Flexibility** - Use of JSONB for flexible schema components while maintaining structure through JSON Schema validation
3. **Referential Integrity** - Foreign key constraints to maintain data consistency
4. **Optimized Indexing** - Strategic indexes for performance, including GIN indexes for JSON fields
5. **Audit Trail** - Tracking of creation and modification timestamps for all records
6. **Versioning** - Support for versioned definitions to allow evolution without breaking existing instances
7. **Security** - Encryption of sensitive data and proper access controls

## Schema Design Conventions

To balance performance with developer experience, we follow these specific conventions:

1. **Top-Level Fields as Columns** - All top-level fields in component JSON definitions are stored as dedicated database columns with appropriate types
2. **Nested Structures as JSONB** - Complex nested objects and arrays are stored as JSONB fields
3. **Standard Columns** - All tables include `id` (UUID), `created_at`, and `updated_at` columns
4. **Business Identifiers** - Each entity has a business identifier column (e.g., `workflow_id`, `task_id`) with a UNIQUE constraint
5. **Type Mapping** - JSON types map to PostgreSQL types as follows:
   * JSON strings → VARCHAR/TEXT
   * JSON numbers → INTEGER/NUMERIC
   * JSON booleans → BOOLEAN
   * JSON objects/arrays → JSONB
   * JSON dates → TIMESTAMP

This approach provides consistent schema design across the system, making it intuitive for developers while maintaining good query performance for commonly accessed fields.

## Core Tables

The database is organized around these core component types, each with definition and instance tables:

| Component Type | Definition Table | Instance Table |
|----|----|----|
| Events | `event_definitions` | `events` |
| Tasks | `task_definitions` | `task_instances` |
| Workflows | `workflow_definitions` | `workflow_instances` |
| Integrations | `integration_definitions` | `integration_instances` |
| UI Components | `ui_components` | N/A (rendered client-side) |
| Tests | `test_definitions` | `test_runs` & `test_case_results` |

## Common Fields

Most tables share these common fields:

* `id` - UUID primary key
* `[entity]_id` - Business identifier (e.g., `task_id`, `workflow_id`)
* `name` - Human-readable name
* `description` - Detailed description
* `version` - Version identifier for definitions
* `created_at` - Creation timestamp
* `updated_at` - Last update timestamp

## Relationships

The following diagram illustrates the key relationships between components:

```
workflow_definitions
    ↓ references
task_definitions
    ↓ uses
ui_components
    ↓ may use
integration_definitions

event_definitions
    ↓ referenced by
workflow_definitions
    ↓ (triggers section)

workflow_instances
    ↓ creates
task_instances
    ↓ may trigger
events
    ↓ conforms to
event_definitions
    ↓ may use
integration_instances
```

Key relationships include:

* Workflow definitions reference task definitions in their steps
* Task definitions reference UI components for manual tasks
* Workflow definitions reference event definitions in their triggers
* Events conform to event definitions (validate against payload schema)
* Workflow instances create task instances during execution
* Task instances may trigger events upon completion
* Integration instances are used by tasks and workflows to interact with external systems

## JSON Schema Validation

All JSONB fields have corresponding JSON Schema definitions that are enforced at the application level. These schemas are defined in the component documentation and implemented in the validation layer.

## Indexing Strategy

The database uses these indexing strategies:

* **Primary Keys**: UUID for all tables
* **Business Identifiers**: Unique indexes on business identifiers (e.g., `task_id`)
* **Foreign Keys**: Indexes on all foreign key columns
* **JSON Fields**: GIN indexes on frequently queried JSON fields
* **Status Fields**: B-tree indexes on status fields for filtering
* **Timestamp Fields**: Indexes on timestamp fields used for range queries

## Partitioning

For high-volume tables (particularly `events` and `task_instances`), time-based partitioning is implemented to improve query performance and maintenance operations.

## Connection Pooling

The application uses PgBouncer for connection pooling to efficiently manage database connections.

## Backup and Recovery

The database is backed up using:

* Continuous WAL archiving
* Daily full backups
* Point-in-time recovery capability

## Component-Specific Schemas

For detailed schema information about each component, refer to the individual schema documentation:

* [Events Schema](./schemas/events.md)
* [Tasks Schema](./schemas/tasks.md)
* [Workflows Schema](./schemas/workflows.md)
* [Integrations Schema](./schemas/integrations.md)
* [UI Components Schema](./schemas/ui_components.md)
* [Tests Schema](./schemas/tests.md)

## Migration Strategy

Database migrations are managed using a version-controlled migration tool. Migrations follow these principles:

1. All changes are applied through migration scripts
2. Migrations are forward-only (no rollbacks in production)
3. Backward compatibility is maintained during transition periods
4. Large data migrations are performed in batches to minimize impact

## Performance Considerations

* Queries are optimized to use indexes effectively
* Large result sets are paginated
* Long-running operations use background processing
* Read-heavy operations may utilize read replicas
* Monitoring is in place to identify slow queries


