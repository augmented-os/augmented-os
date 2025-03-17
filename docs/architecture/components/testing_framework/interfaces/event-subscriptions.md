# Testing Framework Event Subscriptions

This document describes the events published by the Testing Framework that other components can subscribe to.

## Overview

The Testing Framework publishes events at various points during the test lifecycle, allowing other components to react to test-related activities. These events follow a standardized format and are published to the platform's event bus.

## Event Format

All events follow this general structure:

```json
{
  "id": "evt-123456789",
  "type": "testing.test_execution.completed",
  "source": "testing-framework",
  "time": "2023-06-15T14:30:00Z",
  "data": {
    // Event-specific payload
  },
  "metadata": {
    "correlation_id": "corr-987654321",
    "tenant_id": "tenant-123"
  }
}
```

## Published Events

### Test Definition Events

#### `testing.test_definition.created`

Published when a new test definition is created.

**Payload:**

```json
{
  "test_id": "test-123",
  "name": "User Authentication Flow Test",
  "type": "workflow",
  "version": 1,
  "created_by": "user-456",
  "created_at": "2023-06-15T14:00:00Z"
}
```

#### `testing.test_definition.updated`

Published when an existing test definition is updated, creating a new version.

**Payload:**

```json
{
  "test_id": "test-123",
  "name": "User Authentication Flow Test",
  "type": "workflow",
  "version": 2,
  "previous_version": 1,
  "changes": "Updated test parameters",
  "updated_by": "user-456",
  "updated_at": "2023-06-15T15:00:00Z"
}
```

#### `testing.test_definition.deleted`

Published when a test definition is deleted (soft delete).

**Payload:**

```json
{
  "test_id": "test-123",
  "name": "User Authentication Flow Test",
  "deleted_by": "user-456",
  "deleted_at": "2023-06-15T16:00:00Z"
}
```

### Test Execution Events

#### `testing.test_execution.scheduled`

Published when a test execution is scheduled but not yet started.

**Payload:**

```json
{
  "execution_id": "exec-123",
  "test_id": "test-123",
  "test_version": 2,
  "scheduled_by": "user-456",
  "scheduled_at": "2023-06-15T14:15:00Z",
  "environment": "development",
  "parameters": {
    "timeout": 30000
  }
}
```

#### `testing.test_execution.started`

Published when a test execution begins.

**Payload:**

```json
{
  "execution_id": "exec-123",
  "test_id": "test-123",
  "test_version": 2,
  "started_at": "2023-06-15T14:20:00Z",
  "environment": "development"
}
```

#### `testing.test_execution.completed`

Published when a test execution completes successfully.

**Payload:**

```json
{
  "execution_id": "exec-123",
  "test_id": "test-123",
  "test_version": 2,
  "started_at": "2023-06-15T14:20:00Z",
  "completed_at": "2023-06-15T14:25:00Z",
  "duration_ms": 300000,
  "environment": "development",
  "results": {
    "success": true,
    "metrics": {
      "response_time_ms": 250,
      "cpu_usage_percent": 45
    },
    "assertions": {
      "passed": 10,
      "failed": 0,
      "skipped": 0
    }
  }
}
```

#### `testing.test_execution.failed`

Published when a test execution fails.

**Payload:**

```json
{
  "execution_id": "exec-123",
  "test_id": "test-123",
  "test_version": 2,
  "started_at": "2023-06-15T14:20:00Z",
  "failed_at": "2023-06-15T14:23:00Z",
  "duration_ms": 180000,
  "environment": "development",
  "error": {
    "code": "ASSERTION_FAILED",
    "message": "Expected status code 200 but got 500",
    "details": {
      "assertion": "response.status === 200",
      "actual": 500,
      "expected": 200
    }
  },
  "results": {
    "success": false,
    "metrics": {
      "response_time_ms": 350,
      "cpu_usage_percent": 60
    },
    "assertions": {
      "passed": 5,
      "failed": 1,
      "skipped": 4
    }
  }
}
```

#### `testing.test_execution.cancelled`

Published when a test execution is cancelled.

**Payload:**

```json
{
  "execution_id": "exec-123",
  "test_id": "test-123",
  "test_version": 2,
  "started_at": "2023-06-15T14:20:00Z",
  "cancelled_at": "2023-06-15T14:22:00Z",
  "cancelled_by": "user-789",
  "reason": "Environment maintenance required"
}
```

### Test Suite Events

#### `testing.test_suite.created`

Published when a new test suite is created.

**Payload:**

```json
{
  "suite_id": "suite-123",
  "name": "Authentication Test Suite",
  "test_count": 5,
  "created_by": "user-456",
  "created_at": "2023-06-15T14:00:00Z"
}
```

#### `testing.test_suite.updated`

Published when a test suite is updated.

**Payload:**

```json
{
  "suite_id": "suite-123",
  "name": "Authentication Test Suite",
  "test_count": 6,
  "updated_by": "user-456",
  "updated_at": "2023-06-15T15:00:00Z",
  "changes": "Added new test to suite"
}
```

#### `testing.test_suite.deleted`

Published when a test suite is deleted.

**Payload:**

```json
{
  "suite_id": "suite-123",
  "name": "Authentication Test Suite",
  "deleted_by": "user-456",
  "deleted_at": "2023-06-15T16:00:00Z"
}
```

#### `testing.test_suite.execution.started`

Published when a test suite execution begins.

**Payload:**

```json
{
  "suite_execution_id": "suite-exec-123",
  "suite_id": "suite-123",
  "suite_name": "Authentication Test Suite",
  "test_count": 5,
  "started_by": "user-456",
  "started_at": "2023-06-15T14:30:00Z",
  "environment": "development"
}
```

#### `testing.test_suite.execution.completed`

Published when a test suite execution completes.

**Payload:**

```json
{
  "suite_execution_id": "suite-exec-123",
  "suite_id": "suite-123",
  "suite_name": "Authentication Test Suite",
  "started_at": "2023-06-15T14:30:00Z",
  "completed_at": "2023-06-15T14:45:00Z",
  "duration_ms": 900000,
  "environment": "development",
  "summary": {
    "total": 5,
    "passed": 4,
    "failed": 1,
    "skipped": 0,
    "success_rate": 80.0
  },
  "test_executions": [
    {
      "execution_id": "exec-123",
      "test_id": "test-123",
      "status": "completed",
      "success": true
    },
    {
      "execution_id": "exec-124",
      "test_id": "test-124",
      "status": "failed",
      "success": false
    }
  ]
}
```

#### `testing.test_suite.execution.failed`

Published when a test suite execution fails (one or more tests failed).

**Payload:**

```json
{
  "suite_execution_id": "suite-exec-123",
  "suite_id": "suite-123",
  "suite_name": "Authentication Test Suite",
  "started_at": "2023-06-15T14:30:00Z",
  "failed_at": "2023-06-15T14:40:00Z",
  "duration_ms": 600000,
  "environment": "development",
  "summary": {
    "total": 5,
    "passed": 2,
    "failed": 3,
    "skipped": 0,
    "success_rate": 40.0
  },
  "failed_tests": [
    {
      "execution_id": "exec-124",
      "test_id": "test-124",
      "test_name": "User Login Test",
      "error": {
        "code": "ASSERTION_FAILED",
        "message": "Expected status code 200 but got 500"
      }
    }
  ]
}
```

## Subscribing to Events

Components can subscribe to these events through the platform's event bus. Here's an example of how to subscribe to test execution events:

```javascript
// Example pseudocode
eventBus.subscribe('testing.test_execution.*', (event) => {
  console.log(`Received test execution event: ${event.type}`);
  // Process the event
});
```

## Event Retention

Events are retained in the event bus for 30 days by default. For long-term storage and analysis, events are also stored in the platform's data warehouse.

## Best Practices

1. **Idempotent Handlers**: Implement event handlers that are idempotent to handle potential duplicate events
2. **Graceful Error Handling**: Handle event processing errors gracefully to avoid disrupting the event flow
3. **Selective Subscription**: Subscribe only to the events your component needs to process
4. **Event Validation**: Validate event payloads before processing them
5. **Correlation Tracking**: Use the correlation_id to track related events across the system 