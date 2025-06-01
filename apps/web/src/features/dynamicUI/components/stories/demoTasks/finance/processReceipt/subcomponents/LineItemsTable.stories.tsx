import type { Meta, StoryObj } from '@storybook/react';
import { DynamicDisplay } from '../../../../../DynamicDisplay';
import { UIComponentSchema } from '../../../../../../types/schemas';

const meta: Meta<typeof DynamicDisplay> = {
  title: 'Demo Tasks/Finance/Process Receipt/Subcomponents/Line Items Table',
  component: DynamicDisplay,
  parameters: {
    docs: {
      description: {
        component: `
# Line Items Table Component

Displays receipt line items in a structured table format for detailed expense breakdown.

**Features:**
- Tabular display of line items
- Quantity, price, and total calculations
- Item descriptions and categories
- Sortable columns
- Responsive design

**Use Cases:**
- Detailed expense review
- Line-by-line approval process
- Audit trails for receipts
- Budget breakdown analysis
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
      <div className="max-w-4xl mx-auto p-6">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof DynamicDisplay>;

const lineItemsTableSchema: UIComponentSchema = {
  componentId: 'line-items-table',
  name: 'Line Items Table',
  componentType: 'Display',
  title: 'Receipt Line Items',
  customProps: {
    displayType: 'table',
    dataKey: 'lineItems',
    columns: [
      { key: 'item', label: 'Item Description' },
      { key: 'category', label: 'Category' },
      { key: 'quantity', label: 'Qty' },
      { key: 'unitPrice', label: 'Unit Price' },
      { key: 'total', label: 'Total' }
    ]
  },
  actions: []
};

export const OfficeSupplies: Story = {
  name: 'Office Supplies Receipt',
  args: {
    schema: lineItemsTableSchema,
    data: {
      lineItems: [
        { item: 'Printer Paper A4 (500 sheets)', category: 'Office Supplies', quantity: 3, unitPrice: '£8.99', total: '£26.97' },
        { item: 'Blue Ink Pens (Pack of 12)', category: 'Office Supplies', quantity: 2, unitPrice: '£4.50', total: '£9.00' },
        { item: 'Desk Organizer Tray', category: 'Office Equipment', quantity: 1, unitPrice: '£15.99', total: '£15.99' },
        { item: 'Sticky Notes (Multi-pack)', category: 'Office Supplies', quantity: 1, unitPrice: '£6.99', total: '£6.99' }
      ]
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Office supplies receipt with multiple line items and standard quantities.'
      }
    }
  }
};

export const SoftwareLicense: Story = {
  name: 'Software License Receipt',
  args: {
    schema: lineItemsTableSchema,
    data: {
      lineItems: [
        { item: 'Adobe Creative Suite Annual License', category: 'Software', quantity: 1, unitPrice: '£599.99', total: '£599.99' },
        { item: 'Microsoft Office 365 Business (3 users)', category: 'Software', quantity: 1, unitPrice: '£189.99', total: '£189.99' },
        { item: 'Slack Pro Plan (Annual)', category: 'Software', quantity: 1, unitPrice: '£84.00', total: '£84.00' }
      ]
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'High-value software license purchases with annual subscriptions.'
      }
    }
  }
};

export const TravelExpenses: Story = {
  name: 'Travel Expenses Receipt',
  args: {
    schema: lineItemsTableSchema,
    data: {
      lineItems: [
        { item: 'Hotel Accommodation (2 nights)', category: 'Travel', quantity: 2, unitPrice: '£125.00', total: '£250.00' },
        { item: 'Business Dinner', category: 'Meals', quantity: 1, unitPrice: '£85.50', total: '£85.50' },
        { item: 'Taxi to Airport', category: 'Transport', quantity: 1, unitPrice: '£35.00', total: '£35.00' },
        { item: 'Client Lunch Meeting', category: 'Meals', quantity: 1, unitPrice: '£42.50', total: '£42.50' }
      ]
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Travel expense breakdown with accommodation, meals, and transport costs.'
      }
    }
  }
};

export const MixedExpenses: Story = {
  name: 'Mixed Business Expenses',
  args: {
    schema: lineItemsTableSchema,
    data: {
      lineItems: [
        { item: 'Conference Registration Fee', category: 'Training', quantity: 1, unitPrice: '£450.00', total: '£450.00' },
        { item: 'Business Cards (500 count)', category: 'Marketing', quantity: 1, unitPrice: '£35.00', total: '£35.00' },
        { item: 'External Hard Drive 1TB', category: 'IT Equipment', quantity: 1, unitPrice: '£89.99', total: '£89.99' },
        { item: 'Courier Service', category: 'Postage', quantity: 1, unitPrice: '£15.50', total: '£15.50' },
        { item: 'Team Building Lunch', category: 'Staff Welfare', quantity: 1, unitPrice: '£120.00', total: '£120.00' }
      ]
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Mixed business expenses across different categories and departments.'
      }
    }
  }
};

export const EmptyLineItems: Story = {
  name: 'No Line Items',
  args: {
    schema: lineItemsTableSchema,
    data: {
      lineItems: []
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty state when no line items are available or have been processed yet.'
      }
    }
  }
}; 