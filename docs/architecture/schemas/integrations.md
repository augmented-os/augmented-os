# Integrations

## Overview

Integrations provide standardized connections to external services (like Xero, Gmail, Slack). They:

* Define available methods that tasks can use
* Manage authentication and credentials
* Handle connection lifecycle
* Support multiple instances of the same integration type

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

## Integration Instance Structure

```json
{
  "instanceId": "string",          // Unique identifier for this instance
  "integrationId": "string",       // Reference to integration definition
  "name": "string",                // Human-readable name for this instance
  "description": "string",         // Optional description
  "context": {                     // Optional scoping context
    "type": "global | client | user",
    "contextId": "string"          // ID of client/user if scoped
  },
  "credentials": {                 // Encrypted credentials
    // Stored encrypted in database
  },
  "config": {                     // Instance specific configuration
    // Configuration values matching configSchema
  },
  "status": {                     // Current status of the integration
    "state": "active | inactive | error",
    "lastChecked": "timestamp",
    "error": "string"
  }
}
```

## Implementation Notes


1. **Storage:**
   * Integration definitions stored as code (JSON files)
   * Integration instances stored in database
   * Credentials encrypted using PostgreSQL `pgcrypto`
   * Status information updated regularly by health checks
2. **Authentication:**
   * OAuth2 flows handled by dedicated service
   * Refresh tokens managed automatically
   * API keys stored encrypted
   * Support for custom auth schemes
3. **Context Resolution:**
   * Global instances available to all tasks
   * Scoped instances (client/user) only available in relevant context
   * Clear rules for instance selection when multiple exist
4. **Security:**
   * All credentials encrypted at rest
   * Access controls on integration management
   * Audit logging of all integration usage
   * Regular credential rotation where applicable

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

## Example Integration Instance

```json
{
  "instanceId": "xero_main",
  "integrationId": "xero",
  "name": "Main Xero Account",
  "description": "Primary Xero integration for company accounting",
  "context": {
    "type": "global"
  },
  "credentials": {
    // Encrypted in database
  },
  "config": {
    "tenant_id": "xyz123"
  },
  "status": {
    "state": "active",
    "lastChecked": "2024-03-15T10:00:00Z"
  }
}
```

## Schema

**Table: integration_definitions**

| Field | Type | Description |
|-------|------|-------------|
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

**Table: integration_instances**

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| instance_id | VARCHAR(255) | Unique identifier for this instance |
| integration_definition_id | UUID | Reference to integration definition |
| name | VARCHAR(255) | Human-readable name for this instance |
| description | TEXT | Optional description |
| context_type | VARCHAR(50) | Context type (global, client, user) |
| context_id | VARCHAR(255) | ID of client/user if scoped |
| credentials | JSONB | Encrypted credentials (using pgcrypto) |
| config | JSONB | Instance specific configuration |
| status | JSONB | Current status information |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |
| last_used_at | TIMESTAMP | When this integration was last used |

**Indexes:**
- `integration_definitions_integration_id_idx` UNIQUE on `integration_id` (for lookups)
- `integration_instances_instance_id_idx` UNIQUE on `instance_id` (for lookups)
- `integration_instances_context_idx` on `(context_type, context_id)` (for finding instances in a context)
- `integration_instances_definition_idx` on `integration_definition_id` (for finding all instances of a definition)
- `integration_instances_status_idx` GIN on `status` (for finding instances by status)

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

**JSON Schema (credentials field):**
```json
{
  "type": "object",
  "properties": {
    "oauth2": {
      "type": "object",
      "properties": {
        "access_token": { "type": "string" },
        "refresh_token": { "type": "string" },
        "expires_at": { "type": "string" },
        "token_type": { "type": "string" },
        "scope": { "type": "string" }
      }
    },
    "apikey": {
      "type": "object",
      "properties": {
        "key": { "type": "string" },
        "secret": { "type": "string" }
      }
    },
    "custom": { "type": "object" }
  }
}
```

**JSON Schema (status field):**
```json
{
  "type": "object",
  "properties": {
    "state": { 
      "type": "string",
      "enum": ["active", "inactive", "error"]
    },
    "lastChecked": { "type": "string" },
    "error": { "type": "string" },
    "details": { "type": "object" }
  },
  "required": ["state"]
}
```

**Notes:**
- Integration definitions are stored as code but also mirrored in the database
- Credentials are encrypted using PostgreSQL's pgcrypto extension
- Regular health checks update the status field
- Following our schema convention, all top-level fields from the JSON structure are represented as columns, while nested objects remain as JSONB 