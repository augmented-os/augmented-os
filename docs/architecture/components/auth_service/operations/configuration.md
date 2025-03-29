# Configuration Guidelines

## Overview

This document describes the configuration options for the Authentication Service. It details environment variables, configuration files, startup parameters, and runtime configuration to help operators deploy and manage the service effectively while maintaining security best practices.

## Configuration Methods

The Authentication Service can be configured using the following methods (in order of precedence):


1. **Environment Variables**: Highest precedence, override all other settings
2. **Configuration Files**: JSON or YAML files for detailed configuration
3. **Command Line Arguments**: Used during service startup
4. **Default Values**: Applied when no explicit configuration is provided

## Environment Variables

| Variable | Description | Default | Required | Example |
|----|----|----|----|----|
| `AUTH_SERVICE_PORT` | HTTP port for the service | `8080` | No | `9000` |
| `AUTH_SERVICE_HOST` | Host address to bind the service | `0.0.0.0` | No | `127.0.0.1` |
| `AUTH_LOG_LEVEL` | Logging level (ERROR, WARN, INFO, DEBUG, TRACE) | `INFO` | No | `DEBUG` |
| `AUTH_DATABASE_URL` | Database connection string | None | Yes | `postgresql://user:pass@host/dbname` |
| `AUTH_REDIS_URL` | Redis connection for caching and rate limiting | None | No | `redis://localhost:6379/0` |
| `AUTH_TOKEN_ISSUER` | Issuer claim for JWT tokens | `auth-service` | No | `my-company-auth` |
| `AUTH_TOKEN_AUDIENCE` | Default audience for JWT tokens | `api` | No | `my-api` |
| `AUTH_ACCESS_TOKEN_EXPIRY` | Access token expiry in seconds | `3600` | No | `1800` |
| `AUTH_REFRESH_TOKEN_EXPIRY` | Refresh token expiry in seconds | `2592000` | No | `1209600` |
| `AUTH_PASSWORD_MIN_LENGTH` | Minimum password length | `12` | No | `16` |
| `AUTH_PASSWORD_REQUIRE_MIXED_CASE` | Require mixed case in passwords | `true` | No | `false` |
| `AUTH_PASSWORD_REQUIRE_NUMBERS` | Require numbers in passwords | `true` | No | `false` |
| `AUTH_PASSWORD_REQUIRE_SYMBOLS` | Require symbols in passwords | `true` | No | `false` |
| `AUTH_MFA_ENABLED` | Enable MFA capabilities | `true` | No | `false` |
| `AUTH_MFA_REQUIRED` | Require MFA for all users | `false` | No | `true` |
| `AUTH_SESSION_COOKIE_NAME` | Name for session cookie | `auth_session` | No | `my_session` |
| `AUTH_SESSION_COOKIE_SECURE` | Use secure cookies | `true` | No | `false` |
| `AUTH_CORS_ALLOWED_ORIGINS` | CORS allowed origins (comma separated) | `*` | No | `https://app.example.com` |

### Sensitive Configuration

The following environment variables contain sensitive information and should be handled securely:

| Variable | Description | Security Recommendations |
|----|----|----|
| `AUTH_SIGNING_KEY` | Private key for token signing | Use secret management, never commit to code |
| `AUTH_SIGNING_KEY_PASSWORD` | Password for encrypted signing key | Use secret management service |
| `AUTH_DATABASE_PASSWORD` | Database password | Use secret management or connection string |
| `AUTH_SMTP_PASSWORD` | SMTP password for email delivery | Use secret management service |
| `AUTH_SMS_API_KEY` | API key for SMS delivery | Use secret management service |
| `AUTH_SOCIAL_*_CLIENT_SECRET` | Social login client secrets | Use secret management service |

## Configuration File

The service can be configured using a JSON or YAML configuration file specified with the `--config` command line argument or the `AUTH_CONFIG_FILE` environment variable.

### File Format

```json
{
  "service": {
    "name": "auth-service",
    "port": 8080,
    "host": "0.0.0.0",
    "logLevel": "INFO",
    "corsAllowedOrigins": ["https://example.com"]
  },
  "database": {
    "host": "localhost",
    "port": 5432,
    "name": "auth_db",
    "maxConnections": 20,
    "connectionTimeout": 5000,
    "ssl": true
  },
  "cache": {
    "enabled": true,
    "ttlSeconds": 300,
    "redis": {
      "host": "localhost",
      "port": 6379,
      "database": 0
    }
  },
  "token": {
    "issuer": "auth-service",
    "audience": "api",
    "accessTokenExpiry": 3600,
    "refreshTokenExpiry": 2592000,
    "algorithm": "ES256",
    "keyRotationDays": 30
  },
  "security": {
    "password": {
      "minLength": 12,
      "requireMixedCase": true,
      "requireNumbers": true,
      "requireSymbols": true,
      "checkBreachedPasswords": true
    },
    "rateLimit": {
      "enabled": true,
      "maxAttempts": 5,
      "windowSeconds": 300
    },
    "mfa": {
      "enabled": true,
      "required": false,
      "methods": ["totp", "sms", "email"]
    }
  },
  "email": {
    "enabled": true,
    "from": "auth@example.com",
    "smtp": {
      "host": "smtp.example.com",
      "port": 587,
      "secure": true
    }
  },
  "integration": {
    "social": {
      "google": {
        "enabled": true,
        "clientId": "google-client-id"
      },
      "facebook": {
        "enabled": true,
        "clientId": "facebook-client-id"
      }
    }
  }
}
```

### Configuration Sections

#### Service Configuration

| Setting | Description | Default | Required |
|----|----|----|----|
| `service.name` | Service name for identification | `auth-service` | No |
| `service.port` | HTTP port for the service | `8080` | No |
| `service.host` | Host to bind the service | `0.0.0.0` | No |
| `service.logLevel` | Logging level | `INFO` | No |
| `service.corsAllowedOrigins` | CORS allowed origins | `["*"]` | No |

#### Database Configuration

| Setting | Description | Default | Required |
|----|----|----|----|
| `database.host` | Database server hostname | `localhost` | Yes |
| `database.port` | Database server port | `5432` | Yes |
| `database.name` | Database name | `auth_db` | Yes |
| `database.username` | Database username | None | Yes |
| `database.password` | Database password | None | Yes |
| `database.maxConnections` | Connection pool size | `20` | No |
| `database.connectionTimeout` | Connection timeout in ms | `5000` | No |
| `database.ssl` | Use SSL for connection | `true` | No |

#### Cache Configuration

| Setting | Description | Default | Required |
|----|----|----|----|
| `cache.enabled` | Whether caching is enabled | `true` | No |
| `cache.ttlSeconds` | Default cache TTL | `300` | No |
| `cache.redis.host` | Redis hostname | `localhost` | Yes if cache enabled |
| `cache.redis.port` | Redis port | `6379` | No |
| `cache.redis.database` | Redis database index | `0` | No |

#### Token Configuration

| Setting | Description | Default | Required |
|----|----|----|----|
| `token.issuer` | JWT issuer claim | `auth-service` | No |
| `token.audience` | JWT audience claim | `api` | No |
| `token.accessTokenExpiry` | Access token expiry seconds | `3600` | No |
| `token.refreshTokenExpiry` | Refresh token expiry seconds | `2592000` | No |
| `token.algorithm` | JWT signing algorithm | `ES256` | No |
| `token.keyRotationDays` | Days between key rotations | `30` | No |

#### Security Configuration

| Setting | Description | Default | Required |
|----|----|----|----|
| `security.password.minLength` | Minimum password length | `12` | No |
| `security.password.requireMixedCase` | Require mixed case | `true` | No |
| `security.password.requireNumbers` | Require numbers | `true` | No |
| `security.password.requireSymbols` | Require symbols | `true` | No |
| `security.password.checkBreachedPasswords` | Check breached passwords | `true` | No |
| `security.rateLimit.enabled` | Enable rate limiting | `true` | No |
| `security.rateLimit.maxAttempts` | Max attempts before limiting | `5` | No |
| `security.rateLimit.windowSeconds` | Rate limit window seconds | `300` | No |
| `security.mfa.enabled` | Enable MFA | `true` | No |
| `security.mfa.required` | Require MFA for all users | `false` | No |
| `security.mfa.methods` | Allowed MFA methods | `["totp", "sms", "email"]` | No |

#### Email Configuration

| Setting | Description | Default | Required |
|----|----|----|----|
| `email.enabled` | Enable email notifications | `true` | No |
| `email.from` | From address for emails | `auth@example.com` | Yes if enabled |
| `email.smtp.host` | SMTP server host | None | Yes if enabled |
| `email.smtp.port` | SMTP server port | `587` | No |
| `email.smtp.secure` | Use TLS/SSL | `true` | No |

#### Integration Configuration

| Setting | Description | Default | Required |
|----|----|----|----|
| `integration.social.google.enabled` | Enable Google login | `false` | No |
| `integration.social.google.clientId` | Google client ID | None | Yes if enabled |
| `integration.social.facebook.enabled` | Enable Facebook login | `false` | No |
| `integration.social.facebook.clientId` | Facebook client ID | None | Yes if enabled |

## Command Line Arguments

The service accepts the following command line arguments:

| Argument | Description | Default |
|----|----|----|
| `--config` | Path to configuration file | None |
| `--port` | HTTP port for the service | `8080` |
| `--host` | Host to bind the service | `0.0.0.0` |
| `--log-level` | Logging level | `INFO` |
| `--debug` | Enable debug mode | `false` |
| `--show-config` | Display loaded config and exit | `false` |
| `--validate-config` | Validate config and exit | `false` |

## Runtime Configuration

The Authentication Service supports the following runtime configuration changes without restart:

| Configuration | Method | Notes |
|----|----|----|
| Log Level | API call to `/admin/loglevel` | Requires admin authentication |
| Rate Limit Settings | API call to `/admin/ratelimit` | Requires admin authentication |
| MFA Settings | API call to `/admin/mfa` | Requires admin authentication |
| Social Providers | API call to `/admin/social` | Requires admin authentication |

## Environment-Specific Configurations

### Development Environment

```json
{
  "service": {
    "logLevel": "DEBUG",
    "corsAllowedOrigins": ["*"]
  },
  "database": {
    "host": "localhost",
    "ssl": false
  },
  "security": {
    "password": {
      "checkBreachedPasswords": false
    },
    "rateLimit": {
      "maxAttempts": 20
    }
  },
  "token": {
    "accessTokenExpiry": 86400
  }
}
```

### Production Environment

```json
{
  "service": {
    "logLevel": "INFO",
    "corsAllowedOrigins": ["https://app.example.com"]
  },
  "database": {
    "maxConnections": 50,
    "ssl": true
  },
  "security": {
    "password": {
      "minLength": 16,
      "checkBreachedPasswords": true
    },
    "rateLimit": {
      "enabled": true,
      "maxAttempts": 5,
      "windowSeconds": 300
    },
    "mfa": {
      "enabled": true
    }
  },
  "token": {
    "accessTokenExpiry": 1800,
    "keyRotationDays": 15
  },
  "cache": {
    "ttlSeconds": 600
  }
}
```

## Configuration Best Practices


 1. **Use environment variables for deployment-specific settings**: This allows the same container image to be deployed across environments
 2. **Use secret management for sensitive values**: Never store secrets in configuration files or environment variables directly
 3. **Rotate cryptographic keys regularly**: Configure automated key rotation with appropriate overlap periods
 4. **Implement strict password policies in production**: Use higher minimum length and complexity requirements
 5. **Enable MFA in production**: Consider requiring MFA for privileged accounts
 6. **Adjust token lifetimes based on security requirements**: Shorter lifetimes for access tokens improve security
 7. **Configure appropriate rate limiting**: Protect against brute force and denial of service attacks
 8. **Enable TLS for all connections**: Database, Redis, and all other service connections should use TLS
 9. **Monitor configuration changes**: Enable audit logging for all configuration changes
10. **Validate configuration on startup**: The service validates all configuration on startup and fails fast if required settings are missing

## Related Documentation

* [Monitoring](./monitoring.md)
* [Scaling](./scaling.md)
* [Security Considerations](../security_considerations.md)
* [Auth Provider](../implementation/auth_provider.md)
* [Key Manager](../implementation/key_manager.md)
* [Token Service](../implementation/token_service.md)


