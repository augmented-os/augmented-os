# Task Execution Service API Reference

## Overview

The Task Execution Service Service exposes a RESTful API that allows clients to submit, monitor, and manage tasks. This document details the available endpoints, request formats, and response structures.

An OpenAPI specification is available at [task-execution-layer-api.yaml](./task-execution-layer-api.yaml) for integration with API tools and code generators.

## Base URL

```
/api/v1/tasks
```

## Authentication

All API endpoints require authentication using the [Auth Service](../../../auth_service/). Authentication can be provided in one of the following ways:

* Bearer token authentication with a valid JWT token issued by the Auth Service
* API key in the `X-API-Key` header (for service-to-service communication)

### Permission Requirements

Different endpoints require specific permissions assigned through the Auth Service's role-based access control system:

| Endpoint                      | Required Permission              | Description                                |
|-------------------------------|----------------------------------|--------------------------------------------|
| `POST /tasks`                 | `tasks:execute`                  | Submit tasks for execution                 |
| `GET /tasks/{id}`             | `tasks:read`                     | Get task status and details                |
| `POST /tasks/{id}/cancel`     | `tasks:cancel`                   | Cancel a running or pending task           |
| `GET /tasks`                  | `tasks:list`                     | List tasks                                 |
| `GET /definitions`            | `tasks:definitions:list`         | List task definitions                      |
| `GET /definitions/{id}`       | `tasks:definitions:read`         | Get a specific task definition             |

#### Service-to-Service Authentication

For service-to-service communication (e.g., from the Workflow Orchestrator), the service uses a dedicated service account with appropriate permissions. The Auth Service validates the service identity and ensures that it has the necessary permissions to execute the requested operations.

For information on setting up roles and permissions, see the [Role-Based Access Control](../../../auth_service/examples/role_based_access.md) documentation.

For details on service-to-service authentication, see the [Service-to-Service Authentication](../../../auth_service/examples/service_to_service_auth.md) documentation.

## Endpoints

### Task Management

#### Submit Task

```
POST /
```

Submits a new task for execution.

**Request Body:**

```json
{
  "taskDefinitionId": "string",
  "workflowInstanceId": "string",
  "input": {
    "property1": "value1",
    "property2": "value2"
  },
  "priority": "MEDIUM",
  "executionConfig": {
    "timeout": 3600000,
    "retryPolicy": {
      "maxRetries": 3,
      "retryInterval": 60000,
      "backoffMultiplier": 2
    }
  }
}
```

**Response:**

```json
{
  "id": "task-123456",
  "status": "PENDING",
  "createdAt": "2023-07-15T14:30:00Z"
}
```

**Status Codes:**

* `201 Created` - Task successfully submitted
* `400 Bad Request` - Invalid request format
* `404 Not Found` - Task definition not found
* `422 Unprocessable Entity` - Task validation failed

#### Get Task Status

```
GET /{taskId}
```

Retrieves the current status and details of a task.

**Path Parameters:**

* `taskId` - The ID of the task to retrieve

**Response:**

```json
{
  "id": "task-123456",
  "taskDefinitionId": "calculate-order-total",
  "workflowInstanceId": "order-workflow-789",
  "status": "COMPLETED",
  "type": "AUTOMATED",
  "input": {
    "orderId": "ORD-123",
    "items": [
      {"id": "ITEM-1", "quantity": 2, "price": 10.99},
      {"id": "ITEM-2", "quantity": 1, "price": 24.99}
    ]
  },
  "output": {
    "subtotal": 46.97,
    "tax": 3.76,
    "total": 50.73
  },
  "executionMetadata": {
    "startTime": "2023-07-15T14:30:05Z",
    "endTime": "2023-07-15T14:30:07Z",
    "duration": 2000,
    "executionEnvironment": "standard-executor-pod-123"
  },
  "createdAt": "2023-07-15T14:30:00Z",
  "updatedAt": "2023-07-15T14:30:07Z"
}
```

**Status Codes:**

* `200 OK` - Task found and returned
* `404 Not Found` - Task not found

#### Cancel Task

```
POST /{taskId}/cancel
```

Cancels a running or pending task.

**Path Parameters:**

* `taskId` - The ID of the task to cancel

**Request Body:**

```json
{
  "reason": "User requested cancellation",
  "force": false
}
```

**Response:**

```json
{
  "id": "task-123456",
  "status": "CANCELLED",
  "updatedAt": "2023-07-15T14:35:00Z"
}
```

**Status Codes:**

* `200 OK` - Task successfully cancelled
* `400 Bad Request` - Invalid request format
* `404 Not Found` - Task not found
* `409 Conflict` - Task cannot be cancelled (already completed)

#### List Tasks

```
GET /
```

Returns a list of tasks based on filter criteria.

**Query Parameters:**

* `status` - Filter by task status (e.g., `PENDING`, `RUNNING`, `COMPLETED`)
* `type` - Filter by task type (e.g., `AUTOMATED`, `MANUAL`, `INTEGRATION`)
* `workflowInstanceId` - Filter by workflow instance ID
* `page` - Page number (default: 1)
* `limit` - Items per page (default: 20)

**Response:**

```json
{
  "items": [
    {
      "id": "task-123456",
      "taskDefinitionId": "calculate-order-total",
      "status": "COMPLETED",
      "type": "AUTOMATED",
      "createdAt": "2023-07-15T14:30:00Z",
      "updatedAt": "2023-07-15T14:30:07Z"
    },
    {
      "id": "task-123457",
      "taskDefinitionId": "process-payment",
      "status": "RUNNING",
      "type": "INTEGRATION",
      "createdAt": "2023-07-15T14:31:00Z",
      "updatedAt": "2023-07-15T14:31:05Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalItems": 42,
    "totalPages": 3
  }
}
```

### Task Definitions

#### List Task Definitions

```
GET /definitions
```

Returns a list of available task definitions.

**Query Parameters:**

* `type` - Filter by task type
* `search` - Text search across name and description fields
* `page` - Page number (default: 1)
* `limit` - Items per page (default: 20)

**Response:**

```json
{
  "items": [
    {
      "id": "calculate-order-total",
      "name": "Calculate Order Total",
      "description": "Calculates the total price of an order including taxes",
      "type": "AUTOMATED",
      "version": "1.2.0"
    },
    {
      "id": "process-payment",
      "name": "Process Payment",
      "description": "Processes payment through payment gateway",
      "type": "INTEGRATION",
      "version": "1.0.5"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalItems": 15,
    "totalPages": 1
  }
}
```

#### Get Task Definition

```
GET /definitions/{definitionId}
```

Retrieves a specific task definition.

**Path Parameters:**

* `definitionId` - The ID of the task definition to retrieve

**Response:**

```json
{
  "id": "calculate-order-total",
  "name": "Calculate Order Total",
  "description": "Calculates the total price of an order including taxes",
  "type": "AUTOMATED",
  "version": "1.2.0",
  "inputSchema": {
    "type": "object",
    "properties": {
      "orderId": {
        "type": "string",
        "description": "Order identifier"
      },
      "items": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "id": { "type": "string" },
            "quantity": { "type": "number" },
            "price": { "type": "number" }
          },
          "required": ["id", "quantity", "price"]
        }
      }
    },
    "required": ["orderId", "items"]
  },
  "outputSchema": {
    "type": "object",
    "properties": {
      "subtotal": { "type": "number" },
      "tax": { "type": "number" },
      "total": { "type": "number" }
    },
    "required": ["subtotal", "tax", "total"]
  },
  "timeout": 60000,
  "retryPolicy": {
    "maxRetries": 3,
    "retryInterval": 60000,
    "backoffMultiplier": 2
  },
  "executionConfig": {
    "executor": "standard-executor",
    "securityContext": {
      "securityLevel": "LOW"
    },
    "resourceRequirements": {
      "cpu": "0.1",
      "memory": "128Mi",
      "timeoutSeconds": 60
    }
  },
  "createdAt": "2023-06-01T10:00:00Z",
  "updatedAt": "2023-07-01T11:30:00Z"
}
```

## Error Responses

All API endpoints return standard error responses in the following format:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "items",
      "issue": "Array must contain at least one item"
    }
  }
}
```

Common error codes:

| Error Code | Description |
|------------|-------------|
| `VALIDATION_ERROR` | Request validation failed |
| `NOT_FOUND` | Requested resource not found |
| `UNAUTHORIZED` | Authentication required |
| `FORBIDDEN` | Insufficient permissions |
| `CONFLICT` | Resource state conflict |
| `INTERNAL_ERROR` | Internal server error |

## Rate Limiting

The API implements rate limiting to prevent abuse. Limits are applied per API key or user.

* Default rate limit: 100 requests per minute
* Bulk operations: 20 requests per minute

Rate limit headers are included in all responses:

* `X-RateLimit-Limit`: Total requests allowed per time window
* `X-RateLimit-Remaining`: Remaining requests in current time window
* `X-RateLimit-Reset`: Time when the rate limit resets (Unix timestamp)

When rate limited, the API returns a `429 Too Many Requests` status code.