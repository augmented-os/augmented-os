# Error Formatter

## Overview

The Error Formatter is a core component of the Validation Service responsible for converting low-level validation errors into user-friendly, actionable error messages. It ensures that validation failures are communicated clearly, with appropriate context and in the right format for different consumers.

## Key Responsibilities

* Formatting validation errors for readability
* Localizing error messages
* Providing context-specific error details
* Supporting different output formats
* Enabling custom error templates

## Implementation Approach

The Error Formatter follows these design principles:


1. **User-Friendly Messaging** - Creates clear, actionable error messages
2. **Context Awareness** - Includes relevant context in error descriptions
3. **Format Flexibility** - Supports multiple output formats (JSON, text, HTML)
4. **Internationalization** - Enables localized error messages
5. **Customizability** - Allows custom error templates and formatting rules

## Error Formatting Lifecycle

```
┌───────────────┐
│  Validation   │
│  Error        │
└───────┬───────┘
        │
        ▼
┌───────────────┐     ┌─────────────────┐
│  Error        │────►│    Template     │
│  Normalization│     │    Selection    │
└───────┬───────┘     └─────────┬───────┘
        │                       │
        │                       │
        ▼                       ▼
┌───────────────┐     ┌─────────────────┐
│  Context      │────►│    Message      │
│  Enrichment   │     │    Formatting   │
└───────────────┘     └─────────┬───────┘
                                │
                                │
                                ▼
                      ┌─────────────────┐
                      │    Localization │
                      │                 │
                      └─────────┬───────┘
                                │
                                ▼
                      ┌─────────────────┐
                      │    Formatted    │
                      │    Error        │
                      └─────────────────┘
```

## Implementation Details

### Error Normalization

The first step in error formatting is normalizing the various error formats that can come from different validation engines:

```typescript
// Example of error normalization
function normalizeErrors(
  errors: Array<any>,
  format: string = 'standard'
): Array<NormalizedError> {
  return errors.map(error => {
    // Create a base normalized error
    const normalized: NormalizedError = {
      code: getErrorCode(error),
      message: error.message || 'Validation error',
      path: formatJsonPath(error.dataPath || error.instancePath || ''),
      schemaPath: error.schemaPath || '',
      params: error.params || {}
    };
    
    // Add additional format-specific properties
    if (format === 'detailed') {
      normalized.value = error.data;
      normalized.schema = error.parentSchema;
    }
    
    return normalized;
  });
}
```

### Context Enrichment

The Error Formatter enriches errors with additional context to make them more understandable:

```typescript
// Example of context enrichment
function enrichErrorContext(
  error: NormalizedError,
  data: any,
  options: FormatterOptions
): EnrichedError {
  // Get the value at the error path
  const value = getValueAtPath(data, error.path);
  
  // Determine data type
  const dataType = getDataType(value);
  
  // Get schema constraints
  const constraints = getSchemaConstraints(error.schemaPath, error.params);
  
  // Enrich the error
  return {
    ...error,
    context: {
      value: options.includeValues ? value : undefined,
      dataType,
      constraints,
      propertyName: getPropertyNameFromPath(error.path),
      expectedType: error.params.type || getExpectedType(error)
    }
  };
}
```

### Message Template System

The Error Formatter uses a template system for generating error messages:

```typescript
// Example of the template system
const errorTemplates = {
  required: '{{propertyName}} is required',
  type: '{{propertyName}} must be a {{expectedType}}, but received {{dataType}}',
  minimum: '{{propertyName}} must be at least {{params.limit}}',
  maximum: '{{propertyName}} must be at most {{params.limit}}',
  minLength: '{{propertyName}} must be at least {{params.limit}} characters long',
  maxLength: '{{propertyName}} must be at most {{params.limit}} characters long',
  pattern: '{{propertyName}} must match pattern "{{params.pattern}}"',
  enum: '{{propertyName}} must be one of: {{params.allowedValues}}',
  format: '{{propertyName}} must be a valid {{params.format}}',
  // Add more templates for different error types
};

// Template rendering function
function renderTemplate(
  template: string,
  error: EnrichedError
): string {
  return template.replace(/\{\{([^}]+)\}\}/g, (match, key) => {
    // Handle nested keys like params.limit
    const keys = key.split('.');
    let value = error;
    
    for (const k of keys) {
      value = value[k];
      if (value === undefined) break;
    }
    
    return value !== undefined ? value : match;
  });
}
```

### Localization Support

The Error Formatter supports message localization:

```typescript
// Example of localization support
function localizeError(
  error: EnrichedError,
  locale: string = 'en-US'
): LocalizedError {
  // Get localized templates for the specified locale
  const templates = getLocalizedTemplates(locale);
  
  // Get the appropriate template for this error
  const template = templates[error.code] || templates.default;
  
  // Render the template with the error context
  const message = renderTemplate(template, error);
  
  return {
    ...error,
    message,
    locale
  };
}
```

### Output Format Adaptation

The Error Formatter supports different output formats for different consumers:

```typescript
// Example of format adaptation
function formatErrors(
  errors: Array<LocalizedError>,
  format: string = 'standard'
): any {
  switch (format) {
    case 'json':
      return errors.map(error => ({
        code: error.code,
        message: error.message,
        path: error.path,
        params: error.params
      }));
      
    case 'text':
      return errors.map(error => `${error.path}: ${error.message}`).join('\n');
      
    case 'html':
      return `<ul class="validation-errors">
        ${errors.map(error => `<li data-path="${error.path}">${error.message}</li>`).join('')}
      </ul>`;
      
    case 'api':
      return {
        status: 'error',
        errors: errors.map(error => ({
          code: error.code,
          message: error.message,
          path: error.path
        }))
      };
      
    default:
      return errors;
  }
}
```

### Error Grouping

The Error Formatter provides utilities for grouping related errors:

```typescript
// Example of error grouping
function groupErrorsByPath(
  errors: Array<LocalizedError>
): Record<string, Array<LocalizedError>> {
  const grouped = {};
  
  for (const error of errors) {
    const path = error.path || 'root';
    grouped[path] = grouped[path] || [];
    grouped[path].push(error);
  }
  
  return grouped;
}
```

### Edge Cases and Error Handling

The implementation addresses the following edge cases:

| Scenario | Handling Approach |
|----|----|
| Missing error templates | Falls back to default templates with basic information |
| Unknown error codes | Provides generic error message with available details |
| Circular references in data | Detects and prevents circular reference issues in error context |
| Missing translations | Falls back to English messages when localized templates are unavailable |
| Custom error formats | Supports pluggable formatters for custom output formats |

## Performance Considerations

The Error Formatter balances detailed error information with performance:

* Lazy evaluation of error contexts to avoid unnecessary processing
* Template caching to improve rendering performance
* Optimized path resolution to quickly locate error positions
* Configurable detail levels to control processing overhead
* Batched error processing for multiple errors

### Benchmarks

| Operation | Average Performance | P99 Performance |
|----|----|----|
| Simple error formatting | <1ms | <5ms |
| Complex error formatting | <5ms | <20ms |
| Localized error rendering | <2ms | <10ms |
| Error grouping | <1ms per 10 errors | <5ms per 10 errors |

## Related Documentation

* [Validation Engine](./validation_engine.md)
* [Custom Validator Registry](./custom_validator_registry.md)
* [API Reference](../interfaces/api.md)
* [Examples](../examples/basic_example.md)


