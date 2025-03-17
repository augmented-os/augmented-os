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

The database is organized into several major component types, each with corresponding tables:

| Component | Table | Description |
|-----------|-------|-------------|
| **Events** | `event_definitions` | Defines event types and their expected payload schemas |
| | `event_instances` | Records of actual events that have occurred in the system |
| | `event_sequences` | Tracks ordered series of related events |
| | `event_queue_state` | Manages the state of events waiting for processing |
| | `dead_letter_queue` | Stores events that failed processing for later analysis or retry |
| **Tasks** | `task_definitions` | Templates for tasks that can be executed by the system |
| | `task_instances` | Individual executions of tasks with their current state and results |
| **Workflows** | `workflow_definitions` | Templates for process flows composed of multiple tasks |
| | `workflow_instances` | Running or completed workflow executions with their state |
| | `workflow_event_triggers` | Defines which events can trigger workflow execution |
| | `workflow_event_subscriptions` | Links running workflow instances to events they're waiting for |
| **Integrations** | `integration_definitions` | Templates for connecting to external systems |
| | `integration_instances` | Configured connections to external systems with credentials |
| **UI Components** | `ui_components` | Reusable UI component definitions for building interfaces |
| **Tests** | `test_definitions` | Test templates for validating workflow and task behavior |
| | `test_runs` | Execution records of test batches |
| | `test_case_results` | Detailed results for individual test cases within test runs |

This schema design supports the event-driven architecture of the system, with clear separation between definitions (templates/configurations) and runtime instances. The additional tables for events and workflows facilitate event processing, queueing, and workflow-to-event relationships.

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
workflow_event_triggers
    ↓ connected to
workflow_definitions

workflow_instances
    ↓ creates
task_instances
    ↓ may trigger
event_instances
    ↓ may be processed by
event_sequences
    ↓ may be queued in
event_queue_state
    ↓ may be moved to
dead_letter_queue

workflow_event_subscriptions
    ↓ connects
workflow_instances
    ↓ with
event_instances

integration_instances
    ↓ configured from
integration_definitions
```

Key relationships include:

* Workflow definitions reference task definitions in their steps
* Task definitions reference UI components for manual tasks
* Workflow event triggers connect events to workflows (event-driven workflows)
* Workflow event subscriptions link running workflow instances to specific events
* Event instances may flow through sequences, queue states, and potentially to dead letter queue
* Event definitions define the structure and validation rules for event instances
* Integration instances are configured based on integration definitions
* Test runs execute test definitions and produce test case results

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

For high-volume tables (particularly `event_instances` and `task_instances`), time-based partitioning is implemented to improve query performance and maintenance operations.

## Connection Pooling

The application uses PgBouncer for connection pooling to efficiently manage database connections.

## Backup and Recovery

The database is backed up using:

* Continuous WAL archiving
* Daily full backups
* Point-in-time recovery capability

## Component-Specific Schemas

For detailed schema information about each component, refer to the individual schema documentation:

### Events
* [Event Definitions](./schemas/event_definitions.md)
* [Event Instances](./schemas/event_instances.md)
* [Event Sequences](./schemas/event_sequences.md)
* [Event Queue State](./schemas/event_queue_state.md)
* [Dead Letter Queue](./schemas/dead_letter_queue.md)

### Workflows
* [Workflow Definitions](./schemas/workflow_definitions.md)
* [Workflow Instances](./schemas/workflow_instances.md)
* [Workflow Event Triggers](./schemas/workflow_event_triggers.md)
* [Workflow Event Subscriptions](./schemas/workflow_event_subscriptions.md)

### Tasks
* [Task Definitions](./schemas/task_definitions.md)
* [Task Instances](./schemas/task_instances.md)

### Integrations
* [Integration Definitions](./schemas/integration_definitions.md)
* [Integration Instances](./schemas/integration_instances.md)

### Other Components
* [UI Components](./schemas/ui_components.md)

### Testing
* [Test Definitions](./schemas/test_definitions.md)
* [Test Runs](./schemas/test_runs.md)
* [Test Case Results](./schemas/test_case_results.md)

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


