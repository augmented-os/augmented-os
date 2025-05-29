import { useQuery } from '@tanstack/react-query';
import { fetchSchemas } from '@/data/schemaService';
import type { SchemaSummary } from '@/features/schemaEditor/types';

export function useSchemas() {
  return useQuery<SchemaSummary[], Error>({
    queryKey: ['schemas'],
    queryFn: fetchSchemas,
  });
} 