import { Task } from '../types';

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
 * Returns the CSS class for a term based on whether it's flagged or not
 * @param isFlagged Whether the term is flagged
 * @returns CSS class string for the term
 */
export function getTermFlagClass(isFlagged: boolean): string {
  return isFlagged
    ? 'bg-red-50'
    : '';
}

/**
 * Returns CSS classes for a task row based on its properties
 * @param task The task object
 * @returns CSS class string for the task row
 */
export function getTaskRowClass(task: Task, isSelected: boolean): string {
  const baseClass = 'p-4 cursor-pointer hover:bg-gray-50';
  
  if (isSelected) {
    return `${baseClass} bg-blue-50 border-l-4 border-blue-500`;
  }
  
  return baseClass;
}

/**
 * Returns the CSS class for a term status badge
 * @param isFlagged Whether the term is flagged
 * @returns CSS class string for the status badge
 */
export function getTermStatusBadgeClass(isFlagged: boolean): string {
  return isFlagged
    ? 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800'
    : 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800';
} 