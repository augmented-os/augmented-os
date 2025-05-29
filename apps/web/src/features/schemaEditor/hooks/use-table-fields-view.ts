import { useMemo } from 'react';
import { useSchema } from '../context/SchemaContext';

export function useTableFieldsView() {
  const { 
    draftSchema,
    isMutating,
    selectedTableName, 
    selectedFieldName,
    selectField,
    addField,
    updateField,
    removeField
  } = useSchema();

  // Get the current table and its fields from the draftSchema
  const currentTable = useMemo(() => 
    draftSchema?.tables.find(t => t.name === selectedTableName) || null, 
    [draftSchema, selectedTableName]
  );
  
  const fields = useMemo(() => 
    currentTable?.columns || [], 
    [currentTable]
  );
  
  const currentField = useMemo(() => 
    fields.find(f => f.name === selectedFieldName) || null, 
    [fields, selectedFieldName]
  );

  // Wrap operations to include the selected table.
  // These context functions are now synchronous.
  const wrappedAddField = (field) => {
    if (!selectedTableName) {
      console.error("Cannot add field: No table selected.");
      return; // Or throw error
    }
    // Context addField is now synchronous
    addField(selectedTableName, field);
  };

  const wrappedUpdateField = (fieldName, updates) => {
    if (!selectedTableName) {
      console.error("Cannot update field: No table selected.");
      return; // Or throw error
    }
    // Context updateField is now synchronous
    updateField(selectedTableName, fieldName, updates);
  };

  const wrappedRemoveField = (fieldName) => {
    if (!selectedTableName) {
      console.error("Cannot remove field: No table selected.");
      return; // Or throw error
    }
    // Context removeField is now synchronous
    removeField(selectedTableName, fieldName);
  };

  return {
    table: currentTable,
    fields,
    selectedField: selectedFieldName,
    currentField,
    isMutating,
    selectField,
    addField: wrappedAddField,
    updateField: wrappedUpdateField,
    removeField: wrappedRemoveField
  };
} 