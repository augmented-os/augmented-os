# Workflow Definitions

## Overview

Workflow definitions are templates that describe orchestrated sequences of tasks to accomplish a business process. They are designed to be:

* Composable from reusable tasks
* Event-driven or manually triggered
* Configurable with conditional logic and parallel execution
* Monitored and logged for audit purposes
* Resilient with built-in error handling
* Dynamic in their UI presentation

## Key Concepts

* **Workflow Definition** - A template that defines the structure and behavior of a workflow
* **Workflow Instance** - A single execution of a workflow definition
* **Steps** - Individual units of work within a workflow
* **Transitions** - Rules for moving between steps
* **State** - The current status and data of a workflow instance
* **Events** - External triggers that can start or affect workflows
* **Compensation** - Actions taken to clean up or roll back when workflows fail or are cancelled

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

## Database Schema

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

## Related Documentation

* [Workflow Instances](./workflow_instances.md) - Documentation for workflow instances
* [Tasks Schema](./tasks.md) - Documentation for task definitions and instances
* [Events Schema](./events.md) - Documentation for event definitions and instances
* [Database Architecture](../database_architecture.md) - Overall database architecture


