# Alert Manager

## Overview

The Alert Manager is a core component of the Observability Service responsible for defining, evaluating, and managing alerts based on observability data. It provides a flexible rule-based system to detect anomalies, notify relevant stakeholders, and track alert lifecycle from firing to resolution.

## Key Responsibilities

* Defining and managing alert rules
* Evaluating rules against real-time observability data
* Detecting anomalies and threshold violations
* Managing the alert lifecycle (firing, acknowledged, resolved)
* Routing notifications to appropriate channels
* Preventing alert storms through grouping and throttling
* Supporting escalation policies for critical alerts
* Providing context-rich notifications with relevant data

## Implementation Approach

The Alert Manager system follows these design principles:

1. **Declarative Rules** - Use a declarative approach for alert definitions that is both human and machine-friendly
2. **Separation of Detection and Notification** - Decouple alert detection from notification routing
3. **Stateful Evaluation** - Maintain alert state to support hysteresis and prevent flapping
4. **Configurable Routing** - Provide flexible routing based on alert attributes
5. **Context Enrichment** - Include relevant context with notifications to facilitate troubleshooting

## Alert Lifecycle

```
┌──────────────┐
│  Rule        │
│  Definition  │
└──────┬───────┘
       │
       ▼
┌──────────────┐     ┌──────────────────┐
│  Rule        │────►│    Scheduled     │
│  Validation  │     │    Evaluation    │
└──────────────┘     └────────┬─────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │    Condition      │     No
                    │    Evaluation     │─────────────┐
                    └─────────┬─────────┘             │
                              │ Yes                   │
                              ▼                       ▼
          ┌──────────────────────────────┐   ┌────────────────┐
          │  Alert Instance Creation     │   │   Previously   │
          │  or Update                   │   │   Firing?      │
          └──────────┬───────────────────┘   └───────┬────────┘
                     │                                │ Yes
                     ▼                                ▼
          ┌──────────────────┐              ┌─────────────────┐
          │  Grouping &      │              │  Mark Alert as  │
          │  Deduplication   │              │  Resolved       │
          └────────┬─────────┘              └────────┬────────┘
                   │                                 │
                   ▼                                 │
          ┌────────────────┐                         │
          │  Notification  │◄────────────────────────┘
          │  Routing       │
          └────────┬───────┘
                   │
                   ▼
          ┌────────────────┐
          │  Notification  │
          │  Delivery      │
          └────────────────┘
```

## Implementation Details

### Alert Rule Definition

Alert rules are defined using a flexible, declarative format:

```typescript
interface AlertRule {
  id: string;
  name: string;
  description: string;
  query: string;           // PromQL, LogQL, etc.
  condition: {
    type: ComparisonType;  // above, below, equals, etc.
    threshold: number;
    for: Duration;         // Duration the condition must be true
  };
  labels: Record<string, string>;  // Used for grouping and routing
  annotations: Record<string, string>; // Used for notification templates
  enabled: boolean;
  notificationTemplate?: string;  // Template for notifications
  evaluationInterval: Duration;   // How often to evaluate
}
```

Example alert rule:

```json
{
  "id": "high-error-rate",
  "name": "High Error Rate",
  "description": "Service error rate exceeds threshold",
  "query": "sum(rate(http_requests_total{status=~\"5..\"}[5m])) by (service) / sum(rate(http_requests_total[5m])) by (service) * 100",
  "condition": {
    "type": "above",
    "threshold": 5,
    "for": "5m"
  },
  "labels": {
    "severity": "critical",
    "category": "availability",
    "team": "platform"
  },
  "annotations": {
    "summary": "High error rate on {{ $labels.service }}",
    "description": "Error rate is {{ $value }}%, which exceeds the threshold of 5%",
    "dashboard": "https://dashboard.example.com/service?id={{ $labels.service }}"
  },
  "enabled": true,
  "evaluationInterval": "1m"
}
```

### Rule Evaluation

Alert rules are evaluated through a multi-stage process:

1. **Scheduling**: Rules are scheduled for evaluation based on their defined interval
2. **Query Execution**: The rule's query is executed against the time series database
3. **Condition Evaluation**: Results are compared against the defined threshold
4. **State Management**: Alert instances are created, updated, or resolved based on results
5. **Deduplication**: Similar alerts are grouped to prevent notification storms

```typescript
// Simplified rule evaluator
class RuleEvaluator {
  async evaluateRule(rule: AlertRule): Promise<AlertInstance[]> {
    // Execute query
    const results = await this.queryEngine.executeQuery(rule.query);
    
    // Evaluate condition for each result
    const alertInstances = [];
    for (const result of results) {
      const value = this.extractValue(result);
      const labels = this.extractLabels(result);
      
      // Check if condition is met
      if (this.checkCondition(value, rule.condition)) {
        // Create or update alert instance
        const alertInstance = await this.alertInstanceManager.getOrCreate(
          rule.id, 
          labels
        );
        
        // Check duration requirement (e.g. "for 5m")
        if (this.checkDuration(alertInstance, rule.condition.for)) {
          alertInstance.status = 'firing';
          alertInstance.value = value;
          alertInstance.lastEvaluation = new Date();
          alertInstances.push(alertInstance);
        }
      } else {
        // Resolve existing alert if condition is no longer met
        const existingAlert = await this.alertInstanceManager.get(
          rule.id, 
          labels
        );
        
        if (existingAlert && existingAlert.status === 'firing') {
          existingAlert.status = 'resolved';
          existingAlert.resolvedAt = new Date();
          alertInstances.push(existingAlert);
        }
      }
    }
    
    return alertInstances;
  }
}
```

### Notification System

The notification system handles alerting stakeholders through various channels:

1. **Routing**: Alerts are routed based on labels and attributes
2. **Grouping**: Similar alerts are grouped to reduce notification volume
3. **Templating**: Notifications are rendered using templates
4. **Delivery**: Notifications are delivered through configured channels

Supported notification channels include:

* Email
* Slack/MS Teams
* PagerDuty/OpsGenie
* Webhook
* SMS/Push notifications
* Event publication (to Event Processing Service)

### Silencing and Inhibition

To reduce alert noise, the Alert Manager supports:

1. **Silencing**: Temporarily suppress notifications for matching alerts
2. **Inhibition**: Prevent notifications for certain alerts when others are firing
3. **Time Windows**: Configure notification windows (e.g., business hours only)
4. **Rate Limiting**: Limit notification frequency for noisy alerts

### Edge Cases and Error Handling

The implementation addresses the following edge cases:

| Scenario | Handling Approach |
|----|----|
| Evaluation failure | Retry with exponential backoff, report as meta-alert |
| Rule syntax errors | Validation at definition time, clear error messages |
| Notification failure | Retry delivery, fall back to alternative channels |
| Alert storms | Dynamic grouping and rate limiting based on volume |
| Flapping alerts | Hysteresis parameters to prevent rapid state changes |
| Missing data | Configurable behavior (treat as firing or OK) |

## Performance Considerations

The Alert Manager is optimized for reliable operation:

* **Evaluation Staggering**: Distribute rule evaluation to prevent CPU spikes
* **Query Optimization**: Optimize queries to reduce load on time series database
* **Incremental Processing**: Process only changed data when possible
* **Batched Notifications**: Group notifications to reduce external API calls
* **State Persistence**: Maintain state across restarts for continuity

### Benchmarks

| Operation | Average Performance | P99 Performance |
|----|----|----|
| Rule evaluation (simple) | < 50ms | < 200ms |
| Rule evaluation (complex) | < 500ms | < 2s |
| Notification generation | < 100ms | < 500ms |
| Notification delivery | < 1s | < 5s |
| Alert state query | < 50ms | < 200ms |
| Alert history query | < 200ms | < 1s |

## Related Documentation

* [Data Model](../data_model.md)
* [Query Engine](./query_engine.md)
* [API Reference](../interfaces/api.md)
* [Notification Channels](../operations/configuration.md#notification-channels)


