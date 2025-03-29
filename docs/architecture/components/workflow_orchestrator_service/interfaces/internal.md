# Workflow Orchestrator Internal Interfaces

## Overview

This document describes the internal interfaces that the Workflow Orchestrator Service uses to communicate with other system components. These interfaces are not exposed to external clients but are essential for the service's operation.

## Task Execution Service Interface

The Workflow Orchestrator Service communicates with the Task Execution Service to execute individual workflow steps.

### Task Execution Request

```typescript
interface TaskExecutionRequest {
  taskId: string;           // ID of the task to execute
  instanceId: string;       // ID of the workflow instance
  stepId: string;           // ID of the workflow step
  input: any;               // Input data for the task
  context: {                // Execution context
    workflowDefinitionId: string;
    correlationId?: string;
    retryCount: number;
    deadline?: string;      // ISO timestamp for task deadline
  };
  callbackUrl: string;      // URL to notify when task completes
}
```

Example:

```json
{
  "taskId": "payment_processing_task",
  "instanceId": "wf-inst-abcd1234",
  "stepId": "process_payment",
  "input": {
    "orderId": "ORD-12345",
    "amount": 99.99,
    "currency": "USD"
  },
  "context": {
    "workflowDefinitionId": "order-processing-wf",
    "correlationId": "ORD-12345",
    "retryCount": 0,
    "deadline": "2023-08-01T16:00:00Z"
  },
  "callbackUrl": "http://workflow-orchestrator/api/v1/internal/tasks/callback"
}
```

### Task Execution Response

```typescript
interface TaskExecutionResponse {
  status: 'COMPLETED' | 'FAILED' | 'TIMEOUT';
  output?: any;             // Result data (if completed)
  error?: {                 // Error details (if failed)
    code: string;
    message: string;
    details?: any;
    retryable: boolean;     // Whether the error is retryable
  };
  instanceId: string;       // ID of the workflow instance
  stepId: string;           // ID of the workflow step
  executionId: string;      // Unique ID for this task execution
  executionTime: number;    // Execution time in milliseconds
}
```

Example:

```json
{
  "status": "COMPLETED",
  "output": {
    "paymentId": "PAY-9876",
    "status": "authorized",
    "transactionId": "TXN-5678"
  },
  "instanceId": "wf-inst-abcd1234",
  "stepId": "process_payment",
  "executionId": "task-exec-efgh5678",
  "executionTime": 1250
}
```

## Event Processing Service Interface

The Workflow Orchestrator integrates with the Event Processing Service for event-based workflow interactions.

### Event Subscription

```typescript
interface EventSubscription {
  subscriberId: string;      // Unique ID for this subscription
  patterns: string[];        // Event patterns to subscribe to
  filter?: string;           // Optional filtering expression
  correlationId?: string;    // For correlation-based filtering
  callbackUrl: string;       // URL to notify when matching event occurs
  expirationTime?: string;   // When subscription expires (ISO timestamp)
}
```

Example:

```json
{
  "subscriberId": "workflow_wf-inst-abcd1234",
  "patterns": ["payment.received", "payment.failed"],
  "filter": "event.payload.orderId === 'ORD-12345'",
  "callbackUrl": "http://workflow-orchestrator/api/v1/internal/events/callback",
  "expirationTime": "2023-08-08T15:45:30Z"
}
```

### Event Notification

```typescript
interface EventNotification {
  eventId: string;           // Unique ID of the event
  pattern: string;           // Event pattern
  timestamp: string;         // When the event occurred (ISO timestamp)
  payload: any;              // Event data
  subscriberId: string;      // ID of the subscriber being notified
  subscriptionId: string;    // ID of the matching subscription
}
```

Example:

```json
{
  "eventId": "evt-12345",
  "pattern": "payment.received",
  "timestamp": "2023-08-01T16:15:30Z",
  "payload": {
    "orderId": "ORD-12345",
    "paymentId": "PAY-9876",
    "amount": 99.99,
    "status": "success"
  },
  "subscriberId": "workflow_wf-inst-abcd1234",
  "subscriptionId": "sub-67890"
}
```

## Scheduler Service Interface

The Workflow Orchestrator uses the Scheduler Service for time-based operations.

### Schedule Request

```typescript
interface ScheduleRequest {
  scheduleId: string;       // Unique ID for this schedule
  type: 'ONE_TIME' | 'RECURRING';
  executeAt: string;        // When to execute (ISO timestamp)
  cronExpression?: string;  // For recurring schedules
  timezone?: string;        // Timezone for cron (default: UTC)
  callbackUrl: string;      // URL to notify when schedule triggers
  payload: any;             // Data to include in callback
  retryPolicy?: {           // Optional retry configuration
    maxRetries: number;
    initialDelay: number;   // Milliseconds
    backoffMultiplier: number;
  };
}
```

Example:

```json
{
  "scheduleId": "sched-12345",
  "type": "ONE_TIME",
  "executeAt": "2023-08-02T10:00:00Z",
  "callbackUrl": "http://workflow-orchestrator/api/v1/internal/scheduler/callback",
  "payload": {
    "workflowInstanceId": "wf-inst-abcd1234",
    "stepId": "check_delivery_status",
    "operation": "timeout"
  },
  "retryPolicy": {
    "maxRetries": 3,
    "initialDelay": 5000,
    "backoffMultiplier": 2.0
  }
}
```

### Schedule Callback

```typescript
interface ScheduleCallback {
  scheduleId: string;       // ID of the triggered schedule
  executionTime: string;    // When schedule executed (ISO timestamp)
  payload: any;             // Original payload from schedule request
}
```

Example:

```json
{
  "scheduleId": "sched-12345",
  "executionTime": "2023-08-02T10:00:05Z",
  "payload": {
    "workflowInstanceId": "wf-inst-abcd1234",
    "stepId": "check_delivery_status",
    "operation": "timeout"
  }
}
```

## Database Interface

The Workflow Orchestrator Service uses the following tables and queries to interact with the database.

### Key Tables

* `workflow_definitions`: Stores workflow definitions
* `workflow_instances`: Stores workflow instance state
* `workflow_execution_history`: Stores execution history events
* `workflow_event_subscriptions`: Stores event subscriptions for active workflows

### Example Queries

#### Get Workflow Instance

```sql
SELECT * FROM workflow_instances WHERE id = $1
```

#### Update Workflow State with Optimistic Locking

```sql
UPDATE workflow_instances 
SET 
  state = $1,
  status = $2,
  updated_at = NOW(),
  version = version + 1
WHERE 
  id = $3 AND version = $4
```

#### Find Workflows Waiting for an Event

```sql
SELECT id 
FROM workflow_instances 
WHERE 
  status = 'WAITING_FOR_EVENT' AND
  state->'waitingForEvent'->>'eventPattern' = $1
```

## Metrics and Monitoring Interface

The Workflow Orchestrator Service exposes metrics and health endpoints for monitoring systems.

### Health Check Endpoint

```
GET /health
```

Returns the health status of the service.

### Metrics Endpoint

```
GET /metrics
```

Returns service metrics in Prometheus format.

Key metrics include:

* `workflow_instances_started_total`: Counter of workflow instances started
* `workflow_instances_completed_total`: Counter of workflow instances completed
* `workflow_instances_failed_total`: Counter of workflow instances failed
* `workflow_step_execution_time_seconds`: Histogram of step execution times
* `workflow_instances_active`: Gauge of currently active workflow instances
* `task_execution_requests_total`: Counter of task execution requests
* `event_subscriptions_active`: Gauge of active event subscriptions


