import type { Meta, StoryObj } from '@storybook/react';
import { DynamicUIRenderer } from '../../../DynamicUIRenderer';
import { UIComponentSchema } from '../../../../types/schemas';

const meta: Meta<typeof DynamicUIRenderer> = {
  title: 'Demo Tasks/Overview',
  component: DynamicUIRenderer,
  parameters: {
    docs: {
      description: {
        component: `
# Demo Tasks Overview

Business domain-specific demonstrations of the Dynamic UI system in action.
These demos showcase real-world scenarios across different industries and use cases.

**Domains Available:**
- **Coding**: Software development workflows and tech company scenarios
- **E-commerce**: Online retail, inventory, and customer management  
- **Finance**: Banking, investments, and financial planning workflows
- **YC (Startup)**: Y Combinator-style startup and venture scenarios

Navigate to the specific domain folders to see relevant demo tasks.
        `
      }
    }
  },
  argTypes: {
    onSubmit: { action: 'submitted' },
    onCancel: { action: 'cancelled' },
    onAction: { action: 'action triggered' },
  },
};

export default meta;
type Story = StoryObj<typeof DynamicUIRenderer>;

// Overview demo that shows the concept
const demoOverviewSchema: UIComponentSchema = {
  componentId: 'demo-overview',
  name: 'Demo Tasks Overview',
  componentType: 'Display',
  title: 'Welcome to Demo Tasks',
  customProps: {
    displayType: 'card',
    fields: [
      { key: 'description', label: 'What are Demo Tasks?' },
      { key: 'purpose', label: 'Purpose' },
      { key: 'navigation', label: 'How to Navigate' },
      { key: 'domains', label: 'Available Domains' }
    ],
    layout: 'list'
  }
};

export const WelcomeOverview: Story = {
  args: {
    schema: demoOverviewSchema,
    data: {
      description: 'Demo Tasks are curated examples that show how the Dynamic UI system handles real business scenarios across different industries.',
      purpose: 'These demos help developers, product managers, and stakeholders understand the system\'s capabilities in context.',
      navigation: 'Use the sidebar to navigate to specific domains: Coding, E-commerce, Finance, or YC (Startup scenarios).',
      domains: 'Each domain contains 3-5 realistic scenarios with sample data and workflows.'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Overview of the Demo Tasks section and how to navigate the business domain examples.'
      }
    }
  }
}; 