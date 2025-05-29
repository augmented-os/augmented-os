import { Task, FlagType } from '../types';
import { isFlagProblematic } from './styleHelpers';

/**
 * Filters tasks based on text search criteria
 * @param tasks Array of tasks to filter
 * @param searchText Text to search for in tasks
 * @returns Filtered array of tasks
 */
export function filterTasksBySearchText(tasks: Task[], searchText: string): Task[] {
  if (!searchText || searchText.trim() === '') {
    return tasks;
  }
  
  const normalizedSearchText = searchText.toLowerCase().trim();
  
  return tasks.filter(task => {
    // Search in title, company name, description, and flags
    return (
      task.title.toLowerCase().includes(normalizedSearchText) ||
      task.company.toLowerCase().includes(normalizedSearchText) ||
      task.description.toLowerCase().includes(normalizedSearchText) ||
      task.flags.some(flag => flag.toLowerCase().includes(normalizedSearchText))
    );
  });
}

/**
 * Filters tasks by priority
 * @param tasks Array of tasks to filter
 * @param priority Priority to filter by ('High', 'Medium', 'Low' or null for all)
 * @returns Filtered array of tasks
 */
export function filterTasksByPriority(tasks: Task[], priority: string | null): Task[] {
  if (!priority) {
    return tasks;
  }
  
  const normalizedPriority = priority.toLowerCase().trim();
  
  return tasks.filter(task => 
    task.priority.toLowerCase() === normalizedPriority
  );
}

/**
 * Filters tasks that have flags
 * @param tasks Array of tasks to filter
 * @returns Tasks that have at least one flag
 */
export function filterFlaggedTasks(tasks: Task[]): Task[] {
  return tasks.filter(task => task.flags.length > 0);
}

/**
 * Filters tasks by status
 * @param tasks Array of tasks to filter
 * @param status Status to filter by (or null for all)
 * @returns Filtered array of tasks
 */
export function filterTasksByStatus(tasks: Task[], status: string | null): Task[] {
  if (!status) {
    return tasks;
  }
  
  const normalizedStatus = status.toLowerCase().trim();
  
  return tasks.filter(task => 
    task.status.toLowerCase() === normalizedStatus
  );
}

/**
 * Filters tasks by due date range
 * @param tasks Array of tasks to filter
 * @param startDate Start date of range (ISO string or Date object)
 * @param endDate End date of range (ISO string or Date object)
 * @returns Filtered array of tasks
 */
export function filterTasksByDateRange(
  tasks: Task[],
  startDate: string | Date | null,
  endDate: string | Date | null
): Task[] {
  // If neither date is provided, return all tasks
  if (!startDate && !endDate) {
    return tasks;
  }
  
  // Convert string dates to Date objects
  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;
  
  return tasks.filter(task => {
    const taskDate = new Date(task.dueDate);
    
    // Check if the date is valid
    if (isNaN(taskDate.getTime())) {
      return false;
    }
    
    // Check if task date is within range
    if (start && end) {
      return taskDate >= start && taskDate <= end;
    } else if (start) {
      return taskDate >= start;
    } else if (end) {
      return taskDate <= end;
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
  tasks: Task[], 
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
): Task[] {
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