import { useQuery } from '@tanstack/react-query';
import { fetchTablesForSchema } from '@/data/schemaService';
import type { SchemaTable } from '@/features/schemaEditor/types';

export function useTables(schemaName: string) {
  return useQuery<SchemaTable[], Error>({
    queryKey: ['tables', schemaName],
    queryFn: () => fetchTablesForSchema(schemaName),
    enabled: Boolean(schemaName),
  });
} 