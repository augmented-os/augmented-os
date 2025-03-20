# Basic Observability Service Example

This document provides a simple example of how to use the Observability Service for common use cases.

## Sending Logs Example

The following example illustrates how to send logs to the Observability Service:


1. Initialize the logging client
2. Configure log context
3. Send log entries to the Observability Service

### Log Entry Format

```json
{
  "timestamp": "2023-10-21T14:30:00.123Z",
  "level": "INFO",
  "service": "auth-service",
  "message": "User successfully logged in",
  "context": {
    "userId": "user-123",
    "source": "web-client",
    "requestId": "req-abc-123",
    "duration": 45
  }
}
```

### API Request

```bash
curl -X POST https://api.example.com/observability/logs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token" \
  -d '{
    "timestamp": "2023-10-21T14:30:00.123Z",
    "level": "INFO",
    "service": "auth-service",
    "message": "User successfully logged in",
    "context": {
      "userId": "user-123",
      "source": "web-client",
      "requestId": "req-abc-123",
      "duration": 45
    }
  }'
```

### Response

```json
{
  "id": "log-entry-12345",
  "status": "ACCEPTED",
  "timestamp": "2023-10-21T14:30:00.543Z"
}
```

## Sending Metrics Example

The following example shows how to send metrics to the Observability Service:

### Metric Request

```bash
curl -X POST https://api.example.com/observability/metrics \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token" \
  -d '{
    "name": "http_request_duration_ms",
    "timestamp": "2023-10-21T14:30:00.000Z",
    "value": 45.2,
    "tags": {
      "service": "auth-service",
      "endpoint": "/api/v1/login",
      "method": "POST",
      "status_code": "200"
    }
  }'
```

### Response

```json
{
  "id": "metric-67890",
  "status": "ACCEPTED",
  "timestamp": "2023-10-21T14:30:00.543Z"
}
```

## Sending Traces Example

```bash
curl -X POST https://api.example.com/observability/traces \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token" \
  -d '{
    "traceId": "trace-abc-123",
    "spanId": "span-def-456",
    "parentId": null,
    "service": "auth-service",
    "operation": "verify_credentials",
    "startTime": "2023-10-21T14:30:00.000Z",
    "endTime": "2023-10-21T14:30:00.045Z",
    "tags": {
      "userId": "user-123",
      "requestId": "req-abc-123"
    }
  }'
```

### Response

```json
{
  "id": "span-def-456",
  "status": "ACCEPTED",
  "timestamp": "2023-10-21T14:30:00.543Z"
}
```

## Code Examples

### JavaScript/TypeScript Example

```typescript
import { ObservabilityClient } from '@augmented-os/observability-sdk';

async function logUserActivity() {
  // Initialize the client
  const client = new ObservabilityClient({
    apiKey: 'your-api-key',
    baseUrl: 'https://api.example.com/observability'
  });

  // Send logs
  await client.sendLog({
    level: 'INFO',
    service: 'auth-service',
    message: 'User successfully logged in',
    context: {
      userId: 'user-123',
      source: 'web-client',
      requestId: 'req-abc-123',
      duration: 45
    }
  });

  // Send metrics
  await client.sendMetric({
    name: 'http_request_duration_ms',
    value: 45.2,
    tags: {
      service: 'auth-service',
      endpoint: '/api/v1/login',
      method: 'POST',
      status_code: '200'
    }
  });

  // Send trace span
  await client.sendTrace({
    traceId: 'trace-abc-123',
    spanId: 'span-def-456',
    parentId: null,
    service: 'auth-service',
    operation: 'verify_credentials',
    startTime: new Date(),
    endTime: new Date(Date.now() + 45),
    tags: {
      userId: 'user-123',
      requestId: 'req-abc-123'
    }
  });

  // Query logs
  const logs = await client.queryLogs({
    service: 'auth-service',
    level: 'INFO',
    startTime: new Date(Date.now() - 3600000), // last hour
    endTime: new Date(),
    limit: 100
  });

  console.log('Recent logs:', logs);
}

logUserActivity().catch(console.error);
```

### Python Example

```python
from augmented_os.observability import ObservabilityClient
from datetime import datetime, timedelta

# Initialize the client
client = ObservabilityClient(
    api_key="your-api-key",
    base_url="https://api.example.com/observability"
)

# Send logs
client.send_log(
    level="INFO",
    service="auth-service",
    message="User successfully logged in",
    context={
        "userId": "user-123",
        "source": "web-client",
        "requestId": "req-abc-123",
        "duration": 45
    }
)

# Send metrics
client.send_metric(
    name="http_request_duration_ms",
    value=45.2,
    tags={
        "service": "auth-service",
        "endpoint": "/api/v1/login",
        "method": "POST",
        "status_code": "200"
    }
)

# Send trace span
client.send_trace(
    trace_id="trace-abc-123",
    span_id="span-def-456",
    parent_id=None,
    service="auth-service",
    operation="verify_credentials",
    start_time=datetime.now(),
    end_time=datetime.now() + timedelta(milliseconds=45),
    tags={
        "userId": "user-123",
        "requestId": "req-abc-123"
    }
)

# Query logs
logs = client.query_logs(
    service="auth-service",
    level="INFO",
    start_time=datetime.now() - timedelta(hours=1),
    end_time=datetime.now(),
    limit=100
)

print(f"Recent logs: {logs}")
```

## Common Errors and Troubleshooting

| Error Code | Description | Solution |
|----|----|----|
| `RATE_LIMITED` | Too many requests sent in a short period | Implement batching or reduce request frequency |
| `INVALID_FORMAT` | Log/metric/trace data does not match schema | Check the data structure against documentation |
| `AUTHENTICATION_ERROR` | Invalid or expired API token | Regenerate your API token in the dashboard |

## Next Steps

Once you've mastered these basic examples, you can:


1. Explore [advanced examples](./advanced_example.md) for alerts and dashboards
2. Review the [API Reference](../interfaces/api.md) for all available operations
3. Learn about [service integration patterns](./service_integration.md) for common services

## Related Documentation

* [Overview](../overview.md)
* [API Reference](../interfaces/api.md)
* [Advanced Examples](./advanced_example.md)
* [Service Integration](./service_integration.md)


