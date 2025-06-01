import type { Meta, StoryObj } from '@storybook/react';
import { DynamicUIRenderer } from './DynamicUIRenderer';
import type { UIComponentSchema } from '../types/schemas';
import { DynamicUIErrorBoundary } from '../components/DynamicUIErrorBoundary';

const meta: Meta<typeof DynamicUIRenderer> = {
  title: 'Components/Dynamic UI Components/UI Renderer',
  component: DynamicUIRenderer,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'The main orchestration component for the Dynamic UI system. Routes to appropriate renderers based on componentType and provides UI state management for conditional rendering.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    schema: {
      control: 'object',
      description: 'UI component schema defining the structure and behavior',
    },
    componentId: {
      control: 'text',
      description: 'Optional component ID for schema lookup',
    },
    initialData: {
      control: 'object',
      description: 'Initial data for form components',
    },
    data: {
      control: 'object',
      description: 'Data object for display components',
    },
    onSubmit: {
      action: 'form-submitted',
      description: 'Callback function for form submissions',
    },
    onCancel: {
      action: 'form-cancelled',
      description: 'Callback function for form cancellation',
    },
    onAction: {
      action: 'action-triggered',
      description: 'Callback function for handling actions',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes for custom styling',
    },
    initialUIState: {
      control: 'object',
      description: 'Initial UI state for conditional rendering',
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

// Form component schemas
const contactFormSchema: UIComponentSchema = {
  componentId: 'contact-form',
  name: 'Contact Form',
  title: 'Get in Touch',
  description: 'Send us a message and we\'ll get back to you soon',
  componentType: 'Form',
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
      placeholder: 'Enter your email'
    },
    {
      fieldKey: 'subject',
      label: 'Subject',
      type: 'select',
      required: true,
      options: [
        { value: 'general', label: 'General Inquiry' },
        { value: 'support', label: 'Technical Support' },
        { value: 'sales', label: 'Sales Question' }
      ]
    },
    {
      fieldKey: 'message',
      label: 'Message',
      type: 'textarea',
      required: true,
      placeholder: 'Tell us how we can help...'
    }
  ],
  actions: [
    { actionKey: 'cancel', label: 'Cancel', style: 'secondary' },
    { actionKey: 'submit', label: 'Send Message', style: 'primary' }
  ]
};

const userRegistrationSchema: UIComponentSchema = {
  componentId: 'user-registration',
  name: 'User Registration',
  title: 'Create Your Account',
  description: 'Join our platform and start building amazing things',
  componentType: 'Form',
  fields: [
    {
      fieldKey: 'username',
      label: 'Username',
      type: 'text',
      required: true,
      placeholder: 'Choose a username',
      helpText: 'Must be unique and 3-20 characters long'
    },
    {
      fieldKey: 'email',
      label: 'Email Address',
      type: 'email',
      required: true,
      placeholder: 'Enter your email'
    },
    {
      fieldKey: 'password',
      label: 'Password',
      type: 'text',
      required: true,
      placeholder: 'Create a strong password',
      helpText: 'At least 8 characters with uppercase, lowercase, and numbers'
    },
    {
      fieldKey: 'confirmPassword',
      label: 'Confirm Password',
      type: 'text',
      required: true,
      placeholder: 'Confirm your password'
    },
    {
      fieldKey: 'newsletter',
      label: 'Subscribe to our newsletter',
      type: 'boolean',
      helpText: 'Get updates about new features and tips'
    }
  ],
  actions: [
    { actionKey: 'cancel', label: 'Cancel', style: 'secondary' },
    { actionKey: 'submit', label: 'Create Account', style: 'primary' }
  ]
};

// Display component schemas
const userProfileDisplaySchema: UIComponentSchema = {
  componentId: 'user-profile-display',
  name: 'User Profile Display',
  title: 'User Profile',
  description: 'View and manage user profile information',
  componentType: 'Display',
  displayTemplate: `
    <div class="space-y-6">
      <div class="flex items-center space-x-4">
        <div class="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-xl font-bold">
          {{name.charAt(0).toUpperCase()}}
        </div>
        <div>
          <h2 class="text-2xl font-bold">{{name}}</h2>
          <p class="text-muted-foreground">{{email}}</p>
        </div>
      </div>
      
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="text-sm font-medium text-muted-foreground">Department</label>
          <p class="text-foreground">{{department}}</p>
        </div>
        <div>
          <label class="text-sm font-medium text-muted-foreground">Role</label>
          <p class="text-foreground">{{role}}</p>
        </div>
        <div>
          <label class="text-sm font-medium text-muted-foreground">Join Date</label>
          <p class="text-foreground">{{joinDate}}</p>
        </div>
        <div>
          <label class="text-sm font-medium text-muted-foreground">Status</label>
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {{status}}
          </span>
        </div>
      </div>
    </div>
  `,
  actions: [
    { actionKey: 'edit', label: 'Edit Profile', style: 'primary' },
    { actionKey: 'deactivate', label: 'Deactivate', style: 'danger', confirmation: 'Are you sure you want to deactivate this user?' }
  ]
};

const taskListDisplaySchema: UIComponentSchema = {
  componentId: 'task-list-display',
  name: 'Task List Display',
  title: 'My Tasks',
  description: 'View and manage your assigned tasks',
  componentType: 'Display',
  displayTemplate: `
    <div class="space-y-4">
      {{#each tasks}}
      <div class="border rounded-lg p-4 {{#if completed}}bg-muted{{/if}}">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <input type="checkbox" {{#if completed}}checked{{/if}} class="rounded" />
            <div>
              <h3 class="font-medium {{#if completed}}line-through text-muted-foreground{{/if}}">{{title}}</h3>
              <p class="text-sm text-muted-foreground">{{description}}</p>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium 
              {{#eq priority 'high'}}bg-red-100 text-red-800{{/eq}}
              {{#eq priority 'medium'}}bg-yellow-100 text-yellow-800{{/eq}}
              {{#eq priority 'low'}}bg-green-100 text-green-800{{/eq}}">
              {{priority}}
            </span>
            <span class="text-sm text-muted-foreground">{{dueDate}}</span>
          </div>
        </div>
      </div>
      {{/each}}
    </div>
  `,
  actions: [
    { actionKey: 'add_task', label: 'Add Task', style: 'primary' },
    { actionKey: 'filter', label: 'Filter', style: 'secondary' }
  ]
};

// Conditional workflow schema
const workflowSchema: UIComponentSchema = {
  componentId: 'approval-workflow',
  name: 'Approval Workflow',
  title: 'Document Review',
  description: 'Review and approve submitted documents',
  componentType: 'Display',
  displayTemplate: `
    <div class="space-y-6">
      <div class="border rounded-lg p-4">
        <h3 class="font-medium mb-2">{{document.title}}</h3>
        <p class="text-sm text-muted-foreground mb-4">{{document.description}}</p>
        <div class="flex items-center space-x-4 text-sm">
          <span>Submitted by: <strong>{{document.author}}</strong></span>
          <span>Date: {{document.submittedDate}}</span>
          <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium 
            {{#eq document.status 'pending'}}bg-yellow-100 text-yellow-800{{/eq}}
            {{#eq document.status 'approved'}}bg-green-100 text-green-800{{/eq}}
            {{#eq document.status 'rejected'}}bg-red-100 text-red-800{{/eq}}">
            {{document.status}}
          </span>
        </div>
      </div>
      
      {{#if showReviewForm}}
      <div class="border rounded-lg p-4 bg-muted/50">
        <h4 class="font-medium mb-3">Review Comments</h4>
        <textarea class="w-full p-3 border rounded-md" rows="4" placeholder="Enter your review comments..."></textarea>
      </div>
      {{/if}}
    </div>
  `,
  actions: [
    { 
      actionKey: 'request_review', 
      label: 'Request Review', 
      style: 'primary',
      visibleIf: 'document.status == "draft"'
    },
    { 
      actionKey: 'approve', 
      label: 'Approve', 
      style: 'primary',
      visibleIf: 'document.status == "pending" && userRole == "reviewer"'
    },
    { 
      actionKey: 'reject', 
      label: 'Reject', 
      style: 'danger',
      visibleIf: 'document.status == "pending" && userRole == "reviewer"',
      confirmation: 'Are you sure you want to reject this document?'
    },
    { 
      actionKey: 'edit', 
      label: 'Edit', 
      style: 'secondary',
      visibleIf: 'document.status == "draft" || document.status == "rejected"'
    }
  ]
};

// Form component stories
export const ContactForm: Story = {
  args: {
    schema: contactFormSchema,
    initialData: {},
  },
};

export const ContactFormPrefilled: Story = {
  args: {
    schema: contactFormSchema,
    initialData: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      subject: 'support',
      message: 'I need help with my account settings.'
    },
  },
};

export const UserRegistrationForm: Story = {
  args: {
    schema: userRegistrationSchema,
    initialData: {},
  },
};

// Display component stories
export const UserProfileDisplay: Story = {
  args: {
    schema: userProfileDisplaySchema,
    data: {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      department: 'Engineering',
      role: 'Senior Developer',
      joinDate: 'January 15, 2022',
      status: 'Active'
    },
  },
};

export const TaskListDisplay: Story = {
  args: {
    schema: taskListDisplaySchema,
    data: {
      tasks: [
        {
          id: 1,
          title: 'Review pull request #123',
          description: 'Code review for new authentication feature',
          priority: 'high',
          dueDate: 'Today',
          completed: false
        },
        {
          id: 2,
          title: 'Update documentation',
          description: 'Add API documentation for new endpoints',
          priority: 'medium',
          dueDate: 'Tomorrow',
          completed: false
        },
        {
          id: 3,
          title: 'Fix bug in user dashboard',
          description: 'Resolve issue with data not loading',
          priority: 'high',
          dueDate: 'Yesterday',
          completed: true
        },
        {
          id: 4,
          title: 'Team meeting preparation',
          description: 'Prepare slides for weekly team sync',
          priority: 'low',
          dueDate: 'Friday',
          completed: false
        }
      ]
    },
  },
};

// Workflow and state management stories
export const WorkflowDraftState: Story = {
  args: {
    schema: workflowSchema,
    data: {
      document: {
        title: 'Q4 Marketing Strategy',
        description: 'Comprehensive marketing strategy for the fourth quarter including budget allocation and campaign planning.',
        author: 'Marketing Team',
        submittedDate: 'December 1, 2023',
        status: 'draft'
      },
      userRole: 'author'
    },
    initialUIState: {
      showReviewForm: false
    },
  },
};

export const WorkflowPendingReview: Story = {
  args: {
    schema: workflowSchema,
    data: {
      document: {
        title: 'Q4 Marketing Strategy',
        description: 'Comprehensive marketing strategy for the fourth quarter including budget allocation and campaign planning.',
        author: 'Marketing Team',
        submittedDate: 'December 1, 2023',
        status: 'pending'
      },
      userRole: 'reviewer'
    },
    initialUIState: {
      showReviewForm: false
    },
  },
};

export const WorkflowWithReviewForm: Story = {
  args: {
    schema: workflowSchema,
    data: {
      document: {
        title: 'Q4 Marketing Strategy',
        description: 'Comprehensive marketing strategy for the fourth quarter including budget allocation and campaign planning.',
        author: 'Marketing Team',
        submittedDate: 'December 1, 2023',
        status: 'pending'
      },
      userRole: 'reviewer'
    },
    initialUIState: {
      showReviewForm: true
    },
  },
};

export const WorkflowApproved: Story = {
  args: {
    schema: workflowSchema,
    data: {
      document: {
        title: 'Q4 Marketing Strategy',
        description: 'Comprehensive marketing strategy for the fourth quarter including budget allocation and campaign planning.',
        author: 'Marketing Team',
        submittedDate: 'December 1, 2023',
        status: 'approved'
      },
      userRole: 'viewer'
    },
    initialUIState: {
      showReviewForm: false
    },
  },
};

// Error and loading states
export const LoadingState: Story = {
  args: {
    data: {},
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the loading state when a component schema is being fetched from the server. This story simulates the loading state without making actual database calls.',
      },
    },
  },
  render: (args) => {
    // Simulate loading state by rendering the loading UI directly
    return (
      <DynamicUIErrorBoundary>
        <div className="flex items-center justify-center py-8">
          <div className="text-muted-foreground">Loading component schema...</div>
        </div>
      </DynamicUIErrorBoundary>
    );
  },
};

export const ErrorState: Story = {
  args: {
    schema: undefined,
    data: {},
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the error state when no schema is available.',
      },
    },
  },
};

// Unsupported component types
export const UnsupportedModalType: Story = {
  args: {
    schema: {
      componentId: 'modal-example',
      name: 'Modal Example',
      title: 'Example Modal',
      componentType: 'Modal',
      description: 'This component type is not yet implemented'
    } as UIComponentSchema,
    data: {},
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the placeholder for unsupported Modal component type.',
      },
    },
  },
};

export const UnsupportedCustomType: Story = {
  args: {
    schema: {
      componentId: 'custom-example',
      name: 'Custom Example',
      title: 'Example Custom Component',
      componentType: 'Custom',
      description: 'This component type is not yet implemented'
    } as UIComponentSchema,
    data: {},
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the placeholder for unsupported Custom component type.',
      },
    },
  },
}; 