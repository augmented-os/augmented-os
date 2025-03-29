# Test Definitions

## Overview

Test definitions provide templates for validating tasks and workflows. They are designed to:

* Define reusable test cases for tasks and workflows
* Specify input data and expected outputs
* Configure mock data and behaviors for dependencies
* Set up state assertions to validate execution
* Enable systematic error scenario testing

## Key Concepts

* **Test Definition** - A template that defines a set of test cases for a task or workflow
* **Test Case** - A single scenario being tested with specific inputs, mocks, and assertions
* **Mocks** - Simulated responses for dependency tasks to isolate testing
* **Assertions** - Specific conditions that must be true for a test to pass
* **Expected Events** - Events that should be emitted during test execution
* **Expected State** - The expected state after test execution

## Test Definition Structure

```json
{
  "testId": "string",              // Unique identifier for the test
  "name": "string",                // Human-readable name
  "description": "string",         // Test description
  "type": "task | workflow",       // What we're testing
  "targetId": "string",            // ID of task or workflow to test
  "cases": [                       // Array of test cases
    {
      "caseId": "string",          // Unique ID for this case
      "description": "string",     // What this case tests
      "setup": {                   // Optional setup before test
        "state": {                 // Initial state to set
          "key": "value"
        },
        "mocks": [                 // Mock behaviors for dependencies
          {
            "taskId": "string",    // Task to mock
            "response": { },       // Mock response
            "error": { },         // Mock error (if testing error path)
            "delay": "PT5S"       // Optional delay to simulate
          }
        ]
      },
      "input": {                   // Test input data
        "key": "value"
      },
      "expectedOutput": {          // Expected output data
        "key": "value"
      },
      "assertions": [              // List of assertions to check
        {
          "type": "equals | contains | matches",
          "path": "$.fieldName",   // JSONPath to check
          "value": "any",         // Expected value
          "message": "string"     // Message if assertion fails
        }
      ],
      "expectedEvents": [          // Events that should be emitted
        {
          "pattern": "string",     // Event pattern to match
          "payload": { }          // Expected event payload
        }
      ],
      "expectedState": {           // State after test completion
        "path": "$.fieldName",    // JSONPath to state field
        "value": "any"           // Expected value
      },
      "timeout": "PT1M"           // Max time for test to complete
    }
  ],
  "sharedMocks": [                 // Mocks used across multiple cases
    {
      "taskId": "string",
      "response": { }
    }
  ]
}
```

## Task Testing

For task unit tests:

* `type: "task"`
* `targetId` references a task definition
* Mocks can simulate dependencies
* Assertions focus on task output

Example task test:

```json
{
  "testId": "test-email-task",
  "type": "task",
  "targetId": "send-email",
  "cases": [
    {
      "caseId": "successful-send",
      "description": "Email sends successfully",
      "input": {
        "to": "test@example.com",
        "subject": "Test",
        "body": "Hello"
      },
      "mocks": [
        {
          "taskId": "smtp-service",
          "response": { "sent": true, "messageId": "123" }
        }
      ],
      "expectedOutput": {
        "success": true,
        "messageId": "123"
      },
      "assertions": [
        {
          "type": "equals",
          "path": "$.success",
          "value": true,
          "message": "Email should send successfully"
        }
      ]
    },
    {
      "caseId": "invalid-email",
      "description": "Invalid email handling",
      "input": {
        "to": "invalid-email",
        "subject": "Test",
        "body": "Hello"
      },
      "expectedOutput": {
        "success": false,
        "error": "INVALID_EMAIL"
      }
    }
  ]
}
```

## Workflow Testing

For workflow end-to-end tests:

* `type: "workflow"`
* `targetId` references a workflow definition
* Can test entire flow or specific paths
* Mocks can simulate task responses
* Assertions can check intermediate states

Example workflow test:

```json
{
  "testId": "test-approval-workflow",
  "type": "workflow",
  "targetId": "purchase-approval",
  "cases": [
    {
      "caseId": "auto-approve-small-amount",
      "description": "Purchases under $1000 auto-approve",
      "input": {
        "amount": 500,
        "item": "Office Supplies"
      },
      "expectedState": {
        "path": "$.status",
        "value": "APPROVED"
      },
      "assertions": [
        {
          "type": "equals",
          "path": "$.steps.autoApprove.executed",
          "value": true
        },
        {
          "type": "equals",
          "path": "$.steps.manualApprove.executed",
          "value": false
        }
      ],
      "expectedEvents": [
        {
          "pattern": "purchase.approved",
          "payload": {
            "amount": 500,
            "autoApproved": true
          }
        }
      ]
    },
    {
      "caseId": "require-approval-large-amount",
      "description": "Purchases over $1000 need approval",
      "input": {
        "amount": 1500,
        "item": "Laptop"
      },
      "mocks": [
        {
          "taskId": "manager-approval",
          "response": { "approved": true, "comments": "Approved" }
        }
      ],
      "expectedState": {
        "path": "$.status",
        "value": "APPROVED"
      },
      "assertions": [
        {
          "type": "equals",
          "path": "$.steps.manualApprove.executed",
          "value": true
        }
      ]
    }
  ]
}
```

## Test Execution Flow

The test runner should:

1. Load the test definition
2. For each test case:
   * Set up initial state and mocks
   * Execute task or workflow with input
   * Wait for completion or timeout
   * Verify all assertions
   * Check expected events
   * Validate final state
   * Clean up test state

## Database Schema

**Table: test_definitions**

| Field | Type | Description |
|----|----|----|
| id | UUID | Primary key |
| test_id | VARCHAR(255) | Unique identifier for the test |
| name | VARCHAR(255) | Human-readable name |
| description | TEXT | Test description |
| type | VARCHAR(50) | What's being tested (task, workflow) |
| target_id | VARCHAR(255) | ID of task or workflow to test |
| cases | JSONB | Array of test cases |
| shared_mocks | JSONB | Mocks used across multiple cases |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

**Indexes:**

* `test_definitions_test_id_idx` UNIQUE on `test_id` (for lookups)
* `test_definitions_target_idx` on `(type, target_id)` (for finding tests for a specific task/workflow)

**JSON Schema (cases field):**

```json
{
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "caseId": { "type": "string" },
      "description": { "type": "string" },
      "setup": {
        "type": "object",
        "properties": {
          "state": { "type": "object" },
          "mocks": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "taskId": { "type": "string" },
                "response": { "type": "object" },
                "error": { "type": "object" },
                "delay": { "type": "string" }
              }
            }
          }
        }
      },
      "input": { "type": "object" },
      "expectedOutput": { "type": "object" },
      "assertions": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "type": { "type": "string" },
            "path": { "type": "string" },
            "value": { "type": "any" },
            "message": { "type": "string" }
          }
        }
      },
      "expectedEvents": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "pattern": { "type": "string" },
            "payload": { "type": "object" }
          }
        }
      },
      "expectedState": {
        "type": "object",
        "properties": {
          "path": { "type": "string" },
          "value": { "type": "any" }
        }
      },
      "timeout": { "type": "string" }
    },
    "required": ["caseId", "input"]
  }
}
```

## Performance Considerations

For test definitions, consider these performance optimizations:

* Use shared mocks for common dependencies to reduce duplication
* Limit test case complexity to ensure quick feedback cycles
* Use timeouts appropriate to the complexity of the task or workflow
* Consider implementing parallel test execution where tests are independent
* Cache test definitions that are used frequently to reduce database load

## Related Documentation

* [Test Runs](./test_runs.md) - Documentation for test execution records
* [Test Case Results](./test_case_results.md) - Documentation for individual test case outcomes
* [Task Definitions](./task_definitions.md) - Definition schema for tasks that can be tested
* [Workflow Definitions](./workflow_definitions.md) - Definition schema for workflows that can be tested 