# Semantic Search Integration

## Overview

The **Semantic Search Integration** module enables advanced search capabilities in the Business Store Service by leveraging vector embeddings for textual data. This module’s primary responsibilities are:

* Integrating **pgvector**, a PostgreSQL extension, to store and query vector representations of text for semantic similarity search.
* Generating embeddings for relevant textual fields (e.g., invoice descriptions, customer notes) using an embedding model or service (could be through an AI service or an on-board model).
* Providing query interfaces that allow tenants to perform semantic searches (find similar records based on text content, rather than exact keyword matches).
* Managing the lifecycle of these embeddings: generating on data insertion/update, storing in a `VECTOR` column, updating as needed if source text changes.
* Optimizing vector search with indexes and appropriate distance metrics.

## Key Responsibilities

* **Embedding Generation**: When a new record is created or a specific text field is updated, the module generates a fixed-size vector embedding. For example, if using OpenAI’s text embeddings or a local model, the description “Payment for invoice #123” might be turned into a 1536-dimension vector.
* **Storage**: Store embeddings in a dedicated column (often of type `VECTOR` provided by `pgvector`). Each table that supports search has an extra column (like `embedding VECTOR(1536)`) to hold this data.
* **Similarity Search API**: Expose API capabilities or query parameters to search by similarity. For instance, an endpoint `GET /api/business/{tenantId}/data/invoices?search=...` which accepts a natural language query and returns invoices with similar descriptions. The module would embed the query and use `embedding <-> query_embedding` distance ordering in SQL to find nearest matches.
* **Index Management**: Create and maintain vector indexes (IVFFlat, HNSW, or similar, as supported by pgvector) for each tenant’s relevant tables, to ensure that similarity queries are efficient even if there are many records.
* **Batch Operations**: Provide background tasks for batch-generating embeddings (e.g., after enabling the feature or retraining the model, to regenerate all embeddings) using the Task Execution Service.
* **Configuration**: Allow configuration of embedding model or service (so it can point to different AI providers or turn off semantic search if needed for a tenant or globally).

## Implementation Approach

Design principles for Semantic Search Integration:




1. **Modularity** – Keep embedding logic separate from main transaction logic to avoid delaying CRUD operations. Often, record creation will kick off an async embedding generation if the operation should remain low-latency, unless the use case can tolerate waiting for embedding.
2. **Consistency** – Ensure that if an embedding is not immediately available, the system can either (a) return results without that record or (b) indicate partial results. Typically, we accept that very recently added records might not appear in semantic search until embedding is done (which might be seconds later).
3. **Retrievability** – If using external API for embeddings, implement retries and error handling (e.g., if OpenAI API fails, mark record to try embedding later).
4. **Tenant Isolation** – Each tenant’s vectors are stored in their schema; there is no cross-tenant vector search by design (the search always happens within a tenant’s own schema on their data).
5. **Resource Management** – Embeddings can be large (e.g., 1536 floats). The module ensures not to embed everything blindly; maybe only certain fields or shorter text. It could also compress or quantize vectors if needed to save space.

## \[Primary Process\] Lifecycle – Embedding Generation & Query

```plaintext
New Record Inserted (with text)         Search Query Received (text)
              ▼                                      ▼
    [If sync] Generate Embedding                Generate Query Embedding
              ▼                                      ▼
    Store embedding in DB (VECTOR)       Execute SQL similarity search:
              ▼                           SELECT * FROM ... 
       Confirm Insert OK                 ORDER BY embedding <-> query_vec
              ▼                                      ▼
  [If async] Queue embedding job        Return results (sorted by similarity)
```

* **Insert Path**: Suppose an invoice is created with a `description`. If synchronous embedding is on, the API call will generate the embedding for that description and include it in the INSERT. If asynchronous, the invoice is inserted with a null or placeholder embedding, and a background task will fill it shortly.
* **Query Path**: When a search query is made (like searching invoices for “consulting services payment”), the module computes the embedding of the query string on the fly, then performs a database query on the tenant’s `invoices` table: `SELECT * FROM invoices ORDER BY embedding <-> query_embedding LIMIT 10;`. The `<->` operator (pgvector’s cosine or L2 distance depending on configuration) is used for similarity. The closest matches are returned.

### Design Choice: Embedding Service Integration

Likely, the Business Store Service will rely on an external service (could be an **AI Service** component or a third-party API like OpenAI) to get embeddings, rather than have the model baked in. Thus:

* It should be non-blocking. Use async calls to the embedding service. Possibly use the Task Execution Service to handle many requests or fallback if rate-limited.
* Cache common embeddings (maybe not needed, but if many records have identical text or we often search the same query, caching could help).
* The embedding model version should be trackable; if improved, you might regenerate all, perhaps store an embedding version in metadata so that new searches and old vectors remain comparable (or know if they’re not and need update).

## Implementation Details

### Key Aspect 1: Embedding Storage & Indexes

For each table with an embedding:

* **Vector Column**: e.g., `ALTER TABLE invoices ADD COLUMN embedding VECTOR(768);` if using a 768-dim model (or 1536, etc.).
* **Index**: `CREATE INDEX invoice_embedding_idx ON invoices USING ivfflat (embedding vector_cosine_ops) WITH (lists=100);` – meaning it partitions vector space into 100 clusters for approximate nearest neighbor. This speeds up searches significantly at a slight cost to accuracy (tunable). For smaller data sets, or if exact search is fine, one could use a brute-force scan or smaller index parameters.
* The index creation and maintenance are handled by this module (likely integrated with Tenant Schema Management when a schema is created or updated to include a vector field). If the JSON Schema indicates a field should have semantic search, the system knows to add this.

### Key Aspect 2: Embedding Generation Logic

Pseudo-code for synchronous embedding on create (in practice, might be asynchronous):

```javascript
async function createInvoice(tenantId, invoiceData) {
  // ... validate and prepare invoiceData ...
  const textToEmbed = invoiceData.description;
  let embedding = null;
  if (textToEmbed) {
    try {
      embedding = await embeddingService.generateEmbedding(textToEmbed);
    } catch (e) {
      console.error("Embedding failed", e);
      // Decide: either proceed without embedding or fail request.
      // Here, we proceed without, and mark for later update.
    }
  }
  // Insert into DB (embedding might be null if generation failed)
  db.query(`INSERT INTO tenant_${tenantId}.invoices (...) VALUES (..., $embedding)`, [/* fields */, embedding]);
  if (!embedding) {
    taskService.scheduleJob("generate_embedding", {tenantId, table: "invoices", recordId: newInvoiceId, text: textToEmbed});
  }
  return newInvoiceId;
}
```

For search:

```javascript
async function searchInvoices(tenantId, queryText) {
  const queryEmbedding = await embeddingService.generateEmbedding(queryText);
  const results = db.query(`
    SELECT invoice_id, customer_id, amount, description, status, 
           ${distanceMetric}(embedding, $1) as score
    FROM tenant_${tenantId}.invoices
    WHERE embedding IS NOT NULL
    ORDER BY embedding <-> $1
    LIMIT 10;
  `, [queryEmbedding]);
  return results;
}
```

We include `score` (distance) to perhaps allow filtering out if it’s too dissimilar.

### Edge Cases and Error Handling

* **Embedding Service Down**: If calls to generate embeddings fail (e.g., external AI API is down or returns error), the module should not crash main functionality. It logs the error, possibly notifies Observability, and for inserts, continues without embedding (as above). It will then rely on a background retry (maybe with exponential backoff) to fill in missing embeddings. For queries, if embedding can’t be obtained, it should return a meaningful error (or possibly fallback to a normal text search, though that’s not implemented typically here).
* **Inconsistent Embedding Dimensions**: If the model version changes and new vectors have different dimensions, queries can break. To avoid this, ensure model upgrades are coordinated: possibly keep old vectors and accept slightly lower quality until all are migrated. The code can check dimension and if mismatch, trigger a full reindex.
* **Large Text**: If a text field is extremely large (say, a huge contract text as an invoice attachment), the module might either truncate, summarize, or ignore beyond a size to control cost and performance.
* **Storage Impact**: Many vectors can use a lot of space. But because each tenant’s data volume might not be extremely high (assuming this is not internet scale per tenant, but moderate business data), it’s usually fine. If a tenant has say 100k records with embeddings, and each embedding is 1536 floats (\~6KB), that’s \~600MB of vector data for that tenant, which is acceptable in modern systems. For significantly higher, we could consider optional offloading to a vector DB, but that adds complexity. Currently, staying in Postgres is simpler and keeps transactions unified.

### Considerations for Vector Similarity

* The `<->` operator by default in pgvector uses Euclidean distance. We might prefer cosine similarity. The index creation can specify `vector_cosine_ops` as above to change that. Cosine is common for text embeddings.
* Provide an option in API: e.g., allow filtering by a certain field then similarity sort. Perhaps not needed now, but it’s something to think of: e.g., search invoices for a certain customer only. That can be done by adding a `WHERE customer_id = X AND embedding <-> query` but careful that with index we might need to incorporate that filter too (pgvector supports that with recheck).

## Performance Considerations

Vector search with an index can typically handle tens of thousands of vectors quickly (tens of milliseconds for approximate nearest neighbor). If a tenant has a million records, we’ll rely heavily on the index and likely tune `lists` and other parameters.

Batch generation of embeddings is expensive if done at once. That’s why we integrate with Task Execution Service (which likely can distribute or schedule tasks).

We also ensure not to overwhelm the embedding service: maybe allow at most N concurrent embedding calls, queue the rest.

### Benchmarks

| Operation | Average (with vector index) | P99 (with vector index) |
|----|----|----|
| Generate 1 embedding (external service) | \~100ms (depends on model) | 300ms (with network lag) |
| Insert with embedding (no index update) | \~5-10ms extra (embedding gen not counted) | 20ms (embedding small overhead) |
| Semantic search query (1000 records) | \~10ms | 15ms |
| Semantic search query (100k records, indexed) | \~50ms | 100ms |

(These assume the vector index is warmed up. Without index, linear search would be slower linearly with number of records.)

## Related Documentation

* **Data Model** – mentions `embedding` in tables and how JSON Schema might indicate usage of semantic search fields.
* **API Reference** – the endpoints for search and any query parameters for semantic operations will be documented there.
* **Task Execution Service** – relevant for understanding how offline or batch embedding tasks might be scheduled (e.g., a daily job to ensure all embeddings up to date, or a job triggered when adding semantic search to existing data).
* **Augmented OS AI/ML Integration (if any)** – There might be a component or guidelines on how to integrate AI services; this module would be a case of that.
* **Scaling** – considerations on resource usage by embedding generation (CPU if local or network if external) and DB sizing due to vector storage.


