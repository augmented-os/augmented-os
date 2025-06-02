import React, { useRef } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

interface FileInputProps {
  id: string;
  label: string;
  value?: FileList | null;
  onChange: (value: FileList | null) => void;
  accept?: string;
  multiple?: boolean;
  required?: boolean;
  error?: string;
  helpText?: string;
  disabled?: boolean;
}

export const FileInput: React.FC<FileInputProps> = ({
  id,
  label,
  value,
  onChange,
  accept,
  multiple = false,
  required,
  error,
  helpText,
  disabled
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    onChange(files);
  };

  const handleClear = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onChange(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      if (fileInputRef.current) {
        fileInputRef.current.files = files;
      }
      onChange(files);
    }
  };

  const hasFiles = value && value.length > 0;

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
        className={cn(
          "relative border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 cursor-pointer",
          error ? "border-destructive bg-destructive/5" : "border-input hover:border-accent-foreground hover:bg-accent/5",
          "focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
        )}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        aria-describedby={error ? `${id}-error` : helpText ? `${id}-help` : undefined}
      >
        <input
          ref={fileInputRef}
          id={id}
          type="file"
          onChange={handleChange}
          required={required}
          accept={accept}
          multiple={multiple}
          className="hidden"
          disabled={disabled}
        />
        
        <div className="space-y-3">
          <svg className="mx-auto h-12 w-12 text-muted-foreground" stroke="currentColor" fill="none" viewBox="0 0 48 48">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          
          {hasFiles ? (
            <div className="space-y-2">
              <p className="text-sm text-foreground">
                {value!.length} file{value!.length !== 1 ? 's' : ''} selected
              </p>
              <div className="text-xs text-muted-foreground space-y-1 max-h-20 overflow-y-auto">
                {Array.from(value!).map((file, index) => (
                  <div key={index} className="truncate">
                    {file.name} ({(file.size / 1024).toFixed(1)} KB)
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
                className="mt-2"
              >
                Clear files
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-foreground">
                <span className="font-medium text-primary">Click to upload</span> or drag and drop
              </p>
              {accept && (
                <p className="text-xs text-muted-foreground">
                  Accepted: {accept}
                </p>
              )}
              {multiple && (
                <p className="text-xs text-muted-foreground">
                  Multiple files allowed
                </p>
              )}
            </div>
          )}
        </div>
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