<!-- docs/integration_instances.md -->

# Table `integration_instance`

## Overview
An **Integration Instance** represents a tenant‑specific installation of an Integration Definition.
It carries the tenant’s credentials, per‑instance configuration, status and operational telemetry.

## Columns
| column            | type        | constraints (DDL)                                   | notes                                                  |
|-------------------|-------------|-----------------------------------------------------|--------------------------------------------------------|
| id                | uuid        | `PRIMARY KEY`  ·  `DEFAULT gen_random_uuid()`       |                                                        |
| integration_id    | uuid        | `REFERENCES integration_definition(id)`             | Foreign key to the owning definition.                 |
| status            | varchar(16) | `DEFAULT 'active'`                                  | `active`, `error`, `archived`.                        |
| credentials       | **jsonb**   | `NOT NULL`  ·  `CHECK (jsonb_valid(credentials))`   | Schema below.                                         |
| config            | **jsonb**   | `NOT NULL`  ·  `CHECK (jsonb_valid(config))`        | Schema below.                                         |
| last_used_at      | timestamptz |                                                     | Updated after every successful API call.              |
| last_connected_at | timestamptz |                                                     | Timestamp of last successful connectivity check.      |
| created_at        | timestamptz | `DEFAULT now()`                                     |                                                        |
| updated_at        | timestamptz | `DEFAULT now()`                                     |                                                        |

## `credentials` column schema
```json
{% include_relative schemas/integration_credentials.schema.json %}
```

## `config` column schema
```json
{% include_relative schemas/integration_config.schema.json %}
```

## Example row (flattened)
```json
{
  "id": "a6a14188-b02c-4076-85b7-4bc6f03cbcbd",
  "integrationId": "2b8fe39e-8e82-4b6f-b3c5-6d3c15b14732",
  "status": "active",
  "credentials": {
    "accessToken": "ya29.a0AfH6SMB…",
    "refreshToken": "1//0g8rVJq…",
    "expiresAt": "2025-10-01T12:48:05Z"
  },
  "config": {
    "webhookUrl": "https://hooks.example.com/sf",
    "pollIntervalMinutes": 15
  },
  "lastUsedAt": "2025-04-28T10:15:44Z",
  "lastConnectedAt": "2025-04-28T10:15:44Z",
  "createdAt": "2025-04-15T09:02:18Z",
  "updatedAt": "2025-04-28T10:15:44Z"
}
```

## Validation schema
```json
{% include_relative schemas/integration_instance.schema.json %}
```

## Security considerations
* `credentials` JSON is encrypted at rest, and the column is masked for non‑privileged roles.
* Row‑level security restricts access to rows belonging to the caller’s tenant.
* Updates to `status` are audited; write access limited to the integrations service.
