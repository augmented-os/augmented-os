# Role-Based Access Control Example

This document provides examples of how to implement Role-Based Access Control (RBAC) using the Authentication Service, demonstrating how to manage roles and permissions, and enforce access control policies across your application.

## RBAC Concepts

The Authentication Service implements a comprehensive RBAC system that includes:

1. **Users**: Entities that authenticate and perform actions
2. **Roles**: Named collections of permissions assigned to users
3. **Permissions**: Granular access rights to resources and actions
4. **Resources**: Objects or services that require access control
5. **Actions**: Operations that can be performed on resources

### RBAC Model

The Auth Service uses a role-based model with permission inheritance:

```
User → Roles → Permissions → Resources + Actions
```

- A user can have multiple roles
- A role contains multiple permissions
- A permission defines allowed actions on specific resources
- Access decisions are made by checking if a user has a role with the required permission

## Role Management Examples

The following examples illustrate how to manage roles within the Auth Service:

### Creating a Role

```bash
curl -X POST https://api.example.com/auth/admin/roles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {admin_token}" \
  -d '{
    "name": "content_editor",
    "description": "Can create and edit content but not publish",
    "permissions": [
      "content:read",
      "content:create",
      "content:edit"
    ]
  }'
```

#### Response

```json
{
  "roleId": "role_5a7b9c3d2e1f",
  "name": "content_editor",
  "description": "Can create and edit content but not publish",
  "permissions": [
    "content:read",
    "content:create",
    "content:edit"
  ],
  "createdAt": "2023-09-01T10:15:00Z",
  "updatedAt": "2023-09-01T10:15:00Z"
}
```

### Retrieving Roles

```bash
curl -X GET https://api.example.com/auth/admin/roles \
  -H "Authorization: Bearer {admin_token}"
```

#### Response

```json
{
  "roles": [
    {
      "roleId": "role_5a7b9c3d2e1f",
      "name": "content_editor",
      "description": "Can create and edit content but not publish",
      "permissions": [
        "content:read",
        "content:create",
        "content:edit"
      ]
    },
    {
      "roleId": "role_6b8c0d4e3f2g",
      "name": "content_publisher",
      "description": "Can publish and unpublish content",
      "permissions": [
        "content:read",
        "content:publish",
        "content:unpublish"
      ]
    }
  ],
  "count": 2,
  "totalCount": 2
}
```

## User Role Assignment

The following examples show how to assign roles to users:

### Assigning Roles to a User

```bash
curl -X POST https://api.example.com/auth/admin/users/usr_b8e49ac571b24c8f94b1/roles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {admin_token}" \
  -d '{
    "roles": ["role_5a7b9c3d2e1f", "role_6b8c0d4e3f2g"]
  }'
```

#### Response

```json
{
  "userId": "usr_b8e49ac571b24c8f94b1",
  "roles": [
    {
      "roleId": "role_5a7b9c3d2e1f",
      "name": "content_editor"
    },
    {
      "roleId": "role_6b8c0d4e3f2g",
      "name": "content_publisher"
    }
  ],
  "updatedAt": "2023-09-01T11:30:00Z"
}
```

### Retrieving User Roles

```bash
curl -X GET https://api.example.com/auth/admin/users/usr_b8e49ac571b24c8f94b1/roles \
  -H "Authorization: Bearer {admin_token}"
```

#### Response

```json
{
  "userId": "usr_b8e49ac571b24c8f94b1",
  "email": "user@example.com",
  "roles": [
    {
      "roleId": "role_5a7b9c3d2e1f",
      "name": "content_editor",
      "description": "Can create and edit content but not publish",
      "permissions": [
        "content:read",
        "content:create",
        "content:edit"
      ]
    },
    {
      "roleId": "role_6b8c0d4e3f2g",
      "name": "content_publisher",
      "description": "Can publish and unpublish content",
      "permissions": [
        "content:read",
        "content:publish",
        "content:unpublish"
      ]
    }
  ],
  "effectivePermissions": [
    "content:read",
    "content:create",
    "content:edit",
    "content:publish",
    "content:unpublish"
  ]
}
```

### Removing a Role from a User

```bash
curl -X DELETE https://api.example.com/auth/admin/users/usr_b8e49ac571b24c8f94b1/roles/role_6b8c0d4e3f2g \
  -H "Authorization: Bearer {admin_token}"
```

#### Response

```json
{
  "userId": "usr_b8e49ac571b24c8f94b1",
  "roles": [
    {
      "roleId": "role_5a7b9c3d2e1f",
      "name": "content_editor"
    }
  ],
  "updatedAt": "2023-09-01T11:45:00Z"
}
```

## Permission Check Implementation

The following examples demonstrate how to implement permission checks in applications:

### JWT Token Structure with Roles

When a user logs in, the Authentication Service includes role and permission information in the JWT:

```json
{
  "iss": "auth-service",
  "sub": "usr_b8e49ac571b24c8f94b1",
  "aud": "api",
  "exp": 1630502100,
  "iat": 1630498500,
  "roles": ["content_editor"],
  "permissions": [
    "content:read",
    "content:create",
    "content:edit"
  ]
}
```

### Server-Side Permission Check (Node.js)

```javascript
const express = require('express');
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const app = express();

// JWKS client for token validation
const client = jwksClient({
  jwksUri: 'https://api.example.com/auth/.well-known/jwks.json'
});

// Helper function to get signing key
function getSigningKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) return callback(err);
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}

// Middleware to check if user has permission
function hasPermission(permission) {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    jwt.verify(token, getSigningKey, {
      algorithms: ['ES256', 'RS256'],
      issuer: 'auth-service',
      audience: 'api'
    }, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid token' });
      }

      // Check if the token contains the required permission
      const hasRequiredPermission = decoded.permissions && 
                                   decoded.permissions.includes(permission);
      
      if (!hasRequiredPermission) {
        return res.status(403).json({ 
          error: 'Insufficient permissions',
          required: permission 
        });
      }
      
      // Store user info in request for later use
      req.user = decoded;
      next();
    });
  };
}

// Middleware to check if user has role
function hasRole(role) {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    jwt.verify(token, getSigningKey, {
      algorithms: ['ES256', 'RS256'],
      issuer: 'auth-service',
      audience: 'api'
    }, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid token' });
      }

      // Check if the token contains the required role
      const hasRequiredRole = decoded.roles && 
                             decoded.roles.includes(role);
      
      if (!hasRequiredRole) {
        return res.status(403).json({ 
          error: 'Insufficient role',
          required: role 
        });
      }
      
      // Store user info in request for later use
      req.user = decoded;
      next();
    });
  };
}

// Protected routes using the middleware
app.get('/api/content', 
  hasPermission('content:read'), 
  (req, res) => {
    res.json({ message: 'Content list', userId: req.user.sub });
  }
);

app.post('/api/content', 
  hasPermission('content:create'), 
  (req, res) => {
    res.json({ message: 'Content created', userId: req.user.sub });
  }
);

app.put('/api/content/:id', 
  hasPermission('content:edit'), 
  (req, res) => {
    res.json({ message: 'Content updated', userId: req.user.sub });
  }
);

app.post('/api/content/:id/publish', 
  hasPermission('content:publish'), 
  (req, res) => {
    res.json({ message: 'Content published', userId: req.user.sub });
  }
);

// Role-based routes
app.get('/api/admin/dashboard', 
  hasRole('admin'), 
  (req, res) => {
    res.json({ message: 'Admin dashboard', userId: req.user.sub });
  }
);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

### Client-Side Permission Check (React)

```jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';

// Authentication context
const AuthContext = createContext(null);

// Authentication provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check for token in localStorage
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        // Decode the token
        const decodedToken = jwt_decode(token);
        
        // Check if token is expired
        if (decodedToken.exp * 1000 < Date.now()) {
          localStorage.removeItem('access_token');
          setUser(null);
        } else {
          setUser(decodedToken);
        }
      } catch (error) {
        console.error('Invalid token', error);
        localStorage.removeItem('access_token');
        setUser(null);
      }
    }
    setLoading(false);
  }, []);
  
  // Function to check if user has permission
  const hasPermission = (permission) => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
  };
  
  // Function to check if user has role
  const hasRole = (role) => {
    if (!user || !user.roles) return false;
    return user.roles.includes(role);
  };
  
  return (
    <AuthContext.Provider value={{ user, hasPermission, hasRole, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  return useContext(AuthContext);
}

// Permission-based component rendering
export function RequirePermission({ permission, children }) {
  const { hasPermission, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  if (!hasPermission(permission)) {
    return <div>You don't have permission to view this content.</div>;
  }
  
  return children;
}

// Role-based component rendering
export function RequireRole({ role, children }) {
  const { hasRole, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  if (!hasRole(role)) {
    return <div>You don't have the required role to view this content.</div>;
  }
  
  return children;
}

// Example usage in components
function ContentEditor() {
  return (
    <div>
      <h1>Content Management</h1>
      
      {/* Show content list to everyone who can read content */}
      <RequirePermission permission="content:read">
        <div className="content-list">
          {/* Content list goes here */}
        </div>
      </RequirePermission>
      
      {/* Only show create button to users with create permission */}
      <RequirePermission permission="content:create">
        <button className="create-button">Create New Content</button>
      </RequirePermission>
      
      {/* Only show publish options to publishers */}
      <RequirePermission permission="content:publish">
        <div className="publish-options">
          {/* Publish controls go here */}
        </div>
      </RequirePermission>
      
      {/* Admin-only section */}
      <RequireRole role="admin">
        <div className="admin-controls">
          {/* Admin controls go here */}
        </div>
      </RequireRole>
    </div>
  );
}

## Hierarchical RBAC Example

The Auth Service supports hierarchical RBAC, where roles can inherit permissions from other roles:

### Creating Hierarchical Roles

```bash
curl -X POST https://api.example.com/auth/admin/roles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {admin_token}" \
  -d '{
    "name": "editor",
    "description": "Basic content editor",
    "permissions": [
      "content:read",
      "content:edit"
    ]
  }'
```

Then create a senior editor role that inherits from the editor role:

```bash
curl -X POST https://api.example.com/auth/admin/roles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {admin_token}" \
  -d '{
    "name": "senior_editor",
    "description": "Senior content editor with publishing rights",
    "inheritsFrom": ["editor"],
    "permissions": [
      "content:publish",
      "content:unpublish"
    ]
  }'
```

The `senior_editor` role will have all its own permissions plus those from the `editor` role.

## Best Practices

1. **Design permissions around resources and actions**:
   - Use the format `resource:action` (e.g., `content:read`)
   - Group related permissions into roles
   - Create fine-grained permissions that can be combined flexibly

2. **Implement least privilege principle**:
   - Assign users the minimum roles needed for their job
   - Avoid giving admin roles when more specific roles would suffice
   - Regularly audit role assignments

3. **Validate permissions on both client and server**:
   - Never rely solely on client-side permission checks
   - Implement server-side validation for all protected operations
   - Use UI permission checks to improve user experience

4. **Cache permission checks efficiently**:
   - Include permissions and roles in the JWT token
   - Cache JWKS responses to reduce network calls
   - Consider application-level permission caching for high-frequency checks

5. **Implement proper auditing**:
   - Log all permission and role changes
   - Record access denials for security analysis
   - Regularly review access patterns

## Related Documentation

* [Auth Service Overview](../overview.md)
* [Auth Service API Reference](../interfaces/api.md)
* [Permission Manager Implementation](../implementation/permission_manager.md)
* [Token Service Implementation](../implementation/token_service.md)
* [Security Considerations](../security_considerations.md)
* [Basic Authentication Example](./basic_authentication.md)
* [Token Validation Example](./token_validation.md) 