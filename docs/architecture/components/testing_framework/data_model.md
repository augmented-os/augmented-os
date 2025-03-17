# Testing Framework Data Model

## Overview

The Testing Framework primarily interacts with these data schemas:

* **Test Definition**: Structured format that specifies test parameters, expected outcomes, and validation criteria
* **Test Result**: Captures execution results including assertion outcomes and performance metrics
* **Test Suite**: Groups related tests for organized execution

This document focuses on how the Testing Framework component implements these schemas to support test execution, result tracking, and reporting.

## Test Definition Schema

The Test Definition schema provides a structured way to define tests across different components of the system:

```typescript
interface TestDefinition {
  test_id: string;              // Unique identifier for the test
  name: string;                 // Human-readable test name
  description: string;          // Detailed test description
  type: TestType;               // Type of test (workflow, task, integration)
  target: {                     // Component to be tested
    id: string;                 // ID of the target (workflow_id, task_id, etc.)
    version: string;            // Version of the target
  };
  parameters: Record<string, any>; // Input parameters for the test
  assertions: Assertion[];      // List of assertions to validate
  timeout: number;              // Maximum test duration in seconds
  tags: string[];               // Tags for categorizing tests
  dependencies: string[];       // IDs of tests that must succeed before this test
  version: number;              // Version of this test definition
  createdAt: string;            // ISO timestamp of creation
  updatedAt: string;            // ISO timestamp of last update
}

type TestType = 'workflow' | 'task' | 'integration' | 'system' | 'performance';

interface Assertion {
  condition: string;            // Assertion condition (JSON path or expression)
  expected: any;                // Expected value or outcome
  message: string;              // Message to display if assertion fails
  tolerance?: number;           // Numerical tolerance for floating point comparisons
  comparison_type?: string;     // Type of comparison (exact, contains, regex, etc.)
}
```

## Test Result Schema

The Test Result schema captures the outcome of test executions, including detailed assertion results:

```typescript
interface TestResult {
  result_id: string;            // Unique identifier for the test result
  test_id: string;              // ID of the test definition
  test_version: number;         // Version of the test definition used
  status: TestResultStatus;     // Overall test status
  start_time: string;           // ISO timestamp when test started
  end_time: string;             // ISO timestamp when test completed
  duration_ms: number;          // Test duration in milliseconds
  target_info: {                // Information about the tested component
    id: string;                 // Component ID
    version: string;            // Component version
    environment: string;        // Execution environment
  };
  parameters: Record<string, any>; // Input parameters used
  assertion_results: AssertionResult[]; // Results for each assertion
  artifacts: Artifact[];        // Any test artifacts produced
  error?: {                     // Error details if test failed
    message: string;            // Error message
    stacktrace?: string;        // Error stacktrace if available
    code?: string;              // Error code if available
  };
  metadata: Record<string, any>; // Additional metadata about the test execution
}

type TestResultStatus = 'PENDING' | 'RUNNING' | 'PASSED' | 'FAILED' | 'TIMEOUT' | 'ERROR' | 'SKIPPED';

interface AssertionResult {
  assertion_id: number;         // Index of the assertion in the test definition
  condition: string;            // The assertion condition that was checked
  expected: any;                // Expected value from the test definition  
  actual: any;                  // Actual value observed during test execution
  passed: boolean;              // Whether the assertion passed
  message?: string;             // Message if assertion failed
}

interface Artifact {
  name: string;                 // Name of the artifact
  type: string;                 // Type of artifact (log, screenshot, etc.)
  location: string;             // Location where artifact is stored
  content_type: string;         // MIME type of the artifact
  size: number;                 // Size of the artifact in bytes
}
```

## Test Suite Schema

The Test Suite schema provides a way to organize and manage collections of related tests:

```typescript
interface TestSuite {
  suite_id: string;             // Unique identifier for the suite
  name: string;                 // Human-readable suite name
  description: string;          // Detailed suite description
  tests: TestSuiteItem[];       // List of tests in this suite
  execution_strategy: {         // How tests should be executed
    parallelism: number;        // Number of tests to run in parallel
    stop_on_failure: boolean;   // Whether to stop execution if a test fails
    retry_config?: {            // Retry configuration
      max_retries: number;      // Maximum number of retry attempts
      retry_delay_ms: number;   // Delay between retries in milliseconds
    }
  };
  tags: string[];               // Tags for categorizing suites
  version: number;              // Version of this test suite
  createdAt: string;            // ISO timestamp of creation
  updatedAt: string;            // ISO timestamp of last update
}

interface TestSuiteItem {
  test_id: string;              // ID of the test
  override_parameters?: Record<string, any>; // Parameters to override
  enabled: boolean;             // Whether this test should be run
  weight?: number;              // Execution priority (lower runs first)
}

interface TestSuiteResult {
  suite_result_id: string;      // Unique identifier for the suite result
  suite_id: string;             // ID of the test suite
  suite_version: number;        // Version of the test suite
  status: TestSuiteStatus;      // Overall suite status
  start_time: string;           // ISO timestamp when suite started
  end_time: string;             // ISO timestamp when suite completed
  duration_ms: number;          // Suite execution duration in milliseconds
  test_results: string[];       // IDs of individual test results
  summary: {                    // Summary of test results
    total: number;              // Total number of tests
    passed: number;             // Number of passed tests
    failed: number;             // Number of failed tests
    error: number;              // Number of tests with errors
    skipped: number;            // Number of skipped tests
  };
  metadata: Record<string, any>; // Additional metadata
}

type TestSuiteStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'ABORTED' | 'ERROR';
```

## Database Optimization

The Testing Framework implements the following database optimizations:


1. **Indexing**: Indexes on `test_id`, `tags`, and `target.id` for efficient querying of test definitions
2. **Test Result Partitioning**: Results are partitioned by time for improved query performance on large result sets
3. **JSON Storage**: Test parameters and assertion results are stored as JSON to allow flexible schema evolution
4. **Metadata Filtering**: Indexing on common metadata fields to enable efficient filtering in reports
5. **Selective Archiving**: Automated archiving of older test results while preserving statistical summaries

## Related Schema Documentation

* [Test Definition Schema](./implementation/test_definition_manager.md)
* [Result Capture](./implementation/result_capture.md)
* [Test Suite Manager](./implementation/test_suite_manager.md)


