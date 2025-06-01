import type { Meta, StoryObj } from '@storybook/react';
import { DynamicTabs } from './DynamicTabs';
import { UIComponentSchema } from '../../types/schemas';

const meta: Meta<typeof DynamicTabs> = {
  title: 'Components/Atomic Components/Display Components/Dynamic Tabs',
  component: DynamicTabs,
  parameters: {
    docs: {
      description: {
        component: `
# Dynamic Tabs Component

A flexible tabs component that integrates with the Dynamic UI system, allowing for schema-driven tabbed interfaces with various content types.

**Features:**
- Schema-driven tab configuration
- Support for badges on tabs
- Multiple content display types (form, table, display)
- Template-based titles with data interpolation
- Action buttons with conditional visibility
- Integration with existing UI primitives

**Use Cases:**
- Multi-section forms
- Data viewing with different perspectives
- Workflow interfaces with step-by-step navigation
- Complex data displays requiring organization
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
type Story = StoryObj<typeof DynamicTabs>;

// Basic form and display tabs
const basicTabsSchema: UIComponentSchema = {
  componentId: 'basic-tabs-demo',
  name: 'Basic Tabs',
  componentType: 'Custom',
  title: 'User Profile Management',
  customProps: {
    displayType: 'tabs',
    tabs: [
      {
        id: 'personal',
        label: 'Personal Info',
        component: {
          componentId: 'personal-info-tab',
          name: 'Personal Information',
          componentType: 'Display',
          title: '',
          customProps: {
            displayType: 'form',
            fields: [
              { key: 'firstName', label: 'First Name', type: 'text' },
              { key: 'lastName', label: 'Last Name', type: 'text' },
              { key: 'email', label: 'Email Address', type: 'email' },
              { key: 'phone', label: 'Phone Number', type: 'text' },
              { key: 'birthDate', label: 'Date of Birth', type: 'date' }
            ]
          },
          actions: []
        }
      },
      {
        id: 'preferences',
        label: 'Preferences',
        component: {
          componentId: 'preferences-tab',
          name: 'User Preferences',
          componentType: 'Display',
          title: '',
          customProps: {
            displayType: 'form',
            fields: [
              { key: 'theme', label: 'Theme', type: 'select' },
              { key: 'notifications', label: 'Email Notifications', type: 'boolean' },
              { key: 'language', label: 'Language', type: 'select' },
              { key: 'timezone', label: 'Timezone', type: 'select' }
            ]
          },
          actions: []
        }
      }
    ],
    defaultTab: 'personal'
  },
  actions: [
    { actionKey: 'save', label: 'Save Changes', style: 'primary' },
    { actionKey: 'cancel', label: 'Cancel', style: 'secondary' }
  ]
};

export const BasicTabs: Story = {
  name: 'Basic Tabs',
  args: {
    schema: basicTabsSchema,
    data: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      birthDate: '1990-05-15',
      theme: 'dark',
      notifications: true,
      language: 'en',
      timezone: 'UTC'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Basic tabs demonstration with form-style content in each tab.'
      }
    }
  }
};

// Tabs with badges and table content
const dataViewTabsSchema: UIComponentSchema = {
  componentId: 'data-view-tabs-demo',
  name: 'Data View Tabs',
  componentType: 'Custom',
  title: 'Order #{{orderNumber}} - {{customerName}}',
  customProps: {
    displayType: 'tabs',
    tabs: [
      {
        id: 'summary',
        label: 'Summary',
        badge: '!',
        component: {
          componentId: 'order-summary-tab',
          name: 'Order Summary',
          componentType: 'Display',
          title: '',
          customProps: {
            displayType: 'form',
            fields: [
              { key: 'orderNumber', label: 'Order Number', type: 'text' },
              { key: 'customerName', label: 'Customer', type: 'text' },
              { key: 'orderDate', label: 'Order Date', type: 'date' },
              { key: 'status', label: 'Status', type: 'text' },
              { key: 'totalAmount', label: 'Total Amount', type: 'text' },
              { key: 'shippingAddress', label: 'Shipping Address', type: 'text' }
            ]
          },
          actions: []
        }
      },
      {
        id: 'items',
        label: 'Items',
        badge: '3',
        component: {
          componentId: 'order-items-tab',
          name: 'Order Items',
          componentType: 'Display',
          title: '',
          customProps: {
            displayType: 'table',
            fields: [
              { key: 'product', label: 'Product' },
              { key: 'sku', label: 'SKU' },
              { key: 'quantity', label: 'Qty' },
              { key: 'unitPrice', label: 'Unit Price' },
              { key: 'totalPrice', label: 'Total' }
            ]
          },
          actions: []
        }
      },
      {
        id: 'history',
        label: 'History',
        component: {
          componentId: 'order-history-tab',
          name: 'Order History',
          componentType: 'Display',
          title: '',
          customProps: {
            displayType: 'table',
            fields: [
              { key: 'timestamp', label: 'Date/Time' },
              { key: 'action', label: 'Action' },
              { key: 'user', label: 'User' },
              { key: 'notes', label: 'Notes' }
            ]
          },
          actions: []
        }
      }
    ],
    defaultTab: 'summary'
  },
  actions: [
    { actionKey: 'fulfill', label: 'Fulfill Order', style: 'primary' },
    { actionKey: 'cancel_order', label: 'Cancel Order', style: 'danger' },
    { actionKey: 'contact_customer', label: 'Contact Customer', style: 'secondary' }
  ]
};

export const DataViewTabs: Story = {
  name: 'Data View with Badges',
  args: {
    schema: dataViewTabsSchema,
    data: {
      orderNumber: 'ORD-2024-001234',
      customerName: 'Alice Johnson',
      orderDate: '2024-01-15',
      status: 'Processing',
      totalAmount: '$234.97',
      shippingAddress: '123 Main St, Anytown, AT 12345',
      
      lineItems: [
        { product: 'Wireless Headphones', sku: 'WH-1000XM4', quantity: 1, unitPrice: '$199.99', totalPrice: '$199.99' },
        { product: 'Phone Case', sku: 'PC-CLEAR-X', quantity: 2, unitPrice: '$14.99', totalPrice: '$29.98' },
        { product: 'Charging Cable', sku: 'CC-USB-C', quantity: 1, unitPrice: '$4.99', totalPrice: '$4.99' }
      ],
      
      historyItems: [
        { timestamp: '2024-01-15 14:30', action: 'Order Placed', user: 'Customer', notes: 'Online order via website' },
        { timestamp: '2024-01-15 14:32', action: 'Payment Confirmed', user: 'System', notes: 'Credit card payment processed' },
        { timestamp: '2024-01-15 15:15', action: 'Order Reviewed', user: 'Sarah M.', notes: 'Inventory check completed' }
      ]
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Tabs with badges showing order management interface with summary, items table, and history.'
      }
    }
  }
};

// Workflow tabs with conditional actions
const workflowTabsSchema: UIComponentSchema = {
  componentId: 'workflow-tabs-demo',
  name: 'Workflow Tabs',
  componentType: 'Custom',
  title: 'Document Review - {{documentName}}',
  customProps: {
    displayType: 'tabs',
    tabs: [
      {
        id: 'document',
        label: 'Document',
        component: {
          componentId: 'document-tab',
          name: 'Document Details',
          componentType: 'Display',
          title: '',
          customProps: {
            displayType: 'form',
            fields: [
              { key: 'documentName', label: 'Document Name', type: 'text' },
              { key: 'documentType', label: 'Document Type', type: 'text' },
              { key: 'uploadedBy', label: 'Uploaded By', type: 'text' },
              { key: 'uploadDate', label: 'Upload Date', type: 'date' },
              { key: 'fileSize', label: 'File Size', type: 'text' },
              { key: 'status', label: 'Status', type: 'text' }
            ]
          },
          actions: []
        }
      },
      {
        id: 'review',
        label: 'Review',
        component: {
          componentId: 'review-tab',
          name: 'Review Details',
          componentType: 'Display',
          title: '',
          customProps: {
            displayType: 'form',
            fields: [
              { key: 'reviewStatus', label: 'Review Status', type: 'select' },
              { key: 'assignedReviewer', label: 'Assigned Reviewer', type: 'text' },
              { key: 'reviewComments', label: 'Review Comments', type: 'text' },
              { key: 'reviewDate', label: 'Review Date', type: 'date' },
              { key: 'priority', label: 'Priority', type: 'select' }
            ]
          },
          actions: []
        }
      }
    ],
    defaultTab: 'document'
  },
  actions: [
    { actionKey: 'approve', label: 'Approve', style: 'primary', visibleIf: 'status === "pending_review"' },
    { actionKey: 'reject', label: 'Reject', style: 'danger', visibleIf: 'status === "pending_review"' },
    { actionKey: 'request_changes', label: 'Request Changes', style: 'secondary', visibleIf: 'status === "pending_review"' },
    { actionKey: 'resubmit', label: 'Resubmit', style: 'primary', visibleIf: 'status === "rejected"' },
    { actionKey: 'archive', label: 'Archive', style: 'secondary', visibleIf: 'status === "approved"' }
  ]
};

export const WorkflowTabs: Story = {
  name: 'Workflow with Conditional Actions',
  args: {
    schema: workflowTabsSchema,
    data: {
      documentName: 'Project Requirements.pdf',
      documentType: 'Requirements Document',
      uploadedBy: 'John Smith',
      uploadDate: '2024-01-10',
      fileSize: '2.4 MB',
      status: 'pending_review',
      reviewStatus: 'In Progress',
      assignedReviewer: 'Emily Davis',
      reviewComments: '',
      reviewDate: '',
      priority: 'High'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Workflow tabs showing conditional action buttons based on document status.'
      }
    }
  }
};

// Minimal tabs configuration
const minimalTabsSchema: UIComponentSchema = {
  componentId: 'minimal-tabs-demo',
  name: 'Minimal Tabs',
  componentType: 'Custom',
  title: 'Settings',
  customProps: {
    displayType: 'tabs',
    tabs: [
      {
        id: 'general',
        label: 'General',
        component: {
          componentId: 'general-tab',
          name: 'General Settings',
          componentType: 'Display',
          title: '',
          customProps: {
            displayType: 'form',
            fields: [
              { key: 'appName', label: 'Application Name', type: 'text' },
              { key: 'description', label: 'Description', type: 'text' }
            ]
          },
          actions: []
        }
      },
      {
        id: 'advanced',
        label: 'Advanced',
        component: {
          componentId: 'advanced-tab',
          name: 'Advanced Settings',
          componentType: 'Display',
          title: '',
          customProps: {
            displayType: 'form',
            fields: [
              { key: 'debugMode', label: 'Debug Mode', type: 'boolean' },
              { key: 'logLevel', label: 'Log Level', type: 'select' }
            ]
          },
          actions: []
        }
      }
    ],
    defaultTab: 'general'
  },
  actions: []
};

export const MinimalTabs: Story = {
  name: 'Minimal Configuration',
  args: {
    schema: minimalTabsSchema,
    data: {
      appName: 'My Application',
      description: 'A sample application for demonstration',
      debugMode: false,
      logLevel: 'info'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Minimal tabs configuration without badges or action buttons.'
      }
    }
  }
};

// Error state - no tabs configured
const errorTabsSchema: UIComponentSchema = {
  componentId: 'error-tabs-demo',
  name: 'Error Tabs',
  componentType: 'Custom',
  title: 'Configuration Error',
  customProps: {
    displayType: 'tabs',
    tabs: [], // Empty tabs array to trigger error state
    defaultTab: ''
  },
  actions: []
};

export const ErrorState: Story = {
  name: 'Error State - No Tabs',
  args: {
    schema: errorTabsSchema,
    data: {}
  },
  parameters: {
    docs: {
      description: {
        story: 'Error state displayed when no tabs are configured in the schema.'
      }
    }
  }
}; 