# Start/End Nodes

## Overview

Start and End nodes serve as the entry and exit points in a workflow, visually marking where workflow execution begins and terminates. These nodes have distinct visual appearances that set them apart from other node types, emphasizing their special role in defining workflow boundaries.

## Visual Design

### Start Node

The Start node represents the beginning of workflow execution:

#### Base Appearance

```
       +----------------+
       |                |
       |       →        |
       |                |
       +----------------+
```

* **Shape**: Circular (60px diameter)
* **Background**: Green gradient (#34A853 to #27843E)
* **Icon**: White right-pointing arrow (→) centered in node
* **Border**: None (filled shape)
* **Shadow**: Subtle drop shadow (2px blur, 1px y-offset, 20% opacity)
* **Label**: "Start" label appears below the circle by default

#### Connection Points

* **Inputs**: None (cannot have incoming connections)
* **Outputs**: Single output port centered on the right edge
* **Output Styling**: White circle (8px diameter) with subtle glow effect on hover

### End Node

The End node represents the termination point of workflow execution:

#### Base Appearance

```
       +----------------+
       |                |
       |       ✓        |
       |                |
       +----------------+
```

* **Shape**: Circular (60px diameter)
* **Background**: Red gradient (#EA4335 to #C5221F)
* **Icon**: White checkmark (✓) centered in node
* **Border**: None (filled shape)
* **Shadow**: Subtle drop shadow (2px blur, 1px y-offset, 20% opacity)
* **Label**: "End" label appears below the circle by default

#### Connection Points

* **Inputs**: Single input port centered on the left edge
* **Outputs**: None (cannot have outgoing connections)
* **Input Styling**: White circle (8px diameter) with subtle glow effect on hover

## Node States

Start and End nodes display these states:

### Start Node States

| State | Visual Appearance |
|----|----|
| **Default** | Green circular node with arrow icon |
| **Selected** | Blue outline (2px) around the node |
| **Hover** | Slight brightness increase and shadow enhancement |
| **Focused** | Blue dashed outline for keyboard navigation |
| **Executing** | Pulsing glow effect and rotation of arrow icon |
| **Invalid** | Red outline with warning icon overlay |

### End Node States

| State | Visual Appearance |
|----|----|
| **Default** | Red circular node with checkmark icon |
| **Selected** | Blue outline (2px) around the node |
| **Hover** | Slight brightness increase and shadow enhancement |
| **Focused** | Blue dashed outline for keyboard navigation |
| **Completed** | Bright green pulse effect (momentarily) |
| **Invalid** | Red outline with warning icon overlay |

## Variations

### Terminal End Node

A special variant used to indicate workflow termination due to errors:

* **Shape**: Circular (60px diameter)
* **Background**: Dark red gradient (#D93025 to #B31412)
* **Icon**: White X icon centered in node
* **Border**: None (filled shape)
* **Label**: "Error" label appears below the circle by default

### Multiple Start/End Support

When workflows support multiple entry or exit points:

#### Multiple Start Nodes

* **Primary Start**: Standard green styling as described above
* **Secondary Start**: Same shape but with lighter green gradient
* **Naming**: Automatically appended with numbers ("Start 1", "Start 2", etc.)

#### Multiple End Nodes

* **Primary End**: Standard red styling as described above
* **Secondary End**: Same shape but with lighter red gradient
* **Naming**: Automatically appended with numbers or can be named based on outcome ("Success End", "Failure End", etc.)

## Interaction Patterns

### Start Node Interactions

* **Placement**: Can only be placed at the beginning of workflow branches
* **Connections**: Can only create outgoing connections, no incoming
* **Properties**: Minimal properties compared to other nodes:
  * Custom label (optional)
  * Description (optional)
  * Initial data payload configuration

### End Node Interactions

* **Placement**: Can only be placed at the end of workflow branches
* **Connections**: Can only receive incoming connections, no outgoing
* **Properties**: Minimal properties compared to other nodes:
  * Custom label (optional)
  * Description (optional)
  * Output data mapping

### Common Interactions

* **Repositioning**: Can be moved freely on the canvas
* **Renaming**: Double-click the label to edit the name
* **Context Menu**: Right-click to access node-specific options

## Validation

Start and End nodes have specific validation rules:

### Start Node Validation

* **Required Presence**: Workflow must have at least one Start node
* **Connection Requirement**: Must have at least one outgoing connection
* **Position Validation**: Must be positioned at logical workflow entry points

### End Node Validation

* **Required Presence**: Workflow must have at least one End node
* **Connection Requirement**: Must have at least one incoming connection
* **Position Validation**: Must be positioned at logical workflow exit points

### Visual Indicators

* **Missing Connection**: Pulsing highlight on the port that needs connection
* **Validation Error**: Red outline with warning icon in top-right
* **Hover Details**: Tooltip explaining specific validation issue

## Accessibility Considerations

Start and End nodes have specific accessibility accommodations:

* **Color Independence**: The distinct circular shape and icons ensure they're recognizable without relying solely on color
* **Screen Reader Text**: Announces "Workflow start point" and "Workflow end point" with additional context
* **Keyboard Navigation**: Can be directly accessed via shortcuts (Alt+Home for Start, Alt+End for End)
* **High Contrast Mode**: Maintains clear distinction in high contrast theme with pattern differentiation

## Usage Guidelines

* **Placement**: Position Start nodes at the top/left of the workflow and End nodes at the bottom/right
* **Quantity**: Use a single Start and End node when possible for clarity
* **Multiple Starts**: Use multiple starts only when truly separate entry points are required
* **Multiple Ends**: Use multiple ends to represent distinctly different workflow outcomes
* **Labeling**: When using multiple Start/End nodes, give them descriptive names

## Related Components

* [Canvas Appearance](../canvas/appearance.md): Overall canvas styling context
* [Canvas Validation](../canvas/validation.md): Validation indicators system
* [Decision Nodes](./decision-nodes.md): Often connect to multiple End nodes


