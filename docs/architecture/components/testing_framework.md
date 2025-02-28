# Testing Framework

## Overview

The Testing Framework is a core component responsible for validating workflows, tasks, and integrations across the Augmented OS platform. It provides a structured approach to defining, executing, and evaluating tests to ensure system quality and reliability. The framework follows the definition-driven architecture approach, separating test definitions from test execution results, enabling version-controlled test plans that can be executed repeatedly against evolving system implementations.

## Architecture

The Testing Framework integrates with the other system components to validate their functionality both in isolation and as part of end-to-end workflows. It leverages the event-driven nature of the system to observe and validate behavior during test execution.

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Test           │────▶│  Testing        │────▶│  System Under   │
│  Definitions    │     │  Framework      │     │  Test           │
│                 │     │                 │     │                 │
└─────────────────┘     └────────┬────────┘     └─────────────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │                 │
                        │  Test Results   │
                        │  Store          │
                        │                 │
                        └─────────────────┘
```

## Component Structure

Test definitions follow a structured format that specifies test parameters, expected outcomes, and validation criteria:

```json
{
  "test_id": "string",            // Unique identifier for the test
  "name": "string",               // Human-readable test name
  "description": "string",        // Detailed test description
  "type": "string",               // Type of test (e.g., "workflow", "task", "integration")
  "target": {                     // Component to be tested
    "id": "string",               // ID of the target (workflow_id, task_id, etc.)
    "version": "string"           // Version of the target
  },
  "parameters": {                 // Input parameters for the test
    "property": "value"           // Key-value pairs of test parameters
  },
  "assertions": [                 // List of assertions to validate
    {
      "condition": "string",      // Assertion condition
      "expected": "any",          // Expected value or outcome
      "message": "string"         // Message to display if assertion fails
    }
  ],
  "timeout": "number",            // Maximum test duration in seconds
  "tags": ["string"],             // Tags for categorizing tests
  "dependencies": ["string"]      // IDs of tests that must succeed before this test
}
```

## Implementation Details

### Core Functionality

The Testing Framework provides these core capabilities:

1. **Test Definition Management**: Storing, versioning, and retrieving test definitions from the `test_definitions` table
2. **Test Execution**: Running tests against target components with specified parameters
3. **Result Capture**: Recording detailed test results, including timestamps, execution time, and assertion outcomes
4. **Dependency Management**: Handling test dependencies and execution ordering
5. **Test Suites**: Grouping related tests for batch execution
6. **Reporting**: Generating test reports and performance metrics

### Interfaces

The Testing Framework exposes the following interfaces:

1. **Test Management API**:
   - `registerTestDefinition(definition)`: Registers a new test definition
   - `updateTestDefinition(id, definition)`: Updates an existing test definition
   - `getTestDefinition(id)`: Retrieves a test definition by ID
   - `listTestDefinitions(filter)`: Lists test definitions with optional filtering

2. **Test Execution API**:
   - `executeTest(testId, parameters)`: Executes a single test
   - `executeTestSuite(suiteId, parameters)`: Executes a suite of tests
   - `getTestResult(testResultId)`: Retrieves test result by ID
   - `listTestResults(filter)`: Lists test results with optional filtering

3. **Event Listeners**:
   - Subscribes to system events for monitoring test execution flow
   - Captures event data for validating against assertions

### Dependencies

The Testing Framework depends on:

1. **Event Processing Service**: For monitoring events during test execution
2. **Workflow Orchestrator**: For executing workflow tests
3. **Task Execution Layer**: For executing task tests
4. **Integration Service**: For executing integration tests
5. **Validation Service**: For validating test inputs and outputs
6. **PostgreSQL Database**: For storing test definitions and results

### Configuration

Configuration options include:

1. **Concurrency Settings**: Maximum number of concurrent test executions
2. **Retry Policy**: Configuration for automatic test retries
3. **Reporting Options**: Format and destination for test reports
4. **Logging Level**: Detail level for test execution logs
5. **Notification Settings**: Configuration for test result notifications

## Examples

### Basic Workflow Test

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

This test verifies that the booking creation workflow completes successfully and generates a booking ID when provided with valid input parameters.

### Integration Test

```json
{
  "test_id": "int-calendar-sync-01",
  "name": "Calendar Sync Integration Test",
  "description": "Tests the calendar synchronization with external calendar API",
  "type": "integration",
  "target": {
    "id": "calendar-integration",
    "version": "1.0.0"
  },
  "parameters": {
    "event": {
      "title": "Client Meeting",
      "start_time": "2023-06-16T14:00:00Z",
      "end_time": "2023-06-16T15:00:00Z",
      "participants": ["user1@example.com", "user2@example.com"]
    }
  },
  "assertions": [
    {
      "condition": "$.status",
      "expected": "success",
      "message": "Calendar integration should succeed"
    },
    {
      "condition": "$.response.event_id",
      "expected": "string",
      "message": "Integration should return an event ID"
    }
  ],
  "timeout": 15,
  "tags": ["integration", "calendar"],
  "dependencies": []
}
```

This test verifies that the calendar integration can successfully create events in an external calendar system.

## Related Components

- [Workflow Orchestrator Service](../components/workflow_orchestrator_service.md) - Testing Framework validates workflow execution
- [Task Execution Layer](../components/task_execution_layer.md) - Testing Framework validates task execution
- [Integration Service](../components/integration_service.md) - Testing Framework validates integration functionality
- [Event Processing Service](../components/event_processing_service.md) - Testing Framework leverages events for assertions
- [Validation Service](../components/validation_service.md) - Used to validate test inputs against schemas

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0   | 2023-07-15 | Initial version of the Testing Framework component |
| 1.1.0   | 2023-09-10 | Added support for test suites and dependency management |
| 1.2.0   | 2023-11-25 | Introduced advanced assertion capabilities and improved reporting | 