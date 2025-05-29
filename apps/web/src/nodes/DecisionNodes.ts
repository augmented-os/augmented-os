
/**
 * Decision Nodes
 * 
 * Purpose:
 * Nodes for conditional branching in workflows that evaluate expressions
 * or rules against workflow data to determine the execution path.
 * 
 * Configuration Options:
 * - Name: Identifier for the node
 * - Description: Optional explanation of the decision logic
 * - Condition Type: Expression, Rule-based, ML model
 * - Conditions: Logic to evaluate
 * - Branches: Possible execution paths based on condition outcomes
 * - Default Branch: Path to take if no conditions match
 * 
 * Usage:
 * - Route workflows based on data values
 * - Implement business rules and policies
 * - Handle different scenarios or use cases
 * - Create if-then-else logic within workflows
 * - Enable dynamic workflow behavior based on context
 */

export interface DecisionNodeConfig {
  name: string;
  description?: string;
  conditionType: 'expression' | 'rules' | 'script' | 'ml';
  evaluation: {
    // For expression-based
    expression?: string;
    
    // For rule-based
    rules?: Array<{
      condition: string;
      outcome: string;
      priority?: number;
    }>;
    
    // For script-based
    script?: string;
    scriptLanguage?: 'javascript' | 'python';
    
    // For ML-based
    model?: string;
    modelInput?: Record<string, string>;
    thresholds?: Record<string, number>;
  };
  branches: Array<{
    id: string;
    name: string;
    description?: string;
    condition: string;
    priority: number;
  }>;
  defaultBranch: string;
  dynamicBranches?: {
    enabled: boolean;
    sourceVariable: string;
    keyProperty?: string;
    valueProperty?: string;
  };
}
