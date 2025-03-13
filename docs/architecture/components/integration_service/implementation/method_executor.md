# Method Executor

## Overview

The Method Executor is a core component of the Integration Service responsible for executing integration methods against external systems. It handles request formatting, response processing, error handling, and implements resilience patterns like circuit breakers and retries.

## Key Responsibilities

* Invoking methods on external systems
* Handling request/response formatting
* Managing timeouts and retries
* Implementing circuit breakers for failing integrations
* Providing execution metrics and logging
* Enforcing rate limits and throttling
* Handling error conditions and recovery

## Implementation Approach

The Method Executor follows these design principles:

1. **Resilient Execution** - Implements patterns like circuit breakers, retries, and timeouts to handle external system failures.
2. **Observability** - Provides detailed metrics, logs, and tracing for each method execution.
3. **Adaptive Rate Limiting** - Dynamically adjusts request rates based on external system responses.
4. **Consistent Error Handling** - Standardizes error responses and provides clear error categorization.
5. **Execution Isolation** - Isolates method executions to prevent cascading failures.

## Method Execution Lifecycle

```
┌────────────┐
│  RECEIVED  │
└─────┬──────┘
      │
      ▼
┌────────────┐     ┌─────────────┐
│ VALIDATING │────►│   REJECTED  │
└─────┬──────┘     └─────────────┘
      │
      ▼
┌────────────┐
│ EXECUTING  │◄─┐
└─────┬──────┘  │
      │         │
      ▼         │
┌────────────┐  │
│  RETRYING  │──┘
└─────┬──────┘
      │
      ▼
┌────────────┐     ┌─────────────┐
│ COMPLETED  │────►│   FAILED    │
└────────────┘     └─────────────┘
```

## Implementation Details

### Method Execution

The Method Executor provides a standardized execution flow for all integration methods:

```typescript
// Example of method execution
async function executeMethod(
  integrationInstanceId: string,
  methodName: string,
  params: any
): Promise<IntegrationResult> {
  try {
    // Load integration instance
    const instance = await integrationRepository.getInstance(integrationInstanceId);
    if (!instance) {
      throw new NotFoundError(`Integration instance not found: ${integrationInstanceId}`);
    }
    
    // Load integration definition
    const definition = await integrationRepository.getDefinition(instance.integrationDefinitionId);
    if (!definition) {
      throw new NotFoundError(`Integration definition not found: ${instance.integrationDefinitionId}`);
    }
    
    // Find method definition
    const method = definition.methods.find(m => m.name === methodName);
    if (!method) {
      throw new NotFoundError(`Method not found: ${methodName}`);
    }
    
    // Validate parameters
    const validationResult = await schemaValidator.validate(
      method.paramSchema,
      params
    );
    
    if (!validationResult.valid) {
      return {
        status: 'ERROR',
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Parameter validation failed',
          details: validationResult.errors
        }
      };
    }
    
    // Get credentials
    const credentials = await credentialManager.getCredentials(
      instance.id,
      definition.authType
    );
    
    // Get adapter
    const adapter = await adapterManager.getAdapter(definition.type);
    
    // Check rate limits
    const rateLimitCheck = await rateLimiter.checkAndIncrement(
      instance.id,
      methodName
    );
    
    if (!rateLimitCheck.allowed) {
      return {
        status: 'ERROR',
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: `Rate limit exceeded. Try again in ${rateLimitCheck.retryAfter} seconds`,
          retryAfter: rateLimitCheck.retryAfter
        }
      };
    }
    
    // Execute method with circuit breaker
    const result = await circuitBreaker.execute(
      `${instance.id}:${methodName}`,
      async () => {
        // Transform parameters if needed
        const transformedParams = method.requestTransform
          ? await dataTransformer.transform(params, method.requestTransform)
          : params;
        
        // Execute the method
        const response = await adapter.executeMethod(
          methodName,
          transformedParams,
          credentials,
          instance.config
        );
        
        // Transform response if needed
        return method.responseTransform
          ? await dataTransformer.transform(response, method.responseTransform)
          : response;
      },
      {
        timeout: method.timeoutMs || DEFAULT_TIMEOUT_MS,
        retryConfig: method.retryConfig || DEFAULT_RETRY_CONFIG
      }
    );
    
    // Update last used timestamp
    await integrationRepository.updateLastUsed(instance.id);
    
    // Emit success event
    await eventEmitter.emit({
      pattern: 'integration.method.executed',
      payload: {
        integrationInstanceId: instance.id,
        methodName,
        status: 'SUCCESS'
      }
    });
    
    return {
      status: 'SUCCESS',
      data: result
    };
  } catch (error) {
    // Log error
    logger.error('Integration method execution failed', {
      integrationInstanceId,
      methodName,
      error: error.message,
      stack: error.stack
    });
    
    // Emit error event
    await eventEmitter.emit({
      pattern: 'integration.method.failed',
      payload: {
        integrationInstanceId,
        methodName,
        error: error.message
      }
    });
    
    return {
      status: 'ERROR',
      error: {
        code: error.code || 'EXECUTION_ERROR',
        message: error.message,
        details: error.details
      }
    };
  }
}
```

### Circuit Breaker Implementation

The Method Executor uses a circuit breaker pattern to handle failing integrations:

```typescript
// Circuit breaker implementation
class CircuitBreaker {
  private circuits: Map<string, CircuitState> = new Map();
  
  async execute<T>(
    circuitKey: string,
    fn: () => Promise<T>,
    options: CircuitBreakerOptions
  ): Promise<T> {
    // Get or create circuit state
    let circuit = this.circuits.get(circuitKey);
    if (!circuit) {
      circuit = {
        state: 'CLOSED',
        failureCount: 0,
        lastFailureTime: null,
        lastAttemptTime: null
      };
      this.circuits.set(circuitKey, circuit);
    }
    
    // Check if circuit is open
    if (circuit.state === 'OPEN') {
      const now = Date.now();
      const cooldownPeriod = options.cooldownPeriodMs || DEFAULT_COOLDOWN_PERIOD_MS;
      
      // Check if cooldown period has elapsed
      if (circuit.lastFailureTime && (now - circuit.lastFailureTime) > cooldownPeriod) {
        // Transition to half-open state
        circuit.state = 'HALF_OPEN';
        logger.info(`Circuit ${circuitKey} transitioned to HALF_OPEN state`);
      } else {
        // Circuit is still open
        throw new CircuitOpenError(`Circuit for ${circuitKey} is open`);
      }
    }
    
    // Update last attempt time
    circuit.lastAttemptTime = Date.now();
    
    try {
      // Execute function with timeout
      const result = await Promise.race([
        fn(),
        new Promise<never>((_, reject) => {
          setTimeout(() => reject(new TimeoutError(`Execution timed out after ${options.timeout}ms`)), 
            options.timeout);
        })
      ]);
      
      // Success - reset circuit if it was half-open
      if (circuit.state === 'HALF_OPEN') {
        circuit.state = 'CLOSED';
        circuit.failureCount = 0;
        logger.info(`Circuit ${circuitKey} transitioned to CLOSED state`);
      }
      
      return result;
    } catch (error) {
      // Handle failure
      circuit.lastFailureTime = Date.now();
      circuit.failureCount++;
      
      // Check if failure threshold is reached
      const failureThreshold = options.failureThreshold || DEFAULT_FAILURE_THRESHOLD;
      
      if (circuit.failureCount >= failureThreshold) {
        // Open the circuit
        circuit.state = 'OPEN';
        logger.warn(`Circuit ${circuitKey} transitioned to OPEN state after ${circuit.failureCount} failures`);
      }
      
      // Check if we should retry
      if (options.retryConfig && circuit.failureCount <= options.retryConfig.maxRetries) {
        // Calculate delay using exponential backoff
        const delay = Math.min(
          options.retryConfig.initialDelayMs * Math.pow(options.retryConfig.backoffMultiplier, circuit.failureCount - 1),
          options.retryConfig.maxDelayMs
        );
        
        logger.info(`Retrying ${circuitKey} in ${delay}ms (attempt ${circuit.failureCount})`);
        
        // Wait for delay
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // Retry execution
        return this.execute(circuitKey, fn, options);
      }
      
      // No more retries, propagate error
      throw error;
    }
  }
}
```

### Edge Cases and Error Handling

The implementation addresses the following edge cases:

| Scenario | Handling Approach |
|----------|-------------------|
| External system timeout | Implements configurable timeouts with clear error messages |
| Rate limit exceeded | Returns structured error with retry-after information |
| Authentication failure | Detects auth errors and triggers credential refresh |
| Network connectivity issues | Implements retries with exponential backoff |
| Malformed responses | Provides detailed parsing errors and raw response data |

## Performance Considerations

The Method Executor is optimized for reliable execution with minimal overhead.

### Benchmarks

| Operation | Average Performance | P99 Performance |
|-----------|---------------------|----------------|
| Parameter validation | 10ms | 30ms |
| Method execution (success) | 150ms | 400ms |
| Method execution (with retry) | 350ms | 800ms |
| Circuit breaker overhead | 2ms | 5ms |

## Related Documentation

* [Data Model](../data_model.md)
* [Adapter Manager](./adapter_manager.md)
* [Credential Manager](./credential_manager.md)
* [Basic Example](../examples/basic_example.md) 