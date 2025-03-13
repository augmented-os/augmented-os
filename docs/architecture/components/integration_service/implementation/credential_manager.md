# Credential Manager

## Overview

The Credential Manager is a core component of the Integration Service responsible for securely storing, retrieving, and managing authentication credentials for external systems. It handles encryption, token refresh, and secure access to sensitive authentication information.

## Key Responsibilities

* Encrypting sensitive credentials at rest and in transit
* Supporting various authentication methods (API keys, OAuth, JWT, etc.)
* Managing token refresh and rotation
* Providing secure credential access to authorized components
* Implementing credential validation and testing
* Auditing credential access and changes

## Implementation Approach

The Credential Manager follows these design principles:

1. **Defense in Depth** - Multiple layers of security protect credentials, including encryption, access controls, and audit logging.
2. **Least Privilege** - Components only receive the specific credentials they need, with minimal permissions.
3. **Secure by Default** - All credentials are encrypted by default, with no option to store them in plaintext.
4. **Token Lifecycle Management** - Automatic handling of token expiration, refresh, and rotation.
5. **Separation of Concerns** - Credential storage is separate from credential usage, with clear interfaces between them.

## Credential Lifecycle

```
┌────────────┐
│  CREATED   │
└─────┬──────┘
      │
      ▼
┌────────────┐     ┌─────────────┐
│  ACTIVE    │────►│  REFRESHING │
└─────┬──────┘     └──────┬──────┘
      │                   │
      │                   │
      │                   ▼
      ▼             ┌─────────────┐
┌────────────┐      │   UPDATED   │
│  EXPIRED   │      └──────┬──────┘
└─────┬──────┘             │
      │                    │
      ▼                    │
┌────────────┐             │
│  REVOKED   │◄────────────┘
└────────────┘
```

## Implementation Details

### Credential Storage

The Credential Manager uses a secure storage system with encryption at rest:

```typescript
// Example of storing credentials
async function storeCredentials(
  integrationInstanceId: string,
  credentials: IntegrationCredential
): Promise<void> {
  // Validate credentials structure
  const validationResult = validateCredentialStructure(credentials);
  if (!validationResult.valid) {
    throw new ValidationError('Invalid credential structure', validationResult.errors);
  }
  
  // Encrypt sensitive fields based on credential type
  const encryptedCredentials = await encryptCredentials(credentials);
  
  // Store encrypted credentials
  await credentialRepository.upsert(
    integrationInstanceId,
    encryptedCredentials
  );
  
  // Log credential update (without sensitive data)
  await auditLogger.log({
    action: 'CREDENTIAL_UPDATED',
    integrationInstanceId,
    credentialType: credentials.type,
    timestamp: new Date().toISOString()
  });
}

// Encryption function
async function encryptCredentials(
  credentials: IntegrationCredential
): Promise<IntegrationCredential> {
  // Create a copy to avoid modifying the original
  const result = { ...credentials };
  
  // Encrypt based on credential type
  switch (credentials.type) {
    case 'basic':
      if (credentials.basicAuth) {
        result.basicAuth = {
          username: credentials.basicAuth.username,
          password: await encryptionService.encrypt(credentials.basicAuth.password)
        };
      }
      break;
    case 'api_key':
      if (credentials.apiKey) {
        result.apiKey = {
          ...credentials.apiKey,
          key: await encryptionService.encrypt(credentials.apiKey.key)
        };
      }
      break;
    case 'oauth2':
      if (credentials.oauth2) {
        result.oauth2 = {
          ...credentials.oauth2,
          accessToken: await encryptionService.encrypt(credentials.oauth2.accessToken),
          refreshToken: credentials.oauth2.refreshToken 
            ? await encryptionService.encrypt(credentials.oauth2.refreshToken)
            : undefined
        };
      }
      break;
    // Handle other credential types
  }
  
  return result;
}
```

### OAuth Token Refresh

The Credential Manager automatically handles OAuth token refresh:

```typescript
// Example of OAuth token refresh
async function refreshOAuthToken(
  integrationInstanceId: string
): Promise<boolean> {
  // Get integration instance
  const instance = await integrationRepository.getInstance(integrationInstanceId);
  if (!instance) {
    throw new NotFoundError(`Integration instance not found: ${integrationInstanceId}`);
  }
  
  // Get integration definition
  const definition = await integrationRepository.getDefinition(instance.integrationDefinitionId);
  if (!definition) {
    throw new NotFoundError(`Integration definition not found: ${instance.integrationDefinitionId}`);
  }
  
  // Get current credentials
  const credentials = await credentialRepository.getByInstanceId(integrationInstanceId);
  if (!credentials || credentials.type !== 'oauth2' || !credentials.oauth2) {
    throw new Error(`OAuth credentials not found for instance: ${integrationInstanceId}`);
  }
  
  // Get OAuth configuration
  const oauthConfig = definition.oauth2Config;
  if (!oauthConfig) {
    throw new Error('OAuth configuration not found');
  }
  
  try {
    // Decrypt refresh token
    const refreshToken = await encryptionService.decrypt(credentials.oauth2.refreshToken);
    
    // Request new token
    const tokenResponse = await httpClient.post(
      oauthConfig.tokenUrl,
      {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: oauthConfig.clientId,
        client_secret: oauthConfig.clientSecret
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    
    // Update credentials with new tokens
    await storeCredentials(integrationInstanceId, {
      ...credentials,
      oauth2: {
        accessToken: tokenResponse.data.access_token,
        refreshToken: tokenResponse.data.refresh_token || refreshToken,
        expiresAt: tokenResponse.data.expires_in 
          ? new Date(Date.now() + tokenResponse.data.expires_in * 1000).toISOString()
          : null,
        tokenType: tokenResponse.data.token_type || credentials.oauth2.tokenType,
        scope: tokenResponse.data.scope || credentials.oauth2.scope,
        rawResponse: tokenResponse.data
      }
    });
    
    return true;
  } catch (error) {
    // Log refresh failure
    logger.error(`OAuth token refresh failed for ${integrationInstanceId}`, error);
    
    // Update integration status
    await integrationRepository.updateStatus(
      integrationInstanceId,
      {
        status: 'AUTH_ERROR',
        error: {
          message: 'OAuth token refresh failed',
          details: error.message
        }
      }
    );
    
    return false;
  }
}
```

### Edge Cases and Error Handling

The implementation addresses the following edge cases:

| Scenario | Handling Approach |
|----------|-------------------|
| Encryption key rotation | Supports re-encryption of credentials with new keys |
| Token expiration during operation | Implements transparent retry with fresh token |
| Refresh token expiration | Notifies users and provides re-authentication flow |
| Credential access attempt without permission | Logs security event and denies access |
| External service unavailable during refresh | Implements retry with exponential backoff |

## Performance Considerations

The Credential Manager is optimized for secure and efficient credential access.

### Benchmarks

| Operation | Average Performance | P99 Performance |
|-----------|---------------------|----------------|
| Credential retrieval (cached) | 5ms | 15ms |
| Credential retrieval (uncached) | 30ms | 80ms |
| Credential storage | 50ms | 120ms |
| OAuth token refresh | 200ms | 500ms |

## Related Documentation

* [Data Model](../data_model.md)
* [Security Considerations](../operations/configuration.md)
* [Advanced Example](../examples/advanced_example.md)
* [API Reference](../interfaces/api.md) 