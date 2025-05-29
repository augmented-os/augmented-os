import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UIComponentSchema } from '../types/schemas';
import * as schemaService from '../api/schemaService';

// Query keys for React Query
export const SCHEMA_QUERY_KEYS = {
  all: ['schemas'] as const,
  lists: () => [...SCHEMA_QUERY_KEYS.all, 'list'] as const,
  list: (filters?: string) => [...SCHEMA_QUERY_KEYS.lists(), filters] as const,
  details: () => [...SCHEMA_QUERY_KEYS.all, 'detail'] as const,
  detail: (componentId: string) => [...SCHEMA_QUERY_KEYS.details(), componentId] as const,
};

// Types for state management
export interface SchemaState {
  schemas: Record<string, UIComponentSchema>;
  loading: boolean;
  error: string | null;
}

export interface SchemaQueryResult {
  data?: UIComponentSchema;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export interface SchemasQueryResult {
  data?: UIComponentSchema[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Hook to fetch a single schema by component_id
 */
export function useSchemaQuery(componentId: string): SchemaQueryResult {
  const result = useQuery({
    queryKey: SCHEMA_QUERY_KEYS.detail(componentId),
    queryFn: () => schemaService.getSchema(componentId),
    enabled: Boolean(componentId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: Error) => {
      // Don't retry if schema not found
      if (error?.message?.includes('not found')) {
        return false;
      }
      return failureCount < 3;
    }
  });

  return {
    data: result.data || undefined,
    isLoading: result.isLoading,
    error: result.error,
    refetch: result.refetch
  };
}

/**
 * Hook to fetch all schemas
 */
export function useSchemasQuery(): SchemasQueryResult {
  const result = useQuery({
    queryKey: SCHEMA_QUERY_KEYS.list(),
    queryFn: schemaService.listSchemas,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 3
  });

  return {
    data: result.data,
    isLoading: result.isLoading,
    error: result.error,
    refetch: result.refetch
  };
}

/**
 * Hook to create a new schema
 */
export function useCreateSchemaMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: schemaService.createSchema,
    onSuccess: (newSchema) => {
      // Update the schemas list cache
      queryClient.setQueryData<UIComponentSchema[]>(
        SCHEMA_QUERY_KEYS.list(),
        (oldData) => {
          if (!oldData) return [newSchema];
          return [newSchema, ...oldData];
        }
      );

      // Set the individual schema cache
      queryClient.setQueryData(
        SCHEMA_QUERY_KEYS.detail(newSchema.componentId),
        newSchema
      );
    },
    onError: (error) => {
      console.error('Failed to create schema:', error);
    }
  });
}

/**
 * Hook to update an existing schema
 */
export function useUpdateSchemaMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ componentId, updates }: { componentId: string; updates: Partial<UIComponentSchema> }) =>
      schemaService.updateSchema(componentId, updates),
    onSuccess: (updatedSchema) => {
      // Update the individual schema cache
      queryClient.setQueryData(
        SCHEMA_QUERY_KEYS.detail(updatedSchema.componentId),
        updatedSchema
      );

      // Update the schemas list cache
      queryClient.setQueryData<UIComponentSchema[]>(
        SCHEMA_QUERY_KEYS.list(),
        (oldData) => {
          if (!oldData) return [updatedSchema];
          return oldData.map(schema =>
            schema.componentId === updatedSchema.componentId ? updatedSchema : schema
          );
        }
      );
    },
    onError: (error) => {
      console.error('Failed to update schema:', error);
    }
  });
}

/**
 * Hook to delete a schema
 */
export function useDeleteSchemaMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: schemaService.deleteSchema,
    onSuccess: (_, componentId) => {
      // Remove from individual schema cache
      queryClient.removeQueries({
        queryKey: SCHEMA_QUERY_KEYS.detail(componentId)
      });

      // Update the schemas list cache
      queryClient.setQueryData<UIComponentSchema[]>(
        SCHEMA_QUERY_KEYS.list(),
        (oldData) => {
          if (!oldData) return [];
          return oldData.filter(schema => schema.componentId !== componentId);
        }
      );
    },
    onError: (error) => {
      console.error('Failed to delete schema:', error);
    }
  });
}

/**
 * Hook to prefetch a schema by component_id
 */
export function usePrefetchSchema() {
  const queryClient = useQueryClient();

  return (componentId: string) => {
    queryClient.prefetchQuery({
      queryKey: SCHEMA_QUERY_KEYS.detail(componentId),
      queryFn: () => schemaService.getSchema(componentId),
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };
}

/**
 * Hook to invalidate schema caches
 */
export function useInvalidateSchemas() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({
        queryKey: SCHEMA_QUERY_KEYS.all
      });
    },
    invalidateList: () => {
      queryClient.invalidateQueries({
        queryKey: SCHEMA_QUERY_KEYS.lists()
      });
    },
    invalidateSchema: (componentId: string) => {
      queryClient.invalidateQueries({
        queryKey: SCHEMA_QUERY_KEYS.detail(componentId)
      });
    }
  };
}

/**
 * Utility function to get cached schema data without triggering a request
 */
export function getCachedSchema(queryClient: ReturnType<typeof useQueryClient>, componentId: string): UIComponentSchema | undefined {
  return queryClient.getQueryData(SCHEMA_QUERY_KEYS.detail(componentId));
}

/**
 * Utility function to set schema data in cache
 */
export function setCachedSchema(queryClient: ReturnType<typeof useQueryClient>, schema: UIComponentSchema): void {
  queryClient.setQueryData(
    SCHEMA_QUERY_KEYS.detail(schema.componentId),
    schema
  );
} 