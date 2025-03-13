# Integration Service Data Model

## Overview

The Integration Service primarily interacts with these data schemas:

* [Integrations Schema](../../schemas/integrations.md): Defines integration definitions, instances, and related configuration
* [Events Schema](../../schemas/events.md): Used for integration-related events and notifications

This document focuses on how the Integration Service component specifically implements and extends the canonical schemas defined in the links above. For complete schema definitions, please refer to the linked documentation.

## Integration Service Implementation Details

The Integration Service extends the canonical schemas with additional implementation-specific structures and optimizations to support secure credential management, efficient method execution, and robust error handling.

### Integration Definition

The Integration Service maintains detailed information for each integration definition:

```typescript
interface IntegrationDefinition {
  id: string;                            // UUID for the definition
  name: string;                          // Human-readable name
  description: string;                   // Detailed description
  version: string;                       // Semantic version
  type: string;                          // Integration type (e.g., "http", "graphql", "soap")
  authType: IntegrationAuthType;         // Authentication type
  methods: IntegrationMethod[];          // Available methods
  configSchema: JSONSchema;              // Configuration schema
  oauth2Config?: OAuth2Config;           // OAuth2 configuration if applicable
  defaultConfig?: Record<string, any>;   // Default configuration values
  createdAt: string;                     // ISO timestamp
  updatedAt: string;                     // ISO timestamp
  publishedAt?: string;                  // ISO timestamp when published
  status: IntegrationDefinitionStatus;   // Current status
}

type IntegrationAuthType = 
  'none' | 
  'basic' | 
  'api_key' | 
  'oauth2' | 
  'jwt' | 
  'custom';

type IntegrationDefinitionStatus = 
  'DRAFT' | 
  'PUBLISHED' | 
  'DEPRECATED' | 
  'ARCHIVED';

interface IntegrationMethod {
  name: string;                          // Method name
  description: string;                   // Method description
  paramSchema: JSONSchema;               // Parameter schema
  resultSchema: JSONSchema;              // Result schema
  requestTransform?: string;             // Optional transform for request
  responseTransform?: string;            // Optional transform for response
  rateLimits?: {
    requestsPerMinute?: number;          // Rate limit requests/minute
    burstLimit?: number;                 // Burst limit
  };
  timeoutMs?: number;                    // Timeout in milliseconds
  retryConfig?: RetryConfig;             // Retry configuration
}

interface OAuth2Config {
  clientId: string;                      // OAuth client ID
  clientSecret: string;                  // OAuth client secret (encrypted)
  authorizationUrl: string;              // Authorization endpoint
  tokenUrl: string;                      // Token endpoint
  scope?: string;                        // Default OAuth scope
  additionalParameters?: Record<string, string>; // Additional OAuth parameters
  refreshTokenConfig?: {
    strategy: 'auto' | 'manual';         // Refresh strategy
    timeBeforeExpiryMs?: number;         // Time to refresh before expiry
  };
}

interface RetryConfig {
  maxRetries: number;                    // Maximum retry attempts
  backoffMultiplier: number;             // Backoff multiplier for retry delays
  initialDelayMs: number;                // Initial delay in milliseconds
  maxDelayMs: number;                    // Maximum delay in milliseconds
  retryableErrors?: string[];            // Error codes that are retryable
}
```

### Integration Instance

```typescript
interface IntegrationInstance {
  id: string;                            // UUID for the instance
  integrationDefinitionId: string;       // Reference to definition
  name: string;                          // Human-readable name
  config: Record<string, any>;           // Instance-specific configuration
  status: IntegrationInstanceStatus;     // Current status
  error?: {                              // Error information if any
    message: string;                     // Error message
    code: string;                        // Error code
    details?: any;                       // Additional error details
  };
  createdAt: string;                     // ISO timestamp
  updatedAt: string;                     // ISO timestamp
  lastUsedAt?: string;                   // ISO timestamp of last usage
  lastConnectedAt?: string;              // ISO timestamp of last connection
}

type IntegrationInstanceStatus = 
  'PENDING_CONFIGURATION' | 
  'PENDING_AUTHENTICATION' | 
  'CONNECTED' | 
  'DISCONNECTED' | 
  'AUTH_ERROR' | 
  'CONFIG_ERROR';
```

### Credential Storage

```typescript
interface IntegrationCredential {
  id: string;                            // UUID for the credential
  integrationInstanceId: string;         // Reference to integration instance
  type: IntegrationAuthType;             // Credential type
  basicAuth?: {                          // Basic auth credentials (encrypted)
    username: string;                    // Username
    password: string;                    // Password (encrypted)
  };
  apiKey?: {                             // API key credentials (encrypted)
    key: string;                         // API key (encrypted)
    headerOrParam: string;               // Header or query parameter name
    inHeader: boolean;                   // Whether key is in header
  };
  oauth2?: {                             // OAuth2 credentials (encrypted)
    accessToken: string;                 // Access token (encrypted)
    refreshToken?: string;               // Refresh token (encrypted)
    expiresAt?: string;                  // ISO timestamp of expiration
    tokenType: string;                   // Token type (e.g., "Bearer")
    scope?: string;                      // OAuth scope
    rawResponse?: Record<string, any>;   // Raw token response
  };
  jwt?: {                                // JWT credentials (encrypted)
    token: string;                       // JWT token (encrypted)
    expiresAt?: string;                  // ISO timestamp of expiration
  };
  custom?: Record<string, any>;          // Custom credentials (encrypted)
  createdAt: string;                     // ISO timestamp
  updatedAt: string;                     // ISO timestamp
}
```

## Database Optimization

The Integration Service implements the following database optimizations:

1. **Credential Isolation** - Credentials are stored in a separate table with enhanced encryption and restricted access patterns.
2. **Method Execution Caching** - Frequently used integration responses are cached with appropriate TTLs based on method configuration.
3. **Indexed Lookups** - Key fields like integrationDefinitionId, status, and lastUsedAt are indexed for efficient querying.
4. **Audit Trail Partitioning** - Integration execution logs are partitioned by time period for efficient storage and querying.
5. **Optimistic Concurrency Control** - Version numbers are used to handle concurrent updates to integration instances.

## Related Schema Documentation

* [Integrations Schema](../../schemas/integrations.md)
* [Events Schema](../../schemas/events.md)
* [Implementation Details](./implementation/credential_manager.md)


