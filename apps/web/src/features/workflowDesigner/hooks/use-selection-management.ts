import { ReactFlowInstance } from 'reactflow';
// Corrected import - only import the hook itself
import { useWorkflowUIMode } from './use-workflow-ui-mode';

/**
 * Custom hook for managing UI state related to the workflow designer.
 * Acts as an adapter between WorkflowDesigner and the useWorkflowUIMode state machine.
 */
export function useSelectionManagement(reactFlowInstance: ReactFlowInstance | null) {
  // Get all state and functions directly from the state machine hook
  const {
    // Explicit transitions
    resetToDefault,
    toggleNodeTypesOverlay,
    hideNodeTypesOverlay, // <-- Destructure hideNodeTypesOverlay here
    toggleTab,
    handleElementSelection,
    // Additional state
    zoomLevel,
    updateZoomLevel,
    // Derived states
    isOverlayVisible,
    activeTab,
    selectedElementId,
    editingSection,
    // Not returned, but available if needed:
    // uiMode,
  } = useWorkflowUIMode();

  // Pane click handler now calls resetToDefault
  const onClick = (event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    // Added safety checks for target and classList
    if (target && target.classList && target.classList.contains('react-flow__pane')) {
      console.log('onClick on pane detected - Resetting UI mode to DEFAULT');
      resetToDefault();
    }
  };

  return {
    // Derived state
    activeTab,
    isOverlayVisible,
    selectedElementId,
    editingSection,
    zoomLevel,
    // Handlers
    onClick, // Pane click handler
    handleTabClick: toggleTab,
    handleOverlayToggle: toggleNodeTypesOverlay,
    handleElementSelection,
    updateZoomLevel,
    // Use the correctly destructured function
    handleOverlayClose: hideNodeTypesOverlay,
  };
}