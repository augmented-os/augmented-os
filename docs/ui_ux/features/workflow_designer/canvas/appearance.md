# Canvas Appearance

## Overview

The Workflow Designer Canvas provides the visual workspace where users create and edit workflow diagrams. This document details the visual styling, node representation, color system, and other visual aspects of the canvas to ensure a consistent, intuitive, and accessible design.

## Canvas Background

### Grid System

The canvas features a grid background to assist with alignment and spatial organization:

* **Grid Type**: Square grid
* **Grid Size**: 20px × 20px (configurable in user preferences)
* **Primary Grid Lines**: Light gray (#E0E0E0), 0.5px stroke width, every 100px
* **Secondary Grid Lines**: Lighter gray (#F0F0F0), 0.25px stroke width, every 20px
* **Snap-to-Grid**: Enabled by default (can be toggled)

### Background

* **Base Color**: White (#FFFFFF) or light gray (#F8F8F8) depending on user theme
* **Texture**: Subtle dot pattern at grid intersections rather than continuous lines for reduced visual noise
* **Contrast**: Ensures sufficient contrast with node elements while minimizing visual fatigue during extended use

### Canvas State Indicators

* **Selection Area**: Semi-transparent blue overlay (#4285F4 at 20% opacity) during marquee selection
* **Drag Area**: Subtle directional indicators when dragging nodes or groups
* **Focus State**: Light blue outline when the canvas has keyboard focus for accessibility

## Node Representation

### Common Visual Elements

All nodes share these base visual characteristics:

* **Base Shape**: Rounded rectangle with 6px corner radius
* **Minimum Size**: 120px width × 60px height
* **Default Border**: 1.5px solid line
* **Shadow**: Subtle drop shadow (2px blur, 1px y-offset, 10% opacity)
* **Selection State**: Blue outline (2px) when selected
* **Hover State**: Slight shadow increase and subtle glow effect
* **Focus State**: Blue dashed outline (accessibility)
* **Title Area**: Top portion with node type name and optional custom label
* **Content Area**: Main body with node-specific information or controls
* **Port Indicators**: Input/output connection points with visual affordance

### Node Type-Specific Styling

Each node type has a distinct visual appearance to aid quick recognition:

#### 1. Start/End Nodes

* **Shape**: Circular or pill-shaped
* **Size**: Smaller than task nodes (80px × 40px)
* **Colors**:
  * Start: Green gradient (#34A853 to #27843E)
  * End: Red gradient (#EA4335 to #C5221F)
* **Icon**: Play icon for Start, Checkmark icon for End
* **Border**: None (filled shape)

#### 2. Task Nodes

Common styling for all task nodes:

* **Header**: Color-coded by task subtype
* **Body**: White background with task-specific content
* **Border**: Solid line matching header color
* **Footer**: Contains status indicators and action buttons

Subtype-specific styling:

**CODE Nodes**:

* **Header Color**: Blue (#4285F4)
* **Icon**: Code/brackets icon
* **Content Area**: Code snippet preview with syntax highlighting

**AI_AGENT Nodes**:

* **Header Color**: Purple (#A142F4)
* **Icon**: Brain or AI icon
* **Content Area**: Preview of prompt template with parameter indicators

**INTEGRATION Nodes**:

* **Header Color**: Teal (#12B5CB)
* **Icon**: Connection/API icon
* **Content Area**: Integration provider logo and operation description

#### 3. HUMAN_TASK Nodes

* **Shape**: Standard with rounded corners
* **Header Color**: Orange (#FA7B17)
* **Icon**: Person icon
* **Content Area**: Form preview and assignee information
* **Visual Indicator**: Clock icon for due dates

#### 4. DECISION Nodes

* **Shape**: Diamond or hexagon shape
* **Header Color**: Yellow (#FBBC04)
* **Icon**: Branching paths icon
* **Content Area**: Simplified condition expression
* **Output Ports**: Multiple, one for each branch condition

#### 5. PARALLEL Nodes

* **Shape**: Wide rectangle with internal dividers
* **Header Color**: Light blue (#6BA1FF)
* **Icon**: Parallel lines icon
* **Content Area**: Preview of parallel branches
* **Visual Indicator**: Join type indicator (AND/OR/N of M)

#### 6. EVENT_WAIT Nodes

* **Shape**: Standard with notched corner
* **Header Color**: Purple (#9334E6)
* **Icon**: Clock or calendar icon
* **Content Area**: Event description and timeout information
* **Visual Indicator**: Pulse animation when in waiting state (during execution)

### Node States

Nodes display different visual states:

* **Default**: Normal appearance as described above
* **Selected**: Blue outline (2px), handles for resizing
* **Invalid**: Red border and warning icon
* **Disabled**: Gray overlay with reduced opacity (40%)
* **Executing**: Pulsing glow or progress indicator (during live execution)
* **Completed**: Green checkmark overlay (during live execution)
* **Failed**: Red X overlay (during live execution)

## Connections (Edges)

### Visual Styling

* **Line Style**: Bezier curves with directional flow
* **Line Thickness**: 2px by default
* **Color**: Dark gray (#333333) by default, color-coded for data flow types
* **Arrow**: Subtle arrowhead indicating direction
* **Selected State**: Blue line with increased thickness (3px)
* **Hover State**: Slight glow effect and thickness increase
* **Invalid State**: Dashed red line with warning indicator

### Connection Points

* **Output Ports**: Small circles on the right side of nodes
* **Input Ports**: Small circles on the left side of nodes
* **Hover State**: Increase size and highlight when hovered
* **Active State**: Glow effect during connection creation
* **Visual Feedback**: Compatibility indicators when dragging connections

## Color System

### Node Type Color Coding

* **Start/End**: Green/Red
* **Code Task**: Blue
* **AI Agent Task**: Purple
* **Integration Task**: Teal
* **Human Task**: Orange
* **Decision**: Yellow
* **Parallel**: Light Blue
* **Event Wait**: Purple

### Semantic Colors

* **Success/Valid**: Green (#34A853)
* **Error/Invalid**: Red (#EA4335)
* **Warning**: Yellow (#FBBC04)
* **Information**: Blue (#4285F4)
* **Disabled**: Gray (#9AA0A6)
* **Selected**: Blue (#1A73E8)

### Color Accessibility

* All color combinations maintain minimum WCAG 2.1 AA contrast ratios
* Critical information is never conveyed by color alone
* Alternative high-contrast theme available
* Colorblind-friendly palette with complementary patterns and shapes

## Typography

* **Node Titles**: 14px, Medium (500) weight, primary text color
* **Node Content**: 12px, Regular (400) weight, secondary text color
* **Labels**: 12px, Regular (400) weight, secondary text color
* **Tooltips**: 12px, Regular (400) weight, high-contrast text on dark background
* **Font Family**: System font stack for optimal performance and native feel

## Iconography

* **Node Type Icons**: 16px, monochrome, consistent style across all node types
* **Action Icons**: 14px, monochrome, placed in consistent locations
* **Status Icons**: 12px, color-coded (red/yellow/green), with supporting text
* **Style**: Outlined style for UI controls, filled style for status indicators

## Scaling and Zooming

The canvas appearance adapts to zoom levels:

### Zoom Levels

* **25% - 50%**: Simplified node representation, no internal details
* **50% - 75%**: Basic node details, no content preview
* **75% - 125%**: Standard view with full details
* **125% - 200%**: Enhanced details for fine editing
* **200%+**: Maximum detail for pixel-perfect adjustments

### Visual Adaptations at Different Zoom Levels

* **Low Zoom**: Reduced detail, emphasized color coding and shapes
* **High Zoom**: Full detail, enhanced precision controls
* **Edge Simplification**: Reduced curve complexity at lower zoom levels
* **Text Scaling**: Maintains readability at all zoom levels

## Related Components

* [Canvas Interaction](./interaction.md): How users interact with the canvas elements
* [Canvas Validation](./validation.md): Visual indicators for validation states
* [Canvas Organization](./organization.md): Visual tools for workflow organization
* [Nodes Documentation](../nodes/README.md): Detailed specifications for each node type


