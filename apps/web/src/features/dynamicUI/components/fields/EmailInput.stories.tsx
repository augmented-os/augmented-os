import type { Meta, StoryObj } from '@storybook/react';
import { EmailInput } from './EmailInput';

const meta: Meta<typeof EmailInput> = {
  title: 'Dynamic UI/Atomic Components/Form Fields/Email Input',
  component: EmailInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'An email input component with built-in validation, visual feedback, and email icon. Provides real-time validation feedback for email format.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    id: {
      control: 'text',
      description: 'Unique identifier for the input field',
    },
    label: {
      control: 'text',
      description: 'Label text displayed above the input',
    },
    value: {
      control: 'text',
      description: 'Current email value of the input',
    },
    onChange: {
      action: 'changed',
      description: 'Callback function called when input value changes',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text shown when input is empty',
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
    id: 'email',
    label: 'Email Address',
    value: '',
    placeholder: 'Enter email address',
  },
};

export const WithValue: Story = {
  args: {
    id: 'email-filled',
    label: 'Email Address',
    value: 'john.doe@example.com',
  },
};

export const ValidEmail: Story = {
  args: {
    id: 'email-valid',
    label: 'Work Email',
    value: 'sarah.smith@company.org',
    helpText: 'Please use your work email address',
  },
};

export const InvalidEmail: Story = {
  args: {
    id: 'email-invalid',
    label: 'Email Address',
    value: 'invalid-email',
    helpText: 'Enter a valid email address',
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows built-in validation feedback when an invalid email format is entered.',
      },
    },
  },
};

export const WithError: Story = {
  args: {
    id: 'email-error',
    label: 'Email Address',
    value: '',
    required: true,
    error: 'Email address is required for account creation',
  },
};

export const Required: Story = {
  args: {
    id: 'email-required',
    label: 'Email Address',
    value: '',
    required: true,
    helpText: 'We will use this email to send you important updates',
  },
};

export const WithCustomPlaceholder: Story = {
  args: {
    id: 'support-email',
    label: 'Support Email',
    value: '',
    placeholder: 'support@yourcompany.com',
    helpText: 'Email address for customer support inquiries',
  },
};

export const LongEmailAddress: Story = {
  args: {
    id: 'long-email',
    label: 'Email Address',
    value: 'very.long.email.address@subdomain.example-company.co.uk',
    helpText: 'Long email addresses are supported',
  },
};

export const MultipleValidationStates: Story = {
  render: () => (
    <div className="space-y-6">
      <EmailInput
        id="email-empty"
        label="Empty (Valid)"
        value=""
        onChange={() => {}}
        helpText="Empty is considered valid"
      />
      <EmailInput
        id="email-valid-simple"
        label="Valid Simple"
        value="user@example.com"
        onChange={() => {}}
      />
      <EmailInput
        id="email-valid-complex"
        label="Valid Complex"
        value="user.name+tag@sub.domain.com"
        onChange={() => {}}
      />
      <EmailInput
        id="email-invalid-format"
        label="Invalid Format"
        value="user@"
        onChange={() => {}}
      />
      <EmailInput
        id="email-invalid-domain"
        label="Invalid Domain"
        value="user@domain"
        onChange={() => {}}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates various email validation states in a single view.',
      },
    },
  },
}; 