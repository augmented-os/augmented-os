# Settings Panel

## Overview

The Settings Panel provides configuration options for workflow-level settings that apply to the entire workflow rather than individual nodes or connections. It allows users to define metadata, global variables, permissions, version control settings, and execution parameters that affect how the workflow operates as a whole.

## Visual Design

### Base Appearance

```
+-----------------------------------+
| Workflow Settings       | 🗕 |☐| ✕ |
+-----------------------------------+
| General | Variables | Permissions |
+-----------------------------------+
|                                   |
| ◆ Workflow Information            |
|                                   |
| Name                              |
| [ Order Processing Pipeline    ]  |
|                                   |
| Description                       |
| [ End-to-end order processing  ]  |
| [ from receipt to fulfillment   ] |
| [                              ]  |
|                                   |
| Tags                              |
| [ orders ] [ processing ] [ + ]   |
|                                   |
| ◆ Version Control                 |
|                                   |
| Current Version                   |
| v1.2.3 (Last edited 2h ago)       |
|                                   |
| [   View History   ]              |
| [ Create Version Tag ]            |
|                                   |
| ◆ Execution Settings              |
|                                   |
| Default Timeout                   |
| [ 30 ] [ minutes        ▼ ]       |
|                                   |
| Concurrency Limit                 |
| [ 10 ] instances                  |
|                                   |
+-----------------------------------+
|         [ Save Settings ]         |
+-----------------------------------+
```

* **Panel Width**: Default 320px (resizable)
* **Header**: "Workflow Settings" title with standard panel controls
* **Tab Bar**: Context tabs for different categories of workflow settings
* **Section Headers**: Collapsible sections for logical grouping
* **Form Controls**: Appropriate input controls for different setting types
* **Footer**: Save button to apply all setting changes

## Tab Organization

The Settings Panel is organized into these primary tabs:

### General Tab

Contains basic workflow configuration:

* **Workflow Information**: Name, description, category
* **Version Control**: Version history, tagging, branching
* **Execution Settings**: Timeouts, concurrency, priority
* **Error Handling**: Global error policies
* **Logging**: Logging level and retention settings

### Variables Tab

For defining workflow-level variables:

```
+-----------------------------------+
| ◆ Global Variables                |
|                                   |
| [ + Add Variable ]                |
|                                   |
| maxRetryAttempts                  |
| Type: [ Integer           ▼ ]     |
| Value: [ 3                    ]   |
| [ ] Configurable at runtime       |
| [ ] Sensitive value               |
|                                   |
| apiBaseUrl                        |
| Type: [ String            ▼ ]     |
| Value: [ https://api.example.com ]|
| [x] Configurable at runtime       |
| [ ] Sensitive value               |
|                                   |
| apiKey                            |
| Type: [ String            ▼ ]     |
| Value: [ ••••••••••••••••••••• ]  |
| [x] Configurable at runtime       |
| [x] Sensitive value               |
|                                   |
| ◆ Environment Variables           |
|                                   |
| [ Show inherited variables ]      |
|                                   |
+-----------------------------------+
```

* **Variable Definition**: Type-safe variable creation
* **Default Values**: Initial values for variables
* **Runtime Configuration**: Flags for variables modifiable at runtime
* **Sensitive Data**: Special handling for secure information
* **Scope Management**: Inheritance from environment or organization settings

### Permissions Tab

For access control configuration:

```
+-----------------------------------+
| ◆ Access Control                  |
|                                   |
| Visibility                        |
| ( ) Private                       |
| (•) Shared with specific users    |
| ( ) Public within organization    |
|                                   |
| ◆ Specific Access                 |
|                                   |
| [ + Add User or Group ]           |
|                                   |
| Marketing Team                    |
| [   View & Run       ▼ ]  [ X ]   |
|                                   |
| operations@example.com            |
| [      Admin         ▼ ]  [ X ]   |
|                                   |
| john.smith@example.com            |
| [     Edit Only      ▼ ]  [ X ]   |
|                                   |
| ◆ Run Permissions                 |
|                                   |
| [ ] Allow API triggering          |
| [x] Require approval for changes  |
| [ ] Enable scheduled runs         |
|                                   |
+-----------------------------------+
```

* **Access Levels**: Configuration of who can view, edit, and run the workflow
* **User/Group Management**: Assignment of permissions to specific users or groups
* **Role Templates**: Predefined permission sets (Admin, Editor, Viewer)
* **Run Controls**: Special permissions for triggering workflow execution

### Triggers Tab

For configuring automatic workflow triggers:

```
+-----------------------------------+
| ◆ Execution Triggers              |
|                                   |
| [ + Add Trigger ]                 |
|                                   |
| Scheduled                         |
| [x] Enabled                       |
| Every: [ Monday      ▼] at [9:00] |
| Timezone: [ UTC+0          ▼ ]    |
| [ Edit ] [ Remove ]               |
|                                   |
| Webhook                           |
| [x] Enabled                       |
| URL: https://workflows.example.com|
|      /webhook/ord-proc/trigger    |
| [ Copy URL ] [ Regenerate ]       |
| [ Edit ] [ Remove ]               |
|                                   |
| Event Trigger                     |
| [ ] Enabled                       |
| Event: [ order.created     ▼ ]    |
| Filter: [ store = "retail" ]      |
| [ Edit ] [ Remove ]               |
|                                   |
+-----------------------------------+
```

* **Trigger Types**: Schedule, webhook, event, and other trigger mechanisms
* **Trigger Configuration**: Type-specific settings for each trigger
* **Activation Controls**: Enable/disable individual triggers
* **Webhook Management**: URL generation, security settings
* **Event Subscriptions**: Configuration of events that trigger the workflow

### Integration Tab

For third-party service connections:

```
+-----------------------------------+
| ◆ Connected Services              |
|                                   |
| [ + Connect Service ]             |
|                                   |
| Salesforce                        |
| Status: [✓] Connected             |
| Account: salesforce@example.com   |
| Last used: 2 hours ago            |
| [ Test Connection ] [ Disconnect ]|
|                                   |
| AWS                               |
| Status: [!] Authentication expired|
| Account: AWS Production           |
| [ Reconnect ] [ Remove ]          |
|                                   |
| ◆ API Settings                    |
|                                   |
| Authentication                    |
| Method: [ API Key          ▼ ]    |
| Rotation: [ Every 90 days   ▼ ]   |
| [ Regenerate Keys ]               |
|                                   |
+-----------------------------------+
```

* **Service Connections**: OAuth, API key, and other service authentication
* **Connection Status**: Health indicators for connected services
* **Credential Management**: Secure handling of authentication details
* **Connection Testing**: Tools to verify integration functionality
* **API Configuration**: Settings for the workflow's own API endpoints

## Interactive Elements

The Settings Panel includes these interactive elements:

* **Form Controls**: Standard input fields, dropdowns, checkboxes, etc.
* **Variable Editor**: Type-specific editors for different variable types
* **Version Timeline**: Visual representation of workflow version history
* **Permission Matrix**: Visual editor for role-based permissions
* **Schedule Builder**: Visual tool for creating time-based triggers
* **Test Connection**: Interactive verification of service connections

## Version Control Features

The Settings Panel provides version control capabilities:

```
+-----------------------------------+
| ◆ Version Timeline                |
|                                   |
| v1.3.0 (current) ───────────┐     |
| Created: Today at 14:25     │     |
| Author: john.smith          │     |
| [ Publish ] [ Revert ]      │     |
|                             │     |
| v1.2.0 (production) ────────┤     |
| Created: Yesterday at 10:15 │     |
| Author: john.smith          │     |
| [ Restore ] [ Compare ]     │     |
|                             │     |
| v1.1.0 ─────────────────────┤     |
| Created: 3 days ago         │     |
| Author: jane.doe            │     |
| [ Restore ] [ Compare ]     │     |
|                             │     |
| v1.0.0 ─────────────────────┘     |
| Created: 1 week ago         │     |
| Author: john.smith          │     |
| [ Restore ] [ Compare ]     │     |
|                                   |
| ◆ Version Actions                 |
|                                   |
| [ Create Branch ]                 |
| [ Export Version ]                |
| [ Import Version ]                |
+-----------------------------------+
```

* **Version History**: Timeline of workflow revisions
* **Tagging**: Creation of named tags for important versions
* **Branching**: Support for parallel development branches
* **Comparison**: Visual diff tools to compare workflow versions
* **Restore**: Ability to revert to previous versions
* **Export/Import**: Tools for version sharing and backup

## Workflow Testing Configuration

For defining test configurations:

```
+-----------------------------------+
| ◆ Test Scenarios                  |
|                                   |
| [ + Create Test ]                 |
|                                   |
| New Order Test                    |
| [x] Enabled                       |
| Input: JSON (15 lines)            |
| Expected: 3 assertions defined    |
| [ Edit ] [ Run ] [ Delete ]       |
|                                   |
| Invalid Order Test                |
| [x] Enabled                       |
| Input: JSON (10 lines)            |
| Expected: 2 assertions defined    |
| [ Edit ] [ Run ] [ Delete ]       |
|                                   |
| ◆ Test Settings                   |
|                                   |
| Environment                       |
| [ Testing            ▼ ]          |
|                                   |
| Test Data Source                  |
| ( ) Manual input                  |
| (•) Mock service                  |
| ( ) Development environment       |
|                                   |
+-----------------------------------+
```

* **Test Definition**: Creation and management of test cases
* **Input Configuration**: Definition of test input data
* **Assertion Builder**: Tools for defining expected outcomes
* **Test Execution**: Interface for running tests
* **Environment Selection**: Configuration of test environments

## Documentation Editor

For workflow documentation:

```
+-----------------------------------+
| ◆ Documentation                   |
|                                   |
| [ Preview ] [ Markdown Mode ]     |
|                                   |
| +-------------------------------+ |
| | # Order Processing Workflow   | |
| |                               | |
| | This workflow handles the     | |
| | end-to-end processing of      | |
| | customer orders.              | |
| |                               | |
| | ## Inputs                     | |
| | - `order`: Order object with  | |
| |   customer and items data     | |
| |                               | |
| | ## Outputs                    | |
| | - `orderConfirmation`: Object | |
| |   with tracking and delivery  | |
| |   information                 | |
| |                               | |
| | ## Dependencies               | |
| | - Requires active connection  | |
| |   to inventory system         | |
| +-------------------------------+ |
|                                   |
| ◆ Documentation Settings         |
|                                   |
| [ ] Auto-generate documentation   |
| [x] Include in workflow catalog   |
| [ ] Show in API documentation     |
|                                   |
+-----------------------------------+
```

* **Rich Text Editor**: Tools for creating formatted documentation
* **Markdown Support**: Option for markdown-based documentation
* **Documentation Templates**: Predefined templates for common patterns
* **Auto-generation**: Tools to generate docs from workflow structure
* **Preview Mode**: Rendered view of the documentation

## Adaptive Behavior

The Settings Panel adapts to different workflow types:

* **Template Workflows**: Additional settings for parameterization
* **Subflows**: Settings for integration with parent workflows
* **Public Workflows**: Enhanced documentation and sharing options
* **Event-Driven Workflows**: Expanded event configuration options
* **Scheduled Workflows**: Enhanced scheduling configuration

## Keyboard Navigation

The Settings Panel supports these keyboard shortcuts:

* **Tab Navigation**: Move between settings fields
* **Section Navigation**: Alt + up/down arrows to move between sections
* **Panel Navigation**: Ctrl + Tab to switch between settings tabs
* **Quick Save**: Ctrl + S to save all settings
* **Search**: Ctrl + F to search within settings
* **Help**: F1 to access context-sensitive help

## Accessibility Considerations

* **Keyboard Access**: Complete keyboard control of all settings
* **Form Labels**: All form controls have proper labels
* **Grouping**: Logical grouping with appropriate ARIA landmarks
* **Focus Management**: Proper focus handling for dynamic content
* **Screen Reader Support**: Descriptive announcements for all controls
* **Color Independence**: All status indicators use both color and icons

## Related Components

* [Canvas Appearance](../canvas/appearance.md): How settings affect canvas display
* [Node Palette](./node-palette.md): Relationship with available node types
* [Properties Panel](./properties-panel.md): Comparison with node-specific settings
* [Testing Panel](./testing-panel.md): Integration with workflow testing


