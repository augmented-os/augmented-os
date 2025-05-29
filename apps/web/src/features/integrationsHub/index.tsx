// Export types
export * from './types';

// Export hooks
export { useIntegrationInstances } from './hooks/use-integration-instances';
export { useIntegrationInstance } from './hooks/use-integration-instance';
export { useIntegrationFilters } from './hooks/use-integration-filters';

// Export utils
export { 
  determineConnectionStatus,
  getStatusMessage,
  getStatusColor,
  requiresAttention
} from './utils/status-utils';

export {
  processIntegrationData,
  generateInstanceId,
  calculateAttentionScore,
  sortIntegrationsByAttention,
  groupIntegrationsByStatus
} from './utils/integration-helpers'; 