import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Copy } from 'lucide-react';
import { IntegrationInstanceWithDetails } from '../../types';

interface ConfigurationSectionProps {
  integration: IntegrationInstanceWithDetails;
}

type ConfigItemType = 'text' | 'password' | 'url' | 'date' | 'boolean' | 'number';

interface ConfigItem {
  key: string;
  label: string;
  value: any;
  type: ConfigItemType;
  isSensitive?: boolean;
}

export const ConfigurationSection: React.FC<ConfigurationSectionProps> = ({ integration }) => {
  const [showSensitive, setShowSensitive] = useState<Record<string, boolean>>({});
  
  const toggleShowSensitive = (key: string) => {
    setShowSensitive(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add a toast notification here
  };

  // Extract configuration items from the integration
  const getConfigItems = (): ConfigItem[] => {
    const config = (typeof integration.config === 'object' && integration.config !== null) 
      ? integration.config as Record<string, any> 
      : {};
    
    const credentials = (typeof integration.credentials === 'object' && integration.credentials !== null) 
      ? integration.credentials as Record<string, any> 
      : {};
    
    const configItems: ConfigItem[] = [];
    
    // Add config items
    if (config && typeof config === 'object') {
      Object.entries(config).forEach(([key, value]) => {
        const type = getValueType(value);
        configItems.push({
          key,
          label: formatLabel(key),
          value,
          type,
          isSensitive: false
        });
      });
    }
    
    // Add credential items (marked as sensitive)
    if (credentials && typeof credentials === 'object') {
      Object.entries(credentials).forEach(([key, value]) => {
        const type = getValueType(value);
        configItems.push({
          key,
          label: formatLabel(key),
          value,
          type,
          isSensitive: true
        });
      });
    }
    
    return configItems;
  };
  
  const getValueType = (value: any): ConfigItemType => {
    if (typeof value === 'boolean') return 'boolean';
    if (typeof value === 'number') return 'number';
    if (typeof value === 'string') {
      // Check if it's a URL
      if (value.match(/^https?:\/\//)) return 'url';
      // Check if it's a date
      if (!isNaN(Date.parse(value))) return 'date';
      // Default to text
      return 'text';
    }
    return 'text';
  };
  
  const formatLabel = (key: string): string => {
    return key
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());
  };
  
  const renderConfigValue = (item: ConfigItem) => {
    const { key, value, type, isSensitive } = item;
    
    if (isSensitive) {
      const isVisible = showSensitive[key];
      return (
        <div className="flex items-center gap-2">
          {isVisible ? (
            <span>{String(value)}</span>
          ) : (
            <span>••••••••</span>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => toggleShowSensitive(key)}
          >
            {isVisible ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
            <span className="sr-only">{isVisible ? 'Hide' : 'Show'} value</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => copyToClipboard(String(value))}
          >
            <Copy className="h-4 w-4" />
            <span className="sr-only">Copy to clipboard</span>
          </Button>
        </div>
      );
    }
    
    switch (type) {
      case 'boolean':
        return <span>{value ? 'Yes' : 'No'}</span>;
      case 'url':
        return (
          <a
            href={value}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 hover:underline"
          >
            {value}
          </a>
        );
      case 'date':
        return <span>{new Date(value).toLocaleString()}</span>;
      default:
        return <span>{String(value)}</span>;
    }
  };
  
  const configItems = getConfigItems();
  
  if (configItems.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">No configuration data available.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {configItems.map((item) => (
            <div key={item.key} className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div className="font-medium text-gray-700">{item.label}</div>
              <div className="md:col-span-2">{renderConfigValue(item)}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ConfigurationSection; 