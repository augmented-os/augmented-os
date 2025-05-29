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

  console.log('LayoutArea rendering:', {
    component,
    dataKeys: Object.keys(data),
    extractedTermsLength: Array.isArray(data.extractedTerms) ? data.extractedTerms.length : 'N/A'
  });

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

// Component for rendering grid layouts
const GridLayout: React.FC<{
  areas: Array<{ component: string; grid?: string; order?: number }>;
  spacing?: string;
  className?: string;
  data: Record<string, unknown>;
  onAction?: (actionKey: string, data?: unknown) => void;
}> = ({ areas, spacing, className, data, onAction }) => {
  const spacingClass = spacing === 'lg' ? 'gap-8' : spacing === 'md' ? 'gap-6' : 'gap-4';
  
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
                const flagValue = value as string;
                
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

        // Enhanced debugging for table data resolution
        console.log('Table data resolution:', {
          componentId: schema.componentId,
          dataKey: dataKey,
          hasDataKey: !!dataKey,
          dataKeys: Object.keys(data),
          tableDataType: Array.isArray(tableData) ? 'array' : typeof tableData,
          tableDataLength: Array.isArray(tableData) ? tableData.length : 'N/A',
          rawTableData: Array.isArray(tableData) ? tableData.slice(0, 2) : tableData,
          dataKeyValue: dataKey ? data[dataKey] : 'no dataKey'
        });

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
    
    if (schema.layout.type === 'grid' && schema.layout.areas) {
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
            <GridLayout 
              areas={schema.layout.areas}
              spacing={schema.layout.spacing}
              className={schema.layout.className}
              data={data}
              onAction={onAction}
            />
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