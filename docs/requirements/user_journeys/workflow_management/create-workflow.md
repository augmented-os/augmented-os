# User Journey: Creating a New Workflow

## Overview

This user journey describes the steps a user takes to create a new workflow definition using the visual designer, configure its steps, and prepare it for execution.

## Primary Persona(s)

* [Mark Reynolds - The AI Automation Agency Owner](../../vision/personas/ai-automation-agency-persona.md) (for creating bespoke solutions/templates)
* [Sarah Wilson - The Short-Term Rental Manager](../../vision/personas/property-manager-persona.md) (for creating business workflows)

## Journey Flow


1. **Starting Point**
   * Initial state/context: User is logged into the Augmented OS platform and navigated to the Workflow section.
   * User's goal/intention: To define a new automated or semi-automated business process.
2. **Steps**
   * **Step 1**: Initiate Workflow Creation
     * **User Action**: Clicks the "Create New Workflow" button.
     * **System Response**: Opens the Workflow Designer interface with a blank canvas or template selection screen.
     * **Success Criteria**: Workflow Designer is displayed and ready for input.
   * **Step 2**: Define Workflow Basics
     * **User Action**: Enters a name (e.g., "Customer Inquiry Routing") and optionally a description for the workflow in the properties panel. Defines the input schema for the workflow using JSON Schema format.
     * **System Response**: Updates the workflow metadata and auto-saves changes. Validates the input schema format.
     * **Success Criteria**: Workflow name, description, and input schema are saved.
   * **Step 3**: Add Workflow Steps (Nodes)
     * **User Action**: Drags different types of nodes from the element palette onto the canvas and positions them to create the workflow structure. Available node types include:
       * **TASK Nodes**: For executing business logic (automated system tasks)
       * **HUMAN_TASK Nodes**: For steps requiring human intervention
       * **EVENT_WAIT Nodes**: For pausing the workflow until specific events occur
       * **DECISION Nodes**: For creating conditional branches based on workflow data
       * **PARALLEL Nodes**: For executing multiple branches simultaneously
       * **Start/End Nodes**: To define workflow entry and exit points
     * **System Response**: Places the selected nodes on the canvas. Provides contextual configuration options based on the node type. Auto-saves changes to the workflow structure.
     * **Success Criteria**: User can add and position multiple nodes representing the different aspects of their business process.
   * **Step 4**: Connect Steps (Edges)
     * **User Action**: Clicks and drags from the output port of one node to the input port of another node to define the execution flow. Creates conditional paths from decision nodes.
     * **System Response**: Draws connecting lines (edges) between nodes. Validates connections (e.g., prevents cycles if not allowed). Highlights connection points. Auto-saves the workflow.
     * **Success Criteria**: User can define the sequence and branching logic of the workflow by connecting nodes.
   * **Step 5**: Configure Steps
     * **User Action**: Selects individual nodes on the canvas to configure them. Configuration options vary by node type:
       * **For TASK nodes**: Selects task type from available registered tasks (each with predefined input/output schemas), maps previous step outputs or workflow input to task inputs, and configures how task outputs are stored in workflow state
       * **For HUMAN_TASK nodes**: Configures assignee roles, forms, priority, and due dates
       * **For EVENT_WAIT nodes**: Defines event patterns to listen for, conditions, timeout handling, and payload mapping
       * **For DECISION nodes**: Creates condition paths with expressions that evaluate workflow state data and specifies target steps
       * **For PARALLEL nodes**: Defines multiple execution branches and their join behavior
     * **System Response**: Properties panel updates to show configuration options specific to the selected node type. Validates inputs in real-time. Suggests mappings for inputs/outputs. Auto-saves configuration changes.
     * **Success Criteria**: Each step in the workflow is configured with the necessary parameters, logic, and data mappings appropriate for its type.
   * **Step 6**: Configure Advanced Workflow Settings
     * **User Action**: Navigates to the advanced settings panel to configure workflow-level options:
       * **Output Schema**: Defines the structure of the workflow's output data using JSON Schema and how the final output is constructed from the outputs of completed steps
       * **Compensation Steps**: Configures actions to perform if the workflow fails or is cancelled
       * **Error Handling**: Sets up global error policies, retries, and timeout behaviors
       * **Execution Logging**: Configures the level of detail for workflow execution logging
       * **Access Control**: Sets permissions for who can view or execute the workflow
     * **System Response**: Updates the workflow configuration with the advanced settings. Provides validation feedback for each setting type. Auto-saves changes.
     * **Success Criteria**: Workflow is configured with appropriate output format, error handling, and compensation mechanisms.
   * **Step 7**: Create and Execute Tests
     * **User Action**: Navigates to the testing tab and creates one or more test definitions for the workflow:
       * Creates test cases with specific input values
       * Defines expected outputs and intermediate states
       * Configures assertions to validate workflow behavior
       * Sets up mocks for dependencies if needed
       * Executes tests and reviews results
       * Saves tests for future regression testing
     * **System Response**: 
       * Provides a test definition interface with input/assertion configuration
       * Executes tests against the workflow in a sandbox environment
       * Shows execution path, intermediate states, and test results in real-time
       * Highlights any assertion failures or performance issues
       * Stores test definitions and results for future reference
     * **Success Criteria**: 
       * User creates comprehensive tests that validate workflow functionality
       * Tests execute successfully or reveal issues to be addressed
       * Test definitions are saved for ongoing quality assurance
   * **Step 8**: Validate Workflow
     * **User Action**: Clicks a "Validate" button or relies on real-time validation indicators.
     * **System Response**: Performs comprehensive validation checks including:
       * Structural integrity (e.g., start/end nodes connected, no unreachable steps)
       * Configuration completeness (e.g., all required parameters set)
       * Data flow consistency (e.g., output from one step maps correctly to input of the next)
       * Logical issues (e.g., potential infinite loops, contradictory conditions)
     * **Success Criteria**: Workflow validity is checked, and any errors are clearly presented to the user.
   * **Step 9**: Finalize and Prepare for Activation
     * **User Action**: Reviews the workflow and clicks a "Finalize" button to mark it as ready for use.
     * **System Response**: Completes final validations, marks the workflow as ready, and provides options for activation.
     * **Success Criteria**: The workflow is finalized and prepared for execution.
     * **Next Steps**: To make the workflow active and executable, the user must create at least one trigger. This can be done by following the [Creating a Workflow Trigger](./create-workflow-trigger.md) user journey. Trigger options include:
       * Event-based triggers that respond to system or business events
       * Schedule-based triggers for periodic execution
       * Manual triggers for on-demand execution
       * Integration-based triggers from external systems
3. **End State**
   * Final state/outcome: A new workflow definition is created, validated, and ready to be activated through one or more triggers.
   * Success indicators: User receives confirmation of successful finalization. The workflow appears in the list of available workflow definitions with a status indicating it requires triggers to become active.

## Alternative Paths

* **Using a Template**: User starts by selecting a pre-defined workflow template instead of a blank canvas, then modifies it.
* **Importing Definition**: User imports an existing workflow definition (e.g., JSON file) instead of building it visually.
* **Saving as Draft**: User can exit at any point, and the workflow will be saved as a draft to continue editing later.

## Error Scenarios

* **Validation Error During Finalization**:
  * **Trigger**: User tries to finalize a workflow with validation errors (e.g., unconnected nodes, missing configuration).
  * **System Response**: Prevents finalization. Clearly indicates errors that need fixing.
  * **Recovery Path**: User fixes the highlighted validation errors and attempts to finalize again.
* **Connection Conflict**:
  * **Trigger**: User attempts to create an invalid connection (e.g., connecting output of incompatible type to an input).
  * **System Response**: Prevents the connection, provides an error message explaining the incompatibility.
  * **Recovery Path**: User selects compatible ports or adds a transformation task if needed.
* **Auto-Save Failure (Network/DB Error)**:
  * **Trigger**: Network issue or database error occurs during the auto-save operation.
  * **System Response**: Informs the user about the save failure. Attempts to preserve the current state locally (e.g., in browser storage) if possible. Offers retry option.
  * **Recovery Path**: User retries saving. If persistent, checks network connection or contacts support. May need to export the definition locally as a backup.

## Related Items

* Related Features: [Workflow Canvas](../../features/workflow_designer/workflow_canvas.md), [Task Configuration](../../features/workflow_designer/task-configuration.md) #TODO (Needs creation)
* Related UI/UX: [Workflow Canvas Wireframe](../../ui_ux/wireframes/workflow-canvas.md)
* Dependencies: [Workflow Orchestrator Service](../../../architecture/components/workflow_orchestrator_service/README.md), [Task Execution Service](../../../architecture/components/task_execution_service/README.md), [Integration Service](../../../architecture/components/integration_service/README.md), [Testing Framework Service](../../../architecture/components/testing_framework_service/README.md)
* Related User Journeys: [Creating a Workflow Trigger](./create-workflow-trigger.md)

## Notes

This journey focuses on the definition phase. Testing, activation via triggers, and deployment are documented in separate user journeys. The designer provides real-time feedback and validation to catch errors early.