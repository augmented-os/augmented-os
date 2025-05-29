import React from 'react';
import { cn } from '@/lib/utils';

interface CardDisplayConfig {
  fields: Array<{
    key: string;
    label: string;
    render?: (value: unknown) => React.ReactNode;
  }>;
  layout?: 'grid' | 'list';
}

interface CardDisplayProps {
  title?: string;
  data: Record<string, unknown>;
  config?: CardDisplayConfig;
  className?: string;
}

export const CardDisplay: React.FC<CardDisplayProps> = ({ 
  title, 
  data, 
  config, 
  className 
}) => {
  if (!config || !config.fields || config.fields.length === 0) {
    return (
      <div className="text-gray-500 text-sm">
        No card configuration provided
      </div>
    );
  }

  const isGrid = config.layout === 'grid' || config.layout === undefined;
  
  // Don't render title if className includes 'mb-0' (indicates controlled context)
  const shouldRenderTitle = title && !className?.includes('mb-0');

  return (
    <div className={cn("mb-6", className)}>
      {shouldRenderTitle && (
        <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      )}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className={cn(
          "p-6",
          isGrid ? "grid grid-cols-2 gap-6" : "space-y-4"
        )}>
          {config.fields.map((field) => (
            <div key={field.key}>
              <p className="text-sm font-medium text-gray-500 mb-1">{field.label}</p>
              <div className="text-sm text-gray-900 font-medium">
                {field.render 
                  ? field.render(data[field.key])
                  : String(data[field.key] || 'N/A')
                }
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 