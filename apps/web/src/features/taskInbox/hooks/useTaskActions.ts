import { useCallback, useState } from 'react';
import { TableDataItem } from '../types';
import { useSchema } from '../../dynamicUI/hooks/useSchema';
import { TASK_ACTION_BUTTONS_ID } from '../constants/schemaIds';

interface TaskActionState {
  isLoading: boolean;
  error: string | null;
  currentAction: string | null;
}

export interface TaskActionContext {
  task: TableDataItem;
  taskDetails?: TableDataItem;
}

export interface TaskActionHandler {
  (context: TaskActionContext, data?: unknown): Promise<unknown> | unknown;
}

interface TaskActionHandlers {
  [actionKey: string]: TaskActionHandler;
}

interface UseTaskActionsOptions {
  onActionComplete?: (actionKey: string, success: boolean) => void;
  onError?: (error: string, actionKey: string) => void;
}

export function useTaskActions(
  context: TaskActionContext,
  handlers: TaskActionHandlers = {},
  options: UseTaskActionsOptions = {}
) {
  const [actionState, setActionState] = useState<TaskActionState>({
    isLoading: false,
    error: null,
    currentAction: null,
  });

  // Fetch action schema from database
  const { 
    data: actionSchema, 
    isLoading: isLoadingSchema, 
    error: schemaError 
  } = useSchema(TASK_ACTION_BUTTONS_ID);

  // Get available actions based on task state and schema
  const getAvailableActions = useCallback(() => {
    if (!actionSchema?.actions) return [];
    
    return actionSchema.actions.filter(action => {
      // Check if action should be visible based on task state
      if (action.visibleIf) {
        try {
          // Create a context with safely accessed properties from universal data
          const visibilityContext = {
            task: context.task,
            taskDetails: context.taskDetails,
            taskStatus: typeof context.task.status === 'string' ? context.task.status : null,
            taskPriority: typeof context.task.priority === 'string' ? context.task.priority : null,
            taskType: typeof context.task.type === 'string' ? context.task.type : null,
          };
          
          // Simple visibility evaluation - can be enhanced later
          const visibilityFunction = new Function(
            'task', 'taskDetails', 'taskStatus', 'taskPriority', 'taskType',
            `return ${action.visibleIf}`
          );
          return visibilityFunction(
            visibilityContext.task,
            visibilityContext.taskDetails,
            visibilityContext.taskStatus,
            visibilityContext.taskPriority,
            visibilityContext.taskType
          );
        } catch (error) {
          console.warn(`Invalid visibleIf condition for action ${action.actionKey}:`, error);
          return true; // Show by default if condition fails
        }
      }
      return !action.disabled;
    });
  }, [actionSchema, context.task, context.taskDetails]);

  // Default approve handler
  const defaultApproveHandler = async (
    context: TaskActionContext, 
    actionData?: unknown
  ): Promise<unknown> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    const taskId = typeof context.task.id === 'number' ? context.task.id : 'unknown';
    console.log('Task approved:', taskId, actionData);
    return { approved: true, timestamp: new Date().toISOString() };
  };

  // Default reject handler
  const defaultRejectHandler = async (
    context: TaskActionContext, 
    actionData?: unknown
  ): Promise<unknown> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    const taskId = typeof context.task.id === 'number' ? context.task.id : 'unknown';
    console.log('Task rejected:', taskId, actionData);
    return { rejected: true, reason: actionData, timestamp: new Date().toISOString() };
  };

  // Default request review handler
  const defaultRequestReviewHandler = async (
    context: TaskActionContext, 
    actionData?: unknown
  ): Promise<unknown> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    const taskId = typeof context.task.id === 'number' ? context.task.id : 'unknown';
    console.log('Review requested for task:', taskId, actionData);
    return { reviewRequested: true, reviewData: actionData, timestamp: new Date().toISOString() };
  };

  // Default action implementations
  const executeDefaultAction = useCallback(async (actionKey: string, actionData?: unknown): Promise<void> => {
    switch (actionKey) {
      case 'approve':
        await defaultApproveHandler(context, actionData);
        break;
      case 'reject':
        await defaultRejectHandler(context, actionData);
        break;
      case 'request_review':
        await defaultRequestReviewHandler(context, actionData);
        break;
      default:
        throw new Error(`No handler found for action: ${actionKey}`);
    }
  }, [context]);

  // Execute a task action through the dynamic action system
  const executeAction = useCallback(async (
    actionKey: string, 
    actionData?: unknown
  ): Promise<void> => {
    if (actionState.isLoading) {
      console.warn('Action already in progress, ignoring duplicate request');
      return;
    }

    setActionState({
      isLoading: true,
      error: null,
      currentAction: actionKey,
    });

    try {
      // Look for registered handler first
      const handler = handlers[actionKey];
      if (handler) {
        await handler(context, actionData);
      } else {
        // Default handlers for common actions
        await executeDefaultAction(actionKey, actionData);
      }

      setActionState({
        isLoading: false,
        error: null,
        currentAction: null,
      });

      options.onActionComplete?.(actionKey, true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      setActionState({
        isLoading: false,
        error: errorMessage,
        currentAction: null,
      });

      options.onError?.(errorMessage, actionKey);
      options.onActionComplete?.(actionKey, false);
    }
  }, [actionState.isLoading, handlers, context, options, executeDefaultAction]);

  // Check if an action is available and enabled
  const isActionAvailable = useCallback((actionKey: string): boolean => {
    const availableActions = getAvailableActions();
    return availableActions.some(action => action.actionKey === actionKey);
  }, [getAvailableActions]);

  // Get action configuration from schema
  const getActionConfig = useCallback((actionKey: string) => {
    if (!actionSchema?.actions) return null;
    return actionSchema.actions.find(action => action.actionKey === actionKey) || null;
  }, [actionSchema]);

  // Clear any errors
  const clearError = useCallback(() => {
    setActionState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    // State
    ...actionState,
    isLoadingSchema,
    schemaError,
    
    // Actions
    executeAction,
    clearError,
    
    // Computed properties
    availableActions: getAvailableActions(),
    isActionAvailable,
    getActionConfig,
    
    // Schema
    actionSchema,
  };
} 