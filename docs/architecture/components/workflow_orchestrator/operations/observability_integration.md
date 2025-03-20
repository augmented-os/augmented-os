# Workflow Orchestrator Integration with Observability Service

## Overview

This document describes how the Workflow Orchestrator integrates with the Observability Service for centralized logging, metrics collection, and distributed tracing. Given the critical role of the Workflow Orchestrator in managing workflows across the platform, comprehensive observability is essential for monitoring workflow execution, identifying bottlenecks, and troubleshooting issues.

## Integration Configuration

Configure the Workflow Orchestrator to integrate with the Observability Service:

```json
{
  "observability": {
    "endpoint": "https://api.example.com/observability",
    "auth": {
      "type": "service-account",
      "id": "workflow-orchestrator-monitor",
      "secret": "${WORKFLOW_MONITOR_SECRET}"
    },
    "logging": {
      "level": "INFO",
      "format": "json",
      "batch_size": 50,
      "flush_interval_ms": 5000,
      "include_workflow_context": true
    },
    "metrics": {
      "push_interval_ms": 15000,
      "prefix": "workflow_orchestrator",
      "default_dimensions": {
        "service": "workflow-orchestrator",
        "environment": "${ENV}"
      }
    },
    "tracing": {
      "sample_rate": 0.2,
      "propagation_format": "w3c",
      "trace_all_workflows": false,
      "high_value_workflows": ["payment-processing", "user-onboarding"]
    }
  }
}
```

## Workflow Context Propagation

The Workflow Orchestrator passes workflow context through the observability pipeline:

```typescript
// Workflow execution context that's propagated to logs, metrics, and traces
interface WorkflowContext {
  workflowId: string;
  workflowName: string;
  workflowVersion: string;
  workflowRunId: string;
  startedAt: string;
  initiator: string;
  priority: number;
  parentWorkflowId?: string;
  correlationId: string;
  tenantId?: string;
}

// Helper to extract context from a workflow instance
function getWorkflowContext(workflow): WorkflowContext {
  return {
    workflowId: workflow.id,
    workflowName: workflow.definition.name,
    workflowVersion: workflow.definition.version,
    workflowRunId: workflow.runId,
    startedAt: workflow.startedAt,
    initiator: workflow.initiator,
    priority: workflow.priority,
    parentWorkflowId: workflow.parentWorkflowId,
    correlationId: workflow.correlationId,
    tenantId: workflow.tenantId
  };
}
```

## Logging Integration

The Workflow Orchestrator logs workflow lifecycle events, state transitions, and execution details:

```typescript
import { createLogger } from '@augmented-os/observability-sdk';

const logger = createLogger({
  service: 'workflow-orchestrator',
  observabilityEndpoint: config.observability.endpoint,
  defaultContext: {
    environment: process.env.ENV,
    version: process.env.SERVICE_VERSION
  }
});

class WorkflowExecutor {
  // ... other methods
  
  async executeWorkflow(workflow) {
    const startTime = Date.now();
    const context = getWorkflowContext(workflow);
    
    logger.info(`Starting workflow execution`, {
      ...context,
      inputParameters: workflow.input,
      expectedDuration: workflow.definition.expectedDuration
    });
    
    try {
      // Execute workflow steps
      for (const step of workflow.definition.steps) {
        await this.executeWorkflowStep(workflow, step, context);
      }
      
      const executionTime = Date.now() - startTime;
      logger.info(`Workflow execution completed successfully`, {
        ...context,
        executionTimeMs: executionTime,
        outputData: workflow.output
      });
      
      return workflow.output;
    } catch (error) {
      logger.error(`Workflow execution failed`, {
        ...context,
        error: error.message,
        errorCode: error.code,
        errorStep: workflow.currentStep,
        executionTimeMs: Date.now() - startTime
      });
      
      throw error;
    }
  }
  
  async executeWorkflowStep(workflow, step, context) {
    logger.info(`Executing workflow step`, {
      ...context,
      stepId: step.id,
      stepName: step.name,
      stepType: step.type
    });
    
    try {
      // Step execution logic
      
      logger.info(`Workflow step completed`, {
        ...context,
        stepId: step.id,
        stepName: step.name,
        stepDurationMs: stepDuration
      });
    } catch (error) {
      logger.error(`Workflow step failed`, {
        ...context,
        stepId: step.id,
        stepName: step.name,
        error: error.message,
        retryAttempt: step.retryCount || 0
      });
      
      // Handle retry or failure
    }
  }
}
```

## Metrics Integration

Key metrics from the Workflow Orchestrator sent to the Observability Service:

| Metric Name | Type | Description |
|-------------|------|-------------|
| `workflow_orchestrator_workflow_started_total` | Counter | Total workflows started, tagged by workflow name and version |
| `workflow_orchestrator_workflow_completed_total` | Counter | Completed workflows, tagged by workflow name and status (success/failure) |
| `workflow_orchestrator_workflow_duration_ms` | Histogram | Workflow execution duration |
| `workflow_orchestrator_step_duration_ms` | Histogram | Duration of individual workflow steps, tagged by step type |
| `workflow_orchestrator_step_retry_total` | Counter | Number of workflow step retries |
| `workflow_orchestrator_workflow_active` | Gauge | Currently running workflows |
| `workflow_orchestrator_workflow_delayed` | Gauge | Workflows waiting for execution |
| `workflow_orchestrator_task_queue_size` | Gauge | Size of the task queues, tagged by queue name |
| `workflow_orchestrator_workflow_timeout_total` | Counter | Workflows terminated due to timeout |

Example metric recording:

```typescript
import { metrics } from '@augmented-os/observability-sdk';

// During workflow lifecycle events
function recordWorkflowMetrics(workflow, event, additionalTags = {}) {
  const tags = {
    workflow_name: workflow.definition.name,
    workflow_version: workflow.definition.version,
    status: workflow.status,
    ...additionalTags
  };
  
  switch (event) {
    case 'start':
      metrics.increment('workflow_orchestrator_workflow_started_total', 1, tags);
      metrics.gauge('workflow_orchestrator_workflow_active', getActiveWorkflowCount(), tags);
      break;
      
    case 'complete':
      metrics.increment('workflow_orchestrator_workflow_completed_total', 1, tags);
      metrics.gauge('workflow_orchestrator_workflow_active', getActiveWorkflowCount(), tags);
      const duration = Date.now() - new Date(workflow.startedAt).getTime();
      metrics.histogram('workflow_orchestrator_workflow_duration_ms', duration, tags);
      break;
      
    case 'step_complete':
      metrics.histogram('workflow_orchestrator_step_duration_ms', additionalTags.stepDuration, {
        ...tags,
        step_name: additionalTags.stepName,
        step_type: additionalTags.stepType
      });
      break;
      
    case 'retry':
      metrics.increment('workflow_orchestrator_step_retry_total', 1, {
        ...tags,
        step_name: additionalTags.stepName,
        reason: additionalTags.reason
      });
      break;
  }
}
```

## Distributed Tracing Integration

The Workflow Orchestrator implements distributed tracing to track workflow execution across services:

```typescript
import { tracer } from '@augmented-os/observability-sdk';

// Initialize tracer
tracer.init({
  service: 'workflow-orchestrator',
  observabilityEndpoint: config.observability.endpoint
});

class TracedWorkflowExecutor {
  // Main workflow execution method with tracing
  async executeWorkflow(workflow) {
    // Extract existing trace context if this is part of a larger trace
    const parentContext = workflow.traceContext || null;
    
    // Create the main workflow span
    const workflowSpan = tracer.startSpan('execute_workflow', {
      parentContext,
      tags: {
        'workflow.name': workflow.definition.name,
        'workflow.version': workflow.definition.version,
        'workflow.id': workflow.id,
        'workflow.run_id': workflow.runId,
        'workflow.correlation_id': workflow.correlationId
      }
    });
    
    try {
      // Set workflow span as active for this execution
      return await tracer.withActiveSpan(workflowSpan, async () => {
        // Execute the workflow steps in sequence
        for (const step of workflow.definition.steps) {
          await this.executeWorkflowStep(workflow, step, workflowSpan);
        }
        
        // Add workflow output to span
        workflowSpan.setTag('workflow.status', 'completed');
        workflowSpan.setTag('workflow.output.size', JSON.stringify(workflow.output).length);
        
        return workflow.output;
      });
    } catch (error) {
      // Record error details in the span
      workflowSpan.setTag('error', true);
      workflowSpan.setTag('error.message', error.message);
      workflowSpan.setTag('error.step', workflow.currentStep?.id);
      throw error;
    } finally {
      // Ensure span is finished regardless of outcome
      workflowSpan.finish();
    }
  }
  
  // Execute a single workflow step with its own span
  async executeWorkflowStep(workflow, step, parentSpan) {
    const stepSpan = tracer.startSpan('execute_workflow_step', {
      parentSpan,
      tags: {
        'workflow.step.name': step.name,
        'workflow.step.id': step.id,
        'workflow.step.type': step.type
      }
    });
    
    try {
      // If step calls an external service, propagate trace context
      if (step.type === 'service_task') {
        // Create headers with trace context for external service
        const traceHeaders = {};
        tracer.inject(stepSpan.context(), 'http_headers', traceHeaders);
        
        // Include trace headers in service call
        const result = await callExternalService(step.service, step.operation, step.input, traceHeaders);
        
        stepSpan.setTag('workflow.step.status', 'completed');
        return result;
      }
      
      // Other step execution logic
      return stepResult;
    } catch (error) {
      stepSpan.setTag('error', true);
      stepSpan.setTag('error.message', error.message);
      
      // If retry is configured
      if (step.retry && step.retryCount < step.retry.maxAttempts) {
        stepSpan.setTag('workflow.step.retry', true);
        stepSpan.setTag('workflow.step.retry_count', step.retryCount);
      }
      
      throw error;
    } finally {
      stepSpan.finish();
    }
  }
}
```

## Workflow Execution Visualization

The Observability Service provides specialized visualizations for workflow execution:

1. **Workflow DAG Visualization**: Renders workflow execution as a directed acyclic graph
2. **Step Timeline View**: Shows step execution in a Gantt chart-like timeline
3. **Service Dependency View**: Maps which services a workflow interacts with

Example trace visualization for a complex workflow:

```
[Workflow: payment-processing v1.2]
├─ [Step: validate-payment] 10ms
├─ [Step: calculate-fees] 25ms
├─ [Step: process-payment]
│  ├─ [HTTP: payment-service/transactions] 150ms
│  └─ [Retry: payment-service/transactions] 120ms
├─ [Step: update-account]
│  └─ [HTTP: account-service/balance] 45ms
└─ [Step: send-receipt]
   └─ [HTTP: notification-service/email] 80ms
```

## Dashboards and Alerts

The Workflow Orchestrator has pre-configured dashboards and alerts in the Observability Service:

### Dashboards

1. **Workflow Orchestrator Overview** - General service health and performance
2. **Workflow Execution Analytics** - Success rates, durations, and throughput by workflow type
3. **Workflow Step Performance** - Detailed view of step execution time and errors
4. **Service Task Analysis** - Performance of calls to external services
5. **Critical Workflows Status** - Focused view of high-priority workflows

### Pre-configured Alerts

| Alert Name | Description | Severity | Notification Channels |
|------------|-------------|----------|----------------------|
| Workflow Orchestrator Service Down | Triggers when service is unreachable | Critical | Slack, PagerDuty |
| Workflow Success Rate Low | Triggers when workflow failure rate exceeds threshold | Warning | Slack |
| Workflow Execution Time High | Triggers when workflows exceed expected execution time | Warning | Slack |
| Critical Workflow Failure | Triggers when specific high-priority workflows fail | Critical | Slack, PagerDuty |
| Task Queue Backlog | Triggers when task queue size grows beyond threshold | Warning | Slack |
| Step Retry Rate High | Triggers when steps have excessive retry rates | Warning | Slack |

## Related Documentation

* [Workflow Orchestrator Overview](../overview.md)
* [Workflow Monitoring](./monitoring.md)
* [Workflow Definition Guide](../workflow_definition.md)
* [Observability Service Overview](../../observability_service/overview.md)
* [Observability Schema Definitions](../../../schemas/observability/schema_definitions.md) 