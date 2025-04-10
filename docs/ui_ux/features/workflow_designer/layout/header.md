# Workflow Designer Header

## Overview

The Workflow Designer Header is the top bar component that provides workflow identification, primary actions, and navigation elements. It serves as a persistent control panel for workflow-level operations and status information.

## Visual Design

### Layout Structure

The header spans the full width of the workflow designer interface and has a fixed height of 56px. It is organized into three main sections:


1. **Left Section**: Workflow identification and back navigation
2. **Center Section**: Workflow status and validation indicators
3. **Right Section**: Primary actions and menu controls

### Component Wireframe

```
+-----------------------------------------------------------------------------------+
|                                                                                   |
| ← Back to Workflows  |  Customer Inquiry Workflow  |  [Draft] ▼   ✓ No Errors    |  Validate  |  Test ▼  |  Save  |  ⋮  |
|                      |                             |                              |                                    |
+-----------------------------------------------------------------------------------+
```

### Color and Typography

* **Background**: Primary surface color with subtle shadow to separate from canvas
* **Text**: High contrast text for workflow name (Title case)
* **Status**: Color-coded status indicators:
  * Draft: Gray
  * Valid: Green
  * Error: Red
  * Published: Blue
* **Actions**: Primary and secondary button styles from the global design system

## Components

### 1. Back Navigation

* **Visual**: Left-pointing arrow icon + "Back to Workflows" text
* **Position**: Far left of header
* **Behavior**: Returns to workflow listing page
* **State Changes**: Shows confirmation dialog if unsaved changes exist

### 2. Workflow Name

* **Visual**: Workflow name in title case with optional edit icon
* **Position**: Left-center of header
* **Behavior**:
  * Displays current workflow name
  * Click to edit inline (shows edit field with save/cancel)
  * Truncates with ellipsis if too long (tooltip shows full name)
* **State Changes**: Highlights on hover, shows edit mode when clicked

### 3. Workflow Status Dropdown

* **Visual**: Status label with dropdown indicator
* **Position**: Center-right of header
* **Behavior**:
  * Shows current workflow status (Draft, Published, etc.)
  * Click opens status change dropdown with available transitions
  * Includes confirmation for status changes that affect workflow availability
* **State Changes**: Updates label and color when status changes

### 4. Validation Status

* **Visual**: Icon + text showing validation state
* **Position**: Center-right of header
* **Behavior**:
  * Green checkmark + "No Errors" when workflow is valid
  * Red warning icon + "X Errors" when validation issues exist
  * Click to open validation panel showing detailed error list
* **State Changes**: Updates in real-time as workflow is edited

### 5. Primary Action Buttons

* **Visual**: Text buttons with optional icons
* **Position**: Right section of header
* **Actions**:
  * **Validate**: Triggers manual validation of workflow
  * **Test**: Dropdown with options to run tests or create new tests
  * **Save**: Saves current workflow state
* **State Changes**:
  * Save button disabled when no changes or changes auto-saved
  * Test button disabled when workflow has validation errors

### 6. More Actions Menu

* **Visual**: Three dots icon (⋮)
* **Position**: Far right of header
* **Behavior**: Opens dropdown with additional actions:
  * Export workflow
  * Import workflow
  * Duplicate workflow
  * Delete workflow
  * View workflow history
* **State Changes**: Menu expands/collapses on click

## Interaction Patterns

### Workflow Name Editing


1. User clicks on workflow name
2. Name transforms into editable field with current name selected
3. User types new name
4. User presses Enter or clicks elsewhere to save
5. Cancel by pressing Escape

### Validation Feedback


1. Validation occurs automatically as user edits workflow
2. Status icon updates to reflect current validation state
3. Clicking on validation status opens panel with detailed errors
4. Each error in panel has a "Jump to" action to focus on problematic element

### Status Changes


1. User clicks on status dropdown
2. Available status transitions appear in dropdown
3. User selects new status
4. System shows confirmation dialog for significant changes
5. Status updates with visual feedback (color/label change)

## Responsive Behavior

* On smaller screens (tablet), the header maintains all components but reduces spacing
* On mobile devices, the header collapses less important elements into the more actions menu
* Minimum viable header for smallest screens includes: back button, workflow name, and combined actions menu

## Accessibility

* All interactive elements have appropriate focus states
* Color is not the only indicator of status (icons and text reinforce status)
* Keyboard navigation follows a logical tab order
* Proper ARIA labels for all controls
* Sufficient color contrast for all text elements

## Related Components

* [Overall Structure](./overall-structure.md): How the header integrates with the complete layout
* [Canvas Appearance](../canvas/appearance.md): Visual coordination between header and canvas
* [Settings Panel](../panels/settings-panel.md): Where detailed workflow configuration occurs


