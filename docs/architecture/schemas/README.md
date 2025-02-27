# Data Schemas

This directory contains detailed documentation for each data schema in the system. Data schemas define the structure of information stored in our databases and passed between components.

## Schemas

- [Events](./events.md) - Event definitions and instances
- [Integrations](./integrations.md) - Integration definitions and instances
- [Tasks](./tasks.md) - Task definitions and instances
- [Tests](./tests.md) - Test definitions and results
- [UI Components](./ui_components.md) - UI component definitions
- [Workflows](./workflows.md) - Workflow definitions and instances

## Schema Design Conventions

Our schemas follow these conventions:

1. **Top-Level Fields as Columns** - All top-level fields in component JSON definitions are stored as dedicated database columns with appropriate types
2. **Nested Structures as JSONB** - Complex nested objects and arrays are stored as JSONB fields
3. **Standard Columns** - All tables include `id` (UUID), `created_at`, and `updated_at` columns
4. **Business Identifiers** - Each entity has a business identifier column (e.g., `workflow_id`, `task_id`) with a UNIQUE constraint

For more details on our schema design principles, see the [Database Schema](../schema.md) documentation.

## Relationship to System Components

Each data schema is used by one or more system components:

- **Events** → Used by the Event Processing Service
- **Tasks** → Used by the Task Execution Layer
- **Workflows** → Used by the Workflow Orchestrator Service
- **Integrations** → Used by the Integration Service
- **UI Components** → Used by the UI Rendering Engine
- **Tests** → Used by the Testing Framework

For details on how these components use the schemas, see the [System Components](../components/) documentation. 