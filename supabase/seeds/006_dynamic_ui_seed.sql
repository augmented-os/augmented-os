-- Dynamic UI Component Seed Data
-- Contains task inbox UI components for dynamic form and display rendering

-- Remove existing example data and insert task inbox components

-- =============================================================================
-- TOP-LEVEL TASK VIEW COMPONENTS
-- These orchestrate the complete UI for specific tasks
-- =============================================================================

-- Main Task View: Review Term Sheet
-- This is the top-level component that orchestrates the entire term sheet review UI
INSERT INTO ui_components (component_id, name, description, component_type, title, layout, actions) VALUES
('task-view-review-term-sheet', 'Term Sheet Review Task View', 'Complete UI layout for term sheet review task', 'Display', 'Review Term Sheet', 
'{
  "type": "grid",
  "areas": [
    {"component": "term-sheet-summary", "grid": "span 12", "order": 1},
    {"component": "extracted-terms-table", "grid": "span 12", "order": 2}
  ],
  "spacing": "lg",
  "className": "task-review-layout"
}'::jsonb,
'[
  {
    "actionKey": "refresh_data",
    "label": "Refresh",
    "style": "secondary",
    "icon": "refresh"
  }
]'::jsonb),

-- Task View: Review Request Form
-- For requesting revisions from companies
('task-view-review-request', 'Review Request Task View', 'Complete UI for requesting term sheet revisions', 'Display', 'Request Term Sheet Revisions',
'{
  "type": "single",
  "component": "review-request-form",
  "className": "review-request-layout"
}'::jsonb,
NULL);

-- =============================================================================
-- INDIVIDUAL UI COMPONENTS
-- These are the building blocks used by the task views above
-- =============================================================================

-- Task Review Form - Replaces hardcoded TaskDetailPanel logic
INSERT INTO ui_components (component_id, name, description, component_type, title, fields, actions) VALUES
('task-review-form', 'Task Review Form', 'Term sheet review form with decision workflow', 'Form', 'Review Decision', 
'[
  {
    "fieldKey": "decision",
    "label": "Decision",
    "type": "select",
    "options": [
      {"value": "approve", "label": "Approve"},
      {"value": "reject", "label": "Reject"},
      {"value": "request_more_info", "label": "Request More Information"}
    ],
    "validationRules": ["required"],
    "helpText": "Select your decision for this term sheet review"
  },
  {
    "fieldKey": "comments",
    "label": "Review Comments",
    "type": "textarea",
    "placeholder": "Provide detailed comments about your decision...",
    "validationRules": ["required"],
    "visibleIf": "decision === ''reject'' || decision === ''request_more_info''",
    "helpText": "Required when rejecting or requesting more information"
  },
  {
    "fieldKey": "reviewNotes",
    "label": "Internal Notes",
    "type": "textarea",
    "placeholder": "Add any internal notes for the team...",
    "helpText": "Internal notes visible only to the review team"
  }
]'::jsonb,
'[
  {
    "actionKey": "submit",
    "label": "Submit Decision",
    "style": "primary",
    "confirmation": "Are you sure you want to submit this review decision?"
  },
  {
    "actionKey": "cancel",
    "label": "Cancel",
    "style": "secondary"
  }
]'::jsonb),

-- Review Request Form - Used when requesting revisions from companies
('review-request-form', 'Review Request Form', 'Form to request revisions for a term sheet.', 'Form', 'Request Term Sheet Revisions', 
'[
  {
    "fieldKey": "recipient",
    "label": "Recipient",
    "type": "select",
    "options": [
      {"value": "founder@companyname.com", "label": "founder@companyname.com"},
      {"value": "ceo@company.com", "label": "ceo@company.com"},
      {"value": "legal@company.com", "label": "legal@company.com"}
    ],
    "validationRules": ["required"]
  },
  {
    "fieldKey": "subject",
    "label": "Subject",
    "type": "text",
    "placeholder": "Enter subject",
    "validationRules": ["required"]
  },
  {
    "fieldKey": "message",
    "label": "Message",
    "type": "textarea",
    "placeholder": "Enter your message",
    "validationRules": ["required"]
  },
  {
    "fieldKey": "attachDocument",
    "label": "Attach revised term sheet document",
    "type": "boolean",
    "default": false
  }
]'::jsonb,
'[
  {
    "actionKey": "submit",
    "label": "Send Request",
    "style": "primary"
  },
  {
    "actionKey": "cancel",
    "label": "Cancel",
    "style": "secondary"
  }
]'::jsonb),

-- Term Sheet Summary Display - Replaces TaskSummaryCard component
('term-sheet-summary', 'Term Sheet Summary', 'Display term sheet details in a summary card', 'Display', 'Term Sheet Summary', 
NULL,
'[
  {
    "actionKey": "view_details",
    "label": "View Details",
    "style": "secondary"
  }
]'::jsonb),

-- Extracted Terms Table Display - Replaces ExtractedTermsTable component
('extracted-terms-table', 'Extracted Terms Table', 'Display extracted terms with conditional highlighting for flagged terms', 'Display', 'Extracted Terms', 
NULL,
NULL),

-- Task Action Buttons - Replaces TaskDetailHeader action buttons
('task-action-buttons', 'Task Action Buttons', 'Dynamic action buttons for task operations', 'Display', '', 
NULL,
'[
  {
    "actionKey": "approve",
    "label": "Approve",
    "style": "primary"
  },
  {
    "actionKey": "reject",
    "label": "Reject",
    "style": "danger"
  },
  {
    "actionKey": "request_changes",
    "label": "Request Changes",
    "style": "secondary"
  }
]'::jsonb);

-- =============================================================================
-- ATOMIC COMPONENT CONFIGURATIONS
-- JSON configurations for atomic display components (no more HTML templates)
-- =============================================================================

-- Update term-sheet-summary to use atomic CardDisplay configuration  
UPDATE ui_components 
SET 
  display_template = NULL,
  custom_props = jsonb_build_object(
    'displayType', 'card',
    'title', 'Term Sheet Summary',
    'fields', jsonb_build_array(
      jsonb_build_object('key', 'company', 'label', 'Company'),
      jsonb_build_object('key', 'valuation', 'label', 'Valuation'),
      jsonb_build_object('key', 'investment', 'label', 'Investment Amount'),
      jsonb_build_object('key', 'equity', 'label', 'Equity')
    ),
    'layout', 'grid'
  )
WHERE component_id = 'term-sheet-summary';

-- Update extracted-terms-table to use atomic TableDisplay configuration
UPDATE ui_components 
SET 
  display_template = NULL,
  custom_props = jsonb_build_object(
    'displayType', 'table',
    'columns', jsonb_build_array(
      jsonb_build_object('key', 'term', 'label', 'Term', 'width', 'w-1/4'),
      jsonb_build_object('key', 'value', 'label', 'Value', 'width', 'w-1/4'),
      jsonb_build_object('key', 'standard', 'label', 'Standard', 'width', 'w-1/4'),
      jsonb_build_object(
        'key', 'flag', 
        'label', 'Status', 
        'width', 'w-1/4',
        'render', 'status-badge'
      )
    ),
    'rowClassName', 'flag-based',
    'dataKey', 'extractedTerms'
  )
WHERE component_id = 'extracted-terms-table';

-- Update task-action-buttons to use atomic ActionButtons configuration
UPDATE ui_components 
SET 
  display_template = NULL,
  custom_props = jsonb_build_object(
    'displayType', 'actions'
  )
WHERE component_id = 'task-action-buttons';

-- Remove legacy display_template from task view
UPDATE ui_components 
SET display_template = NULL
WHERE component_id = 'task-view-review-term-sheet';
