import type { Meta, StoryObj } from '@storybook/react';
import { MultiSelectInput } from './MultiSelectInput';

const meta: Meta<typeof MultiSelectInput> = {
  title: 'Components/Atomic Components/Form Fields/Multi Select Input',
  component: MultiSelectInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A multi-select checkbox component allowing users to select multiple options from a list. Features scrollable options list and selection count display.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    id: {
      control: 'text',
      description: 'Unique identifier for the multi-select field',
    },
    label: {
      control: 'text',
      description: 'Label text displayed above the multi-select',
    },
    value: {
      control: 'object',
      description: 'Array of currently selected values',
    },
    onChange: {
      action: 'changed',
      description: 'Callback function called when selection changes',
    },
    options: {
      control: 'object',
      description: 'Array of selectable options',
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
const skillsOptions = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue.js' },
  { value: 'angular', label: 'Angular' },
  { value: 'node', label: 'Node.js' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
];

const interestsOptions = [
  { value: 'technology', label: 'Technology' },
  { value: 'sports', label: 'Sports' },
  { value: 'music', label: 'Music' },
  { value: 'travel', label: 'Travel' },
  { value: 'cooking', label: 'Cooking' },
  { value: 'reading', label: 'Reading' },
  { value: 'gaming', label: 'Gaming' },
  { value: 'photography', label: 'Photography' },
  { value: 'art', label: 'Art & Design' },
  { value: 'fitness', label: 'Fitness' },
];

const featuresOptions = [
  { value: 'dashboard', label: 'Dashboard Analytics' },
  { value: 'reporting', label: 'Advanced Reporting' },
  { value: 'api', label: 'API Access' },
  { value: 'sso', label: 'Single Sign-On' },
  { value: 'backup', label: 'Automated Backups' },
  { value: 'support', label: '24/7 Support' },
  { value: 'integrations', label: 'Third-party Integrations' },
  { value: 'mobile', label: 'Mobile App Access', disabled: true },
];

const languagesOptions = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'it', label: 'Italian' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'zh', label: 'Chinese' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ko', label: 'Korean' },
  { value: 'ar', label: 'Arabic' },
  { value: 'hi', label: 'Hindi' },
  { value: 'ru', label: 'Russian' },
];

export const Default: Story = {
  args: {
    id: 'skills',
    label: 'Programming Skills',
    value: [],
    options: skillsOptions,
  },
};

export const WithSelectedValues: Story = {
  args: {
    id: 'interests-selected',
    label: 'Interests',
    value: ['technology', 'music', 'travel'],
    options: interestsOptions,
    helpText: 'Select all interests that apply to you',
  },
};

export const WithError: Story = {
  args: {
    id: 'features-error',
    label: 'Required Features',
    value: [],
    options: featuresOptions,
    required: true,
    error: 'Please select at least one feature',
  },
};

export const Required: Story = {
  args: {
    id: 'languages-required',
    label: 'Supported Languages',
    value: ['en'],
    options: languagesOptions,
    required: true,
    helpText: 'Select all languages you want to support in your application',
  },
};

export const WithDisabledOptions: Story = {
  args: {
    id: 'features-disabled',
    label: 'Available Features',
    value: ['dashboard', 'api'],
    options: featuresOptions,
    helpText: 'Some features may not be available in your current plan',
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows how disabled options appear in the multi-select list.',
      },
    },
  },
};

export const ManyOptions: Story = {
  args: {
    id: 'languages-many',
    label: 'Languages',
    value: ['en', 'es', 'fr'],
    options: languagesOptions,
    helpText: 'Select all languages you are fluent in',
  },
};

export const AllSelected: Story = {
  args: {
    id: 'skills-all',
    label: 'Programming Skills',
    value: ['javascript', 'typescript', 'react', 'vue', 'angular', 'node', 'python', 'java'],
    options: skillsOptions,
    helpText: 'All available skills have been selected',
  },
};

export const SingleSelection: Story = {
  args: {
    id: 'primary-interest',
    label: 'Primary Interest',
    value: ['technology'],
    options: interestsOptions,
    helpText: 'Select your main area of interest',
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates multi-select with only one item selected.',
      },
    },
  },
};

export const EmptyOptions: Story = {
  args: {
    id: 'empty-multiselect',
    label: 'No Options Available',
    value: [],
    options: [],
    helpText: 'Options will be loaded based on your previous selections',
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates how the component behaves when no options are available.',
      },
    },
  },
};

export const ValidationScenario: Story = {
  args: {
    id: 'team-skills',
    label: 'Team Skills',
    value: ['javascript'],
    options: skillsOptions,
    error: 'Please select at least 3 skills for your team profile',
    helpText: 'Select the primary skills your team possesses',
  },
  parameters: {
    docs: {
      description: {
        story: 'Example of validation requiring a minimum number of selections.',
      },
    },
  },
}; 