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
  "task_definition_id": "string",    // Reference to task definition
  "workflow_instance_id": "string",  // Reference to parent workflow instance (optional)
  "workflow_definition_id": "string", // Reference to workflow definition for efficient filtering (optional)
  "step_id": "string",               // Step identifier within workflow
  "status": "string",                // Current execution status (task_status enum: PENDING, ASSIGNED, RUNNING, COMPLETED, FAILED, CANCELLED, TIMED_OUT)
  "type": "string",                  // Type of task (task_type enum: AUTOMATED, MANUAL, INTEGRATION)
  "input": {},                       // Input data provided for execution
  "output": {},                      // Output data produced by execution (optional)
  "error": {},                       // Error information if failed (optional)
  "executor_id": "string",           // ID of the executor handling this task
  "assignee": "string",              // For manual tasks, the assigned user (optional)
  "priority": "string",              // Execution priority (task_priority enum: LOW, MEDIUM, HIGH, CRITICAL)
  "retry_count": 0,                  // Number of retry attempts
  "retry_policy": {},                // How to handle failures (optional)
  "execution_metadata": {            // Execution-specific metadata
    "start_time": "string",          // ISO timestamp
    "end_time": "string",            // ISO timestamp (if completed, optional)
    "duration": 0,                   // Execution duration in milliseconds (optional)
    "execution_environment": "string" // Environment where task was executed
  },
  "version": 1,                      // For optimistic concurrency control
  "created_at": "string",            // ISO timestamp (TIMESTAMPTZ)
  "updated_at": "string"             // ISO timestamp (TIMESTAMPTZ)
}
```

## Task Status Values

Task instances can have the following status values:

* `PENDING`: Task has been created but execution has not started
* `ASSIGNED`: Task has been assigned to an executor but not yet started
* `RUNNING`: Task is actively executing
* `COMPLETED`: Task has successfully completed execution
* `FAILED`: Task has encountered an error and failed to complete
* `CANCELLED`: Task was manually or automatically cancelled
* `TIMED_OUT`: Task exceeded its maximum execution time

## Task Type Values

Task instances can be of the following types:

* `AUTOMATED`: Fully automated tasks that execute without human intervention
* `MANUAL`: Tasks that require human interaction to complete
* `INTEGRATION`: Tasks that interact with external systems or services

## Task Priority Values

Task instances can have the following priority levels:

* `LOW`: Low priority tasks that can be executed when resources are available
* `MEDIUM`: Standard priority tasks (default)
* `HIGH`: High priority tasks that should be executed before lower priority tasks
* `CRITICAL`: Critical tasks that must be executed immediately

## Retry Policy Structure

For tasks that support retries, the retry policy defines how failures should be handled:

```json
{
  "retry_policy": {
    "max_retries": 3,                    // Maximum number of retry attempts
    "retry_interval": 1000,              // Base interval between retries (ms)
    "backoff_multiplier": 2.0,           // Multiplier for exponential backoff
    "max_retry_interval": 30000,         // Maximum retry interval (ms, optional)
    "retryable_errors": ["TIMEOUT", "NETWORK_ERROR"] // Error codes that trigger retries (optional)
  }
}
```

## Execution Metadata Structure

The execution metadata tracks detailed information about task execution:

```json
{
  "execution_metadata": {
    "start_time": "2023-05-10T14:30:00Z",     // When execution started
    "end_time": "2023-05-10T14:30:05Z",       // When execution completed (optional)
    "duration": 5000,                         // Duration in milliseconds (optional)
    "execution_environment": "prod-worker-01" // Environment identifier
  }
}
```

## Manual Task Assignment

For manual tasks, the assignment information determines who can interact with the task:

* `assignee` specifies the user, role, or entity assigned to complete the task
* Assignment can be determined by:
  * Static configuration in the task definition
  * Dynamic rules based on the workflow context or input data
  * Manual assignment by a workflow administrator
  * Auto-assignment based on workload balancing

Note: The specific format and interpretation of the assignee field depends on the implementation. It could contain user IDs, role names, email addresses, or other identifiers as appropriate for the system.

## Error Handling

When a task fails, the error field captures detailed information about the failure:

```json
{
  "error": {
    "code": "string",              // Error code for programmatic handling
    "message": "string",           // Human-readable error message
    "details": {},                 // Additional error details (optional)
    "stack_trace": "string",       // Stack trace for development (optional)
    "timestamp": "string"          // ISO timestamp when the error occurred
  }
}
```

## Examples

Example of a completed automated task instance:

```json
{
  "id": "f8c3de3d-1fea-4d7c-a8b0-29f63c4c3454",
  "task_definition_id": "e7d6c5b4-a321-4567-90ab-22222222222",
  "workflow_instance_id": "a1b2c3d4-5678-90ab-cdef-11111111111",
  "workflow_definition_id": "b2c3d4e5-6789-01ab-cdef-22222222222",
  "step_id": "create_invoice",
  "status": "COMPLETED",
  "type": "INTEGRATION",
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
  "executor_id": "integration-worker-01",
  "priority": "MEDIUM",
  "retry_count": 0,
  "execution_metadata": {
    "start_time": "2023-05-10T14:30:00Z",
    "end_time": "2023-05-10T14:30:05Z",
    "duration": 5000,
    "execution_environment": "prod-integration-cluster"
  },
  "version": 1,
  "created_at": "2023-05-10T14:29:55Z",
  "updated_at": "2023-05-10T14:30:05Z"
}
```

Example of a pending manual task instance:

```json
{
  "id": "a7b8c9d0-1234-5678-90ab-33333333333",
  "task_definition_id": "f9e8d7c6-4321-8765-ba09-44444444444",
  "workflow_instance_id": "a1b2c3d4-5678-90ab-cdef-11111111111",
  "workflow_definition_id": "b2c3d4e5-6789-01ab-cdef-22222222222",
  "step_id": "review_invoice",
  "status": "PENDING",
  "type": "MANUAL",
  "input": {
    "invoice_id": "INV-2023-001",
    "amount": 1500,
    "customer": "Acme Corp"
  },
  "executor_id": "manual-task-queue",
  "assignee": "finance_manager",
  "priority": "HIGH",
  "retry_count": 0,
  "execution_metadata": {
    "start_time": "2023-05-10T14:30:10Z",
    "execution_environment": "manual-task-system"
  },
  "version": 1,
  "created_at": "2023-05-10T14:30:10Z",
  "updated_at": "2023-05-10T14:30:10Z"
}
```

## Database Schema

**Enums:**

```sql
-- Task status enum
CREATE TYPE task_status AS ENUM (
  'PENDING',
  'ASSIGNED', 
  'RUNNING',
  'COMPLETED',
  'FAILED',
  'CANCELLED',
  'TIMED_OUT'
);

-- Task type enum
CREATE TYPE task_type AS ENUM (
  'AUTOMATED',
  'MANUAL', 
  'INTEGRATION'
);

-- Task priority enum
CREATE TYPE task_priority AS ENUM (
  'LOW',
  'MEDIUM',
  'HIGH', 
  'CRITICAL'
);
```

**Table: task_instances**

| Field | Type | Description |
|----|----|----|
| id | UUID | Primary key |
| task_definition_id | UUID | Reference to task definition (NOT NULL) |
| workflow_instance_id | UUID | Reference to workflow instance (nullable) |
| workflow_definition_id | UUID | Reference to workflow definition for efficient filtering (nullable) |
| step_id | VARCHAR(255) | Step identifier within workflow (NOT NULL) |
| status | task_status | Current execution status (NOT NULL) |
| type | task_type | Type of task (NOT NULL) |
| input | JSONB | Input data provided for execution (NOT NULL) |
| output | JSONB | Output data produced by execution (nullable) |
| error | JSONB | Error information if failed (nullable) |
| executor_id | VARCHAR(255) | ID of the executor handling this task (NOT NULL) |
| assignee | VARCHAR(255) | For manual tasks, the assigned user (nullable) |
| priority | task_priority | Execution priority (NOT NULL, DEFAULT 'MEDIUM') |
| retry_count | INTEGER | Number of retry attempts (NOT NULL, DEFAULT 0) |
| retry_policy | JSONB | How to handle failures (nullable) |
| execution_metadata | JSONB | Execution-specific metadata (NOT NULL) |
| version | INTEGER | For optimistic concurrency control (NOT NULL, DEFAULT 1) |
| created_at | TIMESTAMPTZ | Creation timestamp (NOT NULL, DEFAULT NOW()) |
| updated_at | TIMESTAMPTZ | Last update timestamp (NOT NULL, DEFAULT NOW()) |

**Constraints:**

```sql
-- Primary key
ALTER TABLE task_instances ADD CONSTRAINT task_instances_pkey PRIMARY KEY (id);

-- Foreign key constraints
ALTER TABLE task_instances 
  ADD CONSTRAINT fk_task_instances_task_definition 
  FOREIGN KEY (task_definition_id) REFERENCES task_definitions(id);

ALTER TABLE task_instances 
  ADD CONSTRAINT fk_task_instances_workflow_instance 
  FOREIGN KEY (workflow_instance_id) REFERENCES workflow_instances(id);

ALTER TABLE task_instances 
  ADD CONSTRAINT fk_task_instances_workflow_definition 
  FOREIGN KEY (workflow_definition_id) REFERENCES workflow_definitions(id);

-- Check constraints
ALTER TABLE task_instances 
  ADD CONSTRAINT check_retry_count_non_negative 
  CHECK (retry_count >= 0);

ALTER TABLE task_instances 
  ADD CONSTRAINT check_version_positive 
  CHECK (version > 0);

-- Automatic timestamp update trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_task_instances_updated_at 
  BEFORE UPDATE ON task_instances 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

**Indexes:**

```sql
-- Basic indexes
CREATE INDEX task_instances_task_definition_idx ON task_instances (task_definition_id);
CREATE INDEX task_instances_workflow_idx ON task_instances (workflow_instance_id);
CREATE INDEX task_instances_workflow_definition_idx ON task_instances (workflow_definition_id);
CREATE INDEX task_instances_status_idx ON task_instances (status);
CREATE INDEX task_instances_type_idx ON task_instances (type);
CREATE INDEX task_instances_executor_idx ON task_instances (executor_id);
CREATE INDEX task_instances_assignee_idx ON task_instances (assignee);
CREATE INDEX task_instances_priority_idx ON task_instances (priority);

-- Composite indexes for common query patterns
CREATE INDEX task_instances_status_priority_idx ON task_instances (status, priority);
CREATE INDEX task_instances_workflow_status_idx ON task_instances (workflow_instance_id, status);
CREATE INDEX task_instances_workflow_def_status_idx ON task_instances (workflow_definition_id, status);
CREATE INDEX task_instances_type_status_idx ON task_instances (type, status);
CREATE INDEX task_instances_created_at_idx ON task_instances (created_at);

-- JSONB indexes for nested data queries
CREATE INDEX task_instances_input_gin_idx ON task_instances USING GIN (input);
CREATE INDEX task_instances_output_gin_idx ON task_instances USING GIN (output);
CREATE INDEX task_instances_error_gin_idx ON task_instances USING GIN (error);
CREATE INDEX task_instances_execution_metadata_gin_idx ON task_instances USING GIN (execution_metadata);

-- Specific JSONB field indexes for common queries
CREATE INDEX task_instances_error_code_idx ON task_instances 
  USING BTREE ((error->>'code')) WHERE error IS NOT NULL;
CREATE INDEX task_instances_start_time_idx ON task_instances 
  USING BTREE ((execution_metadata->>'start_time'));
```

## Performance Considerations

For task instances, consider these performance optimizations:

* **Strategic Indexing**: Create indices on frequently queried fields including status, type, priority, executor_id, and assignee
* **Composite Indexes**: Use composite indexes for common query patterns like `(status, priority)` for priority queuing and `(workflow_instance_id, status)` for workflow-related queries
* **Workflow Definition Denormalization**: The `workflow_definition_id` field is denormalized from the workflow instance relationship to enable efficient filtering by workflow type without expensive joins
* **JSONB Optimization**: Consider GIN indexes on JSONB fields (input, output, error, execution_metadata) for filtering based on nested data
* **Pagination**: Implement pagination when retrieving large sets of task instances, especially for status-based queries
* **Retention Policies**: Consider retention policies for completed task instances to manage database growth
* **Partitioning**: For high-volume systems, consider partitioning by creation date or workflow_instance_id
* **Monitoring**: Implement monitoring for long-running tasks using execution_metadata timestamps to detect potential issues
* **Optimistic Concurrency**: Use the version field for optimistic concurrency control to prevent race conditions during updates
* **Query Optimization**: Leverage the priority and type fields for efficient task routing and execution planning

## Related Documentation

* [Task Definitions](./task_definitions.md) - Documentation for task definitions
* [Workflow Instances](../../workflow_orchestrator_service/schemas/workflow_instances.md) - Documentation for workflow instances
* [Workflow Definitions](../../workflow_orchestrator_service/schemas/workflow_definitions.md) - Documentation for workflow definitions
* [Event Definitions](../../event_processing_service/schemas/event_definitions.md) - Documentation for event definitions



