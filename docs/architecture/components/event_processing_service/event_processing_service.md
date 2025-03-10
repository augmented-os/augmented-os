# Event Processing Service

## Overview

The Event Processing Service is responsible for handling all events within the system. It acts as a central hub for event reception, routing, and delivery, enabling loose coupling between components and supporting event-driven architecture patterns.

## Responsibilities

* Receiving events from internal and external sources
* Managing event definitions for the entire system
* Validating events against defined schemas
* Routing events to appropriate subscribers
* Persisting events for audit and replay
* Supporting event filtering and transformation
* Enabling event-driven workflow triggers
* Providing event correlation and tracing
* Exposing event definitions for UI builders and integrations

## Architecture

The Event Processing Service is designed as a distributed system with multiple components working together to ensure reliable event processing. It uses a publish-subscribe model with persistent storage for durability.

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Event Sources  │────▶│  Event Service  │────▶│  Subscribers    │
│                 │     │                 │     │                 │
└─────────────────┘     └────────┬────────┘     └─────────────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │                 │
                        │  Event Store    │
                        │                 │
                        └─────────────────┘
```

## Event Definition Management

The Event Processing Service maintains a registry of event definitions that serves as the source of truth for all event types within the system. These definitions are critical for:



1. **UI Workflow Builder**: Providing available events that workflows can listen to
2. **Schema Validation**: Ensuring events conform to their defined structure
3. **Documentation**: Auto-generating API documentation for events
4. **Developer Experience**: Making event interfaces discoverable
5. **Integration**: Enabling external systems to understand event contracts

### Event Definition Registry

The service provides APIs to:

```typescript
// Register a new event definition
async function registerEventDefinition(definition: EventDefinition): Promise<string>;

// Update an existing event definition
async function updateEventDefinition(eventId: string, definition: EventDefinition): Promise<void>;

// Get an event definition by ID or pattern
async function getEventDefinition(idOrPattern: string): Promise<EventDefinition>;

// List all event definitions, with optional filtering
async function listEventDefinitions(filter?: EventDefinitionFilter): Promise<EventDefinition[]>;
```

Event definitions describe everything about an event type, including:

* Unique identifier and pattern (e.g., "bookings.created")
* Human-readable name and description
* Expected payload structure (as JSON Schema)
* Allowed sources (which components can emit this event)
* Version information
* Example payloads for documentation and testing
* UI metadata for display in workflow builders

When an event is received, the service validates it against its corresponding definition before processing, ensuring data integrity throughout the system.

### Database Implementation

The Event Definition Registry is backed by the `event_definitions` table in PostgreSQL, as defined in the [Events Schema](../schemas/events.md) documentation. Key aspects of this implementation include:

* **JSONB Storage**: Event payload schemas are stored as JSONB in the `payload_schema` column, allowing for flexible schema definitions while maintaining queryability
* **Multi-level Validation**:
  * Service-level validation using the JSON Schema stored in the `payload_schema` field
  * Database-level validation leveraging PostgreSQL's JSONB validation capabilities
* **Schema Enforcement**: When events are persisted to the `events` table, their payloads are validated against the corresponding schema from `event_definitions`
* **Performance Optimization**: Indexed fields support efficient lookup of event definitions by pattern or ID

The Event Processing Service's APIs directly interact with these database tables:

* `registerEventDefinition` → Inserts records into the `event_definitions` table
* `updateEventDefinition` → Updates existing records in `event_definitions`
* `getEventDefinition` → Queries the `event_definitions` table using the optimized indexes
* `listEventDefinitions` → Retrieves filtered sets of definitions from `event_definitions`

For complete details on the database schema, including field definitions, constraints, and JSON schemas, please refer to the [Events Schema](../schemas/events.md) documentation.

## Key Components

### Event Receiver

Responsible for:

* Accepting events from various sources
* Validating event structure and content
* Normalizing events to a standard format
* Assigning unique identifiers to events
* Timestamping and initial metadata enrichment

### Event Router

Manages event distribution by:

* Determining subscribers for each event
* Implementing routing rules and patterns
* Supporting topic-based and content-based routing
* Handling fan-out to multiple subscribers
* Managing delivery guarantees (at-least-once, exactly-once)

### Event Store

Provides persistence for:

* Long-term event storage for audit purposes
* Short-term storage for replay and recovery
* Event sequence tracking and ordering
* Event correlation and relationship tracking
* Historical event querying and analysis

### Event Processor

Handles event transformation and enrichment:

* Applying filters to event streams
* Transforming events between formats
* Enriching events with additional context
* Implementing complex event processing patterns
* Supporting windowing and aggregation operations

### Workflow Resumption Support #TODO - Huh?

Provides specialized capabilities for paused workflow resumption:

* Maintains long-lived subscriptions for paused workflows
* Supports complex filtering conditions for event matching
* Efficiently routes events to waiting workflows
* Guarantees exactly-once delivery for workflow resumption events
* Provides deadline management for event wait timeouts

```typescript
/**
 * Workflow event subscription configuration
 */
interface WorkflowEventSubscription {
  workflowInstanceId: string;
  eventPattern: string;
  filterCondition?: string;
  timeoutAt?: string;  // ISO timestamp
}

/**
 * Implementation pattern for workflow event subscription handling
 */
class WorkflowEventManager {
  private subscriptions: Map<string, WorkflowEventSubscription[]> = new Map();
  
  /**
   * Register a workflow waiting for a specific event
   */
  async registerWorkflowWait(
    workflowInstanceId: string,
    eventPattern: string,
    filterCondition?: string,
    timeoutMs?: number
  ): Promise<string> {
    // Create subscription record
    const subscription: WorkflowEventSubscription = {
      workflowInstanceId,
      eventPattern,
      filterCondition,
      timeoutAt: timeoutMs ? new Date(Date.now() + timeoutMs).toISOString() : undefined
    };
    
    // Store in memory for fast matching
    if (!this.subscriptions.has(eventPattern)) {
      this.subscriptions.set(eventPattern, []);
    }
    this.subscriptions.get(eventPattern).push(subscription);
    
    // Persist to database for durability
    const subscriptionId = await this.persistSubscription(subscription);
    
    // Set timeout if specified
    if (timeoutMs) {
      await this.schedulerService.scheduleTimeout(
        subscriptionId,
        timeoutMs,
        async () => {
          await this.handleSubscriptionTimeout(subscriptionId);
        }
      );
    }
    
    return subscriptionId;
  }
  
  /**
   * Process an incoming event and match against waiting workflows
   */
  async processEventForWorkflows(event: Event): Promise<void> {
    // Find subscriptions matching this event pattern
    const matchingSubscriptions = this.subscriptions.get(event.pattern) || [];
    
    // Evaluate each subscription's filter condition
    for (const subscription of matchingSubscriptions) {
      const matchesFilter = await this.evaluateFilter(
        subscription.filterCondition,
        event,
        subscription.workflowInstanceId
      );
      
      if (matchesFilter) {
        // Notify workflow orchestrator to resume the workflow
        await this.workflowService.resumeWorkflow(
          subscription.workflowInstanceId,
          event
        );
        
        // Remove subscription after successful match
        await this.removeSubscription(subscription);
      }
    }
  }
  
  /**
   * Evaluate a filter condition against an event
   */
  private async evaluateFilter(
    filterCondition: string,
    event: Event,
    workflowInstanceId: string
  ): Promise<boolean> {
    if (!filterCondition) {
      return true; // No filter means automatic match
    }
    
    // Load workflow context if needed for condition evaluation
    const workflowContext = await this.workflowService.getWorkflowContext(workflowInstanceId);
    
    // Evaluate condition in a sandbox with event and workflow context
    return this.conditionEvaluator.evaluate(
      filterCondition,
      { event, workflow: workflowContext }
    );
  }
}
```

The workflow resumption mechanism maintains high efficiency by:


1. Indexing subscriptions by event pattern for fast lookup
2. Using optimized condition evaluation for matching events to workflows
3. Persisting subscriptions to ensure durability across service restarts
4. Cleaning up subscriptions immediately upon successful matching
5. Implementing backoff strategies for workflows with high-volume event patterns

### Internal Event Queue

Manages event flow and system load:

* Buffers incoming events to prevent system overload during burst periods
* Provides configurable queue depth to handle varying system load
* Implements backpressure mechanisms to protect downstream components
* Supports priority-based event processing for critical events
* Ensures events are not lost during processing spikes
* Allows for horizontal scaling of event processing workers

The implementation uses an in-memory queue with database persistence for durability:

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
}
```

## Interfaces

### Input Interfaces

* **HTTP API**: Receives events via REST endpoints
* **Message Queue**: Consumes events from message brokers
* **Internal Bus**: Accepts events from system components
* **Webhooks**: Receives events from external systems

### Output Interfaces

* **Subscriber Notifications**: Delivers events to subscribers
* **Workflow Triggers**: Initiates workflows based on events
* **Event Store**: Persists events for future reference
* **Metrics and Monitoring**: Reports event processing statistics

## Data Model

The Event Processing Service primarily interacts with these data schemas:

* [Events Schema](../schemas/events.md): For event definitions and instances
* [Workflows Schema](../schemas/workflows.md): For workflow triggers

## Operational Considerations

### Scalability

The service scales horizontally by:

* Partitioning event streams by topic or source
* Distributing event processing across multiple nodes
* Using consistent hashing for routing decisions
* Implementing backpressure mechanisms for high load
* Supporting batch processing for efficiency

### Monitoring

Key metrics to monitor:

* Event throughput (events/second)
* Event processing latency
* Queue depths for pending events
* Error rates by event type and source
* Subscriber health and responsiveness

### Resilience

Failure handling strategies:

* Dead-letter queues for unprocessable events
* Automatic retry with exponential backoff
* Circuit breakers for failing subscribers
* Event replay capabilities for recovery
* Graceful degradation under load

## Configuration

The service can be configured with:

* Event retention policies
* Delivery guarantee levels
* Subscriber timeout settings
* Batch sizes and processing intervals
* Logging levels and destinations

## Security

Security considerations:

* Authentication for event publishers
* Authorization for event subscription
* Encryption for sensitive event data
* Input validation to prevent injection attacks
* Rate limiting to prevent DoS attacks

## Implementation Examples

The following proposed implementation patterns illustrate how the Event Processing Service might be coded once development begins. These are not actual implementations but rather design guidance for the development team.

### Proposed Pattern: Publishing an Event

```typescript
/**
 * Proposed implementation pattern for publishing events
 * This illustrates the recommended approach for components that need to emit events
 */
async function publishEvent(
  pattern: string,
  payload: any,
  metadata: EventMetadata = {}
): Promise<string> {
  // IMPLEMENTATION DECISION: Consider using a cached lookup for frequent event patterns
  // Get the event definition for this pattern from the event_definitions table
  const eventDefinition = await eventDefinitionRegistry.getDefinition(pattern);
  if (!eventDefinition) {
    throw new Error(`Unknown event pattern: ${pattern}`);
  }
  
  // Create event object conforming to the structure in events.md schema
  const event = {
    id: generateUuid(), // DECISION NEEDED: UUID generation strategy (v4, v5, etc.)
    pattern,
    version: eventDefinition.version,
    payload,
    metadata: {
      ...metadata,
      timestamp: new Date().toISOString(),
      source: metadata.source || 'system',
      correlationId: metadata.correlationId || generateUuid()
    }
  };
  
  // Validate event against definition's payload schema from the JSONB payload_schema field
  const validationResult = await eventValidator.validate(eventDefinition.payload_schema, event.payload);
  if (!validationResult.valid) {
    throw new Error(`Invalid event: ${JSON.stringify(validationResult.errors)}`);
  }
  
  // Persist event to the events table defined in events.md
  // ALTERNATIVE APPROACH: Consider using a message queue before database persistence for higher throughput
  await eventStore.saveEvent(event);
  
  // Route event to subscribers
  // OPEN QUESTION: Should routing happen synchronously or asynchronously?
  const subscribers = await subscriberRegistry.getSubscribersForPattern(pattern);
  for (const subscriber of subscribers) {
    await eventRouter.routeEventToSubscriber(event, subscriber);
    // ALTERNATIVE: For high-volume systems, consider batching notifications
    // or implementing a pull model instead of push
  }
  
  // Return event ID for reference
  return event.id;
}
```

### Proposed Pattern: Subscribing to Events

```typescript
/**
 * Proposed implementation pattern for subscribing to events
 * This illustrates how components like the Workflow Orchestrator would register for event notifications
 */
function subscribeToEvents(
  patterns: string[],
  handler: (event: Event) => Promise<void>,
  options: SubscriptionOptions = {}
): Subscription {
  // Create subscription object
  const subscription = {
    id: generateUuid(),
    subscriberId: options.subscriberId || generateUuid(),
    patterns,
    handler,
    options: {
      // IMPLEMENTATION DECISION: Default values will need refinement based on performance testing
      deliveryGuarantee: options.deliveryGuarantee || 'at-least-once',
      batchSize: options.batchSize || 1,
      retryPolicy: options.retryPolicy || defaultRetryPolicy,
      filter: options.filter
    }
  };
  
  // Verify all patterns exist in event definition registry
  // OPEN QUESTION: Should we allow wildcard patterns for subscription?
  for (const pattern of patterns) {
    if (!eventDefinitionRegistry.patternExists(pattern)) {
      throw new Error(`Cannot subscribe to undefined event pattern: ${pattern}`);
    }
  }
  
  // Register subscription in a subscribers table (schema to be defined)
  // ALTERNATIVE APPROACHES:
  // 1. Store subscriptions in memory for simpler implementation (sacrifices durability)
  // 2. Use a specialized pub/sub system instead of database storage
  // 3. Implement a webhook-based notification system for external subscribers
  subscriberRegistry.registerSubscription(subscription);
  
  // Return subscription control object
  return {
    id: subscription.id,
    unsubscribe: () => subscriberRegistry.removeSubscription(subscription.id),
    pause: () => subscriberRegistry.pauseSubscription(subscription.id),
    resume: () => subscriberRegistry.resumeSubscription(subscription.id)
  };
}
```

### Development Timeline Considerations

These implementation patterns should be prioritized as follows:


1. First iteration: Basic event publication and persistence
2. Second iteration: Subscription and notification mechanisms
3. Third iteration: Advanced features (filtering, transformation, etc.)

During implementation, the team should:


1. Define unit and integration test strategies for each component
2. Establish performance benchmarks, especially for high-volume event processing
3. Document any deviations from these patterns with justification


