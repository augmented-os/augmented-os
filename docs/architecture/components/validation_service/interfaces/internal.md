# Validation Service Internal Interfaces

## Overview

This document describes the internal interfaces used by the Validation Service for communication with other system components. These interfaces are not exposed externally and are intended for internal system integration only.

## Interface Types

The Validation Service uses the following types of internal interfaces:

* **Event-based interfaces**: Asynchronous communication via the event bus
* **Service-to-service APIs**: Direct synchronous communication with other services
* **Service Interface**: Programmatic API for direct integration within the same process

## Event-Based Interfaces

### Published Events

The Validation Service publishes the following events to the event bus:

| Event Type | Description | Payload Schema | Consumers |
|------------|-------------|----------------|-----------|
| `validation.schema.created` | Published when a new schema is registered | [SchemaCreatedEvent](#schemacreatedevent) | Schema Registry, Audit Service |
| `validation.schema.updated` | Published when a schema is updated | [SchemaUpdatedEvent](#schemaupdatedevent) | Schema Registry, Audit Service |
| `validation.schema.deprecated` | Published when a schema is deprecated | [SchemaDeprecatedEvent](#schemadeprecatedevent) | Schema Registry, Audit Service |
| `validation.error.recorded` | Published when validation errors are recorded | [ValidationErrorEvent](#validationerrorevent) | Monitoring Service, Analytics Service |

### Subscribed Events

The Validation Service subscribes to the following events:

| Event Type | Description | Publisher | Handler |
|------------|-------------|-----------|---------|
| `system.schema.requested` | Request for schema validation from other components | Various Services | Validation Engine processes the request and returns a validation result |
| `system.validator.registered` | Notification of a new validator registered externally | Custom Validator Services | Updates the Custom Validator Registry with the new validator |
| `system.configuration.updated` | Configuration updates that affect validation | Configuration Service | Updates validation service configuration settings |

## Service-to-Service APIs

### Outbound Service Calls

The Validation Service makes the following calls to other services:

| Service | Endpoint | Purpose | Error Handling |
|---------|----------|---------|---------------|
| Schema Registry Service | `GET /schemas/{id}` | Fetching schema definitions when not in local cache | Falls back to local cache if available, or returns error |
| Metadata Service | `POST /metadata/lookup` | Enriching validation errors with metadata | Continues without metadata if service unavailable |
| Monitoring Service | `POST /metrics` | Reporting validation performance metrics | Buffers metrics locally if service unavailable |
| Authorization Service | `POST /authorization/check` | Validating permissions for schema management | Denies access if service unavailable |

### Inbound Service Calls

The Validation Service exposes the following internal endpoints for other services:

| Endpoint | Purpose | Callers | Authentication |
|----------|---------|---------|---------------|
| `POST /internal/validate` | High-performance validation without rate limiting | Trusted internal services | Service-to-service authentication |
| `GET /internal/schemas/{id}/versions` | List all versions of a schema | Schema Registry Service | Service-to-service authentication |
| `POST /internal/validators/check` | Verify if a custom validator is valid | Custom Validator Management Service | Service-to-service authentication |

## Service Interface

The Validation Service provides a programmatic interface that can be used directly by other components when embedded:

```typescript
interface ValidationService {
  // Schema validation methods
  validate(data: any, schemaId: string, options?: ValidationOptions): Promise<ValidationResult>;
  validateMultiple(validations: ValidationRequest[]): Promise<ValidationResults>;
  validateAgainstSchema(data: any, schema: object): Promise<ValidationResult>;
  
  // Schema management methods
  getSchema(schemaId: string, version?: string): Promise<Schema>;
  registerSchema(schema: SchemaRegistration): Promise<Schema>;
  updateSchema(schemaId: string, schema: SchemaUpdate): Promise<Schema>;
  deprecateSchema(schemaId: string): Promise<void>;
  
  // Custom validator methods
  registerCustomValidator(keyword: string, validatorFn: CustomValidatorFunction, options?: CustomValidatorOptions): Promise<void>;
  getCustomValidator(keyword: string): Promise<CustomValidator>;
}
```

## Event Schemas

### SchemaCreatedEvent

```json
{
  "type": "validation.schema.created",
  "id": "uuid",
  "timestamp": "ISO-8601 timestamp",
  "data": {
    "schemaId": "string",
    "version": "string",
    "namespace": "string",
    "name": "string",
    "isDeprecated": false,
    "creator": "string"
  },
  "metadata": {
    "correlationId": "uuid",
    "source": "validation-service"
  }
}
```

### SchemaUpdatedEvent

```json
{
  "type": "validation.schema.updated",
  "id": "uuid",
  "timestamp": "ISO-8601 timestamp",
  "data": {
    "schemaId": "string",
    "previousVersion": "string",
    "newVersion": "string",
    "namespace": "string",
    "name": "string",
    "changes": [
      {
        "type": "string",
        "path": "string",
        "description": "string"
      }
    ],
    "updater": "string"
  },
  "metadata": {
    "correlationId": "uuid",
    "source": "validation-service"
  }
}
```

### SchemaDeprecatedEvent

```json
{
  "type": "validation.schema.deprecated",
  "id": "uuid",
  "timestamp": "ISO-8601 timestamp",
  "data": {
    "schemaId": "string",
    "version": "string",
    "namespace": "string",
    "name": "string",
    "reason": "string",
    "deprecator": "string"
  },
  "metadata": {
    "correlationId": "uuid",
    "source": "validation-service"
  }
}
```

### ValidationErrorEvent

```json
{
  "type": "validation.error.recorded",
  "id": "uuid",
  "timestamp": "ISO-8601 timestamp",
  "data": {
    "schemaId": "string",
    "version": "string",
    "errorCount": 5,
    "service": "string",
    "operation": "string",
    "errorCodes": ["type", "required", "format"],
    "sampleErrors": [
      {
        "code": "string",
        "path": "string",
        "schemaPath": "string"
      }
    ]
  },
  "metadata": {
    "correlationId": "uuid",
    "source": "validation-service"
  }
}
```

## Error Handling

### Retry Policies

The Validation Service implements the following retry policies for internal communication:

| Interface Type | Retry Strategy | Backoff | Max Retries | Circuit Breaking |
|----------------|----------------|---------|-------------|------------------|
| Event Publishing | Exponential | 100ms initial, 2x increase | 5 | Yes, with 50% error threshold |
| Schema Registry Calls | Exponential | 50ms initial, 2x increase | 3 | Yes, with 30% error threshold |
| Metadata Service Calls | None | N/A | 0 | No, non-critical |
| Monitoring Service Calls | Linear | 100ms | 2 | No, buffered locally |

### Fallback Mechanisms

When communication with dependent services fails, the following fallback mechanisms are used:

| Dependency | Fallback Approach | Impact |
|------------|-------------------|--------|
| Schema Registry | Use local cache if available | May use slightly outdated schemas |
| Metadata Service | Skip metadata enrichment | Less detailed error information |
| Monitoring Service | Buffer metrics locally | Delayed performance visibility |
| Authorization Service | Default to deny access | Schema operations unavailable until service restored |

## Related Documentation

* [Public API](./api.md)
* [Data Model](../data_model.md)
* [Schema Registry](../implementation/schema_registry.md)
* [Custom Validator Registry](../implementation/custom_validator_registry.md)
* [Error Formatter](../implementation/error_formatter.md) 