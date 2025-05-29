import { UIComponentSchema } from '../types/schemas';
import * as schemaService from '../api/schemaService';

/**
 * Migration result interface
 */
export interface MigrationResult {
  success: boolean;
  componentId: string;
  error?: string;
  originalSchema?: UIComponentSchema;
  migratedSchema?: UIComponentSchema;
}

/**
 * Migration options
 */
export interface MigrationOptions {
  /**
   * Whether to overwrite existing schema in database
   */
  overwrite?: boolean;
  
  /**
   * Whether to validate the migrated schema can be fetched
   */
  validate?: boolean;
  
  /**
   * Custom component ID to use (defaults to schema's componentId)
   */
  customComponentId?: string;
}

/**
 * Migrate a schema from code to database
 * @deprecated This function was used for initial migration and is no longer needed
 * since schemas are now stored in the database
 */
export async function migrateReviewRequestFormSchema(
  options: MigrationOptions = {}
): Promise<MigrationResult> {
  return {
    success: false,
    componentId: 'review-request-form',
    error: 'Migration function is deprecated. Schemas are now stored in database via seed files.'
  };
}

/**
 * Rollback a migrated schema by deleting it from the database
 */
export async function rollbackMigration(componentId: string): Promise<MigrationResult> {
  try {
    // Verify schema exists before attempting rollback
    const existingSchema = await schemaService.getSchema(componentId);
    
    if (!existingSchema) {
      return {
        success: false,
        componentId,
        error: `Schema with component_id '${componentId}' not found for rollback`
      };
    }

    // Delete the schema
    await schemaService.deleteSchema(componentId);

    // Verify deletion
    const verifyDeleted = await schemaService.getSchema(componentId);
    if (verifyDeleted) {
      throw new Error('Schema was not successfully deleted');
    }

    return {
      success: true,
      componentId,
      originalSchema: existingSchema
    };

  } catch (error) {
    return {
      success: false,
      componentId,
      error: error instanceof Error ? error.message : 'Unknown rollback error'
    };
  }
}

/**
 * Batch migrate multiple schemas
 */
export async function batchMigrateSchemas(
  schemas: UIComponentSchema[],
  options: MigrationOptions = {}
): Promise<MigrationResult[]> {
  const results: MigrationResult[] = [];

  for (const schema of schemas) {
    try {
      let migratedSchema: UIComponentSchema;

      // Check if schema exists
      const existingSchema = await schemaService.getSchema(schema.componentId);
      
      if (existingSchema && !options.overwrite) {
        results.push({
          success: false,
          componentId: schema.componentId,
          error: `Schema already exists. Use overwrite option to replace.`,
          originalSchema: schema
        });
        continue;
      }

      // Create or update
      if (existingSchema && options.overwrite) {
        migratedSchema = await schemaService.updateSchema(schema.componentId, schema);
      } else {
        migratedSchema = await schemaService.createSchema(schema);
      }

      results.push({
        success: true,
        componentId: schema.componentId,
        originalSchema: schema,
        migratedSchema
      });

    } catch (error) {
      results.push({
        success: false,
        componentId: schema.componentId,
        error: error instanceof Error ? error.message : 'Unknown migration error',
        originalSchema: schema
      });
    }
  }

  return results;
}

/**
 * Validate schema structure for migration
 */
function validateSchemaForMigration(schema: UIComponentSchema): boolean {
  // Basic required fields
  if (!schema.componentId || !schema.name || !schema.componentType || !schema.title) {
    return false;
  }

  // Validate component type
  if (!['Form', 'Modal', 'Display', 'Custom'].includes(schema.componentType)) {
    return false;
  }

  // Validate fields structure if present
  if (schema.fields) {
    if (!Array.isArray(schema.fields)) {
      return false;
    }

    for (const field of schema.fields) {
      if (!field.fieldKey || !field.label || !field.type) {
        return false;
      }
    }
  }

  // Validate actions structure if present
  if (schema.actions) {
    if (!Array.isArray(schema.actions)) {
      return false;
    }

    for (const action of schema.actions) {
      if (!action.actionKey || !action.label || !action.style) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Compare two schemas for migration validation
 */
function compareSchemasForMigration(
  original: UIComponentSchema, 
  fetched: UIComponentSchema
): boolean {
  // Compare core properties
  if (
    original.componentId !== fetched.componentId ||
    original.name !== fetched.name ||
    original.componentType !== fetched.componentType ||
    original.title !== fetched.title
  ) {
    return false;
  }

  // Compare fields count if both have fields
  if (original.fields && fetched.fields) {
    if (original.fields.length !== fetched.fields.length) {
      return false;
    }
  } else if (!!original.fields !== !!fetched.fields) {
    return false;
  }

  // Compare actions count if both have actions
  if (original.actions && fetched.actions) {
    if (original.actions.length !== fetched.actions.length) {
      return false;
    }
  } else if (!!original.actions !== !!fetched.actions) {
    return false;
  }

  return true;
}

/**
 * Generate metadata for migrated schema
 */
export function generateSchemaMetadata(schema: UIComponentSchema) {
  return {
    migratedAt: new Date().toISOString(),
    migratedFrom: 'code',
    version: schema.version || '1.0.0',
    fieldCount: schema.fields?.length || 0,
    actionCount: schema.actions?.length || 0,
    componentType: schema.componentType
  };
} 