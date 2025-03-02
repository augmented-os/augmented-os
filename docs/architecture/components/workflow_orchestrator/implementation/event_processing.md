# Event Processing Implementation

## Overview

The Event Processing implementation in the Workflow Orchestrator enables workflows to react to external events, pause execution while waiting for events, and use events to trigger workflow cancellation. This document details the implementation of these event-driven capabilities.

## Event-Based Workflow Resumption

Enables workflows to pause and wait for external events before continuing execution:

* Allows workflows to suspend execution until specific events occur
* Supports complex event-driven processes that may span long durations
* Integrates with the Event Processing Service for event subscription
* Provides timeouts and fallback paths for event waiting

### Implementation

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

### Usage in Workflow Definitions

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

## Event-Based Workflow Cancellation

Provides capabilities for explicitly canceling workflows based on external events:

* Enables external events to trigger workflow cancellation
* Supports conditional cancellation based on business rules
* Maintains audit trail of cancellation reasons and triggers
* Integrates with compensation mechanisms for cleanup

### Implementation

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

/**
 * Implementation for cancelling a workflow
 */
async function cancelWorkflow(
  cancellationRequest: WorkflowCancellationRequest
): Promise<void> {
  const { instanceId, shouldCompensate } = cancellationRequest;
  
  // Load workflow instance
  const instance = await workflowRepository.getInstance(instanceId);
  
  // Validate cancellation is allowed from current state
  if (!['CREATED', 'RUNNING', 'WAITING_FOR_EVENT'].includes(instance.status)) {
    throw new Error(`Cannot cancel workflow in ${instance.status} state`);
  }
  
  // Transaction for cancellation
  const transaction = await database.beginTransaction();
  
  try {
    // Update workflow status and add cancellation info
    await transaction.query(
      `UPDATE workflow_instances 
       SET status = 'CANCELLED', 
           updated_at = NOW(),
           completed_at = NOW(),
           cancellation = $2
       WHERE id = $1`,
      [instanceId, JSON.stringify(cancellationRequest)]
    );
    
    // Clean up any event subscriptions
    await cleanupWorkflowSubscriptions(instanceId, transaction);
    
    // Clean up any scheduled timeouts
    await schedulerService.cancelScheduledTimeout(instanceId);
    
    // Emit cancellation event
    await eventEmitter.emit({
      pattern: 'workflow.cancelled',
      payload: {
        workflowId: instance.workflowDefinitionId,
        instanceId: instance.id,
        reason: cancellationRequest.reason
      }
    });
    
    await transaction.commit();
    
    // Run compensation if requested
    if (shouldCompensate) {
      await runCompensationSteps(instanceId);
    }
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}
```

### Usage in Workflow Definitions

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

## Event Subscription Management

The Workflow Orchestrator must carefully manage event subscriptions to avoid memory leaks or orphaned subscriptions:

```typescript
/**
 * Cleans up all event subscriptions for a workflow instance
 */
async function cleanupWorkflowSubscriptions(
  instanceId: string,
  transaction?: DatabaseTransaction
): Promise<void> {
  // Get all subscription IDs
  const query = `
    SELECT subscription_id, subscription_type
    FROM workflow_subscriptions
    WHERE workflow_instance_id = $1
  `;
  
  const queryExecutor = transaction || database;
  const result = await queryExecutor.query(query, [instanceId]);
  
  // Unsubscribe from each subscription
  for (const row of result.rows) {
    await eventProcessingService.unsubscribe(row.subscription_id);
  }
  
  // Remove subscription records
  const deleteQuery = `
    DELETE FROM workflow_subscriptions
    WHERE workflow_instance_id = $1
  `;
  
  await queryExecutor.query(deleteQuery, [instanceId]);
}
```

## Event-Driven Architecture Integration

The Workflow Orchestrator integrates with the wider system's event-driven architecture:


1. **Event Publication**:
   * Emits events for workflow lifecycle (created, completed, cancelled)
   * Emits events for step completion
   * Emits events for compensation actions
2. **Event Consumption**:
   * Subscribes to events for workflow resumption
   * Subscribes to events for workflow cancellation
   * Subscribes to events that trigger new workflow instances

This allows for loose coupling between the Workflow Orchestrator and other system components.

## Performance Considerations

When implementing event processing in the Workflow Orchestrator, consider:


1. **Subscription Scaling**: Ensure the event subscription system scales with the number of waiting workflows
2. **Filter Optimization**: Apply filters at the subscription level to minimize unnecessary callbacks
3. **Efficient Database Pattern**: Use indexing to efficiently find workflows waiting for specific events
4. **Event Deduplication**: Ensure that duplicate events don't cause duplicate workflow resumption
5. **Backpressure Handling**: Implement mechanisms to handle bursts of events

## Related Documentation

* [Event Processing Service](../../event_processing_service.md)
* [Scheduler Component](./scheduler.md)
* [Compensation Mechanisms](./compensation.md)


