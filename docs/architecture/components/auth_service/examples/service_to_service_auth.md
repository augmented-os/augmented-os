# Service-to-Service Authentication Example

This document provides examples of how to implement service-to-service authentication using the Authentication Service, enabling secure communication between microservices in your architecture.

## Client Credentials Flow Example

The following example illustrates how to implement the client credentials flow for service-to-service authentication:

1. Register a service account with appropriate scopes
2. Obtain an access token using client credentials
3. Use the token to access protected resources on another service
4. Automatically refresh the token when needed

### Service Account Creation

Service accounts must be created by an administrator through the Auth Service management API:

```bash
curl -X POST https://api.example.com/auth/admin/service-accounts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {admin_token}" \
  -d '{
    "name": "validation-service",
    "description": "Service account for the Validation Service",
    "scopes": ["workflow:read", "validation:write"],
    "allowedIps": ["10.0.1.0/24", "10.0.2.0/24"]
  }'
```

#### Response

```json
{
  "serviceAccountId": "svc_7f9e51c3ad654b28",
  "name": "validation-service",
  "status": "ACTIVE",
  "clientId": "val_svc_client_a1b2c3",
  "clientSecret": "cs_4d5e6f7g8h9i0j_ONLY_SHOWN_ONCE",
  "scopes": ["workflow:read", "validation:write"],
  "createdAt": "2023-09-01T10:15:00Z",
  "expiresAt": null,
  "message": "Service account created successfully. Save the client secret as it won't be shown again."
}
```

### Obtaining an Access Token

Services authenticate using the client credentials grant type:

```bash
curl -X POST https://api.example.com/auth/token \
  -H "Content-Type: application/json" \
  -d '{
    "grantType": "client_credentials",
    "clientId": "val_svc_client_a1b2c3",
    "clientSecret": "cs_4d5e6f7g8h9i0j_ONLY_SHOWN_ONCE",
    "scope": "workflow:read validation:write"
  }'
```

#### Response

```json
{
  "accessToken": "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 1800,
  "tokenType": "Bearer",
  "scope": "workflow:read validation:write"
}
```

### Service-to-Service Request

The service can now use this token to access protected APIs on other services:

```bash
curl -X GET https://api.example.com/workflow-service/workflows/active \
  -H "Authorization: Bearer eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### Response

```json
{
  "workflows": [
    {
      "id": "wf_123",
      "name": "Purchase Approval",
      "status": "ACTIVE",
      "version": "1.0.0"
    },
    {
      "id": "wf_456",
      "name": "Employee Onboarding",
      "status": "ACTIVE",
      "version": "2.1.0"
    }
  ],
  "count": 2,
  "totalCount": 2
}
```

## Token Validation

When a service receives a request with a JWT token, it should validate the token without making a request to the Auth Service:

1. Fetch the JSON Web Key Set (JWKS) from the Auth Service (and cache it)
2. Validate the token signature using the appropriate public key
3. Verify the token has not expired and contains the required claims

### Fetching the JWKS

```bash
curl -X GET https://api.example.com/auth/.well-known/jwks.json
```

#### Response

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
      "kty": "EC",
      "crv": "P-256",
      "kid": "key-id-2",
      "x": "base64_encoded_x_coordinate",
      "y": "base64_encoded_y_coordinate",
      "use": "sig",
      "alg": "ES256"
    }
  ]
}
```

## Code Examples

### Node.js Service-to-Service Authentication Example

```javascript
const axios = require('axios');
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

class ServiceAuthClient {
  constructor(options) {
    this.authServiceUrl = options.authServiceUrl;
    this.clientId = options.clientId;
    this.clientSecret = options.clientSecret;
    this.scopes = options.scopes;
    
    this.accessToken = null;
    this.tokenExpiry = null;
    
    // JWKS client for token validation
    this.jwksClient = jwksClient({
      jwksUri: `${this.authServiceUrl}/.well-known/jwks.json`,
      cache: true,
      cacheMaxAge: 86400000, // 24 hours
      rateLimit: true,
      jwksRequestsPerMinute: 10
    });
  }
  
  async getAccessToken() {
    // Check if we have a valid token already
    if (this.accessToken && this.tokenExpiry && this.tokenExpiry > Date.now()) {
      return this.accessToken;
    }
    
    // Get a new token
    try {
      const response = await axios.post(`${this.authServiceUrl}/token`, {
        grantType: 'client_credentials',
        clientId: this.clientId,
        clientSecret: this.clientSecret,
        scope: this.scopes.join(' ')
      });
      
      this.accessToken = response.data.accessToken;
      this.tokenExpiry = Date.now() + (response.data.expiresIn * 1000);
      
      return this.accessToken;
    } catch (error) {
      console.error('Error obtaining access token:', error.message);
      throw error;
    }
  }
  
  async callService(url, options = {}) {
    const token = await this.getAccessToken();
    
    const requestOptions = {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`
      }
    };
    
    try {
      const response = await axios(url, requestOptions);
      return response.data;
    } catch (error) {
      console.error('Service call error:', error.message);
      throw error;
    }
  }
  
  // Token validation for receiving service
  async validateToken(token) {
    try {
      // Decode token without verification to get the key ID
      const decoded = jwt.decode(token, { complete: true });
      if (!decoded || !decoded.header || !decoded.header.kid) {
        throw new Error('Invalid token: No key ID found in header');
      }
      
      // Get the signing key
      const key = await this.jwksClient.getSigningKey(decoded.header.kid);
      const signingKey = key.getPublicKey();
      
      // Verify the token
      const verifiedToken = jwt.verify(token, signingKey, {
        algorithms: ['ES256', 'RS256'],
        issuer: 'auth-service', // Must match the token issuer
        audience: 'api'         // Must match your service's audience
      });
      
      // Check scopes if needed
      // if (!verifiedToken.scope || !verifiedToken.scope.includes('required:scope')) {
      //   throw new Error('Token lacks required scope');
      // }
      
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
}

// Example usage
async function main() {
  // Service making requests
  const serviceClient = new ServiceAuthClient({
    authServiceUrl: 'https://api.example.com/auth',
    clientId: 'val_svc_client_a1b2c3',
    clientSecret: 'cs_4d5e6f7g8h9i0j_ONLY_SHOWN_ONCE',
    scopes: ['workflow:read', 'validation:write']
  });
  
  // Example: Call another service
  try {
    const workflows = await serviceClient.callService(
      'https://api.example.com/workflow-service/workflows/active',
      { method: 'GET' }
    );
    console.log('Active workflows:', workflows);
  } catch (error) {
    console.error('Failed to get workflows:', error);
  }
  
  // Example: Service receiving and validating a token
  const receivingService = new ServiceAuthClient({
    authServiceUrl: 'https://api.example.com/auth'
  });
  
  app.get('/protected-endpoint', async (req, res) => {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid authorization header' });
    }
    
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const validation = await receivingService.validateToken(token);
    
    if (!validation.valid) {
      return res.status(401).json({ error: validation.error });
    }
    
    // Token is valid, process the request
    // Access claims from validation.payload
    res.json({ message: 'Protected data', serviceId: validation.payload.sub });
  });
}

main().catch(console.error);
```

### Python Service-to-Service Authentication Example

```python
import time
import requests
import jwt
from jwt.jwks_client import PyJWKClient

class ServiceAuthClient:
    def __init__(self, auth_service_url, client_id=None, client_secret=None, scopes=None):
        self.auth_service_url = auth_service_url
        self.client_id = client_id
        self.client_secret = client_secret
        self.scopes = scopes or []
        
        self.access_token = None
        self.token_expiry = None
        
        # JWKS client for token validation
        self.jwks_client = PyJWKClient(f"{self.auth_service_url}/.well-known/jwks.json")
    
    def get_access_token(self):
        # Check if we have a valid token already
        if self.access_token and self.token_expiry and self.token_expiry > time.time():
            return self.access_token
        
        # Get a new token
        try:
            response = requests.post(
                f"{self.auth_service_url}/token",
                json={
                    "grantType": "client_credentials",
                    "clientId": self.client_id,
                    "clientSecret": self.client_secret,
                    "scope": " ".join(self.scopes)
                }
            )
            response.raise_for_status()
            data = response.json()
            
            self.access_token = data["accessToken"]
            self.token_expiry = time.time() + data["expiresIn"]
            
            return self.access_token
        except Exception as e:
            print(f"Error obtaining access token: {str(e)}")
            raise
    
    def call_service(self, url, method="GET", data=None, headers=None):
        token = self.get_access_token()
        
        headers = headers or {}
        headers["Authorization"] = f"Bearer {token}"
        
        try:
            response = requests.request(
                method=method,
                url=url,
                json=data,
                headers=headers
            )
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(f"Service call error: {str(e)}")
            raise
    
    # Token validation for receiving service
    def validate_token(self, token):
        try:
            # Decode token without verification to get headers
            unverified_header = jwt.get_unverified_header(token)
            
            # Get the signing key
            signing_key = self.jwks_client.get_signing_key_from_jwt(token)
            
            # Verify the token
            payload = jwt.decode(
                token,
                signing_key.key,
                algorithms=["ES256", "RS256"],
                options={"verify_aud": True, "verify_iss": True},
                audience="api",  # Must match your service's audience
                issuer="auth-service"  # Must match the token issuer
            )
            
            # Check scopes if needed
            # required_scope = "required:scope"
            # if "scope" not in payload or required_scope not in payload["scope"].split():
            #     raise ValueError("Token lacks required scope")
            
            return {
                "valid": True,
                "payload": payload
            }
        except Exception as e:
            return {
                "valid": False,
                "error": str(e)
            }

# Example usage
def main():
    # Service making requests
    service_client = ServiceAuthClient(
        auth_service_url="https://api.example.com/auth",
        client_id="val_svc_client_a1b2c3",
        client_secret="cs_4d5e6f7g8h9i0j_ONLY_SHOWN_ONCE",
        scopes=["workflow:read", "validation:write"]
    )
    
    # Example: Call another service
    try:
        workflows = service_client.call_service(
            url="https://api.example.com/workflow-service/workflows/active"
        )
        print("Active workflows:", workflows)
    except Exception as e:
        print(f"Failed to get workflows: {str(e)}")
    
    # Example: Service receiving and validating a token
    # In a Flask application:
    from flask import Flask, request, jsonify
    
    app = Flask(__name__)
    receiving_service = ServiceAuthClient(auth_service_url="https://api.example.com/auth")
    
    @app.route("/protected-endpoint")
    def protected_endpoint():
        # Extract token from Authorization header
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({"error": "Missing or invalid authorization header"}), 401
        
        token = auth_header[7:]  # Remove 'Bearer ' prefix
        validation = receiving_service.validate_token(token)
        
        if not validation["valid"]:
            return jsonify({"error": validation["error"]}), 401
        
        # Token is valid, process the request
        # Access claims from validation["payload"]
        return jsonify({
            "message": "Protected data",
            "serviceId": validation["payload"]["sub"]
        })
    
    # Run the Flask app (in production, use a proper WSGI server)
    app.run(host="0.0.0.0", port=5000)

if __name__ == "__main__":
    main()
```

## Common Errors and Troubleshooting

| Error Code | Description | Solution |
|------------|-------------|----------|
| `AUTH_101` | Invalid client credentials | Verify client ID and secret are correct |
| `AUTH_102` | Insufficient scope | Request the required scopes during token acquisition |
| `AUTH_103` | Service account disabled | Contact administrator to re-enable the service account |
| `AUTH_104` | IP address not allowed | Add the current IP to the allowedIps list |
| `AUTH_105` | Token signature verification failed | Ensure you're using the correct public key for verification |
| `AUTH_106` | Rate limit exceeded | Implement exponential backoff and retry strategy |
| `AUTH_107` | Invalid audience | Ensure the token's audience matches your service |

## Security Best Practices

1. **Protect client secrets**:
   - Store secrets in secure environment variables or secret management systems
   - Never commit secrets to code repositories
   - Rotate secrets periodically

2. **Limit service account permissions**:
   - Use the principle of least privilege when assigning scopes
   - Restrict allowed IP addresses when possible
   - Create separate service accounts for different microservices

3. **Implement proper token validation**:
   - Always validate token signatures
   - Verify expiration time (exp), not before time (nbf)
   - Check issuer (iss) and audience (aud) claims
   - Validate required scopes for specific endpoints

4. **Token handling**:
   - Cache tokens until they expire to reduce authentication requests
   - Implement automatic token refresh to handle expiration
   - Set reasonable token lifetimes (typically shorter than user tokens)

5. **Monitor and audit**:
   - Log all authentication attempts (both successful and failed)
   - Alert on suspicious activities (multiple failed attempts, unusual request patterns)
   - Periodically review service account usage patterns

## Next Steps

Once you've implemented service-to-service authentication, consider:

1. [Implementing Token Validation in API Gateways](./token_validation.md)
2. [Adding Mutual TLS (mTLS) for Additional Security](./mtls_authentication.md)
3. [Enforcing Role-Based Access Controls](./role_based_access.md)

## Related Documentation

* [Auth Service Overview](../overview.md)
* [Auth Service API Reference](../interfaces/api.md)
* [Token Service Implementation](../implementation/token_service.md)
* [Key Manager Implementation](../implementation/key_manager.md)
* [Security Considerations](../security_considerations.md) 