import React, { useState, useEffect, ChangeEvent } from 'react';
import { SchemaColumn, SchemaTable } from '../../types';
import { useFieldTypes, FIELD_TYPES } from '../../hooks/use-field-types';
import { FieldTypeIcon } from '../icons/FieldTypeIcon';
import { ChevronDown, Pencil, Trash2 } from 'lucide-react';

interface FieldFormProps {
  field?: Partial<SchemaColumn>;
  tables?: SchemaTable[];
  isNewField?: boolean;
  onSave: (field: SchemaColumn) => void;
  onCancel: () => void;
  loading?: boolean;
  validationErrors?: string[];
}

export function FieldForm({
  field,
  tables = [],
  isNewField = false,
  onSave,
  onCancel,
  loading = false,
  validationErrors = []
}: FieldFormProps) {
  const { fieldTypes, getTypeIconName } = useFieldTypes();
  
  // Use a simple state for tracking changes
  const [hasChanges, setHasChanges] = useState(isNewField); // Always enable for new fields
  const [originalField, setOriginalField] = useState<Partial<SchemaColumn>>({});
  
  // Initialize form state with default values or existing field values
  const [formValues, setFormValues] = useState<Partial<SchemaColumn>>({
    name: '',
    displayName: '',
    type: FIELD_TYPES.TEXT,
    nullable: true,
    isPrimary: false,
    comment: '',
    reference: '',
    ...field
  });

  // Update form state and original values when field prop changes
  useEffect(() => {
    if (field) {
      // Set form values from props
      setFormValues({
        name: '',
        displayName: '',
        type: FIELD_TYPES.TEXT,
        nullable: true,
        isPrimary: false,
        comment: '',
        reference: '',
        ...field
      });
      
      // Store a clean copy of the original field
      setOriginalField({...field});
      
      // Reset change state (only new fields should start with changes)
      setHasChanges(isNewField);
    }
  }, [field, isNewField]);

  // Helper function to check if fields are different
  const isFieldChanged = (field1: Partial<SchemaColumn>, field2: Partial<SchemaColumn>): boolean => {
    // Keys to compare
    const keys: (keyof SchemaColumn)[] = [
      'name', 'displayName', 'type', 'nullable', 'isPrimary', 'comment', 
      'reference', 'length', 'precision', 'scale', 'array', 'default', 'required'
    ];
    
    // Compare each key
    for (const key of keys) {
      const val1 = field1[key];
      const val2 = field2[key];
      
      // Special case: empty strings and undefined are considered equal
      if ((val1 === '' && val2 === undefined) || (val1 === undefined && val2 === '')) {
        continue;
      }
      
      // Different values found
      if (val1 !== val2) {
        return true;
      }
    }
    
    return false;
  };

  // Handle form field changes
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    const newFormValues = {
      ...formValues,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : value
    };
    
    setFormValues(newFormValues);
    
    // Check if the form has changes
    if (!isNewField) {
      const changed = isFieldChanged(newFormValues, originalField);
      setHasChanges(changed);
    }
  };

  // Handle checkbox changes directly
  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    let newFormValues = {...formValues};
    
    // Special handling for nullable checkbox
    if (name === 'nullable') {
      newFormValues = {
        ...newFormValues,
        nullable: checked,
        required: !checked // Keep required in sync for backward compatibility
      };
    } else if (name === 'required') {
      newFormValues = {
        ...newFormValues,
        required: checked,
        nullable: !checked // Keep nullable in sync for backward compatibility
      };
    } else {
      newFormValues = {
        ...newFormValues,
        [name]: checked
      };
    }
    
    setFormValues(newFormValues);
    
    // Check if the form has changes
    if (!isNewField) {
      const changed = isFieldChanged(newFormValues, originalField);
      setHasChanges(changed);
    }
  };

  // Handle type selection change
  const handleTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value;
    
    const newFormValues = {
      ...formValues,
      type: newType,
      // Clear reference if changing away from Reference type
      reference: newType === FIELD_TYPES.REFERENCE ? formValues.reference : undefined
    };
    
    setFormValues(newFormValues);
    
    // Check if the form has changes
    if (!isNewField) {
      const changed = isFieldChanged(newFormValues, originalField);
      setHasChanges(changed);
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loading || (!hasChanges && !isNewField)) return;
    
    // Ensure all required properties are set
    const fieldToSave: SchemaColumn = {
      name: formValues.name || '',
      displayName: formValues.displayName || '',
      type: formValues.type || FIELD_TYPES.TEXT,
      nullable: formValues.nullable !== false, // Default to true if not set
      isPrimary: Boolean(formValues.isPrimary),
      comment: formValues.comment || undefined,
      reference: formValues.type === FIELD_TYPES.REFERENCE 
        ? formValues.reference 
        : undefined,
      // Copy over type-specific properties if they exist
      ...(formValues.length !== undefined && { length: formValues.length }),
      ...(formValues.precision !== undefined && { precision: formValues.precision }),
      ...(formValues.scale !== undefined && { scale: formValues.scale }),
      ...(formValues.array !== undefined && { array: formValues.array }),
      ...(formValues.withTimeZone !== undefined && { withTimeZone: formValues.withTimeZone }),
      ...(formValues.default !== undefined && { default: formValues.default }),
      // For backward compatibility
      required: formValues.nullable === false
    };
    
    onSave(fieldToSave);
  };

  // Get the selected type info
  const selectedType = fieldTypes.find(type => type.value === formValues.type);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title shown only for new fields and not inline mode */}
      {isNewField && (
        <h3 className="text-lg font-medium text-gray-900">
          Add New Field
        </h3>
      )}
      
      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md mb-4">
          <p className="text-sm font-medium text-red-800 mb-1">Please fix the following errors:</p>
          <ul className="text-xs text-red-700 list-disc pl-5">
            {validationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Row 1: Field Name | Description */}
      <div className="grid grid-cols-2 gap-4">
        {/* Field Name */}
        <div className="bg-gray-50 p-4 rounded-md">
          <h5 className="text-xs uppercase tracking-wider text-gray-500 mb-2">Field Name</h5>
          <input
            type="text"
            name="name"
            className={`w-full p-1 bg-transparent border-0 text-gray-900 font-medium focus:ring-0 focus:outline-none ${
              validationErrors.some(err => err.includes('name')) 
                ? 'border-red-300' 
                : ''
            }`}
            value={formValues.name || ''}
            onChange={handleChange}
            placeholder="Enter field name"
            disabled={!isNewField && Boolean(formValues.isPrimary)}
            required
          />
          
          {/* Required checkbox - moved from other location but kept */}
          <div className="flex items-center mt-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="required"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                checked={formValues.required === true || formValues.nullable === false}
                onChange={handleCheckboxChange}
                disabled={Boolean(formValues.isPrimary)}
              />
              <span className="ml-2 text-sm text-gray-700">Required</span>
            </label>
            
            {isNewField && (
              <label className="flex items-center ml-4">
                <input
                  type="checkbox"
                  name="isPrimary"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  checked={Boolean(formValues.isPrimary)}
                  onChange={handleCheckboxChange}
                  disabled={selectedType && !selectedType.canBePrimary}
                />
                <span className="ml-2 text-sm text-gray-700">Primary Key</span>
              </label>
            )}
          </div>
        </div>
        
        {/* Description Panel */}
        <div className="bg-gray-50 p-4 rounded-md">
          <h5 className="text-xs uppercase tracking-wider text-gray-500 mb-2">Description</h5>
          <textarea
            name="comment"
            className="w-full p-1 bg-transparent border-0 text-gray-900 focus:ring-0 focus:outline-none resize-none"
            value={formValues.comment || ''}
            onChange={handleChange}
            placeholder="Describe this field..."
            rows={2}
          />
        </div>
      </div>
      
      {/* Row 2: Data Type | Default Value */}
      <div className="grid grid-cols-2 gap-4">
        {/* Data Type */}
        <div className="bg-gray-50 p-4 rounded-md">
          <h5 className="text-xs uppercase tracking-wider text-gray-500 mb-2">Data Type</h5>
          <div className="relative">
            <select
              name="type"
              className="w-full p-1 pr-8 bg-transparent border-0 text-gray-900 font-medium focus:ring-0 focus:outline-none appearance-none"
              value={formValues.type}
              onChange={handleTypeChange}
              disabled={!isNewField && Boolean(formValues.isPrimary)}
              required
            >
              {fieldTypes.map(type => (
                <option 
                  key={type.value} 
                  value={type.value}
                  disabled={
                    (isNewField && formValues.isPrimary && !type.canBePrimary) ||
                    (!isNewField && Boolean(formValues.isPrimary) && type.value !== formValues.type)
                  }
                >
                  {type.label}
                </option>
              ))}
            </select>
            {/* Add dropdown chevron */}
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </div>
          </div>
          
          {/* Type-specific properties */}
          {formValues.type === FIELD_TYPES.REFERENCE && (
            <div className="mt-2 border-t border-gray-200 pt-2">
              <select
                name="reference"
                className="w-full p-1 pr-8 bg-transparent border-0 text-sm text-gray-600 focus:ring-0 focus:outline-none appearance-none"
                value={formValues.reference || ''}
                onChange={handleChange}
                required
              >
                <option value="">Select a table...</option>
                {tables.map(table => (
                  <option key={table.name} value={table.name}>
                    {table.displayName || table.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </div>
            </div>
          )}

          {formValues.type === FIELD_TYPES.VARCHAR && (
            <div className="mt-2 border-t border-gray-200 pt-2">
              <input
                type="number"
                name="length"
                className="w-full p-1 bg-transparent border-0 text-sm text-gray-600 focus:ring-0 focus:outline-none"
                value={formValues.length || ''}
                onChange={handleChange}
                placeholder="Length (e.g., 255)"
                min="1"
              />
            </div>
          )}
          
          {formValues.type === FIELD_TYPES.NUMERIC && (
            <div className="mt-2 border-t border-gray-200 pt-2 flex space-x-2">
              <input
                type="number"
                name="precision"
                className="w-1/2 p-1 bg-transparent border-0 text-sm text-gray-600 focus:ring-0 focus:outline-none"
                value={formValues.precision || ''}
                onChange={handleChange}
                placeholder="Precision"
                min="1"
              />
              <input
                type="number"
                name="scale"
                className="w-1/2 p-1 bg-transparent border-0 text-sm text-gray-600 focus:ring-0 focus:outline-none"
                value={formValues.scale || ''}
                onChange={handleChange}
                placeholder="Scale"
                min="0"
              />
            </div>
          )}
        </div>
        
        {/* Default Value Panel */}
        <div className="bg-gray-50 p-4 rounded-md">
          <h5 className="text-xs uppercase tracking-wider text-gray-500 mb-2">Default Value</h5>
          <input
            type="text"
            name="default"
            className="w-full p-1 bg-transparent border-0 text-gray-900 font-mono text-sm focus:ring-0 focus:outline-none"
            value={formValues.default || ''}
            onChange={handleChange}
            placeholder="Leave blank for no default"
          />
        </div>
      </div>
      
      {/* Row 3: Delete + Update buttons */}
      <div className="flex justify-end space-x-2 pt-2">
        <button
          type="button"
          className="bg-red-50 hover:bg-red-100 text-red-700 py-2 px-4 rounded-md flex items-center justify-center"
          onClick={onCancel}
          disabled={loading}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </button>
        <button
          type="submit"
          className={`bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 px-4 rounded-md flex items-center justify-center ${
            !hasChanges && !isNewField ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={loading || (!hasChanges && !isNewField)}
        >
          {loading ? (
            'Saving...'
          ) : (
            <>
              <Pencil className="w-4 h-4 mr-2" />
              {isNewField ? 'Add Field' : 'Update'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}