# Event Receiver

## Overview

The Event Receiver is responsible for handling the ingestion of events from multiple sources, validating event schemas, and normalizing event formats before passing them to other components of the Event Processing Service.

## Key Responsibilities

* Accepting events from various internal and external sources
* Validating event structure and content against defined schemas
* Normalizing events to a standard format for processing
* Assigning unique identifiers to events
* Timestamping and initial metadata enrichment
* Performing initial event deduplication
* Handling rate limiting and backpressure

## Implementation

The Event Receiver implements multiple input interfaces to accept events from different sources:

### HTTP REST API

The HTTP API accepts events via REST endpoints:

```typescript
/**
 * HTTP endpoint for receiving events
 */
app.post('/api/events', async (req, res) => {
  try {
    // Extract event details from request
    const { pattern, payload, metadata } = req.body;
    
    // Validate request format
    if (!pattern || !payload) {
      return res.status(400).json({
        error: 'Invalid event format. Pattern and payload are required.'
      });
    }
    
    // Authenticate and authorize the publisher
    const publisherId = authenticatePublisher(req);
    if (!publisherId) {
      return res.status(401).json({
        error: 'Unauthorized event publisher'
      });
    }
    
    // Create enhanced metadata
    const enhancedMetadata = {
      ...metadata,
      source: {
        type: 'http',
        id: publisherId,
        name: getPublisherName(publisherId)
      },
      receivedAt: new Date().toISOString()
    };
    
    // Process the event
    const eventId = await eventService.publishEvent(
      pattern,
      payload,
      enhancedMetadata
    );
    
    // Return success response with event ID
    return res.status(202).json({
      eventId,
      status: 'accepted'
    });
  } catch (error) {
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Event validation failed',
        details: error.details
      });
    }
    
    // Handle other errors
    console.error('Event reception error:', error);
    return res.status(500).json({
      error: 'Failed to process event'
    });
  }
});
```

### Message Queue Consumer

The Event Receiver consumes events from message brokers like RabbitMQ or Kafka:

```typescript
/**
 * Message queue consumer for receiving events
 */
class MessageQueueConsumer {
  private connection: Connection;
  private channel: Channel;
  
  /**
   * Initialize message queue connection and channel
   */
  async initialize() {
    this.connection = await connect(process.env.RABBITMQ_URL);
    this.channel = await this.connection.createChannel();
    
    // Setup queue and exchange
    await this.channel.assertExchange('events', 'topic', { durable: true });
    const queue = await this.channel.assertQueue('event-receiver', { durable: true });
    await this.channel.bindQueue(queue.queue, 'events', '#');
    
    // Start consuming messages
    await this.channel.consume(queue.queue, async (message) => {
      if (!message) return;
      
      try {
        // Parse message content
        const content = JSON.parse(message.content.toString());
        const { pattern, payload, metadata } = content;
        
        // Create enhanced metadata
        const enhancedMetadata = {
          ...metadata,
          source: {
            type: 'queue',
            id: message.properties.appId || 'unknown',
            name: message.properties.appId || 'unknown'
          },
          receivedAt: new Date().toISOString(),
          messageId: message.properties.messageId
        };
        
        // Process the event
        await eventService.publishEvent(
          pattern, 
          payload, 
          enhancedMetadata
        );
        
        // Acknowledge message
        this.channel.ack(message);
      } catch (error) {
        // Handle processing errors
        console.error('Failed to process queue message:', error);
        
        // Move to dead-letter queue after several retries
        if (this.getRetryCount(message) > 3) {
          this.channel.reject(message, false);
        } else {
          // Retry with backoff
          const retryCount = this.incrementRetryCount(message);
          const delay = Math.pow(2, retryCount) * 1000;
          setTimeout(() => {
            this.channel.reject(message, true);
          }, delay);
        }
      }
    });
  }
}
```

## Validation Process

The Event Receiver validates events against their corresponding event definition schemas:

```typescript
/**
 * Validates an event against its definition schema
 */
async function validateEvent(pattern: string, payload: any): Promise<ValidationResult> {
  // Get the event definition for this pattern
  const eventDefinition = await eventDefinitionRegistry.getDefinition(pattern);
  if (!eventDefinition) {
    return {
      valid: false,
      errors: [{
        message: `Unknown event pattern: ${pattern}`
      }]
    };
  }
  
  // Validate using JSON Schema
  const validator = new JSONSchemaValidator();
  return validator.validate(eventDefinition.payload_schema, payload);
}
```

## Edge Cases and Error Handling

The Event Receiver handles several edge cases:

1. **Duplicate Events**: Uses event IDs and idempotency keys to detect and handle duplicate submissions
2. **Invalid Events**: Returns detailed validation errors for schema violations
3. **High Traffic**: Implements rate limiting and backpressure mechanisms
4. **Publisher Authentication**: Validates publisher credentials and permissions
5. **Schema Evolution**: Handles version mismatches between events and schemas

## Performance Considerations

The Event Receiver is optimized for high throughput:

* Performs schema validation in-memory when possible
* Uses connection pooling for database interactions
* Implements batching for high-volume event sources
* Caches frequently used event definitions
* Uses non-blocking I/O for network operations

## Related Documentation

* [Event Router](./event_router.md)
* [Event Store](./event_store.md)
* [API Reference](../interfaces/api.md) 