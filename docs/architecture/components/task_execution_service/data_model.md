# Task Execution Service Data Model

## Overview

The Task Execution Service primarily interacts with these data schemas:

<!-- List the primary schemas used by this component and link to their canonical definitions -->

* [Tasks Schema](../../schemas/tasks.md): For task definitions and instances
* [Workflows Schema](../../schemas/workflows.md): For workflow context and relationships
* [Integration Schema](../../schemas/integrations.md): For integration task configurations

This document focuses on how the Task Execution Service component specifically implements and extends the canonical schemas defined in the links above. For complete schema definitions, please refer to the linked documentation.

## Task Execution Service Implementation Details

The Task Execution Service extends the canonical schemas with additional implementation-specific structures and optimizations to support efficient task execution.

### Task Instance State Management

The Task Execution Service maintains detailed state information for each task instance:

```typescript
interface TaskInstance {
  id: string;                            // UUID for the instance
  taskDefinitionId: string;              // Reference to task definition
  workflowInstanceId?: string;           // Reference to parent workflow (if any)
  workflowDefinitionId?: string;         // Reference to workflow definition for efficient filtering
  status: TaskStatus;                    // Current execution status
  type: TaskType;                        // Type of task
  input: Record<string, any>;            // Input data provided for execution
  output?: Record<string, any>;          // Output data produced by execution
  error?: ErrorInfo;                     // Error information if failed
  executorId: string;                    // ID of the executor handling this task
  assignee?: string;                     // For manual tasks, the assigned user
  priority: TaskPriority;                // Execution priority
  retryCount: number;                    // Number of retry attempts
  retryPolicy?: RetryPolicy;             // How to handle failures
  executionMetadata: {                   // Execution-specific metadata
    startTime: string;                   // ISO timestamp
    endTime?: string;                    // ISO timestamp (if completed)
    duration?: number;                   // Execution duration in milliseconds
    executionEnvironment: string;        // Environment where task was executed
  };
  taskReference?: string;                // Universal reference identifier for UI display (e.g., company name, document title, entity name)
  version: number;                       // For optimistic concurrency control
  createdAt: string;                     // ISO timestamp
  updatedAt: string;                     // ISO timestamp
}

type TaskStatus = 
  'PENDING' | 
  'ASSIGNED' | 
  'RUNNING' | 
  'COMPLETED' | 
  'FAILED' | 
  'CANCELLED' | 
  'TIMED_OUT';

type TaskType = 
  'AUTOMATED' | 
  'MANUAL' | 
  'INTEGRATION';

type TaskPriority = 
  'LOW' | 
  'MEDIUM' | 
  'HIGH' | 
  'CRITICAL';

interface ErrorInfo {
  code: string;                          // Error code
  message: string;                       // Human-readable error message
  details?: Record<string, any>;         // Additional error details
  stackTrace?: string;                   // Stack trace (for development)
  timestamp: string;                     // When the error occurred
}

interface RetryPolicy {
  maxRetries: number;                    // Maximum number of retry attempts
  retryInterval: number;                 // Base interval between retries (ms)
  backoffMultiplier: number;             // Multiplier for exponential backoff
  maxRetryInterval?: number;             // Maximum retry interval (ms)
  retryableErrors?: string[];            // Error codes that trigger retries
}
```

### Task Definition Structure

The Task Execution Service uses the following structure for task definitions:

```typescript
interface TaskDefinition {
  id: string;                            // Unique identifier for the task
  name: string;                          // Human-readable name
  description: string;                   // Detailed description
  type: TaskType;                        // Type of task
  version: string;                       // Semantic version
  inputSchema: JSONSchema;               // JSON Schema for input validation
  outputSchema: JSONSchema;              // JSON Schema for output validation
  timeout: number;                       // Maximum execution time (ms)
  retryPolicy?: RetryPolicy;             // Default retry policy
  executionConfig: {                     // Configuration for execution
    executor: string;                    // Executor to use
    securityContext?: SecurityContext;   // Security requirements
    resourceRequirements?: ResourceRequirements; // Resource requirements
    environmentVariables?: Record<string, string>; // Environment variables
  };
  metadata?: Record<string, any>;        // Additional metadata
  createdAt: string;                     // ISO timestamp
  updatedAt: string;                     // ISO timestamp
}

interface SecurityContext {
  runAs?: string;                        // Identity to run as
  permissions: string[];                 // Required permissions
  securityLevel: 'LOW' | 'MEDIUM' | 'HIGH'; // Security level
}

interface ResourceRequirements {
  cpu: string;                           // CPU requirements (e.g., "0.5")
  memory: string;                        // Memory requirements (e.g., "512Mi")
  disk?: string;                         // Disk requirements (e.g., "1Gi")
  timeoutSeconds: number;                // Execution timeout in seconds
}
```

## Database Optimization

<!-- Describe any specific database optimizations or patterns -->
The Task Execution Service implements the following database optimizations:


1. **Task Status Indexing** - Indexes on task status for efficient querying of tasks by state
2. **Composite Indexes** - Composite indexes on workflowInstanceId + status for efficient workflow-related queries
3. **Workflow Definition Denormalization** - The workflow_definition_id is denormalized in task_instances to enable efficient filtering without joins
4. **Partitioning Strategy** - Tasks are partitioned by creation date for improved query performance
5. **Execution Metadata** - Frequently accessed execution metadata is denormalized for performance
6. **Archiving Strategy** - Completed tasks older than a configurable threshold are archived to maintain performance

## Related Schema Documentation

<!-- Link to related schema documentation -->

* [Tasks Schema](../../schemas/tasks.md)
* [Workflows Schema](../../schemas/workflows.md)
* [Integration Schema](../../schemas/integrations.md)
* [Task Router Implementation](./implementation/task_router.md)


