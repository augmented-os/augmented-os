import type { Meta, StoryObj } from '@storybook/react';
import { FormActions } from './FormActions';
import type { ActionButton } from '../types/schemas';

const meta: Meta<typeof FormActions> = {
  title: 'Components/Composite Components/Form Actions',
  component: FormActions,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A form actions component that renders action buttons with different styles, states, and conditional visibility. Supports submit, cancel, and custom actions.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    actions: {
      control: 'object',
      description: 'Array of action button configurations',
    },
    onAction: {
      action: 'action-triggered',
      description: 'Callback function called when an action button is clicked',
    },
    isSubmitting: {
      control: 'boolean',
      description: 'Whether the form is currently submitting (disables submit button)',
    },
    formData: {
      control: 'object',
      description: 'Current form data for evaluating conditional visibility',
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-2xl bg-card p-6 rounded-lg border">
        <div className="mb-4 text-sm text-muted-foreground">
          Form content would appear here...
        </div>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic actions with submit and cancel
const basicActions: ActionButton[] = [
  {
    actionKey: 'cancel',
    label: 'Cancel',
    style: 'secondary',
  },
  {
    actionKey: 'submit',
    label: 'Submit',
    style: 'primary',
  },
];

// Actions with different styles
const styledActions: ActionButton[] = [
  {
    actionKey: 'draft',
    label: 'Save Draft',
    style: 'secondary',
  },
  {
    actionKey: 'delete',
    label: 'Delete',
    style: 'danger',
    confirmation: 'Are you sure you want to delete this item? This action cannot be undone.',
  },
  {
    actionKey: 'submit',
    label: 'Publish',
    style: 'primary',
  },
];

// Actions with conditional visibility
const conditionalActions: ActionButton[] = [
  {
    actionKey: 'cancel',
    label: 'Cancel',
    style: 'secondary',
  },
  {
    actionKey: 'save_draft',
    label: 'Save Draft',
    style: 'secondary',
    visibleIf: 'status != "published"',
  },
  {
    actionKey: 'approve',
    label: 'Approve',
    style: 'primary',
    visibleIf: 'status == "pending_review" && userRole == "admin"',
  },
  {
    actionKey: 'reject',
    label: 'Reject',
    style: 'danger',
    visibleIf: 'status == "pending_review" && userRole == "admin"',
  },
  {
    actionKey: 'submit',
    label: 'Submit for Review',
    style: 'primary',
    visibleIf: 'status == "draft"',
  },
  {
    actionKey: 'edit',
    label: 'Edit',
    style: 'secondary',
    visibleIf: 'status == "published"',
  },
];

// Workflow actions
const workflowActions: ActionButton[] = [
  {
    actionKey: 'previous',
    label: 'Previous Step',
    style: 'secondary',
  },
  {
    actionKey: 'save_exit',
    label: 'Save & Exit',
    style: 'secondary',
  },
  {
    actionKey: 'next',
    label: 'Next Step',
    style: 'primary',
  },
];

// Single action
const singleAction: ActionButton[] = [
  {
    actionKey: 'submit',
    label: 'Create Account',
    style: 'primary',
  },
];

export const BasicActions: Story = {
  args: {
    actions: basicActions,
    isSubmitting: false,
    formData: {},
  },
};

export const SubmittingState: Story = {
  args: {
    actions: basicActions,
    isSubmitting: true,
    formData: {},
  },
};

export const DifferentStyles: Story = {
  args: {
    actions: styledActions,
    isSubmitting: false,
    formData: {},
  },
};

export const WithConfirmation: Story = {
  args: {
    actions: [
      {
        actionKey: 'cancel',
        label: 'Cancel',
        style: 'secondary',
      },
      {
        actionKey: 'delete',
        label: 'Delete Account',
        style: 'danger',
        confirmation: 'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently lost.',
      },
    ],
    isSubmitting: false,
    formData: {},
  },
};

export const ConditionalVisibility: Story = {
  args: {
    actions: conditionalActions,
    isSubmitting: false,
    formData: {
      status: 'pending_review',
      userRole: 'admin',
    },
  },
};

export const ConditionalVisibilityDraft: Story = {
  args: {
    actions: conditionalActions,
    isSubmitting: false,
    formData: {
      status: 'draft',
      userRole: 'user',
    },
  },
};

export const ConditionalVisibilityPublished: Story = {
  args: {
    actions: conditionalActions,
    isSubmitting: false,
    formData: {
      status: 'published',
      userRole: 'user',
    },
  },
};

export const WorkflowSteps: Story = {
  args: {
    actions: workflowActions,
    isSubmitting: false,
    formData: {},
  },
};

export const SingleAction: Story = {
  args: {
    actions: singleAction,
    isSubmitting: false,
    formData: {},
  },
};

export const DisabledActions: Story = {
  args: {
    actions: [
      {
        actionKey: 'cancel',
        label: 'Cancel',
        style: 'secondary',
        disabled: true,
      },
      {
        actionKey: 'submit',
        label: 'Submit',
        style: 'primary',
        disabled: true,
      },
    ],
    isSubmitting: false,
    formData: {},
  },
};

export const LoadingStates: Story = {
  args: {
    actions: [
      {
        actionKey: 'save_draft',
        label: 'Save Draft',
        style: 'secondary',
      },
      {
        actionKey: 'submit',
        label: 'Processing...',
        style: 'primary',
      },
    ],
    isSubmitting: true,
    formData: {},
  },
};

export const EmptyActions: Story = {
  args: {
    actions: [],
    isSubmitting: false,
    formData: {},
  },
}; 