# Entity Relationships in the Business Store Service

## Overview

This document explains how entity relationships (like foreign key constraints) defined in a tenant's schema are handled by the Business Store Service API. It clarifies the relationship between the database schema, the tenant schema definition format, and the API behavior regarding related records.

## How Relationships Are Defined

In the tenant schema format, relationships between entities are primarily defined through foreign key constraints within the table definitions. For example:

```json
{
  "schemas": [
    {
      "name": "public",
      "tables": [
        {
          "name": "customers",
          "columns": {
            "id": { "type": "uuid", "nullable": false },
            "name": { "type": "varchar", "length": 100, "nullable": false },
            "email": { "type": "varchar", "length": 255, "nullable": false }
          },
          "primaryKey": ["id"]
        },
        {
          "name": "orders",
          "columns": {
            "id": { "type": "uuid", "nullable": false },
            "customer_id": { "type": "uuid", "nullable": false },
            "amount": { "type": "numeric", "precision": 10, "scale": 2 },
            "status": { "type": "varchar", "length": 20 }
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
              "onDelete": "CASCADE"
            }
          ]
        }
      ]
    }
  ]
}
```

This definition establishes that:
1. Each order is associated with exactly one customer through the `customer_id` field
2. The `customer_id` in orders must reference a valid `id` in the customers table
3. If a customer is deleted, all their orders will be automatically deleted (due to `"onDelete": "CASCADE"`)

## API Behavior with Related Records

### Creating Records with Relationships

When creating a record that references another record (e.g., an order referencing a customer), the API enforces referential integrity at the database level:

**Request:**
```
POST /{tenantId}/data/orders
Content-Type: application/json

{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "customer_id": "33e8400-e29b-41d4-a716-4466554433333", 
  "amount": 199.99,
  "status": "pending"
}
```

**Possible Responses:**

1. Success (201 Created) - If the referenced customer exists:
   ```json
   {
     "id": "550e8400-e29b-41d4-a716-446655440000",
     "customer_id": "33e8400-e29b-41d4-a716-4466554433333",
     "amount": 199.99,
     "status": "pending"
   }
   ```

2. Error (409 Conflict) - If the referenced customer does not exist:
   ```json
   {
     "error": "Foreign key constraint violation",
     "code": "fk_violation",
     "details": {
       "constraint": "fk_order_customer",
       "message": "The referenced customer_id does not exist"
     },
     "incident": "inc_12345"
   }
   ```

### Retrieving Related Records

The Business Store Service API does not automatically expand or join related records. Instead, relationships must be followed manually through separate API calls:

1. First, retrieve an order:
   ```
   GET /{tenantId}/data/orders/550e8400-e29b-41d4-a716-446655440000
   ```

2. Then, retrieve the associated customer using the `customer_id` from the first response:
   ```
   GET /{tenantId}/data/customers/33e8400-e29b-41d4-a716-4466554433333
   ```

### Handling Cascade Operations

For operations like deletes that might trigger cascades:

```
DELETE /{tenantId}/data/customers/33e8400-e29b-41d4-a716-4466554433333
```

If the schema defines `onDelete: "CASCADE"` for orders, then all associated orders will also be deleted when a customer is deleted. The API response does not explicitly indicate the cascade effect but returns:

```
204 No Content
```

## Advanced Relationship Patterns

### Many-to-Many Relationships

For many-to-many relationships, tenants should define a junction/join table in their schema:

```json
{
  "schemas": [
    {
      "name": "public",
      "tables": [
        {
          "name": "products",
          "columns": {
            "id": { "type": "uuid", "nullable": false },
            "name": { "type": "varchar", "length": 100 }
          },
          "primaryKey": ["id"]
        },
        {
          "name": "tags",
          "columns": {
            "id": { "type": "uuid", "nullable": false },
            "name": { "type": "varchar", "length": 50 }
          },
          "primaryKey": ["id"]
        },
        {
          "name": "product_tags", // Junction table
          "columns": {
            "product_id": { "type": "uuid", "nullable": false },
            "tag_id": { "type": "uuid", "nullable": false }
          },
          "primaryKey": ["product_id", "tag_id"],
          "foreignKeys": [
            {
              "name": "fk_product_tag_product",
              "columns": ["product_id"],
              "references": {
                "table": "products",
                "columns": ["id"]
              },
              "onDelete": "CASCADE"
            },
            {
              "name": "fk_product_tag_tag",
              "columns": ["tag_id"],
              "references": {
                "table": "tags",
                "columns": ["id"]
              },
              "onDelete": "CASCADE"
            }
          ]
        }
      ]
    }
  ]
}
```

The API would interact with this junction table as a normal resource:

```
POST /{tenantId}/data/product_tags
{
  "product_id": "product-uuid-here",
  "tag_id": "tag-uuid-here"
}
```

### Self-Referencing Relationships

For hierarchical structures like categories, a table can reference itself:

```json
{
  "name": "categories",
  "columns": {
    "id": { "type": "uuid", "nullable": false },
    "name": { "type": "varchar", "length": 100 },
    "parent_id": { "type": "uuid", "nullable": true }
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
  ]
}
```

## Recommendations and Best Practices

1. **Validate Before Submission**: Applications should validate the existence of referenced entities before attempting to create or update records to avoid 409 Conflict errors.

2. **Use Batch Operations**: For creating related records, consider using batch operations where supported to minimize API calls.

3. **Consider Cascades Carefully**: Choose appropriate cascade behaviors (`onDelete`, `onUpdate`) in your schema definition based on your business requirements. For critical data, consider `RESTRICT` over `CASCADE` to prevent accidental mass deletions.

4. **Use Transaction Endpoints**: For operations that need to maintain consistency across multiple related records, use API endpoints that support transactions (if available) or implement retries and rollback logic in your application.

## Example Scenario: Order Management

In this complete example, we'll define a schema with customers, products, orders, and order_items, and show API interactions:

```json
{
  "schemaVersion": "1.0.0",
  "schemas": [
    {
      "name": "public",
      "tables": [
        {
          "name": "customers",
          "columns": {
            "id": { "type": "uuid", "nullable": false, "default": "uuid_generate_v4()" },
            "name": { "type": "varchar", "length": 100, "nullable": false },
            "email": { "type": "varchar", "length": 255, "nullable": false }
          },
          "primaryKey": ["id"],
          "unique": [
            {
              "name": "customers_email_key",
              "columns": ["email"]
            }
          ]
        },
        {
          "name": "products",
          "columns": {
            "id": { "type": "uuid", "nullable": false, "default": "uuid_generate_v4()" },
            "name": { "type": "varchar", "length": 100, "nullable": false },
            "price": { "type": "numeric", "precision": 10, "scale": 2, "nullable": false },
            "stock": { "type": "integer", "nullable": false, "default": "0" }
          },
          "primaryKey": ["id"]
        },
        {
          "name": "orders",
          "columns": {
            "id": { "type": "uuid", "nullable": false, "default": "uuid_generate_v4()" },
            "customer_id": { "type": "uuid", "nullable": false },
            "order_date": { "type": "timestamp", "withTimeZone": true, "default": "NOW()" },
            "status": { "type": "varchar", "length": 20, "default": "'pending'" }
          },
          "primaryKey": ["id"],
          "foreignKeys": [
            {
              "name": "fk_order_customer",
              "columns": ["customer_id"],
              "references": {
                "table": "customers",
                "columns": ["id"]
              }
            }
          ]
        },
        {
          "name": "order_items",
          "columns": {
            "order_id": { "type": "uuid", "nullable": false },
            "product_id": { "type": "uuid", "nullable": false },
            "quantity": { "type": "integer", "nullable": false },
            "price": { "type": "numeric", "precision": 10, "scale": 2, "nullable": false }
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
              }
            }
          ],
          "checks": [
            {
              "name": "positive_quantity",
              "expression": "quantity > 0"
            }
          ]
        }
      ]
    }
  ],
  "extensions": ["uuid-ossp"]
}
```

### API Interaction Sequence

1. **Create a customer**:
   ```
   POST /{tenantId}/data/customers
   { "name": "Jane Doe", "email": "jane@example.com" }
   ```
   
   Response:
   ```json
   {
     "id": "c001-uuid",
     "name": "Jane Doe",
     "email": "jane@example.com"
   }
   ```

2. **Create products**:
   ```
   POST /{tenantId}/data/products
   { "name": "Product A", "price": 29.99, "stock": 100 }
   ```
   
   Response:
   ```json
   {
     "id": "p001-uuid",
     "name": "Product A",
     "price": 29.99,
     "stock": 100
   }
   ```

3. **Create an order** (references customer):
   ```
   POST /{tenantId}/data/orders
   { "customer_id": "c001-uuid" }
   ```
   
   Response:
   ```json
   {
     "id": "o001-uuid",
     "customer_id": "c001-uuid",
     "order_date": "2023-04-15T10:30:00Z",
     "status": "pending"
   }
   ```

4. **Add order items** (references both order and product):
   ```
   POST /{tenantId}/data/order_items
   { 
     "order_id": "o001-uuid", 
     "product_id": "p001-uuid", 
     "quantity": 2, 
     "price": 29.99 
   }
   ```
   
   Response:
   ```json
   { 
     "order_id": "o001-uuid", 
     "product_id": "p001-uuid", 
     "quantity": 2, 
     "price": 29.99 
   }
   ```

5. **Attempt to delete a product referenced by an order**:
   ```
   DELETE /{tenantId}/data/products/p001-uuid
   ```
   
   Response (since there's no `onDelete` cascade specified for product references):
   ```json
   {
     "error": "Foreign key constraint violation",
     "code": "fk_violation",
     "details": {
       "constraint": "fk_order_item_product",
       "message": "Cannot delete product because it is referenced by order items"
     },
     "incident": "inc_12345"
   }
   ```

6. **Retrieve all items in an order** (traversing the relationship):
   ```
   GET /{tenantId}/data/order_items?filter[order_id]=o001-uuid
   ```
   
   Response:
   ```json
   {
     "results": [
       { 
         "order_id": "o001-uuid", 
         "product_id": "p001-uuid", 
         "quantity": 2, 
         "price": 29.99 
       }
     ],
     "pagination": {
       "limit": 50,
       "offset": 0,
       "total": 1
     }
   }
   ```

7. **Delete an order** (which cascades to order items):
   ```
   DELETE /{tenantId}/data/orders/o001-uuid
   ```
   
   Response:
   ```
   204 No Content
   ```
   
   Note: Due to the `onDelete: "CASCADE"` on the order_items table's foreign key, all items for this order are automatically deleted.

## Conclusion

The Business Store Service enforces relationship integrity at the database level based on the constraints defined in the tenant schema. While the API itself is resource-centric and doesn't directly expose relationships as navigable paths, it ensures that all constraints are honored when creating, updating, or deleting records.

For complex operations involving multiple related records, clients should implement appropriate workflows using the available API endpoints, keeping in mind the cascade rules and constraint behaviors defined in the schema. 