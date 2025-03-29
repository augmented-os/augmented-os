# Advanced Task Execution Examples

This document provides advanced examples of using the Task Execution Service, focusing on complex task patterns, error handling, retry mechanisms, and integration scenarios.

## Complex Task Patterns

### Conditional Task Execution

This example demonstrates how to implement conditional logic within task execution:

```typescript
// Task definition with conditional execution paths
const conditionalTaskDef = {
  id: "conditional-data-processing",
  name: "Conditional Data Processing",
  description: "Process data differently based on input conditions",
  type: "automated",
  implementation: {
    type: "javascript",
    code: `
      function execute(input) {
        // Determine which processing path to take
        if (input.dataSize > 1000) {
          return processBatchData(input.data);
        } else {
          return processIndividualData(input.data);
        }
      }
      
      function processBatchData(data) {
        // Implementation for large data sets
        const results = [];
        const batchSize = 100;
        
        for (let i = 0; i < data.length; i += batchSize) {
          const batch = data.slice(i, i + batchSize);
          const batchResult = batch.map(item => transformItem(item));
          results.push(...batchResult);
        }
        
        return { processedData: results, processingMethod: "batch" };
      }
      
      function processIndividualData(data) {
        // Implementation for smaller data sets
        const results = data.map(item => transformItem(item));
        return { processedData: results, processingMethod: "individual" };
      }
      
      function transformItem(item) {
        // Common transformation logic
        return {
          id: item.id,
          value: item.value * 2,
          processed: true,
          timestamp: new Date().toISOString()
        };
      }
    `
  },
  inputSchema: {
    type: "object",
    properties: {
      data: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string" },
            value: { type: "number" }
          },
          required: ["id", "value"]
        }
      },
      dataSize: { type: "number" }
    },
    required: ["data", "dataSize"]
  },
  outputSchema: {
    type: "object",
    properties: {
      processedData: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string" },
            value: { type: "number" },
            processed: { type: "boolean" },
            timestamp: { type: "string" }
          },
          required: ["id", "value", "processed", "timestamp"]
        }
      },
      processingMethod: {
        type: "string",
        enum: ["batch", "individual"]
      }
    },
    required: ["processedData", "processingMethod"]
  }
};
```

### Task Chaining with Data Transformation

This example shows how to chain multiple tasks with data transformation between them:

```typescript
// First task in the chain - Data Extraction
const dataExtractionTask = {
  id: "extract-customer-data",
  name: "Extract Customer Data",
  description: "Extract customer data from source system",
  type: "integration",
  implementation: {
    type: "http",
    config: {
      method: "GET",
      url: "https://api.example.com/customers",
      headers: {
        "Authorization": "Bearer ${secrets.API_KEY}",
        "Content-Type": "application/json"
      }
    }
  },
  outputSchema: {
    type: "object",
    properties: {
      customers: {
        type: "array",
        items: {
          type: "object",
          properties: {
            customerId: { type: "string" },
            name: { type: "string" },
            email: { type: "string" },
            accountType: { type: "string" }
          }
        }
      }
    }
  }
};

// Second task in the chain - Data Transformation
const dataTransformationTask = {
  id: "transform-customer-data",
  name: "Transform Customer Data",
  description: "Transform customer data to target format",
  type: "automated",
  implementation: {
    type: "javascript",
    code: `
      function execute(input) {
        return {
          transformedCustomers: input.customers.map(customer => ({
            id: customer.customerId,
            fullName: customer.name,
            contactEmail: customer.email,
            type: mapAccountType(customer.accountType),
            importDate: new Date().toISOString()
          }))
        };
      }
      
      function mapAccountType(sourceType) {
        const typeMapping = {
          "standard": "REGULAR",
          "premium": "PREMIUM",
          "enterprise": "ENTERPRISE",
          "trial": "TRIAL"
        };
        
        return typeMapping[sourceType.toLowerCase()] || "UNKNOWN";
      }
    `
  },
  inputSchema: {
    type: "object",
    properties: {
      customers: {
        type: "array",
        items: {
          type: "object",
          properties: {
            customerId: { type: "string" },
            name: { type: "string" },
            email: { type: "string" },
            accountType: { type: "string" }
          }
        }
      }
    },
    required: ["customers"]
  },
  outputSchema: {
    type: "object",
    properties: {
      transformedCustomers: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string" },
            fullName: { type: "string" },
            contactEmail: { type: "string" },
            type: { type: "string" },
            importDate: { type: "string" }
          },
          required: ["id", "fullName", "contactEmail", "type"]
        }
      }
    },
    required: ["transformedCustomers"]
  }
};
```

## Error Handling Strategies

### Comprehensive Error Handling

This example demonstrates comprehensive error handling within a task:

```typescript
// Task with comprehensive error handling
const robustDataProcessingTask = {
  id: "robust-data-processing",
  name: "Robust Data Processing",
  description: "Process data with comprehensive error handling",
  type: "automated",
  implementation: {
    type: "javascript",
    code: `
      function execute(input) {
        try {
          // Validate input structure beyond schema validation
          if (!input.data || input.data.length === 0) {
            throw new TaskError("EMPTY_DATA", "Input data array is empty");
          }
          
          const results = [];
          const errors = [];
          
          // Process each item individually to isolate failures
          for (let i = 0; i < input.data.length; i++) {
            try {
              const item = input.data[i];
              
              // Additional validation
              if (!item.id) {
                throw new TaskError("MISSING_ID", `Item at index ${i} is missing an ID`);
              }
              
              // Business logic validation
              if (item.value < 0) {
                throw new TaskError("NEGATIVE_VALUE", `Item ${item.id} has a negative value`);
              }
              
              // Process the item
              const processedItem = {
                id: item.id,
                originalValue: item.value,
                processedValue: item.value * 2,
                status: "SUCCESS"
              };
              
              results.push(processedItem);
            } catch (itemError) {
              // Record the error but continue processing other items
              errors.push({
                index: i,
                itemId: input.data[i]?.id || "unknown",
                error: {
                  code: itemError.code || "PROCESSING_ERROR",
                  message: itemError.message,
                  details: itemError.details || {}
                }
              });
              
              // Add a placeholder result with error status
              results.push({
                id: input.data[i]?.id || `unknown-${i}`,
                originalValue: input.data[i]?.value,
                status: "ERROR",
                error: itemError.message
              });
            }
          }
          
          // Return both results and error information
          return {
            processedItems: results,
            summary: {
              total: input.data.length,
              successful: results.filter(r => r.status === "SUCCESS").length,
              failed: errors.length,
              errors: errors
            }
          };
        } catch (error) {
          // Handle catastrophic errors
          throw new TaskError(
            error.code || "EXECUTION_FAILURE",
            error.message || "Task execution failed",
            error.details || { stack: error.stack }
          );
        }
      }
      
      // Custom error class for structured error information
      class TaskError extends Error {
        constructor(code, message, details = {}) {
          super(message);
          this.code = code;
          this.details = details;
        }
      }
    `
  },
  inputSchema: {
    type: "object",
    properties: {
      data: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string" },
            value: { type: "number" }
          }
        }
      }
    },
    required: ["data"]
  },
  outputSchema: {
    type: "object",
    properties: {
      processedItems: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string" },
            originalValue: { type: "number" },
            processedValue: { type: "number" },
            status: { type: "string" },
            error: { type: "string" }
          },
          required: ["id", "status"]
        }
      },
      summary: {
        type: "object",
        properties: {
          total: { type: "number" },
          successful: { type: "number" },
          failed: { type: "number" },
          errors: {
            type: "array",
            items: {
              type: "object",
              properties: {
                index: { type: "number" },
                itemId: { type: "string" },
                error: {
                  type: "object",
                  properties: {
                    code: { type: "string" },
                    message: { type: "string" },
                    details: { type: "object" }
                  }
                }
              }
            }
          }
        }
      }
    },
    required: ["processedItems", "summary"]
  }
};
```

### Retry Mechanisms

This example demonstrates implementing retry logic for transient failures:

```typescript
// Task with built-in retry logic
const resilientIntegrationTask = {
  id: "resilient-api-call",
  name: "Resilient API Call",
  description: "Make API calls with retry logic for transient failures",
  type: "integration",
  implementation: {
    type: "javascript",
    code: `
      async function execute(input) {
        const maxRetries = input.maxRetries || 3;
        const initialBackoffMs = input.initialBackoffMs || 1000;
        const backoffMultiplier = input.backoffMultiplier || 2;
        
        let lastError = null;
        
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
          try {
            console.log(`Attempt ${attempt} of ${maxRetries}`);
            
            // Make the API call
            const response = await makeApiCall(input.endpoint, input.payload);
            
            // If successful, return the result
            return {
              success: true,
              data: response,
              metadata: {
                attempts: attempt,
                timestamp: new Date().toISOString()
              }
            };
          } catch (error) {
            lastError = error;
            
            // Check if error is retryable
            if (!isRetryableError(error)) {
              console.log(`Non-retryable error: ${error.message}`);
              break;
            }
            
            // If this was the last attempt, don't wait
            if (attempt === maxRetries) {
              console.log(`Final attempt failed: ${error.message}`);
              break;
            }
            
            // Calculate backoff time with exponential backoff and jitter
            const backoffTime = calculateBackoff(
              initialBackoffMs, 
              backoffMultiplier, 
              attempt
            );
            
            console.log(`Attempt ${attempt} failed: ${error.message}. Retrying in ${backoffTime}ms`);
            
            // Wait before the next attempt
            await sleep(backoffTime);
          }
        }
        
        // If we got here, all attempts failed
        return {
          success: false,
          error: {
            message: lastError.message,
            code: lastError.code || 'UNKNOWN_ERROR',
            retryable: isRetryableError(lastError)
          },
          metadata: {
            attempts: maxRetries,
            timestamp: new Date().toISOString()
          }
        };
      }
      
      // Helper function to determine if an error is retryable
      function isRetryableError(error) {
        // Network errors are typically retryable
        if (error.code === 'ECONNRESET' || 
            error.code === 'ETIMEDOUT' || 
            error.code === 'ECONNREFUSED') {
          return true;
        }
        
        // HTTP status codes that indicate transient failures
        if (error.status === 408 || // Request Timeout
            error.status === 429 || // Too Many Requests
            error.status === 503 || // Service Unavailable
            error.status === 504) { // Gateway Timeout
          return true;
        }
        
        // All other errors are considered non-retryable
        return false;
      }
      
      // Helper function to calculate backoff with jitter
      function calculateBackoff(initialMs, multiplier, attempt) {
        // Calculate exponential backoff
        const exponentialBackoff = initialMs * Math.pow(multiplier, attempt - 1);
        
        // Add random jitter (±20%)
        const jitter = 0.2 * exponentialBackoff;
        const min = exponentialBackoff - jitter;
        const max = exponentialBackoff + jitter;
        
        return Math.floor(min + Math.random() * (max - min));
      }
      
      // Helper function to make the actual API call
      async function makeApiCall(endpoint, payload) {
        // Implementation would use fetch or another HTTP client
        // This is a simplified example
        if (Math.random() < 0.3) {
          // Simulate random failure for demonstration
          const error = new Error('Service temporarily unavailable');
          error.status = 503;
          throw error;
        }
        
        return {
          id: 'response-123',
          status: 'success',
          data: {
            // Response data would go here
            result: 'API call successful',
            timestamp: new Date().toISOString()
          }
        };
      }
      
      // Helper function to sleep for a specified time
      function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }
    `
  },
  inputSchema: {
    type: "object",
    properties: {
      endpoint: { type: "string" },
      payload: { type: "object" },
      maxRetries: { type: "number" },
      initialBackoffMs: { type: "number" },
      backoffMultiplier: { type: "number" }
    },
    required: ["endpoint", "payload"]
  },
  outputSchema: {
    type: "object",
    properties: {
      success: { type: "boolean" },
      data: { type: "object" },
      error: {
        type: "object",
        properties: {
          message: { type: "string" },
          code: { type: "string" },
          retryable: { type: "boolean" }
        }
      },
      metadata: {
        type: "object",
        properties: {
          attempts: { type: "number" },
          timestamp: { type: "string" }
        }
      }
    },
    required: ["success", "metadata"]
  }
};
```

## Integration Patterns

### External Service Integration with Circuit Breaker

This example demonstrates integration with external services using a circuit breaker pattern:

```typescript
// Task with circuit breaker pattern for external service calls
const circuitBreakerTask = {
  id: "payment-service-integration",
  name: "Payment Service Integration",
  description: "Process payments with circuit breaker pattern",
  type: "integration",
  implementation: {
    type: "javascript",
    code: `
      // Circuit breaker state (would be stored in a persistent store in production)
      const circuitState = {
        status: 'CLOSED', // CLOSED, OPEN, HALF_OPEN
        failureCount: 0,
        lastFailureTime: null,
        failureThreshold: 5,
        resetTimeout: 30000, // 30 seconds
      };
      
      async function execute(input) {
        // Check circuit state
        updateCircuitState();
        
        if (circuitState.status === 'OPEN') {
          return {
            success: false,
            error: {
              code: 'CIRCUIT_OPEN',
              message: 'Circuit breaker is open, payment service calls are temporarily disabled',
              details: {
                openSince: circuitState.lastFailureTime,
                willRetryAt: new Date(circuitState.lastFailureTime.getTime() + circuitState.resetTimeout).toISOString()
              }
            }
          };
        }
        
        try {
          // Attempt to process payment
          const paymentResult = await processPayment(input.paymentDetails);
          
          // If successful and circuit was half-open, reset it to closed
          if (circuitState.status === 'HALF_OPEN') {
            circuitState.status = 'CLOSED';
            circuitState.failureCount = 0;
          }
          
          return {
            success: true,
            transactionId: paymentResult.transactionId,
            amount: paymentResult.amount,
            status: paymentResult.status,
            timestamp: paymentResult.timestamp
          };
        } catch (error) {
          // Record failure
          circuitState.failureCount++;
          circuitState.lastFailureTime = new Date();
          
          // If we've hit the threshold, open the circuit
          if (circuitState.failureCount >= circuitState.failureThreshold) {
            circuitState.status = 'OPEN';
          }
          
          return {
            success: false,
            error: {
              code: error.code || 'PAYMENT_PROCESSING_ERROR',
              message: error.message,
              details: error.details || {}
            },
            circuitStatus: circuitState.status
          };
        }
      }
      
      function updateCircuitState() {
        // If circuit is open and reset timeout has passed, move to half-open
        if (circuitState.status === 'OPEN') {
          const now = new Date();
          const timeElapsed = now - circuitState.lastFailureTime;
          
          if (timeElapsed >= circuitState.resetTimeout) {
            circuitState.status = 'HALF_OPEN';
          }
        }
      }
      
      async function processPayment(paymentDetails) {
        // This would be an actual API call to a payment processor
        // Simulating success/failure for demonstration
        
        // Simulate random failure (20% chance)
        if (Math.random() < 0.2) {
          const error = new Error('Payment service unavailable');
          error.code = 'PAYMENT_SERVICE_ERROR';
          throw error;
        }
        
        // Simulate successful payment
        return {
          transactionId: 'txn_' + Math.random().toString(36).substring(2, 15),
          amount: paymentDetails.amount,
          currency: paymentDetails.currency,
          status: 'COMPLETED',
          timestamp: new Date().toISOString()
        };
      }
    `
  },
  inputSchema: {
    type: "object",
    properties: {
      paymentDetails: {
        type: "object",
        properties: {
          amount: { type: "number" },
          currency: { type: "string" },
          paymentMethod: { type: "string" },
          customerId: { type: "string" }
        },
        required: ["amount", "currency", "paymentMethod", "customerId"]
      }
    },
    required: ["paymentDetails"]
  },
  outputSchema: {
    type: "object",
    properties: {
      success: { type: "boolean" },
      transactionId: { type: "string" },
      amount: { type: "number" },
      status: { type: "string" },
      timestamp: { type: "string" },
      error: {
        type: "object",
        properties: {
          code: { type: "string" },
          message: { type: "string" },
          details: { type: "object" }
        }
      },
      circuitStatus: { type: "string" }
    },
    required: ["success"]
  }
};
```

## Troubleshooting Examples

### Debugging Task Execution

This example shows how to implement debugging capabilities in tasks:

```typescript
// Task with enhanced debugging capabilities
const debuggableTask = {
  id: "debuggable-data-processor",
  name: "Debuggable Data Processor",
  description: "Process data with enhanced debugging capabilities",
  type: "automated",
  implementation: {
    type: "javascript",
    code: `
      function execute(input) {
        // Initialize debug log if debugging is enabled
        const debugLog = [];
        const shouldDebug = input.debug === true;
        
        // Helper function to log debug information
        function debug(message, data = null) {
          if (shouldDebug) {
            debugLog.push({
              timestamp: new Date().toISOString(),
              message,
              data: data ? JSON.parse(JSON.stringify(data)) : null
            });
          }
        }
        
        debug('Task execution started', { input });
        
        try {
          // Validate input
          if (!input.data || !Array.isArray(input.data)) {
            debug('Input validation failed: data is not an array');
            throw new Error('Input data must be an array');
          }
          
          debug(`Processing ${input.data.length} items`);
          
          // Process data
          const results = [];
          for (let i = 0; i < input.data.length; i++) {
            const item = input.data[i];
            debug(`Processing item ${i}`, item);
            
            try {
              // Perform processing
              const processedItem = processItem(item);
              debug(`Successfully processed item ${i}`, processedItem);
              results.push(processedItem);
            } catch (itemError) {
              debug(`Error processing item ${i}`, { error: itemError.message });
              
              // Add error information to results
              results.push({
                id: item.id,
                error: itemError.message,
                status: 'ERROR'
              });
            }
          }
          
          debug('Task execution completed successfully', { resultCount: results.length });
          
          // Return results with debug information if requested
          const response = {
            results,
            summary: {
              totalItems: input.data.length,
              successfulItems: results.filter(r => r.status !== 'ERROR').length,
              failedItems: results.filter(r => r.status === 'ERROR').length
            }
          };
          
          if (shouldDebug) {
            response.debug = {
              log: debugLog,
              executionTime: calculateExecutionTime()
            };
          }
          
          return response;
        } catch (error) {
          debug('Task execution failed', { error: error.message, stack: error.stack });
          
          // Return error with debug information if requested
          const errorResponse = {
            error: {
              message: error.message,
              type: error.constructor.name
            },
            success: false
          };
          
          if (shouldDebug) {
            errorResponse.debug = {
              log: debugLog,
              executionTime: calculateExecutionTime()
            };
          }
          
          return errorResponse;
        }
      }
      
      function processItem(item) {
        // Simulate processing logic
        if (!item.id) {
          throw new Error('Item is missing required id field');
        }
        
        return {
          id: item.id,
          originalValue: item.value,
          processedValue: item.value * 3,
          status: 'SUCCESS',
          processedAt: new Date().toISOString()
        };
      }
      
      function calculateExecutionTime() {
        // In a real implementation, this would calculate actual execution time
        return {
          startTime: new Date(Date.now() - 1000).toISOString(), // Simulated start time
          endTime: new Date().toISOString(),
          durationMs: 1000 // Simulated duration
        };
      }
    `
  },
  inputSchema: {
    type: "object",
    properties: {
      data: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string" },
            value: { type: "number" }
          }
        }
      },
      debug: { type: "boolean" }
    },
    required: ["data"]
  },
  outputSchema: {
    type: "object",
    properties: {
      results: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string" },
            originalValue: { type: "number" },
            processedValue: { type: "number" },
            status: { type: "string" },
            processedAt: { type: "string" },
            error: { type: "string" }
          }
        }
      },
      summary: {
        type: "object",
        properties: {
          totalItems: { type: "number" },
          successfulItems: { type: "number" },
          failedItems: { type: "number" }
        }
      },
      debug: {
        type: "object",
        properties: {
          log: {
            type: "array",
            items: {
              type: "object",
              properties: {
                timestamp: { type: "string" },
                message: { type: "string" },
                data: { type: "object" }
              }
            }
          },
          executionTime: {
            type: "object",
            properties: {
              startTime: { type: "string" },
              endTime: { type: "string" },
              durationMs: { type: "number" }
            }
          }
        }
      },
      error: {
        type: "object",
        properties: {
          message: { type: "string" },
          type: { type: "string" }
        }
      },
      success: { type: "boolean" }
    }
  }
}; 
```


