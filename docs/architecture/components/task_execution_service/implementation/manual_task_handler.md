# Manual Task Handler

## Overview

The Manual Task Handler is a core component of the Task Execution Service Service responsible for managing tasks that require human intervention. It handles the assignment, notification, tracking, and completion of manual tasks, providing a bridge between automated workflows and human operators.

## Key Responsibilities

* Managing the lifecycle of manual tasks
* Assigning tasks to appropriate users or roles
* Notifying users about pending tasks
* Tracking task status and deadlines
* Providing interfaces for human interaction
* Validating manual task inputs and outputs
* Handling task reassignment and escalation
* Integrating with the UI framework for task presentation

## Implementation Approach

The Manual Task Handler follows these design principles:


1. **User-Centric Design** - Task interfaces are designed for optimal human interaction
2. **Role-Based Assignment** - Tasks are assigned based on roles, skills, and workload
3. **Notification Management** - Timely notifications ensure tasks are addressed promptly
4. **Deadline Tracking** - SLAs and deadlines are monitored with escalation paths
5. **Audit Trail** - All human actions are logged for compliance and traceability

## Manual Task Lifecycle

```
┌───────────┐
│  CREATED  │
└─────┬─────┘
      │
      ▼
┌───────────┐
│  ASSIGNED │
└─────┬─────┘
      │
      ▼
┌───────────┐     ┌─────────────────┐
│ IN_PROGRESS│────►│    REASSIGNED   │
└─────┬─────┘     └────────┬─────────┘
      │                    │
      │                    ▼
      │           ┌─────────────────┐
      │           │     ASSIGNED    │
      │           └────────┬────────┘
      │                    │
      ▼                    │
┌───────────┐              │
│ COMPLETED │◄─────────────┘
└─────┬─────┘
      │
      ▼
```

## Implementation Details

### Task Assignment

The Manual Task Handler implements a sophisticated assignment algorithm that considers:

* User roles and permissions
* User skills and expertise
* Current workload and availability
* Task priority and deadlines
* Business rules and constraints

```typescript
// Example code for task assignment
async function assignTask(task: ManualTaskInstance): Promise<AssignmentResult> {
  // Get assignment rules from task definition
  const { assignmentRules } = task.executionConfig;
  
  // Resolve dynamic assignment variables
  const resolvedRules = await resolveAssignmentVariables(assignmentRules, task);
  
  // Find eligible users based on rules
  const eligibleUsers = await findEligibleUsers(resolvedRules);
  
  if (eligibleUsers.length === 0) {
    return {
      success: false,
      error: 'No eligible users found for assignment'
    };
  }
  
  // Select best user based on workload balancing
  const selectedUser = await selectUserForAssignment(eligibleUsers, task);
  
  // Assign the task
  await updateTaskAssignment(task.id, selectedUser.id);
  
  // Send notification to the assigned user
  await sendAssignmentNotification(selectedUser, task);
  
  return {
    success: true,
    assignedTo: selectedUser.id
  };
}
```

### User Interface Integration

The Manual Task Handler integrates with the UI Framework to present tasks to users:


1. **Task List View** - Shows all tasks assigned to the user
2. **Task Detail View** - Displays task details and input data
3. **Task Action Interface** - Provides UI for task completion
4. **Task History View** - Shows audit trail of task actions

The integration uses a well-defined API that allows the UI to:

* Fetch assigned tasks for a user
* Get task details and form definitions
* Submit task actions and completions
* Track task status and history

#### UI Implementation Details

The UI implementation for manual tasks follows a component-based architecture that provides a consistent user experience while allowing for task-specific customization:

```typescript
// Example UI component for manual task handling
class ManualTaskComponent extends React.Component<ManualTaskProps, ManualTaskState> {
  constructor(props: ManualTaskProps) {
    super(props);
    this.state = {
      task: null,
      loading: true,
      formData: {},
      validationErrors: {},
      submitting: false
    };
  }
  
  async componentDidMount() {
    try {
      // Fetch task details
      const task = await this.props.taskService.getTaskById(this.props.taskId);
      
      // Initialize form data from task input
      const formData = this.initializeFormData(task);
      
      this.setState({
        task,
        formData,
        loading: false
      });
    } catch (error) {
      this.setState({
        error: `Failed to load task: ${error.message}`,
        loading: false
      });
    }
  }
  
  handleInputChange = (field: string, value: any) => {
    this.setState(prevState => ({
      formData: {
        ...prevState.formData,
        [field]: value
      }
    }));
  }
  
  handleSubmit = async () => {
    try {
      this.setState({ submitting: true });
      
      // Validate form data
      const validationResult = this.validateFormData();
      if (!validationResult.valid) {
        this.setState({
          validationErrors: validationResult.errors,
          submitting: false
        });
        return;
      }
      
      // Submit task completion
      await this.props.taskService.completeTask(
        this.props.taskId,
        this.state.formData
      );
      
      // Show success message
      this.props.notificationService.showSuccess('Task completed successfully');
      
      // Navigate back to task list
      this.props.navigation.navigateTo('/tasks');
    } catch (error) {
      this.setState({
        error: `Failed to complete task: ${error.message}`,
        submitting: false
      });
    }
  }
  
  handleReassign = async () => {
    try {
      this.setState({ submitting: true });
      
      // Open reassignment dialog
      const result = await this.props.dialogService.openReassignDialog({
        taskId: this.props.taskId,
        currentAssignee: this.state.task.assignee
      });
      
      if (result.confirmed) {
        // Submit reassignment
        await this.props.taskService.reassignTask(
          this.props.taskId,
          result.newAssignee,
          result.reason
        );
        
        // Show success message
        this.props.notificationService.showSuccess('Task reassigned successfully');
        
        // Navigate back to task list
        this.props.navigation.navigateTo('/tasks');
      } else {
        this.setState({ submitting: false });
      }
    } catch (error) {
      this.setState({
        error: `Failed to reassign task: ${error.message}`,
        submitting: false
      });
    }
  }
  
  render() {
    const { task, loading, error, formData, validationErrors, submitting } = this.state;
    
    if (loading) {
      return <LoadingSpinner />;
    }
    
    if (error) {
      return <ErrorMessage message={error} />;
    }
    
    return (
      <div className="manual-task-container">
        <TaskHeader
          title={task.definition.name}
          priority={task.priority}
          dueDate={task.dueDate}
        />
        
        <TaskDescription description={task.definition.description} />
        
        <TaskForm
          schema={task.definition.formSchema}
          data={formData}
          errors={validationErrors}
          onChange={this.handleInputChange}
          disabled={submitting}
        />
        
        <TaskActions
          onSubmit={this.handleSubmit}
          onReassign={this.handleReassign}
          submitting={submitting}
          canReassign={this.props.userPermissions.includes('REASSIGN_TASKS')}
        />
        
        <TaskHistory history={task.history} />
      </div>
    );
  }
}
```

#### Task UI Components

The UI Framework provides several specialized components for manual tasks:

1. **Task Dashboard**
   * Displays tasks grouped by status, priority, and due date
   * Provides filtering and sorting options
   * Shows key metrics like overdue tasks and upcoming deadlines

2. **Task Form Builder**
   * Renders dynamic forms based on task definition
   * Supports various input types (text, number, date, select, etc.)
   * Handles validation and error display
   * Supports conditional fields and dynamic behavior

3. **Task Inbox**
   * Shows personalized list of assigned tasks
   * Highlights urgent and overdue tasks
   * Provides quick actions for common operations
   * Supports batch operations on multiple tasks

4. **Task Collaboration Tools**
   * Comments and discussion threads
   * File attachments and document sharing
   * Activity timeline showing all actions
   * @mentions for notifying team members

#### Task UI Workflow

The typical user workflow for manual tasks follows these steps:

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│             │     │             │     │             │     │             │
│  Task Inbox │────►│ Task Detail │────►│ Task Action │────►│ Confirmation│
│             │     │             │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
       ▲                                       │
       │                                       │
       └───────────────────────────────────────┘
                    (Task Reassigned)
```

1. User receives notification of a new task
2. User opens the Task Inbox to view assigned tasks
3. User selects a task to view details
4. User reviews task information and requirements
5. User completes the required actions using the task form
6. User submits the task or requests reassignment
7. User receives confirmation of successful submission

#### Mobile Support

The Manual Task Handler supports mobile interfaces through:

* Responsive web design for the task UI
* Native mobile app integration via the Task API
* Push notifications for mobile devices
* Simplified task forms optimized for mobile interaction
* Offline support for completing tasks without connectivity

#### Accessibility Considerations

The task UI implements accessibility best practices:

* WCAG 2.1 AA compliance
* Keyboard navigation support
* Screen reader compatibility
* High contrast mode
* Adjustable text size
* Alternative text for all images and icons

#### Integration with External Systems

The UI can integrate with external systems through:

* Single Sign-On (SSO) for authentication
* Deep linking to specific tasks
* Embedding task forms in external applications
* Webhook notifications for task events
* API access for custom UI implementations

### Notification Management

The handler implements a notification system with multiple channels:

| Channel | Use Case | Configuration |
|----|----|----|
| Email | Primary notifications | Configurable templates and frequency |
| In-app | Real-time notifications | Configurable priority levels |
| Mobile push | Urgent notifications | Configurable for critical tasks |
| Calendar | Deadline reminders | Integration with calendar systems |
| Slack/Teams | Team notifications | Configurable for collaborative tasks |

Notification logic includes:

* Initial assignment notifications
* Reminder notifications for approaching deadlines
* Escalation notifications for missed deadlines
* Completion and reassignment notifications

```typescript
// Example notification management
async function manageTaskNotifications(task: ManualTaskInstance): Promise<void> {
  const notificationConfig = getNotificationConfig(task);
  
  // Schedule initial notification
  await scheduleNotification({
    taskId: task.id,
    userId: task.assignee,
    type: 'ASSIGNMENT',
    channels: notificationConfig.assignmentChannels,
    scheduledTime: new Date(),
    data: {
      taskName: task.definition.name,
      dueDate: calculateDueDate(task),
      priority: task.priority
    }
  });
  
  // Schedule reminder notifications
  const dueDate = calculateDueDate(task);
  const reminderTimes = calculateReminderTimes(dueDate, notificationConfig);
  
  for (const reminderTime of reminderTimes) {
    await scheduleNotification({
      taskId: task.id,
      userId: task.assignee,
      type: 'REMINDER',
      channels: notificationConfig.reminderChannels,
      scheduledTime: reminderTime,
      data: {
        taskName: task.definition.name,
        dueDate,
        timeRemaining: formatTimeRemaining(dueDate, reminderTime),
        priority: task.priority
      }
    });
  }
  
  // Schedule escalation notification if deadline is missed
  await scheduleNotification({
    taskId: task.id,
    userId: task.assignee,
    type: 'ESCALATION',
    channels: notificationConfig.escalationChannels,
    scheduledTime: new Date(dueDate.getTime() + 1000), // 1 second after deadline
    data: {
      taskName: task.definition.name,
      dueDate,
      priority: task.priority
    },
    condition: {
      taskStatus: ['ASSIGNED', 'IN_PROGRESS'] // Only send if still not completed
    }
  });
}
```

### Deadline Management

The handler implements deadline tracking and escalation:


1. **Deadline Calculation** - Based on task priority and SLA configuration
2. **Deadline Monitoring** - Regular checks for approaching/missed deadlines
3. **Escalation Paths** - Configurable escalation when deadlines are missed
4. **SLA Reporting** - Metrics on task completion times vs. deadlines

```typescript
// Example deadline management
function calculateDueDate(task: ManualTaskInstance): Date {
  const { priority } = task;
  const now = new Date();
  
  // Get SLA configuration based on priority
  const slaConfig = getSlaConfigForPriority(priority);
  
  // Calculate due date
  const dueDate = new Date(now.getTime() + slaConfig.timeAllowedMs);
  
  // Adjust for business hours if configured
  if (slaConfig.useBusinessHours) {
    return adjustForBusinessHours(dueDate, slaConfig.businessHoursConfig);
  }
  
  return dueDate;
}

async function handleMissedDeadline(task: ManualTaskInstance): Promise<void> {
  const escalationConfig = getEscalationConfig(task);
  
  // Log the missed deadline
  logger.warn(`Deadline missed for task ${task.id}`, {
    taskId: task.id,
    assignee: task.assignee,
    dueDate: task.dueDate,
    priority: task.priority
  });
  
  // Determine escalation action
  switch (escalationConfig.action) {
    case 'NOTIFY_MANAGER':
      await notifyManager(task, escalationConfig);
      break;
    case 'REASSIGN':
      await reassignTask(task, escalationConfig);
      break;
    case 'AUTO_COMPLETE':
      await autoCompleteTask(task, escalationConfig);
      break;
    default:
      // Just notify the assignee by default
      await sendEscalationNotification(task);
  }
  
  // Update task with escalation information
  await updateTaskEscalation(task.id, {
    escalatedAt: new Date(),
    escalationType: escalationConfig.action,
    escalationReason: 'MISSED_DEADLINE'
  });
}
```

### Task Completion Handling

When a user completes a task, the handler:


1. Validates the provided output against the schema
2. Records the completion with user information
3. Updates the task status
4. Notifies the workflow orchestrator
5. Updates metrics and logs

```typescript
// Example task completion handling
async function handleTaskCompletion(
  taskId: string, 
  output: any, 
  userId: string
): Promise<TaskCompletionResult> {
  // Get the task
  const task = await getTaskById(taskId);
  
  if (!task) {
    throw new TaskNotFoundError(taskId);
  }
  
  // Verify the user is authorized to complete this task
  if (!isAuthorizedToComplete(task, userId)) {
    throw new UnauthorizedTaskActionError(taskId, userId);
  }
  
  try {
    // Validate output against schema
    const validatedOutput = validateOutput(output, task.definition.outputSchema);
    
    // Update task status
    await updateTaskStatus(taskId, 'COMPLETED', {
      output: validatedOutput,
      completedBy: userId,
      completedAt: new Date().toISOString()
    });
    
    // Notify workflow orchestrator
    await notifyWorkflowOrchestrator(task.workflowInstanceId, {
      taskId,
      status: 'COMPLETED',
      output: validatedOutput
    });
    
    // Log completion
    logger.info(`Task ${taskId} completed by user ${userId}`, {
      taskId,
      userId,
      completionTime: new Date().toISOString()
    });
    
    // Update metrics
    metrics.recordTaskCompletion(task);
    
    return {
      success: true,
      taskId,
      status: 'COMPLETED'
    };
  } catch (error) {
    // Handle validation or processing errors
    logger.error(`Error completing task ${taskId}`, {
      taskId,
      userId,
      error: error.message
    });
    
    return {
      success: false,
      taskId,
      error: error.message
    };
  }
}
```

### Audit Trail

The handler maintains a comprehensive audit trail of all actions:

```typescript
// Example audit trail implementation
async function recordAuditEvent(
  taskId: string,
  eventType: TaskAuditEventType,
  userId: string,
  details: any
): Promise<void> {
  await db.taskAuditEvents.insert({
    taskId,
    eventType,
    userId,
    timestamp: new Date().toISOString(),
    details,
    userAgent: details.userAgent,
    ipAddress: details.ipAddress
  });
}
```

Audit events include:

* Task assignment and reassignment
* Task status changes
* Task view events
* Task completion attempts
* Deadline extensions
* Priority changes

## Performance Considerations

The Manual Task Handler is optimized for:

* **UI Responsiveness** - Fast loading of task lists and details
* **Notification Timeliness** - Ensuring notifications are sent promptly
* **Assignment Efficiency** - Quick assignment of tasks to appropriate users
* **Scalability** - Handling large numbers of concurrent manual tasks

Performance optimizations include:

* Caching of task lists and assignment rules
* Batched notification processing
* Asynchronous audit trail recording
* Optimized database queries for task retrieval

### Benchmarks

| Operation | Average Performance | P99 Performance |
|----|----|----|
| Task assignment | 200-500ms | 1.5s |
| Task list retrieval | 100-300ms | 1s |
| Task detail retrieval | 50-200ms | 800ms |
| Task completion | 300-700ms | 2s |
| Notification sending | 500-1000ms | 3s |

## Related Documentation

* [Data Model](../data_model.md)
* [Task Router](./task_router.md)
* [UI Framework Integration](../interfaces/internal.md)
* [API Reference](../interfaces/api.md)
* [Monitoring Guidelines](../operations/monitoring.md)


