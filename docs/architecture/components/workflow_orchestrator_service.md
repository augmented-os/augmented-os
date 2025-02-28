# Workflow Orchestrator Service

## Overview

The Workflow Orchestrator Service is the central engine responsible for executing workflows. It acts as a state machine engine that reads workflow definitions, triggers step execution, handles step results, and moves workflows forward through their lifecycle.

## Responsibilities

* Reading workflow definitions from the database
* Creating and managing workflow instances
* Coordinating task execution across the system
* Handling state transitions between workflow steps
* Managing error recovery and retry logic
* Ensuring workflow durability and consistency

## Architecture

The Workflow Orchestrator is designed as a stateless service that relies on the database to store all workflow state. This design ensures that the service can fail and recover without losing progress, and multiple instances can operate simultaneously for high availability.

```
┌─────────────────────────┐
│                         │
│  Workflow Orchestrator  │
│                         │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐     ┌─────────────────────────┐
│                         │     │                         │
│    Workflow Database    │◄────┤    Task Execution       │
│                         │     │                         │
└─────────────────────────┘     └─────────────────────────┘
```

## Key Components

### Workflow Engine

The core state machine that:

* Interprets workflow definitions
* Determines the next steps to execute
* Evaluates transition conditions
* Manages parallel execution branches

### Event-Based Workflow Resumption

Enables workflows to pause and wait for external events before continuing:

* Allows workflows to suspend execution until specific events occur
* Supports complex event-driven processes that may span long durations
* Integrates with the Event Processing Service for event subscription
* Provides timeouts and fallback paths for event waiting

```typescript
/**
 * Event wait definition in a workflow step
 */
interface EventWaitStep {
  stepId: string;
  type: 'EVENT_WAIT';
  eventPattern: string;          // Event pattern to wait for
  eventCondition?: string;       // Optional condition on event payload
  eventTimeout?: {
    duration: string;            // ISO duration format
    timeoutHandlerStepId: string; // Step to execute on timeout
  };
  eventPayloadMapping?: Record<string, string>; // Map event payload to workflow variables
}

/**
 * Implementation for pausing a workflow to wait for an event
 */
async function pauseWorkflowForEvent(
  instanceId: string,
  waitStep: EventWaitStep
): Promise<void> {
  // Load current workflow instance
  const instance = await workflowRepository.getInstance(instanceId);
  
  // Update workflow state to indicate it's waiting for an event
  instance.status = 'WAITING_FOR_EVENT';
  instance.state.currentWaitStep = waitStep.stepId;
  instance.state.waitingForEvent = {
    eventPattern: waitStep.eventPattern,
    eventCondition: waitStep.eventCondition,
    since: new Date().toISOString()
  };
  
  // Persist updated state
  await workflowRepository.saveInstance(instance);
  
  // Create event subscription
  const subscription = await eventProcessingService.subscribeToEvents({
    patterns: [waitStep.eventPattern],
    subscriberId: `workflow_${instanceId}`,
    filter: waitStep.eventCondition,
    handler: async (event) => {
      await resumeWorkflowFromEvent(instanceId, event);
    }
  });
  
  // Store subscription ID for cleanup
  await workflowRepository.storeEventSubscription(instanceId, subscription.id);
  
  // Set timeout if specified
  if (waitStep.eventTimeout) {
    const timeoutMs = parseDuration(waitStep.eventTimeout.duration);
    await schedulerService.scheduleWorkflowTimeout(
      instanceId,
      timeoutMs,
      waitStep.eventTimeout.timeoutHandlerStepId
    );
  }
}

/**
 * Implementation for resuming a workflow when an event is received
 */
async function resumeWorkflowFromEvent(
  instanceId: string,
  event: Event
): Promise<void> {
  // Load workflow instance
  const instance = await workflowRepository.getInstance(instanceId);
  
  // Verify workflow is actually waiting for this event
  if (instance.status !== 'WAITING_FOR_EVENT' || 
      instance.state.waitingForEvent.eventPattern !== event.pattern) {
    throw new Error(`Workflow ${instanceId} is not waiting for this event`);
  }
  
  // Get the wait step from workflow definition
  const workflowDefinition = await workflowRepository.getDefinition(instance.workflowDefinitionId);
  const waitStep = workflowDefinition.steps.find(s => s.stepId === instance.state.currentWaitStep);
  
  // Apply event payload mapping to workflow state if configured
  if (waitStep.eventPayloadMapping) {
    for (const [workflowVar, eventPath] of Object.entries(waitStep.eventPayloadMapping)) {
      const eventValue = getValueByPath(event.payload, eventPath);
      instance.state.variables = instance.state.variables || {};
      instance.state.variables[workflowVar] = eventValue;
    }
  }
  
  // Clear waiting status
  instance.status = 'RUNNING';
  delete instance.state.waitingForEvent;
  
  // Save updated instance state
  await workflowRepository.saveInstance(instance);
  
  // Clean up event subscription
  const subscriptionId = await workflowRepository.getEventSubscription(instanceId);
  await eventProcessingService.unsubscribe(subscriptionId);
  
  // Cancel timeout if it exists
  await schedulerService.cancelScheduledTimeout(instanceId);
  
  // Determine next step and continue workflow
  const nextStepId = waitStep.transitions.default;
  await executeWorkflowStep(instanceId, nextStepId);
}
```

#### Usage in Workflow Definitions

Workflow definitions can include event wait steps that pause execution until a specific event occurs:

```json
{
  "steps": [
    {
      "stepId": "process_order",
      "type": "TASK",
      "taskId": "order_processing_task",
      "transitions": {
        "default": "wait_for_payment"
      }
    },
    {
      "stepId": "wait_for_payment",
      "type": "EVENT_WAIT",
      "eventPattern": "payment.received",
      "eventCondition": "event.payload.orderId === workflow.input.orderId",
      "eventTimeout": {
        "duration": "P3D",
        "timeoutHandlerStepId": "handle_payment_timeout"
      },
      "eventPayloadMapping": {
        "paymentId": "id",
        "paymentAmount": "amount"
      },
      "transitions": {
        "default": "complete_order"
      }
    },
    {
      "stepId": "complete_order",
      "type": "TASK",
      "taskId": "complete_order_task"
    },
    {
      "stepId": "handle_payment_timeout",
      "type": "TASK",
      "taskId": "payment_reminder_task"
    }
  ]
}
```

### Workflow Cancellation

Provides capabilities for explicitly canceling workflows at any point in their execution:

* Enables external events to trigger workflow cancellation
* Supports manual cancellation through API endpoints
* Allows conditional cancellation based on business rules
* Maintains audit trail of cancellation reasons and triggers
* Integrates with compensation mechanisms for cleanup
* Workflows can be configured to be canceled automatically when specific events occur:

```typescript
/**
 * Event-based cancellation configuration in workflow definition
 */
interface EventBasedCancellation {
  eventPattern: string;
  eventCondition?: string;
  reason: string;
  shouldCompensate: boolean;
}

/**
 * Implementation for registering event-based cancellation triggers
 */
async function registerEventBasedCancellation(
  instanceId: string,
  cancellationConfig: EventBasedCancellation[]
): Promise<void> {
  for (const config of cancellationConfig) {
    // Create event subscription for cancellation
    const subscription = await eventProcessingService.subscribeToEvents({
      patterns: [config.eventPattern],
      subscriberId: `workflow_cancel_${instanceId}`,
      filter: config.eventCondition,
      handler: async (event) => {
        // Create cancellation request from event
        const cancellationRequest: WorkflowCancellationRequest = {
          instanceId,
          reason: config.reason,
          requestedBy: 'system',
          requestedAt: new Date().toISOString(),
          source: 'EVENT',
          eventId: event.id,
          shouldCompensate: config.shouldCompensate
        };
        
        // Cancel the workflow
        await cancelWorkflow(cancellationRequest);
      }
    });
    
    // Store subscription ID for cleanup
    await workflowRepository.storeCancellationSubscription(instanceId, subscription.id);
  }
}
```

#### Usage in Workflow Definitions

Workflow definitions can include cancellation triggers that specify when a workflow should be automatically canceled:

```json
{
  "id": "order_processing",
  "name": "Order Processing Workflow",
  "cancellationTriggers": [
    {
      "eventPattern": "order.cancelled",
      "eventCondition": "event.payload.orderId === workflow.input.orderId",
      "reason": "Order was cancelled by customer",
      "shouldCompensate": true
    },
    {
      "eventPattern": "payment.failed",
      "eventCondition": "event.payload.orderId === workflow.input.orderId && event.payload.attempts > 3",
      "reason": "Payment failed after multiple attempts",
      "shouldCompensate": true
    }
  ],
  "steps": [
    // ... workflow steps ...
  ]
}
```

### Compensation Mechanisms

Provides systematic cleanup and recovery for workflows that are canceled or fail mid-execution:

* Enables definition of compensating actions for workflow steps
* Ensures consistent cleanup of resources and state when workflows are interrupted
* Supports transaction-like semantics with rollback capabilities
* Maintains a clear audit trail of compensation actions
* Allows for custom compensation logic based on workflow state

```typescript
/**
 * Compensation step definition in a workflow
 */
interface CompensationStep {
  stepId: string;
  compensationFor: string;  // ID of the step this compensates for
  type: 'TASK';
  taskId: string;
  input?: Record<string, any> | string;  // Static input or expression
  condition?: string;  // Optional condition to determine if compensation should run
}

/**
 * Implementation for executing compensation steps
 */
async function runCompensationSteps(
  instanceId: string
): Promise<void> {
  // Load workflow instance
  const instance = await workflowRepository.getInstance(instanceId);
  
  // Load workflow definition
  const definition = await workflowRepository.getDefinition(instance.workflowDefinitionId);
  
  // Get all compensation steps from definition
  const compensationSteps = definition.compensationSteps || [];
  
  // Get completed steps from workflow instance
  const completedStepIds = Object.keys(instance.state.steps || {})
    .filter(stepId => instance.state.steps[stepId].status === 'COMPLETED');
  
  // Create compensation execution plan (reverse order of completion)
  const compensationPlan = [];
  
  // Find compensation steps for completed workflow steps (in reverse order)
  for (const stepId of completedStepIds.reverse()) {
    const compensationStep = compensationSteps.find(cs => cs.compensationFor === stepId);
    if (compensationStep) {
      // Check if compensation condition is met
      const shouldCompensate = await evaluateCompensationCondition(
        compensationStep.condition,
        instance
      );
      
      if (shouldCompensate) {
        compensationPlan.push(compensationStep);
      }
    }
  }
  
  // Update workflow state to indicate compensation is in progress
  instance.compensationState = {
    status: 'IN_PROGRESS',
    startedAt: new Date().toISOString(),
    plan: compensationPlan.map(step => step.stepId),
    completed: [],
    failed: []
  };
  await workflowRepository.saveInstance(instance);
  
  // Execute compensation steps in sequence
  for (const step of compensationPlan) {
    try {
      // Prepare input for compensation task
      const input = await prepareCompensationInput(step, instance);
      
      // Execute the compensation task
      await taskExecutionService.executeTask(step.taskId, input);
      
      // Update compensation state
      instance.compensationState.completed.push(step.stepId);
      await workflowRepository.saveInstance(instance);
    } catch (error) {
      // Record compensation failure
      instance.compensationState.failed.push({
        stepId: step.stepId,
        error: error.message,
        timestamp: new Date().toISOString()
      });
      await workflowRepository.saveInstance(instance);
      
      // Log detailed error for debugging
      logger.error(`Compensation step ${step.stepId} failed`, {
        workflowId: instance.workflowDefinitionId,
        instanceId: instance.id,
        error: error
      });
    }
  }
  
  // Mark compensation as complete
  instance.compensationState.status = instance.compensationState.failed.length > 0 
    ? 'COMPLETED_WITH_ERRORS' 
    : 'COMPLETED';
  instance.compensationState.completedAt = new Date().toISOString();
  await workflowRepository.saveInstance(instance);
  
  // Emit compensation completed event
  await eventEmitter.emit({
    pattern: 'workflow.compensation.completed',
    payload: {
      workflowId: instance.workflowDefinitionId,
      instanceId: instance.id,
      status: instance.compensationState.status
    }
  });
}

/**
 * Helper function to evaluate if compensation should run
 */
async function evaluateCompensationCondition(
  condition: string | undefined,
  instance: WorkflowInstance
): Promise<boolean> {
  if (!condition) {
    return true; // No condition means always compensate
  }
  
  // Evaluate condition in a sandbox with workflow context
  return conditionEvaluator.evaluate(
    condition,
    { workflow: { instance } }
  );
}

/**
 * Helper function to prepare input for compensation task
 */
async function prepareCompensationInput(
  step: CompensationStep,
  instance: WorkflowInstance
): Promise<any> {
  if (typeof step.input === 'string') {
    // Input is an expression to be evaluated
    return expressionEvaluator.evaluate(
      step.input,
      { workflow: { instance } }
    );
  } 
  
  if (step.input) {
    // Static input object
    return step.input;
  }
  
  // Default: provide the original step's output and the workflow state
  const originalStepId = step.compensationFor;
  const originalStepOutput = instance.state.steps?.[originalStepId]?.output || {};
  
  return {
    originalOutput: originalStepOutput,
    workflowInput: instance.input,
    workflowState: instance.state,
    cancellation: instance.cancellation
  };
}
```

#### Usage in Workflow Definitions

Workflow definitions can include compensation steps that define the cleanup actions for each main workflow step:

```json
{
  "id": "order_processing",
  "name": "Order Processing Workflow",
  "steps": [
    {
      "stepId": "reserve_inventory",
      "type": "TASK",
      "taskId": "inventory_reservation_task",
      "transitions": {
        "default": "process_payment"
      }
    },
    {
      "stepId": "process_payment",
      "type": "TASK",
      "taskId": "payment_processing_task",
      "transitions": {
        "default": "ship_order"
      }
    },
    {
      "stepId": "ship_order",
      "type": "TASK",
      "taskId": "shipment_task"
    }
  ],
  "compensationSteps": [
    {
      "stepId": "release_inventory",
      "compensationFor": "reserve_inventory",
      "type": "TASK",
      "taskId": "inventory_release_task",
      "condition": "workflow.instance.state.steps.process_payment.status === 'COMPLETED'"
    },
    {
      "stepId": "refund_payment",
      "compensationFor": "process_payment",
      "type": "TASK",
      "taskId": "payment_refund_task",
      "input": {
        "paymentId": "workflow.instance.state.steps.process_payment.output.paymentId",
        "amount": "workflow.instance.state.steps.process_payment.output.amount",
        "reason": "workflow.instance.cancellation.reason"
      }
    },
    {
      "stepId": "cancel_shipment",
      "compensationFor": "ship_order",
      "type": "TASK",
      "taskId": "shipment_cancellation_task",
      "condition": "workflow.instance.state.steps.ship_order.status === 'COMPLETED'"
    }
  ]
}
```

#### Implementation Considerations

The compensation mechanism follows these principles:

1. **Reverse Order Execution**: Compensation steps are executed in the reverse order of the original steps' completion
2. **Idempotency**: Compensation tasks should be designed to be idempotent (safe to execute multiple times)
3. **State Access**: Compensation tasks have access to the original step's output and the entire workflow state
4. **Conditional Execution**: Compensation can be conditionally executed based on the workflow state
5. **Failure Handling**: Failures in compensation steps are recorded but don't prevent other compensation steps from executing
6. **Audit Trail**: All compensation actions are logged and tracked for compliance and troubleshooting

### Task Dispatcher

Responsible for:

* Sending task execution requests to the Task Execution Layer
* Tracking in-progress tasks
* Handling task timeouts
* Processing task results

### Error Handler

Manages workflow failures by:

* Implementing retry policies
* Executing error-specific handlers
* Transitioning to fallback steps when needed
* Recording error details for debugging

### State Manager

Maintains workflow state by:

* Persisting workflow instance data to the database
* Loading current state when resuming workflows
* Ensuring atomic state transitions
* Providing transaction management

### Scheduler Component

Manages time-based workflow operations:

* Handles delayed task execution at specified times
* Supports recurring workflow triggers (cron-style scheduling)
* Provides time-based workflow pausing and resumption
* Implements timeout management for long-running operations

```
┌─────────────────────────┐     ┌─────────────────────────┐
│                         │     │                         │
│  Workflow Orchestrator  │◄───▶│  Scheduler Component    │
│                         │     │                         │
└───────────┬─────────────┘     └─────────────────────────┘
            │                                 ▲
            ▼                                 │
┌─────────────────────────┐     ┌─────────────────────────┐
│                         │     │                         │
│    Workflow Database    │◄───▶│    Schedule Store       │
│                         │     │                         │
└─────────────────────────┘     └─────────────────────────┘
```

#### Core Features

* **Delayed Execution**: Ability to schedule tasks to run at a future time
* **Recurring Schedules**: Support for periodic workflow execution using cron syntax
* **Temporal Triggers**: Time-based events that can trigger or advance workflows
* **Dynamic Scheduling**: API for programmatically creating and managing schedules
* **Calendar Integration**: Support for business calendars, holidays, and working hours

#### Implementation Approach

```typescript
/**
 * Schedule definition interface
 */
interface ScheduleDefinition {
  id: string;
  type: 'one-time' | 'recurring';
  target: {
    type: 'workflow' | 'task';
    id: string;
  };
  timing: {
    // For one-time schedules
    executeAt?: string;  // ISO timestamp
    
    // For recurring schedules
    cronExpression?: string;
    timezone?: string;
    startDate?: string;
    endDate?: string;
  };
  input: any;             // Input data for the workflow/task
  metadata: {
    createdBy: string;
    createdAt: string;
    lastModifiedAt: string;
    description: string;
  };
}

/**
 * Scheduler service implementation pattern
 */
class SchedulerService {
  /**
   * Creates a new schedule
   */
  async createSchedule(definition: ScheduleDefinition): Promise<string> {
    // Validate schedule definition
    this.validateScheduleDefinition(definition);
    
    // Store schedule in the database
    const scheduleId = await this.scheduleStore.saveSchedule(definition);
    
    // If it's a one-time schedule in the near future, add it to the memory queue
    if (definition.type === 'one-time' && this.isInNearFuture(definition.timing.executeAt)) {
      this.addToMemoryQueue(scheduleId, definition);
    }
    
    return scheduleId;
  }
  
  /**
   * Activates scheduled items that are due for execution
   * This is called by a time-based trigger (e.g., every minute)
   */
  async processDueSchedules(): Promise<void> {
    // Get schedules that are due from both memory queue and database
    const dueSchedules = [
      ...this.getDueSchedulesFromMemory(),
      ...await this.scheduleStore.getDueSchedules(new Date())
    ];
    
    // Process each due schedule
    for (const schedule of dueSchedules) {
      if (schedule.target.type === 'workflow') {
        await this.workflowService.startWorkflow(
          schedule.target.id,
          schedule.input
        );
      } else {
        await this.taskService.executeTask(
          schedule.target.id,
          schedule.input
        );
      }
      
      // If recurring, calculate and store next execution time
      if (schedule.type === 'recurring') {
        const nextExecutionTime = this.calculateNextExecution(
          schedule.timing.cronExpression,
          schedule.timing.timezone
        );
        
        await this.scheduleStore.updateNextExecutionTime(
          schedule.id,
          nextExecutionTime
        );
      } else {
        // For one-time schedules, mark as completed
        await this.scheduleStore.markAsCompleted(schedule.id);
      }
    }
  }
}
```

#### Database Schema

The Scheduler Component uses a dedicated `schedules` table to store schedule definitions and state:

* `id`: Unique identifier for the schedule
* `type`: Schedule type (one-time or recurring)
* `target_type`: Type of target (workflow or task)
* `target_id`: ID of the target workflow or task
* `cron_expression`: For recurring schedules
* `next_execution`: Timestamp for the next execution
* `input`: JSON data to pass to the workflow/task
* `status`: Current status (active, completed, error)
* `created_at`: Creation timestamp
* `created_by`: User who created the schedule
* `last_executed`: Timestamp of last execution

## Interfaces

### Input Interfaces

* **Event Triggers**: Receives events from the Event Processing Service
* **API Endpoints**: Exposes REST endpoints for workflow management
* **Scheduler**: Receives notifications for scheduled workflows

### Output Interfaces

* **Task Execution Layer**: Sends task execution requests
* **Event Emitter**: Publishes workflow lifecycle events
* **Database**: Persists workflow state and history

## Data Model

The Workflow Orchestrator Service primarily interacts with these data schemas:

* [Workflows Schema](../schemas/workflows.md): For workflow definitions and instances
* [Tasks Schema](../schemas/tasks.md): For task definitions and instances
* [Events Schema](../schemas/events.md): For event processing

## Operational Considerations

### Scalability

The service scales horizontally by:

* Using database locks to prevent concurrent execution of the same workflow instance
* Distributing workflow instances across service instances
* Implementing backpressure mechanisms for high load

### Monitoring

Key metrics to monitor:

* Workflow execution time
* Step execution time
* Error rates by workflow and step
* Queue depths for pending workflows
* Database connection pool utilization

### Resilience

Failure handling strategies:

* Automatic retry of failed database operations
* Circuit breakers for external service calls
* Dead-letter queues for unprocessable workflows
* Graceful degradation under load

### Database Query Optimization

The Workflow Orchestrator implements optimized database access patterns to ensure efficient workflow state management:

#### Indexed Query Patterns

Key workflow queries are optimized with specialized indexes:

* **Instance Lookup by ID**: Primary key lookup using UUID index
* **Finding Active Workflows**: Composite index on `(status, updated_at)` for efficient filtering of running workflows
* **Related Workflows**: Index on `correlation_id` for finding logically related workflow instances
* **Step Completion Status**: Expression index on `state->>'currentStepId'` for finding workflows at specific steps
* **Instances by Definition**: Index on `workflow_definition_id` optimizes fetching all instances of a workflow type

```sql
-- Key indexes for workflow_instances table
CREATE UNIQUE INDEX workflow_instances_pkey ON workflow_instances(id);
CREATE INDEX workflow_instances_status_idx ON workflow_instances(status, updated_at);
CREATE INDEX workflow_instances_correlation_idx ON workflow_instances(correlation_id);
CREATE INDEX workflow_instances_current_step_idx ON workflow_instances((state->>'currentStepId'));
CREATE INDEX workflow_instances_definition_idx ON workflow_instances(workflow_definition_id);

-- Specialized index for finding workflows waiting for specific events
CREATE INDEX workflow_instances_waiting_for_event_idx ON workflow_instances((state->'waitingForEvent'->>'eventPattern')) 
WHERE status = 'WAITING_FOR_EVENT';
```

#### JSONB Query Optimization

For efficient querying of workflow state stored in JSONB fields:

* **Containment Operator**: Using `@>` operator for checking existence of specific keys/values
* **Path Extraction**: Using `->` and `->>` operators to extract only needed portions of state
* **GIN Indexing**: GIN indexes on JSONB fields that are frequently queried
* **Targeted JSONB Queries**: Querying specific paths rather than entire JSONB documents

```typescript
/**
 * Optimized query for finding workflows waiting for a specific event
 */
async function findWorkflowsWaitingForEvent(eventPattern: string): Promise<string[]> {
  // Uses the specialized index on event pattern within state
  const query = `
    SELECT id 
    FROM workflow_instances 
    WHERE status = 'WAITING_FOR_EVENT' 
    AND state->'waitingForEvent'->>'eventPattern' = $1
  `;
  
  const result = await database.query(query, [eventPattern]);
  return result.rows.map(row => row.id);
}

/**
 * Optimized query for finding workflow variables without loading full state
 */
async function getWorkflowVariable(
  instanceId: string, 
  variablePath: string
): Promise<any> {
  // Extracts just the needed variable instead of the entire state JSON
  const query = `
    SELECT state->'variables'->$2 AS value
    FROM workflow_instances
    WHERE id = $1
  `;
  
  const result = await database.query(query, [instanceId, variablePath]);
  return result.rows[0]?.value;
}
```

#### Atomic State Updates

Workflow state updates use optimistic concurrency control to prevent race conditions:

* **Version Field**: A `version` column in `workflow_instances` tracks state changes
* **Conditional Updates**: Updates check the current version matches expected version
* **Retry Logic**: Conflicts trigger re-reading the state and re-applying changes

```typescript
/**
 * Atomic update of workflow state with optimistic concurrency control
 */
async function updateWorkflowState(
  instanceId: string, 
  expectedVersion: number,
  updateFunction: (state: WorkflowState) => WorkflowState
): Promise<void> {
  // Start transaction
  const transaction = await database.beginTransaction();
  
  try {
    // Get current instance with FOR UPDATE lock
    const query = `
      SELECT state, version 
      FROM workflow_instances 
      WHERE id = $1 
      FOR UPDATE
    `;
    
    const result = await transaction.query(query, [instanceId]);
    const { state, version } = result.rows[0];
    
    // Check version matches
    if (version !== expectedVersion) {
      throw new Error('Concurrent modification detected');
    }
    
    // Apply update
    const newState = updateFunction(state);
    
    // Save with incremented version
    const updateQuery = `
      UPDATE workflow_instances 
      SET state = $1, version = $2, updated_at = NOW() 
      WHERE id = $3 AND version = $4
    `;
    
    await transaction.query(updateQuery, [
      newState, 
      version + 1, 
      instanceId, 
      version
    ]);
    
    // Commit transaction
    await transaction.commit();
  } catch (error) {
    // Rollback on error
    await transaction.rollback();
    throw error;
  }
}
```

#### Query Batching

For high-throughput workflow operations:

* **Bulk Loading**: Batch retrieval of multiple workflow instances
* **Bulk Updates**: Batch updates of workflow states when multiple need similar changes
* **Cursor-based Pagination**: Using cursor-based pagination for large result sets

```typescript
/**
 * Optimized batch loading of workflow instances
 */
async function bulkLoadWorkflowInstances(instanceIds: string[]): Promise<Map<string, WorkflowInstance>> {
  if (instanceIds.length === 0) {
    return new Map();
  }
  
  // Single query to load multiple instances
  const placeholders = instanceIds.map((_, i) => `$${i + 1}`).join(',');
  const query = `
    SELECT * 
    FROM workflow_instances 
    WHERE id IN (${placeholders})
  `;
  
  const result = await database.query(query, instanceIds);
  
  // Map results by ID for efficient access
  const instances = new Map();
  for (const row of result.rows) {
    instances.set(row.id, mapRowToWorkflowInstance(row));
  }
  
  return instances;
}
```

## Configuration

The service can be configured with:

* Maximum concurrent workflows
* Default retry policies
* Timeout settings
* Database connection parameters
* Logging levels and destinations

## Concurrency Control

The Workflow Orchestrator implements robust concurrency controls to maintain system stability and prevent performance degradation:

### Parallel Execution Limits

* **Global Concurrency Limit**: Configurable maximum number of workflows running simultaneously system-wide
* **Per-Workflow-Type Limits**: Ability to set different concurrency limits for different workflow types
* **User/Tenant Quotas**: Configurable limits on workflows per user or tenant to ensure fair resource allocation
* **Dynamic Adjustment**: Automatic adjustment of limits based on system load and available resources

### Implementation Approach

```typescript
/**
 * Concurrency configuration interface
 */
interface ConcurrencyConfig {
  globalMaxConcurrent: number;            // Maximum workflows system-wide
  workflowTypeLimits: Record<string, number>; // Limits per workflow type
  tenantLimits: Record<string, number>;   // Limits per tenant
  userLimits: Record<string, number>;     // Limits per user
  resourceBasedLimits: boolean;           // Enable dynamic adjustment
}

/**
 * Concurrency control implementation pattern
 */
class ConcurrencyController {
  private activeWorkflows: Map<string, number> = new Map();
  private config: ConcurrencyConfig;
  
  /**
   * Checks if a workflow can be started based on concurrency limits
   */
  async canStartWorkflow(
    workflowType: string,
    tenantId: string,
    userId: string
  ): Promise<boolean> {
    // Check global limit
    const totalActive = await this.getTotalActiveWorkflows();
    if (totalActive >= this.config.globalMaxConcurrent) {
      return false;
    }
    
    // Check workflow type limit
    const activeForType = await this.getActiveWorkflowsByType(workflowType);
    if (activeForType >= this.getWorkflowTypeLimit(workflowType)) {
      return false;
    }
    
    // Check tenant and user limits
    const activeForTenant = await this.getActiveWorkflowsByTenant(tenantId);
    const activeForUser = await this.getActiveWorkflowsByUser(userId);
    
    return activeForTenant < this.getTenantLimit(tenantId) &&
           activeForUser < this.getUserLimit(userId);
  }
  
  /**
   * Acquires a concurrency slot for a workflow
   * Returns a release function to be called when workflow completes
   */
  async acquireSlot(
    workflowId: string,
    workflowType: string,
    tenantId: string,
    userId: string
  ): Promise<() => Promise<void>> {
    // Update active workflow counts
    await this.incrementActiveCount(workflowType, tenantId, userId);
    
    // Return function to release the slot when workflow completes
    return async () => {
      await this.decrementActiveCount(workflowType, tenantId, userId);
    };
  }
}
```

### Queue Management

* Workflows exceeding concurrency limits are placed in a priority queue
* Queue ordering is configurable (FIFO, priority-based, deadline-based)
* Workflows can be promoted in the queue based on business rules
* Queue metrics are exposed for monitoring and alerting

When the system reaches concurrency limits, new workflow requests are handled according to the configured queue policy, ensuring critical workflows can still execute while maintaining system stability.

## Security

Security considerations:

* Authentication for API endpoints
* Authorization for workflow operations
* Audit logging of all workflow changes
* Data encryption for sensitive workflow data

## Implementation Examples

### Starting a Workflow

```typescript
// Example of how the service starts a workflow
async function startWorkflow(workflowId: string, input: any): Promise<string> {
  // Load workflow definition
  const definition = await workflowRepository.getDefinition(workflowId);
  
  // Create workflow instance
  const instance = {
    id: generateUuid(),
    workflowDefinitionId: definition.id,
    status: 'RUNNING',
    input,
    state: { input },
    startedAt: new Date()
  };
  
  // Persist instance
  await workflowRepository.saveInstance(instance);
  
  // Determine first step
  const firstStep = definition.steps[0];
  
  // Queue execution of first step
  await taskDispatcher.dispatchTask(instance.id, firstStep);
  
  return instance.id;
}
```

### Processing a Step Result

```typescript
// Example of how the service processes a step result
async function processStepResult(
  instanceId: string, 
  stepId: string, 
  result: any
): Promise<void> {
  // Load workflow instance
  const instance = await workflowRepository.getInstance(instanceId);
  
  // Update state with step result
  instance.state.steps = instance.state.steps || {};
  instance.state.steps[stepId] = {
    status: 'COMPLETED',
    output: result,
    completedAt: new Date()
  };
  
  // Load workflow definition
  const definition = await workflowRepository.getDefinition(instance.workflowDefinitionId);
  
  // Find current step definition
  const currentStep = definition.steps.find(s => s.stepId === stepId);
  
  // Determine next step
  const nextStep = determineNextStep(currentStep, instance.state);
  
  if (nextStep) {
    // Continue workflow with next step
    await taskDispatcher.dispatchTask(instanceId, nextStep);
  } else {
    // Complete workflow
    instance.status = 'COMPLETED';
    instance.completedAt = new Date();
    await workflowRepository.saveInstance(instance);
    
    // Emit completion event
    await eventEmitter.emit({
      pattern: 'workflow.completed',
      payload: {
        workflowId: instance.workflowDefinitionId,
        instanceId: instance.id
      }
    });
  }
}
```


