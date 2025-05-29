import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, Plus } from 'lucide-react';
import { IntegrationsList } from '@/features/integrationsHub/components/IntegrationsList';
import { IntegrationDetailView } from '@/features/integrationsHub/components/detail/IntegrationDetailView';
import { useIntegrationInstances } from '@/features/integrationsHub/hooks/use-integration-instances';
import { Button } from '@/components/ui/button';

const IntegrationsHubPage: React.FC = () => {
  // Get the integration ID from the URL if present
  const { id } = useParams<{ id?: string }>();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
  // Load all integrations once on mount (no search term)
  const { 
    integrations, 
    loading
  } = useIntegrationInstances();
  
  // Client-side filtered integrations
  const filteredIntegrations = useMemo(() => {
    if (!searchTerm) {
      return integrations;
    }
    
    const lowercasedSearch = searchTerm.toLowerCase();
    return integrations.filter(integration => 
      integration.name.toLowerCase().includes(lowercasedSearch) ||
      (integration.description && 
        integration.description.toLowerCase().includes(lowercasedSearch))
    );
  }, [integrations, searchTerm]);
  
  // Handle search input changes
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);
  
  const handleIntegrationSelect = (integrationId: string) => {
    navigate(`/build/integrations/${integrationId}`);
  };

  const handleNewIntegration = useCallback(() => {
    // Handle new integration creation
    console.log('Create new integration');
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          {id ? 'Integration Details' : 'Integrations Hub'}
        </h1>
        
        <div className="flex justify-between items-end">
          <p className="text-gray-500">
            {id 
              ? 'View and manage this integration' 
              : 'Manage your workflow integrations and connections'
            }
          </p>
          
          {!id && (
            <div className="flex items-center gap-3">
              <div className="relative w-64 lg:w-72">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search integrations..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
              
              <Button 
                className="flex items-center gap-1" 
                onClick={handleNewIntegration}
              >
                <Plus className="h-4 w-4" /> 
                Add
              </Button>
            </div>
          )}
        </div>
      </header>

      <main>
        {id ? (
          <IntegrationDetailView 
            integrationId={id} 
            onBack={() => navigate('/build/integrations')} 
          />
        ) : (
          <IntegrationsList 
            integrations={filteredIntegrations}
            isLoading={loading}
            onIntegrationSelect={handleIntegrationSelect}
          />
        )}
      </main>
    </div>
  );
};

export default IntegrationsHubPage; 