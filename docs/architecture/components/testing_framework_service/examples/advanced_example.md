# Testing Framework Service Advanced Examples

This document provides advanced examples for using the Testing Framework Service in complex testing scenarios.

## Test Suites

Test suites allow you to group related tests and execute them together. This section demonstrates how to create and manage test suites.

### Creating a Test Suite

```http
POST /testing/test-suites
Content-Type: application/json
Authorization: Bearer <your_token>

{
  "name": "User Management Suite",
  "description": "End-to-end tests for user management functionality",
  "tags": ["user-management", "critical-path", "regression"],
  "tests": [
    {
      "test_id": "test-123456",
      "order": 1
    },
    {
      "test_id": "test-234567",
      "order": 2,
      "parameters": {
        "timeout": 60000
      }
    },
    {
      "test_id": "test-345678",
      "order": 3,
      "depends_on": ["test-123456", "test-234567"]
    }
  ]
}
```

### Test Suite Response

```http
HTTP/1.1 201 Created
Content-Type: application/json

{
  "id": "suite-123456",
  "name": "User Management Suite",
  "description": "End-to-end tests for user management functionality",
  "tags": ["user-management", "critical-path", "regression"],
  "tests": [
    {
      "test_id": "test-123456",
      "name": "User Registration Workflow Test",
      "order": 1,
      "depends_on": []
    },
    {
      "test_id": "test-234567",
      "name": "User Login Test",
      "order": 2,
      "parameters": {
        "timeout": 60000
      },
      "depends_on": []
    },
    {
      "test_id": "test-345678",
      "name": "User Profile Update Test",
      "order": 3,
      "depends_on": ["test-123456", "test-234567"]
    }
  ],
  "created_at": "2023-06-15T14:00:00Z",
  "updated_at": "2023-06-15T14:00:00Z",
  "created_by": "user-789012"
}
```

### Executing a Test Suite

```http
POST /testing/test-suites/suite-123456/execute
Content-Type: application/json
Authorization: Bearer <your_token>

{
  "environment": "staging",
  "parameters": {
    "global_timeout": 300000,
    "abort_on_failure": false
  }
}
```

### Test Suite Execution Response

```http
HTTP/1.1 202 Accepted
Content-Type: application/json

{
  "suite_execution_id": "suite-exec-123456",
  "suite_id": "suite-123456",
  "status": "pending",
  "environment": "staging",
  "parameters": {
    "global_timeout": 300000,
    "abort_on_failure": false
  },
  "test_executions": [],
  "created_at": "2023-06-15T14:15:00Z",
  "created_by": "user-789012"
}
```

### Getting Test Suite Execution Status

```http
GET /testing/test-suites/suite-123456/executions/suite-exec-123456
Authorization: Bearer <your_token>
```

### Test Suite Execution Status Response

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "suite_execution_id": "suite-exec-123456",
  "suite_id": "suite-123456",
  "status": "running",
  "start_time": "2023-06-15T14:15:05Z",
  "environment": "staging",
  "parameters": {
    "global_timeout": 300000,
    "abort_on_failure": false
  },
  "test_executions": [
    {
      "execution_id": "exec-123456",
      "test_id": "test-123456",
      "status": "completed",
      "success": true,
      "start_time": "2023-06-15T14:15:10Z",
      "end_time": "2023-06-15T14:15:25Z"
    },
    {
      "execution_id": "exec-234567",
      "test_id": "test-234567",
      "status": "running",
      "start_time": "2023-06-15T14:15:30Z"
    }
  ],
  "created_at": "2023-06-15T14:15:00Z",
  "created_by": "user-789012"
}
```

### Test Suite Execution Completed Response

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "suite_execution_id": "suite-exec-123456",
  "suite_id": "suite-123456",
  "status": "completed",
  "start_time": "2023-06-15T14:15:05Z",
  "end_time": "2023-06-15T14:16:45Z",
  "duration_ms": 100000,
  "environment": "staging",
  "parameters": {
    "global_timeout": 300000,
    "abort_on_failure": false
  },
  "test_executions": [
    {
      "execution_id": "exec-123456",
      "test_id": "test-123456",
      "name": "User Registration Workflow Test",
      "status": "completed",
      "success": true,
      "start_time": "2023-06-15T14:15:10Z",
      "end_time": "2023-06-15T14:15:25Z",
      "duration_ms": 15000
    },
    {
      "execution_id": "exec-234567",
      "test_id": "test-234567",
      "name": "User Login Test",
      "status": "completed",
      "success": true,
      "start_time": "2023-06-15T14:15:30Z",
      "end_time": "2023-06-15T14:16:00Z",
      "duration_ms": 30000
    },
    {
      "execution_id": "exec-345678",
      "test_id": "test-345678",
      "name": "User Profile Update Test",
      "status": "completed",
      "success": true,
      "start_time": "2023-06-15T14:16:05Z",
      "end_time": "2023-06-15T14:16:40Z",
      "duration_ms": 35000
    }
  ],
  "summary": {
    "total": 3,
    "passed": 3,
    "failed": 0,
    "skipped": 0,
    "success_rate": 100.0
  },
  "created_at": "2023-06-15T14:15:00Z",
  "created_by": "user-789012"
}
```

## Organizing Tests with Tags and Metadata

### Creating a Test with Rich Metadata

```http
POST /testing/test-definitions
Content-Type: application/json
Authorization: Bearer <your_token>

{
  "name": "User Permission Check Test",
  "description": "Validates the user permission system",
  "type": "system",
  "target_id": "system-permissions",
  "target_type": "system",
  "tags": ["permissions", "security", "system", "rbac"],
  "metadata": {
    "criticality": "high",
    "owner": "security-team",
    "review_date": "2023-05-15",
    "review_status": "approved",
    "documentation_links": [
      "https://internal-docs.augmented-os.com/security/permissions-model",
      "https://internal-docs.augmented-os.com/testing/security-tests"
    ],
    "related_requirements": ["SEC-001", "SEC-002", "SEC-007"]
  },
  "test_script": {
    "inputs": {
      "userId": "test-user-456",
      "resourceId": "protected-resource-789",
      "permissionLevel": "read"
    },
    "assertions": [
      {
        "type": "status",
        "expected": "completed"
      },
      {
        "type": "output",
        "path": "$.accessGranted",
        "operator": "equals",
        "expected": true
      },
      {
        "type": "output",
        "path": "$.auditLog.recorded",
        "operator": "equals",
        "expected": true
      }
    ]
  },
  "parameters": {
    "timeout": 15000
  }
}
```

## Advanced Test Dependencies

Test dependencies allow for defining complex relationships between tests. This section demonstrates advanced dependency configurations.

### Creating a Complex Dependency Chain

```http
POST /testing/test-suites
Content-Type: application/json
Authorization: Bearer <your_token>

{
  "name": "E-Commerce Order Flow Suite",
  "description": "End-to-end tests for the order placement and fulfillment flow",
  "tags": ["e-commerce", "order", "critical-path"],
  "tests": [
    {
      "test_id": "test-product-catalog",
      "order": 1,
      "name": "Product Catalog Availability"
    },
    {
      "test_id": "test-shopping-cart",
      "order": 2,
      "depends_on": ["test-product-catalog"],
      "name": "Shopping Cart Functionality"
    },
    {
      "test_id": "test-checkout-process",
      "order": 3,
      "depends_on": ["test-shopping-cart"],
      "name": "Checkout Process"
    },
    {
      "test_id": "test-payment-processing",
      "order": 4,
      "depends_on": ["test-checkout-process"],
      "name": "Payment Processing"
    },
    {
      "test_id": "test-order-confirmation",
      "order": 5,
      "depends_on": ["test-payment-processing"],
      "name": "Order Confirmation"
    },
    {
      "test_id": "test-inventory-update",
      "order": 6,
      "depends_on": ["test-order-confirmation"],
      "name": "Inventory Update"
    },
    {
      "test_id": "test-shipping-notification",
      "order": 7,
      "depends_on": ["test-inventory-update"],
      "name": "Shipping Notification"
    }
  ]
}
```

### Parallel Test Execution with Dependencies

```http
POST /testing/test-suites
Content-Type: application/json
Authorization: Bearer <your_token>

{
  "name": "User Activity Analytics Suite",
  "description": "Tests for the user activity analytics system",
  "tags": ["analytics", "performance"],
  "parallel_execution": true,
  "tests": [
    {
      "test_id": "test-data-collection",
      "order": 1,
      "name": "Activity Data Collection"
    },
    {
      "test_id": "test-real-time-processing",
      "order": 2,
      "depends_on": ["test-data-collection"],
      "name": "Real-time Data Processing"
    },
    {
      "test_id": "test-batch-processing",
      "order": 2,
      "depends_on": ["test-data-collection"],
      "name": "Batch Data Processing"
    },
    {
      "test_id": "test-dashboard-updates",
      "order": 3,
      "depends_on": ["test-real-time-processing"],
      "name": "Dashboard Real-time Updates"
    },
    {
      "test_id": "test-report-generation",
      "order": 3,
      "depends_on": ["test-batch-processing"],
      "name": "Report Generation"
    },
    {
      "test_id": "test-alerting-system",
      "order": 4,
      "depends_on": ["test-real-time-processing", "test-dashboard-updates"],
      "name": "Alerting System"
    },
    {
      "test_id": "test-data-export",
      "order": 4,
      "depends_on": ["test-batch-processing", "test-report-generation"],
      "name": "Data Export Functionality"
    }
  ]
}
```

## Parameterized Testing

Parameterized testing allows running the same test with different inputs. This section demonstrates parameterized test configurations.

### Creating a Parameterized Test

```http
POST /testing/test-definitions
Content-Type: application/json
Authorization: Bearer <your_token>

{
  "name": "Payment Method Validation Test",
  "description": "Validates payment processing with different payment methods",
  "type": "integration",
  "target_id": "integration-payment-processing",
  "target_type": "integration",
  "tags": ["payment", "parameterized"],
  "test_script": {
    "inputs": {
      "amount": 100.00,
      "currency": "USD",
      "paymentMethod": "${PAYMENT_METHOD}",
      "paymentDetails": "${PAYMENT_DETAILS}"
    },
    "assertions": [
      {
        "type": "status",
        "expected": "completed"
      },
      {
        "type": "output",
        "path": "$.transactionId",
        "operator": "exists"
      },
      {
        "type": "output",
        "path": "$.status",
        "operator": "equals",
        "expected": "approved"
      }
    ]
  },
  "parameters": {
    "timeout": 20000
  }
}
```

### Executing a Parameterized Test with Different Values

```http
POST /testing/test-executions
Content-Type: application/json
Authorization: Bearer <your_token>

{
  "test_id": "test-payment-validation",
  "parameters": {
    "environment": "staging",
    "variables": {
      "PAYMENT_METHOD": "credit_card",
      "PAYMENT_DETAILS": {
        "cardNumber": "4111111111111111",
        "expiryMonth": "12",
        "expiryYear": "2025",
        "cvv": "123"
      }
    }
  }
}
```

```http
POST /testing/test-executions
Content-Type: application/json
Authorization: Bearer <your_token>

{
  "test_id": "test-payment-validation",
  "parameters": {
    "environment": "staging",
    "variables": {
      "PAYMENT_METHOD": "paypal",
      "PAYMENT_DETAILS": {
        "email": "customer@example.com",
        "token": "pp-test-token-123456"
      }
    }
  }
}
```

```http
POST /testing/test-executions
Content-Type: application/json
Authorization: Bearer <your_token>

{
  "test_id": "test-payment-validation",
  "parameters": {
    "environment": "staging",
    "variables": {
      "PAYMENT_METHOD": "bank_transfer",
      "PAYMENT_DETAILS": {
        "accountNumber": "123456789",
        "routingNumber": "987654321",
        "accountName": "Test Account"
      }
    }
  }
}
```

## Environment-Specific Testing

This section demonstrates how to handle environment-specific test configurations.

### Creating an Environment-Aware Test

```http
POST /testing/test-definitions
Content-Type: application/json
Authorization: Bearer <your_token>

{
  "name": "Database Connection Test",
  "description": "Validates database connectivity and performance",
  "type": "integration",
  "target_id": "database-service",
  "target_type": "integration",
  "tags": ["database", "connectivity", "performance"],
  "test_script": {
    "inputs": {
      "connectionString": "${ENV.DATABASE_CONNECTION_STRING}",
      "query": "SELECT COUNT(*) FROM users",
      "timeout": 5000
    },
    "assertions": [
      {
        "type": "status",
        "expected": "completed"
      },
      {
        "type": "output",
        "path": "$.connected",
        "operator": "equals",
        "expected": true
      },
      {
        "type": "output",
        "path": "$.executionTime",
        "operator": "lessThan",
        "expected": "${ENV.MAX_QUERY_TIME}"
      }
    ]
  },
  "parameters": {
    "timeout": 30000,
    "env_variables": {
      "development": {
        "DATABASE_CONNECTION_STRING": "postgres://dev_user:password@localhost:5432/dev_db",
        "MAX_QUERY_TIME": 1000
      },
      "staging": {
        "DATABASE_CONNECTION_STRING": "postgres://stg_user:password@staging-db:5432/stg_db",
        "MAX_QUERY_TIME": 500
      },
      "production": {
        "DATABASE_CONNECTION_STRING": "postgres://prod_user:password@production-db-cluster:5432/prod_db",
        "MAX_QUERY_TIME": 200
      }
    }
  }
}
```

### Executing Tests with Environment-Specific Values

```http
POST /testing/test-executions
Content-Type: application/json
Authorization: Bearer <your_token>

{
  "test_id": "test-database-connection",
  "parameters": {
    "environment": "staging",
    "variables": {
      "ADDITIONAL_QUERY_PARAM": "WITH_INDEX"
    }
  }
}
```

## Advanced Assertions and Validations

The Testing Framework Service supports complex validation patterns for sophisticated testing scenarios.

### Compound Assertions

You can use compound assertions to create complex validation rules.

```http
POST /testing/test-definitions
Content-Type: application/json
Authorization: Bearer <your_token>

{
  "name": "User Recommendation Algorithm Test",
  "description": "Tests the recommendation engine's output quality",
  "type": "system",
  "target_id": "recommendation-engine",
  "target_type": "system",
  "tags": ["recommendations", "algorithm", "quality"],
  "test_script": {
    "inputs": {
      "userId": "user-123456",
      "context": "homepage",
      "limit": 10
    },
    "assertions": [
      {
        "type": "status",
        "expected": "completed"
      },
      {
        "type": "compound",
        "operator": "and",
        "assertions": [
          {
            "type": "output",
            "path": "$.recommendations",
            "operator": "type",
            "expected": "array"
          },
          {
            "type": "output",
            "path": "$.recommendations",
            "operator": "arrayLength",
            "expected": 10
          }
        ]
      },
      {
        "type": "compound",
        "operator": "or",
        "assertions": [
          {
            "type": "output",
            "path": "$.recommendationQuality",
            "operator": "greaterThan",
            "expected": 0.8
          },
          {
            "type": "output",
            "path": "$.fallbackUsed",
            "operator": "equals",
            "expected": true
          }
        ]
      }
    ]
  }
}
```

### Schema Validation

You can validate the structure of the output using JSON Schema.

```http
POST /testing/test-definitions
Content-Type: application/json
Authorization: Bearer <your_token>

{
  "name": "API Response Schema Test",
  "description": "Validates that the API response conforms to the expected schema",
  "type": "api",
  "target_id": "user-api",
  "target_type": "api",
  "tags": ["schema", "validation", "api"],
  "test_script": {
    "inputs": {
      "endpoint": "/api/users",
      "method": "GET",
      "headers": {
        "Accept": "application/json"
      }
    },
    "assertions": [
      {
        "type": "status",
        "expected": "completed"
      },
      {
        "type": "schema",
        "schema": {
          "type": "object",
          "required": ["users", "pagination"],
          "properties": {
            "users": {
              "type": "array",
              "items": {
                "type": "object",
                "required": ["id", "username", "email"],
                "properties": {
                  "id": { "type": "string" },
                  "username": { "type": "string" },
                  "email": { "type": "string", "format": "email" },
                  "createdAt": { "type": "string", "format": "date-time" },
                  "status": { "type": "string", "enum": ["active", "inactive", "suspended"] }
                }
              }
            },
            "pagination": {
              "type": "object",
              "required": ["total", "page", "perPage", "pages"],
              "properties": {
                "total": { "type": "integer" },
                "page": { "type": "integer" },
                "perPage": { "type": "integer" },
                "pages": { "type": "integer" }
              }
            }
          }
        }
      }
    ]
  }
}
```

### Statistical Assertions

For performance and load testing, you can use statistical assertions.

```http
POST /testing/test-definitions
Content-Type: application/json
Authorization: Bearer <your_token>

{
  "name": "API Performance Test",
  "description": "Validates the performance characteristics of the API",
  "type": "performance",
  "target_id": "search-api",
  "target_type": "api",
  "tags": ["performance", "load-test", "api"],
  "test_script": {
    "inputs": {
      "endpoint": "/api/search",
      "method": "GET",
      "params": {
        "q": "test query",
        "limit": 20
      },
      "concurrentUsers": 50,
      "duration": 60,
      "rampUpPeriod": 10
    },
    "assertions": [
      {
        "type": "status",
        "expected": "completed"
      },
      {
        "type": "stats",
        "metric": "responseTime",
        "percentile": 95,
        "operator": "lessThan",
        "expected": 500
      },
      {
        "type": "stats",
        "metric": "throughput",
        "operator": "greaterThan",
        "expected": 100
      },
      {
        "type": "stats",
        "metric": "errorRate",
        "operator": "lessThan",
        "expected": 0.01
      }
    ]
  },
  "parameters": {
    "timeout": 120000
  }
}
```

## Test Hooks and Middleware

Test hooks and middleware allow you to perform actions before, during, and after test execution.

### Defining Test Hooks

```http
POST /testing/test-definitions
Content-Type: application/json
Authorization: Bearer <your_token>

{
  "name": "User Deletion Test with Database Cleanup",
  "description": "Tests user deletion with proper setup and cleanup",
  "type": "integration",
  "target_id": "user-service",
  "target_type": "service",
  "tags": ["user", "deletion", "cleanup"],
  "hooks": {
    "before": [
      {
        "name": "Create Test User",
        "action": {
          "type": "http",
          "method": "POST",
          "url": "${ENV.API_URL}/users",
          "headers": {
            "Content-Type": "application/json",
            "Authorization": "Bearer ${ENV.API_TOKEN}"
          },
          "body": {
            "username": "test-user-${TIMESTAMP}",
            "email": "test-${TIMESTAMP}@example.com",
            "password": "TestPassword123!"
          },
          "export": {
            "userId": "$.id",
            "username": "$.username"
          }
        }
      },
      {
        "name": "Create User Data",
        "action": {
          "type": "http",
          "method": "POST",
          "url": "${ENV.API_URL}/users/${userId}/data",
          "headers": {
            "Content-Type": "application/json",
            "Authorization": "Bearer ${ENV.API_TOKEN}"
          },
          "body": {
            "key": "test-data",
            "value": "Test data content"
          }
        }
      }
    ],
    "after": [
      {
        "name": "Verify Database Cleanup",
        "action": {
          "type": "database",
          "connection": "${ENV.DB_CONNECTION_STRING}",
          "query": "SELECT COUNT(*) as count FROM users WHERE id = ?",
          "parameters": ["${userId}"],
          "assert": {
            "$.count": 0
          }
        }
      },
      {
        "name": "Verify User Data Cleanup",
        "action": {
          "type": "database",
          "connection": "${ENV.DB_CONNECTION_STRING}",
          "query": "SELECT COUNT(*) as count FROM user_data WHERE user_id = ?",
          "parameters": ["${userId}"],
          "assert": {
            "$.count": 0
          }
        }
      }
    ],
    "onFailure": [
      {
        "name": "Cleanup on Failure",
        "action": {
          "type": "http",
          "method": "DELETE",
          "url": "${ENV.API_URL}/users/${userId}",
          "headers": {
            "Authorization": "Bearer ${ENV.API_TOKEN}"
          }
        }
      }
    ]
  },
  "test_script": {
    "inputs": {
      "userId": "${userId}"
    },
    "assertions": [
      {
        "type": "status",
        "expected": "completed"
      },
      {
        "type": "output",
        "path": "$.success",
        "operator": "equals",
        "expected": true
      },
      {
        "type": "output",
        "path": "$.message",
        "operator": "equals",
        "expected": "User successfully deleted"
      }
    ]
  }
}
```

### Test Middleware for Logging and Monitoring

```http
POST /testing/middleware
Content-Type: application/json
Authorization: Bearer <your_token>

{
  "name": "Performance Monitoring Middleware",
  "description": "Collects performance metrics during test execution",
  "enabled": true,
  "global": true,
  "phases": ["before", "after", "onError"],
  "middleware": {
    "before": {
      "script": "function before(context) { context.startTime = Date.now(); return context; }"
    },
    "after": {
      "script": "function after(context, result) { context.executionTime = Date.now() - context.startTime; console.log('Test execution time: ' + context.executionTime + 'ms'); return result; }"
    },
    "onError": {
      "script": "function onError(context, error) { console.error('Test failed after ' + (Date.now() - context.startTime) + 'ms:', error); return error; }"
    }
  },
  "tags": ["performance", "monitoring"]
}
```

## Mock Service Integration

The Testing Framework Service supports integration with mock services for isolated testing.

### Creating a Mock Service Configuration

```http
POST /testing/mocks
Content-Type: application/json
Authorization: Bearer <your_token>

{
  "name": "Payment Gateway Mock",
  "description": "Mock service for payment gateway integration testing",
  "baseUrl": "http://mock-payment-gateway.internal:3000",
  "endpoints": [
    {
      "path": "/api/payments/process",
      "method": "POST",
      "responses": [
        {
          "name": "Successful Payment",
          "default": true,
          "status": 200,
          "headers": {
            "Content-Type": "application/json"
          },
          "body": {
            "transaction_id": "mock-txn-${TIMESTAMP}",
            "status": "approved",
            "amount": "${REQUEST.body.amount}",
            "currency": "${REQUEST.body.currency}",
            "payment_method": "${REQUEST.body.payment_method}",
            "timestamp": "${TIMESTAMP_ISO}"
          }
        },
        {
          "name": "Insufficient Funds",
          "status": 400,
          "headers": {
            "Content-Type": "application/json"
          },
          "body": {
            "error": "insufficient_funds",
            "error_description": "The payment method has insufficient funds",
            "transaction_id": "mock-txn-${TIMESTAMP}",
            "timestamp": "${TIMESTAMP_ISO}"
          },
          "conditions": [
            {
              "field": "REQUEST.body.amount",
              "operator": "greaterThan",
              "value": 1000
            }
          ]
        },
        {
          "name": "Internal Error",
          "status": 500,
          "headers": {
            "Content-Type": "application/json"
          },
          "body": {
            "error": "internal_error",
            "error_description": "The payment gateway is experiencing technical difficulties",
            "transaction_id": "mock-txn-${TIMESTAMP}",
            "timestamp": "${TIMESTAMP_ISO}"
          },
          "probability": 0.05
        }
      ]
    },
    {
      "path": "/api/payments/:transaction_id",
      "method": "GET",
      "responses": [
        {
          "name": "Payment Details",
          "default": true,
          "status": 200,
          "headers": {
            "Content-Type": "application/json"
          },
          "body": {
            "transaction_id": "${REQUEST.params.transaction_id}",
            "status": "approved",
            "amount": 100.00,
            "currency": "USD",
            "payment_method": "credit_card",
            "timestamp": "${TIMESTAMP_ISO}",
            "details": {
              "card_type": "Visa",
              "last_four": "1111"
            }
          }
        },
        {
          "name": "Payment Not Found",
          "status": 404,
          "headers": {
            "Content-Type": "application/json"
          },
          "body": {
            "error": "not_found",
            "error_description": "The specified transaction was not found",
            "timestamp": "${TIMESTAMP_ISO}"
          },
          "conditions": [
            {
              "field": "REQUEST.params.transaction_id",
              "operator": "matches",
              "value": "^not-found"
            }
          ]
        }
      ]
    }
  ]
}
```

### Using Mock Services in Tests

```http
POST /testing/test-definitions
Content-Type: application/json
Authorization: Bearer <your_token>

{
  "name": "Payment Processing with Mock Gateway",
  "description": "Tests payment processing flow using mock payment gateway",
  "type": "integration",
  "target_id": "payment-service",
  "target_type": "service",
  "tags": ["payment", "mock"],
  "mocks": ["payment-gateway-mock"],
  "test_script": {
    "inputs": {
      "amount": 50.00,
      "currency": "USD",
      "paymentMethod": "credit_card",
      "paymentDetails": {
        "cardNumber": "4111111111111111",
        "expiryMonth": "12",
        "expiryYear": "2025",
        "cvv": "123"
      },
      "customerId": "customer-123456"
    },
    "assertions": [
      {
        "type": "status",
        "expected": "completed"
      },
      {
        "type": "output",
        "path": "$.orderId",
        "operator": "exists"
      },
      {
        "type": "output",
        "path": "$.paymentStatus",
        "operator": "equals",
        "expected": "approved"
      },
      {
        "type": "output",
        "path": "$.receiptUrl",
        "operator": "exists"
      }
    ]
  }
}
```

### Recording and Replaying API Interactions

```http
POST /testing/record-session
Content-Type: application/json
Authorization: Bearer <your_token>

{
  "name": "Payment Gateway Interactions",
  "target": {
    "baseUrl": "https://api.payment-gateway.com",
    "headers": {
      "Authorization": "Bearer ${PAYMENT_GATEWAY_TOKEN}"
    }
  },
  "paths": [
    "/api/payments/process",
    "/api/payments/*/status"
  ],
  "sanitizeRules": [
    {
      "fields": ["$.cardNumber", "$.cvv"],
      "action": "mask",
      "maskWith": "****"
    }
  ],
  "duration": 3600
}
```

```http
POST /testing/create-mock-from-recording
Content-Type: application/json
Authorization: Bearer <your_token>

{
  "recordingId": "recording-123456",
  "name": "Payment Gateway Mock from Recording",
  "description": "Mock service created from recorded interactions with the payment gateway",
  "baseUrl": "http://mock-payment-gateway.internal:3000",
  "transformations": [
    {
      "path": "$.timestamp",
      "action": "dynamic",
      "value": "${TIMESTAMP_ISO}"
    },
    {
      "path": "$.transaction_id",
      "action": "dynamic",
      "value": "mock-txn-${TIMESTAMP}"
    }
  ]
}
```

## Continuous Integration Setup

The Testing Framework Service integrates with CI/CD pipelines to enable automated testing workflows.

### Creating a CI Configuration

```http
POST /testing/ci-configurations
Content-Type: application/json
Authorization: Bearer <your_token>

{
  "name": "API Testing Pipeline",
  "description": "Configuration for API testing in the CI pipeline",
  "ci_system": "github_actions",
  "repository": "org/repository-name",
  "branch_patterns": ["main", "feature/*", "release/*"],
  "workflow_trigger": {
    "type": "push",
    "exclude_paths": ["docs/**", "*.md"]
  },
  "environment_mappings": {
    "main": "staging",
    "feature/*": "development",
    "release/*": "pre-production"
  },
  "notification_settings": {
    "on_failure": ["slack", "email"],
    "on_success": ["slack"],
    "channels": {
      "slack": "#testing-alerts",
      "email": ["team@example.com"]
    }
  }
}
```

### CI Integration Configuration Example

The following example shows a GitHub Actions workflow configuration for the Testing Framework Service:

```yaml
name: API Testing

on:
  push:
    branches: [main, feature/*, release/*]
    paths-ignore:
      - 'docs/**'
      - '*.md'
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Determine environment
        id: environment
        run: |
          if [[ $GITHUB_REF == refs/heads/main ]]; then
            echo "environment=staging" >> $GITHUB_ENV
          elif [[ $GITHUB_REF == refs/heads/release/* ]]; then
            echo "environment=pre-production" >> $GITHUB_ENV
          else
            echo "environment=development" >> $GITHUB_ENV
          fi

      - name: Run API Tests
        id: run_tests
        uses: augmented-os/testing-framework-action@v1
        with:
          api_key: ${{ secrets.TESTING_FRAMEWORK_API_KEY }}
          test_suite_id: "suite-api-tests"
          environment: ${{ env.environment }}
          fail_on_error: true
          timeout: 600
          parallel: true
          report_format: "github-summary,html,json"
          
      - name: Upload Test Results
        if: always()
        uses: actions/upload-artifact@v2
        with:
          name: test-results
          path: ${{ steps.run_tests.outputs.report_path }}
          
      - name: Post Test Summary
        if: always()
        uses: augmented-os/testing-framework-report-action@v1
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          test_run_id: ${{ steps.run_tests.outputs.test_run_id }}
          comment_on_pr: true
```

### CLI Integration

The Testing Framework Service provides a CLI tool for local and CI execution:

```bash
# Install CLI
npm install -g @augmented-os/testing-cli

# Authenticate
testing-cli auth login --token "your_api_token"

# Run a test suite
testing-cli run suite "User Management" --env staging --parallel

# Export results
testing-cli report export "execution-id-123456" --format html --output ./reports/
```

## Report Generation and Analysis

The Testing Framework Service provides comprehensive reporting capabilities.

### Generating a Detailed Report

```http
POST /testing/reports
Content-Type: application/json
Authorization: Bearer <your_token>

{
  "type": "execution_report",
  "execution_id": "suite-exec-123456",
  "format": "html",
  "options": {
    "include_logs": true,
    "include_screenshots": true,
    "include_network_requests": true,
    "include_performance_metrics": true
  }
}
```

### Report Response

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "report_id": "report-123456",
  "execution_id": "suite-exec-123456",
  "format": "html",
  "status": "processing",
  "created_at": "2023-06-15T15:30:00Z",
  "download_url": null
}
```

### Getting Report Status

```http
GET /testing/reports/report-123456
Authorization: Bearer <your_token>
```

### Report Status Response

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "report_id": "report-123456",
  "execution_id": "suite-exec-123456",
  "format": "html",
  "status": "completed",
  "created_at": "2023-06-15T15:30:00Z",
  "completed_at": "2023-06-15T15:30:45Z",
  "download_url": "https://api.testing-framework.augmented-os.com/reports/report-123456.html",
  "summary": {
    "total_tests": 10,
    "passed": 8,
    "failed": 1,
    "skipped": 1,
    "duration_ms": 45000,
    "pass_rate": 0.8
  }
}
```

### Scheduling Periodic Reports

```http
POST /testing/scheduled-reports
Content-Type: application/json
Authorization: Bearer <your_token>

{
  "name": "Weekly API Test Report",
  "description": "Weekly report of API test results",
  "schedule": {
    "type": "cron",
    "expression": "0 9 * * MON"
  },
  "test_suites": ["suite-api-tests"],
  "environment": "production",
  "report_options": {
    "formats": ["html", "pdf", "json"],
    "include_logs": true,
    "include_screenshots": true,
    "include_trends": true,
    "time_range": {
      "type": "relative",
      "period": "7d"
    }
  },
  "delivery": {
    "email": {
      "enabled": true,
      "recipients": [
        "team@example.com",
        "management@example.com"
      ],
      "subject": "Weekly API Test Report - ${DATE}"
    },
    "storage": {
      "enabled": true,
      "location": "s3://test-reports/weekly/${YEAR}/${MONTH}/"
    }
  }
}
```

### Generating a Trend Analysis Report

```http
POST /testing/reports
Content-Type: application/json
Authorization: Bearer <your_token>

{
  "type": "trend_analysis",
  "test_suites": ["suite-api-tests"],
  "environment": "production",
  "time_range": {
    "start": "2023-01-01T00:00:00Z",
    "end": "2023-06-30T23:59:59Z"
  },
  "metrics": [
    "pass_rate",
    "average_duration",
    "flakiness_score",
    "error_distribution"
  ],
  "group_by": ["week", "test_type"],
  "format": "html"
}
```

## Troubleshooting Complex Test Scenarios

This section provides advanced troubleshooting techniques for complex testing scenarios.

### Enabling Verbose Logging

```http
POST /testing/test-executions
Content-Type: application/json
Authorization: Bearer <your_token>

{
  "test_id": "test-authentication-flow",
  "parameters": {
    "environment": "staging",
    "debug": true,
    "log_level": "verbose",
    "capture_network": true,
    "save_snapshots": true,
    "timeout": 60000
  }
}
```

### Retrieving Detailed Execution Logs

```http
GET /testing/test-executions/exec-123456/logs?level=debug
Authorization: Bearer <your_token>
```

### Log Response

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "execution_id": "exec-123456",
  "logs": [
    {
      "timestamp": "2023-06-15T14:15:10.123Z",
      "level": "info",
      "message": "Test execution started",
      "context": {
        "test_id": "test-authentication-flow",
        "environment": "staging"
      }
    },
    {
      "timestamp": "2023-06-15T14:15:10.456Z",
      "level": "debug",
      "message": "Initializing HTTP client",
      "context": {
        "baseUrl": "https://api-staging.augmented-os.com",
        "timeout": 60000
      }
    },
    {
      "timestamp": "2023-06-15T14:15:11.789Z",
      "level": "debug",
      "message": "Request prepared",
      "context": {
        "method": "POST",
        "url": "/auth/login",
        "headers": {
          "Content-Type": "application/json"
        }
      }
    },
    {
      "timestamp": "2023-06-15T14:15:12.012Z",
      "level": "error",
      "message": "HTTP request failed",
      "context": {
        "method": "POST",
        "url": "/auth/login",
        "status": 400,
        "response": {
          "error": "invalid_request",
          "error_description": "Missing required parameter: username"
        }
      }
    }
  ]
}
```

### Retrieving Network Requests

```http
GET /testing/test-executions/exec-123456/network
Authorization: Bearer <your_token>
```

### Network Response

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "execution_id": "exec-123456",
  "requests": [
    {
      "id": "req-001",
      "timestamp": "2023-06-15T14:15:11.800Z",
      "method": "POST",
      "url": "https://api-staging.augmented-os.com/auth/login",
      "headers": {
        "Content-Type": "application/json",
        "User-Agent": "Testing-Framework/1.0"
      },
      "body": {
        "password": "********"
      },
      "response": {
        "status": 400,
        "headers": {
          "Content-Type": "application/json",
          "Cache-Control": "no-store"
        },
        "body": {
          "error": "invalid_request",
          "error_description": "Missing required parameter: username"
        }
      },
      "timing": {
        "start": "2023-06-15T14:15:11.800Z",
        "dns": 5,
        "tcp": 15,
        "tls": 100,
        "request": 30,
        "response": 50,
        "total": 200
      }
    }
  ]
}
```

### Interactive Debug Mode

```http
POST /testing/test-executions
Content-Type: application/json
Authorization: Bearer <your_token>

{
  "test_id": "test-authentication-flow",
  "parameters": {
    "environment": "staging",
    "debug": true,
    "interactive": true,
    "breakpoints": [
      {
        "type": "before_request",
        "url_pattern": "/auth/login"
      },
      {
        "type": "assertion_failure",
        "assertion_index": 2
      }
    ]
  }
}
```

### Debug Session Response

```http
HTTP/1.1 202 Accepted
Content-Type: application/json

{
  "execution_id": "exec-debug-123456",
  "status": "debug_session_started",
  "debug_session_id": "debug-session-123456",
  "debug_session_url": "https://testing-framework.augmented-os.com/debug/debug-session-123456",
  "expires_at": "2023-06-15T15:15:10Z"
}
```

### Fixing Flaky Tests

```http
POST /testing/test-stability-analysis
Content-Type: application/json
Authorization: Bearer <your_token>

{
  "test_id": "test-search-results",
  "environment": "staging",
  "iterations": 20,
  "parallel": true,
  "analysis_options": {
    "capture_screenshots": true,
    "capture_network": true,
    "capture_timing": true,
    "variable_delay": {
      "enabled": true,
      "min_ms": 0,
      "max_ms": 500
    }
  }
}
```

### Stability Analysis Response

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "analysis_id": "stability-123456",
  "test_id": "test-search-results",
  "status": "completed",
  "iterations": 20,
  "results": {
    "success_count": 15,
    "failure_count": 5,
    "success_rate": 0.75,
    "average_duration_ms": 1250,
    "duration_variance": 450,
    "failure_patterns": [
      {
        "pattern": "Timeout waiting for search results",
        "occurrence_count": 3,
        "occurrences": [2, 7, 15]
      },
      {
        "pattern": "Expected array length 10, got 9",
        "occurrence_count": 2,
        "occurrences": [5, 12]
      }
    ],
    "timing_correlation": {
      "metric": "response_time",
      "endpoint": "/api/search",
      "correlation_coefficient": 0.87,
      "significance": "high"
    },
    "recommendations": [
      {
        "type": "timeout_increase",
        "description": "Increase the timeout for waiting for search results from 2000ms to 5000ms",
        "confidence": "high"
      },
      {
        "type": "retry_mechanism",
        "description": "Add retry mechanism for search results with exponential backoff",
        "confidence": "medium"
      },
      {
        "type": "assertion_modification",
        "description": "Change assertion to verify array length >= 9 instead of exactly 10",
        "confidence": "low"
      }
    ]
  }
}
```

### Performance Profile Analysis

```http
POST /testing/performance-profile
Content-Type: application/json
Authorization: Bearer <your_token>

{
  "test_id": "test-data-processing",
  "environment": "staging",
  "scaling_factors": [1, 2, 5, 10],
  "input_data": {
    "record_count": [1000, 2000, 5000, 10000]
  },
  "metrics": ["duration", "memory", "cpu"]
}
```

### Performance Profile Response

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "profile_id": "perf-profile-123456",
  "test_id": "test-data-processing",
  "status": "completed",
  "profile_results": {
    "scaling_characteristics": {
      "duration": {
        "scaling_type": "linear",
        "correlation": 0.98,
        "formula": "y = 0.5x + 100",
        "prediction_10000": 5100
      },
      "memory": {
        "scaling_type": "logarithmic",
        "correlation": 0.92,
        "formula": "y = 500 * log(x) + 200",
        "prediction_10000": 2500
      },
      "cpu": {
        "scaling_type": "linear",
        "correlation": 0.95,
        "formula": "y = 0.2x + 50",
        "prediction_10000": 2050
      }
    },
    "bottleneck_analysis": {
      "primary_bottleneck": "database_writes",
      "secondary_bottleneck": "data_transformation",
      "recommendations": [
        "Consider database write batching to improve throughput",
        "Optimize data transformation function with parallel processing",
        "Add database connection pooling to reduce connection overhead"
      ]
    }
  }
}
```
