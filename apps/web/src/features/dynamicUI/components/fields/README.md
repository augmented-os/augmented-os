# Dynamic UI Field Components

This directory contains form field components and their Storybook stories for the Dynamic UI system.

## Components

| Component | File | Purpose |
|-----------|------|---------|
| **TextInput** | `TextInput.tsx` | Single-line text input with validation |
| **NumberInput** | `NumberInput.tsx` | Numeric input with decimal support |
| **EmailInput** | `EmailInput.tsx` | Email input with built-in validation |
| **TextareaInput** | `TextareaInput.tsx` | Multi-line text input |
| **SelectInput** | `SelectInput.tsx` | Single-select dropdown |
| **MultiSelectInput** | `MultiSelectInput.tsx` | Multi-select checkbox list |
| **BooleanInput** | `BooleanInput.tsx` | Checkbox for boolean values |
| **DateInput** | `DateInput.tsx` | Date picker input |
| **FileInput** | `FileInput.tsx` | Drag-and-drop file upload |

## Storybook Stories

Each component has comprehensive Storybook stories that demonstrate:

- **Default state** - Basic component with minimal props
- **With value** - Pre-filled component state
- **Error state** - Validation error scenarios
- **Required field** - Required validation behavior
- **Help text** - Guidance and instructions
- **Edge cases** - Component-specific scenarios

### Story Files
- `TextInput.stories.tsx` - Text input variations and validation
- `NumberInput.stories.tsx` - Number input with decimal/integer examples
- `EmailInput.stories.tsx` - Email validation and format checking
- `TextareaInput.stories.tsx` - Multi-line text scenarios
- `SelectInput.stories.tsx` - Dropdown with various option sets
- `MultiSelectInput.stories.tsx` - Multiple selection behaviors
- `BooleanInput.stories.tsx` - Checkbox states and groupings
- `DateInput.stories.tsx` - Date picker with different date scenarios
- `FileInput.stories.tsx` - File upload with type restrictions

## Usage

All components follow consistent prop patterns:

```typescript
interface BaseFieldProps {
  id: string;
  label: string;
  value: any;
  onChange: (value: any) => void;
  required?: boolean;
  error?: string;
  helpText?: string;
  placeholder?: string;
}
```

## Development

To view the stories in Storybook:

```bash
cd apps/web
npm run storybook
```

Stories are organized under `Dynamic UI/Atomic Components/Form Fields/` in the Storybook navigation. 