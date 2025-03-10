# Integration Service

## Overview

The Integration Service provides a unified interface for connecting to external systems and services. It manages authentication, data transformation, and communication protocols, enabling workflows and tasks to interact with third-party applications seamlessly.

## Responsibilities

* Managing integration definitions and configurations
* Securely storing and using authentication credentials
* Executing integration methods against external systems
* Transforming data between system formats
* Handling rate limiting and throttling
* Monitoring integration health and availability
* Providing a consistent interface for all integrations

## Architecture

The Integration Service is designed as a modular system with a core engine and pluggable adapters for different integration types. It uses a secure credential store and provides both synchronous and asynchronous operation modes.

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Task Execution │────▶│  Integration    │────▶│  External       │
│  Layer          │     │  Service        │     │  Systems        │
│                 │     │                 │     │                 │
└─────────────────┘     └────────┬────────┘     └─────────────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │                 │
                        │  Credential     │
                        │  Store          │
                        └─────────────────┘
```

## Key Components

### Integration Registry

Responsible for:

* Storing integration definitions
* Managing integration versions
* Providing discovery mechanisms
* Validating integration configurations
* Supporting integration lifecycle management

### Adapter Manager

Handles integration adapters by:

* Loading appropriate adapters for each integration type
* Managing adapter lifecycle
* Providing adapter versioning
* Supporting custom and third-party adapters
* Validating adapter compatibility

### Credential Manager

Secures authentication by:

* Encrypting sensitive credentials
* Supporting various authentication methods (API keys, OAuth, etc.)
* Managing token refresh and rotation
* Providing secure credential access
* Implementing credential validation

### Method Executor

Executes integration operations by:

* Invoking methods on external systems
* Handling request/response formatting
* Managing timeouts and retries
* Implementing circuit breakers
* Providing execution metrics

### Data Transformer

Handles data transformation by:

* Converting between data formats
* Applying mapping rules
* Supporting schema validation
* Handling data type conversions
* Providing transformation templates

## Interfaces

### Input Interfaces

* **Task Execution Layer**: Receives integration method calls
* **API Endpoints**: Exposes REST endpoints for integration management
* **Event Processor**: Receives events that trigger integrations #TODO - Does this respond directly to events?  Surely configuration actions would be via api and execution actions directly executed by task execution layer?
* **Configuration API**: Receives integration configurations

### Output Interfaces

* **External Systems**: Connects to third-party services and APIs
* **Event Emitter**: Publishes integration events
* **Metrics System**: Reports integration performance and health
* **Credential Store**: Stores and retrieves authentication credentials

## Data Model

The Integration Service primarily interacts with these data schemas:

* [Integrations Schema](../schemas/integrations.md): For integration definitions and instances
* [Events Schema](../schemas/events.md): For integration events

## Operational Considerations

### Scalability

The service scales horizontally by:

* Using stateless design for core components
* Implementing connection pooling for external systems
* Supporting distributed credential management
* Caching integration definitions and responses
* Load balancing across service instances

### Monitoring

Key metrics to monitor:

* Integration call volume and latency
* Error rates by integration and method
* Authentication failures
* Rate limit hits and throttling events
* External system availability

### Resilience

Failure handling strategies:

* Circuit breakers for failing integrations
* Automatic retry with exponential backoff
* Fallback mechanisms for critical operations
* Graceful degradation when external systems are unavailable
* Caching to reduce dependency on external systems

## Configuration

The service can be configured with:

* Default timeout settings
* Retry policies
* Circuit breaker thresholds
* Rate limiting parameters
* Logging levels and destinations

## Security

Security considerations:

* Encryption of credentials at rest and in transit
* Secure token management
* Least privilege access to external systems
* Audit logging of all integration activities
* Regular credential rotation

## Implementation Examples

### Executing an Integration Method

```typescript
// Example of how the service executes an integration method
async function executeIntegrationMethod(
  integrationInstanceId: string,
  methodName: string,
  params: any
): Promise<IntegrationResult> {
  try {
    // Load integration instance
    const instance = await integrationRepository.getInstance(integrationInstanceId);
    if (!instance) {
      throw new Error(`Integration instance not found: ${integrationInstanceId}`);
    }
    
    // Load integration definition
    const definition = await integrationRepository.getDefinition(instance.integrationDefinitionId);
    if (!definition) {
      throw new Error(`Integration definition not found: ${instance.integrationDefinitionId}`);
    }
    
    // Validate method exists
    const method = definition.methods.find(m => m.name === methodName);
    if (!method) {
      throw new Error(`Method not found: ${methodName}`);
    }
    
    // Validate parameters against schema
    const validationResult = await paramValidator.validate(
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
    
    // Get adapter for this integration type
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
      instance.id,
      async () => {
        // Transform parameters if needed
        const transformedParams = await dataTransformer.transformRequest(
          params,
          method.requestTransform
        );
        
        // Execute the method
        const response = await adapter.executeMethod(
          methodName,
          transformedParams,
          credentials,
          instance.config
        );
        
        // Transform response if needed
        return await dataTransformer.transformResponse(
          response,
          method.responseTransform
        );
      }
    );
    
    // Update last used timestamp
    await integrationRepository.updateLastUsed(instance.id);
    
    // Emit integration event
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

### Setting Up OAuth Authentication

```typescript
// Example of how the service handles OAuth setup
async function setupOAuthAuthentication(
  integrationInstanceId: string,
  redirectUri: string
): Promise<OAuthSetupResult> {
  // Load integration instance
  const instance = await integrationRepository.getInstance(integrationInstanceId);
  if (!instance) {
    throw new Error(`Integration instance not found: ${integrationInstanceId}`);
  }
  
  // Load integration definition
  const definition = await integrationRepository.getDefinition(instance.integrationDefinitionId);
  if (!definition) {
    throw new Error(`Integration definition not found: ${instance.integrationDefinitionId}`);
  }
  
  // Verify this integration uses OAuth
  if (definition.authType !== 'oauth2') {
    throw new Error(`Integration does not use OAuth: ${definition.authType}`);
  }
  
  // Get OAuth configuration
  const oauthConfig = definition.oauth2Config;
  if (!oauthConfig) {
    throw new Error('OAuth configuration not found');
  }
  
  // Generate state parameter for security
  const state = generateSecureRandomString();
  
  // Store state in session for verification
  await oauthStateStore.saveState(integrationInstanceId, state, {
    redirectUri,
    timestamp: new Date().toISOString()
  });
  
  // Build authorization URL
  const authUrl = new URL(oauthConfig.authorizationUrl);
  authUrl.searchParams.append('client_id', oauthConfig.clientId);
  authUrl.searchParams.append('redirect_uri', redirectUri);
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('state', state);
  
  if (oauthConfig.scope) {
    authUrl.searchParams.append('scope', oauthConfig.scope);
  }
  
  // Add any additional parameters
  if (oauthConfig.additionalParameters) {
    for (const [key, value] of Object.entries(oauthConfig.additionalParameters)) {
      authUrl.searchParams.append(key, value);
    }
  }
  
  return {
    authorizationUrl: authUrl.toString(),
    state
  };
}
```

### Processing OAuth Callback

```typescript
// Example of how the service processes OAuth callback
async function processOAuthCallback(
  code: string,
  state: string
): Promise<OAuthCallbackResult> {
  // Verify state parameter
  const storedState = await oauthStateStore.getState(state);
  if (!storedState) {
    throw new Error('Invalid state parameter');
  }
  
  // Check for expiration
  const stateAge = Date.now() - new Date(storedState.timestamp).getTime();
  if (stateAge > OAUTH_STATE_EXPIRATION_MS) {
    await oauthStateStore.deleteState(state);
    throw new Error('OAuth state expired');
  }
  
  // Get integration instance
  const integrationInstanceId = storedState.integrationInstanceId;
  const instance = await integrationRepository.getInstance(integrationInstanceId);
  if (!instance) {
    throw new Error(`Integration instance not found: ${integrationInstanceId}`);
  }
  
  // Load integration definition
  const definition = await integrationRepository.getDefinition(instance.integrationDefinitionId);
  if (!definition) {
    throw new Error(`Integration definition not found: ${instance.integrationDefinitionId}`);
  }
  
  // Get OAuth configuration
  const oauthConfig = definition.oauth2Config;
  if (!oauthConfig) {
    throw new Error('OAuth configuration not found');
  }
  
  try {
    // Exchange code for token
    const tokenResponse = await httpClient.post(
      oauthConfig.tokenUrl,
      {
        grant_type: 'authorization_code',
        code,
        redirect_uri: storedState.redirectUri,
        client_id: oauthConfig.clientId,
        client_secret: oauthConfig.clientSecret
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    
    // Store tokens securely
    await credentialManager.storeOAuthCredentials(
      integrationInstanceId,
      {
        accessToken: tokenResponse.data.access_token,
        refreshToken: tokenResponse.data.refresh_token,
        expiresAt: tokenResponse.data.expires_in 
          ? new Date(Date.now() + tokenResponse.data.expires_in * 1000).toISOString()
          : null,
        tokenType: tokenResponse.data.token_type || 'Bearer',
        scope: tokenResponse.data.scope,
        rawResponse: tokenResponse.data
      }
    );
    
    // Update integration status
    await integrationRepository.updateStatus(
      integrationInstanceId,
      {
        status: 'CONNECTED',
        lastConnectedAt: new Date().toISOString()
      }
    );
    
    // Clean up state
    await oauthStateStore.deleteState(state);
    
    // Emit integration connected event
    await eventEmitter.emit({
      pattern: 'integration.connected',
      payload: {
        integrationInstanceId,
        authType: 'oauth2'
      }
    });
    
    return {
      status: 'SUCCESS',
      integrationInstanceId
    };
  } catch (error) {
    // Update integration status
    await integrationRepository.updateStatus(
      integrationInstanceId,
      {
        status: 'AUTH_ERROR',
        error: {
          message: error.message,
          details: error.response?.data
        }
      }
    );
    
    // Clean up state
    await oauthStateStore.deleteState(state);
    
    // Emit integration error event
    await eventEmitter.emit({
      pattern: 'integration.auth.failed',
      payload: {
        integrationInstanceId,
        authType: 'oauth2',
        error: error.message
      }
    });
    
    throw error;
  }
}
```


