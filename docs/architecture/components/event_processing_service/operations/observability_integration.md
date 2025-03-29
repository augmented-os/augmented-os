# Event Processing Service Integration with Observability Service

## Overview

This document describes how the Event Processing Service integrates with the Observability Service for centralized logging, metrics collection, and distributed tracing. This integration is particularly important as the Event Processing Service is a critical component that processes system-wide events and needs comprehensive monitoring.

## Bidirectional Integration

The Event Processing Service has a unique bidirectional relationship with the Observability Service:

1. **Standard Integration**: Like other services, it sends logs, metrics, and traces to the Observability Service
2. **Event Publication**: It receives event notifications from the Observability Service for alert conditions
3. **Event Subscription**: It forwards certain system events to the Observability Service for monitoring

## Integration Configuration

Configure the Event Processing Service to integrate with the Observability Service:

```json
{
  "observability": {
    "endpoint": "https://api.example.com/observability",
    "auth": {
      "type": "service-account",
      "id": "event-processor-monitor",
      "secret": "${EVENT_PROCESSOR_MONITOR_SECRET}"
    },
    "logging": {
      "level": "INFO",
      "format": "json",
      "batch_size": 100,
      "flush_interval_ms": 5000
    },
    "metrics": {
      "push_interval_ms": 15000,
      "prefix": "event_processing",
      "tags": {
        "service": "event-processing-service",
        "environment": "${ENV}"
      }
    },
    "tracing": {
      "sample_rate": 0.1,
      "propagation_format": "w3c"
    },
    "events": {
      "publish": ["alert.*", "metric.threshold.*"],
      "subscribe": ["system.*", "service.health.*", "workflow.failure.*"]
    }
  }
}
```

## Event Flow Integration

The Event Processing Service integrates with the Observability Service for event processing through several mechanisms:

### 1. System Event Publication

The Event Processing Service forwards relevant system events to the Observability Service:

```typescript
// Setup event forwarding to Observability Service
import { ObservabilityClient } from '@augmented-os/observability-sdk';
import { eventBus } from './event-bus';

const observability = new ObservabilityClient({
  apiKey: process.env.OBSERVABILITY_API_KEY,
  baseUrl: config.observability.endpoint
});

// Forward system events to Observability
eventBus.subscribeToPattern('system.*', async (event) => {
  // Log the event
  observability.logger.info(`System event received: ${event.type}`, {
    eventId: event.id,
    eventType: event.type,
    source: event.source
  });
  
  // Record metric for event processing
  observability.recordMetric({
    name: 'events_processed_total',
    value: 1,
    tags: {
      event_type: event.type,
      source: event.source
    }
  });
});

// Forward service health events for monitoring
eventBus.subscribeToPattern('service.health.*', async (event) => {
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
  
  // For unhealthy services, log detailed information
  if (status !== 'healthy') {
    observability.logger.warn(`Unhealthy service reported: ${service}`, {
      service,
      status,
      details,
      eventId: event.id
    });
  }
});
```

### 2. Observability Event Subscription

The Event Processing Service subscribes to events published by the Observability Service:

```typescript
// Initialize observability event handler
function setupObservabilityEventHandling() {
  // Register handler for Observability Service alerts
  observability.on('alert', (alertEvent) => {
    // Publish to the event bus
    eventBus.publish({
      type: `observability.alert.${alertEvent.severity}`,
      source: 'observability-service',
      payload: {
        alertName: alertEvent.name,
        alertId: alertEvent.id,
        severity: alertEvent.severity,
        service: alertEvent.labels?.service,
        summary: alertEvent.annotations?.summary,
        description: alertEvent.annotations?.description,
        value: alertEvent.value,
        threshold: alertEvent.threshold
      }
    });
  });
  
  // Register handler for metric threshold events
  observability.on('threshold_exceeded', (metricEvent) => {
    eventBus.publish({
      type: 'observability.metric.threshold_exceeded',
      source: 'observability-service',
      payload: {
        metric: metricEvent.metric,
        value: metricEvent.value,
        threshold: metricEvent.threshold,
        service: metricEvent.tags?.service,
        component: metricEvent.tags?.component
      }
    });
  });
}
```

## Logging Integration

The Event Processing Service sends logs to the Observability Service with all relevant context:

```typescript
import { createLogger } from '@augmented-os/observability-sdk';

const logger = createLogger({
  service: 'event-processing-service',
  observabilityEndpoint: config.observability.endpoint,
  defaultContext: {
    environment: process.env.ENV,
    version: process.env.SERVICE_VERSION
  }
});

// Event processing logs
function processEvent(event) {
  logger.info(`Processing event: ${event.type}`, {
    eventId: event.id,
    eventType: event.type,
    source: event.source,
    correlationId: event.correlationId
  });
  
  try {
    // Process event logic
    
    logger.info(`Successfully processed event: ${event.type}`, {
      eventId: event.id,
      processingTimeMs: Date.now() - processingStartTime
    });
  } catch (error) {
    logger.error(`Error processing event: ${event.type}`, {
      eventId: event.id,
      error: error.message,
      stack: error.stack
    });
    
    // Handle error appropriately
  }
}
```

## Metrics Integration

Key metrics from the Event Processing Service are sent to the Observability Service:

| Metric Name | Type | Description |
|-------------|------|-------------|
| `event_processing_received_total` | Counter | Total events received, tagged by event type and source |
| `event_processing_processed_total` | Counter | Successfully processed events |
| `event_processing_failed_total` | Counter | Failed event processing attempts |
| `event_processing_time_ms` | Histogram | Event processing duration |
| `event_processing_queue_size` | Gauge | Current number of events waiting to be processed |
| `event_processing_dead_letter_total` | Counter | Events sent to dead letter queue |
| `event_processing_retry_total` | Counter | Event processing retry attempts |
| `event_processing_active_subscribers` | Gauge | Current number of active event subscribers |

## Distributed Tracing Integration

The Event Processing Service implements distributed tracing to track event flows across the system:

```typescript
import { tracer } from '@augmented-os/observability-sdk';

// Initialize tracer
tracer.init({
  service: 'event-processing-service',
  observabilityEndpoint: config.observability.endpoint
});

// Process event with tracing
async function processEventWithTracing(event) {
  // Extract trace context from event if present, or create new
  const parentContext = event.traceContext || null;
  const span = tracer.startSpan('process_event', {
    parentContext,
    tags: {
      event_type: event.type,
      event_id: event.id,
      event_source: event.source
    }
  });
  
  try {
    // Process event steps
    await processEventStep1(event, span);
    await processEventStep2(event, span);
    
    // Mark as successful
    span.setTag('success', true);
    return result;
  } catch (error) {
    // Record error in trace
    span.setTag('error', true);
    span.setTag('error_message', error.message);
    throw error;
  } finally {
    span.finish();
  }
}

// Process event step with child span
async function processEventStep1(event, parentSpan) {
  const span = tracer.startSpan('route_event_to_handlers', {
    parentSpan,
    tags: {
      event_type: event.type
    }
  });
  
  try {
    // Find handlers for this event type
    const handlers = await findEventHandlers(event.type);
    span.setTag('handler_count', handlers.length);
    
    // Additional processing logic
    return handlers;
  } catch (error) {
    span.setTag('error', true);
    span.setTag('error_message', error.message);
    throw error;
  } finally {
    span.finish();
  }
}
```

## Dashboards and Alerts

The Event Processing Service has pre-configured dashboards and alerts in the Observability Service:

### Dashboards

1. **Event Processing Overview** - Overall service health and event processing metrics
2. **Event Flow Analysis** - Visualizations of event flow rates and types
3. **Dead Letter Queue** - Monitoring for failed events
4. **Event Handler Performance** - Performance of individual event handlers

### Pre-configured Alerts

| Alert Name | Description | Severity | Notification Channels |
|------------|-------------|----------|----------------------|
| Event Processing Service Down | Triggers when service is unreachable | Critical | Slack, PagerDuty |
| Event Processing Delay | Triggers when event processing latency exceeds thresholds | Warning | Slack |
| Dead Letter Queue Growth | Triggers when dead letter queue grows rapidly | Warning | Slack |
| Event Handler Failure Rate | Triggers when specific handlers have high failure rates | Warning | Slack |
| Event Processing Stopped | Triggers when no events are being processed | Critical | Slack, PagerDuty |

## Related Documentation

* [Event Processing Service Overview](../overview.md)
* [Event Processing Monitoring](./monitoring.md)
* [Observability Service Overview](../../observability_service/overview.md)
* [Observability Service Integration Examples](../../observability_service/examples/service_integration.md)
* [Observability Schema Definitions](.././schemas/observability/schema_definitions.md) 