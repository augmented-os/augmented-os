# Create Workflow Trigger

> **Mode:** Design-Time

# User Journey: Creating a Workflow Trigger

## Metadata
* **Name**: Creating a Workflow Trigger
* **Category**: Workflow Management
* **Created**: 2023-10-05
* **Last Updated**: 2023-10-05
* **Status**: Draft

## Overview
This user journey describes the process of creating a trigger for an existing workflow definition. Triggers define when and how workflows are executed, enabling workflows to respond to events, run on schedules, or be manually invoked.

## Primary Persona(s)
* [Mark Reynolds - The AI Automation Agency Owner](../../vision/personas/ai-automation-agency-persona.md) (for creating automation solutions for clients)
* [Sarah Wilson - The Short-Term Rental Manager](../../vision/personas/property-manager-persona.md) (for automating business processes)

## Journey Flow

1. **Starting Point**
   * Initial state/context: User has already created and finalized a workflow definition using the [Creating a New Workflow](./create-workflow.md) journey. The user now needs to make the workflow active by configuring triggers.
   * User's goal/intention: To define when and how a workflow should be executed.

2. **Steps**
   * **Step 1**: Access Trigger Creation
     * **User Action**: From the workflow list or the workflow details page, selects the target workflow and clicks "Add Trigger" or navigates to the workflow's "Triggers" tab.
     * **System Response**: Displays the trigger creation interface showing the available trigger types.
     * **Success Criteria**: User is presented with options to create event-based, schedule-based, or manual triggers.

   * **Step 2**: Select Trigger Type
     * **User Action**: Chooses one of the available trigger types:
       * **Event-Based Trigger**: Workflow responds to system or business events
       * **Schedule-Based Trigger**: Workflow runs on a defined schedule
       * **Manual Trigger**: Workflow can be started on-demand via API or UI
     * **System Response**: Displays the appropriate configuration interface for the selected trigger type.
     * **Success Criteria**: User accesses the correct configuration form for their chosen trigger type.

   * **Step 3a**: Configure Event-Based Trigger (if selected)
     * **User Action**: 
       * Selects an event pattern from available system events (e.g., "bookings.created", "document.uploaded")
       * Optionally defines condition expressions to filter events (e.g., only bookings with status "confirmed")
       * Maps event data fields to workflow input parameters
       * Sets a correlation key for grouping related workflow instances
       * Provides a description for the trigger
     * **System Response**: 
       * Validates the configuration in real-time
       * Provides auto-completion and suggestions for event patterns and data mapping
       * Previews sample event data for the selected pattern
     * **Success Criteria**: Event trigger is properly configured with valid event pattern, conditions, and input mapping.

     * **Advanced Configuration (optional)**:
       * **User Action**:
         * Sets trigger priority (lower number = higher priority) for when multiple triggers might fire simultaneously
         * Creates advanced event conditions using expression syntax:
           ```
           event.payload.amount > 1000 && event.metadata.priority == 'high'
           ```
         * Selects specific event pattern types:
           * Exact match: `bookings.created`
           * Wildcard match: `bookings.*` (matches all booking events)
           * Hierarchical match: `finance.invoice.created`
       * **System Response**:
         * Validates complex expressions
         * Shows which events would match the selected pattern
       * **Success Criteria**: Advanced trigger configurations are properly set and validated.

   * **Step 3b**: Configure Schedule-Based Trigger (if selected)
     * **User Action**: 
       * Selects trigger frequency (one-time or recurring)
       * For one-time execution: sets a date and time
       * For recurring execution: configures a schedule using cron expression or friendly UI
       * Sets timezone for the schedule
       * Configures input parameters for the workflow
       * Sets optional start and end dates for the schedule
     * **System Response**: 
       * Validates the schedule configuration
       * Displays the next few execution times based on the configuration
       * Provides a human-readable description of the schedule
     * **Success Criteria**: Schedule trigger is configured with valid timing and input parameters.

   * **Step 3c**: Configure Manual Trigger (if selected)
     * **User Action**: 
       * Sets a name for the trigger
       * Defines required input parameters and their validation rules
       * Configures access control for invoking the trigger:
         * **Public**: Anyone can invoke the trigger without authentication
         * **Authenticated-only**: Any authenticated user can invoke the trigger
         * **Role-based**: Only users with specific roles/permissions can invoke the trigger
       * If selecting role-based access, chooses specific roles that can invoke the trigger
       * Sets API key requirements for service-to-service invocation
       * Adds a description for the trigger's purpose
     * **System Response**: 
       * Generates an API endpoint for the trigger as a webhook
       * Displays the endpoint URL and expected payload format
       * Provides sample request snippets (cURL, JavaScript, etc.)
       * Creates a UI component for invoking the trigger from dashboards
       * Validates the input parameter definitions
     * **Success Criteria**: Manual trigger is configured with clear name, parameters, and access controls.

   * **Step 4**: Set Trigger Status
     * **User Action**: Sets the trigger as "Enabled" or "Disabled" initially.
     * **System Response**: Acknowledges the status setting.
     * **Success Criteria**: Trigger is correctly set to the desired initial state.

   * **Step 5**: Save Trigger Configuration
     * **User Action**: Reviews the trigger configuration and clicks "Save" or "Create Trigger".
     * **System Response**: Validates the complete configuration, saves the trigger, and associates it with the workflow definition.
     * **Success Criteria**: Trigger is created and linked to the workflow definition. Confirmation message indicates success.

   * **Step 6**: Test Trigger (Optional)
     * **User Action**: 
       * Uses the "Test" feature to simulate trigger execution
       * For event triggers: provides a sample event payload to test against conditions and mapping
       * For schedule triggers: simulates a scheduled execution
     * **System Response**: 
       * Processes the test payload through the configured conditions
       * Shows how event data would be mapped to workflow inputs
       * Indicates whether the workflow would be triggered based on current configuration
       * Does not actually execute the workflow
     * **Success Criteria**: User can verify that trigger logic behaves as expected before activating it.

3. **End State**
   * Final state/outcome: A new trigger is created and associated with the workflow definition, making the workflow executable according to the configured conditions.
   * Success indicators: The trigger appears in the list of triggers for the workflow with the correct configuration and status. For event triggers, the system is now listening for matching events. For schedule triggers, the next execution time is displayed.

## Alternative Paths

* **Duplicate Existing Trigger**: User starts by duplicating an existing trigger and modifying it, rather than creating one from scratch.
* **Import Trigger Configuration**: User imports a JSON configuration file containing trigger settings instead of configuring manually.
* **Create Multiple Triggers**: User creates multiple triggers of different types for the same workflow to enable various execution paths.
* **Configure Trigger Priorities**: For workflows with multiple event triggers that might fire simultaneously, user sets execution priorities.

## Error Scenarios

* **Invalid Event Pattern**:
  * **Trigger**: User enters an event pattern that doesn't exist in the system or is malformed.
  * **System Response**: Displays an error message indicating the event pattern is invalid and suggests available patterns.
  * **Recovery Path**: User selects a valid event pattern from the suggestions or corrects the format.

* **Invalid Cron Expression**:
  * **Trigger**: User enters a cron expression that is syntactically incorrect.
  * **System Response**: Highlights the error in the expression and provides guidance on the correct format.
  * **Recovery Path**: User corrects the cron expression or uses the visual schedule builder instead.

* **Input Mapping Mismatch**:
  * **Trigger**: The event data mapped to workflow inputs doesn't match the required workflow input schema.
  * **System Response**: Identifies the mismatched fields and shows the expected data types.
  * **Recovery Path**: User adjusts the input mapping to match the workflow's expected input format.

* **Insufficient Permissions**:
  * **Trigger**: User attempts to create a trigger for a workflow they don't have permission to modify.
  * **System Response**: Shows a permission denied error message.
  * **Recovery Path**: User requests necessary permissions or selects a workflow they can modify.

* **Conflicting Trigger**:
  * **Trigger**: User attempts to create a duplicate or conflicting trigger.
  * **System Response**: Warns about the potential conflict and asks for confirmation.
  * **Recovery Path**: User modifies the trigger to avoid the conflict or confirms the creation with awareness of the overlap.

## Related Items

* Related Features: [Workflow Designer](../../features/workflow_designer/workflow_canvas.md), [Event Management](../../features/event_management/event_definition.md)
* Related UI/UX: [Trigger Creation Interface](../../ui_ux/wireframes/trigger-creation.md)
* Dependencies: [Workflow Orchestrator Service](../../../architecture/components/workflow_orchestrator_service/README.md), [Event Processing Service](../../../architecture/components/event_processing_service/README.md), [Scheduler Service](../../../architecture/components/scheduler_service/README.md)
* Related User Journeys: [Creating a New Workflow](./create-workflow.md), [Monitoring Workflow Execution](./monitor-workflow.md)

## Notes

Different trigger types serve different use cases:
- Event-based triggers are ideal for reactive processes that respond to business events
- Schedule-based triggers work best for periodic tasks that run at regular intervals
- Manual triggers are suitable for user-initiated processes or admin operations

For complex workflows, consider using multiple triggers with clear naming conventions to maintain organization. The trigger configuration directly impacts system performance and resource utilization, so it's important to design triggers with efficiency in mind, particularly event conditions and schedules. 