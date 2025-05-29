import React, { useMemo, useState } from 'react';
import { Database, Save, XCircle, ChevronDown, PlusCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { SchemaSummary } from '../types';

interface SchemaHeaderProps {
  title?: string;
  onSave: () => void;
  onDiscard: () => void;
  isSaving?: boolean;
  isDirty?: boolean;
  allSchemas: SchemaSummary[];
  currentSchemaId: string;
  currentSchemaName: string;
  handleSchemaSelect: (schemaId: string) => void;
}

export function SchemaHeader({
  title = 'Data Model Builder',
  onSave,
  onDiscard,
  isSaving = false,
  isDirty = false,
  allSchemas = [],
  currentSchemaId,
  currentSchemaName,
  handleSchemaSelect
}: SchemaHeaderProps) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Placeholder function for creating a new schema
  const handleNewSchema = () => {
    console.log('Create new schema');
    setPopoverOpen(false);
    // This would typically open a dialog or navigate to a new schema page
  };

  // Filter schemas based on search query
  const filteredSchemas = useMemo(() => {
    if (!searchQuery) return allSchemas;
    return allSchemas.filter(schema => 
      schema.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allSchemas, searchQuery]);

  return (
    <header className="bg-white border-b border-gray-200 py-2 px-4 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <div className="flex items-center gap-1">
          <Database className="h-3.5 w-3.5 text-gray-600" />
          <span className="font-semibold text-gray-800 text-base">Schema:</span>
        </div>
        
        {isDirty ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="text-gray-600 flex items-center gap-1 hover:bg-blue-50 focus:ring-0 text-base px-1 py-1"
                  disabled={true}
                >
                  {currentSchemaName}
                  <ChevronDown className="h-3.5 w-3.5 ml-1 opacity-50" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="text-xs">Save changes before switching schemas</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                className="text-gray-600 flex items-center gap-1 hover:bg-blue-50 focus:ring-0 text-base px-1 py-1"
              >
                {currentSchemaName}
                <ChevronDown className="h-3.5 w-3.5 ml-1" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-0" align="start">
              <Command>
                <CommandInput 
                  placeholder="Search schemas..." 
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                />
                <CommandList className="max-h-80">
                  <CommandEmpty>No schemas found.</CommandEmpty>
                  <CommandGroup>
                    {filteredSchemas.map((schema) => (
                      <CommandItem
                        key={schema.id}
                        onSelect={() => {
                          handleSchemaSelect(schema.id);
                          setPopoverOpen(false);
                        }}
                        className={`flex items-center gap-2 ${schema.id === currentSchemaId ? 'bg-blue-50 text-blue-700' : ''}`}
                      >
                        <div className={`w-2 h-2 rounded-full ${schema.id === currentSchemaId ? 'bg-blue-600' : 'bg-gray-300'}`} />
                        <span className={schema.id === currentSchemaId ? 'font-medium' : ''}>
                          {schema.name}
                        </span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  
                  <CommandSeparator />
                  
                  <CommandGroup>
                    <CommandItem 
                      onSelect={handleNewSchema}
                      className="flex items-center gap-2 px-4 py-2 cursor-pointer"
                    >
                      <PlusCircle className="h-4 w-4" />
                      <span>New Schema...</span>
                    </CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        <button 
          className={`px-3 py-1.5 rounded flex items-center text-sm ${
            isDirty && !isSaving 
              ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50' 
              : 'bg-white border border-gray-200 text-gray-400 cursor-not-allowed'
          }`}
          onClick={onDiscard}
          disabled={!isDirty || isSaving}
        >
          <XCircle className="w-3.5 h-3.5 mr-1.5" />
          Discard Changes
        </button>
        
        <button 
          className={`px-3.5 py-1.5 rounded flex items-center text-sm ${
            isDirty && !isSaving
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-blue-200 text-blue-500 cursor-not-allowed'
          }`}
          onClick={onSave}
          disabled={!isDirty || isSaving}
        >
          <Save className="w-3.5 h-3.5 mr-1.5" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </header>
  );
} 