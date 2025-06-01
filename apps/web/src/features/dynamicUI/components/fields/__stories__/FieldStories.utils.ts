import type { Meta } from '@storybook/react';
import React from 'react';

/**
 * Shared utilities for Dynamic UI Field Stories
 * Provides common configurations, mock data, and TypeScript types for consistency
 */

// Common story configurations
export const commonStoryConfig = {
  parameters: {
    layout: 'centered' as const,
  },
  tags: ['autodocs'] as const,
  decorators: [
    (Story: React.ComponentType) => React.createElement(
      'div',
      { className: 'max-w-md' },
      React.createElement(Story)
    ),
  ],
};

// Common argTypes for all field components
export const baseFieldArgTypes = {
  id: {
    control: 'text',
    description: 'Unique identifier for the field',
  },
  label: {
    control: 'text',
    description: 'Label text displayed with the field',
  },
  onChange: {
    action: 'changed',
    description: 'Callback function called when field value changes',
  },
  required: {
    control: 'boolean',
    description: 'Whether the field is required',
  },
  error: {
    control: 'text',
    description: 'Error message to display',
  },
  helpText: {
    control: 'text',
    description: 'Help text to guide the user',
  },
};

// Specific argTypes for different field types
export const textFieldArgTypes = {
  ...baseFieldArgTypes,
  value: {
    control: 'text',
    description: 'Current text value of the field',
  },
  placeholder: {
    control: 'text',
    description: 'Placeholder text shown when field is empty',
  },
};

export const numberFieldArgTypes = {
  ...baseFieldArgTypes,
  value: {
    control: 'number',
    description: 'Current numeric value of the field',
  },
  placeholder: {
    control: 'text',
    description: 'Placeholder text shown when field is empty',
  },
};

export const booleanFieldArgTypes = {
  ...baseFieldArgTypes,
  value: {
    control: 'boolean',
    description: 'Current boolean value (checked/unchecked)',
  },
};

export const selectFieldArgTypes = {
  ...baseFieldArgTypes,
  value: {
    control: 'text',
    description: 'Currently selected value',
  },
  options: {
    control: 'object',
    description: 'Array of selectable options',
  },
  placeholder: {
    control: 'text',
    description: 'Placeholder text shown when no option is selected',
  },
};

export const multiSelectFieldArgTypes = {
  ...baseFieldArgTypes,
  value: {
    control: 'object',
    description: 'Array of currently selected values',
  },
  options: {
    control: 'object',
    description: 'Array of selectable options',
  },
};

export const dateFieldArgTypes = {
  ...baseFieldArgTypes,
  value: {
    control: 'text',
    description: 'Current date value in YYYY-MM-DD format',
  },
  placeholder: {
    control: 'text',
    description: 'Placeholder text (limited browser support)',
  },
};

export const fileFieldArgTypes = {
  ...baseFieldArgTypes,
  value: {
    control: false,
    description: 'Current FileList value',
  },
  accept: {
    control: 'text',
    description: 'Accepted file types (MIME types or extensions)',
  },
  multiple: {
    control: 'boolean',
    description: 'Allow multiple file selection',
  },
};

// Common mock data sets
export const mockDataSets = {
  countries: [
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'de', label: 'Germany' },
    { value: 'fr', label: 'France' },
    { value: 'au', label: 'Australia' },
    { value: 'jp', label: 'Japan' },
    { value: 'br', label: 'Brazil' },
    { value: 'in', label: 'India' },
    { value: 'cn', label: 'China' },
  ],
  
  priorities: [
    { value: 'low', label: 'Low Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'high', label: 'High Priority' },
    { value: 'urgent', label: 'Urgent' },
  ],
  
  categories: [
    { value: 'electronics', label: 'Electronics' },
    { value: 'clothing', label: 'Clothing & Apparel' },
    { value: 'books', label: 'Books & Media' },
    { value: 'home', label: 'Home & Garden' },
    { value: 'sports', label: 'Sports & Outdoors' },
    { value: 'toys', label: 'Toys & Games' },
    { value: 'automotive', label: 'Automotive' },
    { value: 'health', label: 'Health & Beauty' },
  ],
  
  skills: [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue.js' },
    { value: 'angular', label: 'Angular' },
    { value: 'node', label: 'Node.js' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'csharp', label: 'C#' },
    { value: 'go', label: 'Go' },
  ],
  
  departments: [
    { value: 'engineering', label: 'Engineering' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'sales', label: 'Sales' },
    { value: 'hr', label: 'Human Resources' },
    { value: 'finance', label: 'Finance' },
    { value: 'operations', label: 'Operations' },
    { value: 'support', label: 'Customer Support', disabled: true },
  ],
  
  languages: [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'it', label: 'Italian' },
    { value: 'pt', label: 'Portuguese' },
    { value: 'zh', label: 'Chinese' },
    { value: 'ja', label: 'Japanese' },
    { value: 'ko', label: 'Korean' },
    { value: 'ar', label: 'Arabic' },
    { value: 'hi', label: 'Hindi' },
    { value: 'ru', label: 'Russian' },
  ],
};

// Common validation rules and error messages
export const validationExamples = {
  required: 'This field is required',
  email: 'Please enter a valid email address',
  minLength: (min: number) => `Must be at least ${min} characters long`,
  maxLength: (max: number) => `Must be no more than ${max} characters long`,
  minValue: (min: number) => `Value must be at least ${min}`,
  maxValue: (max: number) => `Value must be no more than ${max}`,
  pattern: 'Please enter a valid format',
  fileType: 'File type not allowed',
  fileSize: 'File size too large',
  dateRange: 'Date must be within the allowed range',
  selectRequired: 'Please select an option',
  multiSelectMinimum: (min: number) => `Please select at least ${min} options`,
};

// Common help text examples
export const helpTextExamples = {
  password: 'Must be at least 8 characters with uppercase, lowercase, and numbers',
  email: 'We will use this email to send you important updates',
  phone: 'Include country code for international numbers',
  website: 'Enter the full URL including https://',
  description: 'Provide as much detail as possible',
  optional: 'This field is optional',
  required: 'This field is required for account creation',
  fileUpload: 'Drag and drop files here or click to browse',
  multiSelect: 'You can select multiple options',
  dateRange: 'Select a date within the allowed range',
};

// TypeScript interfaces for story arguments
export interface BaseFieldStoryArgs {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  helpText?: string;
}

export interface TextFieldStoryArgs extends BaseFieldStoryArgs {
  value: string;
  placeholder?: string;
}

export interface NumberFieldStoryArgs extends BaseFieldStoryArgs {
  value: number | '';
  placeholder?: string;
}

export interface BooleanFieldStoryArgs extends BaseFieldStoryArgs {
  value: boolean;
}

export interface SelectFieldStoryArgs extends BaseFieldStoryArgs {
  value: string;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  placeholder?: string;
}

export interface MultiSelectFieldStoryArgs extends BaseFieldStoryArgs {
  value: string[];
  options: Array<{ value: string; label: string; disabled?: boolean }>;
}

export interface DateFieldStoryArgs extends BaseFieldStoryArgs {
  value: string;
  placeholder?: string;
}

export interface FileFieldStoryArgs extends BaseFieldStoryArgs {
  value?: FileList | null;
  accept?: string;
  multiple?: boolean;
}

// Utility functions for creating consistent stories
export const createFieldStory = <T extends BaseFieldStoryArgs>(
  title: string,
  component: React.ComponentType<T>,
  argTypes: Record<string, unknown>
) => ({
  title,
  component,
  ...commonStoryConfig,
  argTypes,
});

// Mock FileList creator utility
export const createMockFileList = (files: Array<{ name: string; size: number; type: string }>): FileList => {
  const fileList = files.map(file => {
    const mockFile = new File(['mock content'], file.name, { type: file.type });
    Object.defineProperty(mockFile, 'size', { value: file.size });
    return mockFile;
  });
  
  const mockFileList = {
    length: fileList.length,
    item: (index: number) => fileList[index] || null,
    [Symbol.iterator]: function* () {
      for (let i = 0; i < fileList.length; i++) {
        yield fileList[i];
      }
    }
  } as FileList;
  
  // Add array-like indexing
  fileList.forEach((file, index) => {
    Object.defineProperty(mockFileList, index, { value: file, enumerable: true });
  });
  
  return mockFileList;
};

// Common date utilities for date field stories
export const dateUtilities = {
  today: () => new Date().toISOString().split('T')[0],
  addDays: (date: string, days: number) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  },
  formatDate: (date: string) => new Date(date).toLocaleDateString(),
  isWeekend: (date: string) => {
    const d = new Date(date);
    return d.getDay() === 0 || d.getDay() === 6;
  },
};

// File size formatting utility
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}; 