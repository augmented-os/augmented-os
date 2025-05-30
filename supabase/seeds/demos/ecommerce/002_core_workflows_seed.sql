/* -----------------------------------------------------------
   Seed: the "order_processing" workflow definition based on POC data
------------------------------------------------------------ */

INSERT INTO workflow_definitions (
  workflow_id,
  name,
  description,
  version,
  input_schema,
  steps,
  ui_components,
  execution_log,
  created_at,
  updated_at
)
VALUES (
  'order_processing',                             -- workflow_id
  'Order processing',                             -- name
  'Demo flow with payment + fulfilment tasks',    -- description
  '1.0.0',                                        -- version
  '{
    "type": "object",
    "properties": {
      "orderId": {
        "type": "string",
        "format": "uuid",
        "description": "Order ID"
      }
    },
    "required": ["orderId"]
  }'::jsonb,                                    -- input_schema (from POC data)
  '[
    {
      "stepId": "node-input", "name": "Workflow Input", "description": "Input: Order ID",
      "next": [ { "nextStepId": "data-store_7" } ]
    },
    {
      "stepId": "data-store_7", "taskId": "data_store_get_order", "name": "Get Order Details", "description": "Get orders",
      "next": [
        { "nextStepId": "node-manual", "condition": "${data.orderAmount} > 1000" },
        { "nextStepId": "data-store_5" }
      ]
    },
    {
      "stepId": "node-manual", "taskId": "manual_task_approve_order", "name": "Approve Order", "description": "Assigned to Manager",
      "next": [
        { "nextStepId": "node-output", "condition": "${data.actionResult} == \"Declined\"" },
        { "nextStepId": "data-store_5", "condition": "${data.actionResult} == \"Approved\"" }
      ]
    },
    {
      "stepId": "data-store_5", "taskId": "data_store_update_order", "name": "Update Order Status", "description": "Update orders",
      "next": [ { "nextStepId": "document_6" } ]
    },
    {
      "stepId": "document_6", "taskId": "document_fill_template", "name": "Fill Template", "description": "Generate Confirmation Email",
      "next": [ { "nextStepId": "integration_5" } ]
    },
    {
      "stepId": "integration_5", "taskId": "integration_email_customer", "name": "Email Customer", "description": "Send Confirmation Email",
      "next": [ { "nextStepId": "node-output" } ]
    },
    {
      "stepId": "node-output", "name": "Workflow Output", "description": "Output: Approved (True/False)",
      "next": []
    }
  ]'::jsonb,                                    -- steps (mapped from POC data)
  '{}'::jsonb,                                    -- ui_components (default empty)
  '{}'::jsonb,                                    -- execution_log (default empty)
  now(),                                          -- created_at
  now()                                           -- updated_at
);
