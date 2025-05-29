import { Database, Json } from '@/types/supabaseTypes';

// Re-export the database types we need
export type IntegrationInstance = Database['public']['Tables']['integration_instances']['Row'];
export type IntegrationDefinition = Database['public']['Tables']['integration_definitions']['Row'];

// Enum for connection status - matching the actual values from the database
export enum ConnectionStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ERROR = 'error'
}

// Proper status type
export interface IntegrationStatus {
  state: 'active' | 'inactive' | 'error';
  lastChecked?: string;
  error?: string;
  lastSync?: string;
}

// Extended type with additional UI properties
export interface IntegrationInstanceWithDetails extends Omit<IntegrationInstance, 'status'> {
  definition?: IntegrationDefinition;
  connectionStatus: ConnectionStatus;
  displayDescription?: string;
  usageStats?: {
    totalCalls: number;
    successRate: number;
    lastUsed: string | null;
  };
  integration_definition?: {
    icon_url?: string;
    description?: string;
    [key: string]: any;
  };
  status: Json | IntegrationStatus | string;
  definition_description?: string;
}

// Filter options for the integration instances list
export interface IntegrationFilterOptions {
  searchTerm?: string;
  status?: ConnectionStatus[];
  integrationTypes?: string[];
  sortBy?: 'name' | 'status' | 'lastUsed' | 'created';
  sortDirection?: 'asc' | 'desc';
}

// Pagination type
export type PaginationParams = {
  page: number;
  pageSize: number;
  totalCount?: number;
};

// API response types
export type ListIntegrationsResponse = {
  data: IntegrationInstanceWithDetails[];
  pagination: {
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}; 