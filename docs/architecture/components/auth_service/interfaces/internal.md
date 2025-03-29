# Auth Service Internal Interfaces

This document describes the internal interfaces and event subscriptions of the Auth Service. These interfaces are used for component-to-component communication within the Auth Service and for integration with other Augmented OS components.

## Service Architecture

The Auth Service follows a modular architecture with the following internal components:


1. **Auth Provider** - Handles user authentication and token issuance
2. **Token Service** - Manages JWT generation, validation, and key management
3. **User Manager** - Handles user identity and profile management
4. **Permission Manager** - Manages roles, permissions, and authorization decisions
5. **Key Manager** - Handles cryptographic key management and rotation
6. **Event Dispatcher** - Publishes events to the messaging system
7. **Event Consumer** - Subscribes to and processes relevant events from other services

## Internal Component Interfaces

### Auth Provider

The Auth Provider component exposes the following interfaces to other internal components:

```typescript
interface AuthProvider {
  // Authenticates a user with username/email and password
  authenticateUser(credentials: UserCredentials): Promise<AuthResult>;
  
  // Registers a new user
  registerUser(userData: UserRegistrationData): Promise<User>;
  
  // Verifies a user's email address
  verifyEmail(token: string): Promise<boolean>;
  
  // Initiates password reset
  requestPasswordReset(email: string): Promise<void>;
  
  // Completes password reset with token
  resetPassword(token: string, newPassword: string): Promise<boolean>;
  
  // Updates user authentication settings
  updateAuthSettings(userId: string, settings: AuthSettings): Promise<void>;
}
```

### Token Service

The Token Service provides interfaces for token management:

```typescript
interface TokenService {
  // Generates a new JWT for a user
  generateToken(userId: string, scopes: string[], expiry?: number): Promise<Token>;
  
  // Validates a JWT and returns the payload if valid
  validateToken(token: string): Promise<TokenPayload | null>;
  
  // Refreshes an expired token using a refresh token
  refreshToken(refreshToken: string): Promise<Token>;
  
  // Invalidates an active token
  revokeToken(token: string): Promise<boolean>;
  
  // Invalidates all tokens for a user
  revokeAllUserTokens(userId: string): Promise<void>;
  
  // Generates a JWKS (JSON Web Key Set) from current keys
  generateJwks(): Promise<JsonWebKeySet>;
}
```

### User Manager

The User Manager handles user-related operations:

```typescript
interface UserManager {
  // Creates a new user
  createUser(userData: UserCreateData): Promise<User>;
  
  // Updates user information
  updateUser(userId: string, userData: UserUpdateData): Promise<User>;
  
  // Retrieves a user by ID
  getUserById(userId: string): Promise<User | null>;
  
  // Retrieves a user by username or email
  getUserByIdentifier(identifier: string): Promise<User | null>;
  
  // Lists users with filtering and pagination
  listUsers(filters: UserFilters, pagination: Pagination): Promise<PaginatedResult<User>>;
  
  // Deletes a user
  deleteUser(userId: string): Promise<boolean>;
  
  // Assigns a role to a user
  assignRoleToUser(userId: string, roleId: string): Promise<void>;
  
  // Removes a role from a user
  removeRoleFromUser(userId: string, roleId: string): Promise<void>;
  
  // Gets roles assigned to a user
  getUserRoles(userId: string): Promise<Role[]>;
}
```

### Permission Manager

The Permission Manager handles authorization:

```typescript
interface PermissionManager {
  // Checks if a user has a specific permission
  hasPermission(userId: string, permission: string, resourceId?: string): Promise<boolean>;
  
  // Gets all permissions for a user
  getUserPermissions(userId: string): Promise<Permission[]>;
  
  // Creates a new role
  createRole(roleData: RoleCreateData): Promise<Role>;
  
  // Updates a role
  updateRole(roleId: string, roleData: RoleUpdateData): Promise<Role>;
  
  // Deletes a role
  deleteRole(roleId: string): Promise<boolean>;
  
  // Lists roles with filtering and pagination
  listRoles(filters: RoleFilters, pagination: Pagination): Promise<PaginatedResult<Role>>;
  
  // Creates a new permission
  createPermission(permissionData: PermissionCreateData): Promise<Permission>;
  
  // Updates a permission
  updatePermission(permissionId: string, permissionData: PermissionUpdateData): Promise<Permission>;
  
  // Deletes a permission
  deletePermission(permissionId: string): Promise<boolean>;
  
  // Lists permissions with filtering and pagination
  listPermissions(filters: PermissionFilters, pagination: Pagination): Promise<PaginatedResult<Permission>>;
  
  // Assigns a permission to a role
  assignPermissionToRole(roleId: string, permissionId: string): Promise<void>;
  
  // Removes a permission from a role
  removePermissionFromRole(roleId: string, permissionId: string): Promise<void>;
  
  // Gets permissions assigned to a role
  getRolePermissions(roleId: string): Promise<Permission[]>;
}
```

### Key Manager

The Key Manager handles cryptographic operations:

```typescript
interface KeyManager {
  // Generates a new key pair for signing JWTs
  generateKeyPair(): Promise<KeyPair>;
  
  // Retrieves the current signing key
  getCurrentSigningKey(): Promise<PrivateKey>;
  
  // Retrieves all public keys for token validation
  getPublicKeys(): Promise<PublicKey[]>;
  
  // Rotates signing keys
  rotateKeys(): Promise<void>;
  
  // Generates an API key for service accounts
  generateApiKey(): Promise<string>;
  
  // Validates an API key and returns service account ID if valid
  validateApiKey(apiKey: string): Promise<string | null>;
}
```

## Event Subscriptions

The Auth Service publishes and subscribes to events via a message broker (e.g., Kafka, RabbitMQ). These events facilitate loosely coupled communication with other services.

### Published Events

| Event Type | Description | Payload Structure |
|----|----|----|
| `user.created` | Fired when a new user is created | `{ userId: string, username: string, timestamp: string }` |
| `user.updated` | Fired when user information is updated | `{ userId: string, updatedFields: string[], timestamp: string }` |
| `user.deleted` | Fired when a user is deleted | `{ userId: string, timestamp: string }` |
| `user.role_assigned` | Fired when a role is assigned to a user | `{ userId: string, roleId: string, timestamp: string }` |
| `user.role_removed` | Fired when a role is removed from a user | `{ userId: string, roleId: string, timestamp: string }` |
| `user.auth_failed` | Fired when authentication fails (for security monitoring) | `{ username: string, ipAddress: string, reason: string, timestamp: string }` |
| `role.created` | Fired when a new role is created | `{ roleId: string, name: string, timestamp: string }` |
| `role.updated` | Fired when a role is updated | `{ roleId: string, updatedFields: string[], timestamp: string }` |
| `role.deleted` | Fired when a role is deleted | `{ roleId: string, timestamp: string }` |
| `service_account.created` | Fired when a new service account is created | `{ serviceAccountId: string, name: string, timestamp: string }` |
| `service_account.key_rotated` | Fired when a service account key is rotated | `{ serviceAccountId: string, timestamp: string }` |
| `key.rotated` | Fired when signing keys are rotated | `{ keyId: string, timestamp: string }` |

### Subscribed Events

| Event Type | Description | Action |
|----|----|----|
| `system.startup` | System startup event | Initialize the Auth Service and check database migrations |
| `system.shutdown` | System shutdown event | Gracefully shutdown the Auth Service |
| `service.config_changed` | Configuration changes | Reload service configuration |
| `user.email_verified` | Email verification from Email Service | Update user's email verification status |
| `workflow.permission_required` | Workflow requires permission check | Validate if the user has the required permission |
| `admin.force_logout` | Admin initiated force logout | Invalidate all tokens for specified users |

## Database Interfaces

The Auth Service uses the following database collections/tables to store authentication and authorization data:

| Collection/Table | Description | Key Fields |
|----|----|----|
| `users` | User account information | `id`, `username`, `email`, `passwordHash` |
| `roles` | Role definitions | `id`, `name`, `description` |
| `permissions` | Permission definitions | `id`, `name`, `resource`, `action` |
| `role_permissions` | Many-to-many relationship between roles and permissions | `roleId`, `permissionId` |
| `user_roles` | Many-to-many relationship between users and roles | `userId`, `roleId` |
| `tokens` | Active refresh tokens and JWT metadata | `id`, `userId`, `expiresAt` |
| `service_accounts` | Service account information | `id`, `name`, `apiKeyHash` |
| `service_account_roles` | Many-to-many relationship between service accounts and roles | `serviceAccountId`, `roleId` |
| `keys` | Cryptographic keys for token signing | `id`, `publicKey`, `privateKey`, `isActive` |
| `audit_logs` | Security-relevant events for auditing | `id`, `userId`, `action`, `resource`, `timestamp` |

## Integration with Other Services

### Web Application Service

* **Authentication API integration** - The Web Application Service uses the Auth Service API for user authentication
* **Token validation** - The Web Application Service validates tokens using the JWKS endpoint

### Microservices

* **Token validation** - Services validate tokens independently using the JWKS endpoint
* **Permission checking** - Services extract permissions from token claims or call the Auth Service for complex permission checks
* **Service-to-service authentication** - Services authenticate with each other using API keys managed by the Auth Service

### Workflow Orchestrator

* **Workflow permission enforcement** - Workflow Orchestrator consults the Auth Service to verify if users have permissions for specific workflow steps
* **Service account authentication** - Workflow Orchestrator uses a service account to authenticate with other services

### API Gateway

* **Token validation** - The API Gateway validates tokens using the JWKS endpoint
* **Rate limiting integration** - The API Gateway applies different rate limits based on authentication status and user roles

## Security Considerations

* **Network isolation** - The Auth Service's internal components should only be accessible within the service boundary
* **Encrypted communication** - All internal component communication uses TLS
* **Secure key management** - Private keys are stored securely and never exposed via the API
* **Principle of least privilege** - Internal components only have access to the resources they need
* **Audit logging** - All security-relevant operations are logged for auditing purposes

## Performance Considerations

* **Caching** - User permissions and roles are cached to reduce database load
* **Connection pooling** - Database connections are pooled for efficiency
* **Asynchronous event processing** - Non-critical events are processed asynchronously
* **Distributed rate limiting** - Rate limits are enforced across multiple instances of the service

## Reliability Considerations

* **Retry mechanisms** - Failed database operations are retried with exponential backoff
* **Circuit breakers** - Prevent cascading failures when dependent services are unavailable
* **Graceful degradation** - Service continues to validate tokens even if the database is temporarily unavailable
* **Hot key rotation** - Key rotation happens without disrupting token validation


