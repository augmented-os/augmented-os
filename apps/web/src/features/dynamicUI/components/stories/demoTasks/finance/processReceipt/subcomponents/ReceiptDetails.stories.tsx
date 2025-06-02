import type { Meta, StoryObj } from '@storybook/react';
import { DynamicUIRenderer } from '../../../../../DynamicUIRenderer';
import { UIComponentSchema } from '../../../../../../types/schemas';

const meta: Meta<typeof DynamicUIRenderer> = {
  title: 'Demo Tasks/Finance/Process Receipt/Subcomponents/Receipt Details',
  component: DynamicUIRenderer,
  parameters: {
    docs: {
      description: {
        component: `
# Receipt Details Form Component

Editable form for receipt information in the receipt processing workflow.

**Features:**
- Form-based receipt editing
- Conditional field highlighting
- State-dependent editability
- Receipt metadata management

**Workflow States:**
- **Edit Receipt Fields**: All fields editable for initial data entry
- **Match Supplier**: Supplier field highlighted for verification
- **Assign Line Items**: Form disabled (read-only) during categorization

**Use Cases:**
- Receipt data entry and editing
- Supplier matching workflow
- Read-only review during line item assignment
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
      <div className="max-w-2xl mx-auto p-6">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof DynamicUIRenderer>;

// Base form schema for receipt details
const receiptDetailsFormSchema: UIComponentSchema = {
  componentId: 'receipt-details-form',
  name: 'Receipt Details Form',
  componentType: 'Form',
  title: 'Receipt Information',
  fields: [
    { 
      fieldKey: 'receiptNumber', 
      label: 'Receipt Number', 
      type: 'text',
      required: true,
      helpText: 'Unique identifier for this receipt'
    },
    { 
      fieldKey: 'date', 
      label: 'Date', 
      type: 'date',
      required: true 
    },
    { 
      fieldKey: 'supplier', 
      label: 'Supplier', 
      type: 'text',
      required: true,
      helpText: 'Company or individual that issued the receipt'
    },
    { 
      fieldKey: 'category', 
      label: 'Category', 
      type: 'select',
      options: [
        { value: 'office-supplies', label: 'Office Supplies' },
        { value: 'software', label: 'Software & Licenses' },
        { value: 'travel', label: 'Travel & Accommodation' },
        { value: 'meals', label: 'Meals & Entertainment' },
        { value: 'equipment', label: 'Office Equipment' },
        { value: 'training', label: 'Training & Development' },
        { value: 'marketing', label: 'Marketing & Advertising' },
        { value: 'other', label: 'Other Business Expense' }
      ],
      required: true
    },
    { 
      fieldKey: 'totalAmount', 
      label: 'Total Amount', 
      type: 'number',
      required: true,
      placeholder: '0.00'
    },
    { 
      fieldKey: 'currency', 
      label: 'Currency', 
      type: 'select',
      options: [
        { value: 'GBP', label: 'GBP (£)' },
        { value: 'USD', label: 'USD ($)' },
        { value: 'EUR', label: 'EUR (€)' }
      ],
      default: 'GBP',
      required: true
    },
    { 
      fieldKey: 'paymentMethod', 
      label: 'Payment Method', 
      type: 'select',
      options: [
        { value: 'company-card', label: 'Company Credit Card' },
        { value: 'personal-card', label: 'Personal Card (Reimbursable)' },
        { value: 'bank-transfer', label: 'Bank Transfer' },
        { value: 'cash', label: 'Cash' },
        { value: 'other', label: 'Other' }
      ],
      required: true
    },
    { 
      fieldKey: 'submittedBy', 
      label: 'Submitted By', 
      type: 'text',
      required: true 
    },
    { 
      fieldKey: 'submissionDate', 
      label: 'Submission Date', 
      type: 'date',
      required: true 
    },
    { 
      fieldKey: 'notes', 
      label: 'Notes', 
      type: 'textarea',
      placeholder: 'Additional notes or comments about this receipt...',
      helpText: 'Optional notes for reviewers or additional context'
    }
  ],
  actions: [
    { actionKey: 'save', label: 'Save Changes', style: 'primary' },
    { actionKey: 'cancel', label: 'Cancel', style: 'secondary' }
  ]
};

export const EditReceiptFields: Story = {
  name: 'Edit Receipt Fields',
  args: {
    schema: receiptDetailsFormSchema,
    initialData: {
      receiptNumber: 'RCP-2024-001234',
      date: '2024-01-15',
      supplier: 'Office Supplies Ltd',
      category: 'office-supplies',
      totalAmount: 245.67,
      currency: 'GBP',
      paymentMethod: 'company-card',
      submittedBy: 'John Smith',
      submissionDate: '2024-01-16',
      notes: 'Monthly office supplies order for the development team.'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Fully editable form for initial receipt data entry and editing.'
      }
    }
  }
};

export const MatchSupplier: Story = {
  name: 'Match Supplier',
  args: {
    schema: {
      ...receiptDetailsFormSchema,
      title: 'Match Supplier - Receipt Information',
      fields: receiptDetailsFormSchema.fields?.map(field => {
        if (field.fieldKey === 'supplier') {
          return {
            ...field,
            helpText: '⚠️ Please verify this supplier matches your records',
            customProps: { warning: true }
          };
        }
        return field;
      })
    },
    initialData: {
      receiptNumber: 'RCP-2024-001567',
      date: '2024-01-20',
      supplier: 'Tech Solutions Corp',
      category: 'software',
      totalAmount: 2850.00,
      currency: 'GBP',
      paymentMethod: 'bank-transfer',
      submittedBy: 'Sarah Johnson',
      submissionDate: '2024-01-20',
      notes: 'Annual software license renewal - requires supplier verification.'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Form with supplier field highlighted for verification and matching.'
      }
    }
  }
};

export const AssignLineItems: Story = {
  name: 'Assign Line Items',
  args: {
    schema: {
      ...receiptDetailsFormSchema,
      title: 'Receipt Information (Read-Only)',
      fields: receiptDetailsFormSchema.fields?.map(field => ({
        ...field,
        customProps: { disabled: true }
      })),
      actions: [
        { actionKey: 'back', label: 'Back to Line Items', style: 'secondary' },
        { actionKey: 'continue', label: 'Continue', style: 'primary' }
      ]
    },
    initialData: {
      receiptNumber: 'RCP-2024-001890',
      date: '2024-01-22',
      supplier: 'Grand Hotel London',
      category: 'travel',
      totalAmount: 387.50,
      currency: 'GBP',
      paymentMethod: 'personal-card',
      submittedBy: 'Mike Davis',
      submissionDate: '2024-01-25',
      notes: 'Business trip accommodation for client meeting in London.'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Read-only form state during line item categorization workflow.'
      }
    }
  }
}; 