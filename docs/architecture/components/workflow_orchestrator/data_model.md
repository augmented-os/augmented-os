# Workflow Orchestrator Data Model

## Overview

The Workflow Orchestrator Service primarily interacts with these data schemas:

* [Workflows Schema](../../schemas/workflows.md): For workflow definitions and instances
* [Tasks Schema](../../schemas/tasks.md): For task definitions and instances
* [Events Schema](../../schemas/events.md): For event processing

## Core Data Structures

### Workflow Instance

The central data structure representing an executing workflow:

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

### Workflow Definition

The template that defines how a workflow should execute:

```typescript
interface WorkflowDefinition {
  id: string;                            // Workflow identifier
  name: string;                          // Human-readable name
  description: string;                   // Detailed description
  version: string;                       // Semantic version
  inputSchema: JSONSchema;               // Schema for validating input
  steps: WorkflowStep[];                 // Steps in the workflow
  triggers: WorkflowTrigger[];           // Events that can start the workflow
  cancellationTriggers?: EventBasedCancellation[]; // Events that can cancel
  compensationSteps?: CompensationStep[]; // Steps for cleanup on cancellation
  uiComponents?: UIComponent[];          // Associated UI elements
}

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

interface EventBasedCancellation {
  eventPattern: string;
  eventCondition?: string;
  reason: string;
  shouldCompensate: boolean;
}
```

## Database Schema

The Workflow Orchestrator Service uses the following database tables:

### workflow_definitions

Stores the templates for workflows:

| Column | Type | Description |
|----|----|----|
| id | UUID | Primary key |
| workflow_id | VARCHAR | Business identifier |
| name | VARCHAR | Human-readable name |
| description | TEXT | Detailed description |
| version | VARCHAR | Semantic version (e.g., "1.0.0") |
| steps | JSONB | Array of workflow steps |
| input_schema | JSONB | JSON Schema for workflow inputs |
| triggers | JSONB | Events that trigger the workflow |
| cancellation_triggers | JSONB | Events that can cancel the workflow |
| compensation_steps | JSONB | Steps for cleanup on cancellation |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last updated timestamp |

### workflow_instances

Stores the actual running workflow instances:

| Column | Type | Description |
|----|----|----|
| id | UUID | Primary key |
| workflow_definition_id | UUID | Foreign key to workflow_definitions |
| status | VARCHAR | Current workflow status |
| state | JSONB | Current workflow state |
| input | JSONB | Input parameters |
| correlation_id | VARCHAR | ID for correlating related workflows |
| version | INTEGER | For optimistic concurrency control |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last updated timestamp |
| started_at | TIMESTAMP | Execution start timestamp |
| completed_at | TIMESTAMP | Completion timestamp (if finished) |

## Indexes

Important indexes for performance optimization:

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

## Related Documentation

* [Database Architecture](../../database_architecture.md)
* [Workflows Schema](../../schemas/workflows.md)
* [Implementation: Database Optimization](./implementation/database_optimization.md)


