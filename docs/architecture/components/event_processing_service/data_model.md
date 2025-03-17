# Event Processing Service Data Model

## Overview

The Event Processing Service primarily interacts with these data schemas:

* [Event Definitions Schema](../../schemas/event_definitions.md): Defines the structure and metadata for event types within the system
* [Event Instances Schema](../../schemas/event_instances.md): Represents concrete occurrences of business events
* [Workflow Event Triggers Schema](https://../../schemas/workflow_event_triggers.md): Used for workflow event trigger integration

This document focuses on how the Event Processing Service component specifically implements and extends the canonical schemas defined in the links above. For complete schema definitions, please refer to the linked documentation.

## Event Processing Service Implementation Details

The Event Processing Service extends the canonical schemas with additional implementation-specific structures and optimizations to support event processing, routing, and delivery requirements.

### Event Definition Management

The service maintains and manages event definitions that serve as contracts for all events in the system:

```typescript
interface EventDefinition {
  event_id: string;           // Unique business identifier (e.g., "BookingEvents.created")
  name: string;               // Human-readable name
  description: string;        // Detailed description
  pattern: string;            // Event pattern for routing (e.g., "bookings.created") 
  version: string;            // Schema version (semver format)
  source_types: string[];     // Valid origins for this event type
  payload_schema: object;     // JSON Schema for payload validation
  examples: object[];         // Example payloads for documentation
  ui_metadata: {              // Display information for event tools
    icon: string;             // Icon identifier
    color: string;            // Color in hex or named format
    category: string;         // Functional category
    priority: string;         // Display priority (high, medium, low)
  };
  status: string;             // Status (active, deprecated, draft)
  created_at: string;         // ISO timestamp
  updated_at: string;         // ISO timestamp
}
```

### Event Instance Structure

Event instances represent actual occurrences of events in the system:

```typescript
interface EventInstance {
  eventId: string;           // UUID for this specific event instance
  pattern: string;           // Event pattern (e.g., "invoice.created")
  version: string;           // Schema version this instance conforms to
  source: {                  // Origin of the event
    type: string;            // "workflow" | "task" | "integration" | "external"
    id: string;              // Identifier of the source
    name: string;            // Human-readable source name
  };
  timestamp: string;         // ISO8601 timestamp with millisecond precision
  payload: object;           // Event-specific data following the schema
  metadata: {                // Additional context information
    correlationId: string;   // For tracing related events
    causationId: string;     // ID of event that directly caused this one
    traceId: string;         // For distributed tracing
    userId: string;          // User who triggered the event (if applicable)
    context: {               // Business context
      type: string;          // "client" | "user" | "global"
      id: string;            // Context-specific identifier
    };
    tags: Record<string, string>; // Additional searchable metadata
  };
}
```

### Workflow Event Trigger Structure

The service manages workflow event triggers that define when workflows should be started:

```typescript
interface WorkflowEventTrigger {
  id: string;                          // Unique identifier for this trigger
  workflowDefinitionId: string;        // The workflow to trigger
  eventPattern: string;                // Event pattern to subscribe to
  triggerType: 'START' | 'CANCEL';     // Whether to start or cancel a workflow
  eventCondition?: string;             // Optional condition expression
  inputMapping?: Record<string, string>; // Maps event data to workflow input
  correlationKey?: string;             // For correlating related workflows
  enabled: boolean;                    // Whether this trigger is active
  priority?: number;                   // Processing priority (lower = higher priority)
  description?: string;                // Human-readable description
  createdAt: string;                   // ISO timestamp
  updatedAt: string;                   // ISO timestamp
}
```

## Database Schema

### Event Definitions Table

**Table: event_definitions**

| Field | Type | Description |
|----|----|----|
| id | UUID | Primary key |
| event_id | VARCHAR(255) | Unique business identifier for the event type |
| name | VARCHAR(255) | Human-readable name |
| description | TEXT | Detailed description of the event |
| pattern | VARCHAR(255) | Event pattern (e.g., "invoice.created") |
| version | VARCHAR(50) | Event schema version |
| source_types | JSONB | Allowed source types for this event |
| payload_schema | JSONB | JSON Schema for the event payload structure |
| examples | JSONB | Example payloads for documentation |
| ui_metadata | JSONB | UI display information (icons, colors, etc.) |
| created_at | TIMESTAMP | Record creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |
| status | VARCHAR(50) | Status (active, deprecated, draft) |

### Events Table

**Table: events**

| Field | Type | Description |
|----|----|----|
| id | UUID | Primary key |
| event_id | VARCHAR(255) | Unique business identifier for the event instance |
| pattern | VARCHAR(255) | Event pattern (e.g., "invoice.created") |
| version | VARCHAR(50) | Event schema version |
| source | JSONB | Origin of the event (type, id, name) |
| timestamp | TIMESTAMP(6) | When the event occurred (microsecond precision) |
| payload | JSONB | Event data payload |
| metadata | JSONB | Additional context information |
| created_at | TIMESTAMP | Record creation timestamp |
| partition_key | VARCHAR(255) | For time-based partitioning |

### Workflow Event Triggers Table

**Table: workflow_event_triggers**

| Column | Type | Description |
|----|----|----|
| id | UUID | Primary key |
| workflow_definition_id | UUID | Foreign key to workflow_definitions |
| event_pattern | VARCHAR | Event pattern to subscribe to |
| trigger_type | VARCHAR | 'START' or 'CANCEL' |
| event_condition | TEXT | Optional condition expression |
| input_mapping | JSONB | Maps event data to workflow input |
| correlation_key | VARCHAR | For correlating related workflows |
| enabled | BOOLEAN | Whether this trigger is active |
| priority | INTEGER | Processing priority |
| description | TEXT | Human-readable description |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last updated timestamp |

## Database Optimization

The Event Processing Service implements the following database optimizations:



1. **Indexed Event Patterns** - Event patterns are indexed for efficient event routing and subscription matching
2. **JSONB Indexing** - GIN indexes on JSONB fields enable efficient querying within event payloads and metadata
3. **Time-Based Partitioning** - Events are partitioned by time periods to improve query performance for recent events
4. **Correlation Indexing** - Indexes on correlation IDs enable efficient tracking of related events
5. **Optimistic Concurrency Control** - Version fields prevent conflicts during concurrent event definition updates

## Related Schema Documentation

* [Event Definitions Schema](../../schemas/event_definitions.md)
* [Event Instances Schema](../../schemas/event_instances.md)
* [Workflow Schema](../../schemas/workflows.md)
* [Event Receiver Implementation](./implementation/event_receiver.md)
* [Event Store Implementation](./implementation/event_store.md)


