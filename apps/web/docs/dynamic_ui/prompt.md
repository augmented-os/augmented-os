# Dynamic UI System Implementation Prompt

## Project Overview

You need to implement a dynamic UI system for AugmentedOS that renders user interfaces from JSON schemas. This system is used for manual task interactions, workflow status visualization, data input/validation, and result presentation. The approach should be simple and pragmatic - JSON schemas are consumed directly by React components without complex "rendering engines."

## Core Architecture

### Simplified Approach
- **No complex rendering engines** - JSON schemas are passed directly to React components
- **Component type mapping** - Simple switch/lookup to determine which component to render
- **Expression evaluation** - Basic utility for conditional logic (`visibleIf` expressions)
- **Template interpolation** - Simple {{variable}} replacement for display components
- **Form state management** - Standard React form handling with validation

### Key Components Needed
1. **DynamicUIRenderer** - Main component that takes JSON schema and renders appropriate UI
2. **FormRenderer** - Handles form-type components with validation
3. **DisplayRenderer** - Handles display-type components with template interpolation
4. **ModalRenderer** - Handles modal-type components
5. **ExpressionEvaluator** - Utility for evaluating `visibleIf` conditions
6. **TemplateEngine** - Simple {{variable}} interpolation for display templates

## JSON Schema Structure

### Component Schema
```json
{
  "componentId": "string",
  "name": "string", 
  "description": "string",
  "componentType": "Form | Modal | Display | Custom",
  "title": "string",
  "fields": [
    {
      "fieldKey": "string",
      "label": "string", 
      "type": "text | number | boolean | select | multi-select | date | file | textarea",
      "options": [{"value": "string", "label": "string"}],
      "placeholder": "string",
      "default": "any",
      "validationRules": ["string"],
      "helpText": "string",
      "visibleIf": "string"
    }
  ],
  "layout": {
    "columns": "number",
    "order": ["string"],
    "sections": [{"title": "string", "fields": ["string"]}]
  },
  "actions": [
    {
      "actionKey": "string",
      "label": "string", 
      "style": "primary | secondary | danger",
      "confirmation": "string",
      "visibleIf": "string"
    }
  ],
  "displayTemplate": "string",
  "customProps": {}
}
```

### Validation Rules Schema
```json
{
  "ruleId": "string",
  "description": "string",
  "type": "regex | function | range | set", 
  "value": "string",
  "errorMessage": "string"
}
```

## Component Types & Examples

### 1. Form Components
**Purpose**: Collect user input with validation
**Example**: Approval forms, data entry forms, decision forms

```json
{
  "componentId": "approval-form",
  "componentType": "Form", 
  "title": "Review Request",
  "fields": [
    {
      "fieldKey": "decision",
      "label": "Decision",
      "type": "select",
      "options": [
        {"value": "approve", "label": "Approve"},
        {"value": "reject", "label": "Reject"},
        {"value": "more_info", "label": "Request More Information"}
      ],
      "validationRules": ["required"]
    },
    {
      "fieldKey": "comments", 
      "label": "Comments",
      "type": "textarea",
      "placeholder": "Provide any additional comments...",
      "validationRules": ["required"],
      "visibleIf": "decision === 'reject' || decision === 'more_info'"
    }
  ],
  "actions": [
    {
      "actionKey": "submit",
      "label": "Submit Decision", 
      "style": "primary",
      "confirmation": "Are you sure you want to submit this decision?"
    }
  ]
}
```

### 2. Display Components  
**Purpose**: Present information with atomic display components or template interpolation (legacy)
**Example**: Data tables, status displays, data presentations

Modern atomic display component (recommended):
```json
{
  "componentId": "invoice-summary",
  "componentType": "Display",
  "customProps": {
    "displayType": "card",
    "fields": [
      {"key": "invoice_number", "label": "Invoice"},
      {"key": "amount", "label": "Amount"},
      {"key": "status", "label": "Status"},
      {"key": "due_date", "label": "Due Date"}
    ]
  },
  "actions": [
    {
      "actionKey": "view_details",
      "label": "View Full Details",
      "style": "secondary"
    }
  ]
}
```

Legacy display template (deprecated):
```json
{
  "componentId": "invoice-summary",
  "componentType": "Display",
  "title": "Invoice {{data.invoice_number}}",
  "displayTemplate": "<div class='summary'><p>Amount: {{data.currency}}{{data.amount}}</p><p>Status: {{data.status}}</p><p>Due Date: {{formatDate(data.due_date)}}</p></div>",
  "actions": [
    {
      "actionKey": "view_details",
      "label": "View Full Details",
      "style": "secondary"
    }
  ]
}
```

### 3. Modal Components
**Purpose**: Focused interactions in overlay dialogs
**Example**: Confirmation dialogs, quick edit forms, error displays

### 4. Custom Components
**Purpose**: Specialized components for specific needs
**Example**: File uploaders, rich text editors, map selectors

## Implementation Requirements

### Core Features
1. **Schema-driven rendering** - Components generated from JSON definitions
2. **Conditional logic** - Fields/actions show/hide based on `visibleIf` expressions
3. **Form validation** - Real-time validation with error display
4. **Template interpolation** - {{variable}} replacement in display templates
5. **Action handling** - Button clicks trigger callbacks with action data
6. **Responsive design** - Works on desktop and mobile
7. **Accessibility** - WCAG 2.1 AA compliance

### Technical Stack
- **React** with TypeScript
- **Form handling** - React Hook Form or similar
- **Styling** - CSS modules, styled-components, or Tailwind CSS
- **Validation** - Yup, Zod, or built-in validation
- **State management** - React state (useState/useReducer) or Redux if needed

### Key Utilities Needed

#### ExpressionEvaluator
```typescript
// Evaluates simple expressions like "decision === 'reject'"
function evaluateExpression(expression: string, context: Record<string, any>): boolean
```

#### TemplateEngine  
```typescript
// Replaces {{variable}} with values from context
function interpolateTemplate(template: string, context: Record<string, any>): string
```

#### ValidationEngine
```typescript
// Validates field values against validation rules
function validateField(value: any, rules: string[], validationRules: ValidationRule[]): string[]
```

## Component Architecture

### Main Components
```
DynamicUIRenderer
├── FormRenderer
│   ├── DynamicField (text, select, textarea, etc.)
│   ├── ValidationDisplay
│   └── ActionButtons
├── DisplayRenderer  
│   ├── TemplateRenderer
│   └── ActionButtons
├── ModalRenderer
│   └── (wraps other renderers)
└── CustomRenderer
    └── (extensible for custom components)
```

### Props Interface
```typescript
interface DynamicUIRendererProps {
  schema: UIComponentSchema;
  data?: Record<string, any>;
  onAction?: (actionKey: string, formData?: any) => void;
  onFieldChange?: (fieldKey: string, value: any) => void;
  validationRules?: ValidationRule[];
  className?: string;
}
```

## Validation System

### Built-in Validation Rules
- `required` - Field must have a value
- `email` - Must be valid email format  
- `minLength` - Minimum string length
- `maxLength` - Maximum string length
- `pattern` - Must match regex pattern
- `min` - Minimum numeric value
- `max` - Maximum numeric value
- `oneOf` - Must be one of specified values

### Custom Validation Rules
Support for custom validation functions and regex patterns defined in the validation rules schema.

## Usage Examples

### Basic Form Usage
```typescript
const approvalSchema = { /* approval form schema */ };
const validationRules = [ /* validation rules */ ];

<DynamicUIRenderer 
  schema={approvalSchema}
  validationRules={validationRules}
  onAction={(actionKey, formData) => {
    if (actionKey === 'submit') {
      submitApproval(formData);
    }
  }}
/>
```

### Display Component Usage  
```typescript
const invoiceSchema = { /* invoice display schema */ };
const invoiceData = { invoice_number: 'INV-001', amount: 1500, currency: '$' };

<DynamicUIRenderer
  schema={invoiceSchema} 
  data={invoiceData}
  onAction={(actionKey) => {
    if (actionKey === 'view_details') {
      showInvoiceDetails();
    }
  }}
/>
```

## Development Approach

### Phase 1: Core Foundation
1. Create basic DynamicUIRenderer component
2. Implement FormRenderer with simple field types (text, select, textarea)
3. Add basic validation support
4. Create simple action handling

### Phase 2: Enhanced Features  
1. Add DisplayRenderer with template interpolation
2. Implement conditional logic (visibleIf)
3. Add more field types (date, file, number, boolean)
4. Enhance validation with custom rules

### Phase 3: Advanced Features
1. Add ModalRenderer
2. Implement layout system (columns, sections)
3. Add CustomRenderer extensibility
4. Performance optimizations

### Phase 4: Polish & Production
1. Comprehensive testing
2. Accessibility improvements  
3. Documentation and examples
4. Performance monitoring

## Success Criteria

### Functional Requirements
- ✅ Renders forms from JSON schemas
- ✅ Supports all specified field types
- ✅ Validates input with real-time feedback
- ✅ Handles conditional field visibility
- ✅ Interpolates templates for display components
- ✅ Triggers action callbacks correctly
- ✅ Responsive on all screen sizes

### Non-Functional Requirements  
- ✅ Accessible (WCAG 2.1 AA)
- ✅ Fast rendering (<100ms for typical forms)
- ✅ Type-safe with TypeScript
- ✅ Well-documented with examples
- ✅ Extensible for custom components
- ✅ Testable with unit tests

## Key Design Principles

1. **Simplicity over complexity** - Avoid over-engineering
2. **JSON schema drives everything** - No complex compilation steps
3. **React patterns** - Use standard React patterns and hooks
4. **Extensibility** - Easy to add new field types and components
5. **Performance** - Efficient rendering and re-rendering
6. **Developer experience** - Clear APIs and good TypeScript support
7. **User experience** - Intuitive, accessible, and responsive

## Testing Strategy

### Unit Tests
- Component rendering with various schemas
- Validation logic
- Expression evaluation
- Template interpolation
- Action handling

### Integration Tests  
- Complete form workflows
- Complex conditional logic
- Multi-step forms
- Error handling scenarios

### Accessibility Tests
- Keyboard navigation
- Screen reader compatibility
- Color contrast
- Focus management

This implementation should result in a clean, maintainable, and extensible dynamic UI system that meets the requirements without unnecessary complexity. 