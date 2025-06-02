import type { Meta, StoryObj } from '@storybook/react';
import { DynamicUIRenderer } from '../../../../../DynamicUIRenderer';
import { UIComponentSchema } from '../../../../../../types/schemas';

const meta: Meta<typeof DynamicUIRenderer> = {
  title: 'Demo Tasks/Finance/Process Receipt/Subcomponents/Line Items Form',
  component: DynamicUIRenderer,
  parameters: {
    docs: {
      description: {
        component: `
# Line Items Form Component

Editable form for receipt line items with workflow-specific field states.

**Features:**
- Form-based line item editing
- Dynamic field enablement based on workflow state
- Category assignment functionality
- Quantity, price, and total management

**Workflow States:**
- **Edit Receipt Fields**: All fields editable except category (hidden)
- **Match Supplier**: All fields editable except category (hidden)  
- **Assign Line Items**: Only category fields editable, other fields disabled

**Use Cases:**
- Line item data entry and editing
- Category assignment workflow
- Read-only review with selective editing
        `
      }
    },
    layout: 'padded'
  },
  argTypes: {
    onSubmit: { action: 'form submitted' },
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
type Story = StoryObj<typeof DynamicUIRenderer>;

// Helper to create line item fields
const createLineItemFields = (index: number, showCategory: boolean = false, categoryOnly: boolean = false) => [
  { 
    fieldKey: `lineItem${index}_item`, 
    label: `Item ${index + 1}`, 
    type: 'text' as const,
    required: true,
    customProps: { disabled: categoryOnly }
  },
  { 
    fieldKey: `lineItem${index}_quantity`, 
    label: 'Qty', 
    type: 'number' as const,
    required: true,
    customProps: { disabled: categoryOnly }
  },
  { 
    fieldKey: `lineItem${index}_unitPrice`, 
    label: 'Unit Price', 
    type: 'number' as const,
    required: true,
    placeholder: '0.00',
    customProps: { disabled: categoryOnly }
  },
  { 
    fieldKey: `lineItem${index}_total`, 
    label: 'Total', 
    type: 'number' as const,
    required: true,
    placeholder: '0.00',
    customProps: { disabled: categoryOnly }
  },
  ...(showCategory ? [{ 
    fieldKey: `lineItem${index}_category`, 
    label: 'Category', 
    type: 'select' as const,
    options: [
      { value: 'unassigned', label: 'Select category...' },
      { value: 'office-supplies', label: 'Office Supplies' },
      { value: 'software', label: 'Software & Licenses' },
      { value: 'travel', label: 'Travel & Accommodation' },
      { value: 'meals', label: 'Entertainment' },
      { value: 'equipment', label: 'Office Equipment' },
      { value: 'training', label: 'Training & Development' },
      { value: 'marketing', label: 'Marketing & Advertising' },
      { value: 'other', label: 'Other Business Expense' }
    ],
    required: true,
    helpText: categoryOnly ? 'Assign category for this line item' : undefined,
    customProps: { warning: categoryOnly }
  }] : [])
];

// Base schema for line items form
const createLineItemsFormSchema = (showCategory: boolean = false, categoryOnly: boolean = false): UIComponentSchema => ({
  componentId: 'line-items-form',
  name: 'Line Items Form',
  componentType: 'Form',
  title: 'Receipt Line Items',
  layout: {
    sections: [
      {
        title: 'Line Item 1',
        fields: createLineItemFields(0, showCategory, categoryOnly).map(f => f.fieldKey),
        collapsible: false
      },
      {
        title: 'Line Item 2', 
        fields: createLineItemFields(1, showCategory, categoryOnly).map(f => f.fieldKey),
        collapsible: false
      },
      {
        title: 'Line Item 3',
        fields: createLineItemFields(2, showCategory, categoryOnly).map(f => f.fieldKey),
        collapsible: false
      }
    ]
  },
  fields: [
    ...createLineItemFields(0, showCategory, categoryOnly),
    ...createLineItemFields(1, showCategory, categoryOnly), 
    ...createLineItemFields(2, showCategory, categoryOnly)
  ],
  actions: [
    { actionKey: 'addItem', label: 'Add Line Item', style: 'secondary' },
    { actionKey: 'save', label: 'Save Changes', style: 'primary' },
    { actionKey: 'cancel', label: 'Cancel', style: 'secondary' }
  ]
});

export const EditReceiptFields: Story = {
  name: 'Edit Receipt Fields - Line Items',
  args: {
    schema: createLineItemsFormSchema(false, false),
    initialData: {
      lineItem0_item: 'Printer Paper A4 (500 sheets)',
      lineItem0_quantity: 3,
      lineItem0_unitPrice: 8.99,
      lineItem0_total: 26.97,
      
      lineItem1_item: 'Blue Ink Pens (Pack of 12)',
      lineItem1_quantity: 2,
      lineItem1_unitPrice: 4.50,
      lineItem1_total: 9.00,
      
      lineItem2_item: 'Desk Organizer Tray',
      lineItem2_quantity: 1,
      lineItem2_unitPrice: 15.99,
      lineItem2_total: 15.99
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Fully editable line items form without category fields. Used during initial receipt data entry.'
      }
    }
  }
};

export const MatchSupplier: Story = {
  name: 'Match Supplier - Line Items',
  args: {
    schema: createLineItemsFormSchema(false, false),
    initialData: {
      lineItem0_item: 'Adobe Creative Suite Annual License',
      lineItem0_quantity: 1,
      lineItem0_unitPrice: 599.99,
      lineItem0_total: 599.99,
      
      lineItem1_item: 'Microsoft Office 365 Business (3 users)',
      lineItem1_quantity: 1,
      lineItem1_unitPrice: 189.99,
      lineItem1_total: 189.99,
      
      lineItem2_item: 'Slack Pro Plan (Annual)',
      lineItem2_quantity: 1,
      lineItem2_unitPrice: 84.00,
      lineItem2_total: 84.00
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Line items form during supplier matching - same as edit mode with no categories shown.'
      }
    }
  }
};

export const AssignLineItems: Story = {
  name: 'Assign Line Items - Category Assignment',
  args: {
    schema: {
      ...createLineItemsFormSchema(true, true),
      title: 'Assign Categories to Line Items',
      actions: [
        { actionKey: 'back', label: 'Back to Receipt', style: 'secondary' },
        { actionKey: 'saveCategories', label: 'Save Categories', style: 'primary' },
        { actionKey: 'skip', label: 'Skip for Now', style: 'secondary' }
      ]
    },
    initialData: {
      lineItem0_item: 'Hotel Accommodation (2 nights)',
      lineItem0_quantity: 2,
      lineItem0_unitPrice: 125.00,
      lineItem0_total: 250.00,
      lineItem0_category: 'unassigned',
      
      lineItem1_item: 'Business Dinner',
      lineItem1_quantity: 1,
      lineItem1_unitPrice: 85.50,
      lineItem1_total: 85.50,
      lineItem1_category: 'unassigned',
      
      lineItem2_item: 'Taxi to Airport',
      lineItem2_quantity: 1,
      lineItem2_unitPrice: 35.00,
      lineItem2_total: 35.00,
      lineItem2_category: 'unassigned'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Category assignment mode - only category fields are editable, other fields are read-only.'
      }
    }
  }
};

export const EmptyLineItems: Story = {
  name: 'Empty Line Items Form',
  args: {
    schema: {
      ...createLineItemsFormSchema(false, false),
      title: 'Add Line Items',
      fields: [
        { 
          fieldKey: 'item1', 
          label: 'Item Description', 
          type: 'text',
          placeholder: 'Enter item description...',
          required: true
        },
        { 
          fieldKey: 'quantity1', 
          label: 'Quantity', 
          type: 'number',
          placeholder: '1',
          required: true
        },
        { 
          fieldKey: 'unitPrice1', 
          label: 'Unit Price', 
          type: 'number',
          placeholder: '0.00',
          required: true
        }
      ],
      layout: undefined,
      actions: [
        { actionKey: 'addItem', label: 'Add Another Item', style: 'secondary' },
        { actionKey: 'save', label: 'Save Line Items', style: 'primary' }
      ]
    },
    initialData: {}
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty form state for adding new line items from scratch.'
      }
    }
  }
}; 