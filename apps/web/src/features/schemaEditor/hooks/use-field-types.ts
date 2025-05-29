import { useMemo, useCallback } from 'react';
import { SchemaColumn } from '../types';

export interface FieldTypeInfo {
  value: string;
  label: string;
  iconName: string;
  description: string;
  defaultValue?: unknown;
  requiresReference?: boolean;
  canBePrimary?: boolean;
}

interface UseFieldTypesResult {
  fieldTypes: FieldTypeInfo[];
  getTypeInfo: (type: string) => FieldTypeInfo | undefined;
  getTypeIconName: (type: string) => string;
  validateFieldValue: (type: string, value: unknown) => boolean;
  getDefaultValue: (type: string) => unknown;
  getTypeOptions: () => { value: string; label: string }[];
}

// Default icon name for unknown types
const DEFAULT_ICON_NAME = 'AlertCircle';

// Standard field types as constants
export const FIELD_TYPES = {
  TEXT: 'text',
  VARCHAR: 'varchar',
  NUMBER: 'number',
  INTEGER: 'integer',
  NUMERIC: 'numeric',
  BOOLEAN: 'boolean',
  DATE: 'date',
  TIMESTAMP: 'timestamp',
  TIMESTAMP_TZ: 'timestamp with time zone',
  UUID: 'uuid',
  REFERENCE: 'reference',
  JSONB: 'jsonb',
  JSON: 'json',
  ARRAY: 'array'
};

/**
 * Hook for managing field types with their associated properties and icons
 * 
 * @returns Field types information and utilities
 */
export function useFieldTypes(): UseFieldTypesResult {
  // Define all available field types with their metadata
  const fieldTypes = useMemo<FieldTypeInfo[]>(() => [
    {
      value: FIELD_TYPES.TEXT,
      label: 'Text',
      iconName: 'Type',
      description: 'Plain text string',
      defaultValue: '',
      canBePrimary: false
    },
    {
      value: FIELD_TYPES.VARCHAR,
      label: 'Varchar',
      iconName: 'Type',
      description: 'Text with length limit',
      defaultValue: '',
      canBePrimary: false
    },
    {
      value: FIELD_TYPES.INTEGER,
      label: 'Integer',
      iconName: 'Hash',
      description: 'Whole number',
      defaultValue: 0,
      canBePrimary: true
    },
    {
      value: FIELD_TYPES.NUMERIC,
      label: 'Numeric',
      iconName: 'Hash',
      description: 'Decimal number with precision and scale',
      defaultValue: 0,
      canBePrimary: false
    },
    {
      value: FIELD_TYPES.BOOLEAN,
      label: 'Boolean',
      iconName: 'ToggleRight',
      description: 'Boolean value (true/false)',
      defaultValue: false,
      canBePrimary: false
    },
    {
      value: FIELD_TYPES.DATE,
      label: 'Date',
      iconName: 'Calendar',
      description: 'Date without time',
      defaultValue: null,
      canBePrimary: false
    },
    {
      value: FIELD_TYPES.TIMESTAMP,
      label: 'Timestamp',
      iconName: 'Clock',
      description: 'Date with time',
      defaultValue: null,
      canBePrimary: false
    },
    {
      value: FIELD_TYPES.TIMESTAMP_TZ,
      label: 'Timestamp with TZ',
      iconName: 'Clock',
      description: 'Date with time and timezone',
      defaultValue: null,
      canBePrimary: false
    },
    {
      value: FIELD_TYPES.UUID,
      label: 'UUID',
      iconName: 'Key',
      description: 'Universally unique identifier',
      defaultValue: null,
      canBePrimary: true
    },
    {
      value: FIELD_TYPES.REFERENCE,
      label: 'Reference',
      iconName: 'Link2',
      description: 'Reference to another table',
      defaultValue: null,
      requiresReference: true,
      canBePrimary: false
    },
    {
      value: FIELD_TYPES.JSON,
      label: 'JSON',
      iconName: 'FileJson',
      description: 'JSON data structure',
      defaultValue: {},
      canBePrimary: false
    },
    {
      value: FIELD_TYPES.JSONB,
      label: 'JSONB',
      iconName: 'FileJson',
      description: 'Binary JSON data structure',
      defaultValue: {},
      canBePrimary: false
    }
  ], []);
  
  // Get information for a specific type
  const getTypeInfo = useCallback(function(type: string): FieldTypeInfo | undefined {
    return fieldTypes.find(ft => ft.value === type) || 
      // Fallback for dynamic types like arrays
      fieldTypes.find(ft => type.startsWith(ft.value));
  }, [fieldTypes]);
  
  // Get icon name for a type
  const getTypeIconName = useCallback(function(type: string): string {
    const typeInfo = getTypeInfo(type);
    return typeInfo ? typeInfo.iconName : DEFAULT_ICON_NAME;
  }, [getTypeInfo]);
  
  // Validate a value for a given type
  const validateFieldValue = useCallback(function(type: string, value: unknown): boolean {
    // Handle array types
    if (type.endsWith('[]') || type === FIELD_TYPES.ARRAY) {
      return Array.isArray(value);
    }
    
    switch (type) {
      case FIELD_TYPES.TEXT:
      case FIELD_TYPES.VARCHAR:
        return typeof value === 'string';
      
      case FIELD_TYPES.INTEGER:
      case FIELD_TYPES.NUMERIC:
      case FIELD_TYPES.NUMBER:
        return typeof value === 'number' && !isNaN(value);
      
      case FIELD_TYPES.BOOLEAN:
        return typeof value === 'boolean';
      
      case FIELD_TYPES.DATE:
      case FIELD_TYPES.TIMESTAMP:
      case FIELD_TYPES.TIMESTAMP_TZ:
        // Allow null or valid Date objects or ISO strings
        if (value === null) return true;
        if (value instanceof Date) return !isNaN(value.getTime());
        if (typeof value === 'string') {
          try {
            return !isNaN(new Date(value).getTime());
          } catch (e) {
            return false;
          }
        }
        return false;
      
      case FIELD_TYPES.UUID: {
        // Check for UUID pattern
        if (typeof value !== 'string') return false;
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return uuidRegex.test(value);
      }
      
      case FIELD_TYPES.REFERENCE:
        // Typically references are stored as IDs (string/number) or null
        return typeof value === 'string' || typeof value === 'number' || value === null;
      
      case FIELD_TYPES.JSON:
      case FIELD_TYPES.JSONB:
        // Accept pre-parsed objects or valid JSON strings
        if (typeof value === 'object' && value !== null) return true;
        if (typeof value === 'string') {
          try {
            JSON.parse(value);
            return true;
          } catch (e) {
            return false;
          }
        }
        return false;
      
      default:
        // For any type not directly handled, accept strings matching SQL semantics
        return true;
    }
  }, []);
  
  // Get default value for a type
  const getDefaultValue = useCallback(function(type: string): unknown {
    const typeInfo = getTypeInfo(type);
    // Handle cases where defaultValue might be explicitly undefined vs not set
    return typeInfo && 'defaultValue' in typeInfo ? typeInfo.defaultValue : null;
  }, [getTypeInfo]);
  
  // Get options for a select dropdown
  const getTypeOptions = useCallback(function(): { value: string; label: string }[] {
    return fieldTypes.map(type => ({
      value: type.value,
      label: type.label
    }));
  }, [fieldTypes]);
  
  return {
    fieldTypes,
    getTypeInfo,
    getTypeIconName,
    validateFieldValue,
    getDefaultValue,
    getTypeOptions
  };
} 