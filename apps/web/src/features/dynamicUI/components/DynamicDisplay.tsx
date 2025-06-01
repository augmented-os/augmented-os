import React, { useCallback } from 'react';
import { DisplayActions } from './DisplayActions';
import { renderTemplate } from '../utils/templates';
import { evaluateCondition } from '../utils/conditions';
import { UIComponentSchema } from '../types/schemas';
import { useSchema } from '../hooks/useSchema';
import { cn } from '@/lib/utils';
import { TableDisplay, CardDisplay, ActionButtons } from './displays';
import { DynamicForm } from './DynamicForm';

interface DynamicDisplayProps {
  schema?: UIComponentSchema;
  componentId?: string;
  data: Record<string, unknown>;
  onAction?: (actionKey: string, data?: unknown) => void;
  className?: string;
}

interface DynamicDisplayContentProps {
  schema: UIComponentSchema;
  data: Record<string, unknown>;
  onAction?: (actionKey: string, data?: unknown) => void;
}

// Component for rendering individual layout areas
const LayoutArea: React.FC<{
  component: string;
  grid?: string;
  order?: number;
  data: Record<string, unknown>;
  onAction?: (actionKey: string, data?: unknown) => void;
}> = ({ component, grid, order, data, onAction }) => {
  // Convert grid span format (e.g., "span 8") to Tailwind classes
  const getGridClass = (grid?: string) => {
    if (!grid) return 'col-span-12';
    
    const spanMatch = grid.match(/span\s+(\d+)/);
    if (spanMatch) {
      const span = spanMatch[1];
      return `col-span-${span}`;
    }
    
    return 'col-span-12';
  };

  return (
    <div 
      className={`layout-area ${getGridClass(grid)}`}
      style={{ order }}
    >
      <DynamicDisplay 
        componentId={component}
        data={data}  // Pass the full data object - let components extract what they need
        onAction={onAction}
      />
    </div>
  );
};

// Component for rendering grid layouts with conditional areas
const GridLayout: React.FC<{
  areas: Array<{
    component: string;
    grid: string;
    order: number;
    visibleIf?: string;
  }>;
  spacing?: string;
  className?: string;
  data: Record<string, unknown>;
  onAction?: (actionKey: string, data?: unknown) => void;
}> = ({ areas, spacing = 'md', className, data, onAction }) => {
  // Filter areas based on visibleIf conditions
  const visibleAreas = areas.filter(area => {
    if (!area.visibleIf) return true;
    return evaluateCondition(area.visibleIf, data);
  });

  // Sort by order
  const sortedAreas = [...visibleAreas].sort((a, b) => a.order - b.order);

  const getSpacingClass = (spacing: string): string => {
    switch (spacing) {
      case 'sm': return 'gap-2';
      case 'md': return 'gap-4';
      case 'lg': return 'gap-6';
      case 'xl': return 'gap-8';
      default: return 'gap-4';
    }
  };

  // Convert grid span format (e.g., "span 8") to Tailwind classes
  const getGridClass = (grid: string) => {
    if (!grid) return 'col-span-12';
    
    const spanMatch = grid.match(/span\s+(\d+)/);
    if (spanMatch) {
      const span = spanMatch[1];
      return `col-span-${span}`;
    }
    
    return 'col-span-12';
  };

  return (
    <div className={cn('grid grid-cols-12', getSpacingClass(spacing), className)}>
      {sortedAreas.map((area, index) => (
        <div key={`${area.component}-${index}`} className={getGridClass(area.grid)}>
          <DynamicDisplay 
            componentId={area.component}
            data={data}
            onAction={onAction}
          />
        </div>
      ))}
    </div>
  );
};

// Component for rendering single component layouts
const SingleLayout: React.FC<{
  component: string;
  className?: string;
  data: Record<string, unknown>;
  onAction?: (actionKey: string, data?: unknown) => void;
}> = ({ component, className, data, onAction }) => {
  return (
    <div className={className}>
      <DynamicDisplay 
        componentId={component}
        data={data}
        onAction={onAction}
      />
    </div>
  );
};

const DynamicDisplayContent: React.FC<DynamicDisplayContentProps> = ({ 
  schema, 
  data, 
  onAction 
}) => {
  // Handle atomic component configurations from custom_props
  if (schema.customProps?.displayType) {
    const { displayType } = schema.customProps;

    switch (displayType) {
      case 'table':
        const columns = Array.isArray(schema.customProps.columns) ? schema.customProps.columns : [];
        const flagConfig = schema.customProps.flagConfig as any; // Type assertion for now
        
        const tableConfig = {
          columns,
          rowClassName: (row: Record<string, unknown>) => {
            if (flagConfig && typeof flagConfig === 'object') {
              const flagField = flagConfig.field || 'flag';
              const flagValue = row[flagField] as string;
              
              if (flagValue && flagConfig.styles && flagConfig.styles[flagValue]) {
                // Remove any border-l styling for the dynamic table - we only want background colors
                const originalStyle = flagConfig.styles[flagValue];
                const styleBorderRemoved = originalStyle.replace(/border-l-\d+\s+border-[^\s]+/g, '').trim();
                return styleBorderRemoved;
              }
            }
            // Legacy support for old flag-based system
            if (schema.customProps?.rowClassName === 'flag-based') {
              return row.flag ? 'bg-red-50' : '';
            }
            return '';
          }
        };

        // Enhanced column rendering
        const enhancedColumns = tableConfig.columns.map((col: any) => {
          if (col.render === 'status-badge') {
            return {
              ...col,
              render: (value: unknown, row: Record<string, unknown>) => {
                const rawValue = value as string;
                
                // Import mapping functions dynamically to avoid circular dependencies
                const STATUS_TO_FLAG_MAP: Record<string, string> = {
                  'Compliant': 'success',
                  'Non-standard': 'warning', 
                  'Violation': 'error',
                  'Under Review': 'pending',
                  'Reference': 'info'
                };
                
                // Convert business status to flag if it's a business value
                const flagValue = STATUS_TO_FLAG_MAP[rawValue] || rawValue;
                
                // Use flag configuration if available
                if (flagConfig && flagConfig.badgeConfigs && flagConfig.badgeConfigs[flagValue]) {
                  const badgeConfig = flagConfig.badgeConfigs[flagValue];
                  return (
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${badgeConfig.class}`}>
                      {badgeConfig.text}
                    </span>
                  );
                }
                
                // Legacy boolean flag support
                const isFlag = Boolean(value);
                return (
                  <span 
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      isFlag 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {isFlag ? 'Non-standard' : 'Standard'}
                  </span>
                );
              }
            };
          }
          return col;
        });

        const dataKey = typeof schema.customProps.dataKey === 'string' ? schema.customProps.dataKey : null;
        const tableData = dataKey ? data[dataKey] : data;

        // Ensure we have valid table data
        const finalTableData = Array.isArray(tableData) ? tableData : [];
        
        if (finalTableData.length === 0) {
          console.warn(`No table data found for ${schema.componentId}. DataKey: ${dataKey}, Available data keys: ${Object.keys(data).join(', ')}`);
        }

        return (
          <div className="w-full">
            {schema.customProps?.title && (
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {String(schema.customProps.title)}
              </h3>
            )}
            <TableDisplay 
              data={finalTableData}
              config={{ ...tableConfig, columns: enhancedColumns }}
              className="w-full"
            />
          </div>
        );

      case 'card':
        const title = typeof schema.customProps.title === 'string' ? schema.customProps.title : undefined;
        const fields = Array.isArray(schema.customProps.fields) ? schema.customProps.fields : [];
        const layout = schema.customProps.layout === 'grid' || schema.customProps.layout === 'list' 
          ? schema.customProps.layout 
          : 'grid';

        return (
          <div className="w-full">
            <CardDisplay 
              data={data}
              config={{
                fields,
                layout
              }}
              className="mb-0"
            />
          </div>
        );

      case 'actions':
        return (
          <ActionButtons
            actions={schema.actions || []}
            onAction={onAction}
            data={data}
          />
        );

      default:
        console.warn(`Unsupported display type: ${String(displayType)}`);
        return (
          <div className="text-gray-500 text-sm">
            Unsupported display type: {String(displayType)}
          </div>
        );
    }
  }

  // Fallback for legacy display_template (should be removed eventually)
  if (schema.displayTemplate) {
    console.warn(`Component ${schema.componentId} still using legacy display_template. Please migrate to atomic components.`);
    
    // Simple template replacement - to be removed
    let content = schema.displayTemplate;
    
    // Replace simple placeholders like {{field}}
    content = content.replace(/\{\{(\w+)\}\}/g, (match, fieldName) => {
      return String(data[fieldName] || '');
    });
    
    return (
      <div 
        className="dynamic-display-legacy"
        dangerouslySetInnerHTML={{ __html: content }} 
      />
    );
  }

  // No valid display configuration
  return (
    <div className="text-gray-500 text-sm">
      No display configuration found for component: {schema.componentId}
    </div>
  );
};

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

  // Handle Form components that are used within Display contexts
  if (schema.componentType === 'Form') {
    // Apply the same layout styling logic as main displays
    const getLayoutStyling = (className?: string): string => {
      const baseClasses = 'min-h-full w-full';
      
      if (className?.includes('task-review-layout')) {
        return `${baseClasses} p-6 max-w-6xl mx-auto`;
      }
      
      if (className?.includes('review-request-layout')) {
        return `${baseClasses} p-6 max-w-4xl mx-auto`;
      }
      
      // Default layout styling
      return `${baseClasses} p-4 max-w-full mx-auto`;
    };

    const formClassName = `${getLayoutStyling(schema.layout?.className)} ${className || ''}`.trim();
    
    return (
      <DynamicForm
        schema={schema}
        initialData={data}
        onSubmit={onAction ? (formData) => onAction('submit', formData) : () => {}}
        onCancel={onAction ? () => onAction('cancel', {}) : undefined}
        className={formClassName}
      />
    );
  }

  // Handle layout-based rendering for task views
  if (schema.layout) {
    // Apply styling based on semantic className patterns
    const getLayoutStyling = (className?: string): string => {
      const baseClasses = 'min-h-full w-full';
      
      if (className?.includes('task-review-layout')) {
        return `${baseClasses} p-6 max-w-6xl mx-auto`;
      }
      
      if (className?.includes('review-request-layout')) {
        return `${baseClasses} p-6 max-w-4xl mx-auto`;
      }
      
      // Default layout styling
      return `${baseClasses} p-4 max-w-full mx-auto`;
    };

    const layoutClassName = `${getLayoutStyling(schema.layout.className)} ${className || ''}`.trim();
    
    // Handle conditional layout type
    if (schema.layout.type === 'conditional' && schema.layout.defaultView) {
      const defaultView = schema.layout.defaultView;
      if (defaultView.type === 'grid' && defaultView.areas) {
        return (
          <div className={layoutClassName}>
            {/* Header with title and actions */}
            {(schema.title || (schema.actions && schema.actions.length > 0)) && (
              <div className="mb-6 flex justify-between items-center">
                {schema.title && (
                  <div className="flex flex-col">
                    <h1 className="text-3xl font-bold text-gray-900">
                      {renderTemplate(schema.title, data)}
                    </h1>
                    {/* Universal task reference subtitle */}
                    {data.task_reference && (
                      <p className="text-sm text-gray-500 mt-1">
                        {String(data.task_reference)}
                      </p>
                    )}
                  </div>
                )}
                
                {/* Actions in header */}
                {schema.actions && schema.actions.length > 0 && (
                  <DisplayActions
                    actions={schema.actions}
                    onAction={handleAction}
                    data={data}
                  />
                )}
              </div>
            )}
            
            {/* Conditional grid layout content */}
            <div className="flex-1">
              <GridLayout 
                areas={defaultView.areas}
                spacing={defaultView.spacing}
                className={defaultView.className}
                data={data}
                onAction={onAction}
              />
            </div>
          </div>
        );
      }
    }
    
    if (schema.layout.type === 'grid' && schema.layout.areas) {
      // Convert old format to new format for compatibility
      const normalizedAreas = schema.layout.areas.map((area, index) => ({
        component: area.component,
        grid: area.grid || 'span 12',
        order: area.order || index + 1,
        visibleIf: area.visibleIf
      }));
      
      // Convert grid span format (e.g., "span 8") to Tailwind classes
      const getGridClass = (grid: string) => {
        if (!grid) return 'col-span-12';
        
        const spanMatch = grid.match(/span\s+(\d+)/);
        if (spanMatch) {
          const span = spanMatch[1];
          return `col-span-${span}`;
        }
        
        return 'col-span-12';
      };
      
      return (
        <div className={layoutClassName}>
          {/* Header with title and actions */}
          {(schema.title || (schema.actions && schema.actions.length > 0)) && (
            <div className="mb-6 flex justify-between items-center">
              {schema.title && (
                <div className="flex flex-col">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {renderTemplate(schema.title, data)}
                  </h1>
                  {/* Universal task reference subtitle */}
                  {data.task_reference && (
                    <p className="text-sm text-gray-500 mt-1">
                      {String(data.task_reference)}
                    </p>
                  )}
                </div>
              )}
              
              {/* Actions in header */}
              {schema.actions && schema.actions.length > 0 && (
                <DisplayActions
                  actions={schema.actions}
                  onAction={handleAction}
                  data={data}
                />
              )}
            </div>
          )}
          
          {/* Grid layout content */}
          <div className="flex-1">
            <div className={cn('grid grid-cols-12', schema.layout.spacing === 'lg' ? 'gap-6' : 'gap-4', schema.layout.className)}>
              {normalizedAreas
                .filter(area => {
                  if (!area.visibleIf) return true;
                  return evaluateCondition(area.visibleIf, data);
                })
                .sort((a, b) => a.order - b.order)
                .map((area, index) => (
                  <div key={`${area.component}-${index}`} className={getGridClass(area.grid)}>
                    <DynamicDisplay 
                      componentId={area.component}
                      data={data}
                      onAction={onAction}
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
      );
    }
    
    if (schema.layout.type === 'single' && schema.layout.component) {
      return (
        <div className={layoutClassName}>
          {/* Header with title and actions */}
          {(schema.title || (schema.actions && schema.actions.length > 0)) && (
            <div className="mb-6 flex justify-between items-center">
              {schema.title && (
                <div className="flex flex-col">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {renderTemplate(schema.title, data)}
                  </h1>
                  {/* Universal task reference subtitle */}
                  {data.task_reference && (
                    <p className="text-sm text-gray-500 mt-1">
                      {String(data.task_reference)}
                    </p>
                  )}
                </div>
              )}
              
              {/* Actions in header */}
              {schema.actions && schema.actions.length > 0 && (
                <DisplayActions
                  actions={schema.actions}
                  onAction={handleAction}
                  data={data}
                />
              )}
            </div>
          )}
          
          {/* Single component content */}
          <div className="flex-1">
            <SingleLayout 
              component={schema.layout.component}
              className={schema.layout.className}
              data={data}
              onAction={onAction}
            />
          </div>
        </div>
      );
    }
  }

  // Fallback to standard display template rendering
  return (
    <div className={`min-h-full w-full ${className || ''}`}>
      {/* Header */}
      {schema.title && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {renderTemplate(schema.title, data)}
          </h2>
        </div>
      )}
      
      {/* Content */}
      <DynamicDisplayContent 
        schema={schema}
        data={data}
        onAction={handleAction}
      />
      
      {/* Actions */}
      {schema.actions && schema.actions.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
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