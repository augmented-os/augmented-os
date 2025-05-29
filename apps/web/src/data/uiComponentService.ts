import { supabase } from '@/integrations/supabase/client';
import { UIComponentSchema, FormField, ActionButton, LayoutConfig } from '@/features/dynamicUI/types/schemas';

export interface DatabaseUISchema {
  id: string;
  component_id: string;
  name: string;
  description?: string;
  component_type: 'Form' | 'Modal' | 'Display' | 'Custom';
  title: string;
  fields?: FormField[] | null;
  layout?: LayoutConfig | null;
  actions?: ActionButton[] | null;
  display_template?: string;
  custom_props?: Record<string, unknown> | null;
  version?: string;
  created_at: string;
  updated_at: string;
}

// Cache for frequently accessed schemas
const schemaCache = new Map<string, { schema: UIComponentSchema; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Get a UI component schema by component_id
 */
export async function getUIComponentSchema(componentId: string): Promise<UIComponentSchema | null> {
  // Check cache first
  const cached = schemaCache.get(componentId);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.schema;
  }

  const { data, error } = await supabase
    .from('ui_components')
    .select('*')
    .eq('component_id', componentId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Schema not found
    }
    throw new Error(`Failed to fetch UI component schema: ${error.message}`);
  }

  const schema = transformFromDatabase(data);
  
  // Cache the result
  schemaCache.set(componentId, { schema, timestamp: Date.now() });
  
  return schema;
}

/**
 * List all UI component schemas
 */
export async function listUIComponentSchemas(): Promise<UIComponentSchema[]> {
  const { data, error } = await supabase
    .from('ui_components')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to list UI component schemas: ${error.message}`);
  }

  return data.map(transformFromDatabase);
}

/**
 * Create a new UI component schema
 */
export async function createUIComponentSchema(schema: UIComponentSchema): Promise<UIComponentSchema> {
  // Validate schema structure
  if (!validateSchemaStructure(schema)) {
    throw new Error('Invalid UI component schema structure');
  }

  const dbRecord = transformToDatabase(schema);
  
  const { data, error } = await supabase
    .from('ui_components')
    .insert(dbRecord)
    .select('*')
    .single();

  if (error) {
    throw new Error(`Failed to create UI component schema: ${error.message}`);
  }

  const created = transformFromDatabase(data);
  
  // Cache the new schema
  schemaCache.set(schema.componentId, { schema: created, timestamp: Date.now() });
  
  return created;
}

/**
 * Update an existing UI component schema
 */
export async function updateUIComponentSchema(componentId: string, updates: Partial<UIComponentSchema>): Promise<UIComponentSchema> {
  // Get current schema to merge updates
  const current = await getUIComponentSchema(componentId);
  if (!current) {
    throw new Error(`UI component schema with component_id ${componentId} not found`);
  }

  const updatedSchema = { ...current, ...updates };
  
  // Validate updated schema structure
  if (!validateSchemaStructure(updatedSchema)) {
    throw new Error('Invalid UI component schema structure');
  }

  const dbRecord = transformToDatabase(updatedSchema);
  delete dbRecord.component_id; // Don't update the component_id
  
  const { data, error } = await supabase
    .from('ui_components')
    .update(dbRecord)
    .eq('component_id', componentId)
    .select('*')
    .single();

  if (error) {
    throw new Error(`Failed to update UI component schema: ${error.message}`);
  }

  const updated = transformFromDatabase(data);
  
  // Update cache
  schemaCache.set(componentId, { schema: updated, timestamp: Date.now() });
  
  return updated;
}

/**
 * Delete a UI component schema
 */
export async function deleteUIComponentSchema(componentId: string): Promise<void> {
  const { error } = await supabase
    .from('ui_components')
    .delete()
    .eq('component_id', componentId);

  if (error) {
    throw new Error(`Failed to delete UI component schema: ${error.message}`);
  }

  // Remove from cache
  schemaCache.delete(componentId);
}

/**
 * Clear the UI component schema cache
 */
export function clearUIComponentSchemaCache(): void {
  schemaCache.clear();
}

/**
 * Transform database record to UIComponentSchema
 */
function transformFromDatabase(data: DatabaseUISchema): UIComponentSchema {
  return {
    componentId: data.component_id,
    name: data.name,
    description: data.description,
    componentType: data.component_type,
    title: data.title,
    fields: data.fields,
    actions: data.actions,
    displayTemplate: data.display_template,
    layout: data.layout,
    customProps: data.custom_props,
    version: data.version
  };
}

/**
 * Transform UIComponentSchema to database record
 */
function transformToDatabase(schema: UIComponentSchema): Omit<DatabaseUISchema, 'id' | 'created_at' | 'updated_at'> {
  return {
    component_id: schema.componentId,
    name: schema.name,
    description: schema.description,
    component_type: schema.componentType,
    title: schema.title,
    fields: schema.fields,
    actions: schema.actions,
    display_template: schema.displayTemplate,
    layout: schema.layout,
    custom_props: schema.customProps,
    version: schema.version || '1.0.0'
  };
}

/**
 * Validate UI component schema structure
 */
function validateSchemaStructure(schema: UIComponentSchema): boolean {
  // Basic validation
  if (!schema.componentId || !schema.name || !schema.componentType || !schema.title) {
    return false;
  }

  // Validate component type
  if (!['Form', 'Modal', 'Display', 'Custom'].includes(schema.componentType)) {
    return false;
  }

  // Validate fields if present
  if (schema.fields && Array.isArray(schema.fields)) {
    for (const field of schema.fields) {
      if (!field.fieldKey || !field.label || !field.type) {
        return false;
      }
    }
  }

  // Validate actions if present
  if (schema.actions && Array.isArray(schema.actions)) {
    for (const action of schema.actions) {
      if (!action.actionKey || !action.label || !action.style) {
        return false;
      }
    }
  }

  return true;
} 