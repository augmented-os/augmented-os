import type { Meta, StoryObj } from '@storybook/react';
import { DisplayField } from './DisplayField';
import type { DisplayFieldConfig } from './DisplayField';

const meta: Meta<typeof DisplayField> = {
  title: 'DynamicUI/Displays/DisplayField',
  component: DisplayField,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A versatile display component that can render different types of displays (table, card, text, actions) based on configuration.',
      },
    },
  },
  argTypes: {
    field: {
      control: 'object',
      description: 'Configuration object defining the display type and settings',
    },
    data: {
      control: 'object',
      description: 'Data to be displayed by the field',
    },
    onAction: {
      action: 'action-triggered',
      description: 'Callback function for handling actions',
    },
  },
};

export default meta;
type Story = StoryObj<typeof DisplayField>;

// Sample data for stories
const sampleTableData = [
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Inactive' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'Pending' },
];

const sampleCardData = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  department: 'Engineering',
  joinDate: '2023-01-15',
  status: 'Active',
};

export const TextDisplay: Story = {
  args: {
    field: {
      fieldKey: 'userName',
      label: 'User Name',
      type: 'text',
    } as DisplayFieldConfig,
    data: {
      userName: 'John Doe',
    },
  },
};

export const TextDisplayWithCustomData: Story = {
  args: {
    field: {
      fieldKey: 'customField',
      label: 'Custom Text',
      type: 'text',
      data: 'This is custom data not from the main data object',
    } as DisplayFieldConfig,
    data: {},
  },
};

export const TableDisplay: Story = {
  args: {
    field: {
      fieldKey: 'users',
      type: 'table',
      tableConfig: {
        columns: [
          { key: 'id', label: 'ID', width: 'w-20' },
          { key: 'name', label: 'Name', width: 'w-1/3' },
          { key: 'email', label: 'Email', width: 'w-1/3' },
          { key: 'status', label: 'Status', width: 'w-1/4' },
        ],
      },
    } as DisplayFieldConfig,
    data: {
      users: sampleTableData,
    },
  },
};

export const TableWithCustomRendering: Story = {
  args: {
    field: {
      fieldKey: 'users',
      type: 'table',
      tableConfig: {
        columns: [
          { key: 'id', label: 'ID', width: 'w-20' },
          { key: 'name', label: 'Name', width: 'w-1/3' },
          { key: 'email', label: 'Email', width: 'w-1/3' },
          {
            key: 'status',
            label: 'Status',
            width: 'w-1/4',
            render: (value: unknown) => {
              const status = value as string;
              const getStatusColor = (status: string) => {
                switch (status) {
                  case 'Active': return 'bg-green-100 text-green-800';
                  case 'Inactive': return 'bg-red-100 text-red-800';
                  case 'Pending': return 'bg-yellow-100 text-yellow-800';
                  default: return 'bg-gray-100 text-gray-800';
                }
              };
              return (
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(status)}`}>
                  {status}
                </span>
              );
            },
          },
        ],
        rowClassName: (row: Record<string, unknown>) => {
          return row.status === 'Inactive' ? 'bg-gray-50' : '';
        },
      },
    } as DisplayFieldConfig,
    data: {
      users: sampleTableData,
    },
  },
};

export const CardDisplay: Story = {
  args: {
    field: {
      fieldKey: 'userInfo',
      label: 'User Information',
      type: 'card',
      cardConfig: {
        fields: [
          { key: 'name', label: 'Full Name' },
          { key: 'email', label: 'Email Address' },
          { key: 'phone', label: 'Phone Number' },
          { key: 'department', label: 'Department' },
          { key: 'joinDate', label: 'Join Date' },
          { key: 'status', label: 'Status' },
        ],
        layout: 'grid',
      },
    } as DisplayFieldConfig,
    data: {
      userInfo: sampleCardData,
    },
  },
};

export const CardDisplayList: Story = {
  args: {
    field: {
      fieldKey: 'userInfo',
      label: 'User Information (List Layout)',
      type: 'card',
      cardConfig: {
        fields: [
          { key: 'name', label: 'Full Name' },
          { key: 'email', label: 'Email Address' },
          { key: 'phone', label: 'Phone Number' },
          { key: 'department', label: 'Department' },
        ],
        layout: 'list',
      },
    } as DisplayFieldConfig,
    data: {
      userInfo: sampleCardData,
    },
  },
};

export const CardWithCustomRendering: Story = {
  args: {
    field: {
      fieldKey: 'userInfo',
      label: 'User Profile',
      type: 'card',
      cardConfig: {
        fields: [
          { key: 'name', label: 'Full Name' },
          { key: 'email', label: 'Email Address' },
          {
            key: 'status',
            label: 'Account Status',
            render: (value: unknown) => {
              const status = value as string;
              const isActive = status === 'Active';
              return (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  <span className={`w-1.5 h-1.5 mr-1.5 rounded-full ${
                    isActive ? 'bg-green-400' : 'bg-red-400'
                  }`}></span>
                  {status}
                </span>
              );
            },
          },
        ],
      },
    } as DisplayFieldConfig,
    data: {
      userInfo: sampleCardData,
    },
  },
};

export const ActionButtons: Story = {
  args: {
    field: {
      fieldKey: 'actions',
      type: 'actions',
      actionsConfig: {
        actions: [
          { actionKey: 'edit', label: 'Edit', style: 'primary' },
          { actionKey: 'view', label: 'View Details', style: 'secondary' },
          { actionKey: 'delete', label: 'Delete', style: 'danger' },
        ],
      },
    } as DisplayFieldConfig,
    data: { id: 1, name: 'John Doe' },
  },
};

export const ActionButtonsMinimal: Story = {
  args: {
    field: {
      fieldKey: 'actions',
      type: 'actions',
      actionsConfig: {
        actions: [
          { actionKey: 'save', label: 'Save', style: 'primary' },
        ],
      },
    } as DisplayFieldConfig,
    data: { id: 1 },
  },
};

export const EmptyTable: Story = {
  args: {
    field: {
      fieldKey: 'emptyData',
      type: 'table',
      tableConfig: {
        columns: [
          { key: 'id', label: 'ID' },
          { key: 'name', label: 'Name' },
        ],
      },
    } as DisplayFieldConfig,
    data: {
      emptyData: [],
    },
  },
};

export const UnsupportedType: Story = {
  args: {
    field: {
      fieldKey: 'test',
      type: 'unsupported' as 'table' | 'card' | 'text' | 'actions',
    } as DisplayFieldConfig,
    data: {},
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates error handling for unsupported display types.',
      },
    },
  },
};

// Responsive table test
export const ResponsiveTable: Story = {
  args: {
    field: {
      fieldKey: 'users',
      type: 'table',
      tableConfig: {
        columns: [
          { key: 'id', label: 'ID', width: 'w-16' },
          { key: 'name', label: 'Full Name', width: 'w-1/4' },
          { key: 'email', label: 'Email Address', width: 'w-1/3' },
          { key: 'department', label: 'Department', width: 'w-1/4' },
          { key: 'status', label: 'Status', width: 'w-20' },
        ],
      },
    } as DisplayFieldConfig,
    data: {
      users: [
        ...sampleTableData,
        { id: 4, name: 'Alice Cooper', email: 'alice.cooper@verylongdomain.example.com', status: 'Active', department: 'Product Management' },
        { id: 5, name: 'Charlie Brown', email: 'charlie.brown@company.co.uk', status: 'Pending', department: 'Customer Success' },
      ],
    },
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Test table responsiveness on small screens.',
      },
    },
  },
}; 