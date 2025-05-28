# Event Sequences

## Overview

Event sequences provide a mechanism for maintaining the order and relationships between events that are logically connected. This schema defines how ordered sequences of events are managed and processed in the system, ensuring proper order and correlation of related events that form a transaction-like sequence.

## Key Concepts

* **Event Sequence** - An ordered collection of related events that must be processed in a specific sequence to maintain data consistency and business logic integrity
* **Sequence ID** - Unique identifier for a collection of related events that form a logical unit of work
* **Sequence Order** - The explicitly defined order in which events in a sequence must be processed
* **Atomicity** - The guarantee that either all events in a sequence are processed successfully or none are (rollback capability)
* **Causality** - The cause-and-effect relationship between events, where one event directly triggers or influences another
* **Correlation** - The association of multiple events that are part of the same business transaction or process
* **Idempotency** - Guarantee that processing a sequence multiple times will have the same effect as processing it once

## Event Sequence Structure

```json
{
  "sequenceId": "string",           // Unique identifier for the sequence
  "name": "string",                 // Human-readable name
  "description": "string",          // Detailed description of the sequence's purpose
  "version": "string",              // Semantic version of the sequence definition
  "status": "string",               // Current status (created, in_progress, completed, failed)
  "events": [                       // Ordered array of event references
    {
      "eventId": "string",          // Reference to an event instance ID
      "order": "number",            // Explicit processing order (1-based)
      "required": "boolean",        // Whether this event is required for sequence completion
      "status": "string",           // Status of this event (pending, processed, failed)
      "processingTimestamp": "string" // When this event was processed
    }
  ],
  "metadata": {                     // Additional context information
    "correlationId": "string",      // ID linking all events in this business process
    "causationId": "string",        // ID of event that triggered this sequence
    "source": {                     // Origin of the sequence
      "type": "workflow | task | integration | external",
      "id": "string",               // Identifier of the source
      "name": "string"              // Human-readable source name
    },
    "tags": {                       // Additional searchable metadata
      "key1": "value1",
      "key2": "value2"
    }
  },
  "created_at": "string",           // When the sequence was created
  "updated_at": "string",           // When the sequence was last updated
  "completed_at": "string",         // When the sequence was completed (if applicable)
  "rollback_strategy": {            // Strategy for handling failures
    "type": "string",               // Type of strategy (compensating_events, retry, manual)
    "max_retries": "number",        // Maximum retry attempts (if applicable)
    "compensating_events": [        // Events to trigger on failure (if applicable)
      {
        "eventId": "string",        // Event type to trigger
        "payload_template": {}      // Template for creating the payload
      }
    ]
  }
}
```

## Sequence Ordering

Event sequences enforce the explicit ordering of events through the `order` field in each event reference. The system guarantees that:

* Events will be processed in the exact order specified
* Processing will not continue past a failed event (unless configured otherwise)
* Events with the same order value are considered parallel-processable

Example configuration:

```json
{
  "sequenceId": "seq_invoice_creation_123",
  "name": "Invoice Creation Sequence",
  "description": "Sequence for creating an invoice and updating related systems",
  "version": "1.0.0",
  "status": "in_progress",
  "events": [
    {
      "eventId": "evt_create_invoice_abc123",
      "order": 1,
      "required": true,
      "status": "processed",
      "processingTimestamp": "2024-03-15T10:15:30.123Z"
    },
    {
      "eventId": "evt_update_accounting_def456",
      "order": 2,
      "required": true,
      "status": "pending",
      "processingTimestamp": null
    },
    {
      "eventId": "evt_notify_customer_ghi789",
      "order": 3,
      "required": false,
      "status": "pending",
      "processingTimestamp": null
    }
  ]
}
```

## Atomicity and Transactional Consistency

Event sequences provide transaction-like guarantees for event processing, ensuring business operations maintain data consistency.


1. **Rollback Capabilities:**
   * On sequence failure, compensating events can be automatically triggered
   * Each failed sequence can specify its own rollback strategy
   * System maintains a transaction log for audit and recovery
2. **Failure Handling Strategies:**
   * **Compensating Events** - Trigger events that undo the effects of already processed events
   * **Retry Logic** - Automatically retry failed events with configurable backoff
   * **Manual Resolution** - Flag sequences for human intervention

Example rollback configuration:

```json
{
  "rollback_strategy": {
    "type": "compensating_events",
    "max_retries": 3,
    "compensating_events": [
      {
        "eventId": "InvoiceEvents.cancelled",
        "payload_template": {
          "invoice_id": "${events[0].payload.invoice_id}",
          "reason": "Sequence failure: ${error.message}"
        }
      },
      {
        "eventId": "AccountingEvents.reverse_entry",
        "payload_template": {
          "entry_id": "${events[1].payload.entry_id}",
          "reversed_by": "system"
        }
      }
    ]
  }
}
```

## Correlation and Causation

Event sequences leverage correlation IDs and causation IDs to maintain relationships between events and enable tracing of event flows through the system.

```json
{
  "metadata": {
    "correlationId": "corr_xyz789",
    "causationId": "evt_abc456",
    "source": {
      "type": "workflow",
      "id": "wf_invoice_processing",
      "name": "Invoice Processing Workflow"
    },
    "tags": {
      "priority": "high",
      "department": "finance",
      "customer_tier": "premium"
    }
  }
}
```

Each event sequence records:

* The business process it belongs to (via correlationId)
* What triggered the sequence (via causationId)
* Source system or component that initiated the sequence
* Business-relevant metadata as tags for filtering and reporting

## Database Schema

**Table: event_sequences**

| Field | Type | Description |
|----|----|----|
| id | UUID | Primary key |
| sequence_id | VARCHAR(255) | Unique business identifier for the sequence |
| name | VARCHAR(255) | Human-readable name |
| description | TEXT | Detailed description |
| version | VARCHAR(50) | Semantic version number |
| status | VARCHAR(50) | Current status (created, in_progress, completed, failed) |
| events | JSONB | Ordered array of event references |
| metadata | JSONB | Additional context information |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |
| completed_at | TIMESTAMP | Completion timestamp (if applicable) |
| rollback_strategy | JSONB | Strategy for handling failures |

**Table: event_sequence_events**

| Field | Type | Description |
|----|----|----|
| id | UUID | Primary key |
| sequence_id | UUID | Foreign key to event_sequences.id |
| event_id | UUID | Foreign key to events.id |
| order | INTEGER | Processing order within sequence |
| required | BOOLEAN | Whether this event is required for sequence completion |
| status | VARCHAR(50) | Status (pending, processed, failed) |
| processing_timestamp | TIMESTAMP | When this event was processed |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

**Indexes:**

* `event_sequences_sequence_id_idx` UNIQUE on `sequence_id` (for business ID lookups)
* `event_sequences_status_idx` on `status` (for finding sequences by status)
* `event_sequences_metadata_correlation_idx` on `((metadata->>'correlationId'))` (for correlation lookups)
* `event_sequences_metadata_causation_idx` on `((metadata->>'causationId'))` (for causation chains)
* `event_sequence_events_sequence_id_order_idx` on `(sequence_id, order)` (for ordered event retrieval)
* `event_sequence_events_event_id_idx` on `event_id` (for finding sequences by event)

## Performance Considerations

For event sequences, consider these performance optimizations:

* Use database partitioning on event_sequences to isolate active from completed sequences
* Create materialized views for common sequence analysis patterns
* Implement caching for active sequences to reduce database load
* Use batch processing for sequence event updates when possible
* Consider time-based archiving strategies for completed sequences

## Related Documentation

* [Event Definitions](./event_definitions.md) - Schema for event type definitions
* [Event Instances](./event_instances.md) - Schema for event instances
* [Workflow Definitions](../../workflow_orchestrator_service/schemas/workflow_definitions.md) - Schema for workflow definitions
* [Database Architecture](../database_architecture.md) - Overall database architecture


