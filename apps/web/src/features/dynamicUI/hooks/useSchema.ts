import { useCallback } from 'react';
import { UIComponentSchema } from '../types/schemas';
import { 
  useSchemaQuery, 
  usePrefetchSchema, 
  SchemaQueryResult 
} from '../store/schemaSlice';

export interface UseSchemaOptions {
  /**
   * Whether to enable the query
   */
  enabled?: boolean;
  
  /**
   * Fallback schema to use when the database schema is not found
   */
  fallbackSchema?: UIComponentSchema;
  
  /**
   * Callback when schema is not found
   */
  onNotFound?: (componentId: string) => void;
  
  /**
   * Callback when schema loading fails
   */
  onError?: (error: Error) => void;
}

export interface UseSchemaResult extends SchemaQueryResult {
  /**
   * Prefetch a schema to warm the cache
   */
  prefetch: (componentId: string) => void;
  
  /**
   * Whether the schema was not found
   */
  notFound: boolean;
  
  /**
   * The component ID being fetched
   */
  componentId: string;
}

/**
 * Custom hook for fetching and managing UI component schemas
 * 
 * @param componentId - The component ID to fetch
 * @param options - Optional configuration
 * @returns Schema data, loading states, and utility functions
 */
export function useSchema(
  componentId: string, 
  options: UseSchemaOptions = {}
): UseSchemaResult {
  const {
    enabled = true,
    fallbackSchema,
    onNotFound,
    onError
  } = options;

  // Use the schema query hook
  const {
    data,
    isLoading,
    error,
    refetch
  } = useSchemaQuery(componentId);

  // Prefetch function
  const prefetch = usePrefetchSchema();

  // Handle error scenarios
  const notFound = !isLoading && !data && !error;
  
  // Call callbacks based on state
  if (notFound && onNotFound) {
    onNotFound(componentId);
  }
  
  if (error && onError) {
    onError(error);
  }

  // Return fallback schema if provided and no data found
  const finalData = data || (notFound && fallbackSchema) || undefined;

  return {
    data: finalData,
    isLoading: enabled ? isLoading : false,
    error,
    refetch,
    prefetch,
    notFound,
    componentId
  };
}

/**
 * Hook for prefetching multiple schemas
 * Useful for warming the cache with known schemas
 */
export function usePrefetchSchemas() {
  const prefetchSchema = usePrefetchSchema();

  return useCallback((componentIds: string[]) => {
    componentIds.forEach(componentId => {
      prefetchSchema(componentId);
    });
  }, [prefetchSchema]);
}

/**
 * Hook for managing schema with automatic retries and fallback behavior
 */
export function useSchemaWithFallback(
  componentId: string,
  fallbackSchema: UIComponentSchema,
  options: Omit<UseSchemaOptions, 'fallbackSchema'> = {}
): UseSchemaResult {
  return useSchema(componentId, {
    ...options,
    fallbackSchema,
    onNotFound: (id) => {
      console.warn(`Schema not found for component_id: ${id}, using fallback`);
      options.onNotFound?.(id);
    }
  });
}

/**
 * Hook for handling schema not found scenarios gracefully
 */
export function useSchemaOrNull(
  componentId: string,
  options: UseSchemaOptions = {}
): UseSchemaResult {
  return useSchema(componentId, {
    ...options,
    onNotFound: (id) => {
      console.info(`Schema not found for component_id: ${id}`);
      options.onNotFound?.(id);
    }
  });
} 