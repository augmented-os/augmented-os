import type { Meta, StoryObj } from '@storybook/react';
import { DynamicUIRenderer } from '../DynamicUIRenderer';
import { UIComponentSchema } from '../../types/schemas';

const meta: Meta<typeof DynamicUIRenderer> = {
  title: 'Dynamic UI/System Integration/Task Scenarios',
  component: DynamicUIRenderer,
  parameters: {
    docs: {
      description: {
        component: `
# Task Scenarios

Real-world task examples that demonstrate complete user workflows using the Dynamic UI system.
These stories represent actual business scenarios that users encounter in production.

**Purpose**: Validate end-to-end user experiences and ensure the system handles complex task flows correctly.
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

// Schema definitions for realistic task scenarios
const userOnboardingSchema: UIComponentSchema = {
  componentId: 'user-onboarding-form',
  name: 'User Onboarding',
  componentType: 'Form',
  title: 'Welcome! Let\'s set up your account',
  description: 'Please provide your information to get started with the platform.',
  fields: [
    {
      fieldKey: 'firstName',
      label: 'First Name',
      type: 'text',
      placeholder: 'Enter your first name',
      required: true,
      validationRules: [{ type: 'required', message: 'First name is required' }]
    },
    {
      fieldKey: 'lastName',
      label: 'Last Name',
      type: 'text',
      placeholder: 'Enter your last name',
      required: true,
      validationRules: [{ type: 'required', message: 'Last name is required' }]
    },
    {
      fieldKey: 'email',
      label: 'Email Address',
      type: 'email',
      placeholder: 'you@company.com',
      required: true,
      validationRules: [
        { type: 'required', message: 'Email is required' },
        { type: 'email', message: 'Please enter a valid email address' }
      ]
    },
    {
      fieldKey: 'department',
      label: 'Department',
      type: 'select',
      placeholder: 'Choose your department',
      required: true,
      options: [
        { value: 'engineering', label: 'Engineering' },
        { value: 'marketing', label: 'Marketing' },
        { value: 'sales', label: 'Sales' },
        { value: 'hr', label: 'Human Resources' },
        { value: 'finance', label: 'Finance' }
      ]
    },
    {
      fieldKey: 'role',
      label: 'Job Role',
      type: 'text',
      placeholder: 'e.g., Software Engineer, Marketing Manager',
      required: true
    },
    {
      fieldKey: 'notifications',
      label: 'Email Notifications',
      type: 'boolean',
      helpText: 'Receive important updates and task notifications via email'
    }
  ],
  actions: [
    {
      actionKey: 'submit',
      label: 'Complete Setup',
      style: 'primary'
    },
    {
      actionKey: 'cancel',
      label: 'Skip for Now',
      style: 'secondary'
    }
  ]
};

const taskApprovalDisplaySchema: UIComponentSchema = {
  componentId: 'task-approval-display',
  name: 'Task Approval Review',
  componentType: 'Display',
  title: 'Review Task: {{taskTitle}}',
  customProps: {
    displayType: 'card',
    fields: [
      { key: 'taskTitle', label: 'Task' },
      { key: 'taskDescription', label: 'Description' },
      { key: 'assignee', label: 'Assigned To' },
      { key: 'department', label: 'Department' },
      { key: 'priority', label: 'Priority' },
      { key: 'dueDate', label: 'Due Date' },
      { key: 'status', label: 'Status' },
      { key: 'createdBy', label: 'Created By' },
      { key: 'createdDate', label: 'Created Date' }
    ],
    layout: 'list'
  },
  actions: [
    {
      actionKey: 'approve',
      label: 'Approve Task',
      style: 'primary',
      confirmation: 'Are you sure you want to approve this task?'
    },
    {
      actionKey: 'reject',
      label: 'Request Changes',
      style: 'danger',
      confirmation: 'Are you sure you want to request changes?'
    },
    {
      actionKey: 'assign',
      label: 'Reassign',
      style: 'secondary'
    }
  ]
};

const expenseReportSchema: UIComponentSchema = {
  componentId: 'expense-report-form',
  name: 'Expense Report',
  componentType: 'Form',
  title: 'Submit Expense Report',
  description: 'Please provide details for your business expenses.',
  layout: {
    sections: [
      {
        title: 'Trip Information',
        fields: ['tripPurpose', 'startDate', 'endDate', 'destination'],
        collapsible: false
      },
      {
        title: 'Expense Details',
        fields: ['category', 'amount', 'description', 'receipt'],
        collapsible: false
      },
      {
        title: 'Additional Information',
        fields: ['clientBillable', 'notes'],
        collapsible: true,
        defaultExpanded: false
      }
    ],
    spacing: 'normal'
  },
  fields: [
    {
      fieldKey: 'tripPurpose',
      label: 'Purpose of Trip',
      type: 'select',
      required: true,
      options: [
        { value: 'client_meeting', label: 'Client Meeting' },
        { value: 'conference', label: 'Conference/Training' },
        { value: 'business_travel', label: 'Business Travel' },
        { value: 'other', label: 'Other' }
      ]
    },
    {
      fieldKey: 'startDate',
      label: 'Start Date',
      type: 'date',
      required: true
    },
    {
      fieldKey: 'endDate',
      label: 'End Date',
      type: 'date',
      required: true
    },
    {
      fieldKey: 'destination',
      label: 'Destination',
      type: 'text',
      placeholder: 'City, State/Country',
      required: true
    },
    {
      fieldKey: 'category',
      label: 'Expense Category',
      type: 'select',
      required: true,
      options: [
        { value: 'accommodation', label: 'Accommodation' },
        { value: 'transportation', label: 'Transportation' },
        { value: 'meals', label: 'Meals & Entertainment' },
        { value: 'supplies', label: 'Office Supplies' },
        { value: 'other', label: 'Other' }
      ]
    },
    {
      fieldKey: 'amount',
      label: 'Amount ($)',
      type: 'number',
      required: true,
      validationRules: [
        { type: 'required', message: 'Amount is required' },
        { type: 'min', value: 0.01, message: 'Amount must be greater than $0' }
      ]
    },
    {
      fieldKey: 'description',
      label: 'Description',
      type: 'textarea',
      placeholder: 'Provide details about this expense...',
      required: true
    },
    {
      fieldKey: 'receipt',
      label: 'Receipt',
      type: 'file',
      helpText: 'Upload receipt image or PDF',
      customProps: {
        accept: 'image/*,.pdf',
        multiple: false
      }
    },
    {
      fieldKey: 'clientBillable',
      label: 'Client Billable',
      type: 'boolean',
      helpText: 'Can this expense be billed to a client?'
    },
    {
      fieldKey: 'notes',
      label: 'Additional Notes',
      type: 'textarea',
      placeholder: 'Any additional information...'
    }
  ],
  actions: [
    {
      actionKey: 'submit',
      label: 'Submit Report',
      style: 'primary'
    },
    {
      actionKey: 'save_draft',
      label: 'Save as Draft',
      style: 'secondary'
    },
    {
      actionKey: 'cancel',
      label: 'Cancel',
      style: 'secondary'
    }
  ]
};

// Sample data for scenarios
const sampleTaskData = {
  taskTitle: 'Review Q4 Marketing Campaign',
  taskDescription: 'Review and approve the Q4 marketing campaign materials and budget allocation.',
  assignee: 'John Smith',
  department: 'Marketing',
  priority: 'High',
  dueDate: '2024-02-15',
  status: 'pending_review',
  createdBy: 'Sarah Johnson',
  createdDate: '2024-01-28'
};

// Story definitions
export const UserOnboarding: Story = {
  args: {
    schema: userOnboardingSchema,
    initialData: {
      email: 'new.user@company.com' // Pre-filled from invitation
    }
  },
  parameters: {
    docs: {
      description: {
        story: `
**Scenario**: New employee account setup

A new employee receives an invitation email and needs to complete their profile setup. 
This form demonstrates:
- Progressive disclosure with logical field grouping
- Email validation and required field handling
- Department-based role suggestions
- Notification preferences

**Use Case**: HR onboarding workflow, new hire setup
        `
      }
    }
  }
};

export const TaskApprovalWorkflow: Story = {
  args: {
    schema: taskApprovalDisplaySchema,
    data: sampleTaskData,
    initialUIState: { 
      workflowState: 'pending_review',
      showApprovalActions: true 
    }
  },
  parameters: {
    docs: {
      description: {
        story: `
**Scenario**: Manager reviewing a submitted task

A manager needs to review a task submission and make an approval decision.
This display demonstrates:
- Multi-area layout with task details and actions
- Conditional action visibility based on user role
- Confirmation dialogs for critical actions
- Rich data display with status indicators

**Use Case**: Task management workflow, approval processes
        `
      }
    }
  }
};

export const ExpenseReportSubmission: Story = {
  args: {
    schema: expenseReportSchema,
    initialData: {}
  },
  parameters: {
    docs: {
      description: {
        story: `
**Scenario**: Employee submitting business expenses

An employee needs to submit an expense report for business travel.
This form demonstrates:
- Complex sectioned layout with collapsible areas
- Date range validation and business logic
- File upload for receipt attachments
- Conditional fields based on expense type
- Multiple submission actions (submit, save draft)

**Use Case**: Finance workflow, expense management
        `
      }
    }
  }
};

export const ExpenseReportWithData: Story = {
  args: {
    schema: expenseReportSchema,
    initialData: {
      tripPurpose: 'client_meeting',
      startDate: '2024-02-01',
      endDate: '2024-02-03',
      destination: 'San Francisco, CA',
      category: 'accommodation',
      amount: 450.00,
      description: 'Hotel stay for client meetings - 2 nights at Marriott Downtown',
      clientBillable: true
    }
  },
  parameters: {
    docs: {
      description: {
        story: `
**Scenario**: Partially completed expense report

Shows how the form behaves when some data is already filled in, 
either from a saved draft or pre-populated from another source.
        `
      }
    }
  }
};

export const EmptyTaskQueue: Story = {
  args: {
    schema: {
      componentId: 'empty-task-queue',
      name: 'Empty Task Queue',
      componentType: 'Display',
      title: 'No Tasks Assigned',
      customProps: {
        displayType: 'card',
        fields: [
          { key: 'emptyMessage', label: 'Status' }
        ],
        layout: 'list'
      }
    },
    data: {
      emptyMessage: 'You have no tasks assigned at this time. Check back later or contact your manager if you need work assigned.'
    }
  },
  parameters: {
    docs: {
      description: {
        story: `
**Scenario**: User has no assigned tasks

Demonstrates empty state handling when there are no tasks to display.
This is important for maintaining good UX when data is unavailable.
        `
      }
    }
  }
};

export const ErrorRecovery: Story = {
  args: {
    schema: userOnboardingSchema,
    initialData: {
      firstName: 'John',
      email: 'invalid-email' // This will trigger validation errors
    }
  },
  parameters: {
    docs: {
      description: {
        story: `
**Scenario**: Form with validation errors

Shows how the system handles and displays validation errors,
helping users understand what needs to be corrected.
        `
      }
    }
  }
}; 