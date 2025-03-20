# Observability Service Data Model

## Overview

The Observability Service primarily interacts with these data schemas:

* Logs: Structured log entries from services and applications
* Metrics: Time-series data points representing system and application measurements
* Traces: Distributed tracing spans and contexts
* Alerts: Alert rule definitions and alert instances
* Dashboards: Visualization configurations for observability data

This document focuses on the data structures used within the Observability Service and their storage considerations. Additional schema documentation may be added to the common schema directory as the system evolves.

## Log Data Model

The log data model captures structured log information:

```typescript
interface LogEntry {
  id: string;                          // UUID for the log entry
  timestamp: string;                   // ISO 8601 timestamp
  level: LogLevel;                     // Log severity level
  service: string;                     // Source service name
  message: string;                     // Human-readable log message
  traceId?: string;                    // Optional trace identifier (for correlation)
  spanId?: string;                     // Optional span identifier (for correlation)
  context: Record<string, any>;        // Additional contextual information
  labels: Record<string, string>;      // Searchable metadata labels
  host: string;                        // Host/container identifier
  createdAt: string;                   // When the log was received by the service
}

type LogLevel = 
  'TRACE' | 
  'DEBUG' | 
  'INFO' | 
  'WARN' | 
  'ERROR' | 
  'FATAL';
```

Example log entry:
```json
{
  "id": "log_01H5G7X2P3Q4R5S6T7U8V9W0X",
  "timestamp": "2023-10-21T12:34:56.789Z",
  "level": "ERROR",
  "service": "auth-service",
  "message": "Failed to authenticate user: Invalid credentials",
  "traceId": "trace_01H5G7X2P3Q4R5S6T7U8V9W0X",
  "spanId": "span_01H5G7X2P3Q4R5S6T7U8V9W0X",
  "context": {
    "userId": "user_123",
    "ipAddress": "192.168.1.1",
    "attemptCount": 3
  },
  "labels": {
    "environment": "production",
    "region": "us-west-2"
  },
  "host": "auth-service-pod-12345",
  "createdAt": "2023-10-21T12:34:56.790Z"
}
```

## Metric Data Model

The metric data model captures time-series measurements:

```typescript
interface MetricDataPoint {
  id: string;                          // UUID for the data point
  name: string;                        // Metric name
  timestamp: string;                   // ISO 8601 timestamp
  value: number;                       // Measured value
  tags: Record<string, string>;        // Dimensional tags (e.g., service, instance)
  type: MetricType;                    // Type of metric
  unit?: string;                       // Optional unit of measurement
  createdAt: string;                   // When the metric was received
}

type MetricType = 
  'COUNTER' |                          // Always increasing value
  'GAUGE' |                            // Point-in-time value
  'HISTOGRAM' |                        // Distribution of values
  'TIMER';                             // Duration measurement
```

Example metric data point:
```json
{
  "id": "metric_01H5G7X2P3Q4R5S6T7U8V9W0X",
  "name": "http_requests_total",
  "timestamp": "2023-10-21T12:34:56.789Z",
  "value": 1,
  "tags": {
    "service": "api-gateway",
    "endpoint": "/users",
    "method": "GET",
    "status_code": "200"
  },
  "type": "COUNTER",
  "unit": "requests",
  "createdAt": "2023-10-21T12:34:56.790Z"
}
```

## Trace Data Model

The trace data model captures distributed tracing information:

```typescript
interface TraceSpan {
  id: string;                          // UUID for the span
  traceId: string;                     // ID that groups related spans
  parentId?: string;                   // Optional parent span ID
  name: string;                        // Name of the operation
  service: string;                     // Service that generated the span
  startTime: string;                   // ISO 8601 start timestamp
  endTime: string;                     // ISO 8601 end timestamp
  duration: number;                    // Duration in milliseconds
  status: TraceStatus;                 // Status of the operation
  attributes: Record<string, any>;     // Additional span attributes
  events: SpanEvent[];                 // List of events within the span
  createdAt: string;                   // When the span was received
}

type TraceStatus = 
  'OK' | 
  'ERROR';

interface SpanEvent {
  timestamp: string;                   // ISO 8601 timestamp
  name: string;                        // Event name
  attributes: Record<string, any>;     // Event attributes
}
```

Example trace span:
```json
{
  "id": "span_01H5G7X2P3Q4R5S6T7U8V9W0X",
  "traceId": "trace_01H5G7X2P3Q4R5S6T7U8V9W0X",
  "parentId": "span_01H5G7X2P3Q4R5S6T7U8V9W0X_parent",
  "name": "authenticate_user",
  "service": "auth-service",
  "startTime": "2023-10-21T12:34:56.789Z",
  "endTime": "2023-10-21T12:34:56.889Z",
  "duration": 100,
  "status": "OK",
  "attributes": {
    "userId": "user_123",
    "authMethod": "password"
  },
  "events": [
    {
      "timestamp": "2023-10-21T12:34:56.800Z",
      "name": "password_validated",
      "attributes": {
        "mechanism": "bcrypt"
      }
    }
  ],
  "createdAt": "2023-10-21T12:34:56.890Z"
}
```

## Alert Data Model

The alert data model defines rules and captures alerts:

```typescript
interface AlertRule {
  id: string;                          // UUID for the rule
  name: string;                        // Human-readable name
  description: string;                 // Detailed description
  query: string;                       // Query to evaluate (PromQL, LogQL, etc.)
  threshold: number;                   // Threshold value
  comparison: ComparisonOperator;      // How to compare value to threshold
  severity: AlertSeverity;             // Alert severity level
  labels: Record<string, string>;      // Labels to attach to alerts
  notificationChannels: string[];      // IDs of notification channels
  enabled: boolean;                    // Whether the rule is active
  evaluationInterval: number;          // Seconds between evaluations
  createdAt: string;                   // Creation timestamp
  updatedAt: string;                   // Last update timestamp
}

type ComparisonOperator = 
  'GT' | 'GTE' | 'LT' | 'LTE' | 'EQ' | 'NEQ';

type AlertSeverity = 
  'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';

interface AlertInstance {
  id: string;                          // UUID for the alert instance
  ruleId: string;                      // Reference to the rule
  status: AlertStatus;                 // Current status
  value: number;                       // Observed value
  startTime: string;                   // When the alert started
  endTime?: string;                    // When the alert resolved (if applicable)
  labels: Record<string, string>;      // Labels from the rule + additional context
  annotations: Record<string, string>; // Additional information
  notified: boolean;                   // Whether notifications were sent
  createdAt: string;                   // When the alert was created
  updatedAt: string;                   // Last update timestamp
}

type AlertStatus = 
  'FIRING' | 'RESOLVED' | 'ACKNOWLEDGED' | 'SUPPRESSED';
```

Example alert rule:
```json
{
  "id": "alert_rule_01H5G7X2P3Q4R5S6T7U8V9W0X",
  "name": "High Error Rate",
  "description": "Triggers when error rate exceeds 5% over 5 minutes",
  "query": "sum(rate(http_requests_total{status_code=~\"5..\"}[5m])) / sum(rate(http_requests_total[5m])) * 100",
  "threshold": 5,
  "comparison": "GT",
  "severity": "HIGH",
  "labels": {
    "team": "platform",
    "category": "reliability"
  },
  "notificationChannels": ["slack-platform-alerts", "pagerduty-primary"],
  "enabled": true,
  "evaluationInterval": 60,
  "createdAt": "2023-10-21T12:34:56.789Z",
  "updatedAt": "2023-10-21T12:34:56.789Z"
}
```

## Dashboard Data Model

The dashboard data model defines visualization configurations:

```typescript
interface Dashboard {
  id: string;                          // UUID for the dashboard
  name: string;                        // Human-readable name
  description: string;                 // Detailed description
  panels: Panel[];                     // List of visualization panels
  variables: DashboardVariable[];      // Template variables for queries
  timeRange: TimeRange;                // Default time range
  refreshInterval: number;             // Seconds between auto-refresh
  createdBy: string;                   // User ID of creator
  createdAt: string;                   // Creation timestamp
  updatedAt: string;                   // Last update timestamp
}

interface Panel {
  id: string;                          // UUID for the panel
  title: string;                       // Panel title
  type: PanelType;                     // Visualization type
  query: string;                       // Data query
  position: {                          // Panel position
    x: number;                         // Grid x-coordinate
    y: number;                         // Grid y-coordinate
    w: number;                         // Width in grid units
    h: number;                         // Height in grid units
  };
  options: Record<string, any>;        // Panel-specific options
}

type PanelType = 
  'TIME_SERIES' | 
  'BAR' | 
  'TABLE' | 
  'STAT' | 
  'LOG' | 
  'TRACE';

interface DashboardVariable {
  name: string;                        // Variable name
  label: string;                       // Human-readable label
  type: 'QUERY' | 'CUSTOM' | 'CONST';  // Variable type
  query?: string;                      // Query to populate values (if type=QUERY)
  values?: string[];                   // Static values (if type=CUSTOM)
  value?: string;                      // Static value (if type=CONST)
  multi: boolean;                      // Allow multiple selections
}

interface TimeRange {
  from: string;                        // Start time (relative or absolute)
  to: string;                          // End time (relative or absolute)
}
```

Example dashboard:
```json
{
  "id": "dashboard_01H5G7X2P3Q4R5S6T7U8V9W0X",
  "name": "API Gateway Overview",
  "description": "Overview of API Gateway performance and errors",
  "panels": [
    {
      "id": "panel_01H5G7X2P3Q4R5S6T7U8V9W0X",
      "title": "Request Rate by Endpoint",
      "type": "TIME_SERIES",
      "query": "sum(rate(http_requests_total{service=\"api-gateway\"}[5m])) by (endpoint)",
      "position": {
        "x": 0,
        "y": 0,
        "w": 12,
        "h": 8
      },
      "options": {
        "legend": true,
        "tooltip": true,
        "yaxis": {
          "unit": "requests/s"
        }
      }
    }
  ],
  "variables": [
    {
      "name": "service",
      "label": "Service",
      "type": "QUERY",
      "query": "label_values(http_requests_total, service)",
      "multi": false
    }
  ],
  "timeRange": {
    "from": "now-6h",
    "to": "now"
  },
  "refreshInterval": 60,
  "createdBy": "user_admin",
  "createdAt": "2023-10-21T12:34:56.789Z",
  "updatedAt": "2023-10-21T12:34:56.789Z"
}
```

## Storage Considerations

The Observability Service implements the following storage optimizations:

1. **Time-based Partitioning for Logs** - Log data is partitioned by time to optimize query performance and enable efficient retention policies.

2. **Time-series Optimization for Metrics** - Metrics use specialized storage optimized for time-series data with efficient downsampling capabilities.

3. **Trace Indexing** - Traces are indexed by traceId, spanId, and service to enable fast retrieval and correlation.

4. **Hot/Warm/Cold Storage Tiers** - Data is automatically moved between storage tiers based on age and access patterns:
   - Hot (recent data): In-memory or SSD storage
   - Warm (intermediate): Object storage or HDD
   - Cold (archive): Low-cost object storage

5. **Compression** - All stored data is compressed to reduce storage costs and improve I/O performance.

## Storage Backend Options

The Observability Service supports multiple storage backends, with licensing considerations:

| Data Type | Recommended Backend | License | Alternative |
|-----------|---------------------|---------|------------|
| Logs | Elasticsearch | Elastic License | PostgreSQL (Apache 2.0) |
| Metrics | Prometheus TSDB | Apache 2.0 | InfluxDB OSS (MIT) |
| Traces | Jaeger | Apache 2.0 | PostgreSQL (Apache 2.0) |
| Alerts & Dashboards | PostgreSQL | PostgreSQL License | SQLite (Public Domain) |

## Related Documentation

* [Data Collection Implementation](./implementation/data_collection.md)
* [Storage Manager Implementation](./implementation/storage_manager.md)
* [Query Engine Implementation](./implementation/query_engine.md)
* [Alert Manager Implementation](./implementation/alert_manager.md)


