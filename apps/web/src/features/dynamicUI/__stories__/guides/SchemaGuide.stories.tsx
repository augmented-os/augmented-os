import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Dynamic UI/📖 Implementation Guides/Schema Design Guide',
  parameters: {
    docs: {
      page: () => (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
          <h1>Schema Design Guide</h1>
          
          <p><em>TODO: STRB-107 - Add complete TypeScript interfaces and comprehensive schema examples</em></p>
          
          <p>A comprehensive reference for designing Dynamic UI schemas, from simple forms to complex multi-step workflows.</p>
          
          <h2>Core Schema Structure</h2>
          <p>Every Dynamic UI schema follows this TypeScript interface:</p>
          
          <pre style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '0.9rem' }}>
{`// TODO: STRB-107 - Include complete interfaces from developer guide
interface UIComponentSchema {
  componentId: string;
  name: string;
  description?: string;
  componentType: 'Form' | 'Modal' | 'Display' | 'Custom';
  title: string;
  fields?: FormField[];
  actions?: ActionButton[];
  displayTemplate?: string;
  layout?: LayoutConfig;
  customProps?: Record<string, any>;
  version?: string;
}`}
          </pre>
          
          <h2>Field Definition Reference</h2>
          
          <h3>Basic Field Structure</h3>
          <pre style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '0.9rem' }}>
{`interface FormField {
  fieldKey: string;           // Unique identifier
  label: string;              // Display label
  type: FieldType;            // Input component type
  placeholder?: string;       // Placeholder text
  default?: any;              // Default value
  validationRules?: ValidationRule[];
  options?: SelectOption[];   // For select/multi-select
  visibleIf?: string;         // Conditional visibility
  helpText?: string;          // Help/description text
  required?: boolean;         // Required field flag
}`}
          </pre>
          
          <h3>Supported Field Types</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', margin: '1rem 0' }}>
            <thead>
              <tr style={{ background: '#f5f5f5' }}>
                <th style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'left' }}>Type</th>
                <th style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'left' }}>Purpose</th>
                <th style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'left' }}>Properties</th>
                <th style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'left' }}>Example</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}><code>text</code></td>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Single-line text</td>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>placeholder, maxLength</td>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Names, titles</td>
              </tr>
              <tr>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}><code>email</code></td>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Email with validation</td>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>placeholder</td>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Email addresses</td>
              </tr>
              <tr>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}><code>number</code></td>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Numeric input</td>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>min, max, step</td>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Ages, quantities</td>
              </tr>
              <tr>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}><code>boolean</code></td>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Checkbox</td>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>default</td>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Agreements, flags</td>
              </tr>
              <tr>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}><code>select</code></td>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Dropdown</td>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>options, placeholder</td>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Categories, status</td>
              </tr>
              <tr>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}><code>textarea</code></td>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Multi-line text</td>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>placeholder, rows</td>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Comments, descriptions</td>
              </tr>
            </tbody>
          </table>
          
          <h2>Validation System</h2>
          
          <h3>Inline Validation Rules</h3>
          <pre style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '0.9rem' }}>
{`interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'min' | 'max' | 'email';
  value?: string | number;
  message?: string;
}

// Examples:
const validationExamples = {
  required: { type: 'required', message: 'This field is required' },
  email: { type: 'email', message: 'Please enter a valid email address' },
  minLength: { type: 'minLength', value: 8, message: 'Password must be at least 8 characters' },
  pattern: { type: 'pattern', value: '^[0-9]{3}-[0-9]{3}-[0-9]{4}$', message: 'Please use format: 123-456-7890' }
};`}
          </pre>
          
          <h2>Conditional Logic</h2>
          
          <h3>Field Visibility</h3>
          <p>Use the <code>visibleIf</code> property to show/hide fields:</p>
          
          <pre style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '0.9rem' }}>
{`// Simple equality check
{
  fieldKey: 'spouseName',
  label: 'Spouse Name',
  type: 'text',
  visibleIf: 'maritalStatus === "married"'
}

// Multiple conditions
{
  fieldKey: 'businessTaxId',
  label: 'Business Tax ID',
  type: 'text',
  visibleIf: 'accountType === "business" && country === "US"'
}`}
          </pre>
          
          <h2>Best Practices</h2>
          
          <h3>Schema Design Principles</h3>
          <ol>
            <li><strong>Progressive Disclosure</strong>: Use sections and conditional fields to reduce cognitive load</li>
            <li><strong>Clear Labeling</strong>: Use descriptive labels and help text</li>
            <li><strong>Logical Grouping</strong>: Group related fields together</li>
            <li><strong>Validation Strategy</strong>: Validate early and provide clear error messages</li>
            <li><strong>Performance</strong>: Limit conditional complexity for better performance</li>
          </ol>
          
          <h3>Field Naming Conventions</h3>
          <pre style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '0.9rem' }}>
{`// Good: Descriptive and consistent
fieldKey: 'billingAddress_street'
fieldKey: 'shippingAddress_street'
fieldKey: 'contactInfo_primaryEmail'

// Avoid: Ambiguous or inconsistent
fieldKey: 'addr1'
fieldKey: 'street'
fieldKey: 'email1'`}
          </pre>
          
          <h2>Next Steps</h2>
          <ul>
            <li><strong>Validation System</strong> - Deep dive into validation</li>
            <li><strong>Performance Guide</strong> - Optimization techniques</li>
            <li><strong>Schema Builder</strong> - Interactive schema creation</li>
          </ul>
          
          <hr style={{ margin: '2rem 0' }} />
          <p style={{ fontStyle: 'italic', textAlign: 'center' }}>Master schema design to unlock the full potential of Dynamic UI!</p>
        </div>
      ),
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const SchemaDesignGuide: Story = {}; 