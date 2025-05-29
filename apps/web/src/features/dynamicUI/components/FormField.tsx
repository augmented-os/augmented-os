import React from 'react';
import { TextInput } from './fields/TextInput';
import { NumberInput } from './fields/NumberInput';
import { SelectInput } from './fields/SelectInput';
import { TextareaInput } from './fields/TextareaInput';
import { BooleanInput } from './fields/BooleanInput';
import { DateInput } from './fields/DateInput';
import { FileInput } from './fields/FileInput';
import { MultiSelectInput } from './fields/MultiSelectInput';
import { EmailInput } from './fields/EmailInput';
import { evaluateCondition } from '../utils/conditions';
import { FormField as FormFieldType } from '../types/schemas';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  field: FormFieldType;
  value: string | number | boolean | string[] | FileList | null | undefined;
  error?: string;
  onChange: (value: string | number | boolean | string[] | FileList | null) => void;
  formData: Record<string, unknown>;
}

export const FormField: React.FC<FormFieldProps> = ({ 
  field, 
  value, 
  error, 
  onChange, 
  formData 
}) => {
  // Handle conditional visibility
  if (field.visibleIf && !evaluateCondition(field.visibleIf, formData)) {
    return null;
  }

  const renderInput = () => {
    switch (field.type) {
      case 'text':
        return (
          <TextInput
            id={field.fieldKey}
            label={field.label}
            value={String(value ?? field.default ?? '')}
            onChange={(newValue) => onChange(newValue)}
            type="text"
            placeholder={field.placeholder}
            required={field.required || field.validationRules?.some(rule => 
              typeof rule === 'object' ? rule.type === 'required' : rule === 'required'
            )}
            error={error}
            helpText={field.helpText}
          />
        );

      case 'email':
        return (
          <EmailInput
            id={field.fieldKey}
            label={field.label}
            value={String(value ?? field.default ?? '')}
            onChange={(newValue) => onChange(newValue)}
            placeholder={field.placeholder}
            required={field.required || field.validationRules?.some(rule => 
              typeof rule === 'object' ? rule.type === 'required' : rule === 'required'
            )}
            error={error}
            helpText={field.helpText}
          />
        );
      
      case 'number':
        return (
          <NumberInput
            id={field.fieldKey}
            label={field.label}
            value={typeof value === 'number' ? value : (value === '' ? '' : Number(value ?? field.default ?? ''))}
            onChange={(newValue) => onChange(newValue)}
            placeholder={field.placeholder}
            required={field.required || field.validationRules?.some(rule => 
              typeof rule === 'object' ? rule.type === 'required' : rule === 'required'
            )}
            error={error}
            helpText={field.helpText}
          />
        );
      
      case 'select':
        return (
          <SelectInput
            id={field.fieldKey}
            label={field.label}
            value={String(value ?? field.default ?? '')}
            onChange={(newValue) => onChange(newValue)}
            options={field.options || []}
            placeholder={field.placeholder}
            required={field.required || field.validationRules?.some(rule => 
              typeof rule === 'object' ? rule.type === 'required' : rule === 'required'
            )}
            error={error}
            helpText={field.helpText}
          />
        );

      case 'multi-select':
        return (
          <MultiSelectInput
            id={field.fieldKey}
            label={field.label}
            value={Array.isArray(value) ? value : (value ? [String(value)] : (field.default as string[]) || [])}
            onChange={(newValue) => onChange(newValue)}
            options={field.options || []}
            required={field.required || field.validationRules?.some(rule => 
              typeof rule === 'object' ? rule.type === 'required' : rule === 'required'
            )}
            error={error}
            helpText={field.helpText}
          />
        );
      
      case 'textarea':
        return (
          <TextareaInput
            id={field.fieldKey}
            label={field.label}
            value={String(value ?? field.default ?? '')}
            onChange={(newValue) => onChange(newValue)}
            placeholder={field.placeholder}
            required={field.required || field.validationRules?.some(rule => 
              typeof rule === 'object' ? rule.type === 'required' : rule === 'required'
            )}
            error={error}
            helpText={field.helpText}
          />
        );
      
      case 'boolean':
        return (
          <BooleanInput
            id={field.fieldKey}
            label={field.label}
            value={Boolean(value ?? field.default ?? false)}
            onChange={(newValue) => onChange(newValue)}
            required={field.required || field.validationRules?.some(rule => 
              typeof rule === 'object' ? rule.type === 'required' : rule === 'required'
            )}
            error={error}
            helpText={field.helpText}
          />
        );
      
      case 'date':
        return (
          <DateInput
            id={field.fieldKey}
            label={field.label}
            value={String(value ?? field.default ?? '')}
            onChange={(newValue) => onChange(newValue)}
            placeholder={field.placeholder}
            required={field.required || field.validationRules?.some(rule => 
              typeof rule === 'object' ? rule.type === 'required' : rule === 'required'
            )}
            error={error}
            helpText={field.helpText}
          />
        );
      
      case 'file':
        return (
          <FileInput
            id={field.fieldKey}
            label={field.label}
            value={value instanceof FileList ? value : null}
            onChange={(newValue) => onChange(newValue)}
            accept={field.customProps?.accept as string}
            multiple={field.customProps?.multiple as boolean}
            required={field.required || field.validationRules?.some(rule => 
              typeof rule === 'object' ? rule.type === 'required' : rule === 'required'
            )}
            error={error}
            helpText={field.helpText}
          />
        );
      
      default:
        console.warn(`Unsupported field type: ${field.type}`);
        return (
          <TextInput
            id={field.fieldKey}
            label={field.label}
            value={String(value ?? field.default ?? '')}
            onChange={(newValue) => onChange(newValue)}
            type="text"
            placeholder={field.placeholder}
            required={field.required || field.validationRules?.some(rule => 
              typeof rule === 'object' ? rule.type === 'required' : rule === 'required'
            )}
            error={error}
            helpText={field.helpText}
          />
        );
    }
  };

  return (
    <div className={cn(
      "space-y-2",
      error && "text-destructive"
    )}>
      {renderInput()}
    </div>
  );
}; 