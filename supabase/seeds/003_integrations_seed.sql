-- ------------------------------------------------------------------
-- Seed data for integration_definitions (aligned with 003_integrations_schema.sql)
-- ------------------------------------------------------------------
TRUNCATE TABLE public.integration_definitions CASCADE;

INSERT INTO public.integration_definitions
(integration_id, name, description, version, methods, config_schema, oauth2_config, auth_type, doc_url)
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
'https://api.slack.com/web'
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
'https://developers.google.com/sheets/api'
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
'https://developers.google.com/gmail/api'
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
'https://developers.google.com/drive/api'
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
'https://developers.google.com/calendar/api'
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
'https://developer.mozilla.org/docs/Web/HTTP'
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
'https://developers.notion.com/reference/intro'
),
('openai','OpenAI','Access OpenAI language and embeddings models.','0.1.0',
$$[
 {"id":"chat_completion","name":"Chat Completion","description":"Generate a chat completion.","inputSchema":{"type":"object","properties":{"messages":{"type":"array","items":{"type":"object"}},"model":{"type":"string"}},"required":["messages"]},"outputSchema":{"type":"object","properties":{"choices":{"type":"array"}}}},
 {"id":"embeddings","name":"Embeddings","description":"Generate embeddings for text.","inputSchema":{"type":"object","properties":{"input":{"type":"string"},"model":{"type":"string"}},"required":["input"]},"outputSchema":{"type":"object","properties":{"data":{"type":"array"}}}}
]$$::jsonb,
'{}'::jsonb,
NULL,
'apikey',
'https://platform.openai.com/docs/api-reference'
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
'https://airtable.com/developers/web/api'
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
'https://developer.salesforce.com/docs'
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
'https://developers.hubspot.com/docs/api'
);
