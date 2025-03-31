# Business Store Service Scaling

## Overview

Scaling the Business Store Service involves ensuring that it can handle increasing loads (more tenants, more data, more concurrent operations) efficiently. We consider both **vertical scaling** (adding more resources to the existing instance) and **horizontal scaling** (running multiple instances behind a load balancer). Given that this service heavily relies on a PostgreSQL database, database scaling and optimization are also critical.

Key factors affecting scaling for BSS:

* **Multi-Tenancy Overhead**: More tenants means more schemas and possibly more concurrent operations from different tenants. Need to ensure the database and service handle this isolation efficiently.
* **Throughput**: Number of CRUD operations and queries per second, especially if many tenants are active simultaneously.
* **Data Volume**: Large number of records per tenant or across tenants (table size affects query performance and memory).
* **Semantic Search Workload**: Embedding generation can be CPU/network heavy, and vector search can be memory/CPU heavy if not indexed or if dataset large.

## Resource Requirements

### CPU and Memory

* **CPU**: The service requires CPU for JSON processing, query planning, and any embedding computations. With many tenants, if each does small operations it's fine, but if one triggers heavy schema changes or large queries, CPU use spikes. Ensure adequate CPU such that a heavy query doesn't starve the request handling (we might offload expensive tasks to async jobs to mitigate this).
* **Memory**: Memory is used for caching schema metadata, holding DB connection pool, caching prepared statements, etc. Also storing vectors for search if doing any in-memory operations. Typically, BSS is not extremely memory heavy except for caching and possibly large JSON in memory during requests. But if we do local embedding generation (like using an in-memory model), that can use a lot of memory; currently likely we offload that to external services or keep models out-of-process.
* Running multiple instances horizontally means each needs enough memory for its cache. We might consider a distributed cache (not currently, but if memory is an issue with many instances, a central cache for schema metadata could help consistency and memory usage).

### Database (PostgreSQL)

* **Connections**: Each BSS instance holds a pool of DB connections. If we scale horizontally, ensure the DB can handle total connections. If not, use a pooler like PgBouncer. A rule of thumb: keep max connections to Postgres under a few hundred. If we have 10 instances with pool of 20 each, that's 200 connections – likely okay, but measure.
* **Query patterns**: Because each tenant's data is in separate schemas, Postgres can handle that fine. There might be slight overhead on planning if it doesn't reuse plans across schemas (though if structure identical, it might still do generic plans). We should monitor for any plan cache issues.
* **Table Count**: If each tenant has many tables, and we have many tenants, the total number of tables in the system can grow large (e.g., 100 tenants with 10 tables each = 1000 tables, which Postgres can handle, but thousands or more could start to affect system catalogs performance). We might need to tune Postgres (increase `max_locks_per_transaction` if doing wide schema changes, etc.). Also consider partitioning extremely large tables if needed.

## Scaling Strategies

### Horizontal Scaling (Stateless Service Instances)

The Business Store Service is largely stateless (except caching metadata), so we can run multiple instances behind a load balancer. All instances connect to the same database (or cluster). To scale read throughput, we could use read replicas:

* **Read-Write Split**: Configure the service to send read requests (GET operations, maybe search operations) to a read replica of Postgres and writes to the primary. But since schema-per-tenant might complicate replication lag issues, it's an advanced setup. Typically, if needed, each instance could have two connection pools (one for primary, one for replica). The risk is stale reads if not careful (maybe acceptable for some non-critical data fetching).
* **Task Offloading**: Offload heavy jobs (like recompute embeddings or mass updates) to background worker processes or the Task Execution Service, so the main API instances remain responsive. This is a scaling approach to keep latency low for user requests under heavy workload.

With horizontal scaling, ensure sticky behavior where needed: likely not needed as any instance can serve any tenant request, given they all consult the database. Just ensure consistent caching (e.g., if one instance updates schema metadata, others should become aware – perhaps they fetch from DB fresh or have an event to invalidate cache).

### Vertical Scaling

If the load is within a single tenant or not easily distributed, scaling up (more CPU, more memory on one instance) might help, until hitting single-instance limits. Vertical scaling mainly applies to the database: upgrading to a larger DB server (more CPU cores for parallel query, more RAM for caching, faster disks or use of SSD/NVMe for I/O) can drastically improve throughput.

**Database scaling considerations**:

* **Connections and CPU**: Postgres can use multiple cores for separate queries, and for a single query if using parallel query (enabled for large table scans if configured). More cores help if multiple tenants doing work concurrently.
* **Memory for Postgres**: Increase shared buffers to cache more data in memory, reducing disk I/O. Work_mem might be tuned to allow larger sorts or index creation in memory for heavy operations like schema changes or full-text search.
* **IO**: If heavy write workload, ensure disk can handle IOPS (or consider table partitioning if one table gets extremely large to improve vacuuming and index maintenance).

### Bottlenecks and Mitigation

Identify known potential bottlenecks and how to mitigate:

* **Schema Migrations**: Changing a schema (especially adding columns with default, altering types) can lock tables and slow things. If one tenant does this while others use the service, that tenant's operations might degrade or even, in worst case, block others if not isolated. Mitigation: run migrations in off-peak hours or ensure locks are only on that tenant's objects (which they are). Also possibly queue migrations so only one runs at a time globally to not overload DB.
* **Large Queries**: A tenant pulling a report of all their data (which could be millions of rows) might strain the system. Solutions: encourage pagination (the API supports limit/offset), and have timeouts. We can also set statement timeout in Postgres to, say, 30s to avoid runaway queries. If needed, spawn such queries as background jobs and stream results.
* **Semantic Search**: If many simultaneous semantic searches happen, each requiring embedding generation via external API, we might saturate network or the external API's rate limits. We might enforce a rate limit on semantic queries per tenant to prevent abuse and to ensure service remains available (this could be in configuration or just via observability and manual policy). Also possibly batch similar requests or cache embeddings of common queries.
* **Network**: Ensure the network between app and DB is low latency and high throughput (likely they're in same data center or VPC). If we scale to multiple data centers or regions, consider deploying separate instances per region with their own database, rather than a single global DB accessed with high latency.

## Horizontal vs Vertical Database Scaling (Advanced)

PostgreSQL can scale vertically well but horizontally (sharding) is manual. If we have extremely many tenants or extremely large data, consider:

* **Sharding by Tenant**: For example, place some tenants on one database instance and others on another (you could decide by tenant ID hash or by size). That introduces complexity in routing – the service would need to know which DB to connect to per tenant. This is a big change; likely only if approaching cloud-scale multi-tenancy (hundreds of thousands of tenants). In early-mid stage, a single decent Postgres instance or cluster suffices.
* Alternatively, **Citus (Postgres extension)** could distribute tables, but since each tenant's data is largely separate, a simpler approach is separate schema on same instance until performance dictates split.

## Caching and Throughput

The service could add an in-memory caching layer for reads if needed (e.g., frequently accessed records, or caching the results of a semantic search query if repeated often). This is usually a later optimization and must consider cache invalidation carefully (like invalidating on data update events). Could use Redis or local memory. Right now, focus on DB optimization.

## Testing for Scale

* Perform load testing with simulated tenants: e.g., 50 tenants each making concurrent requests for various operations, and increase. Monitor metrics to see where p95 latency degrades or errors occur.
* Test large schema scenarios: e.g., 1 tenant with 10 million records, ensure reads/writes still okay and memory usage stable. Possibly tune `work_mem` or advise using cursors/streaming for large result sets to not OOM.
* Test horizontal scaling by running multiple instances and ensure no contention (like both instances trying to run a migration simultaneously – our design should prevent that by some locking or version check, but test it).
* Failover scenarios: If the DB primary fails and a new one promotes (assuming HA setup), does BSS reconnect gracefully? That's more of a reliability thing but relevant for scaling in terms of availability.

## Load Testing Metrics

We aim for certain baseline performance:

* Each instance of BSS can handle, say, 100 requests per second (rps) with median latency \~50ms, 95th percentile < 200ms, under normal DB loads.
* If we need 1000 rps, we scale to \~10 instances or ensure the DB can do it (1000 lightweight queries per second is heavy but possible with good hardware).
* The DB should handle the transaction rate (maybe using  read scaling if heavy on reads).

## Caching Strategies (if necessary)

* **Schema Metadata**: Already cached in memory likely (so each request doesn't fetch JSON Schema from DB every time). This cache is small but vital. Just ensure we invalidate it after a schema update by that tenant.
* **Prepared Statements**: Use them to save parsing time. Our DB driver likely does this.
* **Data Caching**: Could add an LRU cache for very frequent reads (like if the web app always fetches the same settings record). But given data can change by writes, careful to avoid stale data. Possibly fine for semi-static reference data.

## Regional Deployment Considerations

If tenants are globally distributed, might deploy BSS in multiple regions each with their own DB to keep latency low. But then a tenant is tied to a region's DB. That's a broader architecture decision; BSS documentation should note the possibility:

* e.g., "The Business Store Service can be deployed in a multi-region setup where each region hosts its own instance and database. Tenant allocation to regions should be done carefully, as data does not automatically sync across region-specific databases."

## Scaling the Semantic Search (pgvector)

* Ensure appropriate **indexing strategy**: `IVFFlat` index is good for many vectors but requires tuning (the `lists` parameter; more lists = faster query but slower insert and more memory). For a moderate dataset (tens of thousands vectors), lists=100 is fine; if millions, maybe lists=1000.
* The vector index uses some memory for caching centroid info. Monitor `maintenance_work_mem` and `shared_buffers` as needed if index building happens.
* If some tenants heavily use vector search, and others don't, still all share same DB resources. Possibly limit one heavy tenant's impact by controlling how many search queries they can run concurrently (maybe via a semaphore in app or simply by effect of overall throughput limiting).

## Related Documentation

* **[Monitoring](./monitoring.md)** – to see how scaling decisions reflect in metrics (e.g., if CPU is high, you'll see request latency rising, etc.) and how to catch that we need scaling.
* **[Configuration](./configuration.md)** – outlines the configuration flags relevant to scaling (like environment variables for connection pool size, whether to use read replicas, limits for thread pools, etc.).
* **Deployment Guide** (outside this doc maybe) – would cover how to actually scale up (increase replica count, etc.).
* **[Data Model](../data_model.md)** – extremely large data might prompt specific steps like adding partitioning (which would be documented in Data Model if we implement it for huge tables).
* **Performance Benchmarks** – if any doc or section lists tested performance at certain scales.
* **[Semantic Search Integration](../implementation/semantic_search_integration.md)** – Details on scaling considerations for vector search operations.
* **[Overview](../overview.md)** – High-level architectural overview of the Business Store Service.
* **[Security & Isolation](../implementation/security_and_isolation.md)** – Security aspects related to scaling.


