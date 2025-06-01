import type { Meta, StoryObj } from '@storybook/react';
import { NumberInput } from './NumberInput';

const meta: Meta<typeof NumberInput> = {
  title: 'Dynamic UI/Atomic Components/Form Fields/Number Input',
  component: NumberInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A number input component for forms with support for validation, error states, and help text. Handles both integer and decimal values.',
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
      control: 'number',
      description: 'Current numeric value of the input',
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
    id: 'age',
    label: 'Age',
    value: '',
    placeholder: 'Enter your age',
  },
};

export const WithValue: Story = {
  args: {
    id: 'salary',
    label: 'Annual Salary',
    value: 75000,
    placeholder: 'Enter amount',
    helpText: 'Enter your annual salary in USD',
  },
};

export const WithDecimalValue: Story = {
  args: {
    id: 'price',
    label: 'Product Price',
    value: 299.99,
    placeholder: '0.00',
    helpText: 'Enter price including cents',
  },
};

export const WithError: Story = {
  args: {
    id: 'quantity-error',
    label: 'Quantity',
    value: '',
    placeholder: 'Enter quantity',
    required: true,
    error: 'Quantity is required and must be a positive number',
  },
};

export const Required: Story = {
  args: {
    id: 'quantity-required',
    label: 'Quantity',
    value: '',
    placeholder: 'Enter quantity',
    required: true,
    helpText: 'This field is required for order processing',
  },
};

export const WithLargeNumber: Story = {
  args: {
    id: 'population',
    label: 'City Population',
    value: 8398748,
    placeholder: 'Enter population',
    helpText: 'Enter the estimated city population',
  },
};

export const WithNegativeNumber: Story = {
  args: {
    id: 'temperature',
    label: 'Temperature (°C)',
    value: -15,
    placeholder: 'Enter temperature',
    helpText: 'Temperature can be negative for below freezing',
  },
};

export const EmptyValue: Story = {
  args: {
    id: 'optional-number',
    label: 'Optional Number',
    value: '',
    placeholder: 'Enter a number (optional)',
    helpText: 'This field is optional and can be left empty',
  },
};

export const ValidationScenario: Story = {
  args: {
    id: 'score',
    label: 'Test Score',
    value: 105,
    placeholder: 'Enter score (0-100)',
    error: 'Score must be between 0 and 100',
    helpText: 'Enter a score between 0 and 100',
  },
  parameters: {
    docs: {
      description: {
        story: 'Example of how validation errors would be displayed when value is outside acceptable range.',
      },
    },
  },
}; 