# Auth Service Integration with Observability Service

## Overview

This document describes how the Auth Service integrates with the Observability Service for centralized logging, metrics collection, and distributed tracing.

## Integration Setup

The Auth Service should be configured to send all observability data to the Observability Service using the following configuration:

```json
{
  "observability": {
    "endpoint": "https://api.example.com/observability",
    "auth": {
      "type": "service-account",
      "id": "auth-service-monitor",
      "secret": "${AUTH_SERVICE_MONITOR_SECRET}"
    },
    "logging": {
      "level": "INFO",
      "format": "json",
      "batch_size": 100,
      "flush_interval_ms": 5000
    },
    "metrics": {
      "push_interval_ms": 15000,
      "prefix": "auth",
      "tags": {
        "service": "auth-service",
        "environment": "${ENV}"
      }
    },
    "tracing": {
      "sample_rate": 0.1,
      "propagation_format": "w3c"
    }
  }
}
```

## Logging Integration

The Auth Service sends all logs to the Observability Service. The key events described in the [Monitoring Guidelines](./monitoring.md) are sent with appropriate context information to facilitate correlation and analysis.

### Example Log Integration

```typescript
// Initialize the logger with Observability Service integration
import { createLogger } from '@augmented-os/observability-sdk';

const logger = createLogger({
  service: 'auth-service',
  observabilityEndpoint: config.observability.endpoint,
  defaultContext: {
    environment: process.env.ENV,
    version: process.env.SERVICE_VERSION
  }
});

// Later in the authentication code:
try {
  const result = await authenticateUser(username, password);
  if (result.success) {
    logger.info('User login successful', {
      userId: result.userId,
      authMethod: 'password',
      requestId: requestContext.id,
      ipAddress: request.ip,
      userAgent: request.headers['user-agent']
    });
  } else {
    logger.warn('User login failed', {
      username, // We log username for failed attempts only
      reason: result.reason,
      attemptCount: result.attemptCount,
      requestId: requestContext.id,
      ipAddress: request.ip
    });
  }
} catch (error) {
  logger.error('Authentication error', {
    error: error.message,
    stack: error.stack,
    requestId: requestContext.id
  });
}
```

## Metrics Integration

All metrics listed in the [Monitoring Guidelines](./monitoring.md) are automatically collected and sent to the Observability Service. This includes:

* Authentication metrics (login attempts, success/failure rates)
* Token management metrics
* User management metrics
* Database metrics
* External service metrics

### Example Metrics Integration

```typescript
import { metrics } from '@augmented-os/observability-sdk';

// Initialize metrics with Observability Service integration
metrics.init({
  service: 'auth-service',
  observabilityEndpoint: config.observability.endpoint,
  defaultTags: {
    environment: process.env.ENV,
    version: process.env.SERVICE_VERSION
  }
});

// Inside the login handler:
async function handleLogin(req, res) {
  const startTime = Date.now();
  let success = false;
  let failureReason = null;
  
  try {
    // Increment login attempt counter
    metrics.increment('auth_login_attempts_total', 1, {
      method: req.body.authMethod || 'password'
    });
    
    // Authentication logic
    const result = await authenticateUser(req.body.username, req.body.password);
    
    if (result.success) {
      // Increment success counter
      metrics.increment('auth_login_success_total', 1, {
        method: req.body.authMethod || 'password'
      });
      success = true;
    } else {
      // Increment failure counter with reason tag
      metrics.increment('auth_login_failure_total', 1, {
        method: req.body.authMethod || 'password',
        reason: result.reason
      });
      failureReason = result.reason;
    }
    
    return result;
  } finally {
    // Record login timing
    const duration = Date.now() - startTime;
    metrics.recordTimer('auth_login_time_seconds', duration / 1000, {
      success: String(success),
      reason: failureReason || 'none'
    });
  }
}
```

## Distributed Tracing Integration

The Auth Service implements distributed tracing to track requests across service boundaries. This is particularly important for operations like:

* Social authentication flows involving external providers
* Complex permission checks involving multiple services
* User provisioning workflows across systems

### Example Tracing Integration

```typescript
import { tracer } from '@augmented-os/observability-sdk';

// Initialize tracer with Observability Service integration
tracer.init({
  service: 'auth-service',
  observabilityEndpoint: config.observability.endpoint
});

// Middleware to create trace context for requests
app.use((req, res, next) => {
  // Extract trace context from headers if present, or create new
  const parentContext = tracer.extractContextFromHeaders(req.headers);
  const span = tracer.startSpan('http_request', {
    parentContext,
    tags: {
      http_method: req.method,
      http_url: req.url,
      http_path: req.path
    }
  });
  
  // Attach to request context
  req.traceContext = {
    span,
    traceId: span.traceId
  };
  
  // Ensure span is ended when request completes
  res.on('finish', () => {
    span.setTag('http_status_code', res.statusCode);
    span.finish();
  });
  
  next();
});

// Inside handler functions, create child spans for specific operations
async function validateToken(token, req) {
  const parentSpan = req.traceContext.span;
  const span = tracer.startSpan('validate_token', { parentSpan });
  
  try {
    span.setTag('token_type', token.type);
    
    const result = await tokenService.validate(token.value);
    
    span.setTag('token_valid', result.valid);
    if (!result.valid) {
      span.setTag('error', true);
      span.setTag('error_reason', result.reason);
    }
    
    return result;
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

The Auth Service has pre-configured dashboards and alerts in the Observability Service:


1. **Auth Service Dashboard** - Shows key metrics, logs, and traces in a unified view
2. **Auth Service Security Dashboard** - Focused on security-related metrics and anomalies
3. **Auth Service SLA Dashboard** - Tracks performance against service level agreements

### Pre-Configured Alerts

| Alert Name | Description | Severity | Notification Channels |
|----|----|----|----|
| Auth Service High Login Failure Rate | Triggers when login failures exceed 20% over 5 minutes | Critical | Slack, PagerDuty |
| Auth Service Latency | Triggers when P95 login time exceeds 500ms | Warning | Slack |
| Auth Service Error Rate | Triggers when error rate exceeds 1% of requests | Warning | Slack |
| Auth Service Down | Triggers when service is unreachable | Critical | Slack, PagerDuty, SMS |

## Related Documentation

* [Monitoring Guidelines](./monitoring.md)
* [Observability Service Overview](../../observability_service/overview.md)
* [Observability Service Integration Examples](../../observability_service/examples/service_integration.md)
* [Observability Schema Definitions](../../../schemas/observability/schema_definitions.md)


