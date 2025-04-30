/* ------------------------------------------------------------------
   core workflow-engine tables  (public schema)
-------------------------------------------------------------------*/

-- 1.  Required extensions (no-ops if they already exist)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "ltree";

-- --------------------------------------------------------
--  Definition layer (static templates)
-- --------------------------------------------------------
CREATE TABLE workflow_definitions (
  id              uuid PRIMARY KEY        DEFAULT gen_random_uuid(),
  workflow_id     VARCHAR(255) NOT NULL   UNIQUE,       -- Unique business identifier
  name            VARCHAR(255) NOT NULL,
  version         VARCHAR(50)  NOT NULL,                -- Semantic version number
  description     text,
  input_schema    jsonb,                                -- JSON Schema for workflow input
  steps           jsonb,                                -- Ordered list of workflow steps
  ui_components   jsonb,                                -- Workflow-level UI definitions
  execution_log   jsonb,                                -- Logging configuration
  created_at      TIMESTAMP    NOT NULL,
  updated_at      TIMESTAMP    NOT NULL
);

-- --------------------------------------------------------
--  Instance / runtime layer
-- --------------------------------------------------------
CREATE TABLE workflow_instances (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_definition_id  uuid REFERENCES workflow_definitions(id) ON DELETE RESTRICT,
  status                  VARCHAR(50)  NOT NULL,      -- Current status (e.g., CREATED, RUNNING, COMPLETED, FAILED, CANCELLED, WAITING_FOR_EVENT)
  current_step_id         VARCHAR(255),               -- ID of the current step
  input                   jsonb,                      -- Initial input data
  state                   jsonb        NOT NULL DEFAULT '{}', -- Current workflow state (includes step outputs, variables, etc.)
  error                   jsonb,                      -- Error details if workflow failed
  trigger_event_id        uuid,                       -- Reference to event that triggered this workflow (no FK enforced here)
  started_at              TIMESTAMP    NOT NULL,      -- When workflow started
  updated_at              TIMESTAMP    NOT NULL,      -- When workflow was last updated
  completed_at            TIMESTAMP,                  -- When workflow completed
  correlation_id          VARCHAR(255)                -- Business correlation identifier
);

-- Indexes for workflow_instances
CREATE INDEX workflow_instances_status_idx ON workflow_instances(status);
CREATE INDEX workflow_instances_correlation_idx ON workflow_instances(correlation_id);
CREATE INDEX workflow_instances_definition_idx ON workflow_instances(workflow_definition_id);
CREATE INDEX workflow_instances_current_step_idx ON workflow_instances(current_step_id);
CREATE INDEX workflow_instances_waiting_for_event_idx ON workflow_instances((state->'waitingForEvent'->>'eventPattern')) WHERE status = 'WAITING_FOR_EVENT';