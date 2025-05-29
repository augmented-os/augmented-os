import React, { useState, useCallback } from 'react';
import { SchemaField } from '@/types/workflow';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Trash2, PlusCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface SchemaEditorProps {
  schema: SchemaField[];
  onChange: (newSchema: SchemaField[]) => void;
  title?: string;
  description?: string;
}

// Update available data types based on SchemaField definition
const DATA_TYPES: SchemaField['dataType'][] = ['string', 'number', 'boolean', 'object', 'array', 'uuid'];

// Helper function to convert string to camelCase
const toCamelCase = (str: string): string => {
  // Remove leading/trailing spaces, handle empty string
  const cleaned = str.trim();
  if (!cleaned) return '';
  
  // Replace non-alphanumeric characters (keep spaces for now), convert to lowercase
  const temp = cleaned.replace(/[^a-zA-Z0-9\s]/g, '').toLowerCase();

  // Split by spaces and capitalize subsequent words
  const words = temp.split(' ').filter(Boolean); // filter(Boolean) removes empty strings from multiple spaces
  if (words.length === 0) return '';

  return words.map((word, index) => {
    if (index === 0) {
      return word; // First word stays lowercase
    }
    return word.charAt(0).toUpperCase() + word.slice(1); // Capitalize first letter of subsequent words
  }).join(''); // Join without spaces
};

export const SchemaEditor: React.FC<SchemaEditorProps> = ({ 
  schema = [], 
  onChange,
  title = 'Schema Editor',
  description = 'Define the data structure.'
}) => {

  const handleAddField = useCallback(() => {
    const baseName = `newField${schema.length + 1}`;
    const newField: SchemaField = {
      id: toCamelCase(baseName), // Generate ID from initial name
      name: baseName,
      dataType: 'string',
      optional: false,
    };
    onChange([...schema, newField]);
  }, [schema, onChange]);

  const handleRemoveField = useCallback((idToRemove: string) => {
    onChange(schema.filter(field => field.id !== idToRemove));
  }, [schema, onChange]);

  const handleFieldChange = useCallback((idToUpdate: string, fieldProp: keyof SchemaField, value: string | boolean | SchemaField['dataType']) => {
    onChange(
      schema.map(field => {
        if (field.id === idToUpdate) {
          const updatedField = { ...field };

          // Special handling for name change: update ID as well
          if (fieldProp === 'name' && typeof value === 'string') {
            updatedField.name = value;
            updatedField.id = toCamelCase(value); // Update ID based on new name
          } else {
            // Handle other fields (including direct ID change if needed, though discouraged)
            const correctedValue = fieldProp === 'optional' ? Boolean(value) : value;
            // Assign dynamically while avoiding the `any` type
            (updatedField as Record<string, unknown>)[fieldProp] = correctedValue;
          }
          return updatedField;
        }
        return field;
      })
    );
  }, [schema, onChange]);

  return (
    <div className="space-y-4 p-4 border rounded-md bg-gray-50/50">
      <div>
        <h3 className="text-md font-semibold text-gray-800">{title}</h3>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
      
      {schema.length === 0 && (
        <p className="text-sm text-gray-400 italic py-2">No fields defined yet.</p>
      )}

      <div className="space-y-3">
        {schema.map((field, index) => (
          <div key={index} className="p-3 border rounded bg-white shadow-sm space-y-2">
            {/* --- Top Row --- */}
            <div className="flex items-end gap-2">
              {/* Name Input */}
              <div className="flex-1">
                <Label htmlFor={`field-name-${index}`} className="text-xs font-medium text-gray-600">Name</Label>
                <Input 
                  id={`field-name-${index}`} 
                  value={field.name}
                  onChange={(e) => handleFieldChange(field.id, 'name', e.target.value)} 
                  placeholder="Field Name (e.g., Customer Name)"
                  className="mt-1 h-8 text-sm"
                />
              </div>
              {/* Type Select */}
              <div className="w-32">
                <Label htmlFor={`field-type-${index}`} className="text-xs font-medium text-gray-600">Type</Label>
                <Select 
                  value={field.dataType}
                  onValueChange={(value: SchemaField['dataType']) => handleFieldChange(field.id, 'dataType', value)}
                >
                  <SelectTrigger id={`field-type-${index}`} className="mt-1 h-8 text-sm">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {DATA_TYPES.map(type => (
                      <SelectItem key={type} value={type} className="text-sm">
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* --- Bottom Row --- */}
            <div className="flex items-end justify-between gap-2 pt-1">
              {/* ID Field (Derived from Name) */}
              <div className="flex-1 pr-4">
                <Label htmlFor={`field-id-${index}`} className="text-xs font-medium text-gray-500">ID (camelCase from Name)</Label>
                <Input 
                  id={`field-id-${index}`} 
                  value={field.id} 
                  onChange={(e) => handleFieldChange(field.id, 'id', e.target.value)} // Allow direct editing if absolutely necessary
                  placeholder="e.g., customerName"
                  className="mt-1 h-8 text-sm font-mono text-gray-700" // Normal input style, maybe monospace
                  title={field.id}
                />
              </div>
              
              {/* Optional Toggle & Remove Button */}
              <div className="flex items-end gap-2">
                <div className="flex flex-col items-center">
                  <Label htmlFor={`field-optional-${index}`} className="text-xs font-medium text-gray-600 mb-1.5">Optional</Label>
                  <Switch 
                    id={`field-optional-${index}`} 
                    checked={field.optional || false}
                    onCheckedChange={(checked) => handleFieldChange(field.id, 'optional', checked)}
                    className="data-[state=checked]:bg-blue-600"
                  />
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleRemoveField(field.id)} // Still use ID for removal
                  className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50"
                  aria-label="Remove field"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button onClick={handleAddField} variant="outline" size="sm" className="mt-2">
        <PlusCircle className="h-4 w-4 mr-1" /> Add Field
      </Button>
    </div>
  );
}; 