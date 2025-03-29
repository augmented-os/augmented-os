# Data Schemas

This directory contains detailed documentation for each data schema in the system. Data schemas define the structure of information stored in our databases and passed between components.

## Event Schemas

- [Event Definitions](./event_definitions.md) - Core event type definitions
- [Event Instances](./event_instances.md) - Event instance data structure
- [Dead Letter Queue](./dead_letter_queue.md) - Structure for failed events
- [Event Queue State](./event_queue_state.md) - Event queue persistence format
- [Event Sequences](./event_sequences.md) - Sequence tracking for event ordering
- [Workflow Event Triggers](./workflow_event_triggers.md) - Event-based workflow trigger schemas
- [Workflow Event Subscriptions](./workflow_event_subscriptions.md) - Event subscription patterns

## Integration Schemas
- [Integration Definitions](./integration_definitions.md) - Schema for integration definitions
- [Integration Instances](./integration_instances.md) - Schema for integration instances

## Task Schemas
- [Task Definitions](./task_definitions.md) - Schema for task definitions
- [Task Instances](./task_instances.md) - Schema for task instances

## UI Schemas
- [UI Components](./ui_components.md) - UI component definitions

## Workflow Schemas
- [Workflow Definitions](./workflow_definitions.md) - Schema for workflow definitions
- [Workflow Instances](./workflow_instances.md) - Schema for workflow instances

## Test Schemas
- [Test Definitions](./test_definitions.md) - Templates for validating tasks and workflows
- [Test Runs](./test_runs.md) - Execution records for tests
- [Test Case Results](./test_case_results.md) - Detailed results for individual test cases

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

- **Events** → Used by the [Event Processing Service](../components/event_processing_service/README.md)
- **Tasks** → Used by the [Task Execution Service](../components/task_execution_service/README.md)
- **Workflows** → Used by the [Workflow Orchestrator Service](../components/workflow_orchestrator_service/README.md)
- **Integrations** → Used by the [Integration Service](../components/integration_service/README.md)
- **UI Components** → Used by the [Web Application](../components/web_application/README.md) UI Rendering Engine
- **Tests** → Used by the [Testing Framework](../components/testing_framework/README.md)

For an overview of all system components, see the [System Components](../components/README.md) documentation. 