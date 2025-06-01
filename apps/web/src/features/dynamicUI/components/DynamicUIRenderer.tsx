import React from 'react';
import { DynamicForm } from './DynamicForm';
import { DynamicDisplay } from './DynamicDisplay';
import { DynamicUIErrorBoundary } from './DynamicUIErrorBoundary';
import { UIComponentSchema } from '../types/schemas';
import { useSchema } from '../hooks/useSchema';
import { DynamicUIStateProvider, useDynamicUIState, useUIStateData } from '../contexts/DynamicUIStateContext';

export interface DynamicUIRendererProps {
  schema?: UIComponentSchema;
  componentId?: string;
  initialData?: Record<string, unknown>;
  data?: Record<string, unknown>;
  onSubmit?: (data: Record<string, unknown>) => void;
  onCancel?: () => void;
  onAction?: (actionKey: string, data?: unknown) => void;
  className?: string;
  initialUIState?: Record<string, unknown>;
}

/**
 * Inner renderer component that uses the UI state context
 */
const DynamicUIRendererInner: React.FC<Omit<DynamicUIRendererProps, 'initialUIState'>> = ({
  schema: propSchema,
  componentId,
  initialData,
  data,
  onSubmit,
  onCancel,
  onAction,
  className
}) => {
  // Only fetch from database when schema is not provided but componentId is
  const shouldFetchSchema = !propSchema && Boolean(componentId);
  
  // Use schema from props or fetch from database
  const { data: fetchedSchema, isLoading, error } = useSchema(
    componentId || '', 
    { 
      enabled: shouldFetchSchema,
      fallbackSchema: propSchema 
    }
  );

  const schema = propSchema || fetchedSchema;
  
  // Get UI state context
  const { updateUIState } = useDynamicUIState();
  
  // Combine data with UI state for conditional rendering
  const dataWithUIState = useUIStateData(data || {});

  // Enhanced action handler that manages UI state
  const handleAction = (actionKey: string, actionData?: unknown) => {
    // Handle UI state changes based on action
    switch (actionKey) {
      case 'request_review':
        updateUIState({ showReviewForm: true });
        break;
      case 'cancel':
      case 'submit':
        updateUIState({ showReviewForm: false });
        break;
      case 'approve':
        updateUIState({ showApprovalConfirmation: true });
        break;
      case 'reject':
        updateUIState({ showRejectionForm: true });
        break;
      default:
        // For other actions, don't change UI state
        break;
    }
    
    // Call the original action handler
    onAction?.(actionKey, actionData);
  };

  // Show loading state
  if (isLoading) {
    return (
      <DynamicUIErrorBoundary>
        <div className="flex items-center justify-center py-8">
          <div className="text-muted-foreground">Loading component schema...</div>
        </div>
      </DynamicUIErrorBoundary>
    );
  }

  // Show error state
  if (error) {
    return (
      <DynamicUIErrorBoundary>
        <div className="flex items-center justify-center py-8">
          <div className="text-destructive">Error loading component schema: {error.message}</div>
        </div>
      </DynamicUIErrorBoundary>
    );
  }

  // Show fallback if no schema available
  if (!schema) {
    return (
      <DynamicUIErrorBoundary>
        <div className="flex items-center justify-center py-8">
          <div className="text-muted-foreground">No schema available</div>
        </div>
      </DynamicUIErrorBoundary>
    );
  }

  const renderComponent = () => {
    switch (schema.componentType) {
      case 'Form':
        return (
          <DynamicForm
            schema={schema}
            initialData={initialData}
            onSubmit={onSubmit || (() => {})}
            onCancel={onCancel}
            className={className}
          />
        );

      case 'Display':
        return (
          <DynamicDisplay
            schema={schema}
            data={dataWithUIState}
            onAction={handleAction}
            className={className}
          />
        );

      case 'Modal':
        console.warn(`Modal component type not yet implemented for schema: ${schema.componentId}`);
        return (
          <div className="error-placeholder">
            <p>Modal components are not yet supported.</p>
            <p>Component ID: {schema.componentId}</p>
          </div>
        );

      case 'Custom':
        console.warn(`Custom component type not yet implemented for schema: ${schema.componentId}`);
        return (
          <div className="error-placeholder">
            <p>Custom components are not yet supported.</p>
            <p>Component ID: {schema.componentId}</p>
          </div>
        );

      default:
        console.warn(`Unsupported component type: ${schema.componentType} for schema: ${schema.componentId}`);
        return (
          <div className="error-placeholder">
            <p>Unsupported component type: {schema.componentType}</p>
            <p>Component ID: {schema.componentId}</p>
          </div>
        );
    }
  };

  return (
    <DynamicUIErrorBoundary>
      {renderComponent()}
    </DynamicUIErrorBoundary>
  );
};

/**
 * Main entry point component for the Dynamic UI system.
 * Routes to appropriate renderers based on componentType.
 * Provides UI state management for conditional rendering.
 */
export const DynamicUIRenderer: React.FC<DynamicUIRendererProps> = ({
  initialUIState = {},
  ...props
}) => {
  return (
    <DynamicUIStateProvider initialState={initialUIState}>
      <DynamicUIRendererInner {...props} />
    </DynamicUIStateProvider>
  );
}; 