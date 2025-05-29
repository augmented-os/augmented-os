import React, { useState, useEffect } from 'react';
import { SchemaField } from '@/types/workflow';
import { SchemaEditor } from '@/components/shared/SchemaEditor';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from 'lucide-react';
import { ElementType } from 'react';
import { useConfigSection } from '@/features/workflowDesigner/hooks';

// --- Local Schema Preview Component (Moved here) --- 
interface SchemaPreviewProps {
  schema: SchemaField[];
}

const SchemaPreview: React.FC<SchemaPreviewProps> = ({ schema }) => {
  if (!schema || schema.length === 0) {
    return <p className="text-sm text-gray-400 italic px-3 py-2 bg-gray-50">No fields defined.</p>;
  }

  return (
    <div className="space-y-1 bg-gray-50 p-3">
      {schema.map((field) => (
        <div key={field.id} className="flex justify-between items-center text-sm border-b border-gray-100 last:border-b-0 py-1">
          <span className="text-gray-700 font-medium truncate pr-2" title={field.name}>
            {field.name}
            {field.optional && 
              <i className="text-gray-500 font-normal ml-1">(optional)</i>
            }
          </span>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Badge variant="outline" className="text-xs font-normal">{field.dataType}</Badge>
          </div>
        </div>
      ))}
    </div>
  );
};
// --- End Schema Preview Component ---

// --- Collapsible Schema Section Component --- 
interface CollapsibleSchemaSectionProps {
  title: string;
  description: string;
  schema: SchemaField[];
  onChange: (newSchema: SchemaField[]) => void;
  onUpdate: () => void;
  onCancel: () => void;
  disabled?: boolean;
  icon?: ElementType;
  sectionId: string;
  elementId: string;
}

export const CollapsibleSchemaSection: React.FC<CollapsibleSchemaSectionProps> = ({
  title,
  description,
  schema = [],
  onChange,
  onUpdate,
  onCancel,
  disabled = false,
  icon: Icon,
  sectionId,
  elementId
}) => {
  console.log('Rendering CollapsibleSchemaSection');
  const schemaLength = schema.length;
  
  // Use the config section hook
  const configState = useConfigSection(sectionId, elementId);
  // Log the entire state returned by the hook
  console.log(`[CollapsibleSchemaSection - ${sectionId}] Hook State: isEditing=${configState.isEditing}, isDisabled=${configState.isDisabled}`);
  const { isDisabled, isEditing, startEditing, stopEditing } = configState;
  
  // Combine passed disabled prop with the global state
  const effectiveDisabled = disabled || isDisabled;
  
  return (
    <div className={`mt-2 ${effectiveDisabled ? 'opacity-70' : ''}`}>
      <Collapsible 
        open={isEditing}
        className="space-y-0" 
      >
        <CollapsibleTrigger 
          asChild
        >
          <button
            type="button"
            onClick={() => { if (!effectiveDisabled) startEditing(); }}
            disabled={effectiveDisabled}
            className="flex justify-between items-center w-full h-12 px-3 text-left text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-t-md border border-gray-200 disabled:opacity-70 disabled:cursor-not-allowed data-[state=open]:bg-gray-200 data-[state=closed]:hover:bg-gray-200"
          >
            <span className="flex items-center gap-2">
              {Icon && <Icon className={`h-4 w-4 ${isEditing ? 'text-blue-600' : 'text-gray-500'}`} />}
              {title} ({schemaLength} field{schemaLength === 1 ? '' : 's'})
            </span>
            <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${isEditing ? 'rotate-90' : ''}`} />
          </button>
        </CollapsibleTrigger>
        
        {!isEditing && (
          <div className="mt-0 border border-gray-200 border-t-0 rounded-b-md">
            <SchemaPreview schema={schema} />
          </div>
        )}

        <CollapsibleContent className="pt-0" hidden={!isEditing}>
          <div className="border border-gray-200 border-t-0 rounded-b-md bg-white">
            <SchemaEditor 
              schema={schema}
              onChange={onChange} 
              title=""
              description={description}
            />
            <div className="flex justify-end gap-2 p-3 border-t bg-gray-50 rounded-b-md">
               <Button variant="outline" size="sm" onClick={() => {
                 onCancel();
                 stopEditing();
               }}>Cancel</Button>
               <Button size="sm" onClick={() => {
                 onUpdate();
                 stopEditing();
               }}>Update</Button>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}; 