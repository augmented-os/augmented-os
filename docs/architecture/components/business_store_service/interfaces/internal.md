# Business Store Service Internal Interfaces

## Overview

While the Business Store Service exposes a REST API for external use, it also interacts with other internal services within the Augmented OS ecosystem. These **internal interfaces** include event publishing, service-to-service API calls, and shared database or messaging patterns. Internal interfaces are not public APIs but are crucial for integration and orchestration of the system’s microservices.

Key internal interactions for Business Store Service include:

* **Events**: Publishing events (e.g., “record created” or “schema updated”) to a message broker for other services like Observability, Task Execution, or external webhooks to consume.
* **Service API Calls**: Outbound calls to other services’ APIs (e.g., calling Validation Service to verify a JSON Schema, contacting Auth Service for user/tenant info or encryption keys, and possibly calling Observability or Notification services).
* **Shared DB Access**: In rare cases, read access by analytics or testing frameworks might query the Business Store Service’s database directly (but typically via the Business Store API or read replicas with proper credentials). We focus on standard patterns.

## Event Interfaces

### Published Events

The Business Store Service publishes events to a messaging system (such as an internal event bus or message queue, e.g., using Kafka or an in-memory broker). These events can be in a structured format (JSON payload, possibly with CloudEvents schema or similar).

**Examples of events published:**

* **Schema Updated Event**: When a tenant’s schema is successfully created or updated, publish an event like:
  * Topic: `business_store.schema.updated`
  * Payload:

    ```json
    {
      "tenantId": "abc-123",
      "version": 3,
      "timestamp": "2025-03-01T12:00:00Z",
      "initiator": "user:john.doe"  // who triggered it
    }
    ```

  This event can be consumed by:
  * The Validation Service (which might double-check or log it, though validation already occurred prior to update).
  * The Testing Framework Service, which could auto-generate test data for new schema or adjust test cases.
  * The Observability/Analytics service, to track changes in data models across tenants.
* **Data Change Events**: For critical data changes, e.g., new record created:
  * Topic: `business_store.data.created` (with subtopics or keys for resource type maybe, like `business_store.data.invoices.created`).
  * Payload:

    ```json
    {
      "tenantId": "abc-123",
      "resource": "invoices",
      "recordId": "invoice-789",
      "data": { ... }  // possibly the new record details (or just key details)
    }
    ```

  These events are useful for:
  * **Task Execution Service**: e.g., upon an invoice creation, maybe schedule a reminder task if due date is approaching (if such business logic is implemented outside BSS).
  * **Observability**: Log these events or count them for metrics.
  * **Notification Service** (if exists): maybe to trigger an email or message to the end customer, if that were in scope (though likely that would be triggered by a function in the Task Execution or another service listening to these events).
* **Data Updated/Deleted Events**: Similarly, events for updates and deletions:
  * `business_store.data.updated` and `business_store.data.deleted` with relevant info.

All events include the `tenantId` for context, a timestamp, and some unique event ID or correlation ID.

**Event Schema Note**: The event payloads should remain fairly generic (maybe not including the entire record if privacy is a concern; possibly just keys, and other services retrieve details via API if needed). The exact structure can evolve, but an internal document (or an OpenAPI-like event schema doc) would define these.

### Consumed Events

The Business Store Service might also subscribe to certain events from other services:

* **Auth Service Events**: e.g., if a tenant is created or deleted in Auth Service, BSS should catch that to provision or deprovision the tenant’s schema:
  * Topic: `auth.tenant.created` – triggers BSS to call internal provisioning for a new schema (maybe starting with a default or waiting for a schema definition from the tenant).
  * Topic: `auth.tenant.deleted` – triggers BSS to archive or drop the tenant’s schema (maybe after some grace period or backup). If not auto-handled, at least alert an admin to handle it.
* **Validation Service**: Possibly doesn’t push events but responds to requests. However, if it did (like if some scheduled re-validation or an external schema change alert needed to propagate), BSS could subscribe.
* **Testing Framework Service**: If the testing service wants to signal BSS to load some test data or environment, it could send an event. However, likely it would use an API call to BSS directly to load test data.

## Service-to-Service API Calls

### Outbound Calls from BSS:

* **Validation Service API**: Prior to applying a schema (from an API call or maybe even from a config), BSS calls the Validation Service:
  * Endpoint (internal): e.g., `POST /api/validation/validateSchema` with the JSON Schema, expecting a response that indicates valid or lists errors.
  * If Validation Service is down or returns invalid, BSS will not proceed with schema update and will return error to client.
* **Auth Service API**: Various interactions:
  * To **resolve user/tenant** info if needed (though JWT likely contains enough, sometimes might need to fetch more data or verify something).
  * To fetch **encryption keys or secrets** if using Auth’s key management: e.g., `GET /api/auth/tenants/{tenantId}/keys/data-encryption-key` (just an example endpoint) to retrieve a key to use for encryption. This would be done at startup or first use and then cached.
  * Possibly to record audit info? Or to get a service token for cross-service auth. Typically, each service might use a service account JWT or mutual TLS for internal calls. BSS would have credentials to call Auth and Validation.
* **Observability/Logging Service API**: If there’s a centralized Logging service (or if using something like Elastic or a Logging Gateway), BSS might not call it directly but rather just emit logs to STDOUT or a collector. However, for metrics, it might push custom metrics if needed, though likely metrics are scraped (Prometheus).
  * For example, if there's an incidents or alerts service, BSS might call it if a serious issue arises (like cannot apply a schema after several retries, send an alert).
* **Task Execution Service API**: Could be two-way, but one pattern: BSS might schedule a job by calling Task Execution:
  * e.g., `POST /api/task/schedule` with a payload to execute an async task (like regenerate embeddings, or run a bulk operation on tenant data).
  * Alternatively, BSS just publishes an event and Task Execution service picks it up, which is event-driven rather than direct API.

### Inbound Calls to BSS from Other Services:

Other services usually use the same public API of BSS if they want data. For instance:

* **Testing Framework Service** might call BSS API to load or retrieve test data. It could also possibly use direct DB access if in a test environment, but that breaks encapsulation, so likely API.
* **Observability** might call an internal endpoint or DB to gather stats if not using metrics scraping. But given we have metrics endpoint (`/metrics` Prometheus) and health endpoints, Observability can poll those.
* **Auth Service** or others typically don’t need to call BSS except possibly during tenant deletion (Auth might call BSS to ensure data cleaned up), but that could also be event-driven as described.

## Shared Database Access Patterns

In principle, all access to tenant data should go through BSS to enforce business logic and security. However, there might be some scenarios:

* **Analytics Service**: If there’s a separate analytics or reporting service, it might have read-only credentials to query the underlying database for complex queries (since doing everything through API could be slow). If so, it will need to respect the schema-per-tenant structure. For example, it might query across schemas by doing something like iterating schemas or using Postgres cross-schema queries. This is advanced and requires careful permissioning: likely there would be a special DB user with SELECT only on all tenant schemas, used by analytics jobs. BSS’s role is to ensure that user exists and has correct grants whenever a new schema is made.
* **Backup/Restore**: A backup system might access the DB directly (dumping all schemas). That’s outside normal operations but worth noting.

Thus, internal interfaces include possibly direct DB use by trusted systems, but those are read-only and controlled. BSS’s documentation might note that any such access should be coordinated (like if a schema is changed, an analytics query might break if not using dynamic SQL, etc., so better to use the API or events to be notified of changes).

## Retry Policies and Fallbacks

For internal calls and events:

* **Event Publish Failures**: If the message broker is down or fails to accept a message, BSS might retry a few times. If it’s not critical (like just a notification), it might drop after logging error. For critical events (like something another service absolutely needs), BSS could buffer and retry later or on startup. But a simpler approach: assume event infra is reliable, and log if not.
* **Service Call Failures**:
  * Validation Service: if down, BSS can’t validate schemas => likely return error to client (“Validation service unavailable, please try later” with a 503). Possibly implement a local basic validation as a fallback for syntax at least.
  * Auth Service: if token introspection or key fetch fails, BSS should also fail safe (perhaps deny access if cannot verify). If key fetching fails for encryption, as noted, might queue for later.
  * Task Service: if scheduling a job fails, BSS may try again or perform the task synchronously as a fallback, depending on context.

**Timeouts**: BSS will have timeouts on outbound calls (e.g., if Auth or Validation doesn’t respond in 2 seconds, abort). Also, a circuit breaker could be in place if a service is continuously failing.

**Bulkhead**: Keep internal calls from blocking main threads. For instance, do them in async manner or background threads where possible (especially embedding generation or large tasks).

## Internal Configuration and Discovery

The service likely uses environment variables or a service registry to know where to call internal services. E.g., `AUTH_SERVICE_URL`, `VALIDATION_SERVICE_URL`, etc., which are documented in Configuration.

## Related Documentation

* **Operations - Configuration** – for details on how internal service endpoints or credentials are configured via environment variables or config files.
* **Auth Service Internal** – to know what events or calls Auth expects.
* **Validation Service** – its API or events to integrate.
* **Task Execution Service** – how jobs are defined or triggered. This internal doc references scheduling jobs for e.g., embedding generation, which is defined in implementation.
* **Observability/Monitoring** – how internal failures (like a failing internal call) are logged or metered (e.g., a metric for “validation_service_errors_total” would be incremented on failures, as defined in Monitoring docs under External Service Metric】).


