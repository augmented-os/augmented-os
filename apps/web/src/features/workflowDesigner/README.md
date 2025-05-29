# Workflow Designer: React Flow State Management

This document outlines how state, particularly related to React Flow and workflow modifications, is managed within the `workflowDesigner` feature.

## Core State Management

The primary state for React Flow (nodes, edges, and the React Flow instance itself) and the modification status (`isWorkflowModified`) are managed at the page level, where the `WorkflowDesigner` component is consumed. Currently, these pages are:

-   `src/pages/WorkflowsPage.tsx`
-   `src/pages/Index.tsx`

Each of these pages initializes and provides the following to the `WorkflowDesigner` component:

-   `nodes`, `setNodes`, `onNodesChange`: Managed via `useNodesState` from React Flow.
-   `edges`, `setEdges`, `onEdgesChange`: Managed via `useEdgesState` from React Flow.
-   `reactFlowInstance`, `setReactFlowInstance`: For accessing the React Flow instance.
-   `isWorkflowModified`, `setIsWorkflowModified`: A React `useState` hook to track unsaved changes.
-   `onSave`: A callback function to persist changes. This function is responsible for calling `setIsWorkflowModified(false)` upon successful save.

## `WorkflowDesigner` Feature Components

### 1. `WorkflowDesigner` (Wrapper Component)
   -   Path: `src/features/workflowDesigner/index.tsx`
   -   This is a light wrapper that primarily sets up the `WorkflowUIProvider`. The `WorkflowUIProvider` manages UI-specific state for the designer, such as the visibility and content of side panels or overlays, distinct from the core workflow data and modification status.

### 2. `WorkflowDesignerInner`
   -   Path: `src/features/workflowDesigner/index.tsx`
   -   Receives all the state and handlers from its parent page (e.g., `WorkflowsPage.tsx` or `Index.tsx`).
   -   **`markAsModified` function**: Defined here using `useCallback`. It calls the `setIsWorkflowModified(true)` prop received from the parent page. This is the central function for indicating that a change has occurred.
   -   **`resetModified` function**: Defined here using `useCallback`. It calls `setIsWorkflowModified(false)`.
   -   **`handleSave` function**: Calls the `onSave` prop and then `resetModified`.
   -   Passes `markAsModified` to child hooks and components that can trigger a modification.

### 3. `useNodeOperations` Hook
   -   Path: `src/features/workflowDesigner/hooks/use-node-operations.ts`
   -   Receives `setNodes`, `setEdges`, and importantly, `markAsModified` from `WorkflowDesignerInner`.
   -   **`handleNodesChange` & `handleEdgesChange`**: These are custom handlers that wrap React Flow's `applyNodeChanges` and `applyEdgeChanges`. They call `markAsModified()` when relevant changes occur (e.g., adding or removing nodes/edges).
        *   Note: `handleNodesChange` intentionally *does not* call `markAsModified` for 'position' changes (dragging), as this is handled by `FlowCanvas`'s `onNodeDragStop`.
   -   **`onConnect`, `onAddNode`, `onDrop`**: These direct action handlers also call `markAsModified()`.

### 4. `FlowCanvas` Component
   -   Path: `src/features/workflowDesigner/components/FlowCanvas.tsx`
   -   Renders the actual `ReactFlow` component.
   -   Receives `onNodesChange` and `onEdgesChange` from `WorkflowDesignerInner`. **Crucially, these are now the `handleNodesChange` and `handleEdgesChange` from the `useNodeOperations` hook**, ensuring modifications are tracked.
   -   Receives `markAsModified` directly from `WorkflowDesignerInner`.
   -   **`onNodeDragStart` & `onNodeDragStop`**: Implemented here. `onNodeDragStop` explicitly calls `markAsModified()` if the node's position has actually changed.

### 5. `ConfigPanel` Component
   -   Path: `src/features/workflowDesigner/components/configPanel/index.tsx`
   -   Used for editing properties of selected nodes or edges.
   -   When an update occurs, it calls the `onUpdate` or `onBulkUpdate` props, which are mapped to `handleElementUpdate` and `handleBulkElementUpdate` in `WorkflowDesignerInner`.
   -   `handleElementUpdate` and `handleBulkElementUpdate` in `WorkflowDesignerInner` then call `markAsModified()`.

## Modification Flow Summary

1.  User performs an action (e.g., drags a node, adds an edge, edits a property in `ConfigPanel`).
2.  The relevant component or hook (`FlowCanvas`, `useNodeOperations`, or `ConfigPanel` via `WorkflowDesignerInner`) calls `markAsModified()`.
3.  `markAsModified` (in `WorkflowDesignerInner`) calls `setIsWorkflowModified(true)` (which is the state setter from the parent page like `WorkflowsPage.tsx` or `Index.tsx`).
4.  The `isWorkflowModified` state at the page level becomes `true`.
5.  This state is passed down through props, and the "Save" button in `WorkflowHeader` becomes active (as it's conditioned on `isWorkflowModified`).
6.  When the user clicks "Save":
    *   The `handleSave` in `WorkflowHeader` calls the `handleSave` prop from `WorkflowDesignerInner`.
    *   `WorkflowDesignerInner`'s `handleSave` calls the `onSave` prop (the actual save function from the page like `saveWorkflow` in `Index.tsx`).
    *   The page-level save function (`saveWorkflow`) persists the data and then calls `setIsWorkflowModified(false)`.
    *   The `resetModified` function in `WorkflowDesignerInner` is also called (redundantly, but harmlessly if the page already reset it).
7.  The "Save" button becomes inactive again.

This setup ensures that the modification status is centrally managed at the page level but updated by the specific components and hooks within the `workflowDesigner` feature that are aware of user interactions.
