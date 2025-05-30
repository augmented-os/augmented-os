import { FlagType, TableDataItem } from '../types';

/**
 * Filter tasks by type (universal function)
 */
export function filterByType(items: TableDataItem[], type: string): TableDataItem[] {
  if (!type || type === 'all') return items;
  return items.filter(item => item.type === type);
}

/**
 * Filter tasks by priority (universal function)
 */
export function filterByPriority(items: TableDataItem[], priority: string): TableDataItem[] {
  if (!priority || priority === 'all') return items;
  return items.filter(item => item.priority === priority);
}

/**
 * Filter tasks by status (universal function)
 */
export function filterByStatus(items: TableDataItem[], status: string): TableDataItem[] {
  if (!status || status === 'all') return items;
  return items.filter(item => item.status === status);
}

/**
 * Filter tasks by flags (universal function)
 */
export function filterByFlags(items: TableDataItem[], flags: string[]): TableDataItem[] {
  if (!flags || flags.length === 0) return items;
  return items.filter(item => {
    const itemFlags = Array.isArray(item.flags) ? item.flags : [];
    return flags.some(flag => itemFlags.includes(flag));
  });
}

/**
 * Filter tasks by search text (universal function)
 * @param tasks Array of task objects
 * @param searchText Search string
 * @returns Filtered array of tasks
 */
export function filterTasksBySearchText(tasks: TableDataItem[], searchText: string): TableDataItem[] {
  if (!searchText || searchText.trim() === '') {
    return tasks;
  }
  
  const lowercaseSearchText = searchText.toLowerCase();
  
  return tasks.filter(task => {
    const title = typeof task.title === 'string' ? task.title.toLowerCase() : '';
    const company = typeof task.company === 'string' ? task.company.toLowerCase() : '';
    const description = typeof task.description === 'string' ? task.description.toLowerCase() : '';
    const flags = Array.isArray(task.flags) ? task.flags.some(flag => 
      typeof flag === 'string' ? flag.toLowerCase().includes(lowercaseSearchText) : false
    ) : false;
    
    return title.includes(lowercaseSearchText) ||
           company.includes(lowercaseSearchText) ||
           description.includes(lowercaseSearchText) ||
           flags;
  });
}

/**
 * Filter tasks by priority (universal function)
 * @param tasks Array of task objects
 * @param priority Priority string ('High', 'Medium', 'Low')
 * @returns Filtered array of tasks
 */
export function filterTasksByPriority(tasks: TableDataItem[], priority: string | null): TableDataItem[] {
  if (!priority) {
    return tasks;
  }
  
  return tasks.filter(task => {
    return typeof task.priority === 'string' ? task.priority.toLowerCase() === priority.toLowerCase() : false;
  });
}

/**
 * Filter tasks to only return those with flags
 * @param tasks Array of task objects
 * @returns Tasks that have at least one flag
 */
export function filterFlaggedTasks(tasks: TableDataItem[]): TableDataItem[] {
  return tasks.filter(task => Array.isArray(task.flags) && task.flags.length > 0);
}

/**
 * Filter tasks by status (universal function)
 * @param tasks Array of task objects
 * @param status Status string (e.g., 'in-progress', 'completed', 'pending')
 * @returns Filtered array of tasks
 */
export function filterTasksByStatus(tasks: TableDataItem[], status: string | null): TableDataItem[] {
  if (!status) {
    return tasks;
  }
  
  return tasks.filter(task => {
    return typeof task.status === 'string' ? task.status.toLowerCase() === status.toLowerCase() : false;
  });
}

/**
 * Filter tasks by date range (universal function)
 * @param tasks Array of task objects
 * @param startDate Start date for filtering
 * @param endDate End date for filtering
 * @returns Filtered array of tasks
 */
export function filterTasksByDateRange(
  tasks: TableDataItem[],
  startDate: string | Date | null,
  endDate: string | Date | null
): TableDataItem[] {
  // If neither date is provided, return all tasks
  if (!startDate && !endDate) {
    return tasks;
  }

  return tasks.filter(task => {
    if (typeof task.dueDate !== 'string' && !(task.dueDate instanceof Date)) {
      return false;
    }
    
    const taskDueDate = new Date(task.dueDate as string | Date);
    
    // Check if the date is valid
    if (isNaN(taskDueDate.getTime())) {
      return false;
    }

    // Check start date constraint
    if (startDate) {
      const start = new Date(startDate);
      if (taskDueDate < start) {
        return false;
      }
    }

    // Check end date constraint
    if (endDate) {
      const end = new Date(endDate);
      if (taskDueDate > end) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Combines multiple filter functions to filter tasks
 * @param tasks Array of tasks to filter
 * @param filters Object containing filter criteria
 * @returns Filtered array of tasks
 */
export function filterTasks(
  tasks: TableDataItem[], 
  filters: {
    searchText?: string;
    priority?: string | null;
    status?: string | null;
    flagged?: boolean;
    dateRange?: {
      start: string | Date | null;
      end: string | Date | null;
    } | null;
  }
): TableDataItem[] {
  let filteredTasks = [...tasks];
  
  // Apply search text filter
  if (filters.searchText) {
    filteredTasks = filterTasksBySearchText(filteredTasks, filters.searchText);
  }
  
  // Apply priority filter
  if (filters.priority) {
    filteredTasks = filterTasksByPriority(filteredTasks, filters.priority);
  }
  
  // Apply status filter
  if (filters.status) {
    filteredTasks = filterTasksByStatus(filteredTasks, filters.status);
  }
  
  // Apply flagged filter
  if (filters.flagged) {
    filteredTasks = filterFlaggedTasks(filteredTasks);
  }
  
  // Apply date range filter
  if (filters.dateRange) {
    filteredTasks = filterTasksByDateRange(
      filteredTasks,
      filters.dateRange.start,
      filters.dateRange.end
    );
  }
  
  return filteredTasks;
} 
