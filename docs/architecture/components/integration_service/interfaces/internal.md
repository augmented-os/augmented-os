# Integration Service Internal Interfaces

## Overview

This document describes the internal interfaces used by the Integration Service for communication with other system components. These interfaces are not exposed externally and are intended for internal system integration only.

## Interface Types

The Integration Service uses the following types of internal interfaces:

* **Event-based interfaces**: Asynchronous communication via the event bus
* **Service-to-service APIs**: Direct synchronous communication with other services
* **External systems interfaces**: Connections to third-party services and APIs
* **Credential store access**: Secure storage and retrieval of authentication credentials

## Event-Based Interfaces

### Published Events

The Integration Service publishes the following events to the event bus:

| Event Type | Description | Payload Schema | Consumers |
|------------|-------------|----------------|-----------|
| `integration.method.executed` | Published when an integration method is successfully executed | [See schema](#integration-method-executed) | Task Execution Service, Workflow Orchestrator |
| `integration.method.failed` | Published when an integration method execution fails | [See schema](#integration-method-failed) | Task Execution Service, Workflow Orchestrator |
| `integration.connected` | Published when an integration instance is successfully connected | [See schema](#integration-connected) | Task Execution Service, Workflow Orchestrator |
| `integration.auth.failed` | Published when authentication with an external system fails | [See schema](#integration-auth-failed) | Task Execution Service, Workflow Orchestrator |
| `integration.instance.status` | Published when an integration instance's status changes | [See schema](#integration-instance-status) | Task Execution Service, Workflow Orchestrator |

### Subscribed Events

The Integration Service subscribes to the following events:

| Event Type | Description | Publisher | Handler |
|------------|-------------|-----------|---------|
| `task.integration.execute` | Request to execute an integration method | Task Execution Service | Routes to Method Executor to execute the requested integration method |
| `system.credential.rotated` | Notification of credential rotation | Credential Service | Updates stored credentials for affected integration instances |
| `system.config.updated` | Notification of configuration changes | Configuration Service | Updates runtime configuration for adapters and rate limiters |

## Service-to-Service APIs

### Outbound Service Calls

The Integration Service makes the following calls to other services:

| Service | Endpoint | Purpose | Error Handling |
|---------|----------|---------|---------------|
| Credential Store | `POST /credentials` | Store encrypted credentials | Retry with exponential backoff, circuit breaker |
| Credential Store | `GET /credentials/{id}` | Retrieve encrypted credentials | Retry with exponential backoff, circuit breaker |
| Metrics Service | `POST /metrics` | Report integration performance metrics | Fire-and-forget with local buffering |
| Logging Service | `POST /logs` | Send structured logs | Fire-and-forget with local buffering |

### Inbound Service Calls

The Integration Service exposes the following internal endpoints for other services:

| Endpoint | Purpose | Callers | Authentication |
|----------|---------|---------|---------------|
| `POST /execute/{integrationId}/{method}` | Execute an integration method | Task Execution Service | Service-to-service mTLS |
| `GET /definitions/{id}/schema` | Get JSON schema for parameters | Form Rendering Service | Service-to-service mTLS |
| `GET /status/health` | Health check endpoint | Monitoring Service | Basic authentication |
| `GET /status/metrics` | Metrics reporting endpoint | Monitoring Service | Basic authentication |

### Integration Definition Registry API

The Integration Service provides a registry API that allows other services to access and manage integration definitions.

#### Purpose

This API enables other system components to:
- Retrieve integration definitions
- Query available integrations and their capabilities
- Get information about supported methods and data formats
- Check integration compatibility requirements

#### Endpoints

| Endpoint | Purpose |
|----------|---------|
| `GET /api/v1/integration-definitions` | List available integration definitions with optional filters |
| `GET /api/v1/integration-definitions/{id}` | Get detailed information about a specific integration definition |
| `GET /api/v1/integration-definitions/{id}/methods` | List available methods for a specific integration definition |
| `GET /api/v1/integration-definitions/{id}/schema` | Get JSON schema for a specific integration definition |

#### Authentication

Service-to-service calls are authenticated using mutual TLS and service API tokens.

#### Examples

Request:
```http
GET /api/v1/integration-definitions?type=erp&status=PUBLISHED HTTP/1.1
Host: integration-service.example.com
Authorization: Bearer sv_jwt_token_123
```

Response:
```json
{
  "items": [
    {
      "id": "int_def_123",
      "name": "SAP ERP Integration",
      "description": "Standard integration with SAP ERP systems",
      "version": "1.2.0",
      "type": "erp",
      "authType": "oauth2",
      "methodCount": 12,
      "status": "PUBLISHED",
      "updatedAt": "2023-09-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "pages": 1
  }
}
```

### Credential Management API

The Integration Service provides a secure API for managing integration credentials.

#### Purpose

This API enables:
- Storing credentials securely for integration instances
- Retrieving credentials for use during integration operations
- Refreshing tokens and updating credentials as needed
- Validating credential status

#### Endpoints

| Endpoint | Purpose |
|----------|---------|
| `POST /api/v1/integration-instances/{instanceId}/credentials` | Store new credentials for an integration instance |
| `GET /api/v1/integration-instances/{instanceId}/credentials/status` | Check status of credentials (valid, expired, etc.) |
| `POST /api/v1/integration-instances/{instanceId}/credentials/refresh` | Trigger credential refresh (for OAuth, JWT, etc.) |
| `DELETE /api/v1/integration-instances/{instanceId}/credentials` | Remove stored credentials |

#### Authentication

All credential management operations require service authentication with higher privilege levels than standard API operations.

#### Data Handling

- Credentials are never returned directly in responses
- Credentials are encrypted in transit and at rest
- Access to credential operations is strictly audited
- Credential usage is tracked for security monitoring

#### Examples

Request:
```http
POST /api/v1/integration-instances/int_inst_456/credentials HTTP/1.1
Host: integration-service.example.com
Authorization: Bearer sv_jwt_token_123
Content-Type: application/json

{
  "type": "oauth2",
  "data": {
    "access_token": "gho_16C7e42F292c6912E7710c838347Ae178B4a",
    "refresh_token": "ghr_1B4a2e67890123456789012345678901234567890",
    "expires_at": "2023-10-15T10:30:00Z"
  }
}
```

Response:
```json
{
  "status": "stored",
  "expiresAt": "2023-10-15T10:30:00Z",
  "type": "oauth2"
}
```

## External Systems Interface

The Integration Service connects to external third-party systems using the following patterns:

| System Type | Communication Pattern | Authentication Methods | Rate Limiting |
|-------------|----------------------|---------------------|--------------|
| REST APIs | HTTP/HTTPS requests | OAuth2, API Keys, Basic Auth | Adaptive rate limiting with backoff |
| GraphQL APIs | HTTP/HTTPS with GraphQL | OAuth2, JWT | Per-query rate limiting |
| SOAP Services | SOAP over HTTP | WS-Security, Basic Auth | Fixed window rate limiting |
| Webhooks | Receive HTTP callbacks | HMAC verification | N/A (inbound) |
| Database Systems | Connection pools | Username/password, SSL certs | Connection pooling limits |

## Credential Store Access

The Integration Service accesses the credential store for authentication and authorization purposes.

## Event Schemas

### Integration Method Executed

```json
{
  "type": "integration.method.executed",
  "id": "uuid",
  "timestamp": "ISO-8601 timestamp",
  "data": {
    "integrationInstanceId": "instance-id",
    "methodName": "methodName",
    "status": "SUCCESS",
    "executionTime": 123,
    "resultSummary": {
      "statusCode": 200,
      "dataSize": 1024
    }
  },
  "metadata": {
    "correlationId": "uuid",
    "taskId": "task-id",
    "source": "integration-service"
  }
}
```

### Integration Method Failed

```json
{
  "type": "integration.method.failed",
  "id": "uuid",
  "timestamp": "ISO-8601 timestamp",
  "data": {
    "integrationInstanceId": "instance-id",
    "methodName": "methodName",
    "error": {
      "code": "ERROR_CODE",
      "message": "Error description",
      "details": {}
    },
    "retryable": true,
    "executionTime": 123
  },
  "metadata": {
    "correlationId": "uuid",
    "taskId": "task-id",
    "source": "integration-service"
  }
}
```

### Integration Connected

```json
{
  "type": "integration.connected",
  "id": "uuid",
  "timestamp": "ISO-8601 timestamp",
  "data": {
    "integrationInstanceId": "instance-id",
    "integrationDefinitionId": "definition-id",
    "authType": "oauth2",
    "connectionDetails": {
      "scope": "read,write",
      "expiresAt": "ISO-8601 timestamp"
    }
  },
  "metadata": {
    "correlationId": "uuid",
    "source": "integration-service"
  }
}
```

### Integration Auth Failed

```json
{
  "type": "integration.auth.failed",
  "id": "uuid",
  "timestamp": "ISO-8601 timestamp",
  "data": {
    "integrationInstanceId": "instance-id",
    "integrationDefinitionId": "definition-id",
    "authType": "oauth2",
    "error": {
      "code": "AUTH_ERROR",
      "message": "Authentication failed",
      "details": {}
    }
  },
  "metadata": {
    "correlationId": "uuid",
    "source": "integration-service"
  }
}
```

### Integration Instance Status

```json
{
  "type": "integration.instance.status",
  "id": "uuid",
  "timestamp": "ISO-8601 timestamp",
  "data": {
    "integrationInstanceId": "instance-id",
    "integrationDefinitionId": "definition-id",
    "previousStatus": "CONNECTED",
    "currentStatus": "AUTH_ERROR",
    "statusChangeReason": "Token expired and refresh failed"
  },
  "metadata": {
    "correlationId": "uuid",
    "source": "integration-service"
  }
}
```

## Error Handling

### Retry Policies

The Integration Service implements the following retry policies for internal communication:

| Interface Type | Retry Strategy | Backoff | Max Retries | Circuit Breaking |
|----------------|----------------|---------|-------------|------------------|
| Event Publishing | At-least-once | Exponential (100ms base, 2x multiplier) | 5 | Yes (10 failures in 30 sec) |
| Service Calls | At-least-once | Exponential (200ms base, 2x multiplier) | 3 | Yes (5 failures in 20 sec) |
| External API Calls | Configurable per method | Exponential (configurable) | Configurable | Yes (configurable) |
| Credential Store | At-least-once | Exponential (100ms base, 2x multiplier) | 5 | Yes (3 failures in 10 sec) |

### Fallback Mechanisms

When communication with dependent services fails, the following fallback mechanisms are used:

| Dependency | Fallback Approach | Impact |
|------------|-------------------|--------|
| Credential Store | Use locally cached credentials | Limited to credentials recently accessed; may use expired tokens |
| Event Bus | Buffer events locally and retry publishing | Events may be delivered with increased latency |
| External APIs | Use cached responses if available | May return stale data, with cache age indicated in response |
| Metrics/Logging | Buffer locally and write in batch | May delay visibility of operational metrics and logs |

## Related Documentation

* [Public API](./api.md)
* [Data Model](../data_model.md)
* [Method Executor](../implementation/method_executor.md)
* [Credential Manager](../implementation/credential_manager.md) 