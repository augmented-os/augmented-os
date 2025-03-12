# Event Processing Service Internal Interfaces

## Overview

The Event Processing Service exposes several internal interfaces for communication between its components and with other system services. These interfaces are not intended for direct use by external clients but are documented here for system integrators and developers working on the platform.

## Internal Component Interfaces

### Event Receiver to Event Router

The Event Receiver passes validated events to the Event Router for distribution:

```typescript
interface EventRouterInterface {
  /**
   * Route an event to all matching subscribers
   */
  routeEvent(event: Event): Promise<RoutingResult>;
  
  /**
   * Route an event to a specific subscriber
   */
  routeEventToSubscriber(event: Event, subscriberId: string): Promise<DeliveryResult>;
}
```

### Event Router to Event Store

The Event Router persists events to the Event Store:

```typescript
interface EventStoreInterface {
  /**
   * Save an event to the store
   */
  saveEvent(event: Event): Promise<void>;
  
  /**
   * Check if an event already exists (for deduplication)
   */
  eventExists(eventId: string): Promise<boolean>;
}
```

### Event Processor to Event Router

The Event Processor publishes transformed events back to the Event Router:

```typescript
interface EventProcessorInterface {
  /**
   * Process an event according to transformation rules
   */
  processEvent(event: Event): Promise<Event[]>;
  
  /**
   * Apply a specific transformation to an event
   */
  applyTransformation(event: Event, transformationId: string): Promise<Event>;
}
```

### Workflow Trigger Registry to Workflow Service

The Workflow Trigger Registry interacts with the Workflow Service to start or cancel workflows:

```typescript
interface WorkflowServiceInterface {
  /**
   * Start a new workflow instance
   */
  startWorkflow(
    workflowDefinitionId: string,
    input: Record<string, any>,
    options: {
      triggerEventId: string;
      correlationKey?: string;
    }
  ): Promise<WorkflowInstance>;
  
  /**
   * Cancel workflow instances by correlation key
   */
  cancelWorkflowsByCorrelation(
    workflowDefinitionId: string,
    correlationKey: string
  ): Promise<WorkflowInstance[]>;
}
```

## Service-to-Service Interfaces

### Event Publishing Interface

Other services publish events to the Event Processing Service:

```typescript
interface EventPublishingInterface {
  /**
   * Publish an event to the event processing system
   */
  publishEvent(
    pattern: string,
    payload: any,
    metadata?: EventMetadata
  ): Promise<string>;
  
  /**
   * Publish multiple events in a batch
   */
  publishEvents(events: EventBatch): Promise<string[]>;
}
```

### Event Subscription Interface

Services subscribe to events from the Event Processing Service:

```typescript
interface EventSubscriptionInterface {
  /**
   * Register a subscription for events
   */
  subscribe(
    pattern: string,
    subscriber: SubscriberInfo,
    options?: SubscriptionOptions
  ): Promise<string>;
  
  /**
   * Unsubscribe from events
   */
  unsubscribe(subscriptionId: string): Promise<boolean>;
}
```

### Event Definition Management Interface

Services manage event definitions through this interface:

```typescript
interface EventDefinitionInterface {
  /**
   * Register a new event definition
   */
  registerEventDefinition(definition: EventDefinition): Promise<string>;
  
  /**
   * Update an existing event definition
   */
  updateEventDefinition(
    eventId: string,
    definition: EventDefinition
  ): Promise<void>;
  
  /**
   * Get an event definition by ID or pattern
   */
  getEventDefinition(idOrPattern: string): Promise<EventDefinition>;
  
  /**
   * List all event definitions with optional filtering
   */
  listEventDefinitions(
    filter?: EventDefinitionFilter
  ): Promise<EventDefinition[]>;
}
```

## Message Formats

### Event Message Format

Events are passed between components in this format:

```typescript
interface Event {
  id: string;                // UUID for this specific event instance
  pattern: string;           // Event pattern (e.g., "invoice.created")
  version: string;           // Schema version this instance conforms to
  source: {                  // Origin of the event
    type: string;            // "workflow" | "task" | "integration" | "external"
    id: string;              // Identifier of the source
    name: string;            // Human-readable source name
  };
  timestamp: string;         // ISO8601 timestamp with millisecond precision
  payload: any;              // Event-specific data following the schema
  metadata: {                // Additional context information
    correlationId?: string;  // For tracing related events
    causationId?: string;    // ID of event that directly caused this one
    traceId?: string;        // For distributed tracing
    userId?: string;         // User who triggered the event (if applicable)
    [key: string]: any;      // Additional metadata
  };
}
```

### Subscriber Message Format

Subscriber information is represented in this format:

```typescript
interface SubscriberInfo {
  id: string;                // Unique identifier for the subscriber
  type: string;              // "service" | "webhook" | "queue"
  endpoint: string;          // URL or queue name for delivery
  headers?: Record<string, string>; // Custom headers for HTTP delivery
  authentication?: {         // Authentication details
    type: string;            // "basic" | "bearer" | "api-key"
    credentials: any;        // Authentication credentials
  };
}
```

## Communication Patterns

### Synchronous Communication

The Event Processing Service uses synchronous HTTP-based communication for:

* Event definition management
* Subscription management
* Workflow trigger configuration
* Direct event publishing (with immediate validation)

### Asynchronous Communication

The service uses asynchronous communication for:

* Event delivery to subscribers
* Internal event processing
* Workflow triggering
* High-volume event ingestion

## Retry and Failure Handling

### Retry Policies

The Event Processing Service implements these retry policies for internal and external communication:

```typescript
interface RetryPolicy {
  maxAttempts: number;       // Maximum number of retry attempts
  backoffFactor: number;     // Exponential backoff multiplier
  initialDelayMs: number;    // Initial delay before first retry
  maxDelayMs: number;        // Maximum delay between retries
  retryableErrors: string[]; // Error types that should trigger retries
}
```

Default retry policies:

* **Event Publishing**: 3 attempts, 2x backoff, 100ms initial delay
* **Event Delivery**: 5 attempts, 2x backoff, 1000ms initial delay
* **Workflow Triggering**: 3 attempts, 2x backoff, 500ms initial delay

### Circuit Breakers

The service implements circuit breakers for external dependencies:

```typescript
interface CircuitBreakerConfig {
  failureThreshold: number;  // Number of failures before opening circuit
  resetTimeoutMs: number;    // Time before attempting to close circuit
  halfOpenMaxCalls: number;  // Max calls in half-open state
}
```

## Monitoring and Observability

### Metrics

The service exposes these internal metrics:

* `events.received.count` - Total events received
* `events.published.count` - Total events published
* `events.delivery.success` - Successful event deliveries
* `events.delivery.failure` - Failed event deliveries
* `events.processing.time` - Event processing time
* `subscriptions.active.count` - Active subscription count
* `workflow.triggers.count` - Workflow trigger count

### Tracing

The service implements distributed tracing with these span attributes:

* `event.id` - Event identifier
* `event.pattern` - Event pattern
* `event.source.type` - Event source type
* `event.source.id` - Event source identifier
* `subscriber.id` - Subscriber identifier
* `workflow.definition.id` - Workflow definition identifier

## Related Documentation

* [Public API Reference](./api.md)
* [Event Receiver Implementation](../implementation/event_receiver.md)
* [Event Router Implementation](../implementation/event_router.md)
* [Workflow Trigger Registry](../implementation/trigger_registry.md)


