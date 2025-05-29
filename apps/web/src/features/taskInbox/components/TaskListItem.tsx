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
  
  // Debug logging to understand selection state
  console.log(`TaskListItem ${task.title}:`, {
    id: task.id,
    isSelected,
    willHaveBorder: isSelected
  });
  
  // Use only inline styles for border/background to avoid CSS conflicts
  const itemStyle = {
    padding: '1rem',
    cursor: 'pointer',
    borderLeft: isSelected ? '4px solid #3b82f6' : '4px solid transparent',
    backgroundColor: isSelected ? '#eff6ff' : 'transparent',
    transition: 'all 0.2s ease'
  };
  
  return (
    <div 
      className="hover:bg-gray-50"
      style={itemStyle}
      data-selected={isSelected}
      data-task-id={task.id}
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