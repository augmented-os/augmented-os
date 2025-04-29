# Connect External System

> **Mode:** Design-Time

## Overview

This user journey describes the process a user follows to set up and authenticate a connection (an Integration Instance) to an external system (like Salesforce, Stripe, Slack, etc.) using a pre-defined Integration Definition within the Augmented OS platform.

## Primary Persona(s)

* [Sarah Wilson - The Short-Term Rental Manager](../../vision/personas/property-manager-persona.md)
* [Mark Reynolds - The AI Automation Agency Owner](../../vision/personas/ai-automation-agency-persona.md)

## Preconditions

* User is logged into the Augmented OS platform with permissions to manage integrations.
* An Integration Definition for the desired external system exists in the Integration Catalog.
* User has the necessary credentials or permissions within the external system to authorize the connection.

## Journey Flow


1. **Starting Point**
   * Initial state/context: User is in the Integrations section of the Augmented OS platform.
   * User's goal/intention: To establish a usable, authenticated connection to a specific external system so it can be used in workflows.
2. **Steps**
   * **Step 1**: Select Integration Type
     * **User Action**: Browses or searches the Integration Catalog. Selects the desired integration definition (e.g., "Salesforce"). Clicks "Add Connection" or similar.
     * **System Response**: Opens the Connector Setup interface for the selected integration type.
     * **Success Criteria**: Connector Setup wizard for the chosen integration is displayed.
   * **Step 2**: Name and Describe Connection
     * **User Action**: Enters a unique, descriptive name for this specific connection instance (e.g., "Salesforce - Production Org", "Slack - Marketing Team"). Adds an optional description.
     * **System Response**: Accepts and stores the name and description. Validates name uniqueness if required.
     * **Success Criteria**: Connection instance has a user-defined name.
   * **Step 3**: Configure Integration Parameters
     * **User Action**: Fills in configuration fields specific to the integration, based on its `configSchema`. This might include API endpoints, region settings, custom options, etc. (e.g., Salesforce instance URL).
     * **System Response**: Presents a dynamic form based on the `configSchema`. Provides inline help and validation for each field.
     * **Success Criteria**: All required configuration parameters are filled in and validated.
   * **Step 4**: Define Context and Permissions (Optional)
     * **User Action**: Specifies the scope (global, client, user) and potentially configures which roles within Augmented OS can use this specific connection instance.
     * **System Response**: Saves the context and permission settings associated with the instance.
     * **Success Criteria**: Scope and access controls for the connection are defined.
   * **Step 5**: Initiate Authentication
     * **User Action**: Navigates to the Authentication section of the setup. Clicks "Connect" or "Authenticate".
     * **System Response**: Based on the integration's `authType`:
       * **OAuth2**: Redirects the user to the external system's authorization page or displays instructions.
       * **API Key**: Presents secure fields to enter the API key/secret.
       * **Basic Auth**: Presents fields for username/password.
       * **Other**: Presents the relevant custom authentication interface.
     * **Success Criteria**: User is presented with the appropriate authentication mechanism.
   * **Step 6**: Complete Authentication with External System
     * **User Action**: Follows the prompts provided by the system or the external service. (e.g., logs into Salesforce, grants permissions, copies API key). Enters required credentials back into the Augmented OS interface if necessary (e.g., API key).
     * **System Response**:
       * **OAuth2**: Receives callback from the external system, exchanges code for tokens.
       * **API Key/Basic**: Securely receives credentials entered by the user.
       * Stores credentials securely (encrypted) via the Credential Manager.
     * **Success Criteria**: Authentication credentials for the external system are successfully obtained and securely stored by Augmented OS.
   * **Step 7**: Test Connection and Validate Integration
     * **User Action**: 
       * Clicks a "Test Connection" button which runs a pre-built default test appropriate for the integration (e.g., for Xero, retrieving bank accounts without modifying data).
       * Optionally explores additional test methods via the Testing Console.
       * Can choose to save successful tests for future monitoring.
     * **System Response**: 
       * Executes the default integration test designed for the specific integration.
       * Displays detailed request/response information.
       * Indicates whether the test succeeded based on expected response patterns.
       * Provides option to save the test configuration for ongoing validation.
     * **Success Criteria**: 
       * Connection test succeeds, confirming the integration is properly configured and authenticated.
       * User understands what functionality is being verified by the test.
   * **Step 8**: Save Integration Instance
     * **User Action**: Clicks "Save" or "Finish".
     * **System Response**: Saves the fully configured and authenticated Integration Instance. Sets its status to "Connected". Confirms successful creation. The instance now appears in the list of active connections.
     * **Success Criteria**: A usable Integration Instance is created and available for use in workflows.
3. **End State**
   * Final state/outcome: A configured and authenticated connection (Integration Instance) to the external system exists within Augmented OS.
   * Success indicators: 
     * The new instance appears in the list with "Connected" status.
     * The default integration test has been successfully executed.
     * Optional additional tests may have been configured for ongoing monitoring.

## Alternative Paths

* **Authentication Failure**: If authentication with the external system fails (e.g., wrong credentials, permissions denied), the system shows an error, and the user must retry Step 6 or correct configuration/credentials.
* **Connection Test Failure**: If the connection test fails after successful authentication, the system provides diagnostic information (e.g., network error, permission issue on the external system side), and the user needs to troubleshoot before proceeding to Step 8.
* **Editing Existing Connection**: User selects an existing connection instance and modifies its configuration or re-authenticates it.

## Error Scenarios

* **Invalid Configuration Parameters**:
  * **Trigger**: User enters invalid data in the configuration form (e.g., malformed URL).
  * **System Response**: Inline validation error message. Prevents proceeding until corrected.
  * **Recovery Path**: User corrects the invalid parameter based on the error message.
* **OAuth Flow Interrupted/Failed**:
  * **Trigger**: User closes the authorization window, denies permission, or the external provider returns an error during the OAuth flow.
  * **System Response**: Displays an error message indicating the OAuth flow failed. Keeps the Integration Instance in a "Pending Authentication" state.
  * **Recovery Path**: User re-initiates the authentication process (Step 5).
* **API Key Rejected**:
  * **Trigger**: User enters an invalid or expired API key during setup or connection test.
  * **System Response**: Connection test fails with an "Authentication Error" message.
  * **Recovery Path**: User obtains a valid API key from the external system and re-enters it.
* **Test Configuration Issues**:
  * **Trigger**: Default test fails or user creates additional custom tests with invalid parameters.
  * **System Response**: Test execution fails with specific error details, such as invalid endpoint, permission issues, or unexpected response format.
  * **Recovery Path**: For default test failures, user verifies integration configuration settings. For custom tests, user adjusts test parameters or expected results based on actual system behavior.

## Related Items

* Related Features: [Connector Framework](../../features/integration_hub/connector-framework.md), [Authentication Management](../../features/integration_hub/authentication-management.md) (Needs creation)
* Related UI/UX: [Integration Hub Interface Wireframe](../../ui_ux/wireframes/integration-hub.md)
* Dependencies: [Integration Service](../../../architecture/components/integration_service/README.md), [Authentication Service](../../../architecture/components/auth_service/README.md), [Credential Manager](../../../architecture/components/integration_service/implementation/credential_manager.md)

## Notes

This journey focuses on establishing the connection. Using the connection within a workflow is covered in other journeys. Security and clear feedback during authentication are critical.