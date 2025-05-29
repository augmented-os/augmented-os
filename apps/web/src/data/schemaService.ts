import { supabase } from '@/integrations/supabase/client';
import { Schema, SchemaTable, SchemaColumn } from '@/features/schemaEditor/types';
import { formatTableNameForDisplay } from '@/features/schemaEditor/utils/formatting';

/**
 * Fetch all database schemas
 * 
 * @returns Array of schema objects
 */
export async function fetchSchemas() {
  const { data, error } = await supabase
    .from('tenant_schemas')
    .select('schema_id, tenant_id, schema_json, created_at, updated_at, version')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  
  // Transform the data to match our schema format
  return data.map(row => {
    // Check if schema_json and schemas array exist
    if (!row.schema_json || !row.schema_json.schemas || !Array.isArray(row.schema_json.schemas) || row.schema_json.schemas.length === 0) {
      return {
        id: row.schema_id,
        name: `Schema ${row.schema_id}`,
        tables: [],
        created_at: row.created_at,
        updated_at: row.updated_at
      };
    }

    // Get the first schema object from the schemas array
    const schemaObj = row.schema_json.schemas[0];
    
    // Transform tables and their columns
    const tables = schemaObj.tables ? schemaObj.tables.map(table => transformTableFromDb(table)) : [];
    
    return {
      id: row.schema_id,
      name: schemaObj.name || `Schema ${row.schema_id}`,
      description: schemaObj.description || null,
      tables: tables,
      created_at: row.created_at,
      updated_at: row.updated_at
    };
  });
}

/**
 * Fetch a single schema by ID
 * 
 * @param id Schema ID
 * @returns Schema object or null if not found
 */
export async function fetchSchemaById(id: string) {
  const { data, error } = await supabase
    .from('tenant_schemas')
    .select('schema_id, tenant_id, schema_json, created_at, updated_at, version')
    .eq('schema_id', id)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Schema not found
    }
    throw error;
  }
  
  // Check if schema_json and schemas array exist
  if (!data.schema_json || !data.schema_json.schemas || !Array.isArray(data.schema_json.schemas) || data.schema_json.schemas.length === 0) {
    return {
      id: data.schema_id,
      name: `Schema ${data.schema_id}`,
      tables: [],
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  }

  // Get the first schema object from the schemas array
  const schemaObj = data.schema_json.schemas[0];
  
  // Transform tables and their columns
  const tables = schemaObj.tables ? schemaObj.tables.map(table => transformTableFromDb(table)) : [];
  
  return {
    id: data.schema_id,
    name: schemaObj.name || `Schema ${data.schema_id}`,
    description: schemaObj.description || null,
    tables: tables,
    created_at: data.created_at,
    updated_at: data.updated_at
  };
}

/**
 * Helper function to transform a table from DB format to internal format
 * Converts columns from object to array format and extracts constraints
 */
function transformTableFromDb(tableData: any): SchemaTable {
  // Extract columns from object to array format
  const columnsArray: SchemaColumn[] = [];
  
  if (tableData.columns && typeof tableData.columns === 'object') {
    for (const [colName, colDef] of Object.entries(tableData.columns)) {
      const colDefTyped = colDef as any;
      
      // Create column with standard properties
      const column: SchemaColumn = {
        name: colName,
        displayName: colName, // Default to column name if no display name provided
        type: colDefTyped.type || 'text',
        nullable: colDefTyped.nullable !== false, // Default to true if not specified
        default: colDefTyped.default,
        comment: colDefTyped.comment,
        // Type-specific properties
        length: colDefTyped.length,
        precision: colDefTyped.precision,
        scale: colDefTyped.scale,
        array: colDefTyped.array,
        withTimeZone: colDefTyped.withTimeZone,
        // For backward compatibility
        required: colDefTyped.nullable === false
      };
      
      // Check if this column is in the primary key
      if (tableData.primaryKey) {
        const pkColumns = Array.isArray(tableData.primaryKey) 
          ? tableData.primaryKey 
          : tableData.primaryKey.columns;
          
        if (pkColumns && pkColumns.includes(colName)) {
          column.isPrimary = true;
        }
      }
      
      columnsArray.push(column);
    }
  }
  
  // Create the transformed table
  const transformedTable: SchemaTable = {
    name: tableData.name,
    displayName: formatTableNameForDisplay(tableData.name), // Format the table name for display
    description: tableData.comment,
    columns: columnsArray,
    primaryKey: tableData.primaryKey,
    foreignKeys: tableData.foreignKeys,
    uniqueConstraints: tableData.uniqueConstraints,
    indexes: tableData.indexes
  };
  
  return transformedTable;
}

/**
 * Create a new database schema
 * 
 * @param name Schema name
 * @param description Optional schema description
 * @param tables Initial tables configuration
 * @returns Created schema object
 */
export async function createSchema(
  name: string,
  description?: string,
  tables: SchemaTable[] = []
) {
  // Transform tables from internal format to DB format
  const transformedTables = tables.map(table => transformTableToDb(table));
  
  const schemaJson = {
    schemaVersion: "1.0.0",
    schemas: [
      {
        name,
        description,
        tables: transformedTables
      }
    ]
  };
  
  const { data, error } = await supabase
    .from('tenant_schemas')
    .insert({
      tenant_id: 'default', // Using a default tenant ID
      schema_json: schemaJson,
      version: 1 // Starting version
    })
    .select('schema_id, tenant_id, schema_json, created_at, updated_at, version')
    .single();
  
  if (error) throw error;
  
  // Transform the response back to our internal format
  return fetchSchemaById(data.schema_id);
}

/**
 * Update an existing schema
 * 
 * @param id Schema ID to update
 * @param updates Object containing fields to update
 * @returns Updated schema object
 */
export async function updateSchema(
  id: string,
  updates: {
    name?: string;
    description?: string;
    tables?: SchemaTable[];
  }
) {
  // First get the current schema
  const { data: rawSchema } = await supabase
    .from('tenant_schemas')
    .select('schema_id, tenant_id, schema_json, created_at, updated_at, version')
    .eq('schema_id', id)
    .single();
  
  if (!rawSchema) throw new Error(`Schema with ID ${id} not found`);
  
  // Get the current version number
  const currentVersion = rawSchema.version || 1;
  
  // Ensure schema_json has the expected structure
  if (!rawSchema.schema_json) {
    rawSchema.schema_json = { schemas: [{ tables: [] }] };
  } else if (!rawSchema.schema_json.schemas || !Array.isArray(rawSchema.schema_json.schemas)) {
    rawSchema.schema_json.schemas = [{ tables: [] }];
  } else if (rawSchema.schema_json.schemas.length === 0) {
    rawSchema.schema_json.schemas.push({ tables: [] });
  }
  
  // Get the first schema object
  const schemaObj = rawSchema.schema_json.schemas[0];
  
  // Update the schema object with the new values
  if (updates.name) {
    schemaObj.name = updates.name;
  }
  
  if (updates.description !== undefined) {
    schemaObj.description = updates.description;
  }
  
  if (updates.tables) {
    // Transform tables from internal format to DB format
    schemaObj.tables = updates.tables.map(table => transformTableToDb(table));
  }
  
  const { data, error } = await supabase
    .from('tenant_schemas')
    .update({
      schema_json: rawSchema.schema_json,
      updated_at: new Date().toISOString(),
      version: currentVersion + 1
    })
    .eq('schema_id', id)
    .select('schema_id, tenant_id, schema_json, created_at, updated_at, version')
    .single();
  
  if (error) throw error;
  
  // Transform the response back to our internal format
  return fetchSchemaById(data.schema_id);
}

/**
 * Helper function to transform a table from internal format to DB format
 * Converts columns from array to object format and structures constraints
 */
function transformTableToDb(table: SchemaTable): any {
  // Convert columns from array to object format
  const columnsObj: Record<string, any> = {};
  
  for (const col of table.columns) {
    columnsObj[col.name] = {
      type: col.type,
      nullable: col.nullable,
      default: col.default,
      comment: col.comment
    };
    
    // Add type-specific properties if they exist
    if (col.length !== undefined) columnsObj[col.name].length = col.length;
    if (col.precision !== undefined) columnsObj[col.name].precision = col.precision;
    if (col.scale !== undefined) columnsObj[col.name].scale = col.scale;
    if (col.array !== undefined) columnsObj[col.name].array = col.array;
    if (col.withTimeZone !== undefined) columnsObj[col.name].withTimeZone = col.withTimeZone;
  }
  
  // Create the transformed table
  const transformedTable: any = {
    name: table.name,
    comment: table.description,
    columns: columnsObj
  };
  
  // Add constraints if they exist
  if (table.primaryKey) transformedTable.primaryKey = table.primaryKey;
  if (table.foreignKeys) transformedTable.foreignKeys = table.foreignKeys;
  if (table.uniqueConstraints) transformedTable.uniqueConstraints = table.uniqueConstraints;
  if (table.indexes) transformedTable.indexes = table.indexes;
  
  return transformedTable;
}

/**
 * Delete a schema
 * 
 * @param id Schema ID to delete
 * @returns true if successful
 */
export async function deleteSchema(id: string) {
  const { error } = await supabase
    .from('tenant_schemas')
    .delete()
    .eq('schema_id', id);
  
  if (error) throw error;
  return true;
}

/**
 * Add a new table to a schema
 * 
 * @param schemaId Schema ID
 * @param table Table definition to add
 * @returns Updated schema
 */
export async function addTable(schemaId: string, table: SchemaTable) {
  // First fetch the current schema
  const schema = await fetchSchemaById(schemaId);
  if (!schema) throw new Error(`Schema with ID ${schemaId} not found`);
  
  // Ensure table has a displayName (if not provided)
  const tableWithDisplayName = {
    ...table,
    displayName: table.displayName || formatTableNameForDisplay(table.name)
  };
  
  // Add the new table
  const updatedTables = [...(schema.tables || []), tableWithDisplayName];
  
  // Update the schema
  return await updateSchema(schemaId, { tables: updatedTables });
}

/**
 * Update an existing table in a schema
 * 
 * @param schemaId Schema ID
 * @param tableName Current table name (used for lookup)
 * @param tableUpdates Updates to apply to the table
 * @returns Updated schema
 */
export async function updateTable(
  schemaId: string,
  tableName: string,
  tableUpdates: Partial<SchemaTable>
) {
  // First fetch the current schema
  const schema = await fetchSchemaById(schemaId);
  if (!schema) throw new Error(`Schema with ID ${schemaId} not found`);
  
  // Find the table to update
  const tables = schema.tables || [];
  const tableIndex = tables.findIndex(t => t.name === tableName);
  
  if (tableIndex === -1) {
    throw new Error(`Table ${tableName} not found in schema ${schemaId}`);
  }
  
  // Update the table
  const updatedTables = [...tables];
  updatedTables[tableIndex] = {
    ...updatedTables[tableIndex],
    ...tableUpdates
  };
  
  // Update the schema
  return await updateSchema(schemaId, { tables: updatedTables });
}

/**
 * Remove a table from a schema
 * 
 * @param schemaId Schema ID
 * @param tableName Name of table to remove
 * @returns Updated schema
 */
export async function removeTable(schemaId: string, tableName: string) {
  // First fetch the current schema
  const schema = await fetchSchemaById(schemaId);
  if (!schema) throw new Error(`Schema with ID ${schemaId} not found`);
  
  // Filter out the table to remove
  const updatedTables = (schema.tables || []).filter(t => t.name !== tableName);
  
  // Update the schema
  return await updateSchema(schemaId, { tables: updatedTables });
}

/**
 * Add a column to a table
 * 
 * @param schemaId Schema ID
 * @param tableName Name of table to add column to
 * @param column Column definition to add
 * @returns Updated schema
 */
export async function addColumn(
  schemaId: string,
  tableName: string,
  column: SchemaColumn
) {
  // First fetch the current schema
  const schema = await fetchSchemaById(schemaId);
  if (!schema) throw new Error(`Schema with ID ${schemaId} not found`);
  
  // Find the table to update
  const tables = schema.tables || [];
  const tableIndex = tables.findIndex(t => t.name === tableName);
  
  if (tableIndex === -1) {
    throw new Error(`Table ${tableName} not found in schema ${schemaId}`);
  }
  
  // Check if a column with this name already exists
  const existingColumnIndex = tables[tableIndex].columns.findIndex(c => c.name === column.name);
  if (existingColumnIndex !== -1) {
    throw new Error(`Column ${column.name} already exists in table ${tableName}`);
  }
  
  // Add the new column
  const updatedTables = [...tables];
  updatedTables[tableIndex] = {
    ...updatedTables[tableIndex],
    columns: [...updatedTables[tableIndex].columns, column]
  };
  
  // Update the schema
  return await updateSchema(schemaId, { tables: updatedTables });
}

/**
 * Update a column in a table
 * 
 * @param schemaId Schema ID
 * @param tableName Table name
 * @param columnName Current column name (used for lookup)
 * @param columnUpdates Updates to apply to the column
 * @returns Updated schema
 */
export async function updateColumn(
  schemaId: string,
  tableName: string,
  columnName: string,
  columnUpdates: Partial<SchemaColumn>
) {
  // First fetch the current schema
  const schema = await fetchSchemaById(schemaId);
  if (!schema) throw new Error(`Schema with ID ${schemaId} not found`);
  
  // Find the table
  const tables = schema.tables || [];
  const tableIndex = tables.findIndex(t => t.name === tableName);
  
  if (tableIndex === -1) {
    throw new Error(`Table ${tableName} not found in schema ${schemaId}`);
  }
  
  // Find the column
  const columns = tables[tableIndex].columns || [];
  const columnIndex = columns.findIndex(c => c.name === columnName);
  
  if (columnIndex === -1) {
    throw new Error(`Column ${columnName} not found in table ${tableName}`);
  }
  
  // Update the column
  const updatedTables = [...tables];
  const updatedColumns = [...columns];
  updatedColumns[columnIndex] = {
    ...updatedColumns[columnIndex],
    ...columnUpdates
  };
  
  updatedTables[tableIndex] = {
    ...updatedTables[tableIndex],
    columns: updatedColumns
  };
  
  // Update the schema
  return await updateSchema(schemaId, { tables: updatedTables });
}

/**
 * Remove a column from a table
 * 
 * @param schemaId Schema ID
 * @param tableName Table name
 * @param columnName Name of column to remove
 * @returns Updated schema
 */
export async function removeColumn(
  schemaId: string,
  tableName: string,
  columnName: string
) {
  // First fetch the current schema
  const schema = await fetchSchemaById(schemaId);
  if (!schema) throw new Error(`Schema with ID ${schemaId} not found`);
  
  // Find the table
  const tables = schema.tables || [];
  const tableIndex = tables.findIndex(t => t.name === tableName);
  
  if (tableIndex === -1) {
    throw new Error(`Table ${tableName} not found in schema ${schemaId}`);
  }
  
  // Filter out the column to remove
  const updatedTables = [...tables];
  updatedTables[tableIndex] = {
    ...updatedTables[tableIndex],
    columns: (updatedTables[tableIndex].columns || []).filter(c => c.name !== columnName)
  };
  
  // Update the schema
  return await updateSchema(schemaId, { tables: updatedTables });
}

/**
 * Import schema from external format (e.g., SQL, JSON)
 * 
 * @param name Schema name
 * @param description Schema description
 * @param schemaData Schema data in the supported format
 * @param format Format of the import data (e.g., 'sql', 'json')
 * @returns Created schema
 */
export async function importSchema(
  name: string,
  description: string,
  schemaData: string,
  format: 'sql' | 'json'
) {
  // Parse the schema data according to format
  let tables: SchemaTable[] = [];
  
  if (format === 'json') {
    try {
      tables = JSON.parse(schemaData);
    } catch (e) {
      throw new Error('Invalid JSON format for schema import');
    }
  } else if (format === 'sql') {
    // Basic SQL parsing logic - in a real implementation, this would be more sophisticated
    tables = parseSqlToTables(schemaData);
  }
  
  // Create the new schema
  return await createSchema(name, description, tables);
}

/**
 * Export schema to a specific format
 * 
 * @param schemaId Schema ID
 * @param format Export format (e.g., 'sql', 'json')
 * @returns Exported schema string
 */
export async function exportSchema(
  schemaId: string,
  format: 'sql' | 'json'
) {
  // First fetch the schema
  const schema = await fetchSchemaById(schemaId);
  if (!schema) throw new Error(`Schema with ID ${schemaId} not found`);
  
  if (format === 'json') {
    return JSON.stringify(schema.tables || [], null, 2);
  } else if (format === 'sql') {
    // Convert schema to SQL
    return tablesToSql(schema.tables || []);
  }
  
  throw new Error(`Unsupported export format: ${format}`);
}

/**
 * Parse SQL CREATE TABLE statements to schema tables
 */
function parseSqlToTables(sql: string): SchemaTable[] {
  const tables: SchemaTable[] = [];
  
  // Basic regex for CREATE TABLE statements
  // This is a simplistic approach and might not handle all SQL variants
  const tableRegex = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(?:"?(\w+)"?\.)?(?:"?(\w+)"?)\s*\(([\s\S]*?)\);/gi;
  
  let match;
  while ((match = tableRegex.exec(sql)) !== null) {
    const schema = match[1] || 'public';
    const tableName = match[2];
    const tableContent = match[3];
    
    // Parse columns from table content
    const columns: SchemaColumn[] = [];
    const columnLines = tableContent.split(',')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('CONSTRAINT') && !line.startsWith('PRIMARY KEY'));
    
    for (const line of columnLines) {
      const parts = line.split(/\s+/);
      if (parts.length < 2) continue;
      
      const name = parts[0].replace(/"/g, '');
      const sqlType = parts.slice(1).join(' ').toUpperCase();
      
      // Check if column is NOT NULL
      const isNotNull = sqlType.includes('NOT NULL');
      
      // Check if column is a primary key
      const isPrimary = sqlType.includes('PRIMARY KEY');
      
      // Extract comment if present
      let comment = '';
      const commentMatch = line.match(/COMMENT\s+'([^']+)'/i);
      if (commentMatch) {
        comment = commentMatch[1];
      }
      
      // Map SQL types to schema column types
      let type = 'text';
      if (sqlType.includes('INT') || sqlType.includes('NUMERIC') || sqlType.includes('DECIMAL')) {
        type = 'number';
      } else if (sqlType.includes('BOOL')) {
        type = 'boolean';
      } else if (sqlType.includes('DATE') && sqlType.includes('TIME')) {
        type = 'datetime';
      } else if (sqlType.includes('DATE')) {
        type = 'date';
      } else if (sqlType.includes('JSON')) {
        type = 'json';
      }
      
      // Create the column definition
      columns.push({
        name,
        type,
        nullable: !isNotNull,
        isPrimary,
        comment
      });
    }
    
    // Add the table to the result
    tables.push({
      name: tableName,
      displayName: formatTableNameForDisplay(tableName),
      columns
    });
  }
  
  return tables;
}

// Helper function to convert tables to SQL
function tablesToSql(tables: SchemaTable[]): string {
  let sql = '';
  
  tables.forEach(table => {
    sql += `CREATE TABLE "${table.name}" (\n`;
    
    // Add columns
    table.columns.forEach((column, index) => {
      // Map column type to SQL type
      let sqlType = 'TEXT';
      switch (column.type) {
        case 'number':
          sqlType = 'NUMERIC';
          break;
        case 'boolean':
          sqlType = 'BOOLEAN';
          break;
        case 'date':
          sqlType = 'DATE';
          break;
        case 'datetime':
          sqlType = 'TIMESTAMP WITH TIME ZONE';
          break;
        case 'json':
          sqlType = 'JSONB';
          break;
        case 'text':
          sqlType = 'TEXT';
          break;
      }
      
      // Build column definition
      sql += `  "${column.name}" ${sqlType}`;
      
      if (column.required) {
        sql += ' NOT NULL';
      }
      
      if (column.isPrimary) {
        sql += ' PRIMARY KEY';
      }
      
      // Add a comma if not the last column
      if (index < table.columns.length - 1) {
        sql += ',\n';
      } else {
        sql += '\n';
      }
    });
    
    // Add foreign key constraints for reference columns
    const referenceColumns = table.columns.filter(col => 
      col.type === 'reference' && col.reference);
    
    if (referenceColumns.length > 0) {
      sql += ',\n';
      
      referenceColumns.forEach((column, index) => {
        sql += `  FOREIGN KEY ("${column.name}") REFERENCES "${column.reference}" (id)`;
        
        // Add a comma if not the last constraint
        if (index < referenceColumns.length - 1) {
          sql += ',\n';
        } else {
          sql += '\n';
        }
      });
    }
    
    sql += ');\n\n';
    
    // Add comments
    table.columns.forEach(column => {
      if (column.comment) {
        sql += `COMMENT ON COLUMN "${table.name}"."${column.name}" IS '${column.comment.replace(/'/g, "''")}';\n`;
      }
    });
    
    if (table.description) {
      sql += `COMMENT ON TABLE "${table.name}" IS '${table.description.replace(/'/g, "''")}';\n`;
    }
    
    sql += '\n';
  });
  
  return sql;
}

/**
 * Fetch a schema by its name (case-sensitive)
 * @param name Schema name
 * @returns Schema object or null if not found
 */
export async function fetchSchemaByName(name: string) {
  const schemas = await fetchSchemas();
  return schemas.find(s => s.name === name) || null;
}

/**
 * Fetch tables for a given schema name
 * @param schemaName Schema name
 * @returns Array of SchemaTable (or empty array if not found)
 */
export async function fetchTablesForSchema(schemaName: string) {
  const schema = await fetchSchemaByName(schemaName);
  return schema ? schema.tables : [];
}

/**
 * Fetch columns for a given table in a given schema
 * @param schemaName Schema name
 * @param tableName Table name
 * @returns Array of SchemaColumn (or empty array if not found)
 */
export async function fetchColumnsForTable(schemaName: string, tableName: string) {
  const tables = await fetchTablesForSchema(schemaName);
  const table = tables.find(t => t.name === tableName);
  return table ? table.columns : [];
}