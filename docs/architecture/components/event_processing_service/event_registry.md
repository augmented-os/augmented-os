# Workflow Event Trigger Registry

## Overview

The Workflow Event Trigger Registry is a separate component that manages the relationship between events and workflows. It maintains a registry of which workflows should be triggered by which events, decoupling the event subscription logic from workflow definitions.

## Key Concepts

### Separation of Concerns

The Workflow Event Trigger Registry follows a clear separation of concerns:


1. **Workflow Definitions** define *what* a workflow does and how it executes
2. **Event Trigger Registry** defines *when* workflows should be started
3. **Event Processing Service** handles the actual event delivery

This separation provides several benefits:

* Workflows can be triggered by multiple different events
* The same event can trigger multiple workflows
* Trigger conditions can be modified without changing workflow definitions
* Workflows can be tested independently of their trigger conditions

### Trigger Types

The registry supports two primary types of workflow event triggers:


1. **Workflow Start Triggers**: Events that initiate a new workflow instance
2. **Workflow Cancellation Triggers**: Events that cancel running workflow instances

## Data Model

### Workflow Event Trigger

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

### Database Schema

The Workflow Event Trigger Registry uses the following database table:

#### workflow_event_triggers

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

#### Indexes

```sql
-- Key indexes for workflow_event_triggers table
CREATE UNIQUE INDEX workflow_event_triggers_pkey ON workflow_event_triggers(id);
CREATE INDEX workflow_event_triggers_event_pattern_idx ON workflow_event_triggers(event_pattern);
CREATE INDEX workflow_event_triggers_workflow_idx ON workflow_event_triggers(workflow_definition_id);
CREATE INDEX workflow_event_triggers_enabled_idx ON workflow_event_triggers(enabled, event_pattern);
```

## API

The Workflow Event Trigger Registry exposes the following API:

```typescript
/**
 * Register a new workflow event trigger
 */
async function registerWorkflowTrigger(trigger: WorkflowEventTrigger): Promise<string>;

/**
 * Update an existing workflow event trigger
 */
async function updateWorkflowTrigger(triggerId: string, trigger: Partial<WorkflowEventTrigger>): Promise<void>;

/**
 * Delete a workflow event trigger
 */
async function deleteWorkflowTrigger(triggerId: string): Promise<void>;

/**
 * Get a workflow event trigger by ID
 */
async function getWorkflowTrigger(triggerId: string): Promise<WorkflowEventTrigger>;

/**
 * List workflow event triggers with optional filtering
 */
async function listWorkflowTriggers(filter?: WorkflowTriggerFilter): Promise<WorkflowEventTrigger[]>;

/**
 * Enable or disable a workflow event trigger
 */
async function setWorkflowTriggerEnabled(triggerId: string, enabled: boolean): Promise<void>;

/**
 * Find workflow triggers matching an event
 */
async function findMatchingTriggers(event: Event): Promise<WorkflowEventTrigger[]>;
```

## Integration with Event Processing Service

The Workflow Event Trigger Registry integrates with the Event Processing Service to receive events and trigger workflows:

```typescript
/**
 * Implementation pattern for workflow event trigger handling
 */
class WorkflowTriggerManager {
  constructor(
    private eventProcessingService: EventProcessingService,
    private workflowOrchestratorService: WorkflowOrchestratorService,
    private triggerRegistry: WorkflowTriggerRegistry
  ) {
    // Subscribe to all events
    this.eventProcessingService.subscribeToEvents(
      ['*'], // Wildcard pattern to receive all events
      this.handleEvent.bind(this)
    );
  }
  
  /**
   * Handle an incoming event and check for matching workflow triggers
   */
  private async handleEvent(event: Event): Promise<void> {
    // Find triggers matching this event pattern
    const matchingTriggers = await this.triggerRegistry.findMatchingTriggers(event);
    
    // Sort by priority
    matchingTriggers.sort((a, b) => (a.priority || 0) - (b.priority || 0));
    
    // Process each matching trigger
    for (const trigger of matchingTriggers) {
      if (!trigger.enabled) continue;
      
      // Evaluate condition if present
      if (trigger.eventCondition) {
        const matchesCondition = await this.evaluateCondition(
          trigger.eventCondition,
          event
        );
        
        if (!matchesCondition) continue;
      }
      
      // Process based on trigger type
      if (trigger.triggerType === 'START') {
        await this.startWorkflow(trigger, event);
      } else if (trigger.triggerType === 'CANCEL') {
        await this.cancelWorkflows(trigger, event);
      }
    }
  }
  
  /**
   * Start a new workflow instance based on a trigger
   */
  private async startWorkflow(
    trigger: WorkflowEventTrigger,
    event: Event
  ): Promise<string> {
    // Map event data to workflow input
    const workflowInput = this.mapEventToWorkflowInput(
      event,
      trigger.inputMapping || {}
    );
    
    // Generate correlation ID if needed
    const correlationId = trigger.correlationKey
      ? this.extractCorrelationId(event, trigger.correlationKey)
      : undefined;
    
    // Start the workflow
    return this.workflowOrchestratorService.startWorkflow({
      workflowDefinitionId: trigger.workflowDefinitionId,
      input: workflowInput,
      correlationId,
      metadata: {
        triggeredBy: {
          triggerType: 'EVENT',
          eventId: event.id,
          eventPattern: event.pattern
        }
      }
    });
  }
  
  /**
   * Cancel running workflows based on a trigger
   */
  private async cancelWorkflows(
    trigger: WorkflowEventTrigger,
    event: Event
  ): Promise<void> {
    // Find running workflows to cancel
    // This could be based on workflow definition ID and/or correlation ID
    const workflowsToCancel = await this.workflowOrchestratorService.findWorkflows({
      workflowDefinitionId: trigger.workflowDefinitionId,
      status: ['RUNNING', 'WAITING_FOR_EVENT'],
      correlationId: trigger.correlationKey
        ? this.extractCorrelationId(event, trigger.correlationKey)
        : undefined
    });
    
    // Cancel each matching workflow
    for (const workflow of workflowsToCancel) {
      await this.workflowOrchestratorService.cancelWorkflow(
        workflow.id,
        {
          reason: `Cancelled by event ${event.pattern}`,
          source: 'EVENT',
          eventId: event.id
        }
      );
    }
  }
  
  /**
   * Map event data to workflow input based on mapping configuration
   */
  private mapEventToWorkflowInput(
    event: Event,
    mapping: Record<string, string>
  ): Record<string, any> {
    const result: Record<string, any> = {};
    
    // Apply each mapping
    for (const [targetField, sourceExpression] of Object.entries(mapping)) {
      result[targetField] = this.evaluateExpression(sourceExpression, event);
    }
    
    return result;
  }
  
  /**
   * Extract correlation ID from event based on key expression
   */
  private extractCorrelationId(
    event: Event,
    correlationKeyExpression: string
  ): string {
    return this.evaluateExpression(correlationKeyExpression, event);
  }
  
  /**
   * Evaluate a condition expression against an event
   */
  private async evaluateCondition(
    condition: string,
    event: Event
  ): Promise<boolean> {
    // Implement condition evaluation logic
    // This could use a JavaScript expression evaluator in a sandbox
    return this.expressionEvaluator.evaluateBoolean(condition, { event });
  }
  
  /**
   * Evaluate an expression against an event
   */
  private evaluateExpression(
    expression: string,
    event: Event
  ): any {
    // Implement expression evaluation logic
    return this.expressionEvaluator.evaluate(expression, { event });
  }
}
```

## UI Integration

The Workflow Event Trigger Registry provides APIs for the UI Workflow Builder to:


1. List available event definitions from the Event Processing Service
2. Create and manage workflow triggers
3. Test trigger conditions against sample events
4. View which workflows are triggered by which events

## Operational Considerations

### Performance

The registry is optimized for:

* Fast lookup of triggers by event pattern
* Efficient condition evaluation
* Batch processing of multiple triggers for the same event

### Monitoring

Key metrics to monitor:

* Trigger evaluation rate
* Workflow start rate by trigger
* Condition evaluation time
* Error rates in trigger processing

### Security

Security considerations:

* Authorization for trigger management
* Validation of condition expressions
* Rate limiting for high-frequency triggers

## Related Documentation

* [Event Processing Service](../../event_processing_service.md)
* [Workflow Orchestrator Service](../workflow_orchestrator_service.md)
* [Events Schema](../../schemas/events.md)


