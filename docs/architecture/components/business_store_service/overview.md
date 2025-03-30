# Business Store Service

## Overview

The **Business Store Service** (BSS) is a core component of the Augmented OS platform that manages multi-tenant business data in a flexible way. Each tenant can define a custom data model (e.g., for their invoices, customers, orders) which BSS enforces and stores using PostgreSQL schemas. By leveraging tenant-specific schemas, JSON Schema definitions, and advanced database features, BSS allows isolation and customization of data for each tenant while ensuring security and consistency.

* **Multi-Tenant Data Store**: Uses a **schema-per-tenant model** in PostgreSQL where each tenant’s data resides in its own schema (namespace).
* **Custom Data Models**: Tenants define their own tables and fields via JSON Schema metadata, enabling dynamic data models (no generic `entity_records` table; each table is fully defined per tenant).
* **Secure Data Isolation**: Employs **Row-Level Security (RLS)** and encryption to ensure tenants can only access their own data. Each table row includes a `tenant_id` column for additional enforcement and cross-schema aggregation where needed.
* **Semantic Search**: Integrates `pgvector` (PostgreSQL vector extension) to store vector embeddings of text content for **semantic search** across tenant data (e.g., enabling similarity queries on invoice descriptions).
* **Schema Metadata Management**: Maintains a metadata repository of tenant JSON Schemas and versions to track and migrate tenant data model changes over time.

## Key Responsibilities

* **Tenant Schema Management**: Create and update PostgreSQL schemas and tables according to tenant-provided JSON Schemas, ensuring each tenant’s data model is correctly implemented in the database.
* **Data Persistence & Retrieval**: Provide APIs to **create, read, update, delete (CRUD)** business records (like invoices, customers) in a tenant-isolated manner, including support for bulk import/export.
* **Security Enforcement**: Enforce RLS policies using `tenant_id` and manage encryption of sensitive fields (both at rest and in transit) using keys and roles from the Auth Service.
* **Semantic Querying**: Accept data queries that leverage vector embeddings (via pgvector) to perform semantic similarity searches on textual data within a tenant’s records.
* **Integration Support**: Work in concert with other services – e.g., validate new tenant schemas via the Validation Service, log actions to the Observability Service, and process periodic tasks (like summarizing records) triggered by the Task Execution Service.

## Architecture Diagram

```plaintext
┌─────────────────── Augmented OS Platform ───────────────────┐
│                                                             │
│  ┌──────────────┐      Auth Service      ┌──────────────┐   │
│  │              │◄──────────────────────►│              │   │
│  │  Web App UI  │   (Auth/Z Control)     │ Business      │   │
│  │  (Frontend)  │          ▲            │ Store Service │   │
│  │              │          │ Token /    │   (PostgreSQL │   │
│  └──────────────┘          │ TenantCtx  │    Multi-tenant)│   │
│         ▲                  │            │              │   │
│         │ REST API         │            │              │   │
│         ▼                  │            │              │   │
│  ┌──────────────┐   🔒 JWT │            │              │   │
│  │              │          │            │   Modules:   │   │
│  │  Web App     │          │            │   - Schema   │   │
│  │  Service     │          ▼            │     Manager  │   │
│  │  (Backend)   │◄───────────────► Data API ───────────│   │
│  │              │    (Auth & Data)      │   - Security │   │
│  └──────────────┘                        │   - Search  │   │
│         ▲         Observability          │   - Migrator│   │
│         │           (Logs/Stats)         │              │   │
│         │                                └──────────────┘   │
│         │           Task Exec / Validation / Testing         │
│         └─────────────────────────► Event Interface         │
└─────────────────────────────────────────────────────────────┘
```

*In the diagram:*

* **Web App UI** (frontend) interacts with **Web App Service** (backend) which calls the Business Store Service API.
* **Auth Service** issues JWTs and tenant context (Tenant ID, roles) used by BSS to enforce RLS.
* **Business Store Service** consists of modules for schema management, security, and semantic search on a multi-tenant PostgreSQL instance. It directly communicates with the Auth Service (for verifying tokens or retrieving encryption keys), and emits logs/metrics to Observability.
* **Task Execution/Validation/Testing Services** connect via internal event interfaces: e.g., a new schema definition event triggers Validation Service; periodic tasks trigger summarization jobs in BSS.

## Core Components

* **Schema Manager**: Manages tenant schemas in PostgreSQL. Applies JSON Schema definitions to create/alter tables (with required `tenant_id` columns and constraints) and stores schema metadata versions.
* **Security Module**: Implements Row-Level Security policies and encryption. It interacts with Auth (to get tenant roles, keys) and ensures all queries attach the correct `tenant_id` (via session variables or query filters).
* **Search Module**: Integrates **pgvector** for semantic search. Handles generation and indexing of vector embeddings from text fields (e.g., invoice descriptions) and provides query functions to perform similarity search on those embeddings.
* **Migrator**: Handles schema migrations for tenants. If a tenant updates their JSON Schema (adding a field or table), this module applies the necessary ALTER statements and keeps the metadata repository in sync.
* **Integration Handlers**: Coordinates with external services – e.g., calls the Validation Service to validate a proposed JSON Schema before applying it; notifies the Observability Service (or emits events) whenever a major change or error occurs.

## Service Interfaces

The service exposes the following primary interfaces:

* **Public REST API**: Endpoints for managing tenant data and schemas, for example:
  * `POST /api/business/{tenantId}/data/{resource}` to create a new record (e.g., an invoice)
  * `GET /api/business/{tenantId}/data/{resource}/{id}` to retrieve a record
  * `PUT /api/business/{tenantId}/schema` to submit or update the tenant’s data model schema (with validation)
  * \
    `GET /api/business/{tenantId}/search?query=...` to perform a semantic search over textual fields\*(These are fully documented in the API Reference.)\*
* **Internal Event Interface**: The Business Store Service listens for or publishes events on an internal message bus, including:
  * **Schema Change Events**: when a tenant’s schema is created or updated (for Validation and Testing services to react).
  * **Data Events**: e.g., a new invoice created event (for Task Execution Service to trigger follow-up actions like sending reminders).
* **Database Interface (PostgreSQL)**: Though internal, BSS may allow controlled direct read access for analytics services via a read-only user, confined to RLS policies.

## Related Documentation

* **Data Model** – Details of the tenant schemas, JSON Schema usage, and data entities
* **API Reference** – Endpoint specifications and examples for interacting with BSS
* **Security & Isolation** (implementation) – Deep dive into RLS, encryption, and auth integration
* **Monitoring** – How to observe BSS’s health and performance through metrics and logs
* **Auth Service Overview** (separate component) – For understanding how authentication and tenancy context are managed platform-wide


