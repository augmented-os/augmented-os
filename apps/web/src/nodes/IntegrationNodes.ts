/**
 * Integration Nodes
 * 
 * Purpose:
 * Nodes for connecting with external systems, APIs, and services to send
 * or retrieve data as part of workflow execution.
 * 
 * Configuration Options:
 * - Name: Identifier for the node
 * - Description: Optional explanation of the integration
 * - Integration Type: REST API, Database, Storage, etc.
 * - Connection Details: Endpoint URLs, authentication credentials
 * - Request/Query Configuration: Headers, parameters, body, SQL queries
 * - Response Handling: Data mapping, error handling, pagination
 * 
 * Usage:
 * - Retrieve data from external APIs or databases
 * - Send data to external systems
 * - Store and retrieve files from storage services
 * - Trigger external workflows or processes
 * - Query and manipulate database records
 */

export interface IntegrationNodeConfig {
  name: string;
  description?: string;
  integrationType: 'restApi' | 'database' | 'storage' | 'messaging';
  connection: {
    integration_definition_id: string;
    method_id: string;
    integration_instance_id?: string;
    credentials?: Record<string, string>;
    endpoint?: string;
    headers?: Record<string, string>;
  };
  operation: {
    // For REST API
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    apiPath?: string;
    apiQueryParams?: Record<string, string>;
    body?: string | Record<string, any>;
    
    // For Database
    query?: string;
    dbQueryParams?: any[];
    
    // For Storage
    action?: 'upload' | 'download' | 'list' | 'delete';
    storagePath?: string;
    
    // For Messaging
    channel?: string;
    message?: string | Record<string, any>;
  };
  responseHandling: {
    successPath: string;
    errorPath?: string;
    dataMapping: Record<string, string>;
    pagination?: {
      enabled: boolean;
      strategy: 'offset' | 'cursor';
      limitParam: string;
      offsetParam?: string;
      cursorParam?: string;
      cursorExtractor?: string;
      maxItems?: number;
    };
  };
  retry?: {
    conditions: Array<string>;
    maxAttempts: number;
    backoffStrategy: 'fixed' | 'exponential';
    initialDelay: number;
  };
}
