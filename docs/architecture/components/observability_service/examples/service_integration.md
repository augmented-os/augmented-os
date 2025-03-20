# Observability Service Integration Examples

This document provides examples of how to integrate various Augmented OS services with the Observability Service.

## Auth Service Integration Example

The following example illustrates how to integrate the Auth Service with the Observability Service:

1. Configure Auth Service to send logs, metrics, and traces
2. Add authentication to Observability Service API calls
3. Create service-specific dashboards

### Integration Configuration

```json
{
  "service": "auth-service",
  "observability": {
    "endpoint": "https://api.example.com/observability",
    "auth": {
      "type": "service-account",
      "id": "auth-service-monitor"
    },
    "logging": {
      "level": "INFO",
      "batching": {
        "maxItems": 100,
        "maxIntervalMs": 5000
      }
    },
    "metrics": {
      "prefix": "auth",
      "defaultLabels": {
        "service": "auth-service",
        "environment": "${ENV}"
      },
      "reportingIntervalMs": 15000
    },
    "tracing": {
      "sampleRate": 0.1,
      "propagation": "w3c"
    }
  }
}
```

### Auth Service Code Example

```typescript
// auth-service/src/observability.ts
import { ObservabilityClient } from '@augmented-os/observability-sdk';
import { config } from './config';

// Create singleton client
export const observability = new ObservabilityClient({
  apiKey: process.env.OBSERVABILITY_API_KEY,
  baseUrl: config.observability.endpoint,
  defaultLabels: config.observability.metrics.defaultLabels,
  service: config.service
});

// Set up middleware for Express-based APIs
export function setupObservabilityMiddleware(app) {
  // Request logging middleware
  app.use((req, res, next) => {
    const startTime = Date.now();
    const requestId = req.headers['x-request-id'] || generateUUID();
    
    // Add trace context
    req.traceContext = {
      requestId,
      traceId: req.headers['x-trace-id'] || requestId,
      spanId: generateUUID()
    };
    
    // Add request logger to context
    req.logger = observability.createLogger({
      context: {
        requestId: req.traceContext.requestId,
        userId: req.user?.id,
        path: req.path,
        method: req.method
      }
    });
    
    // Log request received
    req.logger.info(`Request received: ${req.method} ${req.path}`);
    
    // Response handler
    const originalSend = res.send;
    res.send = function(body) {
      const duration = Date.now() - startTime;
      
      // Log response
      req.logger.info(`Response sent: ${res.statusCode}`, { duration });
      
      // Record metrics
      observability.recordMetric({
        name: 'http_request_duration_ms',
        value: duration,
        tags: {
          path: req.path,
          method: req.method,
          status_code: res.statusCode.toString()
        }
      });
      
      // Send trace span
      observability.sendTrace({
        traceId: req.traceContext.traceId,
        spanId: req.traceContext.spanId,
        service: config.service,
        operation: `${req.method} ${req.path}`,
        startTime: new Date(startTime),
        endTime: new Date(),
        tags: {
          requestId: req.traceContext.requestId,
          userId: req.user?.id,
          statusCode: res.statusCode
        }
      });
      
      return originalSend.call(this, body);
    };
    
    next();
  });
}
```

### Usage in Auth Service API endpoints

```typescript
// auth-service/src/routes/auth.ts
import { Router } from 'express';
import { observability } from '../observability';

const router = Router();

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Log login attempt
    req.logger.info('Login attempt', { username });
    
    // Start a new span for credential verification
    const verifySpanId = generateUUID();
    const verifySpanStart = Date.now();
    
    // Verify credentials
    const user = await verifyCredentials(username, password);
    
    // End credential verification span
    observability.sendTrace({
      traceId: req.traceContext.traceId,
      spanId: verifySpanId,
      parentId: req.traceContext.spanId,
      service: 'auth-service',
      operation: 'verify_credentials',
      startTime: new Date(verifySpanStart),
      endTime: new Date(),
      tags: {
        requestId: req.traceContext.requestId,
        username
      }
    });
    
    if (user) {
      // Log successful login
      req.logger.info('Login successful', { userId: user.id });
      
      // Record login success metric
      observability.recordMetric({
        name: 'login_success_total',
        value: 1,
        tags: {
          method: 'username_password'
        }
      });
      
      // Generate token and respond
      const token = generateToken(user);
      res.json({ token });
    } else {
      // Log failed login
      req.logger.warn('Login failed: invalid credentials', { username });
      
      // Record login failure metric
      observability.recordMetric({
        name: 'login_failure_total',
        value: 1,
        tags: {
          method: 'username_password',
          reason: 'invalid_credentials'
        }
      });
      
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    // Log error
    req.logger.error('Login error', { 
      error: error.message,
      stack: error.stack
    });
    
    // Record error metric
    observability.recordMetric({
      name: 'login_error_total',
      value: 1,
      tags: {
        error_type: error.name
      }
    });
    
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
```

## Workflow Orchestrator Integration Example

The following example shows how to integrate the Workflow Orchestrator Service with the Observability Service.

### Workflow Execution Tracking

```typescript
// workflow-orchestrator/src/engine/executor.ts
import { observability } from '../observability';

export class WorkflowExecutor {
  async executeWorkflow(workflowId, input) {
    const workflowStart = Date.now();
    const traceId = generateUUID();
    const rootSpanId = generateUUID();
    
    // Create workflow-specific logger
    const logger = observability.createLogger({
      context: {
        workflowId,
        traceId
      }
    });
    
    logger.info('Starting workflow execution', { input });
    
    try {
      // Load workflow definition
      const workflow = await this.workflowRepo.getById(workflowId);
      
      // Track workflow execution as a trace
      const workflowContext = {
        traceId,
        spanId: rootSpanId,
        workflowId,
        executionId: generateUUID()
      };
      
      // Execute workflow steps
      const result = await this.executeWorkflowSteps(workflow, input, workflowContext);
      
      // Record execution time
      const duration = Date.now() - workflowStart;
      observability.recordMetric({
        name: 'workflow_execution_duration_ms',
        value: duration,
        tags: {
          workflow_id: workflowId,
          status: 'success'
        }
      });
      
      // Complete the root span
      observability.sendTrace({
        traceId: workflowContext.traceId,
        spanId: workflowContext.spanId,
        service: 'workflow-orchestrator',
        operation: `execute_workflow:${workflowId}`,
        startTime: new Date(workflowStart),
        endTime: new Date(),
        tags: {
          workflowId,
          executionId: workflowContext.executionId,
          status: 'success',
          stepCount: workflow.steps.length
        }
      });
      
      logger.info('Workflow execution completed', { 
        executionId: workflowContext.executionId,
        duration
      });
      
      return result;
    } catch (error) {
      // Record failure
      const duration = Date.now() - workflowStart;
      observability.recordMetric({
        name: 'workflow_execution_duration_ms',
        value: duration,
        tags: {
          workflow_id: workflowId,
          status: 'error',
          error_type: error.name
        }
      });
      
      // Send error span
      observability.sendTrace({
        traceId,
        spanId: rootSpanId,
        service: 'workflow-orchestrator',
        operation: `execute_workflow:${workflowId}`,
        startTime: new Date(workflowStart),
        endTime: new Date(),
        tags: {
          workflowId,
          status: 'error',
          error: error.message
        }
      });
      
      logger.error('Workflow execution failed', {
        error: error.message,
        stack: error.stack
      });
      
      throw error;
    }
  }
  
  // Execute individual workflow steps with tracing
  async executeWorkflowSteps(workflow, input, context) {
    // Implementation details...
  }
}
```

## Event Processing Service Integration Example

This example demonstrates how the Event Processing Service integrates with Observability:

```typescript
// event-processing/src/observability-integration.ts
import { observability } from './observability';
import { eventBus } from './event-bus';

// Set up observability event publisher
export function setupObservabilityEventForwarding() {
  // Subscribe to all system events
  eventBus.subscribeToPattern('system.*', async (event) => {
    // Log all system events
    observability.logger.info(`System event received: ${event.type}`, {
      eventId: event.id,
      eventType: event.type,
      source: event.source
    });
    
    // Record event metrics
    observability.recordMetric({
      name: 'events_processed_total',
      value: 1,
      tags: {
        event_type: event.type,
        source: event.source
      }
    });
  });
  
  // Forward service health events to observability
  eventBus.subscribeToPattern('service.health.*', async (event) => {
    // Extract health information
    const { service, status, details } = event.payload;
    
    // Record service health metric
    observability.recordMetric({
      name: 'service_health_status',
      value: status === 'healthy' ? 1 : 0,
      tags: {
        service,
        status
      }
    });
    
    // If unhealthy, send additional detailed metrics
    if (status !== 'healthy' && details) {
      for (const [key, value] of Object.entries(details)) {
        if (typeof value === 'number') {
          observability.recordMetric({
            name: `service_health_${key}`,
            value,
            tags: {
              service
            }
          });
        }
      }
    }
  });
  
  // Create bidirectional integration by publishing metrics as events
  observability.on('threshold_exceeded', (metric) => {
    eventBus.publish({
      type: 'observability.threshold_exceeded',
      source: 'observability-service',
      payload: {
        metric: metric.name,
        value: metric.value,
        threshold: metric.threshold,
        tags: metric.tags
      }
    });
  });
}
```

## Common Integration Patterns

Here are common patterns for integrating services with the Observability Service:

### 1. Request Lifecycle Tracking

Track the entire lifecycle of a request as it moves through different services:

1. Assign a unique trace ID on entry point
2. Pass the trace ID through service boundaries
3. Create a trace span for each service interaction
4. Record service-specific metrics and logs with the trace ID for correlation

### 2. Batch Processing Monitoring

For batch processing jobs:

1. Create a unique trace for each batch
2. Record the number of items in each batch
3. Track processing time for each item
4. Log summary statistics when batch completes
5. Alert on failure rates above threshold

### 3. Service Health Reporting

Implement consistent health reporting:

1. Regularly report service health metrics
2. Include resource usage metrics (CPU, memory, connections)
3. Report custom health indicators specific to each service
4. Use consistent naming patterns for health metrics

## Implementation Best Practices

When integrating services with the Observability Service:

1. **Use consistent naming**: Follow standardized naming conventions for metrics, logs, and traces
2. **Add context to logs**: Always include relevant identifiers (request ID, user ID, etc.) in log context
3. **Batch metrics**: Send metrics in batches to reduce network overhead
4. **Sample traces**: Use appropriate sampling for high-throughput services
5. **Handle failures gracefully**: Ensure observability failures don't affect the main service functionality

## Related Documentation

* [Basic Example](./basic_example.md)
* [Advanced Examples](./advanced_example.md)
* [API Reference](../interfaces/api.md)
* [Auth Service Monitoring](../../auth_service/operations/monitoring.md)
* [Workflow Orchestrator Service](../../workflow_orchestrator_service/README.md)
* [Event Processing Service](../../event_processing_service/overview.md) 