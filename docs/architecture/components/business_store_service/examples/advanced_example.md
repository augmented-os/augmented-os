# Advanced Business Store Service Examples

This document provides advanced examples of how to use the Business Store Service for complex scenarios. These examples build on the basic usage patterns covered in the **Basic Example** document and demonstrate:

* Performing multi-step operations involving several services (e.g., validating a schema, then applying it, and then populating data).
* Using semantic search to query data by meaning rather than exact matches.
* Handling errors and retries in a more sophisticated way in a production-like scenario.
* Integrating the Business Store Service with an external service (like the Validation or Observability service).

Let's consider a complex use case: a tenant wants to update their data model and then bulk import some data, and later perform a semantic search on that data.

## Complex Schema Update and Data Import Example

**Scenario:** Tenant `tenant_abc123` wants to add a new entity "Payment" to track invoice payments, and then import a set of payment records. We’ll demonstrate the schema update with validation, then usage of a Task Execution service to handle bulk import, and how the system might coordinate this.

### 1. Schema Update with Validation

The new entity to add:

```json
"payments": {
  "properties": {
    "payment_id": { "type": "string", "format": "uuid" },
    "invoice_id": { "type": "string", "format": "uuid" },
    "amount": { "type": "number" },
    "payment_date": { "type": "string", "format": "date" },
    "method": { "type": "string" }
  },
  "primaryKey": "payment_id",
  "foreignKeys": [
    { "field": "invoice_id", "references": { "entity": "invoices", "field": "invoice_id" } }
  ]
}
```


**Step 1: Validate Schema** (via Validation Service integration)Normally, when you `PUT /schema` in BSS, it calls Validation Service internally. But for illustration, imagine we want to explicitly validate first (maybe using the Validation Service API directly, if we had access):

Request to Validation Service (conceptual):

```bash
curl -X POST "https://validation-service/validate" \
  -H "Content-Type: application/json" \
  -d '{ ... schema including payments ... }'
```

Response:

```json
{ "valid": true }
```

(If invalid, it would return errors and we would fix the schema JSON accordingly).


**Step 2: Apply Schema Update**Now call BSS to update schema (similar to basic example but adding the payments entity):

```bash
curl -X PUT "https://api.example.com/api/business/tenant_abc123/schema" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "entities": {
      "customers": { ...existing... },
      "invoices": { ...existing... },
      "payments": {
        "properties": { ... as above ... },
        "primaryKey": "payment_id",
        "foreignKeys": [ ... ]
      }
    },
    "version": 2  // optional: to indicate we're updating from version 1 to 2
  }'
```

Response:

```json
{
  "message": "Schema updated successfully",
  "version": 2
}
```

Now the `payments` table is created in the database (with the foreign key linking to invoices). The service did this in one transaction including the DDL.

### 2. Bulk Import Data via Task Service

Suppose the tenant has historical payment data to import. Instead of calling the API for each record (which could be slow if there are thousands), they use a bulk import mechanism. The Business Store Service itself might not accept a giant bulk payload by default (to avoid timeouts), so an integration with the Task Execution Service can be used:


**Step 3: Initiate Bulk Import**We call a special endpoint to start a bulk import job (assuming such exists, possibly something like):

```bash
curl -X POST "https://api.example.com/api/business/tenant_abc123/data/payments/import" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "records": [
      { "payment_id": "p1001", "invoice_id": "inv-100", "amount": 250.0, "payment_date": "2025-03-15", "method": "credit_card" },
      { "payment_id": "p1002", "invoice_id": "inv-101", "amount": 100.0, "payment_date": "2025-03-16", "method": "paypal" },
      ...
    ]
  }'
```

Instead of directly inserting all, the BSS might respond quickly with a job acknowledgment:

Response:

```json
{
  "jobId": "import-xyz-123",
  "status": "scheduled"
}
```

Under the hood, BSS published an event or called Task Service to handle this. The Task Execution Service picks up the job `import-xyz-123` and starts inserting these records in the background, one by one or in batches, handling any errors and logging progress to Observability.


**Step 4: Monitor Import Job**The tenant (or admin) can check job status:

```bash
curl -X GET "https://api.example.com/api/business/tenant_abc123/data/payments/import/import-xyz-123/status" \
  -H "Authorization: Bearer <token>"
```

Response (midway):

```json
{ "jobId": "import-xyz-123", "status": "in_progress", "processed": 500, "total": 1000 }
```

Later, when done:

```json
{ "jobId": "import-xyz-123", "status": "completed", "processed": 1000, "total": 1000 }
```

Now 1000 payment records are imported.

### 3. Semantic Search on Descriptions

Now that data is in place (invoices, payments, etc.), let's show a semantic search query on invoice descriptions. Suppose invoice descriptions contain text like project names, and the tenant wants to find invoices related to "consulting".

**Step 5: Semantic Search Query**

Request (semantic search):

```bash
curl -X GET "https://api.example.com/api/business/tenant_abc123/data/invoices?semantic=consulting project invoice" \
  -H "Authorization: Bearer <token>"
```

What happens here:

* The Business Store Service receives the query with `semantic` parameter.
* It generates an embedding for the phrase "consulting project invoice" via the embedding service. For example, the service sends that phrase to an AI service and gets back a vector. (This is internal, not shown to client).
* Then BSS queries the database: `SELECT * FROM invoices ORDER BY embedding <-> :query_vec LIMIT 5;` (assuming an `embedding` vector column exists for descriptions, which it would if semantic search is configured).
* It fetches the top 5 nearest neighbors (most similar invoice descriptions).

Response (semantic search results):

```json
{
  "results": [
    {
      "invoice_id": "inv-205",
      "customer_id": "c050",
      "amount": 1500.0,
      "issued_date": "2025-02-01",
      "status": "paid",
      "description": "Consulting project for ACME Corp",
      "score": 0.97
    },
    {
      "invoice_id": "inv-183",
      "customer_id": "c032",
      "amount": 700.0,
      "issued_date": "2025-01-15",
      "status": "paid",
      "description": "Invoice for consulting services - Beta Ltd",
      "score": 0.94
    }
  ]
}
```

Two results found with high similarity scores \~0.94+. The results include a `score` field (not part of the original data model, but added in response to indicate relevance ranking). Lower score items (less similar) were omitted due to the limit.

This shows how semantic search can retrieve relevant records without an exact keyword match (maybe the word "consulting" or context matched those descriptions strongly).

### 4. Integration Pattern Example

In some cases, BSS needs to integrate with another external service as part of an operation. For instance, imagine an external **Notification Service** that sends an email to customers when an invoice is paid. When an invoice status changes to "paid" in BSS, we want to notify that service.

**Integration Steps**:

* **Step 6: Invoice Update** – Tenant updates an invoice’s status to "paid".
* **Step 7: BSS triggers integration** – BSS publishes an event `business_store.data.updated` which the Notification Service subscribes to, or BSS could directly call a Notification API.

Here’s how step 6 might look via API:

```bash
curl -X PUT "https://api.example.com/api/business/tenant_abc123/data/invoices/inv-100" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{ "status": "paid" }'
```

Response:

```json
{
  "invoice_id": "inv-100",
  "customer_id": "c001",
  "amount": 250.0,
  "issued_date": "2025-03-10",
  "status": "paid",
  "createdAt": "2025-03-10T10:16:00Z",
  "updatedAt": "2025-03-20T09:00:00Z"
}
```

Internally, after updating the database, BSS might do:

* Publish event (simplified example payload):

  ```json
  { "tenantId": "tenant_abc123", "resource": "invoices", "recordId": "inv-100", "changes": { "status": "paid" } }
  ```
* The Notification Service, upon seeing an invoice status change to "paid", calls the Web App or directly emails the customer (outside BSS scope).

This integration ensures that different microservices remain loosely coupled via events or minimal direct calls.

## Advanced Error Handling

In production, it's important to handle errors gracefully:

For example, if the embedding service was down in Step 5 above, the semantic search might fail. The BSS could respond with:

```json
{ "error": "Semantic search temporarily unavailable", "code": "SEMANTIC_SEARCH_ERROR" }
```

And log the error. The client could handle this by maybe falling back to a keyword search (or just informing the user to retry later).

Another case: If our bulk import job in Step 3 encounters an error on one record (say record 501 had invalid data), how does Task Service/BSS handle it? Likely:

* It logs the error for that record, skips or stops depending on config.
* The `status` might end as "completed_with_errors" and details of failed records might be retrievable:

  ```json
  { "jobId": "import-xyz-123", "status": "completed", "processed": 1000, "failed": 1,
    "errors": [ { "record": { ...data... }, "error": "Foreign key invoice_id inv-999 not found" } ]
  }
  ```
* The tenant could then correct the erroneous record (maybe the invoice_id was wrong) and re-import just that one or fix the source data.

## Best Practices Highlighted

This advanced example highlights some best practices when using the BSS:




1. **Validate before applying changes** – ensure schemas are correct to avoid partial failures.
2. **Use asynchronous processing for heavy tasks** – bulk import was done via a background job to not time out the request.
3. **Leverage events for integration** – rather than synchronous calls which can slow down the main flow, events keep the system responsive and decoupled.
4. **Implement retry logic** – if an external service call fails (like embedding or notification), the service should handle retrying or at least not crash. In a coding scenario, one might wrap the call in a try-catch and use exponential backoff to retry (some pseudocode shown in templat】 for how to handle specific error codes).

## Related Documentation

* **API Reference** – for full details on any endpoints used here (the bulk import endpoint, if implemented, would be documented there, as would query params like `semantic`).
* **Implementation (Internal Interfaces)** – describes the event publishing and integration in more detail, which we saw in the integration example (invoice paid event】.
* **Performance & Scaling** – If attempting bulk operations or heavy semantic searches, see Scaling doc for how to tune the service (e.g., increase timeouts or use more instances).
* **Security** – Even in these advanced flows, security (tenant isolation, auth) is enforced. The Security doc covers how even internal tasks or events carry tenant context so that other services know which tenant’s data changed.


