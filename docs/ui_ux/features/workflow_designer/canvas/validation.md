# Canvas Validation

## Overview

The Workflow Designer Canvas provides visual validation indicators to help users identify and fix issues in their workflow designs. This document details the validation system's visual elements, interaction patterns, and feedback mechanisms that ensure users can create valid and executable workflows.

## Validation System Principles

The Canvas Validation system follows these core principles:


1. **Real-time Feedback**: Validation occurs continuously during editing, providing immediate feedback
2. **Progressive Disclosure**: Basic errors are shown immediately, with details available on demand
3. **Actionable Guidance**: Validation messages include specific remediation steps
4. **Visual Clarity**: Clear visual distinction between critical errors, warnings, and informational guidance
5. **Non-blocking**: Validation feedback doesn't prevent further editing or experimentation

## Validation States

Workflows can exist in the following validation states:

| State | Visual Indicator | Description |
|----|----|----|
| **Valid** | Green checkmark in header | Workflow has no errors and can be executed |
| **Warnings** | Yellow warning icon with count | Workflow has non-critical issues that won't prevent execution |
| **Errors** | Red error icon with count | Workflow has critical issues that must be fixed before execution |
| **Validating** | Blue spinner | Validation is in progress (for complex workflows) |
| **Not Validated** | Gray question mark | Initial state before first validation |

## Validation Indicators

### Global Validation Indicator

* **Location**: Header bar, next to workflow status (see [Header Documentation](../layout/header.md))
* **Visual**: Icon + text showing validation state and issue count
* **Behavior**:
  * Green checkmark + "No Errors" when workflow is valid
  * Yellow warning icon + "X Warnings" when non-critical issues exist
  * Red error icon + "X Errors" when critical issues exist
  * Click to open validation panel showing detailed list

### Node-level Validation

Nodes display validation status through:


1. **Border Color**:
   * **Red Border**: Node has critical errors
   * **Yellow Border**: Node has warnings
   * **Green Pulse** (momentary): Node passed validation after changes
2. **Status Icon**:
   * **Top-right Corner**: Small icon indicating validation state
   * **Red Icon**: Error indicator
   * **Yellow Icon**: Warning indicator
   * **Hover Behavior**: Shows tooltip with summary of issues
3. **Visual Emphasis**:
   * Invalid nodes receive visual emphasis to draw attention
   * Optional pulsing animation for newly detected errors

### Connection-level Validation

Connections display validation status through:


1. **Line Style**:
   * **Solid Line**: Valid connection
   * **Dashed Red Line**: Invalid connection (e.g., incompatible types)
   * **Dashed Yellow Line**: Warning (e.g., potential data loss)
2. **Connection Badges**:
   * Small circular icons attached to connection lines
   * Red/yellow indicating error/warning
   * Hover for specific issue information

### Group-level Validation

Groups display aggregate validation status:


1. **Group Header**:
   * Colored indicator showing worst-case status of contained nodes
   * Error count badge for quick assessment
2. **Collapsed Groups**:
   * Maintain validation state visibility even when collapsed
   * Show aggregate counts of errors/warnings inside

## Validation Panel

The detailed Validation Panel provides comprehensive information about all validation issues:

### Panel Layout

* **Location**: Bottom panel container (see [Overall Structure](../layout/overall-structure.md))
* **Access**: Click validation indicator in header, or use keyboard shortcut (Alt+V)
* **Organization**: Tabbed interface with errors, warnings, and information

### Issue List

* **Grouping**: Issues grouped by node/connection/workflow-level
* **Sorting**: Options to sort by severity, element type, or canvas position
* **Filtering**: Filters for showing only errors, warnings, or specific issue types
* **Searching**: Search functionality to find specific issues

### Issue Card Components

Each issue is presented as a card with:

* **Severity Icon**: Visual indicator of error/warning/info
* **Issue Title**: Concise description of the problem
* **Affected Element**: Name and type of the workflow element
* **Description**: Detailed explanation of the issue
* **Resolution Steps**: Specific actions to fix the problem
* **Jump To**: Button to select and center view on the affected element
* **Ignore Option**: For warnings, option to explicitly acknowledge and ignore
* **Auto-fix Option**: For certain issues, a button to automatically resolve the problem

## Validation Interaction Patterns

### Real-time Validation


1. **Trigger Points**:
   * Automatically after each edit with a short delay (500ms)
   * When explicitly requested via Validate button
   * Before save operations
   * Before execution attempts
2. **Visual Feedback During Validation**:
   * Progress indicator for large workflows
   * Sequential validation with feedback on current focus
   * Completion animation when validation finishes

### Issue Navigation


1. **Jump-to-Element**:
   * Click on issue card to select and center view on affected element
   * Navigation history to move between recently viewed issues
   * Keyboard shortcuts to cycle through issues (F8/Shift+F8)
2. **Contextual Helper**:
   * Hover over validation icon on node for quick view of issues
   * Click to open validation panel filtered to that node's issues
   * Direct access to node properties needing attention

### Resolution Workflow


1. **Guided Resolution**:
   * Step-by-step guidance for fixing complex issues
   * Progress tracking for multi-step resolutions
   * Immediate re-validation after changes
2. **Batch Resolution**:
   * Identify similar issues across multiple nodes
   * Apply fixes to all instances simultaneously
   * Confirmation of resulting validation state

## Validation Categories

### Structural Validation

Visual indicators for workflow structure issues:


1. **Connectivity Problems**:
   * **Missing Start/End**: Red highlight on canvas background
   * **Unreachable Nodes**: Gray node with red "unreachable" badge
   * **Unconnected Nodes**: Node with floating input/output port highlight
   * **Cycles**: Red highlighted connections forming the cycle
2. **Node Configuration**:
   * **Required Fields**: Red outline around missing required properties
   * **Invalid Configuration**: Red indicator next to problematic fields
   * **Dependency Issues**: Connection line with "broken dependency" badge

### Data Flow Validation

Visual indicators for data-related issues:


1. **Type Compatibility**:
   * **Type Mismatch**: Red connection with type information tooltip
   * **Transformation Needed**: Yellow connection with transformation icon
   * **Missing Mapping**: Input port with red "unmapped" indicator
2. **Data Quality**:
   * **Potential Data Loss**: Yellow warning on connections with narrowing conversions
   * **Format Validation**: Field-level indicators for format issues
   * **Required Data**: Red highlight for required but potentially missing data

### Execution Validation

Visual indicators for runtime-related issues:


1. **Performance Considerations**:
   * **Bottlenecks**: Yellow indicator on potential performance bottlenecks
   * **Parallel Optimization**: Suggestions for parallelizable sequences
   * **Resource Usage**: Warning indicators for high-resource operations
2. **Error Handling**:
   * **Missing Error Handlers**: Red indicators for unhandled error paths
   * **Timeout Configuration**: Warning for missing timeouts
   * **Retry Policy**: Information badges for nodes lacking retry configuration

## Accessibility Considerations

Validation indicators are designed for accessibility:


1. **Color Independence**:
   * All validation states use icons and patterns in addition to colors
   * High contrast modes available for all validation states
   * Text descriptions complement visual indicators
2. **Screen Reader Support**:
   * ARIA live regions announce validation state changes
   * Structured navigation through validation issues
   * Text alternatives for all visual validation indicators
3. **Keyboard Navigation**:
   * Arrow keys to navigate between issues in validation panel
   * Keyboard shortcuts for accessing validation functions
   * Focus management between validation panel and affected elements

## Related Components

* [Canvas Appearance](./appearance.md): Visual styling of canvas elements including validation states
* [Canvas Interaction](./interaction.md): How users interact with validation indicators
* [Properties Panel](../panels/properties-panel.md): Where detailed validation appears in property fields
* [Testing Panel](../panels/testing-panel.md): Relationship between validation and workflow testing


