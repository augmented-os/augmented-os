# Validation Service Monitoring

This document describes the monitoring, logging, health check, and alerting infrastructure for the Validation Service.

## Metrics

The Validation Service exposes metrics via a Prometheus-compatible endpoint at `/metrics`. The following metrics are available:

### Core Metrics

| Metric Name | Type | Description | Example Query |
|-------------|------|-------------|--------------|
| `validation_requests_total` | Counter | Total number of validation requests | `rate(validation_requests_total[5m])` |
| `validation_success_total` | Counter | Successful validation requests | `rate(validation_success_total[5m])` |
| `validation_failed_total` | Counter | Failed validation requests | `rate(validation_failed_total[5m])` |
| `validation_duration_seconds` | Histogram | Duration of validation requests | `histogram_quantile(0.95, sum(rate(validation_duration_seconds_bucket[5m])) by (le))` |
| `schema_cache_size` | Gauge | Current size of schema cache | `schema_cache_size` |
| `schema_cache_hits_total` | Counter | Total schema cache hits | `rate(schema_cache_hits_total[5m])` |
| `schema_cache_misses_total` | Counter | Total schema cache misses | `rate(schema_cache_misses_total[5m])` |
| `custom_validators_registered` | Gauge | Number of registered custom validators | `custom_validators_registered` |
| `custom_validator_execution_total` | Counter | Total custom validator executions | `rate(custom_validator_execution_total[5m])` |
| `custom_validator_errors_total` | Counter | Total custom validator errors | `rate(custom_validator_errors_total[5m])` |
| `schema_registry_operations_total` | Counter | Total schema registry operations | `rate(schema_registry_operations_total[5m])` |
| `http_requests_total` | Counter | Total HTTP requests | `rate(http_requests_total[5m])` |
| `http_request_duration_seconds` | Histogram | HTTP request duration | `histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))` |

### System Metrics

| Metric Name | Type | Description | Example Query |
|-------------|------|-------------|--------------|
| `process_cpu_seconds_total` | Counter | Total user and system CPU time spent in seconds | `rate(process_cpu_seconds_total[5m])` |
| `process_resident_memory_bytes` | Gauge | Resident memory size in bytes | `process_resident_memory_bytes` |
| `process_open_fds` | Gauge | Number of open file descriptors | `process_open_fds` |
| `process_max_fds` | Gauge | Maximum number of open file descriptors | `process_max_fds` |
| `go_goroutines` | Gauge | Number of goroutines that currently exist | `go_goroutines` |
| `go_gc_duration_seconds` | Summary | Garbage collection duration | `go_gc_duration_seconds{quantile="0.9"}` |
| `go_memstats_alloc_bytes` | Gauge | Number of bytes allocated and still in use | `go_memstats_alloc_bytes` |

### Database Metrics

| Metric Name | Type | Description | Example Query |
|-------------|------|-------------|--------------|
| `database_connections` | Gauge | Number of active database connections | `database_connections` |
| `database_connection_errors_total` | Counter | Total database connection errors | `rate(database_connection_errors_total[5m])` |
| `database_query_duration_seconds` | Histogram | Database query duration | `histogram_quantile(0.95, sum(rate(database_query_duration_seconds_bucket[5m])) by (le))` |
| `database_queries_total` | Counter | Total database queries | `rate(database_queries_total[5m])` |

## Metric Dashboards

The following dashboards are available for monitoring the Validation Service:

### Operational Dashboard

Primary dashboard for day-to-day operations monitoring.

**Panels:**
- Request Rate and Success/Failure
- Validation Latency (P50, P95, P99)
- Error Rate by Endpoint
- Cache Hit Ratio
- Database Query Performance
- System Resource Usage
- Active Schema Count
- Custom Validator Performance

![Operational Dashboard]

### Performance Dashboard

Detailed performance metrics for optimization and troubleshooting.

**Panels:**
- Validation Duration by Schema Type
- Custom Validator Execution Time
- Memory Usage Breakdown
- Database Query Analysis
- Cache Efficiency
- Goroutine Count
- GC Duration and Frequency
- Connection Pool Saturation

![Performance Dashboard]

### Error Analysis Dashboard

Focused on error detection and diagnosis.

**Panels:**
- Error Rate by Endpoint
- Error Rate by Schema Type
- Custom Validator Errors
- Database Errors
- HTTP 4xx/5xx Response Codes
- Validation Failures by Reason
- Recent Error Logs

![Error Dashboard]

## Logs

The Validation Service uses structured JSON logging that can be collected and analyzed with standard tools like ELK, Splunk, or Loki.

### Log Levels

| Level | Usage |
|-------|-------|
| ERROR | Unexpected errors that require immediate attention |
| WARN | Potential issues that don't impact service availability |
| INFO | Standard operational information |
| DEBUG | Detailed information for troubleshooting |
| TRACE | Very verbose diagnostic information (development only) |

### Standard Log Fields

| Field | Description | Example |
|-------|-------------|---------|
| `timestamp` | ISO8601 timestamp | `2023-05-15T14:22:33.456Z` |
| `level` | Log level | `INFO` |
| `message` | Log message | `Validation request completed` |
| `service` | Service name | `validation-service` |
| `instance` | Instance identifier | `validation-service-pod-abc123` |
| `requestId` | Unique request identifier | `req-123e4567-e89b-12d3-a456-426614174000` |
| `traceId` | Distributed tracing ID | `trace-123e4567-e89b-12d3-a456-426614174000` |
| `userId` | User identifier (if available) | `user-123` |
| `path` | Request path | `/v1/validate` |
| `method` | HTTP method | `POST` |
| `statusCode` | HTTP status code | `200` |
| `duration` | Request duration in ms | `42.5` |
| `correlationId` | Business transaction ID | `order-123456` |

### Event-Specific Fields

| Event Type | Additional Fields | Example |
|------------|-------------------|---------|
| Validation Request | `schemaId`, `isValid`, `errorCount` | `{"schemaId": "schema-123", "isValid": false, "errorCount": 3}` |
| Schema Registration | `schemaId`, `schemaType`, `version` | `{"schemaId": "schema-123", "schemaType": "json", "version": "1.2.0"}` |
| Custom Validator | `validatorId`, `executionTime` | `{"validatorId": "email-validator", "executionTime": 5.2}` |
| Cache Operation | `operation`, `cacheType`, `result` | `{"operation": "get", "cacheType": "schema", "result": "hit"}` |
| Database Query | `operation`, `table`, `queryTime` | `{"operation": "select", "table": "schemas", "queryTime": 3.5}` |

### Log Sample

```json
{
  "timestamp": "2023-05-15T14:22:33.456Z",
  "level": "INFO",
  "message": "Validation request completed",
  "service": "validation-service",
  "instance": "validation-service-pod-abc123",
  "requestId": "req-123e4567-e89b-12d3-a456-426614174000",
  "traceId": "trace-123e4567-e89b-12d3-a456-426614174000",
  "userId": "user-123",
  "path": "/v1/validate",
  "method": "POST",
  "statusCode": 200,
  "duration": 42.5,
  "correlationId": "order-123456",
  "schemaId": "schema-123",
  "isValid": true,
  "errorCount": 0
}
```

### Log Collection and Analysis

Recommended log collection and analysis setup:

1. **Collection**: Filebeat or Fluentd to collect logs from containers/pods
2. **Processing**: Logstash for log transformation and enrichment 
3. **Storage**: Elasticsearch for storage and indexing
4. **Visualization**: Kibana for searching and dashboarding
5. **Alerting**: ElastAlert or Elasticsearch Watcher for log-based alerts

Logs should be retained for a minimum of 30 days in production environments.

## Health Checks

The Validation Service provides the following health check endpoints:

| Endpoint | Type | Description | Expected Response |
|----------|------|-------------|-------------------|
| `/health` | Basic | Simple service availability check | `{"status": "UP"}` |
| `/health/liveness` | Liveness | Verifies process is running | `{"status": "UP"}` |
| `/health/readiness` | Readiness | Verifies service is ready to handle requests | `{"status": "UP", "details": {...}}` |
| `/health/detailed` | Detailed | Comprehensive component status | `{"status": "UP", "components": {...}}` |

### Detailed Health Check Example

```json
{
  "status": "UP",
  "components": {
    "database": {
      "status": "UP",
      "details": {
        "connectionPool": "25/50",
        "responseTime": "12ms"
      }
    },
    "schemaRegistry": {
      "status": "UP",
      "details": {
        "schemaCount": 128,
        "validatorCount": 15
      }
    },
    "cache": {
      "status": "UP",
      "details": {
        "hitRatio": 0.95,
        "size": "512MB",
        "entries": 1024
      }
    },
    "diskSpace": {
      "status": "UP",
      "details": {
        "free": "10.5GB",
        "threshold": "1GB"
      }
    }
  },
  "timestamp": "2023-05-15T14:30:45.123Z",
  "version": "1.2.3"
}
```

### Health Check Configuration

Configure Kubernetes liveness and readiness probes:

```yaml
livenessProbe:
  httpGet:
    path: /health/liveness
    port: 8080
  initialDelaySeconds: 30
  periodSeconds: 10
  timeoutSeconds: 5
  failureThreshold: 3

readinessProbe:
  httpGet:
    path: /health/readiness
    port: 8080
  initialDelaySeconds: 15
  periodSeconds: 5
  timeoutSeconds: 3
  failureThreshold: 2
```

## Alerting

The following alerts are recommended for the Validation Service:

### High Priority Alerts

| Alert Name | Condition | Description | Response |
|------------|-----------|-------------|----------|
| ValidationServiceDown | Instance is not responding to health checks | Critical service outage | Immediate investigation |
| HighErrorRate | Error rate > 10% for 5 minutes | Service experiencing high error rate | Investigate cause and potential rollback |
| DatabaseConnectionFailure | Database connection failures > 5 in 1 minute | Database connectivity issues | Check database health and network |
| HighLatency | 95th percentile latency > 500ms for 10 minutes | Service performance degradation | Check for resource contention |
| SchemaRegistryFailure | Schema registry operation failures > 5 in 1 minute | Cannot register or retrieve schemas | Investigate schema registry component |

### Medium Priority Alerts

| Alert Name | Condition | Description | Response |
|------------|-----------|-------------|----------|
| HighCPUUsage | CPU usage > 80% for 15 minutes | Resource contention potential | Consider scaling or optimizing |
| HighMemoryUsage | Memory usage > 85% for 15 minutes | Potential memory leak or need for scaling | Monitor for OOM risk, consider scaling |
| LowCacheHitRate | Cache hit rate < 70% for 30 minutes | Inefficient cache usage | Review cache size and strategy |
| CustomValidatorErrors | Custom validator errors > 20 in 5 minutes | Issues with custom validators | Investigate problematic validators |
| SlowDatabaseQueries | 95th percentile query duration > 100ms for 15 minutes | Database performance issues | Review and optimize queries |

### Low Priority Alerts

| Alert Name | Condition | Description | Response |
|------------|-----------|-------------|----------|
| HighGCDuration | GC duration 90th percentile > 100ms for 30 minutes | Garbage collection pressure | Review memory usage patterns |
| IncreasedRequestLatency | 50th percentile latency increased by 50% over 1 hour | Gradual performance degradation | Investigate cause during business hours |
| LowDiskSpace | Free disk space < 20% | Approaching disk space limits | Plan for cleanup or expansion |
| HighOpenFileDescriptors | Open file descriptors > 80% of max | Approaching resource limits | Review for file descriptor leaks |
| WarningLogs | Warning logs > 100 in 30 minutes | Increased warning activity | Review logs during business hours |

### Alert Delivery

Alerts should be delivered through multiple channels:

1. **Primary**: PagerDuty or similar for high priority alerts
2. **Secondary**: Slack channel notifications for all alert levels
3. **Tertiary**: Email notifications for medium and low priority alerts
4. **Dashboard**: Alert visualization on Grafana dashboards

### Alert Suppression

To prevent alert storms, implement the following suppression strategies:

1. **Grouping**: Group related alerts from same service
2. **Rate Limiting**: Limit alert frequency to 1 per 5 minutes for same alert type
3. **Maintenance Windows**: Suppress alerts during planned maintenance
4. **Dependencies**: Define alert dependencies (e.g., suppress database query alerts if database connection alert is firing)

## Related Documentation

- [Scaling](./scaling.md) - Performance and scaling information
- [Configuration](./configuration.md) - Configuration options that affect monitoring
- [Incident Response](./incident-response.md) - Procedures for handling incidents 