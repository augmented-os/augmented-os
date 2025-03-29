# Event Processing Service API

## Overview

The Event Processing Service provides multiple APIs for event management, subscription, and workflow triggering. These APIs enable components to publish events, subscribe to events, manage event definitions, and configure workflow triggers.

## Base URL

All API endpoints are relative to the base URL:

```
https://api.example.com/event-service
```

## Authentication

All API requests require authentication using one of these methods:

* **API Key**: Include your API key in the `X-API-Key` header
* **OAuth 2.0**: Include a Bearer token in the `Authorization` header
* **Service Account**: For internal service-to-service communication

## Event Management APIs

### Publish Event

Publishes a new event to the system.

**Endpoint**

```
POST /events
```

**Request Body**

```json
{
  "pattern": "bookings.created",
  "payload": {
    "bookingId": "1234",
    "customerId": "cust-5678",
    "amount": 99.99,
    "status": "confirmed"
  },
  "metadata": {
    "correlationId": "abc-123",
    "source": {
      "type": "service",
      "id": "booking-service",
      "name": "Booking Service"
    }
  }
}
```

**Response**

```json
{
  "eventId": "evt-12345678",
  "status": "accepted",
  "timestamp": "2023-04-12T15:30:45.123Z"
}
```

**Status Codes**

| Status | Description |
|----|----|
| 202 | Event accepted for processing |
| 400 | Invalid event format or failed validation |
| 401 | Unauthorized - invalid or missing credentials |
| 429 | Rate limit exceeded |

### Query Events

Retrieves events based on query parameters.

**Endpoint**

```
GET /events
```

**Query Parameters**

| Parameter | Type | Description |
|----|----|----|
| pattern | string | Event pattern to filter by |
| startTime | string | ISO timestamp for start of time range |
| endTime | string | ISO timestamp for end of time range |
| correlationId | string | Filter by correlation ID |
| source.type | string | Filter by source type |
| source.id | string | Filter by source ID |
| limit | number | Maximum number of events to return (default: 100, max: 1000) |
| offset | number | Pagination offset (default: 0) |

**Response**

```json
{
  "events": [
    {
      "id": "evt-12345678",
      "pattern": "bookings.created",
      "timestamp": "2023-04-12T15:30:45.123Z",
      "source": {
        "type": "service",
        "id": "booking-service",
        "name": "Booking Service"
      },
      "payload": {
        "bookingId": "1234",
        "customerId": "cust-5678",
        "amount": 99.99,
        "status": "confirmed"
      },
      "metadata": {
        "correlationId": "abc-123"
      }
    }
  ],
  "pagination": {
    "total": 1250,
    "limit": 100,
    "offset": 0,
    "hasMore": true
  }
}
```

**Status Codes**

| Status | Description |
|----|----|
| 200 | Success |
| 400 | Invalid query parameters |
| 401 | Unauthorized - invalid or missing credentials |

## Event Definition APIs

### Create Event Definition

Creates a new event definition.

**Endpoint**

```
POST /event-definitions
```

**Request Body**

```json
{
  "event_id": "BookingEvents.created",
  "name": "Booking Created",
  "description": "Fired when a new booking is created in the system",
  "pattern": "bookings.created",
  "version": "1.0.0",
  "source_types": ["service", "integration"],
  "payload_schema": {
    "type": "object",
    "properties": {
      "bookingId": {
        "type": "string",
        "description": "Unique identifier for the booking"
      },
      "customerId": {
        "type": "string",
        "description": "Customer who made the booking"
      },
      "amount": {
        "type": "number",
        "description": "Booking amount"
      },
      "status": {
        "type": "string",
        "enum": ["pending", "confirmed", "cancelled"],
        "description": "Current booking status"
      }
    },
    "required": ["bookingId", "customerId", "status"]
  },
  "examples": [
    {
      "bookingId": "1234",
      "customerId": "cust-5678",
      "amount": 99.99,
      "status": "confirmed"
    }
  ],
  "ui_metadata": {
    "icon": "calendar",
    "color": "#4CAF50",
    "category": "booking",
    "priority": "high"
  }
}
```

**Response**

```json
{
  "id": "evt-def-12345678",
  "event_id": "BookingEvents.created",
  "name": "Booking Created",
  "pattern": "bookings.created",
  "version": "1.0.0",
  "status": "active",
  "created_at": "2023-04-12T15:30:45.123Z",
  "updated_at": "2023-04-12T15:30:45.123Z"
}
```

**Status Codes**

| Status | Description |
|----|----|
| 201 | Event definition created |
| 400 | Invalid event definition |
| 401 | Unauthorized - invalid or missing credentials |
| 409 | Event definition with this ID and version already exists |

### List Event Definitions

Retrieves a list of event definitions with optional filtering.

**Endpoint**

```
GET /event-definitions
```

**Query Parameters**

| Parameter | Type | Description |
|----|----|----|
| pattern | string | Filter by event pattern |
| source_type | string | Filter by allowed source type |
| status | string | Filter by status (active, deprecated, draft) |
| limit | number | Maximum number of definitions to return (default: 100) |
| offset | number | Pagination offset (default: 0) |

**Response**

```json
{
  "definitions": [
    {
      "id": "evt-def-12345678",
      "event_id": "BookingEvents.created",
      "name": "Booking Created",
      "description": "Fired when a new booking is created in the system",
      "pattern": "bookings.created",
      "version": "1.0.0",
      "source_types": ["service", "integration"],
      "status": "active",
      "created_at": "2023-04-12T15:30:45.123Z",
      "updated_at": "2023-04-12T15:30:45.123Z"
    }
  ],
  "pagination": {
    "total": 125,
    "limit": 100,
    "offset": 0,
    "hasMore": true
  }
}
```

## Event Subscription APIs

### Create Subscription

Creates a new event subscription.

**Endpoint**

```
POST /subscriptions
```

**Request Body**

```json
{
  "event_pattern": "bookings.*",
  "subscriber": {
    "id": "notification-service",
    "type": "service",
    "endpoint": "https://notification-service.example.com/events",
    "headers": {
      "X-Custom-Header": "custom-value"
    }
  },
  "filter": {
    "type": "jsonpath",
    "expression": "$.payload.status == 'confirmed'"
  },
  "retry_policy": {
    "max_attempts": 5,
    "backoff_factor": 2,
    "initial_delay_ms": 1000
  },
  "description": "Subscription for confirmed bookings"
}
```

**Response**

```json
{
  "subscription_id": "sub-12345678",
  "event_pattern": "bookings.*",
  "subscriber": {
    "id": "notification-service",
    "type": "service"
  },
  "status": "active",
  "created_at": "2023-04-12T15:30:45.123Z"
}
```

**Status Codes**

| Status | Description |
|----|----|
| 201 | Subscription created |
| 400 | Invalid subscription parameters |
| 401 | Unauthorized - invalid or missing credentials |

### List Subscriptions

Retrieves a list of subscriptions with optional filtering.

**Endpoint**

```
GET /subscriptions
```

**Query Parameters**

| Parameter | Type | Description |
|----|----|----|
| event_pattern | string | Filter by event pattern |
| subscriber_id | string | Filter by subscriber ID |
| status | string | Filter by status (active, suspended) |
| limit | number | Maximum number of subscriptions to return (default: 100) |
| offset | number | Pagination offset (default: 0) |

**Response**

```json
{
  "subscriptions": [
    {
      "subscription_id": "sub-12345678",
      "event_pattern": "bookings.*",
      "subscriber": {
        "id": "notification-service",
        "type": "service"
      },
      "status": "active",
      "created_at": "2023-04-12T15:30:45.123Z"
    }
  ],
  "pagination": {
    "total": 25,
    "limit": 100,
    "offset": 0,
    "hasMore": false
  }
}
```

## Workflow Trigger APIs

### Create Workflow Trigger

Creates a new workflow event trigger.

**Endpoint**

```
POST /workflow-triggers
```

**Request Body**

```json
{
  "workflowDefinitionId": "wf-12345678",
  "eventPattern": "bookings.created",
  "triggerType": "START",
  "eventCondition": "$.payload.status == 'confirmed'",
  "inputMapping": {
    "bookingId": "$.payload.bookingId",
    "customerId": "$.payload.customerId",
    "amount": "$.payload.amount"
  },
  "correlationKey": "$.payload.bookingId",
  "enabled": true,
  "priority": 100,
  "description": "Start the booking confirmation workflow when a booking is created"
}
```

**Response**

```json
{
  "id": "wf-trig-12345678",
  "workflowDefinitionId": "wf-12345678",
  "eventPattern": "bookings.created",
  "triggerType": "START",
  "enabled": true,
  "priority": 100,
  "createdAt": "2023-04-12T15:30:45.123Z",
  "updatedAt": "2023-04-12T15:30:45.123Z"
}
```

**Status Codes**

| Status | Description |
|----|----|
| 201 | Workflow trigger created |
| 400 | Invalid trigger parameters |
| 401 | Unauthorized - invalid or missing credentials |
| 404 | Workflow definition not found |

### List Workflow Triggers

Retrieves a list of workflow triggers with optional filtering.

**Endpoint**

```
GET /workflow-triggers
```

**Query Parameters**

| Parameter | Type | Description |
|----|----|----|
| workflowDefinitionId | string | Filter by workflow definition ID |
| eventPattern | string | Filter by event pattern |
| triggerType | string | Filter by trigger type (START, CANCEL) |
| enabled | boolean | Filter by enabled status |
| limit | number | Maximum number of triggers to return (default: 100) |
| offset | number | Pagination offset (default: 0) |

**Response**

```json
{
  "triggers": [
    {
      "id": "wf-trig-12345678",
      "workflowDefinitionId": "wf-12345678",
      "eventPattern": "bookings.created",
      "triggerType": "START",
      "enabled": true,
      "priority": 100,
      "createdAt": "2023-04-12T15:30:45.123Z",
      "updatedAt": "2023-04-12T15:30:45.123Z"
    }
  ],
  "pagination": {
    "total": 15,
    "limit": 100,
    "offset": 0,
    "hasMore": false
  }
}
```

## Error Handling

### Error Response Format

All error responses follow this format:

```json
{
  "error": {
    "code": "invalid_request",
    "message": "A human-readable error message",
    "details": [
      {
        "field": "payload.bookingId",
        "code": "required",
        "message": "Booking ID is required"
      }
    ]
  }
}
```

### Common Error Codes

| Code | Description |
|----|----|
| invalid_request | The request was malformed or had invalid parameters |
| validation_error | The request data failed validation |
| not_found | The requested resource was not found |
| unauthorized | Authentication is required |
| forbidden | The authenticated user lacks permissions |
| rate_limited | Rate limit has been exceeded |
| internal_error | An internal server error occurred |

## Rate Limits

API endpoints are subject to rate limiting:

* **Event Publishing**: 1000 requests per minute per API key
* **Event Queries**: 100 requests per minute per API key
* **Definition Management**: 60 requests per minute per API key
* **Subscription Management**: 60 requests per minute per API key
* **Workflow Trigger Management**: 60 requests per minute per API key

When rate limits are exceeded, the API returns a 429 status code with headers indicating the limit and reset time:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1597341999
```

## Versioning

The API is versioned using the URL path. The current version is `v1`:

```
https://api.example.com/event-service/v1/events
```

## Related Documentation

* [OpenAPI Specification](./event-processing-service-api.yaml)
* [Internal Interfaces](./internal.md)
* [Event Definitions Schema](./schemas/event_definitions.md)
* [Event Instances Schema](./schemas/event_instances.md)


