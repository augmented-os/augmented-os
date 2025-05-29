import React from 'react';
import { TaskListItem as TaskData } from '../../../data/taskInstancesService';

interface TaskListItemProps {
  task: TaskData;
  isSelected: boolean;
  onSelect: () => void;
}

export function TaskListItem({ task, isSelected, onSelect }: TaskListItemProps) {
  const getPriorityClass = (priority: string) => {
    switch(priority.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100';
    }
  };
  
  return (
    <div 
      className={`p-4 cursor-pointer hover:bg-gray-50 ${isSelected ? 'bg-blue-50 border-l-4 border-blue-500' : 'border-l-4 border-transparent'}`}
      onClick={onSelect}
    >
      <div className="flex justify-between items-start">
        <h3 className="font-medium text-gray-900">{task.title}</h3>
        <span className={`text-xs px-2 py-1 rounded-full ${getPriorityClass(task.priority)}`}>
          {task.priority}
        </span>
      </div>
      <p className="text-sm text-gray-500 mt-1">{task.company}</p>
    </div>
  );
} 