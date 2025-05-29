import { Task } from '../types';

/**
 * Formats the flags count with proper pluralization
 * @param flags Array of flag strings
 * @returns Formatted string with count and pluralized "flag" word
 */
export function formatFlagsCount(flags: string[]): string {
  const count = flags.length;
  return `${count} flag${count !== 1 ? 's' : ''}`;
}

/**
 * Formats a date string for consistent display
 * @param dateString Date string in any parseable format
 * @returns Formatted date string
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return dateString;
    }
    
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  } catch (e) {
    // If parsing fails, return the original string
    return dateString;
  }
}

/**
 * Creates a summary string for a task
 * @param task The task object
 * @returns A summary string with key information
 */
export function createTaskSummary(task: Task): string {
  return `${task.company} • Due ${formatDate(task.dueDate)}`;
}

/**
 * Formats non-standard terms count for display
 * @param flaggedTermsCount Number of flagged terms
 * @returns Formatted string describing the non-standard terms
 */
export function formatNonStandardTermsMessage(flaggedTermsCount: number): string {
  if (flaggedTermsCount === 0) {
    return 'All terms are standard.';
  }
  
  return `This term sheet contains ${flaggedTermsCount} non-standard term${flaggedTermsCount !== 1 ? 's' : ''} that require${flaggedTermsCount === 1 ? 's' : ''} attention.`;
}

/**
 * Truncates text if it exceeds a certain length
 * @param text Text to truncate
 * @param maxLength Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 */
export function truncateText(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) {
    return text;
  }
  
  return `${text.substring(0, maxLength).trim()}...`;
}

/**
 * Formats currency values for display
 * @param value The value to format as currency
 * @returns Formatted currency string
 */
export function formatCurrency(value: string | number): string {
  // If the value already has a currency symbol, return it as is
  if (typeof value === 'string' && (value.startsWith('$') || value.startsWith('€') || value.startsWith('£'))) {
    return value;
  }
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  // Check if it's a valid number
  if (isNaN(numValue)) {
    return typeof value === 'string' ? value : String(value);
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(numValue);
} 