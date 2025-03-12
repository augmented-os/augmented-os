# Performance Optimization

This document demonstrates techniques for optimizing the performance of your event processing system.

## Batching and Throttling

Implementing advanced batching and throttling strategies:

```typescript
import { EventServiceClient } from '@example/event-service-client';
import { BatchProcessor, ThrottleManager } from '@example/event-processing-utils';

// Initialize the client
const client = new EventServiceClient({
  baseUrl: 'https://api.example.com/event-service',
  apiKey: 'your-api-key'
});

// Create a batch processor for events
const batchProcessor = new BatchProcessor({
  maxBatchSize: 100,
  flushIntervalMs: 5000,
  processBatch: async (events) => {
    console.log(`Processing batch of ${events.length} events`);
    
    // Group events by type for more efficient processing
    const eventsByType = events.reduce((acc, event) => {
      acc[event.type] = acc[event.type] || [];
      acc[event.type].push(event);
      return acc;
    }, {});
    
    // Process each type in parallel
    await Promise.all(
      Object.entries(eventsByType).map(async ([type, typeEvents]) => {
        console.log(`Processing ${typeEvents.length} events of type ${type}`);
        
        // Process events of the same type in batches
        await client.publishEvents({
          events: typeEvents
        });
      })
    );
  }
});

// Create a throttle manager for rate limiting
const throttleManager = new ThrottleManager({
  // Default limits
  defaultRateLimit: {
    maxRequests: 100,
    perTimeWindowMs: 1000
  },
  // Specific limits for different operations
  rateLimits: {
    'publish': {
      maxRequests: 200,
      perTimeWindowMs: 1000
    },
    'subscribe': {
      maxRequests: 50,
      perTimeWindowMs: 1000
    },
    'query': {
      maxRequests: 20,
      perTimeWindowMs: 1000
    }
  }
});

/**
 * Optimized event publisher that uses batching and throttling
 */
class OptimizedEventPublisher {
  /**
   * Queue a single event for publication
   */
  async queueEvent(event) {
    // Add event to batch
    await batchProcessor.add(event);
  }
  
  /**
   * Publish events immediately, respecting rate limits
   */
  async publishEventsNow(events) {
    // Apply throttling
    await throttleManager.acquireToken('publish', events.length);
    
    // Publish events
    await client.publishEvents({ events });
    
    console.log(`Published ${events.length} events immediately`);
  }
  
  /**
   * Query events with throttling
   */
  async queryEvents(query) {
    // Apply throttling for queries
    await throttleManager.acquireToken('query');
    
    // Execute query
    return client.queryEvents(query);
  }
  
  /**
   * Flush any batched events
   */
  async flush() {
    await batchProcessor.flush();
  }
}

// Example usage
async function run() {
  const publisher = new OptimizedEventPublisher();
  
  // Queue multiple events for batched publication
  for (let i = 0; i < 500; i++) {
    await publisher.queueEvent({
      id: `event-${i}`,
      type: `test.event.${i % 5}`, // 5 different event types
      source: 'performance-example',
      data: {
        index: i,
        timestamp: new Date().toISOString()
      }
    });
  }
  
  console.log('Queued 500 events for batched processing');
  
  // Publish some high-priority events immediately
  await publisher.publishEventsNow([
    {
      id: 'high-priority-1',
      type: 'priority.event',
      source: 'performance-example',
      data: {
        priority: 'high',
        timestamp: new Date().toISOString()
      }
    },
    {
      id: 'high-priority-2',
      type: 'priority.event',
      source: 'performance-example',
      data: {
        priority: 'high',
        timestamp: new Date().toISOString()
      }
    }
  ]);
  
  // Query events, respecting rate limits
  const events = await publisher.queryEvents({
    types: ['priority.event'],
    limit: 10
  });
  
  console.log(`Query returned ${events.length} events`);
  
  // Flush any remaining events
  await publisher.flush();
  console.log('Flushed remaining events');
}

run().catch(console.error);
```

## Efficient Event Filtering

Implementing efficient event filtering strategies:

```typescript
import { EventServiceClient } from '@example/event-service-client';
import { 
  EventFilterBuilder, 
  FilterOptimizer,
  BloomFilterIndex
} from '@example/event-processing-utils';

// Initialize the client
const client = new EventServiceClient({
  baseUrl: 'https://api.example.com/event-service',
  apiKey: 'your-api-key'
});

/**
 * Advanced event filtering service
 */
class AdvancedEventFilterService {
  private filterOptimizer = new FilterOptimizer();
  private bloomFilterIndex = new BloomFilterIndex({
    errorRate: 0.01, // 1% false positive rate
    capacity: 1000000 // Expected number of items
  });
  private knownEventIds = new Set();
  
  constructor() {
    // Pre-populate bloom filter with existing event IDs if available
    this.initBloomFilter();
  }
  
  /**
   * Initialize bloom filter with existing event IDs
   */
  private async initBloomFilter() {
    console.log('Initializing bloom filter index');
    
    // Get recent event IDs in batches
    let lastId = null;
    const batchSize = 1000;
    let totalIndexed = 0;
    
    while (true) {
      const events = await client.queryEvents({
        after: lastId,
        limit: batchSize
      });
      
      if (events.length === 0) break;
      
      // Add all event IDs to bloom filter
      for (const event of events) {
        this.bloomFilterIndex.add(event.id);
        this.knownEventIds.add(event.id); // Also add to exact set for recent events
        lastId = event.id;
      }
      
      totalIndexed += events.length;
      console.log(`Indexed ${totalIndexed} events in bloom filter`);
      
      if (events.length < batchSize) break;
    }
    
    console.log(`Finished initializing bloom filter with ${totalIndexed} events`);
  }
  
  /**
   * Check if an event ID exists, using bloom filter for efficiency
   */
  async doesEventExist(eventId) {
    // First check exact set for recent events
    if (this.knownEventIds.has(eventId)) {
      return true;
    }
    
    // Check bloom filter - if it returns false, the ID definitely doesn't exist
    if (!this.bloomFilterIndex.mightContain(eventId)) {
      return false;
    }
    
    // Bloom filter says it might exist, but could be a false positive
    // Check with exact lookup
    try {
      const event = await client.getEvent(eventId);
      return !!event;
    } catch (error) {
      // Event not found
      return false;
    }
  }
  
  /**
   * Create an optimized filter for querying events
   */
  createOptimizedFilter(filterSpec) {
    console.log('Creating optimized filter');
    
    const builder = new EventFilterBuilder();
    
    // Add various filter conditions
    if (filterSpec.types) {
      builder.withTypes(filterSpec.types);
    }
    
    if (filterSpec.sources) {
      builder.withSources(filterSpec.sources);
    }
    
    if (filterSpec.startTime) {
      builder.after(new Date(filterSpec.startTime));
    }
    
    if (filterSpec.endTime) {
      builder.before(new Date(filterSpec.endTime));
    }
    
    // Add data field filters
    if (filterSpec.dataFilters) {
      for (const [field, value] of Object.entries(filterSpec.dataFilters)) {
        if (Array.isArray(value)) {
          builder.withDataFieldIn(`data.${field}`, value);
        } else {
          builder.withDataField(`data.${field}`, value);
        }
      }
    }
    
    // Get the raw filter
    const rawFilter = builder.build();
    
    // Optimize the filter for performance
    const optimizedFilter = this.filterOptimizer.optimize(rawFilter);
    
    console.log('Original filter:', JSON.stringify(rawFilter));
    console.log('Optimized filter:', JSON.stringify(optimizedFilter));
    
    return optimizedFilter;
  }
  
  /**
   * Query events with an optimized filter
   */
  async queryWithOptimizedFilter(filterSpec, options = {}) {
    const { limit = 100, sort = 'desc' } = options;
    
    // Create optimized filter
    const optimizedFilter = this.createOptimizedFilter(filterSpec);
    
    // Use optimized filter for querying
    console.log(`Querying events with limit ${limit}, sort ${sort}`);
    const events = await client.queryEvents({
      filter: optimizedFilter,
      limit,
      sort
    });
    
    console.log(`Query returned ${events.length} events`);
    return events;
  }
  
  /**
   * Process new event - update indexes
   */
  processNewEvent(event) {
    // Add to bloom filter
    this.bloomFilterIndex.add(event.id);
    
    // Add to exact set for recent events
    this.knownEventIds.add(event.id);
    
    // Limit size of exact set
    if (this.knownEventIds.size > 10000) {
      // Remove oldest items (simplified - in a real implementation, would be more sophisticated)
      const iterator = this.knownEventIds.values();
      for (let i = 0; i < 1000; i++) {
        const next = iterator.next();
        if (next.done) break;
        this.knownEventIds.delete(next.value);
      }
    }
  }
}

// Example usage
async function run() {
  const filterService = new AdvancedEventFilterService();
  
  // Check if an event exists
  const exists = await filterService.doesEventExist('event-123');
  console.log(`Event exists: ${exists}`);
  
  // Query with complex, optimized filter
  const events = await filterService.queryWithOptimizedFilter({
    types: ['order.created', 'order.updated'],
    sources: ['order-service'],
    startTime: '2023-01-01T00:00:00Z',
    endTime: '2023-01-31T23:59:59Z',
    dataFilters: {
      'customerId': ['cust-123', 'cust-456'],
      'total': { $gt: 100 },
      'status': 'COMPLETED'
    }
  }, {
    limit: 50,
    sort: 'desc'
  });
  
  console.log(`Query returned ${events.length} events`);
  
  // Process new event to update indexes
  filterService.processNewEvent({
    id: 'new-event-123',
    type: 'test.event',
    source: 'filter-example',
    data: {
      timestamp: new Date().toISOString()
    }
  });
}

run().catch(console.error);
```

## Stream Processing

Implementing a stream processing pipeline:

```typescript
import { EventServiceClient } from '@example/event-service-client';
import { 
  StreamProcessor, 
  WindowedCounter, 
  AggregatorNode,
  FilterNode,
  TransformNode,
  JoinNode,
  SinkNode
} from '@example/stream-processing';

// Initialize the client
const client = new EventServiceClient({
  baseUrl: 'https://api.example.com/event-service',
  apiKey: 'your-api-key'
});

/**
 * Build and run a stream processing pipeline
 */
async function buildOrderAnalyticsPipeline() {
  console.log('Building order analytics pipeline');
  
  // Create stream processor
  const processor = new StreamProcessor({ name: 'order-analytics' });
  
  // Create source node - reads from event service
  const sourceNode = processor.addSource('event-source', {
    client,
    subscription: {
      types: ['order.created', 'order.updated', 'order.completed', 'payment.processed'],
      name: 'order-analytics-subscription'
    },
    parallelism: 3
  });
  
  // Filter node - separate orders from payments
  const filterNode = processor.addNode('event-filter', new FilterNode({
    filters: {
      'orders': event => event.type.startsWith('order.'),
      'payments': event => event.type === 'payment.processed'
    }
  }));
  
  // Connect source to filter
  sourceNode.connectTo(filterNode);
  
  // Transform orders into normalized format
  const orderTransformer = processor.addNode('order-transformer', new TransformNode({
    transform: (event) => {
      // Extract order information
      const { data } = event;
      
      return {
        orderId: data.orderId,
        customerId: data.customerId,
        amount: data.total,
        status: data.status,
        timestamp: event.timestamp,
        originalEvent: event
      };
    }
  }));
  
  // Connect orders to transformer
  filterNode.connectTo(orderTransformer, 'orders');
  
  // Transform payments into normalized format
  const paymentTransformer = processor.addNode('payment-transformer', new TransformNode({
    transform: (event) => {
      // Extract payment information
      const { data } = event;
      
      return {
        paymentId: data.id,
        orderId: data.orderId,
        amount: data.amount,
        status: data.status,
        timestamp: event.timestamp,
        originalEvent: event
      };
    }
  }));
  
  // Connect payments to transformer
  filterNode.connectTo(paymentTransformer, 'payments');
  
  // Join orders and payments
  const joinNode = processor.addNode('order-payment-join', new JoinNode({
    leftKey: order => order.orderId,
    rightKey: payment => payment.orderId,
    joinWindow: '1 hour',
    outputComplete: true,
    join: (order, payment) => ({
      orderId: order.orderId,
      customerId: order.customerId,
      orderAmount: order.amount,
      paymentAmount: payment.amount,
      orderStatus: order.status,
      paymentStatus: payment.status,
      orderTimestamp: order.timestamp,
      paymentTimestamp: payment.timestamp,
      timeDifference: new Date(payment.timestamp) - new Date(order.timestamp)
    })
  }));
  
  // Connect transformers to join
  orderTransformer.connectTo(joinNode, 'left');
  paymentTransformer.connectTo(joinNode, 'right');
  
  // Add a windowed counter for order metrics
  const orderCounter = processor.addNode('order-metrics', new AggregatorNode({
    windows: [
      { type: 'tumbling', duration: '1 minute' },
      { type: 'tumbling', duration: '1 hour' },
      { type: 'tumbling', duration: '1 day' }
    ],
    keys: [
      event => 'all',
      event => event.orderStatus,
      event => event.customerId
    ],
    aggregator: new WindowedCounter()
  }));
  
  // Connect order transformer to counter
  orderTransformer.connectTo(orderCounter);
  
  // Add sink for joined data
  const joinedDataSink = processor.addNode('joined-data-sink', new SinkNode({
    processBatch: async (records) => {
      console.log(`Processing ${records.length} joined order-payment records`);
      
      // Write to database, data warehouse, etc.
      await client.publishEvents({
        events: records.map(record => ({
          type: 'analytics.order.payment.joined',
          source: 'order-analytics-pipeline',
          data: record
        }))
      });
    },
    batchSize: 100,
    maxBatchIntervalMs: 30000
  }));
  
  // Connect join to sink
  joinNode.connectTo(joinedDataSink);
  
  // Add sink for metrics
  const metricsSink = processor.addNode('metrics-sink', new SinkNode({
    processBatch: async (metrics) => {
      console.log(`Processing ${metrics.length} order metrics`);
      
      // Write metrics to monitoring system
      await client.publishEvents({
        events: metrics.map(metric => ({
          type: 'analytics.order.metrics',
          source: 'order-analytics-pipeline',
          data: metric
        }))
      });
    },
    batchSize: 50,
    maxBatchIntervalMs: 15000
  }));
  
  // Connect metrics to sink
  orderCounter.connectTo(metricsSink);
  
  // Start the pipeline
  console.log('Starting order analytics pipeline');
  await processor.start();
  
  return processor;
}

// Run the pipeline
async function run() {
  const pipeline = await buildOrderAnalyticsPipeline();
  
  // Register shutdown handler
  process.on('SIGINT', async () => {
    console.log('Shutting down pipeline');
    await pipeline.stop();
    process.exit(0);
  });
  
  console.log('Pipeline running. Press Ctrl+C to stop.');
}

run().catch(console.error);
```

## Next Steps

Continue to [Security and Compliance](./06-security-compliance.md) to learn about securing your event processing system and ensuring compliance with regulations. 