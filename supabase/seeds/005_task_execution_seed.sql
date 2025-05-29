-- Task Execution Seed Data
-- Description: Seeds task definitions and instances for term sheet review workflow
-- This replaces the hard-coded dynamicUI with proper task execution system

-- ==========================================================================
-- WORKFLOW INSTANCES  
-- Create sample workflow instances that our task instances will belong to
-- ==========================================================================

-- Workflow Instance 1: Active Review Workflow
INSERT INTO workflow_instances (
  id,
  workflow_definition_id,
  status,
  current_step_id,
  input,
  state,
  started_at,
  correlation_id
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM workflow_definitions WHERE workflow_id = 'term_sheet_review'),
  'RUNNING',
  'review-term-sheet',
  '{
    "termSheetId": "ts-2024-001", 
    "companyId": "comp-techstart-inc",
    "submissionData": {
      "company": "TechStart Inc.",
      "valuation": "$50M pre-money",
      "investment": "$5M Series A"
    }
  }'::jsonb,
  '{
    "currentStepId": "review-term-sheet",
    "variables": {
      "assignedReviewer": "reviewer-john-doe",
      "priority": "high"
    },
    "stepOutputs": {
      "assign-reviewer": {
        "assignedTo": "reviewer-john-doe",
        "assignedAt": "2024-01-15T09:00:00Z"
      }
    }
  }'::jsonb,
  '2024-01-15T08:00:00Z',
  'term-sheet-techstart-2024-001'
);

-- Workflow Instance 2: Completed Approval Workflow  
INSERT INTO workflow_instances (
  id,
  workflow_definition_id,
  status,
  current_step_id,
  input,
  state,
  started_at,
  completed_at,
  correlation_id
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM workflow_definitions WHERE workflow_id = 'term_sheet_review'),
  'COMPLETED',
  'workflow-complete',
  '{
    "termSheetId": "ts-2024-002",
    "companyId": "comp-ai-startup", 
    "submissionData": {
      "company": "AI Startup Co.",
      "valuation": "$25M pre-money", 
      "investment": "$3M Seed"
    }
  }'::jsonb,
  '{
    "currentStepId": "workflow-complete",
    "variables": {
      "assignedReviewer": "reviewer-jane-smith",
      "finalDecision": "approved"
    },
    "stepOutputs": {
      "assign-reviewer": {
        "assignedTo": "reviewer-jane-smith",
        "assignedAt": "2024-01-14T10:00:00Z"
      },
      "review-term-sheet": {
        "decision": "approved",
        "reviewedAt": "2024-01-14T16:30:00Z",
        "reviewerId": "reviewer-jane-smith"
      },
      "send-approval-notice": {
        "notificationSent": true,
        "sentAt": "2024-01-14T16:45:00Z"
      },
      "schedule-due-diligence": {
        "scheduled": true,
        "scheduledFor": "2024-01-17T09:00:00Z"
      }
    }
  }'::jsonb,
  '2024-01-14T09:00:00Z',
  '2024-01-14T17:00:00Z',
  'term-sheet-ai-startup-2024-002'
);

-- Workflow Instance 3: Completed Revision Request Workflow
INSERT INTO workflow_instances (
  id,
  workflow_definition_id,
  status,
  current_step_id,
  input,
  state,
  started_at,
  completed_at,
  correlation_id
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM workflow_definitions WHERE workflow_id = 'term_sheet_review'),
  'COMPLETED',
  'await-revision',
  '{
    "termSheetId": "ts-2024-003",
    "companyId": "comp-fintech-solutions",
    "submissionData": {
      "company": "FinTech Solutions Ltd.",
      "valuation": "$100M pre-money",
      "investment": "$15M Series B"
    }
  }'::jsonb,
  '{
    "currentStepId": "await-revision",
    "variables": {
      "assignedReviewer": "reviewer-senior-partner",
      "finalDecision": "revision_requested"
    },
    "stepOutputs": {
      "assign-reviewer": {
        "assignedTo": "reviewer-senior-partner",
        "assignedAt": "2024-01-13T09:00:00Z"
      },
      "review-term-sheet": {
        "decision": "revision_requested",
        "reviewedAt": "2024-01-13T14:45:00Z",
        "reviewerId": "reviewer-senior-partner"
      },
      "send-revision-request": {
        "requestSent": true,
        "sentAt": "2024-01-13T15:00:00Z",
        "requestedChanges": [
          "Reduce pre-money valuation to $75M range",
          "Change liquidation preference to 1x Non-participating"
        ]
      }
    },
    "waitingForEvent": {
      "eventType": "term_sheet_resubmission",
      "eventPattern": "termSheetId:ts-2024-003"
    }
  }'::jsonb,
  '2024-01-13T08:00:00Z',
  '2024-01-13T15:30:00Z',
  'term-sheet-fintech-2024-003'
);

-- ==========================================================================
-- TASK DEFINITIONS
-- Define the actual business task to be completed
-- ==========================================================================

-- Task Definition: Review Term Sheet
-- This represents the core business task of reviewing a term sheet
INSERT INTO task_definitions (
  task_id,
  name,
  description,
  type,
  version,
  input_schema,
  output_schema,
  timeout,
  retry_policy,
  execution_config,
  ui_components,
  metadata
) VALUES (
  'review-term-sheet',
  'Review Term Sheet',
  'Review and make decisions on term sheet submissions from companies',
  'MANUAL',
  '1.0.0',
  '{
    "type": "object",
    "properties": {
      "termSheetId": {
        "type": "string",
        "description": "Unique identifier for the term sheet being reviewed"
      },
      "companyId": {
        "type": "string", 
        "description": "Company submitting the term sheet"
      },
      "submissionData": {
        "type": "object",
        "properties": {
          "company": {"type": "string"},
          "valuation": {"type": "string"},
          "investment": {"type": "string"},
          "equity": {"type": "string"},
          "documents": {
            "type": "array",
            "items": {"type": "string"}
          },
          "extractedTerms": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "term": {"type": "string"},
                "value": {"type": "string"},
                "standard": {"type": "string"},
                "flag": {"type": "string", "enum": ["error", "warning", "success", "info", "pending"], "description": "Semantic flag indicating the status of this term"}
              }
            }
          }
        },
        "required": ["company", "valuation", "investment", "equity"]
      },
      "assignedReviewer": {
        "type": "string",
        "description": "User ID of the assigned reviewer"
      }
    },
    "required": ["termSheetId", "companyId", "submissionData", "assignedReviewer"]
  }'::jsonb,
  '{
    "type": "object",
    "properties": {
      "decision": {
        "type": "string",
        "enum": ["approved", "rejected", "revision_requested"],
        "description": "Final decision on the term sheet"
      },
      "reviewComments": {
        "type": "string",
        "description": "Comments from the reviewer"
      },
      "internalNotes": {
        "type": "string",
        "description": "Internal notes for the team"
      },
      "requestedChanges": {
        "type": "array",
        "items": {"type": "string"},
        "description": "Specific changes requested if revision needed"
      },
      "reviewedAt": {
        "type": "string",
        "format": "date-time",
        "description": "Timestamp when review was completed"
      },
      "reviewerId": {
        "type": "string",
        "description": "ID of the user who completed the review"
      },
      "nextActions": {
        "type": "array",
        "items": {"type": "string"},
        "description": "Follow-up actions required"
      }
    },
    "required": ["decision", "reviewedAt", "reviewerId"]
  }'::jsonb,
  3600000, -- 1 hour timeout for manual review
  '{
    "maxRetries": 0,
    "retryDelay": 0,
    "escalationTimeoutMs": 7200000
  }'::jsonb,
  '{
    "executor": "human-task-executor",
    "securityContext": {
      "securityLevel": "user",
      "requiresAuthentication": true,
      "requiredRoles": ["reviewer", "senior_reviewer", "admin"]
    },
    "executionMode": "interactive",
    "uiComponents": [
      "task-review-form",
      "term-sheet-summary", 
      "extracted-terms-table",
      "task-action-buttons"
    ]
  }'::jsonb,
  '{
    "formComponents": {
      "primaryForm": "task-review-form",
      "summaryDisplay": "term-sheet-summary",
      "termsDisplay": "extracted-terms-table",
      "actionBar": "task-action-buttons"
    }
  }'::jsonb,
  '{
    "category": "review",
    "businessProcess": "term_sheet_evaluation",
    "priority": "high",
    "slaHours": 24,
    "replacesHardcodedUI": true
  }'::jsonb
);

-- ==========================================================================
-- TASK INSTANCES
-- Create multiple instances showing different states of the review process
-- Now properly linked to workflow instances
-- ==========================================================================

-- Task Instance 1: Pending Review (Active)
-- This represents a term sheet that has just been submitted and needs review
INSERT INTO task_instances (
  task_definition_id,
  workflow_instance_id,
  workflow_definition_id,
  step_id,
  status,
  type,
  input,
  output,
  error,
  executor_id,
  assignee,
  priority,
  retry_count,
  retry_policy,
  execution_metadata,
  version,
  task_reference
) VALUES (
  (SELECT id FROM task_definitions WHERE task_id = 'review-term-sheet'),
  (SELECT id FROM workflow_instances WHERE correlation_id = 'term-sheet-techstart-2024-001'),
  (SELECT id FROM workflow_definitions WHERE workflow_id = 'term_sheet_review'),
  'review-step-001',
  'ASSIGNED',
  'MANUAL',
  '{
    "termSheetId": "ts-2024-001",
    "companyId": "comp-techstart-inc",
    "submissionData": {
      "company": "TechStart Inc.",
      "valuation": "$50M pre-money",
      "investment": "$5M Series A",
      "equity": "10% ownership",
      "documents": [
        "term_sheet_v1.pdf",
        "financial_projections_2024.xlsx",
        "cap_table_current.csv"
      ],
      "extractedTerms": [
        {
          "term": "Pre-money Valuation",
          "value": "$50M",
          "standard": "$40-60M",
          "flag": "success"
        },
        {
          "term": "Liquidation Preference",
          "value": "2x Non-participating",
          "standard": "1x Non-participating", 
          "flag": "warning"
        },
        {
          "term": "Board Composition",
          "value": "2 Investor, 1 Founder, 2 Independent",
          "standard": "1 Investor, 2 Founder, 1 Independent",
          "flag": "warning"
        }
      ]
    },
    "assignedReviewer": "reviewer-john-doe"
  }'::jsonb,
  NULL, -- No output yet - task not completed
  NULL,
  'human-task-executor',
  'reviewer-john-doe',
  'HIGH',
  0,
  '{
    "maxRetries": 0,
    "retryDelay": 0,
    "escalationTimeoutMs": 7200000
  }'::jsonb,
  '{
    "assignedAt": "2024-01-15T09:00:00Z",
    "context": "term_sheet_review_workflow",
    "slaDeadline": "2024-01-16T09:00:00Z",
    "businessContext": {
      "dealSize": "large",
      "companyStage": "series_a",
      "riskLevel": "medium"
    }
  }'::jsonb,
  1,
  'TechStart Inc.'
);

-- Task Instance 2: Pending Review 
INSERT INTO task_instances (
  task_definition_id,
  workflow_instance_id,
  workflow_definition_id,
  step_id,
  status,
  type,
  input,
  output,
  error,
  executor_id,
  assignee,
  priority,
  retry_count,
  retry_policy,
  execution_metadata,
  version,
  task_reference
) VALUES (
  (SELECT id FROM task_definitions WHERE task_id = 'review-term-sheet'),
  (SELECT id FROM workflow_instances WHERE correlation_id = 'term-sheet-ai-startup-2024-002'),
  (SELECT id FROM workflow_definitions WHERE workflow_id = 'term_sheet_review'),
  'review-step-002',
  'ASSIGNED',
  'MANUAL',
  '{
    "termSheetId": "ts-2024-002",
    "companyId": "comp-ai-startup",
    "submissionData": {
      "company": "AI Startup Co.",
      "valuation": "$25M pre-money",
      "investment": "$3M Seed",
      "equity": "12% ownership",
      "documents": [
        "term_sheet_final.pdf",
        "business_plan.docx"
      ],
      "extractedTerms": [
        {
          "term": "Pre-money Valuation",
          "value": "$25M",
          "standard": "$20-30M",
          "flag": "success"
        },
        {
          "term": "Liquidation Preference",
          "value": "1x Non-participating",
          "standard": "1x Non-participating",
          "flag": "success"
        }
      ]
    },
    "assignedReviewer": "reviewer-jane-smith"
  }'::jsonb,
  NULL, -- No output yet - task not completed
  NULL,
  'human-task-executor',
  'reviewer-jane-smith',
  'MEDIUM',
  0,
  '{
    "maxRetries": 0,
    "retryDelay": 0,
    "escalationTimeoutMs": 7200000
  }'::jsonb,
  '{
    "assignedAt": "2024-01-14T10:00:00Z",
    "context": "term_sheet_review_workflow",
    "slaDeadline": "2024-01-15T10:00:00Z",
    "businessContext": {
      "dealSize": "medium",
      "companyStage": "seed",
      "riskLevel": "low"
    }
  }'::jsonb,
  1,
  'AI Startup Co.'
);

-- Task Instance 3: Pending Review
INSERT INTO task_instances (
  task_definition_id,
  workflow_instance_id,
  workflow_definition_id,
  step_id,
  status,
  type,
  input,
  output,
  error,
  executor_id,
  assignee,
  priority,
  retry_count,
  retry_policy,
  execution_metadata,
  version,
  task_reference
) VALUES (
  (SELECT id FROM task_definitions WHERE task_id = 'review-term-sheet'),
  (SELECT id FROM workflow_instances WHERE correlation_id = 'term-sheet-fintech-2024-003'),
  (SELECT id FROM workflow_definitions WHERE workflow_id = 'term_sheet_review'),
  'review-step-003',
  'ASSIGNED',
  'MANUAL',
  '{
    "termSheetId": "ts-2024-003",
    "companyId": "comp-fintech-solutions",
    "submissionData": {
      "company": "FinTech Solutions Ltd.",
      "valuation": "$100M pre-money",
      "investment": "$15M Series B",
      "equity": "15% ownership",
      "documents": [
        "term_sheet_draft.pdf",
        "financial_model.xlsx",
        "market_analysis.pdf"
      ],
      "extractedTerms": [
        {
          "term": "Pre-money Valuation",
          "value": "$100M",
          "standard": "$60-80M",
          "flag": "warning"
        },
        {
          "term": "Liquidation Preference",
          "value": "3x Participating",
          "standard": "1x Non-participating",
          "flag": "error"
        },
        {
          "term": "Anti-dilution",
          "value": "Full Ratchet",
          "standard": "Weighted Average",
          "flag": "error"
        }
      ]
    },
    "assignedReviewer": "reviewer-senior-partner"
  }'::jsonb,
  NULL, -- No output yet - task not completed
  NULL,
  'human-task-executor',
  'reviewer-senior-partner',
  'HIGH',
  0,
  '{
    "maxRetries": 0,
    "retryDelay": 0,
    "escalationTimeoutMs": 7200000
  }'::jsonb,
  '{
    "assignedAt": "2024-01-13T09:00:00Z",
    "context": "term_sheet_review_workflow",
    "slaDeadline": "2024-01-14T09:00:00Z",
    "businessContext": {
      "dealSize": "large",
      "companyStage": "series_b",
      "riskLevel": "high"
    }
  }'::jsonb,
  1,
  'FinTech Solutions Ltd.'
);

