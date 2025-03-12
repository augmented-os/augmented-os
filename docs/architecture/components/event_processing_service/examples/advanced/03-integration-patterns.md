# Integration Patterns

This document demonstrates advanced integration patterns using the Event Processing Service.

## Event Sourcing

Implementing an event sourcing pattern with the Event Processing Service:

```typescript
import { EventServiceClient } from '@example/event-service-client';
import { EventStore, AggregateRepository } from '@example/event-sourcing';

// Initialize the Event Service client
const client = new EventServiceClient({
  baseUrl: 'https://api.example.com/event-service',
  apiKey: 'your-api-key'
});

// Create an event store using the Event Processing Service
const eventStore = new EventStore({
  eventClient: client,
  eventTypePrefix: 'inventory',  // All events will have this prefix
  aggregateIdField: 'productId'  // Field that identifies the aggregate
});

// Define a Product aggregate model
class Product {
  productId: string;
  name: string;
  sku: string;
  quantity: number;
  reserved: number;
  version: number;
  
  constructor(id: string) {
    this.productId = id;
    this.quantity = 0;
    this.reserved = 0;
    this.version = 0;
  }
  
  // Apply an inventory.created event
  applyCreated(event) {
    this.name = event.data.name;
    this.sku = event.data.sku;
    this.quantity = event.data.initialQuantity || 0;
    this.version++;
  }
  
  // Apply an inventory.updated event
  applyUpdated(event) {
    if (event.data.name) this.name = event.data.name;
    if (event.data.sku) this.sku = event.data.sku;
    this.version++;
  }
  
  // Apply an inventory.quantityChanged event
  applyQuantityChanged(event) {
    this.quantity += event.data.delta;
    this.version++;
  }
  
  // Apply an inventory.reserved event
  applyReserved(event) {
    this.reserved += event.data.quantity;
    this.version++;
  }
  
  // Apply an inventory.reservationCancelled event
  applyReservationCancelled(event) {
    this.reserved -= event.data.quantity;
    this.version++;
  }
  
  // Apply an inventory.reservationConfirmed event
  applyReservationConfirmed(event) {
    this.quantity -= event.data.quantity;
    this.reserved -= event.data.quantity;
    this.version++;
  }
}

// Create a repository to work with Product aggregates
const productRepository = new AggregateRepository({
  eventStore,
  aggregateType: Product,
  eventHandlers: {
    'inventory.created': 'applyCreated',
    'inventory.updated': 'applyUpdated',
    'inventory.quantityChanged': 'applyQuantityChanged',
    'inventory.reserved': 'applyReserved',
    'inventory.reservationCancelled': 'applyReservationCancelled',
    'inventory.reservationConfirmed': 'applyReservationConfirmed'
  }
});

// Example: Create a new product
async function createProduct(productId, name, sku, initialQuantity) {
  // Create the event
  const event = {
    type: 'inventory.created',
    data: {
      productId,
      name,
      sku,
      initialQuantity
    }
  };
  
  // Save the event
  await eventStore.save(productId, event);
  console.log(`Created product ${productId}`);
}

// Example: Reserve inventory
async function reserveInventory(productId, quantity, orderId) {
  // Load the current state of the product by replaying events
  const product = await productRepository.load(productId);
  
  // Business logic and validation
  const availableQuantity = product.quantity - product.reserved;
  if (availableQuantity < quantity) {
    throw new Error(`Not enough inventory. Requested: ${quantity}, Available: ${availableQuantity}`);
  }
  
  // Create the reservation event
  const event = {
    type: 'inventory.reserved',
    data: {
      productId,
      quantity,
      orderId,
      timestamp: new Date().toISOString()
    }
  };
  
  // Save the event
  await eventStore.save(productId, event);
  console.log(`Reserved ${quantity} units of product ${productId} for order ${orderId}`);
}

// Example: Get current state of a product
async function getProductState(productId) {
  const product = await productRepository.load(productId);
  return {
    productId: product.productId,
    name: product.name,
    sku: product.sku,
    availableQuantity: product.quantity - product.reserved,
    totalQuantity: product.quantity,
    reservedQuantity: product.reserved,
    version: product.version
  };
}

// Example usage
async function run() {
  // Create a product
  await createProduct('PROD-001', 'Wireless Headphones', 'WH-XYZ-100', 100);
  
  // Reserve some inventory
  await reserveInventory('PROD-001', 5, 'ORDER-123');
  
  // Get the current state
  const productState = await getProductState('PROD-001');
  console.log('Current product state:', productState);
}

run();
```

## Saga Pattern

Implementing the saga pattern for distributed transactions:

```typescript
import { EventServiceClient } from '@example/event-service-client';
import { SagaDefinition, SagaOrchestrator } from '@example/saga-orchestrator';

// Initialize the event client
const eventClient = new EventServiceClient({
  baseUrl: 'https://api.example.com/event-service',
  apiKey: 'your-api-key'
});

// Define an order processing saga
const orderProcessingSaga = new SagaDefinition({
  name: 'OrderProcessing',
  // Define the steps in the saga
  steps: [
    {
      name: 'ReserveInventory',
      action: async (context) => {
        // Command to reserve inventory
        await eventClient.publishEvent({
          type: 'inventory.command.reserve',
          source: 'order-saga',
          data: {
            sagaId: context.sagaId,
            orderId: context.data.orderId,
            items: context.data.items
          }
        });
      },
      compensation: async (context) => {
        // Compensating action to release inventory
        await eventClient.publishEvent({
          type: 'inventory.command.release',
          source: 'order-saga',
          data: {
            sagaId: context.sagaId,
            orderId: context.data.orderId,
            items: context.data.items
          }
        });
      },
      // Wait for success/failure event
      successEvent: 'inventory.reserved',
      failureEvent: 'inventory.reservation.failed',
      successEventCondition: 'data.sagaId === sagaId && data.orderId === data.orderId',
      failureEventCondition: 'data.sagaId === sagaId && data.orderId === data.orderId',
      timeout: 30000 // 30 seconds
    },
    {
      name: 'ProcessPayment',
      action: async (context) => {
        // Command to process payment
        await eventClient.publishEvent({
          type: 'payment.command.process',
          source: 'order-saga',
          data: {
            sagaId: context.sagaId,
            orderId: context.data.orderId,
            amount: context.data.totalAmount,
            customerId: context.data.customerId,
            paymentMethod: context.data.paymentMethod
          }
        });
      },
      compensation: async (context) => {
        // Compensating action to refund payment
        await eventClient.publishEvent({
          type: 'payment.command.refund',
          source: 'order-saga',
          data: {
            sagaId: context.sagaId,
            orderId: context.data.orderId,
            paymentId: context.stepData.paymentId,
            amount: context.data.totalAmount
          }
        });
      },
      // Wait for success/failure event
      successEvent: 'payment.processed',
      failureEvent: 'payment.processing.failed',
      successEventCondition: 'data.sagaId === sagaId && data.orderId === data.orderId',
      failureEventCondition: 'data.sagaId === sagaId && data.orderId === data.orderId',
      timeout: 60000 // 60 seconds
    },
    {
      name: 'UpdateOrderStatus',
      action: async (context) => {
        // Command to update order status
        await eventClient.publishEvent({
          type: 'order.command.updateStatus',
          source: 'order-saga',
          data: {
            sagaId: context.sagaId,
            orderId: context.data.orderId,
            status: 'CONFIRMED',
            paymentId: context.stepData.paymentId
          }
        });
      },
      // No compensation needed, order can be cancelled separately if needed
      // Wait for success/failure event
      successEvent: 'order.status.updated',
      failureEvent: 'order.status.update.failed',
      successEventCondition: 'data.sagaId === sagaId && data.orderId === data.orderId',
      failureEventCondition: 'data.sagaId === sagaId && data.orderId === data.orderId',
      timeout: 30000 // 30 seconds
    },
    {
      name: 'NotifyCustomer',
      action: async (context) => {
        // Command to send notification
        await eventClient.publishEvent({
          type: 'notification.command.send',
          source: 'order-saga',
          data: {
            sagaId: context.sagaId,
            orderId: context.data.orderId,
            customerId: context.data.customerId,
            notificationType: 'ORDER_CONFIRMATION',
            templateData: {
              orderNumber: context.data.orderId,
              amount: context.data.totalAmount,
              estimatedDelivery: context.data.estimatedDelivery
            }
          }
        });
      },
      // No compensation needed for notification
      // Wait for success/failure event
      successEvent: 'notification.sent',
      failureEvent: 'notification.sending.failed',
      successEventCondition: 'data.sagaId === sagaId && data.orderId === data.orderId',
      failureEventCondition: 'data.sagaId === sagaId && data.orderId === data.orderId',
      timeout: 30000 // 30 seconds
    }
  ]
});

// Create an orchestrator for the saga
const sagaOrchestrator = new SagaOrchestrator({
  eventClient,
  sagaDefinitions: [orderProcessingSaga],
  persistenceProvider: 'redis', // Could be 'memory', 'redis', or 'database'
  persistenceConfig: {
    host: 'redis.example.com',
    port: 6379
  }
});

// Start the orchestrator
await sagaOrchestrator.start();

// Function to start a new order processing saga
async function startOrderProcessingSaga(orderData) {
  const sagaId = await sagaOrchestrator.startSaga('OrderProcessing', orderData);
  console.log(`Started OrderProcessing saga with ID: ${sagaId}`);
  return sagaId;
}

// Example usage
const orderData = {
  orderId: 'ORD-12345',
  customerId: 'CUST-6789',
  items: [
    { productId: 'PROD-001', quantity: 2, price: 29.99 },
    { productId: 'PROD-002', quantity: 1, price: 49.99 }
  ],
  totalAmount: 109.97,
  paymentMethod: {
    type: 'CREDIT_CARD',
    lastFour: '1234'
  },
  estimatedDelivery: '2023-06-15'
};

startOrderProcessingSaga(orderData);
```

## Event-Driven Microservices

Setting up an event-driven microservice architecture:

```typescript
import { EventServiceClient } from '@example/event-service-client';
import { MicroserviceFramework } from '@example/microservice-framework';

// Initialize the event client
const eventClient = new EventServiceClient({
  baseUrl: 'https://api.example.com/event-service',
  apiKey: 'your-api-key'
});

// Define the inventory microservice
const inventoryService = new MicroserviceFramework({
  name: 'inventory-service',
  eventClient,
  // Define event handlers
  eventHandlers: {
    // Handle command to reserve inventory
    'inventory.command.reserve': async (event, context) => {
      console.log(`Handling inventory reservation for order ${event.data.orderId}`);
      
      try {
        // Check inventory availability in the database
        const inventoryCheckResults = await context.db.checkInventory(event.data.items);
        
        // Handle insufficient inventory
        if (inventoryCheckResults.insufficientItems.length > 0) {
          await eventClient.publishEvent({
            type: 'inventory.reservation.failed',
            source: 'inventory-service',
            data: {
              sagaId: event.data.sagaId,
              orderId: event.data.orderId,
              reason: 'INSUFFICIENT_INVENTORY',
              insufficientItems: inventoryCheckResults.insufficientItems
            }
          });
          return;
        }
        
        // Reserve inventory in the database
        await context.db.reserveInventory(event.data.orderId, event.data.items);
        
        // Publish success event
        await eventClient.publishEvent({
          type: 'inventory.reserved',
          source: 'inventory-service',
          data: {
            sagaId: event.data.sagaId,
            orderId: event.data.orderId,
            items: event.data.items,
            reservedAt: new Date().toISOString()
          }
        });
        
      } catch (error) {
        console.error('Error reserving inventory:', error);
        
        // Publish failure event
        await eventClient.publishEvent({
          type: 'inventory.reservation.failed',
          source: 'inventory-service',
          data: {
            sagaId: event.data.sagaId,
            orderId: event.data.orderId,
            reason: 'TECHNICAL_ERROR',
            errorMessage: error.message
          }
        });
      }
    },
    
    // Handle command to release inventory
    'inventory.command.release': async (event, context) => {
      console.log(`Handling inventory release for order ${event.data.orderId}`);
      
      try {
        // Release reserved inventory in the database
        await context.db.releaseInventory(event.data.orderId);
        
        // Publish success event
        await eventClient.publishEvent({
          type: 'inventory.released',
          source: 'inventory-service',
          data: {
            sagaId: event.data.sagaId,
            orderId: event.data.orderId,
            releasedAt: new Date().toISOString()
          }
        });
        
      } catch (error) {
        console.error('Error releasing inventory:', error);
        
        // Publish failure event
        await eventClient.publishEvent({
          type: 'inventory.release.failed',
          source: 'inventory-service',
          data: {
            sagaId: event.data.sagaId,
            orderId: event.data.orderId,
            reason: 'TECHNICAL_ERROR',
            errorMessage: error.message
          }
        });
      }
    }
  }
});

// Define the payment microservice
const paymentService = new MicroserviceFramework({
  name: 'payment-service',
  eventClient,
  // Define event handlers
  eventHandlers: {
    // Handle command to process payment
    'payment.command.process': async (event, context) => {
      console.log(`Processing payment for order ${event.data.orderId}`);
      
      try {
        // Process payment through payment gateway
        const paymentResult = await context.paymentGateway.processPayment({
          amount: event.data.amount,
          customerId: event.data.customerId,
          paymentMethod: event.data.paymentMethod,
          orderId: event.data.orderId
        });
        
        if (paymentResult.status === 'SUCCESS') {
          // Store payment record in database
          await context.db.storePayment({
            orderId: event.data.orderId,
            paymentId: paymentResult.paymentId,
            amount: event.data.amount,
            status: 'COMPLETED',
            timestamp: new Date().toISOString()
          });
          
          // Publish success event
          await eventClient.publishEvent({
            type: 'payment.processed',
            source: 'payment-service',
            data: {
              sagaId: event.data.sagaId,
              orderId: event.data.orderId,
              paymentId: paymentResult.paymentId,
              amount: event.data.amount,
              status: 'COMPLETED',
              processedAt: new Date().toISOString()
            }
          });
        } else {
          // Publish failure event
          await eventClient.publishEvent({
            type: 'payment.processing.failed',
            source: 'payment-service',
            data: {
              sagaId: event.data.sagaId,
              orderId: event.data.orderId,
              reason: paymentResult.reason,
              errorCode: paymentResult.errorCode
            }
          });
        }
        
      } catch (error) {
        console.error('Error processing payment:', error);
        
        // Publish failure event
        await eventClient.publishEvent({
          type: 'payment.processing.failed',
          source: 'payment-service',
          data: {
            sagaId: event.data.sagaId,
            orderId: event.data.orderId,
            reason: 'TECHNICAL_ERROR',
            errorMessage: error.message
          }
        });
      }
    }
  }
});

// Start the microservices
async function startMicroservices() {
  await inventoryService.start();
  console.log('Inventory Service started');
  
  await paymentService.start();
  console.log('Payment Service started');
}

startMicroservices();
```

## Next Steps

Continue to [Error Handling and Recovery](./04-error-handling.md) to learn about robust error handling patterns using the Event Processing Service. 