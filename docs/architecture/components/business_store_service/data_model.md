# Business Store Service Data Model

## Overview

The **Business Store Service** primarily interacts with the following data schemas and structures (each tenant gets its own schema in the database):

* **Tenant Schema (PostgreSQL)**: Each tenant has a dedicated database schema (namespace) named, for example, `tenant_<tenantId>`. Within each such schema, tables for business entities (like `invoices`, `customers`, etc.) are created as defined by the tenant’s JSON Schema.
* **JSON Schema Definitions**: Tenants supply JSON Schema files describing their data model (what tables and fields they need). These schemas are stored in a **metadata repository** within BSS and are versioned to track changes over time.
* **Metadata Repository**: A centralized schema (separate from tenant schemas, e.g., `bss_metadata`) that holds tables like `tenant_schemas` (tenant_id, schema_json, version, applied_at) and `schema_migrations` (migration details). This repository allows BSS to manage migrations and maintain a history of each tenant's schema evolution.

This document focuses on how the Business Store Service component specifically implements and extends these canonical concepts. For standard Augmented OS schema definitions of common entities (if any exist), refer to that documentation. Here, we emphasize how BSS uses those patterns and introduces its own.

## Business Store Service Implementation Details

The Business Store Service extends the canonical schema patterns with additional structures and optimizations to support multi-tenancy and dynamic schemas:

### Tenant Schema Structure

For each tenant (identified by `tenant_id`), BSS creates a set of tables as defined by that tenant’s JSON Schema. For example, consider a generic scenario where each tenant wants to manage invoices and customers:

* **Customers Table** (`tenant_<tenantId>.customers`): Stores customer information. Every row implicitly belongs to the tenant via being in the tenant’s schema. Additionally, each table in a tenant schema also includes a `tenant_id UUID` column for RLS and cross-tenant queries if needed (populated with the owning tenant’s ID).
* **Invoices Table** (`tenant_<tenantId>.invoices`): Stores invoice records. Contains standard fields as defined by the tenant’s schema (like `invoice_number`, `customer_id`, `amount`, etc.) and also has `tenant_id UUID` and metadata fields for auditing.

**Example:** If tenant `abc-123` defines a simple model with customers and invoices, BSS will ensure the existence of schema `tenant_abc_123` with tables such as:

```sql
-- In schema tenant_abc_123:
CREATE TABLE customers (
  tenant_id UUID NOT NULL,
  customer_id UUID PRIMARY KEY,
  name TEXT,
  email TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  ... -- other custom fields
);
CREATE TABLE invoices (
  tenant_id UUID NOT NULL,
  invoice_id UUID PRIMARY KEY,
  customer_id UUID REFERENCES customers(customer_id),
  amount DECIMAL,
  issued_date DATE,
  status TEXT,
  embedding VECTOR,  -- for semantic search on invoice content (pgvector)
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  ... -- other custom fields
);
```

Here, both tables include `tenant_id` and an `embedding` field on `invoices` for semantic search (storing vector embeddings of text like invoice description).

### JSON Schema Metadata

Each tenant’s JSON Schema is used to generate SQL for tables and columns. BSS supports **data types mapping** from JSON Schema to PostgreSQL types (e.g., string -> TEXT, number -> DECIMAL, object -> JSONB if nested dynamic content is allowed). All tables must be fully defined; **BSS avoids using generic entity-attribute-value tables**, instead opting for concrete columns as specified.

BSS stores each JSON Schema and tracks a **schema version**. When a new schema is applied, a migration may occur:

* New fields -> `ALTER TABLE ... ADD COLUMN` (with optional default values if specified).
* Removed fields -> optionally keep the column but mark it deprecated (actual removal may be deferred to avoid data loss, unless explicitly dropped after migration).
* Modified field types -> possible if the type is compatible; otherwise, BSS may create a new column and migrate data.

Example snippet of a JSON Schema for a tenant’s `invoice` table, stored in metadata:

```json
{
  "title": "Invoice",
  "type": "object",
  "properties": {
    "invoice_id": { "type": "string", "format": "uuid" },
    "customer_id": { "type": "string", "format": "uuid" },
    "amount": { "type": "number" },
    "issued_date": { "type": "string", "format": "date" },
    "status": { "type": "string", "enum": ["pending", "paid", "canceled"] },
    "description": { "type": "string" }
  },
  "required": ["invoice_id", "customer_id", "amount"]
}
```

BSS will ensure `invoice_id` and `customer_id` are UUIDs in PostgreSQL, `issued_date` is a `DATE`, etc. The `description` field can be used with pgvector: the Search Module will generate a vector for it and store in the `embedding` column.

### Data Access Patterns

All queries and data modifications include the tenant context. Internally, connections are set with `SET search_path TO tenant_<tenantId>, public;` or equivalent to isolate to the tenant schema. Additionally, **RLS policies** on shared metadata tables use the `tenant_id` field to ensure a tenant’s session only sees their entries.

The Business Store Service maintains the invariant that *each row knows its tenant*: even though the schema itself separates data, the extra `tenant_id` column is used for RLS and as a safeguard for any cross-schema operations (which are rare but possible for admin queries).

### Primary Data Entities Example (Invoice Management)

The Business Store Service maintains detailed information for each **Invoice** record per tenant:

```typescript
interface Invoice {
  tenantId: string;            // UUID for the tenant (set via context, not user-specified)
  invoiceId: string;           // UUID for the invoice
  customerId: string;          // UUID for the associated customer
  amount: number;              // Invoice amount
  status: InvoiceStatus;       // Current status of the invoice
  issuedDate: string;          // Date the invoice was issued (ISO date string)
  description?: string;        // Optional description of the invoice
  createdAt: string;           // ISO timestamp of creation
  updatedAt: string;           // ISO timestamp of last update
  // Additional fields as defined by tenant schema, e.g., tax, currency, etc.
}
type InvoiceStatus = 'pending' | 'paid' | 'canceled' | 'overdue';
```

And for **Customer** records:

```typescript
interface Customer {
  tenantId: string;            // UUID of owning tenant
  customerId: string;          // UUID for the customer
  name: string;                // Customer name
  email: string;               // Customer email
  address?: string;            // Optional address
  createdAt: string;
  updatedAt: string;
  // Additional custom fields per tenant schema (e.g., loyaltyLevel, industry)
}
```

These TypeScript-like interfaces represent how data is structured when retrieved via the API or stored in JSON form. They correspond directly to columns in the PostgreSQL tables.

### Secondary Data Entity Example (Payment Records)

Tenants might also define related entities, e.g., payments for invoices:

```typescript
interface Payment {
  tenantId: string;
  paymentId: string;
  invoiceId: string;           // Associated invoice
  amount: number;
  paymentDate: string;         // ISO date string for payment
  method: string;              // e.g., 'credit_card', 'wire_transfer'
  status: PaymentStatus;
  createdAt: string;
  updatedAt: string;
}
type PaymentStatus = 'processing' | 'completed' | 'failed' | 'refunded';
```

If such an entity is included in a tenant’s schema, BSS will create a `payments` table within that tenant’s schema, including foreign keys (e.g., `invoice_id` references `invoices.invoice_id`). All such tables include `tenant_id` for double-layered security (schema-level and row-level).

## Database Optimization

The Business Store Service implements the following database optimizations:



1. **Connection Pooling per Tenant** – Maintains a pool of database connections and reuses connections for the same tenant schema to leverage PostgreSQL’s per-connection search_path setting and reduce overhea】.
2. **Prepared Statements & Query Plans** – Uses prepared statements for common queries (especially for CRUD on frequently accessed tables) to benefit from cached query plans, even with tenant schema switching.
3. **Index Management** – Automatically creates indexes on critical columns like `invoice_id`, `customer_id`, foreign keys, and vector embeddings (using `ivfflat` or similar index for pgvector) to optimize lookup and similarity search.
4. **Table Partitioning for Large Tenants** – Optionally partitions data by time or category if a single tenant’s table becomes very large (e.g., partition an invoices table by year) to improve query performance and maintenance.
5. **Caching Layer Integration** – Although the service is database-centric, it can integrate with a caching service (like Redis) for caching expensive aggregate queries or cross-tenant reports, to avoid frequent heavy DB loads.

## Related Schema Documentation

* **PostgreSQL Multi-Tenancy Patterns** – General guidelines on schema-per-tenant and row-level security (for deeper understanding of the approach).
* **JSON Schema Usage** – Augmented OS documentation on how JSON Schemas define data models across services.
* **pgvector** – Documentation of the `pgvector` extension usage for storing and querying embedding vectors in Postgres.


