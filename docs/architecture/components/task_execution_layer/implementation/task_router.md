# Task Router

## Overview

The Task Router is a core component of the Task Execution Layer Service responsible for receiving incoming task requests and routing them to the appropriate executor based on task type, requirements, and current system load. It acts as the entry point for all task execution requests and ensures tasks are properly queued, prioritized, and dispatched.

## Key Responsibilities

* Receiving and validating incoming task execution requests
* Determining the appropriate executor for each task
* Prioritizing tasks based on defined criteria
* Managing task queues for different executors
* Monitoring executor availability and capacity
* Implementing load balancing across executor instances
* Handling task routing failures and retries

## Implementation Approach

The Task Router system follows these design principles:


1. **Decoupled Architecture** - Task routing is decoupled from task execution for flexibility
2. **Priority-Based Routing** - Tasks are routed based on priority and SLA requirements
3. **Dynamic Executor Selection** - Executors are selected based on current load and availability
4. **Queue Management** - Separate queues are maintained for different task types
5. **Resilient Routing** - Routing failures are handled with appropriate retry mechanisms

## Task Routing Lifecycle

```
┌───────────┐
│  RECEIVED │
└─────┬─────┘
      │
      ▼
┌───────────┐     ┌─────────────────┐
│ VALIDATED │────►│     REJECTED     │
└─────┬─────┘     └──────────────────┘
      │
      │
      ▼
┌───────────┐
│  QUEUED   │
└─────┬─────┘
      │
      ▼
┌───────────┐
│ DISPATCHED│
└───────────┘
```

## Implementation Details

### Task Type Determination

The Task Router determines the appropriate executor for a task based on the task type and execution requirements:

```typescript
// Example code snippet demonstrating task type determination
function determineExecutor(task: TaskInstance): ExecutorType {
  switch (task.type) {
    case 'AUTOMATED':
      return determineAutomatedTaskExecutor(task);
    case 'MANUAL':
      return 'MANUAL_TASK_HANDLER';
    case 'INTEGRATION':
      return determineIntegrationExecutor(task);
    default:
      throw new Error(`Unknown task type: ${task.type}`);
  }
}

function determineAutomatedTaskExecutor(task: TaskInstance): ExecutorType {
  // Select based on security requirements, resource needs, etc.
  const securityLevel = task.executionConfig?.securityContext?.securityLevel || 'LOW';
  
  if (securityLevel === 'HIGH') {
    return 'ISOLATED_EXECUTOR';
  } else if (task.executionConfig?.resourceRequirements?.memory > '2Gi') {
    return 'HIGH_RESOURCE_EXECUTOR';
  } else {
    return 'STANDARD_EXECUTOR';
  }
}
```

### Task Prioritization

The Task Router implements a priority-based queuing system that considers:


1. Explicit task priority
2. SLA requirements
3. Workflow criticality
4. Resource availability

Key considerations include:

* Critical tasks are given highest priority
* Tasks with approaching deadlines are prioritized
* Tasks from critical workflows receive higher priority
* Priority aging prevents starvation of lower-priority tasks

### Queue Management

The Task Router maintains separate queues for different executors and task types:

| Queue Name | Purpose | Priority Handling |
|----|----|----|
| automated-standard | Standard automated tasks | FIFO with priority levels |
| automated-isolated | Security-sensitive tasks | Strict priority ordering |
| manual-tasks | Tasks requiring human intervention | Deadline-based priority |
| integration-tasks | External system integration | FIFO with priority levels |

### Edge Cases and Error Handling

The implementation addresses the following edge cases:

| Scenario | Handling Approach |
|----|----|
| No available executors | Tasks remain queued with periodic retry of dispatch |
| Unknown task type | Rejected with clear error message |
| Executor failure during routing | Task is requeued for another executor |
| Queue capacity exceeded | Implements backpressure mechanisms and alerts |
| Task timeout while queued | Notifies workflow orchestrator and cancels task |

## Performance Considerations

The Task Router is designed for high throughput and low latency:

* In-memory queues with persistent backing store
* Optimized task matching algorithms
* Batched database operations
* Executor capacity prediction
* Adaptive routing based on executor performance

### Benchmarks

| Operation | Average Performance | P99 Performance |
|----|----|----|
| Task routing decision | < 5ms | < 20ms |
| Queue insertion | < 10ms | < 50ms |
| Executor selection | < 15ms | < 75ms |
| End-to-end routing | < 50ms | < 200ms |

## Related Documentation

* [Data Model](../data_model.md)
* [Automated Task Executor](./automated_task_executor.md)
* [Manual Task Handler](./manual_task_handler.md)
* [Integration Task Executor](./integration_task_executor.md)


