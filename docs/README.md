# Augmented OS Documentation

This directory contains the documentation for the Augmented OS system.

## Structure

* **[Architecture](./architecture/README.md)**: System architecture documentation
  * **[Overview](./architecture/overview.md)**: High-level architecture overview
  * **[Components](./architecture/components/README.md)**: Detailed component documentation
  * **[Schemas](./architecture/schemas/README.md)**: Data schema documentation
  * **[Database Architecture](./architecture/database_architecture.md)**: Database design and implementation
* **[Deep Research](./deep-research/README.md)**: Technical research methodology and projects
  * **[Process](./deep-research/process/README.md)**: Our 5-step research methodology
  * **[Projects](./deep-research/projects/README.md)**: Completed and ongoing research projects
* **[Task System](./task-system/README.md)**: Task management system documentation
  * **[Task Format](./task-system/task-format.md)**: Detailed task format documentation
  * **[Creating Tasks](./task-system/creating-tasks.md)**: Guidelines for creating tasks
  * **[Executing Tasks](./task-system/executing-tasks.md)**: Instructions for executing tasks
* **[Format Guidelines](./format.md)**: Documentation format guidelines
* **[Templates](./.templates/)**: Documentation templates
  * [Component Template](./.templates/component-template.md)
  * [Schema Template](./.templates/schema-template.md)

## Quick Links

### Architecture

* [System Architecture Overview](./architecture/overview.md)
* [Technical Philosophy](./architecture/README.md#technical-philosophy)
* [Database Architecture](./architecture/database_architecture.md)

### Components

* [Event Processing Service](./architecture/components/event_processing_service/)
* [Integration Service](./architecture/components/integration_service/)
* [Task Execution Layer](./architecture/components/task_execution_layer/)
* [Web Application](./architecture/components/web_application/)
* [Validation Service](./architecture/components/validation_service/)
* [Workflow Orchestrator Service](./architecture/components/workflow_orchestrator_service/)
* [Testing Framework](./architecture/components/testing_framework/)

### Data Schemas

* [Data Schemas Overview](./architecture/schemas/README.md#schemas)

#### Events

* [Event Definitions](./architecture/schemas/event_definitions.md)
* [Event Instances](./architecture/schemas/event_instances.md)
* [Event Queue State](./architecture/schemas/event_queue_state.md)
* [Event Sequences](./architecture/schemas/event_sequences.md)
* [Dead Letter Queue](./architecture/schemas/dead_letter_queue.md)

#### Integrations

* [Integration Definitions](./architecture/schemas/integration_definitions.md)
* [Integration Instances](./architecture/schemas/integration_instances.md)

#### Tasks

* [Task Definitions](./architecture/schemas/task_definitions.md)
* [Task Instances](./architecture/schemas/task_instances.md)

#### UI Components

* [UI Components](./architecture/schemas/ui_components.md)

#### Workflows

* [Workflow Definitions](./architecture/schemas/workflow_definitions.md)
* [Workflow Instances](./architecture/schemas/workflow_instances.md)
* [Workflow Event Triggers](./architecture/schemas/workflow_event_triggers.md)
* [Workflow Event Subscriptions](./architecture/schemas/workflow_event_subscriptions.md)

#### Tests

* [Test Definitions](./architecture/schemas/test_definitions.md)
* [Test Runs](./architecture/schemas/test_runs.md)
* [Test Case Results](./architecture/schemas/test_case_results.md)

### Task System

* [Task System Overview](./task-system/README.md)
* [Task Format](./task-system/task-format.md)
* [Creating Tasks](./task-system/creating-tasks.md)
* [Executing Tasks](./task-system/executing-tasks.md)

### Deep Research

* [Research Methodology](./deep-research/process/README.md)
* [Research Projects](./deep-research/projects/README.md)
* [Orchestration Research](./deep-research/projects/orchestration/README.md)
* [Research Process Steps](./deep-research/process/README.md#the-5-step-process)

## Documentation Standards

All documentation in this repository follows a consistent format defined in the [Format Guidelines](./format.md). These guidelines ensure:

* Consistent structure across all documents
* Clear and concise content
* AI-friendly documentation patterns
* Proper use of markdown features

When creating or updating documentation, please refer to the templates in the `.templates` directory:

* [Component Template](./.templates/component-template.md) - For service and component documentation
* [Schema Template](./.templates/schema-template.md) - For data schema documentation

## Version Management

Documentation is versioned using Git's native version control capabilities:

* Git commits track all changes
* Git tags mark significant documentation versions
* GitHub releases provide downloadable snapshots of documentation

No explicit version numbers are included in the documents themselves, as Git provides this functionality.

## Contributing

When contributing to documentation:


1. Use clear, concise language
2. Include examples where appropriate
3. Follow the established structure in the [Format Guidelines](./format.md)


