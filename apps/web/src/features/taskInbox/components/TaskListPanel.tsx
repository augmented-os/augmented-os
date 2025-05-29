import React from 'react';
import { TaskListItem as TaskItem } from './TaskListItem';
import { TaskListItem as TaskData } from '../../../data/taskInstancesService';

interface TaskListPanelProps {
  tasks: TaskData[];
  selectedTaskId: string | null;
  onTaskSelect: (taskId: string) => void;
}

export function TaskListPanel({ tasks, selectedTaskId, onTaskSelect }: TaskListPanelProps) {
  return (
    <div className="w-full h-full border-r border-gray-200 bg-white overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-gray-800">Tasks Inbox</h2>
          <div className="relative">
            <select 
              className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-1.5 text-sm font-medium text-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              defaultValue="all"
            >
              <option value="all">All Workflows ({tasks.length})</option>
              <option value="term-sheets">Term Sheets</option>
              <option value="invoices">Invoices</option>
              <option value="reports">Reports</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2 mb-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search tasks..."
              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filter
          </button>
        </div>
        
        <div className="flex space-x-2">
          <button className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full hover:bg-blue-200">
            All
          </button>
          <button className="px-3 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full hover:bg-gray-200">
            High Priority
          </button>
          <button className="px-3 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full hover:bg-gray-200">
            Flagged
          </button>
        </div>
      </div>
      
      <div className="divide-y divide-gray-200">
        {tasks.map((task) => (
          <TaskItem 
            key={task.id}
            task={task}
            isSelected={task.id === selectedTaskId}
            onSelect={() => onTaskSelect(task.id)}
          />
        ))}
      </div>
    </div>
  );
} 