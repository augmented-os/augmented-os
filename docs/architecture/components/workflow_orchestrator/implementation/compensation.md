# Compensation Mechanisms

## Overview

The Compensation Mechanisms in the Workflow Orchestrator provide systematic cleanup and recovery for workflows that are canceled or fail mid-execution. This ensures that resources are properly released and side effects are handled gracefully when workflows don't complete normally.

## Key Features

* Enables definition of compensating actions for workflow steps
* Ensures consistent cleanup of resources and state when workflows are interrupted
* Supports transaction-like semantics with rollback capabilities
* Maintains a clear audit trail of compensation actions
* Allows for custom compensation logic based on workflow state

## Implementation

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

## Usage in Workflow Definitions

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

## Implementation Principles

The compensation mechanism follows these principles:

### 1. Reverse Order Execution

Compensation steps are executed in the reverse order of the original steps' completion. This ensures that dependent resources are released in the proper sequence.

```
Original execution:  A → B → C → D
Compensation order:  D → C → B → A
```

### 2. Idempotency

Compensation tasks are designed to be idempotent (safe to execute multiple times). This is critical because compensation may be retried if failures occur.

```typescript
// Example of idempotent compensation task
async function releaseInventory(input) {
  const { reservationId } = input.originalOutput;
  
  // Check if already released
  const reservation = await inventoryService.getReservation(reservationId);
  if (!reservation || reservation.status === 'RELEASED') {
    // Already released, nothing to do
    return { status: 'ALREADY_RELEASED' };
  }
  
  // Release the reservation
  await inventoryService.releaseReservation(reservationId);
  
  return { status: 'RELEASED' };
}
```

### 3. State Access

Compensation tasks have access to the original step's output and the entire workflow state. This provides all necessary context for proper cleanup.

### 4. Conditional Execution

Compensation can be conditionally executed based on the workflow state. This allows for smart cleanup that only happens when necessary.

### 5. Failure Handling

Failures in compensation steps are recorded but don't prevent other compensation steps from executing. This ensures maximum cleanup even if some compensation actions fail.

### 6. Audit Trail

All compensation actions are logged and tracked for compliance and troubleshooting. This provides a clear record of what cleanup was performed.

## Usage Patterns

### Transactional Workflows

For workflows that implement business transactions across multiple systems, compensation provides ACID-like guarantees:

1. **Atomicity**: Either all steps complete successfully or all are compensated
2. **Consistency**: The system returns to a consistent state after compensation
3. **Isolation**: Compensation ensures no partial effects remain visible
4. **Durability**: All compensation actions are recorded and persisted

### Resource Management

Compensation ensures proper resource cleanup, such as:

* Releasing reserved inventory
* Refunding payments
* Canceling external service requests
* Removing temporary data

### Error Recovery

When workflows fail due to business or technical errors, compensation:

* Notifies appropriate systems of failure
* Repairs any inconsistent state
* Ensures no orphaned resources remain

## Related Documentation

- [Event Processing](./event_processing.md)
- [Error Handling](./error_handling.md)
- [State Management](./state_management.md) 