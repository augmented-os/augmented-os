import { useState, useEffect, useCallback } from 'react';
import { IntegrationInstanceWithDetails, ConnectionStatus } from '../types';
import { fetchIntegrationInstance, updateIntegrationInstance } from '@/data/integrationService';

export function useIntegrationInstance(instanceId: string) {
  const [integration, setIntegration] = useState<IntegrationInstanceWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchIntegration = useCallback(async () => {
    if (!instanceId) {
      setIntegration(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchIntegrationInstance(instanceId);
      
      if (data) {
        // Transform to expected format
        const displayDescription = data.description || 
                                   data.definition_description || 
                                   data.integration_definition?.description ||
                                   ''; // Fallback to empty string
                                   
        const transformedData: IntegrationInstanceWithDetails = {
          ...data,
          definition_description: data.integration_definition?.description,
          connectionStatus: getConnectionStatus(data.status),
          displayDescription,
          usageStats: {
            totalCalls: data.total_calls || 0,
            successRate: data.success_rate || 0,
            lastUsed: data.last_used_at
          }
        };
        
        setIntegration(transformedData);
      } else {
        throw new Error(`Integration with ID ${instanceId} not found`);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch integration'));
      setIntegration(null);
    } finally {
      setLoading(false);
    }
  }, [instanceId]);

  useEffect(() => {
    fetchIntegration();
  }, [fetchIntegration]);

  // Helper function to get connection status
  function getConnectionStatus(status: any): ConnectionStatus {
    console.log('Raw status value:', status);
    
    // If status is a string (shouldn't happen for JSONB but just in case)
    if (typeof status === 'string') {
      console.log('Status is a string:', status);
      // Direct string match
      if (status === 'active') {
        return ConnectionStatus.ACTIVE;
      } else if (status === 'error') {
        return ConnectionStatus.ERROR;
      } else if (status === 'inactive') {
        return ConnectionStatus.INACTIVE;
      }
    }
    // If status is an object
    else if (typeof status === 'object' && status !== null) {
      console.log('Status is an object:', status);
      
      // Check for the JSONB structure where it has a 'status' key
      if (status.status === 'active') {
        return ConnectionStatus.ACTIVE;
      } else if (status.status === 'error') {
        return ConnectionStatus.ERROR;
      } else if (status.status === 'inactive') {
        return ConnectionStatus.INACTIVE;
      }
      
      // Also check for state property (fallback)
      if (status.state === 'active') {
        return ConnectionStatus.ACTIVE;
      } else if (status.state === 'error') {
        return ConnectionStatus.ERROR;
      } else if (status.state === 'inactive') {
        return ConnectionStatus.INACTIVE;
      }
      
      // Legacy format check
      if (status.error) {
        return ConnectionStatus.ERROR;
      }
      if (status.lastSync) {
        return ConnectionStatus.ACTIVE;
      }
    }
    
    // Default status
    return ConnectionStatus.INACTIVE;
  }

  // Function to update the integration
  const updateIntegration = useCallback(async (updatedData: Partial<IntegrationInstanceWithDetails>) => {
    setLoading(true);
    setError(null);
    
    try {
      // Use the service to update the integration
      const updatedIntegration = await updateIntegrationInstance(instanceId, {
        name: updatedData.name,
        description: updatedData.description,
        config: updatedData.config,
        credentials: updatedData.credentials,
        status: updatedData.status
      });
      
      if (updatedIntegration) {
        // Transform to expected format
        const displayDescription = updatedIntegration.description || 
                                   updatedIntegration.definition_description || 
                                   updatedIntegration.integration_definition?.description ||
                                   ''; // Fallback to empty string
                                   
        const transformedData: IntegrationInstanceWithDetails = {
          ...updatedIntegration,
          definition_description: updatedIntegration.integration_definition?.description,
          connectionStatus: getConnectionStatus(updatedIntegration.status),
          displayDescription,
          usageStats: {
            totalCalls: updatedIntegration.total_calls || 0,
            successRate: updatedIntegration.success_rate || 0,
            lastUsed: updatedIntegration.last_used_at
          }
        };
        
        setIntegration(transformedData);
      }
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update integration'));
      return false;
    } finally {
      setLoading(false);
    }
  }, [instanceId]);

  return {
    integration,
    loading,
    error,
    refresh: fetchIntegration,
    updateIntegration
  };
} 