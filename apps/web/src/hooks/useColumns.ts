import { useQuery } from '@tanstack/react-query';
import { fetchColumnsForTable } from '@/data/schemaService';
import type { SchemaColumn } from '@/features/schemaEditor/types';

export function useColumns(schemaName: string, tableName: string) {
  return useQuery<SchemaColumn[], Error>({
    queryKey: ['columns', schemaName, tableName],
    queryFn: () => fetchColumnsForTable(schemaName, tableName),
    enabled: Boolean(schemaName && tableName),
  });
} 