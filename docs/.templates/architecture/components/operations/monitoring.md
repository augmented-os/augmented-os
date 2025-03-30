# Business Store Service Monitoring

## Overview

Monitoring the Business Store Service is critical to ensure its reliability and performance in a multi-tenant environment. This document outlines the key metrics, logging practices, health checks, and alerting for the service. Proper monitoring helps us detect issues like performance bottlenecks (e.g., slow queries), security events (e.g., unauthorized access attempts), and capacity concerns (e.g., database nearing limits).

## Metrics

The Business Store Service exposes metrics in Prometheus format at the `/metrics` endpoin】. Important metrics to monitor include:

### Tenant Operations Metrics

These metrics track the core operations per tenant and resource type:

* `business_store_record_create_total` (Counter): Total number of records created across all tenants. We also break this down with labels for `resource` (table name) and `tenant` (perhaps hashed or grouped, since per-tenant label might be high cardinality, we might group by tier or just count globally).
* `business_store_record_read_total` (Counter): Total number of record fetch (GET) operations.
* `business_store_record_update_total` (Counter): Total number of record update operations.
* `business_store_record_delete_total` (Counter): Total number of deletions.

Each metric can be labeled with success/fail status or error type if needed. For example, `business_store_record_create_total{status="success"}` vs `{status="error"}`.

* `business_store_schema_update_total` (Counter): Count of schema update operations performed. This is important to watch since schema changes are heavy operations.

Additionally, performance metrics:

* `business_store_request_duration_seconds` (Histogram): Time taken to process API requests, categorized by endpoint (could use a label like `operation="createRecord"` etc.). Helps identify slow endpoints.
* `business_store_db_query_duration_seconds` (Histogram): Time spent on database queries per operation type (maybe separate for read vs write vs schema migration). This correlates to `[component]_db_operation_time_seconds` in the templat】 (so specifically, `business_store_db_operation_time_seconds`).

### Database Metrics

From the database integration (these might be collected via Postgres exporter or directly by the service):

* `business_store_db_connection_pool_utilization` (Gauge): Current usage of DB connection pool vs ma】. If this approaches 1 (100%), it means the service is hitting the limit of DB connections – possibly a bottleneck.
* `business_store_db_query_errors_total` (Counter): Number of database query errors (failed SQL executions】. Spikes here might indicate issues like constraint violations or deadlocks.
* `business_store_db_deadlocks_total` (Counter): (If trackable) how many deadlocks were detected and handled. Should normally be 0; >0 indicates potential contention issues.

We also rely on a general Postgres monitoring (through Observability service or PgBouncer stats if used) for things like slow queries and index usage.

### External Service Metrics

The Business Store Service interacts with other services (Auth, Validation, etc.). Monitor those interactions:

* `business_store_auth_requests_total` (Counter): Number of calls to Auth Service. Possibly split by type (`token_verify`, `get_key`, etc.) with labels.
* `business_store_auth_request_failed_total` (Counter): Failed calls to Auth (timeouts, errors】. Non-zero values indicate connectivity issues.
* `business_store_validation_requests_total` and `...failed_total`: Similarly for Validation Service calls.
* `business_store_embedding_requests_total` and `...failed_total`: if using an external embedding/AI service for semantic search.
* `business_store_external_request_duration_seconds` (Histogram): Time spent waiting for external service responses (Auth, Validation, etc.) aggregated. Could also break out by service.

### Semantic Search Metrics

If semantic search is used:

* `business_store_search_query_total` (Counter): How many semantic search queries performed.
* `business_store_search_latency_seconds` (Histogram): Time to execute a semantic search query (embedding generation + DB search).

### Tenant-Specific and High-Level Metrics

* `business_store_active_tenants` (Gauge): Current number of active tenant schemas. This can be derived from metadata or from counting at runtime.
* `business_store_tenant_data_size_bytes` (Gauge, maybe per tenant or total): Approximate size of data stored (maybe from PG relations or periodically sampled).
* `business_store_errors_total` (Counter): Count of errors in the service overall (this could be incremented on exceptions caught globally, as a catch-all). Also categorize by type (validation error vs internal exception).
* `business_store_rate_limit_hits_total`: If any rate limiting is implemented within service (likely at gateway), might not be inside BSS itself but we can track how often we return 429 or similar.

## Logs

The Business Store Service employs structured loggin】 for easier analysis. The log format (in JSON) includes fields such as timestamp, level, service name, trace IDs, and message contex】.

### Log Levels and Usage

* **ERROR**: Unexpected errors that cause an operation to fail. E.g., “Database timeout while creating invoice” or unhandled exceptions. Each ERROR log should have context like tenantId and operation. These trigger alerts if they exceed a threshold.
* **WARN**: Situations that are abnormal but not immediate failures. E.g., “Validation service unreachable, using cached schema – possible stale data” or “High memory usage detected”. Warnings help spot issues to investigate but may auto-resolve.
* **INFO**: Key lifecycle events like service startup/shutdown, schema updates, major actions. E.g., “Tenant X schema v3 applied by user Y”, or “Service started, connected to DB host X”.
* **DEBUG**: Detailed information useful during development or troubleshooting. E.g., SQL statements executed (perhaps sanitized), payloads of requests for debugging. Typically turned off in production to avoid performance impact and log noise.
* **TRACE**: Very granular step-by-step logs, usually disabled entirely outside of a dev environment.

### Key Log Events to Monitor

We should configure alerts or at least pay attention to certain log event】:

* **Authentication failures**: Log lines like `auth.failure` at WARN or INFO level with details of e.g., token issuer mismatch or expired token. If a burst of these occurs, could indicate an attack or misconfiguration.
* **Permission denied**: If any attempt is made by a user to access another tenant’s data (should be prevented by design, but if it happens and is logged as a security check fail), that’s important.
* **Schema update events**: Each `schema.update` INFO log should show success or error. If error, likely accompanied by an ERROR log with cause (like validation error or migration issue).
* **Slow query warnings**: If a single query takes unusually long (we might instrument or the DB might log it), log at WARN: e.g., “Slow query: fetch invoices took 3s for tenant X”. Monitor these to consider adding indexes or optimizing.

### Log Correlation

The service uses a `traceId` and `spanId` in log】 (if distributed tracing is enabled). This allows correlating a request through multiple services. For example, a single end-user request triggers logs in Web App Service and Business Store Service; having a common traceId helps to follow the chain.

We integrate with the Observability service’s tracing system, so that each request to BSS might carry a trace header which we propagate to DB calls etc. Ensure logs include those IDs.

## Health Checks

Health check endpoints are provided for use by orchestration (like Kubernetes liveness/readiness probes) and monitoring system】:

* **Liveness (**`/health/liveness`): Returns simple success (200 OK with maybe `{"status":"alive"}`) if the process is running. This doesn’t check dependencies, only that the service loop is up. The app should respond even under heavy load unless truly hung; otherwise a separate thread can respond.
* **Readiness (**`/health/readiness`): Checks that the service is fully operational: e.g., it can connect to the database and essential dependencies. Implementation: attempt a lightweight DB query (or ensure the last DB heartbeat was recent), check that any required subservices (Auth, etc.) are reachable (maybe by checking a cached status or doing a quick call), then return 200 if all good, or 503 if something is wrong. For example, if DB is down, readiness returns 503 causing container orchestration to stop sending traffic.
* **Dependency (**`/health/dependency`): As per template, possibly a more detailed report of each dependency status:

  ```json
  {
    "database": "OK",
    "authService": "OK",
    "validationService": "degraded"  // e.g., slow to respond but alive
  }
  ```

  This could be same as readiness but with more info. Could be restricted (auth required or not exposed publicly).

### Automated Health Signals

The service also might have an in-memory self-monitor that marks unhealthy if certain conditions occur, e.g., if repeated failures to connect to DB happened in last X minutes. This can integrate with readiness as well.

## Alerting and Thresholds

The Observability service or a monitoring system (Prometheus + Alertmanager, etc.) would use the above metrics and logs to trigger alerts. Some suggested alerts:

* **High Error Rate**: If `business_store_errors_total` increases rapidly or if the proportion of error responses exceeds, say, 5% of requests for 5 minutes, alert DevOps. Possibly measured by a rate of 5xx responses in logs or metrics.
* **Auth/Validation Failures**: If `business_store_validation_request_failed_total` is >0 for a few minutes straight, maybe the Validation Service is down (or our integration broken). Alert so that team can check it or failover.
* **Slow Response**: If `business_store_request_duration_seconds` p95 goes above, say, 0.5s consistently (tune threshold), something might be wrong (db slowness or under-provisioned service).
* **DB Connection Saturation**: If `business_store_db_connection_pool_utilization` > 0.8 (80%) consistently, consider scaling up or increasing pool. Or if connection errors appear (could indicate running out).
* **High DB Error Count**: e.g., any sustained non-zero `business_store_db_query_errors_total` (like incrementing with constraint violations or deadlocks frequently) we should investigate.
* **Tenant Schema Changes**: It might be useful to have an alert if many schema changes happen in short time (maybe a malicious or buggy client repeatedly updating schema). Not a standard threshold, but something to watch manually or via log analysis.

## Dashboards

We would create dashboards showing:

* Throughput of requests (create/read/update/delete counts).
* Latency histograms for key operations.
* Active tenants and per-tenant activity (maybe top N active tenants by ops/sec to see if one tenant is driving load).
* Database stats: connections, slow queries. Possibly integrate with PG’s own metrics.
* External calls performance (Auth/Validation).
* System resources: CPU, memory of the service container (maybe from container metrics), and DB CPU/memory if on same or accessible.

## Related Documentation

* **Scaling** – for interpreting some metrics in terms of capacity (e.g., if CPU or DB load is high, scaling guidelines).
* **Configuration** – covers how to configure logging levels, metric endpoints, and any toggles for tracing/metrics (like enabling Prometheus, or how to connect to an APM if used).
* **Observability Service** – details the centralized logging and monitoring setup, to understand how BSS feeds into it. For example, if Observability uses an ELK stack, ensure JSON logs are formatted properly to be parsed.
* **Security** – certain security events (auth failures, etc.) might be mentioned there but also surfaced via monitoring (e.g., an alert on multiple auth failures could indicate a brute force attempt). The monitoring should catch those patterns too.


