-- Table: public.tenant_schemas
-- Stores the JSON schema definitions provided by each tenant.
CREATE TABLE IF NOT EXISTS public.tenant_schemas (
    schema_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,                     -- Identifier for the tenant owning this schema
    version INTEGER NOT NULL,                  -- Monotonically increasing version number per tenant's schema
    schema_json JSONB NOT NULL,                -- The JSON object defining the tenant's database schema
    applied_at TIMESTAMP WITH TIME ZONE NULL, -- Timestamp when this version was applied, or null if pending/failed
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT tenant_schemas_tenant_ver_uniq UNIQUE (tenant_id, version),
    CONSTRAINT tenant_schemas_version_check CHECK (version > 0)
);

COMMENT ON TABLE public.tenant_schemas IS 'Stores the JSON schema definitions provided by each tenant, tracking versions and application status.';
COMMENT ON COLUMN public.tenant_schemas.schema_id IS 'Primary key for this specific schema version record';
COMMENT ON COLUMN public.tenant_schemas.tenant_id IS 'Foreign key identifying the tenant (logically links to auth.users or tenant management table)';
COMMENT ON COLUMN public.tenant_schemas.version IS 'Monotonically increasing schema version number per tenant';
COMMENT ON COLUMN public.tenant_schemas.schema_json IS 'The tenant''s JSON schema definition';
COMMENT ON COLUMN public.tenant_schemas.applied_at IS 'Timestamp when this schema version was successfully applied to the database';
COMMENT ON COLUMN public.tenant_schemas.created_at IS 'Timestamp when the record was created';
COMMENT ON COLUMN public.tenant_schemas.updated_at IS 'Timestamp when the record was last updated';

-- Indexes for tenant_schemas
CREATE INDEX IF NOT EXISTS tenant_schemas_tenant_id_idx ON public.tenant_schemas (tenant_id);

-- Table: public.schema_migrations
-- Audit log for attempts to apply tenant schema changes.
CREATE TABLE IF NOT EXISTS public.schema_migrations (
    migration_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_schema_id UUID NOT NULL REFERENCES public.tenant_schemas(schema_id) ON DELETE RESTRICT,
    tenant_id UUID NOT NULL,           -- Denormalized tenant identifier for easier querying
    version_applied INTEGER NOT NULL,  -- Denormalized schema version number attempted
    status TEXT NOT NULL DEFAULT 'pending', -- Status of the migration attempt (e.g., 'pending', 'success', 'failed')
    details TEXT NULL,                 -- Details about the migration outcome (errors, summary)
    applied_by VARCHAR(255) NULL,      -- Identifier of the user or service initiating the migration
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT schema_migrations_status_chk CHECK (status IN ('pending', 'success', 'failed'))
);

COMMENT ON TABLE public.schema_migrations IS 'Audit log recording the history and status of attempts to apply tenant schema changes.';
COMMENT ON COLUMN public.schema_migrations.migration_id IS 'Primary key for this migration log record';
COMMENT ON COLUMN public.schema_migrations.tenant_schema_id IS 'Foreign key to the public.tenant_schemas record this migration corresponds to';
COMMENT ON COLUMN public.schema_migrations.tenant_id IS 'Denormalized tenant identifier for easier querying';
COMMENT ON COLUMN public.schema_migrations.version_applied IS 'Denormalized schema version number attempted';
COMMENT ON COLUMN public.schema_migrations.status IS 'Status of the migration attempt (e.g., ''pending'', ''success'', ''failed'')';
COMMENT ON COLUMN public.schema_migrations.details IS 'Details about the migration outcome (errors, summary)';
COMMENT ON COLUMN public.schema_migrations.applied_by IS 'Identifier of the user or service initiating the migration';
COMMENT ON COLUMN public.schema_migrations.created_at IS 'Timestamp when the migration attempt was recorded';
COMMENT ON COLUMN public.schema_migrations.updated_at IS 'Timestamp when the record (e.g., status) was last updated';

-- Indexes for schema_migrations
CREATE INDEX IF NOT EXISTS schema_migrations_tenant_id_idx ON public.schema_migrations (tenant_id);
CREATE INDEX IF NOT EXISTS schema_migrations_schema_id_idx ON public.schema_migrations (tenant_schema_id);
CREATE INDEX IF NOT EXISTS schema_migrations_created_at_idx ON public.schema_migrations (created_at);

-- Note: RLS policies and the requesting_tenant_id function have been removed as the tables are now in the public schema.
-- Access control should be managed via standard GRANT statements or redefined RLS policies on the public tables if needed.
