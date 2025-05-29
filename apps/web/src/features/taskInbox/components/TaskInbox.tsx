import React, { useState } from 'react';
import { TaskListPanel } from './TaskListPanel';
import { TaskDetailPanel } from './TaskDetailPanel';
import { sampleTasks, sampleTaskDetails } from '../testdata';

export function TaskInbox() {
  const [tasks] = useState(sampleTasks);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(
    tasks.length > 0 ? tasks[0].id : null
  );
  
  // Get the currently selected task
  const selectedTask = tasks.find(task => task.id === selectedTaskId) || null;

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
        {selectedTask ? (
          <TaskDetailPanel 
            task={selectedTask} 
            taskDetails={sampleTaskDetails}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-500">
            <p>Select a task to view details</p>
          </div>
        )}
      </div>
    </div>
  );
} 