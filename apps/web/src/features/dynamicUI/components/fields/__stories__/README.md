# Dynamic UI Field Component Stories

This directory contains comprehensive Storybook stories for all Dynamic UI field components. These stories demonstrate the various states, configurations, and use cases for each field type.

## Available Field Components

### Basic Input Fields

#### TextInput
- **File**: `TextInput.stories.tsx`
- **Purpose**: Single-line text input with validation support
- **Key Stories**: Default, WithValue, WithError, Required, WithHelpText, LongLabel
- **Features**: Text/email type support, placeholder text, validation states

#### NumberInput
- **File**: `NumberInput.stories.tsx`
- **Purpose**: Numeric input with integer and decimal support
- **Key Stories**: Default, WithDecimalValue, WithNegativeNumber, ValidationScenario
- **Features**: Number validation, large number handling, empty state support

#### EmailInput
- **File**: `EmailInput.stories.tsx`
- **Purpose**: Email input with built-in validation and visual feedback
- **Key Stories**: ValidEmail, InvalidEmail, MultipleValidationStates
- **Features**: Real-time email validation, email icon, format checking

#### TextareaInput
- **File**: `TextareaInput.stories.tsx`
- **Purpose**: Multi-line text input for longer content
- **Key Stories**: Default, LongText, ValidationScenario
- **Features**: Resizable height, multi-line support, character validation

### Selection Fields

#### SelectInput
- **File**: `SelectInput.stories.tsx`
- **Purpose**: Single-select dropdown with keyboard navigation
- **Key Stories**: Default, WithDisabledOptions, ManyOptions, EmptyOptions
- **Features**: Option groups, disabled options, placeholder support

#### MultiSelectInput
- **File**: `MultiSelectInput.stories.tsx`
- **Purpose**: Multi-select checkbox list with scrollable options
- **Key Stories**: WithSelectedValues, AllSelected, ValidationScenario
- **Features**: Multiple selection, selection count, disabled options

#### BooleanInput
- **File**: `BooleanInput.stories.tsx`
- **Purpose**: Checkbox input for boolean values
- **Key Stories**: Default, Checked, MultipleCheckboxes, PermissionSettings
- **Features**: Accessible keyboard navigation, validation states

### Specialized Fields

#### DateInput
- **File**: `DateInput.stories.tsx`
- **Purpose**: Date picker with native browser support
- **Key Stories**: FutureDate, PastDate, TodayDate, DateRangeContext
- **Features**: Date validation, format handling, special date scenarios

#### FileInput
- **File**: `FileInput.stories.tsx`
- **Purpose**: Drag-and-drop file upload with type restrictions
- **Key Stories**: WithMultipleFiles, ImageOnly, DocumentsOnly, ValidationError
- **Features**: File type filtering, multiple file support, drag-and-drop

## Story Structure

Each story file follows a consistent structure:

### Meta Configuration
```typescript
const meta: Meta<typeof Component> = {
  title: 'DynamicUI/Fields/ComponentName',
  component: Component,
  parameters: {
    layout: 'centered',
    docs: { description: { component: '...' } }
  },
  tags: ['autodocs'],
  argTypes: { /* control definitions */ }
};
```

### Common Story Types

1. **Default**: Basic component with minimal props
2. **WithValue**: Component with pre-filled value
3. **WithError**: Error state demonstration
4. **Required**: Required field validation
5. **WithHelpText**: Help text guidance
6. **ValidationScenario**: Complex validation examples

### Shared Utilities

The `FieldStories.utils.ts` file provides:

- **Common configurations**: Shared meta settings and decorators
- **ArgTypes**: Reusable control definitions for different field types
- **Mock data**: Realistic option sets for select components
- **Validation examples**: Common error messages and help text
- **TypeScript interfaces**: Type definitions for story arguments
- **Utility functions**: File list creators, date utilities, formatters

## Usage Examples

### Basic Field Story
```typescript
export const Default: Story = {
  args: {
    id: 'field-id',
    label: 'Field Label',
    value: '',
    placeholder: 'Enter value',
  },
};
```

### Validation Story
```typescript
export const WithError: Story = {
  args: {
    id: 'field-error',
    label: 'Field Label',
    value: '',
    required: true,
    error: 'This field is required',
  },
};
```

### Complex Render Story
```typescript
export const MultipleStates: Story = {
  render: () => (
    <div className="space-y-6">
      <Component id="1" label="State 1" value="value1" onChange={() => {}} />
      <Component id="2" label="State 2" value="value2" onChange={() => {}} />
    </div>
  ),
};
```

## Testing Coverage

Each story covers:

- ✅ Default state
- ✅ Filled state
- ✅ Error state
- ✅ Required validation
- ✅ Help text display
- ✅ Accessibility features
- ✅ Edge cases and validation scenarios

## Development Guidelines

When adding new field components:

1. Create a new `.stories.tsx` file following the naming convention
2. Use the shared utilities from `FieldStories.utils.ts`
3. Include all standard story types (Default, WithError, Required, etc.)
4. Add component-specific stories for unique features
5. Document any special behaviors or edge cases
6. Ensure accessibility compliance in all stories

## Storybook Integration

These stories are automatically discovered by Storybook and organized under:
```
DynamicUI/Fields/
├── TextInput
├── NumberInput
├── EmailInput
├── TextareaInput
├── SelectInput
├── MultiSelectInput
├── BooleanInput
├── DateInput
└── FileInput
```

Each component includes:
- Interactive controls for all props
- Auto-generated documentation
- Accessibility testing
- Visual regression testing support 