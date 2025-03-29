# Testing Framework Service Event Consumers

This document describes the events consumed by the Testing Framework Service from other components in the Augmented OS platform.

## Overview

The Testing Framework Service subscribes to various events from other components to trigger test executions, update test statuses, and gather information for test assertions. This event-driven approach enables automated testing based on system activities and state changes.

## Consumed Events

### Workflow Orchestrator Events

#### `workflow.definition.created`

Consumed to automatically generate test definitions for new workflows.

**Action:** Creates a basic test definition template for the new workflow.

#### `workflow.definition.updated`

Consumed to update existing test definitions when workflows are modified.

**Action:** Flags potentially affected test definitions for review.

#### `workflow.execution.completed`

Consumed to validate workflow execution results as part of integration tests.

**Action:** Compares actual workflow execution results with expected outcomes defined in tests.

#### `workflow.execution.failed`

Consumed to detect workflow failures that might be relevant to ongoing tests.

**Action:** Records failure details for test assertions and reporting.

### Task Manager Events

#### `task.definition.created`

Consumed to automatically generate test definitions for new tasks.

**Action:** Creates a basic test definition template for the new task.

#### `task.definition.updated`

Consumed to update existing test definitions when tasks are modified.

**Action:** Flags potentially affected test definitions for review.

#### `task.execution.completed`

Consumed to validate task execution results as part of integration tests.

**Action:** Compares actual task execution results with expected outcomes defined in tests.

#### `task.execution.failed`

Consumed to detect task failures that might be relevant to ongoing tests.

**Action:** Records failure details for test assertions and reporting.

### Integration Hub Events

#### `integration.definition.created`

Consumed to automatically generate test definitions for new integrations.

**Action:** Creates a basic test definition template for the new integration.

#### `integration.definition.updated`

Consumed to update existing test definitions when integrations are modified.

**Action:** Flags potentially affected test definitions for review.

#### `integration.execution.completed`

Consumed to validate integration execution results as part of integration tests.

**Action:** Compares actual integration execution results with expected outcomes defined in tests.

#### `integration.execution.failed`

Consumed to detect integration failures that might be relevant to ongoing tests.

**Action:** Records failure details for test assertions and reporting.

### Deployment Events

#### `deployment.completed`

Consumed to trigger automated test suites after deployments.

**Action:** Initiates post-deployment test suites for the affected components.

#### `environment.created`

Consumed to register new environments for test execution.

**Action:** Adds the new environment to the available test environments.

#### `environment.updated`

Consumed to update environment configurations for tests.

**Action:** Updates environment-specific test parameters.

### Telemetry Events

#### `telemetry.metric.threshold_exceeded`

Consumed to detect performance issues during test execution.

**Action:** Records performance anomalies as part of test results.

#### `telemetry.log.error`

Consumed to capture error logs during test execution.

**Action:** Associates error logs with relevant test executions.

### CI/CD Pipeline Events

#### `pipeline.stage.started`

Consumed to prepare test environments for upcoming test stages.

**Action:** Initializes test environments and resources.

#### `pipeline.stage.completed`

Consumed to trigger the next set of tests in the pipeline.

**Action:** Initiates tests scheduled for execution after the completed stage.

## Event Processing

The Testing Framework Service processes these events through dedicated event handlers that implement the following workflow:

1. **Event Validation**: Validates the event structure and required fields
2. **Event Classification**: Determines the type of action required based on the event
3. **Context Enrichment**: Enriches the event with additional context from the Testing Framework Service
4. **Action Execution**: Performs the required action based on the event type
5. **Response Generation**: Generates appropriate responses or follow-up events

## Configuration

Event consumption can be configured through the Testing Framework Service's configuration:

```yaml
event_consumers:
  workflow:
    enabled: true
    events:
      - workflow.definition.created
      - workflow.definition.updated
      - workflow.execution.completed
      - workflow.execution.failed
  task:
    enabled: true
    events:
      - task.definition.created
      - task.definition.updated
      - task.execution.completed
      - task.execution.failed
  integration:
    enabled: true
    events:
      - integration.definition.created
      - integration.definition.updated
      - integration.execution.completed
      - integration.execution.failed
  deployment:
    enabled: true
    events:
      - deployment.completed
      - environment.created
      - environment.updated
  telemetry:
    enabled: true
    events:
      - telemetry.metric.threshold_exceeded
      - telemetry.log.error
  pipeline:
    enabled: true
    events:
      - pipeline.stage.started
      - pipeline.stage.completed
```

## Error Handling

The Testing Framework Service implements robust error handling for event consumption:

1. **Retry Mechanism**: Failed event processing is retried with exponential backoff
2. **Dead Letter Queue**: Events that cannot be processed after multiple retries are sent to a dead letter queue
3. **Error Logging**: Detailed error logs are generated for troubleshooting
4. **Alerting**: Critical event processing failures trigger alerts

## Best Practices

1. **Selective Consumption**: Only subscribe to events that are directly relevant to testing
2. **Idempotent Processing**: Ensure event handlers are idempotent to handle duplicate events
3. **Graceful Degradation**: Design the system to continue functioning even if some event sources are unavailable
4. **Event Correlation**: Use correlation IDs to track related events across the system
5. **Performance Monitoring**: Monitor event processing performance to identify bottlenecks

## Example: Automated Test Execution Flow

This example illustrates how the Testing Framework Service uses events to automate test execution:

1. A deployment is completed, triggering a `deployment.completed` event
2. The Testing Framework Service consumes this event and identifies the affected components
3. It initiates the appropriate test suites for those components
4. As tests execute, they consume events from the tested components to validate behavior
5. Test results are published as events for other components to consume
6. If issues are detected, appropriate alerts are triggered 