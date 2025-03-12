# Error Handling and Recovery

This document demonstrates robust error handling and recovery patterns using the Event Processing Service.

## Handling Delivery Failures

Implementing robust handling for event delivery failures:

```typescript
import { EventServiceClient } from '@example/event-service-client';
import { DeadLetterQueueProcessor } from '@example/event-processing-utils';

// Initialize the client
const client = new EventServiceClient({
  baseUrl: 'https://api.example.com/event-service',
  apiKey: 'your-api-key'
});

// Create a handler for delivery failures
class DeliveryFailureHandler {
  private maxRetries = 5;
  
  /**
   * Handle a delivery failure event
   */
  async handleDeliveryFailure(event) {
    const { eventId, subscriberId, error, retryCount } = event.data;
    
    console.log(`Handling delivery failure for event ${eventId} to subscriber ${subscriberId}`);
    console.log(`Error: ${error.message}, Retry count: ${retryCount}`);
    
    // Check if we've exceeded max retries
    if (retryCount >= this.maxRetries) {
      console.log(`Max retries exceeded for event ${eventId}`);
      await this.moveToDeadLetterQueue(event);
      return;
    }
    
    // Determine if error is transient
    if (this.isTransientError(error)) {
      // Retry with exponential backoff
      const delayMs = Math.pow(2, retryCount) * 1000;
      console.log(`Scheduling retry in ${delayMs}ms`);
      
      setTimeout(async () => {
        await client.retryEventDelivery(eventId, subscriberId);
      }, delayMs);
    } else {
      // Non-transient error, move to dead letter queue
      console.log(`Non-transient error, moving to DLQ`);
      await this.moveToDeadLetterQueue(event);
    }
  }
  
  /**
   * Determine if an error is likely transient
   */
  private isTransientError(error) {
    // Network errors are generally transient
    if (error.type === 'NETWORK_ERROR') return true;
    
    // Service unavailable errors are generally transient
    if (error.type === 'SERVICE_UNAVAILABLE') return true;
    
    // Rate limiting errors are transient
    if (error.type === 'RATE_LIMITED') return true;
    
    // HTTP 5xx errors are generally transient
    if (error.statusCode && error.statusCode >= 500) return true;
    
    // Other errors are considered non-transient
    return false;
  }
  
  /**
   * Move an event to the dead letter queue
   */
  private async moveToDeadLetterQueue(event) {
    await client.moveToDeadLetterQueue({
      eventId: event.data.eventId,
      subscriberId: event.data.subscriberId,
      reason: `Failed after ${event.data.retryCount} retries: ${event.data.error.message}`,
      originalEvent: event.data.originalEvent
    });
    
    // Optionally notify an administrator
    await client.publishEvent({
      type: 'system.deadletter.created',
      source: 'delivery-failure-handler',
      data: {
        eventId: event.data.eventId,
        subscriberId: event.data.subscriberId,
        error: event.data.error,
        timestamp: new Date().toISOString()
      }
    });
  }
}

// Create and use the handler
const failureHandler = new DeliveryFailureHandler();

// Subscribe to delivery failure events
client.subscribe('system.delivery.failed', {
  name: 'delivery-failure-handler',
  callback: async (event) => {
    await failureHandler.handleDeliveryFailure(event);
  }
});

console.log('Delivery failure handler registered');
```

## Event Replay Strategies

Implementing event replay for recovery scenarios:

```typescript
import { EventServiceClient } from '@example/event-service-client';
import { EventReplayManager } from '@example/event-processing-utils';

// Initialize the client
const client = new EventServiceClient({
  baseUrl: 'https://api.example.com/event-service',
  apiKey: 'your-api-key'
});

// Create a replay manager
const replayManager = new EventReplayManager({ client });

/**
 * Replay events for a specific subscriber
 */
async function replayEventsForSubscriber(subscriberId, options = {}) {
  const {
    startTime = '2023-01-01T00:00:00Z',
    endTime = new Date().toISOString(),
    eventTypes = [],
    batchSize = 100,
    concurrency = 5
  } = options;
  
  console.log(`Initiating replay for subscriber ${subscriberId}`);
  console.log(`Time range: ${startTime} to ${endTime}`);
  
  if (eventTypes.length > 0) {
    console.log(`Event types: ${eventTypes.join(', ')}`);
  } else {
    console.log('All event types will be replayed');
  }
  
  // Start the replay
  const replayId = await replayManager.startReplay({
    subscriberId,
    startTime,
    endTime,
    eventTypes,
    batchSize,
    concurrency
  });
  
  console.log(`Replay started with ID: ${replayId}`);
  return replayId;
}

/**
 * Monitor replay progress
 */
async function monitorReplay(replayId) {
  return new Promise((resolve) => {
    const interval = setInterval(async () => {
      const status = await replayManager.getReplayStatus(replayId);
      
      console.log(`Replay ${replayId} - Progress: ${status.progress}%`);
      console.log(`Events processed: ${status.processedCount}/${status.totalEvents}`);
      
      if (status.status === 'COMPLETED' || status.status === 'FAILED') {
        clearInterval(interval);
        console.log(`Replay ${status.status}`);
        
        if (status.status === 'COMPLETED') {
          console.log(`Successfully replayed ${status.processedCount} events`);
        } else {
          console.log(`Replay failed: ${status.errorMessage}`);
        }
        
        resolve(status);
      }
    }, 5000); // Check every 5 seconds
  });
}

/**
 * Recover a subscriber after outage
 */
async function recoverSubscriberAfterOutage(subscriberId, outageStartTime, outageEndTime) {
  console.log(`Recovering subscriber ${subscriberId} after outage`);
  console.log(`Outage period: ${outageStartTime} to ${outageEndTime}`);
  
  // First, check subscriber health
  const subscriberStatus = await client.checkSubscriberHealth(subscriberId);
  
  if (subscriberStatus.status !== 'HEALTHY') {
    console.log(`Subscriber ${subscriberId} is still unhealthy, cannot recover`);
    console.log(`Current status: ${subscriberStatus.status}`);
    console.log(`Error: ${subscriberStatus.errorMessage}`);
    return false;
  }
  
  // Start replay for the outage period
  const replayId = await replayEventsForSubscriber(subscriberId, {
    startTime: outageStartTime,
    endTime: outageEndTime
  });
  
  // Monitor until completion
  const replayStatus = await monitorReplay(replayId);
  
  // Return success status
  return replayStatus.status === 'COMPLETED';
}

// Example: Recover a subscriber after an outage
async function recoverSubscriber() {
  // Define outage period (e.g., the last hour)
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - (60 * 60 * 1000));
  
  // Attempt recovery
  const success = await recoverSubscriberAfterOutage(
    'subscriber-123',
    oneHourAgo.toISOString(),
    now.toISOString()
  );
  
  if (success) {
    console.log('Subscriber recovery completed successfully');
  } else {
    console.log('Subscriber recovery failed');
  }
}

recoverSubscriber();
```

## Dead Letter Queue Processing

Processing events from the dead letter queue:

```typescript
import { EventServiceClient } from '@example/event-service-client';
import { DeadLetterQueueProcessor } from '@example/event-processing-utils';

// Initialize the client
const client = new EventServiceClient({
  baseUrl: 'https://api.example.com/event-service',
  apiKey: 'your-api-key'
});

// Create DLQ processor
const dlqProcessor = new DeadLetterQueueProcessor({
  client,
  processors: {
    // Process payment failures
    'payment': async (dlqItem) => {
      console.log(`Processing payment DLQ item: ${dlqItem.id}`);
      
      // Check if the subscriber is healthy
      const subscriberStatus = await client.checkSubscriberHealth(dlqItem.subscriberId);
      
      if (subscriberStatus.status === 'HEALTHY') {
        // Subscriber is healthy, retry the delivery
        return {
          action: 'RETRY',
          reason: 'Subscriber is now healthy'
        };
      }
      
      // Get original event
      const originalEvent = dlqItem.originalEvent;
      
      // If it's a payment failure, we might need to reverse the charge
      if (originalEvent.type === 'payment.processed') {
        // Check if we need to refund
        const needsRefund = await checkIfRefundNeeded(originalEvent);
        
        if (needsRefund) {
          // Issue refund through payment service
          await issueRefund(originalEvent);
          
          return {
            action: 'DISCARD',
            reason: 'Payment refunded due to delivery failure'
          };
        }
      }
      
      // Keep in DLQ for manual review
      return {
        action: 'KEEP',
        reason: 'Requires manual review'
      };
    },
    
    // Process inventory failures
    'inventory': async (dlqItem) => {
      console.log(`Processing inventory DLQ item: ${dlqItem.id}`);
      
      // Get original event
      const originalEvent = dlqItem.originalEvent;
      
      // If it's a reservation that failed to deliver, we should release the inventory
      if (originalEvent.type === 'inventory.reserved') {
        await releaseInventory(originalEvent);
        
        return {
          action: 'DISCARD',
          reason: 'Inventory released due to delivery failure'
        };
      }
      
      // Default action
      return {
        action: 'KEEP',
        reason: 'Unknown inventory event type'
      };
    },
    
    // Default processor for other event types
    'default': async (dlqItem) => {
      console.log(`Processing default DLQ item: ${dlqItem.id}`);
      
      // If error is old, discard it
      const ageInDays = calculateAgeInDays(dlqItem.timestamp);
      if (ageInDays > 30) {
        return {
          action: 'DISCARD',
          reason: 'Event is over 30 days old'
        };
      }
      
      // Try to retry recent errors
      if (ageInDays < 1) {
        // Check if subscriber is healthy
        const subscriberStatus = await client.checkSubscriberHealth(dlqItem.subscriberId);
        
        if (subscriberStatus.status === 'HEALTHY') {
          return {
            action: 'RETRY',
            reason: 'Subscriber is now healthy and event is recent'
          };
        }
      }
      
      // Keep for manual review
      return {
        action: 'KEEP',
        reason: 'Requires manual review'
      };
    }
  }
});

// Helper functions
async function checkIfRefundNeeded(event) {
  // Implementation to determine if refund is needed
  return true;
}

async function issueRefund(event) {
  // Implementation to issue a refund
  console.log(`Issuing refund for payment ${event.data.paymentId}`);
}

async function releaseInventory(event) {
  // Implementation to release inventory
  console.log(`Releasing inventory for order ${event.data.orderId}`);
}

function calculateAgeInDays(timestamp) {
  const eventDate = new Date(timestamp);
  const now = new Date();
  const ageInMs = now.getTime() - eventDate.getTime();
  return ageInMs / (1000 * 60 * 60 * 24);
}

// Process the DLQ
async function processDLQ() {
  console.log('Starting DLQ processing');
  
  // Process a batch of DLQ items
  const result = await dlqProcessor.processBatch({
    limit: 50,
    categorizer: (dlqItem) => {
      // Categorize DLQ items by event source or type
      if (dlqItem.originalEvent.source.includes('payment')) {
        return 'payment';
      } else if (dlqItem.originalEvent.source.includes('inventory')) {
        return 'inventory';
      } else {
        return 'default';
      }
    }
  });
  
  console.log('DLQ processing complete');
  console.log(`Processed: ${result.processed}`);
  console.log(`Retried: ${result.actions.RETRY}`);
  console.log(`Discarded: ${result.actions.DISCARD}`);
  console.log(`Kept: ${result.actions.KEEP}`);
}

// Process the DLQ
processDLQ();
```

## Next Steps

Continue to [Performance Optimization](./05-performance-optimization.md) to learn about optimizing the performance of your event processing system. 