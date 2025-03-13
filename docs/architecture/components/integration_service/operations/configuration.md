# Configuration Guidelines

## Overview

This document describes the configuration options for the Integration Service. It details environment variables, configuration files, startup parameters, and runtime configuration to help operators deploy and manage the service effectively.

## Configuration Methods

The Integration Service can be configured using the following methods (in order of precedence):

1. **Environment Variables**: Highest precedence, override all other settings
2. **Configuration Files**: JSON or YAML files for detailed configuration
3. **Command Line Arguments**: Used during service startup
4. **Default Values**: Applied when no explicit configuration is provided

## Environment Variables

| Variable | Description | Default | Required | Example |
|----------|-------------|---------|----------|---------|
| `INTEGRATION_SERVICE_PORT` | HTTP port for the service | `8080` | No | `8080` |
| `INTEGRATION_SERVICE_LOG_LEVEL` | Logging level | `INFO` | No | `DEBUG` |
| `INTEGRATION_DB_HOST` | Database hostname | `localhost` | Yes | `integration-db.example.com` |
| `INTEGRATION_DB_PORT` | Database port | `5432` | Yes | `5432` |
| `INTEGRATION_DB_NAME` | Database name | `integration_service` | Yes | `integration_service_prod` |
| `INTEGRATION_DB_USER` | Database username | None | Yes | `integration_service_user` |
| `INTEGRATION_DB_PASSWORD` | Database password | None | Yes | `password123` |
| `INTEGRATION_CREDENTIAL_STORE_URL` | Credential store URL | None | Yes | `https://credential-store.example.com` |
| `INTEGRATION_CREDENTIAL_STORE_TOKEN` | Credential store access token | None | Yes | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `INTEGRATION_DEFAULT_TIMEOUT_MS` | Default timeout for integration calls | `30000` | No | `60000` |
| `INTEGRATION_MAX_CONCURRENT_REQUESTS` | Maximum concurrent requests | `200` | No | `500` |
| `INTEGRATION_CACHE_TTL_SECONDS` | Default cache TTL in seconds | `300` | No | `600` |
| `INTEGRATION_CIRCUIT_BREAKER_THRESHOLD` | Circuit breaker failure threshold | `5` | No | `10` |
| `INTEGRATION_CIRCUIT_BREAKER_TIMEOUT_MS` | Circuit breaker timeout in ms | `30000` | No | `60000` |
| `INTEGRATION_RATE_LIMIT_ENABLED` | Enable rate limiting | `true` | No | `false` |
| `INTEGRATION_EVENT_BUS_URL` | Event bus URL | None | Yes | `amqp://event-bus.example.com` |
| `INTEGRATION_EVENT_BUS_EXCHANGE` | Event bus exchange name | `integration_events` | No | `prod_integration_events` |
| `INTEGRATION_METRICS_ENABLED` | Enable metrics collection | `true` | No | `true` |
| `INTEGRATION_METRICS_PREFIX` | Prefix for metrics | `integration_service` | No | `prod_integration_service` |

### Sensitive Configuration

The following environment variables contain sensitive information and should be handled securely:

| Variable | Description | Security Recommendations |
|----------|-------------|--------------------------|
| `INTEGRATION_DB_PASSWORD` | Database password | Store in secrets manager, never in plain text files |
| `INTEGRATION_CREDENTIAL_STORE_TOKEN` | Credential store access token | Rotate regularly, store in secrets manager |
| `INTEGRATION_EVENT_BUS_PASSWORD` | Event bus password | Store in secrets manager, never in plain text files |
| `INTEGRATION_API_KEY` | API key for service-to-service auth | Rotate regularly, store in secrets manager |

## Configuration File

The service can be configured using a JSON or YAML configuration file specified with the `--config` command line argument or the `INTEGRATION_CONFIG_FILE` environment variable.

### File Format

```json
{
  "service": {
    "name": "integration-service",
    "port": 8080,
    "logLevel": "INFO"
  },
  "database": {
    "host": "localhost",
    "port": 5432,
    "name": "integration_service",
    "username": "integration_service_user",
    "password": "password123",
    "maxConnections": 20,
    "connectionTimeout": 5000
  },
  "cache": {
    "enabled": true,
    "ttlSeconds": 300,
    "maxEntries": 10000
  },
  "credentialStore": {
    "url": "https://credential-store.example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "cacheEnabled": true,
    "cacheTtlSeconds": 600
  },
  "integrations": {
    "defaultTimeoutMs": 30000,
    "maxConcurrentRequests": 200,
    "circuitBreaker": {
      "enabled": true,
      "failureThreshold": 5,
      "resetTimeoutMs": 30000
    },
    "rateLimit": {
      "enabled": true,
      "defaultRequestsPerMinute": 60
    }
  },
  "eventBus": {
    "url": "amqp://event-bus.example.com",
    "exchange": "integration_events",
    "queuePrefix": "integration_service"
  },
  "metrics": {
    "enabled": true,
    "prefix": "integration_service",
    "reportingIntervalMs": 15000
  }
}
```

### Configuration Sections

#### Service Configuration

| Setting | Description | Default | Required |
|---------|-------------|---------|----------|
| `service.name` | Service name for identification | `integration-service` | No |
| `service.port` | HTTP port for the service | `8080` | No |
| `service.logLevel` | Logging level (ERROR, WARN, INFO, DEBUG, TRACE) | `INFO` | No |
| `service.gracefulShutdownSeconds` | Time to wait during shutdown | `30` | No |

#### Database Configuration

| Setting | Description | Default | Required |
|---------|-------------|---------|----------|
| `database.host` | Database server hostname | `localhost` | Yes |
| `database.port` | Database server port | `5432` | Yes |
| `database.name` | Database name | `integration_service` | Yes |
| `database.username` | Database username | None | Yes |
| `database.password` | Database password | None | Yes |
| `database.maxConnections` | Connection pool size | `20` | No |
| `database.connectionTimeout` | Connection timeout in ms | `5000` | No |

#### Cache Configuration

| Setting | Description | Default | Required |
|---------|-------------|---------|----------|
| `cache.enabled` | Whether caching is enabled | `true` | No |
| `cache.ttlSeconds` | Default cache TTL | `300` | No |
| `cache.maxEntries` | Maximum cache entries | `10000` | No |

#### Credential Store Configuration

| Setting | Description | Default | Required |
|---------|-------------|---------|----------|
| `credentialStore.url` | Credential store URL | None | Yes |
| `credentialStore.token` | Access token for credential store | None | Yes |
| `credentialStore.cacheEnabled` | Enable credential caching | `true` | No |
| `credentialStore.cacheTtlSeconds` | Credential cache TTL | `600` | No |

#### Integration Configuration

| Setting | Description | Default | Required |
|---------|-------------|---------|----------|
| `integrations.defaultTimeoutMs` | Default timeout for integration calls | `30000` | No |
| `integrations.maxConcurrentRequests` | Maximum concurrent requests | `200` | No |
| `integrations.circuitBreaker.enabled` | Enable circuit breakers | `true` | No |
| `integrations.circuitBreaker.failureThreshold` | Failures before opening circuit | `5` | No |
| `integrations.circuitBreaker.resetTimeoutMs` | Time before retry after circuit opens | `30000` | No |
| `integrations.rateLimit.enabled` | Enable rate limiting | `true` | No |
| `integrations.rateLimit.defaultRequestsPerMinute` | Default rate limit | `60` | No |

#### Event Bus Configuration

| Setting | Description | Default | Required |
|---------|-------------|---------|----------|
| `eventBus.url` | Event bus URL | None | Yes |
| `eventBus.exchange` | Event exchange name | `integration_events` | No |
| `eventBus.queuePrefix` | Queue name prefix | `integration_service` | No |

## Command Line Arguments

The service accepts the following command line arguments:

| Argument | Description | Default |
|----------|-------------|---------|
| `--config` | Path to configuration file | None |
| `--port` | HTTP port for the service | `8080` |
| `--log-level` | Logging level | `INFO` |
| `--debug` | Enable debug mode | `false` |

## Runtime Configuration

The Integration Service supports the following runtime configuration changes without restart:

| Configuration | Method | Notes |
|---------------|--------|-------|
| Log Level | API call to `/admin/loglevel` | Requires admin authentication |
| Circuit Breaker Settings | API call to `/admin/circuit-breakers` | Requires admin authentication |
| Rate Limit Settings | API call to `/admin/rate-limits` | Requires admin authentication |
| Cache TTL | API call to `/admin/cache/ttl` | Requires admin authentication |

## Environment-Specific Configurations

### Development Environment

```json
{
  "service": {
    "logLevel": "DEBUG"
  },
  "database": {
    "host": "localhost",
    "maxConnections": 5
  },
  "cache": {
    "ttlSeconds": 60
  },
  "integrations": {
    "circuitBreaker": {
      "failureThreshold": 2,
      "resetTimeoutMs": 10000
    }
  },
  "metrics": {
    "reportingIntervalMs": 5000
  }
}
```

### Production Environment

```json
{
  "service": {
    "logLevel": "INFO",
    "gracefulShutdownSeconds": 60
  },
  "database": {
    "maxConnections": 50,
    "connectionTimeout": 3000
  },
  "cache": {
    "ttlSeconds": 600,
    "maxEntries": 50000
  },
  "integrations": {
    "maxConcurrentRequests": 500,
    "circuitBreaker": {
      "failureThreshold": 10,
      "resetTimeoutMs": 60000
    }
  },
  "metrics": {
    "reportingIntervalMs": 30000
  }
}
```

## Security Configuration

The Integration Service implements the following security measures:

| Security Feature | Configuration | Description |
|------------------|---------------|-------------|
| Authentication | `service.auth.enabled` | Enable API authentication |
| API Keys | `service.auth.apiKeys` | List of valid API keys |
| JWT Validation | `service.auth.jwt.secret` | Secret for JWT validation |
| TLS | `service.tls.enabled` | Enable TLS for API endpoints |
| Credential Encryption | `credentialStore.encryptionKey` | Key for credential encryption |
| CORS | `service.cors.allowedOrigins` | Allowed origins for CORS |
| Rate Limiting | `service.rateLimit.enabled` | Enable API rate limiting |

## Configuration Best Practices

1. **Use environment variables for deployment-specific settings**: This allows the same container image to be deployed across environments
2. **Use configuration files for complex settings**: Configuration files are better for settings with nested structure
3. **Validate configuration on startup**: The service validates all configuration on startup and fails fast if required settings are missing
4. **Monitor configuration changes**: All configuration changes are logged and can be monitored
5. **Use secrets management**: Store sensitive configuration in a secrets management service

## Related Documentation

* [Monitoring](./monitoring.md)
* [Scaling](./scaling.md)
* [Method Executor](../implementation/method_executor.md)
* [Credential Manager](../implementation/credential_manager.md) 