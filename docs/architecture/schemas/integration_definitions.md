# Integration Definitions

## Overview

Integration definitions specify the capabilities and requirements of external service connections (like Xero, Gmail, Slack). They:

* Define available methods that tasks can use
* Specify authentication mechanisms
* Outline configuration requirements
* Provide the foundation for creating integration instances

## Key Concepts

* **Integration Definition** - A specification of an external service integration
* **Methods** - Functions that the integration provides to interact with the external service
* **Authentication Types** - How the integration authenticates (OAuth2, API key, etc.)
* **Configuration Schema** - Required configuration for the integration
* **Versioning** - Each integration definition has a semantic version

## Integration Definition Structure

```json
{
  "integrationId": "string",        // Unique identifier (e.g., "xero")
  "name": "string",                 // Human-readable name
  "description": "string",          // Detailed description
  "version": "string",              // Semantic version of this integration
  "methods": [                      // Available methods this integration provides
    {
      "id": "string",              // Method identifier (e.g., "create_invoice")
      "name": "string",            // Human-readable name
      "description": "string",     // What this method does
      "inputSchema": {             // JSON Schema for method inputs
        "type": "object",
        "properties": { }
      },
      "outputSchema": {            // JSON Schema for method outputs
        "type": "object",
        "properties": { }
      }
    }
  ],
  "configSchema": {                 // Configuration required for this integration
    "type": "object",
    "properties": {
      // Configuration fields needed (e.g., API endpoints, options)
    }
  },
  "authType": "oauth2 | apikey | custom",  // Authentication method used
  "oauth2Config": {                // If authType is oauth2
    "authorizationUrl": "string",
    "tokenUrl": "string",
    "scopes": ["string"],
    "additionalParameters": { }
  }
}
```

## Methods

Methods define the specific actions an integration can perform with the external service:

* Each method has a unique ID within the integration
* Input and output schemas define the expected parameters and return values
* Methods are strongly typed using JSON Schema
* Input validation occurs before method execution
* Output validation ensures proper response format

Example method configuration:

```json
{
  "methods": [
    {
      "id": "create_invoice",
      "name": "Create Invoice",
      "description": "Creates a new invoice in Xero",
      "inputSchema": {
        "type": "object",
        "properties": {
          "contact_id": {
            "type": "string",
            "description": "Xero contact ID"
          },
          "line_items": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "description": { "type": "string" },
                "quantity": { "type": "number" },
                "unit_amount": { "type": "number" }
              }
            }
          }
        },
        "required": ["contact_id", "line_items"]
      },
      "outputSchema": {
        "type": "object",
        "properties": {
          "invoice_id": { "type": "string" },
          "invoice_number": { "type": "string" },
          "status": { "type": "string" }
        }
      }
    }
  ]
}
```

## Authentication

Integration definitions support multiple authentication methods:


1. **OAuth2:**
   * Full OAuth2 flow with authorization and token URLs
   * Configurable scopes
   * Support for additional parameters
   * Refresh token management
2. **API Key:**
   * Simple key-based authentication
   * Support for header or query parameter placement
   * Key naming configuration
3. **Custom:**
   * Flexible authentication for non-standard methods
   * Custom parameter structure
   * Support for complex auth schemes

Example OAuth2 configuration:

```json
{
  "authType": "oauth2",
  "oauth2Config": {
    "authorizationUrl": "https://login.xero.com/identity/connect/authorize",
    "tokenUrl": "https://identity.xero.com/connect/token",
    "scopes": ["accounting.transactions", "accounting.contacts"],
    "additionalParameters": {
      "grant_type": "authorization_code"
    }
  }
}
```

## Configuration Schema

Each integration definition specifies the configuration required for instances:

* Configuration is validated against the schema
* Supports complex nested structures
* Can include default values
* Includes descriptions for UI rendering

```json
{
  "configSchema": {
    "type": "object",
    "properties": {
      "tenant_id": {
        "type": "string",
        "description": "Xero tenant/organization ID"
      },
      "invoice_prefix": {
        "type": "string",
        "description": "Optional prefix for invoice numbers",
        "default": "INV-"
      }
    },
    "required": ["tenant_id"]
  }
}
```

## Example Integration Definition

```json
{
  "integrationId": "xero",
  "name": "Xero Accounting",
  "description": "Integration with Xero accounting software",
  "version": "1.0.0",
  "methods": [
    {
      "id": "create_invoice",
      "name": "Create Invoice",
      "description": "Creates a new invoice in Xero",
      "inputSchema": {
        "type": "object",
        "properties": {
          "contact_id": {
            "type": "string",
            "description": "Xero contact ID"
          },
          "line_items": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "description": { "type": "string" },
                "quantity": { "type": "number" },
                "unit_amount": { "type": "number" }
              }
            }
          }
        },
        "required": ["contact_id", "line_items"]
      },
      "outputSchema": {
        "type": "object",
        "properties": {
          "invoice_id": { "type": "string" },
          "invoice_number": { "type": "string" },
          "status": { "type": "string" }
        }
      }
    }
  ],
  "configSchema": {
    "type": "object",
    "properties": {
      "tenant_id": {
        "type": "string",
        "description": "Xero tenant/organization ID"
      }
    }
  },
  "authType": "oauth2",
  "oauth2Config": {
    "authorizationUrl": "https://login.xero.com/identity/connect/authorize",
    "tokenUrl": "https://identity.xero.com/connect/token",
    "scopes": ["accounting.transactions", "accounting.contacts"]
  }
}
```

## Database Schema

**Table: integration_definitions**

| Field | Type | Description |
|----|----|----|
| id | UUID | Primary key |
| integration_id | VARCHAR(255) | Unique identifier (e.g., "xero") |
| name | VARCHAR(255) | Human-readable name |
| description | TEXT | Detailed description |
| version | VARCHAR(50) | Semantic version of this integration |
| methods | JSONB | Available methods this integration provides |
| config_schema | JSONB | Configuration schema for this integration |
| auth_type | VARCHAR(50) | Authentication method (oauth2, apikey, custom) |
| oauth2_config | JSONB | OAuth2 configuration if applicable |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

**Indexes:**

* `integration_definitions_integration_id_idx` UNIQUE on `integration_id` (for lookups)

**JSON Schema (methods field):**

```json
{
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "id": { "type": "string" },
      "name": { "type": "string" },
      "description": { "type": "string" },
      "inputSchema": { "type": "object" },
      "outputSchema": { "type": "object" }
    },
    "required": ["id", "name", "inputSchema", "outputSchema"]
  }
}
```

## Performance Considerations

For integration definitions, consider these performance optimizations:

* Store frequently used integration definitions in an in-memory cache
* Optimize method lookup performance during task execution
* Validate integration definitions at load time, not runtime
* Consider bulk loading of definitions for system initialization

## Related Documentation

* [Integration Instances](./integration_instances.md) - Documentation for integration instances
* [Task Definitions](./task_definitions.md) - Task definitions that use integrations
* [Workflow Definitions](./workflow_definitions.md) - Workflow definitions that incorporate tasks using integrations
* [Database Architecture](../database_architecture.md) - Overall database architecture


