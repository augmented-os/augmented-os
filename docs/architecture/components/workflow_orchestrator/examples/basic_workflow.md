# Basic Workflow Example

This document provides a simple example of a workflow definition that can be executed by the Workflow Orchestrator Service.

## Order Processing Workflow

The following example illustrates a basic order processing workflow that:


1. Validates the order
2. Processes payment
3. Ships the order

### Workflow Definition

```json
{
  "id": "order-processing-wf",
  "name": "Order Processing Workflow",
  "description": "Process customer orders from validation to shipment",
  "version": "1.0.0",
  "steps": [
    {
      "stepId": "validate_order",
      "type": "TASK",
      "taskId": "order_validation_task",
      "input": {
        "orderId": "${workflow.input.orderId}",
        "customerId": "${workflow.input.customerId}",
        "items": "${workflow.input.items}"
      },
      "transitions": {
        "default": "process_payment",
        "VALIDATION_FAILED": "notify_customer_invalid_order"
      }
    },
    {
      "stepId": "process_payment",
      "type": "TASK",
      "taskId": "payment_processing_task",
      "input": {
        "orderId": "${workflow.input.orderId}",
        "customerId": "${workflow.input.customerId}",
        "amount": "${workflow.input.totalAmount}",
        "currency": "${workflow.input.currency}"
      },
      "transitions": {
        "default": "ship_order",
        "PAYMENT_FAILED": "notify_customer_payment_failed"
      }
    },
    {
      "stepId": "ship_order",
      "type": "TASK",
      "taskId": "shipment_task",
      "input": {
        "orderId": "${workflow.input.orderId}",
        "items": "${workflow.input.items}",
        "shippingAddress": "${workflow.input.shippingAddress}"
      },
      "transitions": {
        "default": "notify_customer_success"
      }
    },
    {
      "stepId": "notify_customer_invalid_order",
      "type": "TASK",
      "taskId": "notification_task",
      "input": {
        "type": "ORDER_VALIDATION_FAILED",
        "customerId": "${workflow.input.customerId}",
        "orderId": "${workflow.input.orderId}",
        "message": "Your order could not be processed due to validation errors."
      }
    },
    {
      "stepId": "notify_customer_payment_failed",
      "type": "TASK",
      "taskId": "notification_task",
      "input": {
        "type": "PAYMENT_FAILED",
        "customerId": "${workflow.input.customerId}",
        "orderId": "${workflow.input.orderId}",
        "message": "Your payment could not be processed. Please update your payment details."
      }
    },
    {
      "stepId": "notify_customer_success",
      "type": "TASK",
      "taskId": "notification_task",
      "input": {
        "type": "ORDER_CONFIRMED",
        "customerId": "${workflow.input.customerId}",
        "orderId": "${workflow.input.orderId}",
        "message": "Your order has been processed and shipped successfully."
      }
    }
  ],
  "compensationSteps": [
    {
      "stepId": "refund_payment",
      "compensationFor": "process_payment",
      "type": "TASK",
      "taskId": "payment_refund_task",
      "input": {
        "paymentId": "${workflow.state.steps.process_payment.output.paymentId}",
        "amount": "${workflow.input.totalAmount}",
        "reason": "${workflow.cancellation.reason}"
      }
    },
    {
      "stepId": "cancel_shipment",
      "compensationFor": "ship_order",
      "type": "TASK",
      "taskId": "shipment_cancellation_task",
      "input": {
        "shipmentId": "${workflow.state.steps.ship_order.output.shipmentId}",
        "reason": "${workflow.cancellation.reason}"
      }
    }
  ]
}
```

### Sample Workflow Input

```json
{
  "orderId": "ORD-12345",
  "customerId": "CUST-789",
  "totalAmount": 99.99,
  "currency": "USD",
  "items": [
    {
      "productId": "PROD-001",
      "name": "Wireless Headphones",
      "quantity": 1,
      "price": 79.99
    },
    {
      "productId": "PROD-002",
      "name": "Phone Case",
      "quantity": 1,
      "price": 19.99
    }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "Anytown",
    "state": "CA",
    "zipCode": "12345",
    "country": "USA"
  }
}
```

## Execution Flow

### Normal Flow


1. The workflow starts with the `validate_order` step.
2. Upon successful validation, it transitions to `process_payment`.
3. After payment processing succeeds, it proceeds to `ship_order`.
4. Finally, it notifies the customer of success with `notify_customer_success`.

### Error Flows

**Order Validation Failure:**


1. The workflow starts with the `validate_order` step.
2. If validation fails, it transitions to `notify_customer_invalid_order`.
3. The workflow then completes.

**Payment Processing Failure:**


1. The workflow starts with the `validate_order` step.
2. Upon successful validation, it transitions to `process_payment`.
3. If payment processing fails, it transitions to `notify_customer_payment_failed`.
4. The workflow then completes.

### Compensation Flow

If the workflow is canceled after payment processing:


1. The `refund_payment` compensation step will execute to refund the payment.
2. If the workflow was canceled after shipment, the `cancel_shipment` compensation step will execute first, followed by `refund_payment` (in reverse order of the original steps).

## Workflow Instance States

### After Completion (Success Path)

```json
{
  "id": "wf-inst-abcd1234",
  "workflowDefinitionId": "order-processing-wf",
  "status": "COMPLETED",
  "input": {
    // Input from above
  },
  "state": {
    "variables": {
      "orderValidated": true,
      "paymentId": "PAY-9876",
      "shipmentId": "SHIP-5678"
    },
    "steps": {
      "validate_order": {
        "status": "COMPLETED",
        "output": {
          "isValid": true,
          "validatedItems": [
            // Validated items
          ]
        },
        "completedAt": "2023-08-01T15:46:00Z"
      },
      "process_payment": {
        "status": "COMPLETED",
        "output": {
          "paymentId": "PAY-9876",
          "status": "authorized",
          "transactionId": "TXN-5678"
        },
        "completedAt": "2023-08-01T15:47:30Z"
      },
      "ship_order": {
        "status": "COMPLETED",
        "output": {
          "shipmentId": "SHIP-5678",
          "estimatedDelivery": "2023-08-05T00:00:00Z",
          "trackingNumber": "TRK-ABC123"
        },
        "completedAt": "2023-08-01T15:49:00Z"
      },
      "notify_customer_success": {
        "status": "COMPLETED",
        "output": {
          "notificationId": "NOTIF-XYZ789",
          "channel": "email",
          "sentAt": "2023-08-01T15:50:00Z"
        },
        "completedAt": "2023-08-01T15:50:00Z"
      }
    }
  },
  "startedAt": "2023-08-01T15:45:30Z",
  "updatedAt": "2023-08-01T15:50:00Z",
  "completedAt": "2023-08-01T15:50:00Z"
}
```

## API Usage Examples

### Starting the Workflow

```bash
curl -X POST "http://workflow-orchestrator/api/v1/workflows/instances" \
  -H "Content-Type: application/json" \
  -d '{
    "definitionId": "order-processing-wf",
    "input": {
      "orderId": "ORD-12345",
      "customerId": "CUST-789",
      "totalAmount": 99.99,
      "currency": "USD",
      "items": [
        {
          "productId": "PROD-001",
          "name": "Wireless Headphones",
          "quantity": 1,
          "price": 79.99
        },
        {
          "productId": "PROD-002",
          "name": "Phone Case",
          "quantity": 1,
          "price": 19.99
        }
      ],
      "shippingAddress": {
        "street": "123 Main St",
        "city": "Anytown",
        "state": "CA",
        "zipCode": "12345",
        "country": "USA"
      }
    },
    "correlationId": "ORD-12345"
  }'
```

### Canceling the Workflow

```bash
curl -X POST "http://workflow-orchestrator/api/v1/workflows/instances/wf-inst-abcd1234/cancel" \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "Customer requested cancellation",
    "shouldCompensate": true
  }'
```

### Checking Workflow Status

```bash
curl -X GET "http://workflow-orchestrator/api/v1/workflows/instances/wf-inst-abcd1234"
```


