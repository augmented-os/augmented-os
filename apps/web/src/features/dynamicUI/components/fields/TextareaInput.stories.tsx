import type { Meta, StoryObj } from '@storybook/react';
import { TextareaInput } from './TextareaInput';

const meta: Meta<typeof TextareaInput> = {
  title: 'Dynamic UI/Atomic Components/Form Fields/Textarea Input',
  component: TextareaInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A multi-line textarea input component for longer text content with support for validation, error states, and help text. Features resizable height.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    id: {
      control: 'text',
      description: 'Unique identifier for the textarea field',
    },
    label: {
      control: 'text',
      description: 'Label text displayed above the textarea',
    },
    value: {
      control: 'text',
      description: 'Current text value of the textarea',
    },
    onChange: {
      action: 'changed',
      description: 'Callback function called when textarea value changes',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text shown when textarea is empty',
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
    id: 'description',
    label: 'Description',
    value: '',
    placeholder: 'Enter a detailed description',
  },
};

export const WithValue: Story = {
  args: {
    id: 'comments',
    label: 'Comments',
    value: 'This is a sample comment that demonstrates how the textarea looks with some content. It can span multiple lines and provides enough space for longer text input.',
    placeholder: 'Share your thoughts',
  },
};

export const WithError: Story = {
  args: {
    id: 'feedback-error',
    label: 'Feedback',
    value: '',
    placeholder: 'Please provide your feedback',
    required: true,
    error: 'Feedback is required to submit your review',
  },
};

export const Required: Story = {
  args: {
    id: 'message-required',
    label: 'Message',
    value: '',
    placeholder: 'Type your message here',
    required: true,
    helpText: 'Please provide a detailed message for our support team',
  },
};

export const WithHelpText: Story = {
  args: {
    id: 'project-details',
    label: 'Project Details',
    value: '',
    placeholder: 'Describe your project requirements, timeline, and any specific needs',
    helpText: 'Include as much detail as possible to help us understand your project scope and requirements',
  },
};

export const LongText: Story = {
  args: {
    id: 'article',
    label: 'Article Content',
    value: `This is a longer text example that demonstrates how the textarea component handles substantial content. The textarea is designed to be resizable, allowing users to adjust the height as needed for their content.

You can include multiple paragraphs, line breaks, and various types of content. The component maintains proper formatting and provides a good user experience even with longer text.

This flexibility makes it suitable for various use cases like blog posts, comments, feedback forms, and any other scenario where users need to input substantial amounts of text.`,
    placeholder: 'Write your article content',
    helpText: 'You can write as much as you need - the textarea will resize automatically',
  },
};

export const ShortPlaceholder: Story = {
  args: {
    id: 'notes',
    label: 'Quick Notes',
    value: '',
    placeholder: 'Add notes...',
    helpText: 'Brief notes or reminders',
  },
};

export const ValidationScenario: Story = {
  args: {
    id: 'review',
    label: 'Product Review',
    value: 'Too short',
    placeholder: 'Write a detailed review of the product',
    error: 'Review must be at least 50 characters long',
    helpText: 'Please provide a detailed review to help other customers',
  },
  parameters: {
    docs: {
      description: {
        story: 'Example of how validation errors would be displayed for minimum content length requirements.',
      },
    },
  },
}; 