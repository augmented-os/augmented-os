# Architecture Documentation

## Technical Philosophy

The Augmented OS platform is built on a foundational philosophy of **definition-driven architecture**. By creating JSON definition schemas for every configurable component of the system, we achieve several key advantages:


1. **AI-Friendly Authoring** - AI systems only need to write JSON definitions rather than code, which is significantly easier given appropriate examples and schemas
2. **Schema Validation** - All definitions are easily verifiable with JSON Schema and enforced in PostgreSQL
3. **Separation of Concerns** - Core system components remain stable while behavior is defined through configurations
4. **Reduced Custom Code** - Custom code is only needed in specific areas:
   * Custom task implementations
   * Custom UI component implementations
   * Custom integration adapters

This approach creates a system that is both powerful and flexible, while maintaining strong guarantees about data integrity and system behavior.

## Contents

* [Overview](./overview.md) - High-level architecture overview
* [Database Architecture](./database_architecture.md) - Database design and implementation
* [Components](./components/) - Functional system components
  * [Auth Service](./components/auth_service/) - Authentication and authorization service
  * [Event Processing Service](./components/event_processing_service/)
  * [Integration Service](./components/integration_service/)
  * [Observability Service](./components/observability_service/) - Monitoring, logging, and tracing service
  * [Task Execution Service](./components/task_execution_service/)
  * [Testing Framework Service](./components/testing_framework_service/)
  * [Validation Service](./components/validation_service/)
  * [Web Application Service](./components/web_application_service/)
  * [Workflow Orchestrator Service](./components/workflow_orchestrator_service/)
* [Schemas](./schemas/) - Data structure definitions
  * [Events](./schemas/#events)
    * [Event Definitions](./components/event_definitions_service/schemas/event_definitions.md)
    * [Event Instances](./components/event_instances_service/schemas/event_instances.md)
    * [Event Queue State](./components/event_queue_state_service/schemas/event_queue_state.md)
    * [Event Sequences](./components/event_sequences_service/schemas/event_sequences.md)
    * [Dead Letter Queue](./components/dead_letter_queue_service/schemas/dead_letter_queue.md)
  * [Workflows](./schemas/#workflows)
    * [Workflow Definitions](./components/workflow_definitions_service/schemas/workflow_definitions.md)
    * [Workflow Instances](./components/workflow_instances_service/schemas/workflow_instances.md)
    * [Workflow Event Triggers](./components/workflow_event_triggers_service/schemas/workflow_event_triggers.md)
    * [Workflow Event Subscriptions](./components/workflow_event_subscriptions_service/schemas/workflow_event_subscriptions.md)
  * [Tasks](./schemas/#tasks)
    * [Task Definitions](./components/task_definitions_service/schemas/task_definitions.md)
    * [Task Instances](./components/task_instances_service/schemas/task_instances.md)
  * [Integrations](./schemas/#integrations)
    * [Integration Definitions](./components/integration_definitions_service/schemas/integration_definitions.md)
    * [Integration Instances](./components/integration_instances_service/schemas/integration_instances.md)
  * [Auth](./schemas/#auth)
    * [Users](./components/users_service/schemas/users.md)
    * [Roles](./components/roles_service/schemas/roles.md)
    * [Permissions](./components/permissions_service/schemas/permissions.md)
  * [Testing](./schemas/#tests)
    * [Test Definitions](./components/test_definitions_service/schemas/test_definitions.md)
    * [Test Runs](./components/test_runs_service/schemas/test_runs.md)
    * [Test Case Results](./components/test_case_results_service/schemas/test_case_results.md)
  * [UI Components](./components/ui_components_service/schemas/ui_components.md)
  * [Observability](./schemas/observability/)
    * [Observability Schema Definitions](./components/observability/schema_definitions_service/schemas/observability/schema_definitions.md)

## Purpose

The architecture documentation provides a comprehensive understanding of the system's design, components, and how they interact. It serves as a reference for developers, architects, and other stakeholders involved in building, maintaining, or using the system.

## Organization

Our architecture documentation is organized into three main categories:


1. **System Components** - The functional services and engines that perform work in the system
2. **Data Schemas** - The structure definitions for data stored in our databases
3. **Database Architecture** - The design and implementation of our database system

This organization helps clarify the distinction between the operational aspects of the system (components), the data structures they operate on (schemas), and how that data is stored and managed (database architecture).