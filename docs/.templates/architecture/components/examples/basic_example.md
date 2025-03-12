# Basic [Component Name] Example

This document provides a simple example of how to use the [Component Name] Service for common use cases.

## [Primary Use Case] Example

The following example illustrates a basic [primary use case] that:

<!-- List the key steps in this example -->
1. [Step 1]
2. [Step 2]
3. [Step 3]

### [Resource] Definition

```json
{
  "id": "[resource-id]",
  "name": "[Resource Name]",
  "description": "[Resource description]",
  "version": "1.0.0",
  "properties": {
    "[property1]": "[value1]",
    "[property2]": "[value2]",
    "[property3]": {
      "[nested1]": "[nestedValue1]",
      "[nested2]": "[nestedValue2]"
    }
  }
}
```

### API Request

```bash
curl -X POST https://api.example.com/[component]/[resource] \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [your-token]" \
  -d '{
    "name": "[Resource Name]",
    "description": "[Resource description]",
    "properties": {
      "[property1]": "[value1]",
      "[property2]": "[value2]",
      "[property3]": {
        "[nested1]": "[nestedValue1]",
        "[nested2]": "[nestedValue2]"
      }
    }
  }'
```

### Response

```json
{
  "id": "[generated-resource-id]",
  "name": "[Resource Name]",
  "description": "[Resource description]",
  "status": "CREATED",
  "createdAt": "2023-09-01T10:15:00Z"
}
```

## [Related Use Case] Example

The following example shows how to [perform a related operation]:

### [Operation] Request

```bash
curl -X PUT https://api.example.com/[component]/[resource]/[resource-id]/[operation] \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [your-token]" \
  -d '{
    "[parameter1]": "[value1]",
    "[parameter2]": "[value2]"
  }'
```

### Response

```json
{
  "id": "[resource-id]",
  "status": "UPDATED",
  "updatedAt": "2023-09-01T10:30:00Z",
  "result": {
    "[resultField1]": "[resultValue1]",
    "[resultField2]": "[resultValue2]"
  }
}
```

## Code Examples

### JavaScript/TypeScript Example

```typescript
import { [ComponentClient] } from '@example/[component-sdk]';

async function createAndProcess[Resource]() {
  // Initialize the client
  const client = new [ComponentClient]({
    apiKey: 'your-api-key',
    baseUrl: 'https://api.example.com/[component]'
  });

  // Create a new [resource]
  const [resource] = await client.create[Resource]({
    name: '[Resource Name]',
    description: '[Resource description]',
    properties: {
      [property1]: '[value1]',
      [property2]: '[value2]',
      [property3]: {
        [nested1]: '[nestedValue1]',
        [nested2]: '[nestedValue2]'
      }
    }
  });

  console.log(`Created [resource] with ID: ${[resource].id}`);

  // Perform an operation on the [resource]
  const result = await client.[operation]([resource].id, {
    [parameter1]: '[value1]',
    [parameter2]: '[value2]'
  });

  console.log('Operation result:', result);
}

createAndProcess[Resource]().catch(console.error);
```

### Python Example

```python
from [component_sdk] import [ComponentClient]

# Initialize the client
client = [ComponentClient](
    api_key="your-api-key",
    base_url="https://api.example.com/[component]"
)

# Create a new [resource]
[resource] = client.create_[resource](
    name="[Resource Name]",
    description="[Resource description]",
    properties={
        "[property1]": "[value1]",
        "[property2]": "[value2]",
        "[property3]": {
            "[nested1]": "[nestedValue1]",
            "[nested2]": "[nestedValue2]"
        }
    }
)

print(f"Created [resource] with ID: {[resource]['id']}")

# Perform an operation on the [resource]
result = client.[operation]([resource]["id"], {
    "[parameter1]": "[value1]",
    "[parameter2]": "[value2]"
})

print("Operation result:", result)
```

## Common Errors and Troubleshooting

| Error Code | Description | Solution |
|------------|-------------|----------|
| `[ERROR_CODE_1]` | [Description of error 1] | [How to resolve error 1] |
| `[ERROR_CODE_2]` | [Description of error 2] | [How to resolve error 2] |
| `[ERROR_CODE_3]` | [Description of error 3] | [How to resolve error 3] |

## Next Steps

Once you've mastered these basic examples, you can:

1. Explore [advanced examples](./advanced_example.md) for more complex scenarios
2. Review the [API Reference](../interfaces/api.md) for all available operations
3. Learn about [implementation details](../implementation/module1.md) if you need to customize behavior

## Related Documentation

* [Overview](../overview.md)
* [API Reference](../interfaces/api.md)
* [Advanced Examples](./advanced_example.md) 