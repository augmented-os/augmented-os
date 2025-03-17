# Configuration

## Overview

The Workflow Orchestrator Service provides extensive configuration options to adapt its behavior to different environments and use cases. This document details the available configuration settings and their impact on service behavior.

## Configuration Sources

Configuration can be provided through several mechanisms (in order of precedence):


1. Environment variables
2. Configuration files (YAML/JSON)
3. Command-line arguments
4. Default values

## Core Configuration Options

### Service Configuration

```yaml
service:
  name: workflow-orchestrator
  port: 3000
  host: 0.0.0.0
  shutdownTimeoutMs: 30000
  healthCheckPath: /health
  metricsPath: /metrics
```

### Database Configuration

```yaml
database:
  type: postgresql
  host: ${DB_HOST:-localhost}
  port: ${DB_PORT:-5432}
  username: ${DB_USERNAME:-postgres}
  password: ${DB_PASSWORD}
  database: ${DB_NAME:-workflow_db}
  schema: ${DB_SCHEMA:-workflow}
  poolSize: ${DB_POOL_SIZE:-10}
  maxIdleConnections: ${DB_MAX_IDLE:-5}
  connectionTimeoutMs: ${DB_CONN_TIMEOUT:-5000}
```

### Workflow Engine Configuration

```yaml
workflow:
  maxConcurrentWorkflows: ${MAX_CONCURRENT_WORKFLOWS:-100}
  defaultRetryPolicy:
    maxAttempts: ${DEFAULT_RETRY_MAX_ATTEMPTS:-3}
    initialInterval: ${DEFAULT_RETRY_INITIAL_INTERVAL:-1000}
    backoffMultiplier: ${DEFAULT_RETRY_BACKOFF_MULTIPLIER:-2}
    maxInterval: ${DEFAULT_RETRY_MAX_INTERVAL:-60000}
  taskTimeout: ${TASK_TIMEOUT_MS:-30000}
  lockTimeoutMs: ${LOCK_TIMEOUT_MS:-10000}
  maxStepHistoryItems: ${MAX_STEP_HISTORY_ITEMS:-100}
  enableCompensation: ${ENABLE_COMPENSATION:-true}
```

### Scheduler Configuration

```yaml
scheduler:
  pollingIntervalMs: ${SCHEDULER_POLLING_INTERVAL:-60000}
  maxItemsPerBatch: ${SCHEDULER_BATCH_SIZE:-50}
  nearFutureThresholdMs: ${NEAR_FUTURE_THRESHOLD:-300000}  # 5 minutes
  memoryQueueSize: ${MEMORY_QUEUE_SIZE:-1000}
  defaultTimezone: ${DEFAULT_TIMEZONE:-UTC}
```

### Event Processing Configuration

```yaml
events:
  subscriptionPollingIntervalMs: ${EVENT_POLLING_INTERVAL:-1000}
  maxEventsPerBatch: ${MAX_EVENTS_PER_BATCH:-100}
  subscriptionCleanupIntervalMs: ${SUBSCRIPTION_CLEANUP_INTERVAL:-3600000}
  maxSubscriptionsPerWorkflow: ${MAX_SUBSCRIPTIONS_PER_WORKFLOW:-10}
```

### Logging Configuration

```yaml
logging:
  level: ${LOG_LEVEL:-info}
  format: ${LOG_FORMAT:-json}
  colorize: ${LOG_COLORIZE:-false}
  includeTimestamp: true
  redactSensitiveData: true
  sensitiveFields:
    - password
    - apiKey
    - token
    - secret
```

### Circuit Breaker Configuration

```yaml
circuitBreaker:
  enabled: ${CIRCUIT_BREAKER_ENABLED:-true}
  failureThreshold: ${CIRCUIT_BREAKER_FAILURE_THRESHOLD:-5}
  resetTimeoutMs: ${CIRCUIT_BREAKER_RESET_TIMEOUT:-30000}
  successThreshold: ${CIRCUIT_BREAKER_SUCCESS_THRESHOLD:-2}
```

## Environment-Specific Configuration

Different configuration profiles can be defined for various environments:

```yaml
# development.yaml
database:
  host: localhost
  logging: true

# production.yaml
database:
  poolSize: 50
  logging: false

workflow:
  maxConcurrentWorkflows: 500
```

## Dynamic Configuration

Some configuration settings can be modified at runtime through the administrative API:

* Log levels
* Concurrency limits
* Circuit breaker settings

```
PATCH /api/config/workflow
{
  "maxConcurrentWorkflows": 200
}
```

## Configuration Validation

On startup, the service validates the configuration:


1. Required fields are present
2. Values are within acceptable ranges
3. Dependent settings are compatible

If validation fails, the service will log detailed errors and exit.

## Encrypting Sensitive Configuration

Sensitive configuration values (e.g., passwords, API keys) can be encrypted:

```yaml
database:
  password: ${encrypted:AES256:base64:AbCdEf123456=}

integration:
  apiKey: ${encrypted:AES256:base64:XyZ987654321=}
```

The service supports several encryption schemes and will decrypt values at runtime using the provided decryption key (typically an environment variable).

## Concurrency Control Configuration

Fine-grained control over system load and resource allocation:

```yaml
concurrency:
  globalMaxConcurrent: ${GLOBAL_MAX_CONCURRENT:-100}
  workflowTypeLimits:
    order_processing: ${ORDER_WORKFLOW_LIMIT:-50}
    payment_processing: ${PAYMENT_WORKFLOW_LIMIT:-25}
  tenantLimits:
    enterprise: ${ENTERPRISE_TENANT_LIMIT:-50}
    standard: ${STANDARD_TENANT_LIMIT:-10}
  userLimits:
    default: ${DEFAULT_USER_LIMIT:-5}
  resourceBasedLimits: ${ENABLE_RESOURCE_LIMITS:-true}
  queueStrategy: ${QUEUE_STRATEGY:-priority} # One of: fifo, priority, deadline
```

## Metrics Configuration

Integration with metrics and monitoring systems:

```yaml
metrics:
  enabled: ${METRICS_ENABLED:-true}
  provider: ${METRICS_PROVIDER:-prometheus}
  prefix: ${METRICS_PREFIX:-workflow_orchestrator}
  includeDefaultMetrics: ${INCLUDE_DEFAULT_METRICS:-true}
  reportingIntervalMs: ${METRICS_INTERVAL:-15000}
```

## Tracing Configuration

Distributed tracing configuration:

```yaml
tracing:
  enabled: ${TRACING_ENABLED:-true}
  provider: ${TRACING_PROVIDER:-jaeger}
  serviceName: ${TRACING_SERVICE_NAME:-workflow-orchestrator}
  samplingRate: ${TRACING_SAMPLING_RATE:-0.1} # 10% sampling
  jaeger:
    host: ${JAEGER_HOST:-localhost}
    port: ${JAEGER_PORT:-6832}
```

## Feature Flags

Enable or disable specific features:

```yaml
features:
  enableEventBasedWorkflowResumption: ${ENABLE_EVENT_RESUMPTION:-true}
  enableCompensationMechanisms: ${ENABLE_COMPENSATION:-true}
  enableCircuitBreakers: ${ENABLE_CIRCUIT_BREAKERS:-true}
  enableAtomicStateUpdates: ${ENABLE_ATOMIC_UPDATES:-true}
  enableDeadLetterQueue: ${ENABLE_DLQ:-true}
  enableReconciliation: ${ENABLE_RECONCILIATION:-true}
  enableScheduler: ${ENABLE_SCHEDULER:-true}
```

## Configuration Best Practices


1. **Use environment variables** for environment-specific values
2. **Keep secrets in a separate file** or environment variables
3. **Version your configuration files** alongside code
4. **Document all configuration options** and their impact
5. **Validate configuration at startup** to fail fast
6. **Limit runtime configuration changes** to non-critical settings
7. **Monitor configuration changes** for audit purposes

## Related Documentation

* [Operational Monitoring](./monitoring.md)
* [Scaling Considerations](./scaling.md)
* [Deployment Guide](./deployment.md)


