import type { Meta, StoryObj } from '@storybook/react';
import { DynamicUIRenderer } from '../../../../DynamicUIRenderer';
import { UIComponentSchema } from '../../../../../types/schemas';

const meta: Meta<typeof DynamicUIRenderer> = {
  title: 'Demo Tasks/YC/Subcomponents/Extracted Terms Table',
  component: DynamicUIRenderer,
  parameters: {
    docs: {
      description: {
        component: `
# Extracted Terms Table

Complex table display showing AI-extracted term sheet terms with compliance status flags.
Demonstrates advanced table configuration with conditional highlighting and status badges.

**Features:**
- Multi-column layout with custom widths
- Status badge rendering in the last column
- Row highlighting based on compliance status  
- Flag configuration for visual compliance indicators
- DataKey extraction from nested data structure
        `
      }
    }
  },
  argTypes: {
    onAction: { action: 'action triggered' },
  },
};

export default meta;
type Story = StoryObj<typeof DynamicUIRenderer>;

// Extracted terms table schema matching database configuration
const extractedTermsTableSchema: UIComponentSchema = {
  componentId: 'extracted-terms-table',
  name: 'Extracted Terms Table',
  description: 'Display extracted terms with conditional highlighting for flagged terms',
  componentType: 'Display',
  title: '',
  customProps: {
    displayType: 'table',
    title: 'Extracted Terms',
    columns: [
      { key: 'term', label: 'Term', width: 'w-1/4' },
      { key: 'value', label: 'Value', width: 'w-1/4' },
      { key: 'standard', label: 'Standard', width: 'w-1/4' },
      { key: 'status', label: 'Status', width: 'w-1/4', render: 'status-badge' }
    ],
    flagConfig: {
      field: 'status',
      configName: 'compliance',
      styles: {
        'Compliant': 'bg-green-50',
        'Non-standard': 'bg-amber-50',
        'Violation': 'bg-red-50',
        'Reference': 'bg-cyan-50',
        'Under Review': 'bg-neutral-50'
      },
      badgeConfigs: {
        'success': { class: 'bg-green-100 text-green-900', text: 'Compliant' },
        'warning': { class: 'bg-amber-100 text-amber-900', text: 'Non-standard' },
        'error': { class: 'bg-red-100 text-red-900', text: 'Violation' },
        'info': { class: 'bg-cyan-100 text-cyan-900', text: 'Reference' },
        'pending': { class: 'bg-neutral-100 text-neutral-900', text: 'Under Review' }
      }
    },
    dataKey: 'extractedTerms'
  }
};

export const CompliantTerms: Story = {
  name: 'Mostly Compliant Terms',
  args: {
    schema: extractedTermsTableSchema,
    data: {
      extractedTerms: [
        { term: 'Valuation', value: '$12M pre-money', standard: '$10-15M typical', status: 'Compliant' },
        { term: 'Liquidation Preference', value: '1x Non-participating', standard: '1x Non-participating', status: 'Compliant' },
        { term: 'Board Composition', value: '2 Founder, 2 Investor, 1 Independent', standard: 'Balanced representation', status: 'Compliant' },
        { term: 'Anti-dilution', value: 'Weighted Average Broad-based', standard: 'Weighted Average', status: 'Compliant' },
        { term: 'Dividend Rate', value: '12% cumulative', standard: '6-8% typical', status: 'Non-standard' },
        { term: 'Vesting Schedule', value: '4 years, 1 year cliff', standard: 'Standard vesting', status: 'Compliant' },
        { term: 'Option Pool', value: '15% pre-money', standard: '10-20% typical', status: 'Reference' }
      ]
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Term sheet with mostly compliant terms, showing a few non-standard items that may need attention.'
      }
    }
  }
};

export const ProblematicTerms: Story = {
  name: 'Problematic Terms',
  args: {
    schema: extractedTermsTableSchema,
    data: {
      extractedTerms: [
        { term: 'Valuation', value: '$25M pre-money', standard: '$15-20M typical', status: 'Non-standard' },
        { term: 'Liquidation Preference', value: '2x Participating', standard: '1x Non-participating', status: 'Violation' },
        { term: 'Board Composition', value: '1 Founder, 4 Investor, 0 Independent', standard: 'Balanced representation', status: 'Violation' },
        { term: 'Anti-dilution', value: 'Full Ratchet', standard: 'Weighted Average', status: 'Violation' },
        { term: 'Dividend Rate', value: '15% cumulative', standard: '6-8% typical', status: 'Violation' },
        { term: 'Drag Along Rights', value: 'Majority threshold 90%', standard: 'Simple majority 51%', status: 'Violation' },
        { term: 'Vesting Schedule', value: '6 years, 2 year cliff', standard: 'Standard vesting', status: 'Non-standard' },
        { term: 'Option Pool', value: '5% post-money', standard: '10-20% typical', status: 'Non-standard' }
      ]
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Term sheet with multiple violations and non-standard terms requiring careful review and likely rejection.'
      }
    }
  }
};

export const UnderReviewTerms: Story = {
  name: 'Terms Under Review',
  args: {
    schema: extractedTermsTableSchema,
    data: {
      extractedTerms: [
        { term: 'Valuation', value: '$18M pre-money', standard: '$15-20M typical', status: 'Under Review' },
        { term: 'Liquidation Preference', value: '1x Non-participating', standard: '1x Non-participating', status: 'Compliant' },
        { term: 'Board Composition', value: '2 Founder, 2 Investor, 1 Independent', standard: 'Balanced representation', status: 'Under Review' },
        { term: 'Anti-dilution', value: 'Weighted Average Narrow-based', standard: 'Weighted Average', status: 'Under Review' },
        { term: 'Dividend Rate', value: '10% cumulative', standard: '6-8% typical', status: 'Non-standard' },
        { term: 'Vesting Schedule', value: '4 years, 6 month cliff', standard: 'Standard vesting', status: 'Under Review' },
        { term: 'Option Pool', value: '18% pre-money', standard: '10-20% typical', status: 'Reference' }
      ]
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Term sheet with several terms still under review by the legal and investment teams.'
      }
    }
  }
};

export const EmptyTermsTable: Story = {
  name: 'Empty Terms Table',
  args: {
    schema: extractedTermsTableSchema,
    data: {
      extractedTerms: []
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty state showing how the table handles when no terms have been extracted yet.'
      }
    }
  }
}; 