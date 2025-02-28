# Monitoring Guidelines

## Overview

The Workflow Orchestrator Service exposes various metrics, logs, and health checks to enable comprehensive monitoring and observability. This document provides guidance on effective monitoring strategies, key metrics to track, and recommended alerting thresholds.

## Metrics

The service exposes metrics in Prometheus format through the `/metrics` endpoint. The following key metrics should be monitored:

### Workflow Execution Metrics

| Metric Name | Type | Description |
|-------------|------|-------------|
| `workflow_started_total` | Counter | Total number of workflows started |
| `workflow_completed_total` | Counter | Total number of workflows completed |
| `workflow_failed_total` | Counter | Total number of failed workflows |
| `workflow_cancelled_total` | Counter | Total number of cancelled workflows |
| `workflow_execution_time_seconds` | Histogram | End-to-end workflow execution time |
| `workflow_active_count` | Gauge | Number of currently active workflows |
| `workflow_waiting_count` | Gauge | Number of workflows waiting for events |

### Step Execution Metrics

| Metric Name | Type | Description |
|-------------|------|-------------|
| `step_execution_total` | Counter | Total number of steps executed |
| `step_failed_total` | Counter | Total number of failed steps |
| `step_retry_total` | Counter | Total number of step retries |
| `step_execution_time_seconds` | Histogram | Step execution time |

### Database Metrics

| Metric Name | Type | Description |
|-------------|------|-------------|
| `db_operation_time_seconds` | Histogram | Time spent on database operations |
| `db_connection_pool_utilization` | Gauge | Database connection pool utilization |
| `db_query_errors_total` | Counter | Number of database query errors |
| `db_transaction_time_seconds` | Histogram | Time spent in database transactions |

### Event Processing Metrics

| Metric Name | Type | Description |
|-------------|------|-------------|
| `event_subscription_count` | Gauge | Number of active event subscriptions |
| `event_received_total` | Counter | Total number of events received |
| `event_processing_time_seconds` | Histogram | Event processing time |
| `event_processing_errors_total` | Counter | Number of event processing errors |

### Scheduler Metrics

| Metric Name | Type | Description |
|-------------|------|-------------|
| `scheduled_items_count` | Gauge | Number of items in the scheduler |
| `scheduler_processing_time_seconds` | Histogram | Time to process scheduler batches |
| `scheduler_missed_executions_total` | Counter | Number of missed scheduled executions |
| `scheduler_delayed_executions_total` | Counter | Number of delayed executions |

### System Metrics

| Metric Name | Type | Description |
|-------------|------|-------------|
| `memory_usage_bytes` | Gauge | Memory usage of the service |
| `cpu_usage_percent` | Gauge | CPU usage of the service |
| `http_requests_total` | Counter | Total HTTP requests to the service |
| `http_request_duration_seconds` | Histogram | HTTP request duration |
| `http_errors_total` | Counter | Total HTTP errors |

## Logs

The service uses structured logging with JSON format. Key logging information includes:

### Log Levels

| Level | Usage |
|-------|-------|
| `error` | Errors that require immediate attention |
| `warn` | Warnings that might need investigation |
| `info` | Important workflow state changes and service events |
| `debug` | Detailed information for troubleshooting |
| `trace` | Very detailed execution information (high volume) |

### Common Log Fields

| Field | Description |
|-------|-------------|
| `timestamp` | Time of the log entry |
| `level` | Log level |
| `message` | Human-readable message |
| `workflowId` | ID of the workflow (if applicable) |
| `workflowInstanceId` | ID of the workflow instance (if applicable) |
| `stepId` | ID of the step (if applicable) |
| `correlationId` | For tracking related events across services |
| `error` | Error details (if applicable) |
| `component` | Component that generated the log |

### Log Sampling and Filtering

For high-volume environments:

1. Sample debug logs at a lower rate
2. Keep all error and warning logs
3. Filter sensitive information from logs
4. Maintain full logs for a subset of workflows for detailed analysis

## Health Checks

The service provides several health check endpoints:

### `/health`

Overall service health check with HTTP status code:
- `200`: Service is healthy
- `503`: Service is unhealthy

### `/health/ready`

Readiness check that verifies:
- Database connectivity
- Event processing system connectivity
- Scheduler system health
- Internal component state

### `/health/live`

Liveness check that verifies:
- Service is responding
- No deadlocks detected
- Memory usage is within limits

### `/health/detailed`

Detailed health check with component-specific health information:

```json
{
  "status": "healthy",
  "components": {
    "database": {
      "status": "healthy",
      "details": {
        "connectionPool": "10/20",
        "latency": "5ms"
      }
    },
    "eventProcessing": {
      "status": "healthy",
      "details": {
        "subscriptionCount": 150,
        "processingDelay": "50ms"
      }
    },
    "scheduler": {
      "status": "healthy",
      "details": {
        "pendingTasks": 45,
        "lastExecutionTime": "2023-08-01T15:30:45Z"
      }
    }
  },
  "version": "1.5.2",
  "uptime": "5d 12h 30m"
}
```

## Monitoring Dashboards

Recommended dashboard panels for monitoring the Workflow Orchestrator:

### Overview Dashboard

- Service health status
- Total active workflows
- Workflow completion rate
- Error rate (step and workflow level)
- System resource utilization

### Workflow Execution Dashboard

- Workflow execution volume by type
- Workflow execution time distribution
- Success/failure rates by workflow type
- Waiting workflows by event type
- Compensation execution metrics

### Component Performance Dashboard

- Database query performance
- Event processing latency
- Scheduler execution accuracy
- Step execution time by task type
- Connection pool utilization

### Error Analysis Dashboard

- Error distribution by category
- Error trends over time
- Retry attempt distribution
- Circuit breaker state changes
- Dead letter queue metrics

## Alerting Recommendations

### Critical Alerts

| Condition | Threshold | Description |
|-----------|-----------|-------------|
| High error rate | >5% workflows failing | Unusual number of workflow failures |
| Service health | Unhealthy >1 min | Service health check failing |
| Database connectivity | Disconnected >30s | Database connection issues |
| Event processing delay | >5 min | Events not being processed in a timely manner |
| Memory usage | >90% | Service approaching memory limits |
| Dead letter queue | >10 items in 5 min | Unusual number of unprocessable workflows |

### Warning Alerts

| Condition | Threshold | Description |
|-----------|-----------|-------------|
| Elevated error rate | >2% workflows failing | Increasing workflow failure rate |
| Workflow execution time | >95th percentile | Workflows taking longer than expected |
| Connection pool | >80% utilization | Database connection pool highly utilized |
| Scheduled task delay | >1 min | Scheduled tasks not executing on time |
| Step retry rate | >10% increase | Unusual number of step retries |
| Circuit breaker | Open state | Circuit breaker has tripped |

## Troubleshooting

Common monitoring alerts and troubleshooting steps:

### High Workflow Failure Rate

1. Check error logs for common patterns
2. Analyze failed workflow distribution by type
3. Look for external system failures
4. Check for recent deployments or configuration changes
5. Verify database performance

### Slow Workflow Execution

1. Check for slow database queries
2. Analyze step execution times to identify bottlenecks
3. Review external system latencies
4. Check system resource utilization
5. Verify concurrency settings

### Event Processing Delays

1. Check event processing service health
2. Look for event subscription backlogs
3. Verify database performance for event queries
4. Check for high volume of events causing congestion
5. Review event handler execution times

### Database Performance Issues

1. Check for slow queries in database logs
2. Review connection pool utilization
3. Analyze database server resource utilization
4. Check for table locks or long-running transactions
5. Verify index usage and query plans

## Related Documentation

- [Configuration](./configuration.md)
- [Scaling Considerations](./scaling.md)
- [Database Optimization](../implementation/database_optimization.md) 