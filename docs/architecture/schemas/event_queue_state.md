# Event Queue State

## Overview

The Event Queue State schema defines how the state of event processing queues is persisted within the system. This persistence mechanism ensures reliable event processing and enables recovery from system failures without data loss. The schema captures in-flight events, processing metadata, and queue configuration to provide a durable record that can be used to reconstruct queue state.

## Key Concepts

* **Queue Persistence** - Mechanism to save and recover the state of in-memory event queues to ensure no events are lost during system failures
* **Checkpoint** - A recorded point in the processing sequence that enables resumption of operations after interruption
* **Recovery Mechanism** - Process for restoring in-memory queues from persisted state after system restart
* **Processing Guarantees** - Assurances about event delivery semantics (at-least-once, exactly-once)
* **Queue Identification** - Unique identifiers for different queue instances in a distributed environment

## Event Queue State Structure

```json
{
  "id": "string",                      // Unique identifier for the queue (e.g., "main-queue")
  "events": [                          // Array of serialized events waiting to be processed
    {
      "eventId": "string",             // UUID for this specific event instance
      "pattern": "string",             // Event pattern (e.g., "invoice.created")
      "version": "string",             // Schema version this instance conforms to
      "source": {                      // Origin of the event
        "type": "string",              // Source type (workflow, task, integration, external)
        "id": "string",                // Identifier of the source
        "name": "string"               // Human-readable source name
      },
      "timestamp": "string",           // ISO8601 timestamp with millisecond precision
      "payload": {},                   // Event-specific data following the schema
      "metadata": {                    // Additional context and processing information
        "correlationId": "string",     // For tracing related events
        "causationId": "string",       // ID of event that directly caused this one
        "traceId": "string",           // For distributed tracing
        "retryCount": "number",        // Number of processing attempts
        "lastError": "string",         // Last error message (if any)
        "lastErrorTime": "string",     // Timestamp of last error
        "processingStartTime": "string" // When processing began for this event
      }
    }
  ],
  "checkpointId": "string",            // ID of the last successfully processed event
  "queueMetrics": {                    // Runtime metrics for the queue
    "totalProcessed": "number",        // Total number of events processed
    "totalErrors": "number",           // Total number of processing errors
    "avgProcessingTimeMs": "number"    // Average processing time in milliseconds
  },
  "config": {                          // Queue configuration
    "maxQueueDepth": "number",         // Maximum number of events in the queue
    "batchSize": "number",             // Number of events to process in a batch
    "processingInterval": "number",    // Milliseconds between processing batches
    "persistenceThreshold": "number",  // Queue size that triggers persistence
    "highWatermark": "number"          // Queue level that activates backpressure
  },
  "status": "string",                  // Queue status (active, paused, draining)
  "created_at": "string",              // ISO timestamp of first creation
  "updated_at": "string"               // ISO timestamp of last update
}
```

## Queue Persistence Mechanism

Event queue state persistence provides a reliable recovery mechanism for event processing:

* Queue state is persisted when:
  * The queue size reaches the persistence threshold
  * The system is shutting down gracefully
  * A checkpoint is explicitly requested
  * Periodically based on time intervals

Example queue state persistence:

```json
{
  "id": "main-queue",
  "events": [
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
        "amount": 1500.00
      },
      "metadata": {
        "correlationId": "corr_xyz789",
        "retryCount": 0
      }
    },
    {
      "eventId": "evt_456def789ghi012",
      "pattern": "payment.received",
      "version": "1.0.0",
      "source": {
        "type": "integration",
        "id": "stripe_payments",
        "name": "Stripe Payments"
      },
      "timestamp": "2024-03-15T10:05:00.456Z",
      "payload": {
        "payment_id": "PAY-002",
        "amount": 750.00
      },
      "metadata": {
        "correlationId": "corr_xyz789",
        "retryCount": 2,
        "lastError": "Connection timeout",
        "lastErrorTime": "2024-03-15T10:06:00.123Z"
      }
    }
  ],
  "checkpointId": "evt_111aaa222bbb333",
  "queueMetrics": {
    "totalProcessed": 1053,
    "totalErrors": 17,
    "avgProcessingTimeMs": 42
  },
  "config": {
    "maxQueueDepth": 10000,
    "batchSize": 100,
    "processingInterval": 1000,
    "persistenceThreshold": 500,
    "highWatermark": 8000
  },
  "status": "active",
  "created_at": "2024-03-15T00:00:00.000Z",
  "updated_at": "2024-03-15T10:07:00.000Z"
}
```

## Recovery Process

The queue recovery process ensures reliable event processing after system restarts:


1. **Initial State Load**:
   * When the queue worker starts, it checks for persisted queue state
   * If state exists, it loads events back into the in-memory queue
   * Processing starts from the last checkpointed position
2. **Checkpoint Management**:
   * Queue workers maintain checkpoints of successfully processed events
   * Checkpoints are updated during normal processing
   * Checkpoints are used to prevent reprocessing during recovery

Example recovery sequence:

```json
{
  "id": "recovery-sequence-log",
  "checkpointId": "evt_111aaa222bbb333",
  "eventsRecovered": 42,
  "recoveryStartTime": "2024-03-15T10:15:00.000Z",
  "recoveryCompleteTime": "2024-03-15T10:15:00.500Z",
  "status": "completed"
}
```

## Database Schema

**Table: event_queue_state**

| Field | Type | Description |
|----|----|----|
| id | VARCHAR(255) | Queue identifier (primary key) |
| events | JSONB | Serialized queue events |
| checkpoint_id | VARCHAR(255) | Last successfully processed event ID |
| queue_metrics | JSONB | Runtime metrics for the queue |
| config | JSONB | Queue configuration |
| status | VARCHAR(50) | Queue status (active, paused, draining) |
| created_at | TIMESTAMP | When the queue state was created |
| updated_at | TIMESTAMP | When the queue state was last updated |

**Table: queue_checkpoints**

| Field | Type | Description |
|----|----|----|
| id | UUID | Primary key |
| queue_id | VARCHAR(255) | Queue identifier (foreign key to event_queue_state) |
| checkpoint_id | VARCHAR(255) | Event ID of the checkpoint |
| event_count | INTEGER | Number of events processed at checkpoint |
| created_at | TIMESTAMP | When the checkpoint was created |

**Indexes:**

* `event_queue_state_id_idx` UNIQUE on `id` (for quick queue lookup)
* `event_queue_state_status_idx` on `status` (for finding queues by status)
* `queue_checkpoints_queue_id_idx` on `queue_id` (for finding checkpoints by queue)
* `queue_checkpoints_created_at_idx` on `created_at` (for time-based checkpoint queries)

## Performance Considerations

For event queue state persistence, consider these performance optimizations:

* **Selective Persistence**: Only persist queue state when necessary (threshold reached or shutdown)
* **Batch Persistence**: Group multiple queue updates into single database operations
* **Asynchronous Writes**: Use background threads for persistence to avoid blocking event processing
* **Efficient Serialization**: Optimize JSON serialization for large queue states
* **Compaction**: Periodically compact and clean up the persistent queue state
* **Partial Updates**: Consider partial updates to avoid writing the entire queue state

## Related Documentation

* [Event Instances Schema](./event_instances.md) - Schema for event instances stored in the queue
* [Dead Letter Queue Schema](./dead_letter_queue.md) - Schema for handling failed event processing
* [Internal Event Queue Implementation](../components/event_processing_service/implementation/internal_queue.md) - Implementation details of the event queue
* [Event Processing Service Data Model](../components/event_processing_service/data_model.md) - Overall data model for the event processing service


