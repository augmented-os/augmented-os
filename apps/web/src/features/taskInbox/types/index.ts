import { Tables } from '../../../types/supabaseTypes';

// Use actual database types
export type TaskInstance = Tables<'task_instances'>;
export type TaskDefinition = Tables<'task_definitions'>;
export type UIComponent = Tables<'ui_components'>;

// Legacy types for compatibility (these should eventually be replaced)
export interface Task {
  id: number;
  title: string;
  company: string;
  type: 'term-sheet-review' | 'contract-analysis' | 'due-diligence' | 'compliance-check';
  priority: 'High' | 'Medium' | 'Low';
  dueDate: string;
  status: string;
  flags: string[];
  description: string;
}

export interface ExtractedTerm {
  term: string;
  value: string;
  standard: string;
  flag: boolean;
}

export interface TaskDetail {
  company: string;
  valuation: string;
  investment: string;
  equity: string;
  documents: string[];
  extractedTerms: ExtractedTerm[];
}

// New types for the dynamic system
export interface TaskInstanceWithDefinition extends TaskInstance {
  task_definition: TaskDefinition;
} 