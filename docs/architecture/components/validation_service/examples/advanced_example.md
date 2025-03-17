# Validation Service Advanced Examples

This document provides advanced examples of using the Validation Service, focusing on custom validators, complex validation scenarios, schema evolution, and troubleshooting.

## Custom Validators

The Validation Service allows you to register custom validators for specialized validation logic beyond what standard schemas can provide.

### Creating a Custom Validator

Custom validators are JavaScript functions that implement specialized validation logic.

#### Example Custom Email Validator

```javascript
function validateCorporateEmail(value, options) {
  // Skip validation if not a string or email isn't required and value is empty
  if (typeof value !== 'string' || (value === '' && !options.required)) {
    return { valid: true };
  }
  
  // Perform basic email validation
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!emailRegex.test(value)) {
    return {
      valid: false,
      errors: [{ message: "Invalid email format" }]
    };
  }
  
  // Check for allowed domain
  const domain = value.split('@')[1];
  const allowedDomains = options.domains || ['example.com'];
  
  if (!allowedDomains.includes(domain)) {
    return {
      valid: false,
      errors: [{
        message: `Email must use one of the allowed domains: ${allowedDomains.join(', ')}`
      }]
    };
  }
  
  return { valid: true };
}
```

### Registering a Custom Validator

You register custom validators using the Validation Service API.

```bash
curl -X POST http://localhost:8080/v1/validators \
  -H "Content-Type: application/json" \
  -d '{
    "validatorId": "corporate-email",
    "validatorType": "js",
    "validator": "function validateCorporateEmail(value, options) {\n  // Skip validation if not a string or email isn\"t required and value is empty\n  if (typeof value !== \"string\" || (value === \"\" && !options.required)) {\n    return { valid: true };\n  }\n  \n  // Perform basic email validation\n  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}$/;\n  if (!emailRegex.test(value)) {\n    return {\n      valid: false,\n      errors: [{ message: \"Invalid email format\" }]\n    };\n  }\n  \n  // Check for allowed domain\n  const domain = value.split(\"@\")[1];\n  const allowedDomains = options.domains || [\"example.com\"];\n  \n  if (!allowedDomains.includes(domain)) {\n    return {\n      valid: false,\n      errors: [{\n        message: `Email must use one of the allowed domains: ${allowedDomains.join(\", \")}`\n      }]\n    };\n  }\n  \n  return { valid: true };\n}",
    "description": "Validates that an email address uses an allowed corporate domain"
  }'
```

### Response

```json
{
  "status": "success",
  "message": "Validator registered successfully",
  "data": {
    "validatorId": "corporate-email",
    "validatorType": "js",
    "createdAt": "2023-06-15T14:22:33.456Z"
  }
}
```

### Using Custom Validators in Schemas

You can use custom validators in your schemas by referencing them in the schema definition.

```bash
curl -X POST http://localhost:8080/v1/schemas \
  -H "Content-Type: application/json" \
  -d '{
    "schemaId": "employee-profile",
    "schemaType": "json",
    "version": "1.0",
    "schema": {
      "$schema": "http://json-schema.org/draft-07/schema#",
      "type": "object",
      "required": ["id", "name", "email"],
      "properties": {
        "id": {
          "type": "string",
          "format": "uuid"
        },
        "name": {
          "type": "string",
          "minLength": 1
        },
        "email": {
          "type": "string",
          "format": "email",
          "x-custom-validator": {
            "validator": "corporate-email",
            "options": {
              "required": true,
              "domains": ["example.com", "example.org"]
            }
          }
        },
        "department": {
          "type": "string",
          "enum": ["Engineering", "Marketing", "Sales", "HR"]
        }
      }
    }
  }'
```

### Validating with Custom Validators

```bash
curl -X POST http://localhost:8080/v1/validate \
  -H "Content-Type: application/json" \
  -d '{
    "schemaId": "employee-profile",
    "version": "1.0",
    "data": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "John Doe",
      "email": "john.doe@other-company.com",
      "department": "Engineering"
    }
  }'
```

### Response with Custom Validator Errors

```json
{
  "valid": false,
  "schemaId": "employee-profile",
  "version": "1.0",
  "errors": [
    {
      "path": "$.email",
      "message": "Email must use one of the allowed domains: example.com, example.org",
      "errorCode": "custom-validator",
      "validator": "corporate-email"
    }
  ]
}
```

## Complex Validation Scenarios

### Nested Object Validation

Validating complex nested objects is a common requirement:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["order", "customer", "items"],
  "properties": {
    "order": {
      "type": "object",
      "required": ["orderId", "orderDate", "status"],
      "properties": {
        "orderId": { "type": "string" },
        "orderDate": { "type": "string", "format": "date-time" },
        "status": { "type": "string", "enum": ["pending", "processing", "shipped", "delivered"] }
      }
    },
    "customer": {
      "type": "object",
      "required": ["customerId", "name", "contact"],
      "properties": {
        "customerId": { "type": "string" },
        "name": { "type": "string" },
        "contact": {
          "type": "object",
          "required": ["email"],
          "properties": {
            "email": { "type": "string", "format": "email" },
            "phone": { "type": "string", "pattern": "^\\+[0-9]{1,3}\\s[0-9]{4,14}$" },
            "address": {
              "type": "object",
              "properties": {
                "street": { "type": "string" },
                "city": { "type": "string" },
                "country": { "type": "string" },
                "postalCode": { "type": "string" }
              }
            }
          }
        }
      }
    },
    "items": {
      "type": "array",
      "minItems": 1,
      "items": {
        "type": "object",
        "required": ["productId", "quantity", "price"],
        "properties": {
          "productId": { "type": "string" },
          "name": { "type": "string" },
          "quantity": { "type": "integer", "minimum": 1 },
          "price": { "type": "number", "minimum": 0 }
        }
      }
    },
    "totalAmount": { "type": "number", "minimum": 0 },
    "notes": { "type": "string" }
  }
}
```

### Cross-Field Validation

Sometimes, you need to validate that fields relate to each other correctly:

```javascript
function validateTotalAmount(data, options) {
  // Validate that total amount matches sum of item prices * quantities
  if (!data.items || !Array.isArray(data.items) || !data.totalAmount) {
    return { valid: true }; // Skip validation if structure is not as expected
  }
  
  const calculatedTotal = data.items.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);
  
  // Allow for small floating point differences
  const tolerance = options.tolerance || 0.001;
  if (Math.abs(data.totalAmount - calculatedTotal) > tolerance) {
    return {
      valid: false,
      errors: [{
        message: `Total amount (${data.totalAmount}) does not match sum of item prices (${calculatedTotal})`
      }]
    };
  }
  
  return { valid: true };
}
```

Register this validator and use it at the root level of your order schema:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "x-custom-validator": {
    "validator": "total-amount-check",
    "options": {
      "tolerance": 0.01
    }
  },
  "properties": {
    // ... other properties from the order schema
  }
}
```

### Complex Conditional Validation

JSON Schema allows for complex conditions with `if`, `then`, and `else`:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "paymentMethod": {
      "type": "string",
      "enum": ["credit_card", "bank_transfer", "paypal"]
    },
    "creditCardNumber": { "type": "string" },
    "creditCardExpiry": { "type": "string" },
    "creditCardCVV": { "type": "string" },
    "bankAccountNumber": { "type": "string" },
    "bankRoutingNumber": { "type": "string" },
    "paypalEmail": { "type": "string", "format": "email" }
  },
  "required": ["paymentMethod"],
  "allOf": [
    {
      "if": {
        "properties": { "paymentMethod": { "const": "credit_card" } }
      },
      "then": {
        "required": ["creditCardNumber", "creditCardExpiry", "creditCardCVV"],
        "properties": {
          "creditCardNumber": {
            "pattern": "^[0-9]{16}$",
            "x-custom-validator": { "validator": "luhn-check" }
          },
          "creditCardExpiry": { "pattern": "^(0[1-9]|1[0-2])/[0-9]{2}$" },
          "creditCardCVV": { "pattern": "^[0-9]{3,4}$" }
        }
      }
    },
    {
      "if": {
        "properties": { "paymentMethod": { "const": "bank_transfer" } }
      },
      "then": {
        "required": ["bankAccountNumber", "bankRoutingNumber"]
      }
    },
    {
      "if": {
        "properties": { "paymentMethod": { "const": "paypal" } }
      },
      "then": {
        "required": ["paypalEmail"]
      }
    }
  ]
}
```

### Complex Array Validation

Validating arrays with specific item constraints:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "products": {
      "type": "array",
      "minItems": 1,
      "maxItems": 100,
      "items": {
        "type": "object",
        "properties": {
          "id": { "type": "string" },
          "name": { "type": "string" },
          "category": { "type": "string" }
        },
        "required": ["id", "name"]
      },
      "uniqueItems": true,
      "x-custom-validator": {
        "validator": "unique-product-ids",
        "options": {
          "idField": "id"
        }
      }
    },
    "distinctCategories": {
      "type": "boolean",
      "description": "Indicates if all products must be from different categories"
    }
  },
  "allOf": [
    {
      "if": {
        "properties": { "distinctCategories": { "const": true } }
      },
      "then": {
        "properties": {
          "products": {
            "x-custom-validator": {
              "validator": "distinct-categories",
              "options": {
                "categoryField": "category"
              }
            }
          }
        }
      }
    }
  ]
}
```

## Schema Evolution and Compatibility

### Backward Compatible Schema Evolution

Backward compatibility ensures that data validated against an older schema version remains valid against newer versions.

#### Version 1.0 (Original)

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["id", "name", "email"],
  "properties": {
    "id": { "type": "string" },
    "name": { "type": "string" },
    "email": { "type": "string", "format": "email" }
  }
}
```

#### Version 1.1 (Backward Compatible)

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["id", "name", "email"],
  "properties": {
    "id": { "type": "string" },
    "name": { "type": "string" },
    "email": { "type": "string", "format": "email" },
    "phone": { "type": "string" },
    "address": {
      "type": "object",
      "properties": {
        "street": { "type": "string" },
        "city": { "type": "string" }
      }
    }
  }
}
```

This evolution is backward compatible because:
1. No new required fields are added
2. Existing field types remain the same
3. Constraints on existing fields aren't tightened
4. New fields are optional

### Checking Schema Compatibility

```bash
curl -X POST http://localhost:8080/v1/schemas/compatibility-check \
  -H "Content-Type: application/json" \
  -d '{
    "schemaId": "user-profile",
    "existingVersion": "1.0",
    "newSchemaDefinition": {
      "$schema": "http://json-schema.org/draft-07/schema#",
      "type": "object",
      "required": ["id", "name", "email", "phone"],
      "properties": {
        "id": { "type": "string" },
        "name": { "type": "string" },
        "email": { "type": "string", "format": "email" },
        "phone": { "type": "string" }
      }
    },
    "compatibilityLevel": "BACKWARD"
  }'
```

#### Response for Incompatible Change

```json
{
  "compatible": false,
  "errors": [
    {
      "message": "New schema has additional required fields: [phone]",
      "location": "required",
      "compatibilityType": "BACKWARD"
    }
  ],
  "suggestedChanges": [
    "Make 'phone' optional by removing it from the required array",
    "Provide default values for new required fields"
  ]
}
```

## Performance Optimization

### Batch Validation

For high-volume validation, use the batch validation endpoint:

```bash
curl -X POST http://localhost:8080/v1/validate/batch \
  -H "Content-Type: application/json" \
  -d '{
    "schemaId": "user-profile",
    "version": "1.0",
    "items": [
      {
        "id": "item-1",
        "data": {
          "id": "123e4567-e89b-12d3-a456-426614174000",
          "name": "John Doe",
          "email": "john.doe@example.com"
        }
      },
      {
        "id": "item-2",
        "data": {
          "id": "invalid-uuid",
          "name": "",
          "email": "not-an-email"
        }
      },
      {
        "id": "item-3",
        "data": {
          "id": "223e4567-e89b-12d3-a456-426614174000",
          "name": "Jane Smith",
          "email": "jane.smith@example.com"
        }
      }
    ]
  }'
```

#### Batch Validation Response

```json
{
  "results": [
    {
      "id": "item-1",
      "valid": true,
      "errors": []
    },
    {
      "id": "item-2",
      "valid": false,
      "errors": [
        {
          "path": "$.id",
          "message": "String does not match format: uuid",
          "errorCode": "format"
        },
        {
          "path": "$.name",
          "message": "String length is less than minimum length of 1",
          "errorCode": "minLength"
        },
        {
          "path": "$.email",
          "message": "String does not match format: email",
          "errorCode": "format"
        }
      ]
    },
    {
      "id": "item-3",
      "valid": true,
      "errors": []
    }
  ],
  "summary": {
    "total": 3,
    "valid": 2,
    "invalid": 1
  }
}
```

### Using Schema Caching

To improve performance, enable schema caching:

```bash
curl -X POST http://localhost:8080/v1/validate \
  -H "Content-Type: application/json" \
  -H "X-Cache-Schema: true" \
  -d '{
    "schemaId": "user-profile",
    "version": "1.0",
    "data": { ... }
  }'
```

### Optimizing Custom Validators

Performance best practices for custom validators:

1. **Early returns**: Check for invalid conditions first and return early
2. **Avoid excessive computation**: Keep validators focused and lightweight
3. **Use efficient algorithms**: For complex validations, optimize time complexity
4. **Cache expensive computations**: Use memoization for repeated operations

Example optimized validator:

```javascript
function validatePostalCode(value, options) {
  // Skip validation if not applicable
  if (typeof value !== 'string' || value === '') {
    return { valid: true };
  }
  
  // Cache of valid postal code patterns by country
  const PATTERNS = {
    'US': /^\d{5}(-\d{4})?$/,
    'CA': /^[A-Z]\d[A-Z] \d[A-Z]\d$/,
    'UK': /^[A-Z]{1,2}\d[A-Z\d]? \d[A-Z]{2}$/
  };
  
  const country = options.country || 'US';
  const pattern = PATTERNS[country];
  
  if (!pattern) {
    return {
      valid: false,
      errors: [{ message: `Unsupported country code: ${country}` }]
    };
  }
  
  if (!pattern.test(value)) {
    return {
      valid: false,
      errors: [{ message: `Invalid postal code format for ${country}` }]
    };
  }
  
  return { valid: true };
}
```

## Error Handling and Formatting

### Custom Error Formatting

The Validation Service allows you to customize error formatting:

```bash
curl -X POST http://localhost:8080/v1/validate \
  -H "Content-Type: application/json" \
  -H "X-Error-Format: detailed" \
  -d '{
    "schemaId": "user-profile",
    "version": "1.0",
    "data": { ... }
  }'
```

### Detailed Error Response

```json
{
  "valid": false,
  "schemaId": "user-profile",
  "version": "1.0",
  "errors": [
    {
      "path": "$.email",
      "message": "String does not match format: email",
      "errorCode": "format",
      "schemaPath": "#/properties/email/format",
      "value": "not-an-email",
      "expected": "email format",
      "severity": "error",
      "suggestion": "Provide a valid email address (e.g., user@example.com)"
    }
  ],
  "errorSummary": "1 validation error found"
}
```

### Error Localization

Request localized error messages:

```bash
curl -X POST http://localhost:8080/v1/validate \
  -H "Content-Type: application/json" \
  -H "Accept-Language: fr" \
  -d '{
    "schemaId": "user-profile",
    "version": "1.0",
    "data": { ... }
  }'
```

### Localized Error Response

```json
{
  "valid": false,
  "schemaId": "user-profile",
  "version": "1.0",
  "errors": [
    {
      "path": "$.email",
      "message": "La chaîne ne correspond pas au format: email",
      "errorCode": "format"
    }
  ]
}
```

## Troubleshooting

### Common Issues and Solutions

#### Schema Registration Failures

**Issue**: Schema registration fails with a validation error.

**Solution**: Ensure your schema follows the JSON Schema specification. Common mistakes:
- Missing required `$schema` property
- Invalid schema type (must be one of: json, avro, xml, protobuf)
- Schema exceeds maximum size limit

```bash
# Validate a schema before registering
curl -X POST http://localhost:8080/v1/schemas/validate \
  -H "Content-Type: application/json" \
  -d '{
    "schema": { ... }
  }'
```

#### Custom Validator Execution Errors

**Issue**: Custom validator throws runtime errors.

**Solution**: Debug the validator with the test endpoint:

```bash
curl -X POST http://localhost:8080/v1/validators/test \
  -H "Content-Type: application/json" \
  -d '{
    "validator": "function validateEmail(value) { /* validator code */ }",
    "value": "test@example.com",
    "options": { "domain": "example.com" },
    "debug": true
  }'
```

#### Performance Issues

**Issue**: Validation is taking too long for complex schemas.

**Solution**:
1. Enable schema caching
2. Optimize complex custom validators
3. Use batch validation for multiple items
4. Consider schema simplification if possible

```bash
# Check validation performance statistics
curl -X GET http://localhost:8080/metrics/validation
```

#### Compatibility Check Failures

**Issue**: Schema evolution fails compatibility check.

**Solution**:
1. Review compatibility errors returned by the API
2. Make sure changes follow compatibility rules:
   - For BACKWARD compatibility: don't add required fields, don't narrow field constraints
   - For FORWARD compatibility: don't remove fields, don't broaden constraints
   - For FULL compatibility: follow both BACKWARD and FORWARD rules

#### Authentication and Authorization Issues

**Issue**: API calls return unauthorized errors.

**Solution**:
1. Check that you're providing valid credentials
2. Verify the authentication token hasn't expired
3. Ensure your account has proper permissions for the operation

```bash
# Test authentication
curl -X GET http://localhost:8080/v1/auth/test \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Debugging Tools

The Validation Service provides several debugging endpoints:

#### Schema Analysis

```bash
curl -X POST http://localhost:8080/v1/debug/schema-analysis \
  -H "Content-Type: application/json" \
  -d '{
    "schemaId": "user-profile",
    "version": "1.0"
  }'
```

#### Validation Tracing

Enable detailed validation tracing:

```bash
curl -X POST http://localhost:8080/v1/validate \
  -H "Content-Type: application/json" \
  -H "X-Debug-Mode: trace" \
  -d '{
    "schemaId": "user-profile",
    "version": "1.0",
    "data": { ... }
  }'
```

#### Response with Trace Information

```json
{
  "valid": false,
  "schemaId": "user-profile",
  "version": "1.0",
  "errors": [ ... ],
  "trace": {
    "validationSteps": [
      {
        "path": "$",
        "schemaPath": "#",
        "valid": false,
        "timeMs": 0.85,
        "children": [
          {
            "path": "$.id",
            "schemaPath": "#/properties/id",
            "valid": true,
            "timeMs": 0.12
          },
          {
            "path": "$.email",
            "schemaPath": "#/properties/email",
            "valid": false,
            "timeMs": 0.32,
            "error": "String does not match format: email"
          },
          // ...more steps
        ]
      }
    ],
    "totalTimeMs": 1.42,
    "schemaLoadTimeMs": 0.23,
    "validationTimeMs": 1.19,
    "memoryUsed": "24.5KB"
  }
}
```

## Related Documentation

- [Basic Examples](./basic_example.md) - Basic validation scenarios
- [API Documentation](../interfaces/api.md) - Complete API reference
- [Schema Registry](../implementation/schema_registry.md) - Schema management details
- [Custom Validator Registry](../implementation/custom_validator_registry.md) - Custom validator details
- [Performance Tuning](../operations/performance.md) - Performance optimization guidelines


