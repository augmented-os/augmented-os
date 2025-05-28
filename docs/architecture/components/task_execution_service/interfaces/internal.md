# Task Execution Service Internal Interfaces

## Overview

This document describes the internal interfaces used by the Task Execution Service for communication with other system components. These interfaces are not exposed externally and are intended for internal system integration only.

## Interface Types

The Task Execution Service uses the following types of internal interfaces:

* **Event Bus Interfaces**: Asynchronous publish/subscribe patterns
* **Direct Service Calls**: Synchronous API calls to other services
* **Internal API Endpoints**: For use by other system components

## Event Bus Interfaces

### Published Events

The Task Execution Service publishes the following events to the event bus:

| Event Type | Purpose | Schema |
|----|----|----|
| `task.created` | Signals that a new task has been created | [TaskCreatedEvent](../../../event_types/task_events.md#taskcreatedevent) |
| `task.started` | Signals that a task has started execution | [TaskStartedEvent](../../../event_types/task_events.md#taskstartedevent) |
| `task.completed` | Signals that a task has completed successfully | [TaskCompletedEvent](../../../event_types/task_events.md#taskcompletedevent) |
| `task.failed` | Signals that a task has failed | [TaskFailedEvent](../../../event_types/task_events.md#taskfailedevent) |
| `task.canceled` | Signals that a task has been canceled | [TaskCanceledEvent](../../../event_types/task_events.md#taskcanceledevent) |

### Subscribed Events

The Task Execution Service subscribes to the following events:

| Event Type | Purpose | Handler |
|----|----|----|
| `workflow.task_requested` | Receives requests to execute a task from the workflow orchestrator | `TaskRequestHandler` |
| `integration.response_received` | Receives responses from external systems via the integration service | `IntegrationResponseHandler` |
| `system.shutdown_requested` | Gracefully handles system shutdown events | `SystemEventHandler` |
| `system.maintenance_mode` | Adjusts processing behavior during maintenance | `SystemEventHandler` |

## Direct Service Calls

The Task Execution Service makes the following calls to other services:

| Service | Endpoint | Purpose |
|----|----|----|
| Auth Service | `/api/auth/validate-token` | Validates user tokens for task operations |
| Integration Service | `/api/integrations/{id}/invoke` | Executes integration tasks |
| Observability Service | `/api/tracing/span` | Reports tracing information |

## Internal Endpoints

The Task Execution Service exposes the following internal endpoints for other services:

| Endpoint | Purpose | Callers | Authentication |
|----|----|----|----|
| `POST /api/internal/tasks` | Create a new task instance | Workflow Orchestrator | Service-to-service JWT |
| `GET /api/internal/tasks/{taskId}` | Get task instance details | Workflow Orchestrator, UI Framework | Service-to-service JWT |
| `PUT /api/internal/tasks/{taskId}/status` | Update task status | Workflow Orchestrator | Service-to-service JWT |
| `POST /api/internal/tasks/{taskId}/cancel` | Cancel a running task | Workflow Orchestrator | Service-to-service JWT |
| `GET /api/internal/tasks/workflow/{workflowId}` | Get all tasks for a workflow | Workflow Orchestrator, UI Framework | Service-to-service JWT |
| `POST /api/internal/tasks/{taskId}/reassign` | Reassign a manual task | UI Framework | Service-to-service JWT |
| `GET /api/internal/tasks/user/{userId}` | Get tasks assigned to a user | UI Framework | Service-to-service JWT |
| `GET /api/internal/tasks/metrics` | Get task execution metrics | Monitoring Service | Service-to-service JWT |

## Task Queue Interface

The Task Execution Service implements a specialized task queue interface for efficient task distribution and execution:

### Queue Structure

| Queue Name | Purpose | Consumers | Priority |
|----|----|----|----|
| `task-execution-automated` | Queue for automated tasks | Automated Task Executor | Based on task priority |
| `task-execution-integration` | Queue for integration tasks | Integration Task Executor | Based on task priority |
| `task-execution-manual` | Queue for manual tasks | Manual Task Handler | Based on task priority |
| `task-execution-retry` | Queue for tasks scheduled for retry | All executors | Higher than standard queues |
| `task-execution-deadletter` | Dead letter queue for failed tasks | Error Handler Service | Highest |

### Queue Operations

| Operation | Description | Implementation |
|----|----|----|
| Enqueue | Add a task to the appropriate queue | Uses message attributes for routing and priority |
| Dequeue | Retrieve a task for execution | Implements visibility timeout for processing |
| Complete | Mark a task as completed | Removes from queue and publishes completion event |
| Fail | Mark a task as failed | Moves to retry queue or dead letter queue |
| Retry | Schedule a task for retry | Adds to retry queue with delay based on retry policy |
| Heartbeat | Extend visibility timeout | Prevents task timeout during long-running executions |

### Workflow Orchestrator Integration

The Task Queue Interface integrates with the Workflow Orchestrator through:


1. **Task Execution Requests**: Workflow Orchestrator enqueues tasks for execution
2. **Task Status Updates**: Task Execution Service reports task status back to Workflow Orchestrator
3. **Workflow Context Access**: Tasks can access workflow variables and context
4. **Correlation Tracking**: Correlation IDs link tasks to their parent workflows

```typescript
// Example task queue message structure
interface TaskQueueMessage {
  taskId: string;
  workflowId: string;
  taskType: 'AUTOMATED' | 'INTEGRATION' | 'MANUAL';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  executionConfig: {
    timeout: number;
    retryPolicy?: RetryPolicy;
    securityContext: SecurityContext;
  };
  input: Record<string, any>;
  correlationId: string;
  enqueueTime: string;
  visibilityTimeout: number;
  dequeueCount: number;
}
```

## Integration Service Interface

The Task Execution Service integrates with the Integration Service for executing integration tasks:

### Integration Execution

| Interface | Description | Protocol |
|----|----|----|
| Integration Execution | Execute integration tasks with external systems | REST API |
| Connection Management | Manage connections to external systems | REST API |
| Credential Resolution | Securely resolve credentials for integrations | REST API |

### Integration Types

The Integration Service supports the following integration types:

| Integration Type | Description | Task Execution Service Interaction |
|----|----|----|
| REST API | HTTP/HTTPS API integrations | Sends request parameters, receives response data |
| SOAP | SOAP web service integrations | Sends XML payload, receives XML response |
| Database | Database query and update operations | Sends query parameters, receives result sets |
| Message Queue | Publish/subscribe to message queues | Sends messages, receives acknowledgments |
| File Transfer | FTP, SFTP, S3 file operations | Sends file data, receives transfer status |
| Custom | Custom integration types | Sends custom parameters, receives custom responses |

## Event Schemas

### Task Instance Created

```json
{
  "type": "task.instance.created",
  "id": "uuid",
  "timestamp": "ISO-8601 timestamp",
  "data": {
    "taskId": "string",
    "workflowId": "string",
    "taskType": "string",
    "taskDefinitionId": "string",
    "status": "PENDING",
    "priority": "string",
    "createdAt": "ISO-8601 timestamp"
  },
  "metadata": {
    "correlationId": "uuid",
    "source": "task-execution-layer"
  }
}
```

### Task Instance Started

```json
{
  "type": "task.instance.started",
  "id": "uuid",
  "timestamp": "ISO-8601 timestamp",
  "data": {
    "taskId": "string",
    "workflowId": "string",
    "taskType": "string",
    "executorId": "string",
    "startTime": "ISO-8601 timestamp"
  },
  "metadata": {
    "correlationId": "uuid",
    "source": "task-execution-layer"
  }
}
```

### Task Instance Completed

```json
{
  "type": "task.instance.completed",
  "id": "uuid",
  "timestamp": "ISO-8601 timestamp",
  "data": {
    "taskId": "string",
    "workflowId": "string",
    "taskType": "string",
    "executorId": "string",
    "startTime": "ISO-8601 timestamp",
    "endTime": "ISO-8601 timestamp",
    "executionTime": "number",
    "outputSummary": "object"
  },
  "metadata": {
    "correlationId": "uuid",
    "source": "task-execution-layer"
  }
}
```

### Task Instance Failed

```json
{
  "type": "task.instance.failed",
  "id": "uuid",
  "timestamp": "ISO-8601 timestamp",
  "data": {
    "taskId": "string",
    "workflowId": "string",
    "taskType": "string",
    "executorId": "string",
    "startTime": "ISO-8601 timestamp",
    "endTime": "ISO-8601 timestamp",
    "errorCode": "string",
    "errorMessage": "string",
    "stackTrace": "string",
    "retryable": "boolean"
  },
  "metadata": {
    "correlationId": "uuid",
    "source": "task-execution-layer"
  }
}
```

### Task Instance Retry

```json
{
  "type": "task.instance.retry",
  "id": "uuid",
  "timestamp": "ISO-8601 timestamp",
  "data": {
    "taskId": "string",
    "workflowId": "string",
    "taskType": "string",
    "retryCount": "number",
    "maxRetries": "number",
    "retryDelay": "number",
    "nextRetryTime": "ISO-8601 timestamp",
    "lastErrorCode": "string",
    "lastErrorMessage": "string"
  },
  "metadata": {
    "correlationId": "uuid",
    "source": "task-execution-layer"
  }
}
```

### Task Manual Assigned

```json
{
  "type": "task.manual.assigned",
  "id": "uuid",
  "timestamp": "ISO-8601 timestamp",
  "data": {
    "taskId": "string",
    "workflowId": "string",
    "assigneeId": "string",
    "assigneeName": "string",
    "taskName": "string",
    "taskDescription": "string",
    "priority": "string",
    "dueDate": "ISO-8601 timestamp"
  },
  "metadata": {
    "correlationId": "uuid",
    "source": "task-execution-layer"
  }
}
```

## Error Handling

### Retry Policies

The Task Execution Service implements the following retry policies for internal communication:

| Interface Type | Retry Strategy | Backoff | Max Retries | Circuit Breaking |
|----|----|----|----|----|
| Event Publishing | At-least-once delivery | Exponential (100ms-30s) | 10 | Yes, 50% failure threshold |
| Service Calls | Retry with fallback | Exponential (200ms-60s) | 5 | Yes, 30% failure threshold |
| Task Queue Operations | At-least-once processing | Fixed (5s) | 3 | No |

### Fallback Mechanisms

When communication with dependent services fails, the following fallback mechanisms are used:

| Dependency | Fallback Approach | Impact |
|----|----|----|
| Workflow Orchestrator | Store status updates locally and retry | Delayed workflow progression |
| User Service | Use cached user data or default assignment rules | Potentially suboptimal task assignment |
| Integration Service | Queue integration requests locally | Delayed integration execution |
| Notification Service | Use alternative notification channels | Potential notification delays |
| Resource Service | Use default resource allocations | Potentially suboptimal resource usage |

## Related Documentation

* [Public API](./api.md)
* [Data Model](../data_model.md)
* [Task Router Implementation](../implementation/task_router.md)
* [Workflow Orchestrator Integration](../../workflow_orchestrator_service/interfaces/internal.md)
* [Integration Service Interface](../../integration_service/interfaces/internal.md)


