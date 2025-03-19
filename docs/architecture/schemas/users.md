# Users

## Overview

The Users schema defines the structure for user accounts within the Augmented OS platform. It represents individuals who can authenticate with the system, access protected resources, and perform actions based on their assigned permissions. The Users schema is designed to support various authentication methods, identity providers, and authorization models.

## Key Concepts

* **User Identity**: Core identity information including unique identifiers and authentication credentials
* **User Profile**: Detailed user information such as name, contact information, and preferences
* **Federated Identity**: Support for third-party identity providers (OAuth, SAML, etc.)
* **Multi-factor Authentication**: Additional security factors beyond passwords
* **Account Status**: User account lifecycle states (active, locked, suspended, etc.)
* **User Metadata**: Extensible attributes for customer-specific information

## User Structure

```json
{
  "id": "usr_123456789",           // Unique identifier
  "username": "jsmith",            // Username for login (unique)
  "email": "john.smith@example.com", // Primary email (unique)
  "phone": "+1234567890",          // Phone number for communications and MFA
  "fullName": "John Smith",        // Full name for display purposes
  "status": "active",              // Account status (active, inactive, locked, suspended)
  "emailVerified": true,           // Whether email address has been verified
  "phoneVerified": false,          // Whether phone number has been verified
  "mfaEnabled": true,              // Multi-factor authentication flag
  "mfaMethods": ["totp", "sms"],   // Available MFA methods
  "lastLogin": "2023-06-10T15:30:00Z", // Timestamp of last successful login
  "passwordLastChanged": "2023-05-01T10:15:00Z", // Last password change timestamp
  "failedLoginAttempts": 0,        // Count of consecutive failed attempts
  "createdAt": "2023-01-15T09:00:00Z", // Account creation timestamp
  "updatedAt": "2023-06-10T15:30:00Z", // Last account update timestamp
  "profile": {                     // Detailed profile information
    "firstName": "John",           // First/given name
    "lastName": "Smith",           // Last/family name
    "preferredLanguage": "en",     // Preferred language code
    "timezone": "America/New_York", // Preferred timezone
    "avatarUrl": "https://example.com/avatars/jsmith.jpg" // Profile picture URL
  },
  "identities": [                  // Federated identity connections
    {
      "provider": "google",        // Identity provider name
      "providerId": "google-oauth2|123456789", // Provider-specific ID
      "connection": "google-oauth2", // Connection method
      "isSocial": true,            // Whether this is a social provider
      "profileData": {             // Provider-specific profile data
        "email": "john.smith@gmail.com",
        "picture": "https://example.com/picture.jpg"
      }
    }
  ],
  "roles": ["user", "admin"],      // Assigned role names
  "metadata": {                    // Custom metadata
    "department": "Engineering",   // Organization-specific fields
    "employeeId": "EMP123",
    "costCenter": "CC-1234"
  }
}
```

## Core User Attributes

The Users schema includes essential attributes for identity management:

* **Identity Attributes**: Properties like `id`, `username`, and `email` that uniquely identify a user
* **Authentication Attributes**: Properties related to authentication such as `mfaEnabled` and `passwordLastChanged`
* **Status Attributes**: Properties like `status`, `emailVerified`, and `failedLoginAttempts` that track account state
* **Timestamp Attributes**: Properties like `lastLogin`, `createdAt`, and `updatedAt` for tracking user activity

Example of core attributes:

```json
{
  "id": "usr_123456789",
  "username": "jsmith",
  "email": "john.smith@example.com",
  "status": "active",
  "emailVerified": true,
  "lastLogin": "2023-06-10T15:30:00Z",
  "createdAt": "2023-01-15T09:00:00Z",
  "updatedAt": "2023-06-10T15:30:00Z"
}
```

## User Profile

The profile section contains user personal information and preferences:

* **Contact Information**: Name, alternate emails, addresses
* **Preferences**: Language, timezone, notification settings
* **Personalization**: Avatar, display name, theme preferences

Example profile:

```json
{
  "profile": {
    "firstName": "John",
    "lastName": "Smith",
    "displayName": "John S.",
    "jobTitle": "Software Engineer",
    "department": "Engineering",
    "organization": "Product Development",
    "preferredLanguage": "en",
    "timezone": "America/New_York",
    "avatarUrl": "https://example.com/avatars/jsmith.jpg",
    "contactEmail": "john.work@example.com",
    "addresses": [
      {
        "type": "work",
        "street": "123 Tech Street",
        "city": "San Francisco",
        "state": "CA",
        "postalCode": "94103",
        "country": "USA"
      }
    ],
    "preferences": {
      "theme": "dark",
      "notifications": {
        "email": true,
        "push": true,
        "sms": false
      }
    }
  }
}
```

## Federated Identities

Users can authenticate with external identity providers. Each provider connection is stored in the `identities` array:

* **Provider Information**: Identity provider name and connection type
* **Provider IDs**: Unique identifiers from the external provider
* **Profile Data**: User information sourced from the provider

Example identity connection:

```json
{
  "identities": [
    {
      "provider": "github",
      "providerId": "github|12345",
      "connection": "github",
      "isSocial": true,
      "dateConnected": "2023-02-15T12:30:00Z",
      "profileData": {
        "login": "johnsmith",
        "avatar_url": "https://github.com/avatar.jpg",
        "html_url": "https://github.com/johnsmith"
      }
    },
    {
      "provider": "azure-ad",
      "providerId": "azure|abcdef123456",
      "connection": "azure-ad-connection",
      "isSocial": false,
      "dateConnected": "2023-01-20T09:15:00Z",
      "profileData": {
        "upn": "john.smith@company.com",
        "tenant_id": "tenant-1234"
      }
    }
  ]
}
```

## Database Schema

**Table: users**

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

* `users_id_idx` UNIQUE on `id` (for primary lookups)
* `users_username_idx` UNIQUE on `username` (for username authentication)
* `users_email_idx` UNIQUE on `email` (for email-based authentication)
* `users_status_idx` on `status` (for filtering by status)
* `users_last_login_idx` on `last_login` (for activity reporting)
* `users_identities_provider_idx` on `((identities->>'provider'))` (for provider-based lookups)

## Performance Considerations

For Users schema, consider these performance optimizations:

* **Authentication Cache**: Cache frequently authenticated users to reduce database load
* **Profile Data Partitioning**: Store less frequently accessed profile data separately
* **Identity Provider Federation**: Use federated queries for advanced identity provider integration
* **Read Replicas**: Configure read replicas specifically for authentication operations
* **Denormalization**: Strategically denormalize frequently accessed data like roles
* **Batch Operations**: Use batch operations for user imports and bulk updates
* **Index Optimization**: Monitor and optimize indexes based on actual query patterns

## Related Documentation

* [Authentication Service](../components/auth_service/README.md) - Service handling user authentication
* [Roles Schema](./roles.md) - Documentation for user roles
* [Permissions Schema](./permissions.md) - Documentation for permissions
* [Database Architecture](../database_architecture.md) - Overall database architecture 