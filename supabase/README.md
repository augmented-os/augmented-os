# Supabase Configuration

This directory contains configuration and assets related to the Supabase project setup for Augmented OS.

## Directory Structure

*   **`migrations/`**: Contains SQL migration files managed by the Supabase CLI. These files define the database schema changes over time.
*   **`seeds/`**: Contains SQL files used to seed the database with initial or test data.

## Database Migrations

Database schema changes are managed using SQL migration files located in the `migrations/` directory. The Supabase CLI is used to apply these migrations.

**Key Commands:**

*   **Create a new migration:**
    ```bash
    supabase migration new <migration_name>
    ```
    This creates a new timestamped SQL file in the `migrations/` directory where you can define your schema changes (e.g., `CREATE TABLE`, `ALTER TABLE`).

*   **Apply migrations locally:**
    ```bash
    supabase db reset 
    ```
    This command stops the local Supabase instance, resets the database to the initial schema (or last known good state), and applies all pending migrations found in the `migrations/` directory. Use this frequently during development to test migration validity.
    _Note: This is destructive and resets local data._

*   **Apply migrations to linked project (staging/prod):**
    ```bash
    supabase db push
    ```
    This applies pending local migrations to the linked remote Supabase project. Ensure you have linked your project using `supabase link --project-ref <your-project-ref>`.

*   **Pull remote schema changes:**
    ```bash
    supabase db remote commit
    ```
    If schema changes were made directly via the Supabase Studio UI, this command creates a new migration file locally reflecting those changes.

Refer to the [Supabase Migrations Documentation](https://supabase.com/docs/guides/database/migrations) for more details.

## Database Seeding

The `supabase/seeds/` directory contains SQL files used to populate the database with initial or test data. This is useful for setting up default values, lookup tables, or test data.

Files within this directory are executed **in alphabetical order** by the `supabase db reset` command after all migrations have been applied. The numbered naming convention (e.g., `001_file.sql`, `002_another.sql`) is used to ensure a specific execution sequence.

## Security Notes

### Credential Encryption

The `integration_instances.credentials` column stores sensitive authentication credentials for third-party services.

*   **Encryption Method:** These credentials are encrypted at rest using PostgreSQL's `pgcrypto` extension (AES-256).
*   **Encryption Location:** The encryption and decryption logic is handled within the **application layer**, not directly in the database via SQL functions.
*   **Key Management (Development):** During development, the symmetric encryption key is stored in the `.env` file under the variable `CREDENTIALS_ENCRYPTION_KEY`. **This `.env` file must not be committed to version control.**
*   **Key Management (Planned):** The long-term plan is to integrate this encryption process with the dedicated **Auth Service Key Manager** component ([`docs/architecture/components/auth_service/implementation/key_manager.md`](../docs/architecture/components/auth_service/implementation/key_manager.md)) for secure key storage, rotation, and retrieval, removing the reliance on the `.env` file.

## Implementation Status

This table tracks the implementation status of database tables defined in the [System Data Model](../docs/architecture/data_model.md).

| Component Owner | Table Name | Migration Status | Seed Status | Notes |
|---|---|:---:|:---:|---|
| auth_service | permissions | [ ] | [ ] | No migration/seed found. |
| auth_service | roles | [ ] | [ ] | No migration/seed found. |
| auth_service | users | [ ] | [ ] | No migration/seed found. |
| business_store_service | tenant_schemas | [x] | [-] | Migration exists (`004_business_store_schema.sql`). No seed file. |
| business_store_service | schema_migrations | [x] | [-] | Migration exists (`004_business_store_schema.sql`). No seed file. |
| event_processing_service | dead_letter_queue | [ ] | [ ] | No migration/seed found. |
| event_processing_service | event_definitions | [ ] | [ ] | No migration/seed found. |
| event_processing_service | event_instances | [ ] | [ ] | No migration/seed found. |
| event_processing_service | event_queue_state | [ ] | [ ] | No migration/seed found. |
| event_processing_service | event_sequences | [ ] | [ ] | No migration/seed found. |
| integration_service | integration_definitions | [x] | [-] | Migration exists (`003_integrations_schema.sql`). Seed file (`003_integrations_seed.sql`) exists but is empty. |
| integration_service | integration_instances | [x] | [-] | Migration exists (`003_integrations_schema.sql`). Seed file (`003_integrations_seed.sql`) exists but is empty. |
| observability_service | observability_logs | [ ] | [ ] | No migration/seed found. |
| observability_service | observability_metrics | [ ] | [ ] | No migration/seed found. |
| observability_service | observability_traces | [ ] | [ ] | No migration/seed found. |
| task_execution_service | task_definitions | [x] | [-] | Migration exists (`005_task_execution_schema.sql`). No seed file. |
| task_execution_service | task_instances | [x] | [-] | Migration exists (`005_task_execution_schema.sql`). No seed file. |
| testing_framework_service | test_case_results | [ ] | [ ] | No migration/seed found. |
| testing_framework_service | test_definitions | [ ] | [ ] | No migration/seed found. |
| testing_framework_service | test_runs | [ ] | [ ] | No migration/seed found. |
| web_application_service | ui_components | [ ] | [ ] | No migration/seed found. |
| workflow_orchestrator_service | workflow_definitions | [x] | [x] | Migration exists (`002_core_workflows_schema.sql`). Seeded in `002_core_workflows_seed.sql`. |
| workflow_orchestrator_service | workflow_event_subscriptions | [ ] | [ ] | No migration/seed found. |
| workflow_orchestrator_service | workflow_event_triggers | [ ] | [ ] | No migration/seed found. |
| workflow_orchestrator_service | workflow_instances | [x] | [ ] | Migration exists (`002_core_workflows_schema.sql`). Not explicitly seeded. |
| Proof of Concept | `poc_documents` | [x] | [x] | Defined in `001_web_poc_schema.sql`. Seeded in `001_poc_seed.sql`. |
| Proof of Concept | `poc_document_versions` | [x] | [x] | Defined in `001_web_poc_schema.sql`. Seeded in `001_poc_seed.sql`. |
| Proof of Concept | `poc_draft_diffs` | [x] | [ ] | Defined in `001_web_poc_schema.sql`. Not seeded. |
| Proof of Concept | `poc_integrations` | [x] | [x] | Defined in `001_web_poc_schema.sql`. Seeded in `001_poc_seed.sql`. (Likely superseded by `integration_definitions`) |
| Proof of Concept | `poc_workflow_folders` | [x] | [x] | Defined in `001_web_poc_schema.sql`. Seeded in `001_poc_seed.sql`. |
| Proof of Concept | `poc_workflows` | [x] | [x] | Defined in `001_web_poc_schema.sql`. Seeded in `001_poc_seed.sql`. (Likely superseded by `workflow_definitions` / `workflow_instances`) |