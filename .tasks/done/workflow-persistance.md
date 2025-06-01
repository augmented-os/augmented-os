id: WFDS-101 # Workflow Designer
title: Persist Active Workflow Across Tab/Menu Navigation
status: todo
labels:
  - enhancement
  - routing
  - state-management
  - workflow-designer
description: |
  Currently, when a user navigates away from the workflow designer (e.g., to another menu item like "Integrations") and then returns, the designer often loads a default workflow instead of the one the user was previously viewing or editing. This task is to implement a persistence mechanism so the application remembers and reloads the last active workflow.
dependencies: [] # No specific task IDs, but depends on existing router setup.
context:
  - src/pages/WorkflowsPage.tsx
  - src/hooks/use-workflows.ts
  - src/features/workflowDesigner/index.tsx
  - src/App.tsx
  - src/routes.config.tsx
  - src/components/layout/Layout.tsx
  - src/components/layout/Topbar.tsx
  - src/components/layout/navigation/NavigationMenu.tsx
work_steps:
  - step: 1
    description: "Modify Routing Configuration"
    instructions:
      - "In `src/routes.config.tsx`, ensure the workflow designer route (e.g., `/build/workflows/:id?`) correctly accepts an optional `id` parameter to represent `workflowId`."
      - "Review `src/App.tsx` to understand how routes are consumed, but changes are likely only in `routes.config.tsx`."
    files_to_modify:
      - "src/routes.config.tsx"
    target_outcome: "Workflow designer page can be accessed via a URL containing a workflow ID, and also via a base URL (e.g., /build/workflows)."

  - step: 2
    description: "Update `useWorkflows` Hook for URL and Session Storage Awareness"
    instructions:
      - "Add `targetWorkflowId?: string;` to the `UseWorkflowsOptions` interface."
      - "In the main `useEffect` for initial data fetching:"
      - "  1. After `fetchAllWorkflows` and `fetchFolders` complete:"
      - "  2. Determine `idToLoad` priority: `options.targetWorkflowId` (from URL) > `sessionStorage.getItem('lastActiveWorkflowId')` (validated against the fetched workflows list) > first workflow in the list."
      - "  3. If `idToLoad` is determined, call `fetchWorkflow(idToLoad)`."
      - "  4. Ensure the `useEffect` dependency array correctly includes `options.targetWorkflowId`, `fetchAllWorkflows`, `fetchWorkflow`, `fetchFolders` callbacks, and the `workflows` list."
    files_to_modify:
      - "src/hooks/use-workflows.ts"
    target_outcome: "The `useWorkflows` hook can prioritize loading a workflow based on a `targetWorkflowId` prop, then session storage, then a default."

  - step: 3
    description: "Modify `WorkflowsPage.tsx` to Integrate URL Parameter and Session Storage"
    instructions:
      - "Use the `useParams` hook from `react-router-dom` to get `id` (as `workflowIdFromUrl`)."
      - "Pass `workflowIdFromUrl` as `targetWorkflowId` to the `useWorkflows` hook."
      - "Implement a `useEffect` hook that runs when `currentWorkflow` (from `useWorkflows`) changes. If `currentWorkflow.id` exists, update `sessionStorage.setItem('lastActiveWorkflowId', currentWorkflow.id)`."
      - "Implement a `useEffect` to synchronize the URL with `currentWorkflow.id`. If `currentWorkflow.id` changes and doesn't match `workflowIdFromUrl`, use the `useNavigate` hook from `react-router-dom` (e.g., `navigate(\`/build/workflows/\${currentWorkflow.id}\`, { replace: true })`) to update the URL."
    files_to_modify:
      - "src/pages/WorkflowsPage.tsx"
    target_outcome: "The `WorkflowsPage` reads the workflow ID from the URL, tells `useWorkflows` to load it, updates session storage with the active ID, and keeps the URL in sync with the active workflow."

  - step: 4
    description: "Update Main Navigation Links in Topbar/NavigationMenu"
    instructions:
      - "In `src/components/layout/Topbar.tsx` (or `NavigationMenu.tsx` if logic is delegated there):"
      - "Modify how the navigation link for 'Workflows' (e.g., in `buildMenuItems`) is generated or handled."
      - "When constructing the `path` or handling `onClick` for the 'Workflows' link, attempt to retrieve `lastActiveWorkflowId` from `sessionStorage.getItem('lastActiveWorkflowId')`."
      - "If an ID is found, the link should point to `/build/workflows/{lastActiveWorkflowId}`. Otherwise, it should point to `/build/workflows`."
    files_to_modify:
      - "src/components/layout/Topbar.tsx"
      - "src/components/layout/navigation/NavigationMenu.tsx"
    target_outcome: "Clicking the 'Workflows' navigation item in the Topbar takes the user back to their last viewed workflow if one exists in the current session."

  - step: 5
    description: "Implement Unsaved Changes Prompt (Navigation Guard)"
    instructions:
      - "Utilize the router's navigation blocking mechanism. For `react-router-dom` v6.7+, this can be done via `useBlocker`."
      - "In `WorkflowsPage.tsx`, use `useBlocker` conditionally based on the `isWorkflowModified` state (which needs to be obtained from `WorkflowDesignerInner` or managed at the page level)."
      - "If `isWorkflowModified` is true, the blocker function should show a confirmation dialog (e.g., `window.confirm`)."
      - "Prevent navigation if the user cancels by calling `blocker.reset()` if not proceeding, or `blocker.proceed()` if allowing navigation."
      - "This might involve lifting the `isWorkflowModified` state or passing a callback to `WorkflowDesigner` to update it at the `WorkflowsPage` level."
    files_to_modify:
      - "src/features/workflowDesigner/index.tsx"
      - "src/pages/WorkflowsPage.tsx"
    target_outcome: "Users are prompted to confirm leaving the page if they have unsaved changes to the current workflow."

acceptance_criteria:
  manual:
    - "Open a specific workflow (e.g., Workflow A)."
    - "Navigate to another section of the application (e.g., 'Integrations' page via Topbar)."
    - "Navigate back to 'Workflows' using the Topbar menu."
    - "Verify that Workflow A is loaded and displayed, not a default workflow."
    - "Verify the URL reflects the ID of Workflow A (e.g., /build/workflows/workflowA-id)."
    - "Switch to a different workflow (e.g., Workflow B) from the designer's dropdown."
    - "Verify the URL updates to reflect Workflow B's ID."
    - "Verify `sessionStorage` contains `lastActiveWorkflowId` set to Workflow B's ID."
    - "Refresh the browser page. Verify Workflow B is reloaded."
    - "Make a change to a workflow (e.g., move a node) so it's 'modified'."
    - "Try to navigate away using a menu link in the Topbar. Verify a confirmation prompt appears about unsaved changes."
    - "Cancel the navigation. Verify you stay on the designer page with Workflow B."
    - "Try to navigate away again, but confirm leaving. Verify navigation proceeds."
    - "Close the browser tab and reopen. Navigate to the designer via the Topbar. Verify Workflow B (or the last one from `sessionStorage` before closing) is loaded."
  automated:
    - "# Optional: Consider Playwright/Cypress tests for end-to-end flow if feasible."
    - "# Unit tests for new logic in `useWorkflows` (e.g., ID prioritization)."
    - "# Unit tests for URL parsing and session storage interaction in `WorkflowsPage`."

self_checklist:
  - Code formatting and linting rules are followed.
  - All new and modified components/hooks have appropriate comments for complex logic.
  - Console logs used for debugging are removed.
  - Error handling is considered (e.g., what if a workflow ID from URL/session storage is invalid or workflow not found?).
  - The `isWorkflowModified` state is correctly managed and accessible for the navigation guard.
  - Performance implications of frequent session storage access are minimal.
