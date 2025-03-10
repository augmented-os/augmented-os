# Tasks

## Overview

Tasks are the atomic units of work within the workflow system. Each task represents a discrete piece of functionality that can be composed into larger workflows. Tasks are designed to be:

* Self-contained and independently executable
* Reusable across different workflows
* Clearly defined in terms of inputs and outputs
* Configurable through parameters
* Either automated or manual (requiring human interaction)

## Task Structure

```json
{
  "taskId": "string",          // Unique identifier
  "name": "string",            // Human-readable name
  "type": "automated | manual",
  "implementation": {
    "kind": "awsLambda | http | script | human | integration",
    "endpoint": "string",      // Implementation reference
    "parameters": { },         // Static configuration
    "integration": {
      "type": "string",
      "method": "string",
      "instanceSelector": {
        "type": "explicit | rule",
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
      "priority": number       // Order priority when multiple conditions match
    }
  ]
}
```

## Implementation Types

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
  "type": "automated",
  "implementation": {
    "kind": "integration",
    "integration": {
      "type": "xero",
      "method": "create_invoice",
      "instanceSelector": {
        "type": "explicit",
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
  "type": "automated",
  "implementation": {
    "kind": "integration",
    "integration": {
      "type": "gmail",
      "method": "send_email",
      "instanceSelector": {
        "type": "rule",
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

## Schema

**Table: task_definitions**

| Field | Type | Description |
|----|----|----|
| id | UUID | Primary key |
| task_id | VARCHAR(255) | Unique business identifier for the task |
| name | VARCHAR(255) | Human-readable name |
| type | VARCHAR(50) | Task type (automated, manual) |
| implementation | JSONB | Implementation details |
| input_schema | JSONB | JSON Schema for task inputs |
| output_schema | JSONB | JSON Schema for task outputs |
| ui_components | JSONB | UI component references and conditions |
| version | VARCHAR(50) | Version of this task definition |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

**Table: task_instances**

| Field | Type | Description |
|----|----|----|
| id | UUID | Primary key |
| workflow_instance_id | UUID | Reference to workflow instance |
| step_id | VARCHAR(255) | Step identifier within workflow |
| task_definition_id | UUID | Reference to task definition |
| status | VARCHAR(50) | Current status (pending, running, completed, failed) |
| input | JSONB | Input data provided to this task |
| output | JSONB | Output data produced by this task |
| error | JSONB | Error details if task failed |
| started_at | TIMESTAMP | When task execution started |
| completed_at | TIMESTAMP | When task execution completed |
| assignee_type | VARCHAR(50) | For manual tasks: role, user, etc. |
| assignee_id | VARCHAR(255) | For manual tasks: specific assignee |
| due_at | TIMESTAMP | For manual tasks: deadline |

**Indexes:**

* `task_definitions_task_id_idx` UNIQUE on `task_id` (for lookups)
* `task_definitions_type_idx` on `type` (for filtering by type)
* `task_instances_workflow_idx` on `workflow_instance_id` (for finding all tasks in a workflow)
* `task_instances_status_idx` on `status` (for finding tasks by status)
* `task_instances_assignee_idx` on `(assignee_type, assignee_id)` (for finding tasks assigned to someone)

**JSON Schema (implementation field):**

```json
{
  "type": "object",
  "properties": {
    "kind": { 
      "type": "string", 
      "enum": ["awsLambda", "http", "script", "human", "integration"] 
    },
    "endpoint": { "type": "string" },
    "parameters": { "type": "object" },
    "integration": {
      "type": "object",
      "properties": {
        "type": { "type": "string" },
        "method": { "type": "string" },
        "instanceSelector": {
          "type": "object",
          "properties": {
            "type": { "type": "string", "enum": ["explicit", "rule"] },
            "value": { "type": "string" },
            "parameters": { "type": "object" }
          }
        }
      }
    }
  }
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

**Notes:**

* Task definitions are versioned to allow for evolution without breaking existing workflows
* Task instances track the execution of a specific task within a workflow
* For manual tasks, the assignee information determines who can interact with the task
* Following our schema convention, all top-level fields from the JSON structure are represented as columns, while nested objects remain as JSONB


