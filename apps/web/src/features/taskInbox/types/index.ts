import { Tables } from '../../../types/supabaseTypes';

// =============================================================================
// UNIVERSAL TYPES - Work with any JSON-driven data
// =============================================================================

// Universal flag types for semantic row styling
export type FlagType = 'error' | 'warning' | 'success' | 'info' | 'pending' | null;

// Universal data types
export type TableDataItem = Record<string, unknown>;

// =============================================================================
// DATABASE SCHEMA TYPES - From Supabase
// =============================================================================

export type TaskInstance = Tables<'task_instances'>;
export type TaskDefinition = Tables<'task_definitions'>;
export type UIComponent = Tables<'ui_components'>;

export interface TaskInstanceWithDefinition extends TaskInstance {
  task_definition: TaskDefinition;
} 