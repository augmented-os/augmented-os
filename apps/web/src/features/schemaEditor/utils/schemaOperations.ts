import { Schema, SchemaTable, SchemaColumn, SchemaColumnType } from '../types';

/**
 * Finds a table definition within a schema by its name.
 *
 * @param schema The complete schema object.
 * @param tableName The name of the table to find.
 * @returns The SchemaTable object if found, otherwise undefined.
 */
export function findTableByName(schema: Schema, tableName: string): SchemaTable | undefined {
  return schema.tables.find(table => table.name === tableName);
}

/**
 * Finds a column definition within a specific table by its name.
 *
 * @template T Generic allows inferring the specific column type if needed elsewhere.
 * @param table The table object to search within.
 * @param columnName The name of the column to find.
 * @returns The SchemaColumn object if found, otherwise undefined.
 */
export function findColumnByName<T extends SchemaColumn = SchemaColumn>(table: SchemaTable, columnName: string): T | undefined {
  return table.columns.find(column => column.name === columnName) as T | undefined;
}

/**
 * Finds a column within a schema given the table and column names.
 *
 * @param schema The complete schema object.
 * @param tableName The name of the table containing the column.
 * @param columnName The name of the column to find.
 * @returns The SchemaColumn object if found, otherwise undefined.
 */
export function findColumnInSchema(schema: Schema, tableName: string, columnName: string): SchemaColumn | undefined {
  const table = findTableByName(schema, tableName);
  if (!table) {
    return undefined;
  }
  return findColumnByName(table, columnName);
}

/**
 * Gets the primary key column definition for a given table.
 *
 * @param table The table object to search within.
 * @returns The SchemaColumn marked as isPrimary, or undefined if none exists.
 */
export function getPrimaryKeyColumn(table: SchemaTable): SchemaColumn | undefined {
  return table.columns.find(column => column.isPrimary);
}

/**
 * Extracts all relationship definitions (Reference columns) from a schema.
 *
 * @param schema The complete schema object.
 * @returns An array of objects, each detailing a relationship.
 */
export function extractRelationships(schema: Schema): Array<{ fromTable: string; fromColumn: string; toTable: string }> {
  const relationships: Array<{ fromTable: string; fromColumn: string; toTable: string }> = [];

  for (const table of schema.tables) {
    for (const column of table.columns) {
      if (column.type === SchemaColumnType.REFERENCE && column.reference) {
        // Basic validation: Ensure the referenced table exists
        if (findTableByName(schema, column.reference)) {
          relationships.push({
            fromTable: table.name,
            fromColumn: column.name,
            toTable: column.reference,
          });
        } else {
          // Handle error: Referenced table does not exist
          console.warn(`Relationship error: Column ${table.name}.${column.name} references non-existent table ${column.reference}`);
          // Depending on strictness, could throw an error here instead
        }
      }
    }
  }

  return relationships;
}

/**
 * Renames a table within the schema and updates all references to it.
 * Creates a NEW schema object, does not modify the input.
 *
 * @param schema The original schema object.
 * @param oldName The current name of the table to rename.
 * @param newName The desired new name for the table.
 * @returns A new Schema object with the table renamed and references updated.
 * @throws Error if the old table doesn't exist or the new name conflicts.
 */
export function renameTableInSchema(schema: Schema, oldName: string, newName: string): Schema {
  if (oldName === newName) return schema; // No change needed

  const oldTableExists = findTableByName(schema, oldName);
  if (!oldTableExists) {
    throw new Error(`Cannot rename: Table "${oldName}" does not exist.`);
  }

  const newNameExists = findTableByName(schema, newName);
  if (newNameExists) {
    throw new Error(`Cannot rename: Table "${newName}" already exists.`);
  }

  // Create a deep copy to avoid modifying the original schema
  const newSchema: Schema = JSON.parse(JSON.stringify(schema));

  // Update the table name itself
  const tableToRename = findTableByName(newSchema, oldName)!;
  tableToRename.name = newName;

  // Update references in other tables
  for (const table of newSchema.tables) {
    for (const column of table.columns) {
      if (column.type === SchemaColumnType.REFERENCE && column.reference === oldName) {
        column.reference = newName;
      }
    }
  }

  return newSchema;
}

// Add more schema operation utilities as needed, e.g.:
// - addTable(schema, newTable)
// - removeTable(schema, tableName)
// - addColumn(schema, tableName, newColumn)
// - removeColumn(schema, tableName, columnName)
// - updateColumn(schema, tableName, columnName, updatedColumnData) 