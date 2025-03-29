# Permissions

## Overview

The Permissions schema defines the structure for individual access rights within the Augmented OS platform. Permissions represent specific actions that can be performed on resources in the system. They are the building blocks of the role-based access control (RBAC) system and can be combined into roles for efficient assignment to users and service accounts. The Permissions schema is designed to support fine-grained access control, conditional permissions, and attribute-based access control (ABAC).

## Key Concepts

* **Resource**: An entity or object that can be acted upon (e.g., user, workflow, task)
* **Action**: An operation that can be performed on a resource (e.g., create, read, update, delete)
* **Permission**: The combination of a resource and an action, representing the right to perform that action on that resource
* **Condition**: A rule that determines when a permission is applicable
* **Wildcard Permission**: Special permissions that apply to multiple resources or actions
* **Permission Scope**: The boundary within which a permission is applicable

## Permission Structure

```json
{
  "id": "perm_123456789",          // Unique identifier
  "name": "create:user",           // Permission name (unique)
  "description": "Create new users", // Human-readable description
  "resource": "user",              // Resource this permission applies to
  "action": "create",              // Action (create, read, update, delete, etc.)
  "conditions": {                  // Optional conditions for the permission
    "ownerOnly": false,
    "attributes": ["email", "name", "role"], // Attributes that can be modified
    "resourceFilters": {           // Filters limiting the resource scope
      "department": "engineering"
    },
    "contextFilters": {            // Filters on the context of the operation
      "ipRange": ["10.0.0.0/24"],
      "environments": ["production"]
    }
  },
  "isSystem": true,                // Whether this is a system-defined permission
  "metadata": {                    // Custom metadata
    "riskLevel": "high",           // Classification of permission sensitivity
    "auditRequired": true          // Whether usage requires auditing
  },
  "createdAt": "2023-01-01T00:00:00Z", // Creation timestamp
  "updatedAt": "2023-01-01T00:00:00Z"  // Last update timestamp
}
```

## Permission Naming Conventions

Permissions follow a consistent naming convention to ensure clarity and maintainability:

* Format: `action:resource(:scope)?`
* Examples:
  * `create:user` - Create a user
  * `read:workflow` - Read workflow details
  * `update:task:assigned` - Update assigned tasks
  * `delete:integration:own` - Delete own integrations

The scope suffix is optional and can be used to further restrict the permission scope:

* `:own` - Only applies to resources owned by the user
* `:assigned` - Only applies to resources assigned to the user
* `:department` - Only applies to resources in the user's department

## Common Permission Types

The Permissions schema includes several common permission types:

### Resource Permissions

Standard permissions for operating on resources:

* **Create Permissions**: Allow creating new resources
* **Read Permissions**: Allow reading or viewing resources
* **Update Permissions**: Allow modifying existing resources
* **Delete Permissions**: Allow removing resources

Example resource permissions:

```json
[
  {
    "id": "perm_create_workflow",
    "name": "create:workflow",
    "description": "Create a new workflow",
    "resource": "workflow",
    "action": "create",
    "isSystem": true
  },
  {
    "id": "perm_read_workflow",
    "name": "read:workflow",
    "description": "Read workflow details",
    "resource": "workflow",
    "action": "read",
    "isSystem": true
  },
  {
    "id": "perm_update_workflow",
    "name": "update:workflow",
    "description": "Update a workflow",
    "resource": "workflow",
    "action": "update",
    "isSystem": true
  },
  {
    "id": "perm_delete_workflow",
    "name": "delete:workflow",
    "description": "Delete a workflow",
    "resource": "workflow",
    "action": "delete",
    "isSystem": true
  }
]
```

### Administrative Permissions

Permissions for system administration and management:

* **User Management**: Manage user accounts
* **Role Management**: Manage roles and permissions
* **System Configuration**: Configure system settings
* **Audit Access**: View audit logs and security data

Example administrative permissions:

```json
[
  {
    "id": "perm_manage_users",
    "name": "manage:users",
    "description": "Manage all user accounts",
    "resource": "user",
    "action": "manage",
    "isSystem": true,
    "metadata": {
      "riskLevel": "high",
      "auditRequired": true
    }
  },
  {
    "id": "perm_manage_roles",
    "name": "manage:roles",
    "description": "Manage roles and permissions",
    "resource": "role",
    "action": "manage",
    "isSystem": true,
    "metadata": {
      "riskLevel": "high",
      "auditRequired": true
    }
  },
  {
    "id": "perm_read_audit",
    "name": "read:audit",
    "description": "View audit logs",
    "resource": "audit",
    "action": "read",
    "isSystem": true
  }
]
```

### Functional Permissions

Permissions for specific functional areas:

* **Workflow Execution**: Control workflow execution
* **Task Management**: Manage tasks and assignments
* **Integration Configuration**: Configure integrations
* **Analytics Access**: Access analytics and reports

Example functional permissions:

```json
[
  {
    "id": "perm_execute_workflow",
    "name": "execute:workflow",
    "description": "Execute a workflow",
    "resource": "workflow",
    "action": "execute",
    "isSystem": true
  },
  {
    "id": "perm_assign_task",
    "name": "assign:task",
    "description": "Assign tasks to users",
    "resource": "task",
    "action": "assign",
    "isSystem": true
  },
  {
    "id": "perm_configure_integration",
    "name": "configure:integration",
    "description": "Configure system integrations",
    "resource": "integration",
    "action": "configure",
    "isSystem": true
  }
]
```

### Wildcard Permissions

Special permissions that apply to multiple resources or actions:

* **Global Admin**: Access to all system functions
* **Resource Admin**: Full control over a specific resource type
* **Action-Specific**: Perform a specific action on all resources

Example wildcard permissions:

```json
[
  {
    "id": "perm_admin_all",
    "name": "admin:*",
    "description": "Full system administrator access",
    "resource": "*",
    "action": "*",
    "isSystem": true,
    "metadata": {
      "riskLevel": "critical",
      "auditRequired": true
    }
  },
  {
    "id": "perm_admin_workflow",
    "name": "admin:workflow",
    "description": "Full control over workflows",
    "resource": "workflow",
    "action": "*",
    "isSystem": true
  },
  {
    "id": "perm_read_all",
    "name": "read:*",
    "description": "Read access to all resources",
    "resource": "*",
    "action": "read",
    "isSystem": true
  }
]
```

## Conditional Permissions

Permissions can include conditions that determine when and how they apply:

* **Owner-Only Conditions**: Restrict permissions to resources owned by the user
* **Attribute Limitations**: Restrict which resource attributes can be modified
* **Resource Filters**: Limit permissions to resources matching specific criteria
* **Context Filters**: Apply permissions only in specific contexts or environments

Example conditional permission:

```json
{
  "id": "perm_update_workflow_own",
  "name": "update:workflow:own",
  "description": "Update workflows created by the user",
  "resource": "workflow",
  "action": "update",
  "conditions": {
    "ownerOnly": true,
    "attributes": ["name", "description", "steps"],
    "resourceFilters": {
      "status": ["draft", "development"]
    }
  },
  "isSystem": true
}
```

## Permission Inheritance and Implication

Some permissions implicitly include or imply others:

* **Admin Permissions**: Include all actions on a resource
* **Manage Permissions**: Include create, read, update, and delete
* **Hierarchical Resources**: Permissions on parent resources may extend to child resources

These implications are evaluated at permission-checking time and are not stored directly in the permission schema.

## Database Schema

**Table: permissions**

| Field | Type | Description |
|----|----|----|
| id | VARCHAR(255) | Primary key, unique identifier |
| name | VARCHAR(255) | Unique permission name |
| description | TEXT | Human-readable description |
| resource | VARCHAR(255) | Resource this permission applies to |
| action | VARCHAR(255) | Action type |
| conditions | JSONB | Optional conditions |
| is_system | BOOLEAN | Whether this is a system permission |
| metadata | JSONB | Custom metadata |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

**Table: role_permissions**

| Field | Type | Description |
|----|----|----|
| role_id | VARCHAR(255) | Role ID (foreign key to roles) |
| permission_id | VARCHAR(255) | Permission ID (foreign key to permissions) |
| created_at | TIMESTAMP | Creation timestamp |

**Table: user_permissions**

| Field | Type | Description |
|----|----|----|
| user_id | VARCHAR(255) | User ID (foreign key to users) |
| permission_id | VARCHAR(255) | Permission ID (foreign key to permissions) |
| created_at | TIMESTAMP | Creation timestamp |

**Indexes:**

* `permissions_id_idx` PRIMARY KEY on `id`
* `permissions_name_idx` UNIQUE on `name`
* `permissions_resource_action_idx` on `(resource, action)` (for lookup)
* `role_permissions_role_perm_idx` PRIMARY KEY on `(role_id, permission_id)`
* `role_permissions_role_idx` on `role_id` (for looking up permissions by role)
* `role_permissions_perm_idx` on `permission_id` (for looking up roles with permission)
* `user_permissions_user_perm_idx` PRIMARY KEY on `(user_id, permission_id)`
* `user_permissions_user_idx` on `user_id` (for user permission lookup)
* `user_permissions_perm_idx` on `permission_id` (for permission assignment lookup)
* `permissions_is_system_idx` on `is_system` (for filtering system permissions)

## Performance Considerations

For Permissions schema, consider these performance optimizations:

* **Permission Caching**: Cache frequently checked permissions
* **Precomputed Permission Sets**: Precompute effective permissions for users
* **Batched Permission Checks**: Check multiple permissions in a single operation
* **Permission Compilation**: Convert permissions to efficient runtime structures
* **Denormalization**: Store frequently used permission data with user information
* **Permission Indexing**: Index conditions for quick permission matching
* **Wildcards Optimization**: Optimize wildcard permission evaluation

## Related Documentation

* [Authentication Service](../components/auth_service/README.md) - Service handling roles and permissions
* [Users Schema](./users.md) - Documentation for user accounts
* [Roles Schema](./roles.md) - Documentation for roles
* [Database Architecture](../database_architecture.md) - Overall database architecture


