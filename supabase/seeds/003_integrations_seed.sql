-- ------------------------------------------------------------------
-- Seed data for integration_definitions (aligned with 003_integrations_schema.sql)
-- ------------------------------------------------------------------
TRUNCATE TABLE public.integration_definitions CASCADE;

INSERT INTO public.integration_definitions
(integration_id, name, description, version, methods, config_schema, oauth2_config, auth_type, icon_url)
VALUES
('slack','Slack','Interact with Slack workspaces.','0.1.0',
$$[
 {"id":"send_channel_message","name":"Send Channel Message","description":"Post a message to a channel or DM.","inputSchema":{"type":"object","properties":{"channel":{"type":"string"},"message":{"type":"string"}},"required":["channel","message"]},"outputSchema":{"type":"object","properties":{"ts":{"type":"string"},"channel":{"type":"string"}}}},
 {"id":"add_reaction","name":"Add Reaction","description":"Add an emoji reaction to a message.","inputSchema":{"type":"object","properties":{"channel":{"type":"string"},"ts":{"type":"string"},"emoji":{"type":"string"}},"required":["channel","ts","emoji"]},"outputSchema":{"type":"object"}}
]$$::jsonb,
'{}'::jsonb,
$${
 "authorizationUrl":"https://slack.com/oauth/v2/authorize",
 "tokenUrl":"https://slack.com/api/oauth.v2.access",
 "scopes":["chat:write","reactions:write"]
}$$::jsonb,
'oauth2',
'https://cdn.simpleicons.org/slack'
),
('google_sheets','Google Sheets','Read and write to Google Sheets spreadsheets.','0.1.0',
$$[
 {"id":"get_sheet_values","name":"Get Sheet Values","description":"Return the values from a given range.","inputSchema":{"type":"object","properties":{"spreadsheet_id":{"type":"string"},"range":{"type":"string"}},"required":["spreadsheet_id","range"]},"outputSchema":{"type":"object","properties":{"values":{"type":"array","items":{"type":"array","items":{"type":"string"}}}}}},
 {"id":"append_row","name":"Append Row","description":"Append a single row to the end of a sheet.","inputSchema":{"type":"object","properties":{"spreadsheet_id":{"type":"string"},"range":{"type":"string"},"values":{"type":"array","items":{"type":"string"}}},"required":["spreadsheet_id","range","values"]},"outputSchema":{"type":"object"}}
]$$::jsonb,
'{}'::jsonb,
$${
 "authorizationUrl":"https://accounts.google.com/o/oauth2/v2/auth",
 "tokenUrl":"https://oauth2.googleapis.com/token",
 "scopes":["https://www.googleapis.com/auth/spreadsheets"]
}$$::jsonb,
'oauth2',
'https://cdn.simpleicons.org/googlesheets'
),
('gmail','Gmail','Send and manage Gmail messages.','0.1.0',
$$[
 {"id":"send_email","name":"Send Email","description":"Send an email via Gmail.","inputSchema":{"type":"object","properties":{"to":{"type":"string"},"subject":{"type":"string"},"body":{"type":"string"}},"required":["to","subject","body"]},"outputSchema":{"type":"object","properties":{"id":{"type":"string"}}}}
]$$::jsonb,
'{}'::jsonb,
$${
 "authorizationUrl":"https://accounts.google.com/o/oauth2/v2/auth",
 "tokenUrl":"https://oauth2.googleapis.com/token",
 "scopes":["https://www.googleapis.com/auth/gmail.send"]
}$$::jsonb,
'oauth2',
'https://cdn.simpleicons.org/gmail'
),
('google_drive','Google Drive','Upload and manage files in Google Drive.','0.1.0',
$$[
 {"id":"upload_file","name":"Upload File","description":"Upload a file to Drive.","inputSchema":{"type":"object","properties":{"name":{"type":"string"},"mime_type":{"type":"string"},"content":{"type":"string","description":"Base64-encoded file content"}},"required":["name","content"]},"outputSchema":{"type":"object","properties":{"id":{"type":"string"}}}}
]$$::jsonb,
'{}'::jsonb,
$${
 "authorizationUrl":"https://accounts.google.com/o/oauth2/v2/auth",
 "tokenUrl":"https://oauth2.googleapis.com/token",
 "scopes":["https://www.googleapis.com/auth/drive.file"]
}$$::jsonb,
'oauth2',
'https://cdn.simpleicons.org/googledrive'
),
('google_calendar','Google Calendar','Create and manage calendar events.','0.1.0',
$$[
 {"id":"create_event","name":"Create Event","description":"Create a calendar event.","inputSchema":{"type":"object","properties":{"calendar_id":{"type":"string"},"summary":{"type":"string"},"start":{"type":"string"},"end":{"type":"string"}},"required":["calendar_id","summary","start","end"]},"outputSchema":{"type":"object","properties":{"id":{"type":"string"}}}}
]$$::jsonb,
'{}'::jsonb,
$${
 "authorizationUrl":"https://accounts.google.com/o/oauth2/v2/auth",
 "tokenUrl":"https://oauth2.googleapis.com/token",
 "scopes":["https://www.googleapis.com/auth/calendar.events"]
}$$::jsonb,
'oauth2',
'https://cdn.simpleicons.org/googlecalendar'
),
('http','HTTP','Make arbitrary HTTP requests.','0.1.0',
$$[
 {"id":"request","name":"Request","description":"Perform an HTTP request.","inputSchema":{"type":"object","properties":{"method":{"type":"string"},"url":{"type":"string"},"headers":{"type":"object"},"body":{"type":"string"}},"required":["method","url"]},"outputSchema":{"type":"object","properties":{"status":{"type":"integer"},"body":{"type":"string"}}}}
]$$::jsonb,
$${
 "baseUrl":{"type":"string","description":"Optional base URL to prepend to relative paths"}
}$$::jsonb,
NULL,
'custom',
'https://cdn.simpleicons.org/webrtc' -- Assuming HTTP/WebRTC icon
),
('notion','Notion','Create and manage Notion pages and databases.','0.1.0',
$$[
 {"id":"create_page","name":"Create Page","description":"Create a new page in Notion.","inputSchema":{"type":"object","properties":{"parent_id":{"type":"string"},"title":{"type":"string"},"properties":{"type":"object"}},"required":["parent_id","title"]},"outputSchema":{"type":"object","properties":{"id":{"type":"string"}}}}
]$$::jsonb,
'{}'::jsonb,
$${
 "authorizationUrl":"https://api.notion.com/v1/oauth/authorize",
 "tokenUrl":"https://api.notion.com/v1/oauth/token",
 "scopes":["databases:read","databases:write","pages:write"]
}$$::jsonb,
'oauth2',
'https://cdn.simpleicons.org/notion'
),
('openai','OpenAI','Access OpenAI language and embeddings models.','0.1.0',
$$[
 {"id":"chat_completion","name":"Chat Completion","description":"Generate a chat completion.","inputSchema":{"type":"object","properties":{"messages":{"type":"array","items":{"type":"object"}},"model":{"type":"string"}},"required":["messages"]},"outputSchema":{"type":"object","properties":{"choices":{"type":"array"}}}},
 {"id":"embeddings","name":"Embeddings","description":"Generate embeddings for text.","inputSchema":{"type":"object","properties":{"input":{"type":"string"},"model":{"type":"string"}},"required":["input"]},"outputSchema":{"type":"object","properties":{"data":{"type":"array"}}}}
]$$::jsonb,
'{}'::jsonb,
NULL,
'apikey',
'https://cdn.simpleicons.org/openai'
),
('airtable','Airtable','Create and read Airtable records.','0.1.0',
$$[
 {"id":"create_record","name":"Create Record","description":"Create a record in a table.","inputSchema":{"type":"object","properties":{"base_id":{"type":"string"},"table_name":{"type":"string"},"fields":{"type":"object"}},"required":["base_id","table_name","fields"]},"outputSchema":{"type":"object","properties":{"id":{"type":"string"}}}}
]$$::jsonb,
$${
 "baseUrl":{"type":"string","description":"Optional Airtable API base URL"}
}$$::jsonb,
NULL,
'apikey',
'https://cdn.simpleicons.org/airtable'
),
('salesforce','Salesforce','Interact with Salesforce objects and SOQL.','0.1.0',
$$[
 {"id":"create_record","name":"Create Record","description":"Insert a record into an object.","inputSchema":{"type":"object","properties":{"object":{"type":"string"},"fields":{"type":"object"}},"required":["object","fields"]},"outputSchema":{"type":"object","properties":{"id":{"type":"string"}}}},
 {"id":"query_soql","name":"Query SOQL","description":"Run a SOQL query.","inputSchema":{"type":"object","properties":{"query":{"type":"string"}},"required":["query"]},"outputSchema":{"type":"object","properties":{"records":{"type":"array"}}}}
]$$::jsonb,
'{}'::jsonb,
$${
 "authorizationUrl":"https://login.salesforce.com/services/oauth2/authorize",
 "tokenUrl":"https://login.salesforce.com/services/oauth2/token",
 "scopes":["api","refresh_token"]
}$$::jsonb,
'oauth2',
'https://cdn.simpleicons.org/salesforce'
),
('hubspot','HubSpot','CRM interactions with HubSpot.','0.1.0',
$$[
 {"id":"create_contact","name":"Create Contact","description":"Create a new contact.","inputSchema":{"type":"object","properties":{"properties":{"type":"object"}},"required":["properties"]},"outputSchema":{"type":"object","properties":{"id":{"type":"string"}}}},
 {"id":"add_contact_to_list","name":"Add Contact To List","description":"Add a contact to a static list.","inputSchema":{"type":"object","properties":{"contact_id":{"type":"string"},"list_id":{"type":"string"}},"required":["contact_id","list_id"]},"outputSchema":{"type":"object"}}
]$$::jsonb,
'{}'::jsonb,
$${
 "authorizationUrl":"https://app.hubspot.com/oauth/authorize",
 "tokenUrl":"https://api.hubapi.com/oauth/v1/token",
 "scopes":["crm.objects.contacts.read","crm.objects.contacts.write"]
}$$::jsonb,
'oauth2',
'https://cdn.simpleicons.org/hubspot'
);

-- Add other integrations like Xero, Discord, GitHub, Telegram, Dropbox, Stripe, Twilio, ClickUp, RSS if needed, matching the format

-- ------------------------------------------------------------------
-- Seed data for integration_instances
-- ------------------------------------------------------------------

-- Clear existing instances first (optional, but good practice if re-running seeds)
-- TRUNCATE TABLE public.integration_instances CASCADE; -- Be cautious with CASCADE

INSERT INTO public.integration_instances
(instance_id, integration_definition_id, name, context_type, config, status, credentials)
SELECT
    'slack-global-test', id, 'Slack Global Test', 'global', '{}'::jsonb, '{"status": "active"}'::jsonb, NULL
FROM public.integration_definitions WHERE integration_id = 'slack';

INSERT INTO public.integration_instances
(instance_id, integration_definition_id, name, context_type, config, status, credentials)
SELECT
    'google_sheets-global-test', id, 'Google Sheets Global Test', 'global', '{}'::jsonb, '{"status": "active"}'::jsonb, NULL
FROM public.integration_definitions WHERE integration_id = 'google_sheets';

INSERT INTO public.integration_instances
(instance_id, integration_definition_id, name, context_type, config, status, credentials)
SELECT
    'gmail-global-test', id, 'Gmail Global Test', 'global', '{}'::jsonb, '{"status": "active"}'::jsonb, NULL
FROM public.integration_definitions WHERE integration_id = 'gmail';

INSERT INTO public.integration_instances
(instance_id, integration_definition_id, name, context_type, config, status, credentials)
SELECT
    'google_drive-global-test', id, 'Google Drive Global Test', 'global', '{}'::jsonb, '{"status": "active"}'::jsonb, NULL
FROM public.integration_definitions WHERE integration_id = 'google_drive';

INSERT INTO public.integration_instances
(instance_id, integration_definition_id, name, context_type, config, status, credentials)
SELECT
    'google_calendar-global-test', id, 'Google Calendar Global Test', 'global', '{}'::jsonb, '{"status": "active"}'::jsonb, NULL
FROM public.integration_definitions WHERE integration_id = 'google_calendar';

INSERT INTO public.integration_instances
(instance_id, integration_definition_id, name, context_type, config, status, credentials)
SELECT
    'http-global-test', id, 'HTTP Global Test', 'global', '{}'::jsonb, '{"status": "active"}'::jsonb, NULL
FROM public.integration_definitions WHERE integration_id = 'http';

INSERT INTO public.integration_instances
(instance_id, integration_definition_id, name, context_type, config, status, credentials)
SELECT
    'notion-global-test', id, 'Notion Global Test', 'global', '{}'::jsonb, '{"status": "active"}'::jsonb, NULL
FROM public.integration_definitions WHERE integration_id = 'notion';

INSERT INTO public.integration_instances
(instance_id, integration_definition_id, name, context_type, config, status, credentials)
SELECT
    'openai-global-test', id, 'OpenAI Global Test', 'global', '{}'::jsonb, '{"status": "active"}'::jsonb, NULL
FROM public.integration_definitions WHERE integration_id = 'openai';

INSERT INTO public.integration_instances
(instance_id, integration_definition_id, name, context_type, config, status, credentials)
SELECT
    'airtable-global-test', id, 'Airtable Global Test', 'global', '{}'::jsonb, '{"status": "active"}'::jsonb, NULL
FROM public.integration_definitions WHERE integration_id = 'airtable';

INSERT INTO public.integration_instances
(instance_id, integration_definition_id, name, context_type, config, status, credentials)
SELECT
    'salesforce-global-test', id, 'Salesforce Global Test', 'global', '{}'::jsonb, '{"status": "active"}'::jsonb, NULL
FROM public.integration_definitions WHERE integration_id = 'salesforce';

INSERT INTO public.integration_instances
(instance_id, integration_definition_id, name, context_type, config, status, credentials)
SELECT
    'hubspot-global-test', id, 'HubSpot Global Test', 'global', '{}'::jsonb, '{"status": "active"}'::jsonb, NULL
FROM public.integration_definitions WHERE integration_id = 'hubspot';
