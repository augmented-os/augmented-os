import { IntegrationInstanceWithDetails, IntegrationDefinition, ConnectionStatus } from '../types';
import { determineConnectionStatus } from './status-utils';

/**
 * Transforms raw integration data into UI-ready format
 */
export function processIntegrationData(
  instance: any, 
  definition?: IntegrationDefinition
): IntegrationInstanceWithDetails {
  // Determine the connection status
  const connectionStatus = determineConnectionStatus(instance);
  
  // Calculate usage statistics if available
  const usageStats = {
    totalCalls: 0,
    successRate: 0,
    lastUsed: instance.last_used_at
  };
  
  // If there's a status object with usage metrics, extract them
  if (instance.status && typeof instance.status === 'object') {
    const status = instance.status as Record<string, any>;
    
    if (status.usage) {
      usageStats.totalCalls = status.usage.totalCalls || 0;
      usageStats.successRate = status.usage.successRate || 0;
    }
  }
  
  // Return the complete IntegrationInstanceWithDetails
  return {
    ...instance,
    definition,
    connectionStatus,
    usageStats
  };
}

/**
 * Generates a unique instance ID for a new integration
 */
export function generateInstanceId(definitionName: string): string {
  const normalizedName = definitionName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-');
  
  const randomSuffix = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${normalizedName}-${randomSuffix}`;
}

/**
 * Calculate a score representing how important this integration is for attention (higher = more important)
 */
export function calculateAttentionScore(integration: IntegrationInstanceWithDetails): number {
  let score = 0;
  
  // Error state is highest priority
  if (integration.connectionStatus === ConnectionStatus.ERROR) {
    score += 100;
  }
  
  // Configuring state is next
  if (integration.connectionStatus === ConnectionStatus.CONFIGURING) {
    score += 50;
  }
  
  // Pending state
  if (integration.connectionStatus === ConnectionStatus.PENDING) {
    score += 25;
  }
  
  // Add points for heavily used integrations
  if (integration.usageStats) {
    score += Math.min(integration.usageStats.totalCalls / 100, 10);
    
    // Lower success rate means more attention needed
    if (integration.usageStats.successRate < 1) {
      score += (1 - integration.usageStats.successRate) * 20;
    }
  }
  
  // Recently created integrations need more attention
  if (integration.created_at) {
    const createdDate = new Date(integration.created_at);
    const now = new Date();
    const daysSinceCreation = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
    
    if (daysSinceCreation < 7) {
      score += Math.max(0, 10 - daysSinceCreation);
    }
  }
  
  return score;
}

/**
 * Sort integrations by their attention score (highest first)
 */
export function sortIntegrationsByAttention(
  integrations: IntegrationInstanceWithDetails[]
): IntegrationInstanceWithDetails[] {
  return [...integrations].sort(
    (a, b) => calculateAttentionScore(b) - calculateAttentionScore(a)
  );
}

/**
 * Group integrations by their status
 */
export function groupIntegrationsByStatus(
  integrations: IntegrationInstanceWithDetails[]
): Record<ConnectionStatus, IntegrationInstanceWithDetails[]> {
  const result: Record<ConnectionStatus, IntegrationInstanceWithDetails[]> = {
    [ConnectionStatus.CONNECTED]: [],
    [ConnectionStatus.DISCONNECTED]: [],
    [ConnectionStatus.ERROR]: [],
    [ConnectionStatus.CONFIGURING]: [],
    [ConnectionStatus.PENDING]: []
  };
  
  integrations.forEach(integration => {
    result[integration.connectionStatus].push(integration);
  });
  
  return result;
} 