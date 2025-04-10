# Canvas Interaction

## Overview

The Workflow Designer Canvas provides a rich interaction model that enables users to efficiently create, edit, and organize workflow diagrams. This document details the interaction patterns, user gestures, keyboard shortcuts, and behavior states that facilitate fluid and intuitive workflow design.

## Basic Canvas Interactions

### Canvas Navigation

| Interaction | Mouse/Touch | Keyboard | Description |
|----|----|----|----|
| **Pan Canvas** | Click and drag empty canvas | Arrow keys | Moves the viewable area of the canvas |
| **Zoom In** | Mouse wheel up / Pinch out | Ctrl + Plus | Increases zoom level centered on cursor/viewport center |
| **Zoom Out** | Mouse wheel down / Pinch in | Ctrl + Minus | Decreases zoom level centered on cursor/viewport center |
| **Zoom to Fit** | Double-click empty canvas | Ctrl + 0 | Scales and centers view to show all content |
| **Zoom to Selection** | - | Ctrl + Shift + 0 | Scales and centers view on selected elements |
| **Reset View** | - | Home | Returns to default zoom level and canvas origin |

### Zoom Levels

* **Zoom Range**: 25% to 400%
* **Default Level**: 100%
* **Zoom Increment**: 10% steps using controls, variable with mouse wheel/pinch
* **Zoom Indicator**: Current zoom level displayed in bottom corner of canvas

## Node Interactions

### Node Creation

| Interaction | Method | Description |
|----|----|----|
| **Drag & Drop** | Drag node from palette to canvas | Creates node at drop position |
| **Double Click (Palette)** | Double-click a node type in palette | Creates node at canvas center |
| **Contextual Menu** | Right-click empty canvas, select "Add Node" | Creates selected node type at click position |
| **Keyboard** | Alt + N, then select node type | Creates selected node type at center of viewport |

### Node Selection

| Interaction | Method | Description |
|----|----|----|
| **Single Select** | Click on node | Selects a single node, deselects others |
| **Multi-Select** | Ctrl/Cmd + Click | Adds to selection without deselecting others |
| **Toggle Selection** | Ctrl/Cmd + Click on selected node | Removes from selection |
| **Group Select** | Click and drag to create marquee | Selects all nodes within the marquee area |
| **Select All** | Ctrl/Cmd + A | Selects all nodes in the workflow |
| **Select Connected** | Alt + Click on node | Selects node and all directly connected nodes |
| **Select Path** | Shift + Alt + Click on node | Selects all nodes in path from start to selected node |
| **Keyboard Navigation** | Tab / Shift + Tab | Cycles through nodes in creation order |

### Node Movement

| Interaction | Method | Description |
|----|----|----|
| **Drag & Drop** | Click and drag node | Moves node with pointer |
| **Constrained Move** | Shift + Drag | Restricts movement to horizontal or vertical only |
| **Precise Move** | Arrow keys | Moves selected node(s) 1px in arrow direction |
| **Larger Move** | Shift + Arrow keys | Moves selected node(s) 10px in arrow direction |
| **Grid Snap** | Drag node (with snapping enabled) | Automatically aligns node to nearest grid intersection |

### Node Resizing

| Interaction | Method | Description |
|----|----|----|
| **Handles** | Drag resize handle | Resizes from the handle's edge/corner |
| **Proportional Resize** | Shift + Drag corner handle | Maintains aspect ratio during resize |
| **Precise Resize** | Alt + Arrow keys | Expands/contracts node 1px in arrow direction |
| **From Center** | Alt + Drag handle | Resizes with center as anchor point |

### Node Editing

| Interaction | Method | Description |
|----|----|----|
| **Edit Properties** | Double-click node | Opens properties panel for node |
| **Quick Edit** | Enter when node selected | Activates inline label editing for node |
| **Rename** | F2 when node selected | Activates inline node renaming |
| **Delete** | Delete/Backspace key | Removes selected node(s) |
| **Duplicate** | Ctrl/Cmd + D | Duplicates selected node(s) |
| **Copy/Paste** | Ctrl/Cmd + C / Ctrl/Cmd + V | Copies node(s) and pastes at cursor position |

## Connection Interactions

### Creating Connections

| Interaction | Method | Description |
|----|----|----|
| **Port to Port** | Click output port, drag to input port | Creates connection between ports |
| **Quick Connect** | Shift + Click node, then click another node | Creates connection between default ports |
| **Auto-Connect** | Drop node near output port of another node | Creates connection automatically between appropriate ports |
| **Connection Preview** | Hover output port | Shows possible connections with visual indicators |

### Selecting and Editing Connections

| Interaction | Method | Description |
|----|----|----|
| **Select Connection** | Click on connection line | Selects connection and shows control points |
| **Adjust Path** | Drag control points | Adjusts curve of connection |
| **Delete Connection** | Select connection + Delete key | Removes the connection |
| **Toggle Connection Type** | Double-click connection | Cycles through available connection types |

### Connection Validation

Connections provide visual feedback on validity:

* **Valid Connection**: Connection forms normally with appropriate styling
* **Invalid Connection**: Connection shows error styling and explanatory tooltip
* **Type Mismatch**: Connection shows warning styling with type information
* **Circular Reference**: Connection prevented, tooltip explains the issue

## Multi-Element Operations

### Selection Operations

| Interaction | Method | Description |
|----|----|----|
| **Group Items** | Select multiple + Ctrl/Cmd + G | Creates a logical group of nodes |
| **Ungroup** | Select group + Ctrl/Cmd + Shift + G | Dissolves group while keeping nodes |
| **Lock Elements** | Select elements + Ctrl/Cmd + L | Prevents modification of selected elements |
| **Unlock All** | Ctrl/Cmd + Shift + L | Unlocks all locked elements |
| **Align Elements** | Select multiple + alignment buttons | Aligns selected elements (left, right, top, bottom, center) |
| **Distribute Elements** | Select multiple + distribution buttons | Evenly distributes selected elements horizontally or vertically |

### Group Operations

| Interaction | Method | Description |
|----|----|----|
| **Collapse Group** | Click group collapse icon | Minimizes group to single representative node |
| **Expand Group** | Click collapsed group expand icon | Restores group to full view |
| **Edit Group Label** | Double-click group header | Activates inline label editing for group |
| **Change Group Color** | Right-click group, select "Set Color" | Changes the group's highlight color |

## Context Menu Operations

Right-clicking on canvas elements provides contextual operations:

### Canvas Context Menu

* Add Node (with submenu of node types)
* Paste (when clipboard contains nodes)
* Select All
* Auto-arrange Selection
* Grid Settings
* Zoom Controls

### Node Context Menu

* Edit Properties
* Cut
* Copy
* Paste
* Duplicate
* Delete
* Bring to Front
* Send to Back
* Add to Group
* Create Group

### Connection Context Menu

* Edit Properties
* Delete
* Set Connection Type
* Straighten Path
* Auto-route

## Keyboard Shortcuts and Modifier Keys

### Global Shortcuts

| Key Combination | Action |
|----|----|
| Ctrl/Cmd + S | Save workflow |
| Ctrl/Cmd + Z | Undo |
| Ctrl/Cmd + Y / Ctrl/Cmd + Shift + Z | Redo |
| Ctrl/Cmd + A | Select all |
| Ctrl/Cmd + X | Cut selected elements |
| Ctrl/Cmd + C | Copy selected elements |
| Ctrl/Cmd + V | Paste elements |
| Delete / Backspace | Delete selected elements |
| Escape | Cancel current operation / Deselect all |

### Canvas Navigation Shortcuts

| Key Combination | Action |
|----|----|
| Space + Drag | Temporarily activates hand tool for panning while held |
| Ctrl/Cmd + 0 | Zoom to fit all |
| Ctrl/Cmd + + | Zoom in |
| Ctrl/Cmd + - | Zoom out |
| Home | Reset view to center |

### Modifier Keys for Combined Operations

| Modifier | Effect when used with mouse operations |
|----|----|
| Shift | Constraint to axes / Keep aspect ratio / Add to selection |
| Ctrl/Cmd | Multi-select / Copy while dragging |
| Alt | Select connected elements / Mirror operations |
| Ctrl/Cmd + Shift | Scale from center while preserving aspect ratio |

## Drag and Drop Behavior

### Drag Sources

* **Node Palette**: Drag node types onto canvas
* **Existing Nodes**: Drag to reposition
* **External Files**: Drag workflow JSON onto canvas to import
* **Node Libraries**: Drag component templates from library onto canvas

### Drop Targets

* **Canvas Area**: Drops nodes at position
* **Groups**: Drops nodes into group
* **Nodes**: Some nodes accept drops of other nodes to create parent-child relationships
* **Connection Lines**: Dropping a node on a line splits the connection and inserts the node

### Drag Visual Feedback

* **Ghost Image**: Semi-transparent preview of the dragged element
* **Drop Target Highlighting**: Visual indication of valid drop targets
* **Positioning Guides**: Dynamic alignment guides during drag operations
* **Invalid Drop Indicator**: Visual warning when attempting invalid drops

## Accessibility Considerations

### Keyboard Navigation

* Full keyboard control for all operations
* Focus indicators for active elements
* Logical tab order through elements
* Arrow key navigation between connected nodes

### Screen Reader Support

* ARIA roles and labels for all canvas elements
* Announcements for state changes
* Text alternatives for visual indicators
* Keyboard shortcuts for all operations

### Motor Control Accommodations

* Adjustable double-click speed
* Sticky keys support for modifier combinations
* Precision mode for fine movements
* Alternative input method support (voice commands, switch control)

## Touch and Pen Input Support

### Touch Gestures

* **Single Tap**: Select element
* **Double Tap**: Edit element / Zoom to fit
* **Two-finger Pinch/Spread**: Zoom control
* **Two-finger Pan**: Move canvas
* **Long Press**: Context menu
* **Two-finger Rotation**: Rotate selected elements (where supported)

### Pen Input

* **Direct Manipulation**: Precise positioning and selection
* **Pressure Sensitivity**: Where supported, affects certain operations
* **Button Modifiers**: Pen buttons can be mapped to common operations

## Related Components

* [Canvas Appearance](./appearance.md): Visual styling of the canvas elements
* [Canvas Validation](./validation.md): Visual and interactive validation feedback
* [Canvas Organization](./organization.md): Tools for organizing workflow elements
* [Overall Structure](../layout/overall-structure.md): How the canvas fits into the overall interface


