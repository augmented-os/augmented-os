# Custom Validator Registry

## Overview

The Custom Validator Registry is a core component of the Validation Service responsible for managing and executing custom validation rules. It enables domain-specific validation beyond standard JSON Schema constraints by allowing developers to register and use custom validation keywords.

## Key Responsibilities

* Registering custom validation functions
* Supporting complex validation logic
* Providing context-aware validation
* Enabling domain-specific validation rules
* Supporting asynchronous validation

## Implementation Approach

The Custom Validator Registry follows these design principles:


1. **Extensibility** - Allows the validation system to be extended with custom logic
2. **Isolation** - Ensures custom validators don't compromise the core validation engine
3. **Performance** - Optimizes custom validator execution without sacrificing standard validation speed
4. **Discoverability** - Makes custom validators easy to find and understand
5. **Compatibility** - Ensures compatibility with the JSON Schema standard

## Custom Validator Lifecycle

```
┌───────────────┐
│  Validator    │
│  Creation     │
└───────┬───────┘
        │
        ▼
┌───────────────┐     ┌─────────────────┐
│  Validator    │────►│    Meta-Schema  │
│  Registration │     │    Validation   │
└───────┬───────┘     └─────────┬───────┘
        │                       │
        │                       │
        ▼                       │
┌───────────────┐               │
│  Validator    │               │
│  Storage      │               │
└───────────────┘               │
        ▲                       │
        │                       │
        │                       │
┌───────────────┐               │
│  Validator    │◄──────────────┘
│  Usage        │
└───────┬───────┘
        │
        ▼
┌───────────────┐
│  Validator    │
│  Execution    │
└───────────────┘
```

## Implementation Details

### What is a Meta-Schema?

A meta-schema is a schema that defines the structure and constraints for other schemas. In the context of custom validators, a meta-schema defines the valid structure for a custom keyword's value in a schema.

For example, if you create a custom keyword called `range`, you might define its meta-schema as:

```json
{
  "type": "object",
  "properties": {
    "min": { "type": "number" },
    "max": { "type": "number" }
  },
  "required": ["min", "max"]
}
```

This meta-schema ensures that whenever someone uses your `range` keyword in a schema, it must be an object with numeric `min` and `max` properties. The Custom Validator Registry uses meta-schemas to validate custom keyword usage before executing the custom validator itself.

### Custom Validator Registration

The registry provides an API for registering custom validators:

```typescript
// Example of custom validator registration
function registerCustomValidator(
  keyword: string,
  validatorFn: CustomValidatorFunction,
  options: CustomValidatorOptions = {}
): void {
  // Validate keyword format
  if (!isValidKeyword(keyword)) {
    throw new Error(`Invalid validator keyword: ${keyword}`);
  }
  
  // Check for existing validator
  if (customValidatorRegistry.hasValidator(keyword) && !options.override) {
    throw new Error(`Validator already exists for keyword: ${keyword}`);
  }
  
  // Create validator descriptor
  const validatorDescriptor = {
    keyword,
    validate: validatorFn,
    async: !!options.async,
    errors: options.errors !== false,
    metaSchema: options.metaSchema, // Schema that validates the keyword's value
    modifying: !!options.modifying,
    schema: !!options.requiresSchema,
    dependencies: options.dependencies || []
  };
  
  // Register with the validator registry
  customValidatorRegistry.register(validatorDescriptor);
  
  // Invalidate affected cached validators
  if (options.invalidateCache !== false) {
    validatorCache.invalidateByKeyword(keyword);
  }
  
  // Log registration
  logger.info(`Registered custom validator for keyword: ${keyword}`);
}
```

### Custom Validator Types

The Custom Validator Registry supports several types of validators:


1. **Schema Validators** - Validate data against a schema defined by the keyword
2. **Function Validators** - Execute custom logic defined in JavaScript/TypeScript
3. **Compound Validators** - Combine multiple validators for complex validation
4. **Async Validators** - Support asynchronous validation operations
5. **Modifying Validators** - Can modify the data during validation

### Custom Validator Execution

Custom validators are executed as part of the standard validation process:

```typescript
// Example of custom validator execution
async function executeCustomValidator(
  validator: CustomValidator,
  data: any,
  schema: any,
  context: ValidationContext
): Promise<ValidationResult> {
  try {
    // Execute the validator function
    const result = validator.async
      ? await validator.validate(data, schema, context)
      : validator.validate(data, schema, context);
    
    // Handle boolean results
    if (typeof result === 'boolean') {
      return {
        valid: result,
        errors: result ? [] : [{
          keyword: validator.keyword,
          message: `Failed validation for keyword: ${validator.keyword}`,
          params: { keyword: validator.keyword }
        }]
      };
    }
    
    // Handle result objects
    return {
      valid: result.valid,
      errors: result.errors || [],
      data: result.data // For modifying validators
    };
  } catch (error) {
    // Handle validator execution errors
    logger.error(`Error executing custom validator for keyword: ${validator.keyword}`, {
      error: error.message,
      stack: error.stack
    });
    
    return {
      valid: false,
      errors: [{
        keyword: validator.keyword,
        message: `Validator error: ${error.message}`,
        params: { keyword: validator.keyword, error: error.message }
      }]
    };
  }
}
```

### Example: Custom Email Validator

Here's an example of a custom email validator with domain restrictions:

```typescript
// Register a custom email validator
registerCustomValidator(
  'emailDomain',
  (data, schema, context) => {
    // Skip validation if not a string
    if (typeof data !== 'string') {
      return true;
    }
    
    // Check if it looks like an email
    if (!data.includes('@')) {
      return false;
    }
    
    // Extract the domain
    const domain = data.split('@')[1].toLowerCase();
    
    // Check if the domain is in the allowed list
    return schema.allowedDomains.includes(domain);
  },
  {
    // Meta-schema for the emailDomain keyword
    metaSchema: {
      type: 'object',
      properties: {
        allowedDomains: {
          type: 'array',
          items: { type: 'string' },
          minItems: 1
        }
      },
      required: ['allowedDomains']
    }
  }
);
```

### Edge Cases and Error Handling

The implementation addresses the following edge cases:

| Scenario | Handling Approach |
|----|----|
| Invalid custom validator | Validates validator function signature before registration |
| Circular dependencies | Detects and prevents circular dependencies between custom validators |
| Performance issues | Monitors execution time and provides warnings for slow validators |
| Conflicting validators | Enforces unique keyword names and provides explicit override option |
| Validator errors | Isolates errors in custom validators from affecting the core validation |

## Performance Considerations

Custom validators can impact validation performance, so the registry implements:

* Optimized execution paths for common validator patterns
* Caching of validator results for repeated validations
* Execution time monitoring to identify slow validators
* Parallel execution of independent validators where possible
* Selective execution based on data types

### Benchmarks

| Operation | Average Performance | P99 Performance |
|----|----|----|
| Simple custom validation | <2ms | <10ms |
| Complex custom validation | <15ms | <50ms |
| Async custom validation | <25ms | <100ms |
| Validator registration | <5ms | <20ms |

## Related Documentation

* [Schema Registry](./schema_registry.md)
* [Validation Engine](./validation_engine.md)
* [API Reference](../interfaces/api.md)
* [Custom Validator Examples](../examples/advanced_example.md)


