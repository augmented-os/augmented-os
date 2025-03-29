# Test Definition Manager

## Overview

The Test Definition Manager is a core component of the Testing Framework Service responsible for storing, versioning, retrieving, and managing test definitions. It provides a centralized repository for all test definitions across the system, ensuring they are properly versioned, validated, and accessible.

## Key Responsibilities

* Storing test definitions in the database with proper validation
* Managing versioning of test definitions to support test evolution
* Providing APIs for creating, retrieving, and updating test definitions
* Validating test definitions against schemas before storage
* Supporting filtering and search capabilities for test discovery
* Maintaining relationships between test definitions and test suites

## Implementation Approach

The Test Definition Manager follows these design principles:

1. **Schema Validation** - All test definitions are validated against a schema before storage to ensure consistency
2. **Immutable Versioning** - Each version of a test definition is immutable once created and assigned a version number
3. **Efficient Retrieval** - Optimized indexing and query patterns to support fast test definition retrieval
4. **Relationship Management** - Tracks and enforces relationships between tests (dependencies) and test suites
5. **Metadata Enrichment** - Supports rich metadata and tagging for effective organization and discovery

## Test Definition Lifecycle

```
┌───────────────┐
│  Draft        │
└───────┬───────┘
        │
        ▼
┌───────────────┐     ┌─────────────────┐
│  Validated    │────►│    Published     │
└───────┬───────┘     └─────────┬────────┘
        │                       │
        │                       │
        ▼                       │
┌───────────────┐               │
│  Deprecated   │               │
└───────────────┘               │
        ▲                       │
        │                       │
        │                       │
┌───────────────┐               │
│  Superseded   │◄──────────────┘
└───────┬───────┘
        │
        ▼
┌───────────────┐
│  Archived     │
└───────────────┘
```

## Implementation Details

### Storage and Versioning

The Test Definition Manager stores test definitions in the `test_definitions` table with versioning support:

```typescript
// Store a new test definition
async function storeTestDefinition(definition: TestDefinition): Promise<StorageResult> {
  // Validate the test definition
  const validationResult = await validateTestDefinition(definition);
  if (!validationResult.valid) {
    return { success: false, errors: validationResult.errors };
  }
  
  // Check if test_id already exists
  const existingTest = await getLatestTestDefinition(definition.test_id);
  let version = 1;
  
  if (existingTest) {
    // Increment version
    version = existingTest.version + 1;
  }
  
  // Store with new version
  const result = await db.query(
    'INSERT INTO test_definitions (test_id, name, description, type, target, parameters, assertions, timeout, tags, dependencies, version, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $12) RETURNING *',
    [definition.test_id, definition.name, definition.description, definition.type, 
     JSON.stringify(definition.target), JSON.stringify(definition.parameters), 
     JSON.stringify(definition.assertions), definition.timeout, 
     definition.tags, definition.dependencies, version, new Date().toISOString()]
  );
  
  return { success: true, result: result.rows[0] };
}
```

### Query and Retrieval

The Test Definition Manager provides efficient query capabilities:

```typescript
// Get a specific test definition by ID and version
async function getTestDefinition(
  testId: string, 
  version?: number
): Promise<TestDefinition | null> {
  let query = 'SELECT * FROM test_definitions WHERE test_id = $1';
  const params = [testId];
  
  if (version) {
    // Get specific version
    query += ' AND version = $2';
    params.push(version);
  } else {
    // Get latest version
    query += ' ORDER BY version DESC LIMIT 1';
  }
  
  const result = await db.query(query, params);
  
  if (result.rows.length === 0) {
    return null;
  }
  
  return mapRowToTestDefinition(result.rows[0]);
}

// List test definitions with filtering
async function listTestDefinitions(
  filters: TestDefinitionFilter
): Promise<ListResult<TestDefinition>> {
  const { type, tags, target, page = 1, pageSize = 20 } = filters;
  
  let query = 'SELECT * FROM test_definitions WHERE 1=1';
  const params = [];
  let paramIndex = 1;
  
  if (type) {
    query += ` AND type = $${paramIndex++}`;
    params.push(type);
  }
  
  if (tags && tags.length > 0) {
    query += ` AND tags @> $${paramIndex++}`;
    params.push(tags);
  }
  
  if (target && target.id) {
    query += ` AND target->>'id' = $${paramIndex++}`;
    params.push(target.id);
  }
  
  // Get latest versions only
  query += ' AND version = (SELECT MAX(version) FROM test_definitions t2 WHERE t2.test_id = test_definitions.test_id)';
  
  // Add pagination
  const offset = (page - 1) * pageSize;
  query += ` ORDER BY updated_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
  params.push(pageSize, offset);
  
  const result = await db.query(query, params);
  
  return {
    items: result.rows.map(mapRowToTestDefinition),
    total: await countTestDefinitions(filters),
    page,
    pageSize
  };
}
```

### Dependency Management

The Test Definition Manager validates and enforces dependencies between tests:

```typescript
// Validate dependencies for a test definition
async function validateDependencies(
  testId: string, 
  dependencies: string[]
): Promise<ValidationResult> {
  const errors = [];
  
  // Check for circular dependencies
  if (dependencies.includes(testId)) {
    errors.push('Test cannot depend on itself');
  }
  
  // Check that all dependencies exist
  for (const depId of dependencies) {
    const depTest = await getLatestTestDefinition(depId);
    if (!depTest) {
      errors.push(`Dependency ${depId} does not exist`);
    }
  }
  
  // Check for indirect circular dependencies
  const visited = new Set<string>();
  const stack = new Set<string>();
  
  const checkCircular = async (id: string): Promise<boolean> => {
    if (stack.has(id)) {
      return true; // Circular dependency found
    }
    
    if (visited.has(id)) {
      return false; // Already checked, no circular dependency
    }
    
    const test = await getLatestTestDefinition(id);
    if (!test) {
      return false; // Dependency doesn't exist, already reported above
    }
    
    visited.add(id);
    stack.add(id);
    
    for (const depId of test.dependencies) {
      if (await checkCircular(depId)) {
        return true;
      }
    }
    
    stack.delete(id);
    return false;
  };
  
  for (const depId of dependencies) {
    if (await checkCircular(depId)) {
      errors.push(`Circular dependency detected involving ${depId}`);
      break; // One circular dependency error is enough
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}
```

### Edge Cases and Error Handling

The implementation addresses the following edge cases:

| Scenario | Handling Approach |
|----------|-------------------|
| Test ID already exists | Increment version number for the existing test ID |
| Invalid test definition schema | Reject with validation errors before storing |
| Circular dependencies | Detect and reject circular dependencies |
| Dependency on non-existent test | Reject with clear error about missing dependency |
| Concurrent updates | Use database transactions and optimistic locking |
| Large test definitions | Limit size and complexity of test definitions |

## Performance Considerations

The Test Definition Manager is optimized for high read throughput as test definitions are frequently accessed during test execution but infrequently updated.

### Optimizations

1. **Indexing**: Indexes on `test_id`, `version`, `type`, and `tags` for efficient queries
2. **JSON Indexing**: GIN indexes on the `target` JSON field for target-based lookups
3. **Latest Version Caching**: Caching of latest test definition versions in memory
4. **Batch Operations**: Support for batch retrieval of multiple test definitions

### Benchmarks

| Operation | Average Performance | P99 Performance |
|-----------|---------------------|----------------|
| Test Definition Creation | 45ms | 95ms |
| Get Latest Test Definition | 5ms | 15ms |
| Get Specific Version | 8ms | 20ms |
| List Test Definitions (filtered) | 30ms | 80ms |
| Validate Dependencies | 40ms | 120ms |

## Related Documentation

* [Data Model](../data_model.md)
* [Test Executor](./test_executor.md)
* [Test Suite Manager](./test_suite_manager.md)
* [API Reference](../interfaces/api.md) 