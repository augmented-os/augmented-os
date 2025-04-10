# Node Palette Panel

## Overview

The Node Palette panel provides a catalog of all available node types that users can add to their workflows. It organizes nodes into logical categories, provides search capabilities, and offers both visual and list-based browsing options. The panel is designed to make node discovery and workflow construction efficient and intuitive.

## Visual Design

### Base Appearance

```
+-----------------------------------+
| Node Palette           | 🗕 |☐| ✕ |
+-----------------------------------+
| 🔍 Search nodes...                |
+-----------------------------------+
| All Categories        ▼  | ⋮ |   |
+-----------------------------------+
|                                   |
| ◆ Task Nodes                    ▼ |
|                                   |
|  ┌────────┐  ┌────────┐          |
|  │  </>   │  │   👤   │          |
|  │ Code   │  │ Human  │          |
|  └────────┘  └────────┘          |
|                                   |
|  ┌────────┐  ┌────────┐          |
|  │   🤖   │  │   🔌   │          |
|  │  AI    │  │Integra-│          |
|  │ Agent  │  │ tion   │          |
|  └────────┘  └────────┘          |
|                                   |
| ◆ Flow Control                  ▼ |
|                                   |
|  ┌────────┐  ┌────────┐          |
|  │   ⟁    │  │   ⫴    │          |
|  │Decision│  │Parallel│          |
|  └────────┘  └────────┘          |
|                                   |
|  ┌────────┐  ┌────────┐          |
|  │   ⏱️    │  │   ⭘    │          |
|  │ Event  │  │Start/End│          |
|  │  Wait  │  │        │          |
|  └────────┘  └────────┘          |
|                                   |
| ◆ Recently Used                 ▼ |
|                                   |
|  ┌────────┐  ┌────────┐          |
|  │   🔌   │  │   </>  │          |
|  │REST API│  │JavaScript│         |
|  └────────┘  └────────┘          |
|                                   |
+-----------------------------------+
| [Grid View] │ [List View]         |
+-----------------------------------+
```

* **Panel Width**: Default 250px (resizable)
* **Header**: Standard panel header with panel name and control buttons
* **Search Bar**: Full-width search input at the top with search icon
* **Category Dropdown**: Allows filtering by specific node categories
* **Node Grid**: Visual representation of available nodes with icons and labels
* **View Toggle**: Switch between grid and list presentation modes

### List View Mode

```
+-----------------------------------+
| Node Palette           | 🗕 |☐| ✕ |
+-----------------------------------+
| 🔍 Search nodes...                |
+-----------------------------------+
| All Categories        ▼  | ⋮ |   |
+-----------------------------------+
|                                   |
| ◆ Task Nodes                    ▼ |
|                                   |
|  │ </>  Code Task                 |
|  │ 👤  Human Task                 |
|  │ 🤖  AI Agent Task              |
|  │ 🔌  Integration Task           |
|                                   |
| ◆ Flow Control                  ▼ |
|                                   |
|  │ ⟁  Decision                    |
|  │ ⫴  Parallel                    |
|  │ ⏱️  Event Wait                  |
|  │ ⭘  Start/End                   |
|                                   |
| ◆ Recently Used                 ▼ |
|                                   |
|  │ 🔌  REST API                   |
|  │ </>  JavaScript                |
|                                   |
+-----------------------------------+
| [Grid View] │ [List View]         |
+-----------------------------------+
```

* **List Items**: Each node type shown as a single row
* **Icons**: Node type icons aligned at left
* **Labels**: Node type names with consistent formatting
* **Density**: More nodes visible at once compared to grid view

## Node Categories

The Node Palette organizes nodes into the following primary categories:

| Category | Description | Included Node Types |
|----|----|----|
| **Task Nodes** | Nodes that perform business logic | Code, Human, AI Agent, Integration |
| **Flow Control** | Nodes that control workflow execution flow | Decision, Parallel, Event Wait, Start/End |
| **Data Operations** | Nodes that transform or manipulate data | Transform, Validate, Enrich, Map |
| **Utilities** | Helper nodes for workflow organization | Comment, Group, Logger, Debug |
| **Custom** | User-defined or organization-specific nodes | Varies based on extensions |
| **Recently Used** | Dynamically populated based on user activity | User's most recently used nodes |
| **Favorites** | User-designated favorite nodes | User's favorite nodes |

## Node Representation

Each node in the palette follows this design pattern:

### Grid View Node Cell

```
┌───────────────┐
│               │
│      🔌       │ ← Icon
│               │
│  Integration  │ ← Label
│     Task      │
└───────────────┘
```

* **Size**: 80px × 80px (including margins)
* **Icon**: 32px × 32px centered at the top of the cell
* **Label**: Node type name, centered below the icon
* **Border**: Light border (1px) with rounded corners (4px)
* **Feedback**: Hover state with subtle background color change
* **Selected State**: Highlighted background when selected

### List View Node Item

```
┌───────────────────────────┐
│  🔌  Integration Task     │
└───────────────────────────┘
```

* **Height**: 36px
* **Icon**: 20px × 20px aligned to the left
* **Label**: Node type name, aligned to the left after the icon
* **Feedback**: Hover state with subtle background color change
* **Selected State**: Highlighted background when selected

## Search Functionality

The search bar provides these capabilities:

* **Instant Results**: Results filter as the user types
* **Match Highlighting**: Matching text is highlighted in results
* **Search Scope**: Searches node names, descriptions, and tags
* **Empty State**: Shows helpful message when no results are found
* **Recent Searches**: Optional dropdown of recent search terms

## Interaction Patterns

### Adding Nodes to Canvas

Users can add nodes to the canvas through these methods:


1. **Drag and Drop**:
   * User clicks and drags a node from the palette to the canvas
   * Visual feedback during drag shows valid drop areas
   * Node appears on canvas where dropped
2. **Double-Click**:
   * User double-clicks a node in the palette
   * Node appears at the center of the visible canvas area
   * Canvas automatically scrolls to show the new node
3. **Context Menu**:
   * Right-click on the canvas shows menu with "Add Node" option
   * Selecting the option shows mini palette to select node type
   * Node appears at the click location

### Category Navigation

* **Expand/Collapse**: Category headers can be clicked to expand or collapse sections
* **Quick Jump**: Category dropdown allows direct navigation to a specific category
* **Scroll Memory**: Panel remembers scroll position between sessions
* **Keyboard Navigation**: Arrow keys navigate between nodes and categories

## Extended Node Information

When hovering over a node in the palette, an extended tooltip appears:

```
+---------------------------------------------+
| Integration Task                           ↗|
+---------------------------------------------+
| Connect to external systems and services     |
| through pre-built connectors.                |
|                                              |
| Used for: API calls, Database queries,       |
| 3rd-party SaaS integrations                  |
|                                              |
| Variants: REST API, GraphQL, SOAP, Database, |
| Message Queue, Webhook                       |
+---------------------------------------------+
```

* **Title**: Node type name with link to documentation
* **Description**: Brief explanation of the node's purpose
* **Use Cases**: Common scenarios where this node type is useful
* **Variants**: Specialized versions of this node type
* **Examples**: Optional link to example workflows using this node

## Customization Options

The Node Palette supports these customization features:

* **View Preference**: Toggle between grid and list view
* **Category Order**: Users can reorder categories via settings
* **Favorites Management**: Users can add/remove nodes from favorites
* **Custom Categories**: Organizations can define custom categories
* **Expanded State**: Panel remembers which categories are expanded/collapsed

## Context Menu Options

Right-clicking on a node in the palette shows these options:

* **Add to Canvas**: Adds the node at a default position
* **Add to Favorites**: Marks the node as a favorite
* **Show Documentation**: Opens documentation for this node type
* **Show Examples**: Shows example workflows using this node
* **Copy to Clipboard**: Copies node as serialized data for pasting

## Accessibility Considerations

* **Keyboard Navigation**: Full keyboard support for browsing and adding nodes
* **Screen Reader Support**: Proper labeling of node types and categories
* **Zoom Support**: UI adjusts appropriately when browser zoom is used
* **Color Independence**: Icons and shapes distinguish nodes without relying on color
* **Focus Indicators**: Clear visual focus indicators for keyboard navigation
* **Search Accessibility**: Search results can be navigated via keyboard

## States and Variations

### Empty State

When no nodes match the search criteria:

```
+-----------------------------------+
| 🔍 Search: "payment gateway"      |
+-----------------------------------+
|                                   |
|           No results              |
|                                   |
|  No nodes match your search terms.|
|                                   |
|  Try:                             |
|  - Different keywords             |
|  - Checking spelling              |
|  - Browsing categories            |
|                                   |
+-----------------------------------+
```

### Filtered State

When viewing a specific category:

```
+-----------------------------------+
| Integration Nodes      ▼  | ⋮ |   |
+-----------------------------------+
|                                   |
| ◆ Database                      ▼ |
|                                   |
|  ┌────────┐  ┌────────┐          |
|  │   🗄️    │  │   🗄️    │          |
|  │ SQL    │  │ NoSQL  │          |
|  │ Query  │  │ Query  │          |
|  └────────┘  └────────┘          |
|                                   |
| ◆ API                          ▼ |
|                                   |
|  ┌────────┐  ┌────────┐          |
|  │   🔌   │  │   🔌   │          |
|  │ REST   │  │GraphQL │          |
|  │ API    │  │ API    │          |
|  └────────┘  └────────┘          |
|                                   |
+-----------------------------------+
| ◂ Show All Categories             |
+-----------------------------------+
```

### Limited Mode

When certain nodes are unavailable due to permissions:

```
+-----------------------------------+
|                                   |
|  ┌────────┐  ┌────────┐          |
|  │  </>   │  │   👤   │          |
|  │ Code   │  │ Human  │          |
|  └────────┘  └────────┘          |
|                                   |
|  ┌────────┐  ┌─────────┐         |
|  │   🔌   │  │    🔒    │         |
|  │Integra-│  │  Premium │         |
|  │ tion   │  │ Features │         |
|  └────────┘  └─────────┘         |
|                                   |
+-----------------------------------+
```

* **Locked Nodes**: Visually indicate unavailable nodes
* **Upgrade Prompt**: Option to upgrade/request access
* **Tooltip**: Explains why the node is unavailable

## Related Components

* [Canvas Interaction](../canvas/interaction.md): How nodes are placed and manipulated on canvas
* [Node Types Overview](../nodes/README.md): Detailed information about available node types
* [Properties Panel](./properties-panel.md): Configuration panel that appears after adding a node


