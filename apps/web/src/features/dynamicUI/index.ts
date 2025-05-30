// Main components
export { DynamicUIRenderer } from './components/DynamicUIRenderer';
export { DynamicForm } from './components/DynamicForm';
export { DynamicDisplay } from './components/DynamicDisplay';
export { DynamicUIErrorBoundary } from './components/DynamicUIErrorBoundary';

// Schema state management hooks
export {
  useSchemaQuery,
  useSchemasQuery,
  useCreateSchemaMutation,
  useUpdateSchemaMutation,
  useDeleteSchemaMutation,
  usePrefetchSchema,
  useInvalidateSchemas,
  getCachedSchema,
  setCachedSchema,
  SCHEMA_QUERY_KEYS
} from './store/schemaSlice';

// Schema hooks
export {
  useSchema,
  usePrefetchSchemas,
  useSchemaWithFallback,
  useSchemaOrNull
} from './hooks/useSchema';

// Migration utilities
// Note: migrateReviewRequestFormSchema is deprecated - schemas are now stored in database via seed files
export {
  migrateReviewRequestFormSchema, // @deprecated
  rollbackMigration,
  batchMigrateSchemas,
  generateSchemaMetadata
} from './utils/schemaMigration';

// Types
export type { 
  UIComponentSchema,
  FormField,
  ActionButton,
  SelectOption,
  ValidationRule,
  ValidationRuleReference,
  LayoutConfig,
  FormSection
} from './types/schemas';

export type { 
  MigrationResult, 
  MigrationOptions 
} from './utils/schemaMigration';
export type {
  UseSchemaOptions,
  UseSchemaResult
} from './hooks/useSchema';
export type {
  SchemaState,
  SchemaQueryResult,
  SchemasQueryResult
} from './store/schemaSlice';

// Component props interfaces
export type { DynamicUIRendererProps } from './components/DynamicUIRenderer';

// Context providers and hooks
export { DynamicUIStateProvider, useDynamicUIState, useUIStateData } from './contexts/DynamicUIStateContext';

// Utility functions
export { renderTemplate } from './utils/templates';
export { evaluateCondition } from './utils/conditions'; 