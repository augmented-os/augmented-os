import React from 'react';
import { IntegrationCard } from './IntegrationCard';
import { IntegrationInstanceWithDetails } from '../types';

interface IntegrationsListProps {
  integrations: IntegrationInstanceWithDetails[];
  isLoading?: boolean;
  onIntegrationSelect?: (integrationId: string) => void;
}

export function IntegrationsList({
  integrations,
  isLoading = false,
  onIntegrationSelect
}: IntegrationsListProps) {
  if (isLoading) {
    return (
      <div className="w-full py-8 text-center">
        <div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-primary rounded-full" />
        <p className="mt-2 text-gray-500">Loading integrations...</p>
      </div>
    );
  }

  if (integrations.length === 0) {
    return (
      <div className="text-center py-8 px-4">
        <h3 className="text-lg font-medium text-gray-900">No integrations found</h3>
        <p className="mt-1 text-sm text-gray-500">
          Try adjusting your search or filters to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <ul role="list" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {integrations.map((integration) => (
        <li key={integration.id} className="outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md">
          <IntegrationCard
            integration={integration}
            onClick={() => onIntegrationSelect && onIntegrationSelect(integration.id)}
          />
        </li>
      ))}
    </ul>
  );
}
