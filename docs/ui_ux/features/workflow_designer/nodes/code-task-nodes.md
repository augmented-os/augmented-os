# Code Task Nodes

## Overview

Code Task nodes enable users to run custom code snippets as part of their workflow. These nodes provide a way to implement custom logic, data transformations, and complex business rules directly within a workflow. The visual design emphasizes code readability while providing controls for runtime configuration.

## Visual Design

### Base Appearance

```
+---------------------------------------------+
|  📝  JavaScript              ⋮  |  ✓  |  ␡  |
+---------------------------------------------+
|                                             |
|  function process(input) {                  |
|    // Transform the input data              |
|    const result = {                         |
|      ...input,                              |
|      processed: true,                       |
|      timestamp: new Date().toISOString()    |
|    };                                       |
|    return result;                           |
|  }                                          |
+---------------------------------------------+
|  Runtime: Node.js 16          [ Edit ]      |
+---------------------------------------------+
```

- **Shape**: Rounded rectangle with 6px corner radius 
- **Size**: Default 240px width × 160px height (resizable)
- **Header**: Dark blue (#2D4B8E) background with white text
- **Header Icon**: Code/script icon (📝) on the left side
- **Header Actions**: Menu, validation status, and delete buttons on the right
- **Content Area**: Code preview with syntax highlighting
- **Footer**: Light gray background (#F8F8F8) with runtime information

### Connection Points

- **Inputs**: One or more input ports on the left side
  - Primary input port at vertical center
  - Additional input ports for different data streams (optional)
  - Ports are labeled with parameter names when multiple inputs exist

- **Outputs**: One or more output ports on the right side
  - Primary output port at vertical center for successful execution results
  - Error output port for handling execution errors (optional)
  - Additional outputs for different result types (optional)

### Content Area Design

The content area provides a preview of the code with:

- **Syntax Highlighting**: Language-appropriate syntax coloring
- **Embedded Code Editor**: Simplified view of actual code
- **Line Numbers**: Visible when in edit mode
- **Scrollable Area**: For longer code snippets
- **Code Folding**: For functions and code blocks when expanded

## Language/Runtime Variations

### JavaScript/Node.js

```
+---------------------------------------------+
|  📝  JavaScript              ⋮  |  ✓  |  ␡  |
+---------------------------------------------+
|                                             |
|  function process(input) {                  |
|    const transformed = input.data.map(      |
|      item => ({                             |
|        id: item.id,                         |
|        value: item.value * 2                |
|      })                                     |
|    );                                       |
|    return { result: transformed };          |
|  }                                          |
+---------------------------------------------+
|  Runtime: Node.js 16          [ Edit ]      |
+---------------------------------------------+
```

- **Icon**: JS logo or code icon
- **Syntax Highlighting**: JavaScript-specific highlighting
- **Footer**: Shows Node.js runtime version

### Python

```
+---------------------------------------------+
|  🐍  Python                  ⋮  |  ✓  |  ␡  |
+---------------------------------------------+
|                                             |
|  def process(input_data):                   |
|      result = []                            |
|      for item in input_data.get("items"):   |
|          if item["priority"] > 5:           |
|              result.append(item)            |
|      return {"filtered": result}            |
|                                             |
+---------------------------------------------+
|  Runtime: Python 3.9          [ Edit ]      |
+---------------------------------------------+
```

- **Icon**: Python logo (🐍)
- **Syntax Highlighting**: Python-specific highlighting
- **Footer**: Shows Python runtime version

### SQL

```
+---------------------------------------------+
|  🛢️  SQL                     ⋮  |  ✓  |  ␡  |
+---------------------------------------------+
|                                             |
|  SELECT                                     |
|    u.id, u.name, u.email,                   |
|    COUNT(o.id) as order_count               |
|  FROM                                       |
|    users u                                  |
|  LEFT JOIN orders o ON u.id = o.user_id     |
|  WHERE                                      |
|    u.status = 'active'                      |
|  GROUP BY u.id                              |
|  HAVING order_count > {{input.min_orders}}  |
+---------------------------------------------+
|  Database: PostgreSQL         [ Edit ]      |
+---------------------------------------------+
```

- **Icon**: Database icon (🛢️)
- **Syntax Highlighting**: SQL-specific highlighting
- **Footer**: Shows database type

### Shell Script

```
+---------------------------------------------+
|  🖥️  Shell Script             ⋮  |  ✓  |  ␡  |
+---------------------------------------------+
|                                             |
|  #!/bin/bash                                |
|  echo "Processing files in ${INPUT_DIR}"    |
|                                             |
|  for file in ${INPUT_DIR}/*.json; do        |
|    filename=$(basename "$file")             |
|    jq '.data' "$file" > "${OUTPUT_DIR}/$f..." |
|  done                                       |
|                                             |
|  echo "Processed $(ls ${OUTPUT_DIR} | wc..." |
+---------------------------------------------+
|  Runtime: Bash                [ Edit ]      |
+---------------------------------------------+
```

- **Icon**: Terminal/shell icon (🖥️)
- **Syntax Highlighting**: Shell script highlighting
- **Footer**: Shows shell type (Bash, PowerShell, etc.)

## Node States

Code task nodes display these states:

| State | Visual Appearance |
|-------|------------------|
| **Default** | Standard appearance as described above |
| **Selected** | Blue outline (2px) with resize handles |
| **Hover** | Slight elevation increase (shadow enhancement) |
| **Focused** | Blue dashed outline (for keyboard navigation) |
| **Expanded for Editing** | Larger view with full code editor |
| **Validating** | Blue pulsing border with "validating" indicator |
| **Valid** | Green checkmark in header |
| **Syntax Error** | Red warning with error details in tooltip |
| **Executing** | Blue pulsing border with progress indicator |
| **Successful Execution** | Momentary green outline pulse |
| **Failed Execution** | Red outline with error icon and details |

## Code Editor Expanded State

When "Edit" is clicked, the node expands to show a full-featured code editor:

```
+-----------------------------------------------------+
|  📝  JavaScript                      ⋮  |  ✓  |  ␡  |
+-----------------------------------------------------+
|  1|  /**                                            |
|  2|   * Process the input data and return a result  |
|  3|   * @param {object} input - The input data      |
|  4|   * @returns {object} The processed result      |
|  5|   */                                            |
|  6|  function process(input) {                      |
|  7|    // Transform the input data                  |
|  8|    const result = {                             |
|  9|      ...input,                                  |
| 10|      processed: true,                           |
| 11|      timestamp: new Date().toISOString()        |
| 12|    };                                           |
| 13|    return result;                               |
| 14|  }                                              |
+-----------------------------------------------------+
|  [ Run Test ]  [ Format ]  [ Save ]  [ Cancel ]     |
+-----------------------------------------------------+
```

- **Expanded Size**: 400px width × 300px height (or larger)
- **Line Numbers**: Visible along the left side
- **Toolbar**: Bottom toolbar with code actions
- **Scrolling**: Vertical and horizontal scrollbars as needed
- **Syntax Checking**: Real-time error/warning indicators
- **Auto-completion**: Code suggestions as user types

## Interactive Elements

Code task nodes provide these interactive elements:

- **Edit Button**: Opens the expanded code editor view
- **Run Test Button**: Executes the code with sample input
- **Format Button**: Auto-formats the code
- **Menu Button**: Additional options (version history, templates, etc.)
- **Validation Button**: Manually trigger code validation
- **Runtime Selector**: Dropdown in the footer for selecting language runtime

## Properties Panel Integration

When a Code node is selected, the properties panel shows:

- **Code Editor Tab**:
  - Full-featured code editor with syntax highlighting
  - Line numbers and error indicators
  - Function signature suggestions

- **Runtime Settings Tab**:
  - Language/runtime selection
  - Version selection
  - Memory and timeout settings
  - Environment variable configuration

- **Input/Output Schema Tab**:
  - Input schema definition
  - Output schema definition
  - Sample data for testing

- **Dependencies Tab**:
  - Package/library management
  - Version specifications
  - Import statements

## Accessibility Considerations

- **Color Independence**: Code syntax highlighting supports high contrast mode
- **Screen Reader Support**:
  - Announces code structure and syntax elements
  - Error messages properly communicated
  - Line number announcements
- **Keyboard Navigation**:
  - Full keyboard control of code editor
  - Shortcuts for common operations
  - Tab navigation between interactive elements

## Usage Guidelines

- **Code Visibility**: Keep the most important logic visible in the node preview
- **Error Handling**: Include proper error handling in code to utilize error output ports
- **Documentation**: Add code comments to explain complex logic
- **Testing**: Use the "Run Test" feature before saving to verify functionality
- **Reusability**: Create reusable code modules that can be shared across workflows
- **Security**: Avoid hardcoding sensitive information in code (use environment variables)

## Related Components

- [Canvas Appearance](../canvas/appearance.md): Overall canvas styling context
- [Properties Panel](../panels/properties-panel.md): Where detailed code editing occurs
- [Integration Task Nodes](./integration-task-nodes.md): Alternative for pre-built integrations
- [Environment Variables](../panels/environment-variables.md): For securing sensitive data
- [Version History](../panels/version-history.md): For tracking code changes


