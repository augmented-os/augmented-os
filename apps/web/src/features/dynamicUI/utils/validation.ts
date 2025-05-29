import type { FormField, ValidationRule, ValidationRuleReference } from '../types/schemas';

/**
 * Validates an entire form against its field definitions and validation rules.
 * Returns a record of field keys to error messages for any validation failures.
 */
export const validateForm = (
  data: Record<string, unknown>, 
  fields: FormField[],
  validationRulesLookup?: Record<string, ValidationRuleReference>
): Record<string, string> => {
  const errors: Record<string, string> = {};

  fields.forEach(field => {
    const value = data[field.fieldKey];
    const fieldErrors = validateField(value, field, validationRulesLookup);
    
    if (fieldErrors.length > 0) {
      errors[field.fieldKey] = fieldErrors[0]; // Show first error
    }
  });

  return errors;
};

/**
 * Validates a single field value against its validation rules.
 * Supports both inline ValidationRule objects and string references to ValidationRuleReference.
 * Returns an array of error messages for any validation failures.
 */
export const validateField = (
  value: unknown, 
  field: FormField, 
  validationRulesLookup?: Record<string, ValidationRuleReference>
): string[] => {
  const errors: string[] = [];
  
  if (!field.validationRules) return errors;

  field.validationRules.forEach(rule => {
    let validationRule: ValidationRule;
    
    if (typeof rule === 'string') {
      // Rule is a reference to validation_rules table
      const ruleRef = validationRulesLookup?.[rule];
      if (ruleRef) {
        validationRule = {
          type: ruleRef.type as ValidationRule['type'],
          value: ruleRef.value,
          message: ruleRef.errorMessage
        };
      } else {
        console.warn(`Validation rule not found: ${rule}`);
        return;
      }
    } else {
      // Rule is inline
      validationRule = rule;
    }
    
    const error = validateRule(value, validationRule, field.label);
    if (error) {
      errors.push(error);
    }
  });

  return errors;
};

/**
 * Validates a single value against a specific validation rule.
 * Returns an error message if validation fails, or null if validation passes.
 */
const validateRule = (value: unknown, rule: ValidationRule, fieldLabel: string): string | null => {
  switch (rule.type) {
    case 'required': {
      if (!value || value === '') {
        return rule.message || `${fieldLabel} is required`;
      }
      break;
    }
      
    case 'minLength': {
      if (value && typeof value === 'string' && value.length < (rule.value as number)) {
        return rule.message || `${fieldLabel} must be at least ${rule.value} characters`;
      }
      break;
    }
      
    case 'maxLength': {
      if (value && typeof value === 'string' && value.length > (rule.value as number)) {
        return rule.message || `${fieldLabel} must be no more than ${rule.value} characters`;
      }
      break;
    }
      
    case 'email': {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value && typeof value === 'string' && !emailRegex.test(value)) {
        return rule.message || `${fieldLabel} must be a valid email address`;
      }
      break;
    }
      
    case 'pattern': {
      if (value && typeof value === 'string' && rule.value) {
        const regex = new RegExp(rule.value as string);
        if (!regex.test(value)) {
          return rule.message || `${fieldLabel} format is invalid`;
        }
      }
      break;
    }
      
    case 'min': {
      if (value !== undefined && Number(value) < (rule.value as number)) {
        return rule.message || `${fieldLabel} must be at least ${rule.value}`;
      }
      break;
    }
      
    case 'max': {
      if (value !== undefined && Number(value) > (rule.value as number)) {
        return rule.message || `${fieldLabel} must be no more than ${rule.value}`;
      }
      break;
    }
  }
  
  return null;
}; 