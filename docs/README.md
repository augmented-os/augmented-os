# Augmented OS Documentation

This directory contains the documentation for the Augmented OS system.

## Structure

* **[Architecture](./architecture/README.md)**: System architecture documentation
  * **[Overview](./architecture/overview.md)**: High-level architecture overview
  * **[Components](./architecture/components/README.md)**: Detailed component documentation
  * **[Schemas](./architecture/schemas/README.md)**: Data schema documentation
* **[Deep Research](./deep-research/README.md)**: Technical research methodology and projects
  * **[Process](./deep-research/process/README.md)**: Our 5-step research methodology
  * **[Projects](./deep-research/projects/README.md)**: Completed and ongoing research projects
* **[Format Guidelines](./format.md)**: Documentation format guidelines
* **[Templates](./.templates/)**: Documentation templates
  * [Component Template](./.templates/component-template.md)
  * [Schema Template](./.templates/schema-template.md)

## Quick Links

### Architecture
* [System Architecture Overview](./architecture/overview.md)
* [Technical Philosophy](./architecture/README.md#technical-philosophy)

### Components
* [System Components](./architecture/components/README.md#components)
* [Event Processing Service](./architecture/components/event_processing_service.md)
* [Integration Service](./architecture/components/integration_service.md)
* [Task Execution Layer](./architecture/components/task_execution_layer.md)
* [UI Rendering Engine](./architecture/components/ui_rendering_engine.md)
* [Validation Service](./architecture/components/validation_service.md)
* [Workflow Orchestrator Service](./architecture/components/workflow_orchestrator_service.md)

### Data Schemas
* [Data Schemas Overview](./architecture/schemas/README.md#schemas)
* [Events](./architecture/schemas/events.md)
* [Integrations](./architecture/schemas/integrations.md)
* [Tasks](./architecture/schemas/tasks.md)
* [Tests](./architecture/schemas/tests.md)
* [UI Components](./architecture/schemas/ui_components.md)
* [Workflows](./architecture/schemas/workflows.md)

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
* Each document includes frontmatter with last updated date

No explicit version numbers are included in the documents themselves, as Git provides this functionality.

## Contributing

When contributing to documentation:

1. Use clear, concise language
2. Include examples where appropriate
3. Follow the established structure in the [Format Guidelines](./format.md)
4. Update the last_updated date in the frontmatter


