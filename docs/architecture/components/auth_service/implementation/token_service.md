# Token Service

## Overview

The Token Service is a core component of the Auth Service responsible for managing the complete lifecycle of JSON Web Tokens (JWTs), enabling secure, stateless authentication and authorization across microservices without requiring additional network calls for validation.

## Key Responsibilities

* Generating and signing JWT access tokens with appropriate claims
* Creating and managing refresh tokens for obtaining new access tokens
* Validating tokens and extracting identity and permission claims
* Supporting token revocation and blacklisting mechanisms
* Providing public keys via JWKS (JSON Web Key Set) endpoint
* Managing cryptographic key rotation and lifecycle

## Implementation Approach

The Token Service follows these design principles:



1. **Stateless Validation** - Tokens contain all necessary information for validation without requiring additional database lookups
2. **Defense in Depth** - Multiple security layers including signature verification, claims validation, and optional blacklisting
3. **Key Rotation** - Regular cryptographic key rotation without service disruption
4. **Standards Compliance** - Strict adherence to JWT, JWS, and JWKS standards
5. **Performance Optimization** - Minimal dependencies and efficient validation optimized for microservices

For detailed security considerations related to token implementation, please refer to the [Security Considerations](../security_considerations.md#token-security) document.

## Token Lifecycle

```
┌───────────────┐
│ Authentication│
└───────┬───────┘
        │
        ▼
┌───────────────┐     ┌─────────────────┐
│ Token Issuance │────►│ Token Active    │
└───────┬───────┘     └─────────┬────────┘
        │                       │
        │                       │
        ▼                       ▼
┌───────────────┐     ┌─────────────────┐
│ Token Refresh  │◄────│ Token Expiring  │
└───────┬───────┘     └─────────────────┘
        │
        ▼
┌───────────────┐
│ Token Invalid │
└───────────────┘
```

## Implementation Details

### Token Types and Structure

The Token Service implements two primary token types:

#### Access Tokens

Access tokens are short-lived JWTs containing user identity and authorization information. The structure is defined in the [Authentication Service Data Model](../data_model.md#token).

```typescript
// See full definition in ../data_model.md
interface AccessTokenClaims {
  // Registered JWT claims
  iss: string;         // Issuer (Auth Service URL)
  sub: string;         // Subject (User ID)
  // ... other fields defined in data_model.md ...
}
```

#### Refresh Tokens

Refresh tokens are longer-lived credentials used to obtain new access tokens. The structure is defined in the [Authentication Service Data Model](../data_model.md#token).

```typescript
// See full definition in ../data_model.md
interface RefreshToken {
  id: string;           // Token ID (opaque string sent to client)
  userId: string;       // Associated user ID
  // ... other fields defined in data_model.md ...
}
```

### Token Generation

Access tokens are generated through a secure process that includes:




1. Retrieving user information, roles, and permissions
2. Building the claims payload with standard and custom claims
3. Signing the token with the current cryptographic key (provided by [Key Manager](./key_manager.md))
4. Returning the signed JWT

Note: The Token Service relies on the [Key Manager](./key_manager.md) for all cryptographic key operations, including key generation, storage, rotation, and signing operations.

```typescript
async function generateAccessToken(
  userId: string,
  options: TokenOptions = {}
): Promise<string> {
  // Retrieve user information
  const user = await userManager.getUserById(userId);
  if (!user) {
    throw new Error(`User not found: ${userId}`);
  }
  
  // Get user roles and permissions
  const roles = await userManager.getUserRoles(userId);
  const permissions = await permissionManager.getUserPermissions(userId);
  
  // Get current token configuration
  const config = await configService.getTokenConfig();
  const currentTime = Math.floor(Date.now() / 1000);
  
  // Create token ID
  const tokenId = generateUuid();
  
  // Build claims payload
  const payload: AccessTokenClaims = {
    // Registered claims
    iss: config.issuer,
    sub: userId,
    aud: options.audience || config.defaultAudience,
    exp: currentTime + (options.expiresIn || config.accessTokenExpirySeconds),
    nbf: currentTime,
    iat: currentTime,
    jti: tokenId,
    
    // Custom claims
    username: user.username,
    email: user.email,
    roles: roles.map(role => role.name),
    permissions: permissions.map(perm => `${perm.resource}:${perm.action}`),
    scope: options.scope || 'api',
  };
  
  // Add optional claims if available
  if (options.deviceId) payload.device_id = options.deviceId;
  if (options.sessionId) payload.session_id = options.sessionId;
  if (options.tenantId) payload.tenant_id = options.tenantId;
  
  // Sign the token
  const signingKey = await keyManager.getCurrentSigningKey();
  const token = jwt.sign(payload, signingKey.privateKey, {
    algorithm: config.signatureAlgorithm,
    keyid: signingKey.id,
  });
  
  // Log token creation
  await auditLogger.log({
    action: 'token_created',
    resource: 'access_token',
    resourceId: tokenId,
    userId,
    metadata: {
      expiresAt: new Date((payload.exp) * 1000).toISOString(),
      scopes: payload.scope,
    },
  });
  
  return token;
}
```

### Token Validation

Token validation can be performed by any service with access to the public keys:

```typescript
async function validateAccessToken(token: string): Promise<AccessTokenClaims | null> {
  try {
    // Get token configuration
    const config = await configService.getTokenConfig();
    
    // Decode the token header to get the key ID (kid)
    const decodedHeader = jwt.decode(token, { complete: true })?.header;
    if (!decodedHeader || !decodedHeader.kid) {
      throw new Error('Invalid token format or missing key ID');
    }
    
    // Get the public key matching the key ID
    const publicKey = await keyManager.getPublicKey(decodedHeader.kid);
    if (!publicKey) {
      throw new Error(`Public key not found for key ID: ${decodedHeader.kid}`);
    }
    
    // Verify the token signature and claims
    const payload = jwt.verify(token, publicKey, {
      algorithms: [config.signatureAlgorithm],
      issuer: config.issuer,
      audience: config.defaultAudience,
      complete: false,
    }) as AccessTokenClaims;
    
    // Additional validation can be performed here if needed
    
    return payload;
  } catch (error) {
    // Log validation failure
    await auditLogger.log({
      action: 'token_validation_failed',
      resource: 'access_token',
      metadata: {
        error: error.message,
      },
    });
    
    return null;
  }
}
```

## Related Documentation

* [Key Manager](./key_manager.md)
* [Auth Provider](./auth_provider.md)
* [Permission Manager](./permission_manager.md)
* [Security Considerations](../security_considerations.md)
* [Web Application API Integration](../../web_application/technical_architecture/api_integration.md)
* [Validation Service Security](../../validation_service/operations/configuration.md)
* [JWKS Endpoint Documentation](../interfaces/api.md#jwks-endpoint)

## Summary

The Token Service lies at the heart of the authentication and authorization flows within the Auth Service, providing secure, standards-compliant JWT tokens that can be validated independently by services across the platform. Its implementation enables true zero-trust architecture by embedding verified identity and permission claims directly in tokens.

The component ensures secure token lifecycle management from issuance through validation and eventual expiration or revocation. By implementing industry best practices for token security and providing a JWKS endpoint for public key distribution, it enables stateless authentication without compromising security.