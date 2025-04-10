# Workflow Designer Panels

## Overview

Panels in the Workflow Designer provide contextual tools, configuration interfaces, and workflow information in dedicated regions of the user interface. These panels allow users to access and modify specific aspects of the workflow without cluttering the main canvas. The panels system follows a consistent design pattern while adapting content to the current user task or selected element.

## Panel System Architecture

The Workflow Designer uses a flexible panel system with the following characteristics:

* **Docking Positions**: Panels can be docked to the left, right, or bottom of the canvas
* **Resizable**: Users can adjust panel width/height to balance screen real estate
* **Collapsible**: Panels can be minimized to provide more space for the canvas
* **Detachable**: Selected panels can be detached into separate windows (where supported)
* **Responsive**: Panel layout adapts to screen size and orientation

## Panel Types

The Workflow Designer includes these primary panel types:

| Panel | Purpose | Default Position |
|----|----|----|
| [Node Palette](./node-palette.md) | Catalog of available node types to add to workflows | Left |
| [Properties Panel](./properties-panel.md) | Configure the currently selected node or connection | Right |
| [Settings Panel](./settings-panel.md) | Configure workflow-level settings | Right |
| [Testing Panel](./testing-panel.md) | Create and run tests for the workflow | Bottom |
| [Runs Panel](./runs-panel.md) | View execution history and results | Bottom |
| [AI Assistant Panel](./ai-assistant-panel.md) | Get AI-powered suggestions and help | Right |

## Common Panel Elements

All panels share these common UI elements and behaviors:

### Header Area

```
+-----------------------------------+
| Panel Title             | 🗕 |☐| ✕ |
+-----------------------------------+
```

* **Panel Title**: Shows the name of the panel
* **Minimize Button**: Collapses the panel to just its header
* **Expand/Dock Button**: Toggles between expanded and docked states
* **Close Button**: Closes the panel (can be reopened from view menu)

### Tab System

For panels that contain multiple views:

```
+-----------------------------------+
| Panel Title             | 🗕 |☐| ✕ |
+-----------------------------------+
| Tab 1 | Tab 2 | Tab 3 | + | ⋮ |
+-----------------------------------+
```

* **Horizontal Tabs**: Each tab represents a different view or section
* **Tab Scrolling**: Arrow indicators appear when tabs exceed available width
* **Add Tab Button**: Creates a new tab when applicable (e.g., testing scenarios)
* **Tab Menu**: Additional options for tab management

### Panel Visibility States

Panels can exist in the following states:

| State | Description | Visual Appearance |
|----|----|----|
| **Expanded** | Full panel visibility | Panel displayed at normal size |
| **Minimized** | Collapsed to header | Only panel header visible, body hidden |
| **Detached** | Separate floating window | Independent window with all panel functionality |
| **Closed** | Hidden from view | Not visible, can be reopened from View menu |
| **Auto-hidden** | Collapsed to edge | Thin bar with name along edge of screen |

## Panel Transition Animations

Panels use subtle animations to provide context about their state changes:

* **Expand/Collapse**: 200ms ease-in-out animation
* **Detach**: 250ms animation with slight zoom effect
* **Tab Switch**: 150ms cross-fade between tab contents
* **Opening**: Slight slide-in from edge of screen
* **Closing**: Fade-out animation

## Panel Layouts and Presets

The Workflow Designer offers preconfigured panel layouts optimized for different tasks:

### Standard Layout

```
+-------+-------------------+-------+
| Node  |                   |       |
| Palette|      Canvas      |Props  |
|       |                   |Panel  |
|       |                   |       |
+-------+-------------------+-------+
|          Runs/Testing Panel       |
+-----------------------------------+
```

### Design-Focused Layout

```
+-------+------------------------+
| Node  |                        |
| Palette|                        |
|       |        Canvas          |
|       |                        |
+-------+                        |
|       |                        |
|       |                        |
+-------+------------------------+
```

### Testing-Focused Layout

```
+------------------------+-------+
|                        |       |
|                        |Props  |
|        Canvas          |Panel  |
|                        |       |
|                        +-------+
|                        |       |
|                        |AI     |
+------------------------+-------+
|          Testing Panel          |
+--------------------------------+
```

## Panel Interactions

### Opening Panels

* **Menu Access**: All panels can be opened from the View menu
* **Context Triggers**: Some panels open automatically based on user actions:
  * Properties Panel opens when a node is selected
  * Testing Panel opens when a test is created or run
  * AI Assistant can be triggered through the help menu or keyboard shortcut
* **Keyboard Shortcuts**: Each panel has a dedicated keyboard shortcut

### Panel Focus and Keyboard Navigation

* **Focus Indication**: Active panel shows a subtle highlight in its header
* **Keyboard Navigation**: Tab key cycles through panels when using keyboard
* **Focus Trapping**: Keyboard focus remains within the active panel until explicitly moved
* **Screen Reader Support**: Panel state changes are announced to screen readers

### Panel Resizing

* **Drag Handles**: Visible when hovering near panel edges
* **Minimum Size**: Each panel has a defined minimum width/height
* **Size Memory**: Panel size preferences are remembered between sessions
* **Double-Click Reset**: Double-clicking panel edge resets to default size

## Adaptive Panel Behavior

The panel system adapts to different scenarios:

### Small Screen Adaptation

On smaller screens (width < 1200px):

* Panel positions shift to top, bottom, or overlay modes
* Automatic minimizing of less-used panels
* Touch-friendly drag handles and controls

### Multi-Monitor Support

* Detached panels can be moved to secondary monitors
* Panel layout state saved per device configuration
* Optimized layouts for ultrawide monitors

## Accessibility Considerations

* **Keyboard Access**: All panel functionality can be accessed via keyboard
* **Screen Reader Support**: ARIA landmarks and live regions for dynamic content
* **Color Independence**: Panel structures remain identifiable in high contrast mode
* **Focus Management**: Clear focus indicators for all interactive elements
* **Motion Reduction**: Animations can be disabled for users with motion sensitivity

## Related Documentation

* [Overall UI Structure](../layout/overall-structure.md): How panels fit into the overall UI
* [Canvas Interaction](../canvas/interaction.md): How panels interact with the canvas
* Each specific panel document for detailed functionality


