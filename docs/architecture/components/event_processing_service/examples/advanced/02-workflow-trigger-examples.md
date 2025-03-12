# Workflow Trigger Examples

This document demonstrates how to integrate the Event Processing Service with workflow orchestration systems using event-based triggers.

## Configuring Event-Based Workflow Triggers

Creating event triggers to automatically start workflows:

```typescript
import { EventServiceClient } from '@example/event-service-client';
import { WorkflowTriggerClient } from '@example/workflow-client';

// Initialize the clients
const eventClient = new EventServiceClient({
  baseUrl: 'https://api.example.com/event-service',
  apiKey: 'your-event-api-key'
});

const workflowClient = new WorkflowTriggerClient({
  baseUrl: 'https://api.example.com/workflow-service',
  apiKey: 'your-workflow-api-key'
});

// Create a workflow trigger for new customer registrations
async function createNewCustomerOnboardingTrigger() {
  const trigger = await workflowClient.createTrigger({
    name: 'New Customer Onboarding',
    workflowId: 'customer-onboarding-workflow',
    eventPattern: 'customer.registered',
    active: true,
    inputMapping: {
      // Map event data to workflow input
      'customerId': 'data.customerId',
      'name': 'data.name',
      'email': 'data.email',
      'registrationDate': 'data.timestamp'
    }
  });
  
  console.log(`Created workflow trigger: ${trigger.id}`);
  return trigger;
}

// Create a trigger for handling order cancellations
async function createOrderCancellationTrigger() {
  const trigger = await workflowClient.createTrigger({
    name: 'Order Cancellation Processing',
    workflowId: 'order-cancellation-workflow',
    eventPattern: 'order.cancelled',
    active: true,
    inputMapping: {
      'orderId': 'data.orderId',
      'cancellationReason': 'data.reason',
      'refundRequired': 'data.refundRequired',
      'customerId': 'data.customer.id'
    }
  });
  
  console.log(`Created workflow trigger: ${trigger.id}`);
  return trigger;
}

// Deploy the triggers
async function deployTriggers() {
  await createNewCustomerOnboardingTrigger();
  await createOrderCancellationTrigger();
  
  // Publish a test event to verify the trigger
  await eventClient.publishEvent({
    type: 'customer.registered',
    source: 'trigger-test',
    data: {
      customerId: 'cust-123',
      name: 'Jane Doe',
      email: 'jane@example.com',
      timestamp: new Date().toISOString()
    }
  });
}

deployTriggers();
```

## Creating Conditional Workflow Triggers

Conditional workflow triggers allow you to start workflows only when certain conditions are met:

```typescript
import { EventServiceClient } from '@example/event-service-client';
import { WorkflowTriggerClient } from '@example/workflow-client';

// Initialize the clients
const eventClient = new EventServiceClient({
  baseUrl: 'https://api.example.com/event-service',
  apiKey: 'your-event-api-key'
});

const workflowClient = new WorkflowTriggerClient({
  baseUrl: 'https://api.example.com/workflow-service',
  apiKey: 'your-workflow-api-key'
});

// Create a conditional trigger for high-value orders
async function createHighValueOrderProcessingTrigger() {
  const trigger = await workflowClient.createTrigger({
    name: 'High-Value Order Processing',
    workflowId: 'vip-order-processing-workflow',
    eventPattern: 'order.created',
    // Only trigger for orders with value over $1000
    condition: 'data.orderTotal > 1000',
    active: true,
    priority: 10, // Higher priority than regular order processing
    inputMapping: {
      'orderId': 'data.orderId',
      'customer': 'data.customer',
      'orderTotal': 'data.orderTotal',
      'items': 'data.items',
      'requiresManualReview': true // Flag for special handling
    }
  });
  
  console.log(`Created conditional workflow trigger: ${trigger.id}`);
  return trigger;
}

// Create a conditional trigger for fraud detection
async function createSuspiciousActivityTrigger() {
  const trigger = await workflowClient.createTrigger({
    name: 'Suspicious Activity Review',
    workflowId: 'fraud-review-workflow',
    eventPattern: 'user.activity.*', // Multiple activity types
    // Complex condition with multiple factors
    condition: '(data.riskScore > 80) || ' +
               '(data.location.country !== data.user.country) || ' +
               '(data.attemptCount > 3 && data.successful === false)',
    active: true,
    priority: 5, // High priority for security issues
    inputMapping: {
      'userId': 'data.user.id',
      'activityType': 'pattern', // Use the event pattern itself
      'riskScore': 'data.riskScore',
      'timestamp': 'data.timestamp',
      'location': 'data.location',
      'deviceInfo': 'data.deviceInfo'
    }
  });
  
  console.log(`Created suspicious activity trigger: ${trigger.id}`);
  return trigger;
}

// Deploy the triggers
async function deployConditionalTriggers() {
  await createHighValueOrderProcessingTrigger();
  await createSuspiciousActivityTrigger();
  
  // Publish a test event to verify the trigger
  await eventClient.publishEvent({
    type: 'order.created',
    source: 'trigger-test',
    data: {
      orderId: 'ORD-5678',
      customer: {
        id: 'cust-456',
        name: 'John Smith',
        tier: 'platinum'
      },
      orderTotal: 1500,
      items: [
        { id: 'PROD-123', name: 'Luxury Watch', price: 1500, quantity: 1 }
      ],
      timestamp: new Date().toISOString()
    }
  });
}

deployConditionalTriggers();
```

## Managing Workflow Trigger Lifecycle

Managing the lifecycle of workflow triggers:

```typescript
import { WorkflowTriggerClient } from '@example/workflow-client';

// Initialize the client
const workflowClient = new WorkflowTriggerClient({
  baseUrl: 'https://api.example.com/workflow-service',
  apiKey: 'your-workflow-api-key'
});

// List all triggers
async function listAllTriggers() {
  const triggers = await workflowClient.listTriggers();
  
  console.log(`Found ${triggers.length} workflow triggers:`);
  triggers.forEach(trigger => {
    console.log(`- ${trigger.name} (${trigger.id}): ${trigger.active ? 'Active' : 'Inactive'}`);
    console.log(`  Event pattern: ${trigger.eventPattern}`);
    console.log(`  Workflow: ${trigger.workflowId}`);
    if (trigger.condition) {
      console.log(`  Condition: ${trigger.condition}`);
    }
    console.log('');
  });
  
  return triggers;
}

// Disable a trigger temporarily
async function disableTrigger(triggerId) {
  await workflowClient.updateTrigger(triggerId, {
    active: false
  });
  
  console.log(`Disabled trigger: ${triggerId}`);
}

// Enable a trigger
async function enableTrigger(triggerId) {
  await workflowClient.updateTrigger(triggerId, {
    active: true
  });
  
  console.log(`Enabled trigger: ${triggerId}`);
}

// Update a trigger's condition
async function updateTriggerCondition(triggerId, newCondition) {
  await workflowClient.updateTrigger(triggerId, {
    condition: newCondition
  });
  
  console.log(`Updated condition for trigger: ${triggerId}`);
}

// Delete a trigger
async function deleteTrigger(triggerId) {
  await workflowClient.deleteTrigger(triggerId);
  
  console.log(`Deleted trigger: ${triggerId}`);
}

// Manage triggers based on business hours
async function manageTriggersByBusinessHours() {
  // Get all triggers
  const triggers = await listAllTriggers();
  
  // Check if we're in business hours
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay(); // 0 = Sunday, 6 = Saturday
  const isBusinessHours = (day >= 1 && day <= 5) && (hour >= 9 && hour < 17);
  
  // Find triggers that should only be active during business hours
  const businessHoursTriggers = triggers.filter(trigger => 
    trigger.name.includes('Business Hours') || 
    trigger.tags?.includes('business-hours-only')
  );
  
  // Update triggers based on business hours
  for (const trigger of businessHoursTriggers) {
    if (isBusinessHours && !trigger.active) {
      await enableTrigger(trigger.id);
    } else if (!isBusinessHours && trigger.active) {
      await disableTrigger(trigger.id);
    }
  }
}

// Run the management function
manageTriggersByBusinessHours();
```

## Next Steps

Continue to [Integration Patterns](./03-integration-patterns.md) to learn about advanced integration patterns using the Event Processing Service. 