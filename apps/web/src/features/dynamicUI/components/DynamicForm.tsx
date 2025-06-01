import React, { useState, useCallback } from 'react';
import { FormField } from './FormField';
import { FormActions } from './FormActions';
import { FormSection } from './FormSection';
import { validateForm } from '../utils/validation';
import { UIComponentSchema, FormField as FormFieldType } from '../types/schemas';
import { useSchema } from '../hooks/useSchema';
import { cn } from '@/lib/utils';

interface DynamicFormProps {
  schema?: UIComponentSchema;
  componentId?: string;
  initialData?: Record<string, unknown>;
  onSubmit: (data: Record<string, unknown>) => void;
  onCancel?: () => void;
  className?: string;
}

export const DynamicForm: React.FC<DynamicFormProps> = ({ 
  schema: propSchema, 
  componentId,
  initialData = {}, 
  onSubmit, 
  onCancel,
  className 
}) => {
  // Only fetch from database when schema is not provided but componentId is
  const shouldFetchSchema = !propSchema && Boolean(componentId);
  
  // Use schema from props or fetch from database
  const { data: fetchedSchema, isLoading, error } = useSchema(
    componentId || '', 
    { 
      enabled: shouldFetchSchema,
      fallbackSchema: propSchema 
    }
  );

  const schema = propSchema || fetchedSchema;

  const [formData, setFormData] = useState<Record<string, unknown>>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFieldChange = useCallback((fieldKey: string, value: string | number | boolean | string[] | FileList | null) => {
    // Convert FileList to array of file names for storage
    let processedValue: string | number | boolean | string[] | null;
    if (value instanceof FileList) {
      processedValue = Array.from(value).map(file => file.name);
    } else {
      processedValue = value;
    }
    
    setFormData(prev => ({ ...prev, [fieldKey]: processedValue }));
    
    // Clear error when user starts typing
    if (errors[fieldKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldKey];
        return newErrors;
      });
    }
  }, [errors]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!schema) return;
    
    const validationErrors = validateForm(formData, schema.fields || []);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, schema, onSubmit]);

  const handleAction = useCallback((actionKey: string) => {
    if (actionKey === 'submit') {
      const submitEvent = { preventDefault: () => {} } as React.FormEvent;
      handleSubmit(submitEvent);
    } else if (actionKey === 'cancel') {
      onCancel?.();
    }
  }, [handleSubmit, onCancel]);

  // Show loading state
  if (isLoading) {
    return (
      <div className={cn("max-w-2xl mx-auto p-6 bg-card rounded-lg shadow-md border border-border", className)}>
        <div className="flex items-center justify-center py-8">
          <div className="text-muted-foreground">Loading form schema...</div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className={cn("max-w-2xl mx-auto p-6 bg-card rounded-lg shadow-md border border-border", className)}>
        <div className="flex items-center justify-center py-8">
          <div className="text-destructive">Error loading form schema: {error.message}</div>
        </div>
      </div>
    );
  }

  // Show fallback if no schema available
  if (!schema) {
    return (
      <div className={cn("max-w-2xl mx-auto p-6 bg-card rounded-lg shadow-md border border-border", className)}>
        <div className="flex items-center justify-center py-8">
          <div className="text-muted-foreground">No schema available</div>
        </div>
      </div>
    );
  }

  // Organize fields based on layout configuration
  const organizeFields = () => {
    const fields = schema.fields || [];
    const layout = schema.layout;

    if (layout?.sections) {
      // Render fields in sections
      return layout.sections.map(section => ({
        type: 'section' as const,
        section,
        fields: section.fields.map(fieldKey => 
          fields.find(f => f.fieldKey === fieldKey)
        ).filter(Boolean) as FormFieldType[]
      }));
    } else if (layout?.order) {
      // Render fields in custom order
      const orderedFields = layout.order.map(fieldKey =>
        fields.find(f => f.fieldKey === fieldKey)
      ).filter(Boolean) as FormFieldType[];
      
      return [{
        type: 'fields' as const,
        fields: orderedFields
      }];
    } else {
      // Default order
      return [{
        type: 'fields' as const,
        fields
      }];
    }
  };

  const fieldGroups = organizeFields();

  // Get spacing classes based on layout
  const getSpacingClass = () => {
    const spacing = schema.layout?.spacing;
    switch (spacing) {
      case 'compact':
        return 'gap-3';
      case 'spacious':
        return 'gap-8';
      default:
        return 'gap-6';
    }
  };

  // Get grid columns class based on layout
  const getGridColumns = () => {
    const columns = schema.layout?.columns;
    if (!columns) return '';
    return `grid-cols-${Math.min(columns, 12)}`;
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={cn(
        "max-w-2xl mx-auto p-6 bg-card rounded-lg shadow-md border border-border",
        className
      )}
    >
      {/* Form Header */}
      <div className="mb-6 pb-4 border-b border-border">
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          {schema.title}
        </h2>
        {schema.description && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {schema.description}
          </p>
        )}
      </div>
      
      {/* Form Body */}
      <div 
        className={cn(
          "mb-6",
          getSpacingClass(),
          schema.layout?.columns ? cn("grid", getGridColumns()) : "flex flex-col"
        )}
      >
        {fieldGroups.map((group, groupIndex) => {
          if (group.type === 'section') {
            return (
              <FormSection
                key={`section-${groupIndex}`}
                section={group.section}
                fields={group.fields}
                formData={formData}
                errors={errors}
                onFieldChange={handleFieldChange}
              />
            );
          } else {
            return (
              <div key={`fields-${groupIndex}`} className={cn("flex flex-col", getSpacingClass())}>
                {group.fields.map(field => (
                  <FormField
                    key={field.fieldKey}
                    field={field}
                    value={formData[field.fieldKey] as string | number | boolean | string[] | null | undefined}
                    error={errors[field.fieldKey]}
                    onChange={(value) => handleFieldChange(field.fieldKey, value)}
                    formData={formData}
                  />
                ))}
              </div>
            );
          }
        })}
      </div>
      
      {/* Form Footer */}
      <div className="pt-4 border-t border-border">
        <FormActions
          actions={schema.actions || []}
          onAction={handleAction}
          isSubmitting={isSubmitting}
          formData={formData}
        />
      </div>
    </form>
  );
}; 