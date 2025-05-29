import { Task, FlagType } from '../types';

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
 * Flag styling configurations for different business contexts
 */
export const FLAG_STYLES = {
  default: {
    error: 'bg-red-50',
    warning: 'bg-orange-50',
    success: 'bg-green-50',
    info: 'bg-blue-50',
    pending: 'bg-gray-50'
  },
  compliance: {
    error: 'bg-red-50',
    warning: 'bg-amber-50',
    success: 'bg-green-50',
    info: 'bg-cyan-50',
    pending: 'bg-neutral-50'
  }
} as const;

export const FLAG_BADGE_CONFIGS = {
  default: {
    error: { class: 'bg-red-100 text-red-800', text: 'Critical' },
    warning: { class: 'bg-orange-100 text-orange-800', text: 'Warning' },
    success: { class: 'bg-green-100 text-green-800', text: 'Approved' },
    info: { class: 'bg-blue-100 text-blue-800', text: 'Info' },
    pending: { class: 'bg-gray-100 text-gray-800', text: 'Pending' }
  },
  compliance: {
    error: { class: 'bg-red-100 text-red-900', text: 'Violation' },
    warning: { class: 'bg-amber-100 text-amber-900', text: 'Non-standard' },
    success: { class: 'bg-green-100 text-green-900', text: 'Compliant' },
    info: { class: 'bg-cyan-100 text-cyan-900', text: 'Reference' },
    pending: { class: 'bg-neutral-100 text-neutral-900', text: 'Under Review' }
  }
} as const;

/**
 * Returns the CSS class for a term based on its flag type
 * @param flag The semantic flag type
 * @param configName The flag configuration to use
 * @returns CSS class string for the term
 */
export function getTermFlagClass(flag: FlagType, configName: keyof typeof FLAG_STYLES = 'default'): string {
  if (!flag) return '';
  return FLAG_STYLES[configName][flag] || '';
}

/**
 * Returns the CSS class for a term status badge
 * @param flag The semantic flag type
 * @param configName The flag configuration to use
 * @returns CSS class string for the status badge
 */
export function getTermStatusBadgeClass(flag: FlagType, configName: keyof typeof FLAG_BADGE_CONFIGS = 'default'): string {
  if (!flag) return 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800';
  const config = FLAG_BADGE_CONFIGS[configName][flag];
  return `px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${config?.class || 'bg-gray-100 text-gray-800'}`;
}

/**
 * Returns the text for a term status badge
 * @param flag The semantic flag type
 * @param configName The flag configuration to use
 * @returns Text string for the status badge
 */
export function getTermStatusBadgeText(flag: FlagType, configName: keyof typeof FLAG_BADGE_CONFIGS = 'default'): string {
  if (!flag) return 'Standard';
  const config = FLAG_BADGE_CONFIGS[configName][flag];
  return config?.text || 'Unknown';
}

/**
 * Checks if a flag indicates a problematic state
 * @param flag The semantic flag type
 * @returns True if the flag indicates an issue that needs attention
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