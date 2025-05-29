
/**
 * Code Task Nodes
 * 
 * Purpose:
 * Nodes for script-based automation that allow users to write and execute
 * custom code within the workflow. Supported languages include JavaScript,
 * Python, and other common scripting languages.
 * 
 * Configuration Options:
 * - Name: Identifier for the node
 * - Description: Optional explanation of the code's purpose
 * - Runtime: The execution environment (e.g., Node.js, Python)
 * - Input/Output variables: Data mapping before and after code execution
 * - Timeout: Maximum execution time
 * - Code: The actual script to be executed
 * - Environment variables: Runtime configuration
 * 
 * Usage:
 * - Process and transform data flowing through the workflow
 * - Implement custom business logic
 * - Perform calculations or data validation
 * - Integrate with systems that don't have dedicated nodes
 */

export interface CodeTaskNodeConfig {
  name: string;
  description?: string;
  runtime: 'nodejs' | 'python' | 'bash';
  runtimeVersion?: string;
  timeout: number; // in seconds
  code: string;
  inputMapping: Record<string, string>; // Maps workflow variables to code inputs
  outputMapping: Record<string, string>; // Maps code outputs to workflow variables
  environmentVariables?: Record<string, string>;
  memoryLimit?: number; // in MB
  retry?: {
    maxAttempts: number;
    backoffMultiplier: number;
  };
}
