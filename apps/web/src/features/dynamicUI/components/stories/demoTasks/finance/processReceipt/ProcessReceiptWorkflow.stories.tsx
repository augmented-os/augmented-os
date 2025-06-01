import type { Meta, StoryObj } from '@storybook/react';
import { DynamicUIRenderer } from '../../../../DynamicUIRenderer';
import { UIComponentSchema } from '../../../../../types/schemas';

const meta: Meta<typeof DynamicUIRenderer> = {
  title: 'Demo Tasks/Finance/Process Receipt/Process Receipt Workflow',
  component: DynamicUIRenderer,
  parameters: {
    docs: {
      description: {
        component: `
# Process Receipt Workflow

Complete receipt processing system from submission through approval and payment.
Demonstrates financial workflows, expense tracking, and approval processes using the Dynamic Tabs component.

**Processing Stages:**
- Submitted - Initial receipt uploaded and awaiting processing
- Under Review - Receipt being reviewed by finance team
- Approved - Receipt approved for payment
- Paid - Payment processed and completed

**Features:**
- **Receipt Details Tab** - Basic receipt information and metadata
- **Line Items Tab** - Detailed breakdown of expenses and items
- **Processing History Tab** - Complete audit trail of actions and approvals
- **Dynamic Actions** - Context-sensitive action buttons based on receipt status
- **Template-based Titles** - Dynamic titles with data interpolation

**Subcomponents:**
Individual components can be viewed separately under:
- Receipt Details - Form-style display of receipt metadata
- Line Items Table - Tabular view of expense line items  
- Processing History - Audit trail and workflow tracking

**Technical Implementation:**
- Uses Dynamic Tabs component for tabbed interface
- Each tab content rendered by appropriate display component
- Schema-driven configuration for maximum flexibility
- Integration with existing Dynamic UI primitives
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
      <div className="max-w-6xl mx-auto p-6">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof DynamicUIRenderer>;

// Receipt Details Tab Schema
const receiptDetailsSchema: UIComponentSchema = {
  componentId: 'receipt-details-tab',
  name: 'Receipt Details',
  componentType: 'Display',
  title: '',
  customProps: {
    displayType: 'card',
    layout: 'list',
    fields: [
      { key: 'supplier', label: 'Supplier' },
      { key: 'date', label: 'Date' },
      { key: 'amount', label: 'Amount' },
      { key: 'project', label: 'Project' },
      { key: 'rebillToClient', label: 'Rebill to client' },
    ]
  },
  actions: []
};

// Receipt Line Items Tab Schema
const receiptLineItemsSchema: UIComponentSchema = {
  componentId: 'receipt-line-items-tab',
  name: 'Receipt Line Items',
  componentType: 'Display',
  title: '',
  customProps: {
    displayType: 'table',
    dataKey: 'lineItems',
    columns: [
      { key: 'item', label: 'Item' },
      { key: 'quantity', label: 'Qty' },
      { key: 'unitPrice', label: 'Unit Price' },
      { key: 'totalPrice', label: 'Total' }
    ]
  },
  actions: []
};

// Main Receipt Processing Schema with Tabs
const receiptProcessingSchema: UIComponentSchema = {
  componentId: 'receipt-processing-demo',
  name: 'Process Receipt',
  componentType: 'Custom',
  title: 'Process Receipt from {{supplier}}',
  customProps: {
    displayType: 'tabs',
    tabs: [
      {
        id: 'details',
        label: 'Details',
        badge: '1',
        component: receiptDetailsSchema
      },
      {
        id: 'line-items',
        label: 'Line Items',
        component: receiptLineItemsSchema
      }
    ],
    defaultTab: 'details'
  },
  actions: [
    { actionKey: 'assign', label: 'Assign to', style: 'secondary' },
    { actionKey: 'approve', label: 'Approve', style: 'primary' }
  ]
};

export const ReceiptSubmitted: Story = {
  name: 'Receipt Submitted',
  args: {
    schema: receiptProcessingSchema,
    data: {
      // Receipt header data
      supplier: 'TechSupplies Inc',
      date: '2023-05-15',
      amount: '£245.99',
      project: '',
      rebillToClient: false,
      status: 'submitted',
      
      // Line items data
      lineItems: [
        { item: 'USB-C cables x3', quantity: 3, unitPrice: '£12.00', totalPrice: '£36.00' },
        { item: 'Wireless Mouse', quantity: 1, unitPrice: '£25.00', totalPrice: '£25.00' },
        { item: '1TB NVMe SSD', quantity: 1, unitPrice: '£150.00', totalPrice: '£150.00' },
        { item: '64GB USB Drive', quantity: 1, unitPrice: '£34.99', totalPrice: '£34.99' }
      ],
      
      // Receipt metadata
      receiptId: 'TechSupplies_Receipt_rcpt_456def.pdf',
      uploadedBy: 'John Doe',
      uploadedAt: '2023-05-15T10:30:00Z'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Newly submitted receipt awaiting project assignment and approval.'
      }
    }
  }
};

export const ReceiptUnderReview: Story = {
  name: 'Receipt Under Review',
  args: {
    schema: {
      ...receiptProcessingSchema,
      actions: [
        { actionKey: 'assign', label: 'Assign to', style: 'secondary' },
        { actionKey: 'request_info', label: 'Request More Info', style: 'secondary' },
        { actionKey: 'approve', label: 'Approve', style: 'primary' },
        { actionKey: 'reject', label: 'Reject', style: 'danger' }
      ]
    },
    data: {
      supplier: 'TechSupplies Inc',
      date: '2023-05-15',
      amount: '£245.99',
      project: 'Select a project',
      rebillToClient: false,
      status: 'under_review',
      
      lineItems: [
        { item: 'USB-C cables x3', quantity: 3, unitPrice: '£12.00', totalPrice: '£36.00' },
        { item: 'Wireless Mouse', quantity: 1, unitPrice: '£25.00', totalPrice: '£25.00' },
        { item: '1TB NVMe SSD', quantity: 1, unitPrice: '£150.00', totalPrice: '£150.00' },
        { item: '64GB USB Drive', quantity: 1, unitPrice: '£34.99', totalPrice: '£34.99' }
      ],
      
      receiptId: 'TechSupplies_Receipt_rcpt_456def.pdf',
      uploadedBy: 'John Doe',
      uploadedAt: '2023-05-15T10:30:00Z',
      assignedTo: 'Finance Team',
      reviewStartedAt: '2023-05-15T14:20:00Z'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Receipt under review with project assignment needed and approval decision pending.'
      }
    }
  }
};

export const ReceiptApproved: Story = {
  name: 'Receipt Approved',
  args: {
    schema: {
      ...receiptProcessingSchema,
      actions: [
        { actionKey: 'process_payment', label: 'Process Payment', style: 'primary' },
        { actionKey: 'export_data', label: 'Export Data', style: 'secondary' },
        { actionKey: 'contact_submitter', label: 'Contact Submitter', style: 'secondary' }
      ]
    },
    data: {
      supplier: 'TechSupplies Inc',
      date: '2023-05-15',
      amount: '£245.99',
      project: 'Office Equipment Upgrade',
      rebillToClient: true,
      status: 'approved',
      
      lineItems: [
        { item: 'USB-C cables x3', quantity: 3, unitPrice: '£12.00', totalPrice: '£36.00' },
        { item: 'Wireless Mouse', quantity: 1, unitPrice: '£25.00', totalPrice: '£25.00' },
        { item: '1TB NVMe SSD', quantity: 1, unitPrice: '£150.00', totalPrice: '£150.00' },
        { item: '64GB USB Drive', quantity: 1, unitPrice: '£34.99', totalPrice: '£34.99' }
      ],
      
      receiptId: 'TechSupplies_Receipt_rcpt_456def.pdf',
      uploadedBy: 'John Doe',
      uploadedAt: '2023-05-15T10:30:00Z',
      assignedTo: 'Finance Team',
      reviewStartedAt: '2023-05-15T14:20:00Z',
      approvedBy: 'Sarah Johnson',
      approvedAt: '2023-05-15T16:45:00Z',
      approvalNotes: 'Valid business expense for approved office equipment upgrade.'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Receipt approved and ready for payment processing with project assignment completed.'
      }
    }
  }
};

export const ReceiptPaid: Story = {
  name: 'Receipt Paid',
  args: {
    schema: {
      ...receiptProcessingSchema,
      actions: [
        { actionKey: 'view_payment_details', label: 'Payment Details', style: 'secondary' },
        { actionKey: 'export_data', label: 'Export Data', style: 'secondary' },
        { actionKey: 'archive', label: 'Archive', style: 'secondary' }
      ]
    },
    data: {
      supplier: 'TechSupplies Inc',
      date: '2023-05-15',
      amount: '£245.99 (Paid)',
      project: 'Office Equipment Upgrade',
      rebillToClient: true,
      status: 'paid',
      
      lineItems: [
        { item: 'USB-C cables x3', quantity: 3, unitPrice: '£12.00', totalPrice: '£36.00' },
        { item: 'Wireless Mouse', quantity: 1, unitPrice: '£25.00', totalPrice: '£25.00' },
        { item: '1TB NVMe SSD', quantity: 1, unitPrice: '£150.00', totalPrice: '£150.00' },
        { item: '64GB USB Drive', quantity: 1, unitPrice: '£34.99', totalPrice: '£34.99' }
      ],
      
      receiptId: 'TechSupplies_Receipt_rcpt_456def.pdf',
      uploadedBy: 'John Doe',
      uploadedAt: '2023-05-15T10:30:00Z',
      assignedTo: 'Finance Team',
      reviewStartedAt: '2023-05-15T14:20:00Z',
      approvedBy: 'Sarah Johnson',
      approvedAt: '2023-05-15T16:45:00Z',
      approvalNotes: 'Valid business expense for approved office equipment upgrade.',
      paymentMethod: 'Bank Transfer',
      paymentRef: 'TXN-789456123',
      paidAt: '2023-05-16T09:30:00Z'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Receipt fully processed with payment completed and ready for archival.'
      }
    }
  }
}; 