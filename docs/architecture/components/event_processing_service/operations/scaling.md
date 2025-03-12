# Event Processing Service Scaling Guide

## Overview

This document provides guidance on scaling the Event Processing Service to handle increased load, maintain performance, and ensure reliability. It covers horizontal and vertical scaling strategies, component-specific scaling considerations, and recommendations for different deployment scenarios.

## Scaling Indicators

Monitor these metrics to determine when scaling is necessary:

| Metric | Description | Scaling Indicator |
|--------|-------------|-------------------|
| `events.received.rate` | Rate of events received per second | >80% of current capacity |
| `events.end_to_end.latency` | Total processing time from receipt to delivery | Consistent increase over time |
| `queue.depth` | Number of events in the internal queue | Consistently >50% of max capacity |
| `cpu.usage` | CPU usage percentage | Consistently >70% |
| `memory.usage` | Memory usage percentage | Consistently >80% |
| `backpressure.active.duration` | Time backpressure has been active | >10 minutes in a 1-hour period |

## Horizontal Scaling

### Event Receiver Component

The Event Receiver component is stateless and can be scaled horizontally with a load balancer:

```
                      ┌─────────────────┐
                      │                 │
                      │  Load Balancer  │
                      │                 │
                      └────────┬────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
    ┌─────────▼────────┐ ┌─────▼────────────┐ ┌─▼───────────────┐
    │                  │ │                  │ │                 │
    │  Event Receiver  │ │  Event Receiver  │ │  Event Receiver │
    │                  │ │                  │ │                 │
    └─────────┬────────┘ └────────┬─────────┘ └────────┬────────┘
              │                   │                    │
              └───────────────────┼────────────────────┘
                                  │
                        ┌─────────▼─────────┐
                        │                   │
                        │   Event Router    │
                        │                   │
                        └───────────────────┘
```

**Scaling Recommendations:**
- Start with 3 instances for high availability
- Add 1 instance for every 1000 events/second increase in traffic
- Configure auto-scaling based on CPU usage (>70%) and request rate

### Event Router Component

The Event Router maintains subscription state and should be scaled with care:

```
                      ┌─────────────────┐
                      │                 │
                      │  Event Receiver │
                      │                 │
                      └────────┬────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
    ┌─────────▼────────┐ ┌─────▼────────────┐ ┌─▼───────────────┐
    │                  │ │                  │ │                 │
    │   Event Router   │ │   Event Router   │ │   Event Router  │
    │                  │ │                  │ │                 │
    └─────────┬────────┘ └────────┬─────────┘ └────────┬────────┘
              │                   │                    │
              └───────────────────┼────────────────────┘
                                  │
                        ┌─────────▼─────────┐
                        │                   │
                        │   Event Store     │
                        │                   │
                        └───────────────────┘
```

**Scaling Recommendations:**
- Use consistent hashing to partition event types across router instances
- Start with 2 instances for high availability
- Add 1 instance for every 2000 subscriptions
- Ensure all instances share subscription state via the database or distributed cache

### Event Processor Component

The Event Processor handles transformations and can be scaled based on processing load:

```
                      ┌─────────────────┐
                      │                 │
                      │   Event Router  │
                      │                 │
                      └────────┬────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
    ┌─────────▼────────┐ ┌─────▼────────────┐ ┌─▼───────────────┐
    │                  │ │                  │ │                 │
    │  Event Processor │ │  Event Processor │ │ Event Processor │
    │                  │ │                  │ │                 │
    └──────────────────┘ └──────────────────┘ └─────────────────┘
```

**Scaling Recommendations:**
- Scale based on transformation complexity and volume
- Add 1 instance for every 500 complex transformations/second
- Configure auto-scaling based on processing latency and queue depth

### Internal Queue Component

The Internal Queue can be scaled by partitioning or using a distributed queue:

**Single Queue with Multiple Workers:**
```
                      ┌─────────────────┐
                      │                 │
                      │  Internal Queue │
                      │                 │
                      └────────┬────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
    ┌─────────▼────────┐ ┌─────▼────────────┐ ┌─▼───────────────┐
    │                  │ │                  │ │                 │
    │   Queue Worker   │ │   Queue Worker   │ │   Queue Worker  │
    │                  │ │                  │ │                 │
    └──────────────────┘ └──────────────────┘ └─────────────────┘
```

**Partitioned Queue:**
```
    ┌──────────────────┐ ┌──────────────────┐ ┌─────────────────┐
    │                  │ │                  │ │                 │
    │  Queue Partition │ │  Queue Partition │ │ Queue Partition │
    │        1         │ │        2         │ │       3         │
    └─────────┬────────┘ └────────┬─────────┘ └────────┬────────┘
              │                   │                    │
    ┌─────────▼────────┐ ┌────────▼─────────┐ ┌────────▼────────┐
    │                  │ │                  │ │                 │
    │   Queue Worker   │ │   Queue Worker   │ │   Queue Worker  │
    │                  │ │                  │ │                 │
    └──────────────────┘ └──────────────────┘ └─────────────────┘
```

**Scaling Recommendations:**
- For high throughput (>5000 events/second), use a partitioned queue
- Partition by event type or subscriber ID
- Add 1 worker for every 1000 events/second in the queue
- Ensure queue persistence for reliability

## Vertical Scaling

Consider vertical scaling in these scenarios:

1. **Memory-bound processing**: If event transformations require significant memory
   - Increase RAM allocation before adding instances
   - Monitor garbage collection metrics to determine optimal memory size

2. **CPU-intensive transformations**: If event processing is CPU-bound
   - Increase CPU allocation to existing instances
   - Consider specialized instance types for compute-intensive workloads

3. **Database connections**: If database connection pool is the bottleneck
   - Increase connection pool size (requires more memory)
   - Optimize database queries before scaling vertically

## Database Scaling

The Event Processing Service relies heavily on the database for event storage and subscription management:

### Read/Write Separation

```
    ┌──────────────────┐     ┌──────────────────┐
    │                  │     │                  │
    │  Event Service   │     │  Event Service   │
    │                  │     │                  │
    └─────────┬────────┘     └────────┬─────────┘
              │                       │
              │                       │
    ┌─────────▼────────┐     ┌────────▼─────────┐
    │                  │     │                  │
    │  Write Database  │────►│  Read Replicas   │
    │                  │     │                  │
    └──────────────────┘     └──────────────────┘
```

**Recommendations:**
- Use read replicas for event queries and subscription lookups
- Keep write operations on the primary database
- Consider sharding for very high event volumes (>10,000 events/second)

### Database Sharding

For extremely high-volume deployments, consider database sharding:

```
    ┌──────────────────┐
    │                  │
    │  Event Service   │
    │                  │
    └─────────┬────────┘
              │
    ┌─────────▼────────┐
    │                  │
    │   Shard Router   │
    │                  │
    └─────────┬────────┘
              │
    ┌─────────┴────────────────────────┐
    │                                  │
    ▼                                  ▼
┌─────────────┐                  ┌─────────────┐
│             │                  │             │
│  Shard 1    │                  │  Shard 2    │
│ (Events A-M)│                  │ (Events N-Z)│
│             │                  │             │
└─────────────┘                  └─────────────┘
```

**Sharding Strategies:**
- Shard by event type or namespace
- Shard by time period for historical events
- Keep subscription data in a separate non-sharded database

## Deployment Scenarios

### Small Deployment (< 1,000 events/second)

**Recommended Configuration:**
- Single instance of each component
- Shared database
- Vertical scaling as needed

### Medium Deployment (1,000 - 5,000 events/second)

**Recommended Configuration:**
- 3 Event Receiver instances
- 2 Event Router instances
- 2-3 Event Processor instances
- Single queue with multiple workers
- Database with read replicas

### Large Deployment (5,000 - 20,000 events/second)

**Recommended Configuration:**
- 5+ Event Receiver instances with load balancer
- 3+ Event Router instances with consistent hashing
- 5+ Event Processor instances
- Partitioned queue by event type
- Database with read replicas and connection pooling

### Enterprise Deployment (> 20,000 events/second)

**Recommended Configuration:**
- 10+ Event Receiver instances with load balancer
- 5+ Event Router instances with consistent hashing
- 10+ Event Processor instances
- Distributed queue system (e.g., Kafka, RabbitMQ)
- Sharded database with read replicas
- Consider regional deployment for global distribution

## Auto-Scaling Configuration

### Kubernetes HPA Example

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: event-receiver-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: event-receiver
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Pods
    pods:
      metric:
        name: events_received_rate
      target:
        type: AverageValue
        averageValue: 1000
```

### AWS Auto Scaling Example

```json
{
  "AutoScalingGroupName": "EventProcessorASG",
  "MinSize": 2,
  "MaxSize": 10,
  "DesiredCapacity": 2,
  "HealthCheckType": "ELB",
  "HealthCheckGracePeriod": 300,
  "LaunchTemplate": {
    "LaunchTemplateId": "lt-0123456789abcdef0",
    "Version": "$Latest"
  },
  "TargetGroupARNs": [
    "arn:aws:elasticloadbalancing:us-west-2:123456789012:targetgroup/event-processor-tg/1234567890123456"
  ],
  "Tags": [
    {
      "Key": "Name",
      "Value": "EventProcessor",
      "PropagateAtLaunch": true
    }
  ]
}
```

## Performance Testing

Before implementing scaling changes, conduct performance testing:

1. **Baseline Testing**: Establish current performance metrics
2. **Load Testing**: Simulate expected peak loads
3. **Stress Testing**: Determine breaking points
4. **Soak Testing**: Verify stability under sustained load
5. **Scaling Testing**: Validate auto-scaling configurations

## Related Documentation

* [Monitoring Guide](./monitoring.md)
* [Configuration Guide](./configuration.md)
* [Event Router Implementation](../implementation/event_router.md)
* [Internal Event Queue](../implementation/internal_queue.md) 