import React from 'react';
import { Filter, Link2, FileSpreadsheet } from 'lucide-react';
import { TabType } from '@/features/schemaEditor/hooks/use-table-tabs-view'; // Assuming path

interface TabNavigatorProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
  { id: 'fields', label: 'Fields', icon: <Filter className="w-4 h-4 mr-1.5" /> },
  { id: 'relationships', label: 'Relationships', icon: <Link2 className="w-4 h-4 mr-1.5" /> },
  { id: 'data', label: 'Data', icon: <FileSpreadsheet className="w-4 h-4 mr-1.5" /> },
];

export function TabNavigator({ activeTab, onTabChange }: TabNavigatorProps) {
  return (
    <div className="border-b border-gray-200 w-full">
      <nav 
        className="flex"
        aria-label="Tabs"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              whitespace-nowrap py-3 px-6
              font-medium text-sm flex items-center
              transition-colors duration-150 ease-in-out
              border-b-2 relative
              ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }
            `}
            aria-current={activeTab === tab.id ? 'page' : undefined}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
} 