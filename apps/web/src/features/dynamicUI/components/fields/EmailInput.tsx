import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface EmailInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  helpText?: string;
  disabled?: boolean;
  warning?: boolean;
}

export const EmailInput: React.FC<EmailInputProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder = 'Enter email address',
  required,
  error,
  helpText,
  disabled,
  warning
}) => {
  // Basic email validation for visual feedback
  const isValidEmail = (email: string): boolean => {
    if (!email) return true; // Allow empty values, let required validation handle it
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const hasValidationError = value && !isValidEmail(value);
  const displayError = error || (hasValidationError ? 'Please enter a valid email address' : undefined);

  return (
    <div className="space-y-2">
      <Label 
        htmlFor={id} 
        className={cn(
          "text-sm font-medium text-foreground",
          required && "after:content-['*'] after:ml-1 after:text-destructive",
          warning && !displayError && "text-amber-600 dark:text-amber-400"
        )}
      >
        {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type="email"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={cn(
            "w-full pr-10",
            displayError && "border-destructive focus:ring-destructive",
            warning && !displayError && "border-amber-400 focus:ring-amber-400 bg-amber-50 dark:bg-amber-950/20"
          )}
          aria-describedby={displayError ? `${id}-error` : helpText ? `${id}-help` : undefined}
        />
        {/* Email icon */}
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <svg 
            className={cn(
              "h-4 w-4",
              hasValidationError ? "text-destructive" : "text-muted-foreground"
            )} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" 
            />
          </svg>
        </div>
      </div>
      {displayError && (
        <div id={`${id}-error`} className="text-sm text-destructive" role="alert">
          {displayError}
        </div>
      )}
      {helpText && !displayError && (
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