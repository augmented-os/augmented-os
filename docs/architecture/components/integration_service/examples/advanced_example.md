# Advanced Integration Service Examples

This document provides advanced examples of how to use the Integration Service for complex scenarios. These examples build on the basic usage patterns covered in the [Basic Example](./basic_example.md) document.

## OAuth2 Authentication Example

The following example illustrates how to set up and use an integration with OAuth2 authentication:

1. Creating an OAuth2-based integration definition
2. Setting up the OAuth2 configuration
3. Initiating the OAuth2 flow
4. Handling the OAuth2 callback
5. Using the authenticated integration

### OAuth2 Integration Definition

```json
{
  "name": "Google Calendar Integration",
  "description": "Integration with Google Calendar API",
  "version": "1.0.0",
  "type": "http",
  "authType": "oauth2",
  "methods": [
    {
      "name": "listEvents",
      "description": "List calendar events",
      "paramSchema": {
        "type": "object",
        "properties": {
          "calendarId": {
            "type": "string",
            "description": "Calendar ID",
            "default": "primary"
          },
          "timeMin": {
            "type": "string",
            "format": "date-time",
            "description": "Start time (ISO format)"
          },
          "timeMax": {
            "type": "string",
            "format": "date-time",
            "description": "End time (ISO format)"
          },
          "maxResults": {
            "type": "integer",
            "description": "Maximum number of events to return",
            "default": 10
          }
        },
        "required": ["timeMin", "timeMax"]
      },
      "resultSchema": {
        "type": "object",
        "properties": {
          "events": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "id": { "type": "string" },
                "summary": { "type": "string" },
                "description": { "type": "string" },
                "start": {
                  "type": "object",
                  "properties": {
                    "dateTime": { "type": "string", "format": "date-time" },
                    "timeZone": { "type": "string" }
                  }
                },
                "end": {
                  "type": "object",
                  "properties": {
                    "dateTime": { "type": "string", "format": "date-time" },
                    "timeZone": { "type": "string" }
                  }
                }
              }
            }
          },
          "nextPageToken": { "type": "string" }
        }
      }
    }
  ],
  "configSchema": {
    "type": "object",
    "required": ["clientId", "clientSecret", "redirectUri"],
    "properties": {
      "clientId": {
        "type": "string",
        "description": "OAuth client ID"
      },
      "clientSecret": {
        "type": "string",
        "description": "OAuth client secret"
      },
      "redirectUri": {
        "type": "string",
        "description": "OAuth redirect URI"
      },
      "scope": {
        "type": "string",
        "description": "OAuth scopes (space-separated)",
        "default": "https://www.googleapis.com/auth/calendar.readonly"
      }
    }
  },
  "oauth2Config": {
    "authorizationUrl": "https://accounts.google.com/o/oauth2/auth",
    "tokenUrl": "https://oauth2.googleapis.com/token",
    "refreshUrl": "https://oauth2.googleapis.com/token",
    "scopeDelimiter": " ",
    "authStyle": "header",
    "additionalParameters": {
      "access_type": "offline",
      "prompt": "consent"
    }
  }
}
```

### Creating an OAuth2 Integration Instance

```bash
curl -X POST https://api.example.com/api/v1/integration-instances \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token" \
  -d '{
    "integrationDefinitionId": "int_def_oauth2_123",
    "name": "My Google Calendar",
    "config": {
      "clientId": "your-google-client-id.apps.googleusercontent.com",
      "clientSecret": "your-google-client-secret",
      "redirectUri": "https://your-app.example.com/oauth/callback",
      "scope": "https://www.googleapis.com/auth/calendar.readonly"
    }
  }'
```

### Response

```json
{
  "id": "int_inst_oauth2_456",
  "integrationDefinitionId": "int_def_oauth2_123",
  "name": "My Google Calendar",
  "status": "PENDING_AUTHENTICATION",
  "createdAt": "2023-09-01T14:30:00Z"
}
```

### Initiating the OAuth2 Flow

```bash
curl -X POST https://api.example.com/api/v1/integration-instances/int_inst_oauth2_456/auth/oauth2/start \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token" \
  -d '{
    "redirectUri": "https://your-app.example.com/oauth/callback"
  }'
```

### Response

```json
{
  "authorizationUrl": "https://accounts.google.com/o/oauth2/auth?client_id=your-google-client-id.apps.googleusercontent.com&redirect_uri=https%3A%2F%2Fyour-app.example.com%2Foauth%2Fcallback&response_type=code&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcalendar.readonly&access_type=offline&prompt=consent&state=abc123",
  "state": "abc123"
}
```

### Handling the OAuth2 Callback

After the user authorizes the application, they will be redirected to the redirect URI with a code and state parameter. You need to send this code to the Integration Service to complete the OAuth2 flow:

```bash
curl -X POST https://api.example.com/api/v1/integration-instances/int_inst_oauth2_456/auth/oauth2/callback \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token" \
  -d '{
    "code": "4/0AY0e-g6_-u7KDoSKBVnxOfMtIU9q7j5niffgYUiBpUz0T0SEJwX5jQU9fcY",
    "state": "abc123"
  }'
```

### Response

```json
{
  "status": "SUCCESS",
  "integrationInstanceId": "int_inst_oauth2_456"
}
```

### Using the Authenticated Integration

Now you can execute methods on the authenticated integration instance:

```bash
curl -X POST https://api.example.com/api/v1/integration-instances/int_inst_oauth2_456/methods/listEvents/execute \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token" \
  -d '{
    "parameters": {
      "calendarId": "primary",
      "timeMin": "2023-09-01T00:00:00Z",
      "timeMax": "2023-09-30T23:59:59Z",
      "maxResults": 5
    }
  }'
```

## Data Transformation Example

This example demonstrates how to use data transformations to map between different data formats:

### Integration Definition with Transformations

```json
{
  "name": "CRM Integration with Transformation",
  "description": "Integration with CRM system with data transformations",
  "version": "1.0.0",
  "type": "http",
  "authType": "api_key",
  "methods": [
    {
      "name": "createContact",
      "description": "Create a new contact in the CRM",
      "paramSchema": {
        "type": "object",
        "properties": {
          "firstName": { "type": "string" },
          "lastName": { "type": "string" },
          "email": { "type": "string", "format": "email" },
          "phone": { "type": "string" },
          "company": { "type": "string" },
          "title": { "type": "string" }
        },
        "required": ["firstName", "lastName", "email"]
      },
      "resultSchema": {
        "type": "object",
        "properties": {
          "id": { "type": "string" },
          "fullName": { "type": "string" },
          "email": { "type": "string" },
          "createdAt": { "type": "string", "format": "date-time" }
        }
      },
      "requestTransform": `
        // Transform from our standard format to the CRM's format
        function transform(input) {
          return {
            contact: {
              first_name: input.firstName,
              last_name: input.lastName,
              email_address: input.email,
              phone_number: input.phone || null,
              organization: input.company || null,
              job_title: input.title || null,
              custom_fields: {
                source: "integration_service"
              }
            }
          };
        }
      `,
      "responseTransform": `
        // Transform from the CRM's response format to our standard format
        function transform(input) {
          return {
            id: input.contact_id,
            fullName: input.contact.first_name + " " + input.contact.last_name,
            email: input.contact.email_address,
            createdAt: input.created_at
          };
        }
      `
    }
  ],
  "configSchema": {
    "type": "object",
    "required": ["baseUrl", "apiKey"],
    "properties": {
      "baseUrl": {
        "type": "string",
        "description": "Base URL for the CRM API"
      },
      "apiKey": {
        "type": "string",
        "description": "API key for authentication"
      }
    }
  }
}
```

### Using the Integration with Transformations

```bash
curl -X POST https://api.example.com/api/v1/integration-instances/int_inst_transform_789/methods/createContact/execute \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token" \
  -d '{
    "parameters": {
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "jane.smith@example.com",
      "phone": "+1-555-123-4567",
      "company": "Acme Inc.",
      "title": "Product Manager"
    }
  }'
```

### Response (After Transformation)

```json
{
  "status": "SUCCESS",
  "data": {
    "id": "cont_12345",
    "fullName": "Jane Smith",
    "email": "jane.smith@example.com",
    "createdAt": "2023-09-15T10:30:00Z"
  }
}
```

## Error Handling and Retry Example

This example demonstrates how to handle errors and implement retry logic:

### JavaScript Example with Error Handling and Retry

```typescript
import { IntegrationServiceClient } from '@example/integration-service-sdk';

async function executeWithRetry() {
  const client = new IntegrationServiceClient({
    apiKey: 'your-api-key',
    baseUrl: 'https://api.example.com/api/v1'
  });
  
  const instanceId = 'int_inst_789012';
  const methodName = 'getUsers';
  const parameters = {
    page: 1,
    limit: 5
  };
  
  // Maximum number of retry attempts
  const maxRetries = 3;
  
  // Initial backoff delay in milliseconds
  let backoffDelay = 1000;
  
  for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
    try {
      const result = await client.executeIntegrationMethod(
        instanceId,
        methodName,
        { parameters }
      );
      
      console.log('Method execution successful:', result.data);
      return result.data;
    } catch (error) {
      // Check if the error is retryable
      if (
        attempt <= maxRetries && 
        (error.code === 'RATE_LIMIT_EXCEEDED' || 
         error.code === 'TIMEOUT_ERROR' ||
         error.code === 'TEMPORARY_ERROR')
      ) {
        console.log(`Attempt ${attempt} failed with error: ${error.message}`);
        console.log(`Retrying in ${backoffDelay}ms...`);
        
        // Wait for the backoff delay
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
        
        // Exponential backoff with jitter
        backoffDelay = backoffDelay * 2 * (0.8 + Math.random() * 0.4);
      } else {
        // Non-retryable error or max retries exceeded
        console.error('Method execution failed:', error);
        throw error;
      }
    }
  }
}

executeWithRetry().catch(error => {
  console.error('All retry attempts failed:', error);
});
```

## Webhook Integration Example

This example demonstrates how to set up a webhook-based integration:

### Webhook Integration Definition

```json
{
  "name": "Stripe Webhook Integration",
  "description": "Integration with Stripe using webhooks",
  "version": "1.0.0",
  "type": "webhook",
  "authType": "hmac",
  "methods": [
    {
      "name": "processPaymentEvent",
      "description": "Process a payment event from Stripe",
      "paramSchema": {
        "type": "object",
        "properties": {
          "event": {
            "type": "object",
            "properties": {
              "id": { "type": "string" },
              "type": { "type": "string" },
              "data": { "type": "object" }
            },
            "required": ["id", "type", "data"]
          }
        },
        "required": ["event"]
      },
      "resultSchema": {
        "type": "object",
        "properties": {
          "processed": { "type": "boolean" },
          "eventId": { "type": "string" }
        }
      }
    }
  ],
  "configSchema": {
    "type": "object",
    "required": ["webhookSecret"],
    "properties": {
      "webhookSecret": {
        "type": "string",
        "description": "Webhook signing secret for HMAC verification"
      },
      "eventTypes": {
        "type": "array",
        "items": { "type": "string" },
        "description": "Event types to process",
        "default": ["payment_intent.succeeded", "payment_intent.failed"]
      }
    }
  }
}
```

### Webhook Endpoint Configuration

To receive webhook events, you need to configure a webhook endpoint in your application:

```typescript
import express from 'express';
import { IntegrationServiceClient } from '@example/integration-service-sdk';

const app = express();
app.use(express.raw({ type: 'application/json' }));

const client = new IntegrationServiceClient({
  apiKey: 'your-api-key',
  baseUrl: 'https://api.example.com/api/v1'
});

app.post('/webhooks/stripe', async (req, res) => {
  const signature = req.headers['stripe-signature'];
  
  try {
    // Parse the event
    const event = JSON.parse(req.body.toString());
    
    // Execute the integration method
    const result = await client.executeIntegrationMethod(
      'int_inst_webhook_123',
      'processPaymentEvent',
      {
        parameters: {
          event: event
        },
        metadata: {
          signature: signature
        }
      }
    );
    
    console.log('Webhook processed:', result.data);
    res.status(200).send({ received: true });
  } catch (error) {
    console.error('Webhook processing failed:', error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});

app.listen(3000, () => {
  console.log('Webhook server running on port 3000');
});
```

## Related Documentation

* [Basic Example](./basic_example.md)
* [API Reference](../interfaces/api.md)
* [Credential Manager](../implementation/credential_manager.md)
* [Data Transformer](../implementation/data_transformer.md)
* [Method Executor](../implementation/method_executor.md)


