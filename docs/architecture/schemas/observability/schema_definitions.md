# Observability Data Schemas

This document defines the data schemas used by the Observability Service for logs, metrics, and traces.

## Log Entry Schema

Log entries represent individual log messages from any system component.

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "LogEntry",
  "type": "object",
  "required": ["timestamp", "level", "service", "message"],
  "properties": {
    "id": {
      "type": "string",
      "description": "Unique identifier for the log entry"
    },
    "timestamp": {
      "type": "string",
      "format": "date-time",
      "description": "ISO 8601 timestamp when the log entry was created"
    },
    "level": {
      "type": "string",
      "enum": ["TRACE", "DEBUG", "INFO", "WARN", "ERROR", "FATAL"],
      "description": "Log level indicating severity"
    },
    "service": {
      "type": "string",
      "description": "Name of the service that generated the log"
    },
    "component": {
      "type": "string",
      "description": "Specific component within the service"
    },
    "message": {
      "type": "string",
      "description": "Log message text"
    },
    "context": {
      "type": "object",
      "description": "Additional contextual information as key-value pairs",
      "additionalProperties": true
    },
    "trace_id": {
      "type": "string",
      "description": "Trace ID for correlation with distributed tracing"
    },
    "span_id": {
      "type": "string",
      "description": "Span ID for correlation with distributed tracing"
    },
    "user_id": {
      "type": "string",
      "description": "User ID if the log is associated with user activity"
    },
    "request_id": {
      "type": "string",
      "description": "Request ID for correlation with HTTP requests"
    },
    "stack_trace": {
      "type": "string",
      "description": "Stack trace for error logs"
    }
  },
  "additionalProperties": false
}
```

## Metric Data Point Schema

Metric data points represent individual measurements of system metrics.

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "MetricDataPoint",
  "type": "object",
  "required": ["name", "timestamp", "value"],
  "properties": {
    "id": {
      "type": "string",
      "description": "Unique identifier for the metric data point"
    },
    "name": {
      "type": "string",
      "description": "Name of the metric"
    },
    "timestamp": {
      "type": "string",
      "format": "date-time",
      "description": "ISO 8601 timestamp when the metric was recorded"
    },
    "value": {
      "type": "number",
      "description": "Numeric value of the metric"
    },
    "type": {
      "type": "string",
      "enum": ["gauge", "counter", "histogram", "summary"],
      "default": "gauge",
      "description": "Type of metric"
    },
    "unit": {
      "type": "string",
      "description": "Unit of measurement"
    },
    "tags": {
      "type": "object",
      "description": "Key-value pairs for metric dimensions",
      "additionalProperties": {
        "type": "string"
      }
    },
    "interval": {
      "type": "number",
      "description": "Collection interval in seconds for rate-based metrics"
    }
  },
  "additionalProperties": false
}
```

## Trace Span Schema

Trace spans represent segments of a distributed transaction.

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "TraceSpan",
  "type": "object",
  "required": ["trace_id", "span_id", "service", "operation", "start_time", "end_time"],
  "properties": {
    "trace_id": {
      "type": "string",
      "description": "Identifier for the entire trace"
    },
    "span_id": {
      "type": "string",
      "description": "Unique identifier for this span"
    },
    "parent_span_id": {
      "type": ["string", "null"],
      "description": "Identifier for the parent span, null if this is a root span"
    },
    "service": {
      "type": "string",
      "description": "Name of the service that generated the span"
    },
    "operation": {
      "type": "string",
      "description": "Name of the operation being traced"
    },
    "start_time": {
      "type": "string",
      "format": "date-time",
      "description": "ISO 8601 timestamp when the span started"
    },
    "end_time": {
      "type": "string",
      "format": "date-time",
      "description": "ISO 8601 timestamp when the span ended"
    },
    "duration_ms": {
      "type": "number",
      "description": "Duration of the span in milliseconds"
    },
    "status": {
      "type": "string",
      "enum": ["OK", "ERROR", "UNSET"],
      "default": "UNSET",
      "description": "Status of the operation"
    },
    "status_message": {
      "type": "string",
      "description": "Status message, particularly for error status"
    },
    "tags": {
      "type": "object",
      "description": "Key-value pairs for span metadata",
      "additionalProperties": {
        "type": "string"
      }
    },
    "events": {
      "type": "array",
      "description": "Time-stamped events that occurred during the span",
      "items": {
        "type": "object",
        "required": ["timestamp", "name"],
        "properties": {
          "timestamp": {
            "type": "string",
            "format": "date-time",
            "description": "When the event occurred"
          },
          "name": {
            "type": "string",
            "description": "Name of the event"
          },
          "attributes": {
            "type": "object",
            "description": "Additional attributes for the event",
            "additionalProperties": true
          }
        }
      }
    }
  },
  "additionalProperties": false
}
```

## Alert Rule Schema

Alert rules define conditions for generating alerts based on metrics.

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "AlertRule",
  "type": "object",
  "required": ["name", "query", "evaluation_interval", "duration", "severity"],
  "properties": {
    "id": {
      "type": "string",
      "description": "Unique identifier for the alert rule"
    },
    "name": {
      "type": "string",
      "description": "Name of the alert rule"
    },
    "description": {
      "type": "string",
      "description": "Description of what the alert detects"
    },
    "query": {
      "type": "string",
      "description": "Query expression that defines the alert condition"
    },
    "evaluation_interval": {
      "type": "string",
      "description": "How often the rule is evaluated (e.g., '1m', '5m')"
    },
    "duration": {
      "type": "string",
      "description": "How long the condition must be true before alerting (e.g., '5m')"
    },
    "severity": {
      "type": "string",
      "enum": ["info", "warning", "critical"],
      "description": "Severity level of the alert"
    },
    "annotations": {
      "type": "object",
      "description": "Human-readable information about the alert",
      "properties": {
        "summary": {
          "type": "string",
          "description": "Brief summary of the alert"
        },
        "description": {
          "type": "string",
          "description": "Detailed description of the alert"
        },
        "dashboard_url": {
          "type": "string",
          "description": "URL to relevant dashboard"
        },
        "runbook_url": {
          "type": "string",
          "description": "URL to runbook for remediation"
        }
      }
    },
    "labels": {
      "type": "object",
      "description": "Labels used for grouping and routing alerts",
      "additionalProperties": {
        "type": "string"
      }
    },
    "notification_channels": {
      "type": "array",
      "description": "Notification channels for this alert",
      "items": {
        "type": "string"
      }
    },
    "silenced": {
      "type": "boolean",
      "default": false,
      "description": "Whether the alert is silenced"
    },
    "silenced_until": {
      "type": ["string", "null"],
      "format": "date-time",
      "description": "ISO 8601 timestamp until which the alert is silenced"
    }
  },
  "additionalProperties": false
}
```

## Dashboard Definition Schema

Dashboard definitions describe the structure and content of observability dashboards.

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Dashboard",
  "type": "object",
  "required": ["name", "panels"],
  "properties": {
    "id": {
      "type": "string",
      "description": "Unique identifier for the dashboard"
    },
    "name": {
      "type": "string",
      "description": "Name of the dashboard"
    },
    "description": {
      "type": "string",
      "description": "Description of the dashboard's purpose"
    },
    "tags": {
      "type": "array",
      "description": "Tags for categorizing the dashboard",
      "items": {
        "type": "string"
      }
    },
    "time_range": {
      "type": "object",
      "description": "Default time range for the dashboard",
      "properties": {
        "from": {
          "type": "string",
          "description": "Start of time range (absolute or relative)"
        },
        "to": {
          "type": "string",
          "description": "End of time range (absolute or relative)"
        }
      }
    },
    "refresh_rate": {
      "type": "string",
      "description": "How often the dashboard auto-refreshes (e.g., '30s', '1m')"
    },
    "variables": {
      "type": "array",
      "description": "Dashboard-level variables for template queries",
      "items": {
        "type": "object",
        "required": ["name", "type"],
        "properties": {
          "name": {
            "type": "string",
            "description": "Variable name"
          },
          "display_name": {
            "type": "string",
            "description": "Human-readable display name"
          },
          "type": {
            "type": "string",
            "enum": ["query", "custom", "interval", "datasource", "textbox"],
            "description": "Variable type"
          },
          "query": {
            "type": "string",
            "description": "Query that populates the variable values"
          },
          "options": {
            "type": "array",
            "description": "Predefined options for custom variables",
            "items": {
              "type": "string"
            }
          },
          "multi": {
            "type": "boolean",
            "default": false,
            "description": "Whether multiple values can be selected"
          },
          "default": {
            "type": ["string", "array"],
            "description": "Default value(s) for the variable"
          }
        }
      }
    },
    "panels": {
      "type": "array",
      "description": "Panels in the dashboard",
      "items": {
        "type": "object",
        "required": ["title", "type", "position"],
        "properties": {
          "id": {
            "type": "string",
            "description": "Unique identifier for the panel"
          },
          "title": {
            "type": "string",
            "description": "Panel title"
          },
          "type": {
            "type": "string",
            "enum": ["graph", "singlestat", "table", "text", "heatmap", "logs", "traces"],
            "description": "Type of visualization"
          },
          "description": {
            "type": "string",
            "description": "Panel description"
          },
          "query": {
            "type": "string",
            "description": "Query expression for the panel"
          },
          "position": {
            "type": "object",
            "required": ["x", "y", "w", "h"],
            "properties": {
              "x": {
                "type": "integer",
                "description": "X-coordinate (columns)"
              },
              "y": {
                "type": "integer",
                "description": "Y-coordinate (rows)"
              },
              "w": {
                "type": "integer",
                "description": "Width (columns)"
              },
              "h": {
                "type": "integer",
                "description": "Height (rows)"
              }
            }
          },
          "visualization": {
            "type": "object",
            "description": "Visualization-specific configuration"
          },
          "thresholds": {
            "type": "array",
            "description": "Threshold levels for coloring",
            "items": {
              "type": "object",
              "required": ["value", "color"],
              "properties": {
                "value": {
                  "type": "number",
                  "description": "Threshold value"
                },
                "color": {
                  "type": "string",
                  "description": "Color to use for this threshold"
                }
              }
            }
          }
        }
      }
    },
    "permissions": {
      "type": "object",
      "description": "Dashboard access permissions",
      "properties": {
        "owner": {
          "type": "string",
          "description": "User ID of the dashboard owner"
        },
        "viewers": {
          "type": "array",
          "description": "User IDs with view access",
          "items": {
            "type": "string"
          }
        },
        "editors": {
          "type": "array",
          "description": "User IDs with edit access",
          "items": {
            "type": "string"
          }
        },
        "teams": {
          "type": "array",
          "description": "Team IDs with access",
          "items": {
            "type": "string"
          }
        },
        "public": {
          "type": "boolean",
          "default": false,
          "description": "Whether the dashboard is publicly accessible"
        }
      }
    }
  },
  "additionalProperties": false
}
```

## Storage Considerations

The Observability Service uses specialized storage solutions optimized for time-series data:

1. **Logs**: Typically stored in:
   * ElasticSearch - For full-text search and complex queries
   * OpenSearch - AWS-managed alternative to ElasticSearch
   * PostgreSQL with TimescaleDB - For smaller deployments

2. **Metrics**: Typically stored in:
   * Prometheus - For collection and short-term storage
   * Thanos or VictoriaMetrics - For long-term storage and high availability
   * TimescaleDB - For PostgreSQL-based metric storage

3. **Traces**: Typically stored in:
   * Jaeger - For trace collection and visualization
   * Tempo - For traces with Grafana integration
   * Zipkin - Lightweight alternative for distributed tracing

4. **Alerts and Dashboards**: Typically stored in:
   * PostgreSQL - For alert rules, silences, and dashboard definitions
   * Redis - For active alert state and dashboard user preferences

## Licensing Considerations

The Observability Service schema definitions support integration with various storage backends with different licensing models:

| Storage Solution | License | Considerations |
|------------------|---------|----------------|
| ElasticSearch | Elastic License 2.0 | Restrictions on certain features, not Apache compatible |
| OpenSearch | Apache 2.0 | Fully open-source alternative |
| Prometheus | Apache 2.0 | Fully open-source |
| TimescaleDB | Apache 2.0 | Fully open-source |
| PostgreSQL | PostgreSQL License | Permissive, similar to MIT/BSD |
| Jaeger | Apache 2.0 | Fully open-source |
| Grafana | AGPLv3 | Compatible with open-source use, restrictions for commercial embedding |

The Observability Service enforces appropriate separation of concerns to ensure flexible deployment with storage backends that match licensing requirements. 