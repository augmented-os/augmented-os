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

Complete receipt processing system with 3 core workflow states using form-based editing and enhanced supplier selection.

**Workflow States:**

**1. Edit Receipt Fields**
- Receipt details: All fields editable for data entry and correction
- **Supplier selection**: Searchable combobox with 20+ predefined suppliers + custom entry
- Line items: All fields editable except category (hidden during initial entry)

**2. Match Supplier** 
- Receipt details: All fields editable with supplier combobox highlighted
- **Enhanced matching**: Search through supplier database or add new suppliers instantly
- Line items: All fields editable except category (hidden during supplier matching)

**3. Assign Line Items**
- Receipt details: Form disabled (read-only) during categorization
- Line items: Only category fields editable, other fields disabled

**Key Features:**
- **🔍 Searchable Supplier Selection** - ComboboxInput with real-time search
- **📝 Custom Supplier Entry** - Add new suppliers not in the predefined list
- **⚠️ Smart Validation** - Warning states guide users through verification
- **📋 Comprehensive Database** - 20+ common business suppliers included
- **Form-based Editing** - Both tabs use proper forms with field-level control
- **Dynamic Field States** - Fields enabled/disabled based on workflow state
- **Category Assignment** - Selective editing for line item categorization
- **Template-based Titles** - Dynamic titles with data interpolation
- **Context-sensitive Actions** - Different action buttons per workflow state

**Supplier Options Include:**
- Technology: Adobe, Microsoft, GitHub, Slack, AWS, Google Cloud
- Business Tools: Atlassian, JetBrains, Figma, Notion, Zoom, Dropbox
- Office Supplies: TechSupplies Inc, Office Solutions Ltd, Business Depot
- Travel & Hospitality: Grand Hotel London
- Enterprise: Salesforce, Enterprise Supplies Co

**Technical Implementation:**
- Uses Dynamic Tabs component for tabbed interface
- ComboboxInput provides searchable supplier selection with custom value support
- Each tab contains form components with state-specific field configurations
- Schema-driven field enablement and validation
- Integration with existing Dynamic UI form primitives
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
      <div className="max-w-6xl mx-auto p-6">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof DynamicUIRenderer>;

// Helper to create receipt details form schema
const createReceiptDetailsSchema = (state: 'edit' | 'match' | 'assign'): UIComponentSchema => ({
  componentId: `receipt-details-${state}`,
  name: 'Receipt Details',
  componentType: 'Form',
  title: '',
  fields: [
    { 
      fieldKey: 'receiptNumber', 
      label: 'Receipt Number', 
      type: 'text',
      required: true,
      customProps: { disabled: state === 'assign' }
    },
    { 
      fieldKey: 'date', 
      label: 'Date', 
      type: 'date',
      required: true,
      customProps: { disabled: state === 'assign' }
    },
    { 
      fieldKey: 'supplier', 
      label: 'Supplier', 
      type: 'combobox',
      required: true,
      options: [
        { value: 'techsupplies-inc', label: 'TechSupplies Inc' },
        { value: 'office-solutions-ltd', label: 'Office Solutions Ltd' },
        { value: 'business-depot', label: 'Business Depot' },
        { value: 'enterprise-supplies', label: 'Enterprise Supplies Co' },
        { value: 'digital-services', label: 'Digital Services Group' },
        { value: 'grand-hotel-london', label: 'Grand Hotel London' },
        { value: 'tech-solutions-corp', label: 'Tech Solutions Corp' },
        { value: 'adobe-systems', label: 'Adobe Systems Inc' },
        { value: 'microsoft-corp', label: 'Microsoft Corporation' },
        { value: 'slack-technologies', label: 'Slack Technologies' },
        { value: 'amazon-web-services', label: 'Amazon Web Services' },
        { value: 'google-cloud', label: 'Google Cloud Platform' },
        { value: 'atlassian', label: 'Atlassian' },
        { value: 'jetbrains', label: 'JetBrains' },
        { value: 'github-inc', label: 'GitHub Inc' },
        { value: 'figma-inc', label: 'Figma Inc' },
        { value: 'notion-labs', label: 'Notion Labs Inc' },
        { value: 'zoom-video', label: 'Zoom Video Communications' },
        { value: 'dropbox-inc', label: 'Dropbox Inc' },
        { value: 'salesforce', label: 'Salesforce Inc' }
      ],
      placeholder: 'Select or search supplier...',
      customProps: {
        disabled: state === 'assign',
        warning: state === 'match',
        searchPlaceholder: 'Search suppliers...',
        emptyMessage: 'No suppliers found. You can type a new supplier name.',
        allowCustomValue: true
      },
      helpText: state === 'match' ? '⚠️ Please verify this supplier matches your records' : 'Select existing supplier or type a new one'
    },
    { 
      fieldKey: 'totalAmount', 
      label: 'Total Amount', 
      type: 'number',
      required: true,
      placeholder: '0.00',
      customProps: { disabled: state === 'assign' }
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
      required: true,
      customProps: { disabled: state === 'assign' }
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
      required: true,
      customProps: { disabled: state === 'assign' }
    }
  ],
  actions: []
});

// Helper to create line items form schema  
const createLineItemsSchema = (state: 'edit' | 'match' | 'assign'): UIComponentSchema => {
  const showCategory = state === 'assign';
  const categoryOnly = state === 'assign';
  
  const createLineItemFields = (index: number) => [
    { 
      fieldKey: `item${index}`, 
      label: `Item ${index + 1}`, 
      type: 'text' as const,
      required: true,
      customProps: { disabled: categoryOnly }
    },
    { 
      fieldKey: `quantity${index}`, 
      label: 'Qty', 
      type: 'number' as const,
      required: true,
      customProps: { disabled: categoryOnly }
    },
    { 
      fieldKey: `unitPrice${index}`, 
      label: 'Unit Price', 
      type: 'number' as const,
      required: true,
      placeholder: '0.00',
      customProps: { disabled: categoryOnly }
    },
    { 
      fieldKey: `total${index}`, 
      label: 'Total', 
      type: 'number' as const,
      required: true,
      placeholder: '0.00',
      customProps: { disabled: categoryOnly }
    },
    ...(showCategory ? [{ 
      fieldKey: `category${index}`, 
      label: 'Category', 
      type: 'select' as const,
      options: [
        { value: 'unassigned', label: 'Select category...' },
        { value: 'office-supplies', label: 'Office Supplies' },
        { value: 'software', label: 'Software & Licenses' },
        { value: 'travel', label: 'Travel & Accommodation' },
        { value: 'meals', label: 'Meals & Entertainment' },
        { value: 'equipment', label: 'Office Equipment' },
        { value: 'training', label: 'Training & Development' },
        { value: 'marketing', label: 'Marketing & Advertising' },
        { value: 'other', label: 'Other Business Expense' }
      ],
      required: true,
      helpText: 'Assign category for this line item',
      customProps: { warning: true }
    }] : [])
  ];

  return {
    componentId: `line-items-${state}`,
    name: 'Line Items',
    componentType: 'Form',
    title: '',
    layout: {
      sections: [
        {
          title: 'Line Item 1',
          fields: createLineItemFields(1).map(f => f.fieldKey),
          collapsible: false
        },
        {
          title: 'Line Item 2', 
          fields: createLineItemFields(2).map(f => f.fieldKey),
          collapsible: false
        },
        {
          title: 'Line Item 3',
          fields: createLineItemFields(3).map(f => f.fieldKey),
          collapsible: false
        }
      ]
    },
    fields: [
      ...createLineItemFields(1),
      ...createLineItemFields(2), 
      ...createLineItemFields(3)
    ],
    actions: []
  };
};

// Helper to create workflow schema
const createWorkflowSchema = (state: 'edit' | 'match' | 'assign'): UIComponentSchema => ({
  componentId: `receipt-workflow-${state}`,
  name: 'Process Receipt',
  componentType: 'Custom',
  title: state === 'edit' ? 'Edit Receipt from {{supplier}}' :
         state === 'match' ? 'Match Supplier - {{supplier}}' :
         'Assign Categories - {{supplier}}',
  customProps: {
    displayType: 'tabs',
    tabs: [
      {
        id: 'details',
        label: 'Receipt Details',
        badge: state === 'match' ? '!' : undefined,
        component: createReceiptDetailsSchema(state)
      },
      {
        id: 'line-items',
        label: 'Line Items',
        badge: state === 'assign' ? '3' : undefined,
        component: createLineItemsSchema(state)
      }
    ],
    defaultTab: state === 'match' ? 'details' : state === 'assign' ? 'line-items' : 'details'
  },
  actions: state === 'edit' ? [
    { actionKey: 'save', label: 'Save Changes', style: 'primary' },
    { actionKey: 'matchSupplier', label: 'Match Supplier', style: 'secondary' }
  ] : state === 'match' ? [
    { actionKey: 'back', label: 'Back to Edit', style: 'secondary' },
    { actionKey: 'confirmSupplier', label: 'Confirm Supplier', style: 'primary' },
    { actionKey: 'assignCategories', label: 'Assign Categories', style: 'secondary' }
  ] : [
    { actionKey: 'back', label: 'Back to Supplier', style: 'secondary' },
    { actionKey: 'saveCategories', label: 'Save Categories', style: 'primary' },
    { actionKey: 'approve', label: 'Approve Receipt', style: 'primary' }
  ]
});

export const EditReceiptFields: Story = {
  name: '1. Edit Receipt Fields',
  args: {
    schema: createWorkflowSchema('edit'),
    initialData: {
      // Receipt details
      receiptNumber: 'RCP-2024-001234',
      date: '2024-01-15',
      supplier: 'techsupplies-inc',
      totalAmount: 245.99,
      currency: 'GBP',
      paymentMethod: 'company-card',
      
      // Line items (no categories)
      item1: 'USB-C cables x3',
      quantity1: 3,
      unitPrice1: 12.00,
      total1: 36.00,
      
      item2: 'Wireless Mouse',
      quantity2: 1,
      unitPrice2: 25.00,
      total2: 25.00,
      
      item3: '1TB NVMe SSD',
      quantity3: 1,
      unitPrice3: 150.00,
      total3: 150.00
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Initial receipt editing state - all fields editable, no categories shown for line items. Supplier field now searchable with predefined options.'
      }
    }
  }
};

export const MatchSupplier: Story = {
  name: '2. Match Supplier',
  args: {
    schema: createWorkflowSchema('match'),
    initialData: {
      // Receipt details (supplier highlighted)
      receiptNumber: 'RCP-2024-001567',
      date: '2024-01-20',
      supplier: 'tech-solutions-corp',
      totalAmount: 2850.00,
      currency: 'GBP',
      paymentMethod: 'bank-transfer',
      
      // Line items (still no categories)
      item1: 'Adobe Creative Suite Annual License',
      quantity1: 1,
      unitPrice1: 599.99,
      total1: 599.99,
      
      item2: 'Microsoft Office 365 Business (3 users)',
      quantity2: 1,
      unitPrice2: 189.99,
      total2: 189.99,
      
      item3: 'Slack Pro Plan (Annual)',
      quantity3: 1,
      unitPrice3: 84.00,
      total3: 84.00
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Supplier matching state - supplier combobox highlighted for verification with search capability. Users can search through supplier list or type new names.',
      },
    },
  },
};

export const AssignLineItems: Story = {
  name: '3. Assign Line Items',
  args: {
    schema: createWorkflowSchema('assign'),
    initialData: {
      // Receipt details (disabled/read-only)
      receiptNumber: 'RCP-2024-001890',
      date: '2024-01-22',
      supplier: 'grand-hotel-london',
      totalAmount: 387.50,
      currency: 'GBP',
      paymentMethod: 'personal-card',
      
      // Line items (only categories editable)
      item1: 'Hotel Accommodation (2 nights)',
      quantity1: 2,
      unitPrice1: 125.00,
      total1: 250.00,
      category1: 'unassigned',
      
      item2: 'Business Dinner',
      quantity2: 1,
      unitPrice2: 85.50,
      total2: 85.50,
      category2: 'unassigned',
      
      item3: 'Taxi to Airport',
      quantity3: 1,
      unitPrice3: 35.00,
      total3: 35.00,
      category3: 'unassigned'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Category assignment state - receipt details read-only with supplier locked during categorization. Line items tab badged with count.',
      },
    },
  },
}; 