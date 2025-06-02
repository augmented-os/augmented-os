import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

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
  disabled?: boolean;
  warning?: boolean;
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
  helpText,
  disabled,
  warning
}) => {
  return (
    <div className="space-y-2">
      <Label 
        htmlFor={id} 
        className={cn(
          "text-sm font-medium text-foreground",
          required && "after:content-['*'] after:ml-1 after:text-destructive",
          warning && !error && "text-amber-600 dark:text-amber-400"
        )}
      >
        {label}
      </Label>
      <Select
        value={value}
        onValueChange={onChange}
        required={required}
        disabled={disabled}
      >
        <SelectTrigger 
          className={cn(
            "w-full",
            error && "border-destructive focus:ring-destructive",
            warning && !error && "border-amber-400 focus:ring-amber-400 bg-amber-50 dark:bg-amber-950/20"
          )}
          aria-describedby={error ? `${id}-error` : helpText ? `${id}-help` : undefined}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map(option => (
            <SelectItem 
              key={option.value} 
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && (
        <div id={`${id}-error`} className="text-sm text-destructive" role="alert">
          {error}
        </div>
      )}
      {helpText && !error && (
        <div id={`${id}-help`} className={cn(
          "text-sm text-muted-foreground",
          warning && "text-amber-600 dark:text-amber-400"
        )}>
          {helpText}
        </div>
      )}
    </div>
  );
}; 