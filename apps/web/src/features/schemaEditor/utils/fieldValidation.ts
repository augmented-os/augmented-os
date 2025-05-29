import { SchemaColumn, SchemaColumnType } from '../types';

/**
 * Validates if a field name is a valid JavaScript identifier.
 * Allows letters, numbers, underscore, and dollar sign, but cannot start with a number.
 *
 * @param name The field name to validate.
 * @returns True if the name is valid, false otherwise.
 */
export function isValidFieldName(name: string): boolean {
  if (!name || typeof name !== 'string') {
    return false;
  }
  // Basic check: Not empty, starts with letter/$/_, contains only valid chars
  return /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(name);
}

/**
 * Validates if a given value is a valid SchemaColumnType enum member.
 *
 * @param type The type value to validate.
 * @returns True if the type is valid, false otherwise.
 */
export function isValidFieldType(type: unknown): type is SchemaColumnType {
  return typeof type === 'string' && Object.values(SchemaColumnType).includes(type as SchemaColumnType);
}

/**
 * Validates the constraints for a given schema column definition.
 * For now, it checks basic requirements like required fields and reference presence.
 *
 * @param column The schema column definition to validate.
 * @param tables Optional list of existing table names for reference validation.
 * @returns An array of validation error messages, or an empty array if valid.
 */
export function validateFieldConstraints(column: Partial<SchemaColumn>, tables?: string[]): string[] {
  const errors: string[] = [];

  if (!column.name || !isValidFieldName(column.name)) {
    errors.push('Field name is missing or invalid.');
  }

  if (!column.type || !isValidFieldType(column.type)) {
    errors.push('Field type is missing or invalid.');
  }

  // Only proceed with type-specific checks if type is valid
  if (column.type && isValidFieldType(column.type)) {
    // Check if ID type is correctly marked as primary (example constraint)
    // Note: Business logic for primary keys might be more complex
    if (column.type === SchemaColumnType.ID && !column.isPrimary) {
      // This might be a soft warning or a hard error depending on requirements
      // errors.push('ID fields should typically be marked as primary keys.');
    } else if (column.type !== SchemaColumnType.ID && column.isPrimary) {
      errors.push('Only ID fields can be marked as primary keys.');
    }

    // Check reference constraint
    if (column.type === SchemaColumnType.REFERENCE) {
      if (!column.reference) {
        errors.push('Reference fields must specify the table they reference.');
      } else if (tables && !tables.includes(column.reference)) {
        errors.push(`Referenced table "${column.reference}" does not exist.`);
      }
    } else if (column.reference) {
      errors.push('Reference table should only be specified for Reference fields.');
    }
  }

  // Check required flag consistency (basic check)
  if (typeof column.required !== 'boolean') {
    // Defaulting or requiring explicit setting might be needed
    // errors.push('Required flag must be set (true/false).');
  }


  return errors;
} 