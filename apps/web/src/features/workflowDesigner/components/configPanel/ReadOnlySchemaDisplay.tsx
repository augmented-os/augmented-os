import React from 'react';
import { SchemaField } from '@/types/workflow';
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Lock } from 'lucide-react';
import { ElementType } from 'react';

// Reusing SchemaPreview logic for consistency
interface SchemaPreviewProps {
  schema: SchemaField[];
}

const SchemaPreview: React.FC<SchemaPreviewProps> = ({ schema }) => {
  if (!schema || schema.length === 0) {
    return <p className="mt-0 text-sm text-gray-400 italic px-3 py-2 rounded-b-md border border-gray-200 border-t-0 bg-gray-50">No input fields defined by action.</p>;
  }

  return (
    <div className="mt-0 rounded-b-md border border-gray-200 border-t-0 bg-gray-50 p-3">
      <div className="grid gap-y-2">
        {schema.map((field) => (
          <div key={field.id} className="border-b border-gray-100 last:border-b-0 pb-2 last:pb-0">
            <div className="flex justify-between items-start mb-1">
              <span className="text-sm font-medium text-gray-700">
                {field.name}
                {field.optional && 
                  <i className="text-gray-500 font-normal ml-1">(optional)</i>
                }
              </span>
              <Badge variant="outline" className="text-xs font-normal">{field.dataType}</Badge>
            </div>
            {field.description && (
              <p className="text-xs text-gray-500">
                {field.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Read Only Schema Display Component ---
interface ReadOnlySchemaDisplayProps {
  title: string;
  schema: SchemaField[];
  icon?: ElementType;
}

export const ReadOnlySchemaDisplay: React.FC<ReadOnlySchemaDisplayProps> = ({ 
  title,
  schema = [],
  icon: Icon,
}) => {
  const schemaLength = schema.length;

  return (
    <div className="mt-2">
      <div className="flex justify-between items-center w-full px-3 py-2 text-left text-sm font-medium text-gray-700 bg-gray-100 rounded-t-md border border-gray-200 border-b-0 cursor-default">
          <span className="flex items-center gap-2">
            {Icon && <Icon className="h-4 w-4 text-gray-500" />}
            {title} ({schemaLength} field{schemaLength === 1 ? '' : 's'})
          </span>
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                 <Lock className="h-4 w-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent side="top" align="end">
                 <p className="text-xs">Inputs are determined by the selected integration action.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
      </div>
      
      <SchemaPreview schema={schema} />
    </div>
  );
}; 