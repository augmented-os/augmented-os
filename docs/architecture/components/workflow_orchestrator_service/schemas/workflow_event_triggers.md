# Workflow Event Triggers

## Overview

Workflow Event Triggers define the relationship between events and workflows in the system. They specify which events should trigger specific workflows, enabling an event-driven architecture where workflows can be automatically started or canceled in response to business events. This schema is a core component of the event-driven workflow orchestration system.

## Key Concepts

* **Workflow Event Trigger** - A configuration that connects an event pattern to a specific workflow
* **Event Pattern** - A string that identifies the type of event (e.g., "bookings.created")
* **Trigger Type** - Specifies whether the event should start or cancel a workflow
* **Event Condition** - Optional expression to filter events based on their payload
* **Input Mapping** - Rules for transforming event data into workflow input
* **Correlation** - Mechanism for associating related events and workflows

## Workflow Event Trigger Structure

```json
{
  "id": "string",                          // Unique identifier for this trigger
  "workflowDefinitionId": "string",        // The workflow to trigger
  "eventPattern": "string",                // Event pattern to subscribe to
  "triggerType": "START | CANCEL",         // Whether to start or cancel a workflow
  "eventCondition": "string",              // Optional condition expression
  "inputMapping": {                        // Maps event data to workflow input
    "workflowField1": "event.payload.field1",
    "workflowField2": "event.metadata.field2"
  },
  "correlationKey": "string",              // For correlating related workflows
  "enabled": true,                         // Whether this trigger is active
  "priority": 1,                           // Processing priority (lower = higher priority)
  "description": "string",                 // Human-readable description
  "createdAt": "string",                   // ISO timestamp
  "updatedAt": "string"                    // ISO timestamp
}
```

## Event Pattern Matching

Event patterns determine which events will activate a workflow trigger. Patterns can be:

* **Exact Match**: Matches only events with the exact pattern (e.g., "invoice.created")
* **Wildcard Match**: Uses wildcards to match multiple event types (e.g., "invoice.\*")
* **Hierarchical Match**: Matches based on event hierarchy (e.g., "finance.invoice.created")

Example event pattern configurations:

```json
{
  "eventPattern": "bookings.created",      // Matches only booking creation events
  "eventPattern": "bookings.*",            // Matches all booking-related events
  "eventPattern": "*.created",             // Matches all creation events
  "eventPattern": "finance.*.approved"     // Matches all approval events in finance domain
}
```

## Event Conditions

Event conditions provide fine-grained control over when workflows are triggered based on event payload data:

```json
{
  "eventCondition": "event.payload.amount > 1000",  // Only trigger for high-value amounts
  "eventCondition": "event.metadata.priority == 'high'", // Only trigger for high priority events
  "eventCondition": "event.payload.status == 'approved' && event.payload.region == 'EMEA'" // Multiple conditions
}
```

Each condition is evaluated against the event data using a simple expression language that supports:

* Logical operators (&&, ||, !)
* Comparison operators (==, !=, >, <, >=, <=)
* Path-based data access (event.payload.field, event.metadata.field)
* Built-in functions like exists(), isEmpty(), contains()

## Input Mapping

Input mapping allows transformation of event data into the format expected by the workflow:

```json
{
  "inputMapping": {
    "orderId": "event.payload.order_id",             // Direct field mapping
    "customer": "event.payload.customer_details",    // Object mapping
    "priority": "event.metadata.priority || 'normal'", // Default value if missing
    "totalAmount": "event.payload.items.reduce((sum, item) => sum + item.price, 0)" // Computed value
  }
}
```

Input mapping supports:

* Direct field mapping from event to workflow input
* Default values when event fields are missing
* Simple transformations and computations
* Accessing nested properties with dot notation

## Correlation Keys

Correlation keys enable grouping related workflow instances:

```json
{
  "correlationKey": "event.payload.order_id",       // Group workflows by order ID
  "correlationKey": "event.metadata.correlationId", // Use system correlation ID
  "correlationKey": "event.payload.customer.id"     // Group by customer
}
```

Correlation is useful for:

* Identifying all workflows associated with a business entity
* Preventing duplicate workflow instances
* Canceling related workflows when specific events occur

## Database Schema

**Table: workflow_event_triggers**

| Field | Type | Description |
|----|----|----|
| id | UUID | Primary key |
| workflow_definition_id | UUID | Foreign key to workflow_definitions |
| event_pattern | VARCHAR(255) | Event pattern to subscribe to |
| trigger_type | VARCHAR(50) | 'START' or 'CANCEL' |
| event_condition | TEXT | Optional condition expression |
| input_mapping | JSONB | Maps event data to workflow input |
| correlation_key | VARCHAR(255) | For correlating related workflows |
| enabled | BOOLEAN | Whether this trigger is active |
| priority | INTEGER | Processing priority |
| description | TEXT | Human-readable description |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last updated timestamp |

**Indexes:**

* `workflow_event_triggers_workflow_idx` on `workflow_definition_id` (for looking up triggers by workflow)
* `workflow_event_triggers_event_pattern_idx` on `event_pattern` (for matching events to triggers)
* `workflow_event_triggers_enabled_priority_idx` on `(enabled, priority)` (for selecting active triggers by priority)

## Example Trigger Definitions

### Start a Customer Onboarding Workflow

```json
{
  "id": "97f4bfd6-c876-4e32-9b2a-7318f0ea8902",
  "workflowDefinitionId": "customer-onboarding-v1",
  "eventPattern": "customers.created",
  "triggerType": "START",
  "eventCondition": "event.payload.accountType == 'enterprise'",
  "inputMapping": {
    "customerId": "event.payload.id",
    "customerName": "event.payload.companyName",
    "contactEmail": "event.payload.primaryContact.email",
    "region": "event.payload.region",
    "assignedRepId": "event.payload.accountManager.id"
  },
  "correlationKey": "event.payload.id",
  "enabled": true,
  "priority": 10,
  "description": "Start customer onboarding workflow for new enterprise customers",
  "createdAt": "2023-06-15T14:22:19Z",
  "updatedAt": "2023-06-15T14:22:19Z"
}
```

### Cancel an Approval Workflow

```json
{
  "id": "6124eb84-1f4a-42cd-ba44-db48c12b7f99",
  "workflowDefinitionId": "purchase-approval-v2",
  "eventPattern": "purchases.cancelled",
  "triggerType": "CANCEL",
  "eventCondition": null,
  "inputMapping": null,
  "correlationKey": "event.payload.purchaseRequestId",
  "enabled": true,
  "priority": 5,
  "description": "Cancel any active approval workflows when purchase request is cancelled",
  "createdAt": "2023-07-21T09:11:45Z",
  "updatedAt": "2023-07-21T09:11:45Z"
}
```

## Performance Considerations

For workflow event triggers, consider these performance optimizations:

* **Index Event Patterns** - Properly index event patterns for efficient subscription matching
* **Optimize Condition Expressions** - Keep condition expressions simple to avoid performance degradation
* **Use Selective Event Conditions** - Be specific with conditions to reduce unnecessary workflow executions
* **Balance Trigger Priorities** - Use priorities strategically to control execution order and resource allocation
* **Monitor Trigger Performance** - Track trigger evaluation time and optimize conditions that take too long to evaluate

## Related Documentation

* [Event Definitions Schema](./event_definitions.md) - Documentation for event definitions
* [Event Instances Schema](./event_instances.md) - Documentation for event instances
* [Workflow Definitions Schema](./workflow_definitions.md) - Documentation for workflow definitions
* [Workflow Instances Schema](./workflow_instances.md) - Documentation for workflow instances
* [Event Processing Service](../components/event_processing_service/data_model.md) - Event processing service implementation
* [Workflow Event Trigger Registry](../components/event_processing_service/implementation/trigger_registry.md) - Implementation details for trigger registry


