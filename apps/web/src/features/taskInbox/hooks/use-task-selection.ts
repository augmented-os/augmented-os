import { useState, useMemo } from 'react';
import { Task, TaskDetail } from '../types';
import { sampleTasks, sampleTaskDetails } from '../testdata';

export function useTaskSelection() {
  // Currently selected task ID
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

  // Find the selected task from sample tasks
  const selectedTask = useMemo(() => {
    if (selectedTaskId === null) return null;
    return sampleTasks.find(task => task.id === selectedTaskId) || null;
  }, [selectedTaskId]);
  
  // Get task details for the selected task
  // In a real application, this would likely fetch from an API based on the ID
  const selectedTaskDetails = useMemo<TaskDetail | null>(() => {
    if (!selectedTask) return null;
    
    // For now, return the sample task details
    // In a real app, this could be an API call based on selectedTaskId
    return sampleTaskDetails;
  }, [selectedTask]);
  
  // Select a task by ID
  const selectTask = (taskId: number) => {
    setSelectedTaskId(taskId);
  };
  
  // Clear task selection
  const clearSelection = () => {
    setSelectedTaskId(null);
  };
  
  // Select the next task in the list
  const selectNextTask = () => {
    if (selectedTaskId === null) {
      // If no task is selected, select the first one
      if (sampleTasks.length > 0) {
        setSelectedTaskId(sampleTasks[0].id);
      }
      return;
    }
    
    const currentIndex = sampleTasks.findIndex(task => task.id === selectedTaskId);
    if (currentIndex < sampleTasks.length - 1) {
      setSelectedTaskId(sampleTasks[currentIndex + 1].id);
    }
  };
  
  // Select the previous task in the list
  const selectPreviousTask = () => {
    if (selectedTaskId === null) {
      // If no task is selected, select the last one
      if (sampleTasks.length > 0) {
        setSelectedTaskId(sampleTasks[sampleTasks.length - 1].id);
      }
      return;
    }
    
    const currentIndex = sampleTasks.findIndex(task => task.id === selectedTaskId);
    if (currentIndex > 0) {
      setSelectedTaskId(sampleTasks[currentIndex - 1].id);
    }
  };
  
  return {
    selectedTaskId,
    selectedTask,
    selectedTaskDetails,
    selectTask,
    clearSelection,
    selectNextTask,
    selectPreviousTask,
  };
} 