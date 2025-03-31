# Security & Isolation

## Overview

The **Security & Isolation** module of the Business Store Service ensures that each tenant's data is protected and isolated. Its responsibilities include:

* Implementing **Row-Level Security (RLS)** on shared resources and verifying tenant context on every request to prevent data leakage across tenants.
* Managing data encryption for sensitive fields or records, using keys and tokens from the Auth Service for encryption/decryption.
* Enforcing **access control** by integrating with Auth Service (checking user roles, API keys, and tenant permissions) for all Business Store Service operations.
* Ensuring that the schema-per-tenant design is upheld at runtime, by setting the appropriate schema search path or using fully qualified table references in queries.
* Handling any cross-tenant administration needs (for system admins) in a safe manner, typically by requiring elevated privileges or bypass flags that are audited.

## Key Responsibilities

* **RLS Policy Management**: Create and maintain row-level security policies on any table that might contain multiple tenant data (mostly the metadata tables like `business_store_service.tenant_schemas`). For tenant-specific tables (in separate schemas), ensure that even if accessed directly, a policy or at least a schema-based separation is always activ】.
* **Authentication Enforcement**: Validate JWTs or API keys (provided in requests) by calling the Auth Service or verifying signatures. Extract `tenant_id` and roles from the token to use in policies and checks.
* **Authorization Checks**: Determine if a given user/role can perform an action on a resource. For instance, only allow a tenant's "admin" role to update the tenant's schema, or use a service role to perform cross-tenant queries (like analytics) with extreme caution.
* **Data Encryption**: If configured, use column-level encryption for certain sensitive data (like customer PII). The module might use Postgres's PGE encryption functions or perform encryption in the application before writing to DB. It retrieves encryption keys or key references from the Auth Service's Key Management interface, or a dedicated Key Management Service if available.
* **Audit Logging**: For security-sensitive actions (schema changes, data exports, etc.), produce detailed logs that can be sent to the Observability Service. Include who performed the action (user ID), what tenant was affected, and what data was accessed or changed.

## Implementation Approach

The Security & Isolation module follows these design principles:




1. **Zero Trust Multi-Tenancy** – Assume that any bug could cause cross-tenant data exposure; therefore enforce tenant separation at multiple layers (JWT claims, DB schema, RLS, query filters).
2. **Least Privilege** – The service runs with minimal DB privileges. Application roles in the database are configured such that even if a query is attempted without a tenant filter, RLS prevents access.
3. **Defense in Depth** – Use both application-level checks (verifying tenantId in API path vs token) and database-level RLS. Also, ensure any internal service-to-service communication carries a service identity that is checked.
4. **Configurable Encryption** – Not all data may need encryption. The module makes encryption configurable per field or table via the JSON Schema metadata (for example, a field marked as "encrypted": true would trigger encryption).
5. **Compatibility** – Ensure that encryption or RLS does not break functionality like semantic search. For example, if content is encrypted, we may not be able to vectorize it for search; thus, decide which fields are not encrypted to allow pgvector indexing, or use deterministic encryption for those used in search keys if needed (with caution).

## RLS and Tenant Isolation

For shared tables like `tenant_schemas` in the metadata schema, an RLS policy is defined such as:

```sql
CREATE POLICY tenant_isolation_policy
ON business_store_service.tenant_schemas
USING (tenant_id = current_setting('app.current_tenant')::UUID);
```

When a user's request is handled, the application sets `app.current_tenant` (a custom config GUC in Postgres) to the user's tenant ID from their token. Thus any `SELECT` or `UPDATE` on `tenant_schemas` will automatically be filtered to only rows with that tenant_i】. Similarly, for any direct cross-tenant tables (though typically, tenants have their own schemas and RLS is not needed within those, as each schema only contains one tenant's data by design).

Within each tenant schema, we typically don't need RLS on each table because the schema itself isolates the data. However, to be extra safe, we might still add:

```sql
ALTER TABLE tenant_x.customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY enforce_tenant_id
ON tenant_x.customers USING (tenant_id = current_setting('app.current_tenant')::UUID);
```

This ensures even if somehow a wrong schema is in the path, the tenant_id column in each row is checked against the current context.

The application side sets `app.current_tenant` at the start of each transaction, based on the authenticated request's tenant.

## Authentication Flow with Auth Service




1. **Incoming Request**: Contains an `Authorization: Bearer <token>` header or an API key.
2. **Token Validation**: The Business Store Service uses the Auth Service's public keys (or an internal JWT library if keys are known) to validate the JWT signature. If an API key is used, it makes an internal call to Auth Service's API to validate and get the associated tenant and user info.
3. **Tenant Context**: From the token, extract `tenant_id` and user roles. The tenant_id is then set in the DB session (as described above).
4. **Role Check**: Cross-check the user's role against the action. For example, if a user with a "viewer" role tries to modify schema or delete data, the service returns a 403 Forbidden. Roles might be defined per tenant and included in the token (e.g., `roles: ["admin"]` for that tenant).
5. **Proceed to Operation**: If all checks pass, the service executes the requested operation (which now will be automatically tenant-scoped due to the DB context and RLS).

All these steps happen for each request, making sure that unauthorized requests fail fast.

## Data Encryption

Suppose tenant schemas have a field that is marked for encryption, e.g., "creditCardNumber" in a `customers` table. The approach might be:

* Use a symmetric encryption key per tenant (fetched from Auth Service's key store when the tenant is created, or generated by BSS and stored securely).
* The field is stored in the DB as encrypted bytes (probably Base64 text for ease, or bytea). There might be a parallel field to store an encrypted form or using PostgreSQL's `pgcrypto` functions.
* When writing data: BSS intercepts the field and encrypts it before inserting into the DB. When reading data: BSS decrypts the field before returning to the client (provided the requester has rights, which typically they do if it's their tenant).
* If using `pgcrypto`, one could do queries like: `UPDATE tenant_x.customers SET card_encrypted = PGP_SYM_ENCRYPT(card_plaintext, :key)` and never store `card_plaintext` at rest. But for semantic search or partial matches on encrypted data, that's not feasible; so such fields likely won't support those operations (which is acceptable for things like credit card numbers or personal IDs).

Additionally, **encryption keys** are never stored in plaintext in BSS. BSS may keep them in memory (fetched from Auth or KMS on startup or on first use), or use a hardware security module (HSM) integration.

## Edge Cases and Error Handling

* **Missing Token or Invalid Token**: Request is immediately rejected with 401 Unauthorized.
* **Expired Token**: Similarly 401, with a hint to refresh credentials. The Auth Service integration might include checking a cache to avoid repeated decoding of the same token.
* **Tenant ID Mismatch**: If the request path has a tenantId that does not match the token's tenant (e.g., user tries to access someone else's tenant by altering URL), the service will detect the mismatch and return 403 Forbidden without even querying the DB. This prevents any chance of cross-tenant data retrieval.
* **Key Unavailable**: If encryption key for a tenant can't be retrieved (Auth Service down or KMS unreachable), BSS may refuse operations that require that key to avoid writing unencrypted data or failing silently. It would return 503 Service Unavailable or a specific error asking to retry later.
* **RLS Misconfiguration**: If for some reason the RLS policy was not applied or `app.current_tenant` is not set, BSS has an internal safeguard – it will include `tenant_id` in application-level query filters as well. For example, the repository layer always adds `WHERE tenant_id = :tenant` for any query on a metadata table. This double safety ensures a mis-set search_path or similar doesn't inadvertently expose data.

## Performance Considerations

Security checks add overhead (JWT validation, extra query clauses). Mitigations include:

* Caching JWT verification results for a short period (e.g., token's ID or signature in an in-memory cache), if a high volume of requests with the same token occurs (like a burst of requests from one session).
* Minimal overhead RLS: Ensure that the `tenant_id` index exists on metadata tables so that RLS check (tenant_id = constant) is an index seek which is extremely fast. Typically, these tables are small anyway.
* Encryption overhead: Limit encrypted fields and use efficient libraries (possibly native code via modules). Also, do not encrypt large text fields that need full-text search or vectorization; instead, rely on secure access and maybe hashing if needed.

### Benchmarks

| Operation | Average Overhead (No Security vs Security) | P99 Overhead |
|----|----|----|
| Basic data fetch (no RLS needed because in schema) | Negligible difference (schema isolation only) | Negligible |
| Metadata fetch (with RLS) | \~5% overhead (added policy check) | \~10% if large number of rows but with index likely \~5% |
| JWT decode + DB set tenant | \~1-2 ms per request (for JWT decoding) | \~5 ms |
| Encryption/Decryption (per field) | \~0.5 ms for small fields (AES) | \~1-2 ms for larger payloads or multiple fields |

These numbers are illustrative. The key point is that security is not free, but designed to be well within acceptable latency for typical use (tens of milliseconds at most).

## Related Documentation

* **Auth Service** – for details on how tokens, roles, and keys are managed, see the Auth Service documentation (especially around JWT and key management).
* **[Overview](../overview.md)** – high-level interactions and trust boundaries between BSS and other components (the overview touches on how Auth is used).
* **[Configuration](../operations/configuration.md)** – contains information on security-related configuration (like environment variables for Auth Service URL, public key rotation, encryption toggles).
* **[Monitoring](../operations/monitoring.md)** – identifies key metrics and logs for security (e.g., metrics for failed auth attempts, logs for access denials).
* **[API Reference](../interfaces/api.md)** – each endpoint in the API Reference will detail the auth requirements (which roles, what token needed).
* **[Data Model](../data_model.md)** – provides context on the data structure that security measures protect.
* **[Tenant Schema Management](./tenant_schema_management.md)** – explains how schemas are created with security in mind.
* **[Internal Interfaces](../interfaces/internal.md)** – details on how the Business Store Service interacts with other services securely.


