import type { Meta, StoryObj } from '@storybook/react';
import { DynamicDisplay } from '../../../../../DynamicDisplay';
import { UIComponentSchema } from '../../../../../../types/schemas';

const meta: Meta<typeof DynamicDisplay> = {
  title: 'Demo Tasks/Finance/Process Receipt/Subcomponents/Receipt Details',
  component: DynamicDisplay,
  parameters: {
    docs: {
      description: {
        component: `
# Receipt Details Component

Displays basic receipt information in a form-style layout for the receipt processing workflow.

**Features:**
- Form-style field display
- Receipt metadata (dates, amounts, vendors)
- Status indicators
- Read-only display format

**Use Cases:**
- Receipt review interface
- Finance approval workflows
- Expense tracking systems
        `
      }
    },
    layout: 'padded'
  },
  argTypes: {
    onAction: { action: 'action triggered' },
  },
  decorators: [
    (Story) => (
      <div className="max-w-2xl mx-auto p-6">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof DynamicDisplay>;

const receiptDetailsSchema: UIComponentSchema = {
  componentId: 'receipt-details',
  name: 'Receipt Details',
  componentType: 'Display',
  title: 'Receipt Information',
  customProps: {
    displayType: 'card',
    layout: 'list',
    fields: [
      { key: 'receiptNumber', label: 'Receipt Number' },
      { key: 'date', label: 'Date' },
      { key: 'vendor', label: 'Vendor' },
      { key: 'category', label: 'Category' },
      { key: 'totalAmount', label: 'Total Amount' },
      { key: 'currency', label: 'Currency' },
      { key: 'paymentMethod', label: 'Payment Method' },
      { key: 'submittedBy', label: 'Submitted By' },
      { key: 'submissionDate', label: 'Submission Date' },
      { key: 'status', label: 'Status' }
    ]
  },
  actions: []
};

export const Basic: Story = {
  name: 'Basic Receipt Details',
  args: {
    schema: receiptDetailsSchema,
    data: {
      receiptNumber: 'RCP-2024-001234',
      date: '2024-01-15',
      vendor: 'Office Supplies Ltd',
      category: 'Office Equipment',
      totalAmount: '£245.67',
      currency: 'GBP',
      paymentMethod: 'Company Credit Card',
      submittedBy: 'John Smith',
      submissionDate: '2024-01-16',
      status: 'Under Review'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Basic receipt details showing all standard fields for a typical expense receipt.'
      }
    }
  }
};

export const HighValueReceipt: Story = {
  name: 'High Value Receipt',
  args: {
    schema: receiptDetailsSchema,
    data: {
      receiptNumber: 'RCP-2024-001567',
      date: '2024-01-20',
      vendor: 'Tech Solutions Corp',
      category: 'Software & Licenses',
      totalAmount: '£2,850.00',
      currency: 'GBP',
      paymentMethod: 'Bank Transfer',
      submittedBy: 'Sarah Johnson',
      submissionDate: '2024-01-20',
      status: 'Pending Approval'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'High-value receipt that typically requires additional approval steps.'
      }
    }
  }
};

export const TravelExpense: Story = {
  name: 'Travel Expense',
  args: {
    schema: receiptDetailsSchema,
    data: {
      receiptNumber: 'RCP-2024-001890',
      date: '2024-01-22',
      vendor: 'Grand Hotel London',
      category: 'Travel & Accommodation',
      totalAmount: '£387.50',
      currency: 'GBP',
      paymentMethod: 'Personal Card (Reimbursable)',
      submittedBy: 'Mike Davis',
      submissionDate: '2024-01-25',
      status: 'Approved'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Travel expense receipt showing approved reimbursable expense.'
      }
    }
  }
};

export const RejectedReceipt: Story = {
  name: 'Rejected Receipt',
  args: {
    schema: receiptDetailsSchema,
    data: {
      receiptNumber: 'RCP-2024-001445',
      date: '2024-01-18',
      vendor: 'Personal Retailer',
      category: 'Miscellaneous',
      totalAmount: '£85.20',
      currency: 'GBP',
      paymentMethod: 'Personal Card',
      submittedBy: 'Alex Wilson',
      submissionDate: '2024-01-19',
      status: 'Rejected'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Rejected receipt showing a personal expense incorrectly submitted for reimbursement.'
      }
    }
  }
}; 