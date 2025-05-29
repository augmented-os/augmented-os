import { IntegrationInstance, ConnectionStatus } from '../types';

// This type might need updating based on your actual database schema
type RawStatus = {
  state?: string;
  error?: string;
  lastSync?: string;
  [key: string]: any;
};

/**
 * Determines the connection status from a raw status object
 */
export function determineConnectionStatus(status: RawStatus | string | null): ConnectionStatus {
  if (!status) {
    return ConnectionStatus.INACTIVE;
  }
  
  // Handle string values (e.g. "active")
  if (typeof status === 'string') {
    switch (status) {
      case 'active':
        return ConnectionStatus.ACTIVE;
      case 'error':
        return ConnectionStatus.ERROR;
      case 'inactive':
        return ConnectionStatus.INACTIVE;
      default:
        return ConnectionStatus.INACTIVE;
    }
  }
  
  // Handle object values
  if (typeof status === 'object') {
    // Handle the case where status has a direct 'status' property
    if (status.status === 'active') {
      return ConnectionStatus.ACTIVE;
    }
    if (status.status === 'error') {
      return ConnectionStatus.ERROR;
    }
    if (status.status === 'inactive') {
      return ConnectionStatus.INACTIVE;
    }
    
    // Handle the case where status has a 'state' property
    if (status.state === 'active') {
      return ConnectionStatus.ACTIVE;
    }
    if (status.state === 'error') {
      return ConnectionStatus.ERROR;
    }
    if (status.state === 'inactive') {
      return ConnectionStatus.INACTIVE;
    }
    
    // Legacy format checks
    if (status.error) {
      return ConnectionStatus.ERROR;
    }
    if (status.lastSync) {
      return ConnectionStatus.ACTIVE;
    }
  }
  
  return ConnectionStatus.INACTIVE;
}

/**
 * Gets a human-readable status message based on the integration's status
 */
export function getStatusMessage(integration: IntegrationInstance): string {
  if (!integration.status) {
    return 'Needs configuration';
  }
  
  const status = integration.status as Record<string, any>;
  
  // Error messages
  if (status.error || status.errorMessage) {
    return status.errorMessage || status.error || 'Error connecting';
  }
  
  // Connected with last sync time
  if (status.lastSync) {
    try {
      const lastSync = new Date(status.lastSync);
      const now = new Date();
      const diffMs = now.getTime() - lastSync.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      
      if (diffMins < 1) {
        return 'Connected (synced just now)';
      } else if (diffMins < 60) {
        return `Connected (synced ${diffMins} min${diffMins === 1 ? '' : 's'} ago)`;
      } else if (diffMins < 1440) {
        const hours = Math.floor(diffMins / 60);
        return `Connected (synced ${hours} hour${hours === 1 ? '' : 's'} ago)`;
      } else {
        const days = Math.floor(diffMins / 1440);
        return `Connected (synced ${days} day${days === 1 ? '' : 's'} ago)`;
      }
    } catch (e) {
      return 'Connected (invalid sync time)';
    }
  }
  
  // Other status messages
  if (status.status === 'connected' || status.connected === true || status.isConnected === true) {
    return 'Connected';
  }
  
  if (status.status === 'disconnected' || status.connected === false || status.isConnected === false) {
    return 'Disconnected';
  }
  
  if (status.status === 'pending' || status.pending === true) {
    return 'Pending connection';
  }
  
  return 'Unknown status';
}

/**
 * Gets a color code for the status used in UI
 */
export function getStatusColor(status: ConnectionStatus): string {
  switch (status) {
    case ConnectionStatus.ACTIVE:
      return 'green';
    case ConnectionStatus.INACTIVE:
      return 'gray';
    case ConnectionStatus.ERROR:
      return 'red';
    default:
      return 'gray';
  }
}

/**
 * Checks if an integration requires attention (error or needs setup)
 */
export function requiresAttention(status: ConnectionStatus): boolean {
  return status === ConnectionStatus.ERROR || 
         status === ConnectionStatus.INACTIVE;
} 