# Parallel Nodes

## Overview

Parallel nodes enable workflows to execute multiple branches concurrently, allowing for simultaneous task execution and improved efficiency. These nodes split execution into multiple paths and then synchronize the results when all branches complete. The visual design emphasizes the concurrent nature of these nodes and provides clear visibility into branch execution status.

## Visual Design

### Base Appearance

```
+---------------------------------------------+
|  ⫴  Parallel                 ⋮  |  ✓  |  ␡  |
+---------------------------------------------+
|                                             |
|  Execute branches:                          |
|  - Process Orders                           |
|  - Update Inventory                         |
|  - Notify Shipping                          |
|                                             |
+---------------------------------------------+
|  Branches: 3                [ Configure ]   |
+---------------------------------------------+
```

* **Shape**: Rounded rectangle with 6px corner radius
* **Size**: Default 240px width × 140px height (resizable)
* **Header**: Light blue (#6BA1FF) background with white text
* **Header Icon**: Parallel lines (⫴) icon on the left side
* **Header Actions**: Menu, validation status, and delete buttons on the right
* **Content Area**: White background with branch preview
* **Footer**: Light gray background (#F8F8F8) with branch count information

### Connection Points

* **Inputs**: One input port on the left side
  * Main input port at vertical center
  * Input data is distributed to all branches
* **Outputs**: Multiple output ports on the right side
  * One output port for each concurrent branch
  * Ports are distributed evenly along the right edge
  * Ports are labeled with branch names
  * Optional aggregate output port for combined results

### Content Area Design

The content area provides a preview of the parallel execution with:

* **Branch List**: Shows the names of branches to be executed concurrently
* **Branch Description**: Optional brief description of each branch's purpose
* **Execution Options**: Indication of completion requirements (all vs. any)
* **Data Flow**: Visual representation of how data flows to/from branches

## Parallel Node Variations

### Standard Parallel Split/Join

```
+---------------------------------------------+
|  ⫴  Parallel Split/Join       ⋮  |  ✓  |  ␡  |
+---------------------------------------------+
|                                             |
|  All branches must complete                 |
|                                             |
|  Branches:                                  |
|  - Data Validation                          |
|  - Credit Check                             |
|  - Risk Assessment                          |
|                                             |
+---------------------------------------------+
|  Join: Wait for all        [ Configure ]    |
+---------------------------------------------+
```

* **Icon**: Standard parallel lines icon
* **Content**: Shows branch list with completion requirement
* **Footer**: Shows join behavior ("Wait for all")

### Partial Join

```
+---------------------------------------------+
|  ⫴  Partial Join              ⋮  |  ✓  |  ␡  |
+---------------------------------------------+
|                                             |
|  Continue after 2 of 3 branches complete    |
|                                             |
|  Branches:                                  |
|  - Primary Vendor Check                     |
|  - Secondary Vendor Check                   |
|  - Internal Inventory Check                 |
|                                             |
+---------------------------------------------+
|  Join: N of M (2 of 3)      [ Configure ]   |
+---------------------------------------------+
```

* **Icon**: Modified parallel lines with number indicator
* **Content**: Shows number of branches required for continuation
* **Footer**: Shows "N of M" join configuration

### First Completed

```
+---------------------------------------------+
|  ⫴  First Completed          ⋮  |  ✓  |  ␡  |
+---------------------------------------------+
|                                             |
|  Continue after first branch completes      |
|  Cancel other branches                      |
|                                             |
|  Branches:                                  |
|  - API Provider 1                           |
|  - API Provider 2                           |
|  - API Provider 3                           |
|                                             |
+---------------------------------------------+
|  Join: First response       [ Configure ]   |
+---------------------------------------------+
```

* **Icon**: Parallel lines with "1" indicator
* **Content**: Shows first-to-complete behavior
* **Footer**: Shows "First response" join configuration

### Parallel For-Each

```
+---------------------------------------------+
|  ⫴  Parallel For-Each        ⋮  |  ✓  |  ␡  |
+---------------------------------------------+
|                                             |
|  For each item in: input.orderItems         |
|                                             |
|  Execute:                                   |
|  - Process Item                             |
|  - Update Inventory                         |
|                                             |
|  Max concurrent: 5                          |
|                                             |
+---------------------------------------------+
|  Collection processing      [ Configure ]   |
+---------------------------------------------+
```

* **Icon**: Parallel lines with iteration indicator
* **Content**: Shows collection being processed and item operations
* **Footer**: Shows "Collection processing" and concurrency limit

## Node States

Parallel nodes display these states:

| State | Visual Appearance |
|----|----|
| **Default** | Standard appearance as described above |
| **Selected** | Blue outline (2px) with resize handles |
| **Hover** | Slight elevation increase (shadow enhancement) |
| **Focused** | Blue dashed outline (for keyboard navigation) |
| **Splitting** | Blue pulsing animation radiating outward |
| **Branches Executing** | Progress indicators for each branch (0-100%) |
| **Branches Completed** | Green checkmarks next to completed branches |
| **Branches Failed** | Red X icons next to failed branches |
| **All Complete** | Green outline when all branches complete |
| **Partially Complete** | Yellow outline when some branches complete |
| **Join Error** | Red outline with error icon |
| **Timeout** | Orange warning with clock icon |

## Branch Configuration View

When "Configure" is clicked, the properties panel shows the branch configuration interface:

```
+-----------------------------------------------------+
|  PARALLEL EXECUTION CONFIGURATION                   |
+-----------------------------------------------------+
|                                                     |
|  Branch 1: Data Validation                          |
|  [✓] Required for completion                        |
|  [x] Cancel on workflow error                       |
|  Timeout: [ 30 ] seconds                            |
|  [ Edit Branch ]                                    |
|                                                     |
|  Branch 2: Credit Check                             |
|  [✓] Required for completion                        |
|  [x] Cancel on workflow error                       |
|  Timeout: [ 60 ] seconds                            |
|  [ Edit Branch ]                                    |
|                                                     |
|  Branch 3: Risk Assessment                          |
|  [ ] Required for completion                        |
|  [x] Cancel on workflow error                       |
|  Timeout: [ 120 ] seconds                           |
|  [ Edit Branch ]                                    |
|                                                     |
|  [ + Add Branch ]                                   |
|                                                     |
|  Join Configuration:                                |
|  (•) Wait for all required branches                 |
|  ( ) Wait for N branches: [ 2 ]                     |
|  ( ) Continue after first branch                    |
|                                                     |
|  [ Apply ]                [ Cancel ]                |
+-----------------------------------------------------+
```

* **Branch Management**: Interface for adding, editing, and removing branches
* **Requirement Settings**: Configure which branches are required vs. optional
* **Timeout Settings**: Configure timeouts for each branch
* **Join Configuration**: Define how execution paths rejoin
* **Error Handling**: Configure behavior when branches fail
* **Data Mapping**: Configure how data is distributed and collected

## Interactive Elements

Parallel nodes provide these interactive elements:

* **Configure Button**: Opens the branch configuration in the properties panel
* **Branch List**: Clickable branch names to quickly edit specific branches
* **Add Branch Button**: Quick access to add a new parallel branch
* **Menu Button**: Additional options (templates, error handling, etc.)
* **Join Type Selector**: Dropdown for selecting join behavior
* **Concurrency Limiter**: Controls for maximum simultaneous executions

## Properties Panel Integration

When a Parallel node is selected, the properties panel shows:

* **Branches Tab**:
  * Branch list management
  * Branch ordering
  * Individual branch configuration
  * Timeout settings
* **Join Configuration Tab**:
  * Join type selection (all, N of M, first)
  * Completion criteria
  * Timeout handling
  * Error propagation settings
* **Data Mapping Tab**:
  * Input data distribution
  * Output data aggregation
  * Branch-specific data transformations
  * Result merging strategies
* **Advanced Tab**:
  * Concurrency limits
  * Resource allocation
  * Priority settings
  * Debugging options

## Parallel Flow Visualization

Parallel nodes feature special visual aids to show execution flow:

* **Branch Highlighting**: When a parallel node is selected, all parallel branches are highlighted
* **Progress Indication**: During execution, progress bars or percentages show completion status
* **Active Branch Indication**: Currently executing branches are highlighted
* **Execution Timeline**: Optional visualization showing branch execution order and timing
* **Bottleneck Analysis**: Visual indication of which branches are slowing overall completion

## Accessibility Considerations

* **Color Independence**: The parallel lines icon and node shape ensure it's recognizable without relying solely on color
* **Screen Reader Support**:
  * Announces "Parallel Node" with branch count and join type
  * Branch status properly conveyed
  * Execution progress announced
* **Keyboard Navigation**:
  * Tab stops for all interactive elements
  * Keyboard shortcuts for branch management
  * Arrow key navigation in configuration panels

## Usage Guidelines

* **Appropriate Use**: Use parallel nodes only when tasks are truly independent of each other
* **Branch Naming**: Use descriptive names that indicate each branch's purpose
* **Error Handling**: Configure how errors in individual branches should affect the workflow
* **Timeouts**: Set appropriate timeouts to prevent indefinite waiting
* **Resource Consideration**: Be mindful of system resources when executing many parallel branches
* **Data Aggregation**: Plan how results from multiple branches will be combined
* **Testing**: Test parallel execution with varying branch completion times

## Related Components

* [Canvas Appearance](../canvas/appearance.md): Overall canvas styling context
* [Properties Panel](../panels/properties-panel.md): Where detailed branch configuration occurs
* [Decision Nodes](./decision-nodes.md): Alternative when paths should be taken conditionally
* [Code Task Nodes](./code-task-nodes.md): Often used within parallel branches


