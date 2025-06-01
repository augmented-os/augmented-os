import type { Meta, StoryObj } from '@storybook/react';
import { TextInput } from './TextInput';

const meta: Meta<typeof TextInput> = {
  title: 'DynamicUI/Fields/TextInput',
  component: TextInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A flexible text input component for forms with support for validation, error states, and help text.',
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
      description: 'Current value of the input',
    },
    onChange: {
      action: 'changed',
      description: 'Callback function called when input value changes',
    },
    type: {
      control: { type: 'select' },
      options: ['text', 'email'],
      description: 'Input type - text or email',
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
    id: 'name',
    label: 'Full Name',
    value: '',
    placeholder: 'Enter your full name',
  },
};

export const WithValue: Story = {
  args: {
    id: 'name-filled',
    label: 'Full Name',
    value: 'John Doe',
    placeholder: 'Enter your full name',
  },
};

export const WithError: Story = {
  args: {
    id: 'name-error',
    label: 'Full Name',
    value: '',
    placeholder: 'Enter your full name',
    required: true,
    error: 'Full name is required',
  },
};

export const Disabled: Story = {
  args: {
    id: 'name-disabled',
    label: 'Full Name',
    value: 'John Doe',
    placeholder: 'Enter your full name',
    // Note: Disabled state would need to be added to the component
  },
  parameters: {
    docs: {
      description: {
        story: 'Disabled state would require adding a disabled prop to the TextInput component.',
      },
    },
  },
};

export const Required: Story = {
  args: {
    id: 'name-required',
    label: 'Full Name',
    value: '',
    placeholder: 'Enter your full name',
    required: true,
    helpText: 'This field is required for account creation',
  },
};

export const WithHelpText: Story = {
  args: {
    id: 'username',
    label: 'Username',
    value: '',
    placeholder: 'Choose a unique username',
    helpText: 'Username must be 3-20 characters long and contain only letters, numbers, and underscores',
  },
};

export const LongLabel: Story = {
  args: {
    id: 'description',
    label: 'Detailed Project Description and Requirements',
    value: '',
    placeholder: 'Provide a comprehensive description',
    helpText: 'Include all relevant details about the project scope, requirements, and deliverables',
  },
}; 