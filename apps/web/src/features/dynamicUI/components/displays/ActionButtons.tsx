import React from 'react';
import { cn } from '@/lib/utils';

interface ActionConfig {
  actionKey: string;
  label: string;
  style?: 'primary' | 'secondary' | 'danger';
  icon?: string;
}

interface ActionButtonsProps {
  actions: ActionConfig[];
  onAction?: (actionKey: string, data?: unknown) => void;
  data?: Record<string, unknown>;
  className?: string;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ 
  actions, 
  onAction, 
  data, 
  className 
}) => {
  const getButtonClasses = (style?: string) => {
    const baseClasses = "px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors";
    
    switch (style) {
      case 'primary':
        return `${baseClasses} bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500`;
      case 'danger':
        return `${baseClasses} bg-red-600 text-white hover:bg-red-700 focus:ring-red-500`;
      case 'secondary':
      default:
        return `${baseClasses} bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-blue-500`;
    }
  };

  if (!actions || actions.length === 0) {
    return null;
  }

  return (
    <div className={cn("flex space-x-3", className)}>
      {actions.map((action) => (
        <button
          key={action.actionKey}
          onClick={() => onAction?.(action.actionKey, data)}
          className={getButtonClasses(action.style)}
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}; 