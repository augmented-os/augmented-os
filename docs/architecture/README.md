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
  * [Event Processing Service](./components/event_processing_service/)
  * [Integration Service](./components/integration_service/)
  * [Task Execution Layer](./components/task_execution_layer/)
  * [Testing Framework](./components/testing_framework/)
  * [Validation Service](./components/validation_service/)
  * [Web Application](./components/web_application/)
  * [Workflow Orchestrator Service](./components/workflow_orchestrator_service/)
* [Schemas](./schemas/) - Data structure definitions
  * [Events](./schemas/#events)
    * [Event Definitions](./schemas/event_definitions.md)
    * [Event Instances](./schemas/event_instances.md)
    * [Event Queue State](./schemas/event_queue_state.md)
    * [Event Sequences](./schemas/event_sequences.md)
    * [Dead Letter Queue](./schemas/dead_letter_queue.md)
  * [Workflows](./schemas/#workflows)
    * [Workflow Definitions](./schemas/workflow_definitions.md)
    * [Workflow Instances](./schemas/workflow_instances.md)
    * [Workflow Event Triggers](./schemas/workflow_event_triggers.md)
    * [Workflow Event Subscriptions](./schemas/workflow_event_subscriptions.md)
  * [Tasks](./schemas/#tasks)
    * [Task Definitions](./schemas/task_definitions.md)
    * [Task Instances](./schemas/task_instances.md)
  * [Integrations](./schemas/#integrations)
    * [Integration Definitions](./schemas/integration_definitions.md)
    * [Integration Instances](./schemas/integration_instances.md)
  * [Testing](./schemas/#tests)
    * [Test Definitions](./schemas/test_definitions.md)
    * [Test Runs](./schemas/test_runs.md)
    * [Test Case Results](./schemas/test_case_results.md)
  * [UI Components](./schemas/ui_components.md)

## Purpose

The architecture documentation provides a comprehensive understanding of the system's design, components, and how they interact. It serves as a reference for developers, architects, and other stakeholders involved in building, maintaining, or using the system.

## Organization

Our architecture documentation is organized into three main categories:


1. **System Components** - The functional services and engines that perform work in the system
2. **Data Schemas** - The structure definitions for data stored in our databases
3. **Database Architecture** - The design and implementation of our database system

This organization helps clarify the distinction between the operational aspects of the system (components), the data structures they operate on (schemas), and how that data is stored and managed (database architecture).