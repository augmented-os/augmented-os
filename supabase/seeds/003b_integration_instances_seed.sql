TRUNCATE TABLE public.integration_instances CASCADE;

-- Add OpenAI instances
INSERT INTO public.integration_instances
(instance_id, integration_definition_id, name, description, context_type, context_id, config, status, credentials)
SELECT
    'openai-yc-application-review',
    id,
    'OpenAI - YC Application Review',
    'GPT-4o integration for analyzing startup applications, extracting key insights, and providing initial screening assistance.',
    'global',
    NULL,
    '{
        "defaultModel": "gpt-4o",
        "defaultTemperature": 0.1,
        "defaultMaxTokens": 2048
    }'::jsonb,
    '{
        "state": "active",
        "lastChecked": "2024-07-24T10:00:00Z",
        "error": null,
        "metrics": {"lastUsed": "2024-07-24T09:55:00Z", "requestsToday": 256, "tokensThisMonth": 2450000}
    }'::jsonb,
    NULL
FROM public.integration_definitions WHERE integration_id = 'openai';

INSERT INTO public.integration_instances
(instance_id, integration_definition_id, name, description, context_type, context_id, config, status, credentials)
SELECT
    'openai-yc-content-generation',
    id,
    'OpenAI - YC Content Generation',
    'GPT-4o integration for drafting blog posts, emails, and other content for YC communications and marketing.',
    'global',
    NULL,
    '{
        "defaultModel": "gpt-4o",
        "defaultTemperature": 0.7,
        "defaultMaxTokens": 4000
    }'::jsonb,
    '{
        "state": "active",
        "lastChecked": "2024-07-24T10:00:00Z",
        "error": null,
        "metrics": {"lastUsed": "2024-07-24T09:55:00Z", "requestsToday": 87, "tokensThisMonth": 980000}
    }'::jsonb,
    NULL
FROM public.integration_definitions WHERE integration_id = 'openai';

INSERT INTO public.integration_instances
(instance_id, integration_definition_id, name, description, context_type, context_id, config, status, credentials)
SELECT
    'openai-yc-image-generation',
    id,
    'OpenAI - YC Image Generation',
    'DALL-E 3 integration for creating custom graphics, diagrams, and visual assets for YC presentations and materials.',
    'global',
    NULL,
    '{
        "defaultModel": "dall-e-3",
        "defaultQuality": "hd",
        "defaultSize": "1024x1024"
    }'::jsonb,
    '{
        "state": "active",
        "lastChecked": "2024-07-24T10:00:00Z",
        "error": null,
        "metrics": {"lastUsed": "2024-07-24T09:55:00Z", "imagesThisMonth": 142}
    }'::jsonb,
    NULL
FROM public.integration_definitions WHERE integration_id = 'openai';

-- Add Anthropic instances
INSERT INTO public.integration_instances
(instance_id, integration_definition_id, name, description, context_type, context_id, config, status, credentials)
SELECT
    'anthropic-yc-founder-assistant',
    id,
    'Anthropic - YC Founder Assistant',
    'Claude 3 Opus instance for providing detailed strategic advice and analysis to YC founders with extensive context handling.',
    'global',
    NULL,
    '{
        "defaultModel": "claude-3-opus",
        "defaultTemperature": 0.3,
        "defaultMaxTokens": 4000
    }'::jsonb,
    '{
        "state": "active",
        "lastChecked": "2024-07-24T10:00:00Z",
        "error": null,
        "metrics": {"lastUsed": "2024-07-24T09:55:00Z", "requestsToday": 189, "tokensThisMonth": 3120000}
    }'::jsonb,
    NULL
FROM public.integration_definitions WHERE integration_id = 'anthropic';

INSERT INTO public.integration_instances
(instance_id, integration_definition_id, name, description, context_type, context_id, config, status, credentials)
SELECT
    'anthropic-yc-document-analysis',
    id,
    'Anthropic - YC Document Analysis',
    'Claude 3 Sonnet instance for analyzing pitch decks, business plans, and technical documents from startups.',
    'global',
    NULL,
    '{
        "defaultModel": "claude-3-sonnet",
        "defaultTemperature": 0.1,
        "defaultMaxTokens": 3000
    }'::jsonb,
    '{
        "state": "active",
        "lastChecked": "2024-07-24T10:00:00Z",
        "error": null,
        "metrics": {"lastUsed": "2024-07-24T09:55:00Z", "requestsToday": 243, "tokensThisMonth": 2870000}
    }'::jsonb,
    NULL
FROM public.integration_definitions WHERE integration_id = 'anthropic';

INSERT INTO public.integration_instances
(instance_id, integration_definition_id, name, description, context_type, context_id, config, status, credentials)
SELECT
    'anthropic-yc-batch-chatbot',
    id,
    'Anthropic - YC Batch Chatbot',
    'Claude 3 Haiku instance powering the YC batch Q&A system, providing fast responses to common founder questions.',
    'global',
    NULL,
    '{
        "defaultModel": "claude-3-haiku",
        "defaultTemperature": 0.5,
        "defaultMaxTokens": 1000
    }'::jsonb,
    '{
        "state": "active",
        "lastChecked": "2024-07-24T10:00:00Z",
        "error": null,
        "metrics": {"lastUsed": "2024-07-24T09:58:32Z", "requestsToday": 856, "tokensThisMonth": 4240000}
    }'::jsonb,
    NULL
FROM public.integration_definitions WHERE integration_id = 'anthropic';

-- Existing instances start here
INSERT INTO public.integration_instances
(instance_id, integration_definition_id, name, description, context_type, context_id, config, status, credentials)
SELECT
    'slack-yc-team-hub',
    id,
    'Slack - YC Team Hub',
    'Central Slack workspace for YC team collaboration, announcements, and operations.',
    'global',
    NULL,
    '{"workspace":"ycombinator"}'::jsonb,
    '{
        "state": "active",
        "lastChecked": "2024-07-24T10:00:00Z",
        "error": null,
        "metrics": {"lastUsed": "2024-07-24T09:55:00Z"}
    }'::jsonb,
    NULL
FROM public.integration_definitions WHERE integration_id = 'slack';

INSERT INTO public.integration_instances
(instance_id, integration_definition_id, name, description, context_type, context_id, config, status, credentials)
SELECT
    'gmail-yc-staff',
    id,
    'Gmail - YC Staff',
    'Default Gmail integration for YC staff accounts and internal/external email.',
    'global',
    NULL,
    '{}'::jsonb,
    '{
        "state": "active",
        "lastChecked": "2024-07-24T10:00:00Z",
        "error": null,
        "metrics": {"lastUsed": "2024-07-24T09:55:00Z"}
    }'::jsonb,
    NULL
FROM public.integration_definitions WHERE integration_id = 'gmail';

INSERT INTO public.integration_instances
(instance_id, integration_definition_id, name, description, context_type, context_id, config, status, credentials)
SELECT
    'gcalendar-yc-ops-events',
    id,
    'Google Calendar - YC Ops & Events',
    'Master Google Calendar for YC operational schedules, batch timelines, and significant events.',
    'global',
    NULL,
    '{}'::jsonb,
    '{
        "state": "active",
        "lastChecked": "2024-07-24T10:00:00Z",
        "error": null,
        "metrics": {"lastUsed": "2024-07-24T09:55:00Z"}
    }'::jsonb,
    NULL
FROM public.integration_definitions WHERE integration_id = 'google_calendar';

INSERT INTO public.integration_instances
(instance_id, integration_definition_id, name, description, context_type, context_id, config, status, credentials)
SELECT
    'zoom-yc-standard',
    id,
    'Zoom - YC Standard',
    'Default Zoom setup for YC team meetings, batch interviews, and virtual conferences.',
    'global',
    NULL,
    '{}'::jsonb,
    '{
        "state": "active",
        "lastChecked": "2024-07-24T10:00:00Z",
        "error": null,
        "metrics": {"lastUsed": "2024-07-24T09:55:00Z"}
    }'::jsonb,
    NULL
FROM public.integration_definitions WHERE integration_id = 'zoom';

INSERT INTO public.integration_instances
(instance_id, integration_definition_id, name, description, context_type, context_id, config, status, credentials)
SELECT
    'gdrive-yc-team-shared',
    id,
    'Google Drive - YC Team Shared',
    'Central Google Drive for YC team documents, shared resources, and collaborative projects.',
    'global',
    NULL,
    '{}'::jsonb,
    '{
        "state": "active",
        "lastChecked": "2024-07-24T10:00:00Z",
        "error": null,
        "metrics": {"lastUsed": "2024-07-24T09:55:00Z"}
    }'::jsonb,
    NULL
FROM public.integration_definitions WHERE integration_id = 'google_drive';

INSERT INTO public.integration_instances
(instance_id, integration_definition_id, name, description, context_type, context_id, config, status, credentials)
SELECT
    'gsheets-yc-reports-trackers',
    id,
    'Google Sheets - YC Reporting & Trackers',
    'Google Sheets integration for YC internal data analysis, KPI tracking, and operational reports.',
    'global',
    NULL,
    '{}'::jsonb,
    '{
        "state": "active",
        "lastChecked": "2024-07-24T10:00:00Z",
        "error": null,
        "metrics": {"lastUsed": "2024-07-24T09:55:00Z"}
    }'::jsonb,
    NULL
FROM public.integration_definitions WHERE integration_id = 'google_sheets';

INSERT INTO public.integration_instances
(instance_id, integration_definition_id, name, description, context_type, context_id, config, status, credentials)
SELECT
    'gforms-yc-surveys-intake',
    id,
    'Google Forms - YC Surveys & Intake',
    'Google Forms for YC internal feedback, founder surveys, and various data intake processes.',
    'global',
    NULL,
    '{}'::jsonb,
    '{
        "state": "active",
        "lastChecked": "2024-07-24T10:00:00Z",
        "error": null,
        "metrics": {"lastUsed": "2024-07-24T09:55:00Z"}
    }'::jsonb,
    NULL
FROM public.integration_definitions WHERE integration_id = 'google_forms';

INSERT INTO public.integration_instances
(instance_id, integration_definition_id, name, description, context_type, context_id, config, status, credentials)
SELECT
    'qbo-yc-core-finance',
    id,
    'QuickBooks - YC Core Finance',
    'QuickBooks Online for YC''s primary financial operations, accounting, and group reporting.',
    'global',
    NULL,
    '{}'::jsonb,
    '{
        "state": "active",
        "lastChecked": "2024-07-24T10:00:00Z",
        "error": null,
        "metrics": {"lastUsed": "2024-07-24T09:55:00Z"}
    }'::jsonb,
    NULL
FROM public.integration_definitions WHERE integration_id = 'quickbooks_online';

INSERT INTO public.integration_instances
(instance_id, integration_definition_id, name, description, context_type, context_id, config, status, credentials)
SELECT
    'expensify-yc-team-reimbursements',
    id,
    'Expensify - YC Team Reimbursements',
    'Expensify for YC staff expense reports, approvals, and reimbursement processing.',
    'global',
    NULL,
    '{}'::jsonb,
    '{
        "state": "active",
        "lastChecked": "2024-07-24T10:00:00Z",
        "error": null,
        "metrics": {"lastUsed": "2024-07-24T09:55:00Z"}
    }'::jsonb,
    NULL
FROM public.integration_definitions WHERE integration_id = 'expensify';

INSERT INTO public.integration_instances
(instance_id, integration_definition_id, name, description, context_type, context_id, config, status, credentials)
SELECT
    'ashby-yc-talent-pipeline',
    id,
    'Ashby - YC Talent Pipeline',
    'Ashby ATS for managing YC internal hiring and supporting portfolio talent acquisition.',
    'global',
    NULL,
    '{}'::jsonb,
    '{
        "state": "active",
        "lastChecked": "2024-07-24T10:00:00Z",
        "error": null,
        "metrics": {"lastUsed": "2024-07-24T09:55:00Z"}
    }'::jsonb,
    NULL
FROM public.integration_definitions WHERE integration_id = 'ashby';

INSERT INTO public.integration_instances
(instance_id, integration_definition_id, name, description, context_type, context_id, config, status, credentials)
SELECT
    'rippling-yc-people-platform',
    id,
    'Rippling - YC People Platform',
    'Rippling for YC employee onboarding, payroll, benefits, and HRIS management.',
    'global',
    NULL,
    '{}'::jsonb,
    '{
        "state": "active",
        "lastChecked": "2024-07-24T10:00:00Z",
        "error": null,
        "metrics": {"lastUsed": "2024-07-24T09:55:00Z"}
    }'::jsonb,
    NULL
FROM public.integration_definitions WHERE integration_id = 'rippling';

INSERT INTO public.integration_instances
(instance_id, integration_definition_id, name, description, context_type, context_id, config, status, credentials)
SELECT
    'hellosign-yc-standard-edocs',
    id,
    'HelloSign - YC Standard eDocs',
    'HelloSign for YC routine document signing and standard electronic agreements.',
    'global',
    NULL,
    '{}'::jsonb,
    '{
        "state": "active",
        "lastChecked": "2024-07-24T10:00:00Z",
        "error": null,
        "metrics": {"lastUsed": "2024-07-24T09:55:00Z"}
    }'::jsonb,
    NULL
FROM public.integration_definitions WHERE integration_id = 'dropboxsign';

INSERT INTO public.integration_instances
(instance_id, integration_definition_id, name, description, context_type, context_id, config, status, credentials)
SELECT
    'docusign-yc-legal-agreements',
    id,
    'DocuSign - YC Legal Agreements',
    'DocuSign for YC legal team for formal contracts, investment documents, and critical agreements.',
    'global',
    NULL,
    '{}'::jsonb,
    '{
        "state": "active",
        "lastChecked": "2024-07-24T10:00:00Z",
        "error": null,
        "metrics": {"lastUsed": "2024-07-24T09:55:00Z"}
    }'::jsonb,
    NULL
FROM public.integration_definitions WHERE integration_id = 'docusign';

INSERT INTO public.integration_instances
(instance_id, integration_definition_id, name, description, context_type, context_id, config, status, credentials)
SELECT
    'calendly-yc-partner-scheduling',
    id,
    'Calendly - YC Partner Scheduling',
    'Calendly for YC partners & staff to manage external meeting scheduling.',
    'global',
    NULL,
    '{}'::jsonb,
    '{
        "state": "active",
        "lastChecked": "2024-07-24T10:00:00Z",
        "error": null,
        "metrics": {"lastUsed": "2024-07-24T09:55:00Z"}
    }'::jsonb,
    NULL
FROM public.integration_definitions WHERE integration_id = 'calendly';

INSERT INTO public.integration_instances
(instance_id, integration_definition_id, name, description, context_type, context_id, config, status, credentials)
SELECT
    'bookface-yc-directory-community',
    id,
    'Bookface - YC Directory & Community',
    'YC''s internal directory and community platform, connecting founders, partners, and staff.',
    'global',
    NULL,
    '{}'::jsonb,
    '{
        "state": "active",
        "lastChecked": "2024-07-24T10:00:00Z",
        "error": null,
        "metrics": {"lastUsed": "2024-07-24T09:55:00Z"}
    }'::jsonb,
    NULL
FROM public.integration_definitions WHERE integration_id = 'bookface';

INSERT INTO public.integration_instances
(instance_id, integration_definition_id, name, description, context_type, context_id, config, status, credentials)
SELECT
    'yc_crm-portfolio-founder-ops',
    id,
    'YC CRM - Portfolio & Founder Ops',
    'Internal CRM for managing YC portfolio company data, founder interactions, and support.',
    'global',
    NULL,
    '{}'::jsonb,
    '{
        "state": "active",
        "lastChecked": "2024-07-24T10:00:00Z",
        "error": null,
        "metrics": {"lastUsed": "2024-07-24T09:55:00Z"}
    }'::jsonb,
    NULL
FROM public.integration_definitions WHERE integration_id = 'yc_crm';

INSERT INTO public.integration_instances
(instance_id, integration_definition_id, name, description, context_type, context_id, config, status, credentials)
SELECT
    'yc_investor_db-investor-relations',
    id,
    'YC Investor DB - Investor Relations',
    'Internal database for YC to manage its network of investors, LPs, and funding relationships.',
    'global',
    NULL,
    '{}'::jsonb,
    '{
        "state": "active",
        "lastChecked": "2024-07-24T10:00:00Z",
        "error": null,
        "metrics": {"lastUsed": "2024-07-24T09:55:00Z"}
    }'::jsonb,
    NULL
FROM public.integration_definitions WHERE integration_id = 'yc_investor_db';

INSERT INTO public.integration_instances
(instance_id, integration_definition_id, name, description, context_type, context_id, config, status, credentials)
SELECT
    'yc_deals_db-investment-ops',
    id,
    'YC Deals DB - Investment Operations',
    'Internal database for YC to track its investment pipeline, deal flow, and funding operations.',
    'global',
    NULL,
    '{}'::jsonb,
    '{
        "state": "active",
        "lastChecked": "2024-07-24T10:00:00Z",
        "error": null,
        "metrics": {"lastUsed": "2024-07-24T09:55:00Z"}
    }'::jsonb,
    NULL
FROM public.integration_definitions WHERE integration_id = 'yc_deals_db';

INSERT INTO public.integration_instances
(instance_id, integration_definition_id, name, description, context_type, context_id, config, status, credentials)
SELECT
    'gmail-yc-batch-notifications',
    id,
    'Gmail - YC Batch Notifications',
    'Gmail instance for YC batch-wide announcements, founder communications, and program notifications.',
    'global',
    NULL,
    '{}'::jsonb,
    '{
        "state": "active",
        "lastChecked": "2024-07-24T10:00:00Z",
        "error": null,
        "metrics": {"lastUsed": "2024-07-24T09:55:00Z"}
    }'::jsonb,
    NULL
FROM public.integration_definitions WHERE integration_id = 'gmail';

INSERT INTO public.integration_instances
(instance_id, integration_definition_id, name, description, context_type, context_id, config, status, credentials)
SELECT
    'apply_yc-admissions-portal',
    id,
    'Apply@YC - Admissions Portal',
    'The official YC platform for founder applications, review, and batch admissions.',
    'global',
    NULL,
    '{}'::jsonb,
    '{
        "state": "active",
        "lastChecked": "2024-07-24T10:00:00Z",
        "error": null,
        "metrics": {"lastUsed": "2024-07-24T09:55:00Z"}
    }'::jsonb,
    NULL
FROM public.integration_definitions WHERE integration_id = 'apply_yc';
