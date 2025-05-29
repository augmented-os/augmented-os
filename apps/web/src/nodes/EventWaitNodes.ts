
/**
 * Event Wait Nodes
 * 
 * Purpose:
 * Nodes for event-driven workflows that pause execution until a specific
 * event occurs, enabling asynchronous and reactive workflow patterns.
 * 
 * Configuration Options:
 * - Name: Identifier for the node
 * - Description: Optional explanation of the wait condition
 * - Event Source: Where events come from (webhook, message queue, etc.)
 * - Event Matching: Criteria to identify relevant events
 * - Timeout: Maximum wait time before continuing or failing
 * - Correlation: How to match events to workflow instances
 * 
 * Usage:
 * - Implement asynchronous business processes
 * - Wait for external systems to complete operations
 * - Create long-running workflows with waiting periods
 * - Build event-driven automation flows
 * - Implement human-in-the-loop processes with callbacks
 */

export interface EventWaitNodeConfig {
  name: string;
  description?: string;
  eventSource: {
    type: 'webhook' | 'queue' | 'pubsub' | 'timer' | 'api';
    configuration: Record<string, any>;
  };
  eventCriteria: {
    type: 'exact' | 'pattern' | 'jsonPath' | 'custom';
    expression: string;
    eventDataMapping: Record<string, string>;
  };
  correlation: {
    strategy: 'id' | 'property' | 'expression';
    key: string;
    value: string;
  };
  timeConstraints: {
    timeout: number; // in seconds
    timeoutAction: 'fail' | 'continue' | 'retry' | 'alternative';
    alternativePath?: string;
  };
  multipleEvents?: {
    handling: 'first' | 'all' | 'last' | 'count';
    count?: number;
    window?: number; // Time window in seconds
    aggregation?: 'array' | 'merge' | 'custom';
  };
  persistence?: {
    enabled: boolean;
    expiration: number; // in days
    recoveryStrategy: 'resume' | 'restart' | 'compensate';
  };
}
