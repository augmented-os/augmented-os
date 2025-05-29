import { useState, useEffect, useCallback } from 'react';
import { 
  IntegrationInstanceWithDetails, 
  IntegrationFilterOptions,
  PaginationParams,
  ListIntegrationsResponse,
  ConnectionStatus
} from '../types';
import { fetchIntegrationInstances } from '@/data/integrationService';

export function useIntegrationInstances(
  initialFilters: IntegrationFilterOptions = {},
  initialPagination: PaginationParams = { page: 1, pageSize: 25 }
) {
  const [integrations, setIntegrations] = useState<IntegrationInstanceWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState<IntegrationFilterOptions>(initialFilters);
  const [pagination, setPagination] = useState<PaginationParams>({
    ...initialPagination,
    totalCount: 0
  });

  const fetchIntegrations = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get all integrations from service
      const data = await fetchIntegrationInstances();
      
      if (data) {
        // Transform to expected format
        const transformedData: IntegrationInstanceWithDetails[] = data.map(item => {
          const displayDescription = item.description || 
                                     item.definition_description || 
                                     item.integration_definition?.description ||
                                     ''; // Fallback to empty string
                                     
          return {
            ...item,
            definition_description: item.integration_definition?.description,
            connectionStatus: getConnectionStatus(item.status),
            displayDescription, // Add the calculated description
            usageStats: {
              totalCalls: item.total_calls || 0,
              successRate: item.success_rate || 0,
              lastUsed: item.last_used_at
            }
          };
        });
        
        // Apply searching if needed
        let filteredData = transformedData;
        if (filters.searchTerm && filters.searchTerm.trim() !== '') {
          const searchTerm = filters.searchTerm.trim().toLowerCase();
          filteredData = filteredData.filter(item => 
            item.name.toLowerCase().includes(searchTerm) ||
            (item.description && item.description.toLowerCase().includes(searchTerm))
          );
        }
        
        // Apply status filtering if needed
        if (filters.status && filters.status.length > 0) {
          filteredData = filteredData.filter(
            item => filters.status?.includes(item.connectionStatus)
          );
        }
        
        // Apply sorting
        if (filters.sortBy) {
          filteredData.sort((a, b) => {
            const direction = filters.sortDirection === 'desc' ? -1 : 1;
            
            switch (filters.sortBy) {
              case 'name':
                return direction * a.name.localeCompare(b.name);
              case 'lastUsed':
                if (!a.last_used_at) return direction;
                if (!b.last_used_at) return -direction;
                return direction * (new Date(a.last_used_at).getTime() - new Date(b.last_used_at).getTime());
              case 'status':
                return direction * a.connectionStatus.localeCompare(b.connectionStatus);
              default:
                return 0;
            }
          });
        } else {
          // Default sorting by name
          filteredData.sort((a, b) => a.name.localeCompare(b.name));
        }
        
        // Apply pagination
        const totalCount = filteredData.length;
        const startIdx = (pagination.page - 1) * pagination.pageSize;
        const endIdx = startIdx + pagination.pageSize;
        const paginatedData = filteredData.slice(startIdx, endIdx);
        
        setIntegrations(paginatedData);
        
        // Update pagination info
        setPagination(prev => ({
          ...prev,
          totalCount,
          totalPages: Math.ceil(totalCount / pagination.pageSize)
        }));
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch integrations'));
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page, pagination.pageSize]);

  useEffect(() => {
    fetchIntegrations();
  }, [fetchIntegrations]);

  // Helper function to get connection status
  function getConnectionStatus(status: any): ConnectionStatus {
    console.log('Instances - Raw status value:', status);
    
    // If status is a string (shouldn't happen for JSONB but just in case)
    if (typeof status === 'string') {
      console.log('Instances - Status is a string:', status);
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
      console.log('Instances - Status is an object:', status);
      
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

  const updateFilters = useCallback((newFilters: Partial<IntegrationFilterOptions>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    // Reset to first page when filters change
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  const updatePagination = useCallback((newPagination: Partial<PaginationParams>) => {
    setPagination(prev => ({ ...prev, ...newPagination }));
  }, []);

  return {
    integrations,
    loading,
    error,
    filters,
    pagination,
    updateFilters,
    updatePagination,
    refresh: fetchIntegrations
  };
} 