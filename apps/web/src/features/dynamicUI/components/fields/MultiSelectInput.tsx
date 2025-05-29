import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface MultiSelectInputProps {
  id: string;
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  options: SelectOption[];
  required?: boolean;
  error?: string;
  helpText?: string;
}

export const MultiSelectInput: React.FC<MultiSelectInputProps> = ({
  id,
  label,
  value,
  onChange,
  options,
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
    <div className="space-y-2">
      <Label 
        htmlFor={id} 
        className={cn(
          "text-sm font-medium text-foreground",
          required && "after:content-['*'] after:ml-1 after:text-destructive"
        )}
      >
        {label}
      </Label>
      
      <div 
        id={id}
        className={cn(
          "border rounded-md bg-background",
          error ? "border-destructive" : "border-input"
        )}
        aria-describedby={error ? `${id}-error` : helpText ? `${id}-help` : undefined}
      >
        {options.length === 0 ? (
          <div className="p-3 text-sm text-muted-foreground">
            No options available
          </div>
        ) : (
          <div className="max-h-48 overflow-y-auto">
            {options.map((option, index) => {
              const isSelected = value.includes(option.value);
              const checkboxId = `${id}-option-${index}`;
              
              return (
                <div
                  key={option.value}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 hover:bg-accent cursor-pointer",
                    "border-b border-border last:border-b-0",
                    option.disabled && "cursor-not-allowed opacity-50"
                  )}
                  onClick={() => !option.disabled && handleChange(option.value, !isSelected)}
                >
                  <Checkbox
                    id={checkboxId}
                    checked={isSelected}
                    onCheckedChange={(checked) => handleChange(option.value, checked === true)}
                    disabled={option.disabled}
                    className={cn(
                      error && "border-destructive data-[state=checked]:bg-destructive"
                    )}
                  />
                  <Label
                    htmlFor={checkboxId}
                    className="text-sm cursor-pointer flex-1"
                  >
                    {option.label}
                  </Label>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {value.length > 0 && !error && (
        <div className="text-sm text-muted-foreground">
          Selected: {value.length} item{value.length !== 1 ? 's' : ''}
        </div>
      )}
      
      {error && (
        <div id={`${id}-error`} className="text-sm text-destructive" role="alert">
          {error}
        </div>
      )}
      
      {helpText && !error && (
        <div id={`${id}-help`} className="text-sm text-muted-foreground">
          {helpText}
        </div>
      )}
    </div>
  );
}; 