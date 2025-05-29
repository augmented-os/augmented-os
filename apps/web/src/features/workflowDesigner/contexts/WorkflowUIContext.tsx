// -------------------------------------------------------------
//  WorkflowUIContext.tsx   ← paste this AS‑IS
// -------------------------------------------------------------
import React, { createContext, useContext, useState, useCallback } from 'react';
import { WorkflowUIMode } from '../hooks/use-workflow-ui-mode';

// 1)  Context shape
interface WorkflowUIContextValue {
  uiMode: WorkflowUIMode;

  // derived state
  isOverlayVisible: boolean;
  activeTab: string | null;
  selectedElementId: string | null;
  editingSection: string | null;
  zoomLevel: number;

  // overlay / panel helpers
  showNodeTypesOverlay: () => void;
  hideNodeTypesOverlay: () => void;
  toggleNodeTypesOverlay: () => void;

  // tab helpers
  viewTab: (tab: string) => void;
  toggleTab: (tab: string) => void;

  // zoom / reset
  updateZoomLevel: (z: number) => void;
  resetToDefault: () => void;

  // selection
  handleElementSelection: (id: string | null) => void;

  // section‑editing helpers
  startEditingSection: (elementId: string, section: string) => void;
  finishEditingSection: () => void;
  isSectionBeingEdited: (section: string) => boolean;
  isAnySectionBeingEdited: (except?: string) => boolean;
}

// 2)  Create context
export const WorkflowUIContext = createContext<WorkflowUIContextValue | null>(null);

// 3)  Provider – this now contains the ENTIRE old logic
export const WorkflowUIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // ---------- shared state ----------
  const [uiMode, setUIMode] = useState<WorkflowUIMode>({ type: 'DEFAULT' });
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // derived calculations
  const isOverlayVisible  = uiMode.type === 'ADDING_NODE';
  const activeTab         = uiMode.type === 'VIEWING_TAB' ? uiMode.tab : null;
  const selectedElementId = uiMode.type === 'CONFIGURING'   ? uiMode.elementId : null;
  const editingSection    = uiMode.type === 'CONFIGURING'   ? uiMode.section   : null; // Can be undefined if just selecting

  // ---------- overlay ----------
  const showNodeTypesOverlay = useCallback(() => setUIMode({ type: 'ADDING_NODE' }), []);
  const hideNodeTypesOverlay = useCallback(
    () => uiMode.type === 'ADDING_NODE' && setUIMode({ type: 'DEFAULT' }),
    [uiMode]
  );
  const toggleNodeTypesOverlay = useCallback(
    () => setUIMode(prev => (prev.type === 'ADDING_NODE' ? { type: 'DEFAULT' } : { type: 'ADDING_NODE' })),
    []
  );

  // ---------- tabs ----------
  const viewTab = useCallback((tab: string) => setUIMode({ type: 'VIEWING_TAB', tab }), []);
  const toggleTab = useCallback(
    (tab: string) =>
      setUIMode(prev =>
        prev.type === 'VIEWING_TAB' && prev.tab === tab ? { type: 'DEFAULT' } : { type: 'VIEWING_TAB', tab }
      ),
    []
  );

  // ---------- selection ----------
  const handleElementSelection = useCallback(
    (elementId: string | null) => {
      setUIMode(prev => {
        if (elementId) return { type: 'CONFIGURING', elementId };          // select
        if (prev.type === 'CONFIGURING') return { type: 'DEFAULT' };       // deselect
        return prev;                                                       // leave other modes alone
      });
    },
    []
  );

  // ---------- zoom ----------
  const updateZoomLevel = useCallback((z: number) => setZoomLevel(z), []);

  // ---------- reset ----------
  const resetToDefault = useCallback(() => setUIMode({ type: 'DEFAULT' }), []);

  // ---------- section editing ----------
  const startEditingSection = useCallback(
    (elementId: string, section: string) => setUIMode({ type: 'CONFIGURING', elementId, section }),
    []
  );

  const finishEditingSection = useCallback(() => {
    setUIMode(prev =>
      prev.type === 'CONFIGURING' && prev.section ? { type: 'CONFIGURING', elementId: prev.elementId } : prev
    );
  }, []);

  const isSectionBeingEdited = useCallback(
    (section: string) => uiMode.type === 'CONFIGURING' && uiMode.section === section,
    [uiMode]
  );

  const isAnySectionBeingEdited = useCallback(
    (except?: string) =>
      uiMode.type === 'CONFIGURING' && !!uiMode.section && (!except || uiMode.section !== except),
    [uiMode]
  );

  // ---------- value ----------
const value: WorkflowUIContextValue = {
    uiMode,
    zoomLevel,

    // derived
    isOverlayVisible,
    activeTab,
    selectedElementId,
    editingSection: editingSection ?? null, // Ensure it's null, not undefined
  
    // overlay helpers
    showNodeTypesOverlay,
    hideNodeTypesOverlay,
    toggleNodeTypesOverlay,
  
    // tab helpers
    viewTab,
    toggleTab,
  
    // zoom / reset
    updateZoomLevel,
    resetToDefault,
  
    // selection
    handleElementSelection,
  
    // section editing
    startEditingSection,
    finishEditingSection,
    isSectionBeingEdited,
    isAnySectionBeingEdited,
  };
  
  return (
    <WorkflowUIContext.Provider value={value}>
      {children}
    </WorkflowUIContext.Provider>
  );
  };   // <-- this closes the WorkflowUIProvider component
  //----------------------------------------------------------
  //  (no code after this point except the optional hook)
  export const useWorkflowUI = () => {
    const ctx = useContext(WorkflowUIContext);
    if (!ctx) throw new Error('useWorkflowUI must be inside <WorkflowUIProvider>');
    return ctx;
  };
  
