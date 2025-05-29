
/**
 * Human Task Nodes
 * 
 * Purpose:
 * Nodes for manual intervention steps that pause workflow execution until
 * a human user completes a specified task or provides input.
 * 
 * Configuration Options:
 * - Name: Identifier for the node
 * - Description: Instructions for the human performer
 * - Assignees: Users or roles that can complete the task
 * - Form Fields: Data to collect from users
 * - Due Date: Optional deadline for task completion
 * - Escalation Rules: Actions to take if task is not completed
 * - Approval Requirements: Single approver or multiple approvals
 * 
 * Usage:
 * - Approval workflows (document reviews, expense approvals)
 * - Data collection requiring human input
 * - Decision points requiring human judgment
 * - Exception handling for scenarios requiring manual intervention
 * - Quality control and verification steps
 */

export interface HumanTaskNodeConfig {
  name: string;
  description: string;
  taskType: 'approval' | 'dataEntry' | 'decision' | 'review';
  assignment: {
    type: 'user' | 'role' | 'group';
    assignees: string[];
    assignmentRule?: string; // For dynamic assignment
    reassignmentAllowed: boolean;
  };
  form?: {
    fields: Array<{
      id: string;
      label: string;
      type: 'text' | 'number' | 'date' | 'select' | 'checkbox' | 'file';
      required: boolean;
      options?: string[]; // For select fields
      validation?: string; // Validation rules
      defaultValue?: any;
    }>;
  };
  timeConstraints?: {
    dueDate?: string | number; // ISO date string or relative time in minutes
    reminder?: {
      enabled: boolean;
      frequency: number; // in minutes
      maxReminders: number;
    };
    escalation?: {
      after: number; // in minutes
      to: string[];
      action: 'notify' | 'reassign' | 'autoApprove' | 'autoReject';
    };
  };
  approvalRequirements?: {
    type: 'anyOne' | 'majority' | 'everyone' | 'sequential';
    minApprovers?: number;
    sequence?: string[]; // For sequential approvals
  };
  outcomes: Array<{
    id: string;
    label: string;
    value: any;
  }>;
}
