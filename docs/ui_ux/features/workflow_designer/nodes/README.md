# Workflow Designer Node Types

## Overview

This directory contains the UI/UX documentation for all node types available in the Workflow Designer. These node types represent the building blocks of workflows, each with distinct visual appearance, behavior, and configuration options. The documentation details the visual representation and states for each node type to ensure consistent implementation and user experience.

## Common Node Visual Elements

All nodes in the Workflow Designer share certain common visual elements while maintaining distinct type-specific styling:

### Base Structure

Every node follows this fundamental structure:

```
+-------------------------------------+
|            HEADER AREA              |
+-------------------------------------+
|                                     |
|            CONTENT AREA             |
|                                     |
+-------------------------------------+
|            FOOTER AREA              |
+-------------------------------------+
```

### Common Visual Characteristics

* **Base Shape**: Rounded rectangle with 6px corner radius (type-specific variations detailed in individual documents)
* **Minimum Size**: 120px width × 60px height (varies by node type)
* **Default Border**: 1.5px solid line in node-specific color
* **Shadow**: Subtle drop shadow (2px blur, 1px y-offset, 10% opacity)
* **Port Indicators**: Small circles indicating connection points
  * Input ports on the left side
  * Output ports on the right side
  * Hover state with increased size and highlight

### Header Area

* **Background**: Color-coded by node type (see Color System below)
* **Title**: Node type name and optional custom label
* **Icon**: Type-specific icon on the left side
* **Actions**: Optional quick action buttons on the right side

### Content Area

* **Background**: White (#FFFFFF) or light gray based on theme
* **Content**: Type-specific representation and preview
* **Padding**: Consistent 12px padding around content
* **Typography**: Consistent font styling based on content type

### Footer Area

* **Background**: Slightly darker than content area
* **Status Indicators**: Execution state, validation state
* **Metadata**: Additional information relevant to the node type
* **Action Links**: Quick access to common operations

## Node States

All node types display these common states:

| State | Visual Appearance |
|----|----|
| **Default** | Standard appearance as defined by node type |
| **Selected** | Blue outline (2px) with resize handles |
| **Hover** | Slight elevation increase (shadow enhancement) |
| **Focused** | Blue dashed outline (for keyboard navigation) |
| **Invalid** | Red border with warning icon in top-right corner |
| **Disabled** | Gray overlay with reduced opacity (40%) |
| **Executing** | Pulsing highlight or progress indicator |
| **Completed** | Green checkmark overlay in top-right |
| **Failed** | Red X overlay in top-right |

## Color System

The node color system follows consistent semantic meaning:

| Node Type | Primary Color | Header Background | Example |
|----|----|----|----|
| Start/End | Green/Red | Start: #34A853 to #27843E<br>End: #EA4335 to #C5221F | Circle (Start)<br>Circle (End) |
| Code Task | Blue | #4285F4 | Code icon |
| AI Agent Task | Purple | #A142F4 | Brain icon |
| Integration Task | Teal | #12B5CB | Connection icon |
| Human Task | Orange | #FA7B17 | Person icon |
| Decision | Yellow | #FBBC04 | Diamond icon |
| Parallel | Light Blue | #6BA1FF | Parallel lines icon |
| Event Wait | Purple | #9334E6 | Clock icon |

## Node Type Documentation

Each node type is documented in its own file:

* [Start/End Nodes](./start-end-nodes.md): Entry and exit points for workflow execution
* [Code Task Nodes](./code-task-nodes.md): Nodes for script-based automation with code editor
* [AI Agent Nodes](./agent-task-nodes.md): Nodes for AI-powered automation with prompt configuration
* [Integration Nodes](./integration-task-nodes.md): Nodes for external system integration
* [Human Task Nodes](./human-task-nodes.md): Nodes for manual intervention steps
* [Decision Nodes](./decision-nodes.md): Nodes for conditional branching based on data
* [Parallel Nodes](./parallel-nodes.md): Nodes for concurrent execution paths
* [Event Wait Nodes](./event-wait-nodes.md): Nodes for event-driven workflows

## Accessibility Considerations

All node designs follow these accessibility guidelines:


1. **Color Independence**:
   * Node types are differentiated by multiple visual characteristics beyond color
   * Status states use icons and patterns in addition to colors
   * All color combinations meet WCAG 2.1 AA contrast requirements
2. **Keyboard Navigability**:
   * All node interactions support keyboard-only operation
   * Focus states are clearly visible
   * Tab order follows logical workflow structure
3. **Screen Reader Support**:
   * Semantic type information exposed to assistive technology
   * Status information announced appropriately
   * Error and validation states properly conveyed

## Related Components

* [Canvas Appearance](../canvas/appearance.md): Overall canvas visual styling
* [Canvas Interaction](../canvas/interaction.md): How users interact with nodes
* [Properties Panel](../panels/properties-panel.md): Node configuration interface


