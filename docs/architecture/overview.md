# System Architecture

## Executive Summary

The Augmented OS platform employs a definition-driven architecture where system behavior is configured through JSON schemas rather than custom code. Core services including workflow orchestration, task execution, event processing, and integration management work together to provide a flexible, scalable system. This approach enables AI-friendly authoring while maintaining strong data integrity guarantees through comprehensive schema validation.

## High-Level Flow



1. **Design Time (Workflow Definition):** Users create workflow definitions via the UI, assembling sequences of tasks with conditional logic, error handling, and UI configurations.
2. **Triggering Execution:** Workflows start via:
   * **Event triggers** - System matches incoming events to workflow definitions
   * **Scheduled triggers** - System runs workflows based on schedule definitions
   * **Manual triggers** - Users initiate workflows through the UI
3. **Step Execution & Task Management:** The orchestrator processes each step:
   * **Automated tasks** - Dispatched to the task execution layer
   * **Manual tasks** - Create task instances and pause until user input
   * **Delays** - Schedule future execution and pause
4. **Data Passing and Transitions:** After task completion, the orchestrator:
   * Records output data to the workflow instance
   * Evaluates conditions to determine the next step
   * Passes relevant data to subsequent steps
5. **Error Handling & Recovery:** The orchestrator manages failures through:
   * Retry policies with configurable attempts and backoff
   * Exception handlers for specific error conditions
   * Fallback steps when errors are non-recoverable
6. **Completion:** When a workflow reaches a terminal step:
   * The instance is marked as Completed or Cancelled
   * Final output data is saved
   * Post-workflow actions like event emissions are triggered

## System Components vs. Data Schemas

Our architecture consists of two key aspects:

### System Components (Services)

These are the functional parts of the system that perform work:

* **[Workflow Orchestrator Service](./components/workflow_orchestrator_service/overview.md)** - Manages workflow execution, state transitions, and task coordination
* **[Task Execution Layer](./components/task_execution_layer/overview.md)** - Runs the actual work for each step
* **[Event Processing Service](./components/event_processing_service/overview.md)** - Handles event ingestion, routing, and triggering
* **[Integration Service](./components/integration_service/overview.md)** - Manages connections to external systems
* **[Web Application](./components/web_application/overview.md)** - Generates dynamic interfaces based on component definitions
* **[Validation Service](./components/validation_service/overview.md)** - Enforces schema validation across the system
* **[Testing Framework](./components/testing_framework/overview.md)** - Provides testing capabilities for system components
* **[Authentication Service](./components/auth_service/overview.md)** - Provides centralized user authentication, authorization, and token management

### Data Schemas

These define the structure of data stored in our databases:

* **Events** - Event data structures
  * **[Event Definitions](./schemas/event_definitions.md)** - Templates for event types
  * **[Event Instances](./schemas/event_instances.md)** - Actual event occurrences
  * **[Event Queue State](./schemas/event_queue_state.md)** - Status of queued events
  * **[Event Sequences](./schemas/event_sequences.md)** - Ordered series of events
  * **[Dead Letter Queue](./schemas/dead_letter_queue.md)** - Failed event processing records
* **Workflows** - Workflow orchestration structures
  * **[Workflow Definitions](./schemas/workflow_definitions.md)** - Templates for workflows
  * **[Workflow Instances](./schemas/workflow_instances.md)** - Running workflow executions
  * **[Workflow Event Triggers](./schemas/workflow_event_triggers.md)** - Event-based workflow starters
  * **[Workflow Event Subscriptions](./schemas/workflow_event_subscriptions.md)** - Event listeners
* **Tasks** - Task execution structures
  * **[Task Definitions](./schemas/task_definitions.md)** - Templates for tasks
  * **[Task Instances](./schemas/task_instances.md)** - Running task executions
* **Integrations** - External system connections
  * **[Integration Definitions](./schemas/integration_definitions.md)** - Templates for integrations
  * **[Integration Instances](./schemas/integration_instances.md)** - Configured integration setups
* **Users** - Authentication and authorization structures
  * **[Users](./schemas/users.md)** - User accounts and profiles
  * **[Roles](./schemas/roles.md)** - Role definitions for access control
  * **[Permissions](./schemas/permissions.md)** - Permission definitions
* **Tests** - Testing structures
  * **[Test Definitions](./schemas/test_definitions.md)** - Templates for validating tasks and workflows
  * **[Test Runs](./schemas/test_runs.md)** - Execution records for tests
  * **[Test Case Results](./schemas/test_case_results.md)** - Detailed results for individual test cases
* **[UI Components](./schemas/ui_components.md)** - UI component definitions

## Data Stores

### Workflow Store

Stores all orchestration-related data:

* Workflow definitions
* Task definitions
* Workflow instances and their state
* Task instances
* Event definitions and instances

### Business Data Store

Stores domain-specific business data such as:

* Customer records
* Transaction data
* Product information
* Relationship data

### Auth Store

Stores authentication and authorization data:

* User accounts
* Roles and permissions
* Access tokens
* Security audit logs

## Frontend (UI)

A web application providing:

* **Orchestration UI** - Tools for creating and managing workflows
* **Task UI** - Interfaces for performing manual tasks
* **Business Data UI** - Views for interacting with business data
* **Chatbot UI** - Natural language interface to the system
* **Admin UI** - Tools for user and role management

## Security Architecture

The system implements a zero-trust security model:

* **Authentication Service** - Centralized authentication for all system components
* **JWT-based tokens** - Platform-agnostic authentication mechanism
* **Role-based access control** - Fine-grained permission management
* **Service-to-service authentication** - Secure internal communication

## Next Steps

For detailed information about each component:

* See [System Components](./components/) for functional component documentation
* See [Data Schemas](./schemas/) for data structure documentation


