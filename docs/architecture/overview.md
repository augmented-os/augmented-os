# System Architecture

## High-Level Flow

 ![System Architecture Flow](../assets/system-flow-diagram.png)


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

* **Workflow Orchestrator Service** - Manages workflow execution, state transitions, and task coordination
* **Task Execution Layer** - Runs the actual work for each step
* **Event Processing Service** - Handles event ingestion, routing, and triggering
* **Integration Service** - Manages connections to external systems
* **UI Rendering Engine** - Generates dynamic interfaces based on component definitions
* **Validation Service** - Enforces schema validation across the system

### Data Schemas

These define the structure of data stored in our databases:

* **[Events](./schemas/events.md)** - Event definitions and instances
* **[Tasks](./schemas/tasks.md)** - Task definitions and instances
* **[Workflows](./schemas/workflows.md)** - Workflow definitions and instances
* **[Integrations](./schemas/integrations.md)** - Integration definitions and instances
* **[UI Components](./schemas/ui_components.md)** - UI component definitions
* **[Tests](./schemas/tests.md)** - Test definitions and results

## System Architecture Diagram

 ![System Architecture Diagram](../assets/system-architecture-diagram.png)

## Core System Components

### Workflow Orchestrator Service

The central engine responsible for:

* Reading workflow definitions
* Creating and managing workflow instances
* Coordinating task execution
* Handling state transitions and error recovery
* Ensuring workflow durability and consistency

The orchestrator is stateless, relying on the database to store all workflow state for resilience.

### Task Execution Layer

The compute layer that:

* Executes individual tasks based on their implementation type
* Handles different execution environments (Lambda, HTTP, script, etc.)
* Manages timeouts and resource allocation
* Returns standardized results to the orchestrator

### Event Processing Service

Manages the event lifecycle:

* Receives events from internal and external sources
* Validates event structure and content
* Routes events to appropriate workflows
* Stores events for audit and replay
* Emits events when workflows and tasks complete

### Integration Service

Provides standardized access to external systems:

* Manages authentication and credentials
* Handles connection lifecycle and health checks
* Provides a unified interface for different integration types
* Supports multiple instances of the same integration

### UI Rendering Engine

Generates dynamic user interfaces:

* Renders UI components based on definitions
* Handles conditional display logic
* Manages form validation and submission
* Provides consistent styling and behavior

### Validation Service

Ensures data integrity across the system:

* Validates JSON against schemas
* Enforces business rules and constraints
* Provides clear error messages for validation failures
* Supports custom validation logic

## Data Stores

### Workflow Store

Stores all orchestration-related data:

* Workflow definitions
* Task definitions
* Workflow instances and their state
* Task instances
* Event definitions and instances

### Business Data Store

Stores domain-specific business data:

* Customer records
* Transaction data
* Product information
* Relationship data

## Frontend (UI)

A web application providing:

* **Orchestration UI** - Tools for creating and managing workflows
* **Task UI** - Interfaces for performing manual tasks
* **Business Data UI** - Views for interacting with business data
* **Chatbot UI** - Natural language interface to the system

## Next Steps

For detailed information about each component:

* See [System Components](./components/) for functional component documentation
* See [Data Schemas](./schemas/) for data structure documentation


