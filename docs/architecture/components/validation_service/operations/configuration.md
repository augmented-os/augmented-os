# Validation Service Configuration

This document describes the configuration options for the Validation Service, providing guidance on how to configure the service for different deployment scenarios and requirements.

## Configuration Approach

The Validation Service follows a layered configuration approach that allows for flexibility across different environments while maintaining sensible defaults.

### Configuration Sources

Configuration can be provided through the following sources, listed in order of precedence (highest to lowest):

1. **Command-line Arguments**: Passed directly to the service at startup
2. **Environment Variables**: Set in the deployment environment
3. **Configuration Files**: YAML or JSON configuration files
4. **Default Values**: Built-in defaults for all parameters

### Configuration File Format

The primary configuration file is in YAML format. Example:

```yaml
validation_service:
  server:
    port: 8080
    host: "0.0.0.0"
    request_timeout: 30s
  
  schema_registry:
    storage_type: "database"
    cache_size: 1024
    
  validation_engine:
    max_validators: 50
    validation_timeout: 5s
    
  database:
    type: "postgresql"
    host: "localhost"
    port: 5432
    name: "validation_service"
    user: "${DB_USER}"
    password: "${DB_PASSWORD}"
    pool_size: 20
    
  logging:
    level: "info"
    format: "json"
```

### Environment Variable Mapping

Environment variables can override any configuration setting using the following pattern:

```
VALIDATION_SERVICE_[SECTION]_[PROPERTY]
```

For example:
- `VALIDATION_SERVICE_SERVER_PORT=9090` sets the server port to 9090
- `VALIDATION_SERVICE_SCHEMA_REGISTRY_CACHE_SIZE=2048` sets the schema cache size to 2048

## Core Configuration Parameters

### Server Configuration

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `server.port` | Integer | 8080 | The port the API server listens on |
| `server.host` | String | "0.0.0.0" | The host address to bind to |
| `server.request_timeout` | Duration | "30s" | Maximum duration for request processing |
| `server.max_request_size` | String | "10MB" | Maximum request body size |
| `server.shutdown_timeout` | Duration | "15s" | Graceful shutdown period |
| `server.enable_cors` | Boolean | true | Enable CORS support |
| `server.cors_allowed_origins` | String List | ["*"] | Allowed CORS origins |
| `server.enable_compression` | Boolean | true | Enable response compression |
| `server.compression_level` | Integer | 5 | Compression level (1-9) |
| `server.tls_enabled` | Boolean | false | Enable TLS |
| `server.tls_cert_file` | String | "" | Path to TLS certificate file |
| `server.tls_key_file` | String | "" | Path to TLS key file |

### Schema Registry Configuration

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `schema_registry.storage_type` | String | "database" | Storage type for schemas ("database", "file", "memory") |
| `schema_registry.file_path` | String | "./schemas" | Path for file-based schema storage |
| `schema_registry.cache_size` | Integer | 1024 | Maximum number of schemas to cache in memory |
| `schema_registry.cache_ttl` | Duration | "1h" | Time-to-live for cached schemas |
| `schema_registry.allow_dynamic_registration` | Boolean | true | Allow runtime schema registration |
| `schema_registry.enforce_compatibility` | Boolean | true | Enforce schema compatibility on updates |
| `schema_registry.compatibility_level` | String | "BACKWARD" | Compatibility level ("BACKWARD", "FORWARD", "FULL") |
| `schema_registry.max_schema_size` | String | "1MB" | Maximum schema definition size |
| `schema_registry.enable_versioning` | Boolean | true | Enable schema versioning |
| `schema_registry.preload_schemas` | Boolean | false | Preload all schemas into cache at startup |
| `schema_registry.schema_check_interval` | Duration | "5m" | Interval for checking schema updates |

### Validation Engine Configuration

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `validation_engine.max_validators` | Integer | 50 | Maximum number of custom validators |
| `validation_engine.validation_timeout` | Duration | "5s" | Timeout for individual validations |
| `validation_engine.parallel_validations` | Boolean | true | Enable parallel validation execution |
| `validation_engine.max_errors` | Integer | 100 | Maximum number of errors to collect per validation |
| `validation_engine.cache_compiled_schemas` | Boolean | true | Cache compiled schemas for reuse |
| `validation_engine.compiled_schema_cache_size` | Integer | 512 | Number of compiled schemas to cache |
| `validation_engine.validation_result_cache_enabled` | Boolean | false | Enable validation result caching |
| `validation_engine.validation_result_cache_size` | Integer | 1000 | Size of validation result cache |
| `validation_engine.validation_result_cache_ttl` | Duration | "5m" | TTL for cached validation results |
| `validation_engine.strict_mode` | Boolean | false | Enable strict validation mode |
| `validation_engine.coerce_types` | Boolean | true | Attempt to coerce types during validation |

## Environment-Specific Configurations

### Development Environment

Recommended configuration for development environments:

```yaml
validation_service:
  server:
    port: 8080
    request_timeout: 60s
  
  schema_registry:
    storage_type: "file"
    file_path: "./dev-schemas"
    allow_dynamic_registration: true
    enforce_compatibility: false
    
  validation_engine:
    validation_timeout: 30s
    strict_mode: false
    
  database:
    type: "sqlite"
    path: "./validation-service-dev.db"
    
  logging:
    level: "debug"
    format: "console"
```

### Testing Environment

Recommended configuration for testing environments:

```yaml
validation_service:
  server:
    port: 8080
    
  schema_registry:
    storage_type: "memory"
    allow_dynamic_registration: true
    
  validation_engine:
    validation_timeout: 1s
    strict_mode: true
    
  database:
    type: "h2"
    mode: "in-memory"
    
  logging:
    level: "info"
    format: "json"
```

### Production Environment

Recommended configuration for production environments:

```yaml
validation_service:
  server:
    port: 8080
    request_timeout: 10s
    max_request_size: "5MB"
    enable_cors: true
    cors_allowed_origins: ["https://example.com"]
    tls_enabled: true
    
  schema_registry:
    storage_type: "database"
    cache_size: 2048
    enforce_compatibility: true
    preload_schemas: true
    
  validation_engine:
    validation_timeout: 3s
    parallel_validations: true
    cache_compiled_schemas: true
    
  database:
    type: "postgresql"
    host: "validation-db.internal"
    pool_size: 50
    max_idle_connections: 10
    connection_timeout: 5s
    
  logging:
    level: "warn"
    format: "json"
```

## Database Configuration

The Validation Service supports multiple database backends for storing schemas and related metadata.

### Database Types

| Database Type | Description | Use Case |
|---------------|-------------|----------|
| `postgresql` | PostgreSQL database | Production deployments, high reliability |
| `mysql` | MySQL database | Production alternative, wider availability |
| `sqlite` | SQLite file-based database | Development, testing, small deployments |
| `h2` | H2 embedded database | Testing, rapid development |
| `mongodb` | MongoDB document store | Schema-heavy workloads, flexible schema storage |

### Common Database Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `database.type` | String | "postgresql" | Database type to use |
| `database.host` | String | "localhost" | Database server hostname |
| `database.port` | Integer | Depends on type | Database server port |
| `database.name` | String | "validation_service" | Database/schema name |
| `database.user` | String | "" | Database username |
| `database.password` | String | "" | Database password |
| `database.pool_size` | Integer | 20 | Maximum database connections |
| `database.min_idle` | Integer | 5 | Minimum idle connections |
| `database.max_idle` | Integer | 10 | Maximum idle connections |
| `database.connection_timeout` | Duration | "5s" | Connection timeout |
| `database.idle_timeout` | Duration | "10m" | Idle connection timeout |
| `database.max_lifetime` | Duration | "30m" | Maximum connection lifetime |
| `database.validate_on_borrow` | Boolean | true | Validate connections when borrowed |
| `database.auto_commit` | Boolean | true | Auto-commit database operations |

### PostgreSQL Specific Configuration

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `database.ssl_mode` | String | "disable" | SSL mode ("disable", "require", "verify-ca", "verify-full") |
| `database.ssl_cert` | String | "" | Path to SSL certificate file |
| `database.ssl_key` | String | "" | Path to SSL key file |
| `database.ssl_root_cert` | String | "" | Path to SSL root certificate file |
| `database.application_name` | String | "validation-service" | Application name tag |
| `database.schema` | String | "public" | PostgreSQL schema to use |
| `database.statement_timeout` | Duration | "0s" | Statement timeout (0 = no timeout) |

### MySQL Specific Configuration

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `database.tls_config` | String | "" | TLS configuration name |
| `database.parse_time` | Boolean | true | Parse time values as time.Time |
| `database.allow_native_passwords` | Boolean | true | Allow native password authentication |
| `database.tls_skip_verify` | Boolean | false | Skip TLS certificate verification |
| `database.character_set` | String | "utf8mb4" | Character set to use |
| `database.collation` | String | "utf8mb4_unicode_ci" | Collation to use |

### Database Migration

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `database.migration.enabled` | Boolean | true | Enable automatic database migration |
| `database.migration.version` | String | "latest" | Target migration version |
| `database.migration.table` | String | "schema_migrations" | Migration tracking table name |
| `database.migration.scripts_path` | String | "./migrations" | Path to migration scripts |
| `database.migration.baseline_on_migrate` | Boolean | false | Initialize migration history if empty |
| `database.migration.validate_on_migrate` | Boolean | true | Validate migrations before applying |

### Connection Pooling Strategies

The Validation Service uses connection pooling to optimize database access. The following configuration examples show different pooling strategies:

#### High Throughput Configuration

```yaml
database:
  pool_size: 50
  min_idle: 10
  max_idle: 20
  idle_timeout: "5m"
  max_lifetime: "15m"
```

#### Low Resource Configuration

```yaml
database:
  pool_size: 10
  min_idle: 1
  max_idle: 5
  idle_timeout: "10m"
  max_lifetime: "30m"
```

#### High Availability Configuration

```yaml
database:
  pool_size: 30
  min_idle: 15
  max_idle: 25
  connection_timeout: "3s"
  validate_on_borrow: true
  max_lifetime: "10m"
```

## Logging Configuration

The Validation Service uses structured logging to provide observability into its operations.

### Log Configuration Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `logging.level` | String | "info" | Log level ("error", "warn", "info", "debug", "trace") |
| `logging.format` | String | "json" | Log format ("json", "text", "console") |
| `logging.output` | String | "stdout" | Log output ("stdout", "stderr", "file") |
| `logging.file_path` | String | "./logs/validation-service.log" | Log file path (when output is "file") |
| `logging.max_size` | Integer | 100 | Maximum log file size in MB before rotation |
| `logging.max_age` | Integer | 30 | Maximum days to retain old log files |
| `logging.max_backups` | Integer | 10 | Maximum number of old log files to retain |
| `logging.compress` | Boolean | true | Compress rotated log files |
| `logging.include_caller` | Boolean | false | Include caller information in logs |
| `logging.include_timestamp` | Boolean | true | Include timestamp in logs |
| `logging.timestamp_format` | String | "2006-01-02T15:04:05.000Z07:00" | Timestamp format |
| `logging.sampling_enabled` | Boolean | false | Enable log sampling for high-volume logs |
| `logging.sampling_initial` | Integer | 100 | Initial log count before sampling |
| `logging.sampling_thereafter` | Integer | 100 | Sample rate after initial count |

### Log Format Examples

#### JSON Format

```json
{
  "level": "info",
  "timestamp": "2023-05-15T14:22:33.456Z",
  "message": "Validation request processed",
  "schemaId": "product-schema",
  "valid": true,
  "duration": 42.5,
  "requestId": "req-123e4567-e89b-12d3-a456-426614174000"
}
```

#### Text Format

```
2023-05-15T14:22:33.456Z INFO Validation request processed schemaId=product-schema valid=true duration=42.5ms requestId=req-123e4567-e89b-12d3-a456-426614174000
```

#### Console Format (for development)

```
INFO [2023-05-15T14:22:33.456Z] Validation request processed
  schemaId: "product-schema"
  valid: true
  duration: 42.5ms
  requestId: "req-123e4567-e89b-12d3-a456-426614174000"
```

### Log Level Guidelines

| Level | Usage |
|-------|-------|
| ERROR | Service failures, data corruption, security issues |
| WARN | Validation failures, performance degradation, recoverable errors |
| INFO | Service startup/shutdown, schema registrations, configuration changes |
| DEBUG | Detailed operation information, cache operations, request details |
| TRACE | Very detailed debugging information including data values |

### Production Logging Configuration

For production environments, we recommend:

```yaml
logging:
  level: "warn"  # Only warnings and errors in production
  format: "json" # Structured logging for machine processing
  output: "stdout" # Container environments typically collect stdout
  include_caller: true # Helps with debugging in production
  sampling_enabled: true # Prevent log flooding in high-volume environments
  sampling_initial: 50
  sampling_thereafter: 10
```

### Development Logging Configuration

For development environments, we recommend:

```yaml
logging:
  level: "debug"  # More detailed logs for development
  format: "console" # Human-readable format
  output: "stdout" # Direct to console
  include_caller: true # Helps identify source code locations
  sampling_enabled: false # See all logs
```

### Log Correlation

The Validation Service supports distributed tracing and log correlation. When properly configured, all logs will include:

- `requestId`: Unique identifier for each request
- `traceId`: Distributed tracing identifier
- `spanId`: Span identifier within a trace
- `correlationId`: Business transaction identifier (when provided)

To enable correlation with other services, configure:

```yaml
logging:
  correlation:
    enabled: true
    header_name: "X-Correlation-ID"
    propagation_mode: "w3c" # Options: "w3c", "b3", "jaeger", "custom"
```

## Security Configuration

The Validation Service provides multiple security mechanisms to protect schema data and validation operations.

### Authentication and Authorization

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `security.auth.enabled` | Boolean | true | Enable authentication |
| `security.auth.type` | String | "jwt" | Authentication type ("none", "basic", "jwt", "oauth2", "api_key") |
| `security.auth.realm` | String | "ValidationService" | Authentication realm |
| `security.auth.header_name` | String | "Authorization" | Authentication header name |
| `security.auth.query_param` | String | "access_token" | Query parameter name for token |
| `security.auth.exclude_paths` | String List | ["/health/*", "/metrics"] | Paths excluded from authentication |

### JWT Authentication Configuration

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `security.jwt.key_type` | String | "rsa" | Key type ("rsa", "ec", "hmac") |
| `security.jwt.public_key_path` | String | "./keys/public.pem" | Path to public key |
| `security.jwt.private_key_path` | String | "./keys/private.pem" | Path to private key (if service issues tokens) |
| `security.jwt.secret` | String | "" | Shared secret for HMAC |
| `security.jwt.issuer` | String | "validation-service" | Expected token issuer |
| `security.jwt.audience` | String | "validation-clients" | Expected token audience |
| `security.jwt.expiration` | Duration | "1h" | Token expiration if issued by service |
| `security.jwt.clock_skew` | Duration | "1m" | Allowed clock skew for verification |

### OAuth2 Configuration

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `security.oauth2.client_id` | String | "" | OAuth2 client ID |
| `security.oauth2.client_secret` | String | "" | OAuth2 client secret |
| `security.oauth2.discovery_url` | String | "" | OpenID Connect discovery URL |
| `security.oauth2.token_url` | String | "" | Token endpoint URL |
| `security.oauth2.auth_url` | String | "" | Authorization endpoint URL |
| `security.oauth2.scopes` | String List | ["validation"] | Required scopes |
| `security.oauth2.audience` | String | "" | Required audience |

### API Key Authentication

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `security.api_key.header_name` | String | "X-API-Key" | API key header name |
| `security.api_key.query_param` | String | "api_key" | API key query parameter |
| `security.api_key.keys` | Map | {} | Allowed API keys and their roles |
| `security.api_key.key_store` | String | "file" | Key store type ("file", "database", "vault") |
| `security.api_key.key_store_path` | String | "./config/api_keys.yaml" | Path to key store file |

### Access Control Configuration

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `security.acl.enabled` | Boolean | false | Enable fine-grained access control |
| `security.acl.model_path` | String | "./config/casbin_model.conf" | Path to access control model |
| `security.acl.policy_path` | String | "./config/casbin_policy.csv" | Path to access control policy |
| `security.acl.adapter` | String | "file" | Policy adapter ("file", "database") |

### TLS Configuration

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `security.tls.enabled` | Boolean | false | Enable TLS |
| `security.tls.cert_file` | String | "./certs/server.crt" | Path to TLS certificate |
| `security.tls.key_file` | String | "./certs/server.key" | Path to TLS key |
| `security.tls.ca_file` | String | "" | Path to CA certificate for client verification |
| `security.tls.min_version` | String | "1.2" | Minimum TLS version ("1.0", "1.1", "1.2", "1.3") |
| `security.tls.cipher_suites` | String List | [] | Allowed cipher suites (empty = defaults) |
| `security.tls.require_client_cert` | Boolean | false | Require client certificate |

### Content Security Configuration

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `security.content.max_schema_size` | String | "1MB" | Maximum schema definition size |
| `security.content.validate_schema` | Boolean | true | Validate schemas before registration |
| `security.content.allowed_schema_types` | String List | ["json", "xml", "avro", "protobuf"] | Allowed schema types |
| `security.content.schema_sandboxing` | Boolean | true | Enable schema evaluation sandboxing |
| `security.content.custom_validator_sandboxing` | Boolean | true | Enable custom validator sandboxing |
| `security.content.max_custom_validator_size` | String | "100KB" | Maximum custom validator size |
| `security.content.custom_validator_timeout` | Duration | "500ms" | Custom validator execution timeout |

### Security Example Configurations

#### Basic Development Configuration

```yaml
security:
  auth:
    enabled: false
  tls:
    enabled: false
  content:
    max_schema_size: "5MB"
    validate_schema: true
    custom_validator_sandboxing: true
```

#### Production Configuration with JWT

```yaml
security:
  auth:
    enabled: true
    type: "jwt"
    exclude_paths: ["/health/*", "/metrics"]
  jwt:
    key_type: "rsa"
    public_key_path: "/secrets/jwt/public.pem"
    issuer: "auth-service"
    audience: "validation-service"
  tls:
    enabled: true
    cert_file: "/secrets/tls/server.crt"
    key_file: "/secrets/tls/server.key"
    min_version: "1.2"
  acl:
    enabled: true
    adapter: "database"
  content:
    max_schema_size: "500KB"
    validate_schema: true
    schema_sandboxing: true
    custom_validator_sandboxing: true
    custom_validator_timeout: "200ms"
```

#### Enterprise Configuration with OAuth2 and mTLS

```yaml
security:
  auth:
    enabled: true
    type: "oauth2"
    exclude_paths: ["/health/*"]
  oauth2:
    discovery_url: "https://auth.example.com/.well-known/openid-configuration"
    client_id: "${OAUTH_CLIENT_ID}"
    scopes: ["validation.read", "validation.write"]
    audience: "validation-service"
  tls:
    enabled: true
    cert_file: "/secrets/tls/server.crt"
    key_file: "/secrets/tls/server.key"
    ca_file: "/secrets/tls/ca.crt"
    min_version: "1.3"
    require_client_cert: true
  acl:
    enabled: true
    adapter: "database"
  content:
    max_schema_size: "250KB"
    validate_schema: true
    allowed_schema_types: ["json", "avro"]
    schema_sandboxing: true
    custom_validator_sandboxing: true
    custom_validator_timeout: "100ms"
```

## Related Documentation

- [Scaling](./scaling.md) - Performance and scaling information
- [Monitoring](./monitoring.md) - Monitoring approach for the service
- [Deployment Guide](./deployment.md) - Deployment patterns and options 