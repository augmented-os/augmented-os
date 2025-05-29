import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ConnectionStatus } from '../types';

interface StatusIndicatorProps {
  status: {
    state: 'active' | 'inactive' | 'error';
    lastChecked?: string;
    error?: string;
  };
  className?: string;
}

const getConnectionStatus = (state: string): ConnectionStatus => {
  switch (state) {
    case 'active':
      return ConnectionStatus.ACTIVE;
    case 'inactive':
      return ConnectionStatus.INACTIVE;
    case 'error':
      return ConnectionStatus.ERROR;
    default:
      return ConnectionStatus.INACTIVE;
  }
};

const getStatusText = (status: ConnectionStatus): string => {
  switch (status) {
    case ConnectionStatus.ACTIVE:
      return 'Active';
    case ConnectionStatus.INACTIVE:
      return 'Inactive';
    case ConnectionStatus.ERROR:
      return 'Error';
    default:
      return 'Unknown';
  }
};

const getStatusColor = (status: ConnectionStatus): string => {
  switch (status) {
    case ConnectionStatus.ACTIVE:
      return 'bg-green-100 text-green-800 border-green-200';
    case ConnectionStatus.INACTIVE:
      return 'bg-gray-100 text-gray-800 border-gray-200';
    case ConnectionStatus.ERROR:
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export function StatusIndicator({ status, className = '' }: StatusIndicatorProps) {
  const connectionStatus = getConnectionStatus(status.state);
  const statusText = getStatusText(connectionStatus);
  const statusColor = getStatusColor(connectionStatus);
  
  const tooltipContent = status.error 
    ? `Error: ${status.error}` 
    : status.lastChecked 
      ? `Last checked: ${new Date(status.lastChecked).toLocaleString()}`
      : statusText;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge className={`${statusColor} hover:${statusColor} ${className}`} variant="outline">
            {statusText}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipContent}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
} 