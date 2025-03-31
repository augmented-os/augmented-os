# Business Store Service Documentation

## Structure Overview

This documentation covers the **Business Store Service**, which is responsible for managing multi-tenant business data (such as invoices, customers, and transactions) using a schema-per-tenant model in PostgreSQL. The documentation is organized as follows:

### High-Level Documentation

* **[Overview](./overview.md)** – High-level architectural overview of the Business Store Service (its role and architecture)
* **[Data Model](./data_model.md)** – Core data structures, schemas, and database considerations

### Detailed Implementation

The `implementation/` directory contains detailed documentation on specific aspects of the Business Store Service:

* **[Tenant Schema Management](./implementation/tenant_schema_management.md)** – How tenant-specific schemas are created, managed, and validated
* **[Security & Isolation](./implementation/security_and_isolation.md)** – Implementation of Row-Level Security, encryption, and tenant data isolation
* **[Semantic Search Integration](./implementation/semantic_search_integration.md)** – Use of PostgreSQL `pgvector` for semantic search capabilities

### Interfaces

The `interfaces/` directory documents the service's public and internal APIs:

* **[API Reference (OpenAPI)](./interfaces/business-store-service-api.yaml)** – OpenAPI specification for the Business Store Service REST API
* **[API Documentation](./interfaces/api.md)** – Detailed documentation for public REST API endpoints
* **[Tenant Schema Format](./interfaces/tenant_db_schema_format.md)** – Comprehensive guide to defining PostgreSQL-compatible tenant schemas
* **[Entity Relationships](./interfaces/relationship_handling.md)** – How relationships between entities are handled by the API
* **[Schema API Reconciliation](./interfaces/schema_api_reconciliation.md)** – Documentation of how the tenant schema format aligns with the API
* **[Schema Compatibility Guide](./interfaces/schema_compatibility_guide.md)** – Guide for migrating from previous entity-based format
* **[Internal Interfaces](./interfaces/internal.md)** – Internal communication patterns (events, service-to-service calls)

### Operations

The `operations/` directory covers operational aspects:

* **[Monitoring](./operations/monitoring.md)** – Metrics, logging, and health check guidelines for the service
* **[Scaling](./operations/scaling.md)** – Scaling considerations and performance characteristics
* **[Configuration](./operations/configuration.md)** – Configuration options (environment variables, files, runtime settings)

### Examples

The `examples/` directory provides practical usage examples:

* **[Basic Example](./examples/basic_example.md)** – Simple usage (e.g., creating a customer and an invoice)
* **[Advanced Example](./examples/advanced_example.md)** – Complex usage patterns (multi-step workflows, integration with external services like schema validation and observability)

## How to Use This Documentation

1. **New to the Business Store Service?** Start with the **[Overview](./overview.md)** to understand its responsibilities and architecture.
2. **Working with data models?** See the **[Data Model](./data_model.md)** for details on the schema-per-tenant approach and JSON Schema usage.
3. **Integrating or debugging?** Check the **[API Reference (OpenAPI)](./interfaces/business-store-service-api.yaml)** for endpoint specifications, **[Tenant Schema Format](./interfaces/tenant_db_schema_format.md)** for defining schemas, and **[Entity Relationships](./interfaces/relationship_handling.md)** for handling related records.
4. **Operating the service?** Review **[Monitoring](./operations/monitoring.md)** and **[Scaling](./operations/scaling.md)** for guidance on health checks, metrics, and performance tuning.
5. **Learning by example?** Walk through the **[Basic Example](./examples/basic_example.md)** first, then explore the **[Advanced Example](./examples/advanced_example.md)** for complex scenarios and integrations.

## Related Components

* **Auth Service** – Handles user, tenant, role, and API key management; the Business Store Service relies on Auth for authentication and tenant context
* **Validation Service** – Ensures JSON Schemas for tenant data models are valid; Business Store Service integrates with it to validate tenant schema definitions
* **Observability Service** – Provides centralized logging and monitoring; the Business Store Service emits metrics and logs consumable by Observability
* **Web Application Service** – The front-end that interfaces with the Business Store Service's API to display and manage business data for end users


