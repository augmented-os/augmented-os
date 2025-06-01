-- Task Execution Seed Data
-- Description: Seeds task definitions and instances for term sheet review workflow
-- This replaces the hard-coded dynamicUI with proper task execution system

-- ==========================================================================
-- TASK DEFINITIONS
-- Create the task definition that our instances will reference
-- ==========================================================================

-- Task Definition: Review Term Sheet
-- This represents the core business task of reviewing a term sheet
INSERT INTO public.task_definitions (
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
                "status": {"type": "string", "description": "Business status value (e.g., Compliant, Non-standard, Violation)"}
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
    "primaryUIComponent": "task-view-review-term-sheet",
    "supportedUIStates": [
      "default_view",
      "review_request_form",
      "approval_confirmation", 
      "rejection_form"
    ]
  }'::jsonb,
  '{
    "primaryComponent": "task-view-review-term-sheet",
    "conditionalComponents": {
      "review-request-form": {
        "triggerAction": "request_review",
        "visibleIf": "uiState.showReviewForm"
      },
      "term-sheet-summary": {
        "visibleIf": "!uiState.showReviewForm"
      },
      "extracted-terms-table": {
        "visibleIf": "!uiState.showReviewForm"
      },
      "task-action-buttons": {
        "alwaysVisible": true
      }
    }
  }'::jsonb,
  '{
    "category": "review",
    "businessProcess": "term_sheet_evaluation",
    "priority": "high",
    "slaHours": 24,
    "uiPattern": "conditional_state_driven",
    "dataModel": "universal_json_driven",
    "statusMapping": "business_to_semantic_via_json"
  }'::jsonb
);

-- ==========================================================================
-- WORKFLOW INSTANCES  
-- Create sample workflow instances that our task instances will belong to
-- ==========================================================================

-- Workflow Instance 1: Active Review Workflow
INSERT INTO public.workflow_instances (
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
  NULL, -- workflow_definition_id - will be set after workflow definition exists
  'RUNNING',
  'review-term-sheet',
  '{
    "termSheetId": "ts-2024-001", 
    "companyId": "comp-techstart-inc",
    "submissionData": {
      "company": "TechStart Inc.",
      "valuation": "$50M pre-money",
      "investment": "$5M Series A",
      "liquidationPreference": "1x Non-participating Preferred",
      "boardSeats": "2 out of 7",
      "antidilution": "Weighted average broad-based",
      "participationRights": "Pro-rata participation rights",
      "extractedTerms": [
        {
          "term": "Pre-money Valuation",
          "value": "$50M",
          "standard": "$40-60M",
          "status": "Compliant"
        },
        {
          "term": "Liquidation Preference", 
          "value": "1x Non-participating Preferred",
          "standard": "1x Non-participating",
          "status": "Compliant"
        },
        {
          "term": "Board Composition",
          "value": "2 out of 7",
          "standard": "1-2 investor seats",
          "status": "Compliant"
        },
        {
          "term": "Anti-dilution",
          "value": "Weighted average broad-based",
          "standard": "Weighted average",
          "status": "Compliant"
        },
        {
          "term": "Participation Rights",
          "value": "Pro-rata participation rights",
          "standard": "Pro-rata only",
          "status": "Compliant"
        }
      ]
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
INSERT INTO public.workflow_instances (
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
  NULL, -- workflow_definition_id - will be set after workflow definition exists
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
INSERT INTO public.workflow_instances (
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
  NULL, -- workflow_definition_id - will be set after workflow definition exists
  'COMPLETED',
  'await-revision',
  '{
    "termSheetId": "ts-2024-003",
    "companyId": "comp-fintech-solutions",
    "submissionData": {
      "company": "FinTech Solutions Ltd.",
      "valuation": "$100M pre-money",
      "investment": "$15M Series B",
      "liquidationPreference": "2x Non-participating Preferred",
      "boardSeats": "3 out of 7",
      "antidilution": "Full ratchet",
      "participationRights": "Pro-rata and super pro-rata rights",
      "extractedTerms": [
        {
          "term": "Pre-money Valuation",
          "value": "$100M",
          "standard": "$60-80M",
          "status": "Non-standard"
        },
        {
          "term": "Liquidation Preference",
          "value": "2x Non-participating Preferred",
          "standard": "1x Non-participating",
          "status": "Violation"
        },
        {
          "term": "Board Composition",
          "value": "3 out of 7",
          "standard": "1-2 investor seats",
          "status": "Non-standard"
        },
        {
          "term": "Anti-dilution",
          "value": "Full ratchet",
          "standard": "Weighted average",
          "status": "Violation"
        },
        {
          "term": "Participation Rights",
          "value": "Pro-rata and super pro-rata",
          "standard": "Pro-rata only",
          "status": "Violation"
        },
        {
          "term": "Investment Amount",
          "value": "$15M",
          "standard": "$10-20M for Series B",
          "status": "Compliant"
        }
      ]
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
-- TASK INSTANCES
-- Create multiple instances showing different states of the review process
-- Now properly linked to workflow instances
-- ==========================================================================

-- Task Instance 1: Active review task for TechStart Inc.
INSERT INTO public.task_instances (
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
  (SELECT id FROM public.task_definitions WHERE task_id = 'review-term-sheet'),
  (SELECT id FROM public.workflow_instances WHERE correlation_id = 'term-sheet-techstart-2024-001'),
  NULL, -- workflow_definition_id - will be set after workflow definition exists
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
      "liquidationPreference": "1x Non-participating Preferred",
      "boardSeats": "2 out of 7",
      "antidilution": "Weighted average broad-based",
      "participationRights": "Pro-rata participation rights",
      "extractedTerms": [
        {
          "term": "Pre-money Valuation",
          "value": "$50M",
          "standard": "$40-60M",
          "status": "Compliant"
        },
        {
          "term": "Liquidation Preference", 
          "value": "1x Non-participating Preferred",
          "standard": "1x Non-participating",
          "status": "Compliant"
        },
        {
          "term": "Board Composition",
          "value": "2 out of 7",
          "standard": "1-2 investor seats",
          "status": "Compliant"
        },
        {
          "term": "Anti-dilution",
          "value": "Weighted average broad-based",
          "standard": "Weighted average",
          "status": "Compliant"
        },
        {
          "term": "Participation Rights",
          "value": "Pro-rata participation rights",
          "standard": "Pro-rata only",
          "status": "Compliant"
        }
      ]
    }
  }'::jsonb,
  NULL,
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
    "dueDate": "2024-01-17T17:00:00Z",
    "escalationPolicy": {
      "escalationTimeoutMs": 7200000,
      "escalationAssignees": ["senior-partner-1", "senior-partner-2"]
    }
  }'::jsonb,
  1,
  'TechStart Inc.'
);

-- Task Instance 2: Completed review task for AI Startup Co.
INSERT INTO public.task_instances (
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
  (SELECT id FROM public.task_definitions WHERE task_id = 'review-term-sheet'),
  (SELECT id FROM public.workflow_instances WHERE correlation_id = 'term-sheet-ai-startup-2024-002'),
  NULL, -- workflow_definition_id - will be set after workflow definition exists
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
      "liquidationPreference": "1x Non-participating Preferred",
      "boardSeats": "1 out of 5",
      "antidilution": "Weighted average narrow-based",
      "participationRights": "Pro-rata participation rights",
      "extractedTerms": [
        {
          "term": "Pre-money Valuation",
          "value": "$25M",
          "standard": "$20-30M",
          "status": "Compliant"
        },
        {
          "term": "Liquidation Preference",
          "value": "1x Non-participating Preferred", 
          "standard": "1x Non-participating",
          "status": "Compliant"
        },
        {
          "term": "Board Composition",
          "value": "1 out of 5",
          "standard": "1-2 investor seats",
          "status": "Compliant"
        },
        {
          "term": "Anti-dilution",
          "value": "Weighted average narrow-based",
          "standard": "Weighted average broad-based",
          "status": "Non-standard"
        },
        {
          "term": "Investment Amount",
          "value": "$3M",
          "standard": "$2-5M for seed",
          "status": "Compliant"
        }
      ]
    }
  }'::jsonb,
  NULL,
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
    "completedAt": "2024-01-14T16:30:00Z",
    "dueDate": "2024-01-16T17:00:00Z",
    "escalationPolicy": {
      "escalationTimeoutMs": 7200000,
      "escalationAssignees": ["senior-partner-1"]
    }
  }'::jsonb,
  1,
  'AI Startup Co.'
);

-- Task Instance 3: Revision request task for FinTech Solutions Ltd.
INSERT INTO public.task_instances (
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
  (SELECT id FROM public.task_definitions WHERE task_id = 'review-term-sheet'),
  (SELECT id FROM public.workflow_instances WHERE correlation_id = 'term-sheet-fintech-2024-003'),
  NULL, -- workflow_definition_id - will be set after workflow definition exists
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
      "liquidationPreference": "2x Non-participating Preferred",
      "boardSeats": "3 out of 7",
      "antidilution": "Full ratchet",
      "participationRights": "Pro-rata and super pro-rata rights",
      "extractedTerms": [
        {
          "term": "Pre-money Valuation",
          "value": "$100M",
          "standard": "$60-80M",
          "status": "Non-standard"
        },
        {
          "term": "Liquidation Preference",
          "value": "2x Non-participating Preferred",
          "standard": "1x Non-participating",
          "status": "Violation"
        },
        {
          "term": "Board Composition",
          "value": "3 out of 7",
          "standard": "1-2 investor seats",
          "status": "Non-standard"
        },
        {
          "term": "Anti-dilution",
          "value": "Full ratchet",
          "standard": "Weighted average",
          "status": "Violation"
        },
        {
          "term": "Participation Rights",
          "value": "Pro-rata and super pro-rata",
          "standard": "Pro-rata only",
          "status": "Violation"
        },
        {
          "term": "Investment Amount",
          "value": "$15M",
          "standard": "$10-20M for Series B",
          "status": "Compliant"
        }
      ]
    }
  }'::jsonb,
  NULL,
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
    "completedAt": "2024-01-13T14:45:00Z",
    "dueDate": "2024-01-15T17:00:00Z",
    "escalationPolicy": {
      "escalationTimeoutMs": 7200000,
      "escalationAssignees": ["managing-partner"]
    }
  }'::jsonb,
  1,
  'FinTech Solutions Ltd.'
);

