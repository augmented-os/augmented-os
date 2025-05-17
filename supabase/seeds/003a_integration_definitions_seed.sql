-- ------------------------------------------------------------------
-- Seed data for integration_definitions (aligned with 003_integrations_schema.sql)
-- ------------------------------------------------------------------
TRUNCATE TABLE public.integration_definitions CASCADE;

INSERT INTO public.integration_definitions
(integration_id, name, description, version, type, methods, config_schema, oauth2_config, auth_type, icon_url, ai_config)
VALUES
('slack','Slack','Interact with Slack workspaces.','0.1.0', 'integration',
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
'https://cdn.simpleicons.org/slack',
NULL
),
('google_sheets','Google Sheets','Read and write to Google Sheets spreadsheets.','0.1.0', 'integration',
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
'https://cdn.simpleicons.org/googlesheets',
NULL
),
('gmail','Gmail','Send and manage Gmail messages.','0.1.0', 'integration',
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
'https://cdn.simpleicons.org/gmail',
NULL
),
('google_drive','Google Drive','Upload and manage files in Google Drive.','0.1.0', 'integration',
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
'https://cdn.simpleicons.org/googledrive',
NULL
),
('google_calendar','Google Calendar','Create and manage calendar events.','0.1.0', 'integration',
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
'https://cdn.simpleicons.org/googlecalendar',
NULL
),
('http','HTTP','Make arbitrary HTTP requests.','0.1.0', 'integration',
$$[
 {"id":"request","name":"Request","description":"Perform an HTTP request.","inputSchema":{"type":"object","properties":{"method":{"type":"string"},"url":{"type":"string"},"headers":{"type":"object"},"body":{"type":"string"}},"required":["method","url"]},"outputSchema":{"type":"object","properties":{"status":{"type":"integer"},"body":{"type":"string"}}}}
]$$::jsonb,
$${
 "baseUrl":{"type":"string","description":"Optional base URL to prepend to relative paths"}
}$$::jsonb,
NULL,
'custom',
'https://cdn.simpleicons.org/webrtc',
NULL
),
('notion','Notion','Create and manage Notion pages and databases.','0.1.0', 'integration',
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
'https://cdn.simpleicons.org/notion',
NULL
),
('openai','OpenAI','Access OpenAI language and embeddings models.','0.1.0', 'ai',
$$[
 {"id":"chat_completion","name":"Chat Completion","description":"Generate a chat completion.","inputSchema":{"type":"object","properties":{"messages":{"type":"array","items":{"type":"object"}},"model":{"type":"string"}},"required":["messages"]},"outputSchema":{"type":"object","properties":{"choices":{"type":"array"}}}},
 {"id":"embeddings","name":"Embeddings","description":"Generate embeddings for text.","inputSchema":{"type":"object","properties":{"input":{"type":"string"},"model":{"type":"string"}},"required":["input"]},"outputSchema":{"type":"object","properties":{"data":{"type":"array"}}}}
]$$::jsonb,
$${
  "defaultTemperature": {
    "type": "number",
    "description": "Default sampling temperature",
    "default": 0.7
  },
  "defaultMaxTokens": {
    "type": "integer",
    "description": "Default maximum tokens",
    "default": 1000
  }
}$$::jsonb,
NULL,
'apikey',
'https://cdn.simpleicons.org/openai',
$${
  "provider": "openai",
  "defaultModel": "o3",
  "availableModels": [
    {
      "id": "o3",
      "name": "OpenAI o3",
      "maxTokens": 4096,
      "description": "Flagship reasoning model with state-of-the-art math, coding, science and vision skills",
      "capabilities": ["text", "vision"],
      "costPerToken": {
        "input": 0.00001,
        "output": 0.00004
      },
      "inputFormats": ["text", "image/png", "image/jpeg"],
      "contextWindow": 128000,
      "outputFormats": ["text", "json"]
    },
    {
      "id": "o4-mini",
      "name": "OpenAI o4-mini",
      "maxTokens": 4096,
      "description": "Smaller, faster reasoning model tuned for cost-efficient workloads",
      "capabilities": ["text", "vision"],
      "costPerToken": {
        "input": 0.0000011,
        "output": 0.0000044
      },
      "inputFormats": ["text", "image/png", "image/jpeg"],
      "contextWindow": 128000,
      "outputFormats": ["text", "json"]
    },
    {
      "id": "gpt-4.1",
      "name": "GPT-4.1",
      "maxTokens": 4096,
      "description": "Long-context upgrade to GPT-4o with stronger coding & instruction-following",
      "capabilities": ["text"],
      "costPerToken": {
        "input": 0.000002,
        "output": 0.000008
      },
      "inputFormats": ["text"],
      "contextWindow": 1048576,
      "outputFormats": ["text", "json"]
    },
    {
      "id": "gpt-4.1-mini",
      "name": "GPT-4.1 Mini",
      "maxTokens": 4096,
      "description": "Cost-optimised, high-speed variant of GPT-4.1 with the same 1 M token window",
      "capabilities": ["text"],
      "costPerToken": {
        "input": 0.0000004,
        "output": 0.0000016
      },
      "inputFormats": ["text"],
      "contextWindow": 1048576,
      "outputFormats": ["text", "json"]
    }
  ]
}$$::jsonb
),
('anthropic','Anthropic Claude','Access to Anthropic Claude AI models.','0.1.0', 'ai',
$$[
 {"id":"complete","name":"Text Completion","description":"Generate text completion based on input prompt.","inputSchema":{"type":"object","properties":{"prompt":{"type":"string"},"model":{"type":"string"},"max_tokens":{"type":"integer"},"temperature":{"type":"number"}},"required":["prompt"]},"outputSchema":{"type":"object","properties":{"completion":{"type":"string"},"usage":{"type":"object"}}}},
 {"id":"messages","name":"Messages API","description":"Generate a response to a conversation.","inputSchema":{"type":"object","properties":{"messages":{"type":"array","items":{"type":"object","properties":{"role":{"type":"string"},"content":{"type":"string"}}}},"model":{"type":"string"},"max_tokens":{"type":"integer"},"temperature":{"type":"number"}},"required":["messages"]},"outputSchema":{"type":"object","properties":{"content":{"type":"string"},"usage":{"type":"object"}}}}
]$$::jsonb,
$${
  "defaultTemperature": {
    "type": "number",
    "description": "Default sampling temperature",
    "default": 0.7
  },
  "defaultMaxTokens": {
    "type": "integer",
    "description": "Default maximum tokens",
    "default": 1000
  }
}$$::jsonb,
NULL,
'apikey',
'https://cdn.simpleicons.org/anthropic',
$${
  "provider": "anthropic",
  "defaultModel": "claude-3-7-sonnet",
  "availableModels": [
    {
      "id": "claude-3-7-sonnet",
      "name": "Claude 3.7 Sonnet",
      "maxTokens": 4096,
      "description": "Hybrid-reasoning flagship with optional step-by-step ‘extended thinking’ and beta support for up to 128 K output tokens",
      "capabilities": ["text", "vision"],
      "costPerToken": {
        "input": 0.000003,
        "output": 0.000015
      },
      "inputFormats": ["text", "image/png", "image/jpeg"],
      "contextWindow": 200000,
      "outputFormats": ["text", "json"]
    },
    {
      "id": "claude-3-opus",
      "name": "Claude 3 Opus",
      "maxTokens": 4096,
      "description": "Large-capacity model for the very hardest tasks; highest accuracy, highest price",
      "capabilities": ["text", "vision"],
      "costPerToken": {
        "input": 0.000015,
        "output": 0.000075
      },
      "inputFormats": ["text", "image/png", "image/jpeg"],
      "contextWindow": 200000,
      "outputFormats": ["text", "json"]
    },
    {
      "id": "claude-3-5-haiku",
      "name": "Claude 3.5 Haiku",
      "maxTokens": 4096,
      "description": "Fastest and most cost-efficient Claude; good enough for everyday chat and drafting",
      "capabilities": ["text", "vision"],
      "costPerToken": {
        "input": 0.0000008,
        "output": 0.000004
      },
      "inputFormats": ["text", "image/png", "image/jpeg"],
      "contextWindow": 200000,
      "outputFormats": ["text", "json"]
    }
  ]
}$$::jsonb
),
('airtable','Airtable','Create and read Airtable records.','0.1.0', 'integration',
$$[
 {"id":"create_record","name":"Create Record","description":"Create a record in a table.","inputSchema":{"type":"object","properties":{"base_id":{"type":"string"},"table_name":{"type":"string"},"fields":{"type":"object"}},"required":["base_id","table_name","fields"]},"outputSchema":{"type":"object","properties":{"id":{"type":"string"}}}}
]$$::jsonb,
$${
 "baseUrl":{"type":"string","description":"Optional Airtable API base URL"}
}$$::jsonb,
NULL,
'apikey',
'https://cdn.simpleicons.org/airtable',
NULL
),
('salesforce','Salesforce','Interact with Salesforce objects and SOQL.','0.1.0', 'integration',
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
'https://cdn.simpleicons.org/salesforce',
NULL
),
('hubspot','HubSpot','CRM interactions with HubSpot.','0.1.0', 'integration',
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
'https://cdn.simpleicons.org/hubspot',
NULL
),
('google_forms', 'Google Forms', 'Google Forms integration to manage forms.', '0.1.0', 'integration',
$$[]$$::jsonb,
'{}'::jsonb,
$$ {
 "authorizationUrl":"https://accounts.google.com/o/oauth2/v2/auth",
 "tokenUrl":"https://oauth2.googleapis.com/token",
 "scopes":["https://www.googleapis.com/auth/forms"]
} $$::jsonb,
'oauth2',
'https://cdn.simpleicons.org/googleforms',
NULL
),
('zoom', 'Zoom', 'Zoom integration to manage video_call.', '0.1.0', 'integration',
$$[]$$::jsonb,
'{}'::jsonb,
$$ {
 "authorizationUrl":"https://zoom.us/oauth/authorize",
 "tokenUrl":"https://zoom.us/oauth/token",
 "scopes":["meeting:write","user:read"]
} $$::jsonb,
'oauth2',
'https://cdn.simpleicons.org/zoom',
NULL
),
('quickbooks_online', 'QuickBooks Online', 'QuickBooks Online integration to manage accounting.', '0.1.0', 'integration',
$$[]$$::jsonb,
'{}'::jsonb,
$$ {
 "authorizationUrl":"https://appcenter.intuit.com/connect/oauth2",
 "tokenUrl":"https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer",
 "scopes":["com.intuit.quickbooks.accounting"]
} $$::jsonb,
'oauth2',
'https://cdn.simpleicons.org/quickbooks',
NULL
),
('expensify', 'Expensify', 'Expensify integration to manage expenses.', '0.1.0', 'integration',
$$[]$$::jsonb,
'{}'::jsonb,
$$ {
 "authorizationUrl":"https://www.expensify.com/oauth/authorize",
 "tokenUrl":"https://www.expensify.com/api?command=GetToken",
 "scopes":["reports:read","reports:write"]
} $$::jsonb,
'oauth2',
'https://cdn.simpleicons.org/expensify',
NULL
),
('dropboxsign', 'Dropbox Sign', 'Dropbox Sign integration to manage esignature.', '0.1.0', 'integration',
$$[]$$::jsonb,
'{}'::jsonb,
$$ {
 "authorizationUrl":"https://app.hellosign.com/oauth/authorize",
 "tokenUrl":"https://app.hellosign.com/oauth/token",
 "scopes":["basic_account_info","request_signature"]
} $$::jsonb,
'oauth2',
'https://cdn.simpleicons.org/dropbox',
NULL
),
('docusign', 'DocuSign', 'DocuSign integration to manage esignature.', '0.1.0', 'integration',
$$[]$$::jsonb,
'{}'::jsonb,
$$ {
 "authorizationUrl":"https://account-d.docusign.com/oauth/auth",
 "tokenUrl":"https://account-d.docusign.com/oauth/token",
 "scopes":["signature","impersonation"]
} $$::jsonb,
'oauth2',
'https://cdn.simpleicons.org/docusign',
NULL
),
('calendly', 'Calendly', 'Calendly integration to manage scheduling.', '0.1.0', 'integration',
$$[]$$::jsonb,
'{}'::jsonb,
$$ {
 "authorizationUrl":"https://auth.calendly.com/oauth/authorize",
 "tokenUrl":"https://auth.calendly.com/oauth/token",
 "scopes":[]
} $$::jsonb,
'oauth2',
'https://cdn.simpleicons.org/calendly',
NULL
),
('ashby', 'Ashby ATS', 'Ashby ATS integration to manage recruiting.', '0.1.0', 'integration',
$$[]$$::jsonb,
'{}'::jsonb,
$$ {
 "authorizationUrl":"https://api.ashbyhq.com/oauth/authorize",
 "tokenUrl":"https://api.ashbyhq.com/oauth/token",
 "scopes":[]
} $$::jsonb,
'oauth2',
'https://cdn.simpleicons.org/ashby',
NULL
),
('rippling', 'Rippling', 'Rippling integration to manage hr.', '0.1.0', 'integration',
$$[]$$::jsonb,
'{}'::jsonb,
$$ {
 "authorizationUrl":"https://app.rippling.com/api/o/authorize/",
 "tokenUrl":"https://app.rippling.com/api/o/token/",
 "scopes":["read:employee"]
} $$::jsonb,
'oauth2',
'https://cdn.simpleicons.org/rippling',
NULL
),
('bookface', 'Bookface', 'Bookface integration to manage internal.', '0.1.0', 'integration',
$$[]$$::jsonb,
'{}'::jsonb,
NULL,
'custom',
'https://cdn.simpleicons.org/ycombinator',
NULL
),
('yc_crm', 'YC Portfolio CRM', 'YC Portfolio CRM integration to manage internal.', '0.1.0', 'integration',
$$[]$$::jsonb,
'{}'::jsonb,
NULL,
'custom',
'https://cdn.simpleicons.org/ycombinator',
NULL
),
('yc_investor_db', 'YC Investor DB', 'YC Investor DB integration to manage internal.', '0.1.0', 'integration',
$$[]$$::jsonb,
'{}'::jsonb,
NULL,
'custom',
'https://cdn.simpleicons.org/ycombinator',
NULL
),
('yc_deals_db', 'YC Deals DB', 'YC Deals DB integration to manage internal.', '0.1.0', 'integration',
$$[]$$::jsonb,
'{}'::jsonb,
NULL,
'custom',
'https://cdn.simpleicons.org/ycombinator',
NULL
),
('apply_yc', 'YC Application Portal', 'YC Application Portal integration to manage internal.', '0.1.0', 'integration',
$$[]$$::jsonb,
'{}'::jsonb,
NULL,
'custom',
'https://cdn.simpleicons.org/ycombinator',
NULL
);

-- Add other integrations like Xero, Discord, GitHub, Telegram, Dropbox, Stripe, Twilio, ClickUp, RSS if needed, matching the format

-- ------------------------------------------------------------------
-- Seed data for integration_instances
-- ------------------------------------------------------------------

