-- Dynamic UI Component Seed Data
-- Contains task inbox UI components for dynamic form and display rendering

-- Remove existing example data and insert task inbox components

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
    "actionKey": "request_review",
    "label": "Request Review",
    "style": "secondary",
    "visibleIf": "taskStatus !== ''completed'' && taskStatus !== ''approved''"
  },
  {
    "actionKey": "approve",
    "label": "Approve",
    "style": "primary",
    "confirmation": "Are you sure you want to approve this term sheet?",
    "visibleIf": "taskStatus !== ''completed'' && taskStatus !== ''approved''"
  }
]'::jsonb);

-- Update the display_template for the term sheet summary
UPDATE ui_components 
SET display_template = '<div class="mb-6"><h3 class="text-lg font-medium text-gray-900 mb-2">Term Sheet Summary</h3><div class="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"><div class="grid grid-cols-2 gap-4 p-4 border-b border-gray-200"><div><p class="text-sm font-medium text-gray-500">Company</p><p class="mt-1 text-sm text-gray-900">{{company}}</p></div><div><p class="text-sm font-medium text-gray-500">Valuation</p><p class="mt-1 text-sm text-gray-900">{{valuation}}</p></div><div><p class="text-sm font-medium text-gray-500">Investment Amount</p><p class="mt-1 text-sm text-gray-900">{{investment}}</p></div><div><p class="text-sm font-medium text-gray-500">Equity</p><p class="mt-1 text-sm text-gray-900">{{equity}}</p></div></div><div class="p-4"><p class="text-sm font-medium text-gray-500 mb-2">Attached Documents</p>{{#each documents}}<div class="flex items-center text-sm text-blue-600 hover:text-blue-800 mb-1"><svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd" /></svg>{{this}}</div>{{/each}}</div></div></div>'
WHERE component_id = 'term-sheet-summary';

-- Update the display_template for the extracted terms table
UPDATE ui_components 
SET display_template = '<div><h3 class="text-lg font-medium text-gray-900 mb-2">Extracted Terms</h3><div class="overflow-hidden border border-gray-200 rounded-lg shadow-sm"><table class="min-w-full divide-y divide-gray-200"><thead class="bg-gray-50"><tr><th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Term</th><th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th><th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Standard</th><th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th></tr></thead><tbody class="bg-white divide-y divide-gray-200">{{#each extractedTerms}}<tr class="{{#if flag}}bg-red-50{{/if}}"><td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{term}}</td><td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{value}}</td><td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{standard}}</td><td class="px-6 py-4 whitespace-nowrap">{{#if flag}}<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Non-standard</span>{{else}}<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Standard</span>{{/if}}</td></tr>{{/each}}</tbody></table></div></div>'
WHERE component_id = 'extracted-terms-table';

-- Update the display_template for the task action buttons
UPDATE ui_components 
SET display_template = '<div class="flex space-x-3"></div>'
WHERE component_id = 'task-action-buttons';
