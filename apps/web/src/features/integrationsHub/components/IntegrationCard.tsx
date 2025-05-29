import React from 'react';
import { IntegrationInstanceWithDetails, ConnectionStatus } from '../types';

interface IntegrationCardProps {
  integration: IntegrationInstanceWithDetails;
  onClick?: () => void;
}

export function IntegrationCard({ integration, onClick }: IntegrationCardProps) {
  const handleClick = () => {
    if (onClick) onClick();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if ((e.key === 'Enter' || e.key === ' ') && onClick) {
      e.preventDefault();
      onClick();
    }
  };

  // For debugging - log essential information
  console.log(`Card for ${integration.name}:`, { 
    connectionStatus: integration.connectionStatus,
    rawStatus: integration.status
  });

  // Create icon element if available
  const icon = integration.integration_definition?.icon_url ? (
    <img 
      src={integration.integration_definition.icon_url} 
      alt={`${integration.name} icon`}
      className="w-8 h-8"
    />
  ) : null;

  // Use the exact status labels from the database with proper capitalization
  let statusLabel = 'Unknown';
  let statusStyle = 'border-gray-300 bg-gray-50 text-gray-700';
  
  // Force uppercase check for enum values
  const statusUpperCase = String(integration.connectionStatus).toUpperCase();
  
  if (statusUpperCase === 'ACTIVE') {
    statusLabel = 'Active';
    statusStyle = 'border-green-300 bg-green-50 text-green-700';
  } else if (statusUpperCase === 'ERROR') {
    statusLabel = 'Error';
    statusStyle = 'border-red-300 bg-red-50 text-red-700';
  } else if (statusUpperCase === 'INACTIVE') {
    statusLabel = 'Inactive';
    statusStyle = 'border-gray-300 bg-gray-50 text-gray-700';
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all duration-200 cursor-pointer relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      onClick={handleClick}
      aria-labelledby={`integration-${integration.id}-title`}
      aria-describedby={integration.displayDescription ? `integration-${integration.id}-desc` : undefined}
    >
      {/* Status Tag - Absolute Positioned */}
      <div className="absolute top-4 right-4">
        <span
          className={`text-sm px-3 py-1 rounded-full border ${statusStyle}`}
          aria-label={`Status: ${statusLabel}`}
        >
          {statusLabel}
        </span>
      </div>
      
      {/* Content */}
      <div className="flex flex-col">
        <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center mb-3">
          {icon || <span className="text-xl">{integration.name.charAt(0)}</span>}
        </div>
        <h3 id={`integration-${integration.id}-title`} className="text-base font-medium text-gray-900 mb-1">{integration.name}</h3>
        {integration.displayDescription && (
          <p id={`integration-${integration.id}-desc`} className="text-sm text-gray-500 line-clamp-2">{integration.displayDescription}</p>
        )}
      </div>
    </div>
  );
} 