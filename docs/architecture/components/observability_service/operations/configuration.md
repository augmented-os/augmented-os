# Configuration Guidelines

## Overview

This document describes the configuration options for the Observability Service. It details environment variables, configuration files, startup parameters, and runtime configuration to help operators deploy and manage the service effectively.

## Configuration Methods

The Observability Service can be configured using the following methods (in order of precedence):

1. **Environment Variables**: Highest precedence, override all other settings
2. **Configuration Files**: JSON or YAML files for detailed configuration
3. **Command Line Arguments**: Used during service startup
4. **Default Values**: Applied when no explicit configuration is provided

## Environment Variables

| Variable | Description | Default | Required | Example |
|----|----|----|----|----|
| `OBSERVABILITY_PORT` | HTTP port for the service | `8080` | No | `8080` |
| `OBSERVABILITY_LOG_LEVEL` | Logging level | `INFO` | No | `INFO` |
| `OBSERVABILITY_STORAGE_TYPE` | Primary storage backend type | `elasticsearch` | Yes | `elasticsearch` |
| `OBSERVABILITY_STORAGE_HOST` | Storage backend host | None | Yes | `elasticsearch.example.com` |
| `OBSERVABILITY_STORAGE_PORT` | Storage backend port | Varies by type | Yes | `9200` |
| `OBSERVABILITY_METRICS_STORAGE_TYPE` | Metrics-specific storage (if different) | Same as primary | No | `prometheus` |
| `OBSERVABILITY_TRACES_STORAGE_TYPE` | Traces-specific storage (if different) | Same as primary | No | `jaeger` |
| `OBSERVABILITY_COLLECTION_BATCH_SIZE` | Maximum batch size for collection | `100` | No | `200` |
| `OBSERVABILITY_COLLECTION_BUFFER_SIZE` | Size of collection buffer in MB | `256` | No | `512` |
| `OBSERVABILITY_QUERY_TIMEOUT_MS` | Query execution timeout in ms | `30000` | No | `60000` |
| `OBSERVABILITY_ALERT_EVAL_INTERVAL_SEC` | Alert evaluation interval in seconds | `60` | No | `30` |
| `OBSERVABILITY_AUTH_SERVICE_URL` | Auth Service URL | None | Yes | `http://auth-service:8080` |
| `OBSERVABILITY_EVENT_SERVICE_URL` | Event Processing Service URL | None | Yes | `http://event-service:8080` |
| `OBSERVABILITY_SERVICE_API_KEY` | API key for service-to-service calls | None | Yes | `api_key_xxxxxxxxxxx` |

### Sensitive Configuration

The following environment variables contain sensitive information and should be handled securely:

| Variable | Description | Security Recommendations |
|----|----|----|
| `OBSERVABILITY_STORAGE_USERNAME` | Storage backend username | Use secrets management, don't include in logs |
| `OBSERVABILITY_STORAGE_PASSWORD` | Storage backend password | Use secrets management, don't include in logs |
| `OBSERVABILITY_SERVICE_API_KEY` | API key for service-to-service auth | Rotate regularly, use secrets management |
| `OBSERVABILITY_NOTIFICATION_TOKENS` | Tokens for notification services | Use secrets management, encrypt at rest |

## Configuration File

The service can be configured using a JSON or YAML configuration file specified with the `--config` command line argument or the `OBSERVABILITY_CONFIG_FILE` environment variable.

### File Format

```json
{
  "service": {
    "name": "observability-service",
    "port": 8080,
    "logLevel": "INFO",
    "shutdownTimeoutMs": 30000
  },
  "storage": {
    "primary": {
      "type": "elasticsearch",
      "host": "elasticsearch.example.com",
      "port": 9200,
      "username": "elastic_user",
      "password": "secure_password",
      "indexPrefix": "logs",
      "shards": 5,
      "replicas": 1
    },
    "metrics": {
      "type": "prometheus",
      "host": "prometheus.example.com",
      "port": 9090,
      "retentionDays": 15
    },
    "traces": {
      "type": "jaeger",
      "host": "jaeger.example.com",
      "port": 14268,
      "retentionDays": 7
    }
  },
  "collection": {
    "batchSize": 100,
    "bufferSizeMb": 256,
    "flushIntervalMs": 5000,
    "compressionEnabled": true,
    "rateLimits": {
      "logsPerSecond": 10000,
      "metricsPerSecond": 20000,
      "tracesPerSecond": 1000
    }
  },
  "queryEngine": {
    "timeoutMs": 30000,
    "maxConcurrentQueries": 20,
    "cacheEnabled": true,
    "cacheSizeMb": 512,
    "cacheTtlSec": 300
  },
  "alertManager": {
    "evaluationIntervalSec": 60,
    "concurrentEvaluations": 10,
    "notificationRetries": 3,
    "notificationTimeoutMs": 5000
  },
  "services": {
    "auth": {
      "url": "http://auth-service:8080",
      "timeoutMs": 3000,
      "cacheEnabled": true,
      "cacheTtlSec": 300
    },
    "eventProcessing": {
      "url": "http://event-service:8080",
      "timeoutMs": 5000,
      "batchSize": 50
    },
    "notification": {
      "url": "http://notification-service:8080",
      "timeoutMs": 5000
    }
  }
}
```

### Configuration Sections

#### Service Configuration

| Setting | Description | Default | Required |
|----|----|----|----|
| `service.name` | Service name for identification | `observability-service` | No |
| `service.port` | HTTP port for the service | `8080` | No |
| `service.logLevel` | Logging level (ERROR, WARN, INFO, DEBUG, TRACE) | `INFO` | No |
| `service.shutdownTimeoutMs` | Time to wait during shutdown in ms | `30000` | No |

#### Storage Configuration

| Setting | Description | Default | Required |
|----|----|----|----|
| `storage.primary.type` | Primary storage backend type | `elasticsearch` | Yes |
| `storage.primary.host` | Storage backend hostname | None | Yes |
| `storage.primary.port` | Storage backend port | Varies by type | Yes |
| `storage.primary.username` | Storage authentication username | None | Yes |
| `storage.primary.password` | Storage authentication password | None | Yes |
| `storage.primary.indexPrefix` | Index name prefix | `logs` | No |
| `storage.primary.shards` | Number of shards per index | `5` | No |
| `storage.primary.replicas` | Number of replicas per index | `1` | No |
| `storage.metrics` | Metrics-specific storage config | Same as primary | No |
| `storage.traces` | Traces-specific storage config | Same as primary | No |

#### Collection Configuration

| Setting | Description | Default | Required |
|----|----|----|----|
| `collection.batchSize` | Maximum items per batch | `100` | No |
| `collection.bufferSizeMb` | Collection buffer size in MB | `256` | No |
| `collection.flushIntervalMs` | Buffer flush interval in ms | `5000` | No |
| `collection.compressionEnabled` | Whether to compress data | `true` | No |
| `collection.rateLimits` | Rate limits for different data types | Varies | No |

#### Query Engine Configuration

| Setting | Description | Default | Required |
|----|----|----|----|
| `queryEngine.timeoutMs` | Query timeout in milliseconds | `30000` | No |
| `queryEngine.maxConcurrentQueries` | Max concurrent queries | `20` | No |
| `queryEngine.cacheEnabled` | Enable result caching | `true` | No |
| `queryEngine.cacheSizeMb` | Cache size in MB | `512` | No |
| `queryEngine.cacheTtlSec` | Cache TTL in seconds | `300` | No |

#### Alert Manager Configuration

| Setting | Description | Default | Required |
|----|----|----|----|
| `alertManager.evaluationIntervalSec` | Alert evaluation interval | `60` | No |
| `alertManager.concurrentEvaluations` | Max concurrent evaluations | `10` | No |
| `alertManager.notificationRetries` | Notification retry count | `3` | No |
| `alertManager.notificationTimeoutMs` | Notification timeout in ms | `5000` | No |

#### Service Integration Configuration

| Setting | Description | Default | Required |
|----|----|----|----|
| `services.auth.url` | Auth service URL | None | Yes |
| `services.auth.timeoutMs` | Auth request timeout in ms | `3000` | No |
| `services.eventProcessing.url` | Event service URL | None | Yes |
| `services.notification.url` | Notification service URL | None | No |

## Command Line Arguments

The service accepts the following command line arguments:

| Argument | Description | Default |
|----|----|----|
| `--config` | Path to configuration file | None |
| `--port` | HTTP port for the service | `8080` |
| `--log-level` | Logging level | `INFO` |
| `--storage-host` | Primary storage host | None |
| `--storage-type` | Primary storage type | `elasticsearch` |

## Runtime Configuration

The Observability Service supports the following runtime configuration changes without restart:

| Configuration | Method | Notes |
|----|----|----|
| Log Level | API call to `/admin/config/log-level` | Requires admin authentication |
| Alert Rules | API call to `/api/v1/alerts` | Through standard API endpoints |
| Collection Rate Limits | API call to `/admin/config/rate-limits` | Requires admin authentication |
| Query Timeouts | API call to `/admin/config/query-timeouts` | Requires admin authentication |

## Environment-Specific Configurations

### Development Environment

```json
{
  "service": {
    "logLevel": "DEBUG"
  },
  "storage": {
    "primary": {
      "host": "localhost",
      "port": 9200
    },
    "metrics": {
      "host": "localhost",
      "port": 9090
    }
  },
  "collection": {
    "bufferSizeMb": 64
  },
  "queryEngine": {
    "timeoutMs": 60000,
    "cacheEnabled": false
  },
  "services": {
    "auth": {
      "url": "http://localhost:8081"
    },
    "eventProcessing": {
      "url": "http://localhost:8082"
    }
  }
}
```

### Production Environment

```json
{
  "service": {
    "logLevel": "INFO",
    "shutdownTimeoutMs": 60000
  },
  "storage": {
    "primary": {
      "shards": 10,
      "replicas": 2
    }
  },
  "collection": {
    "bufferSizeMb": 512,
    "compressionEnabled": true,
    "rateLimits": {
      "logsPerSecond": 25000,
      "metricsPerSecond": 50000,
      "tracesPerSecond": 2500
    }
  },
  "queryEngine": {
    "maxConcurrentQueries": 50,
    "cacheSizeMb": 1024
  },
  "alertManager": {
    "concurrentEvaluations": 20
  }
}
```

## Configuration Best Practices

1. **Use environment variables for deployment-specific settings**: This allows the same container image to be deployed across environments
2. **Use configuration files for complex settings**: Configuration files are better for settings with nested structure
3. **Scale buffer sizes based on expected traffic**: Adjust `collection.bufferSizeMb` based on peak ingestion rates
4. **Configure appropriate rate limits**: Protect the service from overwhelming traffic with `collection.rateLimits`
5. **Tune query timeouts for workload**: Adjust `queryEngine.timeoutMs` based on query complexity and data volume
6. **Monitor and adjust alert evaluation interval**: Balance between timely alerts and system load with `alertManager.evaluationIntervalSec`
7. **Use secrets management**: Store sensitive configuration in a secrets management service

## Related Documentation

* [Monitoring](./monitoring.md)
* [Scaling](./scaling.md)
* [Data Collection Implementation](../implementation/data_collection.md)
* [Storage Manager Implementation](../implementation/storage_manager.md)


