import type { Meta, StoryObj } from '@storybook/react';
import { CardDisplay } from './CardDisplay';

const meta: Meta<typeof CardDisplay> = {
  title: 'DynamicUI/Displays/CardDisplay',
  component: CardDisplay,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A card display component that presents data in a structured card format with configurable layouts and custom field rendering.',
      },
    },
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Optional title displayed above the card',
    },
    data: {
      control: 'object',
      description: 'Data object containing the values to display',
    },
    config: {
      control: 'object',
      description: 'Configuration object defining fields and layout',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes for custom styling',
    },
  },
};

export default meta;
type Story = StoryObj<typeof CardDisplay>;

// Sample data for stories
const userProfileData = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@company.com',
  phone: '+1 (555) 123-4567',
  department: 'Engineering',
  role: 'Senior Developer',
  startDate: '2022-03-15',
  status: 'Active',
  location: 'San Francisco, CA',
  manager: 'Jane Smith',
};

const projectData = {
  name: 'Dynamic UI Framework',
  description: 'A flexible UI component system for rapid application development',
  status: 'In Progress',
  priority: 'High',
  startDate: '2024-01-01',
  dueDate: '2024-06-30',
  budget: 150000,
  team: 'Frontend Engineering',
  completionPercentage: 75,
  lastUpdated: '2024-01-15T14:30:00Z',
};

const customerData = {
  companyName: 'Acme Corporation',
  contactPerson: 'Alice Johnson',
  email: 'alice@acme.com',
  phone: '+1 (555) 987-6543',
  address: '123 Business Ave, Suite 456',
  city: 'New York',
  state: 'NY',
  zipCode: '10001',
  industry: 'Technology',
  customerSince: '2020-05-15',
  accountValue: 250000,
  tier: 'Enterprise',
};

export const BasicCard: Story = {
  args: {
    title: 'User Profile',
    data: userProfileData,
    config: {
      fields: [
        { key: 'firstName', label: 'First Name' },
        { key: 'lastName', label: 'Last Name' },
        { key: 'email', label: 'Email' },
        { key: 'department', label: 'Department' },
      ],
      layout: 'grid',
    },
  },
};

export const ListLayout: Story = {
  args: {
    title: 'Employee Information',
    data: userProfileData,
    config: {
      fields: [
        { key: 'firstName', label: 'First Name' },
        { key: 'lastName', label: 'Last Name' },
        { key: 'email', label: 'Email Address' },
        { key: 'phone', label: 'Phone Number' },
        { key: 'department', label: 'Department' },
        { key: 'role', label: 'Job Title' },
        { key: 'startDate', label: 'Start Date' },
      ],
      layout: 'list',
    },
  },
};

export const WithoutTitle: Story = {
  args: {
    data: userProfileData,
    config: {
      fields: [
        { key: 'firstName', label: 'First Name' },
        { key: 'lastName', label: 'Last Name' },
        { key: 'email', label: 'Email' },
        { key: 'status', label: 'Status' },
      ],
      layout: 'grid',
    },
  },
};

export const CustomRendering: Story = {
  args: {
    title: 'Project Overview',
    data: projectData,
    config: {
      fields: [
        { key: 'name', label: 'Project Name' },
        {
          key: 'status',
          label: 'Status',
          render: (value: unknown) => {
            const status = value as string;
            const getStatusColor = (status: string) => {
              switch (status) {
                case 'In Progress': return 'bg-blue-100 text-blue-800';
                case 'Completed': return 'bg-green-100 text-green-800';
                case 'On Hold': return 'bg-yellow-100 text-yellow-800';
                case 'Cancelled': return 'bg-red-100 text-red-800';
                default: return 'bg-gray-100 text-gray-800';
              }
            };
            return (
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                {status}
              </span>
            );
          },
        },
        {
          key: 'priority',
          label: 'Priority',
          render: (value: unknown) => {
            const priority = value as string;
            const getColor = (priority: string) => {
              switch (priority) {
                case 'High': return 'text-red-600 font-semibold';
                case 'Medium': return 'text-yellow-600 font-semibold';
                case 'Low': return 'text-green-600 font-semibold';
                default: return 'text-gray-600';
              }
            };
            return <span className={getColor(priority)}>{priority}</span>;
          },
        },
        {
          key: 'budget',
          label: 'Budget',
          render: (value: unknown) => {
            const budget = value as number;
            return <span className="font-mono">${budget.toLocaleString()}</span>;
          },
        },
        {
          key: 'completionPercentage',
          label: 'Completion',
          render: (value: unknown) => {
            const percentage = value as number;
            return (
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{percentage}%</span>
              </div>
            );
          },
        },
        { key: 'team', label: 'Team' },
      ],
      layout: 'grid',
    },
  },
};

export const CustomerCard: Story = {
  args: {
    title: 'Customer Information',
    data: customerData,
    config: {
      fields: [
        { key: 'companyName', label: 'Company' },
        { key: 'contactPerson', label: 'Contact' },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Phone' },
        {
          key: 'accountValue',
          label: 'Account Value',
          render: (value: unknown) => {
            const amount = value as number;
            return <span className="font-mono text-green-600 font-semibold">${amount.toLocaleString()}</span>;
          },
        },
        {
          key: 'tier',
          label: 'Tier',
          render: (value: unknown) => {
            const tier = value as string;
            const getTierColor = (tier: string) => {
              switch (tier) {
                case 'Enterprise': return 'bg-purple-100 text-purple-800';
                case 'Business': return 'bg-blue-100 text-blue-800';
                case 'Standard': return 'bg-green-100 text-green-800';
                default: return 'bg-gray-100 text-gray-800';
              }
            };
            return (
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTierColor(tier)}`}>
                {tier}
              </span>
            );
          },
        },
      ],
      layout: 'grid',
    },
  },
};

export const MissingData: Story = {
  args: {
    title: 'Incomplete Profile',
    data: {
      firstName: 'John',
      email: 'john@example.com',
      // Missing several fields intentionally
    },
    config: {
      fields: [
        { key: 'firstName', label: 'First Name' },
        { key: 'lastName', label: 'Last Name' },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Phone' },
        { key: 'department', label: 'Department' },
        { key: 'status', label: 'Status' },
      ],
      layout: 'grid',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates how the component handles missing data fields (shows "N/A").',
      },
    },
  },
};

export const EmptyConfiguration: Story = {
  args: {
    title: 'No Configuration',
    data: userProfileData,
    config: {
      fields: [],
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the fallback message when no field configuration is provided.',
      },
    },
  },
};

export const NoConfiguration: Story = {
  args: {
    title: 'Missing Config',
    data: userProfileData,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the fallback message when config prop is entirely missing.',
      },
    },
  },
};

export const ManyFields: Story = {
  args: {
    title: 'Comprehensive Profile',
    data: {
      ...userProfileData,
      ...customerData,
      additionalField1: 'Value 1',
      additionalField2: 'Value 2',
      additionalField3: 'Value 3',
      additionalField4: 'Value 4',
    },
    config: {
      fields: [
        { key: 'firstName', label: 'First Name' },
        { key: 'lastName', label: 'Last Name' },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Phone' },
        { key: 'department', label: 'Department' },
        { key: 'role', label: 'Role' },
        { key: 'location', label: 'Location' },
        { key: 'startDate', label: 'Start Date' },
        { key: 'manager', label: 'Manager' },
        { key: 'status', label: 'Status' },
        { key: 'companyName', label: 'Company' },
        { key: 'industry', label: 'Industry' },
      ],
      layout: 'grid',
    },
  },
};

export const CustomStyling: Story = {
  args: {
    title: 'Styled Card',
    data: userProfileData,
    config: {
      fields: [
        { key: 'firstName', label: 'First Name' },
        { key: 'lastName', label: 'Last Name' },
        { key: 'email', label: 'Email' },
        { key: 'department', label: 'Department' },
      ],
      layout: 'grid',
    },
    className: 'border-l-4 border-blue-500 shadow-lg',
  },
};

export const ControlledContext: Story = {
  args: {
    title: 'Card in Controlled Context',
    data: userProfileData,
    config: {
      fields: [
        { key: 'firstName', label: 'First Name' },
        { key: 'lastName', label: 'Last Name' },
        { key: 'email', label: 'Email' },
        { key: 'status', label: 'Status' },
      ],
      layout: 'grid',
    },
    className: 'mb-0', // This should prevent title rendering
  },
  parameters: {
    docs: {
      description: {
        story: 'When className contains "mb-0", the title is not rendered (for controlled contexts).',
      },
    },
  },
};

// Responsive test
export const ResponsiveCard: Story = {
  args: {
    title: 'Responsive Card Layout',
    data: customerData,
    config: {
      fields: [
        { key: 'companyName', label: 'Company Name' },
        { key: 'contactPerson', label: 'Contact Person' },
        { key: 'email', label: 'Email Address' },
        { key: 'phone', label: 'Phone Number' },
        { key: 'address', label: 'Address' },
        { key: 'industry', label: 'Industry' },
      ],
      layout: 'grid',
    },
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Test how the card displays on mobile devices.',
      },
    },
  },
};

// Multiple cards comparison
export const MultipleCards: Story = {
  render: () => (
    <div className="space-y-6">
      <CardDisplay
        title="Grid Layout"
        data={userProfileData}
        config={{
          fields: [
            { key: 'firstName', label: 'First Name' },
            { key: 'lastName', label: 'Last Name' },
            { key: 'email', label: 'Email' },
            { key: 'department', label: 'Department' },
          ],
          layout: 'grid',
        }}
      />
      <CardDisplay
        title="List Layout"
        data={userProfileData}
        config={{
          fields: [
            { key: 'firstName', label: 'First Name' },
            { key: 'lastName', label: 'Last Name' },
            { key: 'email', label: 'Email' },
            { key: 'department', label: 'Department' },
          ],
          layout: 'list',
        }}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Side-by-side comparison of grid and list layouts.',
      },
    },
  },
}; 