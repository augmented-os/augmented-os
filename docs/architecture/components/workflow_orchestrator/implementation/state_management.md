# State Management

## Overview

The State Manager is a core component of the Workflow Orchestrator Service responsible for maintaining workflow instance state. It ensures durability, consistency, and atomicity of state transitions throughout workflow execution.

## Key Responsibilities

* Persisting workflow instance data to the database
* Loading current state when resuming workflows
* Ensuring atomic state transitions
* Providing transaction management
* Facilitating optimistic concurrency control

## Implementation Approach

The state management system follows these design principles:


1. **Database as source of truth** - All workflow state is stored in the database
2. **Optimistic concurrency** - Version numbers prevent concurrent modifications
3. **Transactional updates** - State changes are performed within transactions
4. **Minimized locking** - Locks are used only when strictly necessary
5. **Audit trail** - State changes are logged for traceability

## Workflow State Lifecycle

```
┌───────────┐
│  CREATED  │
└─────┬─────┘
      │
      ▼
┌───────────┐     ┌─────────────────┐
│  RUNNING  │────►│ WAITING_FOR_EVENT│
└─────┬─────┘     └─────────┬────────┘
      │                     │
      │                     │
      ▼                     │
┌───────────┐               │
│   FAILED  │               │
└───────────┘               │
      ▲                     │
      │                     │
      │                     │
┌───────────┐               │
│ CANCELLED │◄──────────────┘
└─────┬─────┘
      │
      ▼
┌───────────┐
│ COMPLETED │
└───────────┘
```

## State Updates Implementation

### Atomic State Updates

```typescript
/**
 * Updates workflow state atomically with optimistic concurrency control
 */
async function updateWorkflowState(
  instanceId: string, 
  expectedVersion: number,
  updateFunction: (state: WorkflowState) => WorkflowState
): Promise<void> {
  // Start transaction
  const transaction = await database.beginTransaction();
  
  try {
    // Get current instance with FOR UPDATE lock
    const query = `
      SELECT state, version 
      FROM workflow_instances 
      WHERE id = $1 
      FOR UPDATE
    `;
    
    const result = await transaction.query(query, [instanceId]);
    const { state, version } = result.rows[0];
    
    // Check version matches
    if (version !== expectedVersion) {
      throw new Error('Concurrent modification detected');
    }
    
    // Apply update
    const newState = updateFunction(state);
    
    // Save with incremented version
    const updateQuery = `
      UPDATE workflow_instances 
      SET state = $1, version = $2, updated_at = NOW() 
      WHERE id = $3 AND version = $4
    `;
    
    await transaction.query(updateQuery, [
      newState, 
      version + 1, 
      instanceId, 
      version
    ]);
    
    // Commit transaction
    await transaction.commit();
  } catch (error) {
    // Rollback on error
    await transaction.rollback();
    throw error;
  }
}
```

### Recording Step Results

```typescript
/**
 * Records the result of a workflow step
 */
async function recordStepResult(
  instanceId: string,
  stepId: string,
  result: any
): Promise<void> {
  await updateWorkflowState(
    instanceId,
    await getWorkflowVersion(instanceId),
    (state) => {
      // Initialize steps object if needed
      state.steps = state.steps || {};
      
      // Update step information
      state.steps[stepId] = {
        status: 'COMPLETED',
        output: result,
        completedAt: new Date().toISOString()
      };
      
      return state;
    }
  );
}
```

### Handling State Transitions

```typescript
/**
 * Updates workflow status with appropriate state transition
 */
async function updateWorkflowStatus(
  instanceId: string,
  newStatus: WorkflowStatus,
  additionalUpdates: Record<string, any> = {}
): Promise<void> {
  const transaction = await database.beginTransaction();
  
  try {
    // Get current instance
    const instance = await getWorkflowInstance(instanceId, transaction);
    
    // Validate state transition
    validateStatusTransition(instance.status, newStatus);
    
    // Update status and additional fields
    const updates = {
      status: newStatus,
      updated_at: new Date(),
      ...additionalUpdates
    };
    
    // Add timestamps for terminal states
    if (newStatus === 'COMPLETED' || newStatus === 'FAILED' || newStatus === 'CANCELLED') {
      updates.completed_at = new Date();
    }
    
    // Perform update
    await transaction.query(
      `UPDATE workflow_instances 
       SET ${Object.keys(updates).map((k, i) => `${k} = $${i + 2}`).join(', ')}
       WHERE id = $1`,
      [instanceId, ...Object.values(updates)]
    );
    
    // Log state transition
    await logStateTransition(
      instanceId, 
      instance.status, 
      newStatus,
      transaction
    );
    
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

/**
 * Validates if a status transition is allowed
 */
function validateStatusTransition(
  currentStatus: WorkflowStatus, 
  newStatus: WorkflowStatus
): void {
  const allowedTransitions: Record<WorkflowStatus, WorkflowStatus[]> = {
    'CREATED': ['RUNNING', 'CANCELLED'],
    'RUNNING': ['COMPLETED', 'FAILED', 'CANCELLED', 'WAITING_FOR_EVENT'],
    'WAITING_FOR_EVENT': ['RUNNING', 'CANCELLED', 'FAILED'],
    'COMPLETED': [],
    'FAILED': ['RUNNING'], // Allow retry from failed
    'CANCELLED': []
  };
  
  if (!allowedTransitions[currentStatus].includes(newStatus)) {
    throw new Error(
      `Invalid status transition from ${currentStatus} to ${newStatus}`
    );
  }
}
```

## State Loading

```typescript
/**
 * Loads a workflow instance with efficient query patterns
 */
async function getWorkflowInstance(
  instanceId: string,
  transaction?: DatabaseTransaction
): Promise<WorkflowInstance> {
  const query = `
    SELECT 
      id,
      workflow_definition_id,
      status,
      state,
      input,
      version,
      correlation_id,
      created_at,
      updated_at,
      started_at,
      completed_at
    FROM workflow_instances
    WHERE id = $1
  `;
  
  const queryExecutor = transaction || database;
  const result = await queryExecutor.query(query, [instanceId]);
  
  if (result.rows.length === 0) {
    throw new Error(`Workflow instance ${instanceId} not found`);
  }
  
  return mapRowToWorkflowInstance(result.rows[0]);
}

/**
 * Maps a database row to a workflow instance object
 */
function mapRowToWorkflowInstance(row: any): WorkflowInstance {
  return {
    id: row.id,
    workflowDefinitionId: row.workflow_definition_id,
    status: row.status,
    state: row.state || {},
    input: row.input || {},
    version: row.version,
    correlationId: row.correlation_id,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
    startedAt: row.started_at?.toISOString(),
    completedAt: row.completed_at?.toISOString()
  };
}
```

## Bulk Operations

For high-throughput scenarios, batch operations are optimized:

```typescript
/**
 * Bulk loads multiple workflow instances in a single query
 */
async function bulkLoadWorkflowInstances(
  instanceIds: string[]
): Promise<Map<string, WorkflowInstance>> {
  if (instanceIds.length === 0) {
    return new Map();
  }
  
  // Generate placeholders for the query
  const placeholders = instanceIds
    .map((_, i) => `$${i + 1}`)
    .join(',');
  
  const query = `
    SELECT * 
    FROM workflow_instances 
    WHERE id IN (${placeholders})
  `;
  
  const result = await database.query(query, instanceIds);
  
  // Map results by ID for efficient access
  const instances = new Map();
  for (const row of result.rows) {
    instances.set(row.id, mapRowToWorkflowInstance(row));
  }
  
  return instances;
}
```

## Concurrency Considerations

State management in the Workflow Orchestrator handles these concurrency scenarios:


1. **Multiple service instances** - Multiple orchestrator instances can update the same workflow safely due to optimistic concurrency control
2. **Parallel step execution** - When workflow steps execute in parallel, their results are merged consistently
3. **Event collisions** - When multiple events could resume a workflow simultaneously, only one will succeed
4. **User operations** - API operations and background processing are coordinated through version checking

## Related Documentation

* [Data Model](../data_model.md)
* [Database Optimization](./database_optimization.md)
* [Error Handling](./error_handling.md)


