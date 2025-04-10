# Decision Nodes

## Overview

Decision nodes enable workflows to branch based on conditions, evaluating data and routing execution through different paths depending on the outcome. These nodes represent points where the workflow makes automated decisions, comparing values, checking conditions, or evaluating expressions to determine the next step in the process. The visual design emphasizes the conditional nature of these nodes and clearly indicates the different possible outcomes.

## Visual Design

### Base Appearance

```
+---------------------------------------------+
|  ⟁  Decision                 ⋮  |  ✓  |  ␡  |
+---------------------------------------------+
|                                             |
|  if (input.amount > 1000) {                 |
|    return "high-value";                     |
|  } else if (input.amount > 500) {           |
|    return "medium-value";                   |
|  } else {                                   |
|    return "low-value";                      |
|  }                                          |
+---------------------------------------------+
|  Paths: 3                   [ Configure ]   |
+---------------------------------------------+
```

* **Shape**: Rounded rectangle with 6px corner radius
* **Size**: Default 240px width × 140px height (resizable)
* **Header**: Yellow (#FBBC04) background with dark text
* **Header Icon**: Diamond/condition symbol (⟁) icon on the left side
* **Header Actions**: Menu, validation status, and delete buttons on the right
* **Content Area**: White background with condition preview
* **Footer**: Light gray background (#F8F8F8) with path count information

### Connection Points

* **Inputs**: One input port on the left side
  * Main input port at vertical center
  * Input data is used for condition evaluation
* **Outputs**: Multiple output ports on the right side
  * One port for each possible outcome/path
  * Ports are distributed evenly along the right edge
  * Ports are labeled with condition outcomes (e.g., "true", "false", or custom path names)

### Content Area Design

The content area provides a preview of the decision logic with:

* **Condition Display**: Shows the conditional logic in a readable format
* **Syntax Highlighting**: Colors for operators, values, and keywords
* **Path Visualization**: Visual indication of the different execution paths
* **Variable Highlighting**: Template variables (e.g., `{{input.amount}}`) highlighted in blue

## Decision Type Variations

### Boolean Decision

```
+---------------------------------------------+
|  ⟁  Boolean Decision         ⋮  |  ✓  |  ␡  |
+---------------------------------------------+
|                                             |
|  Condition:                                 |
|  input.isApproved === true                  |
|                                             |
+---------------------------------------------+
|  Paths: Yes / No            [ Configure ]   |
+---------------------------------------------+
```

* **Icon**: Standard decision icon
* **Content**: Shows single boolean expression
* **Footer**: Shows "Yes/No" or "True/False" paths

### Multi-Path Decision

```
+---------------------------------------------+
|  ⟁  Multi-Path Decision      ⋮  |  ✓  |  ␡  |
+---------------------------------------------+
|                                             |
|  Switch (input.status) {                    |
|    case "pending": return "review";         |
|    case "approved": return "process";       |
|    case "rejected": return "notify";        |
|    default: return "error";                 |
|  }                                          |
|                                             |
+---------------------------------------------+
|  Paths: 4                    [ Configure ]   |
+---------------------------------------------+
```

* **Icon**: Standard decision icon
* **Content**: Shows switch/case or if/else if structure
* **Footer**: Shows number of defined paths

### Expression Decision

```
+---------------------------------------------+
|  ⟁  Expression Decision      ⋮  |  ✓  |  ␡  |
+---------------------------------------------+
|                                             |
|  Expression:                                |
|  input.score > 80 ? "high" :                |
|  input.score > 50 ? "medium" : "low"        |
|                                             |
+---------------------------------------------+
|  Paths: 3                    [ Configure ]   |
+---------------------------------------------+
```

* **Icon**: Standard decision icon with math symbols
* **Content**: Shows ternary or complex expressions
* **Footer**: Shows path count

### Rule-Based Decision

```
+---------------------------------------------+
|  📋  Rule-Based Decision     ⋮  |  ✓  |  ␡  |
+---------------------------------------------+
|                                             |
|  Rules:                                     |
|  - If amount > 1000 AND region = "EU"       |
|    → high-priority-eu                       |
|  - If amount > 1000 AND region = "NA"       |
|    → high-priority-na                       |
|  - If amount <= 1000                        |
|    → standard-process                       |
|                                             |
+---------------------------------------------+
|  Rules: 3                    [ Configure ]   |
+---------------------------------------------+
```

* **Icon**: Checklist (📋) icon
* **Content**: Shows business rules in human-readable format
* **Footer**: Shows rule count

## Node States

Decision nodes display these states:

| State | Visual Appearance |
|----|----|
| **Default** | Standard appearance as described above |
| **Selected** | Blue outline (2px) with resize handles |
| **Hover** | Slight elevation increase (shadow enhancement) |
| **Focused** | Blue dashed outline (for keyboard navigation) |
| **Evaluating** | Yellow pulsing border during condition evaluation |
| **Path Taken** | Momentary highlight of the selected path |
| **Evaluation Error** | Red outline with error icon |
| **No Matching Path** | Orange warning with "no match" icon |
| **Invalid Condition** | Red warning with syntax error indicator |

## Expression Editor

When "Configure" is clicked, the properties panel shows a specialized expression editor:

```
+-----------------------------------------------------+
|  CONDITION EDITOR                                   |
+-----------------------------------------------------+
|                                                     |
|  if (                                               |
|    [ input.amount   ] [ > ] [ 1000           ]      |
|  ) {                                                |
|    return "high-value";                             |
|  } else if (                                        |
|    [ input.amount   ] [ > ] [ 500            ]      |
|  ) {                                                |
|    return "medium-value";                           |
|  } else {                                           |
|    return "low-value";                              |
|  }                                                  |
|                                                     |
|  [ + Add Condition ]                                |
|                                                     |
|  Result Paths:                                      |
|  ✓ high-value   [ Edit ]   [ X ]                    |
|  ✓ medium-value [ Edit ]   [ X ]                    |
|  ✓ low-value    [ Edit ]   [ X ]                    |
|  [ + Add Path ]                                     |
|                                                     |
+-----------------------------------------------------+
```

* **Visual Editor**: Drag-and-drop interface for building conditions
* **Field Selection**: Dropdown to select input fields to evaluate
* **Operator Selection**: Visual selection of comparison operators
* **Path Management**: Interface for adding, editing, and removing paths
* **Code View**: Option to toggle between visual and code editor
* **Testing Tools**: Ability to test conditions with sample data

## Interactive Elements

Decision nodes provide these interactive elements:

* **Configure Button**: Opens the condition editor in the properties panel
* **Path Labels**: Clickable labels to configure individual paths
* **Add Path Button**: Quick access to add a new condition path
* **Menu Button**: Additional options (templates, validation, etc.)
* **Test Button**: Evaluates the condition with provided test data
* **Validation Button**: Checks the condition for syntax errors

## Properties Panel Integration

When a Decision node is selected, the properties panel shows:

* **Condition Editor Tab**:
  * Visual condition builder
  * Code editor for direct editing
  * Syntax validation tools
  * Path management interface
* **Testing Tab**:
  * Sample data input
  * Condition evaluation preview
  * Path highlighting based on test data
  * Result visualization
* **Options Tab**:
  * Decision node type selection
  * Default path configuration
  * Error handling settings
  * Path naming options
* **Advanced Tab**:
  * Custom expression language selection
  * Performance optimization settings
  * Timeout configuration
  * Complex rule import/export

## Decision Flow Visualization

Decision nodes feature special visual aids to show flow paths:

* **Path Highlighting**: When a decision node is selected, all possible paths are highlighted
* **Active Path**: During execution, the taken path is highlighted
* **Path Labels**: Connection lines are labeled with condition outcomes
* **Truth Table**: Optional visualization showing all possible combinations and outcomes

## Accessibility Considerations

* **Color Independence**: The diamond/condition icon and node shape ensure it's recognizable without relying solely on color
* **Screen Reader Support**:
  * Announces "Decision Node" with condition summary
  * Path information properly conveyed
  * Error states clearly verbalized
* **Keyboard Navigation**:
  * Tab stops for all interactive elements
  * Keyboard shortcuts for condition editing
  * Arrow key navigation in the expression editor

## Usage Guidelines

* **Condition Clarity**: Write clear, readable conditions that express business logic
* **Path Naming**: Use descriptive names for paths rather than just "true" and "false"
* **Default Paths**: Always include a default/fallback path for unexpected cases
* **Complexity Management**: Break complex decisions into multiple nodes for clarity
* **Testing**: Validate decision paths with representative test data
* **Documentation**: Add comments to explain complex decision logic

## Related Components

* [Canvas Appearance](../canvas/appearance.md): Overall canvas styling context
* [Properties Panel](../panels/properties-panel.md): Where detailed condition configuration occurs
* [Human Task Nodes](./human-task-nodes.md): Often used after decision nodes require human judgment
* [Parallel Nodes](./parallel-nodes.md): Alternative to decision nodes when all paths should be taken


