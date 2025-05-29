-- Migration: Task Execution Schema - Task Definitions
-- Description: Creates the task_definitions table with all necessary constraints, indexes, and triggers
-- Based on: docs/architecture/components/task_execution_service/schemas/task_definitions.md

-- Enable pgcrypto extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create ENUM types
CREATE TYPE task_type AS ENUM ('AUTOMATED', 'MANUAL', 'INTEGRATION');
CREATE TYPE task_status AS ENUM ('PENDING', 'ASSIGNED', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED', 'TIMED_OUT');
CREATE TYPE task_priority AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- ==========================================================================
-- UNIVERSAL FLAG SYSTEM
-- Define flag types for semantic row styling across business scenarios
-- ==========================================================================

CREATE TYPE flag_type AS ENUM (
  'error',    -- Red: critical issues, violations, failures
  'warning',  -- Orange/Yellow: needs attention, non-standard  
  'success',  -- Green: approved, compliant, good
  'info',     -- Blue: informational, neutral highlight
  'pending'   -- Gray: awaiting action, in progress
);

COMMENT ON TYPE flag_type IS 'Universal flag types for semantic row styling across business scenarios';

-- Helper function for updated_at timestamps
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==========================================================================
-- FLAG CONFIGURATION TABLE
-- Store reusable flag configurations for different business contexts
-- ==========================================================================

CREATE TABLE flag_configurations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  config_name text NOT NULL UNIQUE,
  description text,
  flag_styles jsonb NOT NULL DEFAULT '{}'::jsonb,
  badge_configs jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

COMMENT ON TABLE flag_configurations IS 'Reusable flag styling configurations for different business contexts';
COMMENT ON COLUMN flag_configurations.flag_styles IS 'CSS classes for row styling by flag type';
COMMENT ON COLUMN flag_configurations.badge_configs IS 'Badge configurations (class, text) by flag type';

-- Create indexes for flag_configurations
CREATE INDEX idx_flag_configurations_config_name ON flag_configurations(config_name);
CREATE INDEX idx_flag_configurations_created_at ON flag_configurations(created_at);

-- Trigger to update updated_at on modification for flag_configurations
CREATE TRIGGER set_timestamp_flag_configurations
BEFORE UPDATE ON flag_configurations
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- Insert standard flag configurations
INSERT INTO flag_configurations (config_name, description, flag_styles, badge_configs) VALUES 
-- Default configuration for general business scenarios
('default', 'Standard flag configuration for general business scenarios', 
'{
  "error": "bg-red-50 border-l-4 border-red-400",
  "warning": "bg-orange-50 border-l-4 border-orange-400",
  "success": "bg-green-50 border-l-4 border-green-400", 
  "info": "bg-blue-50 border-l-4 border-blue-400",
  "pending": "bg-gray-50 border-l-4 border-gray-400"
}'::jsonb,
'{
  "error": {"class": "bg-red-100 text-red-800", "text": "Critical"},
  "warning": {"class": "bg-orange-100 text-orange-800", "text": "Warning"},
  "success": {"class": "bg-green-100 text-green-800", "text": "Approved"},
  "info": {"class": "bg-blue-100 text-blue-800", "text": "Info"},
  "pending": {"class": "bg-gray-100 text-gray-800", "text": "Pending"}
}'::jsonb),

-- Financial review specific configuration
('financial_review', 'Flag configuration optimized for financial data review',
'{
  "error": "bg-red-50 border-l-4 border-red-500",
  "warning": "bg-yellow-50 border-l-4 border-yellow-500",
  "success": "bg-emerald-50 border-l-4 border-emerald-500",
  "info": "bg-indigo-50 border-l-4 border-indigo-500",
  "pending": "bg-slate-50 border-l-4 border-slate-500"
}'::jsonb,
'{
  "error": {"class": "bg-red-100 text-red-900", "text": "Risk"},
  "warning": {"class": "bg-yellow-100 text-yellow-900", "text": "Review"},
  "success": {"class": "bg-emerald-100 text-emerald-900", "text": "Compliant"},
  "info": {"class": "bg-indigo-100 text-indigo-900", "text": "Note"},
  "pending": {"class": "bg-slate-100 text-slate-900", "text": "Analysis"}
}'::jsonb),

-- Compliance/Legal configuration
('compliance', 'Flag configuration for compliance and legal review processes',
'{
  "error": "bg-red-50 border-l-4 border-red-600",
  "warning": "bg-amber-50 border-l-4 border-amber-600", 
  "success": "bg-green-50 border-l-4 border-green-600",
  "info": "bg-cyan-50 border-l-4 border-cyan-600",
  "pending": "bg-neutral-50 border-l-4 border-neutral-600"
}'::jsonb,
'{
  "error": {"class": "bg-red-100 text-red-900", "text": "Violation"},
  "warning": {"class": "bg-amber-100 text-amber-900", "text": "Non-standard"},
  "success": {"class": "bg-green-100 text-green-900", "text": "Compliant"},
  "info": {"class": "bg-cyan-100 text-cyan-900", "text": "Reference"},
  "pending": {"class": "bg-neutral-100 text-neutral-900", "text": "Under Review"}
}'::jsonb);

-- ==========================================================================
-- TASK DEFINITIONS TABLE
-- ==========================================================================

-- Table: task_definitions
CREATE TABLE task_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type task_type NOT NULL,
  version VARCHAR(50) NOT NULL,
  input_schema JSONB NOT NULL,
  output_schema JSONB NOT NULL,
  timeout INTEGER,
  retry_policy JSONB,
  execution_config JSONB NOT NULL,
  ui_components JSONB,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT check_timeout_positive CHECK (timeout IS NULL OR timeout > 0)
);

-- Indexes for task_definitions
CREATE UNIQUE INDEX task_definitions_task_id_idx ON task_definitions (task_id);
CREATE INDEX task_definitions_type_idx ON task_definitions (type);
CREATE INDEX task_definitions_version_idx ON task_definitions (version);
CREATE INDEX task_definitions_created_at_idx ON task_definitions (created_at);

-- Create JSONB indexes for nested data queries
CREATE INDEX task_definitions_input_schema_gin_idx ON task_definitions USING GIN (input_schema);
CREATE INDEX task_definitions_output_schema_gin_idx ON task_definitions USING GIN (output_schema);
CREATE INDEX task_definitions_execution_config_gin_idx ON task_definitions USING GIN (execution_config);
CREATE INDEX task_definitions_ui_components_gin_idx ON task_definitions USING GIN (ui_components);
CREATE INDEX task_definitions_metadata_gin_idx ON task_definitions USING GIN (metadata);

-- Create specific JSONB field indexes for common queries
CREATE INDEX task_definitions_executor_idx ON task_definitions USING BTREE ((execution_config->>'executor'));
CREATE INDEX task_definitions_security_level_idx ON task_definitions USING BTREE ((execution_config->'securityContext'->>'securityLevel'));

-- Trigger to update updated_at on modification
CREATE TRIGGER set_timestamp_task_definitions
BEFORE UPDATE ON task_definitions
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- Add comments for documentation
COMMENT ON TABLE task_definitions IS 'Task definitions are templates that describe atomic units of work within the workflow system';
COMMENT ON COLUMN task_definitions.id IS 'Primary key UUID';
COMMENT ON COLUMN task_definitions.task_id IS 'Unique business identifier for the task';
COMMENT ON COLUMN task_definitions.name IS 'Human-readable name for the task';
COMMENT ON COLUMN task_definitions.description IS 'Detailed description of the task';
COMMENT ON COLUMN task_definitions.type IS 'Task type: AUTOMATED, MANUAL, or INTEGRATION';
COMMENT ON COLUMN task_definitions.version IS 'Semantic version of the task definition';
COMMENT ON COLUMN task_definitions.input_schema IS 'JSON Schema defining the structure of task inputs';
COMMENT ON COLUMN task_definitions.output_schema IS 'JSON Schema defining the structure of task outputs';
COMMENT ON COLUMN task_definitions.timeout IS 'Maximum execution time in milliseconds';
COMMENT ON COLUMN task_definitions.retry_policy IS 'Default retry policy configuration';
COMMENT ON COLUMN task_definitions.execution_config IS 'Configuration for task execution including executor and security context';
COMMENT ON COLUMN task_definitions.ui_components IS 'UI component references and conditions for manual tasks';
COMMENT ON COLUMN task_definitions.metadata IS 'Additional metadata for the task definition';
COMMENT ON COLUMN task_definitions.created_at IS 'Timestamp when the task definition was created';
COMMENT ON COLUMN task_definitions.updated_at IS 'Timestamp when the task definition was last updated';

-- ============================================================================
-- Task Instances Schema
-- Based on: docs/architecture/components/task_execution_service/schemas/task_instances.md
-- ============================================================================

-- Table: task_instances
CREATE TABLE task_instances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_definition_id UUID NOT NULL REFERENCES task_definitions(id),
  workflow_instance_id UUID REFERENCES workflow_instances(id),
  workflow_definition_id UUID REFERENCES workflow_definitions(id),
  step_id VARCHAR(255) NOT NULL,
  status task_status NOT NULL,
  type task_type NOT NULL,
  input JSONB NOT NULL,
  output JSONB,
  error JSONB,
  executor_id VARCHAR(255) NOT NULL,
  assignee VARCHAR(255),
  priority task_priority NOT NULL DEFAULT 'MEDIUM',
  retry_count INTEGER NOT NULL DEFAULT 0,
  retry_policy JSONB,
  execution_metadata JSONB NOT NULL,
  task_reference TEXT,
  version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT check_retry_count_non_negative CHECK (retry_count >= 0),
  CONSTRAINT check_version_positive CHECK (version > 0)
);

-- Create indexes for task instances
CREATE INDEX task_instances_task_definition_idx ON task_instances (task_definition_id);
CREATE INDEX task_instances_workflow_idx ON task_instances (workflow_instance_id);
CREATE INDEX task_instances_workflow_definition_idx ON task_instances (workflow_definition_id);
CREATE INDEX task_instances_status_idx ON task_instances (status);
CREATE INDEX task_instances_type_idx ON task_instances (type);
CREATE INDEX task_instances_executor_idx ON task_instances (executor_id);
CREATE INDEX task_instances_assignee_idx ON task_instances (assignee);
CREATE INDEX task_instances_priority_idx ON task_instances (priority);
CREATE INDEX task_instances_task_reference_idx ON task_instances (task_reference);
CREATE INDEX task_instances_created_at_idx ON task_instances (created_at);

-- Create composite indexes for common query patterns
CREATE INDEX task_instances_status_priority_idx ON task_instances (status, priority);
CREATE INDEX task_instances_workflow_status_idx ON task_instances (workflow_instance_id, status);
CREATE INDEX task_instances_workflow_def_status_idx ON task_instances (workflow_definition_id, status);
CREATE INDEX task_instances_type_status_idx ON task_instances (type, status);

-- Create JSONB indexes for nested data queries
CREATE INDEX task_instances_input_gin_idx ON task_instances USING GIN (input);
CREATE INDEX task_instances_output_gin_idx ON task_instances USING GIN (output);
CREATE INDEX task_instances_error_gin_idx ON task_instances USING GIN (error);
CREATE INDEX task_instances_execution_metadata_gin_idx ON task_instances USING GIN (execution_metadata);

-- Create specific JSONB field indexes for common queries
CREATE INDEX task_instances_error_code_idx ON task_instances USING BTREE ((error->>'code')) WHERE error IS NOT NULL;
CREATE INDEX task_instances_start_time_idx ON task_instances USING BTREE ((execution_metadata->>'start_time'));

-- Trigger to update updated_at on modification
CREATE TRIGGER set_timestamp_task_instances
BEFORE UPDATE ON task_instances
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- Add comments for documentation
COMMENT ON TABLE task_instances IS 'Task instances represent actual executions of task definitions within workflow instances';
COMMENT ON COLUMN task_instances.id IS 'Primary key UUID';
COMMENT ON COLUMN task_instances.task_definition_id IS 'Reference to the task definition this instance is based on';
COMMENT ON COLUMN task_instances.workflow_instance_id IS 'Reference to the workflow instance this task belongs to';
COMMENT ON COLUMN task_instances.workflow_definition_id IS 'Reference to the workflow definition for efficient filtering (denormalized)';
COMMENT ON COLUMN task_instances.step_id IS 'Identifier for the step within the workflow';
COMMENT ON COLUMN task_instances.status IS 'Current execution status of the task';
COMMENT ON COLUMN task_instances.type IS 'Task type inherited from definition';
COMMENT ON COLUMN task_instances.input IS 'Input data provided to the task';
COMMENT ON COLUMN task_instances.output IS 'Output data produced by the task';
COMMENT ON COLUMN task_instances.error IS 'Error information if task failed';
COMMENT ON COLUMN task_instances.executor_id IS 'Identifier of the executor handling this task';
COMMENT ON COLUMN task_instances.assignee IS 'User assigned to manual tasks';
COMMENT ON COLUMN task_instances.priority IS 'Execution priority of the task';
COMMENT ON COLUMN task_instances.retry_count IS 'Number of retry attempts made';
COMMENT ON COLUMN task_instances.retry_policy IS 'Retry policy for this specific instance';
COMMENT ON COLUMN task_instances.execution_metadata IS 'Metadata about task execution including timing and context';
COMMENT ON COLUMN task_instances.task_reference IS 'Universal reference identifier for displaying task context in UI (e.g., company name, document title, entity name)';
COMMENT ON COLUMN task_instances.version IS 'Version number for optimistic locking';
COMMENT ON COLUMN task_instances.created_at IS 'Timestamp when the task instance was created';
COMMENT ON COLUMN task_instances.updated_at IS 'Timestamp when the task instance was last updated';
