import type { Meta, StoryObj } from '@storybook/react';
import { DateInput } from './DateInput';

const meta: Meta<typeof DateInput> = {
  title: 'Components/Atomic Components/Form Fields/Date Input',
  component: DateInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A date input component with native browser date picker support. Handles validation, error states, and various date format scenarios.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    id: {
      control: 'text',
      description: 'Unique identifier for the date input field',
    },
    label: {
      control: 'text',
      description: 'Label text displayed above the date input',
    },
    value: {
      control: 'text',
      description: 'Current date value in YYYY-MM-DD format',
    },
    onChange: {
      action: 'changed',
      description: 'Callback function called when date value changes',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text (limited browser support)',
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
    id: 'birth-date',
    label: 'Date of Birth',
    value: '',
    placeholder: 'Select date',
  },
};

export const WithValue: Story = {
  args: {
    id: 'appointment-date',
    label: 'Appointment Date',
    value: '2024-03-15',
    helpText: 'Select your preferred appointment date',
  },
};

export const WithError: Story = {
  args: {
    id: 'deadline-error',
    label: 'Project Deadline',
    value: '',
    required: true,
    error: 'Project deadline is required',
  },
};

export const Required: Story = {
  args: {
    id: 'start-date-required',
    label: 'Start Date',
    value: '',
    required: true,
    helpText: 'Choose when you would like to begin the project',
  },
};

export const WithHelpText: Story = {
  args: {
    id: 'expiry-date',
    label: 'Expiry Date',
    value: '',
    helpText: 'Select the date when this offer expires',
  },
};

export const FutureDate: Story = {
  args: {
    id: 'future-event',
    label: 'Event Date',
    value: '2025-06-20',
    helpText: 'Event is scheduled for June 20, 2025',
  },
  parameters: {
    docs: {
      description: {
        story: 'Example with a future date selected.',
      },
    },
  },
};

export const PastDate: Story = {
  args: {
    id: 'graduation-date',
    label: 'Graduation Date',
    value: '2020-05-15',
    helpText: 'When did you graduate from university?',
  },
  parameters: {
    docs: {
      description: {
        story: 'Example with a past date selected.',
      },
    },
  },
};

export const TodayDate: Story = {
  args: {
    id: 'today-date',
    label: "Today's Date",
    value: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
    helpText: 'This is set to today\'s date',
  },
  parameters: {
    docs: {
      description: {
        story: 'Example with today\'s date pre-selected.',
      },
    },
  },
};

export const ValidationScenarios: Story = {
  render: () => (
    <div className="space-y-6">
      <DateInput
        id="valid-date"
        label="Valid Date"
        value="2024-12-25"
        onChange={() => {}}
        helpText="Christmas Day 2024"
      />
      <DateInput
        id="empty-required"
        label="Empty Required Date"
        value=""
        onChange={() => {}}
        required={true}
        error="This date is required"
      />
      <DateInput
        id="past-deadline"
        label="Past Deadline"
        value="2023-01-01"
        onChange={() => {}}
        error="Date cannot be in the past"
        helpText="Deadline must be a future date"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Various validation scenarios for date inputs.',
      },
    },
  },
};

export const DateRangeContext: Story = {
  render: () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium mb-4">Project Timeline</h3>
      <DateInput
        id="project-start"
        label="Start Date"
        value="2024-04-01"
        onChange={() => {}}
        helpText="When should the project begin?"
      />
      <DateInput
        id="project-milestone"
        label="Milestone Date"
        value="2024-06-15"
        onChange={() => {}}
        helpText="Important project milestone"
      />
      <DateInput
        id="project-end"
        label="End Date"
        value="2024-08-30"
        onChange={() => {}}
        helpText="Expected project completion"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example of multiple date inputs used together for date ranges.',
      },
    },
  },
};

export const SpecialDates: Story = {
  render: () => (
    <div className="space-y-6">
      <DateInput
        id="leap-year"
        label="Leap Year Date"
        value="2024-02-29"
        onChange={() => {}}
        helpText="February 29th in a leap year"
      />
      <DateInput
        id="new-year"
        label="New Year's Day"
        value="2025-01-01"
        onChange={() => {}}
        helpText="First day of the year"
      />
      <DateInput
        id="year-end"
        label="Year End"
        value="2024-12-31"
        onChange={() => {}}
        helpText="Last day of the year"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Examples with special dates like leap year, new year, etc.',
      },
    },
  },
}; 