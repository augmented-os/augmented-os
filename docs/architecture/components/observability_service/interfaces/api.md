# Observability Service API Reference

## Overview

The Observability Service exposes a RESTful API that allows clients to submit, query, and manage logs, metrics, traces, and alert configurations. This document details the available endpoints, request formats, and response structures.

An OpenAPI specification is available at [observability-service-api.yaml](./observability-service-api.yaml) for integration with API tools and code generators.

## Base URL

```
/api/v1/observability
```

## Authentication

All API endpoints require authentication using either:

* Bearer token authentication via the Auth Service
* API key in the `X-API-Key` header for service-to-service communication

## Endpoints

### Logs

#### Submit Log Batch

```
POST /logs/batch
```

Submits multiple log entries in a single request.

**Request Body:**

```json
{
  "logs": [
    {
      "timestamp": "2023-10-21T12:34:56.789Z",
      "level": "ERROR",
      "service": "auth-service",
      "message": "Failed to authenticate user: Invalid credentials",
      "traceId": "trace_01H5G7X2P3Q4R5S6T7U8V9W0X",
      "context": {
        "userId": "user_123",
        "ipAddress": "192.168.1.1",
        "attemptCount": 3
      },
      "labels": {
        "environment": "production",
        "region": "us-west-2"
      }
    },
    {
      "timestamp": "2023-10-21T12:34:57.123Z",
      "level": "INFO",
      "service": "user-service",
      "message": "User profile updated successfully",
      "context": {
        "userId": "user_456"
      },
      "labels": {
        "environment": "production",
        "region": "us-west-2"
      }
    }
  ]
}
```

**Response:**

```json
{
  "accepted": 2,
  "rejected": 0,
  "errors": [],
  "batchId": "batch_01H5G7X2P3Q4R5S6T7U8V9W0X"
}
```

#### Submit Single Log

```
POST /logs
```

Submits a single log entry.

**Request Body:**

```json
{
  "timestamp": "2023-10-21T12:34:56.789Z",
  "level": "ERROR",
  "service": "auth-service",
  "message": "Failed to authenticate user: Invalid credentials",
  "traceId": "trace_01H5G7X2P3Q4R5S6T7U8V9W0X",
  "context": {
    "userId": "user_123",
    "ipAddress": "192.168.1.1",
    "attemptCount": 3
  },
  "labels": {
    "environment": "production",
    "region": "us-west-2"
  }
}
```

**Response:**

```json
{
  "id": "log_01H5G7X2P3Q4R5S6T7U8V9W0X",
  "accepted": true
}
```

#### Query Logs

```
GET /logs
```

Retrieves logs based on search criteria.

**Query Parameters:**

* `service`: Filter by service name (e.g., `auth-service`)
* `level`: Filter by log level (e.g., `ERROR`, `INFO`)
* `start_time`: Start of time range (ISO 8601)
* `end_time`: End of time range (ISO 8601)
* `query`: Text search across message and context
* `limit`: Maximum number of results (default: 100, max: 1000)
* `traceId`: Filter by trace ID for correlation
* `labels`: Filter by labels (format: `key1=value1,key2=value2`)

**Response:**

```json
{
  "items": [
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
    },
    {
      "id": "log_01H5G7X2P3Q4R5S6T7U8V9W0Y",
      "timestamp": "2023-10-21T12:34:57.123Z",
      "level": "INFO",
      "service": "user-service",
      "message": "User profile updated successfully",
      "context": {
        "userId": "user_456"
      },
      "labels": {
        "environment": "production",
        "region": "us-west-2"
      },
      "host": "user-service-pod-67890",
      "createdAt": "2023-10-21T12:34:57.130Z"
    }
  ],
  "pagination": {
    "total": 42,
    "returned": 2,
    "nextCursor": "cursor_01H5G7X2P3Q4R5S6T7U8V9W0Z"
  }
}
```

### Metrics

#### Submit Metrics Batch

```
POST /metrics/batch
```

Submits multiple metric data points in a single request.

**Request Body:**

```json
{
  "metrics": [
    {
      "name": "http_requests_total",
      "timestamp": "2023-10-21T12:34:56.789Z",
      "value": 1,
      "tags": {
        "service": "api-gateway",
        "endpoint": "/users",
        "method": "GET",
        "status_code": "200"
      },
      "type": "COUNTER"
    },
    {
      "name": "http_request_duration_seconds",
      "timestamp": "2023-10-21T12:34:56.789Z",
      "value": 0.127,
      "tags": {
        "service": "api-gateway",
        "endpoint": "/users",
        "method": "GET"
      },
      "type": "HISTOGRAM"
    }
  ]
}
```

**Response:**

```json
{
  "accepted": 2,
  "rejected": 0,
  "errors": [],
  "batchId": "batch_01H5G7X2P3Q4R5S6T7U8V9W0X"
}
```

#### Submit Single Metric

```
POST /metrics
```

Submits a single metric data point.

**Request Body:**

```json
{
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
  "unit": "requests"
}
```

**Response:**

```json
{
  "id": "metric_01H5G7X2P3Q4R5S6T7U8V9W0X",
  "accepted": true
}
```

#### Query Metrics

```
GET /metrics
```

Retrieves metrics based on search criteria and performs time series analysis.

**Query Parameters:**

* `name`: Metric name (e.g., `http_requests_total`)
* `start_time`: Start of time range (ISO 8601)
* `end_time`: End of time range (ISO 8601)
* `step`: Time interval for aggregation (e.g., `1m`, `5m`, `1h`)
* `function`: Aggregation function (`sum`, `avg`, `min`, `max`, `count`, `rate`)
* `tags`: Filter by tags (format: `key1=value1,key2=value2`)
* `groupBy`: Group results by tag keys (comma-separated list)

**Response:**

```json
{
  "name": "http_requests_total",
  "series": [
    {
      "tags": {
        "service": "api-gateway",
        "endpoint": "/users",
        "method": "GET"
      },
      "datapoints": [
        {
          "timestamp": "2023-10-21T12:30:00.000Z",
          "value": 123
        },
        {
          "timestamp": "2023-10-21T12:35:00.000Z",
          "value": 145
        },
        {
          "timestamp": "2023-10-21T12:40:00.000Z",
          "value": 167
        }
      ]
    },
    {
      "tags": {
        "service": "api-gateway",
        "endpoint": "/auth",
        "method": "POST"
      },
      "datapoints": [
        {
          "timestamp": "2023-10-21T12:30:00.000Z",
          "value": 45
        },
        {
          "timestamp": "2023-10-21T12:35:00.000Z",
          "value": 52
        },
        {
          "timestamp": "2023-10-21T12:40:00.000Z",
          "value": 61
        }
      ]
    }
  ],
  "metadata": {
    "start": "2023-10-21T12:30:00.000Z",
    "end": "2023-10-21T12:45:00.000Z",
    "step": "5m",
    "function": "sum"
  }
}
```

### Traces

#### Submit Trace Spans Batch

```
POST /traces/batch
```

Submits multiple trace spans in a single request.

**Request Body:**

```json
{
  "spans": [
    {
      "traceId": "trace_01H5G7X2P3Q4R5S6T7U8V9W0X",
      "spanId": "span_01H5G7X2P3Q4R5S6T7U8V9W0X",
      "parentId": "span_01H5G7X2P3Q4R5S6T7U8V9W0X_parent",
      "name": "authenticate_user",
      "service": "auth-service",
      "startTime": "2023-10-21T12:34:56.789Z",
      "endTime": "2023-10-21T12:34:56.889Z",
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
      ]
    },
    {
      "traceId": "trace_01H5G7X2P3Q4R5S6T7U8V9W0X",
      "spanId": "span_01H5G7X2P3Q4R5S6T7U8V9W0Y",
      "parentId": "span_01H5G7X2P3Q4R5S6T7U8V9W0X",
      "name": "lookup_user_profile",
      "service": "user-service",
      "startTime": "2023-10-21T12:34:56.890Z",
      "endTime": "2023-10-21T12:34:56.950Z",
      "status": "OK",
      "attributes": {
        "userId": "user_123"
      }
    }
  ]
}
```

**Response:**

```json
{
  "accepted": 2,
  "rejected": 0,
  "errors": [],
  "batchId": "batch_01H5G7X2P3Q4R5S6T7U8V9W0Z"
}
```

#### Submit Single Trace Span

```
POST /traces
```

Submits a single trace span.

**Request Body:**

```json
{
  "traceId": "trace_01H5G7X2P3Q4R5S6T7U8V9W0X",
  "spanId": "span_01H5G7X2P3Q4R5S6T7U8V9W0X",
  "parentId": "span_01H5G7X2P3Q4R5S6T7U8V9W0X_parent",
  "name": "authenticate_user",
  "service": "auth-service",
  "startTime": "2023-10-21T12:34:56.789Z",
  "endTime": "2023-10-21T12:34:56.889Z",
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
  ]
}
```

**Response:**

```json
{
  "id": "span_01H5G7X2P3Q4R5S6T7U8V9W0X",
  "accepted": true
}
```

#### Retrieve Trace

```
GET /traces/{traceId}
```

Retrieves all spans belonging to a specific trace.

**Path Parameters:**

* `traceId`: The unique identifier of the trace

**Response:**

```json
{
  "traceId": "trace_01H5G7X2P3Q4R5S6T7U8V9W0X",
  "name": "authenticate_user",
  "root": {
    "spanId": "span_01H5G7X2P3Q4R5S6T7U8V9W0X_parent",
    "name": "handle_login_request",
    "service": "api-gateway",
    "startTime": "2023-10-21T12:34:56.700Z",
    "endTime": "2023-10-21T12:34:57.000Z",
    "status": "OK",
    "attributes": {
      "userId": "user_123",
      "clientIp": "192.168.1.1"
    }
  },
  "spans": [
    {
      "spanId": "span_01H5G7X2P3Q4R5S6T7U8V9W0X",
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
      ]
    },
    {
      "spanId": "span_01H5G7X2P3Q4R5S6T7U8V9W0Y",
      "parentId": "span_01H5G7X2P3Q4R5S6T7U8V9W0X",
      "name": "lookup_user_profile",
      "service": "user-service",
      "startTime": "2023-10-21T12:34:56.890Z",
      "endTime": "2023-10-21T12:34:56.950Z",
      "duration": 60,
      "status": "OK",
      "attributes": {
        "userId": "user_123"
      }
    }
  ],
  "statistics": {
    "totalSpans": 2,
    "services": ["auth-service", "user-service"],
    "totalDuration": 300,
    "statusCounts": {
      "OK": 2,
      "ERROR": 0
    }
  }
}
```

### Alerts

#### Create Alert Rule

```
POST /alerts
```

Creates a new alert rule.

**Request Body:**

```json
{
  "name": "High Error Rate",
  "description": "Alert when service error rate exceeds threshold",
  "query": "sum(rate(http_requests_total{status=~\"5..\"}[5m])) by (service) / sum(rate(http_requests_total[5m])) by (service) * 100",
  "condition": {
    "type": "threshold",
    "operator": "above",
    "value": 5,
    "for": "5m"
  },
  "severity": "critical",
  "labels": {
    "category": "availability",
    "team": "platform"
  },
  "annotations": {
    "summary": "High error rate on {{ $labels.service }}",
    "description": "Error rate is {{ $value }}%, which exceeds the threshold of 5%",
    "dashboard": "https://dashboard.example.com/service?id={{ $labels.service }}"
  },
  "notificationChannels": ["slack-platform-alerts", "pagerduty-platform"],
  "silenced": false,
  "evaluationInterval": "1m"
}
```

**Response:**

```json
{
  "id": "alert_01H5G7X2P3Q4R5S6T7U8V9W0X",
  "name": "High Error Rate",
  "description": "Alert when service error rate exceeds threshold",
  "query": "sum(rate(http_requests_total{status=~\"5..\"}[5m])) by (service) / sum(rate(http_requests_total[5m])) by (service) * 100",
  "condition": {
    "type": "threshold",
    "operator": "above",
    "value": 5,
    "for": "5m"
  },
  "severity": "critical",
  "labels": {
    "category": "availability",
    "team": "platform"
  },
  "annotations": {
    "summary": "High error rate on {{ $labels.service }}",
    "description": "Error rate is {{ $value }}%, which exceeds the threshold of 5%",
    "dashboard": "https://dashboard.example.com/service?id={{ $labels.service }}"
  },
  "notificationChannels": ["slack-platform-alerts", "pagerduty-platform"],
  "silenced": false,
  "evaluationInterval": "1m",
  "createdAt": "2023-10-21T12:34:56.789Z",
  "updatedAt": "2023-10-21T12:34:56.789Z"
}
```

#### List Alert Rules

```
GET /alerts
```

Returns a list of configured alert rules.

**Query Parameters:**

* `search`: Text search across name and description
* `severity`: Filter by severity level (e.g., `critical`, `warning`)
* `labels`: Filter by labels (format: `key1=value1,key2=value2`)
* `status`: Filter by status (e.g., `active`, `silenced`)
* `page`: Page number (default: 1)
* `limit`: Items per page (default: 20)

**Response:**

```json
{
  "items": [
    {
      "id": "alert_01H5G7X2P3Q4R5S6T7U8V9W0X",
      "name": "High Error Rate",
      "description": "Alert when service error rate exceeds threshold",
      "query": "sum(rate(http_requests_total{status=~\"5..\"}[5m])) by (service) / sum(rate(http_requests_total[5m])) by (service) * 100",
      "condition": {
        "type": "threshold",
        "operator": "above",
        "value": 5,
        "for": "5m"
      },
      "severity": "critical",
      "labels": {
        "category": "availability",
        "team": "platform"
      },
      "notificationChannels": ["slack-platform-alerts", "pagerduty-platform"],
      "silenced": false,
      "evaluationInterval": "1m",
      "status": "active",
      "lastEvaluation": "2023-10-21T12:34:00.000Z",
      "updatedAt": "2023-10-21T12:34:56.789Z"
    },
    {
      "id": "alert_01H5G7X2P3Q4R5S6T7U8V9W0Y",
      "name": "High Latency",
      "description": "Alert when service response time exceeds threshold",
      "query": "histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (service, le))",
      "condition": {
        "type": "threshold",
        "operator": "above",
        "value": 0.5,
        "for": "5m"
      },
      "severity": "warning",
      "labels": {
        "category": "performance",
        "team": "platform"
      },
      "notificationChannels": ["slack-platform-alerts"],
      "silenced": true,
      "evaluationInterval": "1m",
      "status": "silenced",
      "lastEvaluation": "2023-10-21T12:34:00.000Z",
      "updatedAt": "2023-10-21T12:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 42,
    "pages": 3
  }
}
```

#### Get Active Alerts

```
GET /alerts/active
```

Returns a list of currently firing alert instances.

**Query Parameters:**

* `severity`: Filter by severity level (e.g., `critical`, `warning`)
* `labels`: Filter by labels (format: `key1=value1,key2=value2`)
* `silenced`: Include silenced alerts (default: false)
* `service`: Filter by affected service
* `page`: Page number (default: 1)
* `limit`: Items per page (default: 20)

**Response:**

```json
{
  "items": [
    {
      "id": "alertinstance_01H5G7X2P3Q4R5S6T7U8V9W0X",
      "alertId": "alert_01H5G7X2P3Q4R5S6T7U8V9W0X",
      "name": "High Error Rate",
      "query": "sum(rate(http_requests_total{status=~\"5..\"}[5m])) by (service) / sum(rate(http_requests_total[5m])) by (service) * 100",
      "severity": "critical",
      "status": "firing",
      "value": 8.73,
      "labels": {
        "service": "auth-service",
        "category": "availability",
        "team": "platform"
      },
      "annotations": {
        "summary": "High error rate on auth-service",
        "description": "Error rate is 8.73%, which exceeds the threshold of 5%",
        "dashboard": "https://dashboard.example.com/service?id=auth-service"
      },
      "startsAt": "2023-10-21T12:30:00.000Z",
      "endsAt": null,
      "lastNotification": "2023-10-21T12:31:00.000Z",
      "notificationsSent": 1
    },
    {
      "id": "alertinstance_01H5G7X2P3Q4R5S6T7U8V9W0Y",
      "alertId": "alert_01H5G7X2P3Q4R5S6T7U8V9W0Y",
      "name": "High Latency",
      "query": "histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (service, le))",
      "severity": "warning",
      "status": "firing",
      "value": 0.78,
      "labels": {
        "service": "user-service",
        "category": "performance",
        "team": "platform"
      },
      "annotations": {
        "summary": "High latency on user-service",
        "description": "95th percentile latency is 780ms, which exceeds the threshold of 500ms",
        "dashboard": "https://dashboard.example.com/service?id=user-service"
      },
      "startsAt": "2023-10-21T12:25:00.000Z",
      "endsAt": null,
      "lastNotification": "2023-10-21T12:26:00.000Z",
      "notificationsSent": 1
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 2,
    "pages": 1
  }
}
```

## Error Handling

The API uses standard HTTP status codes to indicate the success or failure of requests.

### Common Error Codes

| Status Code | Description |
|----|----|
| 400 | Bad Request - The request was malformed or contains invalid parameters |
| 401 | Unauthorized - Authentication is required or failed |
| 403 | Forbidden - The authenticated user lacks permission |
| 404 | Not Found - The requested resource does not exist |
| 409 | Conflict - The request conflicts with the current state |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - An unexpected error occurred |

### Error Response Format

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      "field1": "Error details for field1",
      "field2": "Error details for field2"
    },
    "requestId": "unique-request-identifier"
  }
}
```

## Rate Limiting

The API implements rate limiting to ensure fair usage. Limits are applied per API key or user.

| Endpoint | Rate Limit |
|----|----|
| All endpoints | 100 requests per minute |
| POST/PUT/DELETE | 50 requests per minute |

Rate limit information is included in response headers:

* `X-RateLimit-Limit`: Total requests allowed in the period
* `X-RateLimit-Remaining`: Requests remaining in the period
* `X-RateLimit-Reset`: Time when the rate limit resets (Unix timestamp)

## Versioning

The API is versioned through the URL path (e.g., `/api/v1/[resource]`). When breaking changes are introduced, a new version will be released.

## Related Documentation

* [Internal Interfaces](./internal.md)
* [Data Model](../data_model.md)
* [Data Collection Implementation](../implementation/data_collection.md)
* [Storage Manager Implementation](../implementation/storage_manager.md)
* [Query Engine Implementation](../implementation/query_engine.md)
* [Alert Manager Implementation](../implementation/alert_manager.md)


