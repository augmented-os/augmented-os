# Testing Framework Service Configuration

This document outlines the configuration options, settings, and management practices for the Testing Framework Service component.

## Overview

The Testing Framework Service can be configured through various mechanisms to tailor its behavior to specific requirements and environments. This document details the available configuration options, their defaults, and best practices for managing configurations across different deployment scenarios.

## Configuration Methods

The Testing Framework Service supports the following configuration methods, listed in order of precedence (highest to lowest):

1. **Environment Variables**: For runtime configuration and secrets
2. **Configuration Files**: For detailed component settings
3. **API-based Configuration**: For dynamic configuration changes
4. **Default Values**: Built-in fallback values

## Core Configuration Properties

### General Settings

| Property | Description | Default | Environment Variable |
|----------|-------------|---------|---------------------|
| `service.name` | Name of the service | `testing-framework` | `TESTING_SERVICE_NAME` |
| `service.environment` | Deployment environment | `development` | `TESTING_ENV` |
| `service.version` | Service version | (derived from build) | `TESTING_VERSION` |
| `service.logLevel` | Log level | `info` | `TESTING_LOG_LEVEL` |
| `service.requestTimeout` | HTTP request timeout (ms) | `30000` | `TESTING_REQUEST_TIMEOUT` |
| `service.shutdownGracePeriod` | Graceful shutdown period (ms) | `30000` | `TESTING_SHUTDOWN_GRACE_PERIOD` |

### API Server Configuration

| Property | Description | Default | Environment Variable |
|----------|-------------|---------|---------------------|
| `api.host` | API server host | `0.0.0.0` | `TESTING_API_HOST` |
| `api.port` | API server port | `8080` | `TESTING_API_PORT` |
| `api.basePath` | API base path | `/testing` | `TESTING_API_BASE_PATH` |
| `api.cors.enabled` | Enable CORS support | `true` | `TESTING_API_CORS_ENABLED` |
| `api.cors.allowedOrigins` | Allowed CORS origins | `*` | `TESTING_API_CORS_ORIGINS` |
| `api.cors.allowedMethods` | Allowed CORS methods | `GET,POST,PUT,DELETE` | `TESTING_API_CORS_METHODS` |
| `api.rateLimiting.enabled` | Enable rate limiting | `true` | `TESTING_API_RATE_LIMIT_ENABLED` |
| `api.rateLimiting.requestsPerMinute` | Max requests per minute | `1000` | `TESTING_API_RATE_LIMIT_RPM` |

### Database Configuration

| Property | Description | Default | Environment Variable |
|----------|-------------|---------|---------------------|
| `database.type` | Database type | `postgresql` | `TESTING_DB_TYPE` |
| `database.host` | Database host | `localhost` | `TESTING_DB_HOST` |
| `database.port` | Database port | `5432` | `TESTING_DB_PORT` |
| `database.name` | Database name | `testing_framework` | `TESTING_DB_NAME` |
| `database.username` | Database username | (none) | `TESTING_DB_USER` |
| `database.password` | Database password | (none) | `TESTING_DB_PASSWORD` |
| `database.pool.min` | Min connections in pool | `5` | `TESTING_DB_POOL_MIN` |
| `database.pool.max` | Max connections in pool | `20` | `TESTING_DB_POOL_MAX` |
| `database.ssl.enabled` | Enable SSL for DB connection | `false` | `TESTING_DB_SSL_ENABLED` |
| `database.migrations.enabled` | Auto-run migrations on startup | `true` | `TESTING_DB_MIGRATIONS_ENABLED` |

### Test Execution Configuration

| Property | Description | Default | Environment Variable |
|----------|-------------|---------|---------------------|
| `execution.engine.type` | Execution engine type | `kubernetes` | `TESTING_EXEC_ENGINE_TYPE` |
| `execution.concurrency.max` | Max concurrent executions | `50` | `TESTING_EXEC_CONCURRENCY_MAX` |
| `execution.timeout.default` | Default test timeout (ms) | `300000` | `TESTING_EXEC_TIMEOUT_DEFAULT` |
| `execution.timeout.max` | Maximum allowed timeout (ms) | `3600000` | `TESTING_EXEC_TIMEOUT_MAX` |
| `execution.retry.enabled` | Enable auto-retry for failed tests | `true` | `TESTING_EXEC_RETRY_ENABLED` |
| `execution.retry.maxAttempts` | Max retry attempts | `3` | `TESTING_EXEC_RETRY_MAX_ATTEMPTS` |
| `execution.retry.backoffFactor` | Exponential backoff factor | `2` | `TESTING_EXEC_RETRY_BACKOFF_FACTOR` |
| `execution.queue.type` | Queue implementation | `redis` | `TESTING_EXEC_QUEUE_TYPE` |
| `execution.queue.ttl` | Queue item TTL (ms) | `86400000` | `TESTING_EXEC_QUEUE_TTL` |

### Authentication and Authorization

| Property | Description | Default | Environment Variable |
|----------|-------------|---------|---------------------|
| `auth.enabled` | Enable authentication | `true` | `TESTING_AUTH_ENABLED` |
| `auth.provider` | Auth provider type | `jwt` | `TESTING_AUTH_PROVIDER` |
| `auth.jwt.secret` | JWT secret | (none) | `TESTING_AUTH_JWT_SECRET` |
| `auth.jwt.expiresIn` | JWT expiration time | `86400s` | `TESTING_AUTH_JWT_EXPIRES_IN` |
| `auth.jwt.issuer` | JWT issuer | `augmented-os` | `TESTING_AUTH_JWT_ISSUER` |
| `auth.jwt.audience` | JWT audience | `testing-framework` | `TESTING_AUTH_JWT_AUDIENCE` |
| `auth.roles.admin` | Admin role name | `testing:admin` | `TESTING_AUTH_ROLE_ADMIN` |
| `auth.roles.user` | User role name | `testing:user` | `TESTING_AUTH_ROLE_USER` |
| `auth.roles.readonly` | Read-only role name | `testing:readonly` | `TESTING_AUTH_ROLE_READONLY` |

### Event Bus Configuration

| Property | Description | Default | Environment Variable |
|----------|-------------|---------|---------------------|
| `events.provider` | Event bus provider | `kafka` | `TESTING_EVENTS_PROVIDER` |
| `events.kafka.brokers` | Kafka broker list | `localhost:9092` | `TESTING_EVENTS_KAFKA_BROKERS` |
| `events.kafka.clientId` | Kafka client ID | `testing-framework` | `TESTING_EVENTS_KAFKA_CLIENT_ID` |
| `events.kafka.consumerGroupId` | Kafka consumer group ID | `testing-framework-consumers` | `TESTING_EVENTS_KAFKA_GROUP_ID` |
| `events.kafka.ssl.enabled` | Enable Kafka SSL | `false` | `TESTING_EVENTS_KAFKA_SSL_ENABLED` |
| `events.maxRetries` | Max event processing retries | `3` | `TESTING_EVENTS_MAX_RETRIES` |

### Test Result Storage

| Property | Description | Default | Environment Variable |
|----------|-------------|---------|---------------------|
| `results.storage.type` | Result storage type | `database` | `TESTING_RESULTS_STORAGE_TYPE` |
| `results.retention.default` | Default retention period (days) | `90` | `TESTING_RESULTS_RETENTION_DEFAULT` |
| `results.retention.min` | Minimum retention period (days) | `7` | `TESTING_RESULTS_RETENTION_MIN` |
| `results.retention.max` | Maximum retention period (days) | `365` | `TESTING_RESULTS_RETENTION_MAX` |
| `results.compression.enabled` | Enable result compression | `true` | `TESTING_RESULTS_COMPRESSION_ENABLED` |
| `results.batchSize` | Result write batch size | `100` | `TESTING_RESULTS_BATCH_SIZE` |

## Sample Configuration File

```yaml
# Testing Framework Service Configuration
service:
  name: testing-framework
  environment: production
  logLevel: info
  requestTimeout: 30000
  shutdownGracePeriod: 30000

api:
  host: 0.0.0.0
  port: 8080
  basePath: /testing
  cors:
    enabled: true
    allowedOrigins: https://console.augmented-os.com
    allowedMethods: GET,POST,PUT,DELETE
  rateLimiting:
    enabled: true
    requestsPerMinute: 1000

database:
  type: postgresql
  host: postgres-testing.infra
  port: 5432
  name: testing_framework
  username: testing_user
  password: ${TESTING_DB_PASSWORD}
  pool:
    min: 10
    max: 50
  ssl:
    enabled: true
  migrations:
    enabled: true

execution:
  engine:
    type: kubernetes
  concurrency:
    max: 100
  timeout:
    default: 300000
    max: 3600000
  retry:
    enabled: true
    maxAttempts: 3
    backoffFactor: 2
  queue:
    type: redis
    ttl: 86400000

auth:
  enabled: true
  provider: jwt
  jwt:
    secret: ${TESTING_AUTH_JWT_SECRET}
    expiresIn: 86400s
    issuer: augmented-os
    audience: testing-framework
  roles:
    admin: testing:admin
    user: testing:user
    readonly: testing:readonly

events:
  provider: kafka
  kafka:
    brokers: kafka-1.infra:9092,kafka-2.infra:9092,kafka-3.infra:9092
    clientId: testing-framework
    consumerGroupId: testing-framework-consumers
    ssl:
      enabled: true
  maxRetries: 3

results:
  storage:
    type: database
  retention:
    default: 90
    min: 7
    max: 365
  compression:
    enabled: true
  batchSize: 100
```

## Configuration by Environment

The Testing Framework Service uses different configurations based on the deployment environment:

### Development

```yaml
service:
  environment: development
  logLevel: debug

database:
  host: localhost
  ssl:
    enabled: false

auth:
  enabled: false

events:
  kafka:
    brokers: localhost:9092
    ssl:
      enabled: false
```

### Staging

```yaml
service:
  environment: staging
  logLevel: info

database:
  host: postgres-testing.staging
  pool:
    min: 5
    max: 20

execution:
  concurrency:
    max: 50

auth:
  enabled: true

events:
  kafka:
    brokers: kafka-1.staging:9092,kafka-2.staging:9092
```

### Production

```yaml
service:
  environment: production
  logLevel: info

database:
  host: postgres-testing.production
  pool:
    min: 10
    max: 50

execution:
  concurrency:
    max: 100

auth:
  enabled: true

events:
  kafka:
    brokers: kafka-1.production:9092,kafka-2.production:9092,kafka-3.production:9092
```

## Secret Management

Sensitive configuration values should be managed through a secure secret management system:

1. **Environment Variables**: For simple deployments
2. **Kubernetes Secrets**: For Kubernetes deployments
3. **HashiCorp Vault**: For advanced secret management
4. **AWS Secrets Manager/Azure Key Vault/GCP Secret Manager**: For cloud deployments

Example of referencing secrets in the configuration:

```yaml
database:
  username: ${TESTING_DB_USER}
  password: ${TESTING_DB_PASSWORD}

auth:
  jwt:
    secret: ${TESTING_AUTH_JWT_SECRET}
```

## Configuration Validation

The Testing Framework Service validates all configuration settings on startup:

1. **Schema Validation**: Ensures all configuration properties have valid types and formats
2. **Dependency Validation**: Checks that related configuration properties are consistent
3. **Connection Validation**: Verifies connectivity to configured external services
4. **Permission Validation**: Confirms the service has necessary permissions

If validation fails, the service logs detailed error messages and exits with a non-zero status code.

## Dynamic Configuration

Some configuration settings can be modified at runtime through the API:

| Setting | API Endpoint | Required Role |
|---------|--------------|--------------|
| Log Level | `PUT /admin/config/log-level` | `testing:admin` |
| Execution Concurrency | `PUT /admin/config/execution/concurrency` | `testing:admin` |
| Rate Limiting | `PUT /admin/config/api/rate-limits` | `testing:admin` |
| Result Retention | `PUT /admin/config/results/retention` | `testing:admin` |

Example request:

```json
PUT /admin/config/execution/concurrency
Authorization: Bearer <token>
Content-Type: application/json

{
  "maxConcurrentExecutions": 75
}
```

## Configuration Best Practices

1. **Environment-Specific Configuration**: Use separate configuration files for each environment
2. **Secret Management**: Never store secrets in configuration files
3. **Parameterization**: Use environment variables for deployment-specific values
4. **Validation**: Validate all configuration changes before deployment
5. **Documentation**: Document all configuration changes in deployment logs
6. **Versioning**: Version control your configuration files
7. **Monitoring**: Monitor the effects of configuration changes on system performance
8. **Defaults**: Provide sensible defaults for all configuration options
9. **Gradual Changes**: Make incremental changes to critical configuration parameters
10. **Rollback Plan**: Have a plan to roll back configuration changes if needed

## Troubleshooting Configuration Issues

Common configuration issues and their solutions:

| Issue | Possible Causes | Resolution |
|-------|-----------------|------------|
| Service fails to start | Invalid configuration format | Check YAML syntax and indentation |
| Database connection failures | Incorrect database configuration | Verify host, port, credentials, and SSL settings |
| Authentication errors | Invalid JWT settings | Check JWT secret, issuer, and audience settings |
| Low throughput | Insufficient concurrency settings | Increase max concurrent executions |
| High latency | Resource contention | Adjust database pool settings and concurrency |
| Event processing failures | Incorrect event bus configuration | Verify Kafka broker list and authentication |

## Configuration Audit and Compliance

For compliance and auditing purposes:

1. **Change Logging**: All configuration changes are logged with timestamps and user information
2. **Audit Trail**: Configuration change history is maintained for auditing
3. **Compliance Validation**: Configuration is validated against compliance requirements
4. **Regular Review**: Configuration settings are reviewed periodically for security and optimization

## Further Resources

- [Kubernetes ConfigMaps and Secrets](https://kubernetes.io/docs/concepts/configuration/) - For Kubernetes deployments
- [HashiCorp Vault](https://www.vaultproject.io/) - For advanced secret management
- [Spring Cloud Config](https://spring.io/projects/spring-cloud-config) - For centralized configuration management
- [Prometheus and Grafana](https://prometheus.io/) - For monitoring configuration changes' effects 