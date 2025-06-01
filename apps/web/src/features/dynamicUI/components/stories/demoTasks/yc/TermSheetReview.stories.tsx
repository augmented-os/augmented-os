import type { Meta, StoryObj } from '@storybook/react';
import { DynamicUIRenderer } from '../../../DynamicUIRenderer';
import { UIComponentSchema } from '../../../../types/schemas';

const meta: Meta<typeof DynamicUIRenderer> = {
  title: 'Demo Tasks/YC/Term Sheet Review',
  component: DynamicUIRenderer,
  parameters: {
    docs: {
      description: {
        component: `
# Term Sheet Review Process

Venture capital term sheet review workflow demonstrating complex nested component composition.
Shows how master task views orchestrate multiple subcomponents with conditional rendering.

**Review Stages:**
- Summary Display - Company and term sheet overview
- Extracted Terms Table - AI-extracted terms with compliance flags  
- Review Decision Form - Investment decision workflow
- Request Revisions - Form to request changes from companies

**Features Demonstrated:**
- Nested component composition through layout system
- Conditional rendering based on UI state
- Complex table displays with status flags
- Multi-step form workflows
- Action-driven UI state management
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

// Master task view schema that orchestrates all subcomponents
const termSheetReviewTaskViewSchema: UIComponentSchema = {
  componentId: 'task-view-review-term-sheet',
  name: 'Term Sheet Review Task View',
  description: 'Complete UI layout for term sheet review task',
  componentType: 'Display',
  title: 'Review Term Sheet',
  layout: {
    type: 'conditional',
    defaultView: {
      type: 'grid',
      areas: [
        { component: 'term-sheet-summary', grid: 'span 12', order: 1, visibleIf: '!uiState.showReviewForm' },
        { component: 'extracted-terms-table', grid: 'span 12', order: 2, visibleIf: '!uiState.showReviewForm' },
        { component: 'review-request-form', grid: 'span 12', order: 3, visibleIf: 'uiState.showReviewForm' }
      ],
      spacing: 'lg',
      className: 'task-review-layout'
    }
  },
  actions: [
    { actionKey: 'request_review', label: 'Request Review', style: 'secondary', visibleIf: '!uiState.showReviewForm' },
    { actionKey: 'approve', label: 'Approve', style: 'primary', visibleIf: '!uiState.showReviewForm' },
    { actionKey: 'cancel', label: 'Cancel', style: 'secondary', visibleIf: 'uiState.showReviewForm' }
  ]
};

// Main story showing normal review state
export const TermSheetReview: Story = {
  name: 'Term Sheet Review',
  args: {
    schema: termSheetReviewTaskViewSchema,
    data: {
      task_reference: 'TS-2024-042',
      company: 'FlowAI Technologies',
      valuation: '$12M pre-money',
      investment: '$3M Series A',
      equity: '20%',
      uiState: { showReviewForm: false },
      extractedTerms: [
        { term: 'Valuation', value: '$12M pre-money', standard: '$10-15M typical', status: 'Compliant' },
        { term: 'Liquidation Preference', value: '1x Non-participating', standard: '1x Non-participating', status: 'Compliant' },
        { term: 'Board Composition', value: '2 Founder, 2 Investor, 1 Independent', standard: 'Balanced representation', status: 'Compliant' },
        { term: 'Anti-dilution', value: 'Weighted Average Broad-based', standard: 'Weighted Average', status: 'Compliant' },
        { term: 'Dividend Rate', value: '12% cumulative', standard: '6-8% typical', status: 'Non-standard' },
        { term: 'Drag Along Rights', value: 'Majority threshold 75%', standard: 'Simple majority 51%', status: 'Violation' },
        { term: 'Vesting Schedule', value: '4 years, 1 year cliff', standard: 'Standard vesting', status: 'Compliant' },
        { term: 'Option Pool', value: '15% pre-money', standard: '10-20% typical', status: 'Reference' }
      ]
    },
    initialUIState: { showReviewForm: false }
  },
  parameters: {
    docs: {
      description: {
        story: 'Complete term sheet review interface showing company details, extracted terms with compliance status, and available actions.'
      }
    }
  }
};

// Story showing the review request form
export const RequestingRevisions: Story = {
  name: 'Requesting Revisions',
  args: {
    schema: termSheetReviewTaskViewSchema,
    data: {
      task_reference: 'TS-2024-042',
      company: 'FlowAI Technologies',
      valuation: '$12M pre-money',
      investment: '$3M Series A',
      equity: '20%',
      uiState: { showReviewForm: true },
      extractedTerms: [
        { term: 'Valuation', value: '$12M pre-money', standard: '$10-15M typical', status: 'Compliant' },
        { term: 'Liquidation Preference', value: '1x Non-participating', standard: '1x Non-participating', status: 'Compliant' },
        { term: 'Board Composition', value: '2 Founder, 2 Investor, 1 Independent', standard: 'Balanced representation', status: 'Compliant' },
        { term: 'Anti-dilution', value: 'Weighted Average Broad-based', standard: 'Weighted Average', status: 'Compliant' },
        { term: 'Dividend Rate', value: '12% cumulative', standard: '6-8% typical', status: 'Non-standard' },
        { term: 'Drag Along Rights', value: 'Majority threshold 75%', standard: 'Simple majority 51%', status: 'Violation' },
        { term: 'Vesting Schedule', value: '4 years, 1 year cliff', standard: 'Standard vesting', status: 'Compliant' },
        { term: 'Option Pool', value: '15% pre-money', standard: '10-20% typical', status: 'Reference' }
      ]
    },
    initialUIState: { showReviewForm: true }
  },
  parameters: {
    docs: {
      description: {
        story: 'UI state when requesting revisions - shows the review request form while hiding the summary and table.'
      }
    }
  }
};

// Story demonstrating problematic terms requiring attention
export const ProblematicTerms: Story = {
  name: 'Problematic Terms Highlighted',
  args: {
    schema: termSheetReviewTaskViewSchema,
    data: {
      task_reference: 'TS-2024-043',
      company: 'RiskyCorp Inc.',
      valuation: '$25M pre-money',
      investment: '$5M Series B',
      equity: '16.7%',
      uiState: { showReviewForm: false },
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
    },
    initialUIState: { showReviewForm: false }
  },
  parameters: {
    docs: {
      description: {
        story: 'Term sheet with multiple compliance violations and non-standard terms that require careful review.'
      }
    }
  }
}; 