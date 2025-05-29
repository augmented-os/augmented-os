import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ConnectionStatus } from '../../types';
import { AdvancedFilterOptions } from '../../hooks/use-advanced-filters';

interface AdvancedFilterPanelProps {
  filters: AdvancedFilterOptions;
  availableSystemTypes: string[];
  onUpdate: (key: keyof AdvancedFilterOptions, value: any) => void;
  onSavePreset?: (name: string) => void;
}

const usageOptions = [
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

const updatedOptions = [
  { value: '24h', label: 'Last 24 hours' },
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
];

export const AdvancedFilterPanel: React.FC<AdvancedFilterPanelProps> = ({
  filters,
  availableSystemTypes,
  onUpdate,
  onSavePreset,
}) => {
  const [presetName, setPresetName] = useState('');

  const toggleStatus = (status: ConnectionStatus) => {
    const current = filters.status || [];
    if (current.includes(status)) {
      onUpdate('status', current.filter(s => s !== status));
    } else {
      onUpdate('status', [...current, status]);
    }
  };

  const toggleSystemType = (type: string) => {
    const current = filters.integrationTypes || [];
    if (current.includes(type)) {
      onUpdate('integrationTypes', current.filter(t => t !== type));
    } else {
      onUpdate('integrationTypes', [...current, type]);
    }
  };

  const handleSavePreset = () => {
    if (onSavePreset && presetName.trim()) {
      onSavePreset(presetName.trim());
      setPresetName('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium">System Type</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {availableSystemTypes.map(type => (
              <label key={type} className="flex items-center gap-1 text-sm">
                <Checkbox
                  id={`type-${type}`}
                  checked={filters.integrationTypes?.includes(type) || false}
                  onCheckedChange={checked => toggleSystemType(type)}
                />
                <span>{type}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium">Status</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {[ConnectionStatus.ACTIVE, ConnectionStatus.INACTIVE, ConnectionStatus.ERROR].map(status => (
              <label key={status} className="flex items-center gap-1 text-sm">
                <Checkbox
                  id={`status-${status}`}
                  checked={filters.status?.includes(status) || false}
                  onCheckedChange={() => toggleStatus(status)}
                />
                <span className="capitalize">{status}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="usage" className="text-sm font-medium">Usage</label>
          <Select
            value={filters.usage || ''}
            onValueChange={val => onUpdate('usage', val as any)}
          >
            <SelectTrigger id="usage" className="mt-1">
              <SelectValue placeholder="Select usage" />
            </SelectTrigger>
            <SelectContent>
              {usageOptions.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label htmlFor="updatedWithin" className="text-sm font-medium">Last Updated</label>
          <Select
            value={filters.updatedWithin || ''}
            onValueChange={val => onUpdate('updatedWithin', val as any)}
          >
            <SelectTrigger id="updatedWithin" className="mt-1">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              {updatedOptions.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {onSavePreset && (
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            value={presetName}
            onChange={e => setPresetName(e.target.value)}
            placeholder="Preset name"
            className="flex-1"
          />
          <Button type="button" onClick={handleSavePreset} disabled={!presetName.trim()}>
            Save Preset
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdvancedFilterPanel;
