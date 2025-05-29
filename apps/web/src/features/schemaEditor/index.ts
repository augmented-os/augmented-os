// Export the main SchemaEditor component
export { SchemaEditor } from './components/SchemaEditor';

// Export sub-components
export { SchemaHeader } from './components/SchemaHeader';
export { TablesList } from './components/TablesList';
export { TableDetails } from './components/TableDetails';

// Export field components
export { FieldsList } from './components/fields/FieldsList';
export { FieldForm } from './components/fields/FieldForm';
export { AddFieldModal } from './components/fields/AddFieldModal';

// Export icons
export { FieldTypeIcon } from './components/icons/FieldTypeIcon';

// Export hooks
export { useSchemaTablesData } from './hooks/use-schema-tables';
export { useTableFields } from './hooks/use-table-fields';
export { useFieldTypes } from './hooks/use-field-types';

// Export types
export * from './types'; 