# Basic Authentication Example

This document provides a simple example of how to use the Authentication Service for common authentication flows.

## User Registration and Login Example

The following example illustrates a basic authentication flow that:

1. Registers a new user account
2. Logs in with the new account credentials
3. Accesses a protected resource using the JWT token
4. Refreshes the token when it expires
5. Logs out to invalidate the token

### User Registration

```bash
curl -X POST https://api.example.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecureP@ssw0rd123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

#### Response

```json
{
  "userId": "usr_b8e49ac571b24c8f94b1",
  "email": "user@example.com",
  "createdAt": "2023-09-01T10:15:00Z",
  "status": "PENDING_VERIFICATION",
  "message": "Please check your email for verification instructions"
}
```

### Email Verification

```bash
curl -X POST https://api.example.com/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "verificationToken": "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9..."
  }'
```

#### Response

```json
{
  "userId": "usr_b8e49ac571b24c8f94b1",
  "email": "user@example.com",
  "status": "ACTIVE",
  "message": "Email verified successfully. You can now log in."
}
```

### User Login

```bash
curl -X POST https://api.example.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecureP@ssw0rd123"
  }'
```

#### Response

```json
{
  "accessToken": "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600,
  "tokenType": "Bearer",
  "user": {
    "id": "usr_b8e49ac571b24c8f94b1",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "roles": ["user"]
  }
}
```

### Accessing Protected Resources

```bash
curl -X GET https://api.example.com/api/protected-resource \
  -H "Authorization: Bearer eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### Response

```json
{
  "id": "resource_123",
  "name": "Protected Resource",
  "data": "This is sensitive data that requires authentication"
}
```

### Token Refresh

```bash
curl -X POST https://api.example.com/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9..."
  }'
```

#### Response

```json
{
  "accessToken": "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600,
  "tokenType": "Bearer"
}
```

### Logout

```bash
curl -X POST https://api.example.com/auth/logout \
  -H "Authorization: Bearer eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9..."
  }'
```

#### Response

```json
{
  "message": "Successfully logged out",
  "status": "success"
}
```

## Code Examples

### JavaScript/TypeScript Example

```typescript
import { AuthClient } from '@example/auth-client';

async function authenticationFlow() {
  // Initialize the client
  const authClient = new AuthClient({
    baseUrl: 'https://api.example.com/auth'
  });

  // Register a new user
  const registrationResult = await authClient.register({
    email: 'user@example.com',
    password: 'SecureP@ssw0rd123',
    firstName: 'John',
    lastName: 'Doe'
  });

  console.log(`User registered with ID: ${registrationResult.userId}`);
  console.log(`Status: ${registrationResult.status}`);

  // Simulate email verification (in a real app, user would click a link in their email)
  // This is just for the example - normally you wouldn't have access to this token
  const emailVerificationResult = await authClient.verifyEmail({
    verificationToken: 'token-from-email-link'
  });

  console.log(`Email verification status: ${emailVerificationResult.status}`);

  // Login with the registered credentials
  const loginResult = await authClient.login({
    email: 'user@example.com',
    password: 'SecureP@ssw0rd123'
  });

  console.log(`Login successful. Token expires in ${loginResult.expiresIn} seconds`);
  
  // Store tokens securely
  authClient.setTokens({
    accessToken: loginResult.accessToken,
    refreshToken: loginResult.refreshToken
  });

  // Use the client to make authenticated requests
  const protectedResource = await authClient.fetch('/api/protected-resource');
  console.log('Protected resource:', protectedResource);

  // Refresh token when needed (client can do this automatically)
  const refreshResult = await authClient.refreshToken();
  console.log('Token refreshed. New expiry:', refreshResult.expiresIn);
  
  // Logout when done
  const logoutResult = await authClient.logout();
  console.log(logoutResult.message);
}

authenticationFlow().catch(error => {
  console.error('Authentication error:', error);
});
```

### Python Example

```python
from auth_service_client import AuthClient

# Initialize the client
auth_client = AuthClient(
    base_url="https://api.example.com/auth"
)

try:
    # Register a new user
    registration_result = auth_client.register(
        email="user@example.com",
        password="SecureP@ssw0rd123",
        first_name="John",
        last_name="Doe"
    )

    print(f"User registered with ID: {registration_result['userId']}")
    print(f"Status: {registration_result['status']}")

    # Simulate email verification (in a real app, user would click a link in their email)
    # This is just for the example - normally you wouldn't have access to this token
    email_verification_result = auth_client.verify_email(
        verification_token="token-from-email-link"
    )

    print(f"Email verification status: {email_verification_result['status']}")

    # Login with the registered credentials
    login_result = auth_client.login(
        email="user@example.com",
        password="SecureP@ssw0rd123"
    )

    print(f"Login successful. Token expires in {login_result['expiresIn']} seconds")
    
    # Store tokens (handled internally by the client)
    auth_client.set_tokens(
        access_token=login_result["accessToken"],
        refresh_token=login_result["refreshToken"]
    )

    # Use the client to make authenticated requests
    protected_resource = auth_client.fetch("/api/protected-resource")
    print("Protected resource:", protected_resource)

    # Refresh token when needed
    refresh_result = auth_client.refresh_token()
    print(f"Token refreshed. New expiry: {refresh_result['expiresIn']}")
    
    # Logout when done
    logout_result = auth_client.logout()
    print(logout_result["message"])

except Exception as e:
    print(f"Authentication error: {str(e)}")
```

## Common Errors and Troubleshooting

| Error Code | Description | Solution |
|------------|-------------|----------|
| `AUTH_001` | Invalid credentials | Check that the email and password are correct |
| `AUTH_002` | Account not verified | Verify your email address by clicking the link in the verification email |
| `AUTH_003` | Account locked | Contact support or wait for the lockout period to end (typically 15 minutes) |
| `AUTH_004` | Invalid token | The token has expired or is malformed. Try refreshing or logging in again |
| `AUTH_005` | Refresh token expired | You need to log in again to get new tokens |
| `AUTH_006` | Password does not meet requirements | Use a password that meets the minimum requirements (length, complexity) |
| `AUTH_007` | Email already registered | Use a different email or reset your password if this is your account |

## Security Best Practices

1. **Store tokens securely**:
   - In browser applications, use HttpOnly cookies or secure storage (not localStorage)
   - In mobile applications, use secure storage mechanisms specific to the platform
   - In server applications, use secure environment variables or secret management systems

2. **Handle token expiration gracefully**:
   - Implement automatic token refresh
   - Redirect to login when refresh tokens expire
   - Consider silent authentication for better UX

3. **Protect against common attacks**:
   - Implement CSRF protection when using cookies
   - Set appropriate CORS headers on the server
   - Use TLS for all API communications

## Next Steps

Once you've implemented basic authentication, consider:

1. [Adding Multi-Factor Authentication](./mfa_authentication.md)
2. [Implementing Service-to-Service Authentication](./service_to_service_auth.md)
3. [Enforcing Role-Based Access Controls](./role_based_access.md)
4. [Validating Tokens in Microservices](./token_validation.md)

## Related Documentation

* [Auth Service Overview](../overview.md)
* [Auth Service API Reference](../interfaces/api.md)
* [Authentication Provider Implementation](../implementation/auth_provider.md)
* [Token Service Implementation](../implementation/token_service.md)
* [Security Considerations](../security_considerations.md) 