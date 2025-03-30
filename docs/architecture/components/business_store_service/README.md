# Business Store Service Documentation

## Structure Overview

This documentation covers the **Business Store Service**, which is responsible for managing multi-tenant business data (such as invoices, customers, and transactions) using a schema-per-tenant model in PostgreSQL. The documentation is organized as follows:

### High-Level Documentation

* **Overview** – High-level architectural overview of the Business Store Service (its role and architecture)
* **Data Model** – Core data structures, schemas, and database considerations

### Detailed Implementation

The `implementation/` directory contains detailed documentation on specific aspects of the Business Store Service:

* **Tenant Schema Management** – How tenant-specific schemas are created, managed, and validated
* **Security & Isolation** – Implementation of Row-Level Security, encryption, and tenant data isolation
* **Semantic Search Integration** – Use of PostgreSQL `pgvector` for semantic search capabilities

### Interfaces

The `interfaces/` directory documents the service's public and internal APIs:

* **API Reference** – Public REST API endpoints exposed by the Business Store Service
* **Internal Interfaces** – Internal communication patterns (events, service-to-service calls)

### Operations

The `operations/` directory covers operational aspects:

* **Monitoring** – Metrics, logging, and health check guidelines for the service
* **Scaling** – Scaling considerations and performance characteristics
* **Configuration** – Configuration options (environment variables, files, runtime settings)

### Examples

The `examples/` directory provides practical usage examples:

* **Basic Example** – Simple usage (e.g., creating a customer and an invoice)
* **Advanced Example** – Complex usage patterns (multi-step workflows, integration with external services like schema validation and observability)

## How to Use This Documentation



1. **New to the Business Store Service?** Start with the **Overview** to understand its responsibilities and architecture.
2. **Working with data models?** See the **Data Model** for details on the schema-per-tenant approach and JSON Schema usage.
3. **Integrating or debugging?** Check **API Reference** for endpoints and **Internal Interfaces** for service interactions.
4. **Operating the service?** Review **Monitoring** and **Scaling** for guidance on health checks, metrics, and performance tuning.
5. **Learning by example?** Walk through the **Basic Example** first, then explore the **Advanced Example** for complex scenarios and integrations.

## Related Components

* **Auth Service** – Handles user, tenant, role, and API key management; the Business Store Service relies on Auth for authentication and tenant context
* **Validation Service** – Ensures JSON Schemas for tenant data models are valid; Business Store Service integrates with it to validate tenant schema definitions
* **Observability Service** – Provides centralized logging and monitoring; the Business Store Service emits metrics and logs consumable by Observability
* **Web Application Service** – The front-end that interfaces with the Business Store Service’s API to display and manage business data for end users


