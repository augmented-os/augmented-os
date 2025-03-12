# Workflow Event Trigger Registry

## Overview

The Workflow Event Trigger Registry manages the relationship between events and workflows. It maintains a registry of which workflows should be triggered by which events, decoupling the event subscription logic from workflow definitions.

## Key Responsibilities

* Maintaining a registry of workflow event triggers
* Supporting different trigger types (start, cancel)
* Evaluating event conditions for workflow triggering
* Mapping event data to workflow inputs
* Correlating related workflow instances
* Managing trigger priorities and enabling/disabling triggers
* Providing APIs for managing workflow triggers

## Implementation

### Workflow Event Trigger Model

The Workflow Event Trigger Registry uses the following data model:

```typescript
interface WorkflowEventTrigger {
  id: string;                          // Unique identifier for this trigger
  workflowDefinitionId: string;        // The workflow to trigger
  eventPattern: string;                // Event pattern to subscribe to
  triggerType: 'START' | 'CANCEL';     // Whether to start or cancel a workflow
  eventCondition?: string;             // Optional condition expression
  inputMapping?: Record<string, string>; // Maps event data to workflow input
  correlationKey?: string;             // For correlating related workflows
  enabled: boolean;                    // Whether this trigger is active
  priority?: number;                   // Processing priority (lower = higher priority)
  description?: string;                // Human-readable description
  createdAt: string;                   // ISO timestamp
  updatedAt: string;                   // ISO timestamp
}
```

### Trigger Management

The registry provides APIs for managing workflow event triggers:

```typescript
/**
 * Service for managing workflow event triggers
 */
class WorkflowEventTriggerService {
  private database: Database;
  
  /**
   * Create a new workflow event trigger
   */
  async createTrigger(
    trigger: Omit<WorkflowEventTrigger, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<WorkflowEventTrigger> {
    // Validate the workflow definition exists
    await this.validateWorkflowDefinition(trigger.workflowDefinitionId);
    
    // Validate event pattern
    await this.validateEventPattern(trigger.eventPattern);
    
    // Create new trigger
    const now = new Date().toISOString();
    const newTrigger: WorkflowEventTrigger = {
      ...trigger,
      id: generateUuid(),
      createdAt: now,
      updatedAt: now
    };
    
    // Persist to database
    await this.persistTrigger(newTrigger);
    
    return newTrigger;
  }
  
  /**
   * Update an existing workflow event trigger
   */
  async updateTrigger(
    triggerId: string,
    updates: Partial<WorkflowEventTrigger>
  ): Promise<WorkflowEventTrigger> {
    // Get existing trigger
    const existingTrigger = await this.getTrigger(triggerId);
    if (!existingTrigger) {
      throw new Error(`Trigger not found: ${triggerId}`);
    }
    
    // Update trigger properties
    const updatedTrigger: WorkflowEventTrigger = {
      ...existingTrigger,
      ...updates,
      id: existingTrigger.id, // Ensure ID doesn't change
      createdAt: existingTrigger.createdAt, // Preserve creation time
      updatedAt: new Date().toISOString() // Update modification time
    };
    
    // If workflow definition changed, validate it exists
    if (updates.workflowDefinitionId && 
        updates.workflowDefinitionId !== existingTrigger.workflowDefinitionId) {
      await this.validateWorkflowDefinition(updatedTrigger.workflowDefinitionId);
    }
    
    // If event pattern changed, validate it
    if (updates.eventPattern && 
        updates.eventPattern !== existingTrigger.eventPattern) {
      await this.validateEventPattern(updatedTrigger.eventPattern);
    }
    
    // Persist updates
    await this.updateTriggerInDatabase(updatedTrigger);
    
    return updatedTrigger;
  }
  
  /**
   * Delete a workflow event trigger
   */
  async deleteTrigger(triggerId: string): Promise<boolean> {
    // Delete from database
    return this.deleteTriggerFromDatabase(triggerId);
  }
  
  /**
   * Get a workflow event trigger by ID
   */
  async getTrigger(triggerId: string): Promise<WorkflowEventTrigger | null> {
    // Query from database
    const result = await this.database.query(`
      SELECT * FROM workflow_event_triggers
      WHERE id = $1
    `, [triggerId]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return this.mapRowToTrigger(result.rows[0]);
  }
  
  /**
   * Find workflow event triggers for an event pattern
   */
  async getTriggersForEventPattern(
    eventPattern: string
  ): Promise<WorkflowEventTrigger[]> {
    // Find exact and wildcard pattern matches
    const result = await this.database.query(`
      SELECT * FROM workflow_event_triggers
      WHERE enabled = TRUE
        AND (
          event_pattern = $1
          OR (
            event_pattern LIKE '%*'
            AND $1 LIKE REPLACE(event_pattern, '*', '%')
          )
        )
      ORDER BY priority ASC, created_at ASC
    `, [eventPattern]);
    
    return result.rows.map(this.mapRowToTrigger);
  }
  
  /**
   * List all workflow event triggers with pagination and filtering
   */
  async listTriggers(
    options: {
      workflowDefinitionId?: string;
      eventPattern?: string;
      triggerType?: 'START' | 'CANCEL';
      enabled?: boolean;
      limit?: number;
      offset?: number;
    } = {}
  ): Promise<WorkflowEventTrigger[]> {
    // Build query dynamically based on filters
    let query = `SELECT * FROM workflow_event_triggers WHERE 1=1`;
    const params = [];
    let paramIndex = 1;
    
    if (options.workflowDefinitionId) {
      query += ` AND workflow_definition_id = $${paramIndex}`;
      params.push(options.workflowDefinitionId);
      paramIndex++;
    }
    
    if (options.eventPattern) {
      query += ` AND event_pattern = $${paramIndex}`;
      params.push(options.eventPattern);
      paramIndex++;
    }
    
    if (options.triggerType) {
      query += ` AND trigger_type = $${paramIndex}`;
      params.push(options.triggerType);
      paramIndex++;
    }
    
    if (options.enabled !== undefined) {
      query += ` AND enabled = $${paramIndex}`;
      params.push(options.enabled);
      paramIndex++;
    }
    
    // Add ordering and pagination
    query += ` ORDER BY created_at DESC`;
    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(options.limit || 100, options.offset || 0);
    
    // Execute query
    const result = await this.database.query(query, params);
    
    return result.rows.map(this.mapRowToTrigger);
  }
}
```

### Event Processing and Workflow Triggering

The registry processes events and triggers workflows when conditions are met:

```typescript
/**
 * Service for processing events and triggering workflows
 */
class WorkflowEventTriggerProcessor {
  private triggerService: WorkflowEventTriggerService;
  private workflowService: WorkflowService;
  
  /**
   * Process an event and trigger matching workflows
   */
  async processEvent(event: Event): Promise<ProcessingResult> {
    // Get triggers that match this event pattern
    const triggers = await this.triggerService.getTriggersForEventPattern(event.pattern);
    
    if (triggers.length === 0) {
      return {
        eventId: event.id,
        triggeredWorkflows: []
      };
    }
    
    const result: ProcessingResult = {
      eventId: event.id,
      triggeredWorkflows: []
    };
    
    // Process each matching trigger
    for (const trigger of triggers) {
      try {
        // Check if event condition matches
        if (trigger.eventCondition && 
            !this.evaluateEventCondition(event, trigger.eventCondition)) {
          continue;
        }
        
        // Process based on trigger type
        if (trigger.triggerType === 'START') {
          // Start a new workflow instance
          const workflowInput = this.mapEventToWorkflowInput(event, trigger.inputMapping);
          
          const workflowInstance = await this.workflowService.startWorkflow(
            trigger.workflowDefinitionId,
            workflowInput,
            { 
              triggerEventId: event.id,
              correlationKey: this.resolveCorrelationKey(event, trigger)
            }
          );
          
          result.triggeredWorkflows.push({
            workflowInstanceId: workflowInstance.id,
            triggerId: trigger.id,
            triggerType: 'START'
          });
        } else if (trigger.triggerType === 'CANCEL') {
          // Find and cancel workflows
          const correlationKey = this.resolveCorrelationKey(event, trigger);
          
          if (correlationKey) {
            const cancelledInstances = await this.workflowService.cancelWorkflowsByCorrelation(
              trigger.workflowDefinitionId,
              correlationKey
            );
            
            for (const instance of cancelledInstances) {
              result.triggeredWorkflows.push({
                workflowInstanceId: instance.id,
                triggerId: trigger.id,
                triggerType: 'CANCEL'
              });
            }
          }
        }
      } catch (error) {
        console.error(`Error processing trigger ${trigger.id}:`, error);
        // Continue with next trigger
      }
    }
    
    return result;
  }
  
  /**
   * Evaluate if an event matches a trigger condition
   */
  private evaluateEventCondition(
    event: Event,
    condition: string
  ): boolean {
    try {
      // Use expression evaluator to check condition
      const evaluator = new ExpressionEvaluator();
      return evaluator.evaluate(condition, { event });
    } catch (error) {
      console.error(`Event condition evaluation error: ${error.message}`);
      return false;
    }
  }
  
  /**
   * Map event data to workflow input based on mapping configuration
   */
  private mapEventToWorkflowInput(
    event: Event,
    mapping?: Record<string, string>
  ): Record<string, any> {
    if (!mapping) {
      // Default to passing the entire event payload
      return {
        eventId: event.id,
        eventPattern: event.pattern,
        eventPayload: event.payload
      };
    }
    
    // Apply the mapping
    const workflowInput: Record<string, any> = {};
    
    for (const [targetField, sourcePath] of Object.entries(mapping)) {
      try {
        // Extract value using JSONPath
        const jsonPath = new JSONPath();
        const value = jsonPath.query(event, sourcePath);
        
        // Assign the extracted value or undefined if not found
        workflowInput[targetField] = value.length > 0 ? value[0] : undefined;
      } catch (error) {
        console.warn(`Failed to map field ${targetField} from path ${sourcePath}:`, error);
        workflowInput[targetField] = undefined;
      }
    }
    
    return workflowInput;
  }
  
  /**
   * Resolve correlation key for workflow correlation
   */
  private resolveCorrelationKey(
    event: Event,
    trigger: WorkflowEventTrigger
  ): string | undefined {
    if (!trigger.correlationKey) {
      // Default to event correlation ID
      return event.metadata?.correlationId;
    }
    
    // Extract correlation from event using JSONPath
    try {
      const jsonPath = new JSONPath();
      const value = jsonPath.query(event, trigger.correlationKey);
      return value.length > 0 ? String(value[0]) : undefined;
    } catch (error) {
      console.warn(`Failed to extract correlation key from ${trigger.correlationKey}:`, error);
      return undefined;
    }
  }
}
```

## Database Schema

The component uses the following database table:

**Table: workflow_event_triggers**

| Column | Type | Description |
|----|----|----|
| id | UUID | Primary key |
| workflow_definition_id | UUID | Foreign key to workflow_definitions |
| event_pattern | VARCHAR | Event pattern to subscribe to |
| trigger_type | VARCHAR | 'START' or 'CANCEL' |
| event_condition | TEXT | Optional condition expression |
| input_mapping | JSONB | Maps event data to workflow input |
| correlation_key | VARCHAR | For correlating related workflows |
| enabled | BOOLEAN | Whether this trigger is active |
| priority | INTEGER | Processing priority |
| description | TEXT | Human-readable description |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last updated timestamp |

**Indexes:**

```sql
-- Key indexes for workflow_event_triggers table
CREATE UNIQUE INDEX workflow_event_triggers_pkey ON workflow_event_triggers(id);
CREATE INDEX workflow_event_triggers_event_pattern_idx ON workflow_event_triggers(event_pattern);
CREATE INDEX workflow_event_triggers_workflow_idx ON workflow_event_triggers(workflow_definition_id);
CREATE INDEX workflow_event_triggers_enabled_idx ON workflow_event_triggers(enabled, event_pattern);
```

## Edge Cases and Error Handling

The Workflow Event Trigger Registry handles several edge cases:


1. **Invalid Workflow References**: Validates workflow definition IDs before creating triggers
2. **Invalid Event Patterns**: Validates event patterns against event definition registry
3. **Condition Evaluation Errors**: Handles errors in event condition evaluation gracefully
4. **Input Mapping Errors**: Provides fallback values when mapping fields from events
5. **Trigger Prioritization**: Handles overlapping triggers with priority ordering
6. **Concurrent Modifications**: Implements optimistic concurrency control for updates

## Performance Considerations

The component is optimized for efficient event processing:

* Uses indexed lookups for trigger matching
* Caches frequently used triggers
* Implements efficient expression evaluation
* Uses pattern matching for wildcard subscriptions
* Prioritizes triggers to process most important ones first

## Related Documentation

* [Event Processor](./event_processor.md)
* [Workflow Resumption](./workflow_resumption.md)
* [Event Router](./event_router.md)


