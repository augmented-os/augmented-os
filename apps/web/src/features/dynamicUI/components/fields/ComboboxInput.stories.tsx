import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { ComboboxInput } from './ComboboxInput';

const meta: Meta<typeof ComboboxInput> = {
  title: 'Components/Atomic Components/Form Fields/Combobox Input',
  component: ComboboxInput,
  parameters: {
    docs: {
      description: {
        component: `
# Combobox Input

A searchable dropdown field component that allows both selection from predefined options and custom value entry.

**Key Features:**
- **🔍 Real-time search** - Type to filter options instantly
- **📝 Custom values** - Allow users to enter new values not in the list
- **✅ Validation support** - Error states and required field validation
- **⚠️ Warning states** - Highlight fields needing attention
- **🚫 Disabled support** - Read-only state with proper styling
- **📋 Flexible options** - Support for large datasets with search

**Perfect for:**
- Supplier/vendor selection with ability to add new ones
- Category assignment with custom categories
- Location fields with search + custom entry
- User/employee selection from large lists
- Any dropdown that benefits from search functionality

**Comparison with SelectInput:**
- **Combobox**: Searchable + custom values + better for large lists
- **Select**: Simple dropdown + predefined options only + better for small lists
        `
      }
    },
    layout: 'centered',
  },
  argTypes: {
    onChange: { action: 'value changed' },
    value: { control: 'text' },
    placeholder: { control: 'text' },
    searchPlaceholder: { control: 'text' },
    emptyMessage: { control: 'text' },
    helpText: { control: 'text' },
    error: { control: 'text' },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
    warning: { control: 'boolean' },
    allowCustomValue: { control: 'boolean' },
  },
  decorators: [
    (Story) => (
      <div className="max-w-md p-6">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ComboboxInput>;

// Sample options for stories
const supplierOptions = [
  { value: 'techsupplies-inc', label: 'TechSupplies Inc' },
  { value: 'office-solutions-ltd', label: 'Office Solutions Ltd' },
  { value: 'business-depot', label: 'Business Depot' },
  { value: 'enterprise-supplies', label: 'Enterprise Supplies Co' },
  { value: 'digital-services', label: 'Digital Services Group' },
];

const categoryOptions = [
  { value: 'office-supplies', label: 'Office Supplies' },
  { value: 'software', label: 'Software & Licenses' },
  { value: 'travel', label: 'Travel & Accommodation' },
  { value: 'meals', label: 'Meals & Entertainment' },
  { value: 'equipment', label: 'Office Equipment' },
  { value: 'training', label: 'Training & Development' },
  { value: 'marketing', label: 'Marketing & Advertising' },
  { value: 'other', label: 'Other Business Expense' },
];

const largeLocationOptions = [
  { value: 'london-uk', label: 'London, United Kingdom' },
  { value: 'manchester-uk', label: 'Manchester, United Kingdom' },
  { value: 'birmingham-uk', label: 'Birmingham, United Kingdom' },
  { value: 'edinburgh-uk', label: 'Edinburgh, Scotland' },
  { value: 'cardiff-wales', label: 'Cardiff, Wales' },
  { value: 'belfast-ni', label: 'Belfast, Northern Ireland' },
  { value: 'new-york-us', label: 'New York, United States' },
  { value: 'los-angeles-us', label: 'Los Angeles, United States' },
  { value: 'chicago-us', label: 'Chicago, United States' },
  { value: 'toronto-ca', label: 'Toronto, Canada' },
  { value: 'vancouver-ca', label: 'Vancouver, Canada' },
  { value: 'sydney-au', label: 'Sydney, Australia' },
  { value: 'melbourne-au', label: 'Melbourne, Australia' },
  { value: 'tokyo-jp', label: 'Tokyo, Japan' },
  { value: 'singapore-sg', label: 'Singapore' },
  { value: 'berlin-de', label: 'Berlin, Germany' },
  { value: 'paris-fr', label: 'Paris, France' },
  { value: 'amsterdam-nl', label: 'Amsterdam, Netherlands' },
  { value: 'zurich-ch', label: 'Zurich, Switzerland' },
  { value: 'stockholm-se', label: 'Stockholm, Sweden' },
];

// Interactive wrapper for stories that need state management
const InteractiveWrapper = ({ initialValue = '', ...props }: { initialValue?: string } & Omit<React.ComponentProps<typeof ComboboxInput>, 'value' | 'onChange'>) => {
  const [value, setValue] = useState(initialValue);
  return (
    <ComboboxInput
      {...props}
      value={value}
      onChange={setValue}
    />
  );
};

export const Basic: Story = {
  name: 'Basic Usage',
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    id: 'basic-combobox',
    label: 'Supplier',
    options: supplierOptions,
    placeholder: 'Select or search for a supplier...',
    searchPlaceholder: 'Search suppliers...',
  },
  parameters: {
    docs: {
      description: {
        story: 'Basic combobox with predefined supplier options. Users can search or type custom values.',
      },
    },
  },
};

export const WithCustomValue: Story = {
  name: 'Custom Value Entry',
  render: (args) => <InteractiveWrapper {...args} initialValue="Custom Supplier Name" />,
  args: {
    id: 'custom-value-combobox',
    label: 'Supplier',
    options: supplierOptions,
    placeholder: 'Select or enter new supplier...',
    searchPlaceholder: 'Search suppliers...',
    helpText: 'You can select from the list or type a new supplier name',
    allowCustomValue: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates custom value entry - users can type supplier names not in the predefined list.',
      },
    },
  },
};

export const LargeDataset: Story = {
  name: 'Large Dataset with Search',
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    id: 'large-dataset-combobox',
    label: 'Location',
    options: largeLocationOptions,
    placeholder: 'Select or search for a location...',
    searchPlaceholder: 'Type city name...',
    helpText: 'Search through 20+ locations or enter a custom location',
    emptyMessage: 'No locations found. Try typing a different city name.',
  },
  parameters: {
    docs: {
      description: {
        story: 'Showcases search functionality with a large dataset. Type to filter options quickly.',
      },
    },
  },
};

export const Warning: Story = {
  name: 'Warning State',
  render: (args) => <InteractiveWrapper {...args} initialValue="tech-solutions-corp" />,
  args: {
    id: 'warning-combobox',
    label: 'Supplier',
    options: supplierOptions,
    placeholder: 'Select supplier...',
    warning: true,
    helpText: '⚠️ Please verify this supplier matches your records',
  },
  parameters: {
    docs: {
      description: {
        story: 'Warning state with amber styling - useful for fields requiring attention during workflows.',
      },
    },
  },
};

export const Required: Story = {
  name: 'Required Field',
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    id: 'required-combobox',
    label: 'Category',
    options: categoryOptions,
    placeholder: 'Select category...',
    required: true,
    helpText: 'Category assignment is required for expense processing',
  },
  parameters: {
    docs: {
      description: {
        story: 'Required field with asterisk indicator - essential for form validation.',
      },
    },
  },
};

export const WithError: Story = {
  name: 'Error State',
  render: (args) => <InteractiveWrapper {...args} initialValue="invalid-supplier" />,
  args: {
    id: 'error-combobox',
    label: 'Supplier',
    options: supplierOptions,
    placeholder: 'Select supplier...',
    error: 'Please select a valid supplier from the list',
    required: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Error state with validation message - shows when validation fails.',
      },
    },
  },
};

export const Disabled: Story = {
  name: 'Disabled State',
  render: (args) => <InteractiveWrapper {...args} initialValue="techsupplies-inc" />,
  args: {
    id: 'disabled-combobox',
    label: 'Supplier',
    options: supplierOptions,
    placeholder: 'Select supplier...',
    disabled: true,
    helpText: 'Supplier selection is locked during review process',
  },
  parameters: {
    docs: {
      description: {
        story: 'Disabled state - read-only field during certain workflow phases.',
      },
    },
  },
};

export const StrictSelection: Story = {
  name: 'Strict Selection Only',
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    id: 'strict-combobox',
    label: 'Category',
    options: categoryOptions,
    placeholder: 'Search categories...',
    searchPlaceholder: 'Type to search categories...',
    allowCustomValue: false,
    helpText: 'Only predefined categories are allowed',
    emptyMessage: 'No matching categories found',
  },
  parameters: {
    docs: {
      description: {
        story: 'Strict mode - only allows selection from predefined options, no custom values.',
      },
    },
  },
};

export const AllStates: Story = {
  name: 'All States Demo',
  render: () => (
    <div className="space-y-8 max-w-lg">
      <h3 className="text-lg font-semibold">Combobox Input States</h3>
      
      <InteractiveWrapper
        id="state-basic"
        label="Basic"
        options={supplierOptions.slice(0, 3)}
        placeholder="Basic combobox..."
      />
      
      <InteractiveWrapper
        id="state-required"
        label="Required"
        options={supplierOptions.slice(0, 3)}
        placeholder="Required field..."
        required={true}
      />
      
      <InteractiveWrapper
        id="state-warning"
        label="Warning"
        options={supplierOptions.slice(0, 3)}
        placeholder="Warning state..."
        warning={true}
        helpText="⚠️ Needs attention"
        initialValue="supplier-needs-verification"
      />
      
      <InteractiveWrapper
        id="state-error"
        label="Error"
        options={supplierOptions.slice(0, 3)}
        placeholder="Error state..."
        error="This field is required"
        required={true}
      />
      
      <InteractiveWrapper
        id="state-disabled"
        label="Disabled"
        options={supplierOptions.slice(0, 3)}
        placeholder="Disabled field..."
        disabled={true}
        initialValue="locked-supplier"
        helpText="Field is locked"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Comprehensive overview of all ComboboxInput states and variations.',
      },
    },
  },
};

export const SchemaExample: Story = {
  name: 'Schema Usage Example',
  render: () => (
    <div className="space-y-6 max-w-lg">
      <h3 className="text-lg font-semibold">Dynamic UI Schema Usage</h3>
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium mb-3">Schema Configuration:</h4>
        <pre className="text-xs text-gray-700 whitespace-pre-wrap">{`{
  fieldKey: 'supplier',
  label: 'Supplier',
  type: 'combobox',
  options: [
    { value: 'techsupplies-inc', label: 'TechSupplies Inc' },
    { value: 'office-solutions-ltd', label: 'Office Solutions Ltd' }
  ],
  placeholder: 'Select or search supplier...',
  customProps: {
    searchPlaceholder: 'Search suppliers...',
    emptyMessage: 'No suppliers found',
    allowCustomValue: true
  },
  required: true
}`}</pre>
      </div>
      
      <div>
        <h4 className="font-medium mb-3">Rendered Component:</h4>
        <InteractiveWrapper
          id="schema-example"
          label="Supplier"
          options={supplierOptions}
          placeholder="Select or search supplier..."
          searchPlaceholder="Search suppliers..."
          emptyMessage="No suppliers found"
          allowCustomValue={true}
          required={true}
          helpText="This field supports both selection and custom value entry"
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example of how to configure ComboboxInput in a Dynamic UI schema with all available options.',
      },
    },
  },
}; 