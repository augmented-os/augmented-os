# Task Execution Layer

## Overview

The Task Execution Layer is responsible for executing individual tasks within workflows. It provides a unified interface for running different types of tasks (automated, manual, integration) while abstracting away the implementation details from the workflow orchestrator.

## Responsibilities

* Executing tasks based on their type and implementation
* Managing task state and persistence
* Handling task timeouts and retries
* Providing task assignment for manual tasks
* Validating task inputs and outputs against schemas
* Reporting task execution results back to the workflow orchestrator

## Architecture

The Task Execution Layer is designed as a modular system with specialized handlers for different task types. It uses a plugin architecture to support extensibility and custom task implementations.

```
┌─────────────────────────┐
│                         │
│  Workflow Orchestrator  │
│                         │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│                         │
│  Task Execution Layer   │
│                         │
└───┬───────────┬─────────┘
    │           │
    ▼           ▼
┌─────────┐ ┌─────────┐
│ Manual  │ │ Auto    │
│ Tasks   │ │ Tasks   │
└─────────┘ └─────────┘
```

## Key Components

### Task Router

Responsible for:

* Receiving task execution requests
* Determining the appropriate handler based on task type
* Load balancing across task executors
* Monitoring task execution status

### Automated Task Executor

Handles tasks that can be executed without human intervention:

* Code execution in sandboxed environments. #TODO - Expand - what does this mean?  We can focus on local script execution but will need to add external deployment e.g. lamda in future, so should be part of the architecture
* Script execution with defined inputs and outputs
* System function calls with appropriate permissions
* Integration with external services

### Manual Task Handler

Manages tasks requiring human input:  #TODO - What does this actually need to do when the ui is displayed from front end?  Are we creating some new kind of data for the task? I thought we’d simply view the workflow and it would display the current manual task based on the workflow step?

* Task assignment to users or groups
* UI generation based on task definition
* Form validation against input schemas
* Deadline and reminder management

### Integration Task Executor

Specializes in tasks that connect to external systems:

* Authentication with external services
* Data transformation between systems
* Error handling for external service failures
* Retry logic for transient failures

### Task Validator

Ensures data integrity by:

* Validating inputs against task input schema
* Validating outputs against task output schema
* Providing detailed validation errors
* Enforcing type safety and data constraints

## Interfaces

### Input Interfaces

* **Task Queue**: Receives task execution requests from the Workflow Orchestrator  #TODO - shouldn’t this be done at workflow level?
* **API Endpoints**: Exposes REST endpoints for task management and manual task interaction
* **Integration Service**: Receives integration configuration and credentials #TODO - Aren’t integration ‘tasks’ being executed by the integrations service?

### Output Interfaces

* **Workflow Orchestrator**: Reports task completion or failure
* **Event Emitter**: Publishes task lifecycle events
* **Database**: Persists task state and execution history #TODO - shouldn’t this be done by the workflow orchestrator?

## Data Model

The Task Execution Layer primarily interacts with these data schemas:

* [Tasks Schema](../schemas/tasks.md): For task definitions and instances #TODO - There seems to be crossover between the workflow_instances schema and the task_instances schema.  How will these two interact without duplication?
* [Integrations Schema](../schemas/integrations.md): For integration configurations
* [UI Components Schema](../schemas/ui_components.md): For rendering manual task interfaces

## Operational Considerations

### Scalability

The service scales horizontally by:

* Distributing task execution across multiple nodes
* Using worker pools for parallel task execution
* Implementing backpressure mechanisms for high load
* Prioritizing tasks based on workflow importance

### Monitoring

Key metrics to monitor:

* Task execution time by type and implementation
* Error rates by task type
* Queue depths for pending tasks
* Resource utilization (CPU, memory) during execution
* Manual task completion times

### Resilience

Failure handling strategies:

* Automatic retry of failed tasks based on policy
* Circuit breakers for external service calls
* Dead-letter queues for unprocessable tasks
* Graceful degradation under load

## Configuration

The service can be configured with:  #TODO - How much of this should actually be set at task level?

* Maximum concurrent tasks by type
* Default retry policies
* Timeout settings
* Resource limits for task execution
* Logging levels and destinations

## Security

Security considerations:

* Sandboxed execution environments for code-based tasks
* Least privilege principle for system function access
* Credential isolation for integration tasks
* Input validation to prevent injection attacks
* Authorization for task operations

## Implementation Examples

### Executing an Automated Task

```typescript
// Example of how the service executes an automated task
async function executeAutomatedTask(taskInstance: TaskInstance): Promise<TaskResult> {
  try {
    // Load task definition
    const taskDef = await taskRepository.getDefinition(taskInstance.taskDefinitionId);
    
    // Validate input against schema
    const validationResult = await taskValidator.validateInput(
      taskDef.inputSchema, 
      taskInstance.input
    );
    
    if (!validationResult.valid) {
      return {
        status: 'FAILED',
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Input validation failed',
          details: validationResult.errors
        }
      };
    }
    
    // Execute task based on implementation type
    let result;
    switch (taskDef.type) {
      case 'javascript':
        result = await javascriptExecutor.execute(
          taskDef.implementation, 
          taskInstance.input
        );
        break;
      case 'system':
        result = await systemFunctionExecutor.execute(
          taskDef.implementation, 
          taskInstance.input
        );
        break;
      default:
        throw new Error(`Unsupported task type: ${taskDef.type}`);
    }
    
    // Validate output against schema
    const outputValidation = await taskValidator.validateOutput(
      taskDef.outputSchema, 
      result
    );
    
    if (!outputValidation.valid) {
      return {
        status: 'FAILED',
        error: {
          code: 'OUTPUT_VALIDATION_ERROR',
          message: 'Output validation failed',
          details: outputValidation.errors
        }
      };
    }
    
    return {
      status: 'COMPLETED',
      output: result
    };
  } catch (error) {
    return {
      status: 'FAILED',
      error: {
        code: 'EXECUTION_ERROR',
        message: error.message,
        stack: error.stack
      }
    };
  }
}
```

### Handling a Manual Task

```typescript
// Example of how the service handles a manual task
async function assignManualTask(taskInstance: TaskInstance): Promise<void> {
  // Load task definition
  const taskDef = await taskRepository.getDefinition(taskInstance.taskDefinitionId);
  
  // Determine assignee based on task definition and workflow context
  const assignee = await assignmentService.determineAssignee(
    taskDef, 
    taskInstance.workflowInstanceId
  );
  
  // Update task instance with assignment
  taskInstance.assigneeType = assignee.type; // 'USER' or 'GROUP'
  taskInstance.assigneeId = assignee.id;
  taskInstance.status = 'ASSIGNED';
  taskInstance.dueAt = calculateDueDate(taskDef);
  
  // Persist updated task instance
  await taskRepository.saveInstance(taskInstance);
  
  // Generate UI configuration for the task
  const uiConfig = await uiConfigGenerator.generateForTask(
    taskDef.uiComponents,
    taskInstance.input
  );
  
  // Notify assignee
  await notificationService.notifyAssignee(
    assignee,
    taskInstance,
    uiConfig
  );
  
  // Emit task assigned event
  await eventEmitter.emit({
    pattern: 'task.assigned',
    payload: {
      taskInstanceId: taskInstance.id,
      assigneeType: assignee.type,
      assigneeId: assignee.id
    }
  });
}
```


