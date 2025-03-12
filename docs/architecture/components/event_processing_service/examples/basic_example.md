# Event Processing Service Basic Examples

This document provides basic examples of how to use the Event Processing Service for common scenarios including publishing events, creating subscriptions, and handling events.

## Prerequisites

Before using the Event Processing Service, ensure you have:


1. Access credentials for the Event Processing Service API
2. Required client libraries installed:

   ```bash
   # Node.js client
   npm install @example/event-service-client
   
   # Python client
   pip install example-event-service-client
   ```

## Publishing Events

### Basic Event Publishing

#### Node.js Example

```typescript
import { EventServiceClient } from '@example/event-service-client';

// Initialize the client
const client = new EventServiceClient({
  baseUrl: 'https://api.example.com/event-service',
  apiKey: 'your-api-key'
});

// Define a simple event
const event = {
  type: 'user.created',
  source: 'user-service',
  data: {
    userId: '12345',
    email: 'user@example.com',
    createdAt: new Date().toISOString()
  }
};

// Publish the event
async function publishEvent() {
  try {
    const result = await client.publishEvent(event);
    console.log('Event published successfully:', result.eventId);
  } catch (error) {
    console.error('Failed to publish event:', error);
  }
}

publishEvent();
```

#### Python Example

```python
from example_event_service_client import EventServiceClient
import datetime
import json

# Initialize the client
client = EventServiceClient(
    base_url='https://api.example.com/event-service',
    api_key='your-api-key'
)

# Define a simple event
event = {
    'type': 'user.created',
    'source': 'user-service',
    'data': {
        'userId': '12345',
        'email': 'user@example.com',
        'createdAt': datetime.datetime.now().isoformat()
    }
}

# Publish the event
try:
    result = client.publish_event(event)
    print(f"Event published successfully: {result['event_id']}")
except Exception as e:
    print(f"Failed to publish event: {str(e)}")
```

### Publishing Events with Schema Validation

#### Node.js Example

```typescript
import { EventServiceClient } from '@example/event-service-client';

// Initialize the client
const client = new EventServiceClient({
  baseUrl: 'https://api.example.com/event-service',
  apiKey: 'your-api-key'
});

// First, register an event definition with schema
async function registerEventDefinition() {
  const eventDefinition = {
    type: 'order.created',
    schema: {
      type: 'object',
      required: ['orderId', 'customerId', 'items', 'totalAmount'],
      properties: {
        orderId: { type: 'string' },
        customerId: { type: 'string' },
        items: {
          type: 'array',
          items: {
            type: 'object',
            required: ['productId', 'quantity', 'price'],
            properties: {
              productId: { type: 'string' },
              quantity: { type: 'number', minimum: 1 },
              price: { type: 'number', minimum: 0 }
            }
          }
        },
        totalAmount: { type: 'number', minimum: 0 },
        discountCode: { type: 'string' }
      }
    },
    description: 'Event emitted when a new order is created'
  };

  try {
    await client.createEventDefinition(eventDefinition);
    console.log('Event definition registered successfully');
  } catch (error) {
    console.error('Failed to register event definition:', error);
  }
}

// Then publish an event that conforms to the schema
async function publishOrderCreatedEvent() {
  const event = {
    type: 'order.created',
    source: 'order-service',
    data: {
      orderId: 'ORD-12345',
      customerId: 'CUST-6789',
      items: [
        {
          productId: 'PROD-001',
          quantity: 2,
          price: 29.99
        },
        {
          productId: 'PROD-002',
          quantity: 1,
          price: 49.99
        }
      ],
      totalAmount: 109.97,
      discountCode: 'SUMMER10'
    }
  };

  try {
    const result = await client.publishEvent(event);
    console.log('Order created event published successfully:', result.eventId);
  } catch (error) {
    console.error('Failed to publish event:', error);
  }
}

// Run the example
async function run() {
  await registerEventDefinition();
  await publishOrderCreatedEvent();
}

run();
```

## Creating Subscriptions

### Basic Subscription Creation

#### Node.js Example

```typescript
import { EventServiceClient } from '@example/event-service-client';

// Initialize the client
const client = new EventServiceClient({
  baseUrl: 'https://api.example.com/event-service',
  apiKey: 'your-api-key'
});

// Create a subscription
async function createSubscription() {
  const subscription = {
    name: 'user-notification-service',
    eventTypes: ['user.created', 'user.updated', 'user.deleted'],
    endpoint: 'https://notification-service.example.com/events',
    headers: {
      'x-api-key': 'notification-service-api-key'
    },
    maxRetries: 3,
    retryDelay: 5000 // 5 seconds
  };

  try {
    const result = await client.createSubscription(subscription);
    console.log('Subscription created successfully:', result.subscriptionId);
  } catch (error) {
    console.error('Failed to create subscription:', error);
  }
}

createSubscription();
```

#### Python Example

```python
from example_event_service_client import EventServiceClient

# Initialize the client
client = EventServiceClient(
    base_url='https://api.example.com/event-service',
    api_key='your-api-key'
)

# Create a subscription
subscription = {
    'name': 'user-notification-service',
    'event_types': ['user.created', 'user.updated', 'user.deleted'],
    'endpoint': 'https://notification-service.example.com/events',
    'headers': {
        'x-api-key': 'notification-service-api-key'
    },
    'max_retries': 3,
    'retry_delay': 5000  # 5 seconds
}

try:
    result = client.create_subscription(subscription)
    print(f"Subscription created successfully: {result['subscription_id']}")
except Exception as e:
    print(f"Failed to create subscription: {str(e)}")
```

### Pattern-Based Subscription

```typescript
import { EventServiceClient } from '@example/event-service-client';

// Initialize the client
const client = new EventServiceClient({
  baseUrl: 'https://api.example.com/event-service',
  apiKey: 'your-api-key'
});

// Create a pattern-based subscription
async function createPatternSubscription() {
  const subscription = {
    name: 'analytics-service',
    eventTypePattern: 'user.*',  // Subscribe to all user events
    endpoint: 'https://analytics-service.example.com/events',
    headers: {
      'x-api-key': 'analytics-service-api-key'
    }
  };

  try {
    const result = await client.createSubscription(subscription);
    console.log('Pattern subscription created successfully:', result.subscriptionId);
  } catch (error) {
    console.error('Failed to create pattern subscription:', error);
  }
}

createPatternSubscription();
```

## Receiving Events

### Implementing an Event Handler

#### Node.js Express Example

```typescript
import express from 'express';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

// Event handler endpoint
app.post('/events', (req, res) => {
  const event = req.body;
  
  console.log(`Received event: ${event.type} from ${event.source}`);
  console.log('Event data:', event.data);
  
  // Process the event based on its type
  switch (event.type) {
    case 'user.created':
      handleUserCreated(event.data);
      break;
    case 'user.updated':
      handleUserUpdated(event.data);
      break;
    case 'user.deleted':
      handleUserDeleted(event.data);
      break;
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
  
  // Acknowledge receipt of the event
  res.status(200).json({ status: 'success' });
});

function handleUserCreated(data) {
  // Implementation for handling user.created events
  console.log(`New user created: ${data.userId}`);
}

function handleUserUpdated(data) {
  // Implementation for handling user.updated events
  console.log(`User updated: ${data.userId}`);
}

function handleUserDeleted(data) {
  // Implementation for handling user.deleted events
  console.log(`User deleted: ${data.userId}`);
}

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Event handler service listening on port ${PORT}`);
});
```

#### Python Flask Example

```python
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/events', methods=['POST'])
def handle_event():
    event = request.json
    
    print(f"Received event: {event['type']} from {event['source']}")
    print(f"Event data: {event['data']}")
    
    # Process the event based on its type
    if event['type'] == 'user.created':
        handle_user_created(event['data'])
    elif event['type'] == 'user.updated':
        handle_user_updated(event['data'])
    elif event['type'] == 'user.deleted':
        handle_user_deleted(event['data'])
    else:
        print(f"Unhandled event type: {event['type']}")
    
    # Acknowledge receipt of the event
    return jsonify({'status': 'success'}), 200

def handle_user_created(data):
    # Implementation for handling user.created events
    print(f"New user created: {data['userId']}")

def handle_user_updated(data):
    # Implementation for handling user.updated events
    print(f"User updated: {data['userId']}")

def handle_user_deleted(data):
    # Implementation for handling user.deleted events
    print(f"User deleted: {data['userId']}")

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 3000))
    app.run(host='0.0.0.0', port=port)
```

## Managing Event Definitions

### Listing Event Definitions

```typescript
import { EventServiceClient } from '@example/event-service-client';

// Initialize the client
const client = new EventServiceClient({
  baseUrl: 'https://api.example.com/event-service',
  apiKey: 'your-api-key'
});

// List all event definitions
async function listEventDefinitions() {
  try {
    const definitions = await client.listEventDefinitions();
    console.log(`Found ${definitions.length} event definitions:`);
    
    definitions.forEach(def => {
      console.log(`- ${def.type}: ${def.description}`);
    });
  } catch (error) {
    console.error('Failed to list event definitions:', error);
  }
}

listEventDefinitions();
```

### Retrieving a Specific Event Definition

```typescript
import { EventServiceClient } from '@example/event-service-client';

// Initialize the client
const client = new EventServiceClient({
  baseUrl: 'https://api.example.com/event-service',
  apiKey: 'your-api-key'
});

// Get a specific event definition
async function getEventDefinition(eventType) {
  try {
    const definition = await client.getEventDefinition(eventType);
    console.log(`Event definition for ${eventType}:`);
    console.log(`Description: ${definition.description}`);
    console.log('Schema:', JSON.stringify(definition.schema, null, 2));
  } catch (error) {
    console.error(`Failed to get event definition for ${eventType}:`, error);
  }
}

getEventDefinition('order.created');
```

## Troubleshooting

### Checking Event Delivery Status

```typescript
import { EventServiceClient } from '@example/event-service-client';

// Initialize the client
const client = new EventServiceClient({
  baseUrl: 'https://api.example.com/event-service',
  apiKey: 'your-api-key'
});

// Check delivery status for an event
async function checkEventDeliveryStatus(eventId) {
  try {
    const status = await client.getEventDeliveryStatus(eventId);
    
    console.log(`Event ID: ${eventId}`);
    console.log(`Overall status: ${status.overall}`);
    console.log('Delivery status by subscriber:');
    
    status.subscribers.forEach(sub => {
      console.log(`- ${sub.name}: ${sub.status}`);
      if (sub.status === 'failed') {
        console.log(`  Error: ${sub.error}`);
        console.log(`  Retry count: ${sub.retryCount}`);
        console.log(`  Next retry: ${sub.nextRetry}`);
      }
    });
  } catch (error) {
    console.error(`Failed to check delivery status for event ${eventId}:`, error);
  }
}

checkEventDeliveryStatus('evt-12345');
```

### Retrying Failed Deliveries

```typescript
import { EventServiceClient } from '@example/event-service-client';

// Initialize the client
const client = new EventServiceClient({
  baseUrl: 'https://api.example.com/event-service',
  apiKey: 'your-api-key'
});

// Retry delivery for a specific event and subscriber
async function retryEventDelivery(eventId, subscriberId) {
  try {
    await client.retryEventDelivery(eventId, subscriberId);
    console.log(`Delivery retry initiated for event ${eventId} to subscriber ${subscriberId}`);
  } catch (error) {
    console.error(`Failed to retry delivery for event ${eventId}:`, error);
  }
}

retryEventDelivery('evt-12345', 'sub-6789');
```

## Related Documentation

* [Event Processing Service API](../interfaces/api.md)
* [Event Router Implementation](../implementation/event_router.md)
* [Advanced Examples](./advanced_example.md)
* [Troubleshooting Guide](../operations/troubleshooting.md)


