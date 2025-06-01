import type { Meta, StoryObj } from '@storybook/react';
import { ActionButtons } from './ActionButtons';

const meta: Meta<typeof ActionButtons> = {
  title: 'Components/Atomic Components/Display Components/Action Buttons',
  component: ActionButtons,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A component for rendering action buttons with different styles and behaviors. Supports primary, secondary, and danger button variants.',
      },
    },
  },
  argTypes: {
    actions: {
      control: 'object',
      description: 'Array of action configurations',
    },
    onAction: {
      action: 'action-clicked',
      description: 'Callback function called when an action button is clicked',
    },
    data: {
      control: 'object',
      description: 'Data context passed to action handlers',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes for custom styling',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ActionButtons>;

export const SinglePrimary: Story = {
  args: {
    actions: [
      { actionKey: 'save', label: 'Save', style: 'primary' },
    ],
    data: { id: 1, name: 'Test Item' },
  },
};

export const SingleSecondary: Story = {
  args: {
    actions: [
      { actionKey: 'cancel', label: 'Cancel', style: 'secondary' },
    ],
    data: { id: 1 },
  },
};

export const SingleDanger: Story = {
  args: {
    actions: [
      { actionKey: 'delete', label: 'Delete', style: 'danger' },
    ],
    data: { id: 1, name: 'Important Item' },
  },
};

export const MultipleActions: Story = {
  args: {
    actions: [
      { actionKey: 'save', label: 'Save', style: 'primary' },
      { actionKey: 'draft', label: 'Save as Draft', style: 'secondary' },
      { actionKey: 'cancel', label: 'Cancel', style: 'secondary' },
    ],
    data: { id: 1, title: 'Document', modified: true },
  },
};

export const CrudActions: Story = {
  args: {
    actions: [
      { actionKey: 'view', label: 'View', style: 'secondary' },
      { actionKey: 'edit', label: 'Edit', style: 'primary' },
      { actionKey: 'delete', label: 'Delete', style: 'danger' },
    ],
    data: { id: 123, name: 'User Record', email: 'user@example.com' },
  },
};

export const FormActions: Story = {
  args: {
    actions: [
      { actionKey: 'submit', label: 'Submit Form', style: 'primary' },
      { actionKey: 'reset', label: 'Reset', style: 'secondary' },
    ],
    data: { formId: 'contact-form', hasChanges: true },
  },
};

export const LongLabels: Story = {
  args: {
    actions: [
      { actionKey: 'download', label: 'Download Report as PDF', style: 'primary' },
      { actionKey: 'email', label: 'Email to Recipients', style: 'secondary' },
      { actionKey: 'schedule', label: 'Schedule for Later', style: 'secondary' },
    ],
    data: { reportId: 'monthly-sales-2024' },
  },
};

export const SingleActionWithIcon: Story = {
  args: {
    actions: [
      { actionKey: 'export', label: 'Export Data', style: 'primary', icon: 'download' },
    ],
    data: { dataset: 'users' },
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows how icons would be displayed (icon property is included but not rendered in the current implementation).',
      },
    },
  },
};

export const EmptyActions: Story = {
  args: {
    actions: [],
    data: {},
  },
  parameters: {
    docs: {
      description: {
        story: 'When no actions are provided, the component renders nothing.',
      },
    },
  },
};

export const WithCustomData: Story = {
  args: {
    actions: [
      { actionKey: 'approve', label: 'Approve Request', style: 'primary' },
      { actionKey: 'reject', label: 'Reject', style: 'danger' },
      { actionKey: 'request-changes', label: 'Request Changes', style: 'secondary' },
    ],
    data: {
      requestId: 'REQ-2024-001',
      submitter: 'John Doe',
      amount: 1500,
      type: 'expense',
      status: 'pending',
    },
  },
};

export const CustomStyling: Story = {
  args: {
    actions: [
      { actionKey: 'confirm', label: 'Confirm Action', style: 'primary' },
      { actionKey: 'cancel', label: 'Cancel', style: 'secondary' },
    ],
    data: { id: 1 },
    className: 'justify-center bg-gray-50 p-4 rounded-lg',
  },
};

// Test different quantities of actions
export const ManyActions: Story = {
  args: {
    actions: [
      { actionKey: 'action1', label: 'Action 1', style: 'primary' },
      { actionKey: 'action2', label: 'Action 2', style: 'secondary' },
      { actionKey: 'action3', label: 'Action 3', style: 'secondary' },
      { actionKey: 'action4', label: 'Action 4', style: 'secondary' },
      { actionKey: 'action5', label: 'Action 5', style: 'secondary' },
      { actionKey: 'dangerous', label: 'Dangerous Action', style: 'danger' },
    ],
    data: { id: 1 },
  },
  parameters: {
    docs: {
      description: {
        story: 'Testing layout with many action buttons.',
      },
    },
  },
};

// Responsive test
export const ResponsiveActions: Story = {
  args: {
    actions: [
      { actionKey: 'primary-action', label: 'Primary Action with Long Label', style: 'primary' },
      { actionKey: 'secondary-action', label: 'Secondary Action', style: 'secondary' },
      { actionKey: 'danger-action', label: 'Danger Action', style: 'danger' },
    ],
    data: { id: 1, context: 'mobile-test' },
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Test how action buttons behave on small screens.',
      },
    },
  },
};

// Interactive story showing all styles together
export const AllStyles: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Primary Style</h3>
        <ActionButtons
          actions={[{ actionKey: 'primary-demo', label: 'Primary Button', style: 'primary' }]}
          data={{ demo: true }}
        />
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Secondary Style</h3>
        <ActionButtons
          actions={[{ actionKey: 'secondary-demo', label: 'Secondary Button', style: 'secondary' }]}
          data={{ demo: true }}
        />
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Danger Style</h3>
        <ActionButtons
          actions={[{ actionKey: 'danger-demo', label: 'Danger Button', style: 'danger' }]}
          data={{ demo: true }}
        />
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Mixed Styles</h3>
        <ActionButtons
          actions={[
            { actionKey: 'save', label: 'Save', style: 'primary' },
            { actionKey: 'cancel', label: 'Cancel', style: 'secondary' },
            { actionKey: 'delete', label: 'Delete', style: 'danger' },
          ]}
          data={{ demo: true }}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Comparison of all available button styles.',
      },
    },
  },
}; 