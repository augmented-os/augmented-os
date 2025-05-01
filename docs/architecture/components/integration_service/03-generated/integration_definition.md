<!-- docs/integration_definition.md -->

# Table `integration_definition`

## Overview
An **Integration Definition** is the canonical description of a connector:
its auth model, supported features and documentation links.  
It is immutable except for `status`, which lets us deprecate or archive old
versions without breaking live instances.

## Columns
| column      | type           | constraints (DDL)                          | notes                                        |
|-------------|----------------|--------------------------------------------|----------------------------------------------|
| id          | uuid           | `PRIMARY KEY`  ·  `DEFAULT gen_random_uuid()`| Unique id; referenced by `integration_instance.integration_id`. |
| name        | varchar(120)   | `NOT NULL`                                 | Human‑readable label shown in UI drop‑downs. |
| type        | varchar(64)    | `NOT NULL`                                 | One of: `oauth2`, `api_key`, `basic_auth`, … |
| version     | varchar(20)    | `DEFAULT '1.0'`                            | SemVer of the connector implementation.      |
| status      | varchar(16)    | `DEFAULT 'active'`                         | `active`, `deprecated`, or `archived`.       |
| description | text           |                                            | Markdown allowed.                            |
| created_at  | timestamptz    | `DEFAULT now()`                            |                                               |
| updated_at  | timestamptz    | `DEFAULT now()`                            |                                               |

## Example row
```json
{
  "id": "2b8fe39e-8e82-4b6f-b3c5-6d3c15b14732",
  "name": "Salesforce REST",
  "type": "oauth2",
  "version": "58.0.0",
  "status": "active",
  "description": "Official Salesforce REST connector (API v58).",
  "createdAt": "2025-04-11T13:29:12Z",
  "updatedAt": "2025-04-11T13:29:12Z"
}
```

## Validation schema
```json
{% include_relative schemas/integration_definition.schema.json %}
```

## Security considerations
* Table contains **no secrets**; safe to replicate to read replicas.
* Only service roles may `INSERT` or `UPDATE`; clients fetch via read‑only API.
