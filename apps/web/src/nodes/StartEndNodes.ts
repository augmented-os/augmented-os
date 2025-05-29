
/**
 * Start/End Nodes
 * 
 * Purpose:
 * Entry and exit points for workflow execution. The Start node defines where execution 
 * begins, and the End node signifies completion of the workflow or a branch.
 * 
 * Configuration Options:
 * - Name: Identifier for the node
 * - Description: Optional explanation of the node's purpose
 * - Input/Output variables: Data that flows in and out of the node
 * - Trigger type (for Start): Manual, Scheduled, Event-driven
 * - Success/Error handling (for End): Actions to take on completion
 * 
 * Usage:
 * - Every workflow must have at least one Start node
 * - Multiple End nodes are allowed for different exit paths
 * - Start nodes can be triggered manually or automatically based on schedule/events
 * - End nodes can perform final data transformations or notifications
 */

export interface StartNodeConfig {
  name: string;
  description?: string;
  triggerType: 'manual' | 'scheduled' | 'event';
  outputVariables: Record<string, any>;
  // Additional fields for specific trigger types
  schedule?: string; // For scheduled triggers (cron format)
  eventType?: string; // For event-driven triggers
}

export interface EndNodeConfig {
  name: string;
  description?: string;
  inputVariables: Record<string, any>;
  successActions?: Array<{
    type: string;
    config: Record<string, any>;
  }>;
  errorHandling?: {
    notifyUsers?: string[];
    retryStrategy?: 'none' | 'immediate' | 'exponential';
    maxRetries?: number;
  };
}
