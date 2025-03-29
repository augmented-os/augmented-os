# Monitoring Guidelines

## Overview

The Task Execution Service exposes various metrics, logs, and health checks to enable comprehensive monitoring and observability. This document provides guidance on effective monitoring strategies, key metrics to track, and recommended alerting thresholds.

## Metrics

The service exposes metrics in Prometheus format through the `/metrics` endpoint. The following key metrics should be monitored:

### Task Execution Metrics

| Metric Name | Type | Description |
|----|----|----|
| `task_submitted_total` | Counter | Total number of tasks submitted |
| `task_started_total` | Counter | Total number of tasks started |
| `task_completed_total` | Counter | Total number of tasks completed |
| `task_failed_total` | Counter | Total number of failed tasks |
| `task_cancelled_total` | Counter | Total number of cancelled tasks |
| `task_execution_time_seconds` | Histogram | End-to-end task execution time |
| `task_queue_time_seconds` | Histogram | Time spent in queue before execution |
| `task_active_count` | Gauge | Number of currently active tasks |

### Executor Metrics

| Metric Name | Type | Description |
|----|----|----|
| `executor_task_total` | Counter | Total number of tasks handled by executor |
| `executor_task_failed_total` | Counter | Total number of failed tasks per executor |
| `executor_task_retry_total` | Counter | Total number of task retries per executor |
| `executor_execution_time_seconds` | Histogram | Task execution time per executor |
| `executor_capacity_utilization` | Gauge | Executor capacity utilization percentage |
| `executor_queue_depth` | Gauge | Number of tasks waiting in executor queue |

### Task Router Metrics

| Metric Name | Type | Description |
|----|----|----|
| `router_routing_time_seconds` | Histogram | Time to route a task to an executor |
| `router_routing_errors_total` | Counter | Number of routing errors |
| `router_queue_overflow_total` | Counter | Number of queue overflow events |
| `router_task_priority_distribution` | Histogram | Distribution of task priorities |

### Integration Metrics

| Metric Name | Type | Description |
|----|----|----|
| `integration_request_total` | Counter | Total number of integration requests |
| `integration_request_failed_total` | Counter | Failed integration requests |
| `integration_request_time_seconds` | Histogram | Integration request time |
| `integration_service_availability` | Gauge | Availability of integration services |

## Logs

The Task Execution Service uses structured logging with the following log levels:

* `ERROR` - Critical errors requiring immediate attention
* `WARN` - Potential issues that might require investigation
* `INFO` - Normal operational information
* `DEBUG` - Detailed information for troubleshooting

Key log events to monitor:

| Event | Log Level | Description |
|----|----|----|
| `TaskSubmissionFailed` | ERROR | Task submission failed |
| `TaskExecutionFailed` | ERROR | Task execution failed |
| `ExecutorUnavailable` | ERROR | Executor is unavailable |
| `QueueCapacityExceeded` | WARN | Task queue capacity exceeded |
| `TaskRetryAttempt` | WARN | Task retry attempt |
| `SlowTaskExecution` | WARN | Task execution time exceeded threshold |
| `TaskCompleted` | INFO | Task completed successfully |
| `TaskRouted` | INFO | Task routed to executor |

## Health Checks

The service exposes the following health check endpoints:

* `/health` - Overall service health
* `/health/liveness` - Service liveness check
* `/health/readiness` - Service readiness check
* `/health/executors` - Executor availability check

The health checks return HTTP 200 when healthy and HTTP 503 when unhealthy, with a JSON body containing detailed status information.

## Alerting Recommendations

The following alerts are recommended for proactive monitoring:

### Critical Alerts (Immediate Action Required)

* **High Task Failure Rate**: `task_failed_total / task_completed_total > 0.05` for 5 minutes
* **Executor Unavailable**: Any executor unavailable for more than 2 minutes
* **Queue Overflow**: `router_queue_overflow_total > 0` in 5 minutes
* **Service Unhealthy**: Health check failing for more than 1 minute

### Warning Alerts (Investigation Required)

* **Elevated Task Failure Rate**: `task_failed_total / task_completed_total > 0.02` for 15 minutes
* **High Queue Time**: `task_queue_time_seconds_p95 > 60` for 10 minutes
* **Executor Capacity**: `executor_capacity_utilization > 0.85` for 15 minutes
* **Slow Task Execution**: `task_execution_time_seconds_p95 > [task-specific threshold]` for 15 minutes

## Dashboard Recommendations

A comprehensive monitoring dashboard should include:


1. **Task Execution Overview**
   * Task submission rate
   * Success/failure rates
   * Execution time distribution
   * Active tasks by type
2. **Executor Performance**
   * Executor utilization
   * Task processing rate
   * Error rates by executor
   * Queue depths
3. **Task Router Performance**
   * Routing time
   * Queue metrics
   * Routing errors
   * Task distribution by executor
4. **Integration Health**
   * Integration service availability
   * Request success/failure rates
   * Integration response times
5. **System Health**
   * Service health status
   * Resource utilization (CPU, memory)
   * Error logs frequency
   * API response times

## Troubleshooting Guide

When investigating issues, follow these steps:


1. **Check Service Health**: Verify overall service health via `/health` endpoint
2. **Review Error Logs**: Look for ERROR and WARN level logs
3. **Examine Metrics**: Check for anomalies in task execution and queue metrics
4. **Verify Executor Status**: Ensure all executors are available and functioning
5. **Check Integration Services**: Verify external integration services are responsive
6. **Review Recent Changes**: Identify any recent deployments or configuration changes

Common issues and resolutions:

| Issue | Potential Causes | Resolution Steps |
|----|----|----|
| High task failure rate | Invalid task definitions, executor issues | Check error logs, verify task definitions, restart problematic executors |
| Long queue times | Insufficient executor capacity, routing issues | Scale up executors, check for routing bottlenecks |
| Executor unavailable | Resource constraints, configuration issues | Restart executor, check resource allocation, verify configuration |
| Integration failures | External service issues, network problems | Verify external service status, check network connectivity |


