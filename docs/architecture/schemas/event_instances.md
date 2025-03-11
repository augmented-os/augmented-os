# Event Instances

## Overview

Event instances represent concrete occurrences of business events within the system. Each instance conforms to an event definition and contains the actual event data.

## Schema Structure

```json
{
  "eventId": "string",           // UUID for this specific event instance
  "pattern": "string",           // Event pattern (e.g., "invoice.created")
  "version": "string",           // Schema version this instance conforms to
  "source": {                    // Origin of the event
    "type": "workflow | task | integration | external",
    "id": "string",              // Identifier of the source
    "name": "string"             // Human-readable source name
  },
  "timestamp": "string",         // ISO8601 timestamp with millisecond precision
  "payload": {                   // Event-specific data following the schema
    // Content varies by event type
  },
  "metadata": {                  // Additional context information
    "correlationId": "string",   // For tracing related events
    "causationId": "string",     // ID of event that directly caused this one
    "traceId": "string",         // For distributed tracing
    "userId": "string",          // User who triggered the event (if applicable)
    "context": {                 // Business context
      "type": "client | user | global",
      "id": "string"             // Context-specific identifier
    },
    "tags": {                    // Additional searchable metadata
      "key1": "value1",
      "key2": "value2"
    }
  }
}
```

## Database Schema

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

**Indexes:**

* `events_event_id_idx` UNIQUE on `event_id` (for deduplication)
* `events_pattern_idx` on `pattern` (for event matching)
* `events_timestamp_idx` on `timestamp` (for time-based queries)
* `events_source_idx` GIN on `source` (for filtering by source)
* `events_metadata_correlation_idx` on `((metadata->>'correlationId'))` (for correlation lookups)
* `events_metadata_causation_idx` on `((metadata->>'causationId'))` (for causation chains)
* `events_metadata_gin_idx` GIN on `metadata` (for searching within metadata)
* `events_partition_key_timestamp_idx` on `(partition_key, timestamp)` (for partition routing)

## Example Instance

```json
{
  "eventId": "evt_123abc456def789",
  "pattern": "invoice.created",
  "version": "1.0.0",
  "source": {
    "type": "integration",
    "id": "xero_main",
    "name": "Xero Accounting"
  },
  "timestamp": "2024-03-15T10:00:00.123Z",
  "payload": {
    "invoice_id": "INV-001",
    "amount": 1500.00,
    "currency": "USD",
    "customer_id": "CUST-123",
    "due_date": "2024-04-15",
    "line_items": [
      {
        "description": "Professional services",
        "quantity": 10,
        "unit_price": 150.00,
        "total": 1500.00
      }
    ],
    "status": "draft"
  },
  "metadata": {
    "correlationId": "corr_xyz789",
    "causationId": "evt_abc456",
    "traceId": "trace_987654321",
    "userId": "user_42",
    "context": {
      "type": "client",
      "id": "client_123"
    },
    "tags": {
      "priority": "high",
      "department": "finance",
      "region": "us-west"
    }
  }
}
```

## Related Documentation

* [Event Definitions](./event_definitions.md) - Schema for event type definitions
* [Workflow Instances](./workflow_instances.md) - Schema for workflow instances
* [Tasks Schema](./tasks.md) - Schema for task definitions and instances


