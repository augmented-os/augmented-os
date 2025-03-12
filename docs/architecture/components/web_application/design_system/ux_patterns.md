# UX Patterns

## Overview

The AugmentedOS platform employs consistent UX patterns to create intuitive, efficient, and predictable user experiences across the application. This document outlines the common interaction patterns, their implementation guidelines, and best practices for when to use each pattern.

## Navigation Patterns

### Global Navigation

The primary navigation system that provides access to major sections of the application.

 ![Global Navigation](../assets/images/patterns/global-navigation.png)

**Implementation Guidelines:**

* Place at the top or left side of the interface
* Highlight the current section
* Provide clear, concise labels
* Include visual icons alongside text when possible
* Ensure keyboard accessibility with arrow key navigation

**When to Use:**

* For top-level application sections
* When users need to switch between major functional areas
* For persistent access to key features

### Contextual Navigation

Secondary navigation that changes based on the current context or section.

**Implementation Guidelines:**

* Place below global navigation or in a secondary position
* Relate options directly to the current context
* Use clear hierarchy to show relationship to global navigation
* Provide visual differentiation from global navigation

**When to Use:**

* For section-specific options
* When navigation needs change based on context
* For subsections within a major application area

### Breadcrumbs

Path-based navigation showing the user's location in the application hierarchy.

**Implementation Guidelines:**

* Place at the top of the content area
* Use clear separators between levels
* Make each level clickable to navigate up the hierarchy
* Truncate long labels when necessary
* Use schema.org breadcrumb markup for accessibility

```html
<nav aria-label="Breadcrumb">
  <ol class="breadcrumb">
    <li><a href="/workflows">Workflows</a></li>
    <li><a href="/workflows/order-processing">Order Processing</a></li>
    <li aria-current="page">Edit Workflow</li>
  </ol>
</nav>
```

**When to Use:**

* For deep hierarchical structures
* When users need to understand their location
* To provide quick navigation to parent sections

### Tabs

Horizontal navigation for switching between related views or sections.

**Implementation Guidelines:**

* Place at the top of the content area
* Use clear, concise labels
* Highlight the active tab
* Ensure keyboard accessibility with arrow key navigation
* Implement proper ARIA roles for accessibility

```html
<div role="tablist" aria-label="Workflow Views">
  <button role="tab" aria-selected="true" id="tab-design" aria-controls="panel-design">
    Design
  </button>
  <button role="tab" aria-selected="false" id="tab-test" aria-controls="panel-test">
    Test
  </button>
  <button role="tab" aria-selected="false" id="tab-deploy" aria-controls="panel-deploy">
    Deploy
  </button>
</div>

<div id="panel-design" role="tabpanel" aria-labelledby="tab-design">
  <!-- Design content -->
</div>
```

**When to Use:**

* For switching between related views
* When content can be divided into distinct categories
* For workflows with sequential steps

### Pagination

Navigation for moving through multi-page content or large data sets.

**Implementation Guidelines:**

* Place at the bottom of the content
* Show current page and total pages
* Provide previous/next buttons
* Include shortcuts to first/last pages for large sets
* Allow customization of items per page

**When to Use:**

* For large data sets
* When displaying all items at once would be overwhelming
* For sequential content like tutorials or wizards

## Input Patterns

### Forms

Structured input collection with consistent layout and behavior.

**Implementation Guidelines:**

* Group related fields with clear labels
* Align labels consistently (top or left)
* Indicate required fields
* Provide inline validation
* Show helpful error messages
* Use appropriate input types for data

**When to Use:**

* For collecting structured data
* When user input needs validation
* For configuration and settings

### Search

Input mechanism for finding content or data within the application.

**Implementation Guidelines:**

* Place in a prominent, consistent location
* Provide clear search input with appropriate icon
* Show search suggestions when possible
* Display recent searches
* Support advanced search options for complex queries
* Ensure keyboard accessibility with proper focus management

**When to Use:**

* When users need to find specific content
* For applications with large amounts of data
* When browsing would be inefficient

### Filtering

Controls for narrowing down large data sets based on specific criteria.

**Implementation Guidelines:**

* Place filters above or beside the content they affect
* Show active filters with the ability to remove them
* Support multiple simultaneous filters
* Provide clear visual feedback when filters are applied
* Allow saving filter combinations for reuse

**When to Use:**

* For large data sets with multiple attributes
* When users need to narrow down options
* For dashboards and analytics views

### Multi-select

Pattern for selecting multiple items from a list or collection.

**Implementation Guidelines:**

* Provide clear selection indicators (checkboxes)
* Show the count of selected items
* Support keyboard selection with Shift and Ctrl/Cmd modifiers
* Include select all/none options for convenience
* Maintain selection state during pagination or filtering

**When to Use:**

* When users need to perform actions on multiple items
* For bulk operations
* When grouping items for processing

## Feedback Patterns

### Notifications

Temporary messages that inform users about system events or status changes.

**Implementation Guidelines:**

* Position consistently (typically top-right)
* Use appropriate colors for different notification types
* Include a dismiss option
* Auto-dismiss non-critical notifications after a reasonable time
* Ensure notifications are announced to screen readers
* Limit the number of simultaneous notifications

**Types of Notifications:**

* **Success**: Confirmation of completed actions
* **Information**: Neutral information about system events
* **Warning**: Important notices that may require attention
* **Error**: Critical issues that need immediate attention

**When to Use:**

* To confirm successful actions
* To alert users about system events
* For asynchronous process completion
* To notify about background events

### Progress Indicators

Visual feedback showing the status of operations or processes.

**Implementation Guidelines:**

* Use linear progress bars for operations with known duration
* Use spinners for indeterminate operations
* Provide percentage or step indicators when possible
* Include cancel options for long-running operations
* Ensure progress is communicated to screen readers

**Types of Progress Indicators:**

* **Determinate**: Shows specific progress percentage
* **Indeterminate**: Shows that an operation is in progress without specific completion percentage
* **Stepped**: Shows progress through discrete steps

**When to Use:**

* For operations that take more than 1-2 seconds
* When users need to know how long to wait
* For multi-step processes

### Empty States

Meaningful displays when no content or data is available.

**Implementation Guidelines:**

* Provide clear explanation of why content is empty
* Include helpful illustrations or icons
* Offer actionable next steps
* Maintain consistent layout with non-empty states
* Avoid error-like messaging for normal empty states

**When to Use:**

* For initial application state before user input
* When search or filtering returns no results
* For sections that require user setup or configuration

### Validation Feedback

Real-time feedback on user input validity.

**Implementation Guidelines:**

* Provide inline validation as users type
* Use clear error messages that explain how to fix issues
* Show success indicators for valid input
* Position error messages consistently
* Ensure error messages are linked to inputs for screen readers

**When to Use:**

* For form inputs with specific requirements
* When validation can be performed in real-time
* To prevent submission of invalid data

## Disclosure Patterns

### Accordions

Vertically stacked sections that can be expanded or collapsed.

**Implementation Guidelines:**

* Use clear headings with expand/collapse indicators
* Support both click and keyboard interaction
* Maintain state of expanded sections when possible
* Implement proper ARIA attributes for accessibility
* Consider allowing multiple sections to be open simultaneously

```html
<div class="accordion">
  <div class="accordion-item">
    <h3>
      <button 
        aria-expanded="true"
        aria-controls="section1-content"
        id="section1-header"
        class="accordion-button"
      >
        Section 1
      </button>
    </h3>
    <div 
      id="section1-content" 
      role="region" 
      aria-labelledby="section1-header"
      class="accordion-content"
    >
      Content for section 1
    </div>
  </div>
  <!-- Additional accordion items -->
</div>
```

**When to Use:**

* For organizing content into discrete sections
* When screen space is limited
* For FAQ-style content
* When users need to focus on one section at a time

### Modals

Overlay dialogs that focus user attention on specific content or actions.

**Implementation Guidelines:**

* Center in the viewport
* Include a clear title
* Provide obvious close mechanism
* Trap focus within the modal for keyboard users
* Dismiss on escape key and outside click
* Return focus to the triggering element when closed

**When to Use:**

* For focused tasks that require completion
* When interrupting the current workflow is necessary
* For confirmations of important actions
* To display additional details without navigation

### Tooltips

Small informational popups that appear on hover or focus.

**Implementation Guidelines:**

* Keep content brief and helpful
* Position consistently relative to the trigger
* Ensure sufficient contrast
* Make accessible via keyboard focus
* Avoid putting essential information only in tooltips
* Implement with proper ARIA attributes

**When to Use:**

* For providing additional context
* To explain icons or abbreviated content
* For helpful tips without cluttering the interface
* When information is supplementary, not essential

### Popovers

Interactive overlays that contain additional content or controls.

**Implementation Guidelines:**

* Position relative to the triggering element
* Include a clear close mechanism
* Support keyboard navigation within the popover
* Maintain proper focus management
* Dismiss on escape key and outside click when appropriate

**When to Use:**

* For secondary actions or options
* When additional controls are needed contextually
* For rich interactive content that doesn't require a full modal
* For complex tooltips with interactive elements

## Data Display Patterns

### Tables

Structured display of tabular data with consistent formatting.

**Implementation Guidelines:**

* Use clear column headers
* Support sorting and filtering when appropriate
* Implement responsive behavior for small screens
* Include pagination for large data sets
* Support keyboard navigation and selection
* Use proper table markup for accessibility

**When to Use:**

* For structured data with multiple attributes
* When users need to compare values across rows
* For data that benefits from sorting and filtering

### Cards

Container-based layout for displaying collection items.

**Implementation Guidelines:**

* Use consistent card dimensions and spacing
* Include clear headings and visual hierarchy
* Support both grid and list views when appropriate
* Ensure cards are fully keyboard accessible
* Implement responsive layouts for different screen sizes

**When to Use:**

* For collections of similar items
* When visual presentation is important
* For dashboard widgets and summary information
* When items have visual elements like images

### Lists

Sequential display of items with consistent formatting.

**Implementation Guidelines:**

* Use appropriate list markup (ul, ol, dl)
* Maintain consistent spacing and alignment
* Support keyboard navigation
* Include clear visual hierarchy for nested lists
* Implement virtual scrolling for very long lists

**When to Use:**

* For sequential or hierarchical information
* When order is important
* For simple collections without complex visual elements
* For navigation menus and options

### Data Visualization

Graphical representation of data using charts and graphs.

**Implementation Guidelines:**

* Choose appropriate chart types for the data
* Use consistent colors and styles
* Include clear labels and legends
* Provide alternative text descriptions for screen readers
* Support interactive exploration when appropriate
* Ensure data can be accessed in non-visual formats

**When to Use:**

* For numerical or statistical data
* When patterns or trends are important
* For performance metrics and analytics
* When visual comparison aids understanding

## Workflow Patterns

### Wizards

Step-by-step guided processes with sequential navigation.

**Implementation Guidelines:**

* Show clear progress indication
* Provide next/previous navigation
* Allow saving progress for complex wizards
* Validate each step before proceeding
* Support keyboard navigation between steps
* Include summary before final submission

**When to Use:**

* For complex processes with multiple steps
* When users need guidance through a process
* For infrequently performed tasks
* When steps depend on previous choices

### Drag and Drop

Direct manipulation pattern for spatial arrangement or ordering.

**Implementation Guidelines:**

* Provide clear visual cues for draggable items
* Show drop targets and feedback during drag
* Support keyboard alternatives for all drag operations
* Implement proper ARIA attributes for accessibility
* Include undo functionality for accidental drops

**When to Use:**

* For spatial arrangement of items
* When ordering or prioritizing is important
* For visual builders and designers
* When direct manipulation provides efficiency

### Infinite Scroll

Continuous loading of content as the user scrolls.

**Implementation Guidelines:**

* Load content in manageable batches
* Show loading indicators when fetching more content
* Maintain scroll position when new content loads
* Provide a way to return to the top
* Consider accessibility implications for screen reader users

**When to Use:**

* For content feeds and timelines
* When natural reading flow is important
* For exploratory browsing experiences
* When pagination would interrupt the user experience

### Split Views

Multiple panes showing related content simultaneously.

**Implementation Guidelines:**

* Allow resizing of panes when appropriate
* Maintain minimum widths for usability
* Support keyboard navigation between panes
* Save pane configurations when possible
* Implement responsive behavior for small screens

**When to Use:**

* For master-detail relationships
* When comparing content side by side
* For complex editing interfaces
* When context needs to be maintained while working

## Related Documentation

* [Design System Overview](./overview.md)
* [Visual Language](./visual_language.md)
* [Component Guidelines](./component_guidelines.md)
* [Accessibility](./accessibility.md)


