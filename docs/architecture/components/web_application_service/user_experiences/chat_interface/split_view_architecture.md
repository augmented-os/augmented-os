# Split View Architecture

## Overview

The Split View Architecture is a foundational design pattern for the Chat Interface that divides the screen into two primary regions: a chat conversation area on the left-hand side (LHS) and a dynamic content pane on the right-hand side (RHS). This architecture enables rich, contextual interactions where conversations can seamlessly drive the display of complex visualizations, forms, and interactive content.

## Key Features

* **Dual-Pane Layout**: Dedicated areas for conversation and rich content
* **Synchronized Interaction**: Coordinated state between chat and visualization
* **Dynamic Content Switching**: Ability to change RHS content based on conversation
* **Responsive Adaptation**: Layout adjustments for different screen sizes
* **State Persistence**: Maintained content state during conversation flow
* **Focus Management**: Intelligent handling of user focus between panes
* **Layout Customization**: User options for resizing and display preferences

## Layout Structure

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  ┌──────────────────────────────┐  ┌──────────────────────────────┐ │
│  │                              │  │                              │ │
│  │                              │  │                              │ │
│  │                              │  │                              │ │
│  │         Chat View            │  │        Dynamic Pane          │ │
│  │         (LHS)                │  │         (RHS)                │ │
│  │                              │  │                              │ │
│  │                              │  │                              │ │
│  │                              │  │                              │ │
│  │                              │  │                              │ │
│  └──────────────────────────────┘  └──────────────────────────────┘ │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## Pane Descriptions

### Left-Hand Side (LHS) - Chat View

The Chat View pane provides:

* **Message History**: Scrollable conversation thread
* **Input Area**: Text and voice input controls
* **Context Controls**: Access to conversation context management
* **Chat Tools**: Quick access to common chat functions
* **Message Rendering**: Support for rich message formatting
* **Inline Components**: Display of simple interactive elements

### Right-Hand Side (RHS) - Dynamic Pane

The Dynamic Pane accommodates:

* **Visualizations**: Charts, graphs, and data displays
* **Workflow UIs**: Workflow designers and monitoring views
* **Forms**: Complex input forms and configuration interfaces
* **Document Viewers**: PDF, image, and document display
* **Dashboards**: Composite data visualizations
* **Media Players**: Video and audio content players
* **Detail Views**: Expanded views of system entities

## Interaction Patterns

### Communication Flow

```
┌───────────────────┐                      ┌───────────────────┐
│                   │                      │                   │
│                   │   1. User Request    │                   │
│                   │──────────────────────▶                   │
│                   │                      │                   │
│                   │   2. System Response │                   │
│                   │◀──────────────────────                   │
│     Chat View     │                      │   Dynamic Pane    │
│      (LHS)        │   3. Content Request │       (RHS)       │
│                   │──────────────────────▶                   │
│                   │                      │                   │
│                   │   4. Content Update  │                   │
│                   │◀──────────────────────                   │
│                   │                      │                   │
│                   │   5. User Interaction│                   │
│                   │◀─────────────────────▶                   │
│                   │                      │                   │
└───────────────────┘                      └───────────────────┘
```

### Transition Types

Content transitions in the RHS can occur in various ways:

* **Direct Replacement**: Complete replacement of current content
* **Stacked Navigation**: Addition to a navigation history stack
* **Tab-Based**: Content organized in accessible tabs
* **Modal Overlay**: Temporary overlays on top of existing content
* **Animated Transition**: Smooth transitions between content states
* **Split Within Split**: Further subdivision of the RHS for complex interactions

### Focus Management

The system intelligently manages user focus:

* Automatic focus transfer to newly displayed interactive elements
* Keyboard navigation between panes with clear focus indicators
* Return to previous focus state when operations complete
* Clear visual indication of which pane has active focus
* Context-aware tab ordering across both panes

## Implementation Considerations

### Responsive Design

The split view adapts to different screen sizes:

* **Desktop View**: Full side-by-side layout
* **Tablet Landscape**: Maintained side-by-side with adjusted proportions
* **Tablet Portrait**: Option to switch between panes or reduced RHS width
* **Mobile View**: Swipeable or tab-based switching between panes
* **Collapsible RHS**: Option to collapse and expand the right pane
* **Dynamic Ratio Adjustment**: User control over the split ratio

### State Management

The architecture maintains state across interactions:

* **Shared Application State**: Core state shared between panes
* **Pane-Specific State**: State unique to each pane's content
* **Conversation Context**: Integration with the chat context model
* **Navigation State**: History of content transitions in the RHS
* **Persistent Preferences**: User preferences for layout and behavior
* **URL Integration**: Deep-linking capabilities for specific states

### Performance Optimization

For optimal performance:

* **Lazy Content Loading**: RHS content loaded only when needed
* **Background Preparation**: Preloading content based on likely user actions
* **Efficient Re-rendering**: Selective updates to avoid full re-renders
* **Resource Management**: Cleanup of unused RHS components
* **Independent Scrolling**: Separate scroll containers for each pane
* **Viewport Prioritization**: Resource allocation based on visibility

### Accessibility Considerations

To ensure accessibility:

* **Keyboard Navigation**: Full keyboard support between and within panes
* **Screen Reader Announcements**: Clear indication of content changes
* **Focus Management**: Predictable focus behavior
* **Region Identification**: Clear ARIA landmarks for each pane
* **Content Relationships**: Explicit relationships between related content
* **Alternative Layouts**: Options for users who require simplified layouts

## Usage Scenarios

### Workflow Creation and Monitoring

```
User: I need to create a new approval workflow for the marketing team
System: I can help you create that workflow. Let's start by defining the stages.
        [RHS displays a new workflow designer with empty canvas]
User: It should have stages for initial submission, manager review, and final approval
System: [RHS updates with a three-stage workflow diagram]
        I've created those three stages. Would you like to configure the specific 
        requirements for each stage?
User: Yes, the manager review needs to be completed within 2 business days
System: [RHS updates the manager review stage with the time constraint]
        I've set a 2 business day SLA for the manager review stage. 
        Any other requirements?
```

### Data Analysis and Dashboard Creation

```
User: Show me our Q2 sales performance
System: Here's the Q2 sales performance overview:
        [RHS displays a sales dashboard with multiple visualizations]
User: Can you filter this to just show the Enterprise segment?
System: [RHS updates to show only Enterprise segment data]
        The Enterprise segment generated $2.3M in Q2, up 15% year-over-year.
        Would you like to see this broken down by product line?
User: Yes, and add a forecast for Q3
System: [RHS updates to show product breakdown and adds forecast chart]
        Here's the breakdown by product line with Q3 forecast. 
        The Cloud Services product line is projected to grow by 22% in Q3.
```

## Related Documentation

* [Dynamic Components](./dynamic_components.md)
* [Workflow Visualization](./workflow_visualization.md)
* [Responsive Design](../../design_system/responsive_design.md)
* [Accessibility Standards](../../design_system/accessibility.md)
* [State Management](../../technical_architecture/state_management.md)


