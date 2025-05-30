import { FlagType, TableDataItem } from '../types';

/**
 * Check if a flag represents a problematic state
 */
export function isFlagProblematic(flag: FlagType): boolean {
  return flag === 'error' || flag === 'warning';
}

/**
 * Gets the priority level of a flag for sorting/filtering
 * @param flag The semantic flag type
 * @returns Numeric priority (higher = more urgent)
 */
export function getFlagPriority(flag: FlagType): number {
  switch (flag) {
    case 'error': return 4;
    case 'warning': return 3;
    case 'pending': return 2;
    case 'info': return 1;
    case 'success': return 0;
    default: return -1;
  }
}

/**
 * Returns the CSS class for a task priority level
 * @param priority The priority level (High, Medium, Low)
 * @returns CSS class string for the priority level
 */
export function getPriorityClass(priority: string): string {
  switch (priority.toLowerCase()) {
    case 'high':
      return 'bg-red-100 text-red-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'low':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

/**
 * Returns the CSS class for a task status
 * @param status The status of the task
 * @returns CSS class string for the status
 */
export function getStatusClass(status: string): string {
  switch (status.toLowerCase()) {
    case 'completed':
    case 'approved':
      return 'bg-green-100 text-green-800';
    case 'pending':
    case 'in progress':
      return 'bg-blue-100 text-blue-800';
    case 'rejected':
    case 'failed':
      return 'bg-red-100 text-red-800';
    case 'review':
    case 'needs review':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

/**
 * Returns CSS classes for a task row based on its properties
 * @param task The task object
 * @returns CSS class string for the task row
 */
export function getTaskRowClass(task: TableDataItem, isSelected: boolean): string {
  const baseClass = 'p-4 cursor-pointer hover:bg-gray-50';
  
  if (isSelected) {
    return `${baseClass} bg-blue-50 border-l-4 border-blue-500`;
  }
  
  return baseClass;
}

/**
 * Get CSS classes for row styling based on flag type
 */
export function getRowClassName(flag: FlagType): string {
  const baseClasses = 'border-b border-gray-200 last:border-b-0';
  
  switch (flag) {
    case 'error':
      return `${baseClasses} bg-red-50 border-red-200`;
    case 'warning':
      return `${baseClasses} bg-amber-50 border-amber-200`;
    case 'success':
      return `${baseClasses} bg-green-50 border-green-200`;
    case 'info':
      return `${baseClasses} bg-blue-50 border-blue-200`;
    case 'pending':
      return `${baseClasses} bg-gray-100 border-gray-300`;
    default:
      return baseClasses;
  }
}

/**
 * Get the most severe flag from task data (universal function)
 * This only looks at explicit flag arrays, no business logic conversion
 */
export function getMostSevereFlag(data: TableDataItem): FlagType {
  // Only check if data has explicit flags array
  if (Array.isArray(data.flags) && data.flags.length > 0) {
    const flags = data.flags as string[];
    if (flags.includes('error')) return 'error';
    if (flags.includes('warning')) return 'warning';
    if (flags.includes('pending')) return 'pending';
    if (flags.includes('info')) return 'info';
    if (flags.includes('success')) return 'success';
  }

  return null;
} 