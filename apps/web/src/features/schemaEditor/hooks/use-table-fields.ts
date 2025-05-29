import { useState, useCallback, useMemo, useEffect } from 'react';
import { SchemaTable, SchemaColumn } from '../types';
import * as schemaService from '@/data/schemaService';

interface UseTableFieldsResult {
  // Data states
  columns: SchemaColumn[];
  selectedField: string | null;
  
  // Loading states
  isLoading: boolean;
  error: Error | null;
  
  // Field operations
  selectField: (fieldName: string | null) => void;
  addField: (field: SchemaColumn) => Promise<void>;
  updateField: (fieldName: string, updates: Partial<SchemaColumn>) => Promise<void>;
  removeField: (fieldName: string) => Promise<void>;
  validateField: (field: Partial<SchemaColumn>) => string[];
}

interface UseTableFieldsProps {
  schemaId: string | null;
  tableName: string | null;
  onTableUpdate?: (updatedTable: SchemaTable) => void;
}

/**
 * Hook for managing table fields/columns with CRUD operations
 * 
 * @param props Hook configuration
 * @returns Table fields state and operations
 */
export function useTableFields({
  schemaId,
  tableName,
  onTableUpdate
}: UseTableFieldsProps): UseTableFieldsResult {
  // State
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [localColumns, setLocalColumns] = useState<SchemaColumn[]>([]);
  
  // When tableName changes, we need to fetch the columns
  const columns = useMemo(() => {
    return localColumns;
  }, [localColumns]);
  
  // Select a field
  const selectField = useCallback((fieldName: string | null) => {
    setSelectedField(fieldName);
  }, []);
  
  // Validate a field definition
  const validateField = useCallback((field: Partial<SchemaColumn>): string[] => {
    const errors: string[] = [];
    
    // Check name
    if (!field.name) {
      errors.push('Field name is required');
    } else if (!/^[a-z][a-z0-9_]*$/.test(field.name)) {
      errors.push('Field name must start with a letter and contain only lowercase letters, numbers, and underscores');
    }
    
    // Check for duplicate names
    if (field.name && columns.some(c => c.name === field.name && c !== field)) {
      errors.push(`Field name "${field.name}" already exists in this table`);
    }
    
    // Check type
    if (!field.type) {
      errors.push('Field type is required');
    }
    
    // Check reference for reference type
    if (field.type === 'reference' && !field.reference) {
      errors.push('Reference field must specify a referenced table');
    }
    
    // Check type-specific properties
    if (field.length !== undefined && (field.length <= 0 || !Number.isInteger(field.length))) {
      errors.push('Length must be a positive integer');
    }
    
    if (field.precision !== undefined && (field.precision <= 0 || !Number.isInteger(field.precision))) {
      errors.push('Precision must be a positive integer');
    }
    
    if (field.scale !== undefined && (field.scale < 0 || !Number.isInteger(field.scale))) {
      errors.push('Scale must be a non-negative integer');
    }
    
    return errors;
  }, [columns]);
  
  // Add a new field to the table
  const addField = useCallback(async (field: SchemaColumn) => {
    if (!schemaId || !tableName) {
      throw new Error('No table selected');
    }
    
    // Validate the field
    const validationErrors = validateField(field);
    if (validationErrors.length > 0) {
      throw new Error(`Invalid field: ${validationErrors.join(', ')}`);
    }
    
    // For backward compatibility - set required based on nullable
    if (field.nullable === undefined && field.required !== undefined) {
      field.nullable = !field.required;
    } else if (field.nullable === undefined) {
      field.nullable = true; // Default to nullable
    }
    
    // Update required for backward compatibility
    field.required = !field.nullable;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedSchema = await schemaService.addColumn(schemaId, tableName, field);
      
      // Find the updated table
      const updatedTable = updatedSchema.tables.find(t => t.name === tableName);
      if (!updatedTable) {
        throw new Error(`Table ${tableName} not found in updated schema`);
      }
      
      // Update local state
      setLocalColumns(updatedTable.columns || []);
      
      // Notify parent component
      if (onTableUpdate) {
        onTableUpdate(updatedTable);
      }
      
      // Select the newly added field
      setSelectedField(field.name);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to add field'));
      console.error('Error adding field:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [schemaId, tableName, onTableUpdate, validateField]);
  
  // Update an existing field
  const updateField = useCallback(async (fieldName: string, updates: Partial<SchemaColumn>) => {
    if (!schemaId || !tableName) {
      throw new Error('No table selected');
    }
    
    // Validate the updated field
    const currentField = columns.find(c => c.name === fieldName);
    if (!currentField) {
      throw new Error(`Field ${fieldName} not found`);
    }
    
    const updatedField = { ...currentField, ...updates };
    const validationErrors = validateField(updatedField);
    if (validationErrors.length > 0) {
      throw new Error(`Invalid field: ${validationErrors.join(', ')}`);
    }
    
    // Handle nullable/required synchronization
    if (updates.nullable !== undefined && updates.required === undefined) {
      updates.required = !updates.nullable;
    } else if (updates.required !== undefined && updates.nullable === undefined) {
      updates.nullable = !updates.required;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedSchema = await schemaService.updateColumn(
        schemaId,
        tableName,
        fieldName,
        updates
      );
      
      // Find the updated table
      const updatedTable = updatedSchema.tables.find(t => t.name === tableName);
      if (!updatedTable) {
        throw new Error(`Table ${tableName} not found in updated schema`);
      }
      
      // Update local state
      setLocalColumns(updatedTable.columns || []);
      
      // If the field name was updated, update the selected field
      if (updates.name && fieldName !== updates.name && selectedField === fieldName) {
        setSelectedField(updates.name);
      }
      
      // Notify parent component
      if (onTableUpdate) {
        onTableUpdate(updatedTable);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update field'));
      console.error('Error updating field:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [schemaId, tableName, columns, selectedField, onTableUpdate, validateField]);
  
  // Remove a field
  const removeField = useCallback(async (fieldName: string) => {
    if (!schemaId || !tableName) {
      throw new Error('No table selected');
    }
    
    // Don't allow deleting primary key
    const field = columns.find(c => c.name === fieldName);
    if (field?.isPrimary) {
      throw new Error('Cannot delete primary key field');
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedSchema = await schemaService.removeColumn(
        schemaId,
        tableName,
        fieldName
      );
      
      // Find the updated table
      const updatedTable = updatedSchema.tables.find(t => t.name === tableName);
      if (!updatedTable) {
        throw new Error(`Table ${tableName} not found in updated schema`);
      }
      
      // Update local state
      setLocalColumns(updatedTable.columns || []);
      
      // If the removed field was selected, clear selection
      if (selectedField === fieldName) {
        setSelectedField(null);
      }
      
      // Notify parent component
      if (onTableUpdate) {
        onTableUpdate(updatedTable);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to remove field'));
      console.error('Error removing field:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [schemaId, tableName, columns, selectedField, onTableUpdate]);
  
  // Initialize columns when tableName changes
  useEffect(() => {
    if (schemaId && tableName) {
      setIsLoading(true);
      schemaService.fetchSchemaById(schemaId)
        .then(schema => {
          const table = schema.tables.find(t => t.name === tableName);
          if (table) {
            setLocalColumns(table.columns || []);
          } else {
            setLocalColumns([]);
          }
        })
        .catch(err => {
          setError(err instanceof Error ? err : new Error('Failed to fetch table fields'));
          console.error('Error fetching table fields:', err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setLocalColumns([]);
    }
  }, [schemaId, tableName]);
  
  return {
    columns,
    selectedField,
    isLoading,
    error,
    selectField,
    addField,
    updateField,
    removeField,
    validateField
  };
} 