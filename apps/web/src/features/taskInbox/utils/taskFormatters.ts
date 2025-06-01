import { FlagType, TableDataItem } from '../types';

/**
 * Format task priority for display (universal function)
 * @param priority Priority value from data
 * @returns Formatted priority string
 */
export function formatTaskPriority(priority: unknown): string {
  if (typeof priority === 'string') {
    return priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase();
  }
  return 'Medium'; // default
}

/**
 * Format task status for display (universal function)
 * @param status Status value from data
 * @returns Formatted status string
 */
export function formatTaskStatus(status: unknown): string {
  if (typeof status === 'string') {
    return status.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
  return 'Unknown';
}

/**
 * Format due date for display (universal function)
 * @param dueDate Due date value from data
 * @returns Formatted date string
 */
export function formatDueDate(dueDate: unknown): string {
  if (!dueDate) return 'No due date';
  
  try {
    const date = new Date(dueDate as string | Date);
    if (isNaN(date.getTime())) return 'Invalid date';
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return 'Invalid date';
  }
}

/**
 * Count problematic terms in data (universal function)
 * @param data Data containing terms or other nested structures
 * @returns Number of problematic items
 */
export function countProblematicTerms(data: TableDataItem): number {
  // Check if data has extractedTerms array
  if (Array.isArray(data.extractedTerms)) {
    const terms = data.extractedTerms as Array<Record<string, unknown>>;
    return terms.filter(term => {
      const status = term.status;
      return typeof status === 'string' && 
             (status === 'Non-standard' || status === 'Problematic' || status === 'Violation');
    }).length;
  }

  // Check if data has flags array
  if (Array.isArray(data.flags)) {
    const flags = data.flags as string[];
    return flags.filter(flag => flag === 'error' || flag === 'warning').length;
  }

  return 0;
}

/**
 * Get task summary for display (universal function)
 * @param data Task data
 * @returns Formatted summary object
 */
export function getTaskSummary(data: TableDataItem): {
  title: string;
  company: string;
  priority: string;
  status: string;
  dueDate: string;
  problematicCount: number;
} {
  return {
    title: typeof data.title === 'string' ? data.title : 'Untitled Task',
    company: typeof data.company === 'string' ? data.company : 'Unknown Company',
    priority: formatTaskPriority(data.priority),
    status: formatTaskStatus(data.status),
    dueDate: formatDueDate(data.dueDate),
    problematicCount: countProblematicTerms(data)
  };
}

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
export function createTaskSummary(task: TableDataItem): string {
  const company = typeof task.company === 'string' ? task.company : 'Unknown Company';
  const dueDate = formatDueDate(task.dueDate);
  return `${company} • Due ${dueDate}`;
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