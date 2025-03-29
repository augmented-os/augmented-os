# Basic Task Execution Examples

This document provides simple examples of how to use the Task Execution Service for common use cases.

## Automated Task Example

The following example illustrates a basic automated task that:

1. Receives order data as input
2. Calculates order totals including taxes
3. Returns the calculated totals as output

### Task Definition

```json
{
  "id": "calculate-order-total",
  "name": "Calculate Order Total",
  "description": "Calculates the total price of an order including taxes",
  "type": "AUTOMATED",
  "version": "1.0.0",
  "inputSchema": {
    "type": "object",
    "properties": {
      "orderId": {
        "type": "string",
        "description": "Order identifier"
      },
      "items": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "id": { "type": "string" },
            "quantity": { "type": "number" },
            "price": { "type": "number" }
          },
          "required": ["id", "quantity", "price"]
        }
      },
      "taxRate": {
        "type": "number",
        "description": "Tax rate as a decimal (e.g., 0.08 for 8%)"
      }
    },
    "required": ["orderId", "items", "taxRate"]
  },
  "outputSchema": {
    "type": "object",
    "properties": {
      "orderId": { "type": "string" },
      "subtotal": { "type": "number" },
      "tax": { "type": "number" },
      "total": { "type": "number" }
    },
    "required": ["orderId", "subtotal", "tax", "total"]
  },
  "timeout": 60000,
  "retryPolicy": {
    "maxRetries": 3,
    "retryInterval": 60000,
    "backoffMultiplier": 2
  },
  "executionConfig": {
    "executor": "standard-executor",
    "securityContext": {
      "securityLevel": "LOW"
    },
    "resourceRequirements": {
      "cpu": "0.1",
      "memory": "128Mi",
      "timeoutSeconds": 60
    }
  }
}
```

### Task Submission

#### API Request

```bash
curl -X POST https://api.example.com/api/v1/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [your-token]" \
  -d '{
    "taskDefinitionId": "calculate-order-total",
    "workflowInstanceId": "order-workflow-123",
    "input": {
      "orderId": "ORD-123",
      "items": [
        {"id": "ITEM-1", "quantity": 2, "price": 10.99},
        {"id": "ITEM-2", "quantity": 1, "price": 24.99}
      ],
      "taxRate": 0.08
    },
    "priority": "MEDIUM"
  }'
```

#### Response

```json
{
  "id": "task-123456",
  "status": "PENDING",
  "createdAt": "2023-07-15T14:30:00Z"
}
```

### Task Execution

The Task Execution Service will:

1. Validate the input against the task definition's input schema
2. Route the task to the appropriate executor (standard-executor in this case)
3. Execute the task in an isolated environment
4. Validate the output against the output schema
5. Store the task result

### Task Result

#### API Request

```bash
curl -X GET https://api.example.com/api/v1/tasks/task-123456 \
  -H "Authorization: Bearer [your-token]"
```

#### Response

```json
{
  "id": "task-123456",
  "taskDefinitionId": "calculate-order-total",
  "workflowInstanceId": "order-workflow-123",
  "status": "COMPLETED",
  "type": "AUTOMATED",
  "input": {
    "orderId": "ORD-123",
    "items": [
      {"id": "ITEM-1", "quantity": 2, "price": 10.99},
      {"id": "ITEM-2", "quantity": 1, "price": 24.99}
    ],
    "taxRate": 0.08
  },
  "output": {
    "orderId": "ORD-123",
    "subtotal": 46.97,
    "tax": 3.76,
    "total": 50.73
  },
  "executionMetadata": {
    "startTime": "2023-07-15T14:30:05Z",
    "endTime": "2023-07-15T14:30:07Z",
    "duration": 2000,
    "executionEnvironment": "standard-executor-pod-123"
  },
  "createdAt": "2023-07-15T14:30:00Z",
  "updatedAt": "2023-07-15T14:30:07Z"
}
```

## Manual Task Example

The following example illustrates a manual task that:

1. Creates a task for human review of an order
2. Waits for a human operator to approve or reject the order
3. Returns the approval decision as output

### Task Definition

```json
{
  "id": "review-high-value-order",
  "name": "Review High Value Order",
  "description": "Manual review of high-value orders for fraud prevention",
  "type": "MANUAL",
  "version": "1.0.0",
  "inputSchema": {
    "type": "object",
    "properties": {
      "orderId": { "type": "string" },
      "customerId": { "type": "string" },
      "orderValue": { "type": "number" },
      "items": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "id": { "type": "string" },
            "name": { "type": "string" },
            "quantity": { "type": "number" },
            "price": { "type": "number" }
          }
        }
      },
      "customerHistory": {
        "type": "object",
        "properties": {
          "previousOrders": { "type": "number" },
          "averageOrderValue": { "type": "number" },
          "accountAgeInDays": { "type": "number" }
        }
      }
    },
    "required": ["orderId", "customerId", "orderValue", "items"]
  },
  "outputSchema": {
    "type": "object",
    "properties": {
      "approved": { "type": "boolean" },
      "reason": { "type": "string" },
      "reviewedBy": { "type": "string" }
    },
    "required": ["approved", "reviewedBy"]
  },
  "timeout": 86400000, // 24 hours
  "executionConfig": {
    "executor": "manual-task-handler",
    "assignmentRules": {
      "role": "order-reviewer",
      "region": "${order.region}"
    }
  }
}
```

### Task Submission

#### API Request

```bash
curl -X POST https://api.example.com/api/v1/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [your-token]" \
  -d '{
    "taskDefinitionId": "review-high-value-order",
    "workflowInstanceId": "order-workflow-456",
    "input": {
      "orderId": "ORD-456",
      "customerId": "CUST-789",
      "orderValue": 1250.00,
      "items": [
        {"id": "ITEM-10", "name": "Premium Headphones", "quantity": 1, "price": 350.00},
        {"id": "ITEM-20", "name": "Smartphone", "quantity": 1, "price": 900.00}
      ],
      "customerHistory": {
        "previousOrders": 2,
        "averageOrderValue": 150.00,
        "accountAgeInDays": 45
      }
    },
    "priority": "HIGH"
  }'
```

### Manual Task Handling

The Task Execution Service will:

1. Create a manual task and assign it based on the assignment rules
2. Make the task available in the user interface for the assigned role
3. Send notifications to eligible reviewers
4. Wait for a human operator to complete the task
5. Store the task result once completed

### Task Completion (by human operator)

#### API Request (made by the UI on behalf of the operator)

```bash
curl -X POST https://api.example.com/api/v1/tasks/task-456789/complete \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [operator-token]" \
  -d '{
    "output": {
      "approved": true,
      "reason": "Customer history verified, order items consistent with previous purchases",
      "reviewedBy": "operator-123"
    }
  }'
```

#### Response

```json
{
  "id": "task-456789",
  "status": "COMPLETED",
  "updatedAt": "2023-07-15T16:45:22Z"
}
```

## Integration Task Example

The following example illustrates an integration task that:

1. Connects to a payment gateway
2. Processes a payment
3. Returns the payment result

This example demonstrates how the Task Execution Service integrates with external systems.

### Task Definition

```json
{
  "id": "process-payment",
  "name": "Process Payment",
  "description": "Process payment through payment gateway",
  "type": "INTEGRATION",
  "version": "1.0.0",
  "inputSchema": {
    "type": "object",
    "properties": {
      "orderId": { "type": "string" },
      "amount": { "type": "number" },
      "currency": { "type": "string" },
      "paymentMethod": {
        "type": "object",
        "properties": {
          "type": { "type": "string", "enum": ["CREDIT_CARD", "PAYPAL", "BANK_TRANSFER"] },
          "details": { "type": "object" }
        },
        "required": ["type", "details"]
      }
    },
    "required": ["orderId", "amount", "currency", "paymentMethod"]
  },
  "outputSchema": {
    "type": "object",
    "properties": {
      "transactionId": { "type": "string" },
      "status": { "type": "string", "enum": ["APPROVED", "DECLINED", "ERROR"] },
      "message": { "type": "string" },
      "processingTime": { "type": "number" }
    },
    "required": ["transactionId", "status"]
  },
  "timeout": 120000,
  "retryPolicy": {
    "maxRetries": 3,
    "retryInterval": 30000,
    "backoffMultiplier": 2,
    "retryableErrors": ["GATEWAY_TIMEOUT", "CONNECTION_ERROR"]
  },
  "executionConfig": {
    "executor": "integration-executor",
    "integration": {
      "type": "PAYMENT_GATEWAY",
      "provider": "stripe",
      "apiVersion": "2023-01-01"
    },
    "securityContext": {
      "securityLevel": "HIGH"
    }
  }
}
```

This example demonstrates the three main types of tasks supported by the Task Execution Service and how they can be defined, submitted, and processed. 