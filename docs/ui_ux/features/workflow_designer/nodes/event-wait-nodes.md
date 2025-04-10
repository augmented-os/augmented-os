# Event Wait Nodes

## Overview

Event Wait nodes pause workflow execution until a specific event occurs or a condition is met. These nodes enable workflows to respond to external triggers, implement time-based delays, or create long-running processes that resume based on external signals. The visual design emphasizes the waiting state and provides clear feedback about what event is being awaited.

## Visual Design

### Base Appearance

```
+---------------------------------------------+
|  ⏱️  Event Wait               ⋮  |  ✓  |  ␡  |
+---------------------------------------------+
|                                             |
|  Waiting for: Webhook callback              |
|  Event: payment.confirmed                   |
|  Identifier: {{input.orderId}}              |
|                                             |
|  Timeout: 24 hours                          |
|                                             |
+---------------------------------------------+
|  Status: Waiting            [ Configure ]   |
+---------------------------------------------+
```

* **Shape**: Rounded rectangle with 6px corner radius
* **Size**: Default 240px width × 140px height (resizable)
* **Header**: Purple (#9334E6) background with white text
* **Header Icon**: Clock/timer (⏱️) icon on the left side
* **Header Actions**: Menu, validation status, and delete buttons on the right
* **Content Area**: White background with event details
* **Footer**: Light gray background (#F8F8F8) with status information

### Connection Points

* **Inputs**: One input port on the left side
  * Main input port at vertical center
  * Input data may contain event correlation information
* **Outputs**: Two or more output ports on the right side
  * Main output port for when the event is received
  * Timeout port for handling timeouts (optional)
  * Error port for handling errors (optional)
  * Ports are labeled to indicate purpose (e.g., "Event Received", "Timeout")

### Content Area Design

The content area provides information about the event being awaited:

* **Event Type**: Shows what type of event triggers continuation
* **Event Details**: Additional information about the expected event
* **Correlation Info**: How the incoming event will be matched to this workflow
* **Timeout Settings**: Visual indication of timeout configuration
* **Wait Status**: Current waiting status and elapsed time when in execution

## Event Wait Type Variations

### Webhook Wait

```
+---------------------------------------------+
|  🪝  Webhook Wait             ⋮  |  ✓  |  ␡  |
+---------------------------------------------+
|                                             |
|  Waiting for HTTP POST request              |
|  Endpoint: /api/callbacks/{{input.id}}      |
|                                             |
|  Expected payload:                          |
|  { "status", "details", "timestamp" }       |
|                                             |
+---------------------------------------------+
|  Timeout: 48 hours         [ Configure ]    |
+---------------------------------------------+
```

* **Icon**: Webhook (🪝) icon
* **Content**: Shows endpoint and expected payload
* **Footer**: Shows timeout configuration

### Timer Wait

```
+---------------------------------------------+
|  ⏲️  Timer Wait               ⋮  |  ✓  |  ␡  |
+---------------------------------------------+
|                                             |
|  Delay execution for:                       |
|  Duration: 30 minutes                       |
|                                             |
|  Resume at:                                 |
|  {{execution.startTime + 30m}}              |
|                                             |
+---------------------------------------------+
|  Type: Fixed delay         [ Configure ]    |
+---------------------------------------------+
```

* **Icon**: Timer (⏲️) icon
* **Content**: Shows delay duration and resume time
* **Footer**: Shows delay type

### Scheduled Wait

```
+---------------------------------------------+
|  📅  Scheduled Wait           ⋮  |  ✓  |  ␡  |
+---------------------------------------------+
|                                             |
|  Resume at specific date/time:              |
|  {{input.scheduledDate}} {{input.time}}     |
|                                             |
|  Time zone: {{input.timezone}}              |
|                                             |
+---------------------------------------------+
|  Type: Calendar time       [ Configure ]    |
+---------------------------------------------+
```

* **Icon**: Calendar (📅) icon
* **Content**: Shows scheduled date/time and timezone
* **Footer**: Shows time type

### Message Queue Wait

```
+---------------------------------------------+
|  📨  Message Queue Wait       ⋮  |  ✓  |  ␡  |
+---------------------------------------------+
|                                             |
|  Listening to queue: orders.processed       |
|                                             |
|  Filter condition:                          |
|  message.orderId === "{{input.orderId}}"    |
|                                             |
+---------------------------------------------+
|  Queue: RabbitMQ            [ Configure ]   |
+---------------------------------------------+
```

* **Icon**: Message queue (📨) icon
* **Content**: Shows queue name and filter condition
* **Footer**: Shows queue type

### Condition Wait

```
+---------------------------------------------+
|  🔍  Condition Wait           ⋮  |  ✓  |  ␡  |
+---------------------------------------------+
|                                             |
|  Polling condition:                         |
|  GET /api/orders/{{input.orderId}}/status   |
|                                             |
|  Resume when:                               |
|  response.status === "shipped"              |
|                                             |
|  Polling interval: 5 minutes                |
+---------------------------------------------+
|  Max attempts: 12           [ Configure ]   |
+---------------------------------------------+
```

* **Icon**: Magnifying glass (🔍) icon
* **Content**: Shows polling details and condition
* **Footer**: Shows max polling attempts

## Node States

Event Wait nodes display these states:

| State | Visual Appearance |
|----|----|
| **Default** | Standard appearance as described above |
| **Selected** | Blue outline (2px) with resize handles |
| **Hover** | Slight elevation increase (shadow enhancement) |
| **Focused** | Blue dashed outline (for keyboard navigation) |
| **Waiting** | Purple pulsing border with animated clock/timer icon |
| **Event Received** | Green checkmark indicating the event was received |
| **Timed Out** | Orange warning with clock icon indicating timeout |
| **Error State** | Red outline with error icon |
| **Cancelled** | Gray strikethrough overlay indicating cancellation |
| **Never Started** | Dotted outline indicating the node was never reached |

## Waiting Indicator

When in execution, Event Wait nodes show a special waiting indicator:

```
+---------------------------------------------+
|  ⏱️  Event Wait               ⋮  |  ✓  |  ␡  |
+---------------------------------------------+
|                                             |
|  Waiting for: Webhook callback              |
|  Event: payment.confirmed                   |
|  Identifier: ORD-12345                      |
|                                             |
|  Elapsed: 2h 34m                            |
|  Remaining: 21h 26m                         |
|  [▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░] 10%         |
|                                             |
+---------------------------------------------+
|  Status: WAITING           [ Cancel Wait ]  |
+---------------------------------------------+
```

* **Elapsed Time**: Shows how long the workflow has been waiting
* **Remaining Time**: Shows time left before timeout
* **Progress Bar**: Visual representation of time elapsed vs. timeout
* **Status Indicator**: Clear indication of current wait status
* **Cancel Option**: Button to manually cancel the wait

## Event Configuration

When "Configure" is clicked, the properties panel shows the event configuration interface:

```
+-----------------------------------------------------+
|  EVENT WAIT CONFIGURATION                           |
+-----------------------------------------------------+
|                                                     |
|  Event Type:                                        |
|  [Webhook Event       ▼]                            |
|                                                     |
|  Webhook Configuration:                             |
|  Endpoint path: /api/callbacks/{{input.id}}         |
|  HTTP Method: [POST ▼]                              |
|                                                     |
|  Authentication:                                    |
|  [x] Require authentication                         |
|  Auth type: [API Key ▼]                             |
|  Header name: X-API-Key                             |
|  Key reference: {{env.WEBHOOK_API_KEY}}             |
|                                                     |
|  Correlation:                                       |
|  Match event to workflow using:                     |
|  [x] Request path parameter                         |
|  [ ] Request header                                 |
|  [ ] Request body field                             |
|                                                     |
|  Timeout Settings:                                  |
|  [x] Enable timeout                                 |
|  Timeout after: [24] [hours ▼]                      |
|  On timeout: [Follow timeout path ▼]                |
|                                                     |
|  [Test Endpoint]         [Generate Webhook URL]     |
+-----------------------------------------------------+
```

* **Event Type Selection**: Dropdown for selecting wait type
* **Type-specific Configuration**: Fields specific to the selected event type
* **Correlation Settings**: How to match incoming events to this workflow instance
* **Authentication Options**: Security settings for event reception
* **Timeout Configuration**: What happens if the event isn't received in time
* **Testing Tools**: Ability to test event reception and generate URLs

## Interactive Elements

Event Wait nodes provide these interactive elements:

* **Configure Button**: Opens the event configuration in the properties panel
* **Cancel Wait Button**: Appears during execution to manually cancel waiting
* **Test Button**: Tests if events can be properly received
* **Generate URL/ID Button**: Generates webhook URLs or correlation IDs
* **Menu Button**: Additional options (timeout settings, error handling)
* **Elapsed Time Display**: Shows waiting time during execution

## Properties Panel Integration

When an Event Wait node is selected, the properties panel shows:

* **Event Type Tab**:
  * Event type selection
  * Type-specific configuration fields
  * Correlation configuration
  * Authentication settings
* **Timeout Tab**:
  * Timeout duration settings
  * Timeout behavior options
  * Retry configuration
  * Escalation settings
* **Payload Tab**:
  * Expected payload definition
  * Payload validation rules
  * Transformation settings
  * Data mapping for continuation
* **Advanced Tab**:
  * Logging settings
  * Monitoring configuration
  * Performance optimization
  * Error handling options

## Wait Status Visualization

Event Wait nodes provide visual feedback about waiting status:

* **Wait Progress**: Visual indication of elapsed time vs. timeout
* **Countdown Timer**: Displays remaining time until timeout
* **Event Log**: Recent activity related to this wait node
* **Wait History**: For recurring waits, history of previous wait cycles
* **External Status**: For condition waits, the last polled value

## Accessibility Considerations

* **Color Independence**: The clock/timer icon and node shape ensure it's recognizable without relying solely on color
* **Screen Reader Support**:
  * Announces "Event Wait Node" with event type and status
  * Wait status and elapsed time properly conveyed
  * Timeout information clearly communicated
* **Keyboard Navigation**:
  * Tab stops for all interactive elements
  * Keyboard shortcuts for common actions
  * Arrow key navigation in configuration panels

## Usage Guidelines

* **Event Specificity**: Define events with specific correlation information
* **Meaningful Timeouts**: Set appropriate timeouts based on expected event timing
* **Error Handling**: Always have a plan for timeout and error paths
* **Status Visibility**: Provide clear indications of waiting status during execution
* **Security**: Secure webhook endpoints with proper authentication
* **Correlation**: Ensure robust correlation between events and workflow instances
* **Testing**: Test both normal event reception and timeout scenarios

## Related Components

* [Canvas Appearance](../canvas/appearance.md): Overall canvas styling context
* [Properties Panel](../panels/properties-panel.md): Where detailed event configuration occurs
* [Integration Task Nodes](./integration-task-nodes.md): Often used to trigger events that Event Wait nodes listen for
* [Workflow Monitoring](../panels/monitoring-panel.md): For tracking waiting workflows


