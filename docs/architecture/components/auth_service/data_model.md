# Authentication Service Data Model

## Overview

The Authentication Service manages several core data structures that represent users, their identities, roles, permissions, and authentication tokens. This document outlines these data models, their relationships, and how they are used within the Authentication Service.

The Authentication Service primarily manages the following data schemas:

* [Users Schema](./schemas/users.md): User identities and profiles
* [Roles Schema](./schemas/roles.md): Role definitions for access control
* [Permissions Schema](./schemas/permissions.md): Permission definitions and mappings
* Tokens: JWT and refresh token tracking
* Service Accounts: Machine-to-machine authentication credentials

## Core Entities

### User

The User entity represents an authenticated user of the system.

```json
{
  "id": "usr_123456789",           // Unique identifier
  "username": "jsmith",            // Username for login
  "email": "john.smith@example.com", // Primary email
  "phone": "+1234567890",          // Optional phone number
  "fullName": "John Smith",        // Full name
  "status": "active",              // User status (active, inactive, locked, etc.)
  "emailVerified": true,           // Whether email is verified
  "phoneVerified": false,          // Whether phone is verified
  "mfaEnabled": true,              // Multi-factor authentication enabled
  "mfaMethods": ["totp", "sms"],   // Available MFA methods
  "lastLogin": "2023-06-10T15:30:00Z", // Last successful login
  "passwordLastChanged": "2023-05-01T10:15:00Z", // Last password change
  "failedLoginAttempts": 0,        // Count of failed login attempts
  "createdAt": "2023-01-15T09:00:00Z", // Creation timestamp
  "updatedAt": "2023-06-10T15:30:00Z", // Last update timestamp
  "profile": {                     // User profile information
    "firstName": "John",
    "lastName": "Smith",
    "preferredLanguage": "en",
    "timezone": "America/New_York",
    "avatarUrl": "https://example.com/avatars/jsmith.jpg"
  },
  "identities": [                  // Federated identities
    {
      "provider": "google",
      "providerId": "google-oauth2|123456789",
      "connection": "google-oauth2",
      "isSocial": true,
      "profileData": {
        "email": "john.smith@gmail.com",
        "picture": "https://example.com/picture.jpg"
      }
    }
  ],
  "roles": ["user", "admin"],      // Assigned roles
  "metadata": {                    // Custom metadata
    "department": "Engineering",
    "employeeId": "EMP123"
  }
}
```

### Role

The Role entity defines a collection of permissions that can be assigned to users.

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
  "isSystem": true,               // Whether this is a system-defined role
  "createdAt": "2023-01-01T00:00:00Z", // Creation timestamp
  "updatedAt": "2023-01-15T00:00:00Z"  // Last update timestamp
}
```

### Permission

The Permission entity defines a specific access right within the system.

```json
{
  "id": "perm_123456789",          // Unique identifier
  "name": "create:user",           // Permission name (unique)
  "description": "Create new users", // Human-readable description
  "resource": "user",              // Resource this permission applies to
  "action": "create",              // Action (create, read, update, delete, etc.)
  "conditions": {                  // Optional conditions for the permission
    "ownerOnly": false,
    "attributes": ["email", "name", "role"]
  },
  "isSystem": true,                // Whether this is a system-defined permission
  "createdAt": "2023-01-01T00:00:00Z", // Creation timestamp
  "updatedAt": "2023-01-01T00:00:00Z"  // Last update timestamp
}
```

### Token

The Token entity tracks active authentication tokens.

```json
{
  "id": "token_123456789",          // Unique identifier
  "userId": "usr_123456789",        // Associated user ID
  "clientId": "client_123456789",   // Associated client application
  "type": "refresh",                // Token type (refresh, access)
  "value": "hashed_token_value",    // Hashed token value
  "expiresAt": "2023-07-15T00:00:00Z", // Expiration timestamp
  "issuedAt": "2023-06-15T00:00:00Z",  // Issuance timestamp
  "revokedAt": null,                // Revocation timestamp (if revoked)
  "ipAddress": "192.168.1.1",       // IP address used during issuance
  "userAgent": "Mozilla/5.0...",    // User agent during issuance
  "scope": ["openid", "profile"],   // Granted scopes
  "metadata": {                     // Additional metadata
    "deviceId": "device_123456789"
  }
}
```

### Service Account

The Service Account entity represents a non-human identity used for service-to-service authentication.

```json
{
  "id": "svc_123456789",           // Unique identifier
  "name": "workflow-service",      // Service account name
  "description": "Workflow Orchestrator Service", // Human-readable description
  "clientId": "client_123456789",  // Client ID for authentication
  "clientSecret": "hashed_secret", // Hashed client secret
  "status": "active",              // Status (active, inactive, suspended)
  "allowedIps": ["10.0.0.0/24"],   // IP restrictions
  "roles": ["service"],            // Assigned roles
  "permissions": [                 // Direct permissions
    "perm_execute_workflow",
    "perm_read_task"
  ],
  "tokenLifetime": 3600,           // Token lifetime in seconds
  "lastUsed": "2023-06-14T12:00:00Z", // Last usage timestamp
  "createdAt": "2023-01-15T00:00:00Z", // Creation timestamp
  "updatedAt": "2023-05-20T00:00:00Z", // Last update timestamp
  "metadata": {                    // Additional metadata
    "owner": "platform-team",
    "environment": "production"
  }
}
```

## Data Relationships

The following diagram illustrates the relationships between the primary data entities in the Authentication Service:

```
┌───────────────┐      ┌───────────────┐
│               │      │               │
│     User      │──────│    Token      │
│               │      │               │
└───────┬───────┘      └───────────────┘
        │
        │               ┌───────────────┐
        │               │               │
        ├───────────────│     Role      │
        │               │               │
        │               └───────┬───────┘
        │                       │
┌───────▼───────┐      ┌───────▼───────┐
│               │      │               │
│Service Account│──────│  Permission   │
│               │      │               │
└───────────────┘      └───────────────┘
```

## Database Schema

### Users Table

| Field | Type | Description |
|----|----|----|
| id | VARCHAR(255) | Primary key, unique identifier |
| username | VARCHAR(255) | Unique username |
| email | VARCHAR(255) | Unique email address |
| phone | VARCHAR(50) | Phone number |
| password_hash | VARCHAR(255) | Hashed password |
| full_name | VARCHAR(255) | User's full name |
| status | VARCHAR(50) | Account status |
| email_verified | BOOLEAN | Whether email is verified |
| phone_verified | BOOLEAN | Whether phone is verified |
| mfa_enabled | BOOLEAN | MFA enabled flag |
| mfa_methods | JSONB | Available MFA methods |
| last_login | TIMESTAMP | Last successful login time |
| password_last_changed | TIMESTAMP | Last password change time |
| failed_login_attempts | INTEGER | Count of failed login attempts |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |
| profile | JSONB | User profile information |
| identities | JSONB | Federated identity information |
| metadata | JSONB | Custom metadata |

**Indexes:**

* `users_id_idx` PRIMARY KEY on `id`
* `users_username_idx` UNIQUE on `username`
* `users_email_idx` UNIQUE on `email`
* `users_status_idx` on `status` (for filtering by status)
* `users_last_login_idx` on `last_login` (for activity reports)

### Roles Table

| Field | Type | Description |
|----|----|----|
| id | VARCHAR(255) | Primary key, unique identifier |
| name | VARCHAR(255) | Unique role name |
| description | TEXT | Human-readable description |
| is_system | BOOLEAN | Whether this is a system role |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

**Indexes:**

* `roles_id_idx` PRIMARY KEY on `id`
* `roles_name_idx` UNIQUE on `name`

### Permissions Table

| Field | Type | Description |
|----|----|----|
| id | VARCHAR(255) | Primary key, unique identifier |
| name | VARCHAR(255) | Unique permission name |
| description | TEXT | Human-readable description |
| resource | VARCHAR(255) | Resource this permission applies to |
| action | VARCHAR(255) | Action type |
| conditions | JSONB | Optional conditions |
| is_system | BOOLEAN | Whether this is a system permission |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

**Indexes:**

* `permissions_id_idx` PRIMARY KEY on `id`
* `permissions_name_idx` UNIQUE on `name`
* `permissions_resource_action_idx` on `(resource, action)` (for lookup)

### User Roles Table

| Field | Type | Description |
|----|----|----|
| user_id | VARCHAR(255) | User ID (foreign key to users) |
| role_id | VARCHAR(255) | Role ID (foreign key to roles) |
| created_at | TIMESTAMP | Creation timestamp |

**Indexes:**

* `user_roles_user_role_idx` PRIMARY KEY on `(user_id, role_id)`
* `user_roles_user_idx` on `user_id` (for looking up a user's roles)
* `user_roles_role_idx` on `role_id` (for looking up users with a role)

### Role Permissions Table

| Field | Type | Description |
|----|----|----|
| role_id | VARCHAR(255) | Role ID (foreign key to roles) |
| permission_id | VARCHAR(255) | Permission ID (foreign key to permissions) |
| created_at | TIMESTAMP | Creation timestamp |

**Indexes:**

* `role_permissions_role_perm_idx` PRIMARY KEY on `(role_id, permission_id)`
* `role_permissions_role_idx` on `role_id` (for looking up a role's permissions)
* `role_permissions_perm_idx` on `permission_id` (for looking up roles with a permission)

### Tokens Table

| Field | Type | Description |
|----|----|----|
| id | VARCHAR(255) | Primary key, unique identifier |
| user_id | VARCHAR(255) | User ID (foreign key to users) |
| client_id | VARCHAR(255) | Client application ID |
| type | VARCHAR(50) | Token type (refresh, access) |
| value_hash | VARCHAR(255) | Hashed token value |
| expires_at | TIMESTAMP | Expiration timestamp |
| issued_at | TIMESTAMP | Issuance timestamp |
| revoked_at | TIMESTAMP | Revocation timestamp (nullable) |
| ip_address | VARCHAR(50) | IP address during issuance |
| user_agent | TEXT | User agent during issuance |
| scope | JSONB | Granted scopes |
| metadata | JSONB | Additional metadata |

**Indexes:**

* `tokens_id_idx` PRIMARY KEY on `id`
* `tokens_hash_idx` UNIQUE on `value_hash`
* `tokens_user_id_idx` on `user_id` (for user's tokens)
* `tokens_expires_idx` on `expires_at` (for expiration cleanup)
* `tokens_user_type_idx` on `(user_id, type)` (for specific token types)

### Service Accounts Table

| Field | Type | Description |
|----|----|----|
| id | VARCHAR(255) | Primary key, unique identifier |
| name | VARCHAR(255) | Unique service account name |
| description | TEXT | Human-readable description |
| client_id | VARCHAR(255) | Client ID for authentication |
| client_secret_hash | VARCHAR(255) | Hashed client secret |
| status | VARCHAR(50) | Status (active, inactive, suspended) |
| allowed_ips | JSONB | IP restrictions |
| token_lifetime | INTEGER | Token lifetime in seconds |
| last_used | TIMESTAMP | Last usage timestamp |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |
| metadata | JSONB | Additional metadata |

**Indexes:**

* `service_accounts_id_idx` PRIMARY KEY on `id`
* `service_accounts_name_idx` UNIQUE on `name`
* `service_accounts_client_id_idx` UNIQUE on `client_id`
* `service_accounts_status_idx` on `status` (for filtering by status)

## Database Optimization

The Authentication Service database schema is optimized for the following use cases:

### High-Frequency Operations

* **Token Validation**: Fast lookup of tokens by hash value
* **User Authentication**: Quick retrieval of user by username/email
* **Permission Checking**: Efficient checking of user permissions

### Optimizations

* **Materialized Permission View**: For complex permission hierarchies, a materialized view can pre-compute effective permissions
* **Caching Layer**: Redis-based caching for frequently accessed user roles and permissions
* **Read Replicas**: For high-volume deployments, read replicas can offload authentication queries
* **Token Cleanup**: Background process to remove expired tokens
* **Sharding Strategy**: For very large deployments, users can be sharded by ID prefix

## Data Security Considerations

The Authentication Service implements the following data security measures:

* **Password Hashing**: Passwords are stored using modern cryptographic hashing algorithms (Argon2id)
* **Encryption**: Sensitive fields are encrypted at rest
* **Token Security**: Tokens are stored as secure hashes, never in plaintext
* **Audit Logging**: All changes to security entities are logged for audit purposes
* **Data Minimization**: Only essential data is stored and processed

## Schema Evolution

The Authentication Service data model supports the following evolution patterns:

* **Backward Compatible Changes**: Adding new optional fields
* **Schema Versioning**: Major changes introduced with explicit versioning
* **Migration Paths**: Documented patterns for migrating between schema versions
* **Deprecation Policy**: Fields are marked deprecated before removal

## Related Schema Documentation

* [Users Schema](./schemas/users.md)
* [Roles Schema](./schemas/roles.md)
* [Permissions Schema](./schemas/permissions.md)
* [Database Architecture](../database_architecture.md)


