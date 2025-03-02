# Workflow Orchestrator API Reference

## Overview

The Workflow Orchestrator Service exposes a RESTful API that allows clients to manage workflows throughout their lifecycle. This document details the available endpoints, request formats, and response structures.

## Base URL

```
/api/v1/workflows
```

## Authentication

All API endpoints require authentication using either:

* Bearer token authentication
* API key in the `X-API-Key` header

## Endpoints

### Workflow Definitions

#### List Workflow Definitions

```
GET /definitions
```

Returns a list of available workflow definitions.

**Query Parameters:**

* `page`: Page number (default: 1)
* `limit`: Items per page (default: 20)
* `search`: Text search across name and description fields

**Response:**

```json
{
  "items": [
    {
      "id": "order-processing-wf",
      "name": "Order Processing Workflow",
      "description": "Processes customer orders from placement to fulfillment",
      "version": "1.2.0",
      "updatedAt": "2023-07-15T14:30:00Z"
    }
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "limit": 20
  }
}
```

#### Get Workflow Definition

```
GET /definitions/{definitionId}
```

Returns the complete definition of a workflow.

**Response:**

```json
{
  "id": "order-processing-wf",
  "name": "Order Processing Workflow",
  "description": "Processes customer orders from placement to fulfillment",
  "version": "1.2.0",
  "steps": [
    {
      "stepId": "validate_order",
      "type": "TASK",
      "taskId": "order_validation_task",
      "transitions": {
        "default": "process_payment",
        "VALIDATION_FAILED": "notify_customer"
      }
    },
    // Additional steps...
  ],
  "compensationSteps": [
    // Compensation steps...
  ],
  "cancellationTriggers": [
    // Cancellation configuration...
  ],
  "createdBy": "system",
  "createdAt": "2023-05-10T09:00:00Z",
  "updatedAt": "2023-07-15T14:30:00Z"
}
```

#### Create Workflow Definition

```
POST /definitions
```

Creates a new workflow definition.

**Request Body:**

```json
{
  "id": "return-processing-wf",
  "name": "Return Processing Workflow",
  "description": "Handles customer returns and refunds",
  "steps": [
    // Workflow steps...
  ],
  "compensationSteps": [
    // Compensation steps...
  ]
}
```

**Response:** The created workflow definition

#### Update Workflow Definition

```
PUT /definitions/{definitionId}
```

Updates an existing workflow definition. This creates a new version of the definition.

**Request Body:** Same as create

**Response:** The updated workflow definition

### Workflow Instances

#### Start Workflow

```
POST /instances
```

Starts a new workflow instance.

**Request Body:**

```json
{
  "definitionId": "order-processing-wf",
  "input": {
    "orderId": "ORD-12345",
    "customerId": "CUST-789",
    "items": [
      {
        "productId": "PROD-001",
        "quantity": 2
      }
    ]
  },
  "correlationId": "ORD-12345"
}
```

**Response:**

```json
{
  "instanceId": "wf-inst-abcd1234",
  "definitionId": "order-processing-wf",
  "status": "RUNNING",
  "startedAt": "2023-08-01T15:45:30Z"
}
```

#### Get Workflow Instance

```
GET /instances/{instanceId}
```

Returns the current state of a workflow instance.

**Response:**

```json
{
  "id": "wf-inst-abcd1234",
  "workflowDefinitionId": "order-processing-wf",
  "status": "RUNNING",
  "currentStepId": "process_payment",
  "input": {
    "orderId": "ORD-12345",
    "customerId": "CUST-789"
  },
  "state": {
    "variables": {
      "orderValidated": true,
      "paymentId": "PAY-9876"
    },
    "steps": {
      "validate_order": {
        "status": "COMPLETED",
        "output": {
          "isValid": true
        },
        "completedAt": "2023-08-01T15:46:00Z"
      }
    }
  },
  "startedAt": "2023-08-01T15:45:30Z",
  "updatedAt": "2023-08-01T15:46:00Z"
}
```

#### List Workflow Instances

```
GET /instances
```

Returns a list of workflow instances.

**Query Parameters:**

* `definitionId`: Filter by workflow definition
* `status`: Filter by status
* `correlationId`: Filter by correlation ID
* `page`: Page number
* `limit`: Items per page

**Response:** List of workflow instances with pagination

#### Cancel Workflow

```
POST /instances/{instanceId}/cancel
```

Cancels a running workflow instance.

**Request Body:**

```json
{
  "reason": "Customer requested cancellation",
  "shouldCompensate": true
}
```

**Response:**

```json
{
  "id": "wf-inst-abcd1234",
  "status": "CANCELLING",
  "cancellation": {
    "reason": "Customer requested cancellation",
    "requestedAt": "2023-08-01T16:30:00Z",
    "shouldCompensate": true
  }
}
```

#### Signal Workflow

```
POST /instances/{instanceId}/signal
```

Sends a signal to a workflow instance, typically used to trigger transitions or provide additional data.

**Request Body:**

```json
{
  "type": "MANUAL_APPROVAL",
  "payload": {
    "approved": true,
    "approvedBy": "user@example.com",
    "comments": "Looks good"
  }
}
```

**Response:**

```json
{
  "id": "wf-inst-abcd1234",
  "signalProcessed": true,
  "updatedAt": "2023-08-01T16:35:00Z"
}
```

### Workflow History

#### Get Workflow Execution History

```
GET /instances/{instanceId}/history
```

Returns the execution history of a workflow instance.

**Response:**

```json
{
  "instanceId": "wf-inst-abcd1234",
  "events": [
    {
      "type": "WORKFLOW_STARTED",
      "timestamp": "2023-08-01T15:45:30Z",
      "details": {
        "input": {
          "orderId": "ORD-12345"
        }
      }
    },
    {
      "type": "STEP_STARTED",
      "timestamp": "2023-08-01T15:45:35Z",
      "details": {
        "stepId": "validate_order"
      }
    },
    {
      "type": "STEP_COMPLETED",
      "timestamp": "2023-08-01T15:46:00Z",
      "details": {
        "stepId": "validate_order",
        "output": {
          "isValid": true
        }
      }
    }
  ]
}
```

## Error Responses

All error responses follow this format:

```json
{
  "error": {
    "code": "WORKFLOW_NOT_FOUND",
    "message": "Workflow instance wf-inst-xyz123 not found",
    "details": {
      // Additional error details if available
    }
  }
}
```

Common error codes:

* `WORKFLOW_NOT_FOUND`: The requested workflow instance doesn't exist
* `DEFINITION_NOT_FOUND`: The requested workflow definition doesn't exist
* `INVALID_REQUEST`: The request is malformed
* `UNAUTHORIZED`: Authentication failed
* `FORBIDDEN`: The authenticated user doesn't have permission
* `CONFLICT`: The operation conflicts with the current state
* `INTERNAL_ERROR`: An unexpected server error occurred

## Rate Limiting

API requests are subject to rate limiting. The current limits are:

* 100 requests per minute for listing operations
* 50 requests per minute for instance operations
* 20 requests per minute for definition operations

Rate limit headers are included in all responses:

* `X-RateLimit-Limit`: The rate limit ceiling
* `X-RateLimit-Remaining`: The number of requests left for the time window
* `X-RateLimit-Reset`: The remaining window before the rate limit resets in UTC epoch seconds


