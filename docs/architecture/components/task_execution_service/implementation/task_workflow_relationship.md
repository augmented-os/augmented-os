# Task and Workflow Instance Relationship

## Overview

This document clarifies the relationship between Task Instances and Workflow Instances, explaining how these two core concepts interact within the system architecture. Understanding this relationship is essential for developers working with the Task Execution Service and the Workflow Orchestrator.

## Conceptual Model

At a high level, the relationship between tasks and workflows follows these principles:

1. **Workflows contain Tasks**: A workflow is composed of one or more tasks arranged in a specific execution pattern
2. **One-to-Many Relationship**: A workflow instance contains multiple task instances
3. **Lifecycle Independence**: Task instances have their own lifecycle, but are coordinated by workflow instances
4. **Data Flow**: Data flows between task instances within a workflow instance
5. **Execution Context**: Task instances inherit context from their parent workflow instance

The following diagram illustrates this relationship:

```
┌─────────────────────────────────────────────────────────────────┐
│                      Workflow Instance                           │
│                                                                 │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐        │
│  │             │     │             │     │             │        │
│  │    Task     │────▶│    Task     │────▶│    Task     │        │
│  │  Instance A │     │  Instance B │     │  Instance C │        │
│  │             │     │             │     │             │        │
│  └─────────────┘     └─────────────┘     └─────────────┘        │
│         │                   │                   │               │
│         ▼                   ▼                   ▼               │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐        │
│  │  Execution  │     │  Execution  │     │  Execution  │        │
│  │   Context   │     │   Context   │     │   Context   │        │
│  └─────────────┘     └─────────────┘     └─────────────┘        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Data Model Relationship

The relationship between task instances and workflow instances is formalized in the data model:

```typescript
// Simplified data model showing the relationship
interface WorkflowInstance {
  id: string;
  workflowDefinitionId: string;
  status: WorkflowStatus;
  startTime: string;
  endTime?: string;
  input: Record<string, any>;
  output?: Record<string, any>;
  taskInstances: TaskInstance[];
  variables: Record<string, any>;
  correlationId?: string;
  tenantId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface TaskInstance {
  id: string;
  taskDefinitionId: string;
  workflowInstanceId: string;  // Reference to parent workflow
  status: TaskStatus;
  startTime?: string;
  endTime?: string;
  input: Record<string, any>;
  output?: Record<string, any>;
  error?: ErrorDetails;
  retryCount: number;
  executionContext: TaskExecutionContext;
  createdAt: string;
  updatedAt: string;
}

interface TaskExecutionContext {
  workflowInstanceId: string;  // Reference to parent workflow
  workflowVariables: Record<string, any>;  // Snapshot of workflow variables
  taskPath: string;  // Path of the task in the workflow definition
  executionId: string;  // Unique execution identifier
  securityContext: SecurityContext;
  correlationId?: string;
}
```

Key aspects of this relationship:

1. **Foreign Key Reference**: Each `TaskInstance` contains a `workflowInstanceId` that references its parent `WorkflowInstance`
2. **Execution Context**: The `TaskExecutionContext` contains workflow-specific information needed for task execution
3. **Variable Access**: Task instances can access workflow variables through the execution context
4. **Status Propagation**: Task instance status changes can affect the workflow instance status

## Lifecycle Coordination

The lifecycle of task instances is coordinated by the Workflow Orchestrator but executed by the Task Execution Service:

```typescript
// Example of lifecycle coordination
class WorkflowExecutionCoordinator {
  async executeWorkflow(workflowInstance: WorkflowInstance): Promise<void> {
    try {
      // Update workflow status
      await this.updateWorkflowStatus(workflowInstance.id, 'RUNNING');
      
      // Get the workflow definition
      const workflowDefinition = await this.workflowDefinitionRepository.findById(
        workflowInstance.workflowDefinitionId
      );
      
      // Create execution plan
      const executionPlan = this.createExecutionPlan(
        workflowDefinition,
        workflowInstance
      );
      
      // Execute tasks according to the plan
      for (const taskExecution of executionPlan) {
        // Check if task should be executed based on conditions
        if (this.shouldExecuteTask(taskExecution, workflowInstance)) {
          // Create task instance
          const taskInstance = await this.createTaskInstance(
            taskExecution,
            workflowInstance
          );
          
          // Execute task through Task Execution Service
          const taskResult = await this.taskExecutionService.executeTask(taskInstance);
          
          // Process task result
          await this.processTaskResult(taskResult, workflowInstance);
          
          // Update workflow variables
          await this.updateWorkflowVariables(
            workflowInstance.id,
            taskResult.output,
            taskExecution.variableMappings
          );
          
          // Check if workflow should continue or terminate
          if (this.shouldTerminateWorkflow(taskResult, workflowInstance)) {
            break;
          }
        }
      }
      
      // Complete workflow
      await this.completeWorkflow(workflowInstance.id);
    } catch (error) {
      // Handle workflow execution error
      await this.handleWorkflowError(workflowInstance.id, error);
    }
  }
  
  // Helper methods
  private async createTaskInstance(
    taskExecution: TaskExecutionPlan,
    workflowInstance: WorkflowInstance
  ): Promise<TaskInstance> {
    // Prepare task input from workflow variables
    const taskInput = this.prepareTaskInput(
      taskExecution.inputMappings,
      workflowInstance.variables
    );
    
    // Create execution context
    const executionContext: TaskExecutionContext = {
      workflowInstanceId: workflowInstance.id,
      workflowVariables: { ...workflowInstance.variables },
      taskPath: taskExecution.taskPath,
      executionId: uuidv4(),
      securityContext: this.createSecurityContext(workflowInstance),
      correlationId: workflowInstance.correlationId
    };
    
    // Create task instance
    const taskInstance: TaskInstance = {
      id: uuidv4(),
      taskDefinitionId: taskExecution.taskDefinitionId,
      workflowInstanceId: workflowInstance.id,
      status: 'PENDING',
      retryCount: 0,
      input: taskInput,
      executionContext,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Save task instance
    await this.taskInstanceRepository.save(taskInstance);
    
    return taskInstance;
  }
  
  private async processTaskResult(
    taskResult: TaskResult,
    workflowInstance: WorkflowInstance
  ): Promise<void> {
    // Update task instance with result
    await this.taskInstanceRepository.update(taskResult.taskInstanceId, {
      status: taskResult.status,
      output: taskResult.output,
      error: taskResult.error,
      endTime: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    // Check if workflow status needs to be updated
    if (taskResult.status === 'FAILED' && !taskResult.isContinueOnFailure) {
      await this.updateWorkflowStatus(workflowInstance.id, 'FAILED');
    }
  }
}
```

## Data Flow Between Tasks

Data flows between task instances within a workflow through workflow variables:

```typescript
// Example of data flow between tasks
class WorkflowVariableManager {
  async updateWorkflowVariables(
    workflowInstanceId: string,
    taskOutput: Record<string, any>,
    variableMappings: VariableMapping[]
  ): Promise<void> {
    // Get current workflow instance
    const workflowInstance = await this.workflowInstanceRepository.findById(
      workflowInstanceId
    );
    
    // Create updated variables object
    const updatedVariables = { ...workflowInstance.variables };
    
    // Apply variable mappings
    for (const mapping of variableMappings) {
      if (mapping.type === 'DIRECT') {
        // Direct mapping from task output to workflow variable
        updatedVariables[mapping.target] = taskOutput[mapping.source];
      } else if (mapping.type === 'EXPRESSION') {
        // Expression-based mapping
        updatedVariables[mapping.target] = this.evaluateExpression(
          mapping.expression,
          {
            taskOutput,
            workflowVariables: workflowInstance.variables
          }
        );
      } else if (mapping.type === 'TRANSFORM') {
        // Transformation-based mapping
        updatedVariables[mapping.target] = this.applyTransformation(
          mapping.transformation,
          taskOutput[mapping.source]
        );
      }
    }
    
    // Update workflow instance with new variables
    await this.workflowInstanceRepository.update(workflowInstanceId, {
      variables: updatedVariables,
      updatedAt: new Date().toISOString()
    });
  }
  
  // Helper methods
  private evaluateExpression(
    expression: string,
    context: {
      taskOutput: Record<string, any>,
      workflowVariables: Record<string, any>
    }
  ): any {
    // Implementation of expression evaluation
    return null;
  }
  
  private applyTransformation(
    transformation: string,
    value: any
  ): any {
    // Implementation of transformation
    return null;
  }
}
```

## Error Handling and Recovery

Error handling between task instances and workflow instances is coordinated:

```typescript
// Example of error handling coordination
class WorkflowErrorHandler {
  async handleTaskError(
    taskInstance: TaskInstance,
    error: Error
  ): Promise<void> {
    // Get workflow instance
    const workflowInstance = await this.workflowInstanceRepository.findById(
      taskInstance.workflowInstanceId
    );
    
    // Get task definition
    const taskDefinition = await this.taskDefinitionRepository.findById(
      taskInstance.taskDefinitionId
    );
    
    // Check if task should be retried
    if (this.shouldRetryTask(taskInstance, taskDefinition, error)) {
      // Schedule task retry
      await this.scheduleTaskRetry(taskInstance, taskDefinition.retryPolicy);
    } else {
      // Mark task as failed
      await this.taskInstanceRepository.update(taskInstance.id, {
        status: 'FAILED',
        error: this.formatError(error),
        endTime: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      // Check if workflow should continue despite task failure
      if (taskDefinition.continueOnFailure) {
        // Continue workflow execution
        await this.continueWorkflowExecution(workflowInstance.id);
      } else {
        // Mark workflow as failed
        await this.workflowInstanceRepository.update(workflowInstance.id, {
          status: 'FAILED',
          endTime: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        
        // Execute error handling tasks if defined
        await this.executeErrorHandlingTasks(workflowInstance, taskInstance);
      }
    }
  }
  
  // Helper methods
  private shouldRetryTask(
    taskInstance: TaskInstance,
    taskDefinition: TaskDefinition,
    error: Error
  ): boolean {
    // Check if retry policy exists
    if (!taskDefinition.retryPolicy) {
      return false;
    }
    
    // Check if max retries exceeded
    if (taskInstance.retryCount >= taskDefinition.retryPolicy.maxRetries) {
      return false;
    }
    
    // Check if error is retryable
    return this.isRetryableError(error, taskDefinition.retryPolicy.retryableErrors);
  }
  
  private async scheduleTaskRetry(
    taskInstance: TaskInstance,
    retryPolicy: RetryPolicy
  ): Promise<void> {
    // Calculate retry delay
    const retryDelay = this.calculateRetryDelay(
      retryPolicy,
      taskInstance.retryCount
    );
    
    // Update task instance
    await this.taskInstanceRepository.update(taskInstance.id, {
      status: 'RETRY_PENDING',
      retryCount: taskInstance.retryCount + 1,
      updatedAt: new Date().toISOString()
    });
    
    // Schedule retry
    await this.taskScheduler.scheduleTask(
      taskInstance.id,
      new Date(Date.now() + retryDelay)
    );
  }
}
```

## Security Context Propagation

Security context is propagated from workflow instances to task instances:

```typescript
// Example of security context propagation
function createTaskSecurityContext(
  workflowInstance: WorkflowInstance,
  taskDefinition: TaskDefinition
): SecurityContext {
  // Start with base security context from workflow
  const securityContext: SecurityContext = {
    userId: workflowInstance.createdBy,
    tenantId: workflowInstance.tenantId,
    roles: workflowInstance.securityContext?.roles || [],
    permissions: workflowInstance.securityContext?.permissions || [],
    environmentId: workflowInstance.securityContext?.environmentId
  };
  
  // Apply task-specific security requirements
  if (taskDefinition.securityRequirements) {
    // Add required permissions for the task
    securityContext.requiredPermissions = taskDefinition.securityRequirements.requiredPermissions;
    
    // Set security level
    securityContext.securityLevel = taskDefinition.securityRequirements.securityLevel;
    
    // Set data classification
    securityContext.dataClassification = taskDefinition.securityRequirements.dataClassification;
  }
  
  return securityContext;
}
```

## Monitoring and Observability

Monitoring spans both workflow instances and their constituent task instances:

```typescript
// Example of coordinated monitoring
class WorkflowMonitor {
  async recordTaskExecution(
    taskInstance: TaskInstance,
    executionMetrics: TaskExecutionMetrics
  ): Promise<void> {
    // Record task-level metrics
    await this.metricsService.recordTaskMetrics(
      taskInstance.id,
      executionMetrics
    );
    
    // Update workflow-level metrics
    await this.updateWorkflowMetrics(
      taskInstance.workflowInstanceId,
      taskInstance.id,
      executionMetrics
    );
    
    // Check for anomalies
    const anomalies = this.detectAnomalies(
      taskInstance,
      executionMetrics
    );
    
    if (anomalies.length > 0) {
      await this.handleAnomalies(
        taskInstance.workflowInstanceId,
        taskInstance.id,
        anomalies
      );
    }
  }
  
  private async updateWorkflowMetrics(
    workflowInstanceId: string,
    taskInstanceId: string,
    executionMetrics: TaskExecutionMetrics
  ): Promise<void> {
    // Get current workflow metrics
    const workflowMetrics = await this.workflowMetricsRepository.findByWorkflowInstanceId(
      workflowInstanceId
    );
    
    // Update workflow metrics
    const updatedMetrics = {
      ...workflowMetrics,
      taskCount: workflowMetrics.taskCount + 1,
      totalExecutionTime: workflowMetrics.totalExecutionTime + executionMetrics.executionTime,
      totalCpuTime: workflowMetrics.totalCpuTime + executionMetrics.cpuTime,
      totalMemoryUsage: workflowMetrics.totalMemoryUsage + executionMetrics.memoryUsage,
      completedTasks: [...workflowMetrics.completedTasks, taskInstanceId]
    };
    
    // Save updated metrics
    await this.workflowMetricsRepository.update(
      workflowInstanceId,
      updatedMetrics
    );
  }
}
```

## Best Practices

When working with task instances and workflow instances, follow these best practices:

1. **Clear Boundaries**: Maintain clear boundaries between workflow orchestration logic and task execution logic
2. **Idempotent Tasks**: Design tasks to be idempotent to handle retries safely
3. **Minimal Context**: Pass only the necessary context from workflows to tasks
4. **Explicit Data Flow**: Make data flow between tasks explicit through variable mappings
5. **Error Handling**: Implement comprehensive error handling at both workflow and task levels
6. **Security Context**: Always propagate security context from workflows to tasks
7. **Monitoring**: Monitor both workflow-level and task-level metrics
8. **Transaction Management**: Be careful with transaction boundaries between workflows and tasks

## Related Documentation

* [Task Router](./task_router.md)
* [Workflow Orchestrator](../../workflow_orchestrator_service/overview.md)
* [Data Model](../data_model.md)
* [Error Handling](../operations/error_handling.md)
* [Security Guidelines](../operations/security.md) 