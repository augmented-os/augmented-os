import { useMemo } from 'react';
import { useSchema } from '../context/SchemaContext';

export function useSchemaTablesView() {
  const { 
    // schema, // No longer directly needed, use draftSchema
    draftSchema, // Use draftSchema for display
    isInitialLoading,
    isMutating, // Still needed for save operation status
    isDirty, // Pass through isDirty state
    error, 
    selectedTableName, 
    selectTable, 
    addTable, 
    updateTable, 
    removeTable,
    saveSchema,
    discardChanges // Pass through discardChanges function
  } = useSchema();

  // Compute derived state from draftSchema
  const tables = useMemo(() => draftSchema?.tables || [], [draftSchema]);

  return {
    tables, // Derived from draftSchema
    selectedTable: selectedTableName,
    isLoading: isInitialLoading, 
    isSaving: isMutating, // Rename isMutating to isSaving for clarity in components
    isDirty, // Expose isDirty
    error,
    selectTable,
    addTable, // Now operates on draft
    updateTable, // Now operates on draft
    removeTable, // Now operates on draft
    saveSchema, // The function to commit changes
    discardChanges // The function to revert changes
  };
} 