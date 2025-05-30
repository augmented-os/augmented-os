import { supabase } from '@/integrations/supabase/client';
import { Tables } from '../types/supabaseTypes';
import { FlagType } from '@/features/taskInbox/types';

// Use the correct type references
export type TaskInstance = Tables<'task_instances'>;
export type TaskDefinition = Tables<'task_definitions'>;

export interface TaskListItem {
  id: string;
  title: string;
  company: string;
  type: string;
  priority: string;
  dueDate: string;
  status: string;
  flags: string[];
  description: string;
}

export interface TaskDetails {
  company: string;
  valuation: string;
  investment: string;
  equity: string;
  documents: string[];
  extractedTerms: {
    term: string;
    value: string;
    standard: string;
    status: string; // Business-meaningful status value
  }[];
}

/**
 * Fetch all task instances with basic information for the task list
 */
export async function fetchTaskInstances(): Promise<TaskListItem[]> {
  const { data, error } = await supabase
    .from('task_instances')
    .select(`
      id,
      status,
      priority,
      created_at,
      updated_at,
      execution_metadata,
      input,
      task_definition:task_definition_id (
        name,
        description,
        task_id
      )
    `)
    .eq('type', 'MANUAL')
    .eq('status', 'ASSIGNED')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching task instances:', error);
    throw error;
  }

  // Transform database data to TaskListItem format
  return data.map(task => {
    const submissionData = task.input?.submissionData || {};
    const businessContext = task.execution_metadata?.businessContext || {};
    const slaDeadline = task.execution_metadata?.slaDeadline;
    const taskDef = task.task_definition as any; // Cast to avoid type issues with joined data

    return {
      id: task.id,
      title: taskDef?.name || 'Untitled Task',
      company: submissionData.company || 'Unknown Company',
      type: getTaskTypeFromTaskId(taskDef?.task_id || ''),
      priority: task.priority,
      dueDate: slaDeadline ? new Date(slaDeadline).toLocaleDateString() : 'No due date',
      status: task.status,
      flags: extractFlags(task.input?.submissionData?.extractedTerms || []),
      description: taskDef?.description || 'No description available'
    };
  });
}

/**
 * Fetch detailed information for a specific task instance
 */
export async function fetchTaskDetails(taskId: string): Promise<TaskDetails | null> {
  const { data, error } = await supabase
    .from('task_instances')
    .select(`
      id,
      input,
      output,
      execution_metadata,
      task_definition:task_definition_id (
        name,
        description
      )
    `)
    .eq('id', taskId)
    .single();

  if (error) {
    console.error('Error fetching task details:', error);
    return null;
  }

  if (!data) {
    return null;
  }

  // Extract submission data from the task input
  const submissionData = data.input?.submissionData || {};

  return {
    company: submissionData.company || 'Unknown Company',
    valuation: submissionData.valuation || 'Unknown',
    investment: submissionData.investment || 'Unknown',
    equity: submissionData.equity || 'Unknown',
    documents: submissionData.documents || [],
    extractedTerms: submissionData.extractedTerms || []
  };
}

/**
 * Map task_id to user-friendly task type
 */
function getTaskTypeFromTaskId(taskId: string): string {
  const taskTypeMap: Record<string, string> = {
    'review-term-sheet': 'term-sheet-review',
    'review-contract': 'contract-analysis',
    'due-diligence': 'due-diligence',
    'compliance-check': 'compliance-check'
  };

  return taskTypeMap[taskId] || 'term-sheet-review';
}

/**
 * Extract flags from extracted terms
 */
function extractFlags(extractedTerms: any[]): string[] {
  if (!Array.isArray(extractedTerms)) {
    return [];
  }

  const flags: string[] = [];
  
  extractedTerms.forEach(term => {
    if (term.status === 'Non-standard' || term.status === 'Violation') {
      flags.push(`${term.term}: ${term.value}`);
    }
  });

  return flags;
}

/**
 * Update task status or output
 */
export async function updateTaskInstance(taskId: string, updates: {
  status?: string;
  output?: any;
  error?: any;
}) {
  const { data, error } = await supabase
    .from('task_instances')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', taskId)
    .select()
    .single();

  if (error) {
    console.error('Error updating task instance:', error);
    throw error;
  }

  return data;
} 