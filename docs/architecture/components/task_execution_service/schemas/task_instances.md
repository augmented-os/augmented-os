# Task Instances

## Overview

Task instances represent individual executions of task definitions within workflows. Each task instance tracks the current state, inputs, outputs, and execution metrics of a specific task as it runs. Task instances are created when a workflow step is executed and maintain a complete record of the task's activity and results.

## Key Concepts

* **Task Instance** - A single execution of a task definition within a workflow
* **Workflow Context** - The relationship between the task instance and its parent workflow
* **Task Status** - The current execution state of the task (pending, running, completed, failed)
* **Task Assignment** - For manual tasks, who is responsible for completing the task
* **Task Results** - The outputs or errors produced by the task execution

## Relationship to Task Definitions

Each task instance is created from a task definition template:

* The task definition provides the structure, implementation details, and expected I/O format
* The task instance contains the runtime state, actual inputs/outputs, and execution history
* Multiple instances can be created from the same task definition
* Instances maintain a reference to their definition but operate independently

## Task Instance Structure

```json
{
  "id": "string",                    // UUID for the instance
  "workflow_instance_id": "string",  // Reference to parent workflow instance
  "step_id": "string",               // Step identifier within workflow
  "task_definition_id": "string",    // Reference to task definition
  "status": "string",                // Current execution status
  "input": {},                       // Input data provided to this task
  "output": {},                      // Output data produced by this task
  "error": {},                       // Error details if task failed
  "started_at": "string",            // ISO timestamp when execution started
  "completed_at": "string",          // ISO timestamp when execution completed
  "assignee_type": "string",         // For manual tasks: role, user, etc.
  "assignee_id": "string",           // For manual tasks: specific assignee
  "due_at": "string"                 // For manual tasks: deadline
}
```

## Task Status Values

Task instances can have the following status values:

* `PENDING`: Task has been created but execution has not started
* `RUNNING`: Task is actively executing
* `COMPLETED`: Task has successfully completed execution
* `FAILED`: Task has encountered an error and failed to complete
* `CANCELLED`: Task was manually or automatically cancelled
* `WAITING`: Task is waiting for an external event or human interaction

## Manual Task Assignment

For manual tasks, the assignment information determines who can interact with the task:

* `assignee_type` specifies the type of entity assigned (user, role, department, etc.)
* `assignee_id` identifies the specific entity
* Assignment can be determined by:
  * Static configuration in the task definition
  * Dynamic rules based on the workflow context or input data
  * Manual assignment by a workflow administrator
  * Auto-assignment based on workload balancing

## Error Handling

When a task fails, the error field captures detailed information about the failure:

```json
{
  "error": {
    "code": "string",              // Error code for programmatic handling
    "message": "string",           // Human-readable error message
    "details": {},                 // Additional error context
    "stack": "string",             // Stack trace if available
    "occurred_at": "string",       // ISO timestamp when error occurred
    "recovery_attempts": [         // Record of recovery attempts
      {
        "attempt": 1,
        "timestamp": "string",
        "result": "string"
      }
    ]
  }
}
```

## Examples

Example of a completed automated task instance:

```json
{
  "id": "f8c3de3d-1fea-4d7c-a8b0-29f63c4c3454",
  "workflow_instance_id": "a1b2c3d4-5678-90ab-cdef-11111111111",
  "step_id": "create_invoice",
  "task_definition_id": "e7d6c5b4-a321-4567-90ab-22222222222",
  "status": "COMPLETED",
  "input": {
    "contact_id": "CONT123",
    "line_items": [
      {
        "description": "Professional services",
        "quantity": 10,
        "unit_amount": 150
      }
    ]
  },
  "output": {
    "invoice_id": "INV-2023-001",
    "invoice_number": "2023-001",
    "status": "DRAFT"
  },
  "started_at": "2023-05-10T14:30:00Z",
  "completed_at": "2023-05-10T14:30:05Z"
}
```

Example of a pending manual task instance:

```json
{
  "id": "a7b8c9d0-1234-5678-90ab-33333333333",
  "workflow_instance_id": "a1b2c3d4-5678-90ab-cdef-11111111111",
  "step_id": "review_invoice",
  "task_definition_id": "f9e8d7c6-4321-8765-ba09-44444444444",
  "status": "PENDING",
  "input": {
    "invoice_id": "INV-2023-001",
    "amount": 1500,
    "customer": "Acme Corp"
  },
  "assignee_type": "role",
  "assignee_id": "finance_manager",
  "due_at": "2023-05-12T17:00:00Z"
}
```

## Database Schema

**Table: task_instances**

| Field | Type | Description |
|----|----|----|
| id | UUID | Primary key |
| workflow_instance_id | UUID | Reference to workflow instance |
| step_id | VARCHAR(255) | Step identifier within workflow |
| task_definition_id | UUID | Reference to task definition |
| status | VARCHAR(50) | Current status (pending, running, completed, failed) |
| input | JSONB | Input data provided to this task |
| output | JSONB | Output data produced by this task |
| error | JSONB | Error details if task failed |
| started_at | TIMESTAMP | When task execution started |
| completed_at | TIMESTAMP | When task execution completed |
| assignee_type | VARCHAR(50) | For manual tasks: role, user, etc. |
| assignee_id | VARCHAR(255) | For manual tasks: specific assignee |
| due_at | TIMESTAMP | For manual tasks: deadline |

**Indexes:**

* `task_instances_workflow_idx` on `workflow_instance_id` (for finding all tasks in a workflow)
* `task_instances_status_idx` on `status` (for finding tasks by status)
* `task_instances_assignee_idx` on `(assignee_type, assignee_id)` (for finding tasks assigned to someone)

## Performance Considerations

For task instances, consider these performance optimizations:

* Create indices on frequently queried fields, especially status and assignee fields
* Implement pagination when retrieving large sets of task instances
* Consider retention policies for completed task instances to manage database growth
* Use appropriate JSONB indexing for filtering based on input or output fields
* Implement monitoring for long-running tasks to detect potential issues

## Related Documentation

* [Task Definitions](./task_definitions.md) - Documentation for task definitions
* [Workflow Instances](./workflow_instances.md) - Documentation for workflow instances
* [Workflow Definitions](./workflow_definitions.md) - Documentation for workflow definitions
* [Event Definitions](./event_definitions.md) - Documentation for event definitions


