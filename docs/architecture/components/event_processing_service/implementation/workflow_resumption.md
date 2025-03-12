# Workflow Resumption Support

## Overview

The Workflow Resumption Support component provides specialized capabilities for paused workflow resumption within the Event Processing Service. It enables workflows to wait for specific events, efficiently routes events to waiting workflows, and manages subscription lifecycles.

## Key Responsibilities

* Maintaining long-lived subscriptions for paused workflows
* Supporting complex filtering conditions for event matching
* Efficiently routing events to waiting workflows
* Guaranteeing exactly-once delivery for workflow resumption events
* Providing deadline management for event wait timeouts
* Managing subscription cleanup for completed workflows

## Implementation

### Workflow Event Subscription

The component allows workflows to register waiting for specific events:

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
  private patternIndex: PatternIndex = new PatternIndex();
  
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
  async processEvent(event: Event): Promise<ProcessingResult> {
    const result: ProcessingResult = {
      eventId: event.id,
      matchedWorkflows: []
    };
    
    // Find subscriptions matching this event pattern
    const matchingSubscriptions = this.findMatchingSubscriptions(event);
    if (matchingSubscriptions.length === 0) {
      return result;
    }
    
    // Apply filters and resume workflows
    for (const subscription of matchingSubscriptions) {
      // Check if the filter condition matches
      if (subscription.filterCondition && 
          !this.evaluateFilterCondition(event, subscription.filterCondition)) {
        continue;
      }
      
      // Resume the workflow
      try {
        await this.workflowService.resumeWorkflow(
          subscription.workflowInstanceId,
          event
        );
        
        // Record successful match
        result.matchedWorkflows.push({
          workflowInstanceId: subscription.workflowInstanceId,
          subscriptionId: subscription.id
        });
        
        // Remove the subscription
        await this.removeSubscription(subscription.id);
      } catch (error) {
        console.error(
          `Failed to resume workflow ${subscription.workflowInstanceId}:`,
          error
        );
      }
    }
    
    return result;
  }
  
  /**
   * Handle a subscription timeout
   */
  async handleSubscriptionTimeout(subscriptionId: string): Promise<void> {
    // Find the subscription
    const subscription = await this.getSubscription(subscriptionId);
    if (!subscription) {
      return;
    }
    
    // Notify workflow about timeout
    await this.workflowService.handleWaitTimeout(
      subscription.workflowInstanceId,
      subscriptionId
    );
    
    // Remove the subscription
    await this.removeSubscription(subscriptionId);
  }
  
  /**
   * Find subscriptions matching an event
   */
  private findMatchingSubscriptions(
    event: Event
  ): WorkflowEventSubscription[] {
    // Find all subscriptions for this exact pattern
    const exactMatches = this.subscriptions.get(event.pattern) || [];
    
    // Find wildcard pattern matches
    const wildcardMatches = this.findWildcardMatches(event.pattern);
    
    // Combine all matching subscriptions
    return [...exactMatches, ...wildcardMatches];
  }
  
  /**
   * Evaluate whether an event matches a filter condition
   */
  private evaluateFilterCondition(
    event: Event,
    filterCondition: string
  ): boolean {
    try {
      // Use expression evaluator to check condition
      const evaluator = new ExpressionEvaluator();
      return evaluator.evaluate(filterCondition, { event });
    } catch (error) {
      console.error(`Filter evaluation error: ${error.message}`);
      return false;
    }
  }
}
```

### Subscription Persistence

The component persists workflow event subscriptions for durability:

```typescript
/**
 * Persist a workflow event subscription to the database
 */
async function persistSubscription(
  subscription: WorkflowEventSubscription
): Promise<string> {
  const id = generateUuid();
  
  // Insert into database
  await database.query(`
    INSERT INTO workflow_event_subscriptions (
      id,
      workflow_instance_id,
      event_pattern,
      filter_condition,
      timeout_at,
      created_at
    ) VALUES (
      $1, $2, $3, $4, $5, $6
    )
  `, [
    id,
    subscription.workflowInstanceId,
    subscription.eventPattern,
    subscription.filterCondition || null,
    subscription.timeoutAt ? new Date(subscription.timeoutAt) : null,
    new Date()
  ]);
  
  return id;
}

/**
 * Load all active workflow event subscriptions from the database
 */
async function loadAllSubscriptions(): Promise<WorkflowEventSubscription[]> {
  const result = await database.query(`
    SELECT
      id,
      workflow_instance_id,
      event_pattern,
      filter_condition,
      timeout_at
    FROM workflow_event_subscriptions
    WHERE
      timeout_at IS NULL OR timeout_at > NOW()
  `);
  
  return result.rows.map(row => ({
    id: row.id,
    workflowInstanceId: row.workflow_instance_id,
    eventPattern: row.event_pattern,
    filterCondition: row.filter_condition,
    timeoutAt: row.timeout_at ? row.timeout_at.toISOString() : undefined
  }));
}
```

## Database Schema

**Table: workflow_event_subscriptions**

| Field | Type | Description |
|----|----|----|
| id | UUID | Primary key |
| workflow_instance_id | UUID | Foreign key to workflow_instances |
| event_pattern | VARCHAR(255) | Event pattern to match |
| filter_condition | TEXT | Optional JSONPath or expression condition |
| timeout_at | TIMESTAMP | When the subscription expires |
| created_at | TIMESTAMP | When the subscription was created |
| status | VARCHAR(50) | Status (active, matched, timedout, cancelled) |

**Indexes:**

* `workflow_event_subs_event_pattern_idx` on `event_pattern` (for fast event matching)
* `workflow_event_subs_workflow_idx` on `workflow_instance_id` (for workflow lookups)
* `workflow_event_subs_timeout_idx` on `timeout_at` (for timeout processing)
* `workflow_event_subs_status_idx` on `status` (for filtering active subscriptions)

## Edge Cases and Error Handling

The Workflow Resumption Support handles several edge cases:


1. **Duplicate Events**: Ensures exactly-once delivery for workflow resumption
2. **Node Failures**: Recovers subscriptions from persistent storage
3. **Workflow Completion**: Cleans up subscriptions for completed or cancelled workflows
4. **Complex Filters**: Handles errors in filter evaluation gracefully
5. **Race Conditions**: Properly manages concurrent event matching and workflow resumption

## Performance Considerations

The component is optimized for efficient event processing:

* Uses indexed in-memory subscriptions for fast event matching
* Implements durable persistence for reliability
* Employs pattern caching for common event patterns
* Implements efficient filter evaluation
* Uses timeout scheduling to manage subscription lifecycles

## Related Documentation

* [Event Router](./event_router.md)
* [Trigger Registry](./trigger_registry.md)
* [Event Processor](./event_processor.md)


