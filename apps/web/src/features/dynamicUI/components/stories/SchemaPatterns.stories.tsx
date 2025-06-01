import type { Meta, StoryObj } from '@storybook/react';
import { DynamicUIRenderer } from '../DynamicUIRenderer';
import { UIComponentSchema } from '../../types/schemas';

const meta: Meta<typeof DynamicUIRenderer> = {
  title: 'Dynamic UI/System Integration/Schema Patterns',
  component: DynamicUIRenderer,
  parameters: {
    docs: {
      description: {
        component: `
# Schema Patterns

A collection of reusable schema patterns and configuration examples for common UI scenarios.
These patterns can be used as templates for building new dynamic components.

**Purpose**: Provide ready-to-use schema patterns that follow best practices and common design patterns.
        `
      }
    }
  },
  argTypes: {
    onSubmit: { action: 'submitted' },
    onCancel: { action: 'cancelled' },
    onAction: { action: 'action triggered' },
  },
};

export default meta;
type Story = StoryObj<typeof DynamicUIRenderer>;

// Basic form patterns
const basicContactFormSchema: UIComponentSchema = {
  componentId: 'basic-contact-form',
  name: 'Basic Contact Form',
  componentType: 'Form',
  title: 'Contact Us',
  description: 'Get in touch with our team',
  fields: [
    {
      fieldKey: 'name',
      label: 'Full Name',
      type: 'text',
      required: true,
      placeholder: 'Enter your full name'
    },
    {
      fieldKey: 'email',
      label: 'Email Address',
      type: 'email',
      required: true,
      placeholder: 'your.email@company.com'
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
      required: true,
      placeholder: 'Tell us how we can help you...'
    }
  ],
  actions: [
    {
      actionKey: 'submit',
      label: 'Send Message',
      style: 'primary'
    },
    {
      actionKey: 'cancel',
      label: 'Cancel',
      style: 'secondary'
    }
  ]
};

const conditionalFieldsSchema: UIComponentSchema = {
  componentId: 'conditional-fields-form',
  name: 'Conditional Fields Pattern',
  componentType: 'Form',
  title: 'Event Registration',
  description: 'Register for our upcoming event',
  fields: [
    {
      fieldKey: 'attendeeType',
      label: 'Attendee Type',
      type: 'select',
      required: true,
      options: [
        { value: 'student', label: 'Student' },
        { value: 'professional', label: 'Professional' },
        { value: 'speaker', label: 'Speaker' }
      ]
    },
    {
      fieldKey: 'studentId',
      label: 'Student ID',
      type: 'text',
      required: true,
      visibleIf: 'attendeeType == "student"',
      placeholder: 'Enter your student ID'
    },
    {
      fieldKey: 'company',
      label: 'Company',
      type: 'text',
      required: true,
      visibleIf: 'attendeeType == "professional"',
      placeholder: 'Your company name'
    },
    {
      fieldKey: 'jobTitle',
      label: 'Job Title',
      type: 'text',
      required: true,
      visibleIf: 'attendeeType == "professional"',
      placeholder: 'Your job title'
    },
    {
      fieldKey: 'speakerBio',
      label: 'Speaker Biography',
      type: 'textarea',
      required: true,
      visibleIf: 'attendeeType == "speaker"',
      placeholder: 'Brief biography for speaker introduction...'
    },
    {
      fieldKey: 'dietaryRestrictions',
      label: 'Dietary Restrictions',
      type: 'multi-select',
      options: [
        { value: 'vegetarian', label: 'Vegetarian' },
        { value: 'vegan', label: 'Vegan' },
        { value: 'gluten_free', label: 'Gluten Free' },
        { value: 'nut_allergy', label: 'Nut Allergy' }
      ],
      helpText: 'Please select any dietary restrictions (optional)'
    }
  ],
  actions: [
    {
      actionKey: 'submit',
      label: 'Register',
      style: 'primary'
    }
  ]
};

const multiSectionFormSchema: UIComponentSchema = {
  componentId: 'multi-section-form',
  name: 'Multi-Section Form Pattern',
  componentType: 'Form',
  title: 'Complete Profile Setup',
  description: 'Please fill out all sections to complete your profile',
  layout: {
    sections: [
      {
        title: 'Personal Information',
        fields: ['firstName', 'lastName', 'email', 'phone'],
        collapsible: false
      },
      {
        title: 'Address Information',
        fields: ['street', 'city', 'state', 'zipCode'],
        collapsible: true,
        defaultExpanded: true
      },
      {
        title: 'Preferences',
        fields: ['newsletter', 'notifications', 'theme'],
        collapsible: true,
        defaultExpanded: false
      }
    ],
    spacing: 'normal'
  },
  fields: [
    // Personal Information
    { fieldKey: 'firstName', label: 'First Name', type: 'text', required: true },
    { fieldKey: 'lastName', label: 'Last Name', type: 'text', required: true },
    { fieldKey: 'email', label: 'Email', type: 'email', required: true },
    { fieldKey: 'phone', label: 'Phone Number', type: 'text', placeholder: '(555) 123-4567' },
    
    // Address Information
    { fieldKey: 'street', label: 'Street Address', type: 'text', required: true },
    { fieldKey: 'city', label: 'City', type: 'text', required: true },
    { fieldKey: 'state', label: 'State', type: 'select', required: true, options: [
      { value: 'ca', label: 'California' },
      { value: 'ny', label: 'New York' },
      { value: 'tx', label: 'Texas' }
    ]},
    { fieldKey: 'zipCode', label: 'ZIP Code', type: 'text', required: true },
    
    // Preferences
    { fieldKey: 'newsletter', label: 'Subscribe to Newsletter', type: 'boolean' },
    { fieldKey: 'notifications', label: 'Email Notifications', type: 'boolean' },
    { fieldKey: 'theme', label: 'Preferred Theme', type: 'select', options: [
      { value: 'light', label: 'Light' },
      { value: 'dark', label: 'Dark' },
      { value: 'auto', label: 'Auto' }
    ]}
  ],
  actions: [
    {
      actionKey: 'submit',
      label: 'Save Profile',
      style: 'primary'
    },
    {
      actionKey: 'cancel',
      label: 'Cancel',
      style: 'secondary'
    }
  ]
};

const dataDisplaySchema: UIComponentSchema = {
  componentId: 'user-profile-display',
  name: 'Data Display Pattern',
  componentType: 'Display',
  title: 'User Profile: {{name}}',
  customProps: {
    displayType: 'card',
    fields: [
      { key: 'name', label: 'Full Name', type: 'text' },
      { key: 'email', label: 'Email', type: 'email' },
      { key: 'department', label: 'Department', type: 'text' },
      { key: 'role', label: 'Role', type: 'text' },
      { key: 'joinDate', label: 'Join Date', type: 'date' },
      { key: 'status', label: 'Status', type: 'badge' }
    ],
    layout: 'grid'
  },
  actions: [
    {
      actionKey: 'edit',
      label: 'Edit Profile',
      style: 'primary'
    },
    {
      actionKey: 'deactivate',
      label: 'Deactivate',
      style: 'danger',
      confirmation: 'Are you sure you want to deactivate this user?'
    }
  ]
};

// Sample data for display patterns
const sampleUserData = {
  name: 'Sarah Johnson',
  email: 'sarah.johnson@company.com',
  department: 'Engineering',
  role: 'Senior Software Engineer',
  joinDate: '2023-03-15',
  status: 'Active'
};

// Story definitions
export const BasicContactForm: Story = {
  args: {
    schema: basicContactFormSchema
  },
  parameters: {
    docs: {
      description: {
        story: `
**Pattern**: Basic Contact Form

A simple contact form with essential fields and validation.
Perfect for customer inquiries, feedback forms, or general contact pages.

**Features**:
- Required field validation
- Email format validation  
- Select dropdown for categorization
- Textarea for longer messages
        `
      }
    }
  }
};

export const ConditionalFields: Story = {
  args: {
    schema: conditionalFieldsSchema,
    initialData: {
      attendeeType: 'professional' // Pre-select to show conditional fields
    }
  },
  parameters: {
    docs: {
      description: {
        story: `
**Pattern**: Conditional Field Visibility

Demonstrates how fields can be shown/hidden based on other field values.
Useful for adaptive forms that change based on user selections.

**Features**:
- Dynamic field visibility with \`visibleIf\` conditions
- Different field sets for different user types
- Multi-select for optional preferences
        `
      }
    }
  }
};

export const MultiSectionForm: Story = {
  args: {
    schema: multiSectionFormSchema
  },
  parameters: {
    docs: {
      description: {
        story: `
**Pattern**: Multi-Section Layout

Organizes complex forms into logical sections with collapsible areas.
Ideal for lengthy forms like user profiles, settings, or onboarding.

**Features**:
- Grouped field sections with titles
- Collapsible sections (some expanded by default)
- Mixed field types within sections
- Progressive disclosure for better UX
        `
      }
    }
  }
};

export const DataDisplayPattern: Story = {
  args: {
    schema: dataDisplaySchema,
    data: sampleUserData
  },
  parameters: {
    docs: {
      description: {
        story: `
**Pattern**: Structured Data Display

Shows how to display read-only data in a clean, organized format.
Perfect for profile pages, record details, or summary views.

**Features**:
- Card layout for data presentation
- Template interpolation in titles
- Action buttons for data manipulation
- Confirmation dialogs for destructive actions
        `
      }
    }
  }
};

export const EmptyStatePattern: Story = {
  args: {
    schema: {
      componentId: 'empty-state-example',
      name: 'Empty State Pattern',
      componentType: 'Display',
      title: 'No Data Available',
      customProps: {
        displayType: 'card',
        fields: []
      }
    },
    data: {}
  },
  parameters: {
    docs: {
      description: {
        story: `
**Pattern**: Empty State Handling

Demonstrates how to handle scenarios where no data is available.
Important for maintaining good UX when content is missing.

**Use Cases**:
- New user accounts with no data
- Filtered results with no matches
- Lists that haven't been populated yet
        `
      }
    }
  }
}; 