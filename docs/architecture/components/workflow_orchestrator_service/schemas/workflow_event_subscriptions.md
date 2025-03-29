# Workflow Event Subscriptions

## Overview

Workflow Event Subscriptions define how running workflow instances register interest in specific events during execution. They enable workflows to pause execution while waiting for external events and resume when matching events are received, forming a foundational component of the event-driven workflow architecture.

## Key Concepts

* **Event Subscription** - A registration of interest in specific events by a workflow instance
* **Event Pattern** - The pattern that defines which events the subscription is interested in
* **Filter Condition** - An optional expression that further filters events beyond the pattern
* **Subscription Lifecycle** - The creation, matching, fulfillment, and timeout of subscriptions
* **Workflow Resumption** - The process of continuing workflow execution when a matching event is received
* **Timeout Handling** - The behavior when an expected event doesn't arrive within a specified time

## Workflow Event Subscription Structure

```json
{
  "id": "string",                        // Unique identifier for the subscription
  "workflowInstanceId": "string",        // ID of the workflow instance waiting for events
  "eventPattern": "string",              // Event pattern to match (e.g., "payment.received")
  "filterCondition": "string",           // Optional expression to filter events
  "timeoutAt": "string",                 // ISO timestamp when the subscription expires
  "status": "string",                    // Status of the subscription (active, fulfilled, expired)
  "createdAt": "string",                 // ISO timestamp when the subscription was created
  "fulfilledAt": "string",               // ISO timestamp when the subscription was fulfilled
  "fulfilledByEventId": "string",        // ID of the event that fulfilled this subscription
  "waitStepId": "string",                // ID of the workflow step that created this subscription
  "timeoutHandlerStepId": "string"       // Optional step to execute on timeout
}
```

## Event Matching and Filtering

Workflow event subscriptions use two levels of filtering to determine which events should resume a workflow:

* **Pattern Matching**: The primary filter that matches events based on their pattern
* **Condition Evaluation**: An optional secondary filter that evaluates expressions against the event payload

```json
{
  "eventPattern": "payment.received",
  "filterCondition": "event.payload.orderId === workflow.context.orderId && event.payload.amount >= workflow.context.expectedAmount"
}
```

The filter condition provides powerful capabilities:

* Access to event payload properties via the `event.payload` path
* Access to workflow variables via the `workflow.context` path
* Full expression support including logical operators, comparisons, and functions
* Type-safe property access and automatic type conversion

## Subscription Lifecycle

Workflow event subscriptions go through several stages during their lifecycle:


1. **Creation**: When a workflow reaches an event wait step, it creates a subscription
2. **Active**: The subscription remains active while waiting for matching events
3. **Fulfillment**: When a matching event arrives, the subscription is fulfilled
4. **Expiration**: If no matching event arrives before the timeout, the subscription expires

Each transition is recorded in the subscription data:

```json
{
  "id": "sub_01H8G5V2NXJZ9A",
  "workflowInstanceId": "wf_01H8G4T6M2H3B4",
  "eventPattern": "document.signed",
  "filterCondition": "event.payload.documentId === workflow.context.contractId",
  "status": "fulfilled",
  "createdAt": "2023-08-15T10:30:00Z",
  "fulfilledAt": "2023-08-15T14:22:15Z",
  "fulfilledByEventId": "evt_01H8G7P2J5K6L7",
  "waitStepId": "wait_for_signature",
  "timeoutHandlerStepId": "handle_signature_timeout"
}
```

## Timeout Configuration

Subscriptions can include timeout specifications to ensure workflows don't wait indefinitely:

* Timeout can be configured as an absolute timestamp or a relative duration
* When a timeout occurs, the workflow can execute a specific handler step
* Timeouts are implemented using the scheduler service to minimize processing overhead

Example timeout configuration:

```json
{
  "eventPattern": "shipping.delivered",
  "timeoutAt": "2023-09-01T00:00:00Z",
  "timeoutHandlerStepId": "handle_delivery_timeout"
}
```

## Workflow Resumption Process

When a matching event is received, the workflow resumption process:


1. Marks the subscription as fulfilled
2. Updates the workflow state with event data according to mapping configuration
3. Resumes the workflow execution from the next step after the wait step
4. Handles any cleanup operations (canceling timeouts, etc.)

```json
{
  "eventPayloadMapping": {
    "paymentId": "id",
    "paymentAmount": "amount",
    "paymentMethod": "method.type"
  }
}
```

## Database Schema

**Table: workflow_event_subscriptions**

| Field | Type | Description |
|----|----|----|
| id | UUID | Primary key |
| workflow_instance_id | UUID | Foreign key to workflow_instances table |
| event_pattern | VARCHAR(255) | Pattern of events to match |
| filter_condition | TEXT | Optional expression to filter events |
| status | VARCHAR(50) | Subscription status (active, fulfilled, expired) |
| timeout_at | TIMESTAMP | When the subscription expires |
| created_at | TIMESTAMP | Creation timestamp |
| fulfilled_at | TIMESTAMP | When the subscription was fulfilled (if applicable) |
| fulfilled_by_event_id | UUID | ID of the event that fulfilled this subscription |
| wait_step_id | VARCHAR(255) | ID of the workflow step that created this subscription |
| timeout_handler_step_id | VARCHAR(255) | Optional step to execute on timeout |

**Indexes:**

* `workflow_event_subscriptions_workflow_instance_id_idx` on `workflow_instance_id` (for finding subscriptions for a workflow)
* `workflow_event_subscriptions_pattern_status_idx` on `(event_pattern, status)` (for efficient event routing)
* `workflow_event_subscriptions_timeout_idx` on `(status, timeout_at)` (for timeout processing)
* `workflow_event_subscriptions_wait_step_idx` on `(workflow_instance_id, wait_step_id)` (for finding subscriptions by step)

## Performance Considerations

For workflow event subscriptions, consider these performance optimizations:

* Use an in-memory cache of active subscriptions for low-latency event matching
* Index event patterns for efficient subscription lookup
* Consider sharding or partitioning strategies for high-volume event processing
* Implement batch processing for subscription cleanup and timeout handling
* Use database connection pooling for subscription persistence operations

## Example Subscription

```json
{
  "id": "sub_01H8G5V2NXJZ9A",
  "workflowInstanceId": "wf_01H8G4T6M2H3B4",
  "eventPattern": "invoice.paid",
  "filterCondition": "event.payload.invoiceId === workflow.context.invoiceId && event.payload.status === 'paid'",
  "status": "active",
  "timeoutAt": "2023-09-15T00:00:00Z",
  "createdAt": "2023-08-15T10:30:00Z",
  "waitStepId": "wait_for_payment",
  "timeoutHandlerStepId": "send_payment_reminder"
}
```

## Related Documentation

* [Event Definitions](./event_definitions.md) - Schema for event definitions
* [Workflow Event Triggers](./workflow_event_triggers.md) - Schema for workflow event triggers
* [Workflow Definitions](./workflow_definitions.md) - Schema for workflow definitions
* [Workflow Instances](./workflow_instances.md) - Schema for workflow instances


