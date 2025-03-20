# Monitoring Guidelines

## Overview

The Observability Service exposes various metrics, logs, and health checks to enable comprehensive monitoring and observability of itself. This document provides guidance on effective monitoring strategies, key metrics to track, and recommended alerting thresholds for the Observability Service itself.

## Metrics

The service exposes metrics in Prometheus format through the `/metrics` endpoint. The following key metrics should be monitored:

### Data Collection Metrics

| Metric Name | Type | Description |
|----|----|----|
| `observability_logs_received_total` | Counter | Total number of log entries received |
| `observability_logs_processed_total` | Counter | Total number of log entries successfully processed |
| `observability_logs_errors_total` | Counter | Total number of errors during log processing |
| `observability_metrics_received_total` | Counter | Total number of metric data points received |
| `observability_metrics_processed_total` | Counter | Total number of metric data points successfully processed |
| `observability_traces_received_total` | Counter | Total number of trace spans received |
| `observability_traces_processed_total` | Counter | Total number of trace spans successfully processed |
| `observability_collection_batch_size` | Histogram | Distribution of batch sizes for data collection operations |
| `observability_collection_time_seconds` | Histogram | Time taken to process collection requests |

### Storage Metrics

| Metric Name | Type | Description |
|----|----|----|
| `observability_storage_write_total` | Counter | Total number of storage write operations |
| `observability_storage_write_errors_total` | Counter | Failed storage write operations |
| `observability_storage_read_total` | Counter | Total number of storage read operations |
| `observability_storage_read_errors_total` | Counter | Failed storage read operations |
| `observability_storage_write_time_seconds` | Histogram | Time spent on storage write operations |
| `observability_storage_read_time_seconds` | Histogram | Time spent on storage read operations |
| `observability_storage_size_bytes` | Gauge | Current storage size by data type (logs, metrics, traces) |
| `observability_storage_retention_operations_total` | Counter | Count of retention policy enforcement operations |

### Query Engine Metrics

| Metric Name | Type | Description |
|----|----|----|
| `observability_queries_total` | Counter | Total number of queries executed |
| `observability_queries_failed_total` | Counter | Number of failed queries |
| `observability_query_time_seconds` | Histogram | Query execution time |
| `observability_query_scanned_bytes` | Histogram | Amount of data scanned per query |
| `observability_query_results_count` | Histogram | Number of results returned per query |
| `observability_query_cache_hit_total` | Counter | Number of query cache hits |
| `observability_query_cache_miss_total` | Counter | Number of query cache misses |
| `observability_query_concurrent_count` | Gauge | Number of currently executing queries |

### Alert Manager Metrics

| Metric Name | Type | Description |
|----|----|----|
| `observability_alert_rules_total` | Gauge | Total number of configured alert rules |
| `observability_alert_evaluations_total` | Counter | Total number of alert rule evaluations |
| `observability_alert_evaluation_time_seconds` | Histogram | Time spent evaluating alert rules |
| `observability_alerts_firing_total` | Counter | Count of alerts that transitioned to firing state |
| `observability_alerts_resolved_total` | Counter | Count of alerts that transitioned to resolved state |
| `observability_alerts_current` | Gauge | Current number of firing alerts by severity |
| `observability_notification_sent_total` | Counter | Number of alert notifications sent by channel |
| `observability_notification_failed_total` | Counter | Number of failed alert notification deliveries |

### External Service Metrics

| Metric Name | Type | Description |
|----|----|----|
| `observability_auth_service_request_total` | Counter | Total number of requests to Auth Service |
| `observability_auth_service_request_failed_total` | Counter | Failed requests to Auth Service |
| `observability_event_processing_publish_total` | Counter | Events published to Event Processing Service |
| `observability_event_processing_publish_failed_total` | Counter | Failed event publications |
| `observability_notification_service_request_total` | Counter | Requests to Notification Service |
| `observability_notification_service_request_time_seconds` | Histogram | Request time to Notification Service |

## Logs

The Observability Service uses structured logging with the following log levels:

| Level | Usage |
|----|----|
| ERROR | Unexpected errors that require immediate attention |
| WARN | Potential issues that might require investigation |
| INFO | Important operational events (service start/stop, configuration changes) |
| DEBUG | Detailed information for troubleshooting (disabled in production) |
| TRACE | Very detailed debugging information (never enabled in production) |

### Key Log Events

The following log events should be monitored:

| Log Event | Level | Description | Action Required |
|----|----|----|----|
| `observability.collection.rate_limit_exceeded` | WARN | Client exceeded collection rate limits | Investigate client behavior, consider increasing limits |
| `observability.storage.write_failure` | ERROR | Failed to write data to storage backend | Check storage backend health and connectivity |
| `observability.storage.backend_unavailable` | ERROR | Storage backend is unavailable | Verify backend service, check network connectivity |
| `observability.query.timeout` | WARN | Query execution exceeded timeout | Optimize query, check for resource constraints |
| `observability.query.excessive_resource` | WARN | Query consumed excessive resources | Review query pattern, consider query limits |
| `observability.alert.evaluation_failure` | ERROR | Failed to evaluate alert rules | Check query engine, verify alert rule syntax |
| `observability.notification.delivery_failure` | ERROR | Failed to deliver alert notification | Check notification channel configuration |
| `observability.retention.policy_execution` | INFO | Retention policy execution completed | No action required, informational only |

### Log Format

```json
{
  "timestamp": "2023-10-21T12:34:56.789Z",
  "level": "INFO",
  "service": "observability-service",
  "component": "alert-manager",
  "traceId": "trace_01H5G7X2P3Q4R5S6T7U8V9W0X",
  "spanId": "span_01H5G7X2P3Q4R5S6T7U8V9W0X",
  "message": "Alert rule evaluation completed",
  "context": {
    "rulesEvaluated": 42,
    "alertsFiring": 2,
    "evaluationTimeMs": 156,
    "batchId": "batch_01H5G7X2P3Q4R5S6T7U8V9W0X"
  }
}
```

## Health Checks

The service exposes health check endpoints:

* `/health/liveness` - Basic check that the service is running
* `/health/readiness` - Check that the service is ready to accept requests
* `/health/dependency` - Check status of all dependencies

### Dependency Health

The following dependencies are critical for service operation:

| Dependency | Impact if Unavailable | Recovery Strategy |
|----|----|----|
| Primary Storage Backend | Unable to store new logs, metrics, traces | Buffering in memory with circuit breaking, automatic retry with exponential backoff |
| Secondary Storage Backends | Reduced query capability for specific data types | Fallback to primary storage, degraded query response |
| Event Processing Service | Alert notifications delayed, event integration fails | Local buffering, direct notification fallback, automatic reconnection |
| Auth Service | Unable to validate user tokens | Cached token validation, API key fallback for service-to-service |
| Notification Service | Unable to send alert notifications | Direct webhook delivery, email fallback, local queuing with retry |

## Alerting

### Critical Alerts

The following conditions should trigger immediate alerts:

| Condition | Threshold | Impact | Response |
|----|----|----|----|
| High data collection error rate | > 5% of incoming data over 5 minutes | Data loss or corruption | Check collection endpoints, verify client requests, check storage backends |
| Storage backend unavailable | Any primary storage backend unreachable for > 2 minutes | Data loss, query failures | Verify backend health, check connectivity, ensure buffer isn't overflowing |
| Query engine high error rate | > 10% of queries failing over 5 minutes | Dashboards and alerts not functioning | Check query logs, verify storage access, check for invalid queries |
| Alert evaluation failures | > 5 consecutive failures for any rule | Missed alerts for critical conditions | Check alert rule definitions, verify query engine, check for dependent service failures |
| Service unavailable | Health check fails for > 1 minute | Complete loss of observability collection | Check service logs, verify resource usage, check for dependency failures |

### Warning Alerts

The following conditions should trigger warning alerts:

| Condition | Threshold | Impact | Response |
|----|----|----|----|
| Elevated data ingestion latency | P95 > 500ms over 10 minutes | Delayed data visibility | Check for resource constraints, verify storage backend performance |
| High collection buffer utilization | > 70% capacity for > 10 minutes | Risk of data loss if buffer fills | Check storage write performance, consider scaling up |
| Query latency increase | P95 > 2s over 15 minutes | Slow dashboard rendering, delayed alerts | Optimize queries, check storage read performance, consider query caching |
| Alert notification failures | > 10% failure rate over 15 minutes | Missed alert notifications | Check notification channels, verify external service connectivity |
| High resource utilization | CPU > 80% or Memory > 80% for 15 minutes | Performance degradation, risk of OOM | Consider scaling horizontally, optimize resource-intensive operations |

## Dashboards

Recommended Grafana dashboard panels:


1. **Service Overview**
   * Request rate, error rate, and latency by endpoint (logs, metrics, traces)
   * Storage write/read operations and latency
   * Resource utilization (CPU, memory, network)
   * Active alert count by severity
2. **Data Collection Performance**
   * Ingestion rate by data type (logs, metrics, traces)
   * Batch sizes and processing times
   * Error rates by data type and client
   * Buffer utilization
3. **Storage Performance**
   * Write/read operations by storage backend
   * Storage size by data type
   * Retention policy execution times
   * Storage errors by backend and operation type
4. **Query Engine Performance**
   * Query rate and latency
   * Cache hit/miss ratio
   * Concurrent query count
   * Data scanned per query
   * Query errors by type
5. **Alert Manager**
   * Alert evaluations per second
   * Evaluation duration
   * Active alerts by severity
   * Alert state transitions
   * Notification success/failure by channel

## Related Documentation

* [Configuration](./configuration.md)
* [Scaling](./scaling.md)
* [Data Collection Implementation](../implementation/data_collection.md)
* [Query Engine Implementation](../implementation/query_engine.md)
* [Alert Manager Implementation](../implementation/alert_manager.md)


