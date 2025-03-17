# Database Optimization

## Overview

The Workflow Orchestrator Service relies heavily on database operations for workflow state persistence, event processing, and scheduling. This document outlines optimization strategies for database interactions to ensure high performance and scalability.

## Schema Optimization

### Indexed Fields

The following fields are indexed to optimize query performance:

| Table | Index Name | Fields | Index Type | Purpose |
|-------|------------|--------|------------|---------|
| workflow_definitions | workflow_definitions_pkey | id | PRIMARY KEY | Primary identifier lookup |
| workflow_definitions | workflow_definitions_workflow_id_idx | workflow_id | BTREE | Lookup by business identifier |
| workflow_definitions | workflow_definitions_triggers_idx | triggers | GIN | Event subscription matching |
| workflow_instances | workflow_instances_pkey | id | PRIMARY KEY | Primary identifier lookup |
| workflow_instances | workflow_instances_workflow_definition_id_idx | workflow_definition_id | BTREE | Instances by definition |
| workflow_instances | workflow_instances_status_idx | status | BTREE | Status-based filtering |
| workflow_instances | workflow_instances_correlation_id_idx | correlation_id | BTREE | Related workflow lookup |
| workflow_instances | workflow_instances_state_current_step_idx | state->>'currentStepId' | EXPRESSION | Current step lookup |
| workflow_instances | workflow_instances_created_updated_idx | (created_at, updated_at) | BTREE | Time-based queries |
| workflow_instances | workflow_instances_state_idx | state | GIN | JSONB containment queries |

### Partitioning Strategy

For high-volume deployments, table partitioning improves query performance:

```sql
-- Example of time-based partitioning for workflow_instances
CREATE TABLE workflow_instances (
    id UUID PRIMARY KEY,
    workflow_definition_id UUID NOT NULL REFERENCES workflow_definitions(id),
    status VARCHAR(50) NOT NULL,
    correlation_id VARCHAR(100),
    state JSONB NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
) PARTITION BY RANGE (created_at);

-- Monthly partitions
CREATE TABLE workflow_instances_y2023m01 PARTITION OF workflow_instances
    FOR VALUES FROM ('2023-01-01') TO ('2023-02-01');
    
CREATE TABLE workflow_instances_y2023m02 PARTITION OF workflow_instances
    FOR VALUES FROM ('2023-02-01') TO ('2023-03-01');

-- Indexes on partitions inherit from parent table
```

Benefits of partitioning:
- Faster queries when filtering by partition key
- More efficient maintenance operations
- Improved vacuum performance
- Ability to archive older partitions

## Query Optimization

### JSONB Query Patterns

Optimize JSONB queries with these patterns:

#### Containment Operator

```typescript
// Efficient - uses GIN index
const workflows = await db.query(`
  SELECT * FROM workflow_instances 
  WHERE state @> '{"variables": {"orderId": "ORD-123"}}'
`);

// Less efficient - doesn't use index
const workflows = await db.query(`
  SELECT * FROM workflow_instances 
  WHERE state->'variables'->>'orderId' = 'ORD-123'
`);
```

#### Path Operators

```typescript
// Accessing nested JSONB fields
const stepOutputs = await db.query(`
  SELECT 
    state->'stepOutputs'->'processPayment' as payment_result
  FROM workflow_instances 
  WHERE id = $1
`, [instanceId]);
```

#### Expression Indexes

```sql
-- Create expression index for common query pattern
CREATE INDEX workflow_instances_order_id_idx ON workflow_instances 
  ((state->'variables'->>'orderId'));

-- Query using the indexed expression
SELECT * FROM workflow_instances 
WHERE state->'variables'->>'orderId' = 'ORD-123';
```

### Batch Operations

Implement batch operations for high-throughput scenarios:

```typescript
// Batch insert example
async function batchCreateWorkflowInstances(instances: WorkflowInstance[]): Promise<void> {
  const values = instances.map((instance, i) => {
    const offset = i * 5;
    return `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5})`;
  }).join(', ');
  
  const params = instances.flatMap(instance => [
    instance.id,
    instance.workflowDefinitionId,
    instance.status,
    instance.correlationId,
    JSON.stringify(instance.state)
  ]);
  
  await db.query(`
    INSERT INTO workflow_instances (id, workflow_definition_id, status, correlation_id, state)
    VALUES ${values}
  `, params);
}
```

### Pagination

Implement cursor-based pagination for large result sets:

```typescript
interface PaginationParams {
  limit: number;
  cursor?: string; // Base64 encoded value of last seen ID and timestamp
}

async function getWorkflowInstancesPaginated(
  status: string, 
  pagination: PaginationParams
): Promise<{ instances: WorkflowInstance[], nextCursor: string | null }> {
  const limit = Math.min(pagination.limit, 100); // Cap at 100
  let query = `
    SELECT * FROM workflow_instances 
    WHERE status = $1
  `;
  
  const params = [status];
  let paramIndex = 2;
  
  if (pagination.cursor) {
    const { id, timestamp } = decodeCursor(pagination.cursor);
    query += ` AND (updated_at, id) > ($${paramIndex}, $${paramIndex + 1})`;
    params.push(timestamp, id);
    paramIndex += 2;
  }
  
  query += ` ORDER BY updated_at ASC, id ASC LIMIT $${paramIndex}`;
  params.push(limit);
  
  const result = await db.query(query, params);
  
  let nextCursor = null;
  if (result.rows.length === limit) {
    const lastRow = result.rows[result.rows.length - 1];
    nextCursor = encodeCursor({
      id: lastRow.id,
      timestamp: lastRow.updated_at
    });
  }
  
  return {
    instances: result.rows,
    nextCursor
  };
}
```

## Transaction Management

### Optimistic Concurrency Control

Implement optimistic concurrency control for workflow state updates:

```typescript
async function updateWorkflowState(
  instanceId: string, 
  newState: any, 
  expectedVersion: number
): Promise<boolean> {
  const result = await db.query(`
    UPDATE workflow_instances
    SET 
      state = $1,
      version = version + 1,
      updated_at = NOW()
    WHERE 
      id = $2 AND
      version = $3
    RETURNING id
  `, [JSON.stringify(newState), instanceId, expectedVersion]);
  
  return result.rowCount === 1;
}
```

### Transaction Isolation Levels

Choose appropriate isolation levels for different operations:

```typescript
// Read committed for most operations
async function getWorkflowInstance(id: string): Promise<WorkflowInstance | null> {
  const client = await db.getClient();
  try {
    await client.query('BEGIN TRANSACTION ISOLATION LEVEL READ COMMITTED');
    const result = await client.query(
      'SELECT * FROM workflow_instances WHERE id = $1',
      [id]
    );
    await client.query('COMMIT');
    return result.rows[0] || null;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

// Serializable for critical operations
async function transitionWorkflowState(
  id: string, 
  fromStatus: string, 
  toStatus: string
): Promise<boolean> {
  const client = await db.getClient();
  try {
    await client.query('BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE');
    const result = await client.query(`
      UPDATE workflow_instances
      SET 
        status = $1,
        updated_at = NOW()
      WHERE 
        id = $2 AND
        status = $3
      RETURNING id
    `, [toStatus, id, fromStatus]);
    await client.query('COMMIT');
    return result.rowCount === 1;
  } catch (error) {
    await client.query('ROLLBACK');
    if (error.code === '40001') { // Serialization failure
      return false; // Caller should retry
    }
    throw error;
  } finally {
    client.release();
  }
}
```

## Connection Pooling

### Pool Configuration

Optimize connection pool settings for different deployment sizes:

```typescript
// Small deployment (up to 1,000 workflows/day)
const smallDeploymentPool = new Pool({
  max: 20,
  min: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});

// Medium deployment (1,000-10,000 workflows/day)
const mediumDeploymentPool = new Pool({
  max: 50,
  min: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 3000
});

// Large deployment (10,000+ workflows/day)
const largeDeploymentPool = new Pool({
  max: 100,
  min: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000
});
```

### Connection Management

Implement proper connection handling:

```typescript
async function executeQuery<T>(
  queryFn: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await pool.connect();
  try {
    return await queryFn(client);
  } finally {
    client.release();
  }
}

// Usage
const result = await executeQuery(async (client) => {
  const result = await client.query('SELECT * FROM workflow_instances WHERE id = $1', [id]);
  return result.rows[0];
});
```

## Caching Strategy

### Entity Caching

Cache frequently accessed entities:

```typescript
interface CacheOptions {
  ttl: number; // Time to live in seconds
}

class WorkflowDefinitionCache {
  private cache = new Map<string, { data: WorkflowDefinition, expiry: number }>();
  
  async get(id: string): Promise<WorkflowDefinition | null> {
    const cached = this.cache.get(id);
    if (cached && cached.expiry > Date.now()) {
      return cached.data;
    }
    
    // Cache miss or expired
    const definition = await db.query(
      'SELECT * FROM workflow_definitions WHERE id = $1',
      [id]
    );
    
    if (definition.rows[0]) {
      this.set(id, definition.rows[0], { ttl: 3600 }); // Cache for 1 hour
      return definition.rows[0];
    }
    
    return null;
  }
  
  set(id: string, data: WorkflowDefinition, options: CacheOptions): void {
    this.cache.set(id, {
      data,
      expiry: Date.now() + (options.ttl * 1000)
    });
  }
  
  invalidate(id: string): void {
    this.cache.delete(id);
  }
}
```

### Query Result Caching

Cache expensive query results:

```typescript
class QueryCache {
  private cache = new Map<string, { data: any, expiry: number }>();
  
  async getOrExecute<T>(
    cacheKey: string,
    queryFn: () => Promise<T>,
    options: CacheOptions
  ): Promise<T> {
    const cached = this.cache.get(cacheKey);
    if (cached && cached.expiry > Date.now()) {
      return cached.data as T;
    }
    
    // Execute query
    const result = await queryFn();
    
    // Cache result
    this.cache.set(cacheKey, {
      data: result,
      expiry: Date.now() + (options.ttl * 1000)
    });
    
    return result;
  }
  
  invalidateByPrefix(prefix: string): void {
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
      }
    }
  }
}

// Usage
const activeWorkflows = await queryCache.getOrExecute(
  'active-workflows',
  () => db.query('SELECT COUNT(*) FROM workflow_instances WHERE status = $1', ['ACTIVE']),
  { ttl: 60 } // Cache for 60 seconds
);
```

## Monitoring and Optimization

### Query Performance Tracking

Implement query performance tracking:

```typescript
async function executeTrackedQuery<T>(
  name: string,
  query: string,
  params: any[]
): Promise<T> {
  const startTime = process.hrtime();
  
  try {
    const result = await db.query(query, params);
    
    const [seconds, nanoseconds] = process.hrtime(startTime);
    const durationMs = (seconds * 1000) + (nanoseconds / 1000000);
    
    // Record metrics
    metrics.recordQueryDuration(name, durationMs);
    
    // Log slow queries
    if (durationMs > 1000) {
      logger.warn(`Slow query detected: ${name}`, {
        query,
        params,
        durationMs
      });
    }
    
    return result as T;
  } catch (error) {
    // Record error metrics
    metrics.incrementQueryErrors(name);
    throw error;
  }
}
```

### Explain Plan Analysis

Regularly analyze query plans:

```typescript
async function analyzeQueryPlan(query: string, params: any[]): Promise<string> {
  const result = await db.query(`EXPLAIN ANALYZE ${query}`, params);
  return result.rows.map(row => row['QUERY PLAN']).join('\n');
}

// Usage in development/testing
if (process.env.NODE_ENV !== 'production') {
  const plan = await analyzeQueryPlan(
    'SELECT * FROM workflow_instances WHERE status = $1',
    ['ACTIVE']
  );
  console.log('Query plan:', plan);
}
```

## Database Maintenance

### Vacuum Strategy

Implement regular vacuum operations:

```sql
-- Automated vacuum settings in PostgreSQL
ALTER TABLE workflow_instances SET (
  autovacuum_vacuum_threshold = 1000,
  autovacuum_vacuum_scale_factor = 0.1,
  autovacuum_analyze_threshold = 500,
  autovacuum_analyze_scale_factor = 0.05
);

-- Manual vacuum for maintenance windows
VACUUM ANALYZE workflow_instances;
```

### Index Maintenance

Regularly rebuild indexes to maintain performance:

```sql
-- Rebuild index to reduce fragmentation
REINDEX TABLE workflow_instances;

-- Rebuild specific index
REINDEX INDEX workflow_instances_state_idx;
```

## Related Documentation

- [Database Architecture](../../../database_architecture.md)
- [Scaling Considerations](../operations/scaling.md)
- [Performance Monitoring](../operations/monitoring.md)


