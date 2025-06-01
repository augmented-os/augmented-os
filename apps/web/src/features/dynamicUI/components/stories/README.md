# Dynamic UI Component Stories

This directory contains comprehensive Storybook stories for the Dynamic UI system components. These stories demonstrate the capabilities, configurations, and edge cases of each component.

## Overview

The Dynamic UI system provides a flexible framework for rendering forms, displays, and other UI components based on schema configurations. The stories showcase:

- **Form Components**: Interactive forms with validation, sections, and conditional logic
- **Display Components**: Data presentation with templates and actions
- **Orchestration Components**: Main renderer and error handling
- **Error Handling**: Comprehensive error boundary scenarios

## Story Files

### 1. FormSection.stories.tsx

**Purpose**: Demonstrates the FormSection component that groups related fields with optional collapsible functionality.

**Key Stories**:
- `BasicSection`: Simple section with personal information fields
- `WithValidationErrors`: Shows error states and validation feedback
- `CollapsibleExpanded/Collapsed`: Demonstrates collapsible sections
- `WithConditionalFields`: Shows conditional field visibility
- `MixedFieldTypes`: Complex section with various field types
- `EmptySection`: Edge case with no fields

**Use Cases**:
- Organizing form fields into logical groups
- Creating collapsible sections for optional information
- Handling validation errors at the section level
- Implementing conditional field visibility

### 2. FormActions.stories.tsx

**Purpose**: Showcases the FormActions component that renders action buttons with different styles and behaviors.

**Key Stories**:
- `BasicActions`: Standard submit/cancel button configuration
- `SubmittingState`: Shows loading states during form submission
- `DifferentStyles`: Primary, secondary, and danger button variants
- `WithConfirmation`: Demonstrates confirmation dialogs for destructive actions
- `ConditionalVisibility`: Shows buttons based on form state and user roles
- `WorkflowSteps`: Multi-step form navigation buttons
- `DisabledActions`: Disabled button states

**Use Cases**:
- Form submission and cancellation
- Workflow navigation (previous/next steps)
- Conditional actions based on user permissions
- Confirmation dialogs for destructive operations

### 3. DynamicForm.stories.tsx

**Purpose**: Demonstrates the main DynamicForm component that renders complete forms based on schema configuration.

**Key Stories**:
- `SimpleContactForm`: Basic contact form with validation
- `ComplexJobApplication`: Multi-section job application with various field types
- `ConditionalLogic`: Event registration with conditional fields
- `AsyncValidationForm`: User registration with complex validation
- `LoadingState/ErrorState`: Handling loading and error scenarios

**Use Cases**:
- Contact forms and inquiries
- Job applications and registrations
- Multi-step workflows
- Forms with complex validation requirements
- Dynamic field visibility based on user input

### 4. DynamicUIRenderer.stories.tsx

**Purpose**: Showcases the main orchestration component that routes to appropriate renderers based on componentType.

**Key Stories**:
- `ContactForm/UserRegistrationForm`: Form component rendering
- `UserProfileDisplay/TaskListDisplay`: Display component rendering
- `WorkflowDraftState/PendingReview`: Workflow states with conditional actions
- `LoadingState/ErrorState`: System state handling
- `UnsupportedModalType/CustomType`: Placeholder for unimplemented types

**Use Cases**:
- Single entry point for all Dynamic UI components
- State management for conditional rendering
- Workflow and approval processes
- Error handling and graceful degradation

### 5. DynamicUIErrorBoundary.stories.tsx

**Purpose**: Demonstrates comprehensive error handling with graceful degradation.

**Key Stories**:
- `WorkingComponent`: Normal operation without errors
- `DefaultErrorFallback`: Standard error display
- `CustomErrorFallback`: Custom error handling UI
- `NetworkError/ValidationError`: Specific error types
- `NestedErrorBoundaries`: Isolated error handling
- `RecoveryScenario`: Component recovery after errors

**Use Cases**:
- Graceful error handling in production
- Custom error displays for different error types
- Isolated error boundaries for complex UIs
- Development debugging and error reporting

## Schema Examples

### Form Schema Structure
```typescript
const formSchema: UIComponentSchema = {
  componentId: 'example-form',
  name: 'Example Form',
  title: 'Form Title',
  description: 'Form description',
  componentType: 'Form',
  fields: [
    {
      fieldKey: 'fieldName',
      label: 'Field Label',
      type: 'text',
      required: true,
      validationRules: [
        { type: 'required', message: 'Field is required' }
      ]
    }
  ],
  actions: [
    { actionKey: 'submit', label: 'Submit', style: 'primary' }
  ]
};
```

### Display Schema Structure
```typescript
const displaySchema: UIComponentSchema = {
  componentId: 'example-display',
  name: 'Example Display',
  title: 'Display Title',
  componentType: 'Display',
  displayTemplate: `
    <div>
      <h2>{{title}}</h2>
      <p>{{description}}</p>
    </div>
  `,
  actions: [
    { actionKey: 'edit', label: 'Edit', style: 'primary' }
  ]
};
```

## Field Types Supported

- **text**: Single-line text input
- **email**: Email input with validation
- **number**: Numeric input
- **boolean**: Checkbox input
- **select**: Single-select dropdown
- **multi-select**: Multiple selection checkboxes
- **textarea**: Multi-line text input
- **date**: Date picker
- **file**: File upload with drag-and-drop

## Validation Rules

- **required**: Field must have a value
- **minLength/maxLength**: String length validation
- **min/max**: Numeric range validation
- **email**: Email format validation
- **pattern**: Regular expression validation

## Conditional Logic

Fields and actions support conditional visibility using the `visibleIf` property:

```typescript
{
  fieldKey: 'teamSize',
  label: 'Team Size',
  type: 'number',
  visibleIf: 'isManager == true'
}
```

Supported operators:
- `==` (equals)
- `!=` (not equals)
- `&&` (and)
- `||` (or)

## Layout Configuration

Forms support various layout options:

- **Sections**: Group related fields with optional collapsible behavior
- **Columns**: Multi-column layouts
- **Spacing**: Compact, normal, or spacious spacing
- **Custom Order**: Override default field ordering

## Best Practices

1. **Schema Design**: Keep schemas focused and logical
2. **Validation**: Provide clear, helpful error messages
3. **Conditional Logic**: Use sparingly to avoid complexity
4. **Error Handling**: Always wrap components in error boundaries
5. **Testing**: Use stories to test edge cases and error scenarios

## Development Workflow

1. **Design Schema**: Define the component structure and behavior
2. **Create Stories**: Build comprehensive stories covering all scenarios
3. **Test Interactions**: Verify form submissions, validations, and actions
4. **Handle Errors**: Test error scenarios and recovery
5. **Document Usage**: Update stories with real-world examples

## Integration Examples

### Basic Form Integration
```typescript
<DynamicUIRenderer
  schema={contactFormSchema}
  initialData={{}}
  onSubmit={(data) => console.log('Form submitted:', data)}
  onCancel={() => console.log('Form cancelled')}
/>
```

### Display with Actions
```typescript
<DynamicUIRenderer
  schema={userProfileSchema}
  data={userData}
  onAction={(actionKey) => console.log('Action triggered:', actionKey)}
/>
```

### Error Boundary Wrapper
```typescript
<DynamicUIErrorBoundary fallback={CustomErrorComponent}>
  <DynamicUIRenderer schema={schema} />
</DynamicUIErrorBoundary>
```

This comprehensive story collection ensures that all Dynamic UI components are thoroughly tested and documented, providing developers with clear examples of how to use the system effectively. 