
/**
 * Parallel Nodes
 * 
 * Purpose:
 * Nodes for concurrent execution paths that split workflow execution into
 * multiple parallel branches and optionally synchronize them later.
 * 
 * Configuration Options:
 * - Name: Identifier for the node
 * - Description: Optional explanation of parallel execution
 * - Branches: Number and configuration of parallel paths
 * - Join Strategy: How to handle completion of parallel branches
 * - Timeout: Maximum time to wait for all branches
 * - Error Handling: Behavior when branches fail
 * 
 * Usage:
 * - Improve workflow performance by executing independent tasks simultaneously
 * - Process collections of items in parallel
 * - Implement fan-out/fan-in patterns
 * - Execute different operations on the same data concurrently
 * - Implement timeout patterns for long-running operations
 */

export interface ParallelNodeConfig {
  name: string;
  description?: string;
  branchType: 'static' | 'dynamic' | 'forEach';
  branches?: Array<{
    id: string;
    name: string;
    description?: string;
  }>;
  dynamicBranching?: {
    sourceCollection: string;
    maxConcurrency?: number;
    itemVariable: string;
    indexVariable?: string;
  };
  joinStrategy: {
    type: 'waitAll' | 'waitAny' | 'noWait' | 'custom';
    timeout?: number; // in seconds
    timeoutAction?: 'abort' | 'continue';
    customRule?: string; // e.g., "wait for at least 3 branches"
  };
  errorHandling: {
    strategy: 'abortAll' | 'ignoreFailed' | 'requireAll';
    maxFailures?: number;
    aggregateErrors: boolean;
  };
  resultAggregation?: {
    enabled: boolean;
    targetVariable: string;
    aggregationType: 'array' | 'merge' | 'custom';
    customAggregator?: string; // Script for custom aggregation
  };
}
