# Tenant Schema Format Specification

## Overview

This document specifies the JSON format used by tenants to define their custom database schema within the Business Store Service. The goal is an infrastructure-as-code approach where this JSON document fully represents the desired PostgreSQL schema, enabling automated validation and reliable conversion to SQL DDL.

This format is designed to capture the richness of PostgreSQL features, including tables, columns, constraints, indexes, relationships, views, functions, triggers, and partitioning.

## Top-Level Structure

The root of the JSON document is an object that can contain the following top-level keys:


```markdown
{
  "schemaVersion": "1.0.0", // Optional: Semantic version of the schema definition itself.
  "extensions": ["uuid-ossp", "postgis"], // Optional: List of required PostgreSQL extensions.
  "schemas": [ ... ], // Required: An array of schema definitions (namespaces).
  // Global definitions (Optional - could also be nested within schemas):
  "enums": [ ... ],
  "compositeTypes": [ ... ],
  "functions": [ ... ],
  "views": [ ... ],
  "triggers": [ ... ],
  "indexes": [ ... ] // For indexes defined globally, referencing tables via schema.table notation.
}
```

## Schemas (Namespaces)

The `schemas` array contains objects, each defining a PostgreSQL schema (namespace).

```json
{
  "schemas": [
    {
      "name": "public", // Required: Name of the schema (e.g., "public", "sales").
      "tables": [ ... ], // Array of table definitions within this schema.
      "enums": [ ... ], // Enums specific to this schema.
      "compositeTypes": [ ... ], // Composite types specific to this schema.
      "functions": [ ... ], // Functions specific to this schema.
      "views": [ ... ], // Views specific to this schema.
      "triggers": [ ... ], // Triggers specific to this schema (referencing tables within).
      "indexes": [ ... ] // Indexes specific to this schema (referencing tables within).
      "comment": "Optional description of the schema."
    }
    // ... other schemas
  ]
}
```

## Table Definitions

Each entry in a schema's `tables` array defines a table.

```json
{
  "name": "orders", // Required: Name of the table.
  "columns": { ... }, // Required: Map of column definitions (see below).
  "primaryKey": { ... } | ["col1", "col2"], // Optional: Primary key definition.
  "unique": [ ... ], // Optional: Array of unique constraint definitions.
  "checks": [ ... ], // Optional: Array of check constraint definitions.
  "foreignKeys": [ ... ], // Optional: Array of foreign key definitions.
  "indexes": [ ... ], // Optional: Array of index definitions specific to this table.
  "partitionBy": { ... }, // Optional: Defines partitioning for the table.
  "partitions": [ ... ], // Optional: List of child partitions (if table is partitioned).
  "comment": "Optional description of the table."
  // Other table options like tablespace could be added here.
}
```

### Column Definitions

The `columns` object within a table definition is a map where keys are column names and values are column definition objects.

```json
{
  "columns": {
    "order_id": { "type": "integer", "nullable": false },
    "customer_id": { "type": "uuid", "nullable": false },
    "email": { "type": "varchar", "length": 255, "nullable": false },
    "status": { "type": "order_status_enum", "nullable": true, "default": "'pending'" }, // References a user-defined enum
    "created_at": { "type": "timestamp", "withTimeZone": true, "default": "NOW()", "comment": "Creation timestamp" },
    "height_in": { "type": "numeric", "generated": "height_cm / 2.54", "stored": true }, // Generated column (stored is implicit in PG)
    "tags": { "type": "text", "array": true } // Example of a text array
  }
}
```

**Column Properties:**

* `type` (string, Required): The data type name (see Data Type Mapping below).
* `nullable` (boolean, Optional): If `false`, corresponds to `NOT NULL`. Defaults to `true` (nullable).
* `default` (string, Optional): A SQL expression or literal for the default value (e.g., `"NOW()"`, `"'pending'"`, `"1"`).
* `generated` (string, Optional): An SQL expression for a generated column value.
* `stored` (boolean, Optional): For generated columns. PostgreSQL only supports `true` (stored), which is the implicit default if `generated` is present.
* `comment` (string, Optional): Description for the column.
* `array` (boolean, Optional): Set to `true` if this is an array of the base `type`.
* `dimensions` (integer, Optional): For multi-dimensional arrays (rarely needed). Defaults to 1 if `array` is true.
* *Type-Specific Parameters*:
  * `length` (integer): For `varchar`, `char`.
  * `precision` (integer): For `numeric`, `timestamp`, `time`, `interval`.
  * `scale` (integer): For `numeric`.
  * `withTimeZone` (boolean): For `timestamp`, `time`.
  * `identity` (boolean | object, Optional): For auto-incrementing integers (alternative to `serial`). If `true`, uses defaults. Can be an object for detailed `GENERATED AS IDENTITY` options.
  * `srid` (integer): For `geometry`, `geography` types.
  * `geometryType` (string): For `geometry`, `geography` (e.g., `"Point"`, `"Polygon"`).

### Constraint Definitions

**Primary Key (**`primaryKey`)

Can be an array of column names or an object:

```json
// Simple PK
"primaryKey": ["id"]

// Composite PK with explicit name
"primaryKey": {
  "name": "orders_pkey",
  "columns": ["order_id", "tenant_id"]
}
```

**Unique Constraints (**`unique`)

An array of unique constraint objects:

```json
"unique": [
  {
    "name": "users_email_key",
    "columns": ["email"]
    // Partial unique constraints are defined via unique indexes with a 'where' clause (see Indexes)
  }
]
```

**Check Constraints (**`checks`)

An array of check constraint objects:

```json
"checks": [
  {
    "name": "positive_price", // Optional name
    "expression": "price > 0"
  }
]
```

**Foreign Keys (**`foreignKeys`)

An array of foreign key objects:

```json
"foreignKeys": [
  {
    "name": "fk_order_customer", // Optional name
    "columns": ["customer_id"], // Local column(s)
    "references": { // Required reference details
      "schema": "public", // Optional, defaults to same schema
      "table": "customers", // Required referenced table
      "columns": ["id"] // Required referenced column(s) - must be PK or UNIQUE
    },
    "onDelete": "CASCADE", // Optional: CASCADE, RESTRICT, NO ACTION, SET NULL, SET DEFAULT. Defaults to NO ACTION.
    "onUpdate": "NO ACTION", // Optional: Same options as onDelete.
    "deferrable": true, // Optional boolean
    "initiallyDeferred": true // Optional boolean (requires deferrable: true)
  }
]
```

### Partitioning Definitions

If a table is partitioned, use `partitionBy` and `partitions`.

```json
"partitionBy": {
  "type": "RANGE", // Required: RANGE, LIST, or HASH
  "columns": ["order_date"] // Required: Column(s) or expression(s)
},
"partitions": [
  {
    "name": "orders_2024",
    "values": "FROM ('2024-01-01') TO ('2025-01-01')" // Required: SQL clause defining partition bounds/values
    // Partitions can optionally contain their own 'indexes', 'checks' etc.
  },
  {
    "name": "orders_2025",
    "values": "FROM ('2025-01-01') TO ('2026-01-01')"
  }
]
```

## Index Definitions

Indexes can be defined within a table's `indexes` array or globally.

```json
"indexes": [
  {
    "name": "idx_orders_customer_active", // Required: Index name (unique per schema).
    "table": "orders", // Required if index is defined globally, inferred if within a table definition.
    "columns": ["customer_id"], // Required (unless 'expression' used): Array of column names or objects for opclass/collation.
    // OR
    "expression": "LOWER(name)", // Use instead of 'columns' for functional indexes.

    "method": "BTREE", // Optional: BTREE, HASH, GIN, GIST, SPGIST, BRIN. Defaults to BTREE.
    "unique": true, // Optional: Defaults to false.
    "concurrent": true, // Optional: If true, generate CREATE INDEX CONCURRENTLY. Defaults to false.
    "where": "status = 'ACTIVE'", // Optional: SQL predicate for partial indexes.
    "include": ["email", "phone"], // Optional: Array of column names for covering indexes.
    "comment": "Optional index description."
  },
  // Example with opclass/collation per column:
  {
    "name": "idx_trgm_title",
    "table": "posts",
    "method": "GIN",
    "columns": [
      { "name": "title", "opclass": "gin_trgm_ops", "collation": "C" }
    ]
  }
]
```

## View Definitions

Define SQL views.

```json
"views": [
  {
    "name": "active_customers", // Required: View name.
    "definition": "SELECT id, name FROM customers WHERE active = true", // Required: SQL SELECT query.
    "materialized": true, // Optional: Set to true for MATERIALIZED VIEW. Defaults to false.
    "checkOption": "LOCAL" // Optional: "LOCAL" or "CASCADED" for WITH CHECK OPTION.
    "comment": "Optional view description."
  }
]
```

## Function/Procedure Definitions

Define user-defined functions or procedures.

```json
"functions": [
  {
    "name": "update_timestamp", // Required: Function name.
    "language": "plpgsql", // Required: e.g., plpgsql, sql, c.
    "args": [ // Optional: Array of argument definitions.
      // {"name": "arg1", "type": "integer"}, ... (arg names optional)
      // Or just types: ["integer", "text"]
    ],
    "returns": "trigger", // Required: Return type (e.g., integer, text, void, trigger, setof sometype).
    "body": "BEGIN NEW.updated_at := NOW(); RETURN NEW; END;", // Required: Function body as a string.
    "volatility": "VOLATILE", // Optional: VOLATILE, STABLE, IMMUTABLE.
    "security": "INVOKER", // Optional: INVOKER or DEFINER.
    "comment": "Optional function description."
    // Other function options (strict, cost, rows, etc.) can be added.
  }
]
```

## Trigger Definitions

Define triggers on tables.

```json
"triggers": [
  {
    "name": "set_update_time", // Required: Trigger name.
    "table": "orders", // Required: Target table name.
    "timing": "BEFORE", // Required: BEFORE, AFTER, INSTEAD OF.
    "events": ["INSERT", "UPDATE"], // Required: Array of INSERT, UPDATE, DELETE, TRUNCATE.
    "function": "update_timestamp", // Required: Name of the function to execute (must return trigger).
    "forEach": "ROW", // Optional: ROW or STATEMENT. Defaults to STATEMENT (Note: Source doc default differs, but STATEMENT is PG default). Let's stick to ROW as common default for trigger logic.
    "when": "OLD.status IS DISTINCT FROM NEW.status" // Optional: SQL condition for WHEN clause.
    "comment": "Optional trigger description."
  }
]
```

## Data Type Mapping

Map standard JSON types and custom strings/objects to PostgreSQL types:

* **Numeric Types:**
  * `"smallint"` -> `SMALLINT`
  * `"integer"` -> `INTEGER`
  * `"bigint"` -> `BIGINT`
  * `{"type": "numeric", "precision": P, "scale": S}` -> `NUMERIC(P, S)` (P, S optional)
  * `"real"` -> `REAL`
  * `"double precision"` -> `DOUBLE PRECISION`
  * `"serial"` -> `SERIAL` (Convenience pseudo-type)
  * `"bigserial"` -> `BIGSERIAL` (Convenience pseudo-type)
  * `{"type": "integer", "identity": true}` -> `INTEGER GENERATED BY DEFAULT AS IDENTITY` (Recommended over `serial`)
* **Textual Types:**
  * `"text"` -> `TEXT` (Unbounded)
  * `{"type": "varchar", "length": N}` -> `VARCHAR(N)`
  * `{"type": "char", "length": N}` -> `CHAR(N)`
  * `"citext"` -> `CITEXT` (Requires `citext` extension)
* **Boolean Type:**
  * `"boolean"` or `"bool"` -> `BOOLEAN`
* **Date/Time Types:**
  * `"date"` -> `DATE`
  * `{"type": "time", "withTimeZone": B, "precision": P}` -> `TIME(P) [WITHOUT | WITH] TIME ZONE` (P, B optional)
  * `{"type": "timestamp", "withTimeZone": B, "precision": P}` -> `TIMESTAMP(P) [WITHOUT | WITH] TIME ZONE` (P, B optional)
  * `"timestamptz"` (shorthand for `timestamp` with `withTimeZone: true`)
  * `"interval"` -> `INTERVAL`
* **Binary Data:**
  * `"bytea"` -> `BYTEA`
* **UUID:**
  * `"uuid"` -> `UUID`
* **JSON Data:**
  * `"json"` -> `JSON`
  * `"jsonb"` -> `JSONB` (Recommended default if ambiguous)
* **Arrays:** Use `"array": true` property on a column definition. E.g., `{"type": "integer", "array": true}` -> `INTEGER[]`. Use `"dimensions": N` for N-dimensions.
* **Enumerated Types:** Define globally or per-schema using `enums` array, then reference by name in column `type`.

  ```json
  "enums": [
    { "name": "mood_type", "values": ["sad", "ok", "happy"] }
  ]
  // Column: { "type": "mood_type" } -> uses mood_type enum
  ```
* **Composite Types:** Define globally or per-schema using `compositeTypes` array, then reference by name in column `type`.

  ```json
  "compositeTypes": [
    { "name": "address_type", "attributes": { "street": "text", "city": "text", "zip": "integer" } }
  ]
  // Column: { "type": "address_type" } -> uses address_type composite
  ```
* **Geometric & Network Types:** Use standard PG names directly as `type` string: `"point"`, `"line"`, `"lseg"`, `"box"`, `"path"`, `"polygon"`, `"circle"`, `"inet"`, `"cidr"`, `"macaddr"`, `"macaddr8"`.
* **PostGIS Types:** Requires `postgis` extension. Use structured type:

  ```json
  {
    "type": "geometry",
    "geometryType": "Point", // Optional: Point, Polygon, etc.
    "srid": 4326 // Optional: Spatial Reference ID. Defaults to 0.
  }
  // Similarly for "geography" type.
  ```
* **Other/Custom Types:** Any unrecognized `type` string will be treated as a reference to a custom or user-defined type assumed to exist in the database or defined elsewhere in the JSON (e.g., enums, composites).

## Extensions

Specify required PostgreSQL extensions using the top-level `extensions` array. The conversion tool should generate `CREATE EXTENSION IF NOT EXISTS ...;` statements before other DDL.

```json
"extensions": ["uuid-ossp", "pg_trgm", "citext", "postgis"]
```

## Validation Rules Summary

The conversion tool (and potentially a JSON Schema validator for this format) should enforce rules including:

* Referential integrity within the JSON (FKs reference valid tables/columns, triggers reference existing functions, etc.).
* Name uniqueness where required (tables/types/functions/views within a schema, indexes per schema, constraints per table).
* Type compatibility (e.g., FK column types must match referenced column types).
* Constraint validity (e.g., CHECK expressions refer to valid columns).
* Partition definition consistency (e.g., `values` match `partitionBy.type`).
* Absence of dependency cycles that cannot be resolved (e.g., view A selects view B, view B selects view A).

## Versioning

The optional top-level `schemaVersion` field allows tracking the version of the schema definition itself using semantic versioning (e.g., `"1.2.0"`). This is primarily for human tracking and documentation. Schema evolution and migration strategies (like expand-and-contract) are processes applied *using* this format, potentially comparing different versions of this JSON file.

## Complete Example with Relationships

Below is a complete example of a tenant schema definition that includes multiple related tables with foreign key constraints:

```json
{
  "schemaVersion": "1.0.0",
  "extensions": ["uuid-ossp", "pgcrypto"],
  "schemas": [
    {
      "name": "public",
      "tables": [
        {
          "name": "customers",
          "columns": {
            "id": { 
              "type": "uuid", 
              "nullable": false, 
              "default": "uuid_generate_v4()" 
            },
            "name": { 
              "type": "varchar", 
              "length": 100, 
              "nullable": false 
            },
            "email": { 
              "type": "varchar", 
              "length": 255, 
              "nullable": false 
            },
            "status": {
              "type": "varchar",
              "length": 20,
              "default": "'active'"
            },
            "created_at": {
              "type": "timestamp",
              "withTimeZone": true,
              "default": "NOW()",
              "nullable": false
            }
          },
          "primaryKey": ["id"],
          "unique": [
            {
              "name": "customers_email_key",
              "columns": ["email"]
            }
          ],
          "indexes": [
            {
              "name": "idx_customer_email",
              "columns": ["email"]
            },
            {
              "name": "idx_customer_status",
              "columns": ["status"]
            }
          ]
        },
        {
          "name": "addresses",
          "columns": {
            "id": { 
              "type": "uuid", 
              "nullable": false, 
              "default": "uuid_generate_v4()" 
            },
            "customer_id": { 
              "type": "uuid", 
              "nullable": false 
            },
            "type": {
              "type": "varchar",
              "length": 20,
              "nullable": false
            },
            "street": { 
              "type": "varchar", 
              "length": 200, 
              "nullable": false 
            },
            "city": { 
              "type": "varchar", 
              "length": 100, 
              "nullable": false 
            },
            "state": { 
              "type": "varchar", 
              "length": 50 
            },
            "postal_code": { 
              "type": "varchar", 
              "length": 20
            },
            "country": { 
              "type": "varchar", 
              "length": 50, 
              "nullable": false 
            },
            "is_default": {
              "type": "boolean",
              "default": "false",
              "nullable": false
            }
          },
          "primaryKey": ["id"],
          "foreignKeys": [
            {
              "name": "fk_address_customer",
              "columns": ["customer_id"],
              "references": {
                "table": "customers",
                "columns": ["id"]
              },
              "onDelete": "CASCADE"
            }
          ]
        },
        {
          "name": "products",
          "columns": {
            "id": { 
              "type": "uuid", 
              "nullable": false, 
              "default": "uuid_generate_v4()" 
            },
            "name": { 
              "type": "varchar", 
              "length": 100, 
              "nullable": false 
            },
            "description": { 
              "type": "text" 
            },
            "price": { 
              "type": "numeric", 
              "precision": 10, 
              "scale": 2, 
              "nullable": false 
            },
            "inventory_count": {
              "type": "integer",
              "default": "0",
              "nullable": false
            },
            "category_id": {
              "type": "uuid",
              "nullable": true
            },
            "created_at": {
              "type": "timestamp",
              "withTimeZone": true,
              "default": "NOW()",
              "nullable": false
            }
          },
          "primaryKey": ["id"],
          "foreignKeys": [
            {
              "name": "fk_product_category",
              "columns": ["category_id"],
              "references": {
                "table": "categories",
                "columns": ["id"]
              },
              "onDelete": "SET NULL"
            }
          ],
          "checks": [
            {
              "name": "check_positive_price",
              "expression": "price > 0"
            }
          ]
        },
        {
          "name": "categories",
          "columns": {
            "id": { 
              "type": "uuid", 
              "nullable": false, 
              "default": "uuid_generate_v4()" 
            },
            "name": { 
              "type": "varchar", 
              "length": 50, 
              "nullable": false 
            },
            "parent_id": {
              "type": "uuid",
              "nullable": true
            }
          },
          "primaryKey": ["id"],
          "foreignKeys": [
            {
              "name": "fk_category_parent",
              "columns": ["parent_id"],
              "references": {
                "table": "categories",
                "columns": ["id"]
              },
              "onDelete": "SET NULL"
            }
          ],
          "unique": [
            {
              "name": "categories_name_key",
              "columns": ["name"]
            }
          ]
        },
        {
          "name": "orders",
          "columns": {
            "id": { 
              "type": "uuid", 
              "nullable": false, 
              "default": "uuid_generate_v4()" 
            },
            "customer_id": { 
              "type": "uuid", 
              "nullable": false 
            },
            "order_date": {
              "type": "timestamp",
              "withTimeZone": true,
              "default": "NOW()",
              "nullable": false
            },
            "status": {
              "type": "order_status",
              "nullable": false,
              "default": "'pending'"
            },
            "shipping_address_id": {
              "type": "uuid",
              "nullable": true
            },
            "total_amount": {
              "type": "numeric",
              "precision": 12,
              "scale": 2,
              "nullable": false
            },
            "notes": {
              "type": "text"
            }
          },
          "primaryKey": ["id"],
          "foreignKeys": [
            {
              "name": "fk_order_customer",
              "columns": ["customer_id"],
              "references": {
                "table": "customers",
                "columns": ["id"]
              },
              "onDelete": "RESTRICT"
            },
            {
              "name": "fk_order_address",
              "columns": ["shipping_address_id"],
              "references": {
                "table": "addresses",
                "columns": ["id"]
              },
              "onDelete": "SET NULL"
            }
          ],
          "indexes": [
            {
              "name": "idx_order_customer",
              "columns": ["customer_id"]
            },
            {
              "name": "idx_order_date",
              "columns": ["order_date"]
            },
            {
              "name": "idx_order_status",
              "columns": ["status"]
            }
          ]
        },
        {
          "name": "order_items",
          "columns": {
            "order_id": { 
              "type": "uuid", 
              "nullable": false 
            },
            "product_id": { 
              "type": "uuid", 
              "nullable": false 
            },
            "quantity": { 
              "type": "integer", 
              "nullable": false 
            },
            "unit_price": { 
              "type": "numeric", 
              "precision": 10, 
              "scale": 2, 
              "nullable": false 
            },
            "line_total": {
              "type": "numeric",
              "precision": 12,
              "scale": 2,
              "generated": "quantity * unit_price",
              "stored": true
            }
          },
          "primaryKey": ["order_id", "product_id"],
          "foreignKeys": [
            {
              "name": "fk_order_item_order",
              "columns": ["order_id"],
              "references": {
                "table": "orders",
                "columns": ["id"]
              },
              "onDelete": "CASCADE"
            },
            {
              "name": "fk_order_item_product",
              "columns": ["product_id"],
              "references": {
                "table": "products",
                "columns": ["id"]
              },
              "onDelete": "RESTRICT"
            }
          ],
          "checks": [
            {
              "name": "check_positive_quantity",
              "expression": "quantity > 0"
            }
          ]
        }
      ],
      "enums": [
        {
          "name": "order_status",
          "values": ["pending", "processing", "shipped", "delivered", "canceled"]
        }
      ],
      "views": [
        {
          "name": "customer_order_summary",
          "definition": "SELECT c.id AS customer_id, c.name, c.email, COUNT(o.id) AS order_count, SUM(o.total_amount) AS total_spent FROM customers c LEFT JOIN orders o ON c.id = o.customer_id GROUP BY c.id, c.name, c.email"
        }
      ]
    }
  ]
}
```

This example demonstrates several relationship patterns:

1. **One-to-Many relationships**: 
   - Each customer can have multiple addresses (customer_id in addresses)
   - Each customer can have multiple orders (customer_id in orders)
   - Each category can have multiple products (category_id in products)
   - Each order can have multiple order items (order_id in order_items)

2. **Many-to-Many relationships**:
   - Orders and Products are related through the order_items junction table

3. **Self-referencing relationships**:
   - Categories can have parent categories (parent_id in categories)

4. **Different cascade behaviors**:
   - CASCADE: When a customer is deleted, all their addresses are deleted (fk_address_customer)
   - RESTRICT: Prevents deleting a customer if they have orders (fk_order_customer)
   - SET NULL: If a category is deleted, products in that category have their category_id set to NULL (fk_product_category)

For more details on how these relationships are handled by the API, see [Entity Relationships in the Business Store Service](./relationship_handling.md).


