import React from 'react';
import { TaskInbox } from '@/features/taskInbox';

export default function TaskInboxPage() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-hidden">
        <TaskInbox />
      </div>
    </div>
  );
} 