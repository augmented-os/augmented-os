import React from 'react';
import { Plus } from 'lucide-react';
import { SchemaTable, SchemaColumn } from '@/features/schemaEditor/types';
import { FieldsList } from '../fields/FieldsList';

interface FieldsTabProps {
  table: SchemaTable; // Should always have a table here
  selectedField: string | null;
  onSelectField: (fieldName: string | null) => void;
  onAddField: () => void;
  // Need onDeleteField prop based on original FieldsList usage
  onDeleteField: (fieldName: string) => void;
  // Added for inline field details
  onUpdateField?: (fieldName: string, updates: Partial<SchemaColumn>) => Promise<void> | void;
  currentField?: SchemaColumn | null;
  tables?: SchemaTable[]; // Add tables array
}

export function FieldsTab({ 
  table,
  selectedField,
  onSelectField,
  onAddField,
  onDeleteField,
  onUpdateField,
  currentField,
  tables = []
}: FieldsTabProps) {
  return (
    <div className="p-6">
      <div className="mb-4 flex justify-between items-center p-3 bg-gray-50 rounded-md">
        <h3 className="text-lg font-medium text-gray-700">Fields</h3>
        <button 
          className="bg-blue-600 text-white rounded-md px-3 py-1.5 text-sm flex items-center hover:bg-blue-700 transition-colors"
          onClick={onAddField}
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          Add Field
        </button>
      </div>
      
      <FieldsList
        tableId={table.name}
        columns={table.columns}
        selectedField={selectedField}
        onSelectField={onSelectField}
        onAddField={onAddField}
        onDeleteField={onDeleteField}
        onUpdateField={onUpdateField}
        currentField={currentField}
        tables={tables}
      />
    </div>
  );
} 