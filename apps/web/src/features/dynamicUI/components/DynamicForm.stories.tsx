import type { Meta, StoryObj } from '@storybook/react';
import { DynamicForm } from './DynamicForm';
import type { UIComponentSchema } from '../types/schemas';

const meta: Meta<typeof DynamicForm> = {
  title: 'Components/Composite Components/Dynamic Form',
  component: DynamicForm,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'The main DynamicForm component that renders complete forms based on schema configuration. Supports validation, sections, conditional logic, and various field types.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    schema: {
      control: 'object',
      description: 'UI component schema defining the form structure',
    },
    componentId: {
      control: 'text',
      description: 'Optional component ID for schema lookup',
    },
    initialData: {
      control: 'object',
      description: 'Initial form data',
    },
    onSubmit: {
      action: 'form-submitted',
      description: 'Callback function called when form is submitted',
    },
    onCancel: {
      action: 'form-cancelled',
      description: 'Callback function called when form is cancelled',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes for custom styling',
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-4xl">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Simple contact form
const simpleContactForm: UIComponentSchema = {
  componentId: 'contact-form',
  name: 'Contact Form',
  title: 'Contact Us',
  description: 'Get in touch with our team',
  componentType: 'Form',
  fields: [
    {
      fieldKey: 'name',
      label: 'Full Name',
      type: 'text',
      placeholder: 'Enter your full name',
      required: true,
      validationRules: [
        { type: 'required', message: 'Name is required' },
        { type: 'minLength', value: 2, message: 'Name must be at least 2 characters' }
      ]
    },
    {
      fieldKey: 'email',
      label: 'Email Address',
      type: 'email',
      placeholder: 'Enter your email',
      required: true,
      validationRules: [
        { type: 'required', message: 'Email is required' },
        { type: 'email', message: 'Please enter a valid email address' }
      ]
    },
    {
      fieldKey: 'phone',
      label: 'Phone Number',
      type: 'text',
      placeholder: '(555) 123-4567',
      helpText: 'Optional - we\'ll only call if needed'
    },
    {
      fieldKey: 'subject',
      label: 'Subject',
      type: 'select',
      required: true,
      options: [
        { value: 'general', label: 'General Inquiry' },
        { value: 'support', label: 'Technical Support' },
        { value: 'sales', label: 'Sales Question' },
        { value: 'feedback', label: 'Feedback' }
      ]
    },
    {
      fieldKey: 'message',
      label: 'Message',
      type: 'textarea',
      placeholder: 'Tell us how we can help you...',
      required: true,
      validationRules: [
        { type: 'required', message: 'Message is required' },
        { type: 'minLength', value: 10, message: 'Please provide at least 10 characters' }
      ]
    }
  ],
  actions: [
    { actionKey: 'cancel', label: 'Cancel', style: 'secondary' },
    { actionKey: 'submit', label: 'Send Message', style: 'primary' }
  ]
};

// Complex job application form with sections
const jobApplicationForm: UIComponentSchema = {
  componentId: 'job-application',
  name: 'Job Application Form',
  title: 'Software Engineer Application',
  description: 'Apply for the Software Engineer position at our company',
  componentType: 'Form',
  fields: [
    // Personal Information
    {
      fieldKey: 'firstName',
      label: 'First Name',
      type: 'text',
      required: true,
      validationRules: [{ type: 'required', message: 'First name is required' }]
    },
    {
      fieldKey: 'lastName',
      label: 'Last Name',
      type: 'text',
      required: true,
      validationRules: [{ type: 'required', message: 'Last name is required' }]
    },
    {
      fieldKey: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      validationRules: [
        { type: 'required', message: 'Email is required' },
        { type: 'email', message: 'Please enter a valid email address' }
      ]
    },
    {
      fieldKey: 'phone',
      label: 'Phone',
      type: 'text',
      required: true
    },
    // Professional Experience
    {
      fieldKey: 'position',
      label: 'Desired Position',
      type: 'select',
      required: true,
      options: [
        { value: 'frontend', label: 'Frontend Developer' },
        { value: 'backend', label: 'Backend Developer' },
        { value: 'fullstack', label: 'Full Stack Developer' },
        { value: 'mobile', label: 'Mobile Developer' }
      ]
    },
    {
      fieldKey: 'experience',
      label: 'Years of Experience',
      type: 'number',
      required: true,
      validationRules: [
        { type: 'required', message: 'Experience is required' },
        { type: 'min', value: 0, message: 'Experience cannot be negative' }
      ]
    },
    {
      fieldKey: 'skills',
      label: 'Technical Skills',
      type: 'multi-select',
      required: true,
      options: [
        { value: 'javascript', label: 'JavaScript' },
        { value: 'typescript', label: 'TypeScript' },
        { value: 'react', label: 'React' },
        { value: 'vue', label: 'Vue.js' },
        { value: 'angular', label: 'Angular' },
        { value: 'nodejs', label: 'Node.js' },
        { value: 'python', label: 'Python' },
        { value: 'java', label: 'Java' },
        { value: 'csharp', label: 'C#' },
        { value: 'go', label: 'Go' }
      ]
    },
    {
      fieldKey: 'currentSalary',
      label: 'Current Salary',
      type: 'number',
      placeholder: 'Optional',
      helpText: 'Your current salary (optional, helps us make a competitive offer)'
    },
    // Availability
    {
      fieldKey: 'remote',
      label: 'Open to remote work',
      type: 'boolean'
    },
    {
      fieldKey: 'relocation',
      label: 'Willing to relocate',
      type: 'boolean'
    },
    {
      fieldKey: 'startDate',
      label: 'Available Start Date',
      type: 'date',
      required: true
    },
    // Documents
    {
      fieldKey: 'resume',
      label: 'Resume',
      type: 'file',
      required: true,
      customProps: {
        accept: '.pdf,.doc,.docx'
      },
      helpText: 'Please upload your resume in PDF or Word format'
    },
    {
      fieldKey: 'coverLetter',
      label: 'Cover Letter',
      type: 'textarea',
      placeholder: 'Tell us why you\'re interested in this position...',
      helpText: 'Optional but recommended'
    }
  ],
  layout: {
    spacing: 'normal',
    sections: [
      {
        title: 'Personal Information',
        fields: ['firstName', 'lastName', 'email', 'phone'],
        collapsible: false,
        defaultExpanded: true
      },
      {
        title: 'Professional Experience',
        fields: ['position', 'experience', 'skills', 'currentSalary'],
        collapsible: false,
        defaultExpanded: true
      },
      {
        title: 'Availability',
        fields: ['remote', 'relocation', 'startDate'],
        collapsible: true,
        defaultExpanded: true
      },
      {
        title: 'Documents',
        fields: ['resume', 'coverLetter'],
        collapsible: true,
        defaultExpanded: true
      }
    ]
  },
  actions: [
    { actionKey: 'cancel', label: 'Cancel', style: 'secondary' },
    { actionKey: 'draft', label: 'Save Draft', style: 'secondary' },
    { actionKey: 'submit', label: 'Submit Application', style: 'primary' }
  ]
};

// Form with conditional logic
const conditionalForm: UIComponentSchema = {
  componentId: 'conditional-form',
  name: 'Event Registration',
  title: 'Conference Registration',
  description: 'Register for our annual tech conference',
  componentType: 'Form',
  fields: [
    {
      fieldKey: 'name',
      label: 'Full Name',
      type: 'text',
      required: true
    },
    {
      fieldKey: 'email',
      label: 'Email',
      type: 'email',
      required: true
    },
    {
      fieldKey: 'ticketType',
      label: 'Ticket Type',
      type: 'select',
      required: true,
      options: [
        { value: 'general', label: 'General Admission ($99)' },
        { value: 'vip', label: 'VIP Pass ($299)' },
        { value: 'student', label: 'Student Ticket ($29)' },
        { value: 'speaker', label: 'Speaker Pass (Free)' }
      ]
    },
    {
      fieldKey: 'studentId',
      label: 'Student ID',
      type: 'text',
      required: true,
      visibleIf: 'ticketType == "student"',
      helpText: 'Please provide your valid student ID number'
    },
    {
      fieldKey: 'university',
      label: 'University',
      type: 'text',
      required: true,
      visibleIf: 'ticketType == "student"'
    },
    {
      fieldKey: 'talkTitle',
      label: 'Talk Title',
      type: 'text',
      required: true,
      visibleIf: 'ticketType == "speaker"'
    },
    {
      fieldKey: 'talkDescription',
      label: 'Talk Description',
      type: 'textarea',
      required: true,
      visibleIf: 'ticketType == "speaker"',
      placeholder: 'Provide a brief description of your talk...'
    },
    {
      fieldKey: 'dietaryRestrictions',
      label: 'Dietary Restrictions',
      type: 'multi-select',
      visibleIf: 'ticketType == "vip" || ticketType == "speaker"',
      options: [
        { value: 'vegetarian', label: 'Vegetarian' },
        { value: 'vegan', label: 'Vegan' },
        { value: 'glutenfree', label: 'Gluten-Free' },
        { value: 'kosher', label: 'Kosher' },
        { value: 'halal', label: 'Halal' }
      ],
      helpText: 'Select any dietary restrictions for VIP dinner and speaker reception'
    },
    {
      fieldKey: 'accommodation',
      label: 'Need accommodation assistance?',
      type: 'boolean',
      visibleIf: 'ticketType == "vip" || ticketType == "speaker"'
    },
    {
      fieldKey: 'accommodationNotes',
      label: 'Accommodation Details',
      type: 'textarea',
      visibleIf: 'accommodation == true',
      placeholder: 'Please describe your accommodation needs...'
    }
  ],
  actions: [
    { actionKey: 'cancel', label: 'Cancel', style: 'secondary' },
    { actionKey: 'submit', label: 'Register', style: 'primary' }
  ]
};

// Form with async validation
const asyncValidationForm: UIComponentSchema = {
  componentId: 'async-validation',
  name: 'User Registration',
  title: 'Create Your Account',
  description: 'Join our platform today',
  componentType: 'Form',
  fields: [
    {
      fieldKey: 'username',
      label: 'Username',
      type: 'text',
      required: true,
      helpText: 'Must be unique and 3-20 characters long',
      validationRules: [
        { type: 'required', message: 'Username is required' },
        { type: 'minLength', value: 3, message: 'Username must be at least 3 characters' },
        { type: 'maxLength', value: 20, message: 'Username must be no more than 20 characters' }
      ]
    },
    {
      fieldKey: 'email',
      label: 'Email Address',
      type: 'email',
      required: true,
      helpText: 'We\'ll send a verification email to this address',
      validationRules: [
        { type: 'required', message: 'Email is required' },
        { type: 'email', message: 'Please enter a valid email address' }
      ]
    },
    {
      fieldKey: 'password',
      label: 'Password',
      type: 'text',
      required: true,
      helpText: 'Must be at least 8 characters with uppercase, lowercase, and numbers',
      validationRules: [
        { type: 'required', message: 'Password is required' },
        { type: 'minLength', value: 8, message: 'Password must be at least 8 characters' }
      ]
    },
    {
      fieldKey: 'confirmPassword',
      label: 'Confirm Password',
      type: 'text',
      required: true,
      validationRules: [
        { type: 'required', message: 'Please confirm your password' }
      ]
    },
    {
      fieldKey: 'terms',
      label: 'I agree to the Terms of Service and Privacy Policy',
      type: 'boolean',
      required: true,
      validationRules: [
        { type: 'required', message: 'You must agree to the terms to continue' }
      ]
    }
  ],
  actions: [
    { actionKey: 'cancel', label: 'Cancel', style: 'secondary' },
    { actionKey: 'submit', label: 'Create Account', style: 'primary' }
  ]
};

export const SimpleContactForm: Story = {
  args: {
    schema: simpleContactForm,
    initialData: {},
  },
};

export const PrefilledContactForm: Story = {
  args: {
    schema: simpleContactForm,
    initialData: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      subject: 'support',
      message: 'I need help with...'
    },
  },
};

export const ComplexJobApplication: Story = {
  args: {
    schema: jobApplicationForm,
    initialData: {},
  },
};

export const JobApplicationWithData: Story = {
  args: {
    schema: jobApplicationForm,
    initialData: {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phone: '(555) 123-4567',
      position: 'fullstack',
      experience: 5,
      skills: ['javascript', 'typescript', 'react', 'nodejs'],
      remote: true,
      relocation: false,
      startDate: '2024-02-01'
    },
  },
};

export const ConditionalLogic: Story = {
  args: {
    schema: conditionalForm,
    initialData: {},
  },
};

export const ConditionalLogicStudent: Story = {
  args: {
    schema: conditionalForm,
    initialData: {
      name: 'Alex Johnson',
      email: 'alex.johnson@university.edu',
      ticketType: 'student'
    },
  },
};

export const ConditionalLogicSpeaker: Story = {
  args: {
    schema: conditionalForm,
    initialData: {
      name: 'Dr. Sarah Wilson',
      email: 'sarah.wilson@techcorp.com',
      ticketType: 'speaker'
    },
  },
};

export const ConditionalLogicVIP: Story = {
  args: {
    schema: conditionalForm,
    initialData: {
      name: 'Michael Chen',
      email: 'michael.chen@company.com',
      ticketType: 'vip',
      accommodation: true
    },
  },
};

export const AsyncValidationForm: Story = {
  args: {
    schema: asyncValidationForm,
    initialData: {},
  },
};

export const FormWithValidationErrors: Story = {
  args: {
    schema: simpleContactForm,
    initialData: {
      name: '',
      email: 'invalid-email',
      subject: '',
      message: 'Too short'
    },
  },
};

export const LoadingState: Story = {
  args: {
    initialData: {},
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the loading state when a form schema is being fetched from the server. This story simulates the loading state without making actual database calls.',
      },
    },
  },
  render: (args) => {
    // Simulate loading state by rendering the loading UI directly
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">Loading form schema...</div>
      </div>
    );
  },
};

export const ErrorState: Story = {
  args: {
    schema: undefined,
    initialData: {},
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the error state when no schema is available.',
      },
    },
  },
}; 