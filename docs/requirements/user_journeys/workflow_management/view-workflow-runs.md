# View Workflow Runs

> **Mode:** Run-Time

## Overview

This user journey covers the process of viewing, filtering, and analyzing workflow run instances. Users need to monitor active workflows, review completed workflow executions, and analyze workflow performance. This journey enables users to have comprehensive visibility into workflow execution status, details, and history.

## Primary Persona(s)

* Process Owner
* System Administrator
* Operations Analyst

## Journey Flow


1. **Starting Point**
   * User navigates to the Workflow Management section
   * User wants to view the status and details of workflow runs
2. **Steps**
   * Step 1: Access Workflow Runs List
     * User Action: Navigate to the Workflow Runs page
     * System Response: Display a table of workflow runs with the following columns:
       * Last Updated (timestamp when workflow was last updated)
       * Workflow Name (name of the workflow definition)
       * Status (e.g., Completed, Running, Failed, Waiting)
       * Progress (visual representation of steps with colored indicators showing status of each step)
       * Actions (three-dot menu for additional options)
     * Success Criteria: User sees a list of workflow runs with key metadata visible and status indicators
   * Step 2: Apply Filters to Workflow Runs
     * User Action: Use filter controls to narrow down the list by criteria such as workflow definition, status (CREATED, RUNNING, COMPLETED, FAILED, CANCELLED, WAITING_FOR_EVENT), time range, or correlation ID
     * System Response: Update the list to show only workflow runs matching the selected filters
     * Success Criteria: Filtered list shows only relevant workflow runs
   * Step 3: Sort and Navigate Workflow Runs
     * User Action: Sort the list by different columns (e.g., last updated time, status) and navigate between pages of results
     * System Response: Reorder the list according to sort criteria and show the selected page of results
     * Success Criteria: List is properly sorted and pagination works correctly
   * Step 4: Access Workflow Run Options
     * User Action: Click the three-dot menu for a specific workflow run
     * System Response: Display a dropdown menu with options such as:
       * View Details
       * Edit Workflow (if applicable)
       * Rerun Workflow
       * Cancel Workflow (if running)
       * Export Data
     * Success Criteria: Menu appears with contextually appropriate options
   * Step 5: View Detailed Workflow Run Information
     * User Action: Click on a workflow run row or select "View Details" from the options menu
     * System Response:
       * Display a detailed view of the selected workflow run
       * Show a graphical representation of the workflow steps at the top, with numbered circles and connecting lines representing the workflow process
       * Each step is color-coded to indicate its status:
         * Green: Completed successfully
         * Blue: Currently running
         * Red: Failed
         * Gray: Not yet executed
       * Below the step graph, display tabs for different categories of information:
         * Transactions (or other relevant data based on workflow type)
         * Related Documents (e.g., Xero Invoices as shown in the example)
         * Metadata
     * Success Criteria: Detailed workflow visualization and information is displayed correctly
   * Step 6: View Workflow Details Section
     * User Action: Scroll down below the step visualization or select appropriate tab
     * System Response: Display detailed information about the workflow run, including:
       * Workflow ID and reference information
       * Date and time information
       * Financial or transactional details (if applicable)
       * Input parameters provided when the workflow was started
       * Net results/outputs from the workflow
     * Success Criteria: Workflow metadata and key information is displayed correctly
   * Step 7: Inspect Step Details
     * User Action: Click on a specific step in the workflow visualization
     * System Response: Show detailed information about the selected step:
       * Step input/output data
       * Execution timing (start/end times, duration)
       * Error information (if failed)
       * Retry information (if applicable)
     * Success Criteria: Step details provide comprehensive information about the step execution
   * Step 8: Take Actions on Workflow
     * User Action: Click action buttons such as "Rerun" (as shown in the example)
     * System Response: System executes the requested action and provides feedback
     * Success Criteria: Action is performed successfully with appropriate confirmation
3. **End State**
   * User has found the workflow run(s) they were looking for
   * User has analyzed the workflow execution details
   * User understands the current status or results of the workflow run
   * User can take appropriate actions based on the workflow status

## Alternative Paths

* **Export Workflow Data**
  * At any point when viewing workflow runs, the user can export the data to formats like CSV or JSON for further analysis outside the system
  * System provides download options and generates the export file
* **Take Action on Workflow**
  * From the workflow details view, the user may have options to:
    * Cancel a running workflow
    * Retry a failed workflow
    * Send signals to a workflow waiting for events
* **Subscribe to Notifications**
  * User can set up alerts or notifications for specific workflow runs or workflow definitions
  * System will notify the user when workflows change status or encounter errors

## Error Scenarios

* **No Workflow Runs Available**
  * Trigger: User navigates to workflow runs but there are no runs that match their criteria
  * Recovery Path: System shows an empty state with guidance on how to create workflows or adjust filter criteria
* **Workflow Details Unavailable**
  * Trigger: User attempts to view a workflow run but the data cannot be retrieved
  * Recovery Path: System shows an error message with retry options and troubleshooting guidance
* **Large Workflow Visualization**
  * Trigger: User attempts to view a very complex workflow with many steps
  * Recovery Path: System provides alternative views (simplified, tabular) and progressive loading to handle the complexity

## Related Items

* Related Features: Workflow Creation, Workflow Triggers, Workflow Step Configuration
* Related UI/UX: Workflow Visualization Components, Dashboard Widgets
* Dependencies: Workflow Orchestrator Service, Event Service

## Notes

* The visualization of workflow runs should balance technical detail with usability for business users
* Progress indicators in the list view provide at-a-glance status of each step in the workflow
* For financial workflows, display relevant monetary values and transaction details
* Performance considerations are important for workflows with many steps or extensive history
* Privacy and access controls must be considered for workflows containing sensitive business data




