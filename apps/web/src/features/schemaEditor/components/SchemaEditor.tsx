import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { SchemaHeader } from './SchemaHeader';
import { TablesList } from './TablesList';
import { TableDetails } from './TableDetails';
import { AddFieldModal } from './fields/AddFieldModal';
import { SchemaProvider, useSchema } from '../context/SchemaContext';
import { useSchemaTablesView } from '../hooks/use-schema-tables-view';
import { useTableFieldsView } from '../hooks/use-table-fields-view';
import { SchemaSummary } from '../types';

// Constants for TablesList width persistence
const SCHEMA_EDITOR_TABLES_LIST_DEFAULT_WIDTH = 280;
const SCHEMA_EDITOR_TABLES_LIST_MIN_WIDTH = 150;
const SCHEMA_EDITOR_TABLES_LIST_MAX_WIDTH = 800;
const SCHEMA_EDITOR_TABLES_LIST_WIDTH_KEY = 'schemaEditorTablesListWidth';

interface SchemaEditorProps {
  schemaId: string;
  allSchemas?: SchemaSummary[];
  onSave?: () => void;
  onCancel?: () => void;
}

// Internal component using hooks
function SchemaEditorContent({ 
  schemaId,
  allSchemas = [],
  onSave: onSaveProp, 
  onCancel: onCancelProp 
}: { 
  schemaId: string, 
  allSchemas?: SchemaSummary[], 
  onSave?: () => void, 
  onCancel?: () => void 
}) {
  const navigate = useNavigate();
  const { 
    loadSchema, 
    isInitialLoading, 
    error: schemaError, 
    isDirty, 
    isMutating: isSaving,
    saveSchema, 
    discardChanges,
    updateTable,
    removeTable,
    selectField,
    addField,
  } = useSchema();

  const { 
    tables, 
    selectedTable, 
    selectTable,
  } = useSchemaTablesView();
  
  const {
    table: currentTable,
    fields,
    selectedField,
    currentField,
    addField: tableAddField,
    updateField,
    removeField
  } = useTableFieldsView();

  // Derive current schema name from allSchemas and schemaId
  const currentSchemaName = useMemo(() => 
    allSchemas.find(s => s.id === schemaId)?.name || 'Loading...', 
    [allSchemas, schemaId]
  );

  const [showAddField, setShowAddField] = useState(false);
  const [fieldError, setFieldError] = useState<Error | null>(null);

  // State for resizable TablesList - initialized with default
  const [tablesListWidth, setTablesListWidth] = useState(SCHEMA_EDITOR_TABLES_LIST_DEFAULT_WIDTH);
  const [isResizing, setIsResizing] = useState(false);
  const resizeHandleRef = useRef<HTMLDivElement>(null);
  const initialMouseXRef = useRef<number>(0);      // For delta calculation
  const initialWidthRef = useRef<number>(0);       // For delta calculation

  // --- useEffect for Initial TablesList Width from Local Storage ---
  useEffect(() => {
    const storedWidth = localStorage.getItem(SCHEMA_EDITOR_TABLES_LIST_WIDTH_KEY);
    if (storedWidth) {
      const parsedWidth = parseInt(storedWidth, 10);
      if (!isNaN(parsedWidth) && 
          parsedWidth >= SCHEMA_EDITOR_TABLES_LIST_MIN_WIDTH && 
          parsedWidth <= SCHEMA_EDITOR_TABLES_LIST_MAX_WIDTH) {
        setTablesListWidth(parsedWidth);
      }
    }
  }, []); // Empty dependency array: run only on mount

  // --- useEffect for Persisting TablesList Width to Local Storage ---
  useEffect(() => {
    // Don't save default during initial hydration if nothing was stored previously
    if (tablesListWidth !== SCHEMA_EDITOR_TABLES_LIST_DEFAULT_WIDTH || 
        localStorage.getItem(SCHEMA_EDITOR_TABLES_LIST_WIDTH_KEY)) {
       localStorage.setItem(SCHEMA_EDITOR_TABLES_LIST_WIDTH_KEY, String(tablesListWidth));
    }
  }, [tablesListWidth]);

  // Handle schema selection for dropdown
  const handleSchemaSelect = useCallback((newSchemaId: string) => {
    navigate(`/build/data/${newSchemaId}`);
  }, [navigate]);

  // Handle Add Field button click
  const handleAddFieldClick = () => {
    setShowAddField(true);
    setFieldError(null);
  };

  // Handle save
  const handleSave = useCallback(async () => {
    try {
      await saveSchema();
      if (onSaveProp) {
        onSaveProp();
      }
    } catch (error) {
      console.error('Error saving schema:', error);
    }
  }, [saveSchema, onSaveProp]);

  // Handle cancel/discard
  const handleDiscard = useCallback(() => {
    discardChanges();
    if (onCancelProp) {
      onCancelProp();
    }
  }, [discardChanges, onCancelProp]);

  // Combined error from schema context and local field operations
  const displayError = schemaError || fieldError;

  // --- Resize Handlers (Delta-based) ---
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    initialMouseXRef.current = e.clientX;
    initialWidthRef.current = tablesListWidth;
    // Prevent text selection during drag for a smoother experience
    document.body.style.userSelect = 'none';
  }, [tablesListWidth]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;
    const deltaX = e.clientX - initialMouseXRef.current;
    const newWidth = initialWidthRef.current + deltaX;
    // Apply constraints for min/max width (using the new constants)
    setTablesListWidth(Math.max(SCHEMA_EDITOR_TABLES_LIST_MIN_WIDTH, Math.min(newWidth, SCHEMA_EDITOR_TABLES_LIST_MAX_WIDTH)));
  }, [isResizing]); // No direct dependency on tablesListWidth here

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
    document.body.style.userSelect = ''; // Re-enable text selection
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  // --- Field operation wrappers with local error handling --- 
  const handleAddField = useCallback(async (field) => {
    setFieldError(null);
    try {
      tableAddField(field);
      setShowAddField(false);
    } catch (error) {
      console.error('Error adding field (draft):', error);
      setFieldError(error instanceof Error ? error : new Error('Failed to add field'));
    }
  }, [tableAddField]);

  const handleUpdateField = useCallback(async (fieldName, updates) => {
    setFieldError(null);
    try {
      return Promise.resolve(updateField(fieldName, updates));
    } catch (error) {
      console.error('Error updating field (draft):', error);
      setFieldError(error instanceof Error ? error : new Error('Failed to update field'));
      return Promise.reject(error);
    }
  }, [updateField]);

  const handleRemoveField = useCallback(async (fieldName) => {
    setFieldError(null);
    try {
      removeField(fieldName);
      selectField(null);
      return Promise.resolve();
    } catch (error) {
      console.error('Error removing field (draft):', error);
      setFieldError(error instanceof Error ? error : new Error('Failed to delete field'));
      return Promise.reject(error);
    }
  }, [removeField, selectField]);

  useEffect(() => {
    if (schemaId && !isInitialLoading) {
       loadSchema(schemaId);
    }
  }, [schemaId, loadSchema]);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <SchemaHeader
        title={currentSchemaName}
        onSave={handleSave}
        onDiscard={handleDiscard}
        isSaving={isSaving}
        isDirty={isDirty}
        allSchemas={allSchemas}
        currentSchemaId={schemaId}
        currentSchemaName={currentSchemaName}
        handleSchemaSelect={handleSchemaSelect}
      />
      
      {/* Display Global Error (e.g., save failed) */}
      {schemaError && (
         <div className="p-2 bg-red-100 text-red-800 text-center text-sm">
           Save Error: {schemaError.message}
         </div>
      )}

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar - Tables list */}
        <div style={{ width: `${tablesListWidth}px` }} className="flex-shrink-0 overflow-y-auto border-r border-gray-200 bg-white">
          <TablesList
            tables={tables}
            selectedTable={selectedTable}
            onSelectTable={selectTable}
            onAddTable={() => {/* TODO: Implement Add Table UI */}}
            isLoading={isInitialLoading}
          />
        </div>
        
        {/* Resize Handle */}
        <div
          ref={resizeHandleRef}
          onMouseDown={handleMouseDown} // This is where onMouseDown should be
          className="w-1.5 cursor-col-resize bg-gray-100 hover:bg-gray-300 active:bg-gray-400 transition-colors duration-200"
          style={{ flexShrink: 0 }} // Prevent handle from shrinking
        />
        
        {/* Main content area - Table details */}
        <div className="flex-1 overflow-auto">
          <TableDetails
            table={currentTable}
            tables={tables}
            onUpdateTable={currentTable ? (updates) => updateTable(currentTable.name, updates) : undefined}
            onDeleteTable={currentTable ? () => removeTable(currentTable.name) : undefined}
            onSelectField={selectField}
            onAddField={currentTable ? handleAddFieldClick : undefined}
            onDeleteField={currentTable ? handleRemoveField : undefined}
            selectedField={selectedField}
            isLoading={isInitialLoading && !currentTable}
            error={displayError}
            onUpdateField={handleUpdateField}
            currentField={currentField}
          />
        </div>
      </div>
      
      {/* Add Field Modal */}
      {showAddField && currentTable && (
        <AddFieldModal
          isOpen={showAddField}
          onClose={() => setShowAddField(false)}
          onAddField={handleAddField}
          tables={tables}
          currentTable={currentTable.name}
        />
      )}
    </div>
  );
}

// Wrapper component that provides the schema context
export function SchemaEditor({ schemaId, allSchemas = [], onSave, onCancel }: SchemaEditorProps) {
  return (
    <SchemaProvider>
      <SchemaEffectLoader schemaId={schemaId} />
      <SchemaEditorContent 
        schemaId={schemaId}
        allSchemas={allSchemas}
        onSave={onSave} 
        onCancel={onCancel} 
      />
    </SchemaProvider>
  );
}

// Helper component to load the schema once
function SchemaEffectLoader({ schemaId }: { schemaId: string }) {
  const { loadSchema, isInitialLoading } = useSchema();
  
  useEffect(() => {
    if (schemaId && !isInitialLoading) {
       loadSchema(schemaId);
    }
  }, [schemaId, loadSchema]);
  
  return null;
} 