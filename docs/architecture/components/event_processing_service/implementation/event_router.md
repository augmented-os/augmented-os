# Event Router

## Overview

The Event Router is responsible for determining the appropriate subscribers for each event and managing the distribution of events to those subscribers. It plays a central role in the event-driven architecture by implementing routing rules, pattern matching, and delivery guarantees.

## Key Responsibilities

* Determining subscribers for each event based on subscription patterns
* Implementing topic-based and content-based routing mechanisms
* Supporting pattern matching and filtering rules
* Handling fan-out to multiple subscribers
* Managing delivery guarantees (at-least-once, exactly-once)
* Monitoring subscriber health and implementing circuit breakers
* Managing subscription lifecycles

## Implementation

### Subscription Management

The Event Router maintains a registry of subscribers and their subscription patterns:

```typescript
/**
 * Subscription registry implementation
 */
class SubscriptionRegistry {
  private subscriptions: Map<string, Subscriber[]> = new Map();
  private patternIndex: PatternIndex = new PatternIndex();
  
  /**
   * Register a new subscriber for an event pattern
   */
  async addSubscription(pattern: string, subscriber: Subscriber): Promise<string> {
    // Generate subscription ID
    const subscriptionId = generateUuid();
    
    // Add to pattern index for matching
    this.patternIndex.addPattern(pattern, subscriptionId);
    
    // Store subscriber information
    if (!this.subscriptions.has(pattern)) {
      this.subscriptions.set(pattern, []);
    }
    
    const subscription = {
      id: subscriptionId,
      ...subscriber
    };
    
    this.subscriptions.get(pattern).push(subscription);
    
    // Persist to database for durability
    await this.persistSubscription(pattern, subscription);
    
    return subscriptionId;
  }
  
  /**
   * Remove a subscription
   */
  async removeSubscription(subscriptionId: string): Promise<boolean> {
    // Remove from database
    await this.deleteSubscription(subscriptionId);
    
    // Remove from in-memory storage
    let removed = false;
    this.subscriptions.forEach((subscribers, pattern) => {
      const index = subscribers.findIndex(s => s.id === subscriptionId);
      if (index !== -1) {
        subscribers.splice(index, 1);
        this.patternIndex.removePattern(pattern, subscriptionId);
        removed = true;
      }
    });
    
    return removed;
  }
  
  /**
   * Find subscribers for a given event pattern
   */
  async getSubscribersForPattern(pattern: string): Promise<Subscriber[]> {
    // Find matching patterns using the pattern index
    const matchingPatterns = this.patternIndex.findMatchingPatterns(pattern);
    
    // Collect all subscribers
    const subscribers: Subscriber[] = [];
    for (const matchingPattern of matchingPatterns) {
      const patternSubscribers = this.subscriptions.get(matchingPattern) || [];
      subscribers.push(...patternSubscribers);
    }
    
    return subscribers;
  }
  
  /**
   * Load subscriptions from database at startup
   */
  async loadSubscriptions(): Promise<void> {
    const savedSubscriptions = await this.fetchSubscriptionsFromDatabase();
    
    for (const sub of savedSubscriptions) {
      if (!this.subscriptions.has(sub.pattern)) {
        this.subscriptions.set(sub.pattern, []);
      }
      
      this.subscriptions.get(sub.pattern).push(sub.subscriber);
      this.patternIndex.addPattern(sub.pattern, sub.subscriber.id);
    }
  }
}
```

### Pattern Matching

The Event Router uses pattern matching to determine which subscribers should receive an event:

```typescript
/**
 * Pattern index for efficient event routing
 */
class PatternIndex {
  private exactPatterns: Map<string, Set<string>> = new Map();
  private wildcardPatterns: Map<string, Set<string>> = new Map();
  
  /**
   * Add a pattern to the index
   */
  addPattern(pattern: string, subscriptionId: string): void {
    if (pattern.includes('*')) {
      // Handle wildcard patterns
      const prefix = pattern.split('*')[0];
      if (!this.wildcardPatterns.has(prefix)) {
        this.wildcardPatterns.set(prefix, new Set());
      }
      
      this.wildcardPatterns.get(prefix).add(subscriptionId);
    } else {
      // Handle exact patterns
      if (!this.exactPatterns.has(pattern)) {
        this.exactPatterns.set(pattern, new Set());
      }
      
      this.exactPatterns.get(pattern).add(subscriptionId);
    }
  }
  
  /**
   * Remove a pattern from the index
   */
  removePattern(pattern: string, subscriptionId: string): void {
    if (pattern.includes('*')) {
      // Handle wildcard patterns
      const prefix = pattern.split('*')[0];
      if (this.wildcardPatterns.has(prefix)) {
        this.wildcardPatterns.get(prefix).delete(subscriptionId);
        
        if (this.wildcardPatterns.get(prefix).size === 0) {
          this.wildcardPatterns.delete(prefix);
        }
      }
    } else {
      // Handle exact patterns
      if (this.exactPatterns.has(pattern)) {
        this.exactPatterns.get(pattern).delete(subscriptionId);
        
        if (this.exactPatterns.get(pattern).size === 0) {
          this.exactPatterns.delete(pattern);
        }
      }
    }
  }
  
  /**
   * Find patterns that match a given event pattern
   */
  findMatchingPatterns(eventPattern: string): string[] {
    const matches: string[] = [];
    
    // Check exact matches
    if (this.exactPatterns.has(eventPattern)) {
      matches.push(eventPattern);
    }
    
    // Check wildcard matches
    for (const [prefix, subscriptions] of this.wildcardPatterns.entries()) {
      if (eventPattern.startsWith(prefix)) {
        matches.push(prefix + '*');
      }
    }
    
    return matches;
  }
}
```

### Event Routing

The Event Router delivers events to subscribers with appropriate delivery guarantees:

```typescript
/**
 * Routes events to appropriate subscribers
 */
class EventRouter {
  private subscriptionRegistry: SubscriptionRegistry;
  private deliveryManager: DeliveryManager;
  
  /**
   * Route an event to all matching subscribers
   */
  async routeEvent(event: Event): Promise<RoutingResult> {
    // Find subscribers for this event pattern
    const subscribers = await this.subscriptionRegistry.getSubscribersForPattern(event.pattern);
    
    // Apply content-based filtering if needed
    const filteredSubscribers = subscribers.filter(sub => {
      return this.evaluateContentFilter(event, sub.filter);
    });
    
    if (filteredSubscribers.length === 0) {
      return {
        eventId: event.id,
        subscriberCount: 0,
        deliveries: []
      };
    }
    
    // Deliver to each subscriber
    const deliveryPromises = filteredSubscribers.map(subscriber => {
      return this.deliveryManager.deliverToSubscriber(event, subscriber);
    });
    
    // Wait for deliveries to complete
    const deliveryResults = await Promise.all(deliveryPromises);
    
    return {
      eventId: event.id,
      subscriberCount: filteredSubscribers.length,
      deliveries: deliveryResults
    };
  }
  
  /**
   * Evaluate content-based filters
   */
  private evaluateContentFilter(event: Event, filter?: string): boolean {
    if (!filter) {
      return true;
    }
    
    try {
      // Use a JSON path or expression evaluator to process filter
      const filterEvaluator = new FilterEvaluator();
      return filterEvaluator.evaluate(filter, event);
    } catch (error) {
      console.error(`Filter evaluation error: ${error.message}`);
      // Default to true on error to avoid dropping events
      return true;
    }
  }
}
```

## Edge Cases and Error Handling

The Event Router handles several edge cases:


1. **Subscriber Failures**: Implements circuit breakers to temporarily disable failing subscribers
2. **Pattern Conflicts**: Resolves overlapping subscription patterns with priority rules
3. **Recursive Events**: Detects and prevents infinite routing loops
4. **Filter Errors**: Handles errors in content-based filters gracefully
5. **Late Subscriptions**: Supports replay of recent events for new subscribers

## Performance Considerations

The Event Router is optimized for efficient event distribution:

* Uses indexed pattern matching for O(1) subscription lookups
* Implements batching for high-volume event scenarios
* Employs concurrent delivery for multiple subscribers
* Caches frequently used subscription patterns
* Monitors and adapts to subscriber performance

## Related Documentation

* [Event Receiver](./event_receiver.md)
* [Event Store](./event_store.md)
* [Internal Event Queue](./internal_queue.md)


