# Error Handling

## Overview

The Error Handler is a core component of the Workflow Orchestrator Service responsible for managing workflow failures, implementing retry policies, and providing graceful degradation under exceptional conditions. It ensures that workflows remain resilient and recoverable even when errors occur.

## Key Responsibilities

* Implementing configurable retry policies
* Executing error-specific handlers
* Transitioning to fallback steps when needed
* Recording error details for debugging
* Managing circuit breakers for external dependencies
* Coordinating compensation actions

## Implementation

### Error Classification

Errors are classified into several categories to allow appropriate handling:

```typescript
enum ErrorCategory {
  TRANSIENT = 'TRANSIENT',        // Temporary failures that can be retried
  PERMANENT = 'PERMANENT',        // Non-recoverable errors
  BUSINESS = 'BUSINESS',          // Business rule violations
  SYSTEM = 'SYSTEM',              // System/infrastructure errors
  TIMEOUT = 'TIMEOUT',            // Operation timed out
  VALIDATION = 'VALIDATION',      // Input/output validation errors
  SECURITY = 'SECURITY',          // Security/permission errors
  UNKNOWN = 'UNKNOWN'             // Unclassified errors
}

interface ErrorInfo {
  message: string;
  category: ErrorCategory;
  code?: string;
  details?: Record<string, any>;
  timestamp: string;
  retriable: boolean;
  stackTrace?: string;
  originalError?: any;
}
```

### Retry Policies

Configurable retry policies that can be attached to workflow steps:

```typescript
interface RetryPolicy {
  maxAttempts: number;             // Maximum number of retry attempts
  initialInterval: number;         // Initial backoff interval in ms
  maxInterval?: number;            // Maximum backoff interval in ms
  backoffMultiplier: number;       // Factor to increase backoff on each attempt
  retryableErrors?: string[];      // Error codes/categories to retry
  nonRetryableErrors?: string[];   // Error codes/categories to not retry
}

/**
 * Implementation for handling task execution errors with retry logic
 */
async function handleTaskError(
  instanceId: string,
  stepId: string,
  error: any,
  attemptNumber: number
): Promise<void> {
  // Load workflow instance
  const instance = await workflowRepository.getInstance(instanceId);
  
  // Load workflow definition
  const definition = await workflowRepository.getDefinition(instance.workflowDefinitionId);
  
  // Find step definition
  const stepDef = definition.steps.find(s => s.stepId === stepId);
  
  // Get retry policy (or use default)
  const retryPolicy = stepDef.retryPolicy || defaultRetryPolicy;
  
  // Classify error
  const errorInfo = classifyError(error);
  
  // Record error in workflow state
  await updateWorkflowState(
    instanceId,
    instance.version,
    state => {
      state.steps = state.steps || {};
      state.steps[stepId] = state.steps[stepId] || {};
      state.steps[stepId].error = errorInfo;
      state.steps[stepId].attempts = (state.steps[stepId].attempts || 0) + 1;
      return state;
    }
  );
  
  // Check if error is retriable based on policy and error classification
  const isRetriable = isErrorRetriable(errorInfo, retryPolicy);
  
  // Check if we've reached max attempts
  const hasAttemptsRemaining = attemptNumber < retryPolicy.maxAttempts;
  
  if (isRetriable && hasAttemptsRemaining) {
    // Calculate backoff delay
    const delayMs = calculateBackoffDelay(
      retryPolicy.initialInterval,
      retryPolicy.backoffMultiplier,
      retryPolicy.maxInterval || Infinity,
      attemptNumber
    );
    
    // Schedule retry after backoff
    await schedulerService.scheduleTaskRetry(
      instanceId,
      stepId,
      delayMs,
      attemptNumber + 1
    );
    
    return;
  }
  
  // If we can't retry, check for error handling configuration
  if (stepDef.onFailure) {
    // Transition to error handler step
    await executeWorkflowStep(instanceId, stepDef.onFailure.handlerStepId);
  } else {
    // No handler, fail the workflow
    await updateWorkflowStatus(instanceId, 'FAILED', {
      failedStepId: stepId,
      failureReason: errorInfo.message
    });
  }
}

/**
 * Calculate backoff delay with exponential strategy
 */
function calculateBackoffDelay(
  initialInterval: number,
  backoffMultiplier: number,
  maxInterval: number,
  attemptNumber: number
): number {
  const delay = initialInterval * Math.pow(backoffMultiplier, attemptNumber - 1);
  return Math.min(delay, maxInterval);
}

/**
 * Determine if an error is retriable based on policy
 */
function isErrorRetriable(
  errorInfo: ErrorInfo,
  retryPolicy: RetryPolicy
): boolean {
  // If error is explicitly marked non-retriable
  if (!errorInfo.retriable) {
    return false;
  }
  
  // If error code/category is in non-retryable list
  if (retryPolicy.nonRetryableErrors && 
      (retryPolicy.nonRetryableErrors.includes(errorInfo.code) ||
       retryPolicy.nonRetryableErrors.includes(errorInfo.category))) {
    return false;
  }
  
  // If retryable errors list exists and error is not in it
  if (retryPolicy.retryableErrors && 
      !(retryPolicy.retryableErrors.includes(errorInfo.code) || 
        retryPolicy.retryableErrors.includes(errorInfo.category))) {
    return false;
  }
  
  return true;
}
```

### Error Handling in Workflow Definitions

Workflows can define custom error handling behavior:

```json
{
  "steps": [
    {
      "stepId": "process_payment",
      "type": "TASK",
      "taskId": "payment_processing_task",
      "retryPolicy": {
        "maxAttempts": 3,
        "initialInterval": 1000,
        "backoffMultiplier": 2,
        "retryableErrors": ["TRANSIENT", "TIMEOUT", "payment.gateway.unavailable"]
      },
      "onFailure": {
        "handlerStepId": "handle_payment_failure",
        "inputMapping": {
          "failureReason": "error.message",
          "paymentId": "step.input.paymentId"
        }
      },
      "transitions": {
        "default": "ship_order"
      }
    },
    {
      "stepId": "handle_payment_failure",
      "type": "TASK",
      "taskId": "payment_failure_handler",
      "transitions": {
        "default": "notify_customer"
      }
    }
  ]
}
```

### Circuit Breakers

For external dependencies, circuit breakers prevent cascading failures:

```typescript
/**
 * Circuit breaker implementation pattern
 */
class CircuitBreaker {
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  private failureCount: number = 0;
  private lastFailureTime: number = 0;
  
  constructor(
    private readonly options: {
      failureThreshold: number;       // Number of failures to open circuit
      resetTimeout: number;           // Time in ms to transition to half-open
      successThreshold: number;       // Successes in half-open to close circuit
      monitoredErrorCategories: ErrorCategory[];
    }
  ) {}
  
  /**
   * Execute a function with circuit breaker protection
   */
  async execute<T>(
    operation: () => Promise<T>,
    fallback?: () => Promise<T>
  ): Promise<T> {
    // Check if circuit is open
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime >= this.options.resetTimeout) {
        // Transition to half-open after timeout
        this.state = 'HALF_OPEN';
      } else if (fallback) {
        // Execute fallback if circuit is open and fallback exists
        return fallback();
      } else {
        throw new Error('Circuit is open');
      }
    }
    
    try {
      // Execute the operation
      const result = await operation();
      
      // On success in half-open, increment success counter
      if (this.state === 'HALF_OPEN') {
        this.failureCount--;
        if (this.failureCount <= -this.options.successThreshold) {
          // Reset after success threshold
          this.state = 'CLOSED';
          this.failureCount = 0;
        }
      }
      
      return result;
    } catch (error) {
      // Check if error is monitored
      const errorInfo = classifyError(error);
      const isMonitoredError = this.options.monitoredErrorCategories.includes(
        errorInfo.category
      );
      
      if (isMonitoredError) {
        this.recordFailure();
      }
      
      // If fallback exists, execute it
      if (fallback) {
        return fallback();
      }
      
      // Otherwise, rethrow the error
      throw error;
    }
  }
  
  /**
   * Record a failure and update circuit state
   */
  private recordFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    
    if (this.state === 'CLOSED' && 
        this.failureCount >= this.options.failureThreshold) {
      // Open circuit after threshold
      this.state = 'OPEN';
    } else if (this.state === 'HALF_OPEN') {
      // Immediate open on failure in half-open
      this.state = 'OPEN';
    }
  }
}
```

### Dead Letter Handling

For capturing and managing unprocessable workflow events or states:

```typescript
/**
 * Records an unprocessable workflow to dead letter storage
 */
async function recordDeadLetterWorkflow(
  instanceId: string,
  reason: string,
  metadata: Record<string, any>
): Promise<void> {
  await deadLetterRepository.saveDeadLetterEntry({
    entityType: 'WORKFLOW_INSTANCE',
    entityId: instanceId,
    reason,
    occurredAt: new Date().toISOString(),
    metadata
  });
  
  // Update workflow status to reflect dead letter status
  await workflowRepository.updateWorkflowStatus(instanceId, 'FAILED', {
    isFatal: true,
    deadLetterReason: reason
  });
  
  // Emit dead letter event for monitoring
  await eventEmitter.emit({
    pattern: 'workflow.deadletter',
    payload: {
      instanceId,
      reason,
      timestamp: new Date().toISOString()
    }
  });
}
```

## Error Recovery Patterns

### Step-Level Recovery

Each workflow step can define its own error handling strategy:


1. **Retry Policy**: Configurable retry behavior for transient failures
2. **Error Handler Step**: Dedicated step to execute when main step fails
3. **Conditional Transitions**: Different next steps based on error type

### Workflow-Level Recovery

Workflows can implement recovery at the workflow level:


1. **Global Error Handlers**: Workflow-wide error handling steps
2. **Compensation**: Reversing completed steps on workflow failure
3. **Saga Pattern**: For distributed transactions with specialized rollback

### System-Level Recovery

The Workflow Orchestrator implements system-level recovery:


1. **Workflow Reconciliation**: Background process to find and recover stuck workflows
2. **Instance Migration**: Moving problematic workflows to new versions
3. **Manual Intervention API**: Endpoints for operator-assisted recovery

## Integration with Observability

The error handling system integrates with the observability stack:


1. **Detailed Error Logging**: Structured logging of all errors with context
2. **Error Metrics**: Tracking error rates, categories, and recovery success
3. **Alerts**: Threshold-based alerting for error patterns
4. **Correlation IDs**: Ensuring errors can be traced across components

## Related Documentation

* [State Management](./state_management.md)
* [Compensation Mechanisms](./compensation.md)
* [Monitoring Guidelines](../operations/monitoring.md)


