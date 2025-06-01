/* -----------------------------------------------------------
   Seed: the "term_sheet_review" workflow definition
------------------------------------------------------------ */

INSERT INTO public.workflow_definitions (
  workflow_id,
  name,
  description,
  version,
  input_schema,
  steps,
  ui_components,
  execution_log,
  created_at,
  updated_at
)
VALUES (
  'term_sheet_review',                            -- workflow_id
  'Term Sheet Review',                            -- name
  'Review and decision workflow for term sheet submissions',  -- description
  '1.0.0',                                        -- version
  '{
    "type": "object",
    "properties": {
      "termSheetId": {
        "type": "string",
        "description": "Unique identifier for the term sheet"
      },
      "companyId": {
        "type": "string",
        "description": "Company submitting the term sheet"
      },
      "submissionData": {
        "type": "object",
        "description": "Complete term sheet submission data"
      }
    },
    "required": ["termSheetId", "companyId", "submissionData"]
  }'::jsonb,                                      -- input_schema
  '[
    {
      "stepId": "workflow-input", 
      "name": "Term Sheet Submission", 
      "description": "Input: Term sheet data and company information",
      "next": [ { "nextStepId": "assign-reviewer" } ]
    },
    {
      "stepId": "assign-reviewer", 
      "taskId": "assign_reviewer_task", 
      "name": "Assign Reviewer", 
      "description": "Automatically assign appropriate reviewer based on deal size and complexity",
      "next": [ { "nextStepId": "review-term-sheet" } ]
    },
    {
      "stepId": "review-term-sheet", 
      "taskId": "review-term-sheet", 
      "name": "Review Term Sheet", 
      "description": "Manual review and decision on term sheet",
      "next": [
        { 
          "nextStepId": "send-approval-notice", 
          "condition": "${task.output.decision} == \"approved\"" 
        },
        { 
          "nextStepId": "send-rejection-notice", 
          "condition": "${task.output.decision} == \"rejected\"" 
        },
        { 
          "nextStepId": "send-revision-request", 
          "condition": "${task.output.decision} == \"revision_requested\"" 
        }
      ]
    },
    {
      "stepId": "send-approval-notice", 
      "taskId": "send_approval_notification", 
      "name": "Send Approval Notice", 
      "description": "Notify company of approval and next steps",
      "next": [ { "nextStepId": "schedule-due-diligence" } ]
    },
    {
      "stepId": "send-rejection-notice", 
      "taskId": "send_rejection_notification", 
      "name": "Send Rejection Notice", 
      "description": "Notify company of rejection with feedback",
      "next": [ { "nextStepId": "workflow-complete" } ]
    },
    {
      "stepId": "send-revision-request", 
      "taskId": "send_revision_request", 
      "name": "Send Revision Request", 
      "description": "Request specific revisions from company",
      "next": [ { "nextStepId": "await-revision" } ]
    },
    {
      "stepId": "schedule-due-diligence", 
      "taskId": "schedule_due_diligence", 
      "name": "Schedule Due Diligence", 
      "description": "Begin due diligence process for approved term sheet",
      "next": [ { "nextStepId": "workflow-complete" } ]
    },
    {
      "stepId": "await-revision", 
      "name": "Await Revision", 
      "description": "Wait for company to submit revised term sheet",
      "next": [ { "nextStepId": "review-term-sheet" } ]
    },
    {
      "stepId": "workflow-complete", 
      "name": "Workflow Complete", 
      "description": "Term sheet review process completed",
      "next": []
    }
  ]'::jsonb,                                      -- steps
  '{
    "reviewForm": {
      "componentIds": ["task-review-form", "term-sheet-summary", "extracted-terms-table", "task-action-buttons"],
      "layout": "panel",
      "title": "Term Sheet Review"
    }
  }'::jsonb,                                      -- ui_components
  '{
    "logLevel": "INFO",
    "trackDecisions": true,
    "auditTrail": true
  }'::jsonb,                                      -- execution_log
  now(),                                          -- created_at
  now()                                           -- updated_at
);
