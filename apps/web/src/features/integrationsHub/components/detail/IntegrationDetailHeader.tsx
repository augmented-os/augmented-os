import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { IntegrationInstanceWithDetails, ConnectionStatus } from '../../types';
import { formatDistanceToNow } from 'date-fns';

interface IntegrationDetailHeaderProps {
  integration: IntegrationInstanceWithDetails;
  onBack: () => void;
}

const statusColorMap: Record<ConnectionStatus, { bg: string; text: string }> = {
  [ConnectionStatus.ACTIVE]: { bg: 'bg-green-100', text: 'text-green-800' },
  [ConnectionStatus.INACTIVE]: { bg: 'bg-gray-100', text: 'text-gray-800' },
  [ConnectionStatus.ERROR]: { bg: 'bg-red-100', text: 'text-red-800' }
};

export const IntegrationDetailHeader: React.FC<IntegrationDetailHeaderProps> = ({
  integration,
  onBack,
}) => {
  const { name, description, connectionStatus, last_used_at, updated_at } = integration;
  
  const lastUsed = last_used_at ? formatDistanceToNow(new Date(last_used_at), { addSuffix: true }) : 'Never';
  const lastUpdated = updated_at ? formatDistanceToNow(new Date(updated_at), { addSuffix: true }) : 'Unknown';
  
  // Use a fallback for unknown status values
  const statusStyle = statusColorMap[connectionStatus] || { bg: 'bg-gray-100', text: 'text-gray-800' };
  
  // Safely cast status to an object with potential lastSync or error properties
  const status = integration.status as { lastSync?: string; error?: string } | null;
  
  return (
    <div className="border-b pb-6">
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="mr-1">
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          <span className="sr-only">Back</span>
        </Button>
        
        <div className="flex-1">
          <div className="flex items-center gap-3">
            {integration.definition && 'icon_url' in integration.definition && (
              <img 
                src={integration.definition.icon_url as string} 
                alt={`${name} icon`}
                className="w-8 h-8 object-contain"
              />
            )}
            <h1 className="text-2xl font-bold">{name}</h1>
            <Badge 
              className={`${statusStyle.bg} ${statusStyle.text} border-none`}
            >
              {connectionStatus}
            </Badge>
          </div>
        </div>
      </div>
      
      {description && (
        <p className="text-gray-600 mb-4">{description}</p>
      )}
      
      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
        <div>
          <span className="font-medium">Last used:</span> {lastUsed}
        </div>
        <div>
          <span className="font-medium">Last updated:</span> {lastUpdated}
        </div>
        <div>
          <span className="font-medium">Status:</span>{' '}
          {status?.lastSync && (
            <span className="text-green-600">
              Last connection test passed {formatDistanceToNow(new Date(status.lastSync), { addSuffix: true })}
            </span>
          )}
          {status?.error && (
            <span className="text-red-600">
              Error: {status.error}
            </span>
          )}
          {!status?.lastSync && !status?.error && (
            <span>Not tested yet</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default IntegrationDetailHeader; 