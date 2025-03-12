# Complex Event Patterns

This document demonstrates advanced patterns for processing complex events using the Event Processing Service.

## Event Correlation

Event correlation allows you to identify relationships between different events and process them together:

```typescript
import { EventServiceClient, CorrelationManager } from '@example/event-service-client';
import { EventProcessor } from '@example/event-processing-utils';

// Initialize the client
const client = new EventServiceClient({
  baseUrl: 'https://api.example.com/event-service',
  apiKey: 'your-api-key'
});

// Create a correlation manager
const correlationManager = new CorrelationManager();

// Define correlated events to track
correlationManager.defineCorrelation({
  name: 'order-processing',
  correlationKey: 'orderId',
  requiredEvents: [
    'order.created',
    'payment.processed',
    'inventory.reserved'
  ],
  timeoutMs: 60000 // 1 minute
});

// Set up the event processor
const eventProcessor = new EventProcessor();

// Handle correlated events
eventProcessor.onCorrelation('order-processing', async (events) => {
  // Extract the events by type
  const orderEvent = events.find(e => e.pattern === 'order.created');
  const paymentEvent = events.find(e => e.pattern === 'payment.processed');
  const inventoryEvent = events.find(e => e.pattern === 'inventory.reserved');
  
  // Process the complete order
  console.log(`Processing complete order ${orderEvent.payload.orderId}`);
  
  // Create order fulfilled event
  const fulfilledEvent = {
    type: 'order.fulfilled',
    source: 'order-processor',
    data: {
      orderId: orderEvent.payload.orderId,
      customer: orderEvent.payload.customer,
      paymentId: paymentEvent.payload.paymentId,
      inventoryStatus: inventoryEvent.payload.status,
      fulfilledAt: new Date().toISOString()
    },
    metadata: {
      correlationId: orderEvent.metadata.correlationId
    }
  };
  
  // Publish the fulfilled event
  await client.publishEvent(fulfilledEvent);
});

// Subscribe to relevant events
await client.subscribe('order.created', {
  name: 'correlation-handler',
  callback: (event) => correlationManager.processEvent(event)
});

await client.subscribe('payment.processed', {
  name: 'correlation-handler',
  callback: (event) => correlationManager.processEvent(event)
});

await client.subscribe('inventory.reserved', {
  name: 'correlation-handler',
  callback: (event) => correlationManager.processEvent(event)
});
```

## Event Aggregation

Event aggregation allows you to combine multiple events over time windows:

```typescript
import { EventServiceClient } from '@example/event-service-client';
import { TimeWindowAggregator } from '@example/event-processing-utils';

// Initialize the client
const client = new EventServiceClient({
  baseUrl: 'https://api.example.com/event-service',
  apiKey: 'your-api-key'
});

// Create a time window aggregator for product views
// Aggregates events over a 5-minute tumbling window
const productViewAggregator = new TimeWindowAggregator({
  windowSize: 5 * 60 * 1000, // 5 minutes
  windowType: 'tumbling',
  groupBy: 'payload.productId',
  aggregates: [
    { field: 'payload.productId', name: 'productId', aggregation: 'first' },
    { field: 'payload.userId', name: 'uniqueUsers', aggregation: 'countDistinct' },
    { field: 'payload.sessionId', name: 'uniqueSessions', aggregation: 'countDistinct' },
    { field: 'payload.viewDuration', name: 'totalViewDuration', aggregation: 'sum' },
    { field: 'payload.addedToCart', name: 'addToCartCount', aggregation: 'count', filter: 'payload.addedToCart === true' }
  ]
});

// Subscribe to product view events
await client.subscribe('product.viewed', {
  name: 'product-view-aggregator',
  callback: async (event) => {
    // Add event to the aggregator
    const aggregateResult = productViewAggregator.processEvent(event);
    
    // If we have aggregate results (window closed), publish them
    if (aggregateResult) {
      await client.publishEvent({
        type: 'product.metrics.aggregated',
        source: 'event-aggregator',
        data: {
          timestamp: new Date().toISOString(),
          windowStart: aggregateResult.windowStart,
          windowEnd: aggregateResult.windowEnd,
          metrics: aggregateResult.groups.map(group => ({
            productId: group.productId,
            uniqueUsers: group.uniqueUsers,
            uniqueSessions: group.uniqueSessions,
            totalViewDuration: group.totalViewDuration,
            addToCartCount: group.addToCartCount,
            conversionRate: group.addToCartCount / group.uniqueUsers
          }))
        }
      });
    }
  }
});
```

## Event Filtering and Transformation

Advanced filtering and transformation of events:

```typescript
import { EventServiceClient } from '@example/event-service-client';
import { EventTransformer, JSONPath } from '@example/event-processing-utils';

// Initialize the client
const client = new EventServiceClient({
  baseUrl: 'https://api.example.com/event-service',
  apiKey: 'your-api-key'
});

// Create a transformer for order events
const orderTransformer = new EventTransformer();

// Define a transformation for order.created events
orderTransformer.addTransformation({
  sourceEventType: 'order.created',
  targetEventType: 'finance.revenue.recorded',
  condition: 'payload.orderTotal > 100', // Only transform orders over $100
  transform: (event) => ({
    type: 'finance.revenue.recorded',
    source: 'order-transformer',
    data: {
      transactionId: event.payload.orderId,
      amount: event.payload.orderTotal,
      currency: event.payload.currency || 'USD',
      timestamp: event.timestamp,
      customer: {
        id: event.payload.customer.id,
        segment: event.payload.customer.segment || 'standard'
      },
      products: event.payload.items.map(item => ({
        id: item.productId,
        revenue: item.price * item.quantity,
        quantity: item.quantity
      }))
    },
    metadata: {
      correlationId: event.metadata.correlationId
    }
  })
});

// Add another transformation for refunded orders
orderTransformer.addTransformation({
  sourceEventType: 'order.refunded',
  targetEventType: 'finance.revenue.reversed',
  transform: (event) => ({
    type: 'finance.revenue.reversed',
    source: 'order-transformer',
    data: {
      transactionId: event.payload.orderId,
      originalTransactionId: event.payload.originalOrderId,
      amount: event.payload.refundAmount,
      currency: event.payload.currency || 'USD',
      timestamp: event.timestamp,
      reason: event.payload.refundReason,
      customer: {
        id: event.payload.customer.id
      }
    },
    metadata: {
      correlationId: event.metadata.correlationId
    }
  })
});

// Subscribe to order events and apply transformations
await client.subscribe('order.created', {
  name: 'order-transformer',
  callback: async (event) => {
    const transformedEvents = orderTransformer.transform(event);
    
    // Publish each transformed event
    for (const transformedEvent of transformedEvents) {
      await client.publishEvent(transformedEvent);
    }
  }
});

await client.subscribe('order.refunded', {
  name: 'order-transformer',
  callback: async (event) => {
    const transformedEvents = orderTransformer.transform(event);
    
    // Publish each transformed event
    for (const transformedEvent of transformedEvents) {
      await client.publishEvent(transformedEvent);
    }
  }
});
```

## Next Steps

Continue to [Workflow Trigger Examples](./02-workflow-trigger-examples.md) to learn how to integrate the Event Processing Service with workflow orchestration systems. 