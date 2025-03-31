# Business Store Service API Reference

## Overview

This document describes the **public REST API** for the Business Store Service. The API enables tenants to manage their custom business data (e.g., customers, invoices, orders) and their data model schemas. It assumes that the caller is authenticated and authorized via the Auth Service (e.g., has a valid JWT or API key with an associated tenant and role).

All API endpoints are prefixed under a base path, for example: `/api/business`.

* **Base URL Path**: `/api/business/{tenantId}/...` – All endpoints require specifying the `tenantId` in the URL path to scope the request. This ensures multi-tenancy context is explicit and used for internal routing and security checks.
* **Media Types**: The API expects and returns JSON (`application/json`) for request and response bodies.
* **Authentication**: Use JWT Bearer tokens or API keys in the `Authorization` header. For example: `Authorization: Bearer <token>`. Each request must include a valid token that corresponds to the `{tenantId}` in the URL (or a system-level token for admin operations). If authentication fails or the token's tenant does not match, a `401` or `403` will be returned.
* **Errors**: Errors follow a standard format with a JSON body like `{"error": "message", "code": "ERROR_CODE"}`. The HTTP status codes indicate error type (400 for bad requests, 401/403 for auth issues, 404 for not found, 409 for conflicts like version mismatch, 500 for internal errors). See **Error Handling** below for details.

## Endpoints

Below is a list of key API endpoints grouped by functionality.

### Schema Management

#### Update or Define Tenant Schema

* **Endpoint**: `PUT /api/business/{tenantId}/schema`
* **Description**: Define a new data model or update the existing data model for the tenant. The request body should contain a JSON Schema that describes the tables and fields. This operation will trigger validation and, if valid, apply the changes to the tenant's database schema.
* **Authentication**: Requires an authenticated user with a role that permits schema changes (e.g., `admin` role for the tenant).
* **Request Body**: JSON object (the JSON Schema). For example:

  ```json
  {
    "entities": {
      "customers": {
        "properties": {
          "customer_id": { "type": "string", "format": "uuid" },
          "name": { "type": "string" },
          "email": { "type": "string", "format": "email" }
        },
        "primaryKey": "customer_id"
      },
      "invoices": {
        "properties": {
          "invoice_id": { "type": "string", "format": "uuid" },
          "customer_id": { "type": "string", "format": "uuid" },
          "amount": { "type": "number" },
          "issued_date": { "type": "string", "format": "date" },
          "status": { "type": "string", "enum": ["pending","paid","canceled"] }
        },
        "primaryKey": "invoice_id",
        "foreignKeys": [
          { "field": "customer_id", "references": { "entity": "customers", "field": "customer_id" } }
        ]
      }
    }
  }
  ```
* **Response**: `200 OK` with a result body:

  ```json
  {
    "message": "Schema updated successfully",
    "version": 3
  }
  ```

  indicating the new schema version.
* **Errors**: `400 Bad Request` if schema is invalid (with details from Validation Service, e.g., missing primary keys, JSON Schema syntax errors). `409 Conflict` if another schema update is in progress or version mismatch (include current version to let client retry properly).
* **Notes**: This call is **idempotent**. Repeating the same schema (no changes) returns success with no changes applied. Large changes might be applied asynchronously if needed; the response will still be 200 if accepted, but some data migrations might happen in background (with eventual consistency for new fields).

#### Get Current Schema

* **Endpoint**: `GET /api/business/{tenantId}/schema`
* **Description**: Retrieve the current JSON Schema definition (data model) for the tenant. Useful for clients to understand what fields and tables exist.
* **Response**: `200 OK` with JSON body containing the schema (same format as the PUT input, plus perhaps additional metadata like version). For example:

  ```json
  {
    "version": 3,
    "entities": {
      "customers": { ... },
      "invoices": { ... },
      "payments": { ... }
    }
  }
  ```
* **Errors**: `404 Not Found` if the tenant does not have a schema defined yet (though typically, on tenant creation, at least a minimal schema is present).

### Data Management (Generic CRUD)

For each entity/table defined in the tenant's schema, the service exposes CRUD endpoints dynamically. The placeholder `{resource}` below refers to the name of a data entity, for example `customers` or `invoices`. These names correspond to those defined in the JSON Schema.

#### Create Record

* **Endpoint**: `POST /api/business/{tenantId}/data/{resource}`
* **Description**: Create a new record in the specified resource (table) for the tenant. The request body should include a JSON object with fields appropriate for that resource.
* **Authentication**: Requires a valid token for the tenant; write permissions (often any authenticated user of the tenant, but possibly restricted by role if configured).
* **Request Body**: JSON object representing the new record. For example, for resource `customers`:

  ```json
  {
    "customer_id": "d290f1ee-6c54-4b01-90e6-d701748f0851",
    "name": "Acme Corporation",
    "email": "contact@acme.example",
    "address": "123 Market St"
  }
  ```

  If the primary key (`customer_id`) is omitted, the service can generate one (like a UUID) if configured to do so. Otherwise, the client must provide it.
* **Response**: `201 Created` with a JSON body of the created record (including any generated fields such as `createdAt` timestamps or IDs if they weren't provided). For example:

  ```json
  {
    "customer_id": "d290f1ee-6c54-4b01-90e6-d701748f0851",
    "name": "Acme Corporation",
    "email": "contact@acme.example",
    "address": "123 Market St",
    "createdAt": "2025-03-01T12:00:00Z",
    "updatedAt": "2025-03-01T12:00:00Z"
  }
  ```
* **Errors**: `400 Bad Request` if required fields are missing or types are wrong (with details), `409 Conflict` if a record with the same primary key already exists.

#### Retrieve Record

* **Endpoint**: `GET /api/business/{tenantId}/data/{resource}/{recordId}`
* **Description**: Retrieve a specific record by its primary key.
* **Response**: `200 OK` with JSON object of the record. If the record includes any fields that are lists or objects (JSONB columns), they will appear as nested JSON.
* **Errors**: `404 Not Found` if no record with that ID exists for this tenant/resource, `403 Forbidden` if the user doesn't have access to that record (shouldn't happen if token's tenant matches, but could if additional row-level permission logic existed).

#### Update Record

* **Endpoint**: `PUT /api/business/{tenantId}/data/{resource}/{recordId}`
* **Description**: Update an existing record. The request body can include either the full record or just the fields to update (this behaves as full replace or partial update depending on implementation; here we assume full replace for simplicity, or partial if fields missing are left unchanged – specify behavior clearly to clients).
* **Request Body**: JSON with fields to update. e.g.:

  ```json
  {
    "name": "Acme Corp International",
    "address": "500 Business Rd"
  }
  ```
* **Response**: `200 OK` with the updated record JSON.
* **Errors**: `400 Bad Request` if validation fails (e.g., wrong data type), `404 Not Found` if record doesn't exist, `409 Conflict` if there is a version conflict (e.g., if using an optimistic locking field like `version` which the BSS might include and require in update to prevent lost updates).
* **Note**: If optimistic concurrency is used, the client should send the last known `version` or `updatedAt` and the service will check it. If mismatch, returns a conflict.

#### Delete Record

* **Endpoint**: `DELETE /api/business/{tenantId}/data/{resource}/{recordId}`
* **Description**: Delete a record.
* **Response**: `204 No Content` on successful deletion (or `200 OK` with a message).
* **Errors**: `404 Not Found` if record not found. Possibly `409 Conflict` if the record cannot be deleted due to referential integrity (e.g., trying to delete a customer that still has invoice records referencing it – in that case the service may either refuse or cascade based on schema settings, typically refuse and give an error message).

#### List/Search Records

* **Endpoint**: `GET /api/business/{tenantId}/data/{resource}` (with query params for filtering/search)
* **Description**: List records, possibly with filtering or search query. Supports standard query parameters:
  * `filter[fieldName]=value` for exact matches (repeatable or multiple fields). E.g., `/data/customers?filter[name]=Acme`.
  * `q=text` – a free text search across some default fields (if implemented; might use ILIKE or full text search or rely on semantic search if enabled).
  * `limit`, `offset` or `page` – for pagination. If not provided, defaults to some limit (like 50).
  * `sort=fieldName(asc|desc)` – sorting results.
* **Response**: `200 OK` with JSON array of records (or an object like `{ "results": [ ... ], "nextOffset": 50 }` if paginated).
* **Example**: `GET /api/business/abc-123/data/invoices?filter[status]=pending&sort=issued_date(desc)&limit=20` – fetch up to 20 pending invoices sorted by newest issued date.
* **Errors**: `400` if query params are invalid (like unknown field), otherwise generally just returns empty list if nothing matches.

### Semantic Search

If semantic search is enabled for a resource (like `invoices.description`), the API may allow a specialized endpoint or parameter:

#### Semantic Search Endpoint

* **Endpoint**: `GET /api/business/{tenantId}/search` (or could be `/data/{resource}` with a special param)
* **Description**: Perform a semantic search across one or multiple resources. For simplicity, consider it across a specific resource:
  * \
    As a param, e.g., `/data/invoices?semantic=Find invoices for consulting services`This query string will be interpreted by BSS: it will generate an embedding for "Find invoices for consulting services" and return invoices sorted by semantic similarity of their descriptions to that query.
* **Response**: Same format as list, but likely includes a `score` for each result indicating similarity rank. E.g.,

  ```json
  {
    "results": [
      { "invoice_id": "123", "description": "Consulting services for Q1", "score": 0.95, ... },
      { "invoice_id": "456", "description": "Consulting project payment", "score": 0.93, ... }
    ]
  }
  ```
* **Errors**: `501 Not Implemented` if semantic search is not enabled/supported for that resource, or `400` if query missing. Possibly `503` if embedding service is unavailable (the service might decide to return an error if it cannot complete the search).

### Integration and Misc

The Business Store Service also interacts with other components (Auth, Observability, etc.), but those are mostly internal and not directly exposed via public API. However, some endpoints might indirectly relate:

#### Export Data (Integration with Testing/DevOps)

* **Endpoint**: `GET /api/business/{tenantId}/export`
* **Description**: Export all tenant data (all tables) as a JSON or SQL dump. Useful for backup, testing, or migrating.
* **Response**: `200 OK` with a JSON structure:

  ```json
  {
    "customers": [ { record1... }, { record2...} ],
    "invoices": [ { ... }, ... ],
    ...
  }
  ```

  or possibly a downloadable file link.
* **Notes**: This could be a heavy operation and might be implemented asynchronously (returning a job ID to poll or a link once ready).

#### Health Check (for Ops, usually not tenant-specific)

* **Endpoint**: `GET /api/business/health` (or `/health` without tenant)
* **Description**: Check if service is up (not requiring auth). Could have `/health/liveness` and `/health/readiness` as noted in Monitoring doc】.

## Error Handling and Responses

All error responses will include a JSON body with at least an `"error"` message and often a machine-readable `"code"`. For example:

* **401 Unauthorized**:

  ```json
  { "error": "Authentication failed: invalid or missing token", "code": "AUTHENTICATION_FAILED" }
  ```
* **403 Forbidden** (e.g., tenant mismatch or insufficient role):

  ```json
  { "error": "You do not have access to this resource", "code": "ACCESS_DENIED" }
  ```
* **400 Bad Request** (validation errors, etc.): Possibly include details, e.g.,

  ```json
  { "error": "Invalid request data", "code": "INVALID_DATA", "details": { "field": "amount", "message": "Must be a positive number" } }
  ```
* **500 Internal Server Error**: A generic error with an incident ID for logs:

  ```json
  { "error": "Internal server error", "code": "INTERNAL_ERROR", "incident": "ABC123" }
  ```

  (The incident ID can be a trace or log ID to help operators find the issue in logs.)

The API aims to follow RESTful conventions and meaningful HTTP codes. The **OpenAPI specification** (YAML file in this documentation) provides the formal definitions of requests and responses, including schemas for each resource type reflecting the dynamic nature based on tenant schema (which is tricky to represent statically, but it might have some generic structure or use `additionalProperties`).

## Rate Limiting and Quotas

If the platform enforces rate limits, the Business Store Service will propagate appropriate headers (e.g., `X-RateLimit-Remaining`) and return `429 Too Many Requests` if exceeded. The limits might be defined per tenant or per API key and are typically managed by an API gateway or the Auth Service.

## Related Documentation

* **[OpenAPI Spec](./business-store-service-api.yaml)** – See the `business-store-service-api.yaml` for the structured API definitions and schemas.
* **[Internal Interfaces](./internal.md)** – For understanding how this service communicates behind the scenes (not needed for API consumers, but useful for developers).
* **[Examples](../examples/basic_example.md)** – The Examples directory has end-to-end usage scenarios demonstrating how to call these endpoints in sequence for common workflows.
* **Auth Service API** – If needed, how to obtain tokens/keys to auth with this service (documented in Auth Service component).
* **[Monitoring](../operations/monitoring.md)** – The Observability of this API (what is logged and metered) is covered under the Monitoring documentation.
* **[Overview](../overview.md)** – High-level architectural overview of the Business Store Service.
* **[Data Model](../data_model.md)** – Details on the data structures that the API interacts with.
* **[Tenant Schema Management](../implementation/tenant_schema_management.md)** – How schemas are managed via the API.
* **[Security & Isolation](../implementation/security_and_isolation.md)** – Security considerations for API usage.


