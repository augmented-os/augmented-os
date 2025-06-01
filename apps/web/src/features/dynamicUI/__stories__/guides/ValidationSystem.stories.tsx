import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Dynamic UI/📖 Implementation Guides/Validation System',
  parameters: {
    docs: {
      page: () => (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
          <h1>Validation System</h1>
          
          <p><em>TODO: STRB-108 - Add live validation examples and complex validation scenarios</em></p>
          
          <p>A comprehensive guide to implementing robust validation in your Dynamic UI forms.</p>
          
          <h2>Validation Types</h2>
          
          <h3>Built-in Validators</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', margin: '1rem 0' }}>
            <thead>
              <tr style={{ background: '#f5f5f5' }}>
                <th style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'left' }}>Type</th>
                <th style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'left' }}>Purpose</th>
                <th style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'left' }}>Parameters</th>
                <th style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'left' }}>Example</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}><code>required</code></td>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Field must have value</td>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>message</td>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Name field</td>
              </tr>
              <tr>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}><code>email</code></td>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Valid email format</td>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>message</td>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Contact email</td>
              </tr>
              <tr>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}><code>minLength</code></td>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Minimum character count</td>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>value, message</td>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Password strength</td>
              </tr>
              <tr>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}><code>maxLength</code></td>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Maximum character count</td>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>value, message</td>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Tweet limit</td>
              </tr>
              <tr>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}><code>pattern</code></td>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Regular expression match</td>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>value, message</td>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Phone format</td>
              </tr>
              <tr>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}><code>min/max</code></td>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Number range</td>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>value, message</td>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Age limits</td>
              </tr>
            </tbody>
          </table>
          
          <h2>Validation Examples</h2>
          
          <h3>Basic Field Validation</h3>
          <pre style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '0.9rem' }}>
{`// TODO: STRB-108 - Add interactive validation examples
{
  fieldKey: 'email',
  label: 'Email Address',
  type: 'email',
  required: true,
  validationRules: [
    { type: 'required', message: 'Email is required' },
    { type: 'email', message: 'Please enter a valid email address' }
  ]
},
{
  fieldKey: 'password',
  label: 'Password',
  type: 'password',
  required: true,
  validationRules: [
    { type: 'required', message: 'Password is required' },
    { type: 'minLength', value: 8, message: 'Password must be at least 8 characters' },
    { 
      type: 'pattern', 
      value: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]',
      message: 'Password must include uppercase, lowercase, number, and special character'
    }
  ]
}`}
          </pre>
          
          <h3>Conditional Validation</h3>
          <pre style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '0.9rem' }}>
{`// Validate based on other field values
{
  fieldKey: 'businessTaxId',
  label: 'Business Tax ID',
  type: 'text',
  visibleIf: 'accountType === "business"',
  validationRules: [
    // Only required when visible
    { type: 'required', message: 'Tax ID is required for business accounts' },
    { type: 'pattern', value: '^\\d{2}-\\d{7}$', message: 'Format: 12-3456789' }
  ]
}`}
          </pre>
          
          <h2>Custom Validation</h2>
          
          <h3>Complex Business Rules</h3>
          <pre style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '0.9rem' }}>
{`// TODO: STRB-108 - Implement custom validation support
interface CustomValidationRule {
  type: 'custom';
  validator: (value: any, formData: Record<string, any>) => boolean | string;
  message?: string;
}

// Example: Age validation with birth date
{
  fieldKey: 'birthDate',
  label: 'Birth Date',
  type: 'date',
  validationRules: [
    { type: 'required', message: 'Birth date is required' },
    {
      type: 'custom',
      validator: (value) => {
        const age = new Date().getFullYear() - new Date(value).getFullYear();
        return age >= 18 || 'Must be at least 18 years old';
      }
    }
  ]
}`}
          </pre>
          
          <h2>Cross-Field Validation</h2>
          
          <h3>Password Confirmation</h3>
          <pre style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '0.9rem' }}>
{`// TODO: STRB-108 - Implement cross-field validation
{
  fieldKey: 'confirmPassword',
  label: 'Confirm Password',
  type: 'password',
  validationRules: [
    { type: 'required', message: 'Please confirm your password' },
    {
      type: 'custom',
      validator: (value, formData) => {
        return value === formData.password || 'Passwords do not match';
      }
    }
  ]
}`}
          </pre>
          
          <h2>Validation Timing</h2>
          
          <h3>When Validation Occurs</h3>
          <ul>
            <li><strong>On Blur</strong>: Field validation runs when user leaves the field</li>
            <li><strong>On Change</strong>: Real-time validation for immediate feedback</li>
            <li><strong>On Submit</strong>: Full form validation before submission</li>
            <li><strong>Debounced</strong>: Delayed validation to avoid excessive API calls</li>
          </ul>
          
          <h3>Validation Configuration</h3>
          <pre style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '0.9rem' }}>
{`// TODO: STRB-108 - Add validation timing configuration
const validationConfig = {
  validateOnBlur: true,      // Validate when field loses focus
  validateOnChange: false,   // Validate on every keystroke
  debounceMs: 300,          // Delay for onChange validation
  showErrorsOnMount: false, // Show validation errors immediately
  clearErrorsOnFocus: true  // Clear errors when user starts typing
};`}
          </pre>
          
          <h2>Error Display</h2>
          
          <h3>Error Message Strategies</h3>
          <ul>
            <li><strong>Inline Errors</strong>: Show errors directly below each field</li>
            <li><strong>Summary Errors</strong>: Display all errors at the top of the form</li>
            <li><strong>Toast Notifications</strong>: Show errors in temporary notifications</li>
            <li><strong>Progressive Enhancement</strong>: Start with basic validation, add sophistication</li>
          </ul>
          
          <h2>Performance Considerations</h2>
          
          <h3>Optimization Strategies</h3>
          <ul>
            <li><strong>Debounced Validation</strong>: Avoid excessive validation calls</li>
            <li><strong>Memoized Validators</strong>: Cache validation results when possible</li>
            <li><strong>Lazy Validation</strong>: Only validate visible/changed fields</li>
            <li><strong>Async Validation</strong>: Handle server-side validation efficiently</li>
          </ul>
          
          <h2>Testing Validation</h2>
          
          <h3>Validation Test Cases</h3>
          <pre style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '0.9rem' }}>
{`// TODO: STRB-108 - Add comprehensive validation tests
describe('Dynamic UI Validation', () => {
  it('validates required fields', () => {
    // Test required field validation
  });
  
  it('validates email format', () => {
    // Test email validation
  });
  
  it('validates conditional fields', () => {
    // Test visibleIf validation
  });
  
  it('validates cross-field dependencies', () => {
    // Test password confirmation
  });
});`}
          </pre>
          
          <h2>Next Steps</h2>
          <ul>
            <li><strong>Performance Guide</strong> - Optimize validation performance</li>
            <li><strong>Testing Guide</strong> - Test validation scenarios</li>
            <li><strong>Business Workflows</strong> - See validation in complex forms</li>
          </ul>
          
          <hr style={{ margin: '2rem 0' }} />
          <p style={{ fontStyle: 'italic', textAlign: 'center' }}>Robust validation ensures great user experience and data quality!</p>
        </div>
      ),
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const ValidationSystem: Story = {}; 