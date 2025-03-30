# Basic Business Store Service Example

This document provides a simple example of how to use the Business Store Service for common use cases. We will simulate a scenario where a tenant wants to manage customers and invoices. This basic walkthrough covers:

* Defining a simple schema for customers and invoices.
* Creating records (a customer and an invoice) via the API.
* Retrieving and verifying the created records.
* Observing the enforcement of multi-tenant isolation (though in this example, we use a single tenant).

For this example, assume we have a tenant with ID `tenant_abc123` and an API token for that tenant. All API calls shown use that token for authorization.

## Tenant Onboarding Example

First, the tenant needs to define their data model (schema) for their store. In this basic example, the tenant wants two tables: `customers` and `invoices`.


**1. Define Schema**We call the **Update Schema** endpoint to set up the initial data model for `tenant_abc123`.

Request:

```bash
curl -X PUT "https://api.example.com/api/business/tenant_abc123/schema" \
  -H "Authorization: Bearer <tenant_abc123_token>" \
  -H "Content-Type: application/json" \
  -d '{
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
          "status": { "type": "string" }
        },
        "primaryKey": "invoice_id",
        "foreignKeys": [
          { "field": "customer_id", "references": { "entity": "customers", "field": "customer_id" } }
        ]
      }
    }
  }'
```

This JSON defines two entities. The service will validate it (ensuring each table has a primary key, types are recognized, etc.) using the Validation Service. If valid, it will create the tables in the tenant’s schema.

Response (success):

```json
{
  "message": "Schema updated successfully",
  "version": 1
}
```

Now the tenant’s database schema is ready with empty `customers` and `invoices` tables.

## Creating and Retrieving Records

With the schema in place, let’s walk through a basic create and retrieve cycle.


**2. Create a Customer**The tenant wants to add a customer.

Request:

```bash
curl -X POST "https://api.example.com/api/business/tenant_abc123/data/customers" \
  -H "Authorization: Bearer <tenant_abc123_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": "c001",
    "name": "Alice Doe",
    "email": "alice@example.com"
  }'
```

Here we provide our own `customer_id` ("c001") for simplicity. (In a real scenario, you might use a UUID, e.g., `"customer_id": "9f1c...-uuid"`).

Response (created):

```json
{
  "customer_id": "c001",
  "name": "Alice Doe",
  "email": "alice@example.com",
  "createdAt": "2025-03-10T10:15:00Z",
  "updatedAt": "2025-03-10T10:15:00Z"
}
```

The service returns the record with timestamps. Now we have a customer record in the database.


**3. Create an Invoice**Now create an invoice for that customer.

Request:

```bash
curl -X POST "https://api.example.com/api/business/tenant_abc123/data/invoices" \
  -H "Authorization: Bearer <tenant_abc123_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "invoice_id": "inv-100",
    "customer_id": "c001",
    "amount": 250.00,
    "issued_date": "2025-03-10",
    "status": "pending"
  }'
```

Response:

```json
{
  "invoice_id": "inv-100",
  "customer_id": "c001",
  "amount": 250.0,
  "issued_date": "2025-03-10",
  "status": "pending",
  "createdAt": "2025-03-10T10:16:00Z",
  "updatedAt": "2025-03-10T10:16:00Z"
}
```

We see the invoice record returned. The foreign key relationship to customer is enforced by the service: if we had put a `customer_id` that doesn’t exist, the service would have returned an error (either a 400 validation error or 409 if caught as DB constraint violation).


**4. Retrieve the Customer**Now, fetch the customer to verify they were stored correctly.

Request:

```bash
curl -X GET "https://api.example.com/api/business/tenant_abc123/data/customers/c001" \
  -H "Authorization: Bearer <tenant_abc123_token>"
```

Response:

```json
{
  "customer_id": "c001",
  "name": "Alice Doe",
  "email": "alice@example.com",
  "createdAt": "2025-03-10T10:15:00Z",
  "updatedAt": "2025-03-10T10:15:00Z"
}
```

The data matches what we created.


**5. Retrieve the Invoice**Similarly, retrieve the invoice:

Request:

```bash
curl -X GET "https://api.example.com/api/business/tenant_abc123/data/invoices/inv-100" \
  -H "Authorization: Bearer <tenant_abc123_token>"
```

Response:

```json
{
  "invoice_id": "inv-100",
  "customer_id": "c001",
  "amount": 250.0,
  "issued_date": "2025-03-10",
  "status": "pending",
  "createdAt": "2025-03-10T10:16:00Z",
  "updatedAt": "2025-03-10T10:16:00Z"
}
```

We have verified that both records are correctly created and retrievable.

## Querying and Listing Example

Let's say the tenant wants to list all pending invoices.

Request (list with filter):

```bash
curl -X GET "https://api.example.com/api/business/tenant_abc123/data/invoices?filter[status]=pending" \
  -H "Authorization: Bearer <tenant_abc123_token>"
```

Response:

```json
[
  {
    "invoice_id": "inv-100",
    "customer_id": "c001",
    "amount": 250.0,
    "issued_date": "2025-03-10",
    "status": "pending",
    "createdAt": "2025-03-10T10:16:00Z",
    "updatedAt": "2025-03-10T10:16:00Z"
  }
]
```

Since we only have one invoice and it’s pending, it returns that one in an array. If no invoice matched, it would return an empty array `[]`.

## Isolation Verification (Single-Tenant Context)

Though this example uses one tenant, it’s worth noting how isolation works: if another tenant `tenant_xyz789` tried to access `tenant_abc123` data, it would be rejected.

For example, if an API call is made to `/api/business/tenant_abc123/data/customers/c001` with a token belonging to `tenant_xyz789`, the service will respond with a `403 Forbidden` (because the Auth Service tells BSS that the token’s tenant does not match the URL’s tenant). The data is safe.

In code or DB terms, `tenant_abc123`’s data is in schema `tenant_abc123`, and RLS ensures only that tenant’s context can query it. In our example, we implicitly used the correct token so everything succeeded.

## Error Scenario Example

To illustrate a common error, let’s try to create an invoice for a non-existent customer:

Request:

```bash
curl -X POST "https://api.example.com/api/business/tenant_abc123/data/invoices" \
  -H "Authorization: Bearer <tenant_abc123_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "invoice_id": "inv-101",
    "customer_id": "c999",  // this customer doesn't exist
    "amount": 100.0,
    "issued_date": "2025-03-11",
    "status": "pending"
  }'
```

Response (error):

```json
{
  "error": "Foreign key violation: customer_id c999 not found",
  "code": "FOREIGN_KEY_ERROR"
}
```

The service (or database) detected that `c999` is not a valid customer_id in that tenant’s `customers` table, and returns an appropriate error. The exact message might vary; it could also be a generic 400 with validation message if BSS checks existence first before DB insert.

## Next Steps

Once you've mastered these basic examples, you can:




1. Explore **Advanced Examples** for more complex scenarios, such as multi-step workflows or integration with other services (e.g., using the validation service in a pipeline】.
2. Review the **API Reference** for a complete list of endpoints and capabilities (like how to update schemas, handle pagination, etc.】.
3. Learn about **implementation details** if you need to customize behavior or understand how things work under the hood (for instance, how encryption or RLS is actually implemented, which is documented in the Security & Isolation and other implementation docs】.

## Related Documentation

* **Overview** – provides context on what the Business Store Service is and how it fits in the larger architectur】.
* **API Reference** – detailed contract of each API endpoint used here and others.
* **Advanced Examples** – demonstrating more complex tasks like running a semantic search query or integrating with the Task Execution Service for batch jobs.


