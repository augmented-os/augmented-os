# Monitoring Guidelines

## Overview

The Integration Service exposes various metrics, logs, and health checks to enable comprehensive monitoring and observability. This document provides guidance on effective monitoring strategies, key metrics to track, and recommended alerting thresholds.

## Metrics

The service exposes metrics in Prometheus format through the `/metrics` endpoint. The following key metrics should be monitored:

### Integration Execution Metrics

| Metric Name | Type | Description |
|----|----|----|
| `integration_method_executions_total` | Counter | Total number of integration method executions |
| `integration_method_execution_success_total` | Counter | Successful integration method executions |
| `integration_method_execution_failed_total` | Counter | Failed integration method executions |
| `integration_method_execution_time_seconds` | Histogram | Time taken to execute integration methods |
| `integration_active_requests` | Gauge | Number of currently active integration requests |
| `integration_queue_depth` | Gauge | Number of queued integration requests |

### Authentication Metrics

| Metric Name | Type | Description |
|----|----|----|
| `integration_auth_attempts_total` | Counter | Total authentication attempts |
| `integration_auth_success_total` | Counter | Successful authentication attempts |
| `integration_auth_failed_total` | Counter | Failed authentication attempts |
| `integration_auth_refresh_total` | Counter | Number of token refresh operations |
| `integration_auth_refresh_failed_total` | Counter | Failed token refresh operations |
| `integration_auth_time_seconds` | Histogram | Time taken for authentication operations |

### Database Metrics

| Metric Name | Type | Description |
|----|----|----|
| `integration_db_operation_time_seconds` | Histogram | Time spent on database operations |
| `integration_db_connection_pool_utilization` | Gauge | Database connection pool utilization |
| `integration_db_query_errors_total` | Counter | Number of database query errors |
| `integration_db_transaction_time_seconds` | Histogram | Time spent in database transactions |

### External Service Metrics

| Metric Name | Type | Description |
|----|----|----|
| `integration_external_request_total` | Counter | Total number of requests to external systems |
| `integration_external_request_failed_total` | Counter | Failed requests to external systems |
| `integration_external_request_time_seconds` | Histogram | Request time to external systems |
| `integration_rate_limit_hits_total` | Counter | Number of rate limit hits |
| `integration_circuit_breaker_open_total` | Counter | Number of times circuit breakers opened |
| `integration_external_system_availability` | Gauge | Availability status of external systems (1=available, 0=unavailable) |

## Logs

The Integration Service uses structured logging with the following log levels:

| Level | Usage |
|-------|-------|
| ERROR | Unexpected errors that require immediate attention |
| WARN | Potential issues that might require investigation |
| INFO | Important operational events (service start/stop, configuration changes) |
| DEBUG | Detailed information for troubleshooting (disabled in production) |
| TRACE | Very detailed debugging information (never enabled in production) |

### Key Log Events

The following log events should be monitored:

| Log Event | Level | Description | Action Required |
|-----------|-------|-------------|----------------|
| `integration.method.execution.error` | ERROR | Error executing integration method | Check error details and external system status |
| `integration.auth.error` | ERROR | Authentication failure | Verify credentials and external system auth endpoints |
| `integration.adapter.error` | ERROR | Error in integration adapter | Check adapter compatibility and configuration |
| `integration.rate_limit.exceeded` | WARN | Rate limit exceeded for external system | Review rate limit settings or implement backoff strategy |
| `integration.circuit_breaker.open` | WARN | Circuit breaker opened for external system | Check external system status and availability |
| `integration.credential.expired` | WARN | Credential expiration | Verify credential refresh mechanism |
| `integration.definition.deployed` | INFO | New integration definition deployed | No action needed |
| `integration.instance.created` | INFO | New integration instance created | No action needed |

### Log Format

```json
{
  "timestamp": "ISO-8601 timestamp",
  "level": "INFO",
  "service": "integration-service",
  "traceId": "uuid",
  "spanId": "uuid",
  "message": "Human readable message",
  "context": {
    "integrationId": "integration-id",
    "methodName": "method-name",
    "instanceId": "instance-id",
    "statusCode": 200,
    "errorCode": "ERROR_CODE"
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
|------------|------------------------|-------------------|
| Database | Cannot read/write integration definitions or instances | Automatic retry with exponential backoff |
| Credential Store | Cannot retrieve credentials for authentication | Use cached credentials with TTL |
| External Systems | Integration methods will fail | Implement circuit breakers and fallback mechanisms |
| Event Bus | Integration events will not be published | Buffer events locally and retry publishing |

## Alerting

### Critical Alerts

The following conditions should trigger immediate alerts:

| Condition | Threshold | Impact | Response |
|-----------|-----------|--------|----------|
| High error rate | > 5% of requests over 5 minutes | User workflows depending on integrations may fail | Check logs for error patterns and external system status |
| Service unavailable | Health check fails for > 1 minute | Complete integration functionality unavailable | Verify service status, check for deployment issues |
| Authentication failures | > 10 authentication failures in 5 minutes | Integration methods requiring auth will fail | Check credential store and external system auth status |
| Multiple circuit breakers open | > 3 circuit breakers open simultaneously | Multiple integration types unavailable | Check external systems status and network connectivity |

### Warning Alerts

The following conditions should trigger warning alerts:

| Condition | Threshold | Impact | Response |
|-----------|-----------|--------|----------|
| Elevated latency | P95 > 2000 ms over 10 minutes | Slower integration response times | Check for network issues or external system latency |
| Increased error rate | > 1% of requests over 15 minutes | Some integration requests may fail | Monitor for escalation, check external systems |
| Token refresh failures | > 2 refresh failures within 1 hour | Credentials may expire soon | Check token refresh mechanism and external auth services |
| High rate limit hits | > 5 rate limit hits within 10 minutes | Some requests may be delayed | Adjust rate limiting parameters or implement backoff |

## Dashboards

Recommended Grafana dashboard panels:

1. **Service Overview**
   * Request rate, error rate, and latency
   * Active integration requests
   * Recent errors

2. **Integration Execution Metrics**
   * Method execution success/failure rates
   * Execution duration percentiles
   * External system availability

3. **Resource Utilization**
   * CPU, memory, and network usage
   * Database connection pool utilization
   * Thread pool utilization

4. **Dependencies**
   * External system request rates and latencies
   * Authentication success/failure rates
   * Circuit breaker status

## Related Documentation

* [Configuration](./configuration.md)
* [Scaling](./scaling.md)
* [Method Executor](../implementation/method_executor.md)
* [Credential Manager](../implementation/credential_manager.md) 