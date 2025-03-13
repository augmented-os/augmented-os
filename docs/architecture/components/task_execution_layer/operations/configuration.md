# Task Execution Layer Configuration

## Overview

This document describes the configuration options for the Task Execution Layer Service. It covers environment variables, configuration files, runtime settings, and best practices for configuring the service in different environments.

## Configuration Hierarchy

The Task Execution Layer uses a hierarchical configuration approach with the following precedence (highest to lowest):


1. **Environment Variables**: Highest precedence, used for environment-specific settings
2. **Configuration Files**: Environment-specific configuration files
3. **Service Discovery**: Dynamic configuration from service discovery
4. **Default Values**: Hardcoded defaults as a fallback

## Core Configuration Parameters

### Service Configuration

| Parameter | Description | Default | Environment Variable |
|----|----|----|----|
| `service.name` | Service name for registration and discovery | `task-execution-layer` | `TEL_SERVICE_NAME` |
| `service.port` | HTTP port for the service | `8080` | `TEL_SERVICE_PORT` |
| `service.managementPort` | Management API port | `8081` | `TEL_MANAGEMENT_PORT` |
| `service.contextPath` | Base context path for all endpoints | `/api` | `TEL_CONTEXT_PATH` |
| `service.version` | Service version | From build | `TEL_SERVICE_VERSION` |
| `service.environment` | Deployment environment | `development` | `TEL_ENVIRONMENT` |
| `service.region` | Deployment region | `us-east-1` | `TEL_REGION` |

### Database Configuration

| Parameter | Description | Default | Environment Variable |
|----|----|----|----|
| `database.url` | JDBC URL for the database | `jdbc:postgresql://localhost:5432/taskdb` | `TEL_DB_URL` |
| `database.username` | Database username | `taskuser` | `TEL_DB_USERNAME` |
| `database.password` | Database password | None | `TEL_DB_PASSWORD` |
| `database.poolSize.min` | Minimum connection pool size | `5` | `TEL_DB_POOL_MIN` |
| `database.poolSize.max` | Maximum connection pool size | `20` | `TEL_DB_POOL_MAX` |
| `database.connectionTimeout` | Connection timeout in ms | `30000` | `TEL_DB_CONN_TIMEOUT` |
| `database.idleTimeout` | Connection idle timeout in ms | `600000` | `TEL_DB_IDLE_TIMEOUT` |
| `database.maxLifetime` | Maximum connection lifetime in ms | `1800000` | `TEL_DB_MAX_LIFETIME` |

### Task Queue Configuration

| Parameter | Description | Default | Environment Variable |
|----|----|----|----|
| `queue.provider` | Queue provider (kafka, rabbitmq, sqs) | `kafka` | `TEL_QUEUE_PROVIDER` |
| `queue.hosts` | Comma-separated list of queue hosts | `localhost:9092` | `TEL_QUEUE_HOSTS` |
| `queue.username` | Queue authentication username | None | `TEL_QUEUE_USERNAME` |
| `queue.password` | Queue authentication password | None | `TEL_QUEUE_PASSWORD` |
| `queue.automated.name` | Name of automated tasks queue | `task-execution-automated` | `TEL_QUEUE_AUTOMATED_NAME` |
| `queue.integration.name` | Name of integration tasks queue | `task-execution-integration` | `TEL_QUEUE_INTEGRATION_NAME` |
| `queue.manual.name` | Name of manual tasks queue | `task-execution-manual` | `TEL_QUEUE_MANUAL_NAME` |
| `queue.retry.name` | Name of retry queue | `task-execution-retry` | `TEL_QUEUE_RETRY_NAME` |
| `queue.deadletter.name` | Name of dead letter queue | `task-execution-deadletter` | `TEL_QUEUE_DLQ_NAME` |
| `queue.visibilityTimeout` | Task visibility timeout in seconds | `300` | `TEL_QUEUE_VISIBILITY_TIMEOUT` |
| `queue.pollInterval` | Queue polling interval in ms | `1000` | `TEL_QUEUE_POLL_INTERVAL` |
| `queue.batchSize` | Maximum batch size for queue operations | `10` | `TEL_QUEUE_BATCH_SIZE` |

### Executor Configuration

| Parameter | Description | Default | Environment Variable |
|----|----|----|----|
| `executor.automated.poolSize` | Thread pool size for automated tasks | `10` | `TEL_EXECUTOR_AUTOMATED_POOL_SIZE` |
| `executor.automated.maxConcurrent` | Maximum concurrent automated tasks | `50` | `TEL_EXECUTOR_AUTOMATED_MAX_CONCURRENT` |
| `executor.integration.poolSize` | Thread pool size for integration tasks | `20` | `TEL_EXECUTOR_INTEGRATION_POOL_SIZE` |
| `executor.integration.maxConcurrent` | Maximum concurrent integration tasks | `100` | `TEL_EXECUTOR_INTEGRATION_MAX_CONCURRENT` |
| `executor.manual.poolSize` | Thread pool size for manual tasks | `5` | `TEL_EXECUTOR_MANUAL_POOL_SIZE` |
| `executor.manual.maxConcurrent` | Maximum concurrent manual tasks | `1000` | `TEL_EXECUTOR_MANUAL_MAX_CONCURRENT` |
| `executor.defaultTimeout` | Default task execution timeout in seconds | `300` | `TEL_EXECUTOR_DEFAULT_TIMEOUT` |
| `executor.maxTimeout` | Maximum allowed task timeout in seconds | `3600` | `TEL_EXECUTOR_MAX_TIMEOUT` |

### Security Configuration

| Parameter | Description | Default | Environment Variable |
|----|----|----|----|
| `security.enabled` | Enable security features | `true` | `TEL_SECURITY_ENABLED` |
| `security.auth.provider` | Authentication provider | `jwt` | `TEL_AUTH_PROVIDER` |
| `security.auth.jwt.secret` | JWT secret for token validation | None | `TEL_JWT_SECRET` |
| `security.auth.jwt.issuer` | Expected JWT issuer | `auth-service` | `TEL_JWT_ISSUER` |
| `security.auth.jwt.expiration` | Token expiration time in seconds | `3600` | `TEL_JWT_EXPIRATION` |
| `security.cors.enabled` | Enable CORS support | `true` | `TEL_CORS_ENABLED` |
| `security.cors.allowedOrigins` | Allowed CORS origins | `*` | `TEL_CORS_ALLOWED_ORIGINS` |
| `security.cors.allowedMethods` | Allowed CORS methods | `GET,POST,PUT,DELETE` | `TEL_CORS_ALLOWED_METHODS` |

### Monitoring Configuration

| Parameter | Description | Default | Environment Variable |
|----|----|----|----|
| `monitoring.metrics.enabled` | Enable metrics collection | `true` | `TEL_METRICS_ENABLED` |
| `monitoring.metrics.reporter` | Metrics reporter (prometheus, jmx, graphite) | `prometheus` | `TEL_METRICS_REPORTER` |
| `monitoring.metrics.interval` | Metrics reporting interval in seconds | `60` | `TEL_METRICS_INTERVAL` |
| `monitoring.health.enabled` | Enable health checks | `true` | `TEL_HEALTH_ENABLED` |
| `monitoring.tracing.enabled` | Enable distributed tracing | `true` | `TEL_TRACING_ENABLED` |
| `monitoring.tracing.sampler` | Tracing sampler type | `probabilistic` | `TEL_TRACING_SAMPLER` |
| `monitoring.tracing.samplingRate` | Tracing sampling rate (0.0-1.0) | `0.1` | `TEL_TRACING_SAMPLING_RATE` |

## Component-Specific Configuration

### Task Router Configuration

```yaml
taskRouter:
  routingStrategy: round-robin  # Options: round-robin, least-loaded, priority-based
  routingRules:
    - taskType: automated
      executor: automated
      priority: high
    - taskType: integration
      executor: integration
      priority: medium
    - taskType: manual
      executor: manual
      priority: low
  defaultExecutor: automated
  loadBalancing:
    enabled: true
    updateInterval: 5000  # ms
    metricType: queue-depth  # Options: queue-depth, cpu-usage, response-time
```

### Automated Task Executor Configuration

```yaml
automatedTaskExecutor:
  sandbox:
    type: container  # Options: container, vm, language-runtime
    containerConfig:
      baseImage: alpine:latest
      securityProfile: restricted
      resourceLimits:
        cpu: 1.0
        memory: 512Mi
        disk: 1Gi
      networkPolicy:
        outboundAccess: false
        allowedEndpoints: []
    timeoutBuffer: 10  # seconds to add to task timeout for cleanup
  execution:
    maxRetries: 3
    retryDelay: 30000  # ms
    retryBackoffMultiplier: 2.0
```

### Integration Task Executor Configuration

```yaml
integrationTaskExecutor:
  connectors:
    - type: rest
      enabled: true
      maxConnections: 100
      connectionTimeout: 5000  # ms
      socketTimeout: 30000  # ms
    - type: soap
      enabled: true
      maxConnections: 50
      connectionTimeout: 10000  # ms
      socketTimeout: 60000  # ms
    - type: database
      enabled: true
      maxConnections: 20
      connectionTimeout: 5000  # ms
      queryTimeout: 30000  # ms
  rateLimiting:
    enabled: true
    defaultLimit: 100  # requests per minute
    perEndpointLimits:
      - endpoint: "api.example.com"
        limit: 50  # requests per minute
```

### Manual Task Handler Configuration

```yaml
manualTaskHandler:
  assignment:
    strategy: load-balanced  # Options: load-balanced, skill-based, round-robin
    loadFactor: 10  # Maximum tasks per user
    reassignmentEnabled: true
    escalationEnabled: true
  notification:
    channels:
      - type: email
        enabled: true
        templates:
          assignment: "task-assignment.html"
          reminder: "task-reminder.html"
          escalation: "task-escalation.html"
      - type: in-app
        enabled: true
      - type: push
        enabled: false
  deadlines:
    defaultDuration: 86400  # seconds (24 hours)
    reminderThresholds: [0.5, 0.75, 0.9]  # Percentage of deadline
    escalationThreshold: 1.0  # Percentage of deadline
```

## Environment-Specific Configurations

### Development Environment

```yaml
service:
  environment: development
  
database:
  url: jdbc:postgresql://localhost:5432/taskdb_dev
  
security:
  auth:
    jwt:
      secret: dev-secret-key
      
monitoring:
  tracing:
    samplingRate: 1.0  # Sample all requests in development
    
logging:
  level:
    root: INFO
    com.example.taskexecution: DEBUG
```

### Testing Environment

```yaml
service:
  environment: testing
  
database:
  url: jdbc:postgresql://test-db:5432/taskdb_test
  poolSize:
    min: 2
    max: 10
    
executor:
  automated:
    maxConcurrent: 10
  integration:
    maxConcurrent: 20
    
monitoring:
  metrics:
    interval: 10  # More frequent reporting for tests
```

### Production Environment

```yaml
service:
  environment: production
  
database:
  poolSize:
    min: 10
    max: 50
  
security:
  auth:
    jwt:
      secret: ${TEL_JWT_SECRET}  # Use environment variable
      
executor:
  automated:
    poolSize: 50
    maxConcurrent: 200
  integration:
    poolSize: 100
    maxConcurrent: 500
  manual:
    poolSize: 20
    maxConcurrent: 5000
    
monitoring:
  tracing:
    samplingRate: 0.1  # Sample 10% of requests in production
    
logging:
  level:
    root: WARN
    com.example.taskexecution: INFO
```

## Configuration File Formats

The Task Execution Layer supports the following configuration file formats:


1. **YAML**: Preferred format for human-readable configuration
2. **Properties**: Java properties format for simple configurations
3. **JSON**: Used for programmatic configuration generation

### Example YAML Configuration

```yaml
service:
  name: task-execution-layer
  port: 8080
  managementPort: 8081
  
database:
  url: jdbc:postgresql://localhost:5432/taskdb
  username: taskuser
  password: ${TEL_DB_PASSWORD}
  poolSize:
    min: 5
    max: 20
    
queue:
  provider: kafka
  hosts: kafka-1:9092,kafka-2:9092,kafka-3:9092
  
executor:
  automated:
    poolSize: 10
    maxConcurrent: 50
  integration:
    poolSize: 20
    maxConcurrent: 100
  manual:
    poolSize: 5
    maxConcurrent: 1000
    
security:
  enabled: true
  auth:
    provider: jwt
    jwt:
      secret: ${TEL_JWT_SECRET}
      issuer: auth-service
      
monitoring:
  metrics:
    enabled: true
    reporter: prometheus
  tracing:
    enabled: true
    samplingRate: 0.1
```

## Configuration Best Practices


1. **Externalize Secrets**:
   * Never store secrets (passwords, tokens) in configuration files
   * Use environment variables or a secure secret store
2. **Environment-Specific Configurations**:
   * Maintain separate configuration files for each environment
   * Use environment variables for values that change between environments
3. **Validation**:
   * Validate configuration at startup
   * Fail fast if critical configuration is missing or invalid
4. **Documentation**:
   * Document all configuration parameters
   * Include default values and acceptable ranges
5. **Monitoring**:
   * Expose configuration through a management endpoint
   * Log configuration changes
   * Alert on critical configuration issues
6. **Defaults**:
   * Provide sensible defaults for all parameters
   * Make the service work out-of-the-box with minimal configuration
7. **Reloadable Configuration**:
   * Support runtime configuration reloading where possible
   * Validate changes before applying them

## Task-Level vs. Service-Level Configuration

The Task Execution Layer distinguishes between service-level and task-level configuration:

### Service-Level Configuration

* Applied to the entire service
* Controlled by operations teams
* Changed infrequently
* Examples: database connection, security settings, monitoring configuration

### Task-Level Configuration

* Applied to individual task types or instances
* Controlled by workflow designers
* Can change frequently
* Examples: timeout values, retry policies, resource requirements

Task-level configuration is stored in the task definition and can be overridden at the workflow or task instance level:

```json
{
  "taskType": "automated",
  "name": "data-processing-task",
  "executionConfig": {
    "timeout": 600,
    "retryPolicy": {
      "maxRetries": 3,
      "retryDelay": 60000,
      "retryBackoffMultiplier": 2.0,
      "retryableErrors": ["TIMEOUT", "RESOURCE_UNAVAILABLE"]
    },
    "resources": {
      "cpu": 2.0,
      "memory": "1Gi"
    },
    "securityContext": {
      "runAs": "task-user",
      "allowedEndpoints": ["api.internal.example.com"]
    }
  }
}
```

## Configuration Management Tools

The Task Execution Layer integrates with the following configuration management tools:


1. **Spring Cloud Config**: For centralized configuration management
2. **Kubernetes ConfigMaps and Secrets**: For container-based deployments
3. **AWS Parameter Store/Secrets Manager**: For AWS deployments
4. **HashiCorp Vault**: For secret management

## Related Documentation

* [Deployment Guide](../deployment.md)
* [Security Guidelines](./security.md)
* [Monitoring](./monitoring.md)
* [Scaling](./scaling.md)
* [Task Definition Schema](../data_model.md#task-definition)


