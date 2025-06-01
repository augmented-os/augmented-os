import type { Meta, StoryObj } from '@storybook/react';
import { FormSection } from './FormSection';
import type { FormSection as FormSectionType, FormField } from '../types/schemas';

const meta: Meta<typeof FormSection> = {
  title: 'Dynamic UI/Composite Components/Form Section',
  component: FormSection,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A form section component that groups related fields with optional collapsible functionality. Supports various field types and layouts.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    section: {
      control: 'object',
      description: 'Section configuration including title, fields, and collapse settings',
    },
    fields: {
      control: 'object',
      description: 'Array of field definitions to render in the section',
    },
    formData: {
      control: 'object',
      description: 'Current form data object',
    },
    errors: {
      control: 'object',
      description: 'Object mapping field keys to error messages',
    },
    onFieldChange: {
      action: 'field-changed',
      description: 'Callback function called when a field value changes',
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-2xl">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Mock field definitions
const basicFields: FormField[] = [
  {
    fieldKey: 'firstName',
    label: 'First Name',
    type: 'text',
    placeholder: 'Enter your first name',
    required: true,
  },
  {
    fieldKey: 'lastName',
    label: 'Last Name',
    type: 'text',
    placeholder: 'Enter your last name',
    required: true,
  },
  {
    fieldKey: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'Enter your email address',
    required: true,
  },
];

const complexFields: FormField[] = [
  {
    fieldKey: 'department',
    label: 'Department',
    type: 'select',
    required: true,
    options: [
      { value: 'engineering', label: 'Engineering' },
      { value: 'marketing', label: 'Marketing' },
      { value: 'sales', label: 'Sales' },
      { value: 'hr', label: 'Human Resources' },
    ],
  },
  {
    fieldKey: 'isManager',
    label: 'Are you a manager?',
    type: 'boolean',
  },
  {
    fieldKey: 'teamSize',
    label: 'Team Size',
    type: 'number',
    placeholder: 'Number of direct reports',
    visibleIf: 'isManager == true',
  },
  {
    fieldKey: 'skills',
    label: 'Skills',
    type: 'multi-select',
    options: [
      { value: 'javascript', label: 'JavaScript' },
      { value: 'typescript', label: 'TypeScript' },
      { value: 'react', label: 'React' },
      { value: 'nodejs', label: 'Node.js' },
      { value: 'python', label: 'Python' },
    ],
  },
  {
    fieldKey: 'bio',
    label: 'Bio',
    type: 'textarea',
    placeholder: 'Tell us about yourself...',
    helpText: 'Brief description of your background and experience',
  },
];

// Basic section
export const BasicSection: Story = {
  args: {
    section: {
      title: 'Personal Information',
      fields: ['firstName', 'lastName', 'email'],
      collapsible: false,
      defaultExpanded: true,
    } as FormSectionType,
    fields: basicFields,
    formData: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
    },
    errors: {},
  },
};

// Section with validation errors
export const WithValidationErrors: Story = {
  args: {
    section: {
      title: 'Personal Information',
      fields: ['firstName', 'lastName', 'email'],
      collapsible: false,
      defaultExpanded: true,
    } as FormSectionType,
    fields: basicFields,
    formData: {
      firstName: '',
      lastName: 'Doe',
      email: 'invalid-email',
    },
    errors: {
      firstName: 'First name is required',
      email: 'Please enter a valid email address',
    },
  },
};

// Collapsible section (expanded)
export const CollapsibleExpanded: Story = {
  args: {
    section: {
      title: 'Professional Details',
      fields: ['department', 'isManager', 'teamSize', 'skills', 'bio'],
      collapsible: true,
      defaultExpanded: true,
    } as FormSectionType,
    fields: complexFields,
    formData: {
      department: 'engineering',
      isManager: true,
      teamSize: 5,
      skills: ['javascript', 'typescript', 'react'],
      bio: 'Experienced software engineer with a passion for building great products.',
    },
    errors: {},
  },
};

// Collapsible section (collapsed)
export const CollapsibleCollapsed: Story = {
  args: {
    section: {
      title: 'Optional Information',
      fields: ['department', 'isManager', 'teamSize', 'skills', 'bio'],
      collapsible: true,
      defaultExpanded: false,
    } as FormSectionType,
    fields: complexFields,
    formData: {},
    errors: {},
  },
};

// Section with conditional fields
export const WithConditionalFields: Story = {
  args: {
    section: {
      title: 'Management Information',
      fields: ['department', 'isManager', 'teamSize', 'skills', 'bio'],
      collapsible: false,
      defaultExpanded: true,
    } as FormSectionType,
    fields: complexFields,
    formData: {
      department: 'engineering',
      isManager: true,
      teamSize: 8,
      skills: ['javascript', 'typescript'],
      bio: 'Engineering manager with 10+ years of experience.',
    },
    errors: {},
  },
};

// Section with mixed field types and layouts
export const MixedFieldTypes: Story = {
  args: {
    section: {
      title: 'Application Details',
      fields: ['position', 'experience', 'remote', 'startDate', 'resume', 'coverLetter'],
      collapsible: false,
      defaultExpanded: true,
    } as FormSectionType,
    fields: [
      {
        fieldKey: 'position',
        label: 'Position',
        type: 'select',
        required: true,
        options: [
          { value: 'frontend', label: 'Frontend Developer' },
          { value: 'backend', label: 'Backend Developer' },
          { value: 'fullstack', label: 'Full Stack Developer' },
        ],
      },
      {
        fieldKey: 'experience',
        label: 'Years of Experience',
        type: 'number',
        required: true,
        placeholder: 'e.g., 5',
      },
      {
        fieldKey: 'remote',
        label: 'Open to remote work',
        type: 'boolean',
      },
      {
        fieldKey: 'startDate',
        label: 'Available Start Date',
        type: 'date',
        required: true,
      },
      {
        fieldKey: 'resume',
        label: 'Resume',
        type: 'file',
        required: true,
        customProps: {
          accept: '.pdf,.doc,.docx',
        },
      },
      {
        fieldKey: 'coverLetter',
        label: 'Cover Letter',
        type: 'textarea',
        placeholder: 'Tell us why you\'re interested in this position...',
        helpText: 'Optional but recommended',
      },
    ],
    formData: {
      position: 'fullstack',
      experience: 5,
      remote: true,
      startDate: '2024-01-15',
      coverLetter: 'I am very excited about this opportunity...',
    },
    errors: {
      resume: 'Please upload your resume',
    },
  },
};

// Empty section
export const EmptySection: Story = {
  args: {
    section: {
      title: 'Empty Section',
      fields: [],
      collapsible: false,
      defaultExpanded: true,
    } as FormSectionType,
    fields: [],
    formData: {},
    errors: {},
  },
}; 