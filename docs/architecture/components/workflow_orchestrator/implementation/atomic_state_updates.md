# Atomic State Updates

## Overview

The Workflow Orchestrator implements optimistic concurrency control through versioned state updates to prevent race conditions when multiple processes attempt to modify the same workflow instance. This ensures data consistency while maintaining high throughput in concurrent environments.

## Implementation Approach

### Version-Based Concurrency Control

Each workflow instance includes a `version` field that's incremented on every update:

```typescript
interface WorkflowInstance {
  id: string;
  // ... other fields
  version: number;
  // ... remaining fields
}
```

The version number serves as a concurrency token that allows the system to detect conflicting updates.

### Update Pattern

All workflow state updates follow this pattern:

```typescript
/**
 * Updates workflow state with optimistic concurrency control
 */
async function updateWorkflowState<T>(
  instanceId: string,
  expectedVersion: number,
  updateFunction: (currentState: WorkflowState) => WorkflowState
): Promise<void> {
  // Start transaction
  const transaction = await database.beginTransaction();
  
  try {
    // Get current instance with lock
    const query = `
      SELECT state, version 
      FROM workflow_instances 
      WHERE id = $1 
      FOR UPDATE
    `;
    
    const result = await transaction.query(query, [instanceId]);
    
    if (result.rows.length === 0) {
      throw new Error(`Workflow instance ${instanceId} not found`);
    }
    
    const { state, version } = result.rows[0];
    
    // Check version matches expected version
    if (version !== expectedVersion) {
      throw new ConcurrentModificationError(
        `Expected version ${expectedVersion}, but got ${version}`
      );
    }
    
    // Apply update function to generate new state
    const newState = updateFunction(state);
    
    // Update with version increment
    const updateQuery = `
      UPDATE workflow_instances 
      SET 
        state = $1, 
        version = version + 1, 
        updated_at = NOW() 
      WHERE id = $2 AND version = $3
      RETURNING version as new_version
    `;
    
    const updateResult = await transaction.query(
      updateQuery, 
      [newState, instanceId, version]
    );
    
    // Verify update was successful
    if (updateResult.rowCount === 0) {
      throw new ConcurrentModificationError(
        `Failed to update workflow instance ${instanceId} - concurrent modification detected`
      );
    }
    
    // Commit transaction
    await transaction.commit();
  } catch (error) {
    // Rollback on error
    await transaction.rollback();
    
    // Rethrow the error
    throw error;
  }
}
```

### Conflict Detection and Resolution

When a version mismatch is detected, a `ConcurrentModificationError` is thrown:

```typescript
class ConcurrentModificationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConcurrentModificationError';
  }
}
```

The client code can catch this specific error and implement appropriate retry logic:

```typescript
/**
 * Example retry wrapper for state updates
 */
async function updateWorkflowStateWithRetry(
  instanceId: string,
  maxRetries: number,
  updateFunction: (state: WorkflowState) => WorkflowState
): Promise<void> {
  let retries = 0;
  
  while (true) {
    try {
      // Get current version
      const instance = await workflowRepository.getInstance(instanceId);
      
      // Attempt update with current version
      await updateWorkflowState(
        instanceId,
        instance.version,
        updateFunction
      );
      
      // Success, break out of retry loop
      break;
    } catch (error) {
      if (error instanceof ConcurrentModificationError && retries < maxRetries) {
        // Exponential backoff
        const delay = Math.pow(2, retries) * 100;
        await sleep(delay);
        retries++;
        continue;
      }
      
      // Either not a concurrency error or max retries exceeded
      throw error;
    }
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

## Atomic Operations

### Specialized Atomic Operations

For common state transitions, specialized atomic operations are implemented:

```typescript
/**
 * Atomically transitions workflow status
 */
async function transitionWorkflowStatus(
  instanceId: string,
  fromStatus: WorkflowStatus,
  toStatus: WorkflowStatus
): Promise<boolean> {
  const query = `
    UPDATE workflow_instances
    SET 
      status = $1,
      updated_at = NOW(),
      version = version + 1
    WHERE 
      id = $2 AND
      status = $3
    RETURNING id, version
  `;
  
  const result = await database.query(
    query, 
    [toStatus, instanceId, fromStatus]
  );
  
  return result.rowCount === 1;
}

/**
 * Atomically completes a workflow step
 */
async function completeWorkflowStep(
  instanceId: string,
  stepId: string,
  output: any,
  expectedVersion: number
): Promise<boolean> {
  const transaction = await database.beginTransaction();
  
  try {
    // First check version matches
    const versionQuery = `
      SELECT version FROM workflow_instances
      WHERE id = $1
      FOR UPDATE
    `;
    
    const versionResult = await transaction.query(versionQuery, [instanceId]);
    
    if (versionResult.rows.length === 0) {
      throw new Error(`Workflow instance ${instanceId} not found`);
    }
    
    const { version } = versionResult.rows[0];
    
    if (version !== expectedVersion) {
      await transaction.rollback();
      return false;
    }
    
    // Update the state to mark step as completed
    const updateQuery = `
      UPDATE workflow_instances
      SET
        state = jsonb_set(
          jsonb_set(
            state,
            '{steps, ' || $2 || ', status}',
            '"COMPLETED"'
          ),
          '{steps, ' || $2 || ', output}',
          $3::jsonb
        ),
        version = version + 1,
        updated_at = NOW()
      WHERE id = $1
      RETURNING id
    `;
    
    const updateResult = await transaction.query(
      updateQuery,
      [instanceId, stepId, JSON.stringify(output)]
    );
    
    await transaction.commit();
    return updateResult.rowCount === 1;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}
```

### Batch Operations

For efficiency, batch operations are also implemented with atomic guarantees:

```typescript
/**
 * Atomically updates multiple workflow instances
 */
async function batchUpdateWorkflowStatus(
  filters: {
    status: WorkflowStatus;
    updatedBefore: Date;
  },
  newStatus: WorkflowStatus,
  limit: number = 100
): Promise<string[]> {
  // Use Common Table Expression (CTE) for atomic update with returning
  const query = `
    WITH updated_workflows AS (
      UPDATE workflow_instances
      SET 
        status = $1,
        updated_at = NOW(),
        version = version + 1
      WHERE 
        status = $2 AND
        updated_at < $3
      LIMIT $4
      RETURNING id
    )
    SELECT id FROM updated_workflows
  `;
  
  const result = await database.query(
    query,
    [newStatus, filters.status, filters.updatedBefore, limit]
  );
  
  return result.rows.map(row => row.id);
}
```

## Database-Level Support

The database schema is optimized for atomic updates:

```sql
-- Ensure version column exists
ALTER TABLE workflow_instances ADD COLUMN IF NOT EXISTS version INTEGER NOT NULL DEFAULT 0;

-- Create an index for optimistic locking performance
CREATE INDEX IF NOT EXISTS workflow_instances_id_version_idx ON workflow_instances(id, version);

-- Add constraint for version (optional)
ALTER TABLE workflow_instances ADD CONSTRAINT version_non_negative CHECK (version >= 0);
```

## Handling Race Conditions in Web APIs

For API endpoints that modify workflow state, the following pattern is used:

```typescript
/**
 * Update workflow handler with ETag support
 */
async function handleUpdateWorkflow(req, res) {
  const { id } = req.params;
  const updates = req.body;
  
  // Get ETag from If-Match header
  const etag = req.headers['if-match'];
  
  if (!etag) {
    return res.status(428).json({
      error: 'Precondition Required',
      message: 'This API requires conditional requests with If-Match header'
    });
  }
  
  try {
    // Extract version from ETag
    const expectedVersion = parseInt(etag.replace(/"/g, ''), 10);
    
    // Get current workflow
    const workflow = await workflowRepository.getInstance(id);
    
    // Check if workflow exists
    if (!workflow) {
      return res.status(404).json({
        error: 'Not Found',
        message: `Workflow with ID ${id} not found`
      });
    }
    
    // Apply updates to workflow
    try {
      await updateWorkflowState(
        id,
        expectedVersion,
        (state) => ({
          ...state,
          ...updates
        })
      );
      
      // Get updated workflow
      const updatedWorkflow = await workflowRepository.getInstance(id);
      
      // Return updated workflow with new ETag
      res.setHeader('ETag', `"${updatedWorkflow.version}"`);
      return res.status(200).json(updatedWorkflow);
    } catch (error) {
      if (error instanceof ConcurrentModificationError) {
        return res.status(412).json({
          error: 'Precondition Failed',
          message: 'The workflow has been modified by another request'
        });
      }
      throw error;
    }
  } catch (error) {
    console.error('Error updating workflow:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update workflow'
    });
  }
}
```

## Transaction Isolation Levels

The Workflow Orchestrator uses appropriate transaction isolation levels for different operations:

```typescript
// Default isolation level for most operations
const DEFAULT_ISOLATION_LEVEL = 'READ COMMITTED';

// For critical operations requiring strong consistency
const STRICT_ISOLATION_LEVEL = 'SERIALIZABLE';

/**
 * Execute function within a transaction with specified isolation level
 */
async function executeInTransaction<T>(
  isolationLevel: string,
  operation: (transaction: Transaction) => Promise<T>
): Promise<T> {
  const client = await database.connect();
  
  try {
    await client.query(`BEGIN TRANSACTION ISOLATION LEVEL ${isolationLevel}`);
    
    const transaction = {
      query: (text, params) => client.query(text, params),
      commit: () => client.query('COMMIT'),
      rollback: () => client.query('ROLLBACK')
    };
    
    const result = await operation(transaction);
    
    await transaction.commit();
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
```

## Performance Considerations

Atomic updates are designed with performance in mind:

1. **Minimal Locking**: Locks are held for the shortest possible time
2. **Targeted Updates**: Updates modify only necessary fields
3. **Indexed Queries**: All queries used in atomic operations are properly indexed
4. **Connection Pooling**: Efficient database connection management
5. **Retry with Backoff**: Intelligent retry mechanism with exponential backoff

## Testing

Atomic updates are verified with specialized tests:

```typescript
/**
 * Test concurrent updates to the same workflow
 */
async function testConcurrentUpdates() {
  // Create test workflow
  const workflowId = await createTestWorkflow();
  
  // Simulate concurrent updates
  const results = await Promise.allSettled([
    updateWorkflowStateWithRetry(workflowId, 3, state => {
      state.variables.counter = (state.variables.counter || 0) + 1;
      return state;
    }),
    updateWorkflowStateWithRetry(workflowId, 3, state => {
      state.variables.counter = (state.variables.counter || 0) + 2;
      return state;
    }),
    updateWorkflowStateWithRetry(workflowId, 3, state => {
      state.variables.counter = (state.variables.counter || 0) + 3;
      return state;
    })
  ]);
  
  // Verify results
  console.log(`Success count: ${results.filter(r => r.status === 'fulfilled').length}`);
  console.log(`Failure count: ${results.filter(r => r.status === 'rejected').length}`);
  
  // Check final state
  const finalWorkflow = await workflowRepository.getInstance(workflowId);
  console.log(`Final counter value: ${finalWorkflow.state.variables.counter}`);
  console.log(`Final version: ${finalWorkflow.version}`);
}
```

## Related Documentation

- [State Management](./state_management.md)
- [Database Optimization](./database_optimization.md)
- [Error Handling](./error_handling.md) 