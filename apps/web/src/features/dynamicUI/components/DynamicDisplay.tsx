import React, { useCallback } from 'react';
import { DisplayActions } from './DisplayActions';
import { renderTemplate } from '../utils/templates';
import { UIComponentSchema } from '../types/schemas';
import { useSchema } from '../hooks/useSchema';
import { cn } from '@/lib/utils';
import { TableDisplay, CardDisplay, ActionButtons } from './displays';

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
        data={data}
        onAction={onAction}
      />
    </div>
  );
};

// Component for rendering grid layouts
const GridLayout: React.FC<{
  areas: Array<{ component: string; grid?: string; order?: number }>;
  spacing?: string;
  className?: string;
  data: Record<string, unknown>;
  onAction?: (actionKey: string, data?: unknown) => void;
}> = ({ areas, spacing, className, data, onAction }) => {
  const spacingClass = spacing === 'lg' ? 'gap-6' : spacing === 'md' ? 'gap-4' : 'gap-2';
  
  return (
    <div className={`grid grid-cols-12 ${spacingClass} ${className || ''}`}>
      {areas.map((area, index) => (
        <LayoutArea
          key={`${area.component}-${index}`}
          component={area.component}
          grid={area.grid}
          order={area.order}
          data={data}
          onAction={onAction}
        />
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
  console.log('DynamicDisplayContent rendering:', {
    componentId: schema.componentId,
    customProps: schema.customProps,
    dataKeys: Object.keys(data || {})
  });

  // Handle atomic component configurations from custom_props
  if (schema.customProps?.displayType) {
    const { displayType } = schema.customProps;

    switch (displayType) {
      case 'table':
        const columns = Array.isArray(schema.customProps.columns) ? schema.customProps.columns : [];
        const tableConfig = {
          columns,
          rowClassName: (row: Record<string, unknown>) => {
            if (schema.customProps?.rowClassName === 'flag-based') {
              return row.flag ? 'bg-red-50' : '';
            }
            return '';
          }
        };

        // Enhanced column rendering
        const enhancedColumns = tableConfig.columns.map((col: any) => ({
          ...col,
          render: col.render === 'status-badge' ? (value: unknown) => {
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
          } : col.render
        }));

        const dataKey = typeof schema.customProps.dataKey === 'string' ? schema.customProps.dataKey : null;
        const tableData = dataKey ? data[dataKey] : data;

        return (
          <div className="w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Extracted Terms</h3>
            <TableDisplay 
              data={tableData}
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
          <CardDisplay 
            title={title}
            data={data}
            config={{
              fields,
              layout
            }}
          />
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

  // Handle layout-based rendering for task views
  if (schema.layout) {
    const layoutClassName = `${schema.layout.className || ''} ${className || ''}`.trim();
    
    if (schema.layout.type === 'grid' && schema.layout.areas) {
      return (
        <div className={`min-h-full w-full ${layoutClassName}`}>
          {/* Optional header for task views */}
          {schema.title && (
            <div className="mb-4">
              <h1 className="text-2xl font-bold text-gray-900">
                {renderTemplate(schema.title, data)}
              </h1>
            </div>
          )}
          
          {/* Grid layout content */}
          <div className="flex-1">
            <GridLayout 
              areas={schema.layout.areas}
              spacing={schema.layout.spacing}
              className={schema.layout.className}
              data={data}
              onAction={onAction}
            />
          </div>
          
          {/* Optional actions footer */}
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
    }
    
    if (schema.layout.type === 'single' && schema.layout.component) {
      return (
        <div className={`min-h-full w-full ${layoutClassName}`}>
          {/* Optional header for task views */}
          {schema.title && (
            <div className="mb-4">
              <h1 className="text-2xl font-bold text-gray-900">
                {renderTemplate(schema.title, data)}
              </h1>
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
          
          {/* Optional actions footer */}
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