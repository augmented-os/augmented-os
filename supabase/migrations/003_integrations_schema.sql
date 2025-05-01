-- Enable pgcrypto extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create ENUM types
CREATE TYPE auth_method_enum AS ENUM ('oauth2', 'apikey', 'custom');
CREATE TYPE context_scope_enum AS ENUM ('global', 'client', 'user');

-- Create the integration_definitions table
CREATE TABLE integration_definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Use Supabase default for UUID generation
    integration_id VARCHAR(255) NOT NULL UNIQUE,   -- Unique identifier (e.g., "xero")
    name VARCHAR(255) NOT NULL,                    -- Human-readable name
    description TEXT,                              -- Detailed description
    version VARCHAR(50) NOT NULL,                  -- Semantic version of this integration
    methods JSONB,                                 -- Available methods this integration provides
    config_schema JSONB,                           -- Configuration schema for this integration
    auth_type auth_method_enum NOT NULL,           -- Authentication method (using ENUM type)
    oauth2_config JSONB,                           -- OAuth2 configuration if applicable (nullable)
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL, -- Creation timestamp
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL  -- Last update timestamp
);

-- Add comments to the table and columns
COMMENT ON TABLE integration_definitions IS 'Stores definitions for external service integrations.';
COMMENT ON COLUMN integration_definitions.id IS 'Primary key (UUID)';
COMMENT ON COLUMN integration_definitions.integration_id IS 'Unique identifier for the integration (e.g., "xero")';
COMMENT ON COLUMN integration_definitions.name IS 'Human-readable name of the integration';
COMMENT ON COLUMN integration_definitions.description IS 'Detailed description of the integration';
COMMENT ON COLUMN integration_definitions.version IS 'Semantic version of the integration definition';
COMMENT ON COLUMN integration_definitions.methods IS 'JSONB array defining available methods (actions) the integration can perform';
COMMENT ON COLUMN integration_definitions.config_schema IS 'JSONB schema defining configuration required for instances of this integration';
COMMENT ON COLUMN integration_definitions.auth_type IS 'Authentication method used by the integration (Enum: auth_method_enum)';
COMMENT ON COLUMN integration_definitions.oauth2_config IS 'JSONB containing OAuth2 specific configuration, applicable only if auth_type is "oauth2"';
COMMENT ON COLUMN integration_definitions.created_at IS 'Timestamp of when the record was created';
COMMENT ON COLUMN integration_definitions.updated_at IS 'Timestamp of when the record was last updated';

-- The unique index on integration_id is already created by the UNIQUE constraint in the table definition.

-- Add trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON integration_definitions
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- Create the integration_instances table
CREATE TABLE integration_instances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    instance_id VARCHAR(255) NOT NULL UNIQUE,         -- Unique identifier for this instance
    integration_definition_id UUID NOT NULL REFERENCES integration_definitions(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,                      -- Human-readable name for this instance
    description TEXT,                                -- Optional description
    context_type context_scope_enum NOT NULL DEFAULT 'global', -- Context type (using ENUM, defaults to global)
    context_id VARCHAR(255),                           -- ID of client/user if scoped (NULL for global)
    credentials BYTEA,                                 -- Encrypted credentials (using pgcrypto with AES-256 via application layer)
    config JSONB,                                    -- Instance specific configuration
    status JSONB,                                    -- Current status information
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    last_used_at TIMESTAMPTZ                         -- When this integration was last used (nullable)
);

-- Add comments to the table and columns
COMMENT ON TABLE integration_instances IS 'Stores configured instances of integrations, linking to definitions and holding specific credentials and settings.';
COMMENT ON COLUMN integration_instances.id IS 'Primary key (UUID)';
COMMENT ON COLUMN integration_instances.instance_id IS 'Unique identifier for this specific integration instance';
COMMENT ON COLUMN integration_instances.integration_definition_id IS 'Foreign key referencing the integration_definitions table';
COMMENT ON COLUMN integration_instances.name IS 'Human-readable name assigned to this instance';
COMMENT ON COLUMN integration_instances.description IS 'Optional description for the integration instance';
COMMENT ON COLUMN integration_instances.context_type IS 'Scope of the instance (Enum: context_scope_enum, defaults to global)';
COMMENT ON COLUMN integration_instances.context_id IS 'Identifier for the client or user if context_type is not global (NULL if global)';
COMMENT ON COLUMN integration_instances.credentials IS 'Encrypted credentials (BYTEA) using pgcrypto AES-256 via application layer. Key stored temporarily in env (CREDENTIALS_ENCRYPTION_KEY), planned integration with Key Manager.';
COMMENT ON COLUMN integration_instances.config IS 'JSONB containing instance-specific configuration values, validated against the definition schema';
COMMENT ON COLUMN integration_instances.status IS 'JSONB containing the current operational status and metrics of the instance';
COMMENT ON COLUMN integration_instances.created_at IS 'Timestamp of when the record was created';
COMMENT ON COLUMN integration_instances.updated_at IS 'Timestamp of when the record was last updated';
COMMENT ON COLUMN integration_instances.last_used_at IS 'Timestamp of the last time this integration instance was successfully used';

-- Create indexes
-- Unique index on instance_id is already created by the UNIQUE constraint.
CREATE INDEX integration_instances_context_idx ON integration_instances (context_type, context_id);
CREATE INDEX integration_instances_definition_idx ON integration_instances (integration_definition_id);
CREATE INDEX integration_instances_status_gin_idx ON integration_instances USING GIN (status); -- Use GIN for JSONB indexing

-- Add trigger to automatically update updated_at timestamp
CREATE TRIGGER set_timestamp_instances
BEFORE UPDATE ON integration_instances
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();
