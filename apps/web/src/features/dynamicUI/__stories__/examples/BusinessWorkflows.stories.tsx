import type { Meta, StoryObj } from '@storybook/react';
import { DynamicUIRenderer } from '../../components/DynamicUIRenderer';

const meta: Meta<typeof DynamicUIRenderer> = {
  title: 'Dynamic UI/🌟 Real-World Examples/Business Workflows',
  component: DynamicUIRenderer,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Real-world business workflow examples demonstrating how Dynamic UI solves actual business problems. These examples show complete workflows from start to finish with realistic data and business logic.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// TODO: STRB-110 - Replace with comprehensive business workflow examples

export const EmployeeOnboarding: Story = {
  name: '👤 Employee Onboarding',
  args: {
    schema: {
      componentId: 'employee-onboarding',
      name: 'Employee Onboarding',
      componentType: 'Form',
      title: 'Welcome to the Team!',
      description: 'Complete your onboarding process to get started.',
      // TODO: Add comprehensive onboarding workflow with conditional fields
      fields: [
        {
          fieldKey: 'placeholder',
          label: 'This is a placeholder',
          type: 'text',
          helpText: 'TODO: Replace with actual employee onboarding fields'
        }
      ],
      actions: [
        { actionKey: 'submit', label: 'Complete Onboarding', style: 'primary' },
        { actionKey: 'save-draft', label: 'Save & Continue Later', style: 'secondary' }
      ]
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Employee onboarding workflow with progressive disclosure, document uploads, and role-based field visibility. Demonstrates multi-step processes and business rule integration.',
      },
    },
  },
};

export const ExpenseReporting: Story = {
  name: '💰 Expense Reporting',
  args: {
    schema: {
      componentId: 'expense-report',
      name: 'Expense Report',
      componentType: 'Form',
      title: 'Submit Expense Report',
      description: 'Report your business expenses for reimbursement.',
      // TODO: Add expense reporting workflow with receipt uploads and approval routing
      fields: [
        {
          fieldKey: 'placeholder',
          label: 'This is a placeholder',
          type: 'text',
          helpText: 'TODO: Replace with actual expense reporting fields'
        }
      ],
      actions: [
        { actionKey: 'submit', label: 'Submit for Approval', style: 'primary' },
        { actionKey: 'save-draft', label: 'Save Draft', style: 'secondary' }
      ]
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Expense reporting with file uploads, automatic calculations, and approval workflows. Shows conditional validation and business rule enforcement.',
      },
    },
  },
};

export const DocumentApproval: Story = {
  name: '📋 Document Approval',
  args: {
    schema: {
      componentId: 'document-approval',
      name: 'Document Approval',
      componentType: 'Form',
      title: 'Document Review & Approval',
      description: 'Review and approve or reject the submitted document.',
      // TODO: Add document approval workflow with review comments and routing
      fields: [
        {
          fieldKey: 'placeholder',
          label: 'This is a placeholder',
          type: 'text',
          helpText: 'TODO: Replace with actual document approval fields'
        }
      ],
      actions: [
        { actionKey: 'approve', label: 'Approve', style: 'primary' },
        { actionKey: 'reject', label: 'Reject', style: 'danger' },
        { actionKey: 'request-changes', label: 'Request Changes', style: 'secondary' }
      ]
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Document approval workflow with review comments, conditional approval paths, and notification routing based on business rules.',
      },
    },
  },
};

export const CustomerSupportTicket: Story = {
  name: '🎫 Customer Support Ticket',
  args: {
    schema: {
      componentId: 'support-ticket',
      name: 'Support Ticket',
      componentType: 'Form',
      title: 'Create Support Ticket',
      description: 'Submit a support request for technical assistance.',
      // TODO: Add support ticket workflow with priority routing and escalation
      fields: [
        {
          fieldKey: 'placeholder',
          label: 'This is a placeholder',
          type: 'text',
          helpText: 'TODO: Replace with actual support ticket fields'
        }
      ],
      actions: [
        { actionKey: 'submit', label: 'Submit Ticket', style: 'primary' },
        { actionKey: 'save-draft', label: 'Save Draft', style: 'secondary' }
      ]
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Customer support ticket creation with priority-based routing, attachment handling, and automatic escalation based on issue type.',
      },
    },
  },
};

export const QualityAudit: Story = {
  name: '✅ Quality Audit',
  args: {
    schema: {
      componentId: 'quality-audit',
      name: 'Quality Audit',
      componentType: 'Form',
      title: 'Quality Audit Checklist',
      description: 'Complete the quality audit checklist for this product.',
      // TODO: Add quality audit workflow with scoring and compliance checks
      fields: [
        {
          fieldKey: 'placeholder',
          label: 'This is a placeholder',
          type: 'text',
          helpText: 'TODO: Replace with actual quality audit fields'
        }
      ],
      actions: [
        { actionKey: 'complete', label: 'Complete Audit', style: 'primary' },
        { actionKey: 'flag-issues', label: 'Flag Issues', style: 'danger' }
      ]
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Quality audit workflow with scoring, compliance checks, and automatic issue flagging based on audit results.',
      },
    },
  },
};

export const VendorOnboarding: Story = {
  name: '🏢 Vendor Onboarding',
  args: {
    schema: {
      componentId: 'vendor-onboarding',
      name: 'Vendor Onboarding',
      componentType: 'Form',
      title: 'Vendor Registration',
      description: 'Register as a new vendor partner.',
      // TODO: Add vendor onboarding with compliance verification and approval workflow
      fields: [
        {
          fieldKey: 'placeholder',
          label: 'This is a placeholder',
          type: 'text',
          helpText: 'TODO: Replace with actual vendor onboarding fields'
        }
      ],
      actions: [
        { actionKey: 'submit', label: 'Submit Application', style: 'primary' },
        { actionKey: 'save-progress', label: 'Save Progress', style: 'secondary' }
      ]
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Vendor onboarding with compliance verification, document requirements, and multi-stage approval process.',
      },
    },
  },
};

// TODO: STRB-110 - Add more comprehensive examples:
// - Project Request Workflow
// - Asset Management
// - Compliance Reporting
// - Performance Review Process
// - Budget Planning Workflow
// - Incident Reporting 