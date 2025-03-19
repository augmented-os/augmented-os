# Auth Service API

The Auth Service provides a RESTful API for authentication, authorization, and identity management within the Augmented OS platform. This document describes the API endpoints, authentication methods, and common patterns for integrating with the Auth Service.

## API Overview

The Auth Service API is organized around REST principles. It uses standard HTTP verbs (GET, POST, PUT, DELETE) and follows predictable resource-oriented endpoints. All responses, including errors, are returned as JSON objects. The API supports both JWT-based user authentication and API key-based service-to-service authentication.

The complete API specification is available in [auth-service-api.yaml](./auth-service-api.yaml) (OpenAPI 3.0 format).

## Base URL

The Auth Service API is available at the following base URLs:

* **Production**: `https://api.example.com/v1`
* **Sandbox (Testing)**: `https://sandbox-api.example.com/v1`

## Authentication Methods

The Auth Service supports two authentication methods:

### 1. Bearer Token (JWT) Authentication

Used for user authentication. The client includes a valid JWT in the Authorization header:

```
Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. API Key Authentication

Used for service-to-service authentication. The client includes an API key in a custom header:

```
X-API-Key: sk_live_12345678901234567890
```

## Resource Categories

The API is organized into the following resource categories:

| Category | Description |
|----|----|
| Authentication | User registration, login, token management, and logout operations |
| Users | User account management (CRUD operations) and role assignment |
| Roles | Role management and permission assignment |
| Permissions | Permission management |
| Service Accounts | Service account management and API key operations |
| Key Management | Cryptographic key management (JWKS endpoint) |
| Health | Health check and monitoring endpoints |

## Key Endpoints

### Authentication

* **POST /auth/register** - Register a new user account
* **POST /auth/login** - Authenticate a user and receive tokens
* **POST /auth/refresh** - Refresh an expired access token
* **POST /auth/logout** - Invalidate the current token

### User Management

* **GET /users** - List users with filtering and pagination
* **POST /users** - Create a new user (admin function)
* **GET /users/{id}** - Get a specific user's details
* **PUT /users/{id}** - Update a user's information
* **DELETE /users/{id}** - Delete a user
* **GET /users/{id}/roles** - Get roles assigned to a user
* **POST /users/{id}/roles** - Assign a role to a user
* **DELETE /users/{id}/roles/{roleId}** - Remove a role from a user

### Role and Permission Management

* **GET /roles** - List all roles
* **POST /roles** - Create a new role
* **GET /roles/{id}** - Get details for a specific role
* **PUT /roles/{id}** - Update a role
* **DELETE /roles/{id}** - Delete a role
* **GET /roles/{id}/permissions** - Get permissions assigned to a role
* **POST /roles/{id}/permissions** - Assign a permission to a role
* **DELETE /roles/{id}/permissions/{permissionId}** - Remove a permission from a role
* **GET /permissions** - List all permissions
* **POST /permissions** - Create a new permission
* **GET /permissions/{id}** - Get details for a specific permission
* **PUT /permissions/{id}** - Update a permission
* **DELETE /permissions/{id}** - Delete a permission

### Service Accounts

* **GET /service-accounts** - List service accounts
* **POST /service-accounts** - Create a new service account
* **GET /service-accounts/{id}** - Get a specific service account
* **PUT /service-accounts/{id}** - Update a service account
* **DELETE /service-accounts/{id}** - Delete a service account
* **POST /service-accounts/{id}/rotate-key** - Rotate API key
* **POST /service-accounts/{id}/revoke-key** - Revoke API key
* **GET /service-accounts/{id}/roles** - Get roles assigned to a service account
* **POST /service-accounts/{id}/roles** - Assign a role to a service account
* **DELETE /service-accounts/{id}/roles/{roleId}** - Remove a role from a service account

### Key Management

* **GET /.well-known/jwks.json** - Get JWKS (JSON Web Key Set) for token validation

### Health & Monitoring

* **GET /health** - Check service health status
* **GET /metrics** - Get service metrics

## Error Handling

The API uses conventional HTTP status codes to indicate success or failure of requests. In general:

* **2xx** - Success
* **4xx** - Client error (invalid request, authentication failure, permission denied)
* **5xx** - Server error

All error responses follow a consistent format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": { /* Additional details if available */ },
    "requestId": "req-123456789"
  }
}
```

Common error codes include:

| Code | Description |
|----|----|
| INVALID_CREDENTIALS | The provided credentials are incorrect |
| RESOURCE_NOT_FOUND | The requested resource does not exist |
| PERMISSION_DENIED | The authenticated user lacks permission for this action |
| VALIDATION_ERROR | The request contains invalid data |
| RESOURCE_EXISTS | A resource with the same unique identifier already exists |
| RATE_LIMIT_EXCEEDED | The client has exceeded rate limits |
| INTERNAL_ERROR | An unexpected server error occurred |

## Pagination

List endpoints support pagination using the following query parameters:

* `page` - Page number (default: 1)
* `limit` - Items per page (default: 20, max: 100)

Paginated responses include a `pagination` object with metadata:

```json
{
  "items": [ /* Array of items */ ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 42,
    "pages": 3
  }
}
```

## Filtering and Sorting

List endpoints support filtering using query parameters specific to each resource. Common filters include:

* `search` - Text search across relevant fields
* `status` - Filter by status (e.g., "active", "inactive")
* Resource-specific filters (e.g., `isSystem` for roles)

## Token Validation

The Auth Service issues JWTs (JSON Web Tokens) that can be independently validated by other services without additional API calls to the Auth Service. Services can validate tokens by:


1. Retrieving the JWKS (JSON Web Key Set) from `/.well-known/jwks.json`
2. Using the appropriate key to verify the JWT signature
3. Validating token claims (expiration, issuer, audience)
4. Extracting user ID, roles, and permissions from the token payload

This enables stateless authentication and allows services to implement authorization without requiring network calls for each request.

## API Rate Limits

To protect the service from abuse, rate limits are applied to API endpoints:

* Authentication endpoints: 10 requests per minute per IP address
* User management endpoints: 100 requests per minute per authenticated user
* Service account key operations: 10 requests per hour per service account

Rate limit headers are included in API responses:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1610000000
```

## Versioning

The API uses URL versioning (e.g., `/v1/`) to ensure backward compatibility. New versions will be released when breaking changes are necessary.

## Examples

### User Authentication Flow


1. **Register a new user**:

```http
POST /auth/register
Content-Type: application/json

{
  "username": "jsmith",
  "email": "john.smith@example.com",
  "password": "Password123!",
  "fullName": "John Smith"
}
```


2. **Authenticate and obtain tokens**:

```http
POST /auth/login
Content-Type: application/json

{
  "username": "jsmith",
  "password": "Password123!"
}
```


3. **Use access token for authenticated requests**:

```http
GET /users/profile
Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
```


4. **Refresh an expired token**:

```http
POST /auth/refresh
Content-Type: application/json

{
  "refresh_token": "def5020089c7bf94380dc6..."
}
```


5. **Logout and invalidate tokens**:

```http
POST /auth/logout
Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Service-to-Service Authentication


1. **Create a service account** (performed by an administrator):

```http
POST /service-accounts
Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "name": "Data Import Service",
  "description": "Used for batch data import operations",
  "roleIds": ["role_123456789"],
  "metadata": {
    "owner": "Data Team",
    "environment": "production"
  }
}
```


2. **Use API key for service authentication**:

```http
GET /users
X-API-Key: sk_live_12345678901234567890
```

## Further Reading

* [Token Service Implementation](../implementation/token_service.md)
* [Permission Manager](../implementation/permission_manager.md)
* [Service Authentication Guide](../examples/service_to_service_auth.md)
* [Integration Patterns](../examples/token_validation.md)


