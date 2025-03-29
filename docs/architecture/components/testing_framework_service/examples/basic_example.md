# Testing Framework Service Basic Examples

This document provides basic examples of using the Testing Framework Service for common testing scenarios.

## Creating a Simple Test Definition

The following example demonstrates how to create a basic test definition for validating a workflow.

### API Request

```http
POST /testing/test-definitions
Content-Type: application/json
Authorization: Bearer <your_token>

{
  "name": "User Registration Workflow Test",
  "description": "Validates the user registration workflow functions correctly",
  "type": "workflow",
  "target_id": "workflow-user-registration",
  "target_type": "workflow",
  "tags": ["user", "registration", "workflow", "critical-path"],
  "test_script": {
    "inputs": {
      "email": "test@example.com",
      "password": "SecurePassword123!",
      "firstName": "Test",
      "lastName": "User"
    },
    "assertions": [
      {
        "type": "status",
        "expected": "completed"
      },
      {
        "type": "output",
        "path": "$.userId",
        "operator": "exists"
      },
      {
        "type": "output",
        "path": "$.verificationEmailSent",
        "operator": "equals",
        "expected": true
      },
      {
        "type": "duration",
        "operator": "lessThan",
        "expected": 5000
      }
    ]
  },
  "parameters": {
    "timeout": 30000,
    "retries": 1
  }
}
```

### API Response

```http
HTTP/1.1 201 Created
Content-Type: application/json

{
  "id": "test-123456",
  "name": "User Registration Workflow Test",
  "description": "Validates the user registration workflow functions correctly",
  "type": "workflow",
  "target_id": "workflow-user-registration",
  "target_type": "workflow",
  "version": 1,
  "tags": ["user", "registration", "workflow", "critical-path"],
  "test_script": {
    "inputs": {
      "email": "test@example.com",
      "password": "SecurePassword123!",
      "firstName": "Test",
      "lastName": "User"
    },
    "assertions": [
      {
        "type": "status",
        "expected": "completed"
      },
      {
        "type": "output",
        "path": "$.userId",
        "operator": "exists"
      },
      {
        "type": "output",
        "path": "$.verificationEmailSent",
        "operator": "equals",
        "expected": true
      },
      {
        "type": "duration",
        "operator": "lessThan",
        "expected": 5000
      }
    ]
  },
  "parameters": {
    "timeout": 30000,
    "retries": 1
  },
  "created_at": "2023-06-15T10:30:00Z",
  "updated_at": "2023-06-15T10:30:00Z",
  "created_by": "user-789012"
}
```

## Executing a Test

This example shows how to execute a test and retrieve the results.

### Initiating Test Execution

```http
POST /testing/test-executions
Content-Type: application/json
Authorization: Bearer <your_token>

{
  "test_id": "test-123456",
  "parameters": {
    "environment": "development"
  }
}
```

### Execution Response

```http
HTTP/1.1 202 Accepted
Content-Type: application/json

{
  "execution_id": "exec-789012",
  "test_id": "test-123456",
  "test_version": 1,
  "status": "pending",
  "parameters": {
    "environment": "development",
    "timeout": 30000,
    "retries": 1
  },
  "created_at": "2023-06-15T11:00:00Z",
  "created_by": "user-789012"
}
```

### Checking Execution Status

```http
GET /testing/test-executions/exec-789012
Authorization: Bearer <your_token>
```

### Status Response (In Progress)

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "execution_id": "exec-789012",
  "test_id": "test-123456",
  "test_version": 1,
  "status": "running",
  "start_time": "2023-06-15T11:00:05Z",
  "parameters": {
    "environment": "development",
    "timeout": 30000,
    "retries": 1
  },
  "created_at": "2023-06-15T11:00:00Z",
  "created_by": "user-789012"
}
```

### Status Response (Completed)

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "execution_id": "exec-789012",
  "test_id": "test-123456",
  "test_version": 1,
  "status": "completed",
  "start_time": "2023-06-15T11:00:05Z",
  "end_time": "2023-06-15T11:00:12Z",
  "duration_ms": 7000,
  "parameters": {
    "environment": "development",
    "timeout": 30000,
    "retries": 1
  },
  "results": {
    "success": true,
    "assertions": {
      "passed": 4,
      "failed": 0,
      "skipped": 0
    },
    "details": [
      {
        "type": "status",
        "expected": "completed",
        "actual": "completed",
        "success": true
      },
      {
        "type": "output",
        "path": "$.userId",
        "operator": "exists",
        "actual": "user-abcdef",
        "success": true
      },
      {
        "type": "output",
        "path": "$.verificationEmailSent",
        "operator": "equals",
        "expected": true,
        "actual": true,
        "success": true
      },
      {
        "type": "duration",
        "operator": "lessThan",
        "expected": 5000,
        "actual": 3245,
        "success": true
      }
    ],
    "output": {
      "userId": "user-abcdef",
      "verificationEmailSent": true,
      "registrationTimestamp": "2023-06-15T11:00:10Z"
    }
  },
  "created_at": "2023-06-15T11:00:00Z",
  "created_by": "user-789012"
}
```

## Creating a Task Test

This example demonstrates creating a test for a specific task.

```http
POST /testing/test-definitions
Content-Type: application/json
Authorization: Bearer <your_token>

{
  "name": "Email Sending Task Test",
  "description": "Validates the email sending task functions correctly",
  "type": "task",
  "target_id": "task-send-email",
  "target_type": "task",
  "tags": ["email", "notification", "task"],
  "test_script": {
    "inputs": {
      "to": "recipient@example.com",
      "subject": "Test Email",
      "body": "This is a test email from the Testing Framework Service."
    },
    "assertions": [
      {
        "type": "status",
        "expected": "completed"
      },
      {
        "type": "output",
        "path": "$.messageId",
        "operator": "exists"
      },
      {
        "type": "output",
        "path": "$.delivered",
        "operator": "equals",
        "expected": true
      }
    ]
  },
  "parameters": {
    "timeout": 10000
  }
}
```

## Creating an Integration Test

This example shows how to create a test for an integration.

```http
POST /testing/test-definitions
Content-Type: application/json
Authorization: Bearer <your_token>

{
  "name": "Payment Gateway Integration Test",
  "description": "Validates the payment gateway integration functions correctly",
  "type": "integration",
  "target_id": "integration-payment-gateway",
  "target_type": "integration",
  "tags": ["payment", "integration", "external"],
  "test_script": {
    "inputs": {
      "amount": 10.00,
      "currency": "USD",
      "cardNumber": "4111111111111111",
      "expiryMonth": "12",
      "expiryYear": "2025",
      "cvv": "123"
    },
    "assertions": [
      {
        "type": "status",
        "expected": "completed"
      },
      {
        "type": "output",
        "path": "$.transactionId",
        "operator": "exists"
      },
      {
        "type": "output",
        "path": "$.status",
        "operator": "equals",
        "expected": "approved"
      },
      {
        "type": "output",
        "path": "$.errorCode",
        "operator": "equals",
        "expected": null
      }
    ]
  },
  "parameters": {
    "timeout": 15000,
    "useMock": true
  }
}
```

## Retrieving Test Definitions

### List All Tests

```http
GET /testing/test-definitions
Authorization: Bearer <your_token>
```

### Filter Tests by Type

```http
GET /testing/test-definitions?type=workflow
Authorization: Bearer <your_token>
```

### Filter Tests by Tags

```http
GET /testing/test-definitions?tags=critical-path,user
Authorization: Bearer <your_token>
```

### Search Tests by Name

```http
GET /testing/test-definitions?search=registration
Authorization: Bearer <your_token>
```

## Updating a Test Definition

```http
PUT /testing/test-definitions/test-123456
Content-Type: application/json
Authorization: Bearer <your_token>

{
  "name": "User Registration Workflow Test",
  "description": "Validates the user registration workflow functions correctly with updated assertions",
  "type": "workflow",
  "target_id": "workflow-user-registration",
  "target_type": "workflow",
  "tags": ["user", "registration", "workflow", "critical-path", "updated"],
  "test_script": {
    "inputs": {
      "email": "test@example.com",
      "password": "SecurePassword123!",
      "firstName": "Test",
      "lastName": "User"
    },
    "assertions": [
      {
        "type": "status",
        "expected": "completed"
      },
      {
        "type": "output",
        "path": "$.userId",
        "operator": "exists"
      },
      {
        "type": "output",
        "path": "$.verificationEmailSent",
        "operator": "equals",
        "expected": true
      },
      {
        "type": "output",
        "path": "$.userRole",
        "operator": "equals",
        "expected": "standard"
      },
      {
        "type": "duration",
        "operator": "lessThan",
        "expected": 5000
      }
    ]
  },
  "parameters": {
    "timeout": 30000,
    "retries": 2
  }
}
```

## Common Assertion Patterns

### Status Assertions

```json
{
  "type": "status",
  "expected": "completed"
}
```

### Output Existence Assertions

```json
{
  "type": "output",
  "path": "$.userId",
  "operator": "exists"
}
```

### Output Value Assertions

```json
{
  "type": "output",
  "path": "$.status",
  "operator": "equals",
  "expected": "success"
}
```

### Numeric Comparison Assertions

```json
{
  "type": "output",
  "path": "$.amount",
  "operator": "greaterThan",
  "expected": 0
}
```

### Array Assertions

```json
{
  "type": "output",
  "path": "$.items",
  "operator": "hasLength",
  "expected": 3
}
```

### Pattern Matching Assertions

```json
{
  "type": "output",
  "path": "$.email",
  "operator": "matches",
  "expected": "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
}
```

### Duration Assertions

```json
{
  "type": "duration",
  "operator": "lessThan",
  "expected": 5000
}
```

## Viewing Test Execution Logs

```http
GET /testing/test-executions/exec-789012/logs
Authorization: Bearer <your_token>
```

Response:

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "items": [
    {
      "timestamp": "2023-06-15T11:00:05Z",
      "level": "info",
      "message": "Test execution started",
      "context": {
        "test_id": "test-123456",
        "execution_id": "exec-789012"
      }
    },
    {
      "timestamp": "2023-06-15T11:00:06Z",
      "level": "info",
      "message": "Workflow execution initiated",
      "context": {
        "workflow_id": "workflow-user-registration",
        "workflow_execution_id": "wf-exec-345678"
      }
    },
    {
      "timestamp": "2023-06-15T11:00:10Z",
      "level": "info",
      "message": "Workflow execution completed",
      "context": {
        "workflow_id": "workflow-user-registration",
        "workflow_execution_id": "wf-exec-345678",
        "duration_ms": 3245
      }
    },
    {
      "timestamp": "2023-06-15T11:00:11Z",
      "level": "info",
      "message": "Assertion evaluation started",
      "context": {
        "assertions_count": 4
      }
    },
    {
      "timestamp": "2023-06-15T11:00:12Z",
      "level": "info",
      "message": "Test execution completed",
      "context": {
        "test_id": "test-123456",
        "execution_id": "exec-789012",
        "status": "completed",
        "success": true,
        "duration_ms": 7000
      }
    }
  ]
}
```

## Cancelling a Test Execution

```http
DELETE /testing/test-executions/exec-789012
Authorization: Bearer <your_token>
```

Response:

```http
HTTP/1.1 204 No Content
```

## Error Handling Examples

### Test Not Found

```http
GET /testing/test-definitions/test-nonexistent
Authorization: Bearer <your_token>
```

Response:

```http
HTTP/1.1 404 Not Found
Content-Type: application/json

{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Test definition with ID 'test-nonexistent' not found",
    "details": {
      "resource_type": "test_definition",
      "resource_id": "test-nonexistent"
    }
  }
}
```

### Invalid Test Definition

```http
POST /testing/test-definitions
Content-Type: application/json
Authorization: Bearer <your_token>

{
  "name": "Invalid Test",
  "type": "unknown_type",
  "test_script": {
    "inputs": {}
  }
}
```

Response:

```http
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid test definition",
    "details": {
      "type": "Value 'unknown_type' is not a valid test type. Allowed values are: workflow, task, integration, system, performance",
      "target_id": "This field is required",
      "target_type": "This field is required",
      "test_script.assertions": "At least one assertion is required"
    }
  }
}
``` 