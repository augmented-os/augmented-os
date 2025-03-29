# Test Case Results

## Overview

Test case results track the detailed outcomes of individual test cases within a test run. They store the specific inputs, outputs, and assertion results for each test case, providing a comprehensive record of test execution at a granular level. Test case results enable:

* Detailed analysis of test execution
* Debugging of test failures
* Historical tracking of specific test case performance
* Input/output verification for regression testing
* Detailed assertion validation reporting

## Key Concepts

* **Test Case Result** - The outcome of executing a single test case
* **Case Status** - The pass/fail status of an individual test case
* **Assertion Results** - Detailed records of each assertion and its outcome
* **Execution Duration** - The time taken to execute the specific test case
* **Error Details** - Comprehensive error information when a test case fails
* **Input/Output Capture** - The actual data used and produced during test execution

## Test Case Result Structure

```json
{
  "id": "uuid",                     // Unique identifier for the result
  "testRunId": "uuid",              // Reference to the parent test run
  "caseId": "string",               // Reference to the case in the test definition
  "status": "string",               // passed, failed, skipped
  "durationMs": "number",           // Execution time in milliseconds
  "input": {},                      // Input data used
  "output": {},                     // Actual output produced
  "error": {                        // Error details if failed
    "message": "string",
    "stack": "string",
    "code": "string"
  },
  "assertions": [                  // Results of each assertion
    {
      "type": "string",            // Type of assertion performed
      "path": "string",            // The path that was checked
      "expected": "any",           // Expected value
      "actual": "any",             // Actual value observed
      "passed": "boolean",         // Whether assertion passed
      "message": "string"          // Assertion message or error
    }
  ],
  "startedAt": "timestamp",        // When the case execution started
  "completedAt": "timestamp"       // When the case execution completed
}
```

## Status Values

A test case result can have the following status values:

* **passed**: The test case executed successfully and all assertions passed
* **failed**: The test case execution was completed but one or more assertions failed
* **error**: An unexpected error occurred during test case execution
* **skipped**: The test case was not executed, typically due to dependency failures
* **timeout**: The test case did not complete within the allotted time limit

## Assertion Results

The assertions array captures detailed information about each individual assertion:

* **type**: The type of assertion performed (equals, contains, matches)
* **path**: The JSONPath expression used to identify the target value
* **expected**: The expected value defined in the test case
* **actual**: The actual value observed during test execution
* **passed**: Boolean indicating whether the assertion passed
* **message**: Description of the assertion or error message if failed

Example assertion result:

```json
{
  "type": "equals",
  "path": "$.status",
  "expected": "completed",
  "actual": "failed",
  "passed": false,
  "message": "Status should be 'completed' but was 'failed'"
}
```

## Error Tracking

The error object provides comprehensive information about failures:

* **message**: Human-readable description of the error
* **stack**: Stack trace to help with debugging
* **code**: Error code for categorization of failures
* **context**: Additional context-specific information

## Database Schema

**Table: test_case_results**

| Field | Type | Description |
|----|----|----|
| id | UUID | Primary key |
| test_run_id | UUID | Reference to test run |
| case_id | VARCHAR(255) | Reference to case within test definition |
| status | VARCHAR(50) | Status (passed, failed, skipped) |
| duration_ms | INTEGER | Execution time in milliseconds |
| input | JSONB | Input data used |
| output | JSONB | Actual output produced |
| error | JSONB | Error details if failed |
| assertions | JSONB | Results of each assertion |
| started_at | TIMESTAMP | When case started |
| completed_at | TIMESTAMP | When case completed |

**Indexes:**

* `test_case_results_run_idx` on `test_run_id` (for finding all case results in a run)
* `test_case_results_status_idx` on `status` (for filtering by status)
* `test_case_results_case_id_idx` on `case_id` (for tracking specific test cases over time)

**JSON Schema (assertions field):**

```json
{
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "type": { "type": "string" },
      "path": { "type": "string" },
      "expected": { "type": "any" },
      "actual": { "type": "any" },
      "passed": { "type": "boolean" },
      "message": { "type": "string" }
    }
  }
}
```

## Performance Considerations

For test case results, consider these performance optimizations:

* Store large input/output payloads in compressed format
* Implement selective logging to avoid storing unnecessarily large data sets
* Index fields commonly used for filtering in reporting
* Consider partitioning the test_case_results table for large-scale testing
* Implement retention policies to archive or purge old test case results
* Use batch inserts when recording multiple test case results simultaneously

## Related Documentation

* [Test Definitions](./test_definitions.md) - Documentation for test definition schema
* [Test Runs](./test_runs.md) - Documentation for test run execution records
* [Task Instances](./task_instances.md) - For understanding task execution details
* [Workflow Instances](./workflow_instances.md) - For understanding workflow execution details 