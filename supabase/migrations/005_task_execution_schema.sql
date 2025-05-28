-- Enable pgcrypto extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create ENUM types
CREATE TYPE task_type AS ENUM ('AUTOMATED', 'MANUAL', 'INTEGRATION');
CREATE TYPE task_status AS ENUM ('PENDING', 'ASSIGNED', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED', 'TIMED_OUT');
CREATE TYPE task_priority AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- Helper function for updated_at timestamps
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

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
CREATE INDEX task_definitions_type_idx ON task_definitions (type);
CREATE INDEX task_definitions_version_idx ON task_definitions (version);
CREATE INDEX task_definitions_created_at_idx ON task_definitions (created_at);
CREATE INDEX task_definitions_input_schema_gin_idx ON task_definitions USING GIN (input_schema);
CREATE INDEX task_definitions_output_schema_gin_idx ON task_definitions USING GIN (output_schema);
CREATE INDEX task_definitions_execution_config_gin_idx ON task_definitions USING GIN (execution_config);
CREATE INDEX task_definitions_ui_components_gin_idx ON task_definitions USING GIN (ui_components);
CREATE INDEX task_definitions_metadata_gin_idx ON task_definitions USING GIN (metadata);
CREATE INDEX task_definitions_executor_idx ON task_definitions USING BTREE ((execution_config->>'executor'));
CREATE INDEX task_definitions_security_level_idx ON task_definitions USING BTREE ((execution_config->'securityContext'->>'securityLevel'));

-- Trigger to update updated_at on modification
CREATE TRIGGER set_timestamp_task_definitions
BEFORE UPDATE ON task_definitions
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- Table: task_instances
CREATE TABLE task_instances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_definition_id UUID NOT NULL REFERENCES task_definitions(id),
  workflow_instance_id UUID REFERENCES workflow_instances(id),
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
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_task_instances_task_definition FOREIGN KEY (task_definition_id) REFERENCES task_definitions(id),
  CONSTRAINT fk_task_instances_workflow_instance FOREIGN KEY (workflow_instance_id) REFERENCES workflow_instances(id),
  CONSTRAINT check_retry_count_non_negative CHECK (retry_count >= 0),
  CONSTRAINT check_version_positive CHECK (version > 0)
);

-- Indexes for task_instances
CREATE INDEX task_instances_task_definition_idx ON task_instances (task_definition_id);
CREATE INDEX task_instances_workflow_idx ON task_instances (workflow_instance_id);
CREATE INDEX task_instances_status_idx ON task_instances (status);
CREATE INDEX task_instances_type_idx ON task_instances (type);
CREATE INDEX task_instances_executor_idx ON task_instances (executor_id);
CREATE INDEX task_instances_assignee_idx ON task_instances (assignee);
CREATE INDEX task_instances_priority_idx ON task_instances (priority);
CREATE INDEX task_instances_status_priority_idx ON task_instances (status, priority);
CREATE INDEX task_instances_workflow_status_idx ON task_instances (workflow_instance_id, status);
CREATE INDEX task_instances_type_status_idx ON task_instances (type, status);
CREATE INDEX task_instances_created_at_idx ON task_instances (created_at);
CREATE INDEX task_instances_input_gin_idx ON task_instances USING GIN (input);
CREATE INDEX task_instances_output_gin_idx ON task_instances USING GIN (output);
CREATE INDEX task_instances_error_gin_idx ON task_instances USING GIN (error);
CREATE INDEX task_instances_execution_metadata_gin_idx ON task_instances USING GIN (execution_metadata);
CREATE INDEX task_instances_error_code_idx ON task_instances USING BTREE ((error->>'code')) WHERE error IS NOT NULL;
CREATE INDEX task_instances_start_time_idx ON task_instances USING BTREE ((execution_metadata->>'start_time'));

-- Trigger to update updated_at on modification
CREATE TRIGGER set_timestamp_task_instances
BEFORE UPDATE ON task_instances
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
