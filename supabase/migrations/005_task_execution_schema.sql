-- Migration: Task Execution Schema - Task Definitions
-- Description: Creates the task_definitions table with all necessary constraints, indexes, and triggers
-- Based on: docs/architecture/components/task_execution_service/schemas/task_definitions.md

-- Create task type enum
CREATE TYPE task_type AS ENUM (
  'AUTOMATED',
  'MANUAL',
  'INTEGRATION'
);

-- Create function for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create task_definitions table
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
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add check constraints
ALTER TABLE task_definitions 
  ADD CONSTRAINT check_timeout_positive 
  CHECK (timeout IS NULL OR timeout > 0);

-- Create automatic timestamp update trigger
CREATE TRIGGER update_task_definitions_updated_at 
  BEFORE UPDATE ON task_definitions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create basic indexes
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
CREATE INDEX task_definitions_executor_idx ON task_definitions 
  USING BTREE ((execution_config->>'executor'));
CREATE INDEX task_definitions_security_level_idx ON task_definitions 
  USING BTREE ((execution_config->'securityContext'->>'securityLevel'));

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

-- Create additional enums for task instances
CREATE TYPE task_status AS ENUM (
  'PENDING',
  'ASSIGNED', 
  'RUNNING',
  'COMPLETED',
  'FAILED',
  'CANCELLED',
  'TIMED_OUT'
);

CREATE TYPE task_priority AS ENUM (
  'LOW',
  'MEDIUM',
  'HIGH', 
  'CRITICAL'
);

-- Create task_instances table
CREATE TABLE task_instances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_definition_id UUID NOT NULL,
  workflow_instance_id UUID,
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
  version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add foreign key constraints
ALTER TABLE task_instances 
  ADD CONSTRAINT fk_task_instances_task_definition 
  FOREIGN KEY (task_definition_id) REFERENCES task_definitions(id);

-- Note: workflow_instances table constraint will be added when that table is created
-- ALTER TABLE task_instances 
--   ADD CONSTRAINT fk_task_instances_workflow_instance 
--   FOREIGN KEY (workflow_instance_id) REFERENCES workflow_instances(id);

-- Add check constraints for task instances
ALTER TABLE task_instances 
  ADD CONSTRAINT check_retry_count_non_negative 
  CHECK (retry_count >= 0);

ALTER TABLE task_instances 
  ADD CONSTRAINT check_version_positive 
  CHECK (version > 0);

-- Create automatic timestamp update trigger for task instances
CREATE TRIGGER update_task_instances_updated_at 
  BEFORE UPDATE ON task_instances 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create basic indexes for task instances
CREATE INDEX task_instances_task_definition_idx ON task_instances (task_definition_id);
CREATE INDEX task_instances_workflow_idx ON task_instances (workflow_instance_id);
CREATE INDEX task_instances_status_idx ON task_instances (status);
CREATE INDEX task_instances_type_idx ON task_instances (type);
CREATE INDEX task_instances_executor_idx ON task_instances (executor_id);
CREATE INDEX task_instances_assignee_idx ON task_instances (assignee);
CREATE INDEX task_instances_priority_idx ON task_instances (priority);

-- Create composite indexes for common query patterns
CREATE INDEX task_instances_status_priority_idx ON task_instances (status, priority);
CREATE INDEX task_instances_workflow_status_idx ON task_instances (workflow_instance_id, status);
CREATE INDEX task_instances_type_status_idx ON task_instances (type, status);
CREATE INDEX task_instances_created_at_idx ON task_instances (created_at);

-- Create JSONB indexes for nested data queries
CREATE INDEX task_instances_input_gin_idx ON task_instances USING GIN (input);
CREATE INDEX task_instances_output_gin_idx ON task_instances USING GIN (output);
CREATE INDEX task_instances_error_gin_idx ON task_instances USING GIN (error);
CREATE INDEX task_instances_execution_metadata_gin_idx ON task_instances USING GIN (execution_metadata);

-- Create specific JSONB field indexes for common queries
CREATE INDEX task_instances_error_code_idx ON task_instances 
  USING BTREE ((error->>'code')) WHERE error IS NOT NULL;
CREATE INDEX task_instances_start_time_idx ON task_instances 
  USING BTREE ((execution_metadata->>'start_time'));

-- Add comments for task instances documentation
COMMENT ON TABLE task_instances IS 'Task instances represent individual executions of task definitions within workflows';
COMMENT ON COLUMN task_instances.id IS 'Primary key UUID';
COMMENT ON COLUMN task_instances.task_definition_id IS 'Reference to the task definition template';
COMMENT ON COLUMN task_instances.workflow_instance_id IS 'Reference to the parent workflow instance (optional)';
COMMENT ON COLUMN task_instances.step_id IS 'Step identifier within the workflow';
COMMENT ON COLUMN task_instances.status IS 'Current execution status of the task';
COMMENT ON COLUMN task_instances.type IS 'Type of task: AUTOMATED, MANUAL, or INTEGRATION';
COMMENT ON COLUMN task_instances.input IS 'Input data provided for task execution';
COMMENT ON COLUMN task_instances.output IS 'Output data produced by task execution';
COMMENT ON COLUMN task_instances.error IS 'Error information if the task failed';
COMMENT ON COLUMN task_instances.executor_id IS 'ID of the executor handling this task';
COMMENT ON COLUMN task_instances.assignee IS 'For manual tasks, the assigned user or role';
COMMENT ON COLUMN task_instances.priority IS 'Execution priority level';
COMMENT ON COLUMN task_instances.retry_count IS 'Number of retry attempts made';
COMMENT ON COLUMN task_instances.retry_policy IS 'Retry policy configuration for handling failures';
COMMENT ON COLUMN task_instances.execution_metadata IS 'Execution-specific metadata including timing and environment';
COMMENT ON COLUMN task_instances.version IS 'Version for optimistic concurrency control';
COMMENT ON COLUMN task_instances.created_at IS 'Timestamp when the task instance was created';
COMMENT ON COLUMN task_instances.updated_at IS 'Timestamp when the task instance was last updated';
