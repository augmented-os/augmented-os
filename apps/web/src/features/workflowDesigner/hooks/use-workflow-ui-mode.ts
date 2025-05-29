// hooks/use-workflow-ui-mode.ts
// --------------------------------------------------------
// 1.  Keep the type, so other files can import it
export type WorkflowUIMode =
  | { type: 'DEFAULT' }
  | { type: 'ADDING_NODE' }
  | { type: 'CONFIGURING'; elementId: string; section?: string }
  | { type: 'VIEWING_TAB'; tab: string };

// 2.  The hook now just grabs the shared state from context
import { useContext } from 'react';
import { WorkflowUIContext } from '../contexts/WorkflowUIContext';

export function useWorkflowUIMode() {
  const ctx = useContext(WorkflowUIContext);
  if (!ctx) {
    throw new Error('useWorkflowUIMode must be used inside <WorkflowUIProvider>');
  }
  return ctx;  // ctx already contains uiMode and all helper functions
}
