import React, { useState } from 'react';
import { Pencil, Trash2, AlertTriangle } from 'lucide-react';
import { SchemaTable, SchemaColumn } from '../types';
import { useTableTabsView, TabType } from '../hooks/use-table-tabs-view';
import { TabNavigator, FieldsTab, RelationshipsTab, DataTab } from './tabs';

interface TableDetailsProps {
  table: SchemaTable | null;
  tables: SchemaTable[]; // Added for RelationshipsTab
  onUpdateTable?: (updates: Partial<SchemaTable>) => void;
  onDeleteTable?: () => void;
  onSelectField?: (fieldName: string | null) => void;
  onAddField?: () => void;
  onDeleteField?: (fieldName: string) => void; // Added for FieldsTab
  selectedField?: string | null;
  isLoading?: boolean;
  error?: Error | null;
  onUpdateField?: (fieldName: string, updates: Partial<SchemaColumn>) => Promise<void>; // Added for FieldDetail
  currentField?: SchemaColumn | null; // Added for FieldDetail
}

export function TableDetails({
  table,
  tables,
  onUpdateTable,
  onDeleteTable,
  onSelectField,
  onAddField,
  onDeleteField,
  selectedField = null,
  isLoading = false,
  error = null,
  onUpdateField,
  currentField
}: TableDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // State for delete confirmation modal
  
  // Tab management
  const { activeTab, switchTab } = useTableTabsView();

  // Calculate incoming relationships to check if deletion is safe
  const hasIncomingRelationships = tables
    .filter(t => t.name !== table?.name)
    .some(t => 
      (t.foreignKeys || []).some(fk => fk.references.table === table?.name)
    );

  // Start editing table details
  const handleStartEdit = () => {
    if (table) {
      setEditedName(table.name);
      setEditedDescription(table.description || '');
      setIsEditing(true);
    }
  };

  // Save edited table details
  const handleSaveEdit = () => {
    if (onUpdateTable && editedName.trim()) {
      onUpdateTable({
        name: editedName.trim(),
        description: editedDescription.trim() || undefined
      });
    }
    setIsEditing(false);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  // Initiate delete process
  const handleDeleteClick = () => {
    if (!hasIncomingRelationships && onDeleteTable) {
      setShowDeleteConfirm(true);
    }
  };

  // Confirm deletion
  const handleConfirmDelete = () => {
    if (onDeleteTable) {
      onDeleteTable();
    }
    setShowDeleteConfirm(false);
  };

  // Cancel deletion
  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  if (isLoading) {
    return (
      <div className="flex-1 p-6 bg-white">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          {/* Simulate tab loading */}
          <div className="h-10 bg-gray-200 rounded w-full mb-6"></div> 
          <div className="h-12 bg-gray-200 rounded mb-2"></div>
          <div className="h-12 bg-gray-200 rounded mb-2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    // Display error above tabs or within each tab?
    // For now, display it prominently at the top.
    return (
      <div className="flex-1 p-6 bg-white">
        <div className="p-4 bg-red-50 text-red-700 rounded-md mb-4">
          Error: {error.message}
        </div>
        {/* Still show placeholder if no table selected */}
        {!table && (
          <div className="text-gray-500 text-center">
            <p className="mb-2">Select a table to view details</p>
            <p className="text-sm">Or create a new table to get started</p>
          </div>
        )}
      </div>
    );
  }

  if (!table) {
    return (
      <div className="flex-1 p-6 bg-white flex items-center justify-center">
        <div className="text-gray-500 text-center">
          <p className="mb-2">Select a table to view details</p>
          <p className="text-sm">Or create a new table to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto bg-gray-50 flex flex-col relative"> {/* Added relative positioning for modal */}
      {/* Table Header & Edit Section & Tabs */}
      <div className="border-b bg-white flex-shrink-0">
        {isEditing ? (
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Table Name (Identifier)
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                placeholder="table_name"
              />
              <p className="text-xs text-gray-500 mt-1">
                Use snake_case for table names
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (Optional)
              </label>
              <textarea
                className="w-full p-2 border rounded-md"
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                placeholder="Describe the purpose of this table"
                rows={2}
              />
            </div>

            <div className="flex justify-between items-center"> {/* Align buttons */}
              {/* Delete Button (in edit mode) */}
              <button
                type="button" // Prevent form submission
                onClick={handleDeleteClick}
                className={`px-3 py-1 border rounded-md transition-colors text-sm ${ 
                  hasIncomingRelationships
                    ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                    : 'border-red-500 text-red-600 hover:bg-red-50'
                }`}
                disabled={hasIncomingRelationships}
                title={hasIncomingRelationships ? "Cannot delete table with incoming relationships" : "Delete table"}
              >
                <Trash2 size={14} className="inline mr-1 mb-0.5" />
                Delete Table
              </button>

              {/* Save and Cancel Buttons */}
              <div className="flex space-x-2">
                <button
                  type="button" // Explicitly set type
                  className="px-4 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                  onClick={handleSaveEdit}
                >
                  Save Changes
                </button>
                <button
                  type="button" // Explicitly set type
                  className="px-4 py-1.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : (
          // Regular Header View
          <div className="flex justify-between items-end">
            {/* Left side: Title, Description, Actions */}
            <div className="flex-1 mr-4 p-6">
              {/* Revert to items-center and see if it looks better now icon is smaller */}
              <div className="flex items-center space-x-1"> 
                <h2 className="text-2xl font-semibold text-gray-800">
                  {table.displayName} 
                  <span className="text-base font-normal text-gray-500 ml-2">
                    ({table.name})
                  </span>
                </h2>
                {/* Edit Button */}
                <button
                  onClick={handleStartEdit}
                  className="text-gray-500 hover:text-blue-600 transition-colors p-1 relative top-0.5"
                  aria-label="Edit table details"
                  title="Edit table details"
                >
                  <Pencil size={12} />
                </button>
              </div>
              {table.description && (
                <p className="mt-2 text-gray-600 text-base">{table.description}</p>
              )}
            </div>
            
            {/* Right side: Tab Navigator */}
            <div className="flex-shrink-0 self-end"> {/* Align tabs to bottom */}
              <TabNavigator activeTab={activeTab} onTabChange={switchTab} />
            </div>
          </div>
        )}
      </div>

      {/* Tab Content Area */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'fields' && onSelectField && onAddField && onDeleteField && (
          <FieldsTab 
            table={table}
            selectedField={selectedField}
            onSelectField={onSelectField}
            onAddField={onAddField}
            onDeleteField={onDeleteField}
            onUpdateField={onUpdateField}
            currentField={currentField}
            tables={tables}
          />
        )}
        {activeTab === 'relationships' && (
          <RelationshipsTab 
            tables={tables} 
            currentTable={table} 
          />
        )}
        {activeTab === 'data' && (
          <DataTab />
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
            <div className="flex items-center mb-4">
              <AlertTriangle className="text-red-500 mr-3" size={24} />
              <h3 className="text-lg font-medium text-gray-800">Confirm Deletion</h3>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete the table "{table.displayName}" ({table.name})? 
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 