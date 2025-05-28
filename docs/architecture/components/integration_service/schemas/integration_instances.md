# Integration Instances

## Overview

Integration instances are concrete, configured connections to external services based on integration definitions. They:

* Store authentication credentials securely
* Provide context-specific configurations
* Maintain connection state information
* Allow multiple instances of the same integration type with different configurations
* Support scoping to specific contexts (global, client, or user)

## Key Concepts

* **Integration Instance** - A configured instance of an integration definition
* **Context** - The scope in which an integration instance operates (global, client, user)
* **Credentials** - Securely stored authentication details
* **Configuration** - Instance-specific settings
* **Status** - The current operational state of the instance

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

## Context Resolution

Integration instances can be scoped to different contexts:


1. **Global Context:**
   * Available throughout the entire system
   * Typically used for system-wide integrations
   * No contextId required
2. **Client Context:**
   * Scoped to a specific client
   * Only available for workflows within that client's context
   * Requires client contextId
3. **User Context:**
   * Scoped to a specific user
   * Only available for workflows initiated by that user
   * Requires user contextId

Integration instance resolution follows a hierarchical order:

* First check for user-scoped instances
* If none found, check for client-scoped instances
* If none found, use global instances
* If multiple instances exist at the same scope, select based on status and last used

## Credential Management

Credentials are stored securely and managed carefully:

* Encrypted at rest using PostgreSQL's `pgcrypto`
* Never exposed in plaintext through APIs
* Automatically refreshed for OAuth2 tokens
* Regular rotation policies for long-lived credentials
* Access control restrictions on credential viewing

Example credential storage (representation, not actual encrypted data):

```json
{
  "credentials": {
    "oauth2": {
      "access_token": "[ENCRYPTED]",
      "refresh_token": "[ENCRYPTED]",
      "expires_at": "2023-06-30T12:00:00Z"
    }
  }
}
```

## Status Monitoring

Each integration instance maintains status information:

* Current operational state (active, inactive, error)
* Last connectivity check timestamp
* Error details if applicable
* Health check frequency configurable per integration type

Example status information:

```json
{
  "status": {
    "state": "active",
    "lastChecked": "2023-06-29T10:15:30Z",
    "error": null,
    "metrics": {
      "averageResponseTime": 120,
      "successRate": 99.8,
      "lastUsed": "2023-06-29T09:45:22Z"
    }
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

## Database Schema

**Table: integration_instances**

| Field | Type | Description |
|----|----|----|
| id | UUID | Primary key |
| instance_id | VARCHAR(255) | Unique identifier for this instance |
| integration_definition_id | UUID | Reference to integration definition |
| name | VARCHAR(255) | Human-readable name for this instance |
| description | TEXT | Optional description |
| context_type | context_scope_enum | Context type ENUM ('global', 'client', 'user'), defaults to 'global' |
| context_id | VARCHAR(255) | ID of client/user if scoped (NULL if context_type is 'global') |
| credentials | BYTEA | Encrypted credentials. Physical type is BYTEA, storing JSON encrypted by the application layer (e.g., using pgcrypto). |
| config | JSONB | Instance specific configuration |
| status | JSONB | Current status information |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |
| last_used_at | TIMESTAMP | When this integration was last used |

**Indexes:**

* `integration_instances_instance_id_idx` UNIQUE on `instance_id` (for lookups)
* `integration_instances_context_idx` on `(context_type, context_id)` (for finding instances in a context)
* `integration_instances_definition_idx` on `integration_definition_id` (for finding all instances of a definition)
* `integration_instances_status_idx` GIN on `status` (for finding instances by status)

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
        "expires_at": { "type": "string", "format": "date-time" }
      }
    },
    "apikey": {
      "type": "object",
      "properties": {
        "key": { "type": "string" },
        "secret": { "type": "string" }
      }
    },
    "custom": {
      "type": "object"
    }
  }
}
```

## Security Considerations

Integration instances require special security attention:

* All credentials are encrypted at rest
* Access to credentials is strictly controlled
* Audit logging records all credential access
* Regular credential rotation is enforced where possible
* OAuth2 refresh tokens are automatically rotated
* Failed authentication attempts are monitored and reported
* Integration instance creation requires appropriate permissions

## Performance Considerations

For integration instances, consider these performance optimizations:

* Cache active integration instances for frequently used integrations
* Implement connection pooling for shared integrations
* Monitor connection usage patterns to optimize instance counts
* Implement circuit breakers for error-prone integrations
* Consider rate limiting to prevent external service throttling
* Batch operations where possible to reduce connection overhead

## Related Documentation

* [Integration Definitions](./integration_definitions.md) - Documentation for integration definitions
* [Task Definitions](./task_definitions.md) - Task definitions that use integrations
* [Workflow Definitions](../../workflow_orchestrator_service/schemas/workflow_definitions.md) - Workflow definitions that incorporate tasks using integrations
* [Database Architecture](../database_architecture.md) - Overall database architecture


