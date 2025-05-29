import React, { useCallback } from 'react';
import { DisplayActions } from './DisplayActions';
import { renderTemplate } from '../utils/templates';
import { UIComponentSchema } from '../types/schemas';
import { useSchema } from '../hooks/useSchema';

interface DynamicDisplayProps {
  schema?: UIComponentSchema;
  componentId?: string;
  data: Record<string, unknown>;
  onAction?: (actionKey: string, data?: unknown) => void;
  className?: string;
}

export const DynamicDisplay: React.FC<DynamicDisplayProps> = ({ 
  schema: propSchema, 
  componentId,
  data, 
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

  const handleAction = useCallback((actionKey: string) => {
    onAction?.(actionKey, data);
  }, [onAction, data]);

  // Show loading state
  if (isLoading) {
    return (
      <div className={`dynamic-display ${className || ''}`}>
        <div className="display-header">
          <div className="text-muted-foreground">Loading display schema...</div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className={`dynamic-display ${className || ''}`}>
        <div className="display-header">
          <div className="text-destructive">Error loading display schema: {error.message}</div>
        </div>
      </div>
    );
  }

  // Show fallback if no schema available
  if (!schema) {
    return (
      <div className={`dynamic-display ${className || ''}`}>
        <div className="display-header">
          <div className="text-muted-foreground">No schema available</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`dynamic-display ${className || ''}`}>
      <div className="display-header">
        <h2 className="display-title">
          {renderTemplate(schema.title, data)}
        </h2>
      </div>
      
      {schema.displayTemplate && (
        <div className="display-content">
          <div 
            dangerouslySetInnerHTML={{
              __html: renderTemplate(schema.displayTemplate, data)
            }} 
          />
        </div>
      )}
      
      {schema.actions && schema.actions.length > 0 && (
        <div className="display-footer">
          <DisplayActions
            actions={schema.actions}
            onAction={handleAction}
            data={data}
          />
        </div>
      )}
    </div>
  );
}; 