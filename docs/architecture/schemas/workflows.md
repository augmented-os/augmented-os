# Workflows

## Overview

Workflows are orchestrated sequences of tasks that accomplish a business process. They are designed to be:

* Composable from reusable tasks
* Event-driven or manually triggered
* Configurable with conditional logic and parallel execution
* Monitored and logged for audit purposes
* Resilient with built-in error handling
* Dynamic in their UI presentation

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
  "triggers": [                     // List of events that can trigger this workflow
    {
      "eventPattern": "string",     // Event pattern to match
      "description": "string",      // Description of when/why this triggers
      "transform": {               // Optional transform of event data to workflow input
        "type": "jmespath | jsonata",
        "expression": "string"
      }
    }
  ],
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
| triggers | JSONB | Event patterns that can trigger this workflow |
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
* `workflow_definitions_triggers_idx` GIN on `triggers` (for event matching)
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

**JSON Schema (state field in workflow_instances):**

```json
{
  "type": "object",
  "properties": {
    "input": { "type": "object" },
    "steps": {
      "type": "object",
      "additionalProperties": {
        "type": "object",
        "properties": {
          "status": { "type": "string" },
          "output": { "type": "object" },
          "error": { "type": "object" },
          "startedAt": { "type": "string" },
          "completedAt": { "type": "string" }
        }
      }
    },
    "variables": { "type": "object" }
  }
}
```

**Notes:**

* Workflow definitions are versioned to allow for evolution without breaking existing instances
* Workflow instances maintain their own copy of state to ensure durability
* The state field contains outputs from all completed steps, making it available to subsequent steps
* For complex workflows with many steps, consider indexing specific fields within the state JSONB
* Following our schema convention, all top-level fields from the JSON structure are represented as columns, while nested objects remain as JSONB


