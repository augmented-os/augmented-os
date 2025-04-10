# Canvas Organization

## Overview

The Workflow Designer Canvas provides a set of organizational tools that help users structure, arrange, and annotate complex workflows. This document details the visual and interactive elements for grouping nodes, creating visual hierarchy, adding annotations, and maintaining clarity in large workflows.

## Grouping Mechanisms

### Node Groups

Groups allow users to visually and logically organize related nodes:

#### Visual Appearance

* **Border**: Light colored border (customizable) with rounded corners
* **Header**: Title bar at the top with group name and controls
* **Background**: Semi-transparent background color (customizable)
* **Selection**: Blue highlight when selected (same as node selection)
* **Resize Handles**: Standard handles appear when group is selected

#### Group States

| State | Visual Appearance | Behavior |
|----|----|----|
| **Expanded** | Shows all contained nodes in their positions | Normal interaction with all contained nodes |
| **Collapsed** | Compact representation with node count indicator | Acts as a single node, maintains connections |
| **Selected** | Blue highlight around the group boundary | Can be moved, resized, or edited as a unit |
| **Validation Issues** | Validation badges and colors based on contained nodes | Shows worst-case status of any contained node |

#### Group Controls

* **Group Header**: Contains label, collapse/expand toggle, and actions menu
* **Resizing**: Handle points on edges and corners when selected
* **Move Handle**: Centered on top border to move entire group
* **Color Selector**: Allows customization of group accent color
* **Context Menu**: Right-click provides group-specific operations

### Swimlanes

Swimlanes provide horizontal or vertical organization to indicate ownership, phases, or stages:

#### Visual Appearance

* **Header**: Label area with title and optional metadata
* **Lane**: Horizontal or vertical band stretching across canvas
* **Dividers**: Visual separators between adjacent lanes
* **Background**: Light color fill (customizable per lane)

#### Swimlane Controls

* **Header Actions**: Collapse/expand, menu, drag to reorder
* **Resize Handle**: Adjust lane width/height
* **Add Lane**: Plus icon to add adjacent lane
* **Context Menu**: Right-click access to lane operations

### Regions

Regions allow highlighting areas of the canvas without strict node containment:

#### Visual Appearance

* **Border**: Dashed or dotted light border
* **Label**: Text label positioned at top-left corner
* **Background**: Very light or patterned fill for visual distinction
* **Transparency**: Higher transparency than groups to reduce visual weight

#### Region Controls

* **Resize**: Standard handles on edges and corners
* **Edit Label**: Double-click to edit region name
* **Layer Controls**: Send to back/bring to front operations
* **Lock/Unlock**: Option to prevent accidental changes

## Layout Tools

### Auto-Layout

Tools for automatically arranging nodes for improved readability:

#### Layout Algorithms

* **Hierarchical Layout**: Organizes nodes in directional layers based on connections
* **Force-Directed Layout**: Uses physics simulation for natural node arrangements
* **Grid Layout**: Arranges nodes in evenly-spaced grid
* **Circular Layout**: Arranges nodes in circular pattern

#### Visual Controls

* **Algorithm Selector**: Dropdown/buttons to select layout algorithm
* **Option Controls**: Settings for spacing, orientation, and other algorithm parameters
* **Preview**: Visual preview of layout before applying
* **Scope Selector**: Apply to selection, group, or entire canvas

### Alignment and Distribution

Tools for precisely aligning and distributing selected nodes:

#### Alignment Tools

* **Visual Indicators**: Guidelines that appear during alignment
* **Alignment Toolbar**: Buttons for left, center, right, top, middle, bottom alignment
* **Smart Guides**: Dynamic guides that appear during manual node movement

#### Distribution Tools

* **Distribution Toolbar**: Buttons for horizontal/vertical distribution
* **Spacing Controls**: Set exact spacing between nodes
* **Equal Distribution**: Evenly distribute selected nodes

### Grid and Snapping

Controls for canvas grid appearance and behavior:

#### Grid Controls

* **Grid Toggle**: Show/hide grid
* **Grid Size**: Adjust the size of grid cells
* **Grid Style**: Select between dots, lines, or combination
* **Grid Color**: Adjust grid color and opacity

#### Snap Controls

* **Snap Toggle**: Enable/disable snap to grid
* **Snap Strength**: Adjust magnetic strength of snapping
* **Snap Types**: Toggle snap to grid, objects, and guides
* **Snap Threshold**: Distance at which snapping activates

## Annotations

### Text Annotations

Free-standing text elements to add explanations and documentation:

#### Visual Appearance

* **Text Box**: Transparent or light background text container
* **Border**: Optional subtle border
* **Connection Line**: Optional line connecting to a specific node
* **Text Formatting**: Basic formatting options (bold, italic, bullet lists)

#### Text Annotation Controls

* **Editing**: Double-click to edit content
* **Formatting Toolbar**: Basic text formatting options
* **Resize**: Handles to adjust text box size
* **Connection Point**: Optional anchor to attach to specific node

### Sticky Notes

Visual note elements with distinct styling for temporary or prominent notes:

#### Visual Appearance

* **Note Shape**: Square or rectangular with folded corner effect
* **Background**: Bright color options (yellow, pink, blue, green)
* **Shadow**: Subtle drop shadow for lifted appearance
* **Content**: Text with basic formatting capabilities

#### Sticky Note Controls

* **Color Picker**: Change note color
* **Resize**: Handles for adjusting size
* **Rotation**: Optional handle for rotating note
* **Drag**: Move note to any position on canvas

### Freeform Drawing

Tools for drawing shapes, highlighting areas, or creating custom visual elements:

#### Drawing Tools

* **Pen Tool**: Freeform line drawing
* **Shape Tools**: Rectangle, ellipse, arrow drawing
* **Highlighter**: Semi-transparent highlight marker
* **Color Picker**: Select drawing color and opacity
* **Line Style**: Select line thickness and dash pattern

#### Drawing Controls

* **Selection**: Click to select drawn elements
* **Edit Points**: Modify control points of drawn paths
* **Style Controls**: Change color, thickness, and style after creation
* **Layer Management**: Arrange drawing elements in front/behind nodes

## Canvas Sections and Viewport Management

### Minimap

A small overview map showing the entire canvas:

#### Visual Appearance

* **Location**: Bottom-right corner of canvas (repositionable)
* **Content**: Simplified representation of all canvas elements
* **Viewport Indicator**: Rectangle showing current view area
* **Size**: Compact by default, resizable

#### Minimap Controls

* **Toggle**: Show/hide minimap
* **Resize**: Drag handle to adjust minimap size
* **Pan**: Click and drag within minimap to navigate
* **Zoom Bar**: Optional zoom slider next to minimap

### Bookmarks

Saved views that users can quickly navigate to:

#### Visual Controls

* **Bookmark List**: Dropdown or sidebar showing saved views
* **Add Bookmark**: Button to save current view with name
* **Navigate**: Click bookmark to animate canvas to that view
* **Edit/Delete**: Manage existing bookmarks

#### Bookmark Attributes

* **Name**: User-defined name for the view
* **Zoom Level**: Saved zoom percentage
* **Position**: Canvas coordinates of viewport center
* **Thumbnail**: Optional miniature preview image

### Canvas Tabs

For working with multiple workflows or workflow sections:

#### Tab Bar

* **Location**: Above canvas area
* **Tab Design**: Similar to browser tabs with name and close button
* **Active Tab**: Visual highlight for current tab
* **New Tab**: Plus button to create new tab

#### Tab Behaviors

* **Switching**: Click tab to switch to that view
* **Rearranging**: Drag tabs to reorder
* **Split View**: Option to view multiple tabs simultaneously
* **Sharing**: Option to share specific tab view with others

## Layers

Organization of canvas elements into stacked layers:

### Layer Panel

* **Layer List**: Hierarchical display of layers and their contents
* **Visibility Toggles**: Show/hide individual layers
* **Lock Controls**: Prevent editing of specific layers
* **Layer Groups**: Folders to organize related layers

### Layer Operations

* **Create Layer**: Add new organizational layer
* **Move Elements**: Drag elements between layers
* **Merge Layers**: Combine multiple layers
* **Layer Order**: Change stacking order of layers

## Organizational Presets and Templates

### Workflow Templates

Pre-defined organizational structures for common workflow patterns:

#### Template Library

* **Category Navigation**: Browse templates by category
* **Preview**: Visual preview of template structure
* **Description**: Explanation of template purpose and usage
* **Apply Button**: Insert template into current canvas

#### Template Types

* **Sequential Process**: Linear node arrangement with phases
* **Approval Process**: Decision-based workflow with review stages
* **Parallel Processing**: Multiple concurrent paths
* **Event-Driven**: Trigger and response pattern

### Style Presets

Saved visual styles for consistent workflow appearance:

#### Preset Controls

* **Preset Library**: Gallery of available visual styles
* **Preview**: Visual example of preset appearance
* **Apply Scope**: Select whether to apply to selection, group, or entire workflow
* **Save Current**: Create new preset from current styles

#### Preset Attributes

* **Color Scheme**: Coordinated colors for nodes and groups
* **Typography**: Text style settings
* **Connection Styles**: Line styles and routing preferences
* **Background/Grid**: Canvas background and grid settings

## Accessibility Considerations

Organizational tools are designed with accessibility in mind:


1. **Semantic Structure**:
   * Groups and regions have proper ARIA roles
   * Hierarchical relationships are exposed to screen readers
   * Annotations provide contextual information to assistive technologies
2. **Keyboard Navigation**:
   * Tab order respects logical workflow structure
   * Keyboard shortcuts for common organizational tools
   * Focus indicators for organizational elements
3. **Screen Reader Support**:
   * Text alternatives for visual grouping cues
   * Announcements for structural changes
   * Semantic labels for all organizational elements

## Related Components

* [Canvas Appearance](./appearance.md): Visual styling of canvas elements
* [Canvas Interaction](./interaction.md): How users interact with organizational tools
* [Canvas Validation](./validation.md): How validation appears within organizational structures
* [Overall Structure](../layout/overall-structure.md): How canvas organization relates to the overall interface


