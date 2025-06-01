import type { Meta, StoryObj } from '@storybook/react';
import { DynamicDisplay } from './DynamicDisplay';
import type { UIComponentSchema } from '../types/schemas';

const meta: Meta<typeof DynamicDisplay> = {
  title: 'Components/Composite Components/Dynamic Display',
  component: DynamicDisplay,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'The main DynamicDisplay component that renders UI based on schema configuration. Supports various display types including tables, cards, forms, and custom layouts.',
      },
    },
  },
  argTypes: {
    schema: {
      control: 'object',
      description: 'UI component schema defining the structure and behavior',
    },
    componentId: {
      control: 'text',
      description: 'Optional component ID for schema lookup',
    },
    data: {
      control: 'object',
      description: 'Data object to be displayed',
    },
    onAction: {
      action: 'action-triggered',
      description: 'Callback function for handling actions',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes for custom styling',
    },
  },
};

export default meta;
type Story = StoryObj<typeof DynamicDisplay>;

// Sample data for stories
const sampleUserData = {
  id: 1,
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@company.com',
  phone: '+1 (555) 123-4567',
  department: 'Engineering',
  role: 'Senior Developer',
  status: 'Active',
  startDate: '2022-03-15',
  salary: 95000,
};

const sampleTableData = [
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active', department: 'Engineering' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Inactive', department: 'Product' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'Pending', department: 'Sales' },
];

const sampleProjectData = {
  project: {
    name: 'Dynamic UI Framework',
    status: 'In Progress',
    priority: 'High',
    budget: 150000,
    completion: 75,
    team: 'Frontend Engineering',
  },
  tasks: [
    { id: 1, title: 'Component Architecture', status: 'Completed', assignee: 'John Doe' },
    { id: 2, title: 'Storybook Integration', status: 'In Progress', assignee: 'Jane Smith' },
    { id: 3, title: 'Testing Framework', status: 'Pending', assignee: 'Bob Johnson' },
  ],
};

export const TableDisplay: Story = {
  args: {
    schema: {
      componentId: 'user-table',
      name: 'User Table',
      componentType: 'Display',
      title: 'User Management',
      customProps: {
        displayType: 'table',
        dataKey: 'users',
        columns: [
          { key: 'id', label: 'ID', width: 'w-20' },
          { key: 'name', label: 'Name', width: 'w-1/3' },
          { key: 'email', label: 'Email', width: 'w-1/3' },
          { key: 'status', label: 'Status', width: 'w-1/4' },
        ],
      },
    } as UIComponentSchema,
    data: { users: sampleTableData },
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates table display using schema configuration. The data is passed under the "users" key.',
      },
    },
  },
};

export const CardDisplay: Story = {
  args: {
    schema: {
      componentId: 'user-card',
      name: 'User Card',
      componentType: 'Display',
      title: 'User Profile',
      customProps: {
        displayType: 'card',
        fields: [
          { key: 'firstName', label: 'First Name' },
          { key: 'lastName', label: 'Last Name' },
          { key: 'email', label: 'Email' },
          { key: 'department', label: 'Department' },
          { key: 'role', label: 'Role' },
          { key: 'status', label: 'Status' },
        ],
        layout: 'grid',
      },
    } as UIComponentSchema,
    data: sampleUserData,
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates card display using schema configuration with grid layout.',
      },
    },
  },
};

export const FormDisplay: Story = {
  args: {
    schema: {
      componentId: 'user-form',
      name: 'User Form',
      componentType: 'Form',
      title: 'Edit User',
      fields: [
        { fieldKey: 'firstName', label: 'First Name', type: 'text', required: true },
        { fieldKey: 'lastName', label: 'Last Name', type: 'text', required: true },
        { fieldKey: 'email', label: 'Email', type: 'email', required: true },
        { fieldKey: 'department', label: 'Department', type: 'select', options: [
          { value: 'engineering', label: 'Engineering' },
          { value: 'product', label: 'Product' },
          { value: 'sales', label: 'Sales' },
        ]},
        { fieldKey: 'status', label: 'Status', type: 'select', options: [
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' },
        ]},
      ],
      actions: [
        { actionKey: 'save', label: 'Save Changes', style: 'primary' },
        { actionKey: 'cancel', label: 'Cancel', style: 'secondary' },
      ],
    } as UIComponentSchema,
    data: sampleUserData,
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates form display using schema configuration with form fields and actions.',
      },
    },
  },
};

export const GridLayout: Story = {
  args: {
    schema: {
      componentId: 'project-dashboard',
      name: 'Project Dashboard',
      componentType: 'Display',
      title: 'Project Overview (Grid Layout Demo)',
      customProps: {
        displayType: 'card',
        fields: [
          { key: 'name', label: 'Project Name' },
          { key: 'status', label: 'Status' },
          { key: 'priority', label: 'Priority' },
          { key: 'budget', label: 'Budget' },
          { key: 'completion', label: 'Completion' },
        ],
        layout: 'grid',
      },
    } as UIComponentSchema,
    data: sampleProjectData.project,
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates a card display that could be part of a larger grid layout. In a real application, this would use layout.type: "grid" with multiple component areas.',
      },
    },
  },
};

export const SingleLayout: Story = {
  args: {
    schema: {
      componentId: 'simple-display',
      name: 'Simple Display',
      componentType: 'Display',
      title: 'User Information',
      customProps: {
        displayType: 'card',
        fields: [
          { key: 'firstName', label: 'First Name' },
          { key: 'lastName', label: 'Last Name' },
          { key: 'email', label: 'Email' },
          { key: 'department', label: 'Department' },
          { key: 'status', label: 'Status' },
        ],
        layout: 'list',
      },
    } as UIComponentSchema,
    data: sampleUserData,
    className: 'max-w-2xl mx-auto',
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates a single component display with custom styling. Shows list layout for card fields.',
      },
    },
  },
};

export const ConditionalLayout: Story = {
  args: {
    schema: {
      componentId: 'conditional-display',
      name: 'Conditional Display',
      componentType: 'Display',
      title: 'Dynamic Content',
      customProps: {
        displayType: 'card',
        fields: [
          { key: 'firstName', label: 'First Name' },
          { key: 'lastName', label: 'Last Name' },
          { key: 'email', label: 'Email' },
          { key: 'status', label: 'Status' },
        ],
        layout: 'grid',
      },
    } as UIComponentSchema,
    data: sampleUserData,
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates conditional display capabilities. In a real application, this would show/hide based on data conditions.',
      },
    },
  },
};

export const TableWithCustomRendering: Story = {
  args: {
    schema: {
      componentId: 'enhanced-table',
      name: 'Enhanced Table',
      componentType: 'Display',
      title: 'Employee Directory',
      customProps: {
        displayType: 'table',
        dataKey: 'employees',
        columns: [
          { key: 'id', label: 'ID', width: 'w-20' },
          { key: 'name', label: 'Name', width: 'w-1/4' },
          { key: 'email', label: 'Email', width: 'w-1/3' },
          { key: 'department', label: 'Department', width: 'w-1/6' },
          { key: 'status', label: 'Status', width: 'w-1/6', render: 'status-badge' },
        ],
        flagConfig: {
          field: 'status',
          badgeConfigs: {
            'Active': { class: 'bg-green-100 text-green-800', text: 'Active' },
            'Inactive': { class: 'bg-red-100 text-red-800', text: 'Inactive' },
            'Pending': { class: 'bg-yellow-100 text-yellow-800', text: 'Pending' },
          },
        },
      },
    } as UIComponentSchema,
    data: { employees: sampleTableData },
  },
};

export const TableWithRowStyling: Story = {
  args: {
    schema: {
      componentId: 'styled-table',
      name: 'Styled Table',
      componentType: 'Display',
      title: 'User Status Overview',
      customProps: {
        displayType: 'table',
        dataKey: 'users',
        columns: [
          { key: 'name', label: 'Name', width: 'w-1/3' },
          { key: 'email', label: 'Email', width: 'w-1/3' },
          { key: 'department', label: 'Department', width: 'w-1/6' },
          { key: 'status', label: 'Status', width: 'w-1/6' },
        ],
        flagConfig: {
          field: 'status',
          styles: {
            'Inactive': 'bg-red-50',
            'Active': 'bg-green-50',
            'Pending': 'bg-yellow-50',
          },
        },
      },
    } as UIComponentSchema,
    data: { users: sampleTableData },
  },
};

export const TemplateDisplay: Story = {
  args: {
    schema: {
      componentId: 'template-display',
      name: 'Template Display',
      componentType: 'Display',
      title: 'User Summary',
      displayTemplate: 'Welcome {{firstName}} {{lastName}}! You are in the {{department}} department with {{status}} status.',
    } as UIComponentSchema,
    data: sampleUserData,
  },
};

export const ActionsOnly: Story = {
  args: {
    schema: {
      componentId: 'actions-display',
      name: 'Actions Display',
      componentType: 'Display',
      title: 'User Actions',
      customProps: {
        displayType: 'actions',
      },
      actions: [
        { actionKey: 'edit', label: 'Edit User', style: 'primary' },
        { actionKey: 'view', label: 'View Profile', style: 'secondary' },
        { actionKey: 'delete', label: 'Delete User', style: 'danger' },
      ],
    } as UIComponentSchema,
    data: sampleUserData,
  },
};

export const EmptySchema: Story = {
  args: {
    data: sampleUserData,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows fallback behavior when no schema is provided.',
      },
    },
  },
};

export const CustomStyling: Story = {
  args: {
    schema: {
      componentId: 'styled-card',
      name: 'Styled Card',
      componentType: 'Display',
      title: 'Custom Styled Display',
      customProps: {
        displayType: 'card',
        fields: [
          { key: 'firstName', label: 'First Name' },
          { key: 'lastName', label: 'Last Name' },
          { key: 'email', label: 'Email' },
          { key: 'status', label: 'Status' },
        ],
        layout: 'list',
      },
    } as UIComponentSchema,
    data: sampleUserData,
    className: 'border-2 border-blue-200 rounded-lg shadow-lg p-4',
  },
};

// Complex nested data example
export const ComplexDataStructure: Story = {
  args: {
    schema: {
      componentId: 'complex-display',
      name: 'Complex Display',
      componentType: 'Display',
      title: 'Project Dashboard',
      customProps: {
        displayType: 'table',
        dataKey: 'tasks',
        columns: [
          { key: 'id', label: 'Task ID', width: 'w-20' },
          { key: 'title', label: 'Task Title', width: 'w-1/2' },
          { key: 'status', label: 'Status', width: 'w-1/4', render: 'status-badge' },
          { key: 'assignee', label: 'Assignee', width: 'w-1/4' },
        ],
        flagConfig: {
          field: 'status',
          badgeConfigs: {
            'Completed': { class: 'bg-green-100 text-green-800', text: 'Done' },
            'In Progress': { class: 'bg-blue-100 text-blue-800', text: 'Working' },
            'Pending': { class: 'bg-yellow-100 text-yellow-800', text: 'Waiting' },
          },
        },
      },
    } as UIComponentSchema,
    data: sampleProjectData,
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates handling of complex nested data structures.',
      },
    },
  },
};

// Responsive test
export const ResponsiveDisplay: Story = {
  args: {
    schema: {
      componentId: 'responsive-table',
      name: 'Responsive Table',
      componentType: 'Display',
      title: 'Mobile-Friendly Table',
      customProps: {
        displayType: 'table',
        dataKey: 'users',
        columns: [
          { key: 'name', label: 'Name', width: 'w-1/2' },
          { key: 'email', label: 'Email', width: 'w-1/3' },
          { key: 'status', label: 'Status', width: 'w-1/6' },
        ],
      },
    } as UIComponentSchema,
    data: { users: sampleTableData },
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Test how the display adapts to mobile screen sizes.',
      },
    },
  },
}; 