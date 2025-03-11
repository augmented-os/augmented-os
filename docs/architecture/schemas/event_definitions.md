# Event Definitions

## Overview

Event definitions specify the structure and metadata for event types within the system. They define the contract that event instances must follow.

## Schema Structure

```json
{
  "event_id": "string",           // Unique business identifier (e.g., "BookingEvents.created")
  "name": "string",               // Human-readable name
  "description": "string",        // Detailed description
  "pattern": "string",            // Event pattern for routing (e.g., "bookings.created") 
  "version": "string",            // Schema version (semver format)
  "source_types": [               // Valid origins for this event type
    "workflow",
    "task", 
    "integration",
    "external",
    "system"
  ],
  "payload_schema": {             // JSON Schema for payload validation
    "type": "object",
    "properties": { },
    "required": []
  },
  "examples": [                   // Example payloads for documentation
    {
      // Sample valid payload
    }
  ],
  "ui_metadata": {                // Display information for event tools
    "icon": "string",             // Icon identifier
    "color": "string",            // Color in hex or named format
    "category": "string",         // Functional category
    "priority": "string"          // Display priority (high, medium, low)
  }
}
```

## Database Schema

**Table: event_definitions**

| Field | Type | Description |
|----|----|----|
| id | UUID | Primary key |
| event_id | VARCHAR(255) | Unique business identifier for the event type |
| name | VARCHAR(255) | Human-readable name |
| description | TEXT | Detailed description of the event |
| pattern | VARCHAR(255) | Event pattern (e.g., "invoice.created") |
| version | VARCHAR(50) | Event schema version |
| source_types | JSONB | Allowed source types for this event |
| payload_schema | JSONB | JSON Schema for the event payload structure |
| examples | JSONB | Example payloads for documentation |
| ui_metadata | JSONB | UI display information (icons, colors, etc.) |
| created_at | TIMESTAMP | Record creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |
| status | VARCHAR(50) | Status (active, deprecated, draft) |

**Indexes:**

* `event_definitions_event_id_version_idx` UNIQUE on `(event_id, version)` (for version-specific lookups)
* `event_definitions_pattern_idx` on `pattern` (for event type matching)
* `event_definitions_source_idx` GIN on `source_types` (for filtering by source)
* `event_definitions_status_idx` on `status` (for filtering active definitions)

## Example Definition

```json
{
  "event_id": "BookingEvents.created",
  "name": "Booking Created",
  "description": "Triggered when a new booking record is created in the system",
  "pattern": "bookings.created",
  "version": "1.0.0",
  "source_types": ["integration", "system", "workflow"],
  "payload_schema": {
    "type": "object",
    "properties": {
      "booking_id": {
        "type": "string",
        "description": "Unique identifier for the booking",
        "pattern": "^BK-[0-9]{5,}$"
      },
      "customer_id": {
        "type": "string",
        "description": "Identifier of the customer who made the booking"
      },
      "service_id": {
        "type": "string",
        "description": "Identifier of the service booked"
      },
      "appointment_time": {
        "type": "string",
        "format": "date-time",
        "description": "When the appointment is scheduled"
      },
      "status": {
        "type": "string",
        "enum": ["confirmed", "pending", "cancelled"],
        "description": "Current status of the booking"
      }
    },
    "required": ["booking_id", "customer_id", "service_id", "appointment_time", "status"]
  },
  "examples": [
    {
      "booking_id": "BK-12345",
      "customer_id": "CUST-789",
      "service_id": "SRV-456",
      "appointment_time": "2024-03-15T14:30:00Z",
      "status": "confirmed"
    }
  ],
  "ui_metadata": {
    "icon": "calendar-plus",
    "color": "#4CAF50",
    "category": "Booking Events",
    "priority": "high"
  }
}
```

## Related Documentation

* [Event Instances](./event_instances.md) - Schema for event instances
* [Workflow Definitions](./workflow_definitions.md) - Schema for workflow definitions
* [Tasks Schema](./tasks.md) - Schema for task definitions and instances


