# Event Processor

## Overview

The Event Processor is responsible for transforming, enriching, and processing events within the Event Processing Service. It implements complex event processing patterns, filters, transformations, and aggregations to provide advanced event processing capabilities.

## Key Responsibilities

* Applying filters to event streams
* Transforming events between formats
* Enriching events with additional context
* Implementing complex event processing patterns
* Supporting windowing and aggregation operations
* Correlating related events
* Detecting patterns across event sequences

## Implementation

### Event Transformation

The Event Processor provides capabilities for transforming events:

```typescript
/**
 * Event transformation interface
 */
class EventTransformer {
  /**
   * Transform an event using a transformation rule
   */
  async transformEvent(
    event: Event,
    transformation: TransformationRule
  ): Promise<Event> {
    // Create a new event based on the original
    const transformedEvent: Event = {
      id: generateUuid(),
      pattern: transformation.targetPattern || event.pattern,
      version: transformation.targetVersion || event.version,
      timestamp: new Date().toISOString(),
      source: {
        type: 'transformer',
        id: transformation.id,
        name: transformation.name,
        originalSource: event.source
      },
      payload: this.transformPayload(event.payload, transformation),
      metadata: {
        ...event.metadata,
        transformation: {
          id: transformation.id,
          sourceEventId: event.id,
          appliedAt: new Date().toISOString()
        }
      }
    };
    
    return transformedEvent;
  }
  
  /**
   * Transform payload based on transformation definition
   */
  private transformPayload(
    payload: any,
    transformation: TransformationRule
  ): any {
    if (transformation.type === 'jq') {
      // Apply jq-style transformation
      return this.applyJqTransformation(payload, transformation.expression);
    } else if (transformation.type === 'mapping') {
      // Apply field mapping
      return this.applyFieldMapping(payload, transformation.fieldMap);
    } else if (transformation.type === 'template') {
      // Apply template-based transformation
      return this.applyTemplate(payload, transformation.template);
    } else {
      // Default: return original payload
      return payload;
    }
  }
  
  // Implementation of specific transformation methods...
}
```

### Event Filtering

The Event Processor supports filtering events based on conditions:

```typescript
/**
 * Event filtering implementation
 */
class EventFilter {
  /**
   * Check if an event matches a filter condition
   */
  matchesFilter(event: Event, filter: FilterCondition): boolean {
    if (!filter) {
      return true;
    }
    
    try {
      // Apply filter based on type
      if (filter.type === 'jsonpath') {
        return this.evaluateJsonPath(event, filter.expression);
      } else if (filter.type === 'regex') {
        return this.evaluateRegex(event, filter.pattern, filter.field);
      } else if (filter.type === 'comparison') {
        return this.evaluateComparison(event, filter.field, filter.operator, filter.value);
      } else if (filter.type === 'compound') {
        return this.evaluateCompound(event, filter.conditions, filter.operator);
      }
      
      // Unknown filter type
      console.warn(`Unknown filter type: ${filter.type}`);
      return true;
    } catch (error) {
      console.error(`Error evaluating filter: ${error.message}`);
      // Default to true in case of evaluation errors
      return true;
    }
  }
  
  /**
   * Evaluate a JSONPath expression against an event
   */
  private evaluateJsonPath(
    event: Event,
    expression: string
  ): boolean {
    // Use a JSONPath library to evaluate the expression
    const jsonPath = new JSONPath();
    const result = jsonPath.query(event, expression);
    return result.length > 0 && result[0] === true;
  }
  
  /**
   * Evaluate a regular expression against an event field
   */
  private evaluateRegex(
    event: Event,
    pattern: string,
    field: string
  ): boolean {
    // Extract the field value using dot notation
    const value = this.getFieldValue(event, field);
    if (value === undefined) {
      return false;
    }
    
    // Convert to string if needed
    const stringValue = String(value);
    
    // Evaluate regular expression
    const regex = new RegExp(pattern);
    return regex.test(stringValue);
  }
  
  // Implementation of other filter evaluation methods...
}
```

### Event Aggregation

The Event Processor supports aggregating events over time windows:

```typescript
/**
 * Window-based event aggregation
 */
class EventAggregator {
  private windows: Map<string, AggregationWindow> = new Map();
  
  /**
   * Process an event for aggregation
   */
  async processEvent(
    event: Event,
    aggregation: AggregationRule
  ): Promise<Event | null> {
    // Create or get the aggregation window
    const windowKey = this.getWindowKey(event, aggregation);
    let window = this.windows.get(windowKey);
    
    if (!window) {
      window = this.createWindow(windowKey, aggregation);
      this.windows.set(windowKey, window);
    }
    
    // Add event to the window
    window.events.push(event);
    
    // Update aggregate values
    this.updateAggregates(window, event, aggregation);
    
    // Check if window is complete
    if (this.isWindowComplete(window, aggregation)) {
      // Create aggregate event
      const aggregateEvent = this.createAggregateEvent(window, aggregation);
      
      // Close window
      this.windows.delete(windowKey);
      
      return aggregateEvent;
    }
    
    return null;
  }
  
  /**
   * Create an aggregation window
   */
  private createWindow(
    windowKey: string,
    aggregation: AggregationRule
  ): AggregationWindow {
    const now = new Date();
    let endTime: Date;
    
    // Calculate window end time based on type
    if (aggregation.windowType === 'tumbling') {
      endTime = new Date(now.getTime() + aggregation.windowSize);
    } else if (aggregation.windowType === 'sliding') {
      endTime = new Date(now.getTime() + aggregation.windowSize);
    } else {
      // Default to session window
      endTime = new Date(now.getTime() + aggregation.sessionTimeout);
    }
    
    return {
      key: windowKey,
      startTime: now,
      endTime,
      events: [],
      aggregates: this.initializeAggregates(aggregation),
      metadata: {}
    };
  }
  
  // Implementation of other aggregation methods...
}
```

### Pattern Detection

The Event Processor supports detecting patterns across event sequences:

```typescript
/**
 * Event pattern detection
 */
class PatternDetector {
  private activePatterns: Map<string, PatternState> = new Map();
  
  /**
   * Process an event for pattern detection
   */
  async detectPatterns(
    event: Event,
    patterns: PatternDefinition[]
  ): Promise<DetectionResult[]> {
    const results: DetectionResult[] = [];
    
    // Process each pattern
    for (const pattern of patterns) {
      // Check if event matches the pattern start
      if (this.matchesPatternStart(event, pattern)) {
        // Create new pattern state
        const patternId = generateUuid();
        const state: PatternState = {
          id: patternId,
          patternDefinition: pattern,
          events: [event],
          currentStage: 0,
          startTime: new Date(event.timestamp),
          lastEventTime: new Date(event.timestamp),
          metadata: {
            correlationId: event.metadata.correlationId
          }
        };
        
        this.activePatterns.set(patternId, state);
      }
      
      // Check if event matches next stage for any active pattern
      const matchedPatterns = this.findMatchingPatterns(event, pattern);
      
      for (const matchedPattern of matchedPatterns) {
        // Update pattern state
        matchedPattern.events.push(event);
        matchedPattern.currentStage++;
        matchedPattern.lastEventTime = new Date(event.timestamp);
        
        // Check if pattern is complete
        if (matchedPattern.currentStage >= pattern.stages.length - 1) {
          // Pattern complete - create result
          results.push({
            patternId: matchedPattern.id,
            patternName: pattern.name,
            detectedAt: new Date(),
            events: matchedPattern.events,
            metadata: matchedPattern.metadata
          });
          
          // Remove completed pattern
          this.activePatterns.delete(matchedPattern.id);
        }
      }
    }
    
    // Cleanup expired patterns
    this.cleanupExpiredPatterns();
    
    return results;
  }
  
  // Implementation of other pattern detection methods...
}
```

## Edge Cases and Error Handling

The Event Processor handles several edge cases:


1. **Invalid Transformations**: Validates transformation rules and handles errors gracefully
2. **Filter Evaluation Errors**: Implements fallback behavior for filter evaluation failures
3. **Window Management**: Properly handles window expiration and resource cleanup
4. **Pattern Timeouts**: Implements timeouts for pattern detection to avoid resource leaks
5. **Out-of-Order Events**: Supports handling events that arrive out of chronological order

## Performance Considerations

The Event Processor is optimized for efficient processing:

* Uses in-memory processing for low-latency operations
* Implements batch processing for high-volume scenarios
* Employs worker pool patterns for parallel processing
* Implements backpressure mechanisms to handle overload
* Uses caching for frequently accessed transformation rules

## Related Documentation

* [Event Router](./event_router.md)
* [Event Store](./event_store.md)
* [Internal Event Queue](./internal_queue.md)


