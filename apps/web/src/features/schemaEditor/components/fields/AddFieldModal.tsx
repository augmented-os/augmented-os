import React, { useState } from 'react';
import { X } from 'lucide-react';
import { SchemaColumn, SchemaTable } from '../../types';
import { FieldForm } from './FieldForm';

interface AddFieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddField: (field: SchemaColumn) => Promise<void>;
  tables: SchemaTable[];
  currentTable: string;
}

export function AddFieldModal({
  isOpen,
  onClose,
  onAddField,
  tables,
  currentTable
}: AddFieldModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  if (!isOpen) {
    return null;
  }

  const handleAddField = async (field: SchemaColumn) => {
    setIsSubmitting(true);
    setValidationErrors([]);

    try {
      await onAddField(field);
      onClose();
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      
      {/* Modal Content */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-auto z-10">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Add New Field to {tables.find(t => t.name === currentTable)?.displayName || currentTable}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
                disabled={isSubmitting}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <FieldForm
              isNewField={true}
              tables={tables}
              onSave={handleAddField}
              onCancel={onClose}
              loading={isSubmitting}
              validationErrors={validationErrors}
            />
          </div>
        </div>
      </div>
    </div>
  );
}