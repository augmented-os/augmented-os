# Events

## Overview

Events are the foundation of the system's event-driven architecture. They represent meaningful business occurrences and drive workflow execution. The event system is designed to be:

* Reliable - ensuring events are never lost
* Scalable - handling high volumes of events
* Flexible - supporting various event patterns
* Traceable - maintaining clear audit trails

## Event Structure

```json
{
  "eventId": "string",           // Unique identifier
  "pattern": "string",           // Event pattern (e.g., "invoice.created")
  "version": "string",           // Event schema version
  "source": {                    // Origin of the event
    "type": "workflow | task | integration | external",
    "id": "string"              // Identifier of the source
  },
  "timestamp": "string",         // ISO8601 timestamp
  "payload": {                   // Event data
    "type": "object",
    "properties": { }
  },
  "metadata": {                  // Additional context
    "correlationId": "string",   // For tracing related events
    "causationId": "string",     // ID of event that caused this one
    "context": {                 // Business context
      "type": "client | user | global",
      "id": "string"
    }
  }
}
```

## Event Reception

### External Events



1. **Webhook Endpoints:**
   * Dedicated endpoints for external services
   * Authentication and validation
   * Rate limiting and throttling
   * Payload transformation
2. **API Integration:**
   * REST endpoints for event ingestion
   * GraphQL subscriptions
   * gRPC streams
   * Message queue consumers

### Internal Events



1. **Event Bus:**
   * Pub/sub messaging system
   * Topic-based routing
   * Dead letter queues
   * Message persistence
2. **System Events:**
   * Workflow status changes
   * Task completion events
   * Integration status updates
   * Error notifications

## Event Processing

### Pattern Matching

Events are matched to workflows using pattern expressions:

```json
{
  "pattern": {
    "type": "exact | prefix | regex",
    "value": "string",
    "filters": [
      {
        "field": "$.payload.field",  // JSONPath
        "operator": "equals | contains | gt | lt",
        "value": "any"
      }
    ]
  }
}
```

### Validation



1. **Schema Validation:**
   * JSON Schema validation
   * Required field checks
   * Data type verification
   * Format validation
2. **Business Rules:**
   * Domain-specific validation
   * Cross-field validation
   * Reference data checks
   * State transition rules

### Event Persistence

Events are stored for:



1. **Audit Trail:**
   * Complete history of all events
   * Immutable event log
   * Searchable by various criteria
   * Retention policy management
2. **Event Replay:**
   * Ability to replay events
   * State reconstruction
   * Debug and testing support
   * Disaster recovery

## Event Emission

### Workflow Events

Workflows can emit events:



1. **Step Completion:**
   * Success/failure events
   * Progress updates
   * State transitions
2. **Workflow Status:**
   * Started/completed events
   * Error notifications
   * Timeout alerts

### Task Events

Tasks can generate events for:



1. **Task Lifecycle:**
   * Task started/completed
   * Status updates
   * Error notifications
2. **Business Events:**
   * Domain-specific occurrences
   * Integration responses
   * User actions

### System Events

The system generates events for:



1. **Operational Events:**
   * Service health
   * Resource utilization
   * Performance metrics
   * Error conditions
2. **Audit Events:**
   * Security events
   * Configuration changes
   * Access attempts
   * Data modifications

## Implementation Example

### Event Definition Example

```json
{
  "event_id": "BookingEvents.created",
  "name": "Booking Created",
  "description": "Triggered when a new booking record is created in the system",
  "pattern": "bookings.created",
  "version": "1.0",
  "source_types": ["integration", "system"],
  "payload_schema": {
    "type": "object",
    "properties": {
      "booking_id": {
        "type": "string",
        "description": "Unique identifier for the booking"
      },
      "customer_id": {
        "type": "string",
        "description": "Identifier of the customer who made the booking"
      },
      "service_id": {
        "type": "string",
        "description": "Identifier of the service booked"
      },
      "appointment_time": {
        "type": "string",
        "format": "date-time",
        "description": "When the appointment is scheduled"
      },
      "status": {
        "type": "string",
        "enum": ["confirmed", "pending", "cancelled"],
        "description": "Current status of the booking"
      }
    },
    "required": ["booking_id", "customer_id", "service_id", "appointment_time", "status"]
  },
  "examples": [
    {
      "booking_id": "BK-12345",
      "customer_id": "CUST-789",
      "service_id": "SRV-456",
      "appointment_time": "2024-03-15T14:30:00Z",
      "status": "confirmed"
    }
  ],
  "ui_metadata": {
    "icon": "calendar-plus",
    "color": "#4CAF50",
    "category": "Booking Events",
    "priority": "high"
  }
}
```

### Event Instance Example

```json
{
  "eventId": "evt_123abc",
  "pattern": "invoice.created",
  "version": "1.0",
  "source": {
    "type": "integration",
    "id": "xero_main"
  },
  "timestamp": "2024-03-15T10:00:00Z",
  "payload": {
    "invoice_id": "INV-001",
    "amount": 1500.00,
    "customer_id": "CUST-123"
  },
  "metadata": {
    "correlationId": "corr_xyz789",
    "causationId": "evt_abc456",
    "context": {
      "type": "client",
      "id": "client_123"
    }
  }
}
```

## Schema

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

**Indexes:**

* `event_definitions_event_id_idx` UNIQUE on `event_id` (for lookups)
* `event_definitions_pattern_idx` UNIQUE on `pattern` (for event type matching)
* `event_definitions_source_idx` GIN on `source_types` (for filtering by source)

**JSON Schema (payload_schema field):**

```json
{
  "type": "object",
  "properties": {
    "type": "object",
    "required": ["type", "properties"],
    "additionalProperties": false
  }
}
```

**JSON Schema (source_types field):**

```json
{
  "type": "array",
  "items": {
    "type": "string", 
    "enum": ["workflow", "task", "integration", "external", "system"]
  }
}
```

**Table: events**

| Field | Type | Description |
|----|----|----|
| id | UUID | Primary key |
| event_id | VARCHAR(255) | Unique business identifier for the event |
| pattern | VARCHAR(255) | Event pattern (e.g., "invoice.created") |
| version | VARCHAR(50) | Event schema version |
| source | JSONB | Origin of the event (type and id) |
| timestamp | TIMESTAMP | When the event occurred |
| payload | JSONB | Event data payload |
| metadata | JSONB | Additional context information |
| created_at | TIMESTAMP | Record creation timestamp |

**Indexes:**

* `events_event_id_idx` UNIQUE on `event_id` (for deduplication)
* `events_pattern_idx` on `pattern` (for event matching)
* `events_timestamp_idx` on `timestamp` (for time-based queries)
* `events_source_idx` GIN on `source` (for filtering by source)
* `events_metadata_gin_idx` GIN on `metadata` (for searching within metadata)

**JSON Schema (source field):**

```json
{
  "type": "object",
  "properties": {
    "type": { 
      "type": "string", 
      "enum": ["workflow", "task", "integration", "external"] 
    },
    "id": { "type": "string" }
  },
  "required": ["type", "id"]
}
```

**JSON Schema (payload field):**
The payload structure varies by event type but must conform to the JSON schema defined for each event pattern.

**JSON Schema (metadata field):**

```json
{
  "type": "object",
  "properties": {
    "correlationId": { "type": "string" },
    "causationId": { "type": "string" },
    "context": {
      "type": "object",
      "properties": {
        "type": { "type": "string", "enum": ["client", "user", "global"] },
        "id": { "type": "string" }
      }
    }
  }
}
```


