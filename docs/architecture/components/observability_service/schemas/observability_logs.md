# Observability Logs

## Overview

The Observability Logs schema defines the structure for system logs collected from all components. It enables the storage, retrieval, and analysis of log events across the entire system.

## Key Concepts

* **Log Entry** - A single log event with timestamp, level, source, and message
* **Log Level** - Severity indicator (DEBUG, INFO, WARNING, ERROR, CRITICAL)
* **Log Source** - Component or service that generated the log
* **Correlation ID** - Identifier to track related logs across components
* **Structured Logging** - JSON-formatted structured data within log messages

## Schema Structure

```json
{
  "log_entry": {
    "id": "string",                  // UUID for this log entry
    "timestamp": "string",           // ISO8601 timestamp with millisecond precision
    "level": "string",               // Log level (DEBUG, INFO, WARNING, ERROR, CRITICAL)
    "source": {
      "component": "string",         // Source component name
      "service": "string",           // Service instance identifier
      "instance_id": "string"        // Container/pod ID
    },
    "message": "string",             // Log message text
    "correlation_id": "string",      // For tracking related logs
    "trace_id": "string",            // For distributed tracing
    "user_id": "string",             // User associated with the log (if applicable)
    "context": {                     // Additional contextual information
      "request_id": "string",
      "session_id": "string",
      "environment": "string"
    },
    "data": {                        // Structured data specific to the log type
      "additional_fields": {}        // Arbitrary JSON structure
    },
    "tags": [                        // Searchable tags
      "string"
    ],
    "stack_trace": "string"          // For error logs
  }
}
```

## Log Levels

The following log levels are used throughout the system:

| Level | Purpose |
|----|----|
| DEBUG | Detailed debugging information, only used during development |
| INFO | General informational messages about system operation |
| WARNING | Potential issues that don't prevent normal operation |
| ERROR | Error conditions that prevent specific operations |
| CRITICAL | Severe errors that may prevent continued operation |

## Database Schema

**Table: observability_logs**

| Field | Type | Description |
|----|----|----|
| id | UUID | Primary key |
| timestamp | TIMESTAMP(6) | When the log occurred (microsecond precision) |
| level | VARCHAR(10) | Log level (DEBUG, INFO, WARNING, ERROR, CRITICAL) |
| source_component | VARCHAR(50) | Component that generated the log |
| source_service | VARCHAR(50) | Service instance identifier |
| source_instance_id | VARCHAR(50) | Container/pod ID |
| message | TEXT | Log message text |
| correlation_id | VARCHAR(36) | For tracking related logs |
| trace_id | VARCHAR(36) | For distributed tracing |
| user_id | VARCHAR(36) | User associated with the log |
| context | JSONB | Additional contextual information |
| data | JSONB | Structured data specific to the log type |
| tags | VARCHAR\[\] | Searchable tags |
| stack_trace | TEXT | For error logs |
| retention_policy | VARCHAR(20) | How long to retain this log |

## Database Optimization

The Observability Logs table implements these optimizations:


1. **Time-Based Partitioning** - Logs are partitioned by day for improved query performance
2. **Selective Indexing** - Indexes on timestamp, level, source, correlation_id, and tags
3. **JSONB Indexing** - GIN indexes on context and data for efficient JSON path queries
4. **Compression** - Text compression for message and stack_trace fields
5. **Retention Policies** - Automated data aging and archiving based on retention_policy

## Related Documentation

* [Observability Service Architecture](../overview.md)
* [Log Collection Implementation](../implementation/log_collection.md)
* [Log Query API](../interfaces/api.md)


