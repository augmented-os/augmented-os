# Basic Integration Service Example

This document provides a simple example of how to use the Integration Service for common use cases.

## Creating and Using an Integration

The following example illustrates a basic integration workflow that:

1. Creates an integration definition
2. Creates an integration instance
3. Executes an integration method

### Integration Definition

```json
{
  "name": "Simple REST API Integration",
  "description": "Integration with a simple REST API service",
  "version": "1.0.0",
  "type": "http",
  "authType": "api_key",
  "methods": [
    {
      "name": "getUsers",
      "description": "Retrieve a list of users",
      "paramSchema": {
        "type": "object",
        "properties": {
          "page": {
            "type": "integer",
            "description": "Page number for pagination",
            "default": 1
          },
          "limit": {
            "type": "integer",
            "description": "Number of items per page",
            "default": 10
          }
        }
      },
      "resultSchema": {
        "type": "object",
        "properties": {
          "users": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "id": { "type": "string" },
                "name": { "type": "string" },
                "email": { "type": "string" }
              }
            }
          },
          "pagination": {
            "type": "object",
            "properties": {
              "total": { "type": "integer" },
              "pages": { "type": "integer" },
              "page": { "type": "integer" },
              "limit": { "type": "integer" }
            }
          }
        }
      }
    }
  ],
  "configSchema": {
    "type": "object",
    "required": ["baseUrl", "apiKey"],
    "properties": {
      "baseUrl": {
        "type": "string",
        "description": "Base URL for the API"
      },
      "apiKey": {
        "type": "string",
        "description": "API key for authentication"
      }
    }
  }
}
```

### Creating an Integration Definition

```bash
curl -X POST https://api.example.com/api/v1/integration-definitions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token" \
  -d '{
    "name": "Simple REST API Integration",
    "description": "Integration with a simple REST API service",
    "version": "1.0.0",
    "type": "http",
    "authType": "api_key",
    "methods": [
      {
        "name": "getUsers",
        "description": "Retrieve a list of users",
        "paramSchema": {
          "type": "object",
          "properties": {
            "page": {
              "type": "integer",
              "description": "Page number for pagination",
              "default": 1
            },
            "limit": {
              "type": "integer",
              "description": "Number of items per page",
              "default": 10
            }
          }
        },
        "resultSchema": {
          "type": "object",
          "properties": {
            "users": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "id": { "type": "string" },
                  "name": { "type": "string" },
                  "email": { "type": "string" }
                }
              }
            },
            "pagination": {
              "type": "object",
              "properties": {
                "total": { "type": "integer" },
                "pages": { "type": "integer" },
                "page": { "type": "integer" },
                "limit": { "type": "integer" }
              }
            }
          }
        }
      }
    ],
    "configSchema": {
      "type": "object",
      "required": ["baseUrl", "apiKey"],
      "properties": {
        "baseUrl": {
          "type": "string",
          "description": "Base URL for the API"
        },
        "apiKey": {
          "type": "string",
          "description": "API key for authentication"
        }
      }
    }
  }'
```

### Response

```json
{
  "id": "int_def_123456",
  "name": "Simple REST API Integration",
  "description": "Integration with a simple REST API service",
  "version": "1.0.0",
  "type": "http",
  "authType": "api_key",
  "status": "PUBLISHED",
  "createdAt": "2023-09-01T10:15:00Z"
}
```

## Creating an Integration Instance

Once you have an integration definition, you can create an instance with specific configuration:

### API Request

```bash
curl -X POST https://api.example.com/api/v1/integration-instances \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token" \
  -d '{
    "integrationDefinitionId": "int_def_123456",
    "name": "User API Integration",
    "config": {
      "baseUrl": "https://api.users.example.com",
      "apiKey": "sk_test_abcdefghijklmnopqrstuvwxyz"
    }
  }'
```

### Response

```json
{
  "id": "int_inst_789012",
  "integrationDefinitionId": "int_def_123456",
  "name": "User API Integration",
  "status": "CONNECTED",
  "createdAt": "2023-09-01T10:30:00Z"
}
```

## Executing an Integration Method

Now you can execute methods on the integration instance:

### API Request

```bash
curl -X POST https://api.example.com/api/v1/integration-instances/int_inst_789012/methods/getUsers/execute \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token" \
  -d '{
    "parameters": {
      "page": 1,
      "limit": 5
    }
  }'
```

### Response

```json
{
  "status": "SUCCESS",
  "data": {
    "users": [
      {
        "id": "user_001",
        "name": "John Doe",
        "email": "john.doe@example.com"
      },
      {
        "id": "user_002",
        "name": "Jane Smith",
        "email": "jane.smith@example.com"
      },
      {
        "id": "user_003",
        "name": "Bob Johnson",
        "email": "bob.johnson@example.com"
      }
    ],
    "pagination": {
      "total": 42,
      "pages": 9,
      "page": 1,
      "limit": 5
    }
  }
}
```

## Code Examples

### JavaScript/TypeScript Example

```typescript
import { IntegrationServiceClient } from '@example/integration-service-sdk';

async function createAndUseIntegration() {
  // Initialize the client
  const client = new IntegrationServiceClient({
    apiKey: 'your-api-key',
    baseUrl: 'https://api.example.com/api/v1'
  });

  // Create a new integration definition
  const definition = await client.createIntegrationDefinition({
    name: 'Simple REST API Integration',
    description: 'Integration with a simple REST API service',
    version: '1.0.0',
    type: 'http',
    authType: 'api_key',
    methods: [
      {
        name: 'getUsers',
        description: 'Retrieve a list of users',
        paramSchema: {
          type: 'object',
          properties: {
            page: {
              type: 'integer',
              description: 'Page number for pagination',
              default: 1
            },
            limit: {
              type: 'integer',
              description: 'Number of items per page',
              default: 10
            }
          }
        },
        resultSchema: {
          type: 'object',
          properties: {
            users: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                  email: { type: 'string' }
                }
              }
            }
          }
        }
      }
    ],
    configSchema: {
      type: 'object',
      required: ['baseUrl', 'apiKey'],
      properties: {
        baseUrl: {
          type: 'string',
          description: 'Base URL for the API'
        },
        apiKey: {
          type: 'string',
          description: 'API key for authentication'
        }
      }
    }
  });

  console.log(`Created integration definition with ID: ${definition.id}`);

  // Create an integration instance
  const instance = await client.createIntegrationInstance({
    integrationDefinitionId: definition.id,
    name: 'User API Integration',
    config: {
      baseUrl: 'https://api.users.example.com',
      apiKey: 'sk_test_abcdefghijklmnopqrstuvwxyz'
    }
  });

  console.log(`Created integration instance with ID: ${instance.id}`);

  // Execute a method on the integration instance
  const result = await client.executeIntegrationMethod(
    instance.id,
    'getUsers',
    {
      parameters: {
        page: 1,
        limit: 5
      }
    }
  );

  console.log('Method execution result:', result.data);
}

createAndUseIntegration().catch(console.error);
```

### Python Example

```python
from integration_service_sdk import IntegrationServiceClient

# Initialize the client
client = IntegrationServiceClient(
    api_key="your-api-key",
    base_url="https://api.example.com/api/v1"
)

# Create a new integration definition
definition = client.create_integration_definition(
    name="Simple REST API Integration",
    description="Integration with a simple REST API service",
    version="1.0.0",
    type="http",
    auth_type="api_key",
    methods=[
        {
            "name": "getUsers",
            "description": "Retrieve a list of users",
            "param_schema": {
                "type": "object",
                "properties": {
                    "page": {
                        "type": "integer",
                        "description": "Page number for pagination",
                        "default": 1
                    },
                    "limit": {
                        "type": "integer",
                        "description": "Number of items per page",
                        "default": 10
                    }
                }
            },
            "result_schema": {
                "type": "object",
                "properties": {
                    "users": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "id": {"type": "string"},
                                "name": {"type": "string"},
                                "email": {"type": "string"}
                            }
                        }
                    }
                }
            }
        }
    ],
    config_schema={
        "type": "object",
        "required": ["baseUrl", "apiKey"],
        "properties": {
            "baseUrl": {
                "type": "string",
                "description": "Base URL for the API"
            },
            "apiKey": {
                "type": "string",
                "description": "API key for authentication"
            }
        }
    }
)

print(f"Created integration definition with ID: {definition['id']}")

# Create an integration instance
instance = client.create_integration_instance(
    integration_definition_id=definition["id"],
    name="User API Integration",
    config={
        "baseUrl": "https://api.users.example.com",
        "apiKey": "sk_test_abcdefghijklmnopqrstuvwxyz"
    }
)

print(f"Created integration instance with ID: {instance['id']}")

# Execute a method on the integration instance
result = client.execute_integration_method(
    instance_id=instance["id"],
    method_name="getUsers",
    parameters={
        "page": 1,
        "limit": 5
    }
)

print("Method execution result:", result["data"])
```

## Common Errors and Troubleshooting

| Error Code | Description | Solution |
|------------|-------------|----------|
| `VALIDATION_ERROR` | Request payload doesn't match the required schema | Check your request against the schema definition |
| `INTEGRATION_NOT_FOUND` | Integration definition or instance not found | Verify the ID is correct and the resource exists |
| `METHOD_NOT_FOUND` | The requested method doesn't exist | Check the method name and ensure it's defined in the integration |
| `AUTHENTICATION_ERROR` | Authentication with external system failed | Verify the credentials in the integration configuration |
| `RATE_LIMIT_EXCEEDED` | External system rate limit exceeded | Implement backoff strategy or reduce request frequency |
| `TIMEOUT_ERROR` | Request to external system timed out | Check external system status or increase timeout setting |

## Next Steps

Once you've mastered these basic examples, you can:

1. Explore [advanced examples](./advanced_example.md) for more complex scenarios like OAuth authentication
2. Review the [API Reference](../interfaces/api.md) for all available operations
3. Learn about [Method Executor](../implementation/method_executor.md) if you need to customize execution behavior

## Related Documentation

* [Overview](../overview.md)
* [API Reference](../interfaces/api.md)
* [Advanced Examples](./advanced_example.md)
* [Data Transformer](../implementation/data_transformer.md) 