import React from 'react';
import { Task, TaskDetail } from '../types';
import { TaskActionPanel } from './TaskActionPanel';

interface TaskDetailHeaderProps {
  task: Task;
  taskDetails?: TaskDetail;
  isLoading?: boolean;
  error?: string | null;
}

export function TaskDetailHeader({ task, taskDetails, isLoading, error }: TaskDetailHeaderProps) {
  return (
    <div className="p-6 border-b border-gray-200">
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-900">{task.title}</h2>
          <p className="text-sm text-gray-500 mt-1">
            For {task.company} • Due {task.dueDate}
          </p>
          {taskDetails && (
            <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
              <span>Status: <span className="font-medium">{task.status}</span></span>
              <span>Terms: <span className="font-medium">{taskDetails.extractedTerms.length}</span></span>
              {taskDetails.extractedTerms.filter(term => term.flag).length > 0 && (
                <span className="text-yellow-600">
                  <span className="font-medium">{taskDetails.extractedTerms.filter(term => term.flag).length}</span> flagged
                </span>
              )}
            </div>
          )}
        </div>
        <div className="flex-shrink-0 flex flex-col items-end space-y-2">
          {/* Status indicators */}
          {(isLoading || error) && (
            <div>
              {isLoading && (
                <div className="text-gray-500 text-sm">Processing...</div>
              )}
              {error && (
                <div className="text-red-600 text-sm">Error: {error}</div>
              )}
            </div>
          )}
          
          {/* Action buttons */}
          <TaskActionPanel 
            task={task}
            taskDetails={taskDetails}
            variant="inline"
          />
        </div>
      </div>
    </div>
  );
} 