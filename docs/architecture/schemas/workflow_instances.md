# Workflow Instances

## Overview

Workflow instances represent individual executions of workflow definitions. Each instance tracks the current state, progress, and history of a workflow as it executes through its defined steps. Workflow instances maintain their own copy of state to ensure durability and provide a complete execution history.

## Relationship to Workflow Definitions

Each workflow instance is created from a workflow definition template:

* The workflow definition provides the structure, steps, and logic
* The workflow instance contains the runtime state, data, and execution history
* Multiple instances can be created from the same definition
* Instances maintain a reference to their definition but operate independently

## Workflow Instance Structure

```json
{
  "id": "string",                    // UUID for the instance
  "workflowDefinitionId": "string",  // Reference to workflow definition
  "status": "string",                // Current execution status
  "input": {},                       // Input data provided when started
  "state": {                         // Current execution state
    "variables": {},                 // Workflow variables
    "currentStepId": "string",       // Currently executing step
    "steps": {                       // State of each executed step
      "step1": {
        "status": "string",          // PENDING, RUNNING, COMPLETED, FAILED
        "input": {},                 // Input to this step
        "output": {},                // Output from this step
        "error": {},                 // Error details if failed
        "startedAt": "string",       // ISO timestamp
        "completedAt": "string"      // ISO timestamp
      }
    },
    "waitingForEvent": {             // Present if waiting for an event
      "eventPattern": "string",      // Event pattern to match
      "eventCondition": "string",    // Optional condition
      "since": "string"              // ISO timestamp
    }
  },
  "version": 1,                      // For optimistic concurrency control
  "startedAt": "string",             // ISO timestamp
  "updatedAt": "string",             // ISO timestamp
  "completedAt": "string",           // ISO timestamp (if completed)
  "correlationId": "string",         // For related workflows
  "triggerEventId": "string",        // Event that triggered this workflow
  "cancellation": {                  // Present if workflow was cancelled
    "reason": "string",
    "requestedBy": "string",
    "requestedAt": "string",
    "source": "string",              // USER, EVENT, SYSTEM
    "eventId": "string"              // If cancelled by an event
  },
  "compensationState": {             // For cleanup actions
    "status": "string",              // IN_PROGRESS, COMPLETED, COMPLETED_WITH_ERRORS
    "startedAt": "string",
    "completedAt": "string",
    "plan": ["string"],              // Steps to execute for compensation
    "completed": ["string"],         // Completed compensation steps
    "failed": [                      // Failed compensation steps
      {
        "stepId": "string",
        "error": "string",
        "timestamp": "string"
      }
    ]
  },
  "error": {}                        // Error details if workflow failed
}
```

## Workflow Status Values

Workflow instances can have the following status values:

* `CREATED`: Workflow has been created but execution has not started
* `RUNNING`: Workflow is actively executing steps
* `COMPLETED`: Workflow has successfully completed all steps
* `FAILED`: Workflow has encountered an unrecoverable error
* `CANCELLED`: Workflow was manually or automatically cancelled
* `WAITING_FOR_EVENT`: Workflow is paused waiting for an external event

## State Management

The workflow instance maintains a detailed state object that tracks:

### Variables

Workflow variables are key-value pairs that can be accessed and modified by any step in the workflow. They provide a way to share data between steps and maintain workflow context.

### Step State

For each executed step, the workflow instance maintains:

* Status (PENDING, RUNNING, COMPLETED, FAILED)
* Input data provided to the step
* Output data produced by the step
* Error information if the step failed
* Timing information (when started, when completed)

### Event Waiting

When a workflow is waiting for an event, it stores:

* The event pattern to match
* Any additional condition to evaluate
* The timestamp when it started waiting

### Compensation State

If a workflow needs to perform cleanup actions (compensation), it tracks:

* The status of the compensation process
* The plan of steps to execute
* Which steps have completed successfully
* Which steps have failed

## Cancellation and Error Handling

Workflows can be cancelled manually by users or automatically by the system. When cancelled, the workflow:


1. Records the cancellation reason, source, and timestamp
2. Executes any defined compensation steps
3. Transitions to the CANCELLED status

If a workflow encounters an error that cannot be handled by its error handling rules, it:


1. Records the error details
2. May execute compensation steps depending on configuration
3. Transitions to the FAILED status

## Database Schema

**Table: workflow_instances**

| Field | Type | Description |
|----|----|----|
| id | UUID | Primary key |
| workflow_definition_id | UUID | Reference to workflow definition |
| status | VARCHAR(50) | Current status (running, completed, failed, suspended) |
| current_step_id | VARCHAR(255) | ID of the current step |
| input | JSONB | Initial input data |
| state | JSONB | Current workflow state (includes all step outputs) |
| error | JSONB | Error details if workflow failed |
| trigger_event_id | UUID | Reference to event that triggered this workflow |
| started_at | TIMESTAMP | When workflow started |
| updated_at | TIMESTAMP | When workflow was last updated |
| completed_at | TIMESTAMP | When workflow completed |
| correlation_id | VARCHAR(255) | Business correlation identifier |

**Indexes:**

* `workflow_instances_status_idx` on `status` (for finding workflows by status)
* `workflow_instances_correlation_idx` on `correlation_id` (for finding related workflows)
* `workflow_instances_definition_idx` on `workflow_definition_id` (for finding all instances of a definition)
* `workflow_instances_current_step_idx` on `(state->>'currentStepId')` (for finding workflows at a specific step)
* `workflow_instances_waiting_for_event_idx` on `(state->'waitingForEvent'->>'eventPattern')` WHERE status = 'WAITING_FOR_EVENT' (for finding workflows waiting for specific events)

## Performance Considerations

For workflow instances, consider these performance optimizations:

* Use partial updates to minimize write overhead when updating workflow state
* Implement optimistic concurrency control using the version field
* Use JSONB path operators to update nested state without rewriting entire documents
* Consider indexing specific fields within the state JSONB for frequently queried paths
* Implement time-based partitioning for high-volume workflow instances

## Related Documentation

* [Workflow Definitions](./workflow_definitions.md) - Documentation for workflow definitions
* [Tasks Schema](./tasks.md) - Documentation for task definitions and instances
* [Events Schema](./events.md) - Documentation for event definitions and instances
* [Database Architecture](../database_architecture.md) - Overall database architecture


