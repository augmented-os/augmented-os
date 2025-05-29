import React, { useState } from 'react';
import { Plus, Trash2, Pencil } from 'lucide-react';
import { SchemaColumn, SchemaTable } from '../../types';
import { FieldTypeIcon } from '../icons/FieldTypeIcon';
import { useFieldTypes } from '../../hooks/use-field-types';
import { FieldForm } from './FieldForm';

interface FieldsListProps {
  tableId: string;
  columns: SchemaColumn[];
  selectedField?: string | null;
  onSelectField?: (fieldName: string | null) => void;
  onAddField?: () => void;
  onDeleteField?: (fieldName: string) => void;
  isLoading?: boolean;
  onUpdateField?: (fieldName: string, updates: Partial<SchemaColumn>) => Promise<void> | void;
  currentField?: SchemaColumn | null;
  tables?: SchemaTable[];
}

export function FieldsList({
  tableId,
  columns,
  selectedField = null,
  onSelectField,
  onAddField,
  onDeleteField,
  isLoading = false,
  onUpdateField,
  currentField,
  tables = []
}: FieldsListProps) {
  const { getTypeIconName } = useFieldTypes();
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Function to handle the save action from FieldForm
  const handleSaveField = async (updatedField: SchemaColumn) => {
    if (!onUpdateField || !currentField) return;
    
    setValidationErrors([]);
    
    try {
      // Handle both Promise and non-Promise return types
      const result = onUpdateField(currentField.name, updatedField);
      if (result instanceof Promise) {
        await result;
      }
    } catch (err) {
      // Handle validation errors
      if (err instanceof Error) {
        const message = err.message;
        if (message.includes('Invalid field:')) {
          // Extract validation errors from the message
          const errorDetails = message.replace('Invalid field:', '').trim();
          setValidationErrors(errorDetails.split(', '));
        } else {
          setValidationErrors([message]);
        }
      } else {
        setValidationErrors(['An unknown error occurred']);
      }
    }
  };

  // Function to handle delete field action
  const handleDeleteField = () => {
    if (!onDeleteField || !currentField) return;
    
    if (window.confirm(`Are you sure you want to delete the field "${currentField.displayName || currentField.name}"?`)) {
      try {
        onDeleteField(currentField.name);
        if (onSelectField) {
          onSelectField(null); // Close the detail section
        }
      } catch (err) {
        if (err instanceof Error) {
          setValidationErrors([err.message]);
        } else {
          setValidationErrors(['Failed to delete field']);
        }
      }
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="h-10 bg-gray-200 rounded mb-2"></div>
        <div className="h-10 bg-gray-200 rounded mb-2"></div>
        <div className="h-10 bg-gray-200 rounded mb-2"></div>
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-md shadow-sm overflow-hidden">
      {/* Table header */}
      <div className="bg-gray-50 border-b px-6 py-3 grid grid-cols-12 gap-4">
        <div className="col-span-4 font-medium text-gray-700">Field</div>
        <div className="col-span-2 font-medium text-gray-700">Type</div>
        <div className="col-span-6 font-medium text-gray-700">Description</div>
      </div>
      
      {/* Fields list */}
      <div>
        {columns.map((column) => (
          <React.Fragment key={column.name}>
            <div
              className={`border-b px-6 py-4 grid grid-cols-12 gap-4 cursor-pointer ${
                selectedField === column.name ? 'bg-blue-50' : 'hover:bg-gray-50'
              } ${column.isPrimary ? 'bg-gray-50' : ''}`}
              onClick={() => {
                if (onSelectField) {
                  if (selectedField === column.name) {
                    onSelectField(null);
                  } else {
                    onSelectField(column.name);
                  }
                }
              }}
            >
              {/* Field name */}
              <div className="col-span-4 flex items-center min-w-0">
                <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-md mr-2 flex-shrink-0">
                  <FieldTypeIcon 
                    iconName={getTypeIconName(column.type)} 
                    className={column.isPrimary ? 'text-blue-600' : ''}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center flex-wrap gap-1">
                    <span className="font-medium overflow-ellipsis overflow-hidden whitespace-nowrap">{column.displayName || column.name}</span>
                    {column.isPrimary && (
                      <span className="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full text-xs whitespace-nowrap flex-shrink-0">
                        Primary
                      </span>
                    )}
                    {column.required && !column.isPrimary && (
                      <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full text-xs whitespace-nowrap flex-shrink-0">
                        Required
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Type info */}
              <div className="col-span-2 flex items-center min-w-0">
                <span className="text-gray-600 overflow-ellipsis overflow-hidden whitespace-nowrap">{column.type}</span>
                {column.type === 'Reference' && column.reference && (
                  <span className="ml-1 text-gray-500 text-xs whitespace-nowrap flex-shrink-0">→ {column.reference}</span>
                )}
              </div>
              
              {/* Description */}
              <div className="col-span-6 flex items-center min-w-0">
                <span className="text-gray-700 overflow-ellipsis overflow-hidden">{column.comment}</span>
              </div>
            </div>
            
            {/* Expanded Field Form (showing editing directly when selected) */}
            {selectedField === column.name && currentField && onUpdateField && onDeleteField && (
              <div className="bg-gray-50 border-b">
                <div className="p-6 bg-white overflow-y-auto border-t">
                  <FieldForm
                    field={currentField}
                    tables={tables}
                    isNewField={false}
                    onSave={handleSaveField}
                    onCancel={handleDeleteField}
                    validationErrors={validationErrors}
                  />
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
      
      {/* Add field button */}
      {onAddField && (
        <div className="p-4 border-t">
          <button
            className="w-full p-2 border border-dashed rounded-md text-gray-500 hover:text-gray-700 hover:border-gray-400 flex items-center justify-center"
            onClick={onAddField}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Field
          </button>
        </div>
      )}
    </div>
  );
} 