# Security and Compliance

This document demonstrates security best practices and compliance approaches for the Event Processing Service.

## Event Encryption

Implementing end-to-end encryption for sensitive events:

```typescript
import { EventServiceClient } from '@example/event-service-client';
import { EncryptionProvider } from '@example/security-utils';

// Initialize the client
const client = new EventServiceClient({
  baseUrl: 'https://api.example.com/event-service',
  apiKey: 'your-api-key'
});

// Create encryption provider with your organization's keys
const encryptionProvider = new EncryptionProvider({
  keyId: 'customer-data-key-2023',
  keyProvider: 'aws-kms', // Could also be 'azure-key-vault', 'gcp-kms', etc.
  region: 'us-west-2'
});

/**
 * Publish an encrypted event with sensitive data
 */
async function publishEncryptedEvent(customerData) {
  // Separate sensitive data that needs encryption
  const sensitiveData = {
    personalInfo: customerData.personalInfo,
    paymentDetails: customerData.paymentDetails
  };
  
  // Non-sensitive data stays as plaintext
  const nonSensitiveData = {
    customerId: customerData.id,
    orderCount: customerData.orderCount,
    status: customerData.status
  };
  
  // Encrypt sensitive data
  const encryptedData = await encryptionProvider.encrypt(sensitiveData);
  
  // Publish event with mixed encrypted and plaintext data
  await client.publishEvent({
    type: 'customer.data.updated',
    source: 'customer-service',
    data: {
      ...nonSensitiveData,
      encryptedData: encryptedData,
      _encryption: {
        version: '1',
        keyId: encryptionProvider.keyId,
        provider: encryptionProvider.provider,
        algorithm: 'AES-256-GCM'
      }
    }
  });
  
  console.log(`Published encrypted event for customer ${customerData.id}`);
}

/**
 * Subscribe to events and decrypt sensitive data
 */
async function processEncryptedEvents() {
  await client.subscribe('customer.data.updated', {
    name: 'customer-data-processor',
    callback: async (event) => {
      console.log(`Processing event for customer ${event.data.customerId}`);
      
      // Check if event contains encrypted data
      if (event.data._encryption && event.data.encryptedData) {
        // Decrypt data using the same provider
        const decryptedData = await encryptionProvider.decrypt(
          event.data.encryptedData,
          {
            keyId: event.data._encryption.keyId,
            algorithm: event.data._encryption.algorithm
          }
        );
        
        // Process the combined data
        const fullData = {
          ...event.data,
          ...decryptedData
        };
        
        // Delete the encrypted parts
        delete fullData.encryptedData;
        delete fullData._encryption;
        
        // Continue processing with decrypted data
        await processCustomerData(fullData);
      } else {
        // Handle unencrypted event
        await processCustomerData(event.data);
      }
    }
  });
}

// Example usage
async function run() {
  const customerData = {
    id: 'cust-123',
    orderCount: 5,
    status: 'active',
    personalInfo: {
      name: 'Jane Doe',
      email: 'jane@example.com',
      address: '123 Main St',
      ssn: '123-45-6789'
    },
    paymentDetails: {
      cardType: 'visa',
      lastFour: '4242',
      expiryDate: '12/25'
    }
  };
  
  await publishEncryptedEvent(customerData);
  await processEncryptedEvents();
}

run().catch(console.error);
```

## Access Control

Implementing fine-grained access control for event operations:

```typescript
import { EventServiceClient } from '@example/event-service-client';
import { AccessControlManager } from '@example/security-utils';

// Initialize the client
const client = new EventServiceClient({
  baseUrl: 'https://api.example.com/event-service',
  apiKey: 'your-api-key'
});

// Create access control manager
const accessControl = new AccessControlManager({
  policySource: 'database', // Could also be 'file', 'api', etc.
  enforcementMode: 'strict', // 'strict', 'audit', or 'permissive'
});

// Define resources and permissions
accessControl.defineResources([
  {
    type: 'event-type',
    actions: ['publish', 'subscribe', 'read', 'manage']
  },
  {
    type: 'subscription',
    actions: ['create', 'delete', 'update', 'pause', 'resume']
  }
]);

// Define roles
accessControl.defineRoles({
  'event-publisher': {
    'event-type': ['publish']
  },
  'event-subscriber': {
    'event-type': ['subscribe', 'read'],
    'subscription': ['create', 'delete', 'update', 'pause', 'resume']
  },
  'event-admin': {
    'event-type': ['publish', 'subscribe', 'read', 'manage'],
    'subscription': ['create', 'delete', 'update', 'pause', 'resume']
  }
});

/**
 * Secure event publishing with access control
 */
async function publishWithAccessControl(userContext, eventData) {
  // Check if user has permission to publish this event type
  const hasPermission = await accessControl.checkPermission(
    userContext, 
    'publish', 
    'event-type', 
    eventData.type
  );
  
  if (!hasPermission) {
    throw new Error(`User ${userContext.userId} does not have permission to publish ${eventData.type} events`);
  }
  
  // Publish the event
  await client.publishEvent(eventData);
  
  // Log the action for audit
  await accessControl.logAction({
    userId: userContext.userId,
    action: 'publish',
    resource: {
      type: 'event-type',
      id: eventData.type
    },
    timestamp: new Date().toISOString(),
    successful: true
  });
}

// Example usage
async function testAccessControl() {
  // Admin user context
  const adminContext = {
    userId: 'user-123',
    roles: ['event-admin'],
    tenantId: 'tenant-456'
  };
  
  // Publisher user context
  const publisherContext = {
    userId: 'user-789',
    roles: ['event-publisher'],
    tenantId: 'tenant-456'
  };
  
  // Test event
  const eventData = {
    type: 'customer.updated',
    source: 'access-control-test',
    data: {
      customerId: 'cust-001',
      status: 'active'
    }
  };
  
  // Publish as admin (should succeed)
  await publishWithAccessControl(adminContext, eventData);
  
  // Publish as publisher (should succeed)
  await publishWithAccessControl(publisherContext, eventData);
  
  // Try to publish an event the publisher doesn't have access to
  try {
    await publishWithAccessControl(publisherContext, {
      type: 'system.configuration.updated',
      source: 'access-control-test',
      data: {
        setting: 'max_events_per_second',
        value: 1000
      }
    });
  } catch (error) {
    console.error('Expected error:', error.message);
  }
}

testAccessControl().catch(console.error);
```

## Audit Logging

Implementing comprehensive audit logging for compliance requirements:

```typescript
import { EventServiceClient } from '@example/event-service-client';
import { AuditLogger } from '@example/compliance-utils';

// Initialize the client
const client = new EventServiceClient({
  baseUrl: 'https://api.example.com/event-service',
  apiKey: 'your-api-key'
});

// Create audit logger
const auditLogger = new AuditLogger({
  destination: 'elasticsearch', // Could also be 'database', 'file', 'siem'
  config: {
    url: 'https://elasticsearch.example.com',
    indexPrefix: 'event-service-audit',
    apiKey: 'es-api-key'
  },
  includeRequestData: true,
  maskSensitiveData: true,
  sensitiveFields: ['ssn', 'password', 'creditCard', 'accessToken']
});

// Create a client wrapper with audit logging
class AuditedEventClient {
  private client: EventServiceClient;
  private auditLogger: AuditLogger;
  private userContext: any;
  
  constructor(client: EventServiceClient, auditLogger: AuditLogger, userContext: any) {
    this.client = client;
    this.auditLogger = auditLogger;
    this.userContext = userContext;
  }
  
  async publishEvent(event: any) {
    const startTime = Date.now();
    const auditId = `pub-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
    
    try {
      // Log the attempt
      await this.auditLogger.logActivity({
        id: auditId,
        action: 'EVENT_PUBLISH',
        status: 'ATTEMPT',
        user: this.userContext,
        resource: {
          type: 'EVENT',
          id: event.id || 'new-event',
          eventType: event.type
        },
        request: event,
        timestamp: new Date().toISOString()
      });
      
      // Perform the actual operation
      const result = await this.client.publishEvent(event);
      
      // Log success
      await this.auditLogger.logActivity({
        id: auditId,
        action: 'EVENT_PUBLISH',
        status: 'SUCCESS',
        user: this.userContext,
        resource: {
          type: 'EVENT',
          id: result.eventId,
          eventType: event.type
        },
        response: result,
        durationMs: Date.now() - startTime,
        timestamp: new Date().toISOString()
      });
      
      return result;
    } catch (error) {
      // Log failure
      await this.auditLogger.logActivity({
        id: auditId,
        action: 'EVENT_PUBLISH',
        status: 'FAILURE',
        user: this.userContext,
        resource: {
          type: 'EVENT',
          id: event.id || 'new-event',
          eventType: event.type
        },
        error: {
          message: error.message,
          code: error.code,
          stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined
        },
        durationMs: Date.now() - startTime,
        timestamp: new Date().toISOString()
      });
      
      throw error;
    }
  }
}

// Example usage
async function demonstrateAuditLogging() {
  const userContext = {
    userId: 'user-123',
    username: 'john.doe',
    roles: ['event-publisher'],
    ipAddress: '192.168.1.1',
    sessionId: 'sess-abc-123'
  };
  
  const auditedClient = new AuditedEventClient(client, auditLogger, userContext);
  
  // Publish an event with audit logging
  await auditedClient.publishEvent({
    type: 'user.login',
    source: 'auth-service',
    data: {
      userId: 'user-123',
      loginTime: new Date().toISOString(),
      device: 'web',
      successful: true
    }
  });
}

demonstrateAuditLogging().catch(console.error);
```

## Compliance Frameworks

Adapting the Event Processing Service for common compliance requirements:

```typescript
import { EventServiceClient } from '@example/event-service-client';
import { ComplianceFramework, GDPRHandler, PCI_DSS_Handler } from '@example/compliance-utils';

// Initialize the client
const client = new EventServiceClient({
  baseUrl: 'https://api.example.com/event-service',
  apiKey: 'your-api-key'
});

// Create compliance framework
const compliance = new ComplianceFramework();

// Add GDPR compliance handler
compliance.addHandler(new GDPRHandler({
  personalDataFields: ['email', 'name', 'address', 'phoneNumber', 'ipAddress'],
  rightToBeRememberedFields: ['userConsent', 'marketingPreferences'],
  dataRetentionPeriodDays: 180,
  onDeletionRequest: async (userId) => {
    // Implementation to handle GDPR deletion requests
    console.log(`Processing GDPR deletion request for user ${userId}`);
  }
}));

// Add PCI DSS compliance handler
compliance.addHandler(new PCI_DSS_Handler({
  pciFields: ['cardNumber', 'cvv', 'expiryDate', 'cardholderName'],
  tokenizationService: 'stripe',
  // Additional PCI DSS compliance settings
}));

/**
 * Process an event with compliance rules applied
 */
async function processWithCompliance(event) {
  // Apply compliance transformations before publishing
  const compliantEvent = await compliance.processOutgoing(event);
  
  // Publish the compliant event
  return client.publishEvent(compliantEvent);
}

/**
 * Handle incoming events with compliance rules applied
 */
async function subscribeWithCompliance(pattern, handler) {
  await client.subscribe(pattern, {
    name: 'compliant-subscriber',
    callback: async (event) => {
      // Apply compliance transformations for incoming event
      const compliantEvent = await compliance.processIncoming(event);
      
      // Process the compliant event
      await handler(compliantEvent);
    }
  });
}

// Example usage
async function run() {
  // Example 1: Publishing a non-compliant event
  const userEvent = {
    type: 'user.registered',
    source: 'user-service',
    data: {
      userId: 'user-123',
      email: 'john.doe@example.com',
      name: 'John Doe',
      address: '123 Main St, City, Country',
      cardNumber: '1234-5678-9012-3456',
      cvv: '123',
      ipAddress: '192.168.1.1',
      userConsent: {
        marketing: true,
        thirdParty: false,
        consentDate: new Date().toISOString()
      }
    }
  };
  
  // This will transform the event to be compliant before publishing
  await processWithCompliance(userEvent);
  
  // Example 2: Subscribing with compliance handling
  await subscribeWithCompliance('user.*', async (event) => {
    console.log('Processing compliant user event:', event.type);
    // Process the already-compliant event
  });
}

run().catch(console.error);
```

## Next Steps

Continue to explore advanced security and compliance topics such as:

1. Multi-region data governance for global compliance requirements
2. Implementing SIEM integration for security monitoring
3. Security incident response automation
4. Advanced data anonymization techniques 