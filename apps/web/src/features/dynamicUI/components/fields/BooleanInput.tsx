import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface BooleanInputProps {
  id: string;
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  required?: boolean;
  error?: string;
  helpText?: string;
}

export const BooleanInput: React.FC<BooleanInputProps> = ({
  id,
  label,
  value,
  onChange,
  required,
  error,
  helpText
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Checkbox
          id={id}
          checked={value}
          onCheckedChange={(checked) => onChange(checked === true)}
          required={required}
          className={cn(
            error && "border-destructive data-[state=checked]:bg-destructive"
          )}
          aria-describedby={error ? `${id}-error` : helpText ? `${id}-help` : undefined}
        />
        <Label 
          htmlFor={id} 
          className={cn(
            "text-sm font-medium text-foreground cursor-pointer",
            required && "after:content-['*'] after:ml-1 after:text-destructive"
          )}
        >
          {label}
        </Label>
      </div>
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