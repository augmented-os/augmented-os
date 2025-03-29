# System Data Model

## Overview

This document provides a comprehensive index of all database tables in the system, organized by the component that owns them. The system can be implemented either as:

1. A single PostgreSQL database with separate schemas for each microservice (recommended for development and smaller deployments)
2. Separate databases for each microservice (recommended for large-scale production deployments)

## Master Table - All System Tables

| PostgreSQL Schema | Table Name | Purpose |
|-------------------|------------|---------|
| auth_service | [permissions](./components/auth_service/schemas/permissions.md) | Permission definitions |
| auth_service | [roles](./components/auth_service/schemas/roles.md) | Role definitions |
| auth_service | [users](./components/auth_service/schemas/users.md) | User accounts and profiles |
| event_processing_service | [dead_letter_queue](./components/event_processing_service/schemas/dead_letter_queue.md) | Failed event storage |
| event_processing_service | [event_definitions](./components/event_processing_service/schemas/event_definitions.md) | Templates for event types |
| event_processing_service | [event_instances](./components/event_processing_service/schemas/event_instances.md) | Records of actual events |
| event_processing_service | [event_queue_state](./components/event_processing_service/schemas/event_queue_state.md) | Queue state management |
| event_processing_service | [event_sequences](./components/event_processing_service/schemas/event_sequences.md) | Ordered series of events |
| integration_service | [integration_definitions](./components/integration_service/schemas/integration_definitions.md) | Templates for integrations |
| integration_service | [integration_instances](./components/integration_service/schemas/integration_instances.md) | Configured integration setups |
| observability_service | [observability_logs](./components/observability_service/schemas/observability_logs.md) | System logs |
| observability_service | [observability_metrics](./components/observability_service/schemas/observability_metrics.md) | System metrics |
| observability_service | [observability_traces](./components/observability_service/schemas/observability_traces.md) | Distributed traces |
| task_execution_service | [task_definitions](./components/task_execution_service/schemas/task_definitions.md) | Templates for tasks |
| task_execution_service | [task_instances](./components/task_execution_service/schemas/task_instances.md) | Running task executions |
| testing_framework_service | [test_case_results](./components/testing_framework/schemas/test_case_results.md) | Results for individual test cases |
| testing_framework_service | [test_definitions](./components/testing_framework/schemas/test_definitions.md) | Templates for tests |
| testing_framework_service | [test_runs](./components/testing_framework/schemas/test_runs.md) | Execution records for tests |
| web_application_service | [ui_components](./components/web_application/schemas/ui_components.md) | UI component definitions |
| workflow_orchestrator_service | [workflow_definitions](./components/workflow_orchestrator_service/schemas/workflow_definitions.md) | Templates for process flows |
| workflow_orchestrator_service | [workflow_event_subscriptions](./components/workflow_orchestrator_service/schemas/workflow_event_subscriptions.md) | Event subscriptions for workflows |
| workflow_orchestrator_service | [workflow_event_triggers](./components/workflow_orchestrator_service/schemas/workflow_event_triggers.md) | Event-based workflow starters |
| workflow_orchestrator_service | [workflow_instances](./components/workflow_orchestrator_service/schemas/workflow_instances.md) | Running workflow executions |

## Tables by Component

### Workflow Orchestrator Service

The Workflow Orchestrator Service is responsible for managing workflow execution throughout the lifecycle.

| PostgreSQL Schema | Table Name | Purpose |
|-------------------|------------|---------|
| workflow_orchestrator_service | [workflow_definitions](./components/workflow_orchestrator_service/schemas/workflow_definitions.md) | Templates for process flows |
| workflow_orchestrator_service | [workflow_instances](./components/workflow_orchestrator_service/schemas/workflow_instances.md) | Running workflow executions |
| workflow_orchestrator_service | [workflow_event_triggers](./components/workflow_orchestrator_service/schemas/workflow_event_triggers.md) | Event-based workflow starters |
| workflow_orchestrator_service | [workflow_event_subscriptions](./components/workflow_orchestrator_service/schemas/workflow_event_subscriptions.md) | Event subscriptions for workflows |

For detailed schema information, see the [Workflow Orchestrator Schemas](./components/workflow_orchestrator_service/schemas/overview.md).

### Event Processing Service

The Event Processing Service is responsible for handling event ingestion, routing, and triggering.

| PostgreSQL Schema | Table Name | Purpose |
|-------------------|------------|---------|
| event_processing_service | [event_definitions](./components/event_processing_service/schemas/event_definitions.md) | Templates for event types |
| event_processing_service | [event_instances](./components/event_processing_service/schemas/event_instances.md) | Records of actual events |
| event_processing_service | [event_sequences](./components/event_processing_service/schemas/event_sequences.md) | Ordered series of events |
| event_processing_service | [event_queue_state](./components/event_processing_service/schemas/event_queue_state.md) | Queue state management |
| event_processing_service | [dead_letter_queue](./components/event_processing_service/schemas/dead_letter_queue.md) | Failed event storage |

For detailed schema information, see the [Event Processing Schemas](./components/event_processing_service/schemas/overview.md).

### Task Execution Service

The Task Execution Service is responsible for executing individual tasks within workflows.

| PostgreSQL Schema | Table Name | Purpose |
|-------------------|------------|---------|
| task_execution_service | [task_definitions](./components/task_execution_service/schemas/task_definitions.md) | Templates for tasks |
| task_execution_service | [task_instances](./components/task_execution_service/schemas/task_instances.md) | Running task executions |

For detailed schema information, see the [Task Execution Schemas](./components/task_execution_service/schemas/overview.md).

### Integration Service

The Integration Service is responsible for managing connections to external systems.

| PostgreSQL Schema | Table Name | Purpose |
|-------------------|------------|---------|
| integration_service | [integration_definitions](./components/integration_service/schemas/integration_definitions.md) | Templates for integrations |
| integration_service | [integration_instances](./components/integration_service/schemas/integration_instances.md) | Configured integration setups |

For detailed schema information, see the [Integration Service Schemas](./components/integration_service/schemas/overview.md).

### Auth Service

The Auth Service is responsible for user authentication, authorization, and token management.

| PostgreSQL Schema | Table Name | Purpose |
|-------------------|------------|---------|
| auth_service | [users](./components/auth_service/schemas/users.md) | User accounts and profiles |
| auth_service | [roles](./components/auth_service/schemas/roles.md) | Role definitions |
| auth_service | [permissions](./components/auth_service/schemas/permissions.md) | Permission definitions |

For detailed schema information, see the [Auth Service Schemas](./components/auth_service/schemas/overview.md).

### Testing Framework Service

The Testing Framework Service is responsible for validating workflows and tasks.

| PostgreSQL Schema | Table Name | Purpose |
|-------------------|------------|---------|
| testing_framework_service | [test_definitions](./components/testing_framework/schemas/test_definitions.md) | Templates for tests |
| testing_framework_service | [test_runs](./components/testing_framework/schemas/test_runs.md) | Execution records for tests |
| testing_framework_service | [test_case_results](./components/testing_framework/schemas/test_case_results.md) | Results for individual test cases |

For detailed schema information, see the [Testing Framework Schemas](./components/testing_framework/schemas/overview.md).

### Web Application Service

The Web Application Service is responsible for providing user interfaces for system interaction.

| PostgreSQL Schema | Table Name | Purpose |
|-------------------|------------|---------|
| web_application_service | [ui_components](./components/web_application/schemas/ui_components.md) | UI component definitions |

For detailed schema information, see the [Web Application Schemas](./components/web_application/schemas/overview.md).

### Observability Service

The Observability Service is responsible for logging, metrics, and tracing capabilities.

| PostgreSQL Schema | Table Name | Purpose |
|-------------------|------------|---------|
| observability_service | [observability_logs](./components/observability_service/schemas/observability_logs.md) | System logs |
| observability_service | [observability_metrics](./components/observability_service/schemas/observability_metrics.md) | System metrics |
| observability_service | [observability_traces](./components/observability_service/schemas/observability_traces.md) | Distributed traces |

For detailed schema information, see the [Observability Service Schemas](./components/observability_service/schemas/overview.md).

## Schema Design Principles

Each microservice's database schema follows these principles:

1. **Clear Ownership**: Each table is owned by a single microservice
2. **Logical Grouping**: Tables are grouped by functionality in PostgreSQL schemas
3. **Consistent Naming**: Table names follow a consistent pattern (component_entity)
4. **Separation of Concerns**: Data is partitioned based on service boundaries
5. **Optimized Access Patterns**: Schemas are designed for the access patterns of their owning service

## Implementation Considerations

### Single Database with Multiple Schemas

Advantages:
- Easier database administration
- Simpler backup and restore
- Allows cross-schema queries when necessary
- Lower infrastructure costs

Considerations:
- Need to enforce strict schema access controls
- All services affected by database outages
- May encounter resource contention

### Multiple Databases

Advantages:
- True physical separation between microservices
- Independent scaling and resource allocation
- Isolated performance and availability
- Stronger enforcement of service boundaries

Considerations:
- More complex administration
- Higher infrastructure costs
- More complex data synchronization if needed
- No direct cross-database queries

For more information on the overall database architecture, see the [Database Architecture](./database_architecture.md) documentation. 