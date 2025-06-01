import type { Meta, StoryObj } from '@storybook/react';
import { DynamicUIRenderer } from '../../../../DynamicUIRenderer';
import { UIComponentSchema } from '../../../../../types/schemas';

const meta: Meta<typeof DynamicUIRenderer> = {
  title: 'Demo Tasks/YC/Subcomponents/Review Request Form',
  component: DynamicUIRenderer,
  parameters: {
    docs: {
      description: {
        component: `
# Review Request Form

Form component for requesting revisions to term sheets from portfolio companies.
Demonstrates complex form configuration with validation rules and dynamic actions.

**Form Fields:**
- Recipient selection dropdown
- Subject line for communication
- Message textarea with validation
- Optional document attachment checkbox

**Features:**
- Required field validation
- Multi-option select for recipients
- Form actions with confirmation
        `
      }
    }
  },
  argTypes: {
    onSubmit: { action: 'form submitted' },
    onCancel: { action: 'form cancelled' },
    onAction: { action: 'action triggered' },
  },
};

export default meta;
type Story = StoryObj<typeof DynamicUIRenderer>;

// Review request form schema matching database configuration
const reviewRequestFormSchema: UIComponentSchema = {
  componentId: 'review-request-form',
  name: 'Review Request Form',
  description: 'Form to request revisions for a term sheet.',
  componentType: 'Form',
  title: 'Request Term Sheet Revisions',
  fields: [
    {
      fieldKey: 'recipient',
      label: 'Recipient',
      type: 'select',
      options: [
        { value: 'founder@companyname.com', label: 'founder@companyname.com' },
        { value: 'ceo@company.com', label: 'ceo@company.com' },
        { value: 'legal@company.com', label: 'legal@company.com' }
      ],
      validationRules: ['required']
    },
    {
      fieldKey: 'subject',
      label: 'Subject',
      type: 'text',
      placeholder: 'Enter subject',
      validationRules: ['required']
    },
    {
      fieldKey: 'message',
      label: 'Message',
      type: 'textarea',
      placeholder: 'Enter your message',
      validationRules: ['required']
    },
    {
      fieldKey: 'attachDocument',
      label: 'Attach revised term sheet document',
      type: 'boolean',
      default: false
    }
  ],
  actions: [
    { actionKey: 'submit', label: 'Send Request', style: 'primary' },
    { actionKey: 'cancel', label: 'Cancel', style: 'secondary' }
  ]
};

export const NewRevisionRequest: Story = {
  name: 'New Revision Request',
  args: {
    schema: reviewRequestFormSchema,
    initialData: {
      recipient: '',
      subject: '',
      message: '',
      attachDocument: false
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty form for creating a new revision request to a portfolio company.'
      }
    }
  }
};

export const PrefilledDividendRequest: Story = {
  name: 'Prefilled Dividend Rate Request',
  args: {
    schema: reviewRequestFormSchema,
    initialData: {
      recipient: 'founder@companyname.com',
      subject: 'Term Sheet Revision Required - Dividend Rate',
      message: 'Hi team,\n\nAfter reviewing your submitted term sheet, we need to discuss the proposed dividend rate of 12% cumulative. Our standard terms typically cap dividends at 6-8%.\n\nCould we schedule a call to discuss this term and potentially revise the rate to be more in line with market standards?\n\nBest regards,\nInvestment Team',
      attachDocument: true
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Form prefilled with a specific revision request regarding dividend rates.'
      }
    }
  }
};

export const PrefilledBoardCompositionRequest: Story = {
  name: 'Prefilled Board Composition Request',
  args: {
    schema: reviewRequestFormSchema,
    initialData: {
      recipient: 'legal@company.com',
      subject: 'Critical Revision Required - Board Composition',
      message: 'Dear Legal Team,\n\nWe have reviewed the term sheet and identified a significant concern with the proposed board composition. The current structure heavily favors investor representation which does not align with our investment principles.\n\nWe require a more balanced board structure that includes:\n- Equal founder and investor representation\n- At least one independent board member\n\nPlease revise the term sheet to reflect a more balanced governance structure.\n\nRegards,\nLegal & Investment Committee',
      attachDocument: false
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Form prefilled with a critical revision request regarding board composition and governance.'
      }
    }
  }
};

export const ComprehensiveRevisionRequest: Story = {
  name: 'Comprehensive Revision Request',
  args: {
    schema: reviewRequestFormSchema,
    initialData: {
      recipient: 'ceo@company.com',
      subject: 'Multiple Term Sheet Revisions Required',
      message: 'Dear CEO,\n\nThank you for submitting your Series B term sheet. After thorough review by our investment committee, we have identified several terms that require revision:\n\n1. Liquidation Preference: Current 2x participating is excessive - please revise to 1x non-participating\n2. Anti-dilution: Full ratchet is too aggressive - weighted average broad-based preferred\n3. Board Composition: Needs rebalancing for proper governance\n4. Dividend Rate: 15% cumulative exceeds market standards\n\nWe remain interested in the investment but need these fundamental terms adjusted. Please let us know if you would like to schedule a call to discuss these points in detail.\n\nBest regards,\nPartner Team',
      attachDocument: true
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Comprehensive revision request addressing multiple problematic terms in the deal structure.'
      }
    }
  }
}; 