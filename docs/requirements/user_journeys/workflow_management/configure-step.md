# User Journey: Configuring a Step within a Workflow

## Overview

This user journey describes the process a user follows to configure the specific parameters, inputs, outputs, and behavior of a workflow step that has already been placed within a workflow definition using the Workflow Designer.

## Primary Persona(s)

* [Mark Reynolds - The AI Automation Agency Owner](../../vision/personas/ai-automation-agency-persona.md) (for creating automation solutions for clients)
* [Sarah Wilson - The Short-Term Rental Manager](../../vision/personas/property-manager-persona.md) (for automating business processes)

## Preconditions

* User is editing a workflow definition in the Workflow Designer.
* A step node has been added to the canvas.
* For task-type steps, the task definition for the selected task type exists in the system.

## Journey Flow

1. **Starting Point**
   * Initial state/context: User is viewing the workflow canvas in the designer. A specific step node is present on the canvas.
   * User's goal/intention: To define how this specific step should behave within the workflow, including what data it uses and produces.
   
2. **Steps**
   * **Step 1**: Select Step Node
     * **User Action**: Clicks on the step node on the workflow canvas.
     * **System Response**: Highlights the selected node. Opens or focuses the Properties Panel, displaying configuration options relevant to the selected step type.
     * **Success Criteria**: Properties Panel shows configuration fields for the selected step type.
   
   * **Step 2**: Configure Basic Properties
     * **User Action**: Enters or modifies the step's name (instance name, e.g., "Send Welcome Email") and description within the properties panel.
     * **System Response**: Updates the display name on the node and stores the metadata.
     * **Success Criteria**: Step name and description are updated.
   
   * **Step 3**: Configure Step-Specific Properties (varies by step type)
     
     * **3a. For TASK Steps**:
       * **User Action**: 
         * Selects task type from available registered tasks (each with predefined input/output schemas)
         * Maps workflow input or previous step outputs to task inputs using the input mapping interface
         * Configures how task outputs are stored in workflow state
       * **System Response**: 
         * Displays available task types for selection
         * Shows the input schema for the selected task
         * Displays available workflow variables and previous step outputs for mapping
         * Validates input mappings against expected types
       * **Success Criteria**: 
         * Task type is selected
         * All required task inputs are mapped to valid sources
         * Output mapping is defined
     
     * **3b. For HUMAN_TASK Steps**:
       * **User Action**: 
         * Configures assignee settings (specific user, role, group, or dynamic assignment rules)
         * Selects task form to be displayed to the assignee
         * Sets priority level (LOW, MEDIUM, HIGH, CRITICAL)
         * Configures due date or deadline (fixed date or dynamic duration)
         * Sets up escalation rules for overdue tasks
         * Configures basic deadline notification settings (detailed notification configuration is done in Step 4)
       * **System Response**: 
         * Displays role/user selection interface
         * Shows available form templates
         * Validates assignment configuration
         * Displays basic notification options based on priority level and deadlines
       * **Success Criteria**: 
         * Assignment strategy is properly configured
         * Appropriate form is selected
         * Priority and due dates are set
         * Basic notification parameters are configured
     
     * **3c. For EVENT_WAIT Steps**:
       * **User Action**: 
         * Defines event pattern to wait for (e.g., "bookings.created")
         * Creates condition expressions to filter events
         * Sets up event payload mapping to workflow variables
         * Configures timeout settings and timeout handler step
       * **System Response**: 
         * Suggests available event patterns
         * Validates condition expressions
         * Previews event payload structure for mapping
       * **Success Criteria**: 
         * Event pattern is properly defined
         * Timeout behavior is configured
         * Event payload mapping is set up
     
     * **3d. For DECISION Steps**:
       * **User Action**: 
         * Creates multiple condition paths with expressions
         * Defines evaluation expressions that reference workflow variables or step outputs
         * Specifies destination steps for each condition
         * Sets a default path for when no conditions match
       * **System Response**: 
         * Provides expression builder interface
         * Validates condition expressions
         * Shows available steps as destination options
       * **Success Criteria**: 
         * All condition expressions are valid
         * Each condition has a specified target step
         * Default path is configured
     
     * **3e. For PARALLEL Steps**:
       * **User Action**: 
         * Defines multiple execution branches
         * Configures steps within each branch
         * Sets join behavior (wait for all, wait for any, complex join conditions)
         * Specifies error handling for individual branches
       * **System Response**: 
         * Provides branch management interface
         * Allows nested step configuration
         * Validates branch configuration
       * **Success Criteria**: 
         * All branches are properly defined
         * Join behavior is specified
         * Branch error handling is configured
   
   * **Step 4**: Configure Notification Parameters
     * **User Action**: Navigates to the notification configuration section and configures:
       * **Status-Based Notifications**:
         * Configures notifications for step status changes (Started, Completed, Failed, Retrying)
         * Maps different statuses to appropriate notification channels
         * Sets notification content templates for each status type
       * **Condition-Based Alerts**:
         * Creates custom alert conditions based on step execution metrics or output data
         * Sets thresholds for metrics (e.g., execution time > 30s, retry count > 3)
         * Configures rules to evaluate output data (e.g., error codes, result values)
       * **Notification Channels**:
         * Selects and configures delivery channels based on urgency:
           * Email: Templates and recipients
           * Slack/Teams: Target channels and formatting
           * SMS/Push: For critical notifications
           * Webhook: For integration with external systems
           * PagerDuty/OpsGenie: For critical operational issues
       * **Notification Grouping & Timing**:
         * Configures batching rules to prevent notification storms
         * Sets quiet periods or business hours for non-critical notifications
         * Defines escalation paths for unacknowledged critical notifications
     * **System Response**: 
       * Displays notification capabilities relevant to the selected step type
       * Previews example notifications based on configuration
       * Validates notification rules against system capabilities
       * Shows estimated notification frequency visualization
     * **Success Criteria**: 
       * Status notifications are properly configured
       * Alert conditions are clearly defined
       * Appropriate notification channels are selected for each scenario
       * Notification timing and grouping rules are established
   
   * **Step 5**: Configure Error Handling
     * **User Action**: Navigates to the error handling section and configures:
       * Retry policy (max attempts, delay, backoff strategy)
       * Error transitions (different paths based on error types)
       * Failure actions (continue, stop, retry)
       * Compensation steps (for rollback if needed)
     * **System Response**: Presents relevant error handling options based on step type. Validates inputs.
     * **Success Criteria**: Error handling behavior is properly configured for the specific step.
   
   * **Step 6**: Configure Advanced Properties
     * **User Action**: Navigates to advanced configuration sections to set:
       * Timeout duration
       * Custom metadata
       * Performance hints
       * Logging level
       * For integration-type tasks: selects specific integration instance to use
     * **System Response**: Presents advanced configuration options. Validates inputs.
     * **Success Criteria**: Advanced properties are configured as desired.
   
   * **Step 7**: Validate Step Configuration
     * **User Action**: Implicitly occurs as user edits, or user clicks a "Validate Step" button.
     * **System Response**: Performs real-time or on-demand validation of the entire step configuration. Highlights any errors (e.g., missing required inputs, invalid mappings, incompatible types).
     * **Success Criteria**: Configuration is validated, and user is aware of any issues.
   
   * **Step 8**: Save Configuration
     * **User Action**: Clicks "Apply" or similar in the properties panel, or saves the entire workflow.
     * **System Response**: Saves the configuration changes associated with the step node as part of the workflow definition.
     * **Success Criteria**: Step configuration is persisted within the workflow definition.

3. **End State**
   * Final state/outcome: The selected step within the workflow is fully configured with inputs, outputs, transitions, and execution behavior defined. The workflow definition reflects these changes.
   * Success indicators: No validation errors are shown for the configured step. The configuration is saved successfully.

## Alternative Paths

* **Using Default Configuration**: User adds a step and does not modify its configuration, relying on defaults.
* **Reusing Configuration**: User copies configuration from another similar step within the same workflow.
* **Step-Type Conversion**: User changes a step from one type to another, with system attempting to preserve compatible configuration.
* **Template Application**: User applies a predefined template to quickly configure a step for common scenarios.

## Error Scenarios

* **Invalid Input Mapping**:
  * **Trigger**: User tries to map a workflow variable of the wrong type to a step input.
  * **System Response**: Shows a validation error in the Properties Panel, explaining the type mismatch. Prevents saving until fixed.
  * **Recovery Path**: User corrects the mapping by selecting a compatible variable or adding a transformation.

* **Missing Required Configuration**:
  * **Trigger**: User attempts to save without configuring required properties.
  * **System Response**: Highlights the missing fields in the Properties Panel and on the node itself. Prevents saving.
  * **Recovery Path**: User provides the missing configuration.

* **Invalid Expression**:
  * **Trigger**: User enters an invalid expression for conditions or mappings.
  * **System Response**: Shows syntax error message below the expression editor. Prevents saving.
  * **Recovery Path**: User corrects the expression syntax.

* **Circular Reference**:
  * **Trigger**: User creates a step configuration that would result in an infinite loop.
  * **System Response**: Detects and highlights the circular reference. Prevents saving.
  * **Recovery Path**: User modifies transitions to break the circular reference.

## Related Items

* Related Features: [Workflow Canvas](../../features/workflow_designer/workflow_canvas.md), [Task Definitions](../../features/task_management/task-definitions.md) (Needs creation)
* Related UI/UX: [Workflow Designer Properties Panel](../../ui_ux/wireframes/workflow-designer-properties.md) (Needs creation)
* Dependencies: [Workflow Orchestrator Service](../../../architecture/components/workflow_orchestrator_service/README.md), [Task Execution Service](../../../architecture/components/task_execution_service/README.md), [Validation Service](../../../architecture/components/validation_service/README.md)

## Notes

The configuration interface dynamically adapts based on the selected step type. Each step type has its own unique configuration requirements while sharing common elements like basic properties and error handling. The system provides contextual help and validation to guide users through the configuration process.