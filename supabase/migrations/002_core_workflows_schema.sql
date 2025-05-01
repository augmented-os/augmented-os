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
  created_at      TIMESTAMP    NOT NULL DEFAULT now(), -- Adjusted default based on typical usage
  updated_at      TIMESTAMP    NOT NULL DEFAULT now()  -- Adjusted default based on typical usage
);

COMMENT ON TABLE workflow_definitions IS 'Templates that describe orchestrated sequences of tasks to accomplish a business process.';
COMMENT ON COLUMN workflow_definitions.id IS 'Primary key (UUID)';
COMMENT ON COLUMN workflow_definitions.workflow_id IS 'Unique business identifier for the workflow';
COMMENT ON COLUMN workflow_definitions.name IS 'Human-readable name';
COMMENT ON COLUMN workflow_definitions.version IS 'Semantic version number';
COMMENT ON COLUMN workflow_definitions.description IS 'Detailed description';
COMMENT ON COLUMN workflow_definitions.input_schema IS 'JSON Schema for workflow input';
COMMENT ON COLUMN workflow_definitions.steps IS 'Ordered list of workflow steps (JSON definition)';
COMMENT ON COLUMN workflow_definitions.ui_components IS 'Workflow-level UI definitions (JSON definition)';
COMMENT ON COLUMN workflow_definitions.execution_log IS 'Logging configuration (JSON definition)';
COMMENT ON COLUMN workflow_definitions.created_at IS 'Timestamp of creation';
COMMENT ON COLUMN workflow_definitions.updated_at IS 'Timestamp of last update';

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
  started_at              TIMESTAMP    NOT NULL DEFAULT now(), -- Adjusted default based on typical usage
  updated_at              TIMESTAMP    NOT NULL DEFAULT now(), -- Adjusted default based on typical usage
  completed_at            TIMESTAMP,                  -- When workflow completed
  correlation_id          VARCHAR(255)                -- Business correlation identifier
);

COMMENT ON TABLE workflow_instances IS 'Represents individual executions of workflow definitions, tracking state, progress, and history.';
COMMENT ON COLUMN workflow_instances.id IS 'Primary key (UUID)';
COMMENT ON COLUMN workflow_instances.workflow_definition_id IS 'Reference to workflow definition';
COMMENT ON COLUMN workflow_instances.status IS 'Current status (e.g., CREATED, RUNNING, COMPLETED, FAILED, CANCELLED, WAITING_FOR_EVENT)';
COMMENT ON COLUMN workflow_instances.current_step_id IS 'ID of the current or last executed step (within the state JSON)';
COMMENT ON COLUMN workflow_instances.input IS 'Initial input data provided when the workflow instance started';
COMMENT ON COLUMN workflow_instances.state IS 'Current workflow state (JSONB, includes variables, step outputs, waiting info, etc.)';
COMMENT ON COLUMN workflow_instances.error IS 'Error details if the workflow failed (JSONB)';
COMMENT ON COLUMN workflow_instances.trigger_event_id IS 'Reference to the event instance ID that triggered this workflow (if applicable)';
COMMENT ON COLUMN workflow_instances.started_at IS 'Timestamp when workflow execution started';
COMMENT ON COLUMN workflow_instances.updated_at IS 'Timestamp when workflow instance was last updated';
COMMENT ON COLUMN workflow_instances.completed_at IS 'Timestamp when workflow instance completed (successfully or otherwise)';
COMMENT ON COLUMN workflow_instances.correlation_id IS 'Business correlation identifier, used to link related workflow instances';

-- Indexes for workflow_instances
CREATE INDEX workflow_instances_status_idx ON workflow_instances(status);
COMMENT ON INDEX workflow_instances_status_idx IS 'Index for finding workflows by status.';

CREATE INDEX workflow_instances_correlation_idx ON workflow_instances(correlation_id);
COMMENT ON INDEX workflow_instances_correlation_idx IS 'Index for finding related workflows using the correlation ID.';

CREATE INDEX workflow_instances_definition_idx ON workflow_instances(workflow_definition_id);
COMMENT ON INDEX workflow_instances_definition_idx IS 'Index for finding all instances of a specific workflow definition.';

-- Note: Indexing JSONB fields requires careful consideration based on query patterns.
-- The following are examples based on the markdown, adjust as needed.

-- Example index for current_step_id (if frequently queried directly, otherwise might rely on status)
-- CREATE INDEX workflow_instances_current_step_json_idx ON workflow_instances((state->>'currentStepId'));
-- COMMENT ON INDEX workflow_instances_current_step_json_idx IS 'Index on the currentStepId field within the state JSONB.';

-- Example index for waiting event pattern (more specific than the original index)
CREATE INDEX workflow_instances_waiting_for_event_pattern_idx ON workflow_instances((state->'waitingForEvent'->>'eventPattern')) WHERE status = 'WAITING_FOR_EVENT';
COMMENT ON INDEX workflow_instances_waiting_for_event_pattern_idx IS 'Partial index for efficiently finding instances waiting for a specific event pattern.';

-- Add trigger to automatically update updated_at timestamp for both tables
-- Reusing the trigger function from migration 003 if it exists, otherwise create it.
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp_workflow_definitions
BEFORE UPDATE ON workflow_definitions
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_workflow_instances
BEFORE UPDATE ON workflow_instances
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();