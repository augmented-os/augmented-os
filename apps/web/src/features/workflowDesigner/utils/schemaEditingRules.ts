import { NODE_TYPES } from '@/types/workflow';

// Rules to determine if the input schema is editable for a given node type and action
export const inputSchemaEditable: Record<string, (action?: string) => boolean> = {
  [NODE_TYPES.DOCUMENT]: () => false,
  [NODE_TYPES.DATA_STORE]: (action) => action !== 'insert',
  [NODE_TYPES.INTEGRATION]: () => true,
  [NODE_TYPES.MANUAL_TASK]: () => false,
  [NODE_TYPES.DECISION]: () => true,
  [NODE_TYPES.AI_TASK]: () => true,
  // Add other node types as needed
};

// Rules to determine if the output schema is editable for a given node type and action
export const outputSchemaEditable: Record<string, (action?: string) => boolean> = {
  [NODE_TYPES.DOCUMENT]: (action) => action === 'create',
  [NODE_TYPES.DATA_STORE]: (action) => action === 'get',
  [NODE_TYPES.INTEGRATION]: () => true,
  [NODE_TYPES.MANUAL_TASK]: () => true,
  [NODE_TYPES.AI_TASK]: () => true,
  // Add other node types as needed
}; 