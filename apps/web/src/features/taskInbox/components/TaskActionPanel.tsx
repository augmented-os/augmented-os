import React from 'react';
import { TableDataItem } from '../types';
import { DynamicDisplay } from '../../dynamicUI/components/DynamicDisplay';
import { useSchema } from '../../dynamicUI/hooks/useSchema';
import { useTaskActions } from '../hooks/useTaskActions';
import { TASK_ACTION_BUTTONS_ID } from '../constants/schemaIds';

interface TaskActionPanelProps {
  task: TableDataItem;
  taskDetails?: TableDataItem;
  onAction?: (actionKey: string, data?: unknown) => void;
  className?: string;
  variant?: 'inline' | 'standalone';
}

export function TaskActionPanel({ 
  task, 
  taskDetails, 
  onAction,
  className = '',
  variant = 'inline'
}: TaskActionPanelProps) {
  const { data: schema, isLoading: schemaLoading, error: schemaError } = useSchema(TASK_ACTION_BUTTONS_ID);
  
  // Use the unified task actions hook
  const taskActionContext = { task, taskDetails };
  const { 
    isLoading: actionLoading, 
    error: actionError, 
    availableActions,
    isActionAvailable
  } = useTaskActions(taskActionContext);

  const isLoading = actionLoading || schemaLoading;
  const error = actionError || schemaError?.message;

  const handleAction = (actionKey: string, data?: unknown) => {
    onAction?.(actionKey, data);
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

  const getVariantClasses = () => {
    switch (variant) {
      case 'standalone':
        return 'p-4 bg-white border border-gray-200 rounded-lg shadow-sm';
      case 'inline':
      default:
        return 'flex items-center space-x-2';
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
          hasNonStandardTerms: Array.isArray(taskDetails?.extractedTerms) && 
            (taskDetails.extractedTerms as Array<Record<string, unknown>>).some(term => 
              typeof term.status === 'string' && (term.status === 'Non-standard' || term.status === 'Violation')
            ),
          nonStandardTermsCount: Array.isArray(taskDetails?.extractedTerms) ? 
            (taskDetails.extractedTerms as Array<Record<string, unknown>>).filter(term => 
              typeof term.status === 'string' && (term.status === 'Non-standard' || term.status === 'Violation')
            ).length : 0
        } as Record<string, unknown>}
        onAction={handleAction}
      />
    </div>
  );
}

// Fallback action buttons for when schema is not available
interface FallbackActionButtonsProps {
  task: TableDataItem;
  onAction: (actionKey: string, data?: unknown) => void;
  variant: 'inline' | 'standalone';
}

function FallbackActionButtons({ task, onAction, variant }: FallbackActionButtonsProps) {
  const buttonClass = variant === 'inline' 
    ? 'px-3 py-1 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
    : 'px-4 py-2 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50';

  return (
    <div className={variant === 'inline' ? 'flex space-x-2' : 'flex flex-col space-y-2'}>
      <button
        onClick={() => onAction('approve')}
        className={`${buttonClass} border-green-300 text-green-700 hover:bg-green-50`}
      >
        Approve
      </button>
      <button
        onClick={() => onAction('reject')}
        className={`${buttonClass} border-red-300 text-red-700 hover:bg-red-50`}
      >
        Reject
      </button>
      <button
        onClick={() => onAction('request_review')}
        className={buttonClass}
      >
        Request Review
      </button>
    </div>
  );
} 