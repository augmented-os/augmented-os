# Validation Service

## Overview

The Validation Service provides a centralized system for validating data against schemas throughout the application. It ensures data integrity, consistency, and security by enforcing validation rules on inputs, outputs, and stored data.

## Responsibilities

* Validating data against JSON schemas
* Providing consistent validation across all system components
* Supporting custom validation rules and functions
* Generating detailed validation error messages
* Caching and optimizing schema validation
* Enforcing data type safety and constraints
* Supporting schema versioning and evolution

## Architecture

The Validation Service is designed as a lightweight, stateless service that can be embedded within other components or used as a standalone service. It uses a schema registry for centralized schema management and provides both synchronous and asynchronous validation modes.

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  System         │────▶│  Validation     │────▶│  Schema         │
│  Components     │     │  Service        │     │  Registry       │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## Key Components

### Schema Registry

Responsible for:

* Storing and managing JSON schemas
* Providing schema versioning
* Supporting schema references and composition
* Caching schemas for performance
* Validating schema syntax and structure

### Validation Engine

Handles validation by:

* Executing schema validation against data
* Supporting JSON Schema standards
* Implementing custom validation keywords
* Optimizing validation performance
* Providing detailed error reporting

### Custom Validator Registry

Manages custom validators by:

* Registering custom validation functions
* Supporting complex validation logic
* Providing context-aware validation
* Enabling domain-specific validation rules
* Supporting asynchronous validation

### Error Formatter

Improves error handling by:

* Formatting validation errors for readability
* Localizing error messages
* Providing context-specific error details
* Supporting different output formats
* Enabling custom error templates

## Interfaces

### Input Interfaces

* **API Endpoints**: Exposes REST endpoints for validation
* **Service Interface**: Provides programmatic validation for other services
* **Schema Management API**: Allows schema registration and updates
* **Event Listeners**: Receives validation requests via events

### Output Interfaces

* **Validation Results**: Returns validation results to callers
* **Event Emitter**: Publishes validation events
* **Metrics System**: Reports validation performance and errors
* **Schema Registry**: Updates and retrieves schemas

## Data Model

The Validation Service primarily interacts with these data schemas:

* All system schemas for validation purposes
* [Schema Registry](../schemas/schema_registry.md): For schema management

## Operational Considerations

### Performance

The service optimizes performance by:

* Caching compiled schemas
* Using optimized validation algorithms
* Supporting partial validation for large documents
* Implementing batch validation
* Providing validation hints for faster validation

### Extensibility

Supports extension through:

* Custom validation keywords
* Pluggable validation engines
* Custom error formatters
* Schema transformation pipelines
* Integration with external validation systems

### Monitoring

Key metrics to monitor:

* Validation throughput and latency
* Schema compilation time
* Cache hit/miss rates
* Error rates by schema and endpoint
* Schema size and complexity

## Configuration

The service can be configured with:

* Default validation options
* Schema caching policies
* Error formatting templates
* Performance optimization levels
* Logging levels and destinations

## Security

Security considerations:

* Preventing schema injection attacks
* Limiting schema complexity to prevent DoS
* Validating schemas before registration
* Sanitizing error messages
* Enforcing schema access controls

## Implementation Examples

### Validating Data Against a Schema

```typescript
// Example of how the service validates data against a schema
async function validateData(
  schemaId: string,
  data: any,
  options: ValidationOptions = {}
): Promise<ValidationResult> {
  try {
    // Get schema from registry
    const schema = await schemaRegistry.getSchema(schemaId);
    if (!schema) {
      throw new Error(`Schema not found: ${schemaId}`);
    }
    
    // Get or compile validator
    const validator = await validatorCache.getValidator(schemaId, schema);
    
    // Apply custom validation context if provided
    const context = options.context || {};
    
    // Perform validation
    const valid = await validator.validate(data, context);
    
    if (valid) {
      return {
        valid: true,
        data
      };
    } else {
      // Format errors
      const errors = errorFormatter.format(
        validator.errors,
        options.errorFormat || 'standard'
      );
      
      return {
        valid: false,
        errors
      };
    }
  } catch (error) {
    // Handle validation system errors
    logger.error('Validation error', {
      schemaId,
      error: error.message,
      stack: error.stack
    });
    
    return {
      valid: false,
      errors: [{
        code: 'VALIDATION_SYSTEM_ERROR',
        message: error.message,
        path: ''
      }]
    };
  }
}
```

### Registering a Custom Validator #TODO -  What’s a metaschema?!

```typescript
// Example of how to register a custom validator
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
    metaSchema: options.metaSchema,
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

### Validating a Complex Object with References

```typescript
// Example of validating a complex object with references
async function validateComplexObject(
  rootSchemaId: string,
  data: any,
  options: ComplexValidationOptions = {}
): Promise<ComplexValidationResult> {
  // Start performance measurement
  const startTime = performance.now();
  
  // Create validation context
  const context = {
    rootData: data,
    currentPath: '',
    validatedReferences: new Set(),
    ...options.context
  };
  
  try {
    // Get root schema
    const rootSchema = await schemaRegistry.getSchema(rootSchemaId);
    if (!rootSchema) {
      throw new Error(`Root schema not found: ${rootSchemaId}`);
    }
    
    // Analyze schema for references
    const references = schemaAnalyzer.findReferences(rootSchema);
    
    // Pre-load referenced schemas
    await Promise.all(
      references.map(ref => schemaRegistry.getSchema(ref))
    );
    
    // Create validator with reference handling
    const validator = await validatorFactory.createWithReferences(
      rootSchemaId,
      rootSchema,
      references
    );
    
    // Perform validation
    const valid = await validator.validate(data, context);
    
    // Calculate performance metrics
    const duration = performance.now() - startTime;
    
    if (valid) {
      return {
        valid: true,
        data,
        meta: {
          schemaId: rootSchemaId,
          duration,
          referencesResolved: references.length
        }
      };
    } else {
      // Format and categorize errors
      const formattedErrors = errorFormatter.formatComplex(
        validator.errors,
        options.errorFormat || 'detailed'
      );
      
      // Group errors by path for better readability
      const groupedErrors = errorFormatter.groupByPath(formattedErrors);
      
      return {
        valid: false,
        errors: formattedErrors,
        groupedErrors,
        meta: {
          schemaId: rootSchemaId,
          duration,
          referencesResolved: references.length,
          errorCount: formattedErrors.length
        }
      };
    }
  } catch (error) {
    // Handle system errors
    logger.error('Complex validation error', {
      rootSchemaId,
      error: error.message,
      stack: error.stack
    });
    
    return {
      valid: false,
      errors: [{
        code: 'COMPLEX_VALIDATION_ERROR',
        message: error.message,
        path: ''
      }],
      meta: {
        schemaId: rootSchemaId,
        duration: performance.now() - startTime,
        error: true
      }
    };
  }
}
```

### Schema Evolution and Compatibility Checking

```typescript
// Example of checking schema compatibility during evolution
async function checkSchemaCompatibility(
  schemaId: string,
  newSchemaVersion: any,
  options: CompatibilityOptions = {}
): Promise<CompatibilityResult> {
  // Get current schema
  const currentSchema = await schemaRegistry.getLatestSchema(schemaId);
  if (!currentSchema) {
    // If no current schema exists, compatibility check passes
    return {
      compatible: true,
      changes: [{
        type: 'NEW_SCHEMA',
        description: 'Initial schema version'
      }]
    };
  }
  
  // Determine compatibility level
  const compatibilityLevel = options.level || 'BACKWARD';
  
  // Create compatibility checker
  const compatibilityChecker = compatibilityCheckerFactory.create(
    compatibilityLevel,
    options
  );
  
  try {
    // Perform compatibility check
    const result = await compatibilityChecker.check(
      currentSchema,
      newSchemaVersion
    );
    
    if (result.compatible) {
      // If compatible, analyze and categorize changes
      const changes = schemaChangeAnalyzer.analyzeChanges(
        currentSchema,
        newSchemaVersion
      );
      
      return {
        compatible: true,
        changes,
        level: compatibilityLevel
      };
    } else {
      // If incompatible, provide detailed information about incompatibilities
      return {
        compatible: false,
        incompatibilities: result.incompatibilities,
        level: compatibilityLevel,
        suggestions: compatibilityChecker.suggestFixes(
          result.incompatibilities
        )
      };
    }
  } catch (error) {
    // Handle compatibility checking errors
    logger.error('Schema compatibility check error', {
      schemaId,
      error: error.message,
      stack: error.stack
    });
    
    return {
      compatible: false,
      error: {
        message: error.message,
        code: 'COMPATIBILITY_CHECK_ERROR'
      },
      level: compatibilityLevel
    };
  }
}
```


