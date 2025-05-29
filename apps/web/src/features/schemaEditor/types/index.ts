/**
 * Schema Editor Types
 * 
 * Type definitions for the schema editor feature
 */

/**
 * Summary of a database schema for the schema list/selector
 */
export interface SchemaSummary {
  /** Unique identifier for the schema */
  id: string;
  /** Display name of the schema */
  name: string;
  /** Optional description of the schema purpose */
  description?: string;
  /** Creation timestamp */
  created_at?: string;
  /** Last update timestamp */
  updated_at?: string;
}

/**
 * Definition of a table column
 */
export interface SchemaColumn {
  /** Column name (must be valid identifier) */
  name: string;
  /** Display name shown in the UI */
  displayName?: string;
  /** Data type of the column (e.g., "varchar", "timestamp with time zone", "numeric") */
  type: string;
  /** Whether this column can be null */
  nullable: boolean;
  /** Default value expression */
  default?: string;
  /** Description/comment for this column */
  comment?: string;
  /** For reference type, the table being referenced */
  reference?: string;
  /** Character length for varchar/char types */
  length?: number;
  /** Precision for numeric, timestamp types */
  precision?: number;
  /** Scale for numeric types */
  scale?: number;
  /** Whether this column is an array of the specified type */
  array?: boolean;
  /** Whether timestamp/time includes timezone information */
  withTimeZone?: boolean;
  /** Legacy - to be removed after UI updates */
  isPrimary?: boolean;
  /** Legacy - to be removed after UI updates */
  required?: boolean;
}

/**
 * Definition of a database table
 */
export interface SchemaTable {
  /** Table name (must be valid identifier) */
  name: string;
  /** Display name shown in the UI */
  displayName: string;
  /** Description of the table purpose */
  description?: string;
  /** Columns in this table */
  columns: SchemaColumn[];
  /** Primary key definition */
  primaryKey?: string[] | {
    name?: string;
    columns: string[];
  };
  /** Foreign key constraints */
  foreignKeys?: Array<{
    name?: string;
    columns: string[];
    references: {
      schema?: string;
      table: string;
      columns: string[];
    };
    onDelete?: 'CASCADE' | 'RESTRICT' | 'NO ACTION' | 'SET NULL' | 'SET DEFAULT';
    onUpdate?: 'CASCADE' | 'RESTRICT' | 'NO ACTION' | 'SET NULL' | 'SET DEFAULT';
  }>;
  /** Unique constraints */
  uniqueConstraints?: Array<{
    name?: string;
    columns: string[];
  }>;
  /** Indexes */
  indexes?: Array<{
    name: string;
    columns: string[] | Array<{
      name: string;
      opclass?: string;
      collation?: string;
    }>;
    method?: 'BTREE' | 'HASH' | 'GIN' | 'GIST' | 'SPGIST' | 'BRIN';
    unique?: boolean;
    where?: string;
  }>;
}

/**
 * Complete database schema
 */
export interface Schema {
  /** Collection of tables in this schema */
  tables: SchemaTable[];
}

/**
 * Schema editor state
 */
export interface SchemaEditorState {
  /** Current schema being edited */
  schema: Schema;
  /** Currently selected table name */
  selectedTable: string | null;
  /** Whether editor is in edit mode */
  editMode: boolean;
  /** Currently selected field/column name */
  selectedField: string | null;
} 