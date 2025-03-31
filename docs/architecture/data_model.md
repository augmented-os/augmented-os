# System Data Model

## Overview

This document provides a comprehensive index of all database tables in the system, organized by the component that owns them. The system can be implemented either as:


1. A single PostgreSQL database with separate schemas for each microservice (recommended for development and smaller deployments)
2. Separate databases for each microservice (recommended for large-scale production deployments)

## All System Tables

| Component Owner / Schema | Table Name | Purpose |
|----|----|----|
| [auth_service](./components/auth_service/data_model.md) | [permissions](./components/auth_service/schemas/permissions.md) | Permission definitions |
| [auth_service](./components/auth_service/data_model.md) | [roles](./components/auth_service/schemas/roles.md) | Role definitions |
| [auth_service](./components/auth_service/data_model.md) | [users](./components/auth_service/schemas/users.md) | User accounts and profiles |
| [business_store_service](./components/business_store_service/data_model.md) | [tenant_schemas](./components/business_store_service/schemas/tenant_schemas.md) | JSON Schema definitions for tenants |
| [business_store_service](./components/business_store_service/data_model.md) | [schema_migrations](./components/business_store_service/schemas/schema_migrations.md) | Schema migration history |
| [event_processing_service](./components/event_processing_service/data_model.md) | [dead_letter_queue](./components/event_processing_service/schemas/dead_letter_queue.md) | Failed event storage |
| [event_processing_service](./components/event_processing_service/data_model.md) | [event_definitions](./components/event_processing_service/schemas/event_definitions.md) | Templates for event types |
| [event_processing_service](./components/event_processing_service/data_model.md) | [event_instances](./components/event_processing_service/schemas/event_instances.md) | Records of actual events |
| [event_processing_service](./components/event_processing_service/data_model.md) | [event_queue_state](./components/event_processing_service/schemas/event_queue_state.md) | Queue state management |
| [event_processing_service](./components/event_processing_service/data_model.md) | [event_sequences](./components/event_processing_service/schemas/event_sequences.md) | Ordered series of events |
| [integration_service](./components/integration_service/data_model.md) | [integration_definitions](./components/integration_service/schemas/integration_definitions.md) | Templates for integrations |
| [integration_service](./components/integration_service/data_model.md) | [integration_instances](./components/integration_service/schemas/integration_instances.md) | Configured integration setups |
| [observability_service](./components/observability_service/data_model.md) | [observability_logs](./components/observability_service/schemas/observability_logs.md) | System logs |
| [observability_service](./components/observability_service/data_model.md) | [observability_metrics](./components/observability_service/schemas/observability_metrics.md) | System metrics |
| [observability_service](./components/observability_service/data_model.md) | [observability_traces](./components/observability_service/schemas/observability_traces.md) | Distributed traces |
| [task_execution_service](./components/task_execution_service/data_model.md) | [task_definitions](./components/task_execution_service/schemas/task_definitions.md) | Templates for tasks |
| [task_execution_service](./components/task_execution_service/data_model.md) | [task_instances](./components/task_execution_service/schemas/task_instances.md) | Running task executions |
| [testing_framework_service](./components/testing_framework_service/data_model.md) | [test_case_results](./components/testing_framework_service/schemas/test_case_results.md) | Results for individual test cases |
| [testing_framework_service](./components/testing_framework_service/data_model.md) | [test_definitions](./components/testing_framework_service/schemas/test_definitions.md) | Templates for tests |
| [testing_framework_service](./components/testing_framework_service/data_model.md) | [test_runs](./components/testing_framework_service/schemas/test_runs.md) | Execution records for tests |
| [web_application_service](./components/web_application_service/data_model.md) | [ui_components](./components/web_application_service/schemas/ui_components.md) | UI component definitions |
| [workflow_orchestrator_service](./components/workflow_orchestrator_service/data_model.md) | [workflow_definitions](./components/workflow_orchestrator_service/schemas/workflow_definitions.md) | Templates for process flows |
| [workflow_orchestrator_service](./components/workflow_orchestrator_service/data_model.md) | [workflow_event_subscriptions](./components/workflow_orchestrator_service/schemas/workflow_event_subscriptions.md) | Event subscriptions for workflows |
| [workflow_orchestrator_service](./components/workflow_orchestrator_service/data_model.md) | [workflow_event_triggers](./components/workflow_orchestrator_service/schemas/workflow_event_triggers.md) | Event-based workflow starters |
| [workflow_orchestrator_service](./components/workflow_orchestrator_service/data_model.md) | [workflow_instances](./components/workflow_orchestrator_service/schemas/workflow_instances.md) | Running workflow executions |

### Business Store Service Tenant Schemas

In addition to the main `business_store_service` schema, the Business Store Service creates dynamic tenant-specific schemas for each customer:

* **Tenant Schemas**: Named as `tenant_<tenantId>` (e.g., `tenant_abc_123`) 
* Each tenant schema contains tables defined by that tenant's JSON Schema (e.g., `customers`, `invoices`)
* Tables in tenant schemas are not listed in this central index as they are dynamically created and vary by tenant
* All tenant-specific tables include a `tenant_id` column for Row-Level Security and cross-schema operations
* For more details on tenant schemas, refer to the [Business Store Service Data Model](./components/business_store_service/data_model.md)

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

* Easier database administration
* Simpler backup and restore
* Allows cross-schema queries when necessary
* Lower infrastructure costs

Considerations:

* Need to enforce strict schema access controls
* All services affected by database outages
* May encounter resource contention

### Multiple Databases

Advantages:

* True physical separation between microservices
* Independent scaling and resource allocation
* Isolated performance and availability
* Stronger enforcement of service boundaries

Considerations:

* More complex administration
* Higher infrastructure costs
* More complex data synchronization if needed
* No direct cross-database queries

For more information on the overall database architecture, see the [Database Architecture](./database_architecture.md) documentation.