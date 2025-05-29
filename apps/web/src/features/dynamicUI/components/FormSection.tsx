import React, { useState } from 'react';
import { FormField } from './FormField';
import { FormSection as FormSectionType, FormField as FormFieldType } from '../types/schemas';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface FormSectionProps {
  section: FormSectionType;
  fields: FormFieldType[];
  formData: Record<string, unknown>;
  errors: Record<string, string>;
  onFieldChange: (fieldKey: string, value: string | number | boolean | string[] | null) => void;
}

export const FormSection: React.FC<FormSectionProps> = ({
  section,
  fields,
  formData,
  errors,
  onFieldChange
}) => {
  const [isExpanded, setIsExpanded] = useState(section.defaultExpanded !== false);

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card">
      <div 
        className={cn(
          "px-4 py-3 bg-muted/50 border-b border-border flex items-center justify-between",
          section.collapsible && "cursor-pointer hover:bg-muted/70 transition-colors"
        )}
        onClick={section.collapsible ? () => setIsExpanded(!isExpanded) : undefined}
      >
        <h3 className="text-lg font-medium text-foreground">{section.title}</h3>
        {section.collapsible && (
          <div className="text-muted-foreground">
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </div>
        )}
      </div>
      
      {isExpanded && (
        <div className="p-4 space-y-4">
          {fields.map(field => (
            <FormField
              key={field.fieldKey}
              field={field}
              value={formData[field.fieldKey] as string | number | boolean | string[] | null | undefined}
              error={errors[field.fieldKey]}
              onChange={(value) => onFieldChange(field.fieldKey, value)}
              formData={formData}
            />
          ))}
        </div>
      )}
    </div>
  );
}; 