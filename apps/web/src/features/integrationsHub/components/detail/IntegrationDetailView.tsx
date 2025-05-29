import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { useIntegrationInstance } from '../../hooks/use-integration-instance';
import IntegrationDetailHeader from './IntegrationDetailHeader';
import ConfigurationSection from './ConfigurationSection';
import HealthMetricsSection from './HealthMetricsSection';
import UsageStatisticsSection from './UsageStatisticsSection';

interface IntegrationDetailViewProps {
  integrationId: string;
  onBack: () => void;
}

export const IntegrationDetailView: React.FC<IntegrationDetailViewProps> = ({
  integrationId,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState('configuration');
  const { integration, loading, error } = useIntegrationInstance(integrationId);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        <p className="mt-4 text-gray-500">Loading integration details...</p>
      </div>
    );
  }

  if (error || !integration) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="bg-red-100 text-red-800 p-4 rounded-lg max-w-md">
          <h2 className="font-semibold text-lg mb-2">Error loading integration</h2>
          <p className="text-sm">{error?.message || 'The requested integration could not be found.'}</p>
          <button
            onClick={onBack}
            className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 text-sm font-medium transition-colors"
          >
            Return to integrations list
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <IntegrationDetailHeader 
        integration={integration} 
        onBack={onBack} 
      />
      
      <div className="mt-6">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList
            className="w-full border-b flex justify-start mb-6 bg-transparent p-0"
            aria-label="Integration detail sections"
          >
            <TabsTrigger
              value="configuration"
              aria-controls="panel-configuration"
              className="px-4 py-2 border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Configuration
            </TabsTrigger>
            <TabsTrigger
              value="health"
              aria-controls="panel-health"
              className="px-4 py-2 border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Health &amp; Monitoring
            </TabsTrigger>
            <TabsTrigger
              value="usage"
              aria-controls="panel-usage"
              className="px-4 py-2 border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Usage Statistics
            </TabsTrigger>
          </TabsList>

          <div className="mt-4">
            <TabsContent id="panel-configuration" value="configuration" className="space-y-6 mt-0">
              <ConfigurationSection integration={integration} />
            </TabsContent>

            <TabsContent id="panel-health" value="health" className="space-y-6 mt-0">
              <HealthMetricsSection integration={integration} />
            </TabsContent>

            <TabsContent id="panel-usage" value="usage" className="space-y-6 mt-0">
              <UsageStatisticsSection integration={integration} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default IntegrationDetailView; 