# Event Processing Service Configuration Guide

## Overview

This document provides comprehensive guidance on configuring the Event Processing Service for different environments and use cases. It covers environment variables, configuration files, feature flags, and deployment-specific settings.

## Configuration Methods

The Event Processing Service supports multiple configuration methods, applied in the following order of precedence (highest to lowest):


1. Environment variables
2. Configuration files
3. Command-line arguments
4. Default values

## Environment Variables

### Core Service Configuration

| Variable | Description | Default | Example |
|----|----|----|----|
| `EPS_PORT` | HTTP port for the service | `3000` | `EPS_PORT=8080` |
| `EPS_HOST` | Host to bind the service | `0.0.0.0` | `EPS_HOST=localhost` |
| `EPS_LOG_LEVEL` | Logging level | `info` | `EPS_LOG_LEVEL=debug` |
| `EPS_NODE_ENV` | Node environment | `production` | `EPS_NODE_ENV=development` |
| `EPS_REQUEST_TIMEOUT_MS` | API request timeout in ms | `30000` | `EPS_REQUEST_TIMEOUT_MS=60000` |
| `EPS_SHUTDOWN_TIMEOUT_MS` | Graceful shutdown timeout in ms | `10000` | `EPS_SHUTDOWN_TIMEOUT_MS=30000` |

### Database Configuration

| Variable | Description | Default | Example |
|----|----|----|----|
| `EPS_DB_HOST` | Database host | `localhost` | `EPS_DB_HOST=postgres.example.com` |
| `EPS_DB_PORT` | Database port | `5432` | `EPS_DB_PORT=5433` |
| `EPS_DB_NAME` | Database name | `event_service` | `EPS_DB_NAME=events_prod` |
| `EPS_DB_USER` | Database username | `postgres` | `EPS_DB_USER=event_service_user` |
| `EPS_DB_PASSWORD` | Database password | - | `EPS_DB_PASSWORD=secure_password` |
| `EPS_DB_POOL_MIN` | Min connections in pool | `2` | `EPS_DB_POOL_MIN=5` |
| `EPS_DB_POOL_MAX` | Max connections in pool | `10` | `EPS_DB_POOL_MAX=20` |
| `EPS_DB_TIMEOUT_MS` | Database query timeout in ms | `5000` | `EPS_DB_TIMEOUT_MS=10000` |
| `EPS_DB_SSL_ENABLED` | Enable SSL for database | `true` | `EPS_DB_SSL_ENABLED=false` |

### Queue Configuration

| Variable | Description | Default | Example |
|----|----|----|----|
| `EPS_QUEUE_MAX_SIZE` | Maximum queue size | `10000` | `EPS_QUEUE_MAX_SIZE=50000` |
| `EPS_QUEUE_BATCH_SIZE` | Batch size for processing | `100` | `EPS_QUEUE_BATCH_SIZE=200` |
| `EPS_QUEUE_FLUSH_INTERVAL_MS` | Queue flush interval in ms | `1000` | `EPS_QUEUE_FLUSH_INTERVAL_MS=500` |
| `EPS_QUEUE_RETRY_DELAY_MS` | Retry delay for failed items in ms | `5000` | `EPS_QUEUE_RETRY_DELAY_MS=10000` |
| `EPS_QUEUE_MAX_RETRIES` | Maximum retry attempts | `3` | `EPS_QUEUE_MAX_RETRIES=5` |
| `EPS_QUEUE_PERSISTENCE_ENABLED` | Enable queue persistence | `true` | `EPS_QUEUE_PERSISTENCE_ENABLED=false` |

### Event Router Configuration

| Variable | Description | Default | Example |
|----|----|----|----|
| `EPS_ROUTER_CACHE_SIZE` | Router cache size | `1000` | `EPS_ROUTER_CACHE_SIZE=5000` |
| `EPS_ROUTER_CACHE_TTL_MS` | Router cache TTL in ms | `60000` | `EPS_ROUTER_CACHE_TTL_MS=300000` |
| `EPS_ROUTER_MAX_SUBSCRIBERS` | Max subscribers per event | `100` | `EPS_ROUTER_MAX_SUBSCRIBERS=500` |
| `EPS_ROUTER_PATTERN_MATCHING` | Pattern matching algorithm | `regex` | `EPS_ROUTER_PATTERN_MATCHING=glob` |

### Event Processor Configuration

| Variable | Description | Default | Example |
|----|----|----|----|
| `EPS_PROCESSOR_WORKERS` | Number of processor workers | `5` | `EPS_PROCESSOR_WORKERS=10` |
| `EPS_PROCESSOR_TIMEOUT_MS` | Processing timeout in ms | `10000` | `EPS_PROCESSOR_TIMEOUT_MS=30000` |
| `EPS_PROCESSOR_MAX_PAYLOAD_SIZE` | Max payload size in bytes | `1048576` | `EPS_PROCESSOR_MAX_PAYLOAD_SIZE=5242880` |

### Authentication and Security

| Variable | Description | Default | Example |
|----|----|----|----|
| `EPS_AUTH_ENABLED` | Enable authentication | `true` | `EPS_AUTH_ENABLED=false` |
| `EPS_AUTH_PROVIDER` | Authentication provider | `jwt` | `EPS_AUTH_PROVIDER=oauth` |
| `EPS_AUTH_SECRET` | JWT secret key | - | `EPS_AUTH_SECRET=your_secret_key` |
| `EPS_AUTH_TOKEN_EXPIRY_SEC` | Token expiry in seconds | `3600` | `EPS_AUTH_TOKEN_EXPIRY_SEC=7200` |
| `EPS_CORS_ENABLED` | Enable CORS | `true` | `EPS_CORS_ENABLED=false` |
| `EPS_CORS_ORIGINS` | Allowed CORS origins | `*` | `EPS_CORS_ORIGINS=https://example.com,https://api.example.com` |
| `EPS_RATE_LIMIT_ENABLED` | Enable rate limiting | `true` | `EPS_RATE_LIMIT_ENABLED=false` |
| `EPS_RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `1000` | `EPS_RATE_LIMIT_MAX_REQUESTS=500` |
| `EPS_RATE_LIMIT_WINDOW_MS` | Rate limit window in ms | `60000` | `EPS_RATE_LIMIT_WINDOW_MS=30000` |

### Monitoring and Observability

| Variable | Description | Default | Example |
|----|----|----|----|
| `EPS_METRICS_ENABLED` | Enable metrics collection | `true` | `EPS_METRICS_ENABLED=false` |
| `EPS_METRICS_PROVIDER` | Metrics provider | `prometheus` | `EPS_METRICS_PROVIDER=datadog` |
| `EPS_METRICS_PREFIX` | Metrics name prefix | `eps_` | `EPS_METRICS_PREFIX=event_service_` |
| `EPS_METRICS_INTERVAL_MS` | Metrics collection interval | `15000` | `EPS_METRICS_INTERVAL_MS=30000` |
| `EPS_TRACING_ENABLED` | Enable distributed tracing | `true` | `EPS_TRACING_ENABLED=false` |
| `EPS_TRACING_PROVIDER` | Tracing provider | `jaeger` | `EPS_TRACING_PROVIDER=zipkin` |
| `EPS_TRACING_ENDPOINT` | Tracing endpoint | - | `EPS_TRACING_ENDPOINT=http://jaeger:14268/api/traces` |
| `EPS_HEALTH_CHECK_INTERVAL_MS` | Health check interval in ms | `30000` | `EPS_HEALTH_CHECK_INTERVAL_MS=60000` |

## Configuration Files

The service supports JSON and YAML configuration files. By default, it looks for:

* `config/default.json` or `config/default.yaml` - Base configuration
* `config/{environment}.json` or `config/{environment}.yaml` - Environment-specific configuration

### Example JSON Configuration

```json
{
  "service": {
    "port": 3000,
    "host": "0.0.0.0",
    "logLevel": "info",
    "requestTimeoutMs": 30000,
    "shutdownTimeoutMs": 10000
  },
  "database": {
    "host": "localhost",
    "port": 5432,
    "name": "event_service",
    "user": "postgres",
    "password": "secure_password",
    "pool": {
      "min": 2,
      "max": 10
    },
    "timeoutMs": 5000,
    "sslEnabled": true
  },
  "queue": {
    "maxSize": 10000,
    "batchSize": 100,
    "flushIntervalMs": 1000,
    "retryDelayMs": 5000,
    "maxRetries": 3,
    "persistenceEnabled": true
  },
  "router": {
    "cacheSize": 1000,
    "cacheTtlMs": 60000,
    "maxSubscribers": 100,
    "patternMatching": "regex"
  },
  "processor": {
    "workers": 5,
    "timeoutMs": 10000,
    "maxPayloadSize": 1048576
  },
  "auth": {
    "enabled": true,
    "provider": "jwt",
    "secret": "your_secret_key",
    "tokenExpirySec": 3600
  },
  "cors": {
    "enabled": true,
    "origins": ["*"]
  },
  "rateLimit": {
    "enabled": true,
    "maxRequests": 1000,
    "windowMs": 60000
  },
  "metrics": {
    "enabled": true,
    "provider": "prometheus",
    "prefix": "eps_",
    "intervalMs": 15000
  },
  "tracing": {
    "enabled": true,
    "provider": "jaeger",
    "endpoint": "http://jaeger:14268/api/traces"
  },
  "healthCheck": {
    "intervalMs": 30000
  }
}
```

### Example YAML Configuration

```yaml
service:
  port: 3000
  host: 0.0.0.0
  logLevel: info
  requestTimeoutMs: 30000
  shutdownTimeoutMs: 10000

database:
  host: localhost
  port: 5432
  name: event_service
  user: postgres
  password: secure_password
  pool:
    min: 2
    max: 10
  timeoutMs: 5000
  sslEnabled: true

queue:
  maxSize: 10000
  batchSize: 100
  flushIntervalMs: 1000
  retryDelayMs: 5000
  maxRetries: 3
  persistenceEnabled: true

router:
  cacheSize: 1000
  cacheTtlMs: 60000
  maxSubscribers: 100
  patternMatching: regex

processor:
  workers: 5
  timeoutMs: 10000
  maxPayloadSize: 1048576

auth:
  enabled: true
  provider: jwt
  secret: your_secret_key
  tokenExpirySec: 3600

cors:
  enabled: true
  origins:
    - "*"

rateLimit:
  enabled: true
  maxRequests: 1000
  windowMs: 60000

metrics:
  enabled: true
  provider: prometheus
  prefix: eps_
  intervalMs: 15000

tracing:
  enabled: true
  provider: jaeger
  endpoint: http://jaeger:14268/api/traces

healthCheck:
  intervalMs: 30000
```

## Feature Flags

The Event Processing Service uses feature flags to enable or disable specific functionality:

| Flag | Description | Default | Environment Variable |
|----|----|----|----|
| `enableEventValidation` | Enable schema validation for events | `true` | `EPS_FEATURE_ENABLE_EVENT_VALIDATION` |
| `enableEventTransformation` | Enable event transformation | `true` | `EPS_FEATURE_ENABLE_EVENT_TRANSFORMATION` |
| `enableEventFiltering` | Enable event filtering | `true` | `EPS_FEATURE_ENABLE_EVENT_FILTERING` |
| `enableDeadLetterQueue` | Enable dead letter queue | `true` | `EPS_FEATURE_ENABLE_DEAD_LETTER_QUEUE` |
| `enableEventHistory` | Enable event history tracking | `true` | `EPS_FEATURE_ENABLE_EVENT_HISTORY` |
| `enableEventReplay` | Enable event replay capability | `false` | `EPS_FEATURE_ENABLE_EVENT_REPLAY` |
| `enableBulkOperations` | Enable bulk operations | `false` | `EPS_FEATURE_ENABLE_BULK_OPERATIONS` |
| `enableAdvancedRouting` | Enable advanced routing rules | `false` | `EPS_FEATURE_ENABLE_ADVANCED_ROUTING` |
| `enableWorkflowResumption` | Enable workflow resumption | `true` | `EPS_FEATURE_ENABLE_WORKFLOW_RESUMPTION` |

### Feature Flag Configuration

Feature flags can be configured in the configuration file:

```json
{
  "features": {
    "enableEventValidation": true,
    "enableEventTransformation": true,
    "enableEventFiltering": true,
    "enableDeadLetterQueue": true,
    "enableEventHistory": true,
    "enableEventReplay": false,
    "enableBulkOperations": false,
    "enableAdvancedRouting": false,
    "enableWorkflowResumption": true
  }
}
```

## Environment-Specific Configurations

### Development Environment

Recommended configuration for development:

```yaml
service:
  port: 3000
  host: localhost
  logLevel: debug
  
database:
  host: localhost
  port: 5432
  name: event_service_dev
  
queue:
  persistenceEnabled: false
  
auth:
  enabled: false
  
metrics:
  enabled: false
  
tracing:
  enabled: false
  
features:
  enableEventReplay: true
  enableBulkOperations: true
  enableAdvancedRouting: true
```

### Testing Environment

Recommended configuration for testing:

```yaml
service:
  port: 3001
  logLevel: info
  
database:
  name: event_service_test
  
queue:
  maxSize: 1000
  persistenceEnabled: true
  
auth:
  enabled: true
  
metrics:
  enabled: true
  intervalMs: 60000
  
tracing:
  enabled: false
```

### Production Environment

Recommended configuration for production:

```yaml
service:
  port: 8080
  logLevel: info
  requestTimeoutMs: 60000
  shutdownTimeoutMs: 30000
  
database:
  pool:
    min: 5
    max: 20
  sslEnabled: true
  
queue:
  maxSize: 50000
  batchSize: 200
  persistenceEnabled: true
  
router:
  cacheSize: 5000
  
processor:
  workers: 10
  
auth:
  enabled: true
  
rateLimit:
  enabled: true
  
metrics:
  enabled: true
  
tracing:
  enabled: true
```

## Secrets Management

For production environments, it's recommended to use a secrets management solution rather than environment variables or configuration files for sensitive information:

* AWS Secrets Manager
* HashiCorp Vault
* Azure Key Vault
* Google Secret Manager

Example configuration for using HashiCorp Vault:

```yaml
secrets:
  provider: vault
  vault:
    address: https://vault.example.com
    tokenPath: /path/to/vault/token
    secretsPath: secret/event-processing-service
```

## Configuration Validation

The service validates configuration on startup. If critical configuration is missing or invalid, the service will fail to start.

Example validation errors:

```
ERROR: Invalid configuration:
- database.host: Required field is missing
- queue.maxSize: Value must be a positive integer
- auth.tokenExpirySec: Value must be greater than 0
```

## Dynamic Configuration

Some configuration can be updated at runtime through the admin API:

```
PUT /admin/config/log-level
Content-Type: application/json

{
  "value": "debug"
}
```

Dynamically configurable settings:

* Log level
* Queue batch size
* Queue flush interval
* Rate limiting parameters
* Metrics collection interval
* Feature flags

## Configuration Best Practices


1. **Use environment variables for deployment-specific settings**
   * Database connection details
   * Service ports and hosts
   * Log levels
2. **Use configuration files for complex settings**
   * Feature flags
   * Detailed component configuration
   * Default values
3. **Secure sensitive information**
   * Use secrets management for production
   * Never commit secrets to version control
   * Rotate secrets regularly
4. **Validate configuration**
   * Implement validation on startup
   * Log clear error messages for invalid configuration
   * Provide sensible defaults where possible
5. **Document all configuration options**
   * Keep this document updated
   * Include examples for common scenarios
   * Document default values and acceptable ranges

## Related Documentation

* [Monitoring Guide](./monitoring.md)
* [Scaling Guide](./scaling.md)
* [Event Router Implementation](../implementation/event_router.md)
* [Internal Event Queue](../implementation/internal_queue.md)


