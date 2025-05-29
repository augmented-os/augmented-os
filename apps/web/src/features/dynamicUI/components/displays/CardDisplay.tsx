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

  return (
    <div className={cn("mb-6", className)}>
      {title && (
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      )}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className={cn(
          "p-4",
          isGrid ? "grid grid-cols-2 gap-4" : "space-y-3"
        )}>
          {config.fields.map((field) => (
            <div key={field.key}>
              <p className="text-sm font-medium text-gray-500">{field.label}</p>
              <div className="mt-1 text-sm text-gray-900">
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