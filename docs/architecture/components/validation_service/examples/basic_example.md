# Validation Service Basic Examples

This document provides basic examples of using the Validation Service for common validation scenarios.

## Schema Registration

Before validating data, you need to register a schema. Here's how to register a simple JSON Schema:

### Register a JSON Schema

```bash
curl -X POST http://localhost:8080/v1/schemas \
  -H "Content-Type: application/json" \
  -d '{
    "schemaId": "user-profile",
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
          "minLength": 1,
          "maxLength": 100
        },
        "email": {
          "type": "string",
          "format": "email"
        },
        "age": {
          "type": "integer",
          "minimum": 18,
          "maximum": 120
        },
        "address": {
          "type": "object",
          "properties": {
            "street": { "type": "string" },
            "city": { "type": "string" },
            "zipCode": { "type": "string" }
          }
        },
        "tags": {
          "type": "array",
          "items": { "type": "string" }
        }
      }
    }
  }'
```

### Response

```json
{
  "status": "success",
  "message": "Schema registered successfully",
  "data": {
    "schemaId": "user-profile",
    "version": "1.0",
    "schemaType": "json",
    "createdAt": "2023-06-15T10:30:45Z"
  }
}
```

## Basic Validation

Once you have registered a schema, you can validate data against it.

### Validate Valid Data

```bash
curl -X POST http://localhost:8080/v1/validate \
  -H "Content-Type: application/json" \
  -d '{
    "schemaId": "user-profile",
    "version": "1.0",
    "data": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "age": 30,
      "address": {
        "street": "123 Main St",
        "city": "Anytown",
        "zipCode": "12345"
      },
      "tags": ["customer", "premium"]
    }
  }'
```

### Response for Valid Data

```json
{
  "valid": true,
  "schemaId": "user-profile",
  "version": "1.0",
  "errors": []
}
```

### Validate Invalid Data

```bash
curl -X POST http://localhost:8080/v1/validate \
  -H "Content-Type: application/json" \
  -d '{
    "schemaId": "user-profile",
    "version": "1.0",
    "data": {
      "id": "not-a-uuid",
      "name": "",
      "email": "not-an-email",
      "age": 15,
      "tags": "not-an-array"
    }
  }'
```

### Response for Invalid Data

```json
{
  "valid": false,
  "schemaId": "user-profile",
  "version": "1.0",
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
    },
    {
      "path": "$.age",
      "message": "Value is less than minimum value of 18",
      "errorCode": "minimum"
    },
    {
      "path": "$.tags",
      "message": "Expected type array but found type string",
      "errorCode": "type"
    }
  ]
}
```

## Schema Retrieval

You can retrieve registered schemas for reference.

### Get Schema by ID and Version

```bash
curl -X GET http://localhost:8080/v1/schemas/user-profile/versions/1.0
```

### Response

```json
{
  "schemaId": "user-profile",
  "schemaType": "json",
  "version": "1.0",
  "createdAt": "2023-06-15T10:30:45Z",
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
        "minLength": 1,
        "maxLength": 100
      },
      "email": {
        "type": "string",
        "format": "email"
      },
      "age": {
        "type": "integer",
        "minimum": 18,
        "maximum": 120
      },
      "address": {
        "type": "object",
        "properties": {
          "street": { "type": "string" },
          "city": { "type": "string" },
          "zipCode": { "type": "string" }
        }
      },
      "tags": {
        "type": "array",
        "items": { "type": "string" }
      }
    }
  }
}
```

### List All Schemas

```bash
curl -X GET http://localhost:8080/v1/schemas
```

### Response

```json
{
  "schemas": [
    {
      "schemaId": "user-profile",
      "schemaType": "json",
      "versions": ["1.0"],
      "latestVersion": "1.0",
      "createdAt": "2023-06-15T10:30:45Z",
      "updatedAt": "2023-06-15T10:30:45Z"
    },
    {
      "schemaId": "product",
      "schemaType": "json",
      "versions": ["1.0", "1.1"],
      "latestVersion": "1.1",
      "createdAt": "2023-06-14T09:15:30Z",
      "updatedAt": "2023-06-15T11:45:22Z"
    }
  ]
}
```

## Using the Validation Service in Code

### Java Client Example

```java
import com.example.validation.client.ValidationServiceClient;
import com.example.validation.client.model.ValidationRequest;
import com.example.validation.client.model.ValidationResponse;

public class ValidationExample {
    public static void main(String[] args) {
        // Create a client
        ValidationServiceClient client = new ValidationServiceClient("http://localhost:8080");
        
        // Prepare data to validate
        Map<String, Object> userData = new HashMap<>();
        userData.put("id", "123e4567-e89b-12d3-a456-426614174000");
        userData.put("name", "John Doe");
        userData.put("email", "john.doe@example.com");
        userData.put("age", 30);
        
        // Create validation request
        ValidationRequest request = new ValidationRequest();
        request.setSchemaId("user-profile");
        request.setVersion("1.0");
        request.setData(userData);
        
        // Validate data
        ValidationResponse response = client.validate(request);
        
        // Check validation result
        if (response.isValid()) {
            System.out.println("Data is valid!");
        } else {
            System.out.println("Data is invalid. Errors:");
            response.getErrors().forEach(error -> 
                System.out.println(error.getPath() + ": " + error.getMessage())
            );
        }
    }
}
```

### Python Client Example

```python
import requests
import json

def validate_data(schema_id, version, data):
    url = "http://localhost:8080/v1/validate"
    
    payload = {
        "schemaId": schema_id,
        "version": version,
        "data": data
    }
    
    headers = {
        "Content-Type": "application/json"
    }
    
    response = requests.post(url, headers=headers, data=json.dumps(payload))
    return response.json()

# Example usage
user_data = {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "age": 30
}

result = validate_data("user-profile", "1.0", user_data)

if result["valid"]:
    print("Data is valid!")
else:
    print("Data is invalid. Errors:")
    for error in result["errors"]:
        print(f"{error['path']}: {error['message']}")
```

### JavaScript Client Example

```javascript
async function validateData(schemaId, version, data) {
  const response = await fetch('http://localhost:8080/v1/validate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      schemaId,
      version,
      data
    })
  });
  
  return response.json();
}

// Example usage
const userData = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  name: 'John Doe',
  email: 'john.doe@example.com',
  age: 30
};

validateData('user-profile', '1.0', userData)
  .then(result => {
    if (result.valid) {
      console.log('Data is valid!');
    } else {
      console.log('Data is invalid. Errors:');
      result.errors.forEach(error => {
        console.log(`${error.path}: ${error.message}`);
      });
    }
  })
  .catch(error => {
    console.error('Validation request failed:', error);
  });
```

## Common Validation Patterns

### Required Fields Validation

```json
{
  "type": "object",
  "required": ["id", "name", "email"],
  "properties": {
    "id": { "type": "string" },
    "name": { "type": "string" },
    "email": { "type": "string" }
  }
}
```

### String Format Validation

```json
{
  "type": "object",
  "properties": {
    "email": { "type": "string", "format": "email" },
    "website": { "type": "string", "format": "uri" },
    "uuid": { "type": "string", "format": "uuid" },
    "date": { "type": "string", "format": "date" },
    "time": { "type": "string", "format": "time" },
    "datetime": { "type": "string", "format": "date-time" },
    "ipv4": { "type": "string", "format": "ipv4" },
    "ipv6": { "type": "string", "format": "ipv6" }
  }
}
```

### Numeric Range Validation

```json
{
  "type": "object",
  "properties": {
    "age": { 
      "type": "integer", 
      "minimum": 18, 
      "maximum": 120 
    },
    "score": { 
      "type": "number", 
      "minimum": 0, 
      "maximum": 100,
      "exclusiveMaximum": true 
    },
    "quantity": { 
      "type": "integer", 
      "minimum": 1, 
      "multipleOf": 5 
    }
  }
}
```

### Array Validation

```json
{
  "type": "object",
  "properties": {
    "tags": {
      "type": "array",
      "items": { "type": "string" },
      "minItems": 1,
      "maxItems": 10,
      "uniqueItems": true
    },
    "scores": {
      "type": "array",
      "items": { 
        "type": "number",
        "minimum": 0,
        "maximum": 100
      }
    }
  }
}
```

### Conditional Validation

```json
{
  "type": "object",
  "properties": {
    "type": { "type": "string", "enum": ["personal", "business"] },
    "companyName": { "type": "string" },
    "taxId": { "type": "string" }
  },
  "allOf": [
    {
      "if": {
        "properties": { "type": { "const": "business" } }
      },
      "then": {
        "required": ["companyName", "taxId"]
      }
    }
  ]
}
```

## Related Documentation

* [Advanced Examples](./advanced_example.md) - More complex validation scenarios
* [API Documentation](../interfaces/api.md) - Complete API reference
* [Schema Registry](../implementation/schema_registry.md) - Schema management details


