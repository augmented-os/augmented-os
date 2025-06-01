import { TableDataItem } from './';

/**
 * Core action types supported by the task inbox system
 */
export type TaskActionType = 
  | 'approve'
  | 'reject' 
  | 'request_review'
  | 'send_review_request'
  | 'forward'
  | 'archive'
  | 'reassign'
  | 'comment'
  | 'flag'
  | 'unflag';

/**
 * Context information available to action handlers
 */
export interface TaskActionContext {
  task: TableDataItem;
  taskDetails?: TableDataItem;
  userId?: string;
  userRole?: string;
  permissions?: string[];
}

/**
 * Data that can be passed to action handlers
 */
export interface TaskActionData {
  // Common fields
  reason?: string;
  comment?: string;
  
  // Approval/rejection specific
  approvalNotes?: string;
  rejectionReason?: string;
  
  // Review request specific
  recipient?: string;
  subject?: string;
  message?: string;
  attachDocument?: boolean;
  reviewerIds?: string[];
  
  // Forward/reassign specific
  targetUserId?: string;
  targetTeam?: string;
  notes?: string;
  
  // Generic data for custom actions
  [key: string]: unknown;
}

/**
 * Result returned by action handlers
 */
export interface TaskActionResult {
  success: boolean;
  data?: unknown;
  error?: string;
  warnings?: string[];
  nextActions?: string[];
  metadata?: Record<string, unknown>;
}

/**
 * Handler function signature for task actions
 */
export interface TaskActionHandler {
  (context: TaskActionContext, data?: TaskActionData): Promise<TaskActionResult> | TaskActionResult;
}

/**
 * Registry of action handlers keyed by action type
 */
export interface TaskActionHandlerRegistry {
  [actionType: string]: TaskActionHandler;
}

/**
 * Configuration for action permissions and validation
 */
export interface TaskActionPermission {
  actionType: string;
  requiredRoles?: string[];
  requiredPermissions?: string[];
  taskStatusConstraints?: string[];
  customValidator?: (context: TaskActionContext) => boolean;
}

/**
 * Action configuration from database schema
 */
export interface DatabaseActionConfig {
  actionKey: string;
  label: string;
  style: 'primary' | 'secondary' | 'danger' | 'warning' | 'info';
  confirmation?: string;
  visibleIf?: string;
  disabled?: boolean;
  icon?: string;
  tooltip?: string;
  permissions?: TaskActionPermission;
}

/**
 * Action execution state
 */
export interface TaskActionState {
  isLoading: boolean;
  error: string | null;
  currentAction: string | null;
  lastResult?: TaskActionResult;
  history: TaskActionHistoryEntry[];
}

/**
 * Historical record of action executions
 */
export interface TaskActionHistoryEntry {
  actionType: string;
  timestamp: Date;
  userId: string;
  data?: TaskActionData;
  result: TaskActionResult;
  duration: number;
}

/**
 * Configuration for action middleware
 */
export interface TaskActionMiddleware {
  name: string;
  priority?: number;
  before?: (actionType: string, context: TaskActionContext, data?: TaskActionData) => Promise<TaskActionData | void> | TaskActionData | void;
  after?: (actionType: string, context: TaskActionContext, result: TaskActionResult, data?: TaskActionData) => Promise<void> | void;
  onError?: (actionType: string, context: TaskActionContext, error: Error, data?: TaskActionData) => Promise<void> | void;
}

/**
 * Router configuration for action handling
 */
export interface TaskActionRouterConfig {
  handlers: TaskActionHandlerRegistry;
  middleware?: TaskActionMiddleware[];
  permissions?: TaskActionPermission[];
  permissionChecker?: (actionType: string, context: TaskActionContext) => boolean;
  fallbackHandler?: TaskActionHandler;
  
  // Logging and monitoring
  onActionStart?: (actionType: string, context: TaskActionContext) => void;
  onActionComplete?: (actionType: string, context: TaskActionContext, result: TaskActionResult, duration: number) => void;
  onActionError?: (actionType: string, context: TaskActionContext, error: Error) => void;
}

/**
 * Options for the useTaskActions hook
 */
export interface UseTaskActionsOptions {
  customHandlers?: TaskActionHandlerRegistry;
  permissions?: TaskActionPermission[];
  middleware?: TaskActionMiddleware[];
  
  // Callbacks
  onActionComplete?: (actionType: string, success: boolean, result?: TaskActionResult) => void;
  onError?: (error: string, actionType: string) => void;
  onPermissionDenied?: (actionType: string, context: TaskActionContext) => void;
  
  // Behavior options
  autoRefresh?: boolean;
  debounceMs?: number;
  maxRetries?: number;
}

/**
 * Action availability check result
 */
export interface TaskActionAvailability {
  available: boolean;
  reason?: string;
  missingPermissions?: string[];
  constraintViolations?: string[];
  recommendations?: string[];
}

/**
 * Batch action support
 */
export interface TaskBatchAction {
  actionType: string;
  taskIds: string[];
  data?: TaskActionData;
}

export interface TaskBatchActionResult {
  totalTasks: number;
  successfulTasks: string[];
  failedTasks: { taskId: string; error: string }[];
  partialResults: Record<string, TaskActionResult>;
}

/**
 * Action validation rules
 */
export interface TaskActionValidationRule {
  field: string;
  type: 'required' | 'pattern' | 'length' | 'custom';
  value?: string | number;
  message?: string;
  validator?: (value: unknown, context: TaskActionContext) => boolean;
}

export interface TaskActionValidation {
  rules: TaskActionValidationRule[];
  validate: (data: TaskActionData, context: TaskActionContext) => { valid: boolean; errors: string[] };
}

/**
 * Schema-driven action definitions
 */
export interface TaskActionSchema {
  componentId: string;
  actionType: string;
  config: DatabaseActionConfig;
  validation?: TaskActionValidation;
  handler?: TaskActionHandler;
  permissions?: TaskActionPermission;
}

/**
 * Action factory for creating handlers from schemas
 */
export interface TaskActionFactory {
  createHandler: (schema: TaskActionSchema) => TaskActionHandler;
  validateSchema: (schema: TaskActionSchema) => { valid: boolean; errors: string[] };
  registerSchema: (schema: TaskActionSchema) => void;
  getSchema: (componentId: string, actionType: string) => TaskActionSchema | null;
}

/**
 * Event types for action system
 */
export type TaskActionEvent = 
  | { type: 'ACTION_STARTED'; payload: { actionType: string; context: TaskActionContext } }
  | { type: 'ACTION_COMPLETED'; payload: { actionType: string; context: TaskActionContext; result: TaskActionResult } }
  | { type: 'ACTION_FAILED'; payload: { actionType: string; context: TaskActionContext; error: Error } }
  | { type: 'PERMISSION_DENIED'; payload: { actionType: string; context: TaskActionContext; reason: string } }
  | { type: 'VALIDATION_FAILED'; payload: { actionType: string; context: TaskActionContext; errors: string[] } };

/**
 * Event listener for action system events
 */
export interface TaskActionEventListener {
  (event: TaskActionEvent): void;
}

/**
 * Global action system configuration
 */
export interface TaskActionSystemConfig {
  router: TaskActionRouterConfig;
  factory: TaskActionFactory;
  eventListeners: TaskActionEventListener[];
  debugMode?: boolean;
  performanceTracking?: boolean;
}

/**
 * Type guards for runtime type checking
 */
export const isTaskActionType = (value: string): value is TaskActionType => {
  const validTypes: TaskActionType[] = [
    'approve', 'reject', 'request_review', 'send_review_request',
    'forward', 'archive', 'reassign', 'comment', 'flag', 'unflag'
  ];
  return validTypes.includes(value as TaskActionType);
};

export const isTaskActionData = (value: unknown): value is TaskActionData => {
  return typeof value === 'object' && value !== null;
};

export const isTaskActionResult = (value: unknown): value is TaskActionResult => {
  return typeof value === 'object' && 
         value !== null && 
         'success' in value && 
         typeof (value as TaskActionResult).success === 'boolean';
}; 