# Test Runs

## Overview

Test runs represent individual executions of test definitions. They track the overall execution status, timing, and environment context for a specific test definition. Test runs provide:

* A historical record of test executions
* Tracking of pass/fail rates over time
* Performance metrics for test execution
* Environmental context for each test execution
* Traceability between test definitions and their results

## Key Concepts

* **Test Run** - A single execution instance of a test definition
* **Test Status** - The overall pass/fail status of the test run
* **Test Environment** - The context in which the test was executed
* **Execution Time** - The duration of the test run from start to completion
* **Triggered By** - The actor (user or system) that initiated the test run

## Test Run Structure

```json
{
  "id": "uuid",                     // Unique identifier for the test run
  "testDefinitionId": "uuid",       // Reference to the test definition
  "status": "string",              // running, passed, failed
  "startedAt": "timestamp",        // When the test run began
  "completedAt": "timestamp",      // When the test run completed
  "environment": "string",         // dev, staging, production
  "triggeredBy": "string"          // User or system that initiated the run
}
```

## Test Run Lifecycle

Test runs follow this lifecycle:

1. **Creation**: When a test is triggered, a new test run record is created with status "running".
2. **Execution**: The test runner executes all test cases in the referenced test definition.
3. **Result Determination**:
   * If all test cases pass, the test run status is set to "passed"
   * If any test case fails, the test run status is set to "failed"
   * If execution is interrupted, the status may be "cancelled" or "error"
4. **Completion**: The completedAt timestamp is set when the run finishes

## Example Test Run

```json
{
  "id": "3f7e4567-e89b-12d3-a456-426614174000",
  "testDefinitionId": "2f7a3456-e89b-12d3-a456-426614174111",
  "status": "passed",
  "startedAt": "2023-05-15T10:30:00Z",
  "completedAt": "2023-05-15T10:30:45Z",
  "environment": "staging",
  "triggeredBy": "ci-pipeline"
}
```

## Status Values

A test run can have the following status values:

* **running**: The test is currently executing
* **passed**: All test cases in the run succeeded
* **failed**: One or more test cases failed
* **cancelled**: The test was manually cancelled
* **error**: An unexpected error occurred during test execution

## Environment Tracking

The environment field captures where the test was executed:

* **dev**: Development environment
* **staging**: Pre-production environment
* **prod**: Production environment
* **local**: Local development environment
* **ci**: Continuous integration environment

This allows for analysis of test results across different environments.

## Database Schema

**Table: test_runs**

| Field | Type | Description |
|----|----|----|
| id | UUID | Primary key |
| test_definition_id | UUID | Reference to test definition |
| status | VARCHAR(50) | Overall status (running, passed, failed) |
| started_at | TIMESTAMP | When test run started |
| completed_at | TIMESTAMP | When test run completed |
| environment | VARCHAR(50) | Test environment (dev, staging, etc.) |
| triggered_by | VARCHAR(255) | User or system that triggered the test |

**Indexes:**

* `test_runs_definition_idx` on `test_definition_id` (for finding runs of a test)
* `test_runs_status_idx` on `status` (for finding tests by status)

## Performance Considerations

For test runs, consider these performance optimizations:

* Create indexes on frequently queried fields like status and environment
* Implement retention policies to archive or delete old test runs
* Consider partitioning the test_runs table by date for large-scale testing systems
* Use batch inserts when recording multiple test runs simultaneously
* Implement caching for frequently accessed test run metadata

## Related Documentation

* [Test Definitions](./test_definitions.md) - Documentation for test definition schema
* [Test Case Results](./test_case_results.md) - Documentation for individual test case results
* [Workflow Instances](./workflow_instances.md) - Documentation for workflow execution 