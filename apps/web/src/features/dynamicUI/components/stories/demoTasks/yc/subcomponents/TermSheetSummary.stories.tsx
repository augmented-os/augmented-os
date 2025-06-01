import type { Meta, StoryObj } from '@storybook/react';
import { DynamicUIRenderer } from '../../../../DynamicUIRenderer';
import { UIComponentSchema } from '../../../../../types/schemas';

const meta: Meta<typeof DynamicUIRenderer> = {
  title: 'Demo Tasks/YC/Subcomponents/Term Sheet Summary',
  component: DynamicUIRenderer,
  parameters: {
    docs: {
      description: {
        component: `
# Term Sheet Summary Card

Card display component showing company and term sheet overview details.
Uses atomic CardDisplay configuration with grid layout for field presentation.

**Field Configuration:**
- Company name and basic details
- Valuation and investment amounts  
- Equity percentage
- Grid layout for organized presentation
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

// Term sheet summary schema matching database configuration
const termSheetSummarySchema: UIComponentSchema = {
  componentId: 'term-sheet-summary',
  name: 'Term Sheet Summary',
  description: 'Display term sheet details in a summary card',
  componentType: 'Display',
  title: '',
  customProps: {
    displayType: 'card',
    title: 'Company Details',
    fields: [
      { key: 'company', label: 'Company' },
      { key: 'valuation', label: 'Valuation' },
      { key: 'investment', label: 'Investment Amount' },
      { key: 'equity', label: 'Equity' }
    ],
    layout: 'grid'
  }
};

export const StandardTermSheet: Story = {
  name: 'Standard Term Sheet',
  args: {
    schema: termSheetSummarySchema,
    data: {
      company: 'FlowAI Technologies',
      valuation: '$12M pre-money',
      investment: '$3M Series A',
      equity: '20%'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Standard term sheet summary showing typical Series A funding details.'
      }
    }
  }
};

export const SeriesBTermSheet: Story = {
  name: 'Series B Term Sheet',
  args: {
    schema: termSheetSummarySchema,
    data: {
      company: 'GrowthCorp Inc.',
      valuation: '$45M pre-money',
      investment: '$15M Series B',
      equity: '25%'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Later stage Series B funding with higher valuation and investment amounts.'
      }
    }
  }
};

export const HighRiskTermSheet: Story = {
  name: 'High Risk Term Sheet',
  args: {
    schema: termSheetSummarySchema,
    data: {
      company: 'RiskyCorp Inc.',
      valuation: '$25M pre-money',
      investment: '$5M Series B',
      equity: '16.7%'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Term sheet for a potentially problematic deal requiring extra scrutiny.'
      }
    }
  }
}; 