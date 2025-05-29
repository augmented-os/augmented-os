import React from 'react';
import { Task, TaskDetail } from '../types';
import { DynamicDisplay } from '../../dynamicUI/components/DynamicDisplay';
import { useSchema } from '../../dynamicUI/hooks/useSchema';
import { useTaskActions } from '../hooks/useTaskActions';
import { TASK_ACTION_BUTTONS_ID } from '../constants/schemaIds';

interface TaskActionPanelProps {
  task: Task;
  taskDetails?: TaskDetail;
  onAction?: (actionKey: string, data?: unknown) => void;
  className?: string;
  variant?: 'inline' | 'panel' | 'floating';
}

export function TaskActionPanel({ 
  task, 
  taskDetails, 
  onAction,
  className = '',
  variant = 'inline'
}: TaskActionPanelProps) {
  const { data: schema, isLoading: schemaLoading, error: schemaError } = useSchema(TASK_ACTION_BUTTONS_ID);
  
  const taskActionContext = { task, taskDetails };
  const {
    isLoading: actionLoading,
    error: actionError,
    availableActions,
    isActionAvailable,
    getActionConfig,
  } = useTaskActions(taskActionContext);

  const isLoading = schemaLoading || actionLoading;
  const error = actionError || schemaError?.message;

  const handleAction = (actionKey: string, data?: unknown) => {
    // Call external handler if provided, otherwise handle internally
    if (onAction) {
      onAction(actionKey, data);
    } else {
      console.warn(`No action handler provided for action: ${actionKey}`);
    }
  };

  // Filter schema actions to only show available ones
  const getFilteredSchema = () => {
    if (!schema || !schema.actions) return schema;
    
    const filteredActions = schema.actions.filter(action => 
      isActionAvailable(action.actionKey)
    );
    
    return {
      ...schema,
      actions: filteredActions
    };
  };

  // Get variant-specific styling
  const getVariantClasses = () => {
    switch (variant) {
      case 'panel':
        return 'p-4 bg-white border border-gray-200 rounded-lg shadow-sm';
      case 'floating':
        return 'fixed bottom-4 right-4 p-3 bg-white border border-gray-200 rounded-lg shadow-lg z-50';
      case 'inline':
      default:
        return 'flex items-center space-x-3';
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className={`task-action-panel ${getVariantClasses()} ${className}`}>
        <div className="text-gray-500 text-sm">Loading actions...</div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className={`task-action-panel ${getVariantClasses()} ${className}`}>
        <div className="text-red-600 text-sm">Error loading actions: {error}</div>
      </div>
    );
  }

  // Show fallback if no schema available
  if (!schema) {
    return (
      <div className={`task-action-panel ${getVariantClasses()} ${className}`}>
        <FallbackActionButtons 
          task={task} 
          onAction={handleAction}
          variant={variant}
        />
      </div>
    );
  }

  const filteredSchema = getFilteredSchema();

  // Don't render if no actions are available
  if (!filteredSchema.actions || filteredSchema.actions.length === 0) {
    return null;
  }

  return (
    <div className={`task-action-panel ${getVariantClasses()} ${className}`}>
      <DynamicDisplay
        schema={filteredSchema}
        data={{ 
          taskStatus: task.status,
          taskId: task.id,
          company: task.company,
          hasNonStandardTerms: taskDetails?.extractedTerms?.some(term => term.flag) || false,
          nonStandardTermsCount: taskDetails?.extractedTerms?.filter(term => term.flag).length || 0
        } as Record<string, unknown>}
        onAction={handleAction}
      />
    </div>
  );
}

// Fallback action buttons for when schema is not available
interface FallbackActionButtonsProps {
  task: Task;
  onAction: (actionKey: string, data?: unknown) => void;
  variant: 'inline' | 'panel' | 'floating';
}

function FallbackActionButtons({ task, onAction, variant }: FallbackActionButtonsProps) {
  const buttonClasses = variant === 'inline' 
    ? "px-4 py-2 text-sm font-medium rounded-md border"
    : "w-full px-4 py-2 text-sm font-medium rounded-md border mb-2 last:mb-0";

  const primaryClasses = `${buttonClasses} bg-blue-600 text-white border-transparent hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500`;
  const secondaryClasses = `${buttonClasses} bg-white text-gray-700 border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500`;

  return (
    <div className={variant === 'inline' ? 'flex space-x-3' : 'flex flex-col'}>
      <button 
        className={secondaryClasses}
        onClick={() => onAction('request_review')}
      >
        Request Review
      </button>
      <button 
        className={primaryClasses}
        onClick={() => onAction('approve')}
      >
        Approve
      </button>
      {task.status === 'pending' && (
        <button 
          className={`${buttonClasses} bg-red-600 text-white border-transparent hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500`}
          onClick={() => onAction('reject')}
        >
          Reject
        </button>
      )}
    </div>
  );
} 