# Permission Manager

## Overview

The Permission Manager is a core component of the Auth Service responsible for implementing role-based access control (RBAC) with fine-grained permissions. It manages the complete authorization lifecycle, enabling secure access control decisions based on user roles, resource attributes, and contextual information.

## Key Responsibilities

* Defining and managing roles and permissions
* Assigning roles to users and handling role hierarchies
* Enforcing access control policies with conditional logic
* Checking authorization for protected resources
* Supporting resource-specific and context-aware permissions
* Optimizing permission checks through caching
* Providing developer-friendly APIs for permission verification

## Implementation Approach

The Permission Manager follows these design principles:

1. **Least Privilege** - Users receive minimal permissions required to perform their tasks
2. **Defense in Depth** - Multiple validation layers for permission checks
3. **Flexibility** - Support for various permission models (RBAC, ABAC, policy-based)
4. **Performance** - Optimized permission checking through caching and denormalization
5. **Auditability** - Comprehensive logging of permission changes and authorization decisions

For security best practices related to authorization and access control, please refer to the [Security Considerations](../security_considerations.md#authorization-security) document.

## Permission Lifecycle

```
┌───────────────┐
│ Permission    │
│ Registration  │
└───────┬───────┘
        │
        ▼
┌───────────────┐     ┌─────────────────┐
│ Role Creation  │────►│  Role Assignment │
└───────┬───────┘     └─────────┬────────┘
        │                       │
        │                       │
        ▼                       ▼
┌───────────────┐     ┌─────────────────┐
│Policy Definition│◄───│Permission Check │
└───────┬───────┘     └─────────────────┘
        │
        ▼
┌───────────────┐
│Permission Audit│
└───────────────┘
```

## Implementation Details

### Data Model

The Permission Manager operates on the following primary data structures:

#### Role

The Permission Manager uses the Role entity as defined in the [Authentication Service Data Model](../data_model.md#role).

```typescript
// See full definition in ../data_model.md
interface Role {
  id: string;                // Unique identifier
  name: string;              // Unique role name
  // ... other fields defined in data_model.md ...
}
```

#### Permission

The Permission Manager uses the Permission entity as defined in the [Authentication Service Data Model](../data_model.md#permission).

```typescript
// See full definition in ../data_model.md
interface Permission {
  id: string;                // Unique identifier (e.g., "files:read")
  resource: string;          // Resource type (e.g., "files")
  action: string;            // Action on resource (e.g., "read")
  // ... other fields defined in data_model.md ...
}
```

#### Policy

The Policy entity extends the permission system with conditional access control:

```typescript
interface Policy {
  id: string;                // Unique identifier
  name: string;              // Policy name
  description?: string;      // Policy description
  effect: 'allow' | 'deny';  // Policy effect
  permissions: string[];     // Permissions this policy grants/denies
  resources: string[];       // Resources this policy applies to
  conditions?: PolicyCondition[]; // Optional conditions
  priority: number;          // Policy evaluation priority (higher = evaluated first)
  isActive: boolean;         // Whether the policy is active
  createdAt: Date;
  updatedAt: Date;
}
```

### Role Management

Operations for managing roles:

```typescript
async function createRole(data: Omit<Role, 'id' | 'createdAt' | 'updatedAt'>): Promise<Role> {
  // 1. Validate role data
  validateRoleData(data);
  
  // 2. Check if role name already exists
  const existingRole = await db.roles.findOne({ where: { name: data.name } });
  if (existingRole) {
    throw new Error(`Role with name '${data.name}' already exists`);
  }
  
  // 3. Validate permissions exist
  if (data.permissions && data.permissions.length > 0) {
    await validatePermissions(data.permissions);
  }
  
  // 4. Create role
  const role = await db.roles.create({
    ...data,
    id: generateId(),
    createdAt: new Date(),
    updatedAt: new Date()
  });
  
  // 5. Publish event
  await eventDispatcher.dispatch('role.created', { roleId: role.id });
  
  return role;
}
```

### Permission Registration

Operations for registering and managing permissions:

```typescript
async function registerPermission(data: Omit<Permission, 'id' | 'createdAt' | 'updatedAt'>): Promise<Permission> {
  // 1. Validate permission data
  validatePermissionData(data);
  
  // 2. Generate permission ID from resource and action
  const id = `${data.resource}:${data.action}`;
  
  // 3. Check if permission already exists
  const existingPermission = await db.permissions.findOne({ where: { id } });
  if (existingPermission) {
    // Update existing permission
    return db.permissions.update({
      ...data,
      updatedAt: new Date()
    }, {
      where: { id },
      returning: true
    });
  }
  
  // 4. Create new permission
  const permission = await db.permissions.create({
    ...data,
    id,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  
  // 5. Publish event
  await eventDispatcher.dispatch('permission.registered', { 
    permissionId: permission.id 
  });
  
  return permission;
}
```

### Role Assignment

Operations for assigning roles to users:

```typescript
async function assignRoleToUser(
  userId: string, 
  roleId: string, 
  options: Partial<Omit<RoleAssignment, 'id' | 'userId' | 'roleId' | 'createdAt' | 'updatedAt'>> = {}
): Promise<RoleAssignment> {
  // 1. Validate user exists - using User Manager
  const user = await userManager.getUserById(userId);
  if (!user) {
    throw new Error(`User with ID '${userId}' not found`);
  }
  
  // 2. Validate role exists
  const role = await db.roles.findOne({ where: { id: roleId } });
  if (!role) {
    throw new Error(`Role with ID '${roleId}' not found`);
  }
  
  // 3. Check if assignment already exists
  const existingAssignment = await db.roleAssignments.findOne({
    where: { 
      userId,
      roleId,
      scope: options.scope || null,
      scopeId: options.scopeId || null
    }
  });
  
  if (existingAssignment) {
    // Update existing assignment
    return db.roleAssignments.update({
      ...options,
      updatedAt: new Date()
    }, {
      where: { id: existingAssignment.id },
      returning: true
    });
  }
  
  // 4. Create new assignment
  const assignment = await db.roleAssignments.create({
    id: generateId(),
    userId,
    roleId,
    ...options,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  
  // 5. Clear permission cache for user
  await clearPermissionCacheForUser(userId);
  
  // 6. Publish event
  await eventDispatcher.dispatch('role.assigned', {
    userId,
    roleId,
    assignmentId: assignment.id
  });
  
  return assignment;
}
```

Note: This implementation relies on the User Manager component (see [User Manager](./user_manager.md)) for user-related operations such as validating user existence.

### Permission Checking

Core operations for checking permissions:

```typescript
async function hasPermission(
  userId: string, 
  permissionId: string, 
  resource?: any
): Promise<boolean> {
  // 1. Check permission cache
  const cacheKey = `permission:${userId}:${permissionId}:${resource ? hashResource(resource) : 'null'}`;
  const cachedResult = await cacheManager.get(cacheKey);
  
  if (cachedResult !== null) {
    return cachedResult === 'true';
  }
  
  // 2. Get user's roles
  const assignments = await db.roleAssignments.findAll({ where: { userId } });
  const roleIds = assignments.map(a => a.roleId);
  
  if (roleIds.length === 0) {
    // No roles, no permissions
    await cacheManager.set(cacheKey, 'false', { ttl: config.permissionCacheTTL });
    return false;
  }
  
  // 3. Get roles with their permissions
  const roles = await db.roles.findAll({ where: { id: roleIds } });
  
  // 4. Check if any role has the required permission
  let hasPermission = false;
  
  // First check direct permission grants
  for (const role of roles) {
    if (role.permissions.includes(permissionId)) {
      hasPermission = true;
      break;
    }
  }
  
  // 5. If not found, check policy-based permissions
  if (!hasPermission && resource) {
    hasPermission = await evaluatePolicies(userId, permissionId, resource);
  }
  
  // 6. Cache the result
  await cacheManager.set(cacheKey, hasPermission ? 'true' : 'false', { ttl: config.permissionCacheTTL });
  
  return hasPermission;
}
```

### Policy Evaluation

Advanced permission policy evaluation:

```typescript
async function evaluatePolicies(
  userId: string, 
  permissionId: string, 
  resource: any
): Promise<boolean> {
  // 1. Get active policies applicable to this permission and resource
  const resourceType = resource?.type || getResourceTypeFromPermission(permissionId);
  
  const policies = await db.policies.findAll({
    where: {
      isActive: true,
      $or: [
        { permissions: { $contains: [permissionId] } },
        { permissions: { $contains: ['*'] } }
      ],
      $or: [
        { resources: { $contains: [resourceType] } },
        { resources: { $contains: ['*'] } }
      ]
    },
    order: [['priority', 'DESC']]
  });
  
  // No policies found
  if (policies.length === 0) {
    return false;
  }
  
  // 2. Get user for condition evaluation
  const user = await userManager.getUserById(userId);
  if (!user) {
    return false;
  }
  
  // 3. Evaluate each policy in priority order
  for (const policy of policies) {
    // Skip if policy doesn't apply to this permission
    if (!policy.permissions.includes(permissionId) && !policy.permissions.includes('*')) {
      continue;
    }
    
    // Skip if policy doesn't apply to this resource
    if (!policy.resources.includes(resourceType) && !policy.resources.includes('*')) {
      continue;
    }
    
    // Evaluate conditions
    let conditionsMet = true;
    
    if (policy.conditions && policy.conditions.length > 0) {
      for (const condition of policy.conditions) {
        const result = await evaluateCondition(condition, {
          user,
          resource,
          permission: permissionId
        });
        
        if (!result) {
          conditionsMet = false;
          break;
        }
      }
    }
    
    if (conditionsMet) {
      // This policy applies - return its effect
      return policy.effect === 'allow';
    }
  }
  
  // No applicable policy found
  return false;
}
```

### Common Permission Patterns

The Permission Manager supports several common permission patterns:

#### Ownership-Based Permissions

```typescript
// Create an ownership policy for a resource
async function createOwnershipPolicy(
  resource: string,
  permissions: string[],
  ownerField: string = 'ownerId'
): Promise<Policy> {
  return createPolicy({
    name: `${resource}-ownership`,
    description: `Allow users to perform actions on ${resource} they own`,
    effect: 'allow',
    permissions,
    resources: [resource],
    conditions: [
      {
        type: 'ownership',
        expression: `resource.${ownerField} === user.id`
      }
    ],
    priority: 100,
    isActive: true
  });
}
```

### Edge Cases and Error Handling

The implementation addresses the following edge cases:

| Scenario | Handling Approach |
|----|----|
| System role modification | System roles are protected from modification or deletion |
| Permission format errors | Validation ensures permissions follow the "resource:action" format |
| Privilege escalation | Prevents users from assigning roles with more privileges than they have |
| Circular role inheritance | Detection and prevention of circular dependencies in role hierarchies |
| Policy conflicts | Priority-based resolution with explicit allow/deny effects |
| Performance degradation | Caching and denormalization to maintain performance at scale |

## Performance Considerations

Permission operations are optimized for performance:

| Operation | Optimization Strategy | Impact |
|----|----|----|
| Permission checking | Multi-level caching | Sub-millisecond permission checks |
| Role assignments | Denormalized permissions | Reduced join operations |
| Policy evaluation | Compiled expressions | Faster condition evaluation |
| Resource resolution | Lazy loading | Reduced unnecessary data fetching |
| Bulk operations | Batched database queries | Efficient permission registration |

### Caching Strategy

The Permission Manager implements a comprehensive caching strategy:

1. **User Permission Cache** - Cached list of all permissions for a user
2. **Permission Decision Cache** - Cached yes/no decisions for specific permission checks
3. **Role Assignment Cache** - Cached role assignments for quick retrieval
4. **Invalidation Triggers** - Automatic cache invalidation on role or permission changes

## Related Documentation

* [Auth Provider](./auth_provider.md)
* [User Manager](./user_manager.md)
* [Token Service](./token_service.md)
* [Security Considerations](../security_considerations.md)
* [API Documentation](../interfaces/api.md)
* [Roles Schema](./schemas/roles.md)
* [Permissions Schema](./schemas/permissions.md)
* [Web Application Service Security Model](../../web_application_service/technical_architecture/security_model.md)
* [Validation Service Configuration](../../validation_service/operations/configuration.md)

## Summary

The Permission Manager implements a comprehensive authorization system for the Auth Service, combining role-based access control (RBAC) with policy-based permissions for fine-grained access control. It manages the complete lifecycle of roles and permissions, from creation and assignment to validation during access attempts.

The component's design follows the principle of least privilege, ensuring users have only the permissions necessary for their tasks. Through careful caching and optimization strategies, the Permission Manager delivers high-performance authorization checks without compromising security.

By providing a central authorization infrastructure, the component enables consistent access control across the entire platform, with support for both simple role-based checks and complex conditional policies based on resource attributes and user context.


