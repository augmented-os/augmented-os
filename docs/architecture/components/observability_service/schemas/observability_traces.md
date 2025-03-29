# Observability Traces

## Overview

The Observability Traces schema defines the structure for distributed tracing data across the system. It enables tracking request flows through multiple services, identifying performance bottlenecks, and debugging distributed transactions.

## Key Concepts

* **Trace** - A complete end-to-end request flow through the system
* **Span** - A single unit of work within a trace
* **Parent-Child Relationships** - Hierarchical organization of spans
* **Span Tags** - Key-value metadata attached to spans
* **Span Events** - Time-stamped events within a span's lifetime

## Trace Structure

```json
{
  "trace": {
    "trace_id": "string",           // Unique identifier for the entire trace
    "name": "string",               // Human-readable name for the trace
    "start_time": "string",         // ISO8601 timestamp when trace started
    "end_time": "string",           // ISO8601 timestamp when trace ended
    "duration_ms": "number",        // Total duration in milliseconds
    "root_span_id": "string",       // ID of the root span
    "status": "string",             // "SUCCESS", "ERROR", "TIMEOUT"
    "error": {                      // Present only if status is "ERROR"
      "message": "string",
      "type": "string",
      "stack": "string"
    },
    "spans": [                      // All spans in this trace
      {
        "span_id": "string",        // Unique ID for this span
        "parent_span_id": "string", // ID of parent span (null for root)
        "name": "string",           // Operation name
        "component": "string",      // Service/component name
        "start_time": "string",     // ISO8601 timestamp when span started
        "end_time": "string",       // ISO8601 timestamp when span ended
        "duration_ms": "number",    // Duration in milliseconds
        "status": "string",         // "SUCCESS", "ERROR", "TIMEOUT"
        "tags": {                   // Key-value metadata
          "http.method": "string",
          "http.url": "string", 
          "db.statement": "string",
          "db.instance": "string",
          "additional_tags": {}     // Custom tags
        },
        "events": [                 // Time-stamped events within span
          {
            "time": "string",       // ISO8601 timestamp
            "name": "string",       // Event name
            "attributes": {}        // Event-specific attributes
          }
        ],
        "links": [                  // References to other spans
          {
            "trace_id": "string",
            "span_id": "string",
            "type": "string"        // "CHILD_OF", "FOLLOWS_FROM"
          }
        ]
      }
    ],
    "metadata": {                   // Trace-level metadata
      "user_id": "string",          // User associated with this trace
      "service": "string",          // Entry-point service
      "environment": "string",      // Environment (dev, test, prod)
      "version": "string"           // Service version
    }
  }
}
```

## Span Types

Spans are categorized by type to enable better visualization and analysis:

* **HTTP Request** - External API calls or service-to-service communication
* **Database Query** - Database operations
* **Cache Operation** - Interactions with caching systems
* **Queue Operation** - Interactions with message queues
* **Function Call** - Internal function executions
* **Custom Operation** - Application-specific operations

## Span Relationships

Spans form a directed acyclic graph (DAG) through parent-child relationships:

1. **Parent-Child**: Direct causal relationship (child is triggered by parent)
2. **Follows-From**: Non-causal relationship (second span starts after first completes)
3. **Links**: References to related spans in other traces

Example relationship configuration:

```json
{
  "spans": [
    {
      "span_id": "span1",
      "parent_span_id": null,
      "name": "root operation"
    },
    {
      "span_id": "span2",
      "parent_span_id": "span1",
      "name": "child operation"
    },
    {
      "span_id": "span3",
      "parent_span_id": "span1",
      "name": "another child operation",
      "links": [
        {
          "trace_id": "another-trace",
          "span_id": "related-span",
          "type": "FOLLOWS_FROM"
        }
      ]
    }
  ]
}
```

## Database Schema

**Table: observability_traces**

| Field | Type | Description |
|----|----|----|
| trace_id | VARCHAR(36) | Primary key |
| name | VARCHAR(255) | Human-readable name |
| start_time | TIMESTAMP(6) | When trace started |
| end_time | TIMESTAMP(6) | When trace ended |
| duration_ms | INTEGER | Duration in milliseconds |
| root_span_id | VARCHAR(36) | ID of the root span |
| status | VARCHAR(20) | SUCCESS, ERROR, TIMEOUT |
| error | JSONB | Error details if status is ERROR |
| metadata | JSONB | Trace-level metadata |

**Table: observability_spans**

| Field | Type | Description |
|----|----|----|
| span_id | VARCHAR(36) | Primary key |
| trace_id | VARCHAR(36) | Foreign key to traces table |
| parent_span_id | VARCHAR(36) | ID of parent span (null for root) |
| name | VARCHAR(255) | Operation name |
| component | VARCHAR(50) | Service/component name |
| start_time | TIMESTAMP(6) | When span started |
| end_time | TIMESTAMP(6) | When span ended |
| duration_ms | INTEGER | Duration in milliseconds |
| status | VARCHAR(20) | SUCCESS, ERROR, TIMEOUT |
| tags | JSONB | Key-value metadata |
| events | JSONB | Time-stamped events |
| links | JSONB | References to other spans |

**Indexes:**

* `observability_traces_trace_id_idx` UNIQUE on `trace_id` (for lookups)
* `observability_traces_start_time_idx` on `start_time` (for time-range queries)
* `observability_traces_status_idx` on `status` (for filtering by status)
* `observability_spans_trace_id_idx` on `trace_id` (for finding all spans in a trace)
* `observability_spans_parent_span_id_idx` on `parent_span_id` (for finding child spans)
* `observability_spans_tags_idx` on `tags` using GIN (for filtering by tags)

## Performance Considerations

For traces, consider these performance optimizations:

* Sampling high-volume traces to reduce storage requirements
* Indexing commonly queried span tags
* Using a dedicated time-series database for high-volume tracing
* Implementing automatic trace data aging and archiving
* Using materialized views for common trace analysis queries

## Related Documentation

* [Observability Service Architecture](../overview.md)
* [Distributed Tracing Implementation](../implementation/distributed_tracing.md)
* [Traces Query API](../interfaces/api.md)
* [Trace Sampling Configuration](../operations/trace_sampling.md) 