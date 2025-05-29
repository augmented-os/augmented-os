/**
 * Core schema interface for UI components in the Dynamic UI system.
 * Defines the structure and configuration for dynamic forms, modals, displays, and custom components.
 */
export interface UIComponentSchema {
  /** Unique identifier for the component */
  componentId: string;
  /** Human-readable name for the component */
  name: string;
  /** Optional detailed description of the component's purpose */
  description?: string;
  /** Type of UI component to render */
  componentType: 'Form' | 'Modal' | 'Display' | 'Custom';
  /** Title or header text displayed in the component */
  title: string;
  /** Array of form fields for input components */
  fields?: FormField[];
  /** Array of action buttons available in the component */
  actions?: ActionButton[];
  /** Template string for display components with placeholder support */
  displayTemplate?: string;
  /** Layout configuration for organizing fields and sections */
  layout?: LayoutConfig;
  /** Additional custom properties for specialized components */
  customProps?: Record<string, unknown>;
  /** Version identifier for schema compatibility */
  version?: string;
}

/**
 * Configuration for individual form fields within a UI component.
 * Supports various input types, validation, and conditional visibility.
 */
export interface FormField {
  /** Unique key identifier for the field */
  fieldKey: string;
  /** Display label for the field */
  label: string;
  /** Type of input field to render */
  type: 'text' | 'number' | 'boolean' | 'select' | 'multi-select' | 'textarea' | 'date' | 'file' | 'email';
  /** Placeholder text shown when field is empty */
  placeholder?: string;
  /** Default value for the field */
  default?: string | number | boolean | string[] | null;
  /** Array of validation rules to apply to the field */
  validationRules?: (ValidationRule | string)[];
  /** Available options for select and multi-select fields */
  options?: SelectOption[];
  /** Conditional expression for when to show this field */
  visibleIf?: string;
  /** Additional help text or guidance for users */
  helpText?: string;
  /** Whether the field is required for form submission */
  required?: boolean;
}

/**
 * Configuration for action buttons within UI components.
 * Defines button behavior, styling, and conditional visibility.
 */
export interface ActionButton {
  /** Unique key identifier for the action */
  actionKey: string;
  /** Display text for the button */
  label: string;
  /** Visual style variant for the button */
  style: 'primary' | 'secondary' | 'danger';
  /** Optional confirmation message before executing the action */
  confirmation?: string;
  /** Conditional expression for when to show this button */
  visibleIf?: string;
  /** Whether the button should be disabled */
  disabled?: boolean;
}

/**
 * Option configuration for select and multi-select form fields.
 * Defines the value, display label, and availability of each option.
 */
export interface SelectOption {
  /** The actual value stored when this option is selected */
  value: string;
  /** Display text shown to the user for this option */
  label: string;
  /** Whether this option should be disabled for selection */
  disabled?: boolean;
}

/**
 * Validation rule definition for form field validation.
 * Supports common validation types with configurable values and messages.
 */
export interface ValidationRule {
  /** Type of validation to perform */
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'min' | 'max' | 'email';
  /** Value parameter for the validation rule (e.g., minimum length, regex pattern) */
  value?: string | number;
  /** Custom error message to display when validation fails */
  message?: string;
}

/**
 * Reference to a predefined validation rule by ID.
 * Allows reuse of common validation rules across multiple components.
 */
export interface ValidationRuleReference {
  /** Unique identifier for the validation rule */
  ruleId: string;
  /** Human-readable description of what the rule validates */
  description: string;
  /** Type of validation performed by this rule */
  type: string;
  /** Configuration value for the validation rule */
  value: string;
  /** Error message displayed when validation fails */
  errorMessage: string;
}

/**
 * Layout configuration for organizing form fields and UI elements.
 * Supports column layouts, custom ordering, and sectioned grouping.
 */
export interface LayoutConfig {
  /** Number of columns for form field layout */
  columns?: number;
  /** Array of form sections for grouping related fields */
  sections?: FormSection[];
  /** Spacing variant between form elements */
  spacing?: 'compact' | 'normal' | 'spacious';
  /** Custom order for field rendering (overrides default order) */
  order?: string[];
}

/**
 * Configuration for a form section that groups related fields.
 * Supports collapsible sections with custom titles and field organization.
 */
export interface FormSection {
  /** Title displayed for the section */
  title: string;
  /** Array of field keys included in this section */
  fields: string[];
  /** Whether the section can be collapsed/expanded */
  collapsible?: boolean;
  /** Whether the section is expanded by default */
  defaultExpanded?: boolean;
} 