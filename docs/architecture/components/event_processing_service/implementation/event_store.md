# Event Store

## Overview

The Event Store is responsible for persisting events for audit, replay, and recovery purposes. It provides a durable record of all events that flow through the system, enabling event sourcing patterns, historical analysis, and system recovery capabilities.

## Key Responsibilities

* Persisting events in a durable storage system
* Supporting efficient querying of historical events
* Enabling event replay for recovery scenarios
* Providing event sequence tracking and ordering
* Supporting event correlation and relationship tracking
* Implementing retention policies and archiving
* Optimizing storage for high-volume event throughput

## Implementation

### Event Persistence

The Event Store persists events to the database with appropriate indexing:

```typescript
/**
 * Event persistence implementation
 */
class EventStore {
  private database: Database;
  
  /**
   * Save an event to the store
   */
  async saveEvent(event: Event): Promise<void> {
    try {
      // Create partition key based on timestamp
      const partitionKey = this.createPartitionKey(event.timestamp);
      
      // Store event in the events table
      await this.database.query(`
        INSERT INTO events (
          id, 
          event_id, 
          pattern, 
          version, 
          source, 
          timestamp, 
          payload, 
          metadata,
          created_at,
          partition_key
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
        )
      `, [
        generateUuid(),
        event.id,
        event.pattern,
        event.version,
        JSON.stringify(event.source),
        new Date(event.timestamp),
        JSON.stringify(event.payload),
        JSON.stringify(event.metadata),
        new Date(),
        partitionKey
      ]);
      
      // Update event sequence for ordering
      await this.updateEventSequence(event.pattern);
      
    } catch (error) {
      // Handle database errors
      if (error.code === 'UNIQUE_VIOLATION') {
        // Event already exists (idempotent handling)
        console.log(`Event ${event.id} already exists, ignoring duplicate`);
        return;
      }
      
      // Re-throw other errors
      throw error;
    }
  }
  
  /**
   * Create time-based partition key
   */
  private createPartitionKey(timestamp: string): string {
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${date.getMonth() + 1}`;
  }
  
  /**
   * Update event sequence for a pattern
   */
  private async updateEventSequence(pattern: string): Promise<void> {
    await this.database.query(`
      INSERT INTO event_sequences (pattern, sequence)
      VALUES ($1, 1)
      ON CONFLICT (pattern) DO UPDATE
      SET sequence = event_sequences.sequence + 1
    `, [pattern]);
  }
}
```

### Event Querying

The Event Store provides APIs for querying historical events:

```typescript
/**
 * Event querying interface
 */
class EventQueryService {
  private database: Database;
  
  /**
   * Find events by pattern
   */
  async findEventsByPattern(
    pattern: string,
    options: QueryOptions = {}
  ): Promise<Event[]> {
    // Build query with appropriate filters
    const { 
      limit = 100, 
      offset = 0, 
      startTime, 
      endTime,
      order = 'DESC'
    } = options;
    
    let query = `
      SELECT * FROM events
      WHERE pattern = $1
    `;
    
    const params = [pattern];
    let paramIndex = 2;
    
    // Add time range filters if provided
    if (startTime) {
      query += ` AND timestamp >= $${paramIndex}`;
      params.push(new Date(startTime));
      paramIndex++;
    }
    
    if (endTime) {
      query += ` AND timestamp <= $${paramIndex}`;
      params.push(new Date(endTime));
      paramIndex++;
    }
    
    // Add ordering and pagination
    query += ` ORDER BY timestamp ${order === 'ASC' ? 'ASC' : 'DESC'}`;
    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);
    
    // Execute query
    const result = await this.database.query(query, params);
    
    // Map database rows to event objects
    return result.rows.map(this.mapRowToEvent);
  }
  
  /**
   * Find events by correlation ID
   */
  async findEventsByCorrelationId(
    correlationId: string,
    options: QueryOptions = {}
  ): Promise<Event[]> {
    // Query events using the metadata correlation index
    const { limit = 100, offset = 0, order = 'DESC' } = options;
    
    const query = `
      SELECT * FROM events
      WHERE metadata->>'correlationId' = $1
      ORDER BY timestamp ${order === 'ASC' ? 'ASC' : 'DESC'}
      LIMIT $2 OFFSET $3
    `;
    
    const result = await this.database.query(query, [
      correlationId,
      limit,
      offset
    ]);
    
    return result.rows.map(this.mapRowToEvent);
  }
  
  /**
   * Map database row to event object
   */
  private mapRowToEvent(row: any): Event {
    return {
      id: row.event_id,
      pattern: row.pattern,
      version: row.version,
      source: row.source,
      timestamp: row.timestamp.toISOString(),
      payload: row.payload,
      metadata: row.metadata
    };
  }
}
```

### Event Replay

The Event Store supports replaying events for recovery purposes:

```typescript
/**
 * Event replay functionality
 */
class EventReplayService {
  private eventQueryService: EventQueryService;
  private eventRouter: EventRouter;
  
  /**
   * Replay events by pattern within a time range
   */
  async replayEvents(
    pattern: string,
    startTime: string,
    endTime: string,
    targetSubscriber?: string
  ): Promise<ReplayResult> {
    // Query events that match the criteria
    const events = await this.eventQueryService.findEventsByPattern(pattern, {
      startTime,
      endTime,
      order: 'ASC', // Replay in chronological order
      limit: 1000   // Batch size for processing
    });
    
    console.log(`Replaying ${events.length} events for pattern ${pattern}`);
    
    // Track replay progress
    const replayId = generateUuid();
    const replayResult: ReplayResult = {
      id: replayId,
      pattern,
      eventCount: events.length,
      successCount: 0,
      failureCount: 0,
      inProgress: true
    };
    
    // Process events in batches for better performance
    for (const event of events) {
      try {
        // Mark event as replay
        event.metadata.replay = true;
        event.metadata.replayId = replayId;
        
        // Route to specific subscriber or all subscribers
        let result;
        if (targetSubscriber) {
          result = await this.eventRouter.routeEventToSubscriber(
            event,
            targetSubscriber
          );
        } else {
          result = await this.eventRouter.routeEvent(event);
        }
        
        replayResult.successCount += 1;
      } catch (error) {
        console.error(`Failed to replay event ${event.id}:`, error);
        replayResult.failureCount += 1;
      }
    }
    
    // Update replay status
    replayResult.inProgress = false;
    
    return replayResult;
  }
}
```

## Database Schema

The Event Store uses these primary database tables:

**Table: events**

| Field | Type | Description |
|----|----|----|
| id | UUID | Primary key |
| event_id | VARCHAR(255) | Unique business identifier for the event instance |
| pattern | VARCHAR(255) | Event pattern (e.g., "invoice.created") |
| version | VARCHAR(50) | Event schema version |
| source | JSONB | Origin of the event (type, id, name) |
| timestamp | TIMESTAMP(6) | When the event occurred (microsecond precision) |
| payload | JSONB | Event data payload |
| metadata | JSONB | Additional context information |
| created_at | TIMESTAMP | Record creation timestamp |
| partition_key | VARCHAR(255) | For time-based partitioning |

**Table: event_sequences**

| Field | Type | Description |
|----|----|----|
| pattern | VARCHAR(255) | Event pattern (primary key) |
| sequence | BIGINT | Current sequence number for the pattern |
| updated_at | TIMESTAMP | Last update timestamp |

## Edge Cases and Error Handling

The Event Store handles several edge cases:

1. **Duplicate Events**: Uses unique constraints to prevent duplicate events
2. **Concurrent Writes**: Implements optimistic concurrency control
3. **Storage Failures**: Implements write-ahead logging for recovery
4. **Large Payloads**: Optimizes storage for different payload sizes
5. **Cross-partition Queries**: Handles queries that span multiple partitions

## Performance Considerations

The Event Store is optimized for efficient event storage and retrieval:

* Uses time-based partitioning for improved query performance
* Implements efficient indexing strategies for common query patterns
* Employs JSONB compression for reduced storage footprint
* Supports batch operations for high-volume scenarios
* Implements asynchronous write patterns for write-heavy workloads

## Related Documentation

* [Event Receiver](./event_receiver.md)
* [Event Router](./event_router.md)
* [Data Model](../data_model.md) 