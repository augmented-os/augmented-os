# Validation Service API Reference

## Overview

The Validation Service exposes a RESTful API that allows clients to validate data against registered schemas, manage schemas, and register custom validators. This document details the available endpoints, request formats, and response structures.

An OpenAPI specification is available at [validation-service-api.yaml](./validation-service-api.yaml) for integration with API tools and code generators.

## Base URL

```
/api/v1/validation
```

## Authentication

All API endpoints require authentication using either:

* Bearer token authentication
* API key in the `X-API-Key` header

Service-to-service communication may use direct authentication via internal service credentials.

## Endpoints

### Schema Management

#### List Schemas

```
GET /schemas
```

Returns a list of available schemas.

**Query Parameters:**

* `page`: Page number (default: 1)
* `limit`: Items per page (default: 20)
* `namespace`: Filter by namespace
* `deprecated`: Include deprecated schemas (boolean, default: false)
* `search`: Text search across name and description fields

**Response:**

```json
{
  "items": [
    {
      "id": "user-profile",
      "version": "1.2.0",
      "namespace": "users",
      "name": "User Profile Schema",
      "description": "Validation schema for user profiles",
      "isDeprecated": false,
      "updatedAt": "2023-07-15T14:30:00Z"
    },
    {
      "id": "payment-details",
      "version": "2.0.1",
      "namespace": "payments",
      "name": "Payment Details Schema",
      "description": "Validation schema for payment information",
      "isDeprecated": false,
      "updatedAt": "2023-08-20T09:15:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 42,
    "pages": 3
  }
}
```

#### Get Schema

```
GET /schemas/{id}
```

Returns a specific schema by ID.

**Path Parameters:**

* `id`: The schema ID

**Query Parameters:**

* `version`: Specific schema version (optional, defaults to latest)

**Response:**

```json
{
  "id": "user-profile",
  "version": "1.2.0",
  "namespace": "users",
  "name": "User Profile Schema",
  "description": "Validation schema for user profiles",
  "schema": {
    "type": "object",
    "properties": {
      "username": {
        "type": "string",
        "minLength": 3,
        "maxLength": 50
      },
      "email": {
        "type": "string",
        "format": "email"
      },
      "age": {
        "type": "integer",
        "minimum": 13
      }
    },
    "required": ["username", "email"]
  },
  "isDeprecated": false,
  "metadata": {
    "owner": "user-service-team",
    "compatibility": "BACKWARD",
    "tags": ["user", "profile"]
  },
  "createdAt": "2023-05-10T08:30:00Z",
  "updatedAt": "2023-07-15T14:30:00Z"
}
```

#### Register Schema

```
POST /schemas
```

Registers a new schema.

**Request Body:**

```json
{
  "id": "product",
  "namespace": "catalog",
  "name": "Product Schema",
  "description": "Validation schema for product information",
  "schema": {
    "type": "object",
    "properties": {
      "productId": {
        "type": "string",
        "pattern": "^PRD-[0-9]{6}$"
      },
      "name": {
        "type": "string",
        "minLength": 1,
        "maxLength": 100
      },
      "price": {
        "type": "number",
        "minimum": 0
      },
      "category": {
        "type": "string",
        "enum": ["electronics", "clothing", "food", "other"]
      }
    },
    "required": ["productId", "name", "price"]
  },
  "metadata": {
    "owner": "catalog-team",
    "compatibility": "BACKWARD",
    "tags": ["product", "catalog"]
  }
}
```

**Response:**

```json
{
  "id": "product",
  "version": "1.0.0",
  "namespace": "catalog",
  "name": "Product Schema",
  "description": "Validation schema for product information",
  "schema": {
    "type": "object",
    "properties": {
      "productId": {
        "type": "string",
        "pattern": "^PRD-[0-9]{6}$"
      },
      "name": {
        "type": "string",
        "minLength": 1,
        "maxLength": 100
      },
      "price": {
        "type": "number",
        "minimum": 0
      },
      "category": {
        "type": "string",
        "enum": ["electronics", "clothing", "food", "other"]
      }
    },
    "required": ["productId", "name", "price"]
  },
  "isDeprecated": false,
  "metadata": {
    "owner": "catalog-team",
    "compatibility": "BACKWARD",
    "tags": ["product", "catalog"]
  },
  "createdAt": "2023-09-01T10:15:00Z",
  "updatedAt": "2023-09-01T10:15:00Z"
}
```

#### Update Schema

```
PUT /schemas/{id}
```

Updates an existing schema by creating a new version.

**Path Parameters:**

* `id`: The schema ID

**Query Parameters:**

* `checkCompatibility`: Whether to check compatibility with previous versions (boolean, default: true)

**Request Body:**

```json
{
  "name": "Product Schema",
  "description": "Updated validation schema for product information",
  "schema": {
    "type": "object",
    "properties": {
      "productId": {
        "type": "string",
        "pattern": "^PRD-[0-9]{6}$"
      },
      "name": {
        "type": "string",
        "minLength": 1,
        "maxLength": 100
      },
      "price": {
        "type": "number",
        "minimum": 0
      },
      "category": {
        "type": "string",
        "enum": ["electronics", "clothing", "food", "other", "books"]
      },
      "inStock": {
        "type": "boolean",
        "default": true
      }
    },
    "required": ["productId", "name", "price"]
  },
  "metadata": {
    "owner": "catalog-team",
    "compatibility": "BACKWARD",
    "tags": ["product", "catalog", "inventory"]
  }
}
```

**Response:**

```json
{
  "id": "product",
  "version": "1.1.0",
  "namespace": "catalog",
  "name": "Product Schema",
  "description": "Updated validation schema for product information",
  "schema": { /* Updated schema object */ },
  "isDeprecated": false,
  "metadata": {
    "owner": "catalog-team",
    "compatibility": "BACKWARD",
    "tags": ["product", "catalog", "inventory"]
  },
  "changes": [
    {
      "type": "ADDED_FIELD",
      "path": "properties.inStock",
      "description": "Added optional 'inStock' field"
    },
    {
      "type": "ADDED_ENUM_VALUE",
      "path": "properties.category.enum",
      "description": "Added 'books' enum value"
    }
  ],
  "createdAt": "2023-09-05T14:30:00Z",
  "updatedAt": "2023-09-05T14:30:00Z"
}
```

### Validation Endpoints

#### Validate Data

```
POST /validate
```

Validates data against a schema.

**Request Body:**

```json
{
  "schemaId": "product",
  "version": "1.1.0",  // Optional, defaults to latest
  "data": {
    "productId": "PRD-123456",
    "name": "Wireless Headphones",
    "price": 99.99,
    "category": "electronics"
  },
  "options": {
    "errorFormat": "detailed",  // "standard", "detailed", "basic"
    "coerceTypes": false,       // Whether to coerce data types
    "strictMode": true          // Enforce strict validation
  }
}
```

**Response (Success):**

```json
{
  "valid": true,
  "data": {
    "productId": "PRD-123456",
    "name": "Wireless Headphones",
    "price": 99.99,
    "category": "electronics"
  },
  "meta": {
    "schemaId": "product",
    "version": "1.1.0",
    "duration": 12.45,       // Milliseconds
    "mode": "normal"
  }
}
```

**Response (Validation Error):**

```json
{
  "valid": false,
  "errors": [
    {
      "code": "type",
      "message": "price must be a number, but received string",
      "path": "price",
      "schemaPath": "#/properties/price/type",
      "params": {
        "type": "number",
        "actualType": "string"
      }
    },
    {
      "code": "enum",
      "message": "category must be one of: electronics, clothing, food, other, books",
      "path": "category",
      "schemaPath": "#/properties/category/enum",
      "params": {
        "allowedValues": ["electronics", "clothing", "food", "other", "books"],
        "actualValue": "gadgets"
      }
    }
  ],
  "meta": {
    "schemaId": "product",
    "version": "1.1.0",
    "duration": 15.32,       // Milliseconds
    "mode": "normal",
    "errorCount": 2
  }
}
```

#### Batch Validate Data

```
POST /validate/batch
```

Validates multiple data objects against schemas in a single request.

**Request Body:**

```json
{
  "validations": [
    {
      "id": "validation1",
      "schemaId": "product",
      "data": {
        "productId": "PRD-123456",
        "name": "Wireless Headphones",
        "price": 99.99,
        "category": "electronics"
      }
    },
    {
      "id": "validation2",
      "schemaId": "user-profile",
      "data": {
        "username": "johndoe",
        "email": "invalid-email",
        "age": 25
      }
    }
  ],
  "options": {
    "errorFormat": "standard",
    "stopOnFirstError": false  // Whether to stop processing on first validation error
  }
}
```

**Response:**

```json
{
  "results": [
    {
      "id": "validation1",
      "valid": true,
      "meta": {
        "schemaId": "product",
        "version": "1.1.0",
        "duration": 10.2
      }
    },
    {
      "id": "validation2",
      "valid": false,
      "errors": [
        {
          "code": "format",
          "message": "email must be a valid email",
          "path": "email",
          "schemaPath": "#/properties/email/format"
        }
      ],
      "meta": {
        "schemaId": "user-profile",
        "version": "1.2.0",
        "duration": 8.7,
        "errorCount": 1
      }
    }
  ],
  "meta": {
    "totalDuration": 18.9,
    "successCount": 1,
    "failureCount": 1
  }
}
```

### Custom Validator Endpoints

#### List Custom Validators

```
GET /validators
```

Returns a list of registered custom validators.

**Response:**

```json
{
  "items": [
    {
      "keyword": "emailDomain",
      "description": "Validates email domains against an allowlist",
      "async": false,
      "modifying": false,
      "hasMetaSchema": true,
      "updatedAt": "2023-06-05T11:20:00Z"
    },
    {
      "keyword": "uniqueInDatabase",
      "description": "Validates value uniqueness against database records",
      "async": true,
      "modifying": false,
      "hasMetaSchema": true,
      "updatedAt": "2023-07-12T09:45:00Z"
    }
  ]
}
```

#### Register Custom Validator

```
POST /validators
```

Registers a new custom validator.

**Request Body:**

```json
{
  "keyword": "geolocation",
  "description": "Validates that coordinates are within a specified region",
  "metaSchema": {
    "type": "object",
    "properties": {
      "regions": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "name": { "type": "string" },
            "bounds": {
              "type": "object",
              "properties": {
                "minLat": { "type": "number" },
                "maxLat": { "type": "number" },
                "minLong": { "type": "number" },
                "maxLong": { "type": "number" }
              },
              "required": ["minLat", "maxLat", "minLong", "maxLong"]
            }
          },
          "required": ["name", "bounds"]
        },
        "minItems": 1
      }
    },
    "required": ["regions"]
  },
  "function": "function validate(data, schema) {\n  if (!Array.isArray(data) || data.length !== 2) {\n    return false;\n  }\n  const [latitude, longitude] = data;\n  if (typeof latitude !== 'number' || typeof longitude !== 'number') {\n    return false;\n  }\n  return schema.regions.some(region => {\n    return latitude >= region.bounds.minLat &&\n           latitude <= region.bounds.maxLat &&\n           longitude >= region.bounds.minLong &&\n           longitude <= region.bounds.maxLong;\n  });\n}",
  "async": false,
  "modifying": false,
  "dependencies": []
}
```

**Response:**

```json
{
  "keyword": "geolocation",
  "description": "Validates that coordinates are within a specified region",
  "async": false,
  "modifying": false,
  "hasMetaSchema": true,
  "createdAt": "2023-09-01T14:25:00Z",
  "updatedAt": "2023-09-01T14:25:00Z"
}
```

## Error Handling

The API uses standard HTTP status codes to indicate the success or failure of requests.

### Common Error Codes

| Status Code | Description |
|----|----|
| 400 | Bad Request - The request was malformed or contains invalid parameters |
| 401 | Unauthorized - Authentication is required or failed |
| 403 | Forbidden - The authenticated user lacks permission |
| 404 | Not Found - The requested schema or validator does not exist |
| 409 | Conflict - The request conflicts with current state (e.g., schema ID already exists) |
| 422 | Unprocessable Entity - Schema validation failed or contains syntax errors |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - An unexpected error occurred |

### Error Response Format

```json
{
  "error": {
    "code": "INVALID_SCHEMA",
    "message": "The provided schema is not valid JSON Schema",
    "details": {
      "schemaPath": "#/properties/price/type",
      "message": "Expected value of type 'string', received 'array'"
    },
    "requestId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
  }
}
```

## Rate Limiting

The API implements rate limiting to ensure fair usage. Limits are applied per API key or user.

| Endpoint | Rate Limit |
|----|----|
| Validation endpoints | 1000 requests per minute |
| Schema management | 100 requests per minute |
| Custom validator registration | 20 requests per minute |

Rate limit information is included in response headers:

* `X-RateLimit-Limit`: Total requests allowed in the period
* `X-RateLimit-Remaining`: Requests remaining in the period
* `X-RateLimit-Reset`: Time when the rate limit resets (Unix timestamp)

## Related Documentation

* [Internal Interfaces](./internal.md)
* [Data Model](../data_model.md)
* [Schema Registry](../implementation/schema_registry.md)
* [Validation Engine](../implementation/validation_engine.md)
* [Custom Validator Registry](../implementation/custom_validator_registry.md) 