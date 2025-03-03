# Workflows

> **Note:** This documentation has been split into two separate files for clarity:
> 
> * [Workflow Definitions](./workflow_definitions.md) - Documentation for workflow definition structure, UI components, step transitions, error handling, and execution logging
> * [Workflow Instances](./workflow_instances.md) - Documentation for workflow instance structure, status values, state management, and runtime behavior
>
> Please refer to these documents for detailed information about workflows.

## Overview

Workflows are orchestrated sequences of tasks that accomplish a business process. They follow a definition-driven architecture with a clear separation between:

1. **Workflow Definitions** - Templates that define the structure, steps, and logic of workflows
2. **Workflow Instances** - Individual executions of workflow definitions with their own state and history

This separation allows for:

* Version-controlled workflow definitions
* Multiple concurrent instances of the same workflow definition
* Independent execution and state management for each instance
* Clear audit trails and execution history

## Key Concepts

* **Workflow Definition** - A template that defines the structure and behavior of a workflow
* **Workflow Instance** - A single execution of a workflow definition
* **Steps** - Individual units of work within a workflow
* **Transitions** - Rules for moving between steps
* **State** - The current status and data of a workflow instance
* **Events** - External triggers that can start or affect workflows
* **Compensation** - Actions taken to clean up or roll back when workflows fail or are cancelled

## Related Documentation

* [Workflow Definitions](./workflow_definitions.md) - Documentation for workflow definitions
* [Workflow Instances](./workflow_instances.md) - Documentation for workflow instances
* [Tasks Schema](./tasks.md) - Documentation for task definitions and instances
* [Events Schema](./events.md) - Documentation for event definitions and instances
* [Database Architecture](../database_architecture.md) - Overall database architecture

## Workflow Definition Structure

```json
{
  "workflowId": "string",           // Unique identifier
  "name": "string",                 // Human-readable name
  "description": "string",          // Detailed description
  "version": "string",              // Semantic version number
  "inputSchema": {                  // Schema for workflow input
    "type": "object",
    "properties": { },
    "required": []
  },
  "steps": [                        // Ordered list of workflow steps
    {
      "stepId": "string",           // Unique ID within workflow
      "taskId": "string",           // Reference to task definition
      "name": "string",             // Optional override name
      "description": "string",      // Step description
      "next": [                     // Transition definitions
        {
          "nextStepId": "string",   
          "condition": "string"     // Optional condition expression
        }
      ],
      "parallelBranches": [         // For parallel execution
        {
          "branchId": "string",
          "steps": []               // Nested steps array
        }
      ],
      "retryPolicy": {              // Retry configuration
        "maxAttempts": 3,
        "delay": "PT5M",            // ISO8601 duration
        "strategy": "exponential | fixed"
      },
      "timeout": "PT1H",            // ISO duration for step timeout
      "onFailure": {                // Failure handling
        "action": "continue | stop | retry",
        "nextStepId": "string",     // For continue action
        "errorHandler": {           // Custom error handling
          "conditions": [           // Match specific error conditions
            {
              "errorType": "string",
              "errorCode": "string",
              "nextStepId": "string"
            }
          ]
        }
      }
    }
  ],
  "uiComponents": [                 // Workflow-level UI definitions
    {
      "componentId": "string",      // Reference to UI component
      "condition": "string",        // When to show this UI
      "priority": number,          // Order priority
      "context": {                 // Additional UI context
        "title": "string",
        "description": "string",
        "layout": "string"
      }
    }
  ],
  "executionLog": {                // Logging configuration
    "level": "debug | info | error",
    "retention": "P30D",           // How long to keep detailed logs
    "metadata": [                  // Additional fields to log
      "userId",
      "correlationId"
    ]
  }
}
```

## Workflow Instance Structure

A workflow instance represents a single execution of a workflow definition. It tracks the current state, progress, and history of the workflow as it executes.

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

### Workflow Status Values

Workflow instances can have the following status values:

* `CREATED`: Workflow has been created but execution has not started
* `RUNNING`: Workflow is actively executing steps
* `COMPLETED`: Workflow has successfully completed all steps
* `FAILED`: Workflow has encountered an unrecoverable error
* `CANCELLED`: Workflow was manually or automatically cancelled
* `WAITING_FOR_EVENT`: Workflow is paused waiting for an external event

## UI Components

Workflow UI components define how the workflow is presented in different states. The UI can be conditional based on:

* Workflow status (running, completed, failed)
* Step progress
* User roles and permissions
* Custom conditions

Example UI configurations:

```json
{
  "uiComponents": [
    {
      "componentId": "workflow-progress",
      "condition": "status == 'running'",
      "priority": 1,
      "context": {
        "title": "Current Progress",
        "layout": "timeline"
      }
    },
    {
      "componentId": "workflow-summary",
      "condition": "status == 'completed'",
      "priority": 1,
      "context": {
        "title": "Workflow Summary",
        "layout": "card"
      }
    },
    {
      "componentId": "error-view",
      "condition": "status == 'failed'",
      "priority": 2,
      "context": {
        "title": "Error Details",
        "layout": "alert"
      }
    }
  ]
}
```

## Step Transitions

Steps can transition to next steps based on:

1. **Simple Sequence:** No condition, always go to next step
2. **Conditional Branching:** Evaluate condition to choose path
3. **Parallel Execution:** Multiple branches execute simultaneously
4. **Error Handling:** Special transitions for error cases

Example transition configurations:

```json
{
  "next": [
    {
      "nextStepId": "approveRequest",
      "condition": "data.amount > 1000"
    },
    {
      "nextStepId": "autoApprove",
      "condition": "data.amount <= 1000"
    }
  ]
}
```

## Error Handling

Workflows can handle errors at multiple levels:

1. **Step Level:**
   * Retry policies
   * Timeout handling
   * Error-specific transitions
2. **Workflow Level:**
   * Global error handlers
   * Compensation steps
   * Rollback procedures

Example error handler:

```json
{
  "onFailure": {
    "action": "continue",
    "errorHandler": {
      "conditions": [
        {
          "errorType": "ValidationError",
          "nextStepId": "validateRetry"
        },
        {
          "errorType": "TimeoutError",
          "nextStepId": "timeoutHandler"
        }
      ]
    }
  }
}
```

## Execution Logging

Workflows maintain detailed execution logs:

```json
{
  "executionLog": {
    "level": "info",
    "retention": "P30D",
    "metadata": [
      "userId",
      "correlationId",
      "sourceSystem"
    ]
  }
}
```

Each step execution records:

* Start/end timestamps
* Input/output data
* Error details if any
* User actions for manual steps
* System events

## Schema

**Table: workflow_definitions**

| Field | Type | Description |
|----|----|----|
| id | UUID | Primary key |
| workflow_id | VARCHAR(255) | Unique business identifier for the workflow |
| name | VARCHAR(255) | Human-readable name |
| description | TEXT | Detailed description |
| version | VARCHAR(50) | Semantic version number |
| input_schema | JSONB | JSON Schema for workflow input |
| steps | JSONB | Ordered list of workflow steps |
| ui_components | JSONB | Workflow-level UI definitions |
| execution_log | JSONB | Logging configuration |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

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

* `workflow_definitions_workflow_id_idx` UNIQUE on `workflow_id` (for lookups)
* `workflow_instances_status_idx` on `status` (for finding workflows by status)
* `workflow_instances_correlation_idx` on `correlation_id` (for finding related workflows)
* `workflow_instances_definition_idx` on `workflow_definition_id` (for finding all instances of a definition)

**JSON Schema (steps field):**

```json
{
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "stepId": { "type": "string" },
      "taskId": { "type": "string" },
      "name": { "type": "string" },
      "description": { "type": "string" },
      "next": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "nextStepId": { "type": "string" },
            "condition": { "type": "string" }
          },
          "required": ["nextStepId"]
        }
      },
      "parallelBranches": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "branchId": { "type": "string" },
            "steps": { "type": "array" }
          }
        }
      },
      "retryPolicy": {
        "type": "object",
        "properties": {
          "maxAttempts": { "type": "number" },
          "delay": { "type": "string" },
          "strategy": { "type": "string" }
        }
      },
      "timeout": { "type": "string" },
      "onFailure": {
        "type": "object",
        "properties": {
          "action": { "type": "string" },
          "nextStepId": { "type": "string" },
          "errorHandler": {
            "type": "object",
            "properties": {
              "conditions": {
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "errorType": { "type": "string" },
                    "errorCode": { "type": "string" },
                    "nextStepId": { "type": "string" }
                  }
                }
              }
            }
          }
        }
      }
    },
    "required": ["stepId", "taskId"]
  }
}
```

**JSON Schema (workflow instance):**

```json
{
  "type": "object",
  "properties": {
    "id": { "type": "string", "format": "uuid" },
    "workflowDefinitionId": { "type": "string", "format": "uuid" },
    "status": { 
      "type": "string", 
      "enum": ["CREATED", "RUNNING", "COMPLETED", "FAILED", "CANCELLED", "WAITING_FOR_EVENT"] 
    },
    "input": { "type": "object" },
    "state": {
      "type": "object",
      "properties": {
        "variables": { "type": "object" },
        "currentStepId": { "type": "string" },
        "steps": {
          "type": "object",
          "additionalProperties": {
            "type": "object",
            "properties": {
              "status": { 
                "type": "string", 
                "enum": ["PENDING", "RUNNING", "COMPLETED", "FAILED"] 
              },
              "input": { "type": "object" },
              "output": { "type": "object" },
              "error": { "type": "object" },
              "startedAt": { "type": "string", "format": "date-time" },
              "completedAt": { "type": "string", "format": "date-time" }
            }
          }
        },
        "waitingForEvent": {
          "type": "object",
          "properties": {
            "eventPattern": { "type": "string" },
            "eventCondition": { "type": "string" },
            "since": { "type": "string", "format": "date-time" }
          },
          "required": ["eventPattern", "since"]
        }
      },
      "required": ["variables", "steps"]
    },
    "version": { "type": "integer" },
    "startedAt": { "type": "string", "format": "date-time" },
    "updatedAt": { "type": "string", "format": "date-time" },
    "completedAt": { "type": "string", "format": "date-time" },
    "correlationId": { "type": "string" },
    "triggerEventId": { "type": "string" },
    "cancellation": {
      "type": "object",
      "properties": {
        "reason": { "type": "string" },
        "requestedBy": { "type": "string" },
        "requestedAt": { "type": "string", "format": "date-time" },
        "source": { "type": "string", "enum": ["USER", "EVENT", "SYSTEM"] },
        "eventId": { "type": "string" }
      },
      "required": ["reason", "requestedBy", "requestedAt", "source"]
    },
    "compensationState": {
      "type": "object",
      "properties": {
        "status": { 
          "type": "string", 
          "enum": ["IN_PROGRESS", "COMPLETED", "COMPLETED_WITH_ERRORS"] 
        },
        "startedAt": { "type": "string", "format": "date-time" },
        "completedAt": { "type": "string", "format": "date-time" },
        "plan": { "type": "array", "items": { "type": "string" } },
        "completed": { "type": "array", "items": { "type": "string" } },
        "failed": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "stepId": { "type": "string" },
              "error": { "type": "string" },
              "timestamp": { "type": "string", "format": "date-time" }
            },
            "required": ["stepId", "error", "timestamp"]
          }
        }
      },
      "required": ["status", "startedAt", "plan", "completed", "failed"]
    },
    "error": { "type": "object" }
  },
  "required": ["id", "workflowDefinitionId", "status", "state", "version", "startedAt", "updatedAt"]
}
```

**Notes:**

* Workflow definitions are versioned to allow for evolution without breaking existing instances
* Workflow instances maintain their own copy of state to ensure durability
* The state field contains outputs from all completed steps, making it available to subsequent steps
* For complex workflows with many steps, consider indexing specific fields within the state JSONB
* Following our schema convention, all top-level fields from the JSON structure are represented as columns, while nested objects remain as JSONB


