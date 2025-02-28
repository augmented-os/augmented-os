# Scheduler Component

## Overview

The Scheduler Component is a critical part of the Workflow Orchestrator that manages time-based workflow operations. It provides capabilities for delayed task execution, recurring workflow triggers, time-based workflow pausing and resumption, and timeout management for long-running operations.

## Architecture

The Scheduler Component integrates with the Workflow Orchestrator and maintains its own schedule store for persisting scheduled operations:

```
┌─────────────────────────────────────────────┐
│             Workflow Orchestrator            │
├─────────┬─────────┬──────────┬──────────────┤
│  State  │  Task   │  Event   │  Scheduler   │
│ Manager │Dispatcher│ Handler  │  Component  │
├─────────┴─────────┴──────────┴──────────────┤
│             Error Handler                    │
└───────────────────┬─────────────────────────┘
                   │                ▲
                   │                │
                   ▼                │
┌─────────────────────────┐     ┌─────────────────────────┐
│                         │     │                         │
│    Workflow Database    │◄───▶│    Schedule Store       │
│                         │     │                         │
└─────────────────────────┘     └─────────────────────────┘
```

## Core Features

### Delayed Execution

The Scheduler allows tasks to run at a future time, supporting operations like:

* Delaying workflow steps until a specific time
* Scheduling follow-up actions
* Implementing waiting periods between steps

### Recurring Schedules

Support for periodic workflow execution using cron syntax enables:

* Scheduled report generation
* Periodic maintenance workflows
* Regularly occurring business processes

### Temporal Triggers

Time-based events can trigger or advance workflows, including:

* Deadline-based escalations
* Timeouts for long-running operations
* Time window monitoring (business hours, SLAs)

### Dynamic Scheduling

The API for programmatically creating and managing schedules supports:

* Runtime creation of schedules based on workflow data
* Modification of existing schedules
* Cancellation of scheduled tasks

### Calendar Integration

Support for business calendars, holidays, and working hours enables:

* Business-day aware scheduling
* Respecting holiday calendars
* Working hours constraints

## Implementation

```typescript
/**
 * Schedule definition interface
 */
interface ScheduleDefinition {
  id: string;
  type: 'one-time' | 'recurring';
  target: {
    type: 'workflow' | 'task';
    id: string;
  };
  timing: {
    // For one-time schedules
    executeAt?: string;  // ISO timestamp
    
    // For recurring schedules
    cronExpression?: string;
    timezone?: string;
    startDate?: string;
    endDate?: string;
  };
  input: any;             // Input data for the workflow/task
  metadata: {
    createdBy: string;
    createdAt: string;
    lastModifiedAt: string;
    description: string;
  };
}

/**
 * Scheduler service implementation pattern
 */
class SchedulerService {
  /**
   * Creates a new schedule
   */
  async createSchedule(definition: ScheduleDefinition): Promise<string> {
    // Validate schedule definition
    this.validateScheduleDefinition(definition);
    
    // Store schedule in the database
    const scheduleId = await this.scheduleStore.saveSchedule(definition);
    
    // If it's a one-time schedule in the near future, add it to the memory queue
    if (definition.type === 'one-time' && this.isInNearFuture(definition.timing.executeAt)) {
      this.addToMemoryQueue(scheduleId, definition);
    }
    
    return scheduleId;
  }
  
  /**
   * Activates scheduled items that are due for execution
   * This is called by a time-based trigger (e.g., every minute)
   */
  async processDueSchedules(): Promise<void> {
    // Get schedules that are due from both memory queue and database
    const dueSchedules = [
      ...this.getDueSchedulesFromMemory(),
      ...await this.scheduleStore.getDueSchedules(new Date())
    ];
    
    // Process each due schedule
    for (const schedule of dueSchedules) {
      if (schedule.target.type === 'workflow') {
        await this.workflowService.startWorkflow(
          schedule.target.id,
          schedule.input
        );
      } else {
        await this.taskService.executeTask(
          schedule.target.id,
          schedule.input
        );
      }
      
      // If recurring, calculate and store next execution time
      if (schedule.type === 'recurring') {
        const nextExecutionTime = this.calculateNextExecution(
          schedule.timing.cronExpression,
          schedule.timing.timezone
        );
        
        await this.scheduleStore.updateNextExecutionTime(
          schedule.id,
          nextExecutionTime
        );
      } else {
        // For one-time schedules, mark as completed
        await this.scheduleStore.markAsCompleted(schedule.id);
      }
    }
  }
  
  /**
   * Schedules a timeout for a workflow
   */
  async scheduleWorkflowTimeout(
    instanceId: string,
    timeoutMs: number,
    timeoutHandlerStepId: string
  ): Promise<string> {
    const executeAt = new Date(Date.now() + timeoutMs).toISOString();
    
    return this.createSchedule({
      id: uuid(),
      type: 'one-time',
      target: {
        type: 'task',
        id: 'workflow_timeout_handler'
      },
      timing: {
        executeAt
      },
      input: {
        instanceId,
        timeoutHandlerStepId
      },
      metadata: {
        createdBy: 'system',
        createdAt: new Date().toISOString(),
        lastModifiedAt: new Date().toISOString(),
        description: `Timeout for workflow instance ${instanceId}`
      }
    });
  }
  
  /**
   * Cancels a scheduled timeout
   */
  async cancelScheduledTimeout(instanceId: string): Promise<void> {
    // Find all timeouts for this workflow instance
    const schedules = await this.scheduleStore.findSchedulesByInput({
      instanceId
    });
    
    // Cancel all matching schedules
    for (const schedule of schedules) {
      await this.scheduleStore.cancelSchedule(schedule.id);
    }
  }
}
```

## Database Schema

The Scheduler Component uses a dedicated `schedules` table to store schedule definitions and state:

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Unique identifier for the schedule |
| type | VARCHAR | Schedule type (one-time or recurring) |
| target_type | VARCHAR | Type of target (workflow or task) |
| target_id | VARCHAR | ID of the target workflow or task |
| cron_expression | VARCHAR | For recurring schedules |
| next_execution | TIMESTAMP | Timestamp for the next execution |
| input | JSONB | JSON data to pass to the workflow/task |
| status | VARCHAR | Current status (active, completed, error) |
| created_at | TIMESTAMP | Creation timestamp |
| created_by | VARCHAR | User who created the schedule |
| last_executed | TIMESTAMP | Timestamp of last execution |

## Implementation Patterns

### Two-Tier Scheduling

The Scheduler implements a two-tier approach:

1. **Memory Queue**: For imminent schedules (next few minutes)
   * Fast in-memory processing
   * No database overhead for near-term schedules
   * Survives service restart via database recovery

2. **Database Store**: For all schedules and persistence
   * Durable storage of all schedule definitions
   * Periodic polling to load upcoming schedules into memory
   * Source of truth for schedule state

### Cron Expression Parsing

For recurring schedules, the system:

1. Parses cron expressions into a structured representation
2. Calculates next execution time based on the expression
3. Supports extended syntax for more complex schedules
4. Handles timezone conversions properly

### Batched Processing

For efficiency, the scheduler:

1. Processes schedules in batches
2. Uses database transactions for atomic updates
3. Implements idempotent execution to handle duplicates
4. Provides error isolation between schedules

## Use Cases

### Workflow Timeouts

Used to handle situations where an event does not arrive within the expected time:

```typescript
// In Event Wait Step implementation
if (waitStep.eventTimeout) {
  const timeoutMs = parseDuration(waitStep.eventTimeout.duration);
  await schedulerService.scheduleWorkflowTimeout(
    instanceId,
    timeoutMs,
    waitStep.eventTimeout.timeoutHandlerStepId
  );
}
```

### Delayed Workflow Steps

For steps that need to wait before executing:

```typescript
// Example of a delayed step in workflow definition
{
  "stepId": "send_reminder",
  "type": "DELAYED_TASK",
  "taskId": "send_email_task",
  "delay": "P3D",  // 3 days delay in ISO 8601 duration format
  "input": {
    "template": "payment_reminder",
    "recipient": "${workflow.input.customerEmail}"
  }
}
```

### Recurring Workflows

For workflows that need to execute on a schedule:

```typescript
// Creating a recurring workflow schedule
await schedulerService.createSchedule({
  id: uuid(),
  type: 'recurring',
  target: {
    type: 'workflow',
    id: 'monthly_report_workflow'
  },
  timing: {
    cronExpression: '0 0 1 * *',  // First day of each month
    timezone: 'America/New_York',
    startDate: '2023-01-01T00:00:00Z'
  },
  input: {
    reportType: 'monthly_summary'
  },
  metadata: {
    createdBy: 'admin',
    createdAt: new Date().toISOString(),
    lastModifiedAt: new Date().toISOString(),
    description: 'Monthly report generation'
  }
});
```

## Operational Considerations

### Scalability

The Scheduler Component can scale by:

* Distributing processing across multiple instances
* Using database locks to prevent duplicate execution
* Implementing near-term vs. long-term schedule handling

### Resilience

For reliability, the scheduler:

* Recovers missed schedules after downtime
* Uses idempotent execution to handle duplicates
* Implements retry logic for failed executions
* Provides dead-letter queue for repeatedly failing schedules

### Monitoring

Critical metrics to monitor:

* Schedule execution delay (time between scheduled and actual execution)
* Success rate of scheduled tasks
* Number of schedules in each state
* Processing time per batch
* Error rates by schedule type

## Related Documentation

- [Event Processing](./event_processing.md)
- [State Management](./state_management.md)
- [System Configuration](../operations/configuration.md) 