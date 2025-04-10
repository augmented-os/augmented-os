# Human Task Nodes

## Overview

Human Task nodes represent points in a workflow where human interaction, input, or approval is required. These nodes serve as pause points in automated workflows, enabling people to review information, make decisions, or provide data that cannot be automated. The visual design emphasizes the human element and clearly indicates the task's waiting or completion status.

## Visual Design

### Base Appearance

```
+---------------------------------------------+
|  👤  Human Task               ⋮  |  ✓  |  ␡  |
+---------------------------------------------+
|                                             |
|  Review and approve purchase order          |
|                                             |
|  Assignee: {{input.manager}}                |
|  Due: 24 hours after assignment             |
|  Priority: Medium                           |
|                                             |
+---------------------------------------------+
|  Form: Purchase Approval    [ Configure ]   |
+---------------------------------------------+
```

* **Shape**: Rounded rectangle with 6px corner radius
* **Size**: Default 240px width × 140px height (resizable)
* **Header**: Orange (#FA7B17) background with white text
* **Header Icon**: Person (👤) icon on the left side
* **Header Actions**: Menu, validation status, and delete buttons on the right
* **Content Area**: White background with task description and key details
* **Footer**: Light gray background (#F8F8F8) with form information

### Connection Points

* **Inputs**: One or more input ports on the left side
  * Main input port at vertical center
  * Additional input ports for context or documentation
  * Ports are labeled to indicate purpose (e.g., "Data", "Context")
* **Outputs**: Two or more output ports on the right side
  * Completion port for task completion path
  * Rejection/cancellation port for rejection path
  * Timeout port for handling expiration (optional)
  * Ports are labeled to indicate outcome (e.g., "Approved", "Rejected")

### Content Area Design

The content area provides a preview of the human task with:

* **Task Title**: Prominently displayed at the top
* **Task Description**: Brief summary of what the human needs to do
* **Assignment Information**: Who the task is assigned to
* **Timeframe**: Due date or response window information
* **Priority Indicator**: Visual indicator of task priority
* **Form Preview**: Indication of what form or interface will be presented

## Task Type Variations

### Approval Task

```
+---------------------------------------------+
|  👍  Approval Task            ⋮  |  ✓  |  ␡  |
+---------------------------------------------+
|                                             |
|  Approve expense report #{{input.reportId}} |
|                                             |
|  Amount: ${{input.amount}}                  |
|  Submitted by: {{input.submitter}}          |
|  Department: {{input.department}}           |
|                                             |
+---------------------------------------------+
|  Approvers: Finance Manager  [ Configure ]  |
+---------------------------------------------+
```

* **Icon**: Thumbs up (👍) icon
* **Content**: Shows key information requiring approval
* **Footer**: Shows approver role or group

### Data Entry Task

```
+---------------------------------------------+
|  ✏️  Data Entry Task          ⋮  |  ✓  |  ␡  |
+---------------------------------------------+
|                                             |
|  Enter shipping information                 |
|                                             |
|  Required fields:                           |
|  - Shipping address                         |
|  - Delivery preference                      |
|  - Contact phone number                     |
|                                             |
+---------------------------------------------+
|  Form: Shipping Details     [ Configure ]   |
+---------------------------------------------+
```

* **Icon**: Pencil (✏️) icon
* **Content**: Shows required fields and instructions
* **Footer**: Shows form type

### Review Task

```
+---------------------------------------------+
|  👁️  Review Task              ⋮  |  ✓  |  ␡  |
+---------------------------------------------+
|                                             |
|  Review generated content                   |
|                                             |
|  Content type: Marketing email              |
|  Length: ~500 words                         |
|  Reviewer: {{input.marketingSpecialist}}    |
|                                             |
+---------------------------------------------+
|  Actions: Edit, Approve, Reject             |
+---------------------------------------------+
```

* **Icon**: Eye (👁️) icon
* **Content**: Shows content to be reviewed and criteria
* **Footer**: Shows available actions

### Escalation Task

```
+---------------------------------------------+
|  ⚠️  Escalation Task          ⋮  |  ✓  |  ␡  |
+---------------------------------------------+
|                                             |
|  Handle customer complaint                  |
|                                             |
|  Customer: {{input.customerName}}           |
|  Complaint ID: {{input.ticketId}}           |
|  Priority: High                             |
|  SLA: 4 hours                               |
|                                             |
+---------------------------------------------+
|  Assignee: Support Team Lead [ Configure ]  |
+---------------------------------------------+
```

* **Icon**: Warning (⚠️) icon
* **Content**: Shows escalation information and priority
* **Footer**: Shows assignee information

## Node States

Human Task nodes display these states:

| State | Visual Appearance |
|----|----|
| **Default** | Standard appearance as described above |
| **Selected** | Blue outline (2px) with resize handles |
| **Hover** | Slight elevation increase (shadow enhancement) |
| **Focused** | Blue dashed outline (for keyboard navigation) |
| **Waiting for Assignment** | Orange dotted outline with clock icon |
| **Assigned** | Orange solid outline with person icon |
| **In Progress** | Pulsing orange outline with progress indicator |
| **Overdue** | Red outline with clock icon |
| **Completed** | Green checkmark overlay in top-right |
| **Rejected** | Red X overlay in top-right |
| **Cancelled** | Gray strikethrough overlay |

## Task Form Preview

When "Configure" is clicked, a preview of the human task form appears in the properties panel:

```
+-----------------------------------------------------+
|  EXPENSE APPROVAL                                   |
+-----------------------------------------------------+
|                                                     |
|  Expense Report: #{{input.reportId}}                |
|  Submitted by: {{input.submitter}}                  |
|                                                     |
|  Items:                                             |
|  - {{input.items[0].description}}: ${{input.items...}|
|  - {{input.items[1].description}}: ${{input.items...}|
|  ...                                                |
|                                                     |
|  Total Amount: ${{input.totalAmount}}               |
|                                                     |
|  Notes:                                             |
|  [                                              ]   |
|  [                                              ]   |
|                                                     |
|  Decision:                                          |
|  ( ) Approve   ( ) Reject   ( ) Request Changes     |
|                                                     |
|  [Cancel]                    [Submit Decision]      |
+-----------------------------------------------------+
```

* **Form Preview**: Shows the actual form users will interact with
* **Field Mapping**: Shows how workflow data maps to form fields
* **Required Fields**: Highlights which fields are mandatory
* **Actions**: Shows available buttons and outcome paths

## Interactive Elements

Human Task nodes provide these interactive elements:

* **Configure Button**: Opens the task configuration in the properties panel
* **Assignment Button**: Quick access to assignment configuration
* **Preview Button**: Shows how the task will appear to assignees
* **Menu Button**: Additional options (templates, notifications, etc.)
* **Priority Selection**: Dropdown for setting task priority
* **Deadline Setting**: Interface for configuring due dates and SLAs

## Properties Panel Integration

When a Human Task node is selected, the properties panel shows:

* **Task Details Tab**:
  * Task title and description fields
  * Priority selection
  * Due date/SLA configuration
  * Category and tags
* **Assignment Tab**:
  * Assignee selection (individuals, roles, or groups)
  * Assignment rules configuration
  * Escalation settings
  * Notification settings
* **Form Builder Tab**:
  * Form layout designer
  * Field mapping configuration
  * Validation rules
  * Custom styling options
* **Outcomes Tab**:
  * Outcome definition (approved, rejected, etc.)
  * Output data mapping
  * Conditional branching rules

## Accessibility Considerations

* **Color Independence**: The person icon and node shape ensure it's recognizable without relying solely on color
* **Screen Reader Support**:
  * Announces "Human Task Node" with task type and status
  * Assignment and priority information properly conveyed
  * Form fields have appropriate ARIA labels
* **Keyboard Navigation**:
  * Tab stops for all interactive elements
  * Keyboard shortcuts for common actions
  * Focus management for form fields

## Usage Guidelines

* **Task Clarity**: Provide clear, concise instructions about what the person needs to do
* **Data Context**: Include sufficient context for the human to make informed decisions
* **Response Options**: Clearly define all possible response options and outcomes
* **Timeframes**: Set realistic deadlines and communicate them clearly
* **Assignment Logic**: Be specific about who should perform the task and why
* **Notifications**: Configure appropriate notifications to alert assignees
* **Mobile Considerations**: Ensure forms work well on mobile devices for on-the-go approvals

## Related Components

* [Canvas Appearance](../canvas/appearance.md): Overall canvas styling context
* [Properties Panel](../panels/properties-panel.md): Where detailed task configuration occurs
* [Form Builder](../panels/form-builder.md): Tool for creating human task interfaces
* [Notification Settings](../panels/notification-settings.md): For configuring task alerts
* [Decision Nodes](./decision-nodes.md): Often used after human tasks for conditional logic


