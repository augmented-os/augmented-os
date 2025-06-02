import React, { useState, useCallback } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { DynamicDisplay } from '../DynamicDisplay';
import { UIComponentSchema } from '../../types/schemas';

export interface TabConfig {
  id: string;
  label: string;
  badge?: string;
  component: UIComponentSchema;
}

export interface DynamicTabsProps {
  schema: UIComponentSchema;
  data: Record<string, unknown>;
  initialData?: Record<string, unknown>;
  onAction?: (actionKey: string, data?: unknown) => void;
  className?: string;
}

export const DynamicTabs: React.FC<DynamicTabsProps> = ({ 
  schema, 
  data, 
  initialData,
  onAction,
  className 
}) => {
  const tabs = schema.customProps?.tabs as TabConfig[] || [];
  const defaultTab = schema.customProps?.defaultTab as string || tabs[0]?.id;
  
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId);
  }, []);

  const handleAction = useCallback((actionKey: string, actionData?: unknown) => {
    onAction?.(actionKey, actionData);
  }, [onAction]);

  if (!tabs.length) {
    return (
      <div className="error-placeholder">
        <p>No tabs configured for this component.</p>
      </div>
    );
  }

  return (
    <div className={`dynamic-tabs ${className || ''}`}>
      {/* Header with title if present */}
      {schema.title && (
        <div className="tabs-header mb-6">
          <h2 className="text-2xl font-semibold">
            {/* Basic template replacement for title */}
            {schema.title.replace(/\{\{([^}]+)\}\}/g, (match, key) => {
              return (data[key] as string) || match;
            })}
          </h2>
        </div>
      )}

      {/* Tabs Navigation and Content */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-blue-600 rounded-full">
                  {tab.badge}
                </span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Tab Content */}
        {tabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="mt-4">
            <DynamicTabContent
              tab={tab}
              data={data}
              initialData={initialData}
              onAction={handleAction}
            />
          </TabsContent>
        ))}
      </Tabs>

      {/* Actions Footer */}
      {schema.actions && schema.actions.length > 0 && (
        <div className="tabs-footer mt-6 flex gap-3 justify-end pt-4 border-t">
          {schema.actions.map((action) => {
            const isVisible = !action.visibleIf || evaluateCondition(action.visibleIf, data);
            
            if (!isVisible) return null;

            return (
              <button
                key={action.actionKey}
                onClick={() => handleAction(action.actionKey, data)}
                disabled={action.disabled}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  action.style === 'primary'
                    ? 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300'
                    : action.style === 'danger'
                    ? 'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200 disabled:bg-gray-50'
                }`}
              >
                {action.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

interface DynamicTabContentProps {
  tab: TabConfig;
  data: Record<string, unknown>;
  initialData?: Record<string, unknown>;
  onAction?: (actionKey: string, data?: unknown) => void;
}

const DynamicTabContent: React.FC<DynamicTabContentProps> = ({ tab, data, initialData, onAction }) => {
  const { component } = tab;

  // Always delegate to DynamicUIRenderer for consistency and to support all display types
  return (
    <DynamicDisplay
      schema={component}
      data={data}
      initialData={initialData}
      onAction={onAction}
    />
  );
};

// Simple condition evaluator for visibleIf
const evaluateCondition = (condition: string, data: Record<string, unknown>): boolean => {
  try {
    // Simple condition evaluation for basic cases
    if (condition.includes('===')) {
      const [field, value] = condition.split('===').map(s => s.trim());
      const fieldValue = data[field.replace(/['"]/g, '')];
      const expectedValue = value.replace(/['"]/g, '');
      return fieldValue === expectedValue;
    }
    
    if (condition.includes('!==')) {
      const [field, value] = condition.split('!==').map(s => s.trim());
      const fieldValue = data[field.replace(/['"]/g, '')];
      const expectedValue = value.replace(/['"]/g, '');
      return fieldValue !== expectedValue;
    }
    
    // Default: treat as field name, check if truthy
    return !!data[condition];
  } catch (error) {
    console.warn(`Condition evaluation error: ${condition}`, error);
    return false;
  }
}; 