import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Schema, SchemaTable, SchemaColumn } from '../types';
import * as schemaService from '@/data/schemaService';

interface SchemaContextValue {
  schema: Schema | null; // Last saved state
  draftSchema: Schema | null; // Current working copy
  isInitialLoading: boolean; // Initial schema loading
  isMutating: boolean; // Only true during save operation
  isDirty: boolean; // True if draftSchema differs from schema
  error: Error | null;
  selectedTableName: string | null;
  selectedFieldName: string | null;
  
  // Schema operations
  loadSchema: (schemaId: string) => Promise<void>;
  saveSchema: () => Promise<void>;
  discardChanges: () => void; // New discard function
  
  // Table operations (now operate on draftSchema)
  selectTable: (tableName: string | null) => void;
  addTable: (table: SchemaTable) => void; // Changed to synchronous
  updateTable: (tableName: string, updates: Partial<SchemaTable>) => void; // Changed to synchronous
  removeTable: (tableName: string) => void; // Changed to synchronous
  
  // Field operations (now operate on draftSchema)
  selectField: (fieldName: string | null) => void;
  addField: (tableName: string, field: SchemaColumn) => void; // Changed to synchronous
  updateField: (tableName: string, fieldName: string, updates: Partial<SchemaColumn>) => void; // Changed to synchronous
  removeField: (tableName: string, fieldName: string) => void; // Changed to synchronous
}

const SchemaContext = createContext<SchemaContextValue | null>(null);

export function SchemaProvider({ children }: { children: React.ReactNode }) {
  const [schema, setSchema] = useState<Schema | null>(null); // Last saved state
  const [draftSchema, setDraftSchema] = useState<Schema | null>(null); // Working copy
  const [schemaId, setSchemaId] = useState<string | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [selectedTableName, setSelectedTableName] = useState<string | null>(null);
  const [selectedFieldName, setSelectedFieldName] = useState<string | null>(null);

  // Calculate isDirty by comparing schema and draftSchema
  // Using JSON.stringify for simplicity, consider a deep comparison library for complex objects
  const isDirty = useMemo(() => {
    if (!schema || !draftSchema) return false;
    return JSON.stringify(schema) !== JSON.stringify(draftSchema);
  }, [schema, draftSchema]);

  // Load schema - this only happens once at initialization
  const loadSchema = useCallback(async (id: string) => {
    if (isInitialLoading) return; // Prevent duplicate loads
    
    setIsInitialLoading(true);
    setError(null);
    
    try {
      const data = await schemaService.fetchSchemaById(id);
      setSchema(data);
      setDraftSchema(data); // Initialize draft with loaded data
      setSchemaId(id);
      
      // Auto-select first table if available
      if (data?.tables?.length && !selectedTableName) {
        setSelectedTableName(data.tables[0].name);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load schema'));
    } finally {
      setIsInitialLoading(false);
    }
  }, []);

  // Save schema: Push draftSchema changes to the backend
  const saveSchema = useCallback(async () => {
    if (!draftSchema || !schemaId || !isDirty) return; // Only save if dirty
    
    setIsMutating(true);
    setError(null); // Clear previous errors
    
    try {
      // Send the entire draft schema for update
      const updatedSchemaFromServer = await schemaService.updateSchema(schemaId, draftSchema);
      
      // Update both base and draft schema with the response from the server
      // (or just update base if server doesn't return the full updated object)
      setSchema(updatedSchemaFromServer); 
      setDraftSchema(updatedSchemaFromServer);
      
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to save schema'));
      // Do not revert draftSchema here, let the user decide to discard or retry
      throw err; // Re-throw for components if needed
    } finally {
      setIsMutating(false);
    }
  }, [draftSchema, schemaId, isDirty]); // Add isDirty dependency

  // Discard changes: Reset draftSchema to the last saved state
  const discardChanges = useCallback(() => {
    setDraftSchema(schema); // Reset draft to match saved schema
    setError(null); // Clear any save errors
  }, [schema]);

  // Table operations (Modify draftSchema ONLY)
  const selectTable = useCallback((tableName: string | null) => {
    // This is a pure UI state change, no loading indicators needed
    setSelectedTableName(tableName);
    setSelectedFieldName(null);
  }, []);

  const addTable = useCallback((table: SchemaTable) => {
    if (!draftSchema) return;
    
    // Update only draftSchema
    setDraftSchema(prev => prev ? {
      ...prev,
      tables: [...prev.tables, table]
    } : null);
    
    // Auto-select the newly added table
    setSelectedTableName(table.name);
    
  }, [draftSchema]); // Remove async, service call, isMutating, error handling

  const updateTable = useCallback((tableName: string, updates: Partial<SchemaTable>) => {
    if (!draftSchema) return;
    
    // Update only draftSchema
    setDraftSchema(prev => {
      if (!prev) return null;
      const updatedTables = prev.tables.map(table => 
        table.name === tableName ? { ...table, ...updates } : table
      );
      return { ...prev, tables: updatedTables };
    });

    // Update selected table name if it changed
    if (updates.name && selectedTableName === tableName) {
      setSelectedTableName(updates.name);
    }

  }, [draftSchema, selectedTableName]); // Remove async, service call, isMutating, error handling, revert logic

  const removeTable = useCallback((tableName: string) => {
    if (!draftSchema) return;
    
    let newSelectedTableName = selectedTableName;
    
    // Update only draftSchema
    setDraftSchema(prev => {
      if (!prev) return null;
      const updatedTables = prev.tables.filter(table => table.name !== tableName);
      
      // Update selected table if the removed one was selected
      if (selectedTableName === tableName) {
        newSelectedTableName = updatedTables.length > 0 ? updatedTables[0].name : null;
      }
      
      return { ...prev, tables: updatedTables };
    });

    // Update selected table name state *after* draft state update
    setSelectedTableName(newSelectedTableName);

  }, [draftSchema, selectedTableName]); // Remove async, service call, isMutating, error handling, revert logic

  // Field operations (Modify draftSchema ONLY)
  const selectField = useCallback((fieldName: string | null) => {
    // Pure UI state change, no loading indicators
    setSelectedFieldName(fieldName);
  }, []);

  const addField = useCallback((tableName: string, field: SchemaColumn) => {
    if (!draftSchema) return;

    // Update only draftSchema
    setDraftSchema(prev => {
      if (!prev) return null;
      const updatedTables = prev.tables.map(table => {
        if (table.name === tableName) {
          // Check for duplicate field name within the same table (basic validation)
          if (table.columns.some(col => col.name === field.name)) {
            // Optionally throw an error or handle duplicates here
            console.warn(`Duplicate field name "${field.name}" in table "${tableName}".`);
            // You might want to prevent the update or show an error
            return table; // Return original table if duplicate found
          }
          return {
            ...table,
            columns: [...table.columns, field]
          };
        }
        return table;
      });
      return { ...prev, tables: updatedTables };
    });

    // Auto-select the newly added field
    setSelectedFieldName(field.name);

  }, [draftSchema]); // Remove async, service call, isMutating, error handling, revert logic

  const updateField = useCallback((tableName: string, fieldName: string, updates: Partial<SchemaColumn>) => {
    if (!draftSchema) return;

    let newSelectedFieldName = selectedFieldName;

    // Update only draftSchema
    setDraftSchema(prev => {
      if (!prev) return null;
      const updatedTables = prev.tables.map(table => {
        if (table.name === tableName) {
          let originalFieldFound = false;
          const updatedColumns = table.columns.map(column => {
            if (column.name === fieldName) {
              originalFieldFound = true;
              // Check for name change conflicts (basic validation)
              if (updates.name && updates.name !== fieldName && table.columns.some(col => col.name === updates.name)) {
                console.warn(`Duplicate field name "${updates.name}" after update in table "${tableName}".`);
                return column; // Return original column if duplicate name would result
              }
              return { ...column, ...updates };
            }
            return column;
          });

          // If the original field wasn't found (e.g., due to race condition or stale state), return original table
          if (!originalFieldFound) {
             console.warn(`Field "${fieldName}" not found in table "${tableName}" during update.`);
             return table; 
          }
          
          return { ...table, columns: updatedColumns };
        }
        return table;
      });

      // Update selected field if name changed
      if (updates.name && selectedFieldName === fieldName) {
        newSelectedFieldName = updates.name;
      }
      
      return { ...prev, tables: updatedTables };
    });
    
    // Update selected field name state *after* draft state update
    setSelectedFieldName(newSelectedFieldName);

  }, [draftSchema, selectedFieldName]); // Remove async, service call, isMutating, error handling, revert logic

  const removeField = useCallback((tableName: string, fieldName: string) => {
    if (!draftSchema) return;

    let newSelectedFieldName = selectedFieldName;

    // Update only draftSchema
    setDraftSchema(prev => {
      if (!prev) return null;
      const updatedTables = prev.tables.map(table => {
        if (table.name === tableName) {
          const originalColumns = table.columns;
          const updatedColumns = originalColumns.filter(column => column.name !== fieldName);
          
          // If no columns were removed, maybe the field didn't exist
          if (originalColumns.length === updatedColumns.length) {
             console.warn(`Field "${fieldName}" not found in table "${tableName}" during removal.`);
             return table;
          }
          
          return { ...table, columns: updatedColumns };
        }
        return table;
      });

      // Clear selected field if it was removed and selected
      if (selectedTableName === tableName && selectedFieldName === fieldName) {
         newSelectedFieldName = null;
      }
      
      return { ...prev, tables: updatedTables };
    });

    // Update selected field name state *after* draft state update
    setSelectedFieldName(newSelectedFieldName);

  }, [draftSchema, selectedTableName, selectedFieldName]); // Remove async, service call, isMutating, error handling, revert logic

  const contextValue: SchemaContextValue = {
    schema,
    draftSchema, // Expose draftSchema
    isInitialLoading,
    isMutating,
    isDirty, // Expose isDirty
    error,
    selectedTableName,
    selectedFieldName,
    loadSchema,
    saveSchema,
    discardChanges, // Expose discardChanges
    selectTable,
    addTable,
    updateTable,
    removeTable,
    selectField,
    addField,
    updateField,
    removeField
  };

  return (
    <SchemaContext.Provider value={contextValue}>
      {children}
    </SchemaContext.Provider>
  );
}

export function useSchema() {
  const context = useContext(SchemaContext);
  if (!context) {
    throw new Error('useSchema must be used within a SchemaProvider');
  }
  return context;
} 