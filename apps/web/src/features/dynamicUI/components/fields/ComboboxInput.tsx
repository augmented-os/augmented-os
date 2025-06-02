import React from 'react';
import { Label } from '@/components/ui/label';
import { Combobox } from '@/components/ui/combobox';
import { cn } from '@/lib/utils';

interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface ComboboxInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: ComboboxOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  required?: boolean;
  error?: string;
  helpText?: string;
  disabled?: boolean;
  warning?: boolean;
  allowCustomValue?: boolean;
}

export const ComboboxInput: React.FC<ComboboxInputProps> = ({
  id,
  label,
  value,
  onChange,
  options,
  placeholder = "Select option...",
  searchPlaceholder = "Search options...",
  emptyMessage = "No options found.",
  required,
  error,
  helpText,
  disabled,
  warning,
  allowCustomValue = true
}) => {
  // Filter out disabled options for the combobox
  const enabledOptions = options.filter(option => !option.disabled);

  const handleChange = (newValue: string) => {
    // If custom values aren't allowed, only accept values from the options list
    if (!allowCustomValue) {
      const isValidOption = enabledOptions.some(option => 
        option.value.toLowerCase() === newValue.toLowerCase()
      );
      if (!isValidOption && newValue !== '') {
        return; // Don't update if it's not a valid option
      }
    }
    onChange(newValue);
  };

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
      <div className={cn(
        "relative",
        disabled && "opacity-60 pointer-events-none"
      )}>
        <Combobox
          options={enabledOptions}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          searchPlaceholder={searchPlaceholder}
          emptyMessage={emptyMessage}
          className={cn(
            error && "[&_button]:border-destructive [&_button]:focus:ring-destructive",
            warning && !error && "[&_button]:border-amber-400 [&_button]:focus:ring-amber-400 [&_button]:bg-amber-50 [&_button]:dark:bg-amber-950/20"
          )}
        />
      </div>
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