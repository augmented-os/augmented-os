# UI Components

## Overview

UI Components provide dynamic user interfaces for:

* Manual task interactions
* Workflow status visualization
* Data input and validation
* Result presentation
* Error handling and correction

They are designed to be:

* Reusable across different tasks and workflows
* Configurable through JSON definitions
* Responsive and accessible
* Conditional based on context and state
* Themeable with consistent styling

## UI Component Structure

```json
{
  "componentId": "string",    // Unique identifier
  "name": "string",           // Human-readable name
  "description": "string",    // Detailed description
  "componentType": "Form | Modal | Display | Custom", // Type of component
  "title": "string",          // Title or header for the UI
  "fields": [                 // For forms or input components
    {
      "fieldKey": "string",   // Key name for the field
      "label": "string",      // Label to display
      "type": "text | number | boolean | select | multi-select | date | file | etc.",
      "options": [            // For select or multi-select
         { "value": "string", "label": "string" }
      ],
      "placeholder": "string", // Placeholder text
      "default": "any",       // Default value
      "validationRules": [    // References to validation rules
        "string"
      ],
      "helpText": "string",   // Additional guidance for users
      "visibleIf": "string"   // Condition for when to show this field
    }
  ],
  "layout": {                 // Optional layout configuration
    "columns": "number",      // Number of columns for form layout
    "order": ["string"],      // Field order if not sequential
    "sections": [             // Grouping of fields
      {
        "title": "string",
        "fields": ["string"]
      }
    ]
  },
  "actions": [                // Define action buttons
    {
      "actionKey": "string",  // Identifier for the action
      "label": "string",      // Button label
      "style": "primary | secondary | danger",
      "confirmation": "string", // Confirmation prompt
      "visibleIf": "string"   // Condition for when to show this action
    }
  ],
  "displayTemplate": "string", // For display components, template with placeholders (DEPRECATED)
  "customProps": {            // Additional properties for custom components
    "key": "value"
  }
}
```

## Validation Rules

Validation rules define constraints for form fields:

```json
{
  "ruleId": "string",         // Unique ID for the rule
  "description": "string",    // Description of what the rule checks
  "type": "regex | function | range | set",
  "value": "string",          // Pattern, range, or allowed values
  "errorMessage": "string"    // Message to display if validation fails
}
```

Common validation rules include:

* `required` - Field must have a value
* `email` - Must be a valid email format
* `minLength` - Minimum string length
* `maxLength` - Maximum string length
* `pattern` - Must match a regex pattern
* `min` - Minimum numeric value
* `max` - Maximum numeric value
* `oneOf` - Must be one of a set of values

## Component Types

### Form Components

Form components collect user input:

* **Simple Forms** - Basic data collection
* **Multi-step Forms** - Wizard-like interfaces
* **Dynamic Forms** - Fields that appear/hide based on other inputs
* **Validation Forms** - Rich validation with immediate feedback

### Display Components

Display components present information:

* **Data Tables** - Tabular data presentation
* **Detail Views** - Formatted record details
* **Charts** - Visual data representation
* **Status Indicators** - Workflow or task status visualization

### Modal Components

Modal components for focused interactions:

* **Confirmation Dialogs** - Verify user intent
* **Error Modals** - Display error details
* **Quick Edit Modals** - Edit without leaving context
* **Information Modals** - Present important information

### Custom Components

Specialized components for specific needs:

* **File Uploaders** - Handle file attachments
* **Rich Text Editors** - Format text content
* **Map Selectors** - Geographic location selection
* **Date/Time Pickers** - Calendar-based selection

## Implementation Examples

Example form component:

```json
{
  "componentId": "approval-form",
  "name": "Approval Form",
  "description": "Standard approval form with comments",
  "componentType": "Form",
  "title": "Review Request",
  "fields": [
    {
      "fieldKey": "decision",
      "label": "Decision",
      "type": "select",
      "options": [
        { "value": "approve", "label": "Approve" },
        { "value": "reject", "label": "Reject" },
        { "value": "more_info", "label": "Request More Information" }
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
    },
    {
      "actionKey": "cancel",
      "label": "Cancel",
      "style": "secondary"
    }
  ]
}
```

Example display component:

```json
{
  "componentId": "invoice-summary",
  "name": "Invoice Summary",
  "description": "Summary view of invoice details",
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

## Schema

**Table: ui_components**

| Field | Type | Description |
|----|----|----|
| id | UUID | Primary key |
| component_id | VARCHAR(255) | Unique business identifier |
| name | VARCHAR(255) | Human-readable name |
| description | TEXT | Detailed description |
| component_type | VARCHAR(50) | Type (Form, Modal, Display, Custom) |
| title | VARCHAR(255) | Title or header for the UI |
| fields | JSONB | Field definitions for forms |
| layout | JSONB | Layout configuration |
| actions | JSONB | Action button definitions |
| display_template | TEXT | Template for display components |
| custom_props | JSONB | Additional properties for custom components |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |
| version | VARCHAR(50) | Version of this component |

**Table: validation_rules**

| Field | Type | Description |
|----|----|----|
| id | UUID | Primary key |
| rule_id | VARCHAR(255) | Unique identifier for the rule |
| description | TEXT | Description of what the rule checks |
| type | VARCHAR(50) | Type of validation (regex, function, range, set) |
| value | TEXT | Pattern, range, or allowed values |
| error_message | TEXT | Message to display if validation fails |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

**Indexes:**

* `ui_components_component_id_idx` UNIQUE on `component_id` (for lookups)
* `ui_components_type_idx` on `component_type` (for filtering by type)
* `validation_rules_rule_id_idx` UNIQUE on `rule_id` (for lookups)

**JSON Schema (fields field):**

```json
{
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "fieldKey": { "type": "string" },
      "label": { "type": "string" },
      "type": { 
        "type": "string",
        "enum": ["text", "number", "boolean", "select", "multi-select", "date", "file", "textarea"]
      },
      "options": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "value": { "type": "string" },
            "label": { "type": "string" }
          }
        }
      },
      "placeholder": { "type": "string" },
      "default": { "type": "any" },
      "validationRules": {
        "type": "array",
        "items": { "type": "string" }
      },
      "helpText": { "type": "string" },
      "visibleIf": { "type": "string" }
    },
    "required": ["fieldKey", "label", "type"]
  }
}
```

**JSON Schema (actions field):**

```json
{
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "actionKey": { "type": "string" },
      "label": { "type": "string" },
      "style": { 
        "type": "string",
        "enum": ["primary", "secondary", "danger"]
      },
      "confirmation": { "type": "string" },
      "visibleIf": { "type": "string" }
    },
    "required": ["actionKey", "label"]
  }
}
```

**Notes:**

* UI components are versioned to allow for evolution without breaking existing tasks
* The display_template field is deprecated in favor of atomic display components via customProps
* Flag configurations integrate with the Universal Flag System for semantic row styling
* Validation rules are stored separately to enable reuse across multiple components
* Following our schema convention, all top-level fields from the JSON structure are represented as columns, while nested objects remain as JSONB

## Universal Flag System Integration

The UI Components system integrates with the Universal Flag System to provide semantic row styling and status indication across different business scenarios.

### Flag Configuration Structure

```json
{
  "flagConfig": {
    "field": "string",        // Field name containing the flag value
    "configName": "string",   // Reference to flag_configurations table
    "styles": {               // CSS classes for row styling by flag type
      "error": "string",      // Red styling for critical issues
      "warning": "string",    // Orange/Yellow styling for warnings
      "success": "string",    // Green styling for approved/compliant items
      "info": "string",       // Blue styling for informational items
      "pending": "string"     // Gray styling for pending items
    },
    "badgeConfigs": {         // Badge configurations by flag type
      "error": {"class": "string", "text": "string"},
      "warning": {"class": "string", "text": "string"},
      "success": {"class": "string", "text": "string"},
      "info": {"class": "string", "text": "string"},
      "pending": {"class": "string", "text": "string"}
    }
  }
}
```

### Atomic Display Components

The system now supports atomic display components through the `customProps.displayType` configuration:

#### Table Display with Flag Configuration

```json
{
  "componentId": "extracted-terms-table",
  "componentType": "Display",
  "customProps": {
    "displayType": "table",
    "columns": [
      {"key": "term", "label": "Term"},
      {"key": "value", "label": "Value"},
      {"key": "flag", "label": "Status", "render": "status-badge"}
    ],
    "flagConfig": {
      "field": "flag",
      "configName": "compliance",
      "styles": {
        "error": "bg-red-50 border-l-4 border-red-600",
        "warning": "bg-amber-50 border-l-4 border-amber-600",
        "success": "bg-green-50 border-l-4 border-green-600"
      },
      "badgeConfigs": {
        "error": {"class": "bg-red-100 text-red-900", "text": "Violation"},
        "warning": {"class": "bg-amber-100 text-amber-900", "text": "Non-standard"},
        "success": {"class": "bg-green-100 text-green-900", "text": "Compliant"}
      }
    },
    "dataKey": "extractedTerms"
  }
}
```

Example display component (LEGACY - use atomic components instead):

```json
{
  "componentId": "invoice-summary",
  "name": "Invoice Summary",
  "description": "Summary view of invoice details",
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

**Notes:**

* UI components are versioned to allow for evolution without breaking existing tasks
* The display_template field is deprecated in favor of atomic display components via customProps
* Flag configurations integrate with the Universal Flag System for semantic row styling
* Validation rules are stored separately to enable reuse across multiple components
* Following our schema convention, all top-level fields from the JSON structure are represented as columns, while nested objects remain as JSONB


