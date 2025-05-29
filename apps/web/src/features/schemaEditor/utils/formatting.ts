/**
 * Formatting utilities for schema editor
 */

/**
 * Formats a snake_case table name into Title Case for display
 * Example: "rental_detail_categories" -> "Rental Detail Categories"
 * 
 * @param name - The raw table name in snake_case
 * @returns Formatted name in Title Case
 */
export function formatTableNameForDisplay(name: string): string {
  if (!name) return '';
  
  return name
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Formats a snake_case column name into Title Case for display
 * Example: "first_name" -> "First Name"
 * 
 * @param name - The raw column name in snake_case
 * @returns Formatted name in Title Case
 */
export function formatColumnNameForDisplay(name: string): string {
  if (!name) return '';
  
  return name
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Generic formatter for snake_case to Title Case
 * Can be used for tables, columns, or any other identifiers
 * 
 * @param name - The raw identifier in snake_case
 * @returns Formatted name in Title Case
 */
export function formatIdentifierForDisplay(name: string): string {
  if (!name) return '';
  
  return name
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
} 