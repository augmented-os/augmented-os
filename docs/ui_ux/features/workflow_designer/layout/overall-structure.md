# Workflow Designer Overall Structure

## Overview

The Workflow Designer interface is organized into a structured layout that balances flexibility with consistency. The layout provides an optimal working environment for creating and editing workflows, with dedicated areas for different functionality.

## Core Layout Structure

The Workflow Designer follows a responsive layout with the following main sections:

```
+-----------------------------------------------------------------------------------+
|                              HEADER                                               |
+-------------+---------------------------------------------------------------+-----+
|             |                                                               |     |
|             |                                                               |     |
|             |                                                               |     |
|             |                                                               |     |
|    NODE     |                      CANVAS                                   |  P  |
|   PALETTE   |                                                               |  R  |
|             |                                                               |  O  |
|             |                                                               |  P  |
|             |                                                               |  E  |
|             |                                                               |  R  |
|             |                                                               |  T  |
|             |                                                               |  I  |
|             |                                                               |  E  |
|             |                                                               |  S  |
+-------------+---------------------------------------------------------------+-----+
|                           PANEL CONTAINER                                         |
+-----------------------------------------------------------------------------------+
```

### Dimensions and Proportions

* **Header**: Fixed height (56px), full width
* **Node Palette**: Fixed width (240px by default), collapsible, full remaining height
* **Canvas**: Flexible, fills available space, supports infinite scrolling/panning
* **Properties Panel**: Fixed width (320px by default), collapsible, full remaining height
* **Panel Container**: Fixed height (configurable, default 320px), collapsible, full width

## Component Areas

### 1. Header

The top bar contains workflow identification, status information, and primary actions.

* **Position**: Top of interface, full width
* **Content**: Workflow name, navigation, status indicators, and primary actions
* **Behavior**: Always visible, fixed position
* **Detailed in**: [Header Documentation](./header.md)

### 2. Node Palette

A categorized list of available node types that can be added to the workflow.

* **Position**: Left side of the interface, full remaining height
* **Content**:
  * Node type categories (collapsible sections)
  * Searchable node list
  * Drag-and-drop source for adding nodes to canvas
* **Behavior**:
  * Collapsible (toggle button in header)
  * Scrollable when content exceeds height
  * Maintains state during session
* **Detailed in**: [Node Palette Documentation](../panels/node-palette.md)

### 3. Canvas

The main workspace where the workflow is visually constructed and edited.

* **Position**: Center of interface, fills available space
* **Content**:
  * Grid background (configurable)
  * Workflow nodes and connections
  * Selection indicators
  * Visual feedback elements
  * Minimap (optional, bottom right corner)
* **Behavior**:
  * Supports zoom and pan
  * Infinite scrolling workspace
  * Maintains grid alignment
  * Primary interaction area
* **Detailed in**: [Canvas Documentation](../canvas/appearance.md)

### 4. Properties Panel

Context-sensitive configuration panel for the currently selected element(s).

* **Position**: Right side of interface, full remaining height
* **Content**:
  * Properties specific to selected node/edge
  * Tabs for different setting categories
  * Form controls
  * Validation feedback
* **Behavior**:
  * Updates based on selection
  * Collapsible (toggle button in header)
  * Scrollable when content exceeds height
  * Falls back to workflow properties when nothing selected
* **Detailed in**: [Properties Panel Documentation](../panels/properties-panel.md)

### 5. Panel Container

Bottom area that can host various panels for additional functionality.

* **Position**: Bottom of interface, full width
* **Content**: Hosts one of several possible panels:
  * Testing Panel
  * Validation Panel
  * Runs/History Panel
  * AI Assistant Panel
  * Settings Panel
* **Behavior**:
  * Expandable/collapsible
  * Tab navigation between available panels
  * Resizable height (drag handle)
  * Can be minimized to just tab bar
* **Detailed in**: Individual panel documentation

## Layout Variations

### Collapsed Panels

The interface supports collapsing the Node Palette and/or Properties Panel to maximize canvas space:

```
+-----------------------------------------------------------------------------------+
|                              HEADER                                               |
+---+-------------------------------------------------------------------+-----------+
| ≡ |                                                                   |     |     |
|   |                                                                   |     |     |
|   |                                                                   |     |     |
|   |                                                                   |     |     |
|   |                      CANVAS                                       |  P  |     |
|   |                                                                   |  R  |     |
|   |                                                                   |  O  |     |
|   |                                                                   |  P  |     |
|   |                                                                   |     |     |
|   |                                                                   |     |     |
|   |                                                                   |     |     |
|   |                                                                   |     |     |
|   |                                                                   |     |     |
|   |                                                                   |     |     |
+---+-------------------------------------------------------------------+-----------+
|                           PANEL CONTAINER                                         |
+-----------------------------------------------------------------------------------+
```

### Full-Screen Canvas

For maximum workspace, all panels can be collapsed:

```
+-----------------------------------------------------------------------------------+
|                              HEADER                                               |
+---+-----------------------------------------------------------------------+-------+
| ≡ |                                                                       |   |   |
|   |                                                                       |   |   |
|   |                                                                       |   |   |
|   |                                                                       |   |   |
|   |                                                                       |   |   |
|   |                                                                       |   |   |
|   |                           CANVAS                                      |   |   |
|   |                                                                       |   |   |
|   |                                                                       |   |   |
|   |                                                                       |   |   |
|   |                                                                       |   |   |
|   |                                                                       |   |   |
|   |                                                                       |   |   |
|   |                                                                       |   |   |
+---+-----------------------------------------------------------------------+-------+
|                             TABS                                                  |
+-----------------------------------------------------------------------------------+
```

### Mobile Layout

On mobile devices, the layout adapts to a stacked approach:

```
+-----------------------------------------------------------------------------------+
|                             HEADER (SIMPLIFIED)                                   |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|                                 CANVAS                                            |
|                                                                                   |
|                                                                                   |
+-----------------------------------------------------------------------------------+
|                              BOTTOM DRAWER                                        |
+-----------------------------------------------------------------------------------+
```

The bottom drawer can reveal different panels (Node Palette, Properties, etc.) based on context and user selection.

## Layout Behavior

### Resizing

* Users can resize the width of the Node Palette and Properties Panel by dragging the divider
* Users can resize the height of the Panel Container by dragging the top edge
* Minimum sizes are enforced to ensure usability
* Size preferences are stored in user preferences

### Responsiveness

The layout responds to different screen sizes:

* **Large Desktop**: Full layout with default proportions
* **Small Desktop**: Reduced width of side panels
* **Tablet**: Option to auto-collapse side panels with easy access toggles
* **Mobile**: Stacked layout with context-sensitive panels

### Overflow Handling

* All panels independently handle overflow with scrolling
* Canvas remains pannable and zoomable regardless of size
* Text truncation with tooltips is used where appropriate
* Critical controls remain accessible at all viewport sizes

## Accessibility

* Panels maintain focus state for keyboard navigation
* Tab order follows a logical flow through the interface
* Panel toggles are accessible via keyboard shortcuts
* Screen readers announce context changes when panels update

## Related Components

* [Header](./header.md): Details of the top navigation and controls
* [Canvas Appearance](../canvas/appearance.md): Visual specifications for the canvas
* [Node Palette](../panels/node-palette.md): Node type selection panel
* [Properties Panel](../panels/properties-panel.md): Configuration for selected elements


