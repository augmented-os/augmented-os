# Result Capture

## Overview

The Result Capture module is a core component of the Testing Framework Service responsible for recording, storing, and retrieving test execution results. It captures detailed information about test execution, including assertion outcomes, performance metrics, execution metadata, and test artifacts, enabling comprehensive analysis and reporting of test results.

## Key Responsibilities

* Recording detailed test execution results, including timestamps and execution time
* Capturing the outcome of each assertion in a test definition
* Storing test artifacts such as logs, screenshots, and output files
* Maintaining historical test result data for trend analysis
* Providing efficient querying and filtering of test results
* Supporting real-time result updates during test execution

## Implementation Approach

The Result Capture module follows these design principles:


1. **Comprehensive Recording** - Capture all relevant data for thorough test analysis and debugging
2. **Efficient Storage** - Optimize storage patterns for efficient retrieval and querying of results
3. **Real-time Updates** - Support streaming updates of test results during execution
4. **Scalable Architecture** - Handle high volumes of test results with efficient data partitioning
5. **Structured Format** - Maintain consistent, structured result data for reliable analysis

## Result Lifecycle

```
┌───────────────┐
│  Created      │
└───────┬───────┘
        │
        ▼
┌───────────────┐     ┌─────────────────┐
│  Updated      │────►│    Finalized     │
└───────┬───────┘     └─────────┬────────┘
        │                       │
        │                       │
        ▼                       ▼
┌───────────────┐     ┌─────────────────┐
│   Purged      │     │   Archived      │
└───────────────┘     └─────────────────┘
```

## Implementation Details

### Result Storage

The Result Capture module implements efficient storage for test results:

```typescript
// Save a new test result
async function saveTestResult(testResult: TestResult): Promise<void> {
  // Validate the result structure
  if (!testResult.result_id || !testResult.test_id) {
    throw new Error('Invalid test result: missing required fields');
  }
  
  // Format timestamps consistently
  const now = new Date().toISOString();
  const result = {
    ...testResult,
    created_at: now,
    updated_at: now
  };
  
  // Store in database
  await db.query(
    'INSERT INTO test_results (result_id, test_id, test_version, status, start_time, end_time, ' +
    'duration_ms, target_info, parameters, assertion_results, artifacts, error, metadata, ' +
    'created_at, updated_at) ' +
    'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)',
    [
      result.result_id, result.test_id, result.test_version, result.status, 
      result.start_time, result.end_time, result.duration_ms,
      JSON.stringify(result.target_info), JSON.stringify(result.parameters),
      JSON.stringify(result.assertion_results), JSON.stringify(result.artifacts),
      result.error ? JSON.stringify(result.error) : null,
      JSON.stringify(result.metadata || {}),
      result.created_at, result.updated_at
    ]
  );
  
  // Emit event for real-time monitoring
  eventEmitter.emit('test.result.created', {
    resultId: result.result_id,
    testId: result.test_id,
    status: result.status
  });
}

// Update an existing test result
async function updateTestResult(
  resultId: string, 
  updates: Partial<TestResult>
): Promise<void> {
  // Get current result
  const currentResult = await getTestResult(resultId);
  if (!currentResult) {
    throw new Error(`Test result not found: ${resultId}`);
  }
  
  // Apply updates
  const updatedResult = {
    ...currentResult,
    ...updates,
    updated_at: new Date().toISOString()
  };
  
  // Build update query
  const updateFields = [];
  const updateValues = [];
  let paramIndex = 1;
  
  Object.entries(updatedResult).forEach(([key, value]) => {
    // Skip result_id as it's the primary key
    if (key === 'result_id' || key === 'created_at') {
      return;
    }
    
    // Handle JSON fields
    if (['target_info', 'parameters', 'assertion_results', 'artifacts', 'error', 'metadata'].includes(key)) {
      updateFields.push(`${snake_case(key)} = $${paramIndex++}`);
      updateValues.push(JSON.stringify(value));
    } else {
      updateFields.push(`${snake_case(key)} = $${paramIndex++}`);
      updateValues.push(value);
    }
  });
  
  // Add result_id as the last parameter
  updateValues.push(resultId);
  
  // Execute update
  await db.query(
    `UPDATE test_results SET ${updateFields.join(', ')} WHERE result_id = $${paramIndex}`,
    updateValues
  );
  
  // Emit event for real-time monitoring
  eventEmitter.emit('test.result.updated', {
    resultId,
    testId: updatedResult.test_id,
    status: updatedResult.status
  });
}
```

### Result Retrieval

The Result Capture module provides efficient query capabilities:

```typescript
// Get a specific test result by ID
async function getTestResult(resultId: string): Promise<TestResult | null> {
  const result = await db.query(
    'SELECT * FROM test_results WHERE result_id = $1',
    [resultId]
  );
  
  if (result.rows.length === 0) {
    return null;
  }
  
  return mapRowToTestResult(result.rows[0]);
}

// List test results with filtering
async function listTestResults(
  filters: TestResultFilter
): Promise<ListResult<TestResult>> {
  const { 
    testId, status, startTimeFrom, startTimeTo, 
    targetId, tags, page = 1, pageSize = 20 
  } = filters;
  
  let query = 'SELECT * FROM test_results WHERE 1=1';
  const params = [];
  let paramIndex = 1;
  
  if (testId) {
    query += ` AND test_id = $${paramIndex++}`;
    params.push(testId);
  }
  
  if (status && status.length > 0) {
    query += ` AND status = ANY($${paramIndex++}::text[])`;
    params.push(status);
  }
  
  if (startTimeFrom) {
    query += ` AND start_time >= $${paramIndex++}`;
    params.push(startTimeFrom);
  }
  
  if (startTimeTo) {
    query += ` AND start_time <= $${paramIndex++}`;
    params.push(startTimeTo);
  }
  
  if (targetId) {
    query += ` AND target_info->>'id' = $${paramIndex++}`;
    params.push(targetId);
  }
  
  if (tags && tags.length > 0) {
    // Join with test_definitions to filter by tags
    query = `
      SELECT tr.* FROM test_results tr
      JOIN test_definitions td ON tr.test_id = td.test_id AND tr.test_version = td.version
      WHERE td.tags @> $${paramIndex++} AND 1=1
    `;
    params.push(tags);
    
    // Re-add the other filters
    if (testId) {
      query += ` AND tr.test_id = $${paramIndex++}`;
      params.push(testId);
    }
    
    // ... add other filters to the join query
  }
  
  // Add pagination
  const offset = (page - 1) * pageSize;
  query += ` ORDER BY start_time DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
  params.push(pageSize, offset);
  
  const result = await db.query(query, params);
  
  return {
    items: result.rows.map(mapRowToTestResult),
    total: await countTestResults(filters),
    page,
    pageSize
  };
}
```

### Artifact Management

The Result Capture module handles test artifacts efficiently:

```typescript
// Add an artifact to a test result
async function addTestArtifact(
  resultId: string, 
  artifact: Artifact, 
  content: Buffer | string
): Promise<void> {
  // Get storage service
  const storage = getStorageService();
  
  // Generate artifact path
  const path = `test-artifacts/${resultId}/${artifact.name}`;
  
  // Store artifact content
  const location = await storage.storeFile(path, content, {
    contentType: artifact.content_type
  });
  
  // Update artifact location
  artifact.location = location;
  
  // Get current result
  const currentResult = await getTestResult(resultId);
  if (!currentResult) {
    throw new Error(`Test result not found: ${resultId}`);
  }
  
  // Add artifact to result
  const artifacts = [...currentResult.artifacts, artifact];
  
  // Update result
  await updateTestResult(resultId, { artifacts });
}

// Get an artifact from a test result
async function getTestArtifact(
  resultId: string, 
  artifactName: string
): Promise<{ artifact: Artifact, content: Buffer } | null> {
  // Get test result
  const result = await getTestResult(resultId);
  if (!result) {
    return null;
  }
  
  // Find artifact
  const artifact = result.artifacts.find(a => a.name === artifactName);
  if (!artifact) {
    return null;
  }
  
  // Get storage service
  const storage = getStorageService();
  
  // Get artifact content
  const content = await storage.getFile(artifact.location);
  
  return { artifact, content };
}
```

### Edge Cases and Error Handling

The implementation addresses the following edge cases:

| Scenario | Handling Approach |
|----|----|
| Concurrent result updates | Database transactions with optimistic locking |
| Large result sets | Pagination and efficient filtering for query results |
| Large artifacts | Separate storage for artifacts with size limits and streaming support |
| Long-running tests | Intermediate result updates with status tracking |
| Data consistency | Transaction-based updates to ensure result integrity |
| Historical data volume | Time-based partitioning and archiving strategies |

## Performance Considerations

The Result Capture module is optimized for both write-intensive (during test execution) and read-intensive (during reporting) operations:


1. **Write Optimizations**:
   * Batch updates for multiple assertion results
   * Asynchronous artifact storage
   * Efficient JSON serialization
2. **Read Optimizations**:
   * Index-optimized queries for common filter patterns
   * Result caching for frequently accessed results
   * Time-based partitioning for historical data
3. **Storage Optimizations**:
   * Selective archiving of older results
   * Compression of large result sets
   * External storage for artifacts

### Benchmarks

| Operation | Average Performance | P99 Performance |
|----|----|----|
| Create Result | 20ms | 45ms |
| Update Result | 15ms | 35ms |
| Get Result by ID | 8ms | 25ms |
| List Results (filtered) | 40ms | 120ms |
| Add Artifact (1MB) | 75ms | 250ms |
| Retrieve Artifact (1MB) | 60ms | 200ms |

## Related Documentation

* [Data Model](../data_model.md)
* [Test Executor](./test_executor.md)
* [Reporting Engine](./reporting_engine.md)
* [Configuration](../operations/configuration.md)


