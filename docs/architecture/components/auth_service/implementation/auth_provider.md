# Authentication Provider

## Overview

The Authentication Provider is a core component of the Auth Service responsible for managing all aspects of user authentication, credential verification, and session management. It establishes and verifies user identity using multiple authentication mechanisms while enforcing security policies.

## Key Responsibilities

* User authentication via multiple mechanisms (username/password, MFA, social identity)
* Secure credential storage and verification
* Password policy enforcement and strength validation
* Account security (lockouts, anomaly detection)
* User registration and account verification

## Implementation Approach

The Authentication Provider follows these design principles:

1. **Defense in Depth** - Multiple layers of security controls to protect against various attack vectors
2. **Secure by Default** - Conservative security settings by default with optional relaxation where appropriate
3. **Configurability** - Extensive configuration options for adapting to different security requirements
4. **Performance Optimized** - Critical path operations are optimized for speed without compromising security
5. **Compliance Aware** - Implementation choices align with security best practices and regulations

For detailed security considerations relating to authentication, please refer to the [Security Considerations](../security_considerations.md#authentication-security) document.

## Authentication Lifecycle

```
┌───────────────┐
│ Unauthenticated│
└───────┬───────┘
        │
        ▼
┌───────────────┐     ┌─────────────────┐
│  Primary Auth  │────►│   MFA Required   │
└───────┬───────┘     └─────────┬────────┘
        │                       │
        │                       │
        ▼                       ▼
┌───────────────┐     ┌─────────────────┐
│ Authenticated  │◄────│   MFA Verified   │
└───────┬───────┘     └─────────────────┘
        │
        ▼
┌───────────────┐
│  Session End   │
└───────────────┘
```

## Implementation Details

### Authentication Mechanisms

The Authentication Provider supports multiple authentication mechanisms:

#### Username/Password Authentication

Username/password authentication follows a secure flow:

1. User submits username and password
2. System retrieves user record by username
3. Password is verified against stored hash using constant-time comparison
4. If verified, check if MFA is required
5. Generate and return authentication token if all verifications pass

```typescript
async function authenticateWithPassword(
  username: string,
  password: string,
  metadata: LoginMetadata
): Promise<AuthResult> {
  try {
    // Get user by username or email
    const user = await userManager.findByUsername(username);
    
    // User not found - use constant time comparison to prevent timing attacks
    if (!user) {
      await secureCompare(password, DUMMY_HASH);
      return { success: false, error: 'invalid_credentials' };
    }
    
    // Check if account is locked
    const lockStatus = await accountLocker.checkLockStatus(user.id);
    if (lockStatus.locked) {
      return { success: false, error: 'account_locked', lockStatus };
    }
    
    // Verify password
    const passwordValid = await verifyPassword(password, user.passwordHash);
    
    // Handle failed attempt
    if (!passwordValid) {
      await accountLocker.recordFailedAttempt(user.id);
      return { success: false, error: 'invalid_credentials' };
    }
    
    // Reset failed attempts counter on successful login
    await accountLocker.resetFailedAttempts(user.id);
    
    // Check if MFA is required
    const requireMfa = await mfaService.isMfaRequired(user.id);
    
    if (requireMfa) {
      // Generate temporary token for MFA flow
      const mfaToken = await tokenService.generateMfaToken(user.id);
      return { 
        success: true, 
        requiresMfa: true,
        mfaToken
      };
    }
    
    // Generate authentication token
    const token = await tokenService.generateAuthToken(user.id);
    
    // Record successful login
    await securityMonitor.recordLoginEvent(user.id, 'password_login', metadata);
    
    return {
      success: true,
      token,
      user: sanitizeUserData(user)
    };
  } catch (error) {
    // Log the error but return generic message to client
    await logger.error('Authentication error', { error, username });
    return { success: false, error: 'authentication_error' };
  }
}
```

#### Multi-Factor Authentication (MFA)

The Authentication Provider supports multiple MFA methods:

1. **TOTP (Time-based One-Time Password)** - Using authenticator apps
2. **SMS Codes** - Sending one-time codes via SMS
3. **Email Codes** - Sending one-time codes via email

MFA verification follows a standard flow:

```typescript
async function verifyMfaCode(
  mfaToken: string,
  code: string,
  method: MfaMethod
): Promise<AuthResult> {
  // Validate MFA token
  const tokenData = await tokenService.validateMfaToken(mfaToken);
  if (!tokenData) {
    return { success: false, error: 'invalid_mfa_token' };
  }
  
  // Verify MFA code
  const verified = await mfaService.verifyCode(tokenData.userId, code, method);
  
  if (!verified) {
    return { success: false, error: 'invalid_mfa_code' };
  }
  
  // Generate full authentication token
  const token = await tokenService.generateAuthToken(tokenData.userId);
  
  // Get user data
  const user = await userManager.getUserById(tokenData.userId);
  
  // Record successful MFA verification
  await securityMonitor.recordLoginEvent(
    tokenData.userId, 
    'mfa_verified', 
    { method }
  );
  
  return {
    success: true,
    token,
    user: sanitizeUserData(user)
  };
}
```

#### Social Identity Authentication

The Authentication Provider supports authentication via third-party identity providers:

1. **OAuth Flow** - Standard OAuth 2.0 flow with identity providers
2. **Account Linking** - Linking social identities to existing accounts
3. **Profile Synchronization** - Optionally synchronizing profile data

### Password Handling

Password security is managed through:

#### Password Hashing

Passwords are hashed using Argon2id with:

1. Unique salt per password
2. Configurable work factor based on environment
3. Memory-hard algorithm resistant to specialized hardware attacks

For comprehensive details on password security, including implementation best practices, see the [Security Considerations](../security_considerations.md#password-handling) document.

```typescript
async function hashPassword(password: string): Promise<string> {
  // Get current password policy
  const policy = await configService.getPasswordPolicy();
  
  // Generate unique salt
  const salt = crypto.randomBytes(16);
  
  // Hash password with Argon2id
  const hash = await argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: policy.memoryCost,
    timeCost: policy.timeCost,
    parallelism: policy.parallelism,
    salt
  });
  
  return hash;
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  // Constant-time verification
  return await argon2.verify(hash, password);
}
```

#### Password Policy Enforcement

Password policies enforce security requirements:

1. Minimum length requirements
2. Character complexity rules (uppercase, lowercase, numbers, special chars)
3. Common password checking
4. Personal information detection
5. Breached password detection

```typescript
async function validatePasswordStrength(
  password: string,
  userData: UserData
): Promise<PasswordValidationResult> {
  const policy = await configService.getPasswordPolicy();
  const errors = [];
  
  // Check minimum length
  if (password.length < policy.minLength) {
    errors.push(`Password must be at least ${policy.minLength} characters`);
  }
  
  // Check character requirements
  if (policy.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (policy.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (policy.requireNumbers && !/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (policy.requireSpecial && !/[^A-Za-z0-9]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  // Check against common passwords
  if (policy.preventCommonPasswords) {
    const isCommon = await dictionaryService.isCommonPassword(password);
    if (isCommon) {
      errors.push('This password is too common and easily guessable');
    }
  }
  
  // Check for user data in password
  if (policy.preventUserDataInPassword) {
    const containsUserData = checkPasswordForUserData(password, userData);
    if (containsUserData) {
      errors.push('Password cannot contain personal information');
    }
  }
  
  // Check against breached passwords
  if (policy.checkBreachedPasswords) {
    const isBreached = await breachService.isPasswordBreached(password);
    if (isBreached) {
      errors.push('This password has appeared in a data breach');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}
```

### Security Features

#### Account Locking

The Account Locker component protects against brute force attacks by implementing:

1. **Progressive Delays**: Increasing wait times between login attempts
2. **Temporary Lockouts**: Automatically locking accounts after multiple failed attempts
3. **Permanent Lockouts**: Requiring administrative intervention after sustained attack patterns
4. **Notification**: Alerting users of lockout events via email or other channels

```typescript
async function recordFailedAttempt(userId: string): Promise<LockStatus> {
  // Get current policy
  const policy = await configService.getAccountLockPolicy();
  
  // Get current failed attempts
  const failedAttempts = await getFailedAttempts(userId);
  
  // Increment failed attempts
  await incrementFailedAttempts(userId);
  
  // Determine lock status
  if (failedAttempts + 1 >= policy.maxFailedAttempts) {
    const lockDuration = policy.lockDuration * Math.pow(2, Math.min(failedAttempts - policy.maxFailedAttempts, 3));
    
    // Lock account
    await lockAccount(userId, lockDuration);
    
    // Notify user if enabled
    if (policy.notifyOnLock) {
      await notificationService.sendAccountLockNotification(userId, lockDuration);
    }
    
    // Log security event
    securityMonitor.recordEvent('account_locked', { userId, duration: lockDuration });
    
    return {
      locked: true,
      duration: lockDuration,
      reason: 'too_many_failed_attempts'
    };
  }
  
  return { locked: false };
}
```

#### Security Monitoring

The Security Monitor tracks authentication events to detect potential security threats:

1. **Login Patterns**: Analysis of login times, locations, and devices
2. **Anomaly Detection**: Flagging unusual authentication patterns
3. **Login Geography**: Detection of impossible travel scenarios
4. **Rate Limiting**: Preventing authentication flooding
5. **Audit Logging**: Comprehensive logging of authentication events

### User Registration and Account Management

User registration handles account creation with:

1. Data validation
2. Duplicate checking
3. Password policy enforcement
4. Email verification
5. Event publishing

```typescript
async function registerUser(
  registrationData: UserRegistrationData
): Promise<RegistrationResult> {
  const { username, email, password, ...userData } = registrationData;
  
  // Validate registration data
  const validationErrors = validateRegistrationData(registrationData);
  if (validationErrors.length > 0) {
    return { success: false, errors: validationErrors };
  }
  
  // Check if username or email already exists
  const existingUser = await userManager.checkExistingIdentifiers(username, email);
  if (existingUser) {
    const field = existingUser.username === username ? 'username' : 'email';
    return { success: false, errors: [`${field}_already_exists`] };
  }
  
  // Validate password strength
  const passwordResult = await validatePasswordStrength(password, registrationData);
  if (!passwordResult.isValid) {
    return { success: false, errors: passwordResult.errors };
  }
  
  // Hash password
  const passwordHash = await hashPassword(password);
  
  // Create user
  const user = await userManager.createUser({
    username,
    email,
    passwordHash,
    ...userData,
    status: config.requireEmailVerification ? 'pending' : 'active',
    emailVerified: false
  });
  
  // Send verification email if required
  if (config.requireEmailVerification) {
    const verificationToken = await tokenService.generateEmailVerificationToken(user.id);
    await notificationService.sendVerificationEmail(email, verificationToken);
  }
  
  // Publish user creation event
  eventDispatcher.publish('user.created', {
    userId: user.id,
    username: user.username,
    timestamp: new Date().toISOString()
  });
  
  return {
    success: true,
    user: sanitizeUserData(user),
    requiresVerification: config.requireEmailVerification
  };
}
```

### Edge Cases and Error Handling

The implementation addresses the following edge cases:

| Scenario | Handling Approach |
|----|----|
| Invalid credentials | Generic error messages that don't leak information |
| Account lockout | Clear user feedback with lockout duration |
| MFA verification failure | Limited attempts with exponential backoff |
| Network failures | Graceful degradation with informative errors |
| Breached/common passwords | Clear feedback on password policy violations |

## Performance Considerations

Authentication is a critical path operation with optimizations:

1. **Caching**: User data and configuration settings are cached to reduce database load
2. **Asynchronous Operations**: Non-critical operations like logging and event publishing are performed asynchronously
3. **Configurable Work Factors**: Password hashing parameters are configurable based on deployment environment
4. **Connection Pooling**: Database connections are pooled for efficiency in hosted deployments
5. **Lean Dependencies**: Minimal dependency footprint, especially important for serverless deployments

### Platform Compatibility

The Authentication Provider works in both traditional hosted environments and serverless architectures:

1. **Stateless Design**: Core authentication functions don't rely on local state
2. **Database-Backed Sessions**: All session data is stored in the database
3. **Configurable Adapters**: Storage and notification adapters can be swapped based on deployment model

## Related Documentation

* [Token Service](./token_service.md)
* [User Manager](./user_manager.md)
* [Security Considerations](../security_considerations.md)
* [Web Application Security Model](../../web_application/technical_architecture/security_model.md)
* [Web Application API Integration](../../web_application/technical_architecture/api_integration.md)
* [Validation Service Security Configuration](../../validation_service/operations/configuration.md)

## Summary

The Authentication Provider forms the entry point for user authentication in the Auth Service. It orchestrates the complex flows of user authentication, manages various authentication methods, and enforces security policies. By following security best practices such as proper password hashing, MFA implementation, and account protection, it provides robust and configurable authentication services for the entire platform.

Implementation principles focus on defense in depth, with multiple layers of security and comprehensive logging to detect and respond to potential security threats. The component balances security with usability, offering a range of authentication options while maintaining strong security controls.

For detailed information on security practices, refer to the [Security Considerations](../security_considerations.md) document.


