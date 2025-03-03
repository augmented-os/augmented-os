# Workflow Orchestrator Data Model

## Overview

The Workflow Orchestrator Service primarily interacts with these data schemas:

* [Workflows Schema](../../schemas/workflows.md): For workflow definitions and instances
* [Tasks Schema](../../schemas/tasks.md): For task definitions and instances
* [Events Schema](../../schemas/events.md): For event processing

This document focuses on how the Workflow Orchestrator component specifically implements and extends the canonical schemas defined in the links above. For complete schema definitions, please refer to the linked documentation.

## Workflow Orchestrator Implementation Details

The Workflow Orchestrator extends the canonical workflow schemas with additional implementation-specific structures and optimizations to support efficient workflow execution.

### Workflow Instance State Management

The Workflow Orchestrator maintains detailed state information for each workflow instance:

```typescript
interface WorkflowInstance {
  id: string;                            // UUID for the instance
  workflowDefinitionId: string;          // Reference to workflow definition
  status: WorkflowStatus;                // Current execution status
  input: Record<string, any>;            // Input data provided when started
  state: {                               // Current execution state
    variables: Record<string, any>;      // Workflow variables
    currentStepId?: string;              // Currently executing step
    steps: Record<string, StepState>;    // State of each executed step
    waitingForEvent?: EventWaitState;    // Event wait information
  };
  version: number;                       // For optimistic concurrency control
  startedAt: string;                     // ISO timestamp
  updatedAt: string;                     // ISO timestamp
  completedAt?: string;                  // ISO timestamp (if completed)
  correlation_id?: string;               // For related workflows
  cancelation?: CancellationInfo;        // If workflow was cancelled
  compensationState?: CompensationState; // For cleanup actions
}

type WorkflowStatus = 
  'CREATED' | 
  'RUNNING' | 
  'COMPLETED' | 
  'FAILED' | 
  'CANCELLED' | 
  'WAITING_FOR_EVENT';

interface StepState {
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  input?: any;
  output?: any;
  error?: ErrorInfo;
  startedAt?: string;
  completedAt?: string;
}

interface EventWaitState {
  eventPattern: string;
  eventCondition?: string;
  since: string;
}

interface CancellationInfo {
  reason: string;
  requestedBy: string;
  requestedAt: string;
  source: 'USER' | 'EVENT' | 'SYSTEM';
  eventId?: string;
}

interface CompensationState {
  status: 'IN_PROGRESS' | 'COMPLETED' | 'COMPLETED_WITH_ERRORS';
  startedAt: string;
  completedAt?: string;
  plan: string[];
  completed: string[];
  failed: Array<{
    stepId: string;
    error: string;
    timestamp: string;
  }>;
}
```

### Workflow Orchestrator Step Implementation

The Workflow Orchestrator implements workflow steps with these additional properties:

```typescript
interface WorkflowStep {
  stepId: string;                        // Unique identifier for the step
  type: 'TASK' | 'EVENT_WAIT' | 'DECISION';
  taskId?: string;                       // For TASK type steps
  input?: any | string;                  // Static input or expression
  retryPolicy?: RetryPolicy;             // How to handle failures
  timeout?: number;                      // Max execution time (ms)
  transitions: {                         // Next steps based on result
    default: string;
    conditions?: Array<{
      condition: string;
      nextStep: string;
    }>;
  };
}

interface EventWaitStep extends WorkflowStep {
  type: 'EVENT_WAIT';
  eventPattern: string;
  eventCondition?: string;
  eventTimeout?: {
    duration: string;
    timeoutHandlerStepId: string;
  };
  eventPayloadMapping?: Record<string, string>;
}

interface CompensationStep {
  stepId: string;
  compensationFor: string;
  type: 'TASK';
  taskId: string;
  input?: Record<string, any> | string;
  condition?: string;
}
```

## Database Optimizations

The Workflow Orchestrator implements specific database optimizations to ensure efficient workflow execution:

### Performance-Critical Indexes

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

### Query Optimization Strategies

The Workflow Orchestrator uses the following strategies to optimize database access:

1. **Partial Updates**: Only updating changed fields to minimize write overhead
2. **Optimistic Concurrency Control**: Using version numbers to detect conflicts
3. **JSONB Path Operators**: Using path operators to update nested JSON without rewriting entire documents
4. **Materialized Views**: For frequently accessed workflow statistics and reporting

## Related Documentation

* [Database Architecture](../../database_architecture.md)
* [Workflows Schema](../../schemas/workflows.md)
* [Implementation: Database Optimization](./implementation/database_optimization.md)


