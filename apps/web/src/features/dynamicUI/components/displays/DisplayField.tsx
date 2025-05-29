import React from 'react';
import { TableDisplay } from './TableDisplay';
import { CardDisplay } from './CardDisplay';
import { TextDisplay } from './TextDisplay';
import { ActionButtons } from './ActionButtons';

export interface DisplayFieldConfig {
  fieldKey: string;
  label?: string;
  type: 'table' | 'card' | 'text' | 'actions';
  data?: unknown;
  className?: string;
  // Configuration for specific display types
  tableConfig?: {
    columns: Array<{
      key: string;
      label: string;
      width?: string;
      render?: (value: unknown, row: Record<string, unknown>) => React.ReactNode;
    }>;
    rowClassName?: (row: Record<string, unknown>) => string;
  };
  cardConfig?: {
    fields: Array<{
      key: string;
      label: string;
      render?: (value: unknown) => React.ReactNode;
    }>;
    layout?: 'grid' | 'list';
  };
  actionsConfig?: {
    actions: Array<{
      actionKey: string;
      label: string;
      style?: 'primary' | 'secondary' | 'danger';
      icon?: string;
    }>;
  };
}

interface DisplayFieldProps {
  field: DisplayFieldConfig;
  data: Record<string, unknown>;
  onAction?: (actionKey: string, data?: unknown) => void;
}

export const DisplayField: React.FC<DisplayFieldProps> = ({ 
  field, 
  data, 
  onAction 
}) => {
  const renderDisplay = () => {
    switch (field.type) {
      case 'table':
        return (
          <TableDisplay
            data={field.data || data[field.fieldKey] || []}
            config={field.tableConfig}
            className={field.className}
          />
        );

      case 'card':
        return (
          <CardDisplay
            title={field.label}
            data={(field.data as Record<string, unknown>) || (data as Record<string, unknown>)}
            config={field.cardConfig}
            className={field.className}
          />
        );

      case 'text':
        return (
          <TextDisplay
            label={field.label}
            value={field.data || data[field.fieldKey]}
            className={field.className}
          />
        );

      case 'actions':
        return (
          <ActionButtons
            actions={field.actionsConfig?.actions || []}
            onAction={onAction}
            data={data}
            className={field.className}
          />
        );

      default:
        console.warn(`Unsupported display type: ${field.type}`);
        return (
          <div className="text-gray-500 text-sm">
            Unsupported display type: {field.type}
          </div>
        );
    }
  };

  return (
    <div className={`display-field display-field--${field.type}`}>
      {renderDisplay()}
    </div>
  );
}; 