import type { Meta, StoryObj } from '@storybook/react';
import { BooleanInput } from './BooleanInput';

const meta: Meta<typeof BooleanInput> = {
  title: 'Components/Atomic Components/Form Fields/Boolean Input',
  component: BooleanInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A checkbox input component for boolean values with support for validation, error states, and help text. Features accessible keyboard navigation.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    id: {
      control: 'text',
      description: 'Unique identifier for the checkbox field',
    },
    label: {
      control: 'text',
      description: 'Label text displayed next to the checkbox',
    },
    value: {
      control: 'boolean',
      description: 'Current boolean value (checked/unchecked)',
    },
    onChange: {
      action: 'changed',
      description: 'Callback function called when checkbox state changes',
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
  },
  decorators: [
    (Story) => (
      <div className="max-w-md">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: 'newsletter',
    label: 'Subscribe to newsletter',
    value: false,
  },
};

export const Checked: Story = {
  args: {
    id: 'terms-accepted',
    label: 'I accept the terms and conditions',
    value: true,
  },
};

export const WithError: Story = {
  args: {
    id: 'terms-error',
    label: 'I accept the terms and conditions',
    value: false,
    required: true,
    error: 'You must accept the terms and conditions to continue',
  },
};

export const Required: Story = {
  args: {
    id: 'privacy-required',
    label: 'I agree to the privacy policy',
    value: false,
    required: true,
    helpText: 'This agreement is required to create your account',
  },
};

export const WithHelpText: Story = {
  args: {
    id: 'marketing-emails',
    label: 'Receive marketing emails',
    value: false,
    helpText: 'You can unsubscribe at any time from your account settings',
  },
};

export const LongLabel: Story = {
  args: {
    id: 'data-processing',
    label: 'I consent to the processing of my personal data for marketing purposes and agree to receive promotional communications',
    value: false,
    helpText: 'This is optional and you can change your preferences later',
  },
};

export const RequiredChecked: Story = {
  args: {
    id: 'age-verification',
    label: 'I confirm that I am 18 years or older',
    value: true,
    required: true,
    helpText: 'Age verification is required for this service',
  },
};

export const OptionalFeature: Story = {
  args: {
    id: 'analytics',
    label: 'Enable analytics tracking',
    value: true,
    helpText: 'Help us improve our service by allowing anonymous usage analytics',
  },
};

export const MultipleCheckboxes: Story = {
  render: () => (
    <div className="space-y-4">
      <BooleanInput
        id="feature-notifications"
        label="Push notifications"
        value={true}
        onChange={() => {}}
        helpText="Receive notifications about new features"
      />
      <BooleanInput
        id="feature-sync"
        label="Cloud sync"
        value={false}
        onChange={() => {}}
        helpText="Sync your data across devices"
      />
      <BooleanInput
        id="feature-backup"
        label="Automatic backups"
        value={true}
        onChange={() => {}}
        helpText="Create daily backups of your data"
      />
      <BooleanInput
        id="feature-advanced"
        label="Advanced features (Beta)"
        value={false}
        onChange={() => {}}
        helpText="Enable experimental features - may be unstable"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example of multiple boolean inputs used together for feature preferences.',
      },
    },
  },
};

export const PermissionSettings: Story = {
  render: () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium mb-4">Privacy Permissions</h3>
      <BooleanInput
        id="location-access"
        label="Allow location access"
        value={false}
        onChange={() => {}}
        helpText="Used to provide location-based features"
      />
      <BooleanInput
        id="camera-access"
        label="Allow camera access"
        value={false}
        onChange={() => {}}
        helpText="Required for profile photos and scanning features"
      />
      <BooleanInput
        id="microphone-access"
        label="Allow microphone access"
        value={false}
        onChange={() => {}}
        helpText="Used for voice messages and calls"
      />
      <BooleanInput
        id="contacts-access"
        label="Allow contacts access"
        value={true}
        onChange={() => {}}
        helpText="Help you find friends who are already using the app"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example of boolean inputs used for permission settings.',
      },
    },
  },
};

export const ValidationStates: Story = {
  render: () => (
    <div className="space-y-6">
      <BooleanInput
        id="valid-checkbox"
        label="Valid checkbox (no error)"
        value={true}
        onChange={() => {}}
      />
      <BooleanInput
        id="required-unchecked"
        label="Required but unchecked"
        value={false}
        onChange={() => {}}
        required={true}
        error="This field is required"
      />
      <BooleanInput
        id="required-checked"
        label="Required and checked (valid)"
        value={true}
        onChange={() => {}}
        required={true}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates different validation states for boolean inputs.',
      },
    },
  },
}; 