# Task Definitions

## Overview

Task definitions are templates that describe the atomic units of work within the workflow system. Each task definition represents a reusable piece of functionality that can be composed into larger workflows. Task definitions are designed to be:

* Self-contained and independently executable
* Reusable across different workflows
* Clearly defined in terms of inputs and outputs
* Configurable through parameters
* Either automated or manual (requiring human interaction)

## Key Concepts

* **Task Definition** - A template that defines the structure and behavior of a task
* **Task Instance** - A single execution of a task definition
* **Implementation Types** - The various ways tasks can be implemented (Lambda, HTTP, Script, Manual, Integration)
* **Input/Output Schema** - JSON Schema definitions for task inputs and outputs
* **UI Components** - For manual tasks, the interface elements presented to users

## Task Definition Structure

```json
{
  "taskId": "string",          // Unique identifier
  "name": "string",            // Human-readable name
  "type": "string",            // Task type (task_type enum: AUTOMATED, MANUAL, INTEGRATION)
  "implementation": {
    "kind": "string",          // Implementation kind (validated by JSON Schema: AWS_LAMBDA, HTTP, SCRIPT, HUMAN, INTEGRATION)
    "endpoint": "string",      // Implementation reference
    "parameters": { },         // Static configuration
    "integration": {
      "type": "string",
      "method": "string",
      "instanceSelector": {
        "type": "string",      // Instance selector type (validated by JSON Schema: EXPLICIT, RULE)
        "value": "string",
        "parameters": { }
      }
    }
  },
  "inputSchema": {             // JSON Schema for inputs
    "type": "object",
    "properties": { }
  },
  "outputSchema": {            // JSON Schema for outputs
    "type": "object",
    "properties": { }
  },
  "uiComponents": [           // For manual tasks, conditional UI definitions
    {
      "componentId": "string",  // Reference to UI component definition
      "condition": "string",    // Optional condition for when to show this UI
      "priority": 0            // Order priority when multiple conditions match
    }
  ]
}
```

## Implementation Types

Task definitions support various implementation types to handle different execution models:

### AWS Lambda Tasks

Lambda tasks execute serverless functions in AWS. Their implementation includes:

* **Endpoint Format:** AWS Lambda ARN or function name
* **Common Parameters:**
  * `memorySize`: Memory allocation in MB
  * `timeout`: Maximum execution time
  * `environment`: Environment variables
  * `vpcConfig`: VPC configuration settings
  * `role`: IAM role ARN for execution

### HTTP Tasks

HTTP tasks make requests to external services. Their implementation includes:

* **Endpoint Format:** URL or service identifier
* **Common Parameters:**
  * `baseUrl`: Base URL for the service
  * `headers`: Default HTTP headers
  * `auth`: Authentication configuration
  * `retry`: Retry policy settings
  * `timeout`: Request timeout
  * `validateStatus`: Status code validation rules

### Script Tasks

Script tasks execute code within the system. Their implementation includes:

* **Endpoint Format:** Script reference or inline code
* **Common Parameters:**
  * `runtime`: Execution environment (e.g., node, python)
  * `dependencies`: Required packages or modules
  * `timeout`: Maximum execution time
  * `resources`: Resource allocation settings

### Manual Tasks

Manual tasks require human interaction. Their implementation includes:

* **Endpoint Format:** UI component reference
* **Common Parameters:**
  * `assignee`: Default role or user assignment rules
  * `sla`: Service level agreement settings
  * `escalation`: Escalation policy configuration
  * `notifications`: Notification settings for task events
  * `deadline`: Default completion deadline

### Integration Tasks

Tasks that connect with external systems. Their implementation includes:

* **Endpoint Format:** Integration service identifier
* **Common Parameters:**
  * `service`: Service configuration details
  * `credentials`: Service account or API key references
  * `rateLimit`: Rate limiting settings
  * `features`: Feature flag configurations
  * `monitoring`: Integration-specific monitoring settings

## Input/Output Schema

Task input and output schemas should:

* Use JSON Schema format
* Define clear data types and constraints
* Include descriptions for all fields
* Specify required vs optional fields
* Define validation rules

Example:

```json
{
  "inputSchema": {
    "type": "object",
    "properties": {
      "userId": {
        "type": "string",
        "description": "The ID of the user",
        "pattern": "^USER_[A-Z0-9]+$"
      },
      "amount": {
        "type": "number",
        "minimum": 0,
        "description": "Transaction amount"
      }
    },
    "required": ["userId", "amount"]
  }
}
```

## UI Components

For manual tasks, UI components define the interface presented to users. The UI can be conditional based on task state or data:

```json
{
  "taskId": "string",
  "uiComponents": [
    {
      "componentId": "string",      // Reference to UI component definition
      "condition": "string",        // Optional condition for when to show this UI
      "priority": number           // Order priority when multiple conditions match
    }
  ]
}
```

Example conditions:

```json
{
  "uiComponents": [
    {
      "componentId": "approval-form",
      "condition": "status == 'pending' && user.hasRole('approver')",
      "priority": 1
    },
    {
      "componentId": "readonly-view",
      "condition": "status == 'completed'",
      "priority": 1
    },
    {
      "componentId": "error-correction",
      "condition": "status == 'failed' && error.code == 'VALIDATION_ERROR'",
      "priority": 2
    }
  ]
}
```

## Implementation Examples

Example task using integration:

```json
{
  "taskId": "create-xero-invoice",
  "name": "Create Xero Invoice",
  "type": "AUTOMATED",
  "implementation": {
    "kind": "INTEGRATION",
    "integration": {
      "type": "xero",
      "method": "create_invoice",
      "instanceSelector": {
        "type": "EXPLICIT",
        "value": "xero_main"
      }
    }
  },
  "inputSchema": {
    "type": "object",
    "properties": {
      "contact_id": {
        "type": "string",
        "description": "Xero contact ID"
      },
      "line_items": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "description": { "type": "string" },
            "quantity": { "type": "number" },
            "unit_amount": { "type": "number" }
          }
        }
      }
    },
    "required": ["contact_id", "line_items"]
  },
  "outputSchema": {
    "type": "object",
    "properties": {
      "invoice_id": { "type": "string" },
      "invoice_number": { "type": "string" },
      "status": { "type": "string" }
    }
  }
}
```

Example task with rule-based integration selection:

```json
{
  "taskId": "send-email",
  "name": "Send Email",
  "type": "AUTOMATED",
  "implementation": {
    "kind": "INTEGRATION",
    "integration": {
      "type": "gmail",
      "method": "send_email",
      "instanceSelector": {
        "type": "RULE",
        "value": "sender_match",
        "parameters": {
          "field": "from_address"
        }
      }
    }
  },
  "inputSchema": {
    "type": "object",
    "properties": {
      "from_address": { "type": "string" },
      "to_address": { "type": "string" },
      "subject": { "type": "string" },
      "body": { "type": "string" }
    }
  }
}
```

## Database Schema

**Enums:**

```sql
-- Task type enum (used in dedicated column)
CREATE TYPE task_type AS ENUM (
  'AUTOMATED',
  'MANUAL',
  'INTEGRATION'
);

-- Note: Other enum-like values (implementation kind, instance selector type, security level) 
-- are stored within JSONB fields and validated using JSON Schema constraints rather than 
-- PostgreSQL enums. This provides more flexibility for these nested configuration values.
```

**Table: task_definitions**

| Field | Type | Description |
|----|----|----|
| id | UUID | Primary key |
| task_id | VARCHAR(255) | Unique business identifier for the task (NOT NULL, UNIQUE) |
| name | VARCHAR(255) | Human-readable name (NOT NULL) |
| description | TEXT | Detailed description (nullable) |
| type | task_type | Task type (NOT NULL) |
| version | VARCHAR(50) | Semantic version (NOT NULL) |
| input_schema | JSONB | JSON Schema for task inputs (NOT NULL) |
| output_schema | JSONB | JSON Schema for task outputs (NOT NULL) |
| timeout | INTEGER | Maximum execution time in milliseconds (nullable) |
| retry_policy | JSONB | Default retry policy (nullable) |
| execution_config | JSONB | Configuration for execution (NOT NULL) |
| ui_components | JSONB | UI component references and conditions (nullable) |
| metadata | JSONB | Additional metadata (nullable) |
| created_at | TIMESTAMPTZ | Creation timestamp (NOT NULL, DEFAULT NOW()) |
| updated_at | TIMESTAMPTZ | Last update timestamp (NOT NULL, DEFAULT NOW()) |

**Constraints:**

```sql
-- Primary key
ALTER TABLE task_definitions ADD CONSTRAINT task_definitions_pkey PRIMARY KEY (id);

-- Unique constraint on business identifier
ALTER TABLE task_definitions ADD CONSTRAINT task_definitions_task_id_unique UNIQUE (task_id);

-- Check constraints
ALTER TABLE task_definitions 
  ADD CONSTRAINT check_timeout_positive 
  CHECK (timeout IS NULL OR timeout > 0);

-- Automatic timestamp update trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_task_definitions_updated_at 
  BEFORE UPDATE ON task_definitions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

**Indexes:**

```sql
-- Basic indexes
CREATE UNIQUE INDEX task_definitions_task_id_idx ON task_definitions (task_id);
CREATE INDEX task_definitions_type_idx ON task_definitions (type);
CREATE INDEX task_definitions_version_idx ON task_definitions (version);
CREATE INDEX task_definitions_created_at_idx ON task_definitions (created_at);

-- JSONB indexes for nested data queries
CREATE INDEX task_definitions_input_schema_gin_idx ON task_definitions USING GIN (input_schema);
CREATE INDEX task_definitions_output_schema_gin_idx ON task_definitions USING GIN (output_schema);
CREATE INDEX task_definitions_execution_config_gin_idx ON task_definitions USING GIN (execution_config);
CREATE INDEX task_definitions_ui_components_gin_idx ON task_definitions USING GIN (ui_components);
CREATE INDEX task_definitions_metadata_gin_idx ON task_definitions USING GIN (metadata);

-- Specific JSONB field indexes for common queries
CREATE INDEX task_definitions_executor_idx ON task_definitions 
  USING BTREE ((execution_config->>'executor'));
CREATE INDEX task_definitions_security_level_idx ON task_definitions 
  USING BTREE ((execution_config->'securityContext'->>'securityLevel'));
```

**JSON Schema (execution_config field):**

```json
{
  "type": "object",
  "properties": {
    "executor": { "type": "string" },
    "securityContext": {
      "type": "object",
      "properties": {
        "runAs": { "type": "string" },
        "permissions": { 
          "type": "array", 
          "items": { "type": "string" } 
        },
        "securityLevel": { 
          "type": "string", 
          "enum": ["LOW", "MEDIUM", "HIGH"] 
        }
      },
      "required": ["permissions", "securityLevel"]
    },
    "resourceRequirements": {
      "type": "object",
      "properties": {
        "cpu": { "type": "string" },
        "memory": { "type": "string" },
        "disk": { "type": "string" },
        "timeoutSeconds": { "type": "number" }
      },
      "required": ["cpu", "memory", "timeoutSeconds"]
    },
    "environmentVariables": {
      "type": "object",
      "additionalProperties": { "type": "string" }
    }
  },
  "required": ["executor"]
}
```

**JSON Schema (retry_policy field):**

```json
{
  "type": "object",
  "properties": {
    "maxRetries": { "type": "number" },
    "retryInterval": { "type": "number" },
    "backoffMultiplier": { "type": "number" },
    "maxRetryInterval": { "type": "number" },
    "retryableErrors": {
      "type": "array",
      "items": { "type": "string" }
    }
  },
  "required": ["maxRetries", "retryInterval", "backoffMultiplier"]
}
```

**JSON Schema (ui_components field):**

```json
{
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "componentId": { "type": "string" },
      "condition": { "type": "string" },
      "priority": { "type": "number" }
    },
    "required": ["componentId"]
  }
}
```

## Performance Considerations

For task definitions, consider these performance optimizations:

* **Strategic Indexing**: Create indices on frequently queried fields including type, version, and task_id
* **JSONB Optimization**: Use GIN indexes on JSONB fields for filtering based on nested configuration data
* **Versioning Strategy**: Use semantic versioning to allow for evolution without breaking existing workflows
* **Caching**: Consider caching frequently used task definitions to reduce database load
* **Modular Design**: Keep task definitions focused and modular to promote reuse
* **UI Component Complexity**: Limit the complexity of conditional UI components to prevent rendering performance issues
* **Query Optimization**: Leverage specific JSONB field indexes for common configuration queries

## Related Documentation

* [Task Instances](./task_instances.md) - Documentation for task instances
* [Workflow Definitions](./workflow_definitions.md) - Documentation for workflow definitions
* [Workflow Instances](./workflow_instances.md) - Documentation for workflow instances
* [UI Components](./ui_components.md) - Documentation for UI components