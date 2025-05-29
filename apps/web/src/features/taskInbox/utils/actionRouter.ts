import { TaskActionHandler, TaskActionContext } from '../hooks/useTaskActions';

export interface ActionRouterConfig {
  // Core handlers for different action types
  handlers: Map<string, TaskActionHandler>;
  
  // Middleware functions that run before/after actions
  middleware?: ActionMiddleware[];
  
  // Permission checker function
  permissionChecker?: (actionKey: string, context: TaskActionContext) => boolean;
  
  // Logging and analytics
  onActionStart?: (actionKey: string, context: TaskActionContext) => void;
  onActionComplete?: (actionKey: string, context: TaskActionContext, success: boolean, duration: number) => void;
  onActionError?: (actionKey: string, context: TaskActionContext, error: Error) => void;
}

export interface ActionMiddleware {
  name: string;
  before?: (actionKey: string, context: TaskActionContext, data?: unknown) => Promise<unknown> | unknown;
  after?: (actionKey: string, context: TaskActionContext, result: unknown, data?: unknown) => Promise<void> | void;
  onError?: (actionKey: string, context: TaskActionContext, error: Error, data?: unknown) => Promise<void> | void;
}

export interface ActionResult {
  success: boolean;
  data?: unknown;
  error?: string;
  warnings?: string[];
}

export class ActionRouter {
  private config: ActionRouterConfig;
  private handlers: Map<string, TaskActionHandler>;

  constructor(config: ActionRouterConfig) {
    this.config = config;
    this.handlers = new Map(config.handlers);
  }

  /**
   * Register a new action handler
   */
  registerHandler(actionKey: string, handler: TaskActionHandler): void {
    this.handlers.set(actionKey, handler);
  }

  /**
   * Unregister an action handler
   */
  unregisterHandler(actionKey: string): void {
    this.handlers.delete(actionKey);
  }

  /**
   * Check if an action is permitted for the given context
   */
  isActionPermitted(actionKey: string, context: TaskActionContext): boolean {
    if (!this.config.permissionChecker) {
      return true; // No permission checker means all actions are allowed
    }
    
    try {
      return this.config.permissionChecker(actionKey, context);
    } catch (error) {
      console.error(`Permission check failed for action ${actionKey}:`, error);
      return false; // Fail safe - deny access if permission check throws
    }
  }

  /**
   * Execute an action with full middleware pipeline and error handling
   */
  async executeAction(
    actionKey: string, 
    context: TaskActionContext, 
    data?: unknown
  ): Promise<ActionResult> {
    const startTime = performance.now();
    
    // Check permissions first
    if (!this.isActionPermitted(actionKey, context)) {
      const error = new Error(`Action '${actionKey}' is not permitted for this context`);
      this.config.onActionError?.(actionKey, context, error);
      return {
        success: false,
        error: 'Action not permitted'
      };
    }

    // Get the handler
    const handler = this.handlers.get(actionKey);
    if (!handler) {
      const error = new Error(`No handler registered for action: ${actionKey}`);
      this.config.onActionError?.(actionKey, context, error);
      return {
        success: false,
        error: `Unknown action: ${actionKey}`
      };
    }

    // Log action start
    this.config.onActionStart?.(actionKey, context);

    try {
      // Run before middleware
      let processedData = data;
      for (const middleware of this.config.middleware || []) {
        if (middleware.before) {
          try {
            processedData = await middleware.before(actionKey, context, processedData);
          } catch (error) {
            console.error(`Middleware ${middleware.name} before hook failed:`, error);
            // Continue execution - middleware failures should not block actions
          }
        }
      }

      // Execute the main handler
      const result = await handler(context, processedData);
      
      // Run after middleware
      for (const middleware of this.config.middleware || []) {
        if (middleware.after) {
          try {
            await middleware.after(actionKey, context, result, processedData);
          } catch (error) {
            console.error(`Middleware ${middleware.name} after hook failed:`, error);
            // Log but don't fail the action
          }
        }
      }

      const duration = performance.now() - startTime;
      this.config.onActionComplete?.(actionKey, context, true, duration);

      return {
        success: true,
        data: result
      };

    } catch (error) {
      const actionError = error instanceof Error ? error : new Error(String(error));
      const duration = performance.now() - startTime;
      
      // Run error middleware
      for (const middleware of this.config.middleware || []) {
        if (middleware.onError) {
          try {
            await middleware.onError(actionKey, context, actionError, data);
          } catch (middlewareError) {
            console.error(`Middleware ${middleware.name} error hook failed:`, middlewareError);
          }
        }
      }

      this.config.onActionError?.(actionKey, context, actionError);
      this.config.onActionComplete?.(actionKey, context, false, duration);

      return {
        success: false,
        error: actionError.message
      };
    }
  }

  /**
   * Get all registered action keys
   */
  getRegisteredActions(): string[] {
    return Array.from(this.handlers.keys());
  }

  /**
   * Check if an action handler is registered
   */
  hasHandler(actionKey: string): boolean {
    return this.handlers.has(actionKey);
  }

  /**
   * Create a bound action executor for a specific context
   * This is useful for components that need to execute multiple actions
   */
  createContextualExecutor(context: TaskActionContext) {
    return {
      execute: (actionKey: string, data?: unknown) => 
        this.executeAction(actionKey, context, data),
      
      isPermitted: (actionKey: string) => 
        this.isActionPermitted(actionKey, context),
      
      hasHandler: (actionKey: string) => 
        this.hasHandler(actionKey),
      
      context
    };
  }
}

/**
 * Default action router instance with common task actions
 */
export function createDefaultActionRouter(): ActionRouter {
  const handlers = new Map<string, TaskActionHandler>();

  // Default approve handler
  handlers.set('approve', async (context: TaskActionContext, data?: unknown) => {
    console.log('Executing approve action for task:', context.task.id);
    // In a real implementation, this would make an API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { approved: true, timestamp: new Date().toISOString() };
  });

  // Default reject handler
  handlers.set('reject', async (context: TaskActionContext, data?: unknown) => {
    console.log('Executing reject action for task:', context.task.id);
    // In a real implementation, this would make an API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { rejected: true, reason: data, timestamp: new Date().toISOString() };
  });

  // Default request review handler
  handlers.set('request_review', async (context: TaskActionContext, data?: unknown) => {
    console.log('Executing request review action for task:', context.task.id);
    // In a real implementation, this would make an API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { reviewRequested: true, reviewData: data, timestamp: new Date().toISOString() };
  });

  // Create logging middleware
  const loggingMiddleware: ActionMiddleware = {
    name: 'logging',
    before: (actionKey: string, context: TaskActionContext, data?: unknown) => {
      console.log(`[ActionRouter] Starting action: ${actionKey}`, { 
        taskId: context.task.id, 
        data 
      });
      return data;
    },
    after: (actionKey: string, context: TaskActionContext, result: unknown) => {
      console.log(`[ActionRouter] Completed action: ${actionKey}`, { 
        taskId: context.task.id, 
        result 
      });
    },
    onError: (actionKey: string, context: TaskActionContext, error: Error) => {
      console.error(`[ActionRouter] Action failed: ${actionKey}`, { 
        taskId: context.task.id, 
        error: error.message 
      });
    }
  };

  return new ActionRouter({
    handlers,
    middleware: [loggingMiddleware],
    onActionStart: (actionKey: string, context: TaskActionContext) => {
      console.log(`Action started: ${actionKey} for task ${context.task.id}`);
    },
    onActionComplete: (actionKey: string, context: TaskActionContext, success: boolean, duration: number) => {
      console.log(`Action completed: ${actionKey} for task ${context.task.id}`, { 
        success, 
        duration: `${duration.toFixed(2)}ms` 
      });
    },
    onActionError: (actionKey: string, context: TaskActionContext, error: Error) => {
      console.error(`Action error: ${actionKey} for task ${context.task.id}`, error);
    }
  });
}

/**
 * Global action router instance
 * Can be replaced with custom implementation if needed
 */
export const actionRouter = createDefaultActionRouter(); 