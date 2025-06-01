import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Dynamic UI/🎯 Getting Started/Getting Started Guide',
  parameters: {
    docs: {
      page: () => (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
          <h1>Getting Started Guide</h1>
          
          <p><em>TODO: STRB-106 - Add hands-on schema creation examples with live preview</em></p>
          
          <p>Ready to create your first dynamic form? This guide will walk you through building a complete contact form using Dynamic UI schemas.</p>
          
          <h2>Your First Schema: Contact Form</h2>
          <p>Let's start with a simple contact form to understand the basics.</p>
          
          <h3>Step 1: Basic Schema Structure</h3>
          <p>Every Dynamic UI component starts with a schema. Here's the foundation:</p>
          
          <pre style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '0.9rem' }}>
{`// TODO: STRB-106 - Add live interactive example
const contactFormSchema: UIComponentSchema = {
  componentId: 'contact-form-basic',
  name: 'Contact Form',
  componentType: 'Form',
  title: 'Get in Touch',
  description: 'We'd love to hear from you!',
  fields: [
    // We'll add fields in the next step
  ],
  actions: [
    { actionKey: 'submit', label: 'Send Message', style: 'primary' },
    { actionKey: 'cancel', label: 'Cancel', style: 'secondary' }
  ]
};`}
          </pre>
          
          <h3>Step 2: Adding Your First Field</h3>
          <p>Let's add a simple text field for the user's name:</p>
          
          <pre style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '0.9rem' }}>
{`fields: [
  {
    fieldKey: 'name',
    label: 'Your Name',
    type: 'text',
    placeholder: 'Enter your full name',
    required: true,
    validationRules: [
      { type: 'required', message: 'Name is required' },
      { type: 'minLength', value: 2, message: 'Name must be at least 2 characters' }
    ]
  }
]`}
          </pre>
          
          <p><strong>What's happening here?</strong></p>
          <ul>
            <li><code>fieldKey</code>: Unique identifier for this field</li>
            <li><code>label</code>: Display text for the field</li>
            <li><code>type</code>: Determines which input component to render</li>
            <li><code>required</code>: Makes the field mandatory</li>
            <li><code>validationRules</code>: Defines validation logic</li>
          </ul>
          
          <h2>Field Types Reference</h2>
          <p>Dynamic UI supports these field types out of the box:</p>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', margin: '1rem 0' }}>
            <thead>
              <tr style={{ background: '#f5f5f5' }}>
                <th style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'left' }}>Type</th>
                <th style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'left' }}>Description</th>
                <th style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'left' }}>Example Use Case</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}><code>text</code></td>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Single-line text input</td>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Names, titles, short answers</td>
              </tr>
              <tr>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}><code>email</code></td>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Email input with validation</td>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Email addresses</td>
              </tr>
              <tr>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}><code>number</code></td>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Numeric input</td>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Ages, quantities, prices</td>
              </tr>
              <tr>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}><code>boolean</code></td>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Checkbox</td>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Agreements, preferences</td>
              </tr>
              <tr>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}><code>select</code></td>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Dropdown selection</td>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Categories, status values</td>
              </tr>
              <tr>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}><code>textarea</code></td>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Multi-line text</td>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Messages, descriptions</td>
              </tr>
            </tbody>
          </table>
          
          <h2>Adding Conditional Logic</h2>
          <p>Make fields appear based on other field values:</p>
          
          <pre style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '0.9rem' }}>
{`{
  fieldKey: 'phone',
  label: 'Phone Number',
  type: 'text',
  visibleIf: 'subject === "support"',  // Only show for support requests
  validationRules: [
    { type: 'required', message: 'Phone required for support requests' }
  ]
}`}
          </pre>
          
          <h2>Next Steps</h2>
          <p>🎉 <strong>Congratulations!</strong> You've created your first dynamic form. Here's what to explore next:</p>
          
          <h3>Intermediate Topics</h3>
          <ul>
            <li><strong>Schema Design Guide</strong> - Advanced schema patterns</li>
            <li><strong>Validation System</strong> - Complex validation rules</li>
          </ul>
          
          <h3>Real-World Examples</h3>
          <ul>
            <li><strong>Task Management</strong> - See Dynamic UI in action</li>
            <li><strong>Business Workflows</strong> - Complete business processes</li>
          </ul>
          
          <h3>Interactive Tools</h3>
          <ul>
            <li><strong>Schema Builder</strong> - Build schemas visually</li>
          </ul>
          
          <h2>Common Questions</h2>
          
          <h3>Q: How do I handle form submission?</h3>
          <p>A: The <code>onSubmit</code> callback receives all form data as a JavaScript object. You can then send it to your API or update your Redux state.</p>
          
          <h3>Q: Can I customize the styling?</h3>
          <p>A: Yes! Dynamic UI uses your existing component library and CSS classes. You can also add custom styling through the <code>className</code> prop.</p>
          
          <h3>Q: How do I add custom field types?</h3>
          <p>A: Check out the Advanced Patterns for extending the system with custom components.</p>
          
          <hr style={{ margin: '2rem 0' }} />
          <p style={{ fontStyle: 'italic', textAlign: 'center' }}>Ready to build more sophisticated forms? Continue to the Implementation Guides!</p>
        </div>
      ),
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const GettingStartedGuide: Story = {}; 