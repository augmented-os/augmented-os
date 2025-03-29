# Testing Framework Service API Reference

## Overview

The Testing Framework Service exposes a RESTful API that allows clients to manage test definitions, execute tests, and retrieve test results. This document details the available endpoints, request formats, and response structures.

An OpenAPI specification is available at [testing-framework-api.yaml](./testing-framework-api.yaml) for integration with API tools and code generators.

## Base URL

```
/api/v1/testing
```

## Authentication

All API endpoints require authentication using either:

* Bearer token authentication
* API key in the `X-API-Key` header

## Endpoints

### Test Definitions

#### List Test Definitions

```
GET /test-definitions
```

Returns a list of available test definitions.

**Query Parameters:**

* `page`: Page number (default: 1)
* `limit`: Items per page (default: 20)
* `type`: Filter by test type (workflow, task, integration, system, performance)
* `target_id`: Filter by target component ID
* `tags`: Comma-separated list of tags to filter by
* `search`: Text search across name and description fields

**Response:**

```json
{
  "items": [
    {
      "test_id": "wf-booking-create-01",
      "name": "Create Booking Workflow Test",
      "description": "Tests the end-to-end booking creation workflow",
      "type": "workflow",
      "target": {
        "id": "booking-creation-workflow",
        "version": "1.2.0"
      },
      "version": 1,
      "tags": ["workflow", "booking", "creation"],
      "updatedAt": "2023-07-15T14:30:00Z"
    },
    {
      "test_id": "int-calendar-sync-01",
      "name": "Calendar Sync Integration Test",
      "description": "Tests the calendar synchronization with external calendar API",
      "type": "integration",
      "target": {
        "id": "calendar-integration",
        "version": "1.0.0"
      },
      "version": 2,
      "tags": ["integration", "calendar"],
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

#### Get Test Definition

```
GET /test-definitions/{test_id}
```

Returns details for a specific test definition.

**Path Parameters:**

* `test_id`: The unique identifier of the test definition

**Query Parameters:**

* `version`: Specific version to retrieve (optional, defaults to latest)

**Response:**

```json
{
  "test_id": "wf-booking-create-01",
  "name": "Create Booking Workflow Test",
  "description": "Tests the end-to-end booking creation workflow",
  "type": "workflow",
  "target": {
    "id": "booking-creation-workflow",
    "version": "1.2.0"
  },
  "parameters": {
    "customer_id": "cust-123",
    "service_type": "cleaning",
    "requested_date": "2023-06-15T10:00:00Z",
    "location": "123 Main St"
  },
  "assertions": [
    {
      "condition": "$.status",
      "expected": "COMPLETED",
      "message": "Workflow should complete successfully"
    },
    {
      "condition": "$.output.booking_id",
      "expected": "string",
      "message": "Workflow should generate a booking ID"
    }
  ],
  "timeout": 30,
  "tags": ["workflow", "booking", "creation"],
  "dependencies": [],
  "version": 1,
  "createdAt": "2023-06-10T08:30:00Z",
  "updatedAt": "2023-07-15T14:30:00Z"
}
```

#### Create Test Definition

```
POST /test-definitions
```

Creates a new test definition.

**Request Body:**

```json
{
  "test_id": "wf-booking-create-01",
  "name": "Create Booking Workflow Test",
  "description": "Tests the end-to-end booking creation workflow",
  "type": "workflow",
  "target": {
    "id": "booking-creation-workflow",
    "version": "1.2.0"
  },
  "parameters": {
    "customer_id": "cust-123",
    "service_type": "cleaning",
    "requested_date": "2023-06-15T10:00:00Z",
    "location": "123 Main St"
  },
  "assertions": [
    {
      "condition": "$.status",
      "expected": "COMPLETED",
      "message": "Workflow should complete successfully"
    },
    {
      "condition": "$.output.booking_id",
      "expected": "string",
      "message": "Workflow should generate a booking ID"
    }
  ],
  "timeout": 30,
  "tags": ["workflow", "booking", "creation"],
  "dependencies": []
}
```

**Response:**

```json
{
  "test_id": "wf-booking-create-01",
  "name": "Create Booking Workflow Test",
  "description": "Tests the end-to-end booking creation workflow",
  "type": "workflow",
  "target": {
    "id": "booking-creation-workflow",
    "version": "1.2.0"
  },
  "parameters": {
    "customer_id": "cust-123",
    "service_type": "cleaning",
    "requested_date": "2023-06-15T10:00:00Z",
    "location": "123 Main St"
  },
  "assertions": [
    {
      "condition": "$.status",
      "expected": "COMPLETED",
      "message": "Workflow should complete successfully"
    },
    {
      "condition": "$.output.booking_id",
      "expected": "string",
      "message": "Workflow should generate a booking ID"
    }
  ],
  "timeout": 30,
  "tags": ["workflow", "booking", "creation"],
  "dependencies": [],
  "version": 1,
  "createdAt": "2023-09-01T10:15:00Z",
  "updatedAt": "2023-09-01T10:15:00Z"
}
```

#### Update Test Definition

```
PUT /test-definitions/{test_id}
```

Updates an existing test definition, creating a new version.

**Path Parameters:**

* `test_id`: The unique identifier of the test definition

**Request Body:**

Same as Create Test Definition

**Response:**

Same as Get Test Definition, with incremented version number

### Test Execution

#### Execute Test

```
POST /test-executions
```

Executes a test and returns the result ID for tracking.

**Request Body:**

```json
{
  "test_id": "wf-booking-create-01",
  "parameters": {
    "customer_id": "cust-456",
    "service_type": "cleaning",
    "requested_date": "2023-10-15T14:00:00Z",
    "location": "456 Oak St"
  }
}
```

**Response:**

```json
{
  "result_id": "exec-12345-abcde",
  "test_id": "wf-booking-create-01",
  "status": "PENDING",
  "start_time": "2023-09-01T10:20:00Z"
}
```

#### Get Test Result

```
GET /test-results/{result_id}
```

Returns the result of a test execution.

**Path Parameters:**

* `result_id`: The unique identifier of the test result

**Response:**

```json
{
  "result_id": "exec-12345-abcde",
  "test_id": "wf-booking-create-01",
  "test_version": 1,
  "status": "PASSED",
  "start_time": "2023-09-01T10:20:00Z",
  "end_time": "2023-09-01T10:20:15Z",
  "duration_ms": 15000,
  "target_info": {
    "id": "booking-creation-workflow",
    "version": "1.2.0",
    "environment": "development"
  },
  "parameters": {
    "customer_id": "cust-456",
    "service_type": "cleaning",
    "requested_date": "2023-10-15T14:00:00Z",
    "location": "456 Oak St"
  },
  "assertion_results": [
    {
      "assertion_id": 0,
      "condition": "$.status",
      "expected": "COMPLETED",
      "actual": "COMPLETED",
      "passed": true
    },
    {
      "assertion_id": 1,
      "condition": "$.output.booking_id",
      "expected": "string",
      "actual": "booking-789",
      "passed": true
    }
  ],
  "artifacts": []
}
```

#### List Test Results

```
GET /test-results
```

Returns a list of test results.

**Query Parameters:**

* `page`: Page number (default: 1)
* `limit`: Items per page (default: 20)
* `test_id`: Filter by test ID
* `status`: Filter by status (PENDING, RUNNING, PASSED, FAILED, TIMEOUT, ERROR, SKIPPED)
* `start_time_from`: Filter by start time (ISO timestamp)
* `start_time_to`: Filter by start time (ISO timestamp)
* `target_id`: Filter by target component ID

**Response:**

```json
{
  "items": [
    {
      "result_id": "exec-12345-abcde",
      "test_id": "wf-booking-create-01",
      "test_version": 1,
      "status": "PASSED",
      "start_time": "2023-09-01T10:20:00Z",
      "end_time": "2023-09-01T10:20:15Z",
      "duration_ms": 15000
    },
    {
      "result_id": "exec-67890-fghij",
      "test_id": "int-calendar-sync-01",
      "test_version": 2,
      "status": "FAILED",
      "start_time": "2023-09-01T10:25:00Z",
      "end_time": "2023-09-01T10:25:10Z",
      "duration_ms": 10000
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

### Test Suites

#### List Test Suites

```
GET /test-suites
```

Returns a list of available test suites.

**Query Parameters:**

* `page`: Page number (default: 1)
* `limit`: Items per page (default: 20)
* `tags`: Comma-separated list of tags to filter by
* `search`: Text search across name and description fields

**Response:**

```json
{
  "items": [
    {
      "suite_id": "booking-e2e-suite",
      "name": "Booking End-to-End Test Suite",
      "description": "End-to-end tests for the booking system",
      "version": 1,
      "tags": ["booking", "e2e"],
      "updatedAt": "2023-07-15T14:30:00Z"
    },
    {
      "suite_id": "calendar-integration-suite",
      "name": "Calendar Integration Test Suite",
      "description": "Tests for calendar integration features",
      "version": 2,
      "tags": ["calendar", "integration"],
      "updatedAt": "2023-08-20T09:15:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 15,
    "pages": 1
  }
}
```

#### Execute Test Suite

```
POST /test-suite-executions
```

Executes a test suite and returns the suite result ID for tracking.

**Request Body:**

```json
{
  "suite_id": "booking-e2e-suite",
  "parameters": {
    "environment": "staging",
    "customer_id": "cust-456"
  }
}
```

**Response:**

```json
{
  "suite_result_id": "suite-exec-12345",
  "suite_id": "booking-e2e-suite",
  "status": "PENDING",
  "start_time": "2023-09-01T10:30:00Z"
}
```

#### Get Test Suite Result

```
GET /test-suite-results/{suite_result_id}
```

Returns the result of a test suite execution.

**Path Parameters:**

* `suite_result_id`: The unique identifier of the test suite result

**Response:**

```json
{
  "suite_result_id": "suite-exec-12345",
  "suite_id": "booking-e2e-suite",
  "suite_version": 1,
  "status": "COMPLETED",
  "start_time": "2023-09-01T10:30:00Z",
  "end_time": "2023-09-01T10:32:00Z",
  "duration_ms": 120000,
  "test_results": ["exec-12345-abcde", "exec-67890-fghij", "exec-54321-klmno"],
  "summary": {
    "total": 3,
    "passed": 2,
    "failed": 1,
    "error": 0,
    "skipped": 0
  }
}
```

## Error Handling

The API uses standard HTTP status codes to indicate the success or failure of requests.

### Common Error Codes

| Status Code | Description |
|----|----|
| 400 | Bad Request - The request was malformed or contains invalid parameters |
| 401 | Unauthorized - Authentication is required or failed |
| 403 | Forbidden - The authenticated user lacks permission |
| 404 | Not Found - The requested resource does not exist |
| 409 | Conflict - The request conflicts with the current state |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - An unexpected error occurred |

### Error Response Format

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      "field1": "Error details for field1",
      "field2": "Error details for field2"
    },
    "requestId": "unique-request-identifier"
  }
}
```

## Rate Limiting

The API implements rate limiting to ensure fair usage. Limits are applied per API key or user.

| Endpoint | Rate Limit |
|----|----|
| All endpoints | 100 requests per minute |
| POST/PUT/DELETE | 50 requests per minute |

Rate limit information is included in response headers:

* `X-RateLimit-Limit`: Total requests allowed in the period
* `X-RateLimit-Remaining`: Requests remaining in the period
* `X-RateLimit-Reset`: Time when the rate limit resets (Unix timestamp)

## Related Documentation

* [Data Model](../data_model.md)
* [Test Definition Manager](../implementation/test_definition_manager.md)
* [Test Executor](../implementation/test_executor.md)
* [Test Suite Manager](../implementation/test_suite_manager.md) 