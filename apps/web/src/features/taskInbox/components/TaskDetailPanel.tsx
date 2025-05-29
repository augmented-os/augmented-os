import React from 'react';
import { Task, TaskDetail } from '../types';
import { TaskDetailHeader } from './TaskDetailHeader';
import { TaskSummaryCard } from './TaskSummaryCard';
import { DynamicDisplay } from '../../dynamicUI/components/DynamicDisplay';
import { useTaskActions } from '../hooks/useTaskActions';
import { EXTRACTED_TERMS_TABLE_ID } from '../constants/schemaIds';

interface TaskDetailPanelProps {
  task: Task;
  taskDetails: TaskDetail;
}

export function TaskDetailPanel({ task, taskDetails }: TaskDetailPanelProps) {
  // Initialize the task actions hook with proper parameters
  const taskActions = useTaskActions(
    { task, taskDetails }, // context
    {}, // handlers (empty, will use defaults)
    {} // options
  );

  return (
    <div className="w-full h-full bg-white overflow-y-auto">
      <TaskDetailHeader 
        task={task} 
        taskDetails={taskDetails}
        isLoading={taskActions.isLoading}
        error={taskActions.error}
      />
      
      <div className="p-6">
        <TaskSummaryCard taskDetails={taskDetails} />
        
        {/* Dynamic extracted terms display */}
        <div className="mb-6">
          <DynamicDisplay
            componentId={EXTRACTED_TERMS_TABLE_ID}
            data={{ extractedTerms: taskDetails.extractedTerms } as Record<string, unknown>}
          />
        </div>
      </div>
    </div>
  );
}