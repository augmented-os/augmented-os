import { useState, useCallback, useEffect } from 'react';
import { Schema, SchemaTable } from '../types';
import * as schemaService from '@/data/schemaService';

interface UseSchemaTablesResult {
  // Data states
  schema: Schema | null;
  tables: SchemaTable[];
  selectedTable: string | null;
  
  // Loading states
  isLoading: boolean;
  error: Error | null;
  
  // Actions
  fetchSchema: (id: string) => Promise<void>;
  selectTable: (tableName: string | null) => void;
  addTable: (table: SchemaTable) => Promise<void>;
  updateTable: (tableName: string, updates: Partial<SchemaTable>) => Promise<void>;
  removeTable: (tableName: string) => Promise<void>;
  saveSchema: () => Promise<void>;
}

/**
 * Hook for managing schema tables with CRUD operations
 * 
 * @param initialSchemaId Optional initial schema ID to load
 * @returns Schema tables state and operations
 */
export function useSchemaTablesData(initialSchemaId?: string): UseSchemaTablesResult {
  // State for the schema data
  const [schema, setSchema] = useState<Schema | null>(null);
  const [schemaId, setSchemaId] = useState<string | null>(initialSchemaId || null);
  
  // UI state
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  
  // Loading states
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // Computed values for convenience
  const tables = schema?.tables || [];
  
  // Fetch schema data from the service
  const fetchSchema = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const schemaData = await schemaService.fetchSchemaById(id);
      setSchema(schemaData);
      setSchemaId(id);
      
      // If we have tables and none is selected, select the first one
      if (schemaData?.tables?.length && !selectedTable) {
        setSelectedTable(schemaData.tables[0].name);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch schema'));
      console.error('Error fetching schema:', err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedTable]);
  
  // Load initial schema if ID is provided
  useEffect(() => {
    if (initialSchemaId) {
      fetchSchema(initialSchemaId);
    }
  }, [initialSchemaId, fetchSchema]);
  
  // Select a table
  const selectTable = useCallback((tableName: string | null) => {
    setSelectedTable(tableName);
  }, []);
  
  // Add a new table
  const addTable = useCallback(async (table: SchemaTable) => {
    if (!schemaId) {
      throw new Error('No schema selected');
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedSchema = await schemaService.addTable(schemaId, table);
      setSchema(updatedSchema);
      
      // Automatically select the newly added table
      setSelectedTable(table.name);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to add table'));
      console.error('Error adding table:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [schemaId]);
  
  // Update an existing table
  const updateTable = useCallback(async (tableName: string, updates: Partial<SchemaTable>) => {
    if (!schemaId) {
      throw new Error('No schema selected');
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedSchema = await schemaService.updateTable(schemaId, tableName, updates);
      setSchema(updatedSchema);
      
      // If the table name was updated, update the selected table
      if (updates.name && tableName !== updates.name && selectedTable === tableName) {
        setSelectedTable(updates.name);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update table'));
      console.error('Error updating table:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [schemaId, selectedTable]);
  
  // Remove a table
  const removeTable = useCallback(async (tableName: string) => {
    if (!schemaId) {
      throw new Error('No schema selected');
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedSchema = await schemaService.removeTable(schemaId, tableName);
      setSchema(updatedSchema);
      
      // If the removed table was selected, select another one or null
      if (selectedTable === tableName) {
        const remainingTables = updatedSchema.tables || [];
        setSelectedTable(remainingTables.length > 0 ? remainingTables[0].name : null);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to remove table'));
      console.error('Error removing table:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [schemaId, selectedTable]);
  
  // Save the entire schema
  const saveSchema = useCallback(async () => {
    if (!schemaId || !schema) {
      throw new Error('No schema selected');
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      await schemaService.updateSchema(schemaId, { 
        tables: schema.tables
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to save schema'));
      console.error('Error saving schema:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [schema, schemaId]);
  
  return {
    schema,
    tables,
    selectedTable,
    isLoading,
    error,
    fetchSchema,
    selectTable,
    addTable,
    updateTable,
    removeTable,
    saveSchema
  };
} 