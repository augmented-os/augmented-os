# Business Store Service Configuration

## Overview

The Business Store Service is designed to be environment-agnostic and configurable to suit different deployment scenarios (development, testing, production). Configuration settings control how the service connects to other components, tunes its performance, and enforces any environment-specific behavior.

Configuration can be provided via **environment variables**, configuration files (YAML/JSON), or command-line arguments. We list the key configuration options, their purpose, and usage here. This allows operators or developers to customize the service without changing code.

## Environment Variables

The following environment variables are commonly used to configure the Business Store Service:

* `DB_CONNECTION_STRING`: The PostgreSQL connection URI or components (host, port, dbname, user, password). Example: `postgres://user:pass@hostname:5432/business_store`. This should point to the primary database where tenant schemas will be created.
* `DB_MAX_CONNECTIONS`: Max number of DB connections in the pool per instance (if using an internal pool). Default might be 20. Adjust based on available DB resources and number of instance】.
* `AUTH_SERVICE_URL`: Base URL for the Auth Service API, used for any calls like token introspection or key retrieval. E.g., `https://auth-service.internal`.
* `AUTH_PUBLIC_KEY` / `AUTH_JWKS_URL`: Either the public key (or JWKS) to validate JWTs if the service validates tokens itself. Alternatively, the service might call Auth for each token; in that case, maybe an `AUTH_VALIDATE_MODE=remote/local` toggle.
* `VALIDATION_SERVICE_URL`: Base URL for the JSON Schema Validation Service. If not set, the service might use local validation logic or reject schema updates (depending on design).
* `OBSERVABILITY_URL`: If there's a centralized Observability service (for pushing metrics or logs), its endpoint. Often metrics are pulled, so this might not be needed unless we push to something like StatsD or a metrics gateway.
* `TASK_SERVICE_URL`: If the BSS needs to schedule tasks, the endpoint of the Task Execution service. Or possibly a messaging topic name if using a message queue.
* `EMBEDDING_SERVICE_URL`: Endpoint for the external embedding generation (if using a cloud service for semantic search). Alternatively, `EMBEDDING_MODEL` to specify a local model.
* `ENABLE_SEMANTIC_SEARCH`: Boolean (true/false) flag to quickly enable/disable semantic search globally. If `false`, the related API and embedding calls might be turned off (returning 501 or using alternate logic).
* `LOG_LEVEL`: Set the default log level (e.g., DEBUG, INFO, WARN, ERROR) for the service logs. Default likely INFO in production. For debugging or dev, set to DEBUG.
* `ENABLE_DEBUG_LOGGING`: Another boolean toggle for debug level or sensitive info logging. E.g., in dev you might enable to see SQL statements, in prod this stays off.
* `METRICS_PORT` or `METRICS_ENDPOINT`: If metrics should be exposed on a different port or path. Often not needed if same service/port. But e.g., `METRICS_AUTH_TOKEN` if metrics endpoint requires a token for security (some setups do to avoid exposing metrics publicly).
* `RLS_STRICT`: A flag to enable strict row-level security. If true, the service will enforce the setting of `app.current_tenant` for every transaction and perhaps refuse to run any query without it. In dev or testing, one might disable RLS for easier direct DB access. Default should be true for production.
* `ENABLE_CACHING`: If there's an internal cache (like for read queries or metadata) that can be toggled. Typically yes, but can disable if troubleshooting cache issues.
* `CACHE_TTL`: If caching is on, how long (in seconds) to cache certain things like schema metadata or frequent queries. Could use 0 for forever until invalidation, or a time-based expiry. For schema metadata, might set to 300 seconds with auto-refresh on new call if needed.
* `MAX_SCHEMA_SIZE`: Limit on the JSON Schema input (in KB) to avoid extremely large schemas causing memory issues.
* `MAX_RECORD_SIZE`: Limit on the payload size for data create/update (to prevent huge blobs or misuse).
* `RATE_LIMIT_PER_MINUTE`: If the service itself does simple rate limiting per API key or tenant, set this. If not built-in, this might be handled at gateway level, so not applicable.

## Configuration File (Optional)

A YAML or JSON config might be used as an alternative to env vars. For example, `config.yaml` might look like:

```yaml
database:
  host: localhost
  port: 5432
  name: business_store
  user: bs_user
  password: secret
  poolSize: 20

services:
  authServiceUrl: "http://auth-service:8080"
  validationServiceUrl: "http://validation-service:8081"
  taskServiceUrl: "http://task-service:8082"
  observability:
    metricsEnabled: true
    tracingEnabled: true
    traceSampleRate: 0.1
semanticSearch:
  enabled: true
  embeddingServiceUrl: "https://api.openai.com/v1/embeddings"
  model: "text-embedding-ada-002"
  apiKey: "<some-key>"
logging:
  level: "INFO"
  format: "json"
performance:
  maxRequestSize: "1MB"
  queryTimeout: 30s
  # etc.
```

The service would load this config at startup if provided (ENV can point to it, e.g., `CONFIG_FILE=./config.yaml`).

## Command-Line Arguments

For certain settings, the service might allow flags, e.g.:

* `--migrate` flag to run any pending migrations on startup (like ensuring metadata schema exists or updating it). This might be used in deployment scripts.
* `--seed-demo-data` for dev environment to populate some default data.
* `--port` to specify the port the service listens on (though also env `PORT` often). Default maybe 8080.

## Runtime Configuration (Dynamic)

Some configurations might be adjustable at runtime via admin endpoints or signals:

* e.g., sending a SIGHUP could trigger reload of config file (to change log level without restart). Or an admin API `PUT /config/logLevel` to set log level dynamically (should be secured, likely not exposed publicly).
* Feature flags for enabling/disabling semantic search or new features could be toggled in config, though a restart might be simplest.

## Deployment Environments

We consider typical differences:

* **Development**: likely using local Postgres, maybe no Auth (or a dummy Auth with static tokens), semantic search might be disabled or use a mock, logging at DEBUG, and data resets often. Provide an easy way to disable Auth checks (like an env `BYPASS_AUTH=true` just for dev/testing to not require real tokens). Use of an in-memory validation if validation service isn't running.
* **Testing/Staging**: as close to production config as possible, but maybe smaller DB instance, and enabling verbose logs for troubleshooting. Possibly using smaller limits to catch issues (like lower rate limits or smaller timeouts to force edge cases).
* **Production**: all security features on, connect to production Auth/Validation endpoints, proper DB credentials from secrets store, high timeouts for background tasks, etc. Possibly incorporate secrets via environment (like DB password via secret injection, not in plain config).

## Secrets Management

Sensitive config (DB credentials, API keys for embedding service, encryption keys, etc.) should not be in plain config files in source control. Use environment variables or secret management:

* For example, `EMBEDDING_API_KEY` could be an env var set in deployment from a vault. The config loading should support pulling from env or separate file that's not committed.
* If using Kubernetes, use Secrets and mount as env or volume.

## Configuration of RLS and Security

* `ENABLE_RLS`: If false, the service might skip setting up RLS and just trust that each schema is separate (maybe for running ad-hoc queries or in test environment where RLS might complicate things). Always true in prod.
* `REQUIRE_TLS`: Ensure the service only runs behind TLS or uses TLS for DB connection. Could have flags to enforce e.g., DB SSL mode (like `DB_SSL_MODE=require`).

## Example: Default Config Values

* DB pool: default 10 connections.
* Log level: INFO.
* Metrics: enabled at `/metrics` without auth (if internal cluster).
* Health endpoints: no auth and available. Possibly configurable prefix for them if needed.
* Semantic search: default disabled if no embedding URL provided (so it doesn't error out if not configured).
* If any, default values for `MAX_SCHEMA_SIZE` (e.g., 100 KB) and `MAX_RECORD_SIZE` (maybe 1 MB) to catch anomalies.

## Configuration Best Practices

1. **Keep config in one place**: Using env variables is straightforward. If using file, ensure it's loaded early and overrides/merges with env vars logically (usually env var should override file for flexibility).
2. **Document each option**: This doc should be kept updated when new config options are added. Also in code, log the effective configuration at startup (except secrets) at DEBUG level, for traceability.
3. **Fail fast on misconfig**: If required config is missing (like DB string or Auth keys), the service should log an ERROR and not proceed rather than running with partial functionality.
4. **Use sane defaults**: So that the service can start in a dev environment with minimal env (maybe default to `localhost` DB with known creds, which dev can override via env; but in production those envs are always set explicitly).

## Environment-Specific Examples

* **Local Dev**:

  ```
  DB_CONNECTION_STRING=postgres://postgres:postgres@localhost:5432/augos_bss
  AUTH_SERVICE_URL=http://localhost:5000  (maybe a stub service)
  VALIDATION_SERVICE_URL=
  ENABLE_RLS=false  (to allow easier manual querying)
  LOG_LEVEL=DEBUG
  ```

  Run `npm run dev` or similar. The service might auto-create a default `tenant_dev` schema for quick testing.
* **Production** (in k8s manifest style):

  ```yaml
  env:
    - name: DB_CONNECTION_STRING
      valueFrom: { secretKeyRef: { name: bss-db, key: conn } }
    - name: AUTH_SERVICE_URL
      value: "http://auth-service.default.svc.cluster.local"
    - name: AUTH_JWKS_URL
      value: "http://auth-service.default.svc.cluster.local/.well-known/jwks.json"
    - name: VALIDATION_SERVICE_URL
      value: "http://validation-service.default.svc"
    - name: ENABLE_RLS
      value: "true"
    - name: LOG_LEVEL
      value: "INFO"
    - name: ENABLE_SEMANTIC_SEARCH
      value: "true"
    - name: EMBEDDING_SERVICE_URL
      value: "https://api.embeddingvendor.com"
    - name: EMBEDDING_API_KEY
      valueFrom: { secretKeyRef: { name: embedding-key, key: apiKey } }
    - name: RATE_LIMIT_PER_MINUTE
      value: "1000"
  ```

  With these, the service knows how to reach others and has security enabled.

## Related Documentation

* **[Scaling](./scaling.md)** – config like DB_POOL_SIZE and any thread/worker counts ties into scaling. Also e.g., `MAX_WORKERS` if the service uses thread pool for parallel tasks.
* **[Monitoring](./monitoring.md)** – some monitoring integration might require config (like if using an APM agent, maybe `APM_TOKEN` etc.).
* **[Security & Isolation](../implementation/security_and_isolation.md)** – key management or auth config is touched here, but Security doc covers conceptual use.
* **[Internal Interfaces](../interfaces/internal.md)** – if internal endpoints or event topics are configurable (like the broker address), mention here e.g., `EVENT_BROKER_URL` or `KAFKA_BROKERS`. (If BSS uses Kafka for events, we'd have config like bootstrap servers, topic names possibly.)
* **Deployment/DevOps Guides** – might outline sample config sets for different environments.
* **[Overview](../overview.md)** – High-level architectural overview of the Business Store Service.
* **[API Reference](../interfaces/api.md)** – How configuration affects API functionality.
* **[Tenant Schema Management](../implementation/tenant_schema_management.md)** – How configuration affects schema management.
* **[Semantic Search Integration](../implementation/semantic_search_integration.md)** – Configuration for semantic search features.


