import React from 'react';
import { DynamicForm } from './DynamicForm';
import { DynamicDisplay } from './DynamicDisplay';
import { DynamicUIErrorBoundary } from './DynamicUIErrorBoundary';
import { UIComponentSchema } from '../types/schemas';
import { useSchema } from '../hooks/useSchema';

export interface DynamicUIRendererProps {
  schema?: UIComponentSchema;
  componentId?: string;
  initialData?: Record<string, unknown>;
  data?: Record<string, unknown>;
  onSubmit?: (data: Record<string, unknown>) => void;
  onCancel?: () => void;
  onAction?: (actionKey: string, data?: unknown) => void;
  className?: string;
}

/**
 * Main entry point component for the Dynamic UI system.
 * Routes to appropriate renderers based on componentType.
 */
export const DynamicUIRenderer: React.FC<DynamicUIRendererProps> = ({
  schema: propSchema,
  componentId,
  initialData,
  data,
  onSubmit,
  onCancel,
  onAction,
  className
}) => {
  // Use schema from props or fetch from database
  const { data: fetchedSchema, isLoading, error } = useSchema(
    componentId || '', 
    { 
      enabled: Boolean(componentId),
      fallbackSchema: propSchema 
    }
  );

  const schema = propSchema || fetchedSchema;

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
            data={data || {}}
            onAction={onAction}
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