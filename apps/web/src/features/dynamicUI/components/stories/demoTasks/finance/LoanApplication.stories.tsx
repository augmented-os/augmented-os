import type { Meta, StoryObj } from '@storybook/react';
import { DynamicUIRenderer } from '../../../DynamicUIRenderer';
import { UIComponentSchema } from '../../../../types/schemas';

const meta: Meta<typeof DynamicUIRenderer> = {
  title: 'Demo Tasks/Finance/Loan Application',
  component: DynamicUIRenderer,
  parameters: {
    docs: {
      description: {
        component: `
# Loan Application Process

Complete loan application workflow from initial submission through approval and funding.
Demonstrates financial workflows, credit assessment, and approval processes.

**Application Stages:**
- Application Submitted - Initial loan request
- Under Review - Credit check and documentation review
- Approved - Loan approved with terms
- Funded - Loan amount disbursed
- Rejected - Application declined
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

// Loan application schema
const loanApplicationSchema: UIComponentSchema = {
  componentId: 'loan-application-demo',
  name: 'Loan Application',
  componentType: 'Display',
  title: 'Loan Application #{{applicationId}}',
  customProps: {
    displayType: 'card',
    fields: [
      { key: 'applicantName', label: 'Applicant' },
      { key: 'loanAmount', label: 'Loan Amount' },
      { key: 'loanPurpose', label: 'Purpose' },
      { key: 'submissionDate', label: 'Submitted' },
      { key: 'creditScore', label: 'Credit Score' },
      { key: 'annualIncome', label: 'Annual Income' },
      { key: 'employmentStatus', label: 'Employment' },
      { key: 'status', label: 'Application Status' },
      { key: 'interestRate', label: 'Offered Rate' }
    ],
    layout: 'grid'
  },
  actions: [
    { actionKey: 'review_docs', label: 'Review Documents', style: 'secondary' },
    { actionKey: 'request_info', label: 'Request More Info', style: 'secondary' },
    { actionKey: 'approve', label: 'Approve', style: 'primary', visibleIf: 'status == "under_review"' },
    { actionKey: 'reject', label: 'Reject', style: 'danger', visibleIf: 'status == "under_review"' },
    { actionKey: 'disburse', label: 'Disburse Funds', style: 'primary', visibleIf: 'status == "approved"' }
  ]
};

export const ApplicationSubmitted: Story = {
  name: 'Application Submitted',
  args: {
    schema: loanApplicationSchema,
    data: {
      applicationId: 'LA-2024-009847',
      applicantName: 'Michael Rodriguez',
      loanAmount: '$25,000',
      loanPurpose: 'Home Improvement',
      submissionDate: 'Oct 24, 2024 9:15 AM',
      creditScore: 'Pending verification',
      annualIncome: '$68,500',
      employmentStatus: 'Full-time (3 years)',
      status: 'submitted',
      interestRate: 'Pending approval'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'New loan application submitted and awaiting initial processing.'
      }
    }
  }
};

export const UnderReview: Story = {
  name: 'Under Review',
  args: {
    schema: loanApplicationSchema,
    data: {
      applicationId: 'LA-2024-009847',
      applicantName: 'Michael Rodriguez',
      loanAmount: '$25,000',
      loanPurpose: 'Home Improvement',
      submissionDate: 'Oct 24, 2024 9:15 AM',
      creditScore: '742 (Good)',
      annualIncome: '$68,500',
      employmentStatus: 'Full-time (3 years)',
      status: 'under_review',
      interestRate: 'Calculating...'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Application under review with credit check completed and awaiting underwriting decision.'
      }
    }
  }
};

export const Approved: Story = {
  name: 'Loan Approved',
  args: {
    schema: loanApplicationSchema,
    data: {
      applicationId: 'LA-2024-009847',
      applicantName: 'Michael Rodriguez',
      loanAmount: '$25,000',
      loanPurpose: 'Home Improvement',
      submissionDate: 'Oct 24, 2024 9:15 AM',
      creditScore: '742 (Good)',
      annualIncome: '$68,500',
      employmentStatus: 'Full-time (3 years)',
      status: 'approved',
      interestRate: '7.25% APR (60 months)'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Loan application approved with terms and ready for fund disbursement.'
      }
    }
  }
};

export const Funded: Story = {
  name: 'Funds Disbursed',
  args: {
    schema: {
      ...loanApplicationSchema,
      actions: [
        { actionKey: 'view_schedule', label: 'Payment Schedule', style: 'secondary' },
        { actionKey: 'setup_autopay', label: 'Setup Auto-pay', style: 'secondary' },
        { actionKey: 'contact_borrower', label: 'Contact Borrower', style: 'secondary' }
      ]
    },
    data: {
      applicationId: 'LA-2024-009847',
      applicantName: 'Michael Rodriguez',
      loanAmount: '$25,000 (Disbursed)',
      loanPurpose: 'Home Improvement',
      submissionDate: 'Oct 24, 2024 9:15 AM',
      creditScore: '742 (Good)',
      annualIncome: '$68,500',
      employmentStatus: 'Full-time (3 years)',
      status: 'funded',
      interestRate: '7.25% APR (60 months)'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Loan successfully funded with payment schedule active.'
      }
    }
  }
}; 