import { Node, Edge } from 'reactflow';

/**
 * Node type constants
 */
export const NODE_TYPES = {
  WORKFLOW_INPUT: 'workflow-input',
  WORKFLOW_OUTPUT: 'workflow-output',
  DATA_STORE: 'data-store',
  DOCUMENT: 'document',
  INTEGRATION: 'integration',
  AI_TASK: 'ai-task',
  MANUAL_TASK: 'manual-task',
  CODE_TASK: 'code-task',
  WORKFLOW: 'workflow',
  DECISION: 'decision',
  DELAY: 'delay',
  WAIT_EVENT: 'wait-event',
} as const;

/**
 * Display names for node types
 */
export const NODE_TYPE_DISPLAY_NAMES: Record<NodeType, string> = {
  [NODE_TYPES.WORKFLOW_INPUT]: 'Workflow Input',
  [NODE_TYPES.WORKFLOW_OUTPUT]: 'Workflow Output',
  [NODE_TYPES.DATA_STORE]: 'Data Store',
  [NODE_TYPES.DOCUMENT]: 'Document',
  [NODE_TYPES.INTEGRATION]: 'Integration',
  [NODE_TYPES.AI_TASK]: 'AI Task',
  [NODE_TYPES.MANUAL_TASK]: 'Manual Task',
  [NODE_TYPES.CODE_TASK]: 'Code Task',
  [NODE_TYPES.WORKFLOW]: 'Workflow',
  [NODE_TYPES.DECISION]: 'Decision',
  [NODE_TYPES.DELAY]: 'Delay',
  [NODE_TYPES.WAIT_EVENT]: 'Wait Event',
};

/**
 * Node type enumeration
 */
export type NodeType = typeof NODE_TYPES[keyof typeof NODE_TYPES];

/**
 * Represents a single field in an input or output schema
 */
export interface SchemaField {
  id: string;
  name: string;
  dataType: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'uuid';
  source?: string; // Optional source field ID
  optional?: boolean; // Optional flag
  description?: string; // <-- Add optional description
}

// --- Specific Config Interfaces ---

// Branch type (moved from CollapsibleBranchSection)
export interface Branch {
  id: string;
  name: string;
  color: string;
  condition: string;
}

// Config for Data Store nodes
export type DataStoreAction = 'insert' | 'update' | 'archive' | 'get';
export interface DataStoreNodeConfig {
  schema?: string;
  table?: string;
  action?: DataStoreAction | '';
  mappings?: Record<string, string>;
  filterColumn?: string;
  filterValue?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  limit?: number;
}

// Config for Code Task nodes
export interface CodeTaskNodeConfig {
  language?: 'javascript' | 'python' | 'typescript';
  code?: string;
}

/**
 * Base configuration for nodes representing external integrations.
 */
export interface BaseIntegrationConfig {
  integration_definition_id: string; // ID of the integration definition
  method_id: string; // ID of the specific method in the definition
  integration_instance_id?: string; // Optional: ID of the configured instance
  [key: string]: unknown;
}

// --- Base NodeData (Common fields) ---
export interface BaseNodeData {
  label: string;
  sublabel?: string;
  type: NodeType;
  hasMenu?: boolean;
  description?: string;
  input_schema?: SchemaField[];
  output_schema?: SchemaField[];
  branches?: Branch[]; // ADDED: Optional top-level branches
}

// --- Enums for Manual Tasks ---
export enum AssigneeType {
  USER = 'USER',
  ROLE = 'ROLE',
  GROUP = 'GROUP',
  DYNAMIC_RULE = 'DYNAMIC_RULE', // e.g., based on workflow data
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}
// --- End Enums ---

// --- Configuration specific to Manual Tasks ---
export interface ManualTaskConfig {
  // Who performs the task
  assignment: {
    type: AssigneeType;
    /** IDs of users, roles, or groups based on type */
    assignees: string[];
    /** Optional expression for dynamic assignment (e.g., "${workflow.input.managerId}") */
    rule?: string;
  };

  // What the user sees and does
  /** Instructions displayed to the assignee */
  instructions: string;
  /** ID of the UI Component definition to render for this task */
  uiComponentId: string;
  /** List of allowed action keys (e.g., 'APPROVE', 'REJECT', 'REQUEST_INFO') */
  allowedActions: string[];

  // Task metadata & behaviour
  /** Priority of the task */
  priority: TaskPriority;
  /** Optional duration after assignment before task is due (ISO 8601 duration format, e.g., "P3D" for 3 days) */
  dueDuration?: string;
  /** Optional ID of an escalation policy to apply if overdue */
  escalationPolicyId?: string;
  /** Optional flag to allow reassignment */
  allowReassignment?: boolean;
  /** Optional flag to allow delegation */
  allowDelegation?: boolean;
}

// --- Specific Node Data Interfaces (with explicit config types) ---

/**
 * Input node data
 */
export interface InputNodeData extends BaseNodeData {
  type: typeof NODE_TYPES.WORKFLOW_INPUT;
  config?: never; // Explicitly no config
}

/**
 * Output node data
 */
export interface OutputNodeData extends BaseNodeData {
  type: typeof NODE_TYPES.WORKFLOW_OUTPUT;
  config?: never; // Explicitly no config
}

/**
 * Data store node data
 */
export interface DataStoreNodeData extends BaseNodeData {
  type: typeof NODE_TYPES.DATA_STORE;
  config: DataStoreNodeConfig; // Use specific config type
}

/**
 * AI task node data
 */
export interface AITaskNodeData extends BaseNodeData {
  type: typeof NODE_TYPES.AI_TASK;
  config: BaseIntegrationConfig; // Use base integration config like other integrations
}

/**
 * Code task node data
 */
export interface CodeTaskNodeData extends BaseNodeData {
  type: typeof NODE_TYPES.CODE_TASK;
  config: CodeTaskNodeConfig; // Use specific config type
}

/**
 * Decision node data
 */
export interface DecisionNodeData extends BaseNodeData {
  type: typeof NODE_TYPES.DECISION;
  config?: never; // Explicitly NO config allowed for Decision nodes
  // branches is inherited from BaseNodeData
}

/**
 * Integration node data
 */
export interface IntegrationNodeData extends BaseNodeData {
  type: typeof NODE_TYPES.INTEGRATION;
  config: BaseIntegrationConfig; // Contains integration_id, connection_id, etc.
  icon_url?: string; // Optional URL for the integration's icon
}

/**
 * Manual Task node data
 */
export interface ManualTaskNodeData extends BaseNodeData {
  type: typeof NODE_TYPES.MANUAL_TASK;
  config: ManualTaskConfig; // Use specific config type
}

/**
 * Delay node data
 */
export interface DelayNodeData extends BaseNodeData {
  type: typeof NODE_TYPES.DELAY;
  config?: Record<string, unknown>; // TEMPORARY placeholder
}

/**
 * Wait Event node data
 */
export interface WaitEventNodeData extends BaseNodeData {
  type: typeof NODE_TYPES.WAIT_EVENT;
  config?: Record<string, unknown>; // TEMPORARY placeholder
}

/**
 * Document node data
 */
export interface DocumentNodeData extends BaseNodeData {
  type: typeof NODE_TYPES.DOCUMENT;
  config: BaseIntegrationConfig; // Assuming external document service uses integration system
}

// Workflow Node Type (if not defined elsewhere)
export interface WorkflowNodeData extends BaseNodeData {
    type: typeof NODE_TYPES.WORKFLOW;
    config?: Record<string, unknown>; // TEMPORARY placeholder for sub-workflow config
}

/**
 * Union type for all node data types (Updated)
 */
export type NodeData = 
  | InputNodeData
  | OutputNodeData
  | DataStoreNodeData 
  | AITaskNodeData
  | CodeTaskNodeData
  | DecisionNodeData
  | IntegrationNodeData
  | ManualTaskNodeData
  | DelayNodeData
  | WaitEventNodeData
  | DocumentNodeData
  | WorkflowNodeData; // Added Workflow Node

/**
 * Workflow type
 */
export interface Workflow {
  id: string;
  name: string;
  folder?: string; // UI-friendly folder name (derived)
  workflow_folder_id: string; // Actual FK relationship
  description?: string | null;
  nodes: Node<NodeData>[];
  edges: Edge[];
  created_at?: string | null;
  updated_at?: string | null;
  input_schema?: SchemaField[] | null;
  output_schema?: SchemaField[] | null;
}