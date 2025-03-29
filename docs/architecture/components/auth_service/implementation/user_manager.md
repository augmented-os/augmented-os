# User Manager

## Overview

The User Manager is a core component of the Auth Service responsible for managing user identities, profiles, and account lifecycle operations. It maintains the user data store and provides secure methods for creating, retrieving, updating, and deleting user records while enforcing business rules and security policies.

## Key Responsibilities

* Creating, retrieving, updating, and deleting user accounts
* Managing user profile information and preferences
* Handling user identifiers (username, email, phone) with uniqueness enforcement
* Assigning and managing user roles and permissions
* Supporting account verification, recovery, and security features
* Enabling user search and filtering capabilities
* Integrating with external identity providers (LDAP, social logins)

## Implementation Approach

The User Manager follows these design principles:

1. **Privacy by Design** - Implementation choices prioritize user privacy and regulatory compliance
2. **Secure by Default** - Conservative security settings with protection against common attack vectors
3. **Flexibility** - Configurable validation rules and extensible user schemas
4. **Scalability** - Architecture designed for horizontal scaling with growing user bases
5. **Auditability** - Comprehensive audit trail for all security-relevant operations

## User Lifecycle

```
┌───────────────┐
│  Registration │
└───────┬───────┘
        │
        ▼
┌───────────────┐     ┌─────────────────┐
│  Verification  │────►│   Active User   │
└───────┬───────┘     └─────────┬────────┘
        │                       │
        │                       │
        ▼                       ▼
┌───────────────┐     ┌─────────────────┐
│   Inactive    │◄────│ Account Update  │
└───────┬───────┘     └─────────────────┘
        │
        ▼
┌───────────────┐
│   Deleted     │
└───────────────┘
```

## Implementation Details

### Data Model

The User Manager operates on the following primary data structures:

#### User Account

The User Manager uses the User entity as defined in the [Authentication Service Data Model](../data_model.md#user).

For implementation purposes, the TypeScript interface follows this structure:

```typescript
// See full definition in ../data_model.md
interface User {
  id: string;              // Unique identifier
  username: string;        // Unique username
  email: string;           // Unique email address
  // ... other fields defined in data_model.md ...
}
```

#### User Profile

The User Profile entity is defined in the [Authentication Service Data Model](../data_model.md#user).

```typescript
// See full definition in ../data_model.md
interface UserProfile {
  userId: string;           // Reference to user
  displayName?: string;     // Public display name
  // ... other fields defined in data_model.md ...
}
```

### User Registration

The registration process handles creating new user accounts with appropriate validation:

```typescript
async function registerUser(data: UserRegistrationData): Promise<User> {
  // 1. Validate input data
  validateUserData(data);
  
  // 2. Check if username or email already exists
  await ensureUniqueIdentifiers(data.username, data.email);
  
  // 3. Hash password
  const passwordHash = await securityService.hashPassword(data.password);
  
  // 4. Create user record
  const user = await db.users.create({
    ...data,
    passwordHash,
    status: config.requireEmailVerification ? 'pending' : 'active',
    emailVerified: false,
    phoneVerified: false,
    mfaEnabled: false,
    failedLoginAttempts: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  
  // 5. Create default profile
  await createDefaultProfile(user.id);
  
  // 6. Assign default roles
  await assignDefaultRoles(user.id);
  
  // 7. Trigger verification process if required
  if (config.requireEmailVerification) {
    await sendEmailVerification(user.email);
  }
  
  // 8. Dispatch user created event
  await eventDispatcher.dispatch('user.created', { userId: user.id });
  
  return user;
}
```

### Account Security

The User Manager implements several security measures:

#### Account Lockout

```typescript
async function handleFailedLoginAttempt(user: User): Promise<void> {
  const maxAttempts = config.security.maxFailedLoginAttempts || 5;
  const lockDuration = config.security.accountLockDuration || 30; // minutes
  
  const attempts = user.failedLoginAttempts + 1;
  const updates: Partial<User> = {
    failedLoginAttempts: attempts,
    updatedAt: new Date()
  };
  
  // Lock account if max attempts reached
  if (attempts >= maxAttempts) {
    const lockUntil = new Date();
    lockUntil.setMinutes(lockUntil.getMinutes() + lockDuration);
    updates.lockedUntil = lockUntil;
    
    await eventDispatcher.dispatch('user.account.locked', {
      userId: user.id,
      attempts,
      lockedUntil: lockUntil
    });
  }
  
  await db.users.update(updates, { where: { id: user.id } });
}
```

#### Account Recovery

```typescript
async function initiatePasswordReset(email: string): Promise<boolean> {
  // 1. Find user by email
  const user = await db.users.findOne({ where: { email } });
  
  if (!user) {
    // Return true even if user not found to prevent email enumeration
    return true;
  }
  
  // 2. Generate unique reset token with expiration
  const token = generateSecureToken();
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24); // 24 hour expiration
  
  // 3. Store token in database
  await db.passwordResetTokens.create({
    userId: user.id,
    token: await hashToken(token), // Store hashed token
    expiresAt,
    createdAt: new Date()
  });
  
  // 4. Send reset email with token
  await emailService.sendPasswordResetEmail(
    user.email,
    user.fullName,
    `${config.appUrl}/reset-password?token=${token}`
  );
  
  // 5. Log the event
  await auditLogger.log('password.reset.requested', {
    userId: user.id,
    email: user.email,
    ipAddress: requestContext.ipAddress,
    userAgent: requestContext.userAgent
  });
  
  return true;
}
```

### External Identity Integration

The User Manager supports integration with external identity providers:

#### Social Login

```typescript
async function findOrCreateUserFromSocialProfile(
  profile: SocialProfile
): Promise<User> {
  // Check if user already exists with this social profile
  const existingSocialLink = await db.userSocialProfiles.findOne({
    where: {
      provider: profile.provider,
      providerId: profile.providerId
    }
  });
  
  if (existingSocialLink) {
    return db.users.findOne({ where: { id: existingSocialLink.userId } });
  }
  
  // Check if user exists with same email
  const existingUser = await db.users.findOne({
    where: { email: profile.email }
  });
  
  if (existingUser) {
    // Link social profile to existing account
    await db.userSocialProfiles.create({
      userId: existingUser.id,
      provider: profile.provider,
      providerId: profile.providerId,
      profileData: profile.rawProfile,
      createdAt: new Date()
    });
    
    return existingUser;
  }
  
  // Create new user from social profile
  const userData: UserRegistrationData = {
    username: generateUniqueUsername(profile.name),
    email: profile.email,
    password: await generateSecureRandomPassword(),
    fullName: profile.name,
    metadata: {
      registrationSource: `social:${profile.provider}`
    }
  };
  
  const newUser = await registerUser(userData);
  
  // Create social profile link
  await db.userSocialProfiles.create({
    userId: newUser.id,
    provider: profile.provider,
    providerId: profile.providerId,
    profileData: profile.rawProfile,
    createdAt: new Date()
  });
  
  // Set email as verified if provider verifies emails
  if (['google', 'github', 'apple'].includes(profile.provider)) {
    await db.users.update({
      emailVerified: true,
      status: 'active'
    }, {
      where: { id: newUser.id }
    });
  }
  
  return newUser;
}
```

### Data Security

The User Manager protects sensitive data through encryption:

```typescript
async function encryptSensitiveData(data: string): Promise<string> {
  const key = await keyManager.getDataEncryptionKey();
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  
  let encrypted = cipher.update(data, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  
  const authTag = cipher.getAuthTag().toString('base64');
  
  return JSON.stringify({
    iv: iv.toString('base64'),
    data: encrypted,
    tag: authTag
  });
}
```

### Error Handling

The User Manager provides specific error types for different failure scenarios:

```typescript
class UserError extends Error {
  constructor(message: string, public code: string, public status: number = 400) {
    super(message);
    this.name = 'UserError';
  }
}

class UserNotFoundError extends UserError {
  constructor(identifier: string) {
    super(`User not found: ${identifier}`, 'USER_NOT_FOUND', 404);
    this.name = 'UserNotFoundError';
  }
}

class UserValidationError extends UserError {
  constructor(message: string, public validationErrors: Record<string, string>) {
    super(message, 'VALIDATION_ERROR', 400);
    this.name = 'UserValidationError';
  }
}
```

### Edge Cases and Error Handling

The implementation addresses the following edge cases:

| Scenario | Handling Approach |
|----|----|
| Duplicate usernames | Check uniqueness before creation and provide clear error message |
| Account lockout | Progressive lockout with exponential backoff and user notification |
| Email address changes | Require verification of new email before fully updating |
| Password reuse | Maintain password history and prevent reuse of recent passwords |
| Rate limiting | Implement throttling on sensitive operations to prevent abuse |
| Data migration | Support for importing users from legacy systems with data validation |

## Performance Considerations

The User Manager is optimized for performance in high-scale environments:

| Operation | Optimization Strategy | Impact |
|----|----|----|
| User lookup | Index optimization and caching | Sub-10ms retrieval times |
| Registration | Asynchronous verification emails | Faster user onboarding |
| Profile updates | Partial updates with field-level permissions | Reduced payload size |
| User search | Efficient query planning with pagination | Supports large user bases |
| Batch operations | Support for bulk updates | Efficient administration |

### Platform Compatibility

The User Manager is designed to work in various deployment models:

1. **Database Abstraction** - Support for multiple database backends (SQL, NoSQL)
2. **Service Independence** - Clear boundaries with other Auth Service components
3. **Cloud-Native Design** - Stateless operation suitable for containerized environments
4. **Observability** - Built-in metrics and structured logging

## Related Documentation

* [Auth Provider](./auth_provider.md)
* [Permission Manager](./permission_manager.md)
* [Security Considerations](../security_considerations.md)
* [Users Schema](./schemas/users.md)
* [Web Application Service User Profile](../../web_application_service/implementation/user_profile.md)
* [API Integration](../../web_application_service/technical_architecture/api_integration.md)
* [Token Service](./token_service.md)
* [Data Model](../data_model.md)
* [API Documentation](../interfaces/api.md)

## Summary

The User Manager is the central repository for user identity and profile information within the Auth Service. It provides a complete suite of functionality for managing user accounts throughout their lifecycle, from initial registration through various states (pending, active, locked, inactive) to account deletion.

The User Manager implements privacy by design principles, ensuring that user data is protected with appropriate encryption, access controls, and retention policies. It supports integration with external identity providers while maintaining a consistent internal user representation for the application.

By centralizing user management functionality, the component ensures consistent application of business rules and security policies across all user-related operations in the platform.


