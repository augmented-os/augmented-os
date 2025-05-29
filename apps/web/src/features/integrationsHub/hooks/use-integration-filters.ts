import { useState, useCallback, useMemo } from 'react';
import { IntegrationFilterOptions, ConnectionStatus } from '../types';

type FilterPreset = {
  id: string;
  name: string;
  filters: IntegrationFilterOptions;
};

const defaultPresets: FilterPreset[] = [
  {
    id: 'all',
    name: 'All Integrations',
    filters: {}
  },
  {
    id: 'connected',
    name: 'Connected',
    filters: {
      status: [ConnectionStatus.ACTIVE]
    }
  },
  {
    id: 'error',
    name: 'Error States',
    filters: {
      status: [ConnectionStatus.ERROR]
    }
  },
  {
    id: 'setup',
    name: 'Needs Setup',
    filters: {
      status: [ConnectionStatus.INACTIVE]
    }
  }
];

export function useIntegrationFilters(
  initialFilters: IntegrationFilterOptions = {},
  customPresets: FilterPreset[] = []
) {
  const [activeFilters, setActiveFilters] = useState<IntegrationFilterOptions>(initialFilters);
  const [activePresetId, setActivePresetId] = useState<string | null>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Combine default and custom presets
  const allPresets = useMemo(() => {
    return [...defaultPresets, ...customPresets];
  }, [customPresets]);

  // Apply a preset filter
  const applyPreset = useCallback((presetId: string) => {
    const preset = allPresets.find(p => p.id === presetId);
    if (preset) {
      setActiveFilters(preset.filters);
      setActivePresetId(presetId);
      
      // If preset doesn't include search but we have an active search term,
      // preserve it in the filters
      if (!preset.filters.searchTerm && searchTerm) {
        setActiveFilters(prev => ({ ...prev, searchTerm }));
      } else if (preset.filters.searchTerm) {
        // Update our search term state to match the preset
        setSearchTerm(preset.filters.searchTerm || '');
      }
    }
  }, [allPresets, searchTerm]);

  // Update individual filter properties
  const updateFilter = useCallback((filterKey: keyof IntegrationFilterOptions, value: any) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev, [filterKey]: value };
      
      // If this isn't coming from a search term update, but it changes the filters,
      // then we're no longer on a preset
      if (filterKey !== 'searchTerm') {
        setActivePresetId(null);
      }
      
      return newFilters;
    });
  }, []);

  // Special handler for search term to keep the local state in sync
  const updateSearchTerm = useCallback((term: string) => {
    setSearchTerm(term);
    updateFilter('searchTerm', term || undefined); // Don't pass empty strings to the filter
  }, [updateFilter]);

  // Reset all filters
  const resetFilters = useCallback(() => {
    setActiveFilters({});
    setActivePresetId('all');
    setSearchTerm('');
  }, []);

  // Check if current filters match a preset
  const determineActivePreset = useCallback(() => {
    // Simple check: do the current filters match any preset exactly?
    const matchedPreset = allPresets.find(preset => {
      // Shallow comparison of filter objects
      const presetKeys = Object.keys(preset.filters);
      const activeKeys = Object.keys(activeFilters);
      
      if (presetKeys.length !== activeKeys.length) {
        return false;
      }
      
      // Special handling for search term: if the only difference is search term, it's still the preset
      const activeFiltersCopy = { ...activeFilters };
      if (searchTerm && !preset.filters.searchTerm) {
        delete activeFiltersCopy.searchTerm;
      }
      
      // Check if all other keys match
      return presetKeys.every(key => {
        const k = key as keyof IntegrationFilterOptions;
        return JSON.stringify(preset.filters[k]) === JSON.stringify(activeFiltersCopy[k]);
      });
    });
    
    return matchedPreset?.id || null;
  }, [activeFilters, allPresets, searchTerm]);

  // Update active preset when filters change
  const currentPresetId = useMemo(() => {
    if (activePresetId === null) {
      // Try to determine if current filters match a preset
      return determineActivePreset();
    }
    return activePresetId;
  }, [activePresetId, determineActivePreset]);

  return {
    filters: activeFilters,
    presets: allPresets,
    activePresetId: currentPresetId,
    searchTerm,
    applyPreset,
    updateFilter,
    updateSearchTerm,
    resetFilters
  };
} 