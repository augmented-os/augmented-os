import type { Meta, StoryObj } from '@storybook/react';
import { TableDisplay } from './TableDisplay';

const meta: Meta<typeof TableDisplay> = {
  title: 'DynamicUI/Displays/TableDisplay',
  component: TableDisplay,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A table display component that renders data in a structured table format with configurable columns, custom rendering, and row styling.',
      },
    },
  },
  argTypes: {
    data: {
      control: 'object',
      description: 'Array of data objects to display in the table',
    },
    config: {
      control: 'object',
      description: 'Configuration object defining columns and table behavior',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes for custom styling',
    },
  },
};

export default meta;
type Story = StoryObj<typeof TableDisplay>;

// Sample data for stories
const basicUserData = [
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Inactive' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'Pending' },
];

const employeeData = [
  { 
    id: 1, 
    name: 'John Doe', 
    email: 'john.doe@company.com', 
    department: 'Engineering', 
    role: 'Senior Developer',
    salary: 95000,
    startDate: '2022-03-15',
    status: 'Active'
  },
  { 
    id: 2, 
    name: 'Jane Smith', 
    email: 'jane.smith@company.com', 
    department: 'Product', 
    role: 'Product Manager',
    salary: 105000,
    startDate: '2021-08-20',
    status: 'Active'
  },
  { 
    id: 3, 
    name: 'Bob Johnson', 
    email: 'bob.johnson@company.com', 
    department: 'Sales', 
    role: 'Sales Representative',
    salary: 65000,
    startDate: '2023-01-10',
    status: 'Inactive'
  },
  { 
    id: 4, 
    name: 'Alice Cooper', 
    email: 'alice.cooper@company.com', 
    department: 'Engineering', 
    role: 'Frontend Developer',
    salary: 85000,
    startDate: '2023-06-01',
    status: 'Active'
  },
];

const projectData = [
  {
    id: 'PROJ-001',
    name: 'Dynamic UI Framework',
    status: 'In Progress',
    priority: 'High',
    budget: 150000,
    completion: 75,
    team: 'Frontend Engineering',
    dueDate: '2024-06-30'
  },
  {
    id: 'PROJ-002',
    name: 'Customer Portal',
    status: 'Completed',
    priority: 'Medium',
    budget: 80000,
    completion: 100,
    team: 'Full Stack',
    dueDate: '2024-03-15'
  },
  {
    id: 'PROJ-003',
    name: 'Mobile App Redesign',
    status: 'On Hold',
    priority: 'Low',
    budget: 120000,
    completion: 25,
    team: 'Mobile Team',
    dueDate: '2024-12-01'
  },
];

export const BasicTable: Story = {
  args: {
    data: basicUserData,
    config: {
      columns: [
        { key: 'id', label: 'ID', width: 'w-20' },
        { key: 'name', label: 'Name', width: 'w-1/3' },
        { key: 'email', label: 'Email', width: 'w-1/3' },
        { key: 'status', label: 'Status', width: 'w-1/4' },
      ],
    },
  },
};

export const EmployeeTable: Story = {
  args: {
    data: employeeData,
    config: {
      columns: [
        { key: 'id', label: 'ID', width: 'w-16' },
        { key: 'name', label: 'Name', width: 'w-1/4' },
        { key: 'email', label: 'Email', width: 'w-1/4' },
        { key: 'department', label: 'Department', width: 'w-1/6' },
        { key: 'role', label: 'Role', width: 'w-1/4' },
        { key: 'status', label: 'Status', width: 'w-20' },
      ],
    },
  },
};

export const WithCustomRendering: Story = {
  args: {
    data: employeeData,
    config: {
      columns: [
        { key: 'name', label: 'Employee', width: 'w-1/4' },
        { key: 'department', label: 'Department', width: 'w-1/6' },
        {
          key: 'salary',
          label: 'Salary',
          width: 'w-1/6',
          render: (value: unknown) => {
            const salary = value as number;
            return <span className="font-mono text-green-600">${salary.toLocaleString()}</span>;
          },
        },
        {
          key: 'status',
          label: 'Status',
          width: 'w-1/6',
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
        {
          key: 'startDate',
          label: 'Start Date',
          width: 'w-1/6',
          render: (value: unknown) => {
            const date = new Date(value as string);
            return <span className="text-gray-600">{date.toLocaleDateString()}</span>;
          },
        },
      ],
    },
  },
};

export const ProjectTable: Story = {
  args: {
    data: projectData,
    config: {
      columns: [
        { key: 'id', label: 'Project ID', width: 'w-24' },
        { key: 'name', label: 'Project Name', width: 'w-1/4' },
        {
          key: 'status',
          label: 'Status',
          width: 'w-1/6',
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
          width: 'w-20',
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
          key: 'completion',
          label: 'Progress',
          width: 'w-1/6',
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
                <span className="text-xs font-medium w-8">{percentage}%</span>
              </div>
            );
          },
        },
      ],
    },
  },
};

export const WithRowStyling: Story = {
  args: {
    data: employeeData,
    config: {
      columns: [
        { key: 'name', label: 'Name', width: 'w-1/3' },
        { key: 'department', label: 'Department', width: 'w-1/4' },
        { key: 'role', label: 'Role', width: 'w-1/4' },
        { key: 'status', label: 'Status', width: 'w-1/6' },
      ],
      rowClassName: (row: Record<string, unknown>) => {
        if (row.status === 'Inactive') return 'bg-red-50 opacity-75';
        if (row.department === 'Engineering') return 'bg-blue-50';
        return '';
      },
    },
  },
};

export const EmptyTable: Story = {
  args: {
    data: [],
    config: {
      columns: [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'status', label: 'Status' },
      ],
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows how the table displays when no data is provided.',
      },
    },
  },
};

export const NoConfiguration: Story = {
  args: {
    data: basicUserData,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the fallback message when no table configuration is provided.',
      },
    },
  },
};

export const LongContent: Story = {
  args: {
    data: [
      {
        id: 1,
        name: 'John Doe with a Very Long Name That Should Wrap',
        email: 'john.doe.with.very.long.email@verylongdomainname.example.com',
        description: 'This is a very long description that should demonstrate how the table handles content that exceeds the normal column width and needs to wrap to multiple lines.',
        status: 'Active'
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@short.com',
        description: 'Short description.',
        status: 'Inactive'
      },
    ],
    config: {
      columns: [
        { key: 'id', label: 'ID', width: 'w-16' },
        { key: 'name', label: 'Name', width: 'w-1/4' },
        { key: 'email', label: 'Email', width: 'w-1/4' },
        { key: 'description', label: 'Description', width: 'w-1/3' },
        { key: 'status', label: 'Status', width: 'w-20' },
      ],
    },
  },
};

export const CustomStyling: Story = {
  args: {
    data: basicUserData,
    config: {
      columns: [
        { key: 'id', label: 'ID', width: 'w-20' },
        { key: 'name', label: 'Name', width: 'w-1/3' },
        { key: 'email', label: 'Email', width: 'w-1/3' },
        { key: 'status', label: 'Status', width: 'w-1/4' },
      ],
    },
    className: 'border-2 border-blue-200 rounded-xl shadow-lg',
  },
};

// Responsive test
export const ResponsiveTable: Story = {
  args: {
    data: employeeData,
    config: {
      columns: [
        { key: 'name', label: 'Name', width: 'w-1/3' },
        { key: 'email', label: 'Email', width: 'w-1/3' },
        { key: 'department', label: 'Dept', width: 'w-1/6' },
        { key: 'status', label: 'Status', width: 'w-1/6' },
      ],
    },
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Test how the table behaves on small screens.',
      },
    },
  },
};

// Complex data types
export const ComplexDataTypes: Story = {
  args: {
    data: [
      {
        id: 1,
        name: 'John Doe',
        isActive: true,
        score: 95.5,
        tags: ['developer', 'senior', 'frontend'],
        metadata: { location: 'SF', timezone: 'PST' },
        lastLogin: new Date('2024-01-15T10:30:00Z'),
      },
      {
        id: 2,
        name: 'Jane Smith',
        isActive: false,
        score: 87.2,
        tags: ['manager', 'product'],
        metadata: { location: 'NY', timezone: 'EST' },
        lastLogin: new Date('2024-01-10T15:45:00Z'),
      },
    ],
    config: {
      columns: [
        { key: 'name', label: 'Name', width: 'w-1/4' },
        {
          key: 'isActive',
          label: 'Active',
          width: 'w-20',
          render: (value: unknown) => {
            const isActive = value as boolean;
            return (
              <span className={`w-3 h-3 rounded-full inline-block ${isActive ? 'bg-green-400' : 'bg-red-400'}`}></span>
            );
          },
        },
        {
          key: 'score',
          label: 'Score',
          width: 'w-20',
          render: (value: unknown) => {
            const score = value as number;
            return <span className="font-mono">{score.toFixed(1)}</span>;
          },
        },
        {
          key: 'tags',
          label: 'Tags',
          width: 'w-1/3',
          render: (value: unknown) => {
            const tags = value as string[];
            return (
              <div className="flex flex-wrap gap-1">
                {tags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            );
          },
        },
        {
          key: 'lastLogin',
          label: 'Last Login',
          width: 'w-1/4',
          render: (value: unknown) => {
            const date = value as Date;
            return <span className="text-sm text-gray-600">{date.toLocaleString()}</span>;
          },
        },
      ],
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates handling of complex data types including booleans, arrays, objects, and dates.',
      },
    },
  },
}; 