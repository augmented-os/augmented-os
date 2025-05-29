import React from 'react';
import { SchemaTable } from '@/features/schemaEditor/types';
import { Link2 } from 'lucide-react';

// Define interfaces for processed relationships for clarity
interface RelationshipDetail {
  fromTable: string;
  fromColumns: string[];
  toTable: string;
  toColumns: string[];
}

interface RelationshipsTabProps {
  tables: SchemaTable[];
  currentTable: SchemaTable;
}

export function RelationshipsTab({ tables, currentTable }: RelationshipsTabProps) {
  // Find outgoing relationships (FKs defined in the current table)
  const outgoingRelationships: RelationshipDetail[] = (currentTable.foreignKeys || []).map(fk => ({
    fromTable: currentTable.name,
    fromColumns: fk.columns,
    toTable: fk.references.table,
    toColumns: fk.references.columns,
  }));

  // Find incoming relationships (FKs in other tables pointing to this table)
  const incomingRelationships: RelationshipDetail[] = tables
    .filter(table => table.name !== currentTable.name)
    .flatMap(table => 
      (table.foreignKeys || [])
        .filter(fk => fk.references.table === currentTable.name)
        .map(fk => ({
          fromTable: table.name,
          fromColumns: fk.columns,
          toTable: currentTable.name, // This is the current table
          toColumns: fk.references.columns,
        }))
    );

  const hasRelationships = outgoingRelationships.length > 0 || incomingRelationships.length > 0;

  const getTableDisplayName = (tableName: string): string => {
    return tables.find(t => t.name === tableName)?.displayName || tableName;
  };

  return (
    <div className="p-6">
      <div className="mb-4 p-3 bg-gray-50 rounded-md">
        <h3 className="text-lg font-medium text-gray-700">Relationships</h3>
      </div>
      
      {!hasRelationships ? (
        <div className="text-center text-gray-500 py-10">
          <Link2 className="w-10 h-10 mx-auto mb-3 text-gray-400" />
          No relationships defined for this table.
        </div>
      ) : (
        <div className="space-y-6">
          {/* Outgoing Relationships */}
          {outgoingRelationships.length > 0 && (
            <div>
              <h4 className="text-md font-medium text-gray-600 mb-3">Outgoing References</h4>
              <div className="bg-white border rounded-md shadow-sm p-4 space-y-4">
                {outgoingRelationships.map((rel, index) => (
                   <div key={`out-${index}`} className="flex items-center text-sm">
                    <div className="p-3 border rounded-md bg-blue-50 w-2/5 text-center">
                      <div className="font-medium">{currentTable.displayName}</div>
                      {/* Display potentially multiple columns */}
                      <div className="text-xs text-gray-500">.{rel.fromColumns.join(', ')}</div>
                    </div>
                    <div className="flex-1 px-2 text-center text-gray-500">
                      &#8594; references
                    </div>
                    <div className="p-3 border rounded-md bg-gray-50 w-2/5 text-center">
                      <div className="font-medium">{getTableDisplayName(rel.toTable)}</div>
                      {/* Display potentially multiple columns */}
                      <div className="text-xs text-gray-500">.{rel.toColumns.join(', ')}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Incoming Relationships */}
          {incomingRelationships.length > 0 && (
            <div>
               <h4 className="text-md font-medium text-gray-600 mb-3">Incoming References</h4>
              <div className="bg-white border rounded-md shadow-sm p-4 space-y-4">
                {incomingRelationships.map((rel, index) => (
                  <div key={`in-${index}`} className="flex items-center text-sm">
                    <div className="p-3 border rounded-md bg-gray-50 w-2/5 text-center">
                      <div className="font-medium">{getTableDisplayName(rel.fromTable)}</div>
                      {/* Display potentially multiple columns */}
                      <div className="text-xs text-gray-500">.{rel.fromColumns.join(', ')}</div>
                    </div>
                     <div className="flex-1 px-2 text-center text-gray-500">
                       &#8594; references
                    </div>
                    <div className="p-3 border rounded-md bg-blue-50 w-2/5 text-center">
                      <div className="font-medium">{currentTable.displayName}</div>
                      {/* Display potentially multiple columns */}
                      <div className="text-xs text-gray-500">.{rel.toColumns.join(', ')}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 