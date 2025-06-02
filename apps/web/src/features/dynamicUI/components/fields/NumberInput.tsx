import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface NumberInputProps {
  id: string;
  label: string;
  value: number | '';
  onChange: (value: number | '') => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  helpText?: string;
  disabled?: boolean;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  required,
  error,
  helpText,
  disabled
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '') {
      onChange('');
    } else {
      const numVal = parseFloat(val);
      if (!isNaN(numVal)) {
        onChange(numVal);
      }
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
      <Input
        id={id}
        type="number"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={cn(
          "w-full",
          error && "border-destructive focus:ring-destructive"
        )}
        aria-describedby={error ? `${id}-error` : helpText ? `${id}-help` : undefined}
      />
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