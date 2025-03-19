# Roles

## Overview

The Roles schema defines the structure for role-based access control (RBAC) within the Augmented OS platform. Roles provide a way to group permissions together and assign them to users or service accounts, allowing for efficient management of access rights. The Roles schema is designed to support hierarchical roles, fine-grained permission assignment, and integration with external identity providers.

## Key Concepts

* **Role Assignment**: The process of associating roles with users or service accounts
* **Permission Grouping**: Combining permissions into logical sets
* **Role Hierarchies**: Relationships between roles allowing for inheritance
* **System Roles**: Pre-defined roles with special meaning in the system
* **Custom Roles**: User-defined roles for specific business needs
* **Role Constraints**: Conditions under which roles are effective

## Role Structure

```json
{
  "id": "role_123456789",         // Unique identifier
  "name": "admin",                // Role name (unique)
  "description": "Administrator", // Human-readable description
  "permissions": [                // List of permission IDs
    "perm_create_user",
    "perm_update_user",
    "perm_delete_user",
    "perm_read_logs"
  ],
  "parentRoles": ["user"],        // Optional parent roles for inheritance
  "isSystem": true,               // Whether this is a system-defined role
  "metadata": {                   // Custom metadata
    "scope": "global",            // Role scope
    "category": "administrative"  // Role category
  },
  "constraints": {                // Optional constraints on role applicability
    "environments": ["production", "staging"],
    "timeRestrictions": {
      "daysOfWeek": [1, 2, 3, 4, 5], // Monday to Friday
      "hoursOfDay": [9, 10, 11, 12, 13, 14, 15, 16, 17] // 9 AM to 5 PM
    }
  },
  "createdAt": "2023-01-01T00:00:00Z", // Creation timestamp
  "updatedAt": "2023-01-15T00:00:00Z"  // Last update timestamp
}
```

## Core Role Types

The Roles schema includes several core role types that are common in most deployments:

### System Roles

System roles are pre-defined and have special meaning within the system:

* **admin**: Full system administrator with all permissions
* **user**: Standard user with basic permissions
* **service**: Role for service accounts
* **readonly**: Read-only access across the system
* **guest**: Limited access for guest users

Example system role:

```json
{
  "id": "role_system_admin",
  "name": "admin",
  "description": "System Administrator with full access",
  "permissions": ["*"],
  "isSystem": true,
  "metadata": {
    "scope": "global",
    "category": "system"
  },
  "createdAt": "2023-01-01T00:00:00Z",
  "updatedAt": "2023-01-01T00:00:00Z"
}
```

### Functional Roles

Functional roles represent common job functions or responsibilities:

* **workflow_designer**: Can create and modify workflows
* **workflow_operator**: Can execute and monitor workflows
* **integration_manager**: Can configure and manage integrations
* **analytics_viewer**: Can view analytics and reports
* **user_manager**: Can manage user accounts

Example functional role:

```json
{
  "id": "role_workflow_designer",
  "name": "workflow_designer",
  "description": "Can create and modify workflow definitions",
  "permissions": [
    "perm_create_workflow",
    "perm_update_workflow",
    "perm_delete_workflow",
    "perm_read_workflow",
    "perm_test_workflow"
  ],
  "parentRoles": ["user"],
  "isSystem": false,
  "metadata": {
    "scope": "global",
    "category": "functional"
  },
  "createdAt": "2023-01-15T00:00:00Z",
  "updatedAt": "2023-01-15T00:00:00Z"
}
```

### Custom Roles

Custom roles are defined by administrators for specific business needs:

* **department_admin**: Department-specific administrator
* **project_manager**: Manager for specific projects
* **external_auditor**: External user with audit permissions
* **temporary_access**: Temporary access for contractors

Example custom role:

```json
{
  "id": "role_dept_admin_engineering",
  "name": "department_admin_engineering",
  "description": "Administrator for Engineering department",
  "permissions": [
    "perm_read_user",
    "perm_update_user_in_department",
    "perm_read_workflow_in_department",
    "perm_execute_workflow_in_department"
  ],
  "parentRoles": ["user"],
  "isSystem": false,
  "metadata": {
    "scope": "department",
    "department": "engineering",
    "category": "custom"
  },
  "constraints": {
    "attributes": {
      "department": "engineering"
    }
  },
  "createdAt": "2023-02-10T00:00:00Z",
  "updatedAt": "2023-03-15T00:00:00Z"
}
```

## Role Hierarchies

Roles can inherit permissions from parent roles, creating a hierarchical structure:

* **Base Roles**: Fundamental roles like "user" that provide basic permissions
* **Specialized Roles**: Roles that extend base roles with additional permissions
* **Composite Roles**: Roles that combine multiple specialized roles

Example role hierarchy:

```
                    ┌───────┐
                    │ user  │
                    └───┬───┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
┌───────▼───────┐ ┌─────▼─────┐ ┌───────▼───────┐
│workflow_viewer│ │task_viewer│ │integration_user│
└───────┬───────┘ └───────────┘ └───────────────┘
        │
┌───────▼────────┐
│workflow_designer│
└────────────────┘
```

## Database Schema

**Table: roles**

| Field | Type | Description |
|----|----|----|
| id | VARCHAR(255) | Primary key, unique identifier |
| name | VARCHAR(255) | Unique role name |
| description | TEXT | Human-readable description |
| is_system | BOOLEAN | Whether this is a system role |
| metadata | JSONB | Custom metadata |
| constraints | JSONB | Role constraints |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

**Table: role_permissions**

| Field | Type | Description |
|----|----|----|
| role_id | VARCHAR(255) | Role ID (foreign key to roles) |
| permission_id | VARCHAR(255) | Permission ID (foreign key to permissions) |
| created_at | TIMESTAMP | Creation timestamp |

**Table: role_hierarchy**

| Field | Type | Description |
|----|----|----|
| parent_role_id | VARCHAR(255) | Parent role ID (foreign key to roles) |
| child_role_id | VARCHAR(255) | Child role ID (foreign key to roles) |
| created_at | TIMESTAMP | Creation timestamp |

**Table: user_roles**

| Field | Type | Description |
|----|----|----|
| user_id | VARCHAR(255) | User ID (foreign key to users) |
| role_id | VARCHAR(255) | Role ID (foreign key to roles) |
| created_at | TIMESTAMP | Creation timestamp |

**Indexes:**

* `roles_id_idx` PRIMARY KEY on `id`
* `roles_name_idx` UNIQUE on `name`
* `role_permissions_role_perm_idx` PRIMARY KEY on `(role_id, permission_id)`
* `role_hierarchy_parent_child_idx` PRIMARY KEY on `(parent_role_id, child_role_id)`
* `user_roles_user_role_idx` PRIMARY KEY on `(user_id, role_id)`
* `role_permissions_role_idx` on `role_id` (for looking up permissions)
* `role_hierarchy_parent_idx` on `parent_role_id` (for hierarchy traversal)
* `role_hierarchy_child_idx` on `child_role_id` (for hierarchy traversal)
* `user_roles_user_idx` on `user_id` (for user role lookup)
* `user_roles_role_idx` on `role_id` (for role assignment lookup)

## Performance Considerations

For Roles schema, consider these performance optimizations:

* **Role Caching**: Cache role definitions and hierarchies in memory
* **Permission Compilation**: Pre-compute effective permissions for each role
* **Hierarchy Flattening**: Store flattened role hierarchies for faster access
* **Bitmap Representation**: Use bitmap indexes for efficient permission checking
* **Incremental Updates**: Design for incremental updates of role assignments
* **Bulk Operations**: Support bulk role assignments for organizational changes
* **Role Inheritance Depth**: Limit role inheritance depth to avoid performance issues

## Related Documentation

* [Authentication Service](../components/auth_service/README.md) - Service handling roles and permissions
* [Users Schema](./users.md) - Documentation for user accounts
* [Permissions Schema](./permissions.md) - Documentation for permissions
* [Database Architecture](../database_architecture.md) - Overall database architecture


