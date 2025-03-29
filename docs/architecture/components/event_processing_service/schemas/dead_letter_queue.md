# Dead Letter Queue

## Overview

The Dead Letter Queue (DLQ) schema defines the structure for storing, tracking, and managing events that have failed to be processed normally within the event processing system. This critical component enhances system resilience by providing a mechanism to capture, inspect, and potentially reprocess events that would otherwise be lost due to processing errors. The DLQ serves as a safety net that allows for post-failure analysis, troubleshooting, and controlled recovery operations.

## Key Concepts

* **Dead Letter Entry** - An event that could not be processed successfully after multiple attempts or due to a non-recoverable error
* **Original Event** - The complete event data from the failed processing attempt, preserved in its original form
* **Error Context** - Detailed information about why the event failed, including error messages, stack traces, and system state
* **Retry History** - Record of previous processing attempts, including timestamps and failure reasons
* **Processing Status** - Current status of the DLQ entry (pending, reprocessing, resolved, discarded)
* **Resolution Strategy** - Approach for handling the failed event (retry, discard, manual resolution)
* **Max Retry Count** - Configurable threshold for retry attempts before an event is moved to the DLQ

## Dead Letter Queue Entry Structure

```json
{
  "id": "string",                       // Unique identifier for this DLQ entry
  "eventId": "string",                  // Original event ID
  "subscriberId": "string",             // ID of the subscriber that failed to process the event (if applicable)
  "originalEvent": {                    // Complete original event data
    "eventId": "string",                // UUID for the original event instance
    "pattern": "string",                // Event pattern (e.g., "invoice.created")
    "version": "string",                // Schema version of the original event
    "source": {                         // Origin of the event
      "type": "string",                 // "workflow" | "task" | "integration" | "external"
      "id": "string",                   // Identifier of the source
      "name": "string"                  // Human-readable source name
    },
    "timestamp": "string",              // ISO8601 timestamp of the original event
    "payload": "object",                // Original event data
    "metadata": "object"                // Original event metadata
  },
  "error": {                            // Error information
    "message": "string",                // Human-readable error message
    "type": "string",                   // Error classification (e.g., "ValidationError", "NetworkError")
    "code": "string",                   // System-specific error code
    "stackTrace": "string",             // Stack trace if available
    "context": "object"                 // Additional error context
  },
  "retryHistory": [                     // History of retry attempts
    {
      "timestamp": "string",            // When the retry was attempted
      "error": "object",                // Error from this specific attempt
      "processingDuration": "number"    // How long the processing attempt took in ms
    }
  ],
  "retryCount": "number",               // Number of retry attempts made
  "maxRetries": "number",               // Maximum retry attempts allowed for this event
  "status": "string",                   // "pending" | "reprocessing" | "resolved" | "discarded"
  "resolution": {                       // Resolution information (if resolved)
    "timestamp": "string",              // When the entry was resolved
    "strategy": "string",               // "automatic_retry" | "manual_retry" | "manual_resolution" | "discard"
    "resolvedBy": "string",             // User ID if manually resolved
    "notes": "string"                   // Optional resolution notes
  },
  "createdAt": "string",                // When the entry was added to the DLQ
  "updatedAt": "string"                 // Last updated timestamp
}
```

## Error Handling and Classification

The Dead Letter Queue categorizes errors to facilitate appropriate handling strategies:

* **Transient Errors** - Temporary failures that may resolve with retries, such as:
  * Network timeouts
  * Service unavailability
  * Rate limiting
  * Database connection errors
  * HTTP 5xx errors

* **Permanent Errors** - Failures that will not resolve with retries:
  * Validation errors
  * Authorization failures
  * Resource not found errors
  * Business rule violations
  * Malformed data errors

Example error classification:

```json
{
  "error": {
    "message": "Failed to connect to payment service: Connection timed out",
    "type": "NetworkError",
    "code": "CONNECTION_TIMEOUT",
    "stackTrace": "Error: Failed to connect...\n    at PaymentConnector.processPayment (/src/services/payment.ts:42:23)\n    at EventHandler.handleEvent (/src/handlers/event-handler.ts:78:12)",
    "context": {
      "serviceName": "payment-service",
      "endpoint": "https://api.payments.example.com/process",
      "requestId": "req-123456",
      "timeoutMs": 5000
    }
  }
}
```

## Dead Letter Queue Management

The Dead Letter Queue supports several administrative operations:

* **Inspection** - Viewing and filtering DLQ entries
* **Reprocessing** - Manually or automatically retrying failed events
* **Purging** - Removing old or irrelevant entries
* **Batching** - Processing multiple entries at once based on error type or source
* **Notification** - Alerting administrators of critical failures

Example reprocessing configuration:

```json
{
  "reprocessingOptions": {
    "batchSize": 50,
    "concurrency": 5,
    "filterCriteria": {
      "errorTypes": ["NetworkError", "ServiceUnavailableError"],
      "maxAge": "24h",
      "minRetryCount": 1,
      "maxRetryCount": 5,
      "eventPatterns": ["payment.*", "order.created"]
    },
    "prioritization": {
      "orderBy": "createdAt",
      "direction": "asc"
    }
  }
}
```

## Database Schema

**Table: dead_letter_queue**

| Field | Type | Description |
|----|----|----|
| id | UUID | Primary key |
| event_id | VARCHAR(255) | Original event identifier |
| subscriber_id | VARCHAR(255) | Subscriber that failed to process the event |
| original_event | JSONB | Complete original event data |
| error_message | TEXT | Human-readable error message |
| error_type | VARCHAR(100) | Error classification |
| error_code | VARCHAR(100) | System-specific error code |
| error_stack_trace | TEXT | Stack trace if available |
| error_context | JSONB | Additional error context |
| retry_history | JSONB | History of retry attempts |
| retry_count | INTEGER | Number of retry attempts made |
| max_retries | INTEGER | Maximum retry attempts allowed |
| status | VARCHAR(50) | Status of the DLQ entry |
| resolution_timestamp | TIMESTAMP | When the entry was resolved |
| resolution_strategy | VARCHAR(50) | How the entry was resolved |
| resolved_by | VARCHAR(255) | User ID if manually resolved |
| resolution_notes | TEXT | Optional resolution notes |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

**Indexes:**

* `dead_letter_queue_event_id_idx` on `event_id` (for lookups by original event)
* `dead_letter_queue_subscriber_id_idx` on `subscriber_id` (for filtering by subscriber)
* `dead_letter_queue_status_idx` on `status` (for filtering by status)
* `dead_letter_queue_error_type_idx` on `error_type` (for filtering by error type)
* `dead_letter_queue_created_at_idx` on `created_at` (for time-based queries)
* `dead_letter_queue_updated_at_idx` on `updated_at` (for time-based queries)
* `dead_letter_queue_original_event_pattern_idx` on `((original_event->>'pattern'))` (for filtering by event pattern)

## Performance Considerations

For Dead Letter Queue management, consider these performance optimizations:

* Use time-based partitioning for the dead_letter_queue table to improve query performance as the table grows
* Implement a retention policy to automatically archive or delete old entries after a configurable period
* Create specialized indexes for common query patterns based on your operational needs
* Consider compressing large fields like stack traces and original event data if storage becomes a concern
* For high-throughput systems, implement a separate DLQ service to handle entry creation, inspection, and reprocessing
* Use background workers for batch reprocessing to avoid impacting normal event processing operations
* Implement rate limiting when reprocessing DLQ entries to prevent system overload

## Related Documentation

* [Event Instances Schema](./event_instances.md) - Documentation for event instances
* [Event Queue State Schema](./event_queue_state.md) - Documentation for event queue state
* [Event Processing Service Data Model](../components/event_processing_service/data_model.md) - Overall data model for event processing
* [Error Handling Examples](../components/event_processing_service/examples/advanced/04-error-handling.md) - Examples of error handling
* [Internal Event Queue](../components/event_processing_service/implementation/internal_queue.md) - Implementation of the internal event queue


