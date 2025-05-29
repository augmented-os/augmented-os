import React, { useState, useEffect } from 'react';
import { TaskListPanel } from './TaskListPanel';
import { TaskDetailPanel } from './TaskDetailPanel';
import { fetchTaskInstances, fetchTaskDetails, TaskListItem, TaskDetails } from '../../../data/taskInstancesService';

export function TaskInbox() {
  const [tasks, setTasks] = useState<TaskListItem[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [taskDetails, setTaskDetails] = useState<TaskDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load tasks on component mount
  useEffect(() => {
    async function loadTasks() {
      try {
        setIsLoading(true);
        setError(null);
        const taskData = await fetchTaskInstances();
        setTasks(taskData);
        
        // Auto-select first task if available
        if (taskData.length > 0 && !selectedTaskId) {
          setSelectedTaskId(taskData[0].id);
        }
      } catch (err) {
        console.error('Error loading tasks:', err);
        setError('Failed to load tasks');
      } finally {
        setIsLoading(false);
      }
    }

    loadTasks();
  }, []);

  // Load task details when selection changes
  useEffect(() => {
    async function loadTaskDetails() {
      if (!selectedTaskId) {
        setTaskDetails(null);
        return;
      }

      try {
        const details = await fetchTaskDetails(selectedTaskId);
        setTaskDetails(details);
      } catch (err) {
        console.error('Error loading task details:', err);
        setError('Failed to load task details');
      }
    }

    loadTaskDetails();
  }, [selectedTaskId]);

  // Get the currently selected task
  const selectedTask = tasks.find(task => task.id === selectedTaskId) || null;

  if (isLoading) {
    return (
      <div className="flex h-full bg-gray-50 items-center justify-center">
        <div className="text-gray-500">Loading tasks...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full bg-gray-50 items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-gray-50">
      <div className="w-1/3">
        <TaskListPanel 
          tasks={tasks} 
          selectedTaskId={selectedTaskId}
          onTaskSelect={setSelectedTaskId}
        />
      </div>
      
      <div className="w-2/3">
        {selectedTask && taskDetails ? (
          <TaskDetailPanel 
            task={selectedTask} 
            taskDetails={taskDetails}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-500">
            <p>{selectedTask ? 'Loading task details...' : 'Select a task to view details'}</p>
          </div>
        )}
      </div>
    </div>
  );
} 