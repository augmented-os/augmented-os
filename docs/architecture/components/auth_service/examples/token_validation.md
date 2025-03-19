# Token Validation Example

This document provides examples of how microservices and applications can validate JWT tokens issued by the Authentication Service without requiring additional calls to the Auth Service for each request.

## JWT Token Validation Flow

The following example illustrates how to properly validate tokens in your services:

1. Fetch and cache the JSON Web Key Set (JWKS) from the Auth Service
2. Extract the token from the Authorization header
3. Verify the token signature using the appropriate public key
4. Validate the token claims (expiration, issuer, audience, etc.)
5. Check the required scopes/permissions for the requested resource
6. Make authorization decisions based on the validated token

## Token Structure

Auth Service tokens follow the JWT standard with the following structure:

### Access Token Claims

```json
{
  "iss": "auth-service",           // Issuer - who created the token
  "sub": "usr_b8e49ac571b24c8f94b1", // Subject - user or service identifier
  "aud": "api",                   // Audience - intended recipient
  "iat": 1630498500,              // Issued At - when the token was created
  "exp": 1630502100,              // Expiration - when the token expires
  "nbf": 1630498500,              // Not Before - when the token becomes valid
  "jti": "abc123def456",          // JWT ID - unique identifier for this token
  "scope": "openid profile email", // OAuth 2.0 scopes
  "roles": ["user", "editor"],    // User roles for RBAC
  "permissions": [                // Fine-grained permissions
    "content:read",
    "content:write"
  ],
  "type": "access",               // Token type (access or refresh)
  "client_id": "web_app",         // Client that requested the token
  "tenant_id": "tenant_001",      // Multi-tenancy information (if applicable)
  "auth_time": 1630498490,        // When the user authenticated
  "acr": "2",                     // Authentication Context Class Reference
  "amr": ["pwd", "mfa"]           // Authentication Methods References
}
```

### Service Account Token Claims

For service-to-service authentication, tokens include additional claims:

```json
{
  "iss": "auth-service",
  "sub": "svc_7f9e51c3ad654b28",   // Service account ID
  "aud": "api",
  "iat": 1630498500,
  "exp": 1630502100,
  "nbf": 1630498500,
  "jti": "abc123def456",
  "scope": "workflow:read validation:write",
  "roles": ["service"],
  "permissions": [
    "workflow:read",
    "validation:write"
  ],
  "type": "access",
  "client_id": "val_svc_client_a1b2c3",
  "is_service_account": true,     // Indicates this is a service account
  "service_name": "validation-service"
}
```

## JWKS Endpoint

The Auth Service exposes a standard JWKS endpoint that provides the public keys needed to verify token signatures:

```bash
curl -X GET https://api.example.com/auth/.well-known/jwks.json
```

### Response

```json
{
  "keys": [
    {
      "kty": "EC",
      "crv": "P-256",
      "kid": "key-id-1",
      "x": "base64_encoded_x_coordinate",
      "y": "base64_encoded_y_coordinate",
      "use": "sig",
      "alg": "ES256"
    },
    {
      "kty": "RSA",
      "kid": "key-id-2",
      "n": "base64_encoded_modulus",
      "e": "AQAB",
      "use": "sig",
      "alg": "RS256"
    }
  ]
}
```

## Code Examples

### Node.js Token Validation Example

```javascript
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

class TokenValidator {
  constructor(options) {
    this.issuer = options.issuer || 'auth-service';
    this.audience = options.audience || 'api';
    
    // Create JWKS client to fetch and cache signing keys
    this.jwksClient = jwksClient({
      jwksUri: options.jwksUri || 'https://api.example.com/auth/.well-known/jwks.json',
      cache: true,
      cacheMaxAge: options.cacheMaxAge || 86400000, // 24 hours
      rateLimit: true,
      jwksRequestsPerMinute: options.jwksRequestsPerMinute || 10
    });
  }
  
  async getSigningKey(kid) {
    try {
      const key = await this.jwksClient.getSigningKey(kid);
      return key.getPublicKey();
    } catch (error) {
      throw new Error(`Failed to get signing key: ${error.message}`);
    }
  }
  
  async validateToken(token, requiredScopes = []) {
    try {
      // Decode token without verification to get the key ID
      const decoded = jwt.decode(token, { complete: true });
      if (!decoded || !decoded.header || !decoded.header.kid) {
        throw new Error('Invalid token: No key ID found in header');
      }
      
      // Get the signing key using the key ID from the token header
      const signingKey = await this.getSigningKey(decoded.header.kid);
      
      // Verify the token
      const verifiedToken = jwt.verify(token, signingKey, {
        algorithms: ['ES256', 'RS256'],
        issuer: this.issuer,
        audience: this.audience
      });
      
      // Validate scopes if provided
      if (requiredScopes.length > 0) {
        const tokenScopes = verifiedToken.scope ? verifiedToken.scope.split(' ') : [];
        const hasRequiredScopes = requiredScopes.every(scope => 
          tokenScopes.includes(scope)
        );
        
        if (!hasRequiredScopes) {
          throw new Error('Token is missing required scopes');
        }
      }
      
      return {
        valid: true,
        payload: verifiedToken
      };
    } catch (error) {
      return {
        valid: false,
        error: error.message
      };
    }
  }
  
  // Check if token has a specific permission
  hasPermission(token, requiredPermission) {
    if (!token.payload || !token.payload.permissions) {
      return false;
    }
    
    return token.payload.permissions.includes(requiredPermission);
  }
  
  // Check if token has a specific role
  hasRole(token, requiredRole) {
    if (!token.payload || !token.payload.roles) {
      return false;
    }
    
    return token.payload.roles.includes(requiredRole);
  }
}

// Example usage in Express middleware
function createAuthMiddleware(options) {
  const validator = new TokenValidator(options);
  
  return async function authMiddleware(req, res, next) {
    try {
      // Extract token from Authorization header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing or invalid authorization header' });
      }
      
      const token = authHeader.substring(7); // Remove 'Bearer ' prefix
      
      // Validate the token
      const result = await validator.validateToken(token, options.requiredScopes);
      
      if (!result.valid) {
        return res.status(401).json({ error: result.error });
      }
      
      // Check permissions if required
      if (options.requiredPermission && 
          !validator.hasPermission(result, options.requiredPermission)) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }
      
      // Check roles if required
      if (options.requiredRole && 
          !validator.hasRole(result, options.requiredRole)) {
        return res.status(403).json({ error: 'Insufficient role' });
      }
      
      // Store the validated token in the request for use in routes
      req.user = result.payload;
      
      // Continue to the next middleware/route handler
      next();
    } catch (error) {
      console.error('Authentication error:', error);
      res.status(500).json({ error: 'Internal server error during authentication' });
    }
  };
}

// Example usage in an Express app
const express = require('express');
const app = express();

// Middleware for routes requiring authentication
const requireAuth = createAuthMiddleware({
  jwksUri: 'https://api.example.com/auth/.well-known/jwks.json',
  issuer: 'auth-service',
  audience: 'api'
});

// Middleware for routes requiring specific scopes
const requireReadAccess = createAuthMiddleware({
  jwksUri: 'https://api.example.com/auth/.well-known/jwks.json',
  issuer: 'auth-service',
  audience: 'api',
  requiredScopes: ['read']
});

// Middleware for routes requiring specific permissions
const requireAdminAccess = createAuthMiddleware({
  jwksUri: 'https://api.example.com/auth/.well-known/jwks.json',
  issuer: 'auth-service',
  audience: 'api',
  requiredRole: 'admin'
});

// Public route - no authentication required
app.get('/api/public', (req, res) => {
  res.json({ message: 'This is public data' });
});

// Protected route - requires valid authentication
app.get('/api/protected', requireAuth, (req, res) => {
  res.json({ 
    message: 'This is protected data',
    userId: req.user.sub
  });
});

// Route requiring read scope
app.get('/api/data', requireReadAccess, (req, res) => {
  res.json({ 
    message: 'This is data that requires read permission',
    userId: req.user.sub
  });
});

// Route requiring admin role
app.get('/api/admin', requireAdminAccess, (req, res) => {
  res.json({ 
    message: 'This is admin-only data',
    userId: req.user.sub
  });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

### Python Token Validation Example

```python
import time
import jwt
from jwt.jwks_client import PyJWKClient
from flask import Flask, request, jsonify, g
from functools import wraps

class TokenValidator:
    def __init__(self, options):
        self.issuer = options.get('issuer', 'auth-service')
        self.audience = options.get('audience', 'api')
        jwks_uri = options.get('jwks_uri', 'https://api.example.com/auth/.well-known/jwks.json')
        
        # Create JWKS client to fetch and cache signing keys
        self.jwks_client = PyJWKClient(jwks_uri)
    
    def validate_token(self, token, required_scopes=None):
        try:
            # Get the signing key
            signing_key = self.jwks_client.get_signing_key_from_jwt(token)
            
            # Verify the token
            payload = jwt.decode(
                token,
                signing_key.key,
                algorithms=["ES256", "RS256"],
                options={"verify_aud": True, "verify_iss": True},
                audience=self.audience,
                issuer=self.issuer
            )
            
            # Validate scopes if provided
            if required_scopes:
                token_scopes = payload.get('scope', '').split(' ')
                has_required_scopes = all(scope in token_scopes for scope in required_scopes)
                
                if not has_required_scopes:
                    raise ValueError("Token is missing required scopes")
            
            return {
                'valid': True,
                'payload': payload
            }
        except Exception as e:
            return {
                'valid': False,
                'error': str(e)
            }
    
    # Check if token has a specific permission
    def has_permission(self, token_result, required_permission):
        if not token_result.get('valid') or not token_result.get('payload'):
            return False
        
        permissions = token_result['payload'].get('permissions', [])
        return required_permission in permissions
    
    # Check if token has a specific role
    def has_role(self, token_result, required_role):
        if not token_result.get('valid') or not token_result.get('payload'):
            return False
        
        roles = token_result['payload'].get('roles', [])
        return required_role in roles

# Example usage in Flask
app = Flask(__name__)

# Initialize validator
validator = TokenValidator({
    'jwks_uri': 'https://api.example.com/auth/.well-known/jwks.json',
    'issuer': 'auth-service',
    'audience': 'api'
})

# Authentication decorator
def requires_auth(scopes=None):
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            auth_header = request.headers.get('Authorization', '')
            if not auth_header or not auth_header.startswith('Bearer '):
                return jsonify({'error': 'Missing or invalid authorization header'}), 401
            
            token = auth_header[7:]  # Remove 'Bearer ' prefix
            result = validator.validate_token(token, scopes)
            
            if not result['valid']:
                return jsonify({'error': result['error']}), 401
            
            # Store user info for the route handler
            g.user = result['payload']
            g.token_result = result
            
            return f(*args, **kwargs)
        return decorated
    return decorator

# Permission check decorator
def requires_permission(permission):
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            if not hasattr(g, 'token_result'):
                return jsonify({'error': 'Authentication required'}), 401
            
            if not validator.has_permission(g.token_result, permission):
                return jsonify({'error': 'Insufficient permissions'}), 403
            
            return f(*args, **kwargs)
        return decorated
    return decorator

# Role check decorator
def requires_role(role):
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            if not hasattr(g, 'token_result'):
                return jsonify({'error': 'Authentication required'}), 401
            
            if not validator.has_role(g.token_result, role):
                return jsonify({'error': 'Insufficient role'}), 403
            
            return f(*args, **kwargs)
        return decorated
    return decorator

# Public route - no authentication required
@app.route('/api/public')
def public_route():
    return jsonify({'message': 'This is public data'})

# Protected route - requires valid authentication
@app.route('/api/protected')
@requires_auth()
def protected_route():
    return jsonify({
        'message': 'This is protected data',
        'userId': g.user['sub']
    })

# Route requiring read scope
@app.route('/api/data')
@requires_auth(scopes=['read'])
def data_route():
    return jsonify({
        'message': 'This is data that requires read permission',
        'userId': g.user['sub']
    })

# Route requiring specific permission
@app.route('/api/content')
@requires_auth()
@requires_permission('content:write')
def content_route():
    return jsonify({
        'message': 'This is content that requires write permission',
        'userId': g.user['sub']
    })

# Route requiring admin role
@app.route('/api/admin')
@requires_auth()
@requires_role('admin')
def admin_route():
    return jsonify({
        'message': 'This is admin-only data',
        'userId': g.user['sub']
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
```

## API Gateway Integration

For services behind an API Gateway, you can configure token validation at the gateway level:

### AWS API Gateway Example

```json
{
  "securityDefinitions": {
    "jwt-authorizer": {
      "type": "apiKey",
      "name": "Authorization",
      "in": "header",
      "x-amazon-apigateway-authtype": "custom",
      "x-amazon-apigateway-authorizer": {
        "type": "token",
        "authorizerUri": "arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/arn:aws:lambda:us-east-1:123456789012:function:jwt-validator/invocations",
        "authorizerResultTtlInSeconds": 300,
        "identityValidationExpression": "^Bearer (.*)$"
      }
    }
  },
  "security": [
    {
      "jwt-authorizer": []
    }
  ]
}
```

### Kong API Gateway Example

```yaml
plugins:
  - name: jwt
    config:
      key_claim_name: sub
      secret_is_base64: false
      claims_to_verify:
        - exp
        - nbf
      jwt_signer_jwks_uri: https://api.example.com/auth/.well-known/jwks.json
```

## Common Errors and Troubleshooting

| Error | Description | Solution |
|-------|-------------|----------|
| Invalid signature | Token signature verification failed | Ensure you're using the correct public key from JWKS; check if keys were rotated |
| Token expired | The token's exp claim indicates it has expired | Refresh the token or require the user to authenticate again |
| Invalid issuer | The iss claim doesn't match the expected value | Configure validator with the correct issuer value, matching the Auth Service |
| Invalid audience | The aud claim doesn't match your service | Ensure your service is using the correct audience value |
| Missing required scopes | Token doesn't have the required OAuth scopes | Request appropriate scopes during authentication |
| Invalid key ID | The kid in token header doesn't match any JWKS keys | Refresh JWKS cache; the key might have been rotated |
| Clock skew error | System clocks are not synchronized | Allow for reasonable clock skew in token validation (e.g., 5 minutes) |

## Performance Considerations

1. **Cache JWKS responses**:
   - Minimize network calls to the JWKS endpoint
   - Set a reasonable cache duration (e.g., 24 hours)
   - Implement a background refresh before expiration

2. **Token validation optimization**:
   - Use efficient JWT libraries with caching capabilities
   - Consider hardware acceleration for cryptographic operations in high-volume systems
   - Structure your code to avoid redundant token validations

3. **Gateway-level validation**:
   - Validate tokens at the API gateway when possible
   - Pass validated claims to backend services in headers
   - Reduce computational overhead on individual services

## Security Best Practices

1. **Always verify signatures**:
   - Never accept tokens without cryptographic verification
   - Use libraries that properly implement JWT standards

2. **Validate all relevant claims**:
   - Verify expiration (exp)
   - Verify not-before (nbf)
   - Verify issuer (iss)
   - Verify audience (aud)

3. **Prevent token leaks**:
   - Transmit tokens only over HTTPS
   - Never log full tokens
   - Set appropriate token lifetimes

4. **Implement proper error handling**:
   - Don't expose detailed validation errors to clients
   - Log validation failures for security monitoring
   - Return generic 401/403 errors to prevent information disclosure

## Related Documentation

* [Auth Service Overview](../overview.md)
* [Auth Service API Reference](../interfaces/api.md)
* [Token Service Implementation](../implementation/token_service.md)
* [Key Manager Implementation](../implementation/key_manager.md)
* [Service-to-Service Authentication](./service_to_service_auth.md)
* [Role-Based Access Control](./role_based_access.md) 