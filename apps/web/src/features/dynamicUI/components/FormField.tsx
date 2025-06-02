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
import { ComboboxInput } from './fields/ComboboxInput';

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

  // Check if field is disabled from customProps
  const isDisabled = field.customProps?.disabled === true;
  
  // Check if field has warning state from customProps
  const hasWarning = field.customProps?.warning === true || field.customProps?.highlighted === true;
  
  // Handle onChange for disabled fields
  const handleChange = (newValue: string | number | boolean | string[] | FileList | null) => {
    if (!isDisabled) {
      onChange(newValue);
    }
  };

  const renderInput = () => {
    switch (field.type) {
      case 'text':
        return (
          <TextInput
            id={field.fieldKey}
            label={field.label}
            value={String(value ?? field.default ?? '')}
            onChange={handleChange}
            type="text"
            placeholder={field.placeholder}
            required={field.required || field.validationRules?.some(rule => 
              typeof rule === 'object' ? rule.type === 'required' : rule === 'required'
            )}
            error={error}
            helpText={field.helpText}
            disabled={isDisabled}
            warning={hasWarning}
          />
        );

      case 'email':
        return (
          <EmailInput
            id={field.fieldKey}
            label={field.label}
            value={String(value ?? field.default ?? '')}
            onChange={handleChange}
            placeholder={field.placeholder}
            required={field.required || field.validationRules?.some(rule => 
              typeof rule === 'object' ? rule.type === 'required' : rule === 'required'
            )}
            error={error}
            helpText={field.helpText}
            disabled={isDisabled}
            warning={hasWarning}
          />
        );
      
      case 'number':
        return (
          <NumberInput
            id={field.fieldKey}
            label={field.label}
            value={typeof value === 'number' ? value : (value === '' ? '' : Number(value ?? field.default ?? ''))}
            onChange={handleChange}
            placeholder={field.placeholder}
            required={field.required || field.validationRules?.some(rule => 
              typeof rule === 'object' ? rule.type === 'required' : rule === 'required'
            )}
            error={error}
            helpText={field.helpText}
            disabled={isDisabled}
          />
        );
      
      case 'select':
        return (
          <SelectInput
            id={field.fieldKey}
            label={field.label}
            value={String(value ?? field.default ?? '')}
            onChange={handleChange}
            options={field.options || []}
            placeholder={field.placeholder}
            required={field.required || field.validationRules?.some(rule => 
              typeof rule === 'object' ? rule.type === 'required' : rule === 'required'
            )}
            error={error}
            helpText={field.helpText}
            disabled={isDisabled}
            warning={hasWarning}
          />
        );

      case 'combobox':
        return (
          <ComboboxInput
            id={field.fieldKey}
            label={field.label}
            value={String(value ?? field.default ?? '')}
            onChange={handleChange}
            options={field.options || []}
            placeholder={field.placeholder}
            searchPlaceholder={field.customProps?.searchPlaceholder as string}
            emptyMessage={field.customProps?.emptyMessage as string}
            allowCustomValue={field.customProps?.allowCustomValue !== false}
            required={field.required || field.validationRules?.some(rule => 
              typeof rule === 'object' ? rule.type === 'required' : rule === 'required'
            )}
            error={error}
            helpText={field.helpText}
            disabled={isDisabled}
            warning={hasWarning}
          />
        );

      case 'multi-select':
        return (
          <MultiSelectInput
            id={field.fieldKey}
            label={field.label}
            value={Array.isArray(value) ? value : (value ? [String(value)] : (field.default as string[]) || [])}
            onChange={handleChange}
            options={field.options || []}
            required={field.required || field.validationRules?.some(rule => 
              typeof rule === 'object' ? rule.type === 'required' : rule === 'required'
            )}
            error={error}
            helpText={field.helpText}
            disabled={isDisabled}
          />
        );
      
      case 'textarea':
        return (
          <TextareaInput
            id={field.fieldKey}
            label={field.label}
            value={String(value ?? field.default ?? '')}
            onChange={handleChange}
            placeholder={field.placeholder}
            required={field.required || field.validationRules?.some(rule => 
              typeof rule === 'object' ? rule.type === 'required' : rule === 'required'
            )}
            error={error}
            helpText={field.helpText}
            disabled={isDisabled}
          />
        );
      
      case 'boolean':
        return (
          <BooleanInput
            id={field.fieldKey}
            label={field.label}
            value={Boolean(value ?? field.default ?? false)}
            onChange={handleChange}
            required={field.required || field.validationRules?.some(rule => 
              typeof rule === 'object' ? rule.type === 'required' : rule === 'required'
            )}
            error={error}
            helpText={field.helpText}
            disabled={isDisabled}
          />
        );
      
      case 'date':
        return (
          <DateInput
            id={field.fieldKey}
            label={field.label}
            value={String(value ?? field.default ?? '')}
            onChange={handleChange}
            placeholder={field.placeholder}
            required={field.required || field.validationRules?.some(rule => 
              typeof rule === 'object' ? rule.type === 'required' : rule === 'required'
            )}
            error={error}
            helpText={field.helpText}
            disabled={isDisabled}
          />
        );
      
      case 'file':
        return (
          <FileInput
            id={field.fieldKey}
            label={field.label}
            value={value instanceof FileList ? value : null}
            onChange={handleChange}
            accept={field.customProps?.accept as string}
            multiple={field.customProps?.multiple as boolean}
            required={field.required || field.validationRules?.some(rule => 
              typeof rule === 'object' ? rule.type === 'required' : rule === 'required'
            )}
            error={error}
            helpText={field.helpText}
            disabled={isDisabled}
          />
        );
      
      default:
        console.warn(`Unsupported field type: ${field.type}`);
        return (
          <TextInput
            id={field.fieldKey}
            label={field.label}
            value={String(value ?? field.default ?? '')}
            onChange={handleChange}
            type="text"
            placeholder={field.placeholder}
            required={field.required || field.validationRules?.some(rule => 
              typeof rule === 'object' ? rule.type === 'required' : rule === 'required'
            )}
            error={error}
            helpText={field.helpText}
            disabled={isDisabled}
          />
        );
    }
  };

  return (
    <div className={cn(
      "space-y-2",
      error && "text-destructive",
      isDisabled && "opacity-60 pointer-events-none"
    )}>
      {renderInput()}
    </div>
  );
}; 