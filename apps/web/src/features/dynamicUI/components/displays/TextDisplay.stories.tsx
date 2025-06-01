import type { Meta, StoryObj } from '@storybook/react';
import { TextDisplay } from './TextDisplay';

const meta: Meta<typeof TextDisplay> = {
  title: 'DynamicUI/Displays/TextDisplay',
  component: TextDisplay,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A simple text display component that shows labeled or unlabeled text values with consistent styling.',
      },
    },
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Optional label displayed above the value',
    },
    value: {
      control: 'text',
      description: 'The value to display (can be any data type)',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes for custom styling',
    },
  },
};

export default meta;
type Story = StoryObj<typeof TextDisplay>;

export const Basic: Story = {
  args: {
    label: 'User Name',
    value: 'John Doe',
  },
};

export const WithoutLabel: Story = {
  args: {
    value: 'Some important information without a label',
  },
};

export const LongText: Story = {
  args: {
    label: 'Description',
    value: 'This is a very long text that demonstrates how the TextDisplay component handles lengthy content. It should wrap naturally and maintain readability across different viewport sizes.',
  },
};

export const NumericValue: Story = {
  args: {
    label: 'Total Revenue',
    value: 1234567.89,
  },
};

export const BooleanValue: Story = {
  args: {
    label: 'Is Active',
    value: true,
  },
};

export const DateValue: Story = {
  args: {
    label: 'Created At',
    value: new Date('2024-01-15T10:30:00Z').toISOString(),
  },
};

export const UrlValue: Story = {
  args: {
    label: 'Website',
    value: 'https://example.com/very-long-url-path/that-might-need-wrapping',
  },
};

export const EmptyValue: Story = {
  args: {
    label: 'Empty Field',
    value: null,
  },
};

export const UndefinedValue: Story = {
  args: {
    label: 'Undefined Field',
    value: undefined,
  },
};

export const ZeroValue: Story = {
  args: {
    label: 'Count',
    value: 0,
  },
};

export const CustomStyling: Story = {
  args: {
    label: 'Custom Styled',
    value: 'This text has custom styling applied',
    className: 'border-l-4 border-blue-500 pl-4 bg-blue-50 rounded-r',
  },
};

// Responsive test story
export const ResponsiveTest: Story = {
  args: {
    label: 'Responsive Text',
    value: 'This text should be readable across all viewport sizes from mobile to desktop',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Test how the component behaves on different screen sizes.',
      },
    },
  },
};

// Multiple instances for comparison
export const MultipleInstances: Story = {
  render: () => (
    <div className="space-y-4">
      <TextDisplay label="First Name" value="John" />
      <TextDisplay label="Last Name" value="Doe" />
      <TextDisplay label="Email" value="john.doe@example.com" />
      <TextDisplay label="Phone" value="+1 (555) 123-4567" />
      <TextDisplay value="No label field" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Multiple TextDisplay components showing different use cases together.',
      },
    },
  },
}; 