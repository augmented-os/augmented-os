-- Initial Setup
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

-- Schema Setup
CREATE SCHEMA IF NOT EXISTS "public";
ALTER SCHEMA "public" OWNER TO "pg_database_owner";
COMMENT ON SCHEMA "public" IS 'standard public schema';

-- Helper Function: update_updated_at_column
CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$;
ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";

-- Default Settings
SET default_tablespace = '';
SET default_table_access_method = "heap";

-- Table: poc_document_versions
CREATE TABLE IF NOT EXISTS "public"."poc_document_versions" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "doc_id" "uuid",
    "yjs_state" "bytea",
    "diff" "jsonb",
    "author" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);
ALTER TABLE "public"."poc_document_versions" OWNER TO "postgres";

-- Table: poc_documents
CREATE TABLE IF NOT EXISTS "public"."poc_documents" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "slug" "text",
    "title" "text",
    "path" "text",
    "tags" "text"[],
    "created_at" timestamp with time zone DEFAULT "now"()
);
ALTER TABLE "public"."poc_documents" OWNER TO "postgres";

-- Table: poc_draft_diffs
CREATE TABLE IF NOT EXISTS "public"."poc_draft_diffs" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "doc_id" "uuid",
    "diff" "jsonb",
    "status" "text" DEFAULT 'pending'::"text",
    "created_at" timestamp with time zone DEFAULT "now"()
);
ALTER TABLE "public"."poc_draft_diffs" OWNER TO "postgres";

-- Table: poc_integrations
CREATE TABLE IF NOT EXISTS "public"."poc_integrations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "provider" "text" NOT NULL,
    "category" "text" NOT NULL,
    "icon_url" "text",
    "input_schema" "jsonb",
    "output_schema" "jsonb",
    "config_schema" "jsonb",
    "requires_connection" boolean DEFAULT true NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);
ALTER TABLE "public"."poc_integrations" OWNER TO "postgres";

COMMENT ON TABLE "public"."poc_integrations" IS 'Catalog of available integration types/actions that can be used as nodes in workflows.';
COMMENT ON COLUMN "public"."poc_integrations"."id" IS 'Unique identifier for the integration type (Primary Key). Referenced by workflow nodes in their config.integration_id.';
COMMENT ON COLUMN "public"."poc_integrations"."name" IS 'Human-readable name of the integration action (e.g., "Google Sheets: Add Row", "OpenAI: Chat Completion").';
COMMENT ON COLUMN "public"."poc_integrations"."provider" IS 'The service/provider name (e.g., "google-sheets", "openai"). Used for matching connections.';
COMMENT ON COLUMN "public"."poc_integrations"."category" IS 'High-level category for UI grouping (e.g., "Data Store", "AI", "Messaging").';
COMMENT ON COLUMN "public"."poc_integrations"."icon_url" IS 'Optional URL pointing to an icon representing this integration/provider.';
COMMENT ON COLUMN "public"."poc_integrations"."input_schema" IS 'JSONB array defining the expected runtime input fields (template). [{id, name, dataType,...}].';
COMMENT ON COLUMN "public"."poc_integrations"."output_schema" IS 'JSONB array defining the structure of the data returned by the integration. [{id, name, dataType,...}].';
COMMENT ON COLUMN "public"."poc_integrations"."config_schema" IS 'JSONB array defining design-time configuration fields specific to this integration. Optional. [{id, name, dataType, default,...}].';
COMMENT ON COLUMN "public"."poc_integrations"."requires_connection" IS 'Indicates if this integration needs a corresponding entry in the ''connections'' table (typically True).';
COMMENT ON COLUMN "public"."poc_integrations"."created_at" IS 'Timestamp of creation.';
COMMENT ON COLUMN "public"."poc_integrations"."updated_at" IS 'Timestamp of last update.';

-- Table: poc_workflow_folders
CREATE TABLE IF NOT EXISTS "public"."poc_workflow_folders" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);
ALTER TABLE "public"."poc_workflow_folders" OWNER TO "postgres";

-- Table: poc_workflows
CREATE TABLE IF NOT EXISTS "public"."poc_workflows" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "nodes" "jsonb" NOT NULL,
    "edges" "jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "workflow_folder_id" "uuid",
    "input_schema" "jsonb",
    "output_schema" "jsonb"
);
ALTER TABLE "public"."poc_workflows" OWNER TO "postgres";

-- Primary Keys
ALTER TABLE ONLY "public"."poc_document_versions"
    ADD CONSTRAINT "document_versions_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."poc_draft_diffs"
    ADD CONSTRAINT "draft_diffs_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."poc_documents"
    ADD CONSTRAINT "poc_documents_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."poc_integrations"
    ADD CONSTRAINT "poc_integrations_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."poc_workflow_folders"
    ADD CONSTRAINT "poc_workflow_folders_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."poc_workflows"
    ADD CONSTRAINT "poc_workflows_pkey" PRIMARY KEY ("id");

-- Unique Constraints
ALTER TABLE ONLY "public"."poc_documents"
    ADD CONSTRAINT "documents_slug_key" UNIQUE ("slug");

ALTER TABLE ONLY "public"."poc_workflow_folders"
    ADD CONSTRAINT "workflow_folders_name_key" UNIQUE ("name");

-- Indexes
CREATE INDEX "idx_integrations_category" ON "public"."poc_integrations" USING "btree" ("category");
CREATE INDEX "idx_integrations_provider" ON "public"."poc_integrations" USING "btree" ("provider");

-- Triggers
CREATE OR REPLACE TRIGGER "update_integrations_updated_at"
    BEFORE UPDATE ON "public"."poc_integrations"
    FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();

-- Foreign Keys
ALTER TABLE ONLY "public"."poc_document_versions"
    ADD CONSTRAINT "document_versions_doc_id_fkey" FOREIGN KEY ("doc_id") REFERENCES "public"."poc_documents"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."poc_draft_diffs"
    ADD CONSTRAINT "draft_diffs_doc_id_fkey" FOREIGN KEY ("doc_id") REFERENCES "public"."poc_documents"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."poc_workflows"
    ADD CONSTRAINT "fk_workflow_folder" FOREIGN KEY ("workflow_folder_id") REFERENCES "public"."poc_workflow_folders"("id") ON DELETE SET NULL;

-- Grants: Schema Usage
GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

-- Grants: Function Execution
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";

-- Grants: Table Permissions
GRANT ALL ON TABLE "public"."poc_document_versions" TO "anon";
GRANT ALL ON TABLE "public"."poc_document_versions" TO "authenticated";
GRANT ALL ON TABLE "public"."poc_document_versions" TO "service_role";

GRANT ALL ON TABLE "public"."poc_documents" TO "anon";
GRANT ALL ON TABLE "public"."poc_documents" TO "authenticated";
GRANT ALL ON TABLE "public"."poc_documents" TO "service_role";

GRANT ALL ON TABLE "public"."poc_draft_diffs" TO "anon";
GRANT ALL ON TABLE "public"."poc_draft_diffs" TO "authenticated";
GRANT ALL ON TABLE "public"."poc_draft_diffs" TO "service_role";

GRANT ALL ON TABLE "public"."poc_integrations" TO "anon";
GRANT ALL ON TABLE "public"."poc_integrations" TO "authenticated";
GRANT ALL ON TABLE "public"."poc_integrations" TO "service_role";

GRANT ALL ON TABLE "public"."poc_workflow_folders" TO "anon";
GRANT ALL ON TABLE "public"."poc_workflow_folders" TO "authenticated";
GRANT ALL ON TABLE "public"."poc_workflow_folders" TO "service_role";

GRANT ALL ON TABLE "public"."poc_workflows" TO "anon";
GRANT ALL ON TABLE "public"."poc_workflows" TO "authenticated";
GRANT ALL ON TABLE "public"."poc_workflows" TO "service_role";

-- Default Privileges: Sequences
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";

-- Default Privileges: Functions
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";

-- Default Privileges: Tables
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";

-- Final Reset (Optional but common in pg_dump)
RESET ALL;
