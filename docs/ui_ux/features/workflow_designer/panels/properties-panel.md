# Properties Panel

## Overview

The Properties Panel provides contextual configuration options for the currently selected element in the workflow designer. It dynamically adapts its content based on the type of element selected (node, connection, or canvas area). This panel enables users to customize behaviors, set parameters, define data mappings, and configure execution options without leaving the main workflow view.

## Visual Design

### Base Appearance

```
+-----------------------------------+
| Properties              | 🗕 |☐| ✕ |
+-----------------------------------+
| Code Task: Parse JSON           ↓ |
+-----------------------------------+
| General | Code | Input | Output   |
+-----------------------------------+
|                                   |
| ◆ General Settings                |
|                                   |
| Name                              |
| [ Parse JSON Response         ]   |
|                                   |
| Description                       |
| [ Parses API response JSON and ]  |
| [ extracts relevant fields     ]  |
| [                              ]  |
|                                   |
| Tags                              |
| [ parsing  ] [ json ] [ + ]       |
|                                   |
| ◆ Execution Settings              |
|                                   |
| Timeout                           |
| [ 30 ] [ seconds        ▼ ]       |
|                                   |
| [ ] Retry on failure              |
|  ┌── Retry attempts ───────────┐  |
|  | [ 3 ] attempts           ▼  |  |
|  └───────────────────────────┘  |
|                                   |
| ◆ Advanced                        |
|                                   |
| Error handling                    |
| [Propagate to error path   ▼]     |
|                                   |
+-----------------------------------+
|       [ Apply ]  [ Cancel ]       |
+-----------------------------------+
```

* **Panel Width**: Default 320px (resizable)
* **Header**: Shows element type and name with dropdown for multiple selections
* **Tab Bar**: Context-sensitive tabs for different aspects of configuration
* **Section Headers**: Collapsible sections for logical grouping of options
* **Form Controls**: Appropriate input controls based on parameter types
* **Footer**: Action buttons for saving or discarding changes

## Dynamic Adaptation

The Properties Panel adapts to the currently selected element:

### Node Properties

When a node is selected, the panel shows:

* Node-specific configuration options
* Common node properties (name, description, tags)
* Execution settings (timeout, retry, error handling)
* Input/output data mapping controls

### Connection Properties

When a connection (edge) is selected, the panel shows:

* Connection type configuration
* Condition expressions (for conditional paths)
* Data transformation options
* Visual styling options

### Canvas Properties

When the canvas background is selected, the panel shows:

* Workflow-level properties
* Canvas display settings
* Global variables
* Documentation editing

### Multi-Selection Properties

When multiple elements are selected, the panel shows:

* Common properties that can be batch-edited
* Selection statistics
* Group operations

## Tab Organization

The Properties Panel organizes content into context-sensitive tabs:

### Common Tabs (For All Node Types)

* **General**: Basic information and common settings
* **Input**: Input data mapping and parameter configuration
* **Output**: Output data definition and mapping
* **Execution**: Runtime settings (timeouts, retries, error handling)

### Node-Specific Tabs

Different node types have specialized tabs:

| Node Type | Custom Tabs | Content |
|----|----|----|
| **Code Task** | Code | Code editor, language selection, library dependencies |
| **Human Task** | Form, Assignment | Form builder, assignee selection, deadline settings |
| **Integration Task** | Connection, Authentication, Operation | Connection settings, auth configuration, operation selection |
| **Decision** | Conditions, Testing | Condition editor, test data, truth tables |
| **Event Wait** | Event Type, Timeout | Event configuration, timeout settings |

## Interactive Elements

### Form Controls

The Properties Panel includes these form controls:

* **Text Fields**: Single and multi-line text input
* **Dropdowns**: Selection from predefined options
* **Checkboxes/Toggles**: Boolean options
* **Radio Buttons**: Mutually exclusive options
* **Tags Input**: Adding/removing multiple tag values
* **Number Inputs**: Numeric entry with optional constraints
* **Sliders**: Visual adjustment of numeric values
* **Color Pickers**: Visual selection of colors
* **Icon Selectors**: Visual selection of icons

### Specialized Controls

In addition to standard form controls, specialized controls include:

* **Code Editor**: Syntax-highlighted editor for script-based nodes
* **JSON Editor**: Structured editor for JSON configuration
* **Form Builder**: Visual editor for human task forms
* **Expression Builder**: Visual builder for conditions and expressions
* **Data Mapper**: Visual mapping between input and output fields
* **Schedule Editor**: Visual editor for time-based configurations

## Conditional Display

The Properties Panel shows or hides options based on context:

* **Dependent Fields**: Fields that appear based on the value of another field
* **Permission-Based Controls**: Fields that appear based on user permissions
* **Mode-Based Sections**: Sections that appear based on advanced/basic mode toggle
* **Progressive Disclosure**: Gradual revelation of complex options

## States and Validation

The panel provides feedback about the validity of configuration:

* **Field Validation**: Real-time validation with inline error messages
* **Section Validation**: Visual indicators for sections with errors
* **Tab Validation**: Indicators on tabs containing errors
* **Submit Prevention**: Disabled Apply button when configuration is invalid
* **Error Summary**: Option to view a summary of all validation errors

## Data Binding and Expression Support

### Data Binding

Properties support binding to dynamic data:

```
+-----------------------------------+
| Filter Condition                  |
| [input.status] [ = ] [completed]  |
|                                   |
| Available Variables:              |
| ├─ input                          |
| │  ├─ order                       |
| │  │  ├─ id                       |
| │  │  ├─ status                   |
| │  │  └─ items                    |
| │  └─ customer                    |
| └─ workflow                       |
|    ├─ id                          |
|    └─ startTime                   |
+-----------------------------------+
```

* **Variable Browser**: Tree view of available variables
* **Auto-completion**: Suggests variables as user types
* **Syntax Highlighting**: Distinguishes variables, operators, and literals
* **Type Checking**: Validation based on expected data types

### Expression Support

Properties can use expressions with these features:

* **Expression Editor**: Specialized editor for complex expressions
* **Template Syntax**: `{{variable}}` syntax for embedding variables
* **Function Library**: Access to built-in functions
* **Expression Testing**: Ability to test expressions with sample data

## Context Menu Options

Right-clicking on various elements in the Properties Panel shows context-specific options:

* **Field Context Menu**: Copy value, reset to default, copy as reference
* **Section Context Menu**: Collapse/expand section, reset section
* **Tab Context Menu**: Switch to tab, reset tab values

## Common Patterns

### Input Mapping Pattern

For configuring how data flows into a node:

```
+-----------------------------------+
| ◆ Input Parameters                |
|                                   |
| orderId                           |
| Source: [workflow.input    ▼]     |
| Path: [order.id               ]   |
|                                   |
| quantity                          |
| Source: [From previous node ▼]    |
| Path: [response.items[0].qty  ]   |
|                                   |
| [ + Add Parameter ]               |
+-----------------------------------+
```

### Output Mapping Pattern

For configuring how node results are exposed:

```
+-----------------------------------+
| ◆ Output Mapping                  |
|                                   |
| [ ] Export all outputs            |
|                                   |
| [x] Map to specific variables     |
|                                   |
| result.processed                  |
| Target: [workflow.data     ▼]     |
| Path: [order.isProcessed      ]   |
|                                   |
| [ + Add Mapping ]                 |
+-----------------------------------+
```

### Error Handling Pattern

For configuring response to errors:

```
+-----------------------------------+
| ◆ Error Handling                  |
|                                   |
| On Error:                         |
| (•) Follow error path             |
| ( ) Throw and halt workflow       |
| ( ) Ignore and continue           |
| ( ) Custom handler                |
|                                   |
| Error Output:                     |
| [x] Include error message         |
| [x] Include stack trace           |
| [ ] Include input parameters      |
+-----------------------------------+
```

## Specialized Interfaces

### Code Editor Interface

For Code Task nodes:

```
+-----------------------------------+
| ◆ Code                            |
|                                   |
| Language: [JavaScript      ▼]     |
|                                   |
| +-------------------------------+ |
| | function process(input) {     | |
| |   try {                       | |
| |     const data = JSON.parse(  | |
| |       input.responseBody      | |
| |     );                        | |
| |     return {                  | |
| |       result: data,           | |
| |       parsed: true            | |
| |     };                        | |
| |   } catch (err) {             | |
| |     return {                  | |
| |       error: err.message,     | |
| |       parsed: false           | |
| |     };                        | |
| |   }                           | |
| | }                             | |
| +-------------------------------+ |
|                                   |
| [ Format ] [ Run Test ]           |
|                                   |
| Runtime: [Node.js 18.x      ▼]    |
|                                   |
+-----------------------------------+
```

### Form Builder Interface

For Human Task nodes:

```
+-----------------------------------+
| ◆ Form Builder                    |
|                                   |
| +-------------------------------+ |
| | [ Add Field ▼ ]               | |
| |                               | |
| | ┌─ Header ────────────────┐  | |
| | │ Expense Approval        │  | |
| | └───────────────────────┬─┘  | |
| |                         │    | |
| | ┌─ Text Field ─────────┐│    | |
| | │ Expense Amount       ││    | |
| | │ [ {{input.amount}} ] ││    | |
| | └──────────────────────┘│    | |
| |                         │    | |
| | ┌─ Dropdown ───────────┐│    | |
| | │ Department           ││    | |
| | │ [ {{user.dept}}    ] ││    | |
| | └──────────────────────┘│    | |
| |                         │    | |
| | ┌─ Radio Group ────────┐│    | |
| | │ Decision             ││    | |
| | │ (•) Approve          ││    | |
| | │ ( ) Reject           ││    | |
| | │ ( ) Request Changes  ││    | |
| | └─────────────────────┬┘│    | |
| |                       ││     | |
| | [ Save Form ] [ Preview ││]    | |
| +─────────────────────────────+ |
+-----------------------------------+
```

### Connection Configuration Interface

For integration nodes:

```
+-----------------------------------+
| ◆ REST API Configuration          |
|                                   |
| Endpoint                          |
| [ https://api.example.com/data ]  |
|                                   |
| Method                            |
| [ GET ▼ ]                         |
|                                   |
| ◆ Authentication                  |
|                                   |
| Type: [ Bearer Token        ▼ ]   |
|                                   |
| Token:                            |
| [ {{env.API_TOKEN}}           ]   |
|                                   |
| ◆ Headers                         |
|                                   |
| Content-Type                      |
| [ application/json            ]   |
|                                   |
| Accept                            |
| [ application/json            ]   |
|                                   |
| [ + Add Header ]                  |
+-----------------------------------+
```

## Keyboard Navigation

The Properties Panel supports these keyboard interactions:

* **Tab Navigation**: Move between fields
* **Section Navigation**: Alt + up/down arrows to move between sections
* **Tab Switching**: Ctrl + Tab to switch between property tabs
* **Quick Apply**: Ctrl + Enter to apply changes
* **Cancel**: Escape to cancel changes
* **Collapse/Expand**: Space to toggle sections when focused on header

## Accessibility Considerations

* **Keyboard Navigation**: Complete keyboard control of all properties
* **Form Labels**: All form controls have proper labels
* **Grouping**: Logical grouping with appropriate ARIA landmarks
* **Error Messaging**: Accessible error notifications
* **Focus Management**: Proper focus handling for dynamic content
* **Screen Reader Compatibility**: Proper announcements of state changes

## Related Components

* [Node Types Overview](../nodes/README.md): Detailed information about available node types
* [Canvas Interaction](../canvas/interaction.md): How selections in the canvas affect the Properties Panel
* [Node Palette](./node-palette.md): Where nodes are selected before configuration


