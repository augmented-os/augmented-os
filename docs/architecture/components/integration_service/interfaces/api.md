# Integration Service API Reference

## Overview

The Integration Service exposes a RESTful API that allows clients to manage integration definitions, instances, and execute integration methods. This document details the available endpoints, request formats, and response structures.

An OpenAPI specification is available at [integration-service-api.yaml](./integration-service-api.yaml) for integration with API tools and code generators.

## Base URL

```
/api/v1/integrations
```

## Authentication

All API endpoints require authentication using either:

* Bearer token authentication (JWT)
* Service-to-service authentication with mTLS

## Endpoints

### Integration Definitions

#### List Integration Definitions

```
GET /definitions
```

Returns a list of available integration definitions.

**Query Parameters:**

* `page`: Page number (default: 1)
* `limit`: Items per page (default: 20)
* `search`: Text search across name and description fields
* `status`: Filter by status (DRAFT, PUBLISHED, DEPRECATED, ARCHIVED)
* `type`: Filter by integration type

**Response:**

```json
{
  "items": [
    {
      "id": "integration-def-1",
      "name": "GitHub Integration",
      "description": "Integration with GitHub API",
      "version": "1.0.0",
      "type": "http",
      "authType": "oauth2",
      "status": "PUBLISHED",
      "updatedAt": "2023-07-15T14:30:00Z"
    },
    {
      "id": "integration-def-2",
      "name": "Slack Integration",
      "description": "Integration with Slack API",
      "version": "1.1.0",
      "type": "http",
      "authType": "oauth2",
      "status": "PUBLISHED",
      "updatedAt": "2023-08-20T09:15:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 42,
    "pages": 3
  }
}
```

#### Get Integration Definition

```
GET /definitions/{id}
```

Returns details for a specific integration definition.

**Path Parameters:**

* `id`: The unique identifier of the integration definition

**Response:**

```json
{
  "id": "integration-def-1",
  "name": "GitHub Integration",
  "description": "Integration with GitHub API",
  "version": "1.0.0",
  "type": "http",
  "authType": "oauth2",
  "methods": [
    {
      "name": "getRepository",
      "description": "Get repository details",
      "paramSchema": { /* JSON Schema for parameters */ },
      "resultSchema": { /* JSON Schema for results */ },
      "rateLimits": {
        "requestsPerMinute": 30,
        "burstLimit": 5
      },
      "timeoutMs": 5000
    },
    {
      "name": "createIssue",
      "description": "Create a new issue",
      "paramSchema": { /* JSON Schema for parameters */ },
      "resultSchema": { /* JSON Schema for results */ },
      "rateLimits": {
        "requestsPerMinute": 20,
        "burstLimit": 3
      },
      "timeoutMs": 7000
    }
  ],
  "configSchema": { /* JSON Schema for configuration */ },
  "oauth2Config": {
    "authorizationUrl": "https://github.com/login/oauth/authorize",
    "tokenUrl": "https://github.com/login/oauth/access_token",
    "scope": "repo,user"
  },
  "defaultConfig": {
    "apiVersion": "v3",
    "baseUrl": "https://api.github.com"
  },
  "createdAt": "2023-06-10T08:30:00Z",
  "updatedAt": "2023-07-15T14:30:00Z",
  "publishedAt": "2023-07-15T14:30:00Z",
  "status": "PUBLISHED"
}
```

#### Create Integration Definition

```
POST /definitions
```

Creates a new integration definition.

**Request Body:**

```json
{
  "name": "GitHub Integration",
  "description": "Integration with GitHub API",
  "version": "1.0.0",
  "type": "http",
  "authType": "oauth2",
  "methods": [
    {
      "name": "getRepository",
      "description": "Get repository details",
      "paramSchema": { /* JSON Schema for parameters */ },
      "resultSchema": { /* JSON Schema for results */ },
      "rateLimits": {
        "requestsPerMinute": 30,
        "burstLimit": 5
      },
      "timeoutMs": 5000
    }
  ],
  "configSchema": { /* JSON Schema for configuration */ },
  "oauth2Config": {
    "authorizationUrl": "https://github.com/login/oauth/authorize",
    "tokenUrl": "https://github.com/login/oauth/access_token",
    "scope": "repo,user"
  },
  "defaultConfig": {
    "apiVersion": "v3",
    "baseUrl": "https://api.github.com"
  }
}
```

**Response:**

```json
{
  "id": "generated-integration-def-id",
  "name": "GitHub Integration",
  "description": "Integration with GitHub API",
  "version": "1.0.0",
  "type": "http",
  "authType": "oauth2",
  "methods": [ /* ... methods ... */ ],
  "configSchema": { /* ... schema ... */ },
  "oauth2Config": { /* ... oauth config ... */ },
  "defaultConfig": { /* ... default config ... */ },
  "createdAt": "2023-09-01T10:15:00Z",
  "updatedAt": "2023-09-01T10:15:00Z",
  "status": "DRAFT"
}
```

### Integration Instances

#### List Integration Instances

```
GET /instances
```

Returns a list of integration instances.

**Query Parameters:**

* `page`: Page number (default: 1)
* `limit`: Items per page (default: 20)
* `search`: Text search across name field
* `status`: Filter by status (PENDING_CONFIGURATION, PENDING_AUTHENTICATION, CONNECTED, DISCONNECTED, AUTH_ERROR, CONFIG_ERROR)
* `definitionId`: Filter by integration definition ID

**Response:**

```json
{
  "items": [
    {
      "id": "instance-1",
      "integrationDefinitionId": "integration-def-1",
      "name": "Company GitHub Integration",
      "status": "CONNECTED",
      "lastUsedAt": "2023-08-30T12:34:56Z",
      "lastConnectedAt": "2023-08-25T10:11:12Z",
      "updatedAt": "2023-08-25T10:11:12Z"
    },
    {
      "id": "instance-2",
      "integrationDefinitionId": "integration-def-2",
      "name": "Team Slack Integration",
      "status": "CONNECTED",
      "lastUsedAt": "2023-09-01T09:08:07Z",
      "lastConnectedAt": "2023-08-15T14:13:12Z",
      "updatedAt": "2023-08-15T14:13:12Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 8,
    "pages": 1
  }
}
```

#### Create Integration Instance

```
POST /instances
```

Creates a new integration instance.

**Request Body:**

```json
{
  "integrationDefinitionId": "integration-def-1",
  "name": "Company GitHub Integration",
  "config": {
    "organization": "companyorg",
    "apiVersion": "v3"
  }
}
```

**Response:**

```json
{
  "id": "generated-instance-id",
  "integrationDefinitionId": "integration-def-1",
  "name": "Company GitHub Integration",
  "status": "PENDING_AUTHENTICATION",
  "config": {
    "organization": "companyorg",
    "apiVersion": "v3"
  },
  "createdAt": "2023-09-02T11:12:13Z",
  "updatedAt": "2023-09-02T11:12:13Z"
}
```

### Method Execution

#### Execute Integration Method

```
POST /instances/{instanceId}/methods/{methodName}/execute
```

Executes a method on an integration instance.

**Path Parameters:**

* `instanceId`: ID of the integration instance
* `methodName`: Name of the method to execute

**Request Body:**

```json
{
  "parameters": {
    "owner": "companyorg",
    "repo": "project-x",
    "issue": {
      "title": "Bug in login flow",
      "body": "Users are experiencing intermittent login failures.",
      "labels": ["bug", "urgent"]
    }
  }
}
```

**Response:**

```json
{
  "status": "SUCCESS",
  "data": {
    "id": 12345,
    "number": 42,
    "title": "Bug in login flow",
    "state": "open",
    "html_url": "https://github.com/companyorg/project-x/issues/42",
    "created_at": "2023-09-02T11:15:20Z"
  }
}
```

### Authentication

#### Start OAuth Authentication Flow

```
POST /instances/{instanceId}/auth/oauth2/start
```

Initiates the OAuth2 authentication flow for an integration instance.

**Path Parameters:**

* `instanceId`: ID of the integration instance

**Request Body:**

```json
{
  "redirectUri": "https://app.example.com/oauth/callback"
}
```

**Response:**

```json
{
  "authorizationUrl": "https://github.com/login/oauth/authorize?client_id=client123&redirect_uri=https%3A%2F%2Fapp.example.com%2Foauth%2Fcallback&response_type=code&state=abc123",
  "state": "abc123"
}
```

#### Complete OAuth Authentication Flow

```
POST /instances/{instanceId}/auth/oauth2/callback
```

Completes the OAuth2 authentication flow after user authorization.

**Path Parameters:**

* `instanceId`: ID of the integration instance

**Request Body:**

```json
{
  "code": "authorization-code-from-provider",
  "state": "abc123"
}
```

**Response:**

```json
{
  "status": "SUCCESS",
  "integrationInstanceId": "instance-id"
}
```

## Error Handling

The API uses standard HTTP status codes to indicate the success or failure of requests.

### Common Error Codes

| Status Code | Description |
|----------|-------------------|
| 400 | Bad Request - The request was malformed or contains invalid parameters |
| 401 | Unauthorized - Authentication is required or failed |
| 403 | Forbidden - The authenticated user lacks permission |
| 404 | Not Found - The requested resource does not exist |
| 409 | Conflict - The request conflicts with the current state (e.g., duplicate definition) |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - An unexpected error occurred |

### Integration-Specific Error Codes

| Error Code | Description |
|----------|-------------------|
| VALIDATION_ERROR | The request doesn't match the expected schema |
| RATE_LIMIT_EXCEEDED | The integration's rate limit was exceeded |
| INTEGRATION_ERROR | The external integration returned an error |
| AUTH_ERROR | Authentication with the external service failed |
| EXECUTION_ERROR | The method execution failed |
| CIRCUIT_OPEN | The circuit breaker is open due to previous failures |

### Error Response Format

```json
{
  "error": {
    "code": "INTEGRATION_ERROR",
    "message": "Failed to create issue in GitHub",
    "details": {
      "statusCode": 422,
      "response": {
        "message": "Validation Failed",
        "errors": [
          {
            "resource": "Issue",
            "field": "title",
            "code": "missing_field"
          }
        ]
      }
    },
    "requestId": "req-123456"
  }
}
```

## Rate Limiting

The API implements rate limiting to ensure fair usage. Limits are applied per API key or user.

| Endpoint | Rate Limit |
|----------|-------------------|
| GET endpoints | 100 requests per minute |
| POST/PUT/DELETE endpoints | 50 requests per minute |
| Method execution | Depends on method configuration |

Rate limit information is included in response headers:

* `X-RateLimit-Limit`: Total requests allowed in the period
* `X-RateLimit-Remaining`: Requests remaining in the period
* `X-RateLimit-Reset`: Time when the rate limit resets (Unix timestamp)

## Related Documentation

* [Internal Interfaces](./internal.md)
* [Integration Registry](../implementation/integration_registry.md)
* [Method Executor](../implementation/method_executor.md)
* [Credential Manager](../implementation/credential_manager.md)


