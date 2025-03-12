# Internal Event Queue

## Overview

The Internal Event Queue is responsible for managing the flow of events between components within the Event Processing Service. It provides buffering, flow control, and reliability mechanisms to ensure events are processed efficiently and reliably.

## Key Responsibilities

* Buffering events between processing stages
* Implementing backpressure mechanisms
* Managing queue depth and event priorities
* Persisting queue state for durability
* Providing batch processing capabilities
* Handling processing errors and retries
* Monitoring queue health and performance

## Implementation

### Queue Management

The Internal Event Queue provides a configurable event processing queue:

```typescript
/**
 * Event queue configuration interface
 */
interface EventQueueConfig {
  maxQueueDepth: number;        // Maximum number of events in the queue
  batchSize: number;            // Number of events to process in a batch
  processingInterval: number;   // Milliseconds between processing batches
  persistenceThreshold: number; // Queue size that triggers persistence
  highWatermark: number;        // Queue level that activates backpressure
}

/**
 * Internal event queue implementation pattern
 */
class EventQueue {
  private queue: Event[] = [];
  private config: EventQueueConfig;
  
  /**
   * Enqueues an event for processing
   * Implements backpressure when queue exceeds high watermark
   */
  async enqueue(event: Event): Promise<void> {
    if (this.queue.length >= this.config.highWatermark) {
      // Apply backpressure by slowing down acceptance of new events
      await this.applyBackpressure();
    }
    
    this.queue.push(event);
    
    // Persist queue to database if it reaches persistence threshold
    if (this.queue.length >= this.config.persistenceThreshold) {
      await this.persistQueueState();
    }
  }
  
  /**
   * Processes events from the queue
   * Called on a scheduled interval
   */
  async processEvents(): Promise<void> {
    // Take a batch of events from the queue
    const batch = this.queue.splice(0, this.config.batchSize);
    
    // Process each event in the batch
    for (const event of batch) {
      try {
        await this.processEvent(event);
      } catch (error) {
        // Handle processing errors
        await this.handleProcessingError(event, error);
      }
    }
  }
  
  /**
   * Apply backpressure when queue is full
   */
  private async applyBackpressure(): Promise<void> {
    // Slow down by introducing delay
    await new Promise(resolve => 
      setTimeout(resolve, 50 + Math.random() * 50)
    );
    
    // If queue is extremely full, block until space is available
    if (this.queue.length >= this.config.maxQueueDepth) {
      // Block until queue size drops below high watermark
      while (this.queue.length > this.config.highWatermark) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
  }
  
  /**
   * Handle errors during event processing
   */
  private async handleProcessingError(
    event: Event,
    error: Error
  ): Promise<void> {
    // Record the error
    console.error(`Error processing event ${event.id}:`, error);
    
    // Check if we should retry
    if (this.shouldRetry(event, error)) {
      // Add retry metadata
      const retryCount = (event.metadata.retryCount || 0) + 1;
      event.metadata.retryCount = retryCount;
      event.metadata.lastError = error.message;
      event.metadata.lastErrorTime = new Date().toISOString();
      
      // Calculate delay with exponential backoff
      const delayMs = Math.min(
        1000 * Math.pow(2, retryCount),
        60000 // Max 1 minute delay
      );
      
      // Schedule retry after delay
      setTimeout(() => {
        this.queue.push(event);
      }, delayMs);
    } else {
      // Send to dead letter queue
      await this.sendToDeadLetterQueue(event, error);
    }
  }
  
  /**
   * Determine if an event should be retried
   */
  private shouldRetry(event: Event, error: Error): boolean {
    // Get current retry count
    const retryCount = event.metadata.retryCount || 0;
    
    // Don't retry if we've exceeded max retries
    if (retryCount >= 5) {
      return false;
    }
    
    // Don't retry for certain error types
    if (error.name === 'ValidationError' || 
        error.name === 'NotFoundError') {
      return false;
    }
    
    // Retry for transient errors
    return true;
  }
  
  /**
   * Persist queue state to database for durability
   */
  private async persistQueueState(): Promise<void> {
    try {
      // Store pending events in the database
      await database.query(`
        INSERT INTO event_queue_state (
          id,
          events,
          created_at
        ) VALUES ($1, $2, $3)
        ON CONFLICT (id) DO UPDATE
        SET events = $2, updated_at = $3
      `, [
        'main-queue',
        JSON.stringify(this.queue),
        new Date()
      ]);
    } catch (error) {
      console.error('Failed to persist queue state:', error);
    }
  }
  
  /**
   * Send event to dead letter queue
   */
  private async sendToDeadLetterQueue(
    event: Event,
    error: Error
  ): Promise<void> {
    // Add error information
    event.metadata.processingError = {
      message: error.message,
      stack: error.stack,
      time: new Date().toISOString()
    };
    
    // Store in dead letter queue
    await database.query(`
      INSERT INTO dead_letter_queue (
        id,
        event_id,
        event_data,
        error_message,
        retry_count,
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6)
    `, [
      generateUuid(),
      event.id,
      JSON.stringify(event),
      error.message,
      event.metadata.retryCount || 0,
      new Date()
    ]);
  }
}
```

### Queue Worker

The queue processing is handled by a dedicated worker:

```typescript
/**
 * Queue worker implementation
 */
class QueueWorker {
  private queue: EventQueue;
  private running: boolean = false;
  private interval: NodeJS.Timeout | null = null;
  
  /**
   * Start the queue worker
   */
  async start(): Promise<void> {
    if (this.running) {
      return;
    }
    
    this.running = true;
    
    // Load any persisted queue state
    await this.loadQueueState();
    
    // Start processing loop
    this.interval = setInterval(
      async () => {
        try {
          await this.queue.processEvents();
        } catch (error) {
          console.error('Error in queue processing loop:', error);
        }
      },
      this.queue.config.processingInterval
    );
    
    console.log('Queue worker started');
  }
  
  /**
   * Stop the queue worker
   */
  async stop(): Promise<void> {
    if (!this.running) {
      return;
    }
    
    this.running = false;
    
    // Clear processing interval
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    
    // Persist any remaining events
    await this.queue.persistQueueState();
    
    console.log('Queue worker stopped');
  }
  
  /**
   * Load queue state from persistence
   */
  private async loadQueueState(): Promise<void> {
    try {
      const result = await database.query(`
        SELECT events FROM event_queue_state
        WHERE id = 'main-queue'
      `);
      
      if (result.rows.length > 0 && result.rows[0].events) {
        const events = JSON.parse(result.rows[0].events);
        
        // Add events back to the queue
        for (const event of events) {
          await this.queue.enqueue(event);
        }
        
        console.log(`Loaded ${events.length} events from persisted queue state`);
      }
    } catch (error) {
      console.error('Failed to load queue state:', error);
    }
  }
}
```

## Database Schema

**Table: event_queue_state**

| Field | Type | Description |
|----|----|----|
| id | VARCHAR(255) | Queue identifier (primary key) |
| events | JSONB | Serialized queue events |
| created_at | TIMESTAMP | When the queue state was created |
| updated_at | TIMESTAMP | When the queue state was last updated |

**Table: dead_letter_queue**

| Field | Type | Description |
|----|----|----|
| id | UUID | Primary key |
| event_id | VARCHAR(255) | Original event ID |
| event_data | JSONB | Full event data |
| error_message | TEXT | Error that caused the failure |
| retry_count | INTEGER | Number of times processing was attempted |
| created_at | TIMESTAMP | When the entry was created |
| processed_at | TIMESTAMP | When the entry was processed (if reprocessed) |
| status | VARCHAR(50) | Status (pending, reprocessed, discarded) |

## Edge Cases and Error Handling

The Internal Event Queue handles several edge cases:

1. **Queue Overflow**: Implements backpressure to slow down producers
2. **Processing Failures**: Uses retry strategies with exponential backoff
3. **Service Restart**: Recovers queue state from persistent storage
4. **Poison Messages**: Identifies problematic events and moves them to DLQ
5. **Resource Contention**: Manages batch sizes to optimize resource usage

## Performance Considerations

The Internal Event Queue is optimized for reliable event processing:

* Uses in-memory queuing for low-latency operations
* Implements adaptive batch sizing based on system load
* Provides configurable processing intervals
* Uses selective persistence to balance durability and performance
* Monitors and reports queue health metrics

## Related Documentation

* [Event Processor](./event_processor.md)
* [Event Router](./event_router.md)
* [Operations Guide](../operations/monitoring.md) 