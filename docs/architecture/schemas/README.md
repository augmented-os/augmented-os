# Data Schemas

This directory contains detailed documentation for each data schema in the system. Data schemas define the structure of information stored in our databases and passed between components.

## Schemas

- [Events](./events.md) - Event definitions and instances
- [Integrations](./integrations.md) - Integration definitions and instances
- [Tasks](./tasks.md) - Task definitions and instances
- [Tests](./tests.md) - Test definitions and results
- [UI Components](./ui_components.md) - UI component definitions
- [Workflows](./workflows.md) - Workflow definitions and instances

## Schema Design

Our schemas follow specific design conventions to balance performance with developer experience. For comprehensive information about our database architecture, including:

- Database technology stack
- Schema design principles and conventions
- Core tables and relationships
- Indexing and partitioning strategies
- Migration approach
- Performance considerations

Please refer to the [Database Architecture](../database_architecture.md) documentation.

## Relationship to System Components

Each data schema is used by one or more system components:

- **Events** → Used by the Event Processing Service
- **Tasks** → Used by the Task Execution Layer
- **Workflows** → Used by the Workflow Orchestrator Service
- **Integrations** → Used by the Integration Service
- **UI Components** → Used by the UI Rendering Engine
- **Tests** → Used by the Testing Framework

For details on how these components use the schemas, see the [System Components](../components/) documentation. 