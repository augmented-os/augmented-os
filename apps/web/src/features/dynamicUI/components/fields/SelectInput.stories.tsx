import type { Meta, StoryObj } from '@storybook/react';
import { SelectInput } from './SelectInput';

const meta: Meta<typeof SelectInput> = {
  title: 'Components/Atomic Components/Form Fields/Select Input',
  component: SelectInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A single-select dropdown component with support for validation, error states, and help text. Features accessible keyboard navigation.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    id: {
      control: 'text',
      description: 'Unique identifier for the select field',
    },
    label: {
      control: 'text',
      description: 'Label text displayed above the select',
    },
    value: {
      control: 'text',
      description: 'Currently selected value',
    },
    onChange: {
      action: 'changed',
      description: 'Callback function called when selection changes',
    },
    options: {
      control: 'object',
      description: 'Array of selectable options',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text shown when no option is selected',
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

// Sample data sets for realistic examples
const countryOptions = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'au', label: 'Australia' },
  { value: 'jp', label: 'Japan' },
];

const priorityOptions = [
  { value: 'low', label: 'Low Priority' },
  { value: 'medium', label: 'Medium Priority' },
  { value: 'high', label: 'High Priority' },
  { value: 'urgent', label: 'Urgent' },
];

const categoryOptions = [
  { value: 'electronics', label: 'Electronics' },
  { value: 'clothing', label: 'Clothing & Apparel' },
  { value: 'books', label: 'Books & Media' },
  { value: 'home', label: 'Home & Garden' },
  { value: 'sports', label: 'Sports & Outdoors' },
  { value: 'toys', label: 'Toys & Games' },
];

const departmentOptions = [
  { value: 'engineering', label: 'Engineering' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'sales', label: 'Sales' },
  { value: 'hr', label: 'Human Resources' },
  { value: 'finance', label: 'Finance' },
  { value: 'support', label: 'Customer Support', disabled: true },
];

export const Default: Story = {
  args: {
    id: 'country',
    label: 'Country',
    value: '',
    options: countryOptions,
    placeholder: 'Select a country',
  },
};

export const WithValue: Story = {
  args: {
    id: 'priority-selected',
    label: 'Priority Level',
    value: 'high',
    options: priorityOptions,
    placeholder: 'Choose priority',
  },
};

export const WithError: Story = {
  args: {
    id: 'category-error',
    label: 'Product Category',
    value: '',
    options: categoryOptions,
    placeholder: 'Select a category',
    required: true,
    error: 'Please select a product category',
  },
};

export const Required: Story = {
  args: {
    id: 'department-required',
    label: 'Department',
    value: '',
    options: departmentOptions,
    placeholder: 'Select department',
    required: true,
    helpText: 'Choose the department this request relates to',
  },
};

export const WithDisabledOptions: Story = {
  args: {
    id: 'department-disabled',
    label: 'Department',
    value: '',
    options: departmentOptions,
    placeholder: 'Select department',
    helpText: 'Some departments may be temporarily unavailable',
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows how disabled options appear in the dropdown.',
      },
    },
  },
};

export const WithHelpText: Story = {
  args: {
    id: 'country-help',
    label: 'Billing Country',
    value: '',
    options: countryOptions,
    placeholder: 'Select billing country',
    helpText: 'This should match the country on your billing address',
  },
};

export const LongOptions: Story = {
  args: {
    id: 'long-options',
    label: 'Service Type',
    value: '',
    options: [
      { value: 'basic', label: 'Basic Support Package (email only)' },
      { value: 'standard', label: 'Standard Support Package (email + phone)' },
      { value: 'premium', label: 'Premium Support Package (email + phone + chat)' },
      { value: 'enterprise', label: 'Enterprise Support Package (dedicated account manager + 24/7 support)' },
    ],
    placeholder: 'Choose service level',
    helpText: 'Select the support package that best fits your needs',
  },
};

export const ManyOptions: Story = {
  args: {
    id: 'timezone',
    label: 'Timezone',
    value: '',
    options: [
      { value: 'utc-12', label: '(UTC-12:00) International Date Line West' },
      { value: 'utc-11', label: '(UTC-11:00) Coordinated Universal Time-11' },
      { value: 'utc-10', label: '(UTC-10:00) Hawaii' },
      { value: 'utc-9', label: '(UTC-09:00) Alaska' },
      { value: 'utc-8', label: '(UTC-08:00) Pacific Time (US & Canada)' },
      { value: 'utc-7', label: '(UTC-07:00) Mountain Time (US & Canada)' },
      { value: 'utc-6', label: '(UTC-06:00) Central Time (US & Canada)' },
      { value: 'utc-5', label: '(UTC-05:00) Eastern Time (US & Canada)' },
      { value: 'utc-4', label: '(UTC-04:00) Atlantic Time (Canada)' },
      { value: 'utc0', label: '(UTC+00:00) London, Dublin, Lisbon' },
      { value: 'utc1', label: '(UTC+01:00) Berlin, Paris, Rome' },
      { value: 'utc8', label: '(UTC+08:00) Beijing, Hong Kong, Singapore' },
      { value: 'utc9', label: '(UTC+09:00) Tokyo, Seoul' },
    ],
    placeholder: 'Select your timezone',
    helpText: 'Choose your local timezone for scheduling',
  },
};

export const EmptyOptions: Story = {
  args: {
    id: 'empty-select',
    label: 'No Options Available',
    value: '',
    options: [],
    placeholder: 'No options available',
    helpText: 'Options will be loaded based on your previous selection',
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates how the component behaves when no options are available.',
      },
    },
  },
}; 