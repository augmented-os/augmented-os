# Key Manager

## Overview

The Key Manager is a core component of the Auth Service responsible for securely handling all cryptographic key operations. It manages the entire lifecycle of cryptographic keys, from generation and storage to rotation and revocation, while ensuring the highest level of security for sensitive key material.

The Key Manager provides cryptographic services to other Auth Service components, particularly the [Token Service](./token_service.md), which relies on the Key Manager for JWT signing and verification operations.

## Key Responsibilities

* Generating cryptographic keys for various authentication and encryption operations
* Securely storing keys in a tamper-resistant manner
* Providing key rotation mechanisms and versioning
* Managing key lifecycle (creation, activation, expiration, revocation)
* Supporting different key types for different cryptographic operations
* Enabling secure key retrieval for authorized services
* Integrating with hardware security modules (HSMs) for enhanced security

## Implementation Approach

The Key Manager follows these design principles:

1. **Defense in Depth** - Multiple layers of protection for cryptographic key material
2. **Least Privilege** - Services can only access the specific keys they need
3. **Key Separation** - Different keys for different purposes to limit impact of compromise
4. **Automation** - Automated key rotation and lifecycle management
5. **Auditability** - Comprehensive logging of all key operations for security audits
6. **Hardware Integration** - Support for HSMs to protect high-value keys

For detailed security considerations relating to key management, please refer to the [Security Considerations](../security_considerations.md#token-security) document.

## Key Lifecycle

```
┌───────────────┐
│ Key           │
│ Generation    │
└───────┬───────┘
        │
        ▼
┌───────────────┐     ┌─────────────────┐
│ Key Activation │────►│  Key Usage      │
└───────┬───────┘     └─────────┬────────┘
        │                       │
        │                       │
        ▼                       ▼
┌───────────────┐     ┌─────────────────┐
│Key Rotation    │◄───│   Key Expiry    │
└───────┬───────┘     └─────────────────┘
        │
        ▼
┌───────────────┐
│Key Revocation  │
└───────────────┘
```

## Implementation Details

### Data Model

The Key Manager operates on the following primary data structures:

#### Signing Key

```typescript
interface SigningKey {
  id: string;            // Unique key identifier
  type: 'EC' | 'RSA';    // Key type (EC preferred for signatures)
  algorithm: string;     // Algorithm (e.g., 'ES256', 'RS256')
  publicKey: string;     // Public key (PEM format)
  privateKey: string;    // Private key (PEM format, encrypted at rest)
  keyUse: 'sig';         // Key usage: signature
  status: KeyStatus;     // Current status
  metadata: KeyMetadata; // Additional metadata
}
```

#### Encryption Key

```typescript
interface EncryptionKey {
  id: string;            // Unique key identifier
  type: 'AES' | 'RSA';   // Key type
  algorithm: string;     // Algorithm (e.g., 'AES-256-GCM', 'RSA-OAEP')
  publicKey?: string;    // Public key for asymmetric encryption (PEM format)
  privateKey?: string;   // Private key for asymmetric encryption (PEM format)
  secretKey?: string;    // Secret key for symmetric encryption (base64 encoded)
  keyUse: 'enc';         // Key usage: encryption
  status: KeyStatus;     // Current status
  metadata: KeyMetadata; // Additional metadata
}
```

#### Key Status and Metadata

```typescript
type KeyStatus = 'primary' | 'active' | 'inactive' | 'expired' | 'compromised';

interface KeyMetadata {
  createdAt: Date;       // Creation timestamp
  activatedAt?: Date;    // Activation timestamp
  expiresAt?: Date;      // Expiration timestamp
  revokedAt?: Date;      // Revocation timestamp
  rotatedKeyId?: string; // ID of key that replaced this one
  description?: string;  // Optional description
  usageCount?: number;   // Number of times key has been used
  lastUsedAt?: Date;     // Last usage timestamp
  tags?: string[];       // Custom tags
}
```

### Key Generation

Secure generation of cryptographic keys:

```typescript
async function generateSigningKey(
  algorithm: string = 'ES256',
  expiresInDays: number = 90
): Promise<SigningKey> {
  try {
    // 1. Validate algorithm is supported
    validateSigningAlgorithm(algorithm);
    
    // 2. Determine key type from algorithm
    const keyType = algorithm.startsWith('ES') ? 'EC' : 'RSA';
    
    // 3. Determine curve or key size
    const params = getKeyParamsForAlgorithm(algorithm);
    
    // 4. Generate key pair
    let keyPair;
    
    if (config.useHsm && hsmProvider) {
      // Generate in HSM if available
      keyPair = await hsmProvider.generateKeyPair(keyType, params);
    } else {
      // Generate using software
      keyPair = await generateKeyPairInSoftware(keyType, params);
    }
    
    // 5. Create expiration date
    const now = new Date();
    const expiresAt = new Date();
    expiresAt.setDate(now.getDate() + expiresInDays);
    
    // 6. Create key ID
    const id = generateKeyId();
    
    // 7. Create key object
    const key: SigningKey = {
      id,
      type: keyType,
      algorithm,
      publicKey: keyPair.publicKey,
      privateKey: await encryptPrivateKey(keyPair.privateKey),
      keyUse: 'sig',
      status: 'inactive', // Initially inactive until activated
      metadata: {
        createdAt: now,
        expiresAt,
        tags: ['signing', algorithm]
      }
    };
    
    // 8. Store the key
    await storeKey(key);
    
    // 9. Log the key generation
    await auditLogger.log('key.generated', {
      keyId: id,
      algorithm,
      keyType,
      keyUse: 'sig',
      expiresAt
    });
    
    return key;
  } catch (error) {
    await logger.error('Failed to generate signing key', { 
      error, 
      algorithm 
    });
    throw new Error(`Key generation failed: ${error.message}`);
  }
}
```

### Key Retrieval

Secure retrieval of keys for cryptographic operations:

```typescript
async function getActiveSigningKey(algorithm?: string): Promise<SigningKey> {
  // 1. Build query
  const query: any = {
    keyUse: 'sig',
    status: 'primary',
    type: { $in: ['EC', 'RSA'] }
  };
  
  if (algorithm) {
    query.algorithm = algorithm;
  }
  
  // 2. Find primary key
  let key = await keyStore.findOne(query);
  
  // 3. If no primary key, look for any active key
  if (!key) {
    query.status = 'active';
    key = await keyStore.findOne(query);
  }
  
  // 4. If still no key, return error
  if (!key) {
    throw new Error(`No active signing key available${algorithm ? ` for algorithm ${algorithm}` : ''}`);
  }
  
  // 5. Decrypt private key if necessary
  if (key.privateKey) {
    key.privateKey = await decryptPrivateKey(key.privateKey);
  }
  
  // 6. Update usage statistics
  await updateKeyUsage(key.id);
  
  return key;
}
```

### Key Lifecycle Management

Managing the complete lifecycle of cryptographic keys:

```typescript
async function rotateKeyForUse(
  keyUse: 'sig' | 'enc',
  algorithm?: string
): Promise<string> {
  // 1. Find current key to determine algorithm if not specified
  if (!algorithm) {
    const currentKey = await keyStore.findOne({
      keyUse,
      status: 'primary'
    });
    
    if (currentKey) {
      algorithm = currentKey.algorithm;
    } else {
      // Default algorithms if no current key
      algorithm = keyUse === 'sig' ? 'ES256' : 'AES-256-GCM';
    }
  }
  
  // 2. Generate new key
  let newKey;
  
  if (keyUse === 'sig') {
    if (algorithm.startsWith('HS')) {
      newKey = await generateHmacKey(algorithm);
    } else {
      newKey = await generateSigningKey(algorithm);
    }
  } else {
    newKey = await generateEncryptionKey(algorithm);
  }
  
  // 3. Activate the new key
  await activateKey(newKey.id);
  
  // 4. Set as primary
  await setPrimaryKey(newKey.id);
  
  // 5. Log the rotation
  await auditLogger.log('key.rotated', {
    keyId: newKey.id,
    keyUse,
    algorithm
  });
  
  return newKey.id;
}
```

### Key Storage Security

Secure storage of sensitive key material:

```typescript
// Encrypt a private key before storage
async function encryptPrivateKey(privateKeyPem: string): Promise<string> {
  // 1. Get the data encryption key
  const encryptionKey = await getDataEncryptionKey();
  
  // 2. Generate a random IV
  const iv = crypto.randomBytes(16);
  
  // 3. Create cipher
  const cipher = crypto.createCipheriv(
    'aes-256-gcm',
    Buffer.from(encryptionKey, 'base64'),
    iv
  );
  
  // 4. Encrypt the private key
  let encrypted = cipher.update(privateKeyPem, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  
  // 5. Get the auth tag
  const authTag = cipher.getAuthTag().toString('base64');
  
  // 6. Return encrypted key with IV and auth tag
  return JSON.stringify({
    iv: iv.toString('base64'),
    data: encrypted,
    tag: authTag
  });
}
```

### Hardware Security Module Integration

Integration with HSMs for enhanced security:

```typescript
// Interface for HSM providers
interface HsmProvider {
  // Generate key pair within the HSM
  generateKeyPair(
    keyType: 'EC' | 'RSA',
    params: KeyParams
  ): Promise<{ publicKey: string; privateKey?: string; keyHandle?: string }>;
  
  // Sign data using a key in the HSM
  sign(
    keyId: string,
    data: Buffer,
    algorithm: string
  ): Promise<Buffer>;
  
  // Other HSM operations...
}
```

### Edge Cases and Error Handling

The Key Manager addresses numerous edge cases to maintain security:

| Scenario | Handling Approach |
|----------|-------------------|
| HSM unavailability | Fallback to software-based operations with appropriate logging |
| Key compromise | Immediate revocation, rotation, and security notifications |
| Expired keys | Automatic detection and replacement via scheduled rotation |
| Algorithm deprecation | Supporting key migration to newer, stronger algorithms |
| Key version conflicts | Version tracking and graceful handling of retired keys |
| Concurrent key operations | Transactional operations to prevent race conditions |
| Invalid key parameters | Strict validation before key generation and usage |

For comprehensive details on handling security-related edge cases, see the [Security Considerations](../security_considerations.md#key-management) document.

## Performance Considerations

The Key Manager implements various optimizations for high-performance operation:

| Operation | Optimization Strategy | Impact |
|-----------|------------------------|--------|
| Key retrieval | In-memory caching of active keys | Sub-millisecond key access |
| Key generation | Parallel operations for batch generation | Efficient key provisioning |
| Signature verification | Optimized crypto libraries | High-throughput verification |
| Public key distribution | Cached JWKS endpoints | Efficient token validation |
| Key storage | Compressed and optimized formats | Reduced storage requirements |
| Cryptographic operations | Hardware acceleration when available | Faster encryption/signing |

### Caching Strategy

```typescript
// Get the data encryption key (DEK) with caching
async function getDataEncryptionKey(): Promise<string> {
  // Check if DEK is in cache
  if (keyCache.has('dataEncryptionKey')) {
    return keyCache.get('dataEncryptionKey');
  }
  
  let dek;
  
  // Check if we should use an external key management service
  if (config.useExternalKms) {
    // Get key from KMS
    dek = await kmsProvider.getDataEncryptionKey();
  } else {
    // Get key from secure storage or generate if not exists
    dek = await getOrCreateDataEncryptionKey();
  }
  
  // Cache the key
  keyCache.set('dataEncryptionKey', dek, { ttl: config.keyCache.ttl });
  
  return dek;
}
```

## Automated Key Rotation

```typescript
// Automatic key rotation job
async function scheduleKeyRotations(): Promise<void> {
  // Get configuration
  const config = await configService.getKeyRotationConfig();
  
  // Schedule based on configuration
  scheduler.scheduleJob('rotate-signing-keys', config.signingKeyRotationCron, async () => {
    await rotateExpiringKeys('sig');
  });
  
  scheduler.scheduleJob('rotate-encryption-keys', config.encryptionKeyRotationCron, async () => {
    await rotateExpiringKeys('enc');
  });
}
```

## Related Documentation

* [Token Service](./token_service.md)
* [Auth Provider](./auth_provider.md)
* [Cryptographic Standards](../standards/cryptography.md)
* [Security Architecture](../security_architecture.md)
* [Compliance Requirements](../compliance/requirements.md)

## Summary

The Key Manager provides the cryptographic foundation for the Auth Service's security infrastructure, handling the complete lifecycle of cryptographic keys. By implementing defense-in-depth principles and following industry best practices for key management, it ensures the security of authentication tokens, sensitive data encryption, and other cryptographic operations.

The component balances security with performance through careful implementation of caching strategies and hardware acceleration when available. Its support for both software-based cryptography and hardware security modules (HSMs) allows for deployment flexibility while maintaining strong security guarantees.

Through automated key rotation and comprehensive audit logging, the Key Manager maintains security over time while enabling operational visibility. Its cryptographic services power the Token Service's JWT capabilities, providing a secure foundation for the entire authentication and authorization system.


