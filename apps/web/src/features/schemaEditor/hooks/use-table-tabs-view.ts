import { useState, useCallback } from 'react';

export type TabType = 'fields' | 'relationships' | 'data';

export function useTableTabsView() {
  const [activeTab, setActiveTab] = useState<TabType>('fields');

  const switchTab = useCallback((tab: TabType) => {
    setActiveTab(tab);
  }, []);

  return {
    activeTab,
    switchTab,
  };
} 