# Dynamic UI Developer Guide

## Overview

This guide provides detailed implementation instructions for building the Dynamic UI System components. It includes complete TypeScript interfaces, component implementations, integration patterns, and practical examples for developers.

## TypeScript Interfaces

### Core Component Interfaces

```typescript
// Core component props
interface DynamicFormProps {
  schema: UIComponentSchema;
  initialData?: Record<string, any>;
  onSubmit: (data: Record<string, any>) => void;
  onCancel?: () => void;
  className?: string;
}

interface DynamicDisplayProps {
  schema: UIComponentSchema;
  data: Record<string, any>;
  onAction?: (actionKey: string, data?: any) => void;
  className?: string;
}

interface DynamicModalProps {
  schema: UIComponentSchema;
  isOpen: boolean;
  onClose: () => void;
  data?: Record<string, any>;
  onSubmit?: (data: Record<string, any>) => void;
  className?: string;
}
```

### Schema Definitions

```typescript
interface UIComponentSchema {
  componentId: string;
  name: string;
  description?: string;
  componentType: 'Form' | 'Modal' | 'Display' | 'Custom';
  title: string;
  fields?: FormField[];
  actions?: ActionButton[];
  displayTemplate?: string; // DEPRECATED - use customProps.displayType instead
  layout?: LayoutConfig;
  customProps?: Record<string, any>;
  version?: string;
}

interface FormField {
  fieldKey: string;
  label: string;
  type: 'text' | 'number' | 'boolean' | 'select' | 'multi-select' | 'textarea' | 'date' | 'file' | 'email';
  placeholder?: string;
  default?: any;
  validationRules?: (ValidationRule | string)[];
  options?: SelectOption[];
  visibleIf?: string;
  helpText?: string;
  required?: boolean;
}

interface ActionButton {
  actionKey: string;
  label: string;
  style: 'primary' | 'secondary' | 'danger';
  confirmation?: string;
  visibleIf?: string;
  disabled?: boolean;
}

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'min' | 'max' | 'email';
  value?: string | number;
  message?: string;
}

interface ValidationRuleReference {
  ruleId: string;
  description: string;
  type: string;
  value: string;
  errorMessage: string;
}

interface LayoutConfig {
  columns?: number;
  sections?: FormSection[];
  spacing?: 'compact' | 'normal' | 'spacious';
  order?: string[];
}

interface FormSection {
  title: string;
  fields: string[];
  collapsible?: boolean;
  defaultExpanded?: boolean;
}
```

## Component Implementations

### DynamicForm Component

```typescript
import React, { useState, useCallback } from 'react';
import { FormField } from './FormField';
import { FormActions } from './FormActions';
import { validateForm } from '../utils/validation';

export const DynamicForm: React.FC<DynamicFormProps> = ({ 
  schema, 
  initialData = {}, 
  onSubmit, 
  onCancel,
  className 
}) => {
  const [formData, setFormData] = useState<Record<string, any>>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFieldChange = useCallback((fieldKey: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldKey]: value }));
    
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
  }, [formData, schema.fields, onSubmit]);

  const handleAction = useCallback((actionKey: string) => {
    if (actionKey === 'submit') {
      handleSubmit(new Event('submit') as any);
    } else if (actionKey === 'cancel') {
      onCancel?.();
    }
  }, [handleSubmit, onCancel]);

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
        ).filter(Boolean) as FormField[]
      }));
    } else if (layout?.order) {
      // Render fields in custom order
      const orderedFields = layout.order.map(fieldKey =>
        fields.find(f => f.fieldKey === fieldKey)
      ).filter(Boolean) as FormField[];
      
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

  return (
    <form onSubmit={handleSubmit} className={`dynamic-form ${className || ''}`}>
      <div className="form-header">
        <h2 className="form-title">{schema.title}</h2>
        {schema.description && (
          <p className="form-description">{schema.description}</p>
        )}
      </div>
      
      <div 
        className={`form-body ${schema.layout?.spacing ? `spacing-${schema.layout.spacing}` : ''}`}
        style={{
          gridTemplateColumns: schema.layout?.columns ? `repeat(${schema.layout.columns}, 1fr)` : undefined
        }}
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
              <div key={`fields-${groupIndex}`} className="form-fields">
                {group.fields.map(field => (
                  <FormField
                    key={field.fieldKey}
                    field={field}
                    value={formData[field.fieldKey]}
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
      
      <div className="form-footer">
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
```

### FormField Component

```typescript
import React from 'react';
import { TextInput } from './fields/TextInput';
import { NumberInput } from './fields/NumberInput';
import { SelectInput } from './fields/SelectInput';
import { TextareaInput } from './fields/TextareaInput';
import { BooleanInput } from './fields/BooleanInput';
import { DateInput } from './fields/DateInput';
import { FileInput } from './fields/FileInput';
import { MultiSelectInput } from './fields/MultiSelectInput';
import { evaluateCondition } from '../utils/conditions';

interface FormFieldProps {
  field: FormField;
  value: any;
  error?: string;
  onChange: (value: any) => void;
  formData: Record<string, any>;
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

  const commonProps = {
    id: field.fieldKey,
    label: field.label,
    value: value ?? field.default ?? '',
    error,
    onChange,
    placeholder: field.placeholder,
    required: field.required || field.validationRules?.some(rule => rule.type === 'required'),
    helpText: field.helpText,
  };

  const renderInput = () => {
    switch (field.type) {
      case 'text':
      case 'email':
        return <TextInput {...commonProps} type={field.type} />;
      
      case 'number':
        return <NumberInput {...commonProps} />;
      
      case 'select':
        return <SelectInput {...commonProps} options={field.options || []} />;
      
      case 'textarea':
        return <TextareaInput {...commonProps} />;
      
      case 'boolean':
        return <BooleanInput {...commonProps} />;
      
      case 'date':
        return <DateInput {...commonProps} />;
      
      case 'file':
        return <FileInput {...commonProps} />;
      
      case 'multi-select':
        return <MultiSelectInput {...commonProps} options={field.options || []} />;
      
      default:
        console.warn(`Unsupported field type: ${field.type}`);
        return <TextInput {...commonProps} type="text" />;
    }
  };

  return (
    <div className={`form-field form-field--${field.type} ${error ? 'form-field--error' : ''}`}>
      {renderInput()}
    </div>
  );
};
```

### FormSection Component

```typescript
import React, { useState } from 'react';
import { FormField } from './FormField';

// FormSection Component
interface FormSectionProps {
  section: FormSection;
  fields: FormField[];
  formData: Record<string, any>;
  errors: Record<string, string>;
  onFieldChange: (fieldKey: string, value: any) => void;
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
    <div className="form-section">
      <div 
        className={`section-header ${section.collapsible ? 'collapsible' : ''}`}
        onClick={section.collapsible ? () => setIsExpanded(!isExpanded) : undefined}
      >
        <h3 className="section-title">{section.title}</h3>
        {section.collapsible && (
          <span className={`section-toggle ${isExpanded ? 'expanded' : 'collapsed'}`}>
            {isExpanded ? '−' : '+'}
          </span>
        )}
      </div>
      
      {isExpanded && (
        <div className="section-content">
          {fields.map(field => (
            <FormField
              key={field.fieldKey}
              field={field}
              value={formData[field.fieldKey]}
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
```

### Individual Field Components

```typescript
// TextInput Component
interface TextInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email';
  placeholder?: string;
  required?: boolean;
  error?: string;
  helpText?: string;
}

export const TextInput: React.FC<TextInputProps> = ({
  id,
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  required,
  error,
  helpText
}) => {
  return (
    <div className="input-group">
      <label htmlFor={id} className={`input-label ${required ? 'required' : ''}`}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className={`input ${error ? 'input--error' : ''}`}
        aria-describedby={error ? `${id}-error` : helpText ? `${id}-help` : undefined}
      />
      {error && (
        <div id={`${id}-error`} className="input-error" role="alert">
          {error}
        </div>
      )}
      {helpText && !error && (
        <div id={`${id}-help`} className="input-help">
          {helpText}
        </div>
      )}
    </div>
  );
};

// SelectInput Component
interface SelectInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  error?: string;
  helpText?: string;
}

export const SelectInput: React.FC<SelectInputProps> = ({
  id,
  label,
  value,
  onChange,
  options,
  placeholder,
  required,
  error,
  helpText
}) => {
  return (
    <div className="input-group">
      <label htmlFor={id} className={`input-label ${required ? 'required' : ''}`}>
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className={`select ${error ? 'select--error' : ''}`}
        aria-describedby={error ? `${id}-error` : helpText ? `${id}-help` : undefined}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map(option => (
          <option 
            key={option.value} 
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <div id={`${id}-error`} className="input-error" role="alert">
          {error}
        </div>
      )}
      {helpText && !error && (
        <div id={`${id}-help`} className="input-help">
          {helpText}
        </div>
      )}
    </div>
  );
};

// MultiSelectInput Component
interface MultiSelectInputProps {
  id: string;
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  error?: string;
  helpText?: string;
}

export const MultiSelectInput: React.FC<MultiSelectInputProps> = ({
  id,
  label,
  value = [],
  onChange,
  options,
  placeholder,
  required,
  error,
  helpText
}) => {
  const handleChange = (optionValue: string, checked: boolean) => {
    if (checked) {
      onChange([...value, optionValue]);
    } else {
      onChange(value.filter(v => v !== optionValue));
    }
  };

  return (
    <div className="input-group">
      <label className={`input-label ${required ? 'required' : ''}`}>
        {label}
      </label>
      <div className="multi-select" aria-describedby={error ? `${id}-error` : helpText ? `${id}-help` : undefined}>
        {options.map(option => (
          <label key={option.value} className="checkbox-label">
            <input
              type="checkbox"
              checked={value.includes(option.value)}
              onChange={(e) => handleChange(option.value, e.target.checked)}
              disabled={option.disabled}
              className="checkbox"
            />
            <span className="checkbox-text">{option.label}</span>
          </label>
        ))}
      </div>
      {error && (
        <div id={`${id}-error`} className="input-error" role="alert">
          {error}
        </div>
      )}
      {helpText && !error && (
        <div id={`${id}-help`} className="input-help">
          {helpText}
        </div>
      )}
    </div>
  );
};

// DateInput Component
interface DateInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  helpText?: string;
}

export const DateInput: React.FC<DateInputProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  required,
  error,
  helpText
}) => {
  return (
    <div className="input-group">
      <label htmlFor={id} className={`input-label ${required ? 'required' : ''}`}>
        {label}
      </label>
      <input
        id={id}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className={`input ${error ? 'input--error' : ''}`}
        aria-describedby={error ? `${id}-error` : helpText ? `${id}-help` : undefined}
      />
      {error && (
        <div id={`${id}-error`} className="input-error" role="alert">
          {error}
        </div>
      )}
      {helpText && !error && (
        <div id={`${id}-help`} className="input-help">
          {helpText}
        </div>
      )}
    </div>
  );
};

// FileInput Component
interface FileInputProps {
  id: string;
  label: string;
  value: File | null;
  onChange: (value: File | null) => void;
  accept?: string;
  required?: boolean;
  error?: string;
  helpText?: string;
}

export const FileInput: React.FC<FileInputProps> = ({
  id,
  label,
  value,
  onChange,
  accept,
  required,
  error,
  helpText
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onChange(file);
  };

  return (
    <div className="input-group">
      <label htmlFor={id} className={`input-label ${required ? 'required' : ''}`}>
        {label}
      </label>
      <input
        id={id}
        type="file"
        onChange={handleChange}
        accept={accept}
        required={required}
        className={`input file-input ${error ? 'input--error' : ''}`}
        aria-describedby={error ? `${id}-error` : helpText ? `${id}-help` : undefined}
      />
      {value && (
        <div className="file-preview">
          Selected: {value.name} ({Math.round(value.size / 1024)}KB)
        </div>
      )}
      {error && (
        <div id={`${id}-error`} className="input-error" role="alert">
          {error}
        </div>
      )}
      {helpText && !error && (
        <div id={`${id}-help`} className="input-help">
          {helpText}
        </div>
      )}
    </div>
  );
};
```

### DynamicDisplay Component

```typescript
import React from 'react';
import { DisplayActions } from './DisplayActions';
import { renderTemplate } from '../utils/templates';

export const DynamicDisplay: React.FC<DynamicDisplayProps> = ({ 
  schema, 
  data, 
  onAction,
  className 
}) => {
  const handleAction = useCallback((actionKey: string) => {
    onAction?.(actionKey, data);
  }, [onAction, data]);

  return (
    <div className={`dynamic-display ${className || ''}`}>
      <div className="display-header">
        <h2 className="display-title">
          {renderTemplate(schema.title, data)}
        </h2>
      </div>
      
      {schema.displayTemplate && (
        <div className="display-content">
          <div 
            dangerouslySetInnerHTML={{
              __html: renderTemplate(schema.displayTemplate, data)
            }} 
          />
        </div>
      )}
      
      {schema.actions && schema.actions.length > 0 && (
        <div className="display-footer">
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
```

## Utility Functions

### Validation Utilities

```typescript
// validation.ts
export const validateForm = (
  data: Record<string, any>, 
  fields: FormField[],
  validationRulesLookup?: Record<string, ValidationRuleReference>
): Record<string, string> => {
  const errors: Record<string, string> = {};

  fields.forEach(field => {
    const value = data[field.fieldKey];
    const fieldErrors = validateField(value, field, validationRulesLookup);
    
    if (fieldErrors.length > 0) {
      errors[field.fieldKey] = fieldErrors[0]; // Show first error
    }
  });

  return errors;
};

export const validateField = (
  value: any, 
  field: FormField, 
  validationRulesLookup?: Record<string, ValidationRuleReference>
): string[] => {
  const errors: string[] = [];
  
  if (!field.validationRules) return errors;

  field.validationRules.forEach(rule => {
    let validationRule: ValidationRule;
    
    if (typeof rule === 'string') {
      // Rule is a reference to validation_rules table
      const ruleRef = validationRulesLookup?.[rule];
      if (ruleRef) {
        validationRule = {
          type: ruleRef.type as any,
          value: ruleRef.value,
          message: ruleRef.errorMessage
        };
      } else {
        console.warn(`Validation rule not found: ${rule}`);
        return;
      }
    } else {
      // Rule is inline
      validationRule = rule;
    }
    
    const error = validateRule(value, validationRule, field.label);
    if (error) {
      errors.push(error);
    }
  });

  return errors;
};

const validateRule = (value: any, rule: ValidationRule, fieldLabel: string): string | null => {
  switch (rule.type) {
    case 'required':
      if (!value || value === '') {
        return rule.message || `${fieldLabel} is required`;
      }
      break;
      
    case 'minLength':
      if (value && value.length < (rule.value as number)) {
        return rule.message || `${fieldLabel} must be at least ${rule.value} characters`;
      }
      break;
      
    case 'maxLength':
      if (value && value.length > (rule.value as number)) {
        return rule.message || `${fieldLabel} must be no more than ${rule.value} characters`;
      }
      break;
      
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value && !emailRegex.test(value)) {
        return rule.message || `${fieldLabel} must be a valid email address`;
      }
      break;
      
    case 'pattern':
      if (value && rule.value) {
        const regex = new RegExp(rule.value as string);
        if (!regex.test(value)) {
          return rule.message || `${fieldLabel} format is invalid`;
        }
      }
      break;
      
    case 'min':
      if (value !== undefined && Number(value) < (rule.value as number)) {
        return rule.message || `${fieldLabel} must be at least ${rule.value}`;
      }
      break;
      
    case 'max':
      if (value !== undefined && Number(value) > (rule.value as number)) {
        return rule.message || `${fieldLabel} must be no more than ${rule.value}`;
      }
      break;
  }
  
  return null;
};
```

### Template Utilities

```typescript
// templates.ts
export const renderTemplate = (template: string, data: Record<string, any>): string => {
  return template.replace(/\{\{([^}]+)\}\}/g, (match, expression) => {
    try {
      const value = evaluateExpression(expression.trim(), data);
      return value?.toString() || '';
    } catch (error) {
      console.warn(`Template expression error: ${expression}`, error);
      return match; // Return original if evaluation fails
    }
  });
};

const evaluateExpression = (expression: string, data: Record<string, any>): any => {
  // Handle simple property access (e.g., "user.name", "amount")
  const keys = expression.split('.');
  let value = data;
  
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return undefined;
    }
  }
  
  return value;
};
```

### Condition Evaluation

```typescript
// conditions.ts
export const evaluateCondition = (condition: string, formData: Record<string, any>): boolean => {
  try {
    // Simple condition evaluation for MVP
    // Supports: fieldName === 'value', fieldName !== 'value'
    
    if (condition.includes('===')) {
      const [field, value] = condition.split('===').map(s => s.trim());
      const fieldValue = getFieldValue(field, formData);
      const expectedValue = value.replace(/['"]/g, ''); // Remove quotes
      return fieldValue === expectedValue;
    }
    
    if (condition.includes('!==')) {
      const [field, value] = condition.split('!==').map(s => s.trim());
      const fieldValue = getFieldValue(field, formData);
      const expectedValue = value.replace(/['"]/g, '');
      return fieldValue !== expectedValue;
    }
    
    // Default: treat as field name, check if truthy
    return !!getFieldValue(condition, formData);
    
  } catch (error) {
    console.warn(`Condition evaluation error: ${condition}`, error);
    return false;
  }
};

const getFieldValue = (fieldPath: string, formData: Record<string, any>): any => {
  const keys = fieldPath.split('.');
  let value = formData;
  
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return undefined;
    }
  }
  
  return value;
};
```

## Redux Integration

### Dynamic UI Slice

```typescript
// dynamicUISlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface DynamicUIState {
  schemas: Record<string, UIComponentSchema>;
  formData: Record<string, Record<string, any>>;
  loading: Record<string, boolean>;
  errors: Record<string, string | null>;
}

const initialState: DynamicUIState = {
  schemas: {},
  formData: {},
  loading: {},
  errors: {}
};

// Async thunk for fetching schemas
export const fetchSchema = createAsyncThunk(
  'dynamicUI/fetchSchema',
  async (componentId: string) => {
    const response = await fetch(`/api/ui-components/${componentId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch schema: ${response.statusText}`);
    }
    return response.json();
  }
);

const dynamicUISlice = createSlice({
  name: 'dynamicUI',
  initialState,
  reducers: {
    setSchema: (state, action: PayloadAction<UIComponentSchema>) => {
      state.schemas[action.payload.componentId] = action.payload;
    },
    
    updateFormData: (state, action: PayloadAction<{ componentId: string; data: Record<string, any> }>) => {
      const { componentId, data } = action.payload;
      state.formData[componentId] = { ...state.formData[componentId], ...data };
    },
    
    clearFormData: (state, action: PayloadAction<string>) => {
      delete state.formData[action.payload];
    },
    
    setError: (state, action: PayloadAction<{ componentId: string; error: string | null }>) => {
      const { componentId, error } = action.payload;
      state.errors[componentId] = error;
    }
  },
  
  extraReducers: (builder) => {
    builder
      .addCase(fetchSchema.pending, (state, action) => {
        state.loading[action.meta.arg] = true;
        state.errors[action.meta.arg] = null;
      })
      .addCase(fetchSchema.fulfilled, (state, action) => {
        state.loading[action.meta.arg] = false;
        state.schemas[action.payload.componentId] = action.payload;
      })
      .addCase(fetchSchema.rejected, (state, action) => {
        state.loading[action.meta.arg] = false;
        state.errors[action.meta.arg] = action.error.message || 'Failed to fetch schema';
      });
  }
});

export const { setSchema, updateFormData, clearFormData, setError } = dynamicUISlice.actions;
export default dynamicUISlice.reducer;

// Selectors
export const selectSchema = (state: RootState, componentId: string) => 
  state.dynamicUI.schemas[componentId];

export const selectFormData = (state: RootState, componentId: string) => 
  state.dynamicUI.formData[componentId] || {};

export const selectIsLoading = (state: RootState, componentId: string) => 
  state.dynamicUI.loading[componentId] || false;

export const selectError = (state: RootState, componentId: string) => 
  state.dynamicUI.errors[componentId];
```

## API Integration

### UI Components API Service

```typescript
// uiComponentsApi.ts
export interface UIComponentsAPI {
  getSchema(componentId: string): Promise<UIComponentSchema>;
  getSchemasByType(componentType: string): Promise<UIComponentSchema[]>;
  createSchema(schema: Omit<UIComponentSchema, 'componentId'>): Promise<UIComponentSchema>;
  updateSchema(componentId: string, schema: Partial<UIComponentSchema>): Promise<UIComponentSchema>;
  deleteSchema(componentId: string): Promise<void>;
  getValidationRules(ruleIds: string[]): Promise<Record<string, ValidationRuleReference>>;
}

export const uiComponentsApi: UIComponentsAPI = {
  async getSchema(componentId: string): Promise<UIComponentSchema> {
    const response = await fetch(`/api/ui-components/${componentId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch schema: ${response.statusText}`);
    }
    
    return response.json();
  },

  async getSchemasByType(componentType: string): Promise<UIComponentSchema[]> {
    const response = await fetch(`/api/ui-components?type=${encodeURIComponent(componentType)}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch schemas: ${response.statusText}`);
    }
    
    return response.json();
  },

  async createSchema(schema: Omit<UIComponentSchema, 'componentId'>): Promise<UIComponentSchema> {
    const response = await fetch('/api/ui-components', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(schema),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create schema: ${response.statusText}`);
    }
    
    return response.json();
  },

  async updateSchema(componentId: string, schema: Partial<UIComponentSchema>): Promise<UIComponentSchema> {
    const response = await fetch(`/api/ui-components/${componentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(schema),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update schema: ${response.statusText}`);
    }
    
    return response.json();
  },

  async deleteSchema(componentId: string): Promise<void> {
    const response = await fetch(`/api/ui-components/${componentId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete schema: ${response.statusText}`);
    }
  },

  async getValidationRules(ruleIds: string[]): Promise<Record<string, ValidationRuleReference>> {
    const response = await fetch('/api/validation-rules', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ruleIds }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch validation rules: ${response.statusText}`);
    }
    
    return response.json();
  },
};
```

## Usage Examples

### Task Execution Form

```typescript
// TaskExecutionForm.tsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DynamicForm } from '../components/DynamicForm';
import { fetchSchema, selectSchema, selectIsLoading, selectError } from '../store/dynamicUISlice';
import { submitTask } from '../store/tasksSlice';

interface TaskExecutionFormProps {
  taskId: string;
  taskType: string;
}

export const TaskExecutionForm: React.FC<TaskExecutionFormProps> = ({ taskId, taskType }) => {
  const dispatch = useDispatch();
  const schemaId = `task-${taskType}-form`;
  
  const schema = useSelector(state => selectSchema(state, schemaId));
  const isLoading = useSelector(state => selectIsLoading(state, schemaId));
  const error = useSelector(state => selectError(state, schemaId));

  useEffect(() => {
    if (!schema && !isLoading) {
      dispatch(fetchSchema(schemaId));
    }
  }, [dispatch, schema, isLoading, schemaId]);

  const handleSubmit = async (formData: Record<string, any>) => {
    try {
      await dispatch(submitTask({ taskId, data: formData })).unwrap();
      // Handle success (e.g., navigate away, show success message)
    } catch (error) {
      // Handle error (e.g., show error message)
      console.error('Task submission failed:', error);
    }
  };

  const handleCancel = () => {
    // Navigate back to task list or previous page
    window.history.back();
  };

  if (isLoading) {
    return <div className="loading">Loading form...</div>;
  }

  if (error) {
    return <div className="error">Error loading form: {error}</div>;
  }

  if (!schema) {
    return <div className="error">Form configuration not found</div>;
  }

  return (
    <div className="task-execution-form">
      <DynamicForm
        schema={schema}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        className="task-form"
      />
    </div>
  );
};
```

## CSS Styling Guidelines

### Base Styles

```css
/* Dynamic Form Styles */
.dynamic-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 24px;
  background: var(--surface-color);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-medium);
}

.form-header {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-color);
}

.form-title {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: var(--text-primary);
}

.form-body {
  margin-bottom: 24px;
}

.form-field {
  margin-bottom: 20px;
}

.form-field--error {
  --input-border-color: var(--error-color);
}

/* Input Styles */
.input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.input-label {
  font-weight: 500;
  color: var(--text-primary);
  font-size: 14px;
}

.input-label.required::after {
  content: ' *';
  color: var(--error-color);
}

.input,
.select,
.textarea {
  padding: 12px;
  border: 1px solid var(--input-border-color, var(--border-color));
  border-radius: var(--border-radius);
  font-size: 16px;
  transition: border-color 0.2s ease;
}

.input:focus,
.select:focus,
.textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px var(--primary-color-alpha);
}

.input--error,
.select--error,
.textarea--error {
  border-color: var(--error-color);
}

.input-error {
  color: var(--error-color);
  font-size: 14px;
  margin-top: 4px;
}

.input-help {
  color: var(--text-secondary);
  font-size: 14px;
  margin-top: 4px;
}

/* Button Styles */
.form-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: var(--border-radius);
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn--primary {
  background: var(--primary-color);
  color: white;
}

.btn--primary:hover {
  background: var(--primary-color-dark);
}

.btn--secondary {
  background: var(--surface-color);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn--secondary:hover {
  background: var(--surface-hover);
}

.btn--danger {
  background: var(--error-color);
  color: white;
}

.btn--danger:hover {
  background: var(--error-color-dark);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Form Section Styles */
.form-section {
  margin-bottom: 24px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  overflow: hidden;
}

.section-header {
  padding: 16px;
  background: var(--surface-secondary);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-header.collapsible {
  cursor: pointer;
  user-select: none;
}

.section-header.collapsible:hover {
  background: var(--surface-hover);
}

.section-title {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
  color: var(--text-primary);
}

.section-toggle {
  font-size: 20px;
  font-weight: bold;
  color: var(--text-secondary);
  transition: transform 0.2s ease;
}

.section-content {
  padding: 20px;
}

/* Multi-Select Styles */
.multi-select {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  border: 1px solid var(--input-border-color, var(--border-color));
  border-radius: var(--border-radius);
  background: var(--surface-color);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
}

.checkbox {
  width: 16px;
  height: 16px;
  accent-color: var(--primary-color);
}

.checkbox-text {
  color: var(--text-primary);
}

/* File Input Styles */
.file-input {
  padding: 8px;
}

.file-preview {
  margin-top: 8px;
  padding: 8px;
  background: var(--surface-secondary);
  border-radius: var(--border-radius);
  font-size: 14px;
  color: var(--text-secondary);
}

/* Layout Spacing Variants */
.form-body.spacing-compact {
  gap: 12px;
}

.form-body.spacing-normal {
  gap: 20px;
}

.form-body.spacing-spacious {
  gap: 32px;
}

/* Grid Layout Support */
.form-body[style*="grid-template-columns"] {
  display: grid;
  gap: 20px;
}

.form-description {
  margin: 8px 0 0 0;
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.4;
}
```

## Testing Guidelines

### Unit Testing

```typescript
// DynamicForm.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DynamicForm } from '../DynamicForm';

const mockSchema: UIComponentSchema = {
  componentId: 'test-form',
  name: 'Test Form',
  componentType: 'Form',
  title: 'Test Form',
  fields: [
    {
      fieldKey: 'name',
      label: 'Name',
      type: 'text',
      validationRules: [{ type: 'required' }]
    },
    {
      fieldKey: 'email',
      label: 'Email',
      type: 'email',
      validationRules: [{ type: 'required' }, { type: 'email' }]
    }
  ],
  actions: [
    { actionKey: 'submit', label: 'Submit', style: 'primary' },
    { actionKey: 'cancel', label: 'Cancel', style: 'secondary' }
  ]
};

describe('DynamicForm', () => {
  it('renders form fields correctly', () => {
    const onSubmit = jest.fn();
    
    render(<DynamicForm schema={mockSchema} onSubmit={onSubmit} />);
    
    expect(screen.getByLabelText('Name *')).toBeInTheDocument();
    expect(screen.getByLabelText('Email *')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    const onSubmit = jest.fn();
    
    render(<DynamicForm schema={mockSchema} onSubmit={onSubmit} />);
    
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    
    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument();
      expect(screen.getByText('Email is required')).toBeInTheDocument();
    });
    
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits form with valid data', async () => {
    const onSubmit = jest.fn();
    
    render(<DynamicForm schema={mockSchema} onSubmit={onSubmit} />);
    
    fireEvent.change(screen.getByLabelText('Name *'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText('Email *'), { target: { value: 'john@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com'
      });
    });
  });
});
```

## Common Patterns and Best Practices

### Error Handling

```typescript
// Error boundary for dynamic components
class DynamicUIErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ComponentType<{ error: Error }> },
  { hasError: boolean; error?: Error }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Dynamic UI Error:', error, errorInfo);
    // Log to error reporting service
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return <FallbackComponent error={this.state.error!} />;
    }

    return this.props.children;
  }
}

const DefaultErrorFallback: React.FC<{ error: Error }> = ({ error }) => (
  <div className="error-boundary">
    <h3>Something went wrong</h3>
    <p>The form could not be loaded. Please try refreshing the page.</p>
    <details>
      <summary>Error details</summary>
      <pre>{error.message}</pre>
    </details>
  </div>
);
```

### Performance Optimization

```typescript
// Memoized form field to prevent unnecessary re-renders
export const FormField = React.memo<FormFieldProps>(({ field, value, error, onChange, formData }) => {
  // Component implementation
}, (prevProps, nextProps) => {
  // Custom comparison for optimization
  return (
    prevProps.field === nextProps.field &&
    prevProps.value === nextProps.value &&
    prevProps.error === nextProps.error &&
    // Only compare relevant formData for conditional visibility
    (prevProps.field.visibleIf ? 
      JSON.stringify(getRelevantFormData(prevProps.formData, prevProps.field.visibleIf)) === 
      JSON.stringify(getRelevantFormData(nextProps.formData, nextProps.field.visibleIf)) :
      true)
  );
});
```

## Related Documentation

* [Dynamic UI System Overview](./dynamic_ui_system.md) - High-level architecture
* [UI Components Schema](../schemas/ui_components.md) - Database schema
* [Component Library](../technical_architecture/component_library.md) - Base components
* [State Management](../technical_architecture/state_management.md) - Redux patterns
* [Universal Flag System](../../../docs/architecture/universal-flag-system.md) - Flag system documentation