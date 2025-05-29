import React from 'react';
import { TaskListItem, TaskDetails } from '../../../data/taskInstancesService';
import { DynamicUIRenderer } from '@/features/dynamicUI';

interface TaskDetailPanelProps {
  task: TaskListItem;
  taskDetails: TaskDetails;
  onAction?: (actionKey: string, data?: unknown) => void;
}

/**
 * Task Detail Panel - Now fully database-driven using Dynamic UI
 * 
 * This component replaces all hardcoded TaskSummaryCard, ExtractedTermsTable,
 * and action buttons with a single database-driven task view component that
 * orchestrates all the UI through its layout configuration.
 */
export function TaskDetailPanel({ task, taskDetails, onAction }: TaskDetailPanelProps) {
  
  // Determine the component ID based on task type
  const getComponentId = (task: TaskListItem) => {
    // Map task types to their corresponding task view components
    switch (task.type) {
      case 'term-sheet-review':
        return 'task-view-review-term-sheet';
      case 'contract-analysis':
      case 'due-diligence':
      case 'compliance-check':
        // These could have their own task view components in the future
        return 'task-view-review-term-sheet'; // Fallback for now
      default:
        // Default to the main term sheet review task view
        return 'task-view-review-term-sheet';
    }
  };

  // Prepare data for the dynamic UI component
  // This combines task data with taskDetails to provide complete context
  const prepareTaskData = (task: TaskListItem, taskDetails: TaskDetails): Record<string, unknown> => {
    const taskData = {
      // Task metadata
      taskId: task.id,
      taskType: task.type,
      taskStatus: task.status,
      taskPriority: task.priority,
      taskTitle: task.title,
      dueDate: task.dueDate,
      flags: task.flags || [],
      
      // Task details for display components (matching template expectations)
      company: taskDetails.company,
      valuation: taskDetails.valuation,
      investment: taskDetails.investment,
      equity: taskDetails.equity,
      documents: taskDetails.documents || [],
      extractedTerms: taskDetails.extractedTerms || [],
      
      // Additional context
      description: task.description,
    };
    
    // Debug logging to see data structure
    console.log('prepareTaskData result:', {
      taskId: task.id,
      company: taskDetails.company,
      extractedTermsCount: taskDetails.extractedTerms?.length || 0,
      extractedTermsPreview: taskDetails.extractedTerms?.slice(0, 2),
      taskData
    });
    
    return taskData;
  };

  const componentId = getComponentId(task);
  const taskData = prepareTaskData(task, taskDetails);

  // Debug logging
  console.log('TaskDetailPanel Debug:', {
    componentId,
    taskType: task.type,
    taskData,
    taskDetails
  });

  const handleAction = (actionKey: string, data?: unknown) => {
    console.log(`Task ${task.id} action executed:`, { actionKey, data, taskType: task.type });
    
    // Ensure data is an object before spreading, otherwise create a new object
    const actionData = typeof data === 'object' && data !== null ? 
      { ...data as Record<string, unknown>, taskId: task.id, originalTaskData: taskData } :
      { taskId: task.id, originalTaskData: taskData, actionData: data };
      
    onAction?.(actionKey, actionData);
  };

  return (
    <div className="w-full h-full bg-white overflow-y-auto">
      {/* 
        Single Dynamic UI Renderer that handles the entire task view
        The task-view-review-term-sheet component orchestrates:
        - TaskSummaryCard (via term-sheet-summary component)
        - ExtractedTermsTable (via extracted-terms-table component) 
        - Review Form (via task-review-form component)
        - Action Buttons (via task-action-buttons component)
        All layout is defined in the database schema
      */}
      <DynamicUIRenderer
        componentId={componentId}
        data={taskData}
        onAction={handleAction}
        className="w-full h-full"
      />
    </div>
  );
}