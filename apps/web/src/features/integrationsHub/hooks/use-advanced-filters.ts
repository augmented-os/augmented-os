import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { ConnectionStatus, IntegrationFilterOptions } from '../types';

export interface AdvancedFilterOptions extends IntegrationFilterOptions {
  usage?: 'high' | 'medium' | 'low';
  updatedWithin?: '24h' | '7d' | '30d' | '90d';
}

interface FilterPreset {
  id: string;
  name: string;
  filters: AdvancedFilterOptions;
}

export function useAdvancedFilters(initial: AdvancedFilterOptions = {}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<AdvancedFilterOptions>(initial);
  const [presets, setPresets] = useState<FilterPreset[]>(() => {
    const stored = localStorage.getItem('advancedFilterPresets');
    return stored ? JSON.parse(stored) as FilterPreset[] : [];
  });

  // Parse filters from URL on mount
  useEffect(() => {
    const fromUrl: AdvancedFilterOptions = {};
    const status = searchParams.get('status');
    if (status) fromUrl.status = status.split(',') as ConnectionStatus[];
    const types = searchParams.get('systemTypes');
    if (types) fromUrl.integrationTypes = types.split(',');
    const usage = searchParams.get('usage');
    if (usage) fromUrl.usage = usage as any;
    const updated = searchParams.get('updatedWithin');
    if (updated) fromUrl.updatedWithin = updated as any;
    setFilters(prev => ({ ...prev, ...fromUrl }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync filters to URL
  useEffect(() => {
    const params: Record<string, string> = {};
    if (filters.status?.length) params.status = filters.status.join(',');
    if (filters.integrationTypes?.length) params.systemTypes = filters.integrationTypes.join(',');
    if (filters.usage) params.usage = filters.usage;
    if (filters.updatedWithin) params.updatedWithin = filters.updatedWithin;
    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  const updateFilter = useCallback(
    (key: keyof AdvancedFilterOptions, value: any) => {
      setFilters(prev => ({ ...prev, [key]: value }));
    },
    []
  );

  const savePreset = useCallback(
    (name: string) => {
      const id = uuidv4();
      const newPreset = { id, name, filters };
      const next = [...presets, newPreset];
      setPresets(next);
      localStorage.setItem('advancedFilterPresets', JSON.stringify(next));
    },
    [filters, presets]
  );

  return { filters, updateFilter, presets, savePreset, setFilters };
}

export default useAdvancedFilters;
