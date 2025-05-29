import { useState, useMemo } from 'react';
import { Task } from '../types';
import { sampleTasks } from '../testdata';

export type TaskFilter = {
  search: string;
  priority: 'All' | 'High' | 'Medium' | 'Low';
  hasFlagsOnly: boolean;
};

export function useTaskList() {
  const [filters, setFilters] = useState<TaskFilter>({
    search: '',
    priority: 'All',
    hasFlagsOnly: false,
  });

  // Memoize the filtered tasks list
  const filteredTasks = useMemo(() => {
    return sampleTasks.filter((task) => {
      // Search filter
      if (
        filters.search &&
        !task.title.toLowerCase().includes(filters.search.toLowerCase()) &&
        !task.company.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false;
      }

      // Priority filter
      if (filters.priority !== 'All' && task.priority !== filters.priority) {
        return false;
      }

      // Flags filter
      if (filters.hasFlagsOnly && task.flags.length === 0) {
        return false;
      }

      return true;
    });
  }, [filters]);

  // Update search text
  const updateSearch = (search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  };

  // Update priority filter
  const updatePriorityFilter = (priority: TaskFilter['priority']) => {
    setFilters((prev) => ({ ...prev, priority }));
  };

  // Toggle flagged tasks filter
  const toggleFlaggedFilter = () => {
    setFilters((prev) => ({ ...prev, hasFlagsOnly: !prev.hasFlagsOnly }));
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      search: '',
      priority: 'All',
      hasFlagsOnly: false,
    });
  };

  return {
    tasks: filteredTasks,
    filters,
    updateSearch,
    updatePriorityFilter,
    toggleFlaggedFilter,
    resetFilters,
  };
} 