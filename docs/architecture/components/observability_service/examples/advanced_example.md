# Advanced Observability Service Examples

This document provides advanced examples of how to use the Observability Service for complex scenarios. These examples build on the basic usage patterns covered in the [Basic Example](./basic_example.md) document.

## Alert Configuration Example

The following example illustrates how to configure alerts in the Observability Service that demonstrates:

1. Creating alert rules with complex query conditions
2. Setting up notification channels
3. Configuring alert grouping and deduplication
4. Implementing alert escalation policies

### Alert Rule Definition

```json
{
  "id": "alert-rule-123",
  "name": "High Error Rate Alert",
  "description": "Alerts when error rate exceeds threshold",
  "version": "1.0.0",
  "properties": {
    "query": "rate(http_requests_total{status=~\"5..\", service=\"auth-service\"}[5m]) / rate(http_requests_total{service=\"auth-service\"}[5m]) > 0.05",
    "evaluation_interval": "1m",
    "duration": "5m",
    "severity": "critical",
    "advancedSettings": {
      "groupBy": ["service", "instance"],
      "silenceFor": "15m",
      "annotations": {
        "summary": "High error rate detected in {{$labels.service}}",
        "description": "Error rate is {{$value | printf \"%.2f\"}}%, which is above the threshold of 5%"
      },
      "notificationChannels": [
        {
          "name": "team-slack",
          "type": "slack",
          "enabled": true
        },
        {
          "name": "pagerduty-critical",
          "type": "pagerduty",
          "enabled": true
        }
      ]
    },
    "dependencies": [
      {
        "type": "dashboard",
        "id": "dashboard-456",
        "config": {
          "panel": "error-rate-panel",
          "timeRange": "3h"
        }
      }
    ]
  }
}
```

### Implementation Steps

#### 1. Create Alert Rule

First, create the alert rule:

```bash
curl -X POST https://api.example.com/observability/alerts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token" \
  -d '{
    "name": "High Error Rate Alert",
    "description": "Alerts when error rate exceeds threshold",
    "query": "rate(http_requests_total{status=~\"5..\", service=\"auth-service\"}[5m]) / rate(http_requests_total{service=\"auth-service\"}[5m]) > 0.05",
    "evaluation_interval": "1m",
    "duration": "5m",
    "severity": "critical"
  }'
```

This will return:

```json
{
  "id": "alert-rule-123",
  "name": "High Error Rate Alert",
  "status": "CREATED",
  "createdAt": "2023-10-21T10:15:00Z"
}
```

#### 2. Configure Notification Channels

Next, add notification channels to the alert:

```bash
curl -X PUT https://api.example.com/observability/alerts/alert-rule-123/notifications \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token" \
  -d '{
    "channels": [
      {
        "name": "team-slack",
        "type": "slack",
        "webhook_url": "https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX",
        "channel": "#alerts",
        "enabled": true
      },
      {
        "name": "pagerduty-critical",
        "type": "pagerduty",
        "integration_key": "abcdef12345",
        "enabled": true
      }
    ],
    "advancedSettings": {
      "groupBy": ["service", "instance"],
      "silenceFor": "15m"
    }
  }'
```

#### 3. Configure Alert Annotations

Then, add detailed annotations to the alert, which will:

* Customize the alert message with templating
* Add links to relevant dashboards
* Include runbook information

```bash
curl -X PUT https://api.example.com/observability/alerts/alert-rule-123/annotations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token" \
  -d '{
    "annotations": {
      "summary": "High error rate detected in {{$labels.service}}",
      "description": "Error rate is {{$value | printf "%.2f"}}%, which is above the threshold of 5%",
      "dashboard_url": "https://dashboard.example.com/d/dashboard-456?var-service={{$labels.service}}",
      "runbook_url": "https://wiki.example.com/runbooks/high-error-rate"
    }
  }'
```

#### 4. Configure Escalation Policy

Finally, configure an escalation policy:

```bash
curl -X PUT https://api.example.com/observability/alerts/alert-rule-123/escalation \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token" \
  -d '{
    "steps": [
      {
        "duration": "5m",
        "channels": ["team-slack"]
      },
      {
        "duration": "15m",
        "channels": ["team-slack", "pagerduty-critical"]
      }
    ]
  }'
```

### Complete Alert Configuration Example Code

Here's a complete JavaScript/TypeScript example that demonstrates the entire alert configuration process:

```typescript
import { ObservabilityClient } from '@augmented-os/observability-sdk';

async function configureComplexAlert() {
  // Initialize the client
  const client = new ObservabilityClient({
    apiKey: 'your-api-key',
    baseUrl: 'https://api.example.com/observability'
  });

  try {
    // Step 1: Create the alert rule
    console.log('Creating alert rule...');
    const alertRule = await client.createAlertRule({
      name: 'High Error Rate Alert',
      description: 'Alerts when error rate exceeds threshold',
      query: 'rate(http_requests_total{status=~"5..", service="auth-service"}[5m]) / rate(http_requests_total{service="auth-service"}[5m]) > 0.05',
      evaluation_interval: '1m',
      duration: '5m',
      severity: 'critical'
    });
    
    console.log(`Created alert rule with ID: ${alertRule.id}`);
    
    // Step 2: Configure notification channels
    console.log('Configuring notification channels...');
    await client.configureAlertNotifications(alertRule.id, {
      channels: [
        {
          name: 'team-slack',
          type: 'slack',
          webhook_url: 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX',
          channel: '#alerts',
          enabled: true
        },
        {
          name: 'pagerduty-critical',
          type: 'pagerduty',
          integration_key: 'abcdef12345',
          enabled: true
        }
      ],
      advancedSettings: {
        groupBy: ['service', 'instance'],
        silenceFor: '15m'
      }
    });
    
    // Step 3: Configure alert annotations
    console.log('Adding alert annotations...');
    await client.configureAlertAnnotations(alertRule.id, {
      annotations: {
        summary: 'High error rate detected in {{$labels.service}}',
        description: 'Error rate is {{$value | printf "%.2f"}}%, which is above the threshold of 5%',
        dashboard_url: 'https://dashboard.example.com/d/dashboard-456?var-service={{$labels.service}}',
        runbook_url: 'https://wiki.example.com/runbooks/high-error-rate'
      }
    });
    
    // Step 4: Configure escalation policy
    console.log('Setting up escalation policy...');
    const result = await client.configureAlertEscalation(alertRule.id, {
      steps: [
        {
          duration: '5m',
          channels: ['team-slack']
        },
        {
          duration: '15m',
          channels: ['team-slack', 'pagerduty-critical']
        }
      ]
    });
    
    console.log('Alert configuration completed successfully');
    
    // Additional: Test the alert rule
    const testResult = await client.testAlertRule(alertRule.id);
    console.log('Alert rule test result:', testResult);
    
  } catch (error) {
    console.error('Error during alert configuration:', error.message);
    // Implement appropriate error handling
  }
}

configureComplexAlert().catch(console.error);
```

## Dashboard Configuration Example

This example demonstrates how to create and configure observability dashboards:

### Dashboard Definition

```json
{
  "id": "dashboard-456",
  "name": "Auth Service Overview",
  "description": "Comprehensive view of Auth Service health and performance",
  "tags": ["auth-service", "production"],
  "panels": [
    {
      "id": "panel-1",
      "title": "Request Rate",
      "type": "graph",
      "query": "sum(rate(http_requests_total{service=\"auth-service\"}[5m])) by (endpoint)",
      "position": {"x": 0, "y": 0, "w": 12, "h": 8},
      "visualization": {
        "type": "line",
        "legend": true,
        "yAxis": {"format": "ops"}
      }
    },
    {
      "id": "panel-2",
      "title": "Error Rate",
      "type": "graph",
      "query": "sum(rate(http_requests_total{status=~\"5..\", service=\"auth-service\"}[5m])) by (endpoint) / sum(rate(http_requests_total{service=\"auth-service\"}[5m])) by (endpoint)",
      "position": {"x": 12, "y": 0, "w": 12, "h": 8},
      "visualization": {
        "type": "line",
        "legend": true,
        "yAxis": {"format": "percentunit", "max": 1}
      },
      "thresholds": [
        {"value": 0.01, "color": "yellow"},
        {"value": 0.05, "color": "red"}
      ]
    },
    {
      "id": "panel-3",
      "title": "Response Time (p95)",
      "type": "graph",
      "query": "histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket{service=\"auth-service\"}[5m])) by (le, endpoint))",
      "position": {"x": 0, "y": 8, "w": 12, "h": 8},
      "visualization": {
        "type": "line",
        "legend": true,
        "yAxis": {"format": "s"}
      }
    },
    {
      "id": "panel-4",
      "title": "Recent Auth Errors",
      "type": "logs",
      "query": "{service=\"auth-service\", level=\"ERROR\"}",
      "position": {"x": 12, "y": 8, "w": 12, "h": 8},
      "visualization": {
        "type": "logs",
        "showTime": true,
        "showLabels": ["level", "endpoint"]
      }
    }
  ]
}
```

### Creating a Dashboard

```typescript
import { ObservabilityClient } from '@augmented-os/observability-sdk';

async function createAuthServiceDashboard() {
  // Initialize the client
  const client = new ObservabilityClient({
    apiKey: 'your-api-key',
    baseUrl: 'https://api.example.com/observability'
  });
  
  try {
    // Create the dashboard
    const dashboard = await client.createDashboard({
      name: 'Auth Service Overview',
      description: 'Comprehensive view of Auth Service health and performance',
      tags: ['auth-service', 'production'],
      panels: [
        {
          title: 'Request Rate',
          type: 'graph',
          query: 'sum(rate(http_requests_total{service="auth-service"}[5m])) by (endpoint)',
          position: {x: 0, y: 0, w: 12, h: 8},
          visualization: {
            type: 'line',
            legend: true,
            yAxis: {format: 'ops'}
          }
        },
        {
          title: 'Error Rate',
          type: 'graph',
          query: 'sum(rate(http_requests_total{status=~"5..", service="auth-service"}[5m])) by (endpoint) / sum(rate(http_requests_total{service="auth-service"}[5m])) by (endpoint)',
          position: {x: 12, y: 0, w: 12, h: 8},
          visualization: {
            type: 'line',
            legend: true,
            yAxis: {format: 'percentunit', max: 1}
          },
          thresholds: [
            {value: 0.01, color: 'yellow'},
            {value: 0.05, color: 'red'}
          ]
        },
        {
          title: 'Response Time (p95)',
          type: 'graph',
          query: 'histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket{service="auth-service"}[5m])) by (le, endpoint))',
          position: {x: 0, y: 8, w: 12, h: 8},
          visualization: {
            type: 'line',
            legend: true,
            yAxis: {format: 's'}
          }
        },
        {
          title: 'Recent Auth Errors',
          type: 'logs',
          query: '{service="auth-service", level="ERROR"}',
          position: {x: 12, y: 8, w: 12, h: 8},
          visualization: {
            type: 'logs',
            showTime: true,
            showLabels: ['level', 'endpoint']
          }
        }
      ]
    });
    
    console.log(`Created dashboard with ID: ${dashboard.id}`);
    
    // Share the dashboard with other users
    await client.shareDashboard(dashboard.id, {
      userIds: ['user-123', 'user-456'],
      teamIds: ['team-789'],
      public: false
    });
    
    // Create a scheduled report
    await client.createDashboardReport(dashboard.id, {
      name: 'Weekly Auth Service Report',
      schedule: '0 9 * * MON', // Every Monday at 9am
      format: 'pdf',
      recipients: ['team@example.com'],
      includeAnnotations: true,
      timeRange: '7d' // Last 7 days
    });
    
    console.log('Dashboard configuration completed');
    
  } catch (error) {
    console.error('Error creating dashboard:', error.message);
  }
}

createAuthServiceDashboard().catch(console.error);
```

## Advanced Error Handling

In production environments, implement more sophisticated error handling:

```typescript
import { ObservabilityClient, ApiError } from '@augmented-os/observability-sdk';

async function advancedErrorHandling() {
  const client = new ObservabilityClient({
    apiKey: 'your-api-key',
    baseUrl: 'https://api.example.com/observability'
  });
  
  try {
    // Attempt operation
    const metrics = await client.queryMetrics({
      query: 'sum(rate(http_requests_total{service="auth-service"}[5m])) by (endpoint)',
      start: new Date(Date.now() - 3600000),
      end: new Date(),
      step: '15s'
    });
    
    // Process metrics
    processMetrics(metrics);
    
  } catch (error) {
    if (error instanceof ApiError) {
      // Handle API-specific errors
      switch (error.code) {
        case 'QUERY_TIMEOUT':
          // Query took too long
          console.error('Query timed out. Simplifying query and retrying...');
          retryWithSimplifiedQuery();
          return;
          
        case 'RATE_LIMITED':
          // Handle rate limiting
          console.warn('Rate limited. Retrying in 5 seconds...');
          setTimeout(() => advancedErrorHandling(), 5000);
          return;
          
        case 'INVALID_QUERY':
          // Handle invalid query syntax
          console.error('Query syntax error:', error.details);
          // Log the invalid query for debugging
          break;
          
        default:
          console.error('API error:', error.message);
      }
    } else {
      // Handle network or other non-API errors
      console.error('Unexpected error:', error);
    }
  }
}
```

## Best Practices

When implementing advanced observability scenarios:

1. **Query Optimization**: For dashboards that need to be responsive, optimize queries to reduce calculation overhead.
2. **Alert Tuning**: Start with less sensitive thresholds and adjust based on actual service behavior to reduce alert fatigue.
3. **Correlation**: Use consistent labels across logs, metrics, and traces to enable correlation between different signals.
4. **Templating**: Use dashboard templates and variables to create reusable dashboards across different services and environments.
5. **Retention Policies**: Configure appropriate retention policies for different data types based on their lifecycle needs.

## Related Documentation

* [Basic Example](./basic_example.md)
* [API Reference](../interfaces/api.md)
* [Implementation Details](../implementation/query_engine.md)
* [Service Integration](./service_integration.md)


