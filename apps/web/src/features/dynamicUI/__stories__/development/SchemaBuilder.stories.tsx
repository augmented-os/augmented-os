import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { DynamicForm } from '../../components/DynamicForm';
import { DynamicDisplay } from '../../components/DynamicDisplay';
import type { UIComponentSchema, FormField } from '../../types/schemas';

const meta: Meta<typeof SchemaBuilder> = {
  title: 'Dynamic UI/Developer Tools/Schema Builder',
  parameters: {
    docs: {
      description: {
        component: 'Interactive schema builder for developing and testing Dynamic UI schemas.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Schema Builder Component
const SchemaBuilder = () => {
  const [schema, setSchema] = useState<UIComponentSchema>({
    componentId: 'builder-schema',
    name: 'Schema Builder Test',
    title: 'Schema Builder Test',
    description: 'Test your schema here',
    componentType: 'Form',
    version: '1.0.0',
    fields: [],
    layout: {
      spacing: 'normal' as const,
    },
  });

  const [testData, setTestData] = useState<Record<string, unknown>>({});
  const [mode, setMode] = useState<'form' | 'display'>('form');

  const addField = (type: FormField['type']) => {
    const newField: FormField = {
      fieldKey: `field_${Date.now()}`,
      type: type,
      label: `New ${type} field`,
      required: false,
      // TODO: Add type-specific default properties
    };

    setSchema(prev => ({
      ...prev,
      fields: [...prev.fields, newField],
    }));
  };

  const removeField = (fieldKey: string) => {
    setSchema(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.fieldKey !== fieldKey),
    }));
  };

  const updateField = (fieldKey: string, updates: Partial<FormField>) => {
    setSchema(prev => ({
      ...prev,
      fields: prev.fields.map(field =>
        field.fieldKey === fieldKey ? { ...field, ...updates } : field
      ),
    }));
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', height: '80vh' }}>
      {/* Schema Builder Panel */}
      <div style={{ border: '1px solid #ccc', padding: '1rem', overflow: 'auto' }}>
        <h3>Schema Builder</h3>
        
        {/* Add Field Buttons */}
        <div style={{ marginBottom: '1rem' }}>
          <h4>Add Fields:</h4>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {['text', 'email', 'number', 'select', 'checkbox', 'textarea', 'date'].map(type => (
              <button
                key={type}
                onClick={() => addField(type as FormField['type'])}
                style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Field List */}
        <div>
          <h4>Fields:</h4>
          {schema.fields.map((field, index) => (
            <div key={field.fieldKey} style={{ border: '1px solid #eee', padding: '0.5rem', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong>{field.type}</strong>
                <button onClick={() => removeField(field.fieldKey)} style={{ color: 'red' }}>×</button>
              </div>
              <div style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>
                <input
                  type="text"
                  value={field.label}
                  onChange={(e) => updateField(field.fieldKey, { label: e.target.value })}
                  placeholder="Field label"
                  style={{ width: '100%', marginBottom: '0.25rem' }}
                />
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <input
                    type="checkbox"
                    checked={field.required || false}
                    onChange={(e) => updateField(field.fieldKey, { required: e.target.checked })}
                  />
                  Required
                </label>
              </div>
            </div>
          ))}
        </div>

        {/* Schema JSON */}
        <div style={{ marginTop: '1rem' }}>
          <h4>Generated Schema:</h4>
          <textarea
            value={JSON.stringify(schema, null, 2)}
            onChange={(e) => {
              try {
                setSchema(JSON.parse(e.target.value));
              } catch (error) {
                // Invalid JSON, ignore
              }
            }}
            style={{ width: '100%', height: '200px', fontFamily: 'monospace', fontSize: '0.8rem' }}
          />
        </div>
      </div>

      {/* Preview Panel */}
      <div style={{ border: '1px solid #ccc', padding: '1rem', overflow: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3>Preview</h3>
          <div>
            <label style={{ marginRight: '1rem' }}>
              <input
                type="radio"
                name="mode"
                value="form"
                checked={mode === 'form'}
                onChange={(e) => setMode(e.target.value as 'form')}
              />
              Form
            </label>
            <label>
              <input
                type="radio"
                name="mode"
                value="display"
                checked={mode === 'display'}
                onChange={(e) => setMode(e.target.value as 'display')}
              />
              Display
            </label>
          </div>
        </div>

        {schema.fields.length === 0 ? (
          <p style={{ color: '#666', fontStyle: 'italic' }}>Add fields to see preview</p>
        ) : mode === 'form' ? (
          <DynamicForm
            schema={schema}
            initialData={testData}
            onSubmit={(data) => {
              console.log('Form submitted:', data);
              setTestData(data);
              alert('Form submitted! Check console for data.');
            }}
          />
        ) : (
          <DynamicDisplay
            schema={schema}
            data={testData}
          />
        )}

        {/* Test Data */}
        <div style={{ marginTop: '2rem' }}>
          <h4>Test Data:</h4>
          <textarea
            value={JSON.stringify(testData, null, 2)}
            onChange={(e) => {
              try {
                setTestData(JSON.parse(e.target.value));
              } catch (error) {
                // Invalid JSON, ignore
              }
            }}
            style={{ width: '100%', height: '150px', fontFamily: 'monospace', fontSize: '0.8rem' }}
          />
        </div>
      </div>
    </div>
  );
};

export const InteractiveBuilder: Story = {
  render: () => <SchemaBuilder />,
  parameters: {
    docs: {
      description: {
        story: 'Interactive schema builder for rapid prototyping and testing of Dynamic UI schemas.',
      },
    },
  },
};

// Pre-built Schema Templates
const templates = {
  userProfile: {
    componentId: 'user-profile-template',
    name: 'User Profile Template',
    title: 'User Profile',
    description: 'Standard user profile form',
    componentType: 'Form' as const,
    version: '1.0.0',
    fields: [
      {
        fieldKey: 'firstName',
        type: 'text' as const,
        label: 'First Name',
        required: true,
        validationRules: [
          { type: 'minLength' as const, value: 2, message: 'First name must be at least 2 characters' },
          { type: 'maxLength' as const, value: 50, message: 'First name must be less than 50 characters' },
        ],
      },
      {
        fieldKey: 'lastName',
        type: 'text' as const,
        label: 'Last Name',
        required: true,
        validationRules: [
          { type: 'minLength' as const, value: 2, message: 'Last name must be at least 2 characters' },
          { type: 'maxLength' as const, value: 50, message: 'Last name must be less than 50 characters' },
        ],
      },
      {
        fieldKey: 'email',
        type: 'email' as const,
        label: 'Email Address',
        required: true,
      },
      {
        fieldKey: 'phone',
        type: 'text' as const,
        label: 'Phone Number',
        validationRules: [
          { type: 'pattern' as const, value: '^\\+?[1-9]\\d{1,14}$', message: 'Please enter a valid phone number' },
        ],
      },
      {
        fieldKey: 'bio',
        type: 'textarea' as const,
        label: 'Biography',
        validationRules: [
          { type: 'maxLength' as const, value: 500, message: 'Biography must be less than 500 characters' },
        ],
      },
    ],
    layout: {
      spacing: 'normal' as const,
    },
  },
  contactForm: {
    componentId: 'contact-form-template',
    name: 'Contact Form Template',
    title: 'Contact Form',
    description: 'Standard contact form',
    componentType: 'Form' as const,
    version: '1.0.0',
    fields: [
      {
        fieldKey: 'name',
        type: 'text' as const,
        label: 'Your Name',
        required: true,
      },
      {
        fieldKey: 'email',
        type: 'email' as const,
        label: 'Email Address',
        required: true,
      },
      {
        fieldKey: 'subject',
        type: 'select' as const,
        label: 'Subject',
        required: true,
        options: [
          { value: 'general', label: 'General Inquiry' },
          { value: 'support', label: 'Technical Support' },
          { value: 'billing', label: 'Billing Question' },
          { value: 'feedback', label: 'Feedback' },
        ],
      },
      {
        fieldKey: 'message',
        type: 'textarea' as const,
        label: 'Message',
        required: true,
        validationRules: [
          { type: 'minLength' as const, value: 10, message: 'Message must be at least 10 characters' },
          { type: 'maxLength' as const, value: 1000, message: 'Message must be less than 1000 characters' },
        ],
      },
      {
        fieldKey: 'newsletter',
        type: 'boolean' as const,
        label: 'Subscribe to newsletter',
      },
    ],
    layout: {
      spacing: 'normal' as const,
    },
  },
};

export const SchemaTemplates: Story = {
  render: () => {
    const [selectedTemplate, setSelectedTemplate] = useState<keyof typeof templates>('userProfile');
    const [data, setData] = useState<Record<string, unknown>>({});

    return (
      <div>
        <div style={{ marginBottom: '2rem' }}>
          <h3>Schema Templates</h3>
          <p>Pre-built schema templates for common use cases.</p>
          
          <div style={{ marginBottom: '1rem' }}>
            <label>
              Select Template:
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value as keyof typeof templates)}
                style={{ marginLeft: '0.5rem', padding: '0.25rem' }}
              >
                <option value="userProfile">User Profile</option>
                <option value="contactForm">Contact Form</option>
              </select>
            </label>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            <h4>Schema JSON:</h4>
            <pre style={{ 
              background: '#f5f5f5', 
              padding: '1rem', 
              overflow: 'auto', 
              fontSize: '0.8rem',
              maxHeight: '400px',
            }}>
              {JSON.stringify(templates[selectedTemplate], null, 2)}
            </pre>
          </div>

          <div>
            <h4>Preview:</h4>
            <DynamicForm
              schema={templates[selectedTemplate]}
              initialData={data}
              onSubmit={(formData) => {
                console.log('Template form submitted:', formData);
                setData(formData);
                alert('Form submitted! Check console for data.');
              }}
            />
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Pre-built schema templates for common use cases. Use these as starting points for your own schemas.',
      },
    },
  },
};

// Field Type Reference
export const FieldTypeReference: Story = {
  render: () => {
    const fieldTypes = [
      {
        type: 'text',
        description: 'Single-line text input',
        properties: ['placeholder', 'validationRules.minLength', 'validationRules.maxLength', 'validationRules.pattern'],
        example: { fieldKey: 'name', type: 'text', label: 'Name', placeholder: 'Enter your name' },
      },
      {
        type: 'email',
        description: 'Email input with built-in validation',
        properties: ['placeholder'],
        example: { fieldKey: 'email', type: 'email', label: 'Email', placeholder: 'user@example.com' },
      },
      {
        type: 'number',
        description: 'Numeric input',
        properties: ['placeholder', 'validationRules.min', 'validationRules.max'],
        example: { 
          fieldKey: 'age', 
          type: 'number', 
          label: 'Age', 
          validationRules: [
            { type: 'min' as const, value: 0 }, 
            { type: 'max' as const, value: 120 }
          ] 
        },
      },
      {
        type: 'select',
        description: 'Dropdown selection',
        properties: ['options'],
        example: { 
          fieldKey: 'country', 
          type: 'select', 
          label: 'Country', 
          options: [
            { value: 'us', label: 'United States' },
            { value: 'ca', label: 'Canada' },
          ],
        },
      },
      {
        type: 'boolean',
        description: 'Boolean checkbox',
        properties: ['default'],
        example: { fieldKey: 'terms', type: 'boolean', label: 'I agree to the terms' },
      },
      {
        type: 'textarea',
        description: 'Multi-line text input',
        properties: ['placeholder', 'validationRules.minLength', 'validationRules.maxLength'],
        example: { fieldKey: 'description', type: 'textarea', label: 'Description' },
      },
      {
        type: 'date',
        description: 'Date picker',
        properties: ['validationRules.min', 'validationRules.max'],
        example: { fieldKey: 'birthdate', type: 'date', label: 'Birth Date' },
      },
    ];

    return (
      <div>
        <h3>Field Type Reference</h3>
        <p>Complete reference for all available field types and their properties.</p>

        <div style={{ display: 'grid', gap: '1rem' }}>
          {fieldTypes.map((fieldType) => (
            <div key={fieldType.type} style={{ border: '1px solid #eee', padding: '1rem', borderRadius: '4px' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#0066cc' }}>{fieldType.type}</h4>
              <p style={{ margin: '0 0 1rem 0', color: '#666' }}>{fieldType.description}</p>
              
              <div style={{ marginBottom: '1rem' }}>
                <strong>Available Properties:</strong>
                <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
                  {fieldType.properties.map(prop => (
                    <li key={prop} style={{ fontSize: '0.9rem' }}><code>{prop}</code></li>
                  ))}
                </ul>
              </div>

              <div>
                <strong>Example Schema:</strong>
                <pre style={{ 
                  background: '#f8f8f8', 
                  padding: '0.5rem', 
                  margin: '0.5rem 0 0 0', 
                  fontSize: '0.8rem',
                  overflow: 'auto',
                }}>
                  {JSON.stringify(fieldType.example, null, 2)}
                </pre>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Complete reference for all available field types, their properties, and usage examples.',
      },
    },
  },
}; 