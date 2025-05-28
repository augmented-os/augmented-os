# Integration Definitions

## Overview

Integration definitions specify the capabilities and requirements of external service connections (like Xero, Gmail, Slack). They:

* Define available methods that tasks can use
* Specify authentication mechanisms
* Outline configuration requirements
* Provide the foundation for creating integration instances

## Key Concepts

* **Integration Definition** - A specification of an external service integration
* **Methods** - Functions that the integration provides to interact with the external service
* **Authentication Types** - How the integration authenticates (OAuth2, API key, etc.)
* **Configuration Schema** - Required configuration for the integration
* **Versioning** - Each integration definition has a semantic version

## Integration Definition Structure

```json
{
  "integrationId": "string",        // Unique identifier (e.g., "xero")
  "name": "string",                 // Human-readable name
  "description": "string",          // Detailed description
  "version": "string",              // Semantic version of this integration
  "type": "integration | ai | documents | database",  // Integration type
  "methods": [                      // Available methods this integration provides
    {
      "id": "string",              // Method identifier (e.g., "create_invoice")
      "name": "string",            // Human-readable name
      "description": "string",     // What this method does
      "inputSchema": {             // JSON Schema for method inputs
        "type": "object",
        "properties": { }
      },
      "outputSchema": {            // JSON Schema for method outputs
        "type": "object",
        "properties": { }
      }
    }
  ],
  "configSchema": {                 // Configuration required for this integration
    "type": "object",
    "properties": {
      // Configuration fields needed (e.g., API endpoints, options)
    }
  },
  "authType": "oauth2 | apikey | custom",  // Authentication method used
  "oauth2Config": {                // If authType is oauth2
    "authorizationUrl": "string",
    "tokenUrl": "string",
    "scopes": ["string"],
    "additionalParameters": { }
  },
  "aiConfig": {                    // If type is "ai"
    "provider": "string",          // AI provider (e.g., "openai", "anthropic", "google")
    "availableModels": [           // List of available models for this provider
      {
        "id": "string",           // Model identifier (e.g., "gpt-4", "claude-3")
        "name": "string",         // Human-readable name
        "description": "string",  // Model description
        "capabilities": [         // List of model capabilities
          "string"               // e.g., "text", "vision", "audio", "embedding"
        ],
        "contextWindow": number,  // Maximum context window size
        "inputFormats": [        // Supported input formats
          "string"              // e.g., "text", "image/png", "audio/mp3"
        ],
        "outputFormats": [       // Supported output formats
          "string"              // e.g., "text", "json", "image/png"
        ],
        "maxTokens": number,     // Maximum output tokens
        "costPerToken": {        // Cost information
          "input": number,      // Cost per input token
          "output": number      // Cost per output token
        }
      }
    ],
    "defaultModel": "string"      // Default model ID to use
  }
}
```

## Methods

Methods define the specific actions an integration can perform with the external service:

* Each method has a unique ID within the integration
* Input and output schemas define the expected parameters and return values
* Methods are strongly typed using JSON Schema
* Input validation occurs before method execution
* Output validation ensures proper response format

Example method configuration:

```json
{
  "methods": [
    {
      "id": "create_invoice",
      "name": "Create Invoice",
      "description": "Creates a new invoice in Xero",
      "inputSchema": {
        "type": "object",
        "properties": {
          "contact_id": {
            "type": "string",
            "description": "Xero contact ID"
          },
          "line_items": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "description": { "type": "string" },
                "quantity": { "type": "number" },
                "unit_amount": { "type": "number" }
              }
            }
          }
        },
        "required": ["contact_id", "line_items"]
      },
      "outputSchema": {
        "type": "object",
        "properties": {
          "invoice_id": { "type": "string" },
          "invoice_number": { "type": "string" },
          "status": { "type": "string" }
        }
      }
    }
  ]
}
```

## Authentication

Integration definitions support multiple authentication methods:


1. **OAuth2:**
   * Full OAuth2 flow with authorization and token URLs
   * Configurable scopes
   * Support for additional parameters
   * Refresh token management
2. **API Key:**
   * Simple key-based authentication
   * Support for header or query parameter placement
   * Key naming configuration
3. **Custom:**
   * Flexible authentication for non-standard methods
   * Custom parameter structure
   * Support for complex auth schemes

Example OAuth2 configuration:

```json
{
  "authType": "oauth2",
  "oauth2Config": {
    "authorizationUrl": "https://login.xero.com/identity/connect/authorize",
    "tokenUrl": "https://identity.xero.com/connect/token",
    "scopes": ["accounting.transactions", "accounting.contacts"],
    "additionalParameters": {
      "grant_type": "authorization_code"
    }
  }
}
```

## Configuration Schema

Each integration definition specifies the configuration required for instances:

* Configuration is validated against the schema
* Supports complex nested structures
* Can include default values
* Includes descriptions for UI rendering

```json
{
  "configSchema": {
    "type": "object",
    "properties": {
      "tenant_id": {
        "type": "string",
        "description": "Xero tenant/organization ID"
      },
      "invoice_prefix": {
        "type": "string",
        "description": "Optional prefix for invoice numbers",
        "default": "INV-"
      }
    },
    "required": ["tenant_id"]
  }
}
```

## Example Integration Definition

```json
{
  "integrationId": "xero",
  "name": "Xero Accounting",
  "description": "Integration with Xero accounting software",
  "version": "1.0.0",
  "methods": [
    {
      "id": "create_invoice",
      "name": "Create Invoice",
      "description": "Creates a new invoice in Xero",
      "inputSchema": {
        "type": "object",
        "properties": {
          "contact_id": {
            "type": "string",
            "description": "Xero contact ID"
          },
          "line_items": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "description": { "type": "string" },
                "quantity": { "type": "number" },
                "unit_amount": { "type": "number" }
              }
            }
          }
        },
        "required": ["contact_id", "line_items"]
      },
      "outputSchema": {
        "type": "object",
        "properties": {
          "invoice_id": { "type": "string" },
          "invoice_number": { "type": "string" },
          "status": { "type": "string" }
        }
      }
    }
  ],
  "configSchema": {
    "type": "object",
    "properties": {
      "tenant_id": {
        "type": "string",
        "description": "Xero tenant/organization ID"
      }
    }
  },
  "authType": "oauth2",
  "oauth2Config": {
    "authorizationUrl": "https://login.xero.com/identity/connect/authorize",
    "tokenUrl": "https://identity.xero.com/connect/token",
    "scopes": ["accounting.transactions", "accounting.contacts"]
  }
}
```

## Database Schema

**Table: integration_definitions**

| Field | Type | Description |
|----|----|----|
| id | UUID | Primary key |
| integration_id | VARCHAR(255) | Unique identifier (e.g., "xero") |
| name | VARCHAR(255) | Human-readable name |
| description | TEXT | Detailed description |
| version | VARCHAR(50) | Semantic version of this integration |
| type | VARCHAR(255) | Integration type: "integration", "ai", "documents", or "database" |
| methods | JSONB | Available methods this integration provides |
| config_schema | JSONB | Configuration schema for this integration |
| auth_type | auth_method_enum | Authentication method ENUM ('oauth2', 'apikey', 'custom') |
| oauth2_config | JSONB | OAuth2 configuration if applicable |
| ai_config | JSONB | AI configuration if type is 'ai' |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

**Indexes:**

* `integration_definitions_integration_id_idx` UNIQUE on `integration_id` (for lookups)
* `integration_definitions_type_idx` on `type` (for filtering by integration type)

**JSON Schema (methods field):**

```json
{
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "id": { "type": "string" },
      "name": { "type": "string" },
      "description": { "type": "string" },
      "inputSchema": { "type": "object" },
      "outputSchema": { "type": "object" }
    },
    "required": ["id", "name", "inputSchema", "outputSchema"]
  }
}
```

**JSON Schema (ai_config field):**

```json
{
  "type": "object",
  "properties": {
    "provider": { 
      "type": "string",
      "description": "AI provider identifier"
    },
    "availableModels": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": { "type": "string" },
          "name": { "type": "string" },
          "description": { "type": "string" },
          "capabilities": {
            "type": "array",
            "items": { "type": "string" }
          },
          "contextWindow": { "type": "integer" },
          "inputFormats": {
            "type": "array",
            "items": { "type": "string" }
          },
          "outputFormats": {
            "type": "array",
            "items": { "type": "string" }
          },
          "maxTokens": { "type": "integer" },
          "costPerToken": {
            "type": "object",
            "properties": {
              "input": { "type": "number" },
              "output": { "type": "number" }
            }
          }
        },
        "required": ["id", "name", "capabilities"]
      }
    },
    "defaultModel": { "type": "string" }
  },
  "required": ["provider", "availableModels", "defaultModel"]
}
```

## Performance Considerations

For integration definitions, consider these performance optimizations:

* Store frequently used integration definitions in an in-memory cache
* Optimize method lookup performance during task execution
* Validate integration definitions at load time, not runtime
* Consider bulk loading of definitions for system initialization

## Related Documentation

* [Integration Instances](./integration_instances.md) - Documentation for integration instances
* [Task Definitions](./task_definitions.md) - Task definitions that use integrations
* [Workflow Definitions](../../workflow_orchestrator_service/schemas/workflow_definitions.md) - Workflow definitions that incorporate tasks using integrations
* [Database Architecture](../database_architecture.md) - Overall database architecture

## AI Integration Type

AI integrations have special considerations:

* **Provider-Specific Configuration**: Each AI provider may have unique requirements and capabilities
* **Model Selection**: Tasks can specify which model to use from the available models
* **Cost Management**: AI operations often have usage-based pricing that needs to be tracked
* **Input/Output Formats**: Different models support different types of inputs and outputs
* **Context Management**: Models have varying context window sizes and token limits

### Example AI Integration Definition

```json
{
  "integrationId": "anthropic",
  "name": "Anthropic Claude",
  "description": "Integration with Anthropic's Claude AI models",
  "version": "1.0.0",
  "type": "ai",
  "methods": [
    {
      "id": "complete",
      "name": "Text Completion",
      "description": "Generate text completion based on input prompt",
      "inputSchema": {
        "type": "object",
        "properties": {
          "prompt": {
            "type": "string",
            "description": "Input prompt for the model"
          },
          "modelId": {
            "type": "string",
            "description": "Optional model ID to use. Falls back to default if not specified."
          },
          "maxTokens": {
            "type": "integer",
            "description": "Maximum number of tokens to generate",
            "default": 1000
          },
          "temperature": {
            "type": "number",
            "description": "Sampling temperature",
            "minimum": 0,
            "maximum": 1,
            "default": 0.7
          }
        },
        "required": ["prompt"]
      },
      "outputSchema": {
        "type": "object",
        "properties": {
          "completion": {
            "type": "string",
            "description": "Generated text completion"
          },
          "usage": {
            "type": "object",
            "properties": {
              "promptTokens": {
                "type": "integer",
                "description": "Number of tokens in the prompt"
              },
              "completionTokens": {
                "type": "integer",
                "description": "Number of tokens in the completion"
              },
              "totalTokens": {
                "type": "integer",
                "description": "Total tokens used"
              },
              "cost": {
                "type": "number",
                "description": "Total cost of the operation"
              }
            }
          }
        }
      }
    },
    {
      "id": "generate_image",
      "name": "Image Generation",
      "description": "Generate image based on text prompt",
      "inputSchema": {
        "type": "object",
        "properties": {
          "prompt": {
            "type": "string",
            "description": "Text prompt describing the desired image"
          },
          "modelId": {
            "type": "string",
            "description": "Optional model ID to use. Must support image generation capability."
          },
          "width": {
            "type": "integer",
            "description": "Width of the generated image in pixels",
            "default": 1024
          },
          "height": {
            "type": "integer",
            "description": "Height of the generated image in pixels",
            "default": 1024
          },
          "quality": {
            "type": "string",
            "enum": ["standard", "hd"],
            "default": "standard",
            "description": "Quality of the generated image"
          }
        },
        "required": ["prompt"]
      },
      "outputSchema": {
        "type": "object",
        "properties": {
          "image": {
            "type": "string",
            "format": "uri",
            "description": "URL to the generated image"
          },
          "usage": {
            "type": "object",
            "properties": {
              "cost": {
                "type": "number",
                "description": "Cost of this image generation"
              }
            }
          }
        }
      }
    }
  ],
  "configSchema": {
    "type": "object",
    "properties": {
      "defaultTemperature": {
        "type": "number",
        "description": "Default sampling temperature",
        "default": 0.7
      },
      "defaultMaxTokens": {
        "type": "integer",
        "description": "Default maximum tokens",
        "default": 1000
      }
    }
  },
  "authType": "apikey",
  "aiConfig": {
    "provider": "anthropic",
    "availableModels": [
      {
        "id": "claude-3-opus",
        "name": "Claude 3 Opus",
        "description": "Most capable Claude model for complex tasks",
        "capabilities": ["text", "vision"],
        "contextWindow": 200000,
        "inputFormats": ["text", "image/png", "image/jpeg"],
        "outputFormats": ["text", "json"],
        "maxTokens": 4096,
        "costPerToken": {
          "input": 0.000015,
          "output": 0.000075
        }
      },
      {
        "id": "claude-3-sonnet",
        "name": "Claude 3 Sonnet",
        "description": "Balanced model for most tasks",
        "capabilities": ["text", "vision"],
        "contextWindow": 200000,
        "inputFormats": ["text", "image/png", "image/jpeg"],
        "outputFormats": ["text", "json"],
        "maxTokens": 4096,
        "costPerToken": {
          "input": 0.000003,
          "output": 0.000015
        }
      },
      {
        "id": "dall-e-3",
        "name": "DALL-E 3",
        "description": "Image generation model",
        "capabilities": ["image_generation"],
        "inputFormats": ["text"],
        "outputFormats": ["image/png", "image/jpeg"],
        "costPerImage": {
          "standard": 0.040,
          "hd": 0.080
        }
      }
    ],
    "defaultModel": "claude-3-sonnet"
  }
}
```


