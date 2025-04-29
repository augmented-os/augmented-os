# Workflow Monitor

> **Mode:** Run-Time

## Overview

The Workflow Monitor provides a comprehensive interface for viewing, filtering, and analyzing workflow executions (runs). It enables users to track the status of active workflows, inspect completed workflow executions, and take appropriate actions on workflow instances. The feature offers both a list view of all workflow runs and a detailed view showing step-by-step execution status, related data, and available actions.

## User Stories

* As a Process Owner, I want to view a list of all workflow runs so that I can monitor their overall status.
* As a System Administrator, I want to filter workflow runs by status, definition type, and time period so that I can focus on specific subsets of workflows.
* As an Operations Analyst, I want to see detailed execution information for a specific workflow run so that I can analyze its performance and outcomes.
* As a Process Owner, I want to view the status of each step in a workflow run so that I can identify where failures or bottlenecks occur.
* As a System Administrator, I want to rerun or cancel workflow executions so that I can manage exceptional cases.
* As an Operations Analyst, I want to export workflow execution data so that I can perform further analysis in external tools.
* As a Process Owner, I want to view transaction details related to a workflow run so that I can verify business outcomes.

## Requirements

### Must Have

* List view of workflow runs showing Last Updated time, Workflow Name, Status, and Progress indicators
* Progress visualization showing status of each step (completed, running, failed, pending)
* Filtering capabilities by workflow definition, status, and time range
* Sorting and pagination for workflow runs list
* Detailed view of an individual workflow run with step visualization
* Step-level details showing input/output data, timing, and error information
* Actions menu with options relevant to the workflow's current state
* Visualization of workflow steps with clear status indicators

### Should Have

* Advanced filtering by correlation ID and custom metadata
* Export functionality for workflow run data (CSV, JSON)
* Ability to rerun workflows from the interface
* Ability to cancel running workflows
* Detailed transaction information related to the workflow
* Tab-based interface for viewing different aspects of a workflow run
* Ability to view workflow execution history and state transitions

### Could Have

* Notification subscription for workflow status changes
* Comparison view for comparing different runs of the same workflow definition
* Performance metrics visualization for workflow steps
* Customizable columns in the workflow runs list view
* Batch operations on multiple selected workflow runs
* Alternative visualizations for complex workflows with many steps

### Won't Have

* Ability to edit workflow definitions directly from the monitor interface
* Real-time log streaming for active workflow steps
* Integration with external monitoring tools
* Predictive analytics for workflow execution times
* Automated root cause analysis for failed workflows

## Technical Requirements

### UI Requirements

* Responsive table layout for workflow runs list with support for various screen sizes
* Color-coded status indicators that are accessible and clearly distinguishable
* Interactive workflow step visualization that supports both mouse and keyboard navigation
* Expandable/collapsible sections for detailed information to manage information density
* Consistent action buttons and menu items following the design system
* Loading states and empty states for all views
* Error handling and notification components
* Support for high contrast mode and screen readers

## Data Requirements

### Data Model

The Workflow Monitor operates on the workflow instance data model, which represents the execution state of a workflow:

```json
{
  "id": "string",                    // UUID for the instance
  "workflowDefinitionId": "string",  // Reference to workflow definition
  "status": "string",                // Current execution status
  "input": {},                       // Input data provided when started
  "state": {                         // Current execution state
    "variables": {},                 // Workflow variables
    "currentStepId": "string",       // Currently executing step
    "steps": {                       // State of each executed step
      "step1": {
        "status": "string",          // PENDING, RUNNING, COMPLETED, FAILED
        "input": {},                 // Input to this step
        "output": {},                // Output from this step
        "error": {},                 // Error details if failed
        "startedAt": "string",       // ISO timestamp
        "completedAt": "string"      // ISO timestamp
      }
    },
    "waitingForEvent": {             // Present if waiting for an event
      "eventPattern": "string",      // Event pattern to match
      "eventCondition": "string",    // Optional condition
      "since": "string"              // ISO timestamp
    }
  },
  "version": 1,                      // For optimistic concurrency control
  "startedAt": "string",             // ISO timestamp
  "updatedAt": "string",             // ISO timestamp
  "completedAt": "string",           // ISO timestamp (if completed)
  "correlationId": "string",         // For related workflows
  "triggerEventId": "string",        // Event that triggered this workflow
  "cancellation": {                  // Present if workflow was cancelled
    "reason": "string",
    "requestedBy": "string",
    "requestedAt": "string",
    "source": "string",              // USER, EVENT, SYSTEM
    "eventId": "string"              // If cancelled by an event
  },
  "compensationState": {             // For cleanup actions
    "status": "string",              // IN_PROGRESS, COMPLETED, COMPLETED_WITH_ERRORS
    "startedAt": "string",
    "completedAt": "string",
    "plan": ["string"],              // Steps to execute for compensation
    "completed": ["string"],         // Completed compensation steps
    "failed": [                      // Failed compensation steps
      {
        "stepId": "string",
        "error": "string",
        "timestamp": "string"
      }
    ]
  },
  "error": {}                        // Error details if workflow failed
}
```

For the complete schema definition and additional details, refer to the [Workflow Instances Schema Documentation](../../../architecture/components/workflow_orchestrator_service/schemas/workflow_instances.md).

### Data Storage

Workflow instances are stored in the workflow_instances table in the database, with key fields including:

* id: Unique identifier for the workflow instance
* workflow_definition_id: Reference to the workflow definition
* status: Current execution status
* input: Input data provided at workflow start
* state: Current workflow state including step data
* started_at/updated_at/completed_at: Timestamps for tracking execution
* correlation_id: Business correlation identifier

### Data Inputs and Outputs

* **Input**: Workflow instance data retrieved from the database via Workflow Orchestrator Service
* **Output**: 
  * Filter/search parameters sent to the Workflow Orchestrator Service
  * Workflow action commands (rerun, cancel) sent to the Workflow Orchestrator Service

### Integration Requirements

* API integration with Workflow Orchestrator Service for:
  * Retrieving workflow runs with filtering and pagination
  * Fetching detailed workflow run information
  * Executing actions on workflows (rerun, cancel)
* Integration with Authentication/Authorization services for permission checks
* Integration with Event service for real-time updates to workflow status
* Integration with export services for generating downloadable files

## Performance Requirements

* **List View Loading Time**: < 1 second for up to 100 workflow runs
* **Detail View Loading Time**: < 1.5 seconds for a complete workflow run with up to 30 steps
* **Filter Operation**: < 500ms to apply filters and show results
* **Action Execution**: < 2 seconds for workflow actions (rerun, cancel)
* **Memory Usage**: < 40MB of browser memory for typical workflow monitoring

## Security Requirements

* All workflow instance data must be accessed according to user permissions
* Monitor must respect read/action permissions from the authorization service
* Sensitive data within workflow inputs/outputs must be masked unless user has explicit access
* All actions on workflows must be logged for audit purposes

## Accessibility Requirements

This feature must comply with:

* WCAG 2.1 Level AA compliance
* Keyboard navigation for all monitoring operations
* Screen reader support for workflow status and step information
* Color contrast ratios meeting accessibility standards
* Non-color-dependent status indicators (icons in addition to colors)

## Acceptance Criteria

- [ ] Users can view a list of workflow runs with key metadata and status indicators
- [ ] Users can filter the workflow runs list by workflow definition, status, and time range
- [ ] Users can sort the list by different columns and navigate between pages
- [ ] Users can access a menu of available actions for each workflow run
- [ ] Users can view detailed information about a selected workflow run
- [ ] The detailed view displays a graphical representation of workflow steps with status indicators
- [ ] Users can view information about each step in the workflow
- [ ] Users can navigate between different categories of workflow information using tabs
- [ ] Users can perform actions such as rerunning a workflow
- [ ] The interface handles error states appropriately
- [ ] The interface is responsive and accessible
- [ ] Performance meets standards for loading and interaction times

## Dependencies

* Workflow Orchestrator Service for providing workflow execution data
* Event Processing Service for real-time updates
* Authentication and Authorization services for permission checking
* UI Component Library for consistent interface elements
* Data Export Service for generating downloadable files

## Related Items

* Related User Journeys: [View Workflow Runs](../../user_journeys/workflow_management/view-workflow-runs.md)
* Related Features: Workflow Designer, Workflow Triggers, Workflow Step Configuration
* Related UI/UX: Workflow Visualization Components, Dashboard Widgets
* Related Architecture: [Workflow Orchestrator Service](../../../architecture/components/workflow_orchestrator_service/overview.md)

## Notes

* The workflow monitor is primarily focused on viewing and interacting with workflow executions, not editing workflow definitions
* The UI design should prioritize clarity of status information and ease of navigation
* Performance considerations are important for situations with many workflow runs or complex workflows
* The feature should be designed with future extensibility in mind as workflow capabilities evolve
* Privacy and access controls must be considered for workflows containing sensitive business data
* The progress visualization in the list view is a key differentiator for quick status assessment


