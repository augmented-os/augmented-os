# Observability Service Internal Interfaces

## Overview

This document describes the internal interfaces used by the Observability Service for communication with other system components. These interfaces are not exposed externally and are intended for internal system integration only.

## Interface Types

The Observability Service uses the following types of internal interfaces:

* **Event-based interfaces**: Asynchronous communication via the Event Processing Service
* **Service-to-service APIs**: Direct synchronous communication with other services
* **Shared storage access**: Controlled access to storage backends

## Event-Based Interfaces

### Published Events

The Observability Service publishes the following events to the event bus:

| Event Type | Description | Payload Schema | Consumers |
|------------|-------------|----------------|-----------|
| `observability.alert.fired` | Published when an alert transitions to firing state | [Alert Fired Schema](#alert-fired) | Event Processing Service, Notification Service |
| `observability.alert.resolved` | Published when an alert transitions to resolved state | [Alert Resolved Schema](#alert-resolved) | Event Processing Service, Notification Service |
| `observability.service.health_changed` | Published when a service's health status changes | [Health Changed Schema](#health-changed) | Service Registry, Web Application |
| `observability.metrics.threshold_breach` | Published when a metric exceeds a defined threshold | [Threshold Breach Schema](#threshold-breach) | Event Processing Service |

### Subscribed Events

The Observability Service subscribes to the following events:

| Event Type | Description | Publisher | Handler |
|------------|-------------|-----------|---------|
| `system.service.started` | Service startup notification | Any service | Register new service in monitoring, initialize metrics collection |
| `system.service.stopped` | Service shutdown notification | Any service | Update service status, handle graceful termination of data collection |
| `system.service.deployment` | New service version deployed | Deployment Service | Track deployment events for correlation with metrics/logs |
| `observability.config.updated` | Configuration changes for monitoring | Admin Service | Update monitoring configuration, alert rules, etc. |

## Service-to-Service APIs

### Outbound Service Calls

The Observability Service makes the following calls to other services:

| Service | Endpoint | Purpose | Error Handling |
|---------|----------|---------|---------------|
| Auth Service | `POST /api/v1/auth/validate` | Validate authentication tokens | Circuit breaker with fallback to API key auth |
| Service Registry | `GET /api/v1/services` | Discover available services for monitoring | Cache results, retry with backoff |
| Event Processing Service | `POST /api/v1/events` | Publish events | Buffering, retry with backoff, circuit breaker |
| Notification Service | `POST /api/v1/notifications` | Send alert notifications | Fallback to direct email/webhook delivery |

### Inbound Service Calls

The Observability Service exposes the following internal endpoints for other services:

| Endpoint | Purpose | Callers | Authentication |
|----------|---------|---------|---------------|
| `GET /api/v1/internal/health/services` | Get health status of all services | Service Registry | Service API key |
| `GET /api/v1/internal/metrics/summary` | Get summary metrics for services | Web Application | Service API key |
| `POST /api/v1/internal/alerts/acknowledge` | Acknowledge alerts | Web Application, Event Processing | Service API key |
| `GET /api/v1/internal/config/status` | Check monitoring configuration status | Admin Service | Service API key |

## Shared Storage Access

The Observability Service manages its own dedicated storage backends for different types of observability data:

| Data Type | Storage Backend | Access Pattern | Coordination Mechanism |
|-----------|-----------------|----------------|------------------------|
| Logs | Elasticsearch or PostgreSQL | Write-heavy, with indexed reads | Direct access, no sharing |
| Metrics | Prometheus or TimescaleDB | Time-series optimized | Direct access, no sharing |
| Traces | Jaeger/OpenTelemetry backend | Trace-optimized storage | Direct access, no sharing |
| Alerts | PostgreSQL | Read/write with transactions | Direct access, no sharing |

## Event Schemas

### Alert Fired

```json
{
  "type": "observability.alert.fired",
  "id": "event_01H5G7X2P3Q4R5S6T7U8V9W0X",
  "timestamp": "2023-10-21T12:30:00.000Z",
  "data": {
    "alertId": "alert_01H5G7X2P3Q4R5S6T7U8V9W0X",
    "alertName": "High Error Rate",
    "severity": "critical",
    "value": 8.73,
    "threshold": 5,
    "service": "auth-service",
    "labels": {
      "category": "availability",
      "team": "platform"
    },
    "summary": "High error rate on auth-service",
    "description": "Error rate is 8.73%, which exceeds the threshold of 5%",
    "dashboardUrl": "https://dashboard.example.com/service?id=auth-service"
  },
  "metadata": {
    "correlationId": "corr_01H5G7X2P3Q4R5S6T7U8V9W0X",
    "source": "observability-service"
  }
}
```

### Alert Resolved

```json
{
  "type": "observability.alert.resolved",
  "id": "event_01H5G7X2P3Q4R5S6T7U8V9W0Y",
  "timestamp": "2023-10-21T12:45:00.000Z",
  "data": {
    "alertId": "alert_01H5G7X2P3Q4R5S6T7U8V9W0X",
    "alertName": "High Error Rate",
    "severity": "critical",
    "value": 3.21,
    "threshold": 5,
    "service": "auth-service",
    "labels": {
      "category": "availability",
      "team": "platform"
    },
    "summary": "High error rate on auth-service resolved",
    "description": "Error rate is now 3.21%, below the threshold of 5%",
    "dashboardUrl": "https://dashboard.example.com/service?id=auth-service",
    "duration": 900
  },
  "metadata": {
    "correlationId": "corr_01H5G7X2P3Q4R5S6T7U8V9W0X",
    "source": "observability-service"
  }
}
```

### Health Changed

```json
{
  "type": "observability.service.health_changed",
  "id": "event_01H5G7X2P3Q4R5S6T7U8V9W0Z",
  "timestamp": "2023-10-21T12:40:00.000Z",
  "data": {
    "service": "auth-service",
    "status": "degraded",
    "previousStatus": "healthy",
    "reason": "High error rate detected",
    "metrics": {
      "errorRate": 8.73,
      "latency": 120,
      "saturation": 0.65
    },
    "timestamp": "2023-10-21T12:39:55.000Z"
  },
  "metadata": {
    "correlationId": "corr_01H5G7X2P3Q4R5S6T7U8V9W0Z",
    "source": "observability-service"
  }
}
```

### Threshold Breach

```json
{
  "type": "observability.metrics.threshold_breach",
  "id": "event_01H5G7X2P3Q4R5S6T7U8A1B2C",
  "timestamp": "2023-10-21T12:38:00.000Z",
  "data": {
    "metric": "http_request_duration_seconds",
    "value": 0.78,
    "threshold": 0.5,
    "operator": "above",
    "service": "user-service",
    "labels": {
      "endpoint": "/users",
      "method": "GET"
    },
    "duration": 300,
    "evaluationTimestamp": "2023-10-21T12:37:55.000Z"
  },
  "metadata": {
    "correlationId": "corr_01H5G7X2P3Q4R5S6T7U8A1B2C",
    "source": "observability-service"
  }
}
```

## Error Handling

### Retry Policies

The Observability Service implements the following retry policies for internal communication:

| Interface Type | Retry Strategy | Backoff | Max Retries | Circuit Breaking |
|----------------|----------------|---------|-------------|------------------|
| Event Publishing | Exponential backoff | 100ms initial, 2x multiplier | 5 retries | Yes, 50% error rate threshold |
| Service Calls | Exponential backoff | 200ms initial, 2x multiplier | 3 retries | Yes, 30% error rate threshold |
| Storage Operations | Exponential backoff | 50ms initial, 2x multiplier | 5 retries | Yes, 40% error rate threshold |

### Fallback Mechanisms

When communication with dependent services fails, the following fallback mechanisms are used:

| Dependency | Fallback Approach | Impact |
|------------|-------------------|--------|
| Auth Service | Use cached validation results | Slightly outdated permissions |
| Event Processing | Local event buffering | Delay in event distribution |
| Notification Service | Direct notification delivery | Bypass centralized notification preferences |
| Storage Backends | Write to local buffer | Temporary reduction in query capability |

## Related Documentation

* [Public API](./api.md)
* [Data Model](../data_model.md)
* [Query Engine Implementation](../implementation/query_engine.md)
* [Alert Manager Implementation](../implementation/alert_manager.md) 