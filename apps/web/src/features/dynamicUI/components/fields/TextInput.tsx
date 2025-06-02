import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

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
  disabled?: boolean;
  warning?: boolean;
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
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={cn(
          "w-full",
          error && "border-destructive focus:ring-destructive",
          warning && !error && "border-amber-400 focus:ring-amber-400 bg-amber-50 dark:bg-amber-950/20"
        )}
        aria-describedby={error ? `${id}-error` : helpText ? `${id}-help` : undefined}
      />
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