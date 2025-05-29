import React from 'react';
import { Table2, Plus } from 'lucide-react';
import { SchemaTable } from '../types';

interface TablesListProps {
  tables: SchemaTable[];
  selectedTable: string | null;
  onSelectTable: (tableName: string) => void;
  onAddTable?: () => void;
  isLoading?: boolean;
}

export function TablesList({ 
  tables, 
  selectedTable, 
  onSelectTable,
  onAddTable,
  isLoading = false
}: TablesListProps) {
  if (isLoading) {
    return (
      <div className="w-full border-r bg-white shadow-sm overflow-auto p-4">
        <div className="animate-pulse">
          <div className="h-5 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-12 bg-gray-200 rounded mb-2"></div>
          <div className="h-12 bg-gray-200 rounded mb-2"></div>
          <div className="h-12 bg-gray-200 rounded mb-2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full border-r bg-white shadow-sm overflow-auto">
      <div className="p-4 border-b">
        <h2 className="font-medium text-gray-700">Tables</h2>
      </div>
      
      <div className="p-2">
        {tables.map(table => (
          <div 
            key={table.name}
            className={`rounded-md mb-2 cursor-pointer transition-colors ${
              selectedTable === table.name 
                ? 'bg-blue-50 border-l-4 border-blue-500' 
                : 'hover:bg-gray-100 border-l-4 border-transparent'
            }`}
            onClick={() => onSelectTable(table.name)}
          >
            <div className="p-3">
              <div className="flex items-center">
                <Table2 className={`w-4 h-4 mr-2 ${
                  selectedTable === table.name ? 'text-blue-600' : 'text-gray-500'
                }`} />
                <div>
                  <div className="font-medium">{table.displayName}</div>
                  {table.description && (
                    <div className="text-xs text-gray-500 mt-1">{table.description}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {onAddTable && (
          <button 
            className="w-full mt-2 p-2 border border-dashed rounded-md text-gray-500 hover:text-gray-700 hover:border-gray-400 flex items-center justify-center"
            onClick={onAddTable}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Table
          </button>
        )}
      </div>
    </div>
  );
} 