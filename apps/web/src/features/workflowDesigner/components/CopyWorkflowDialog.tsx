import React, { useState, useEffect, useMemo } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { 
  Command, 
  CommandInput, 
  CommandList, 
  CommandEmpty, 
  CommandGroup, 
  CommandItem,
  CommandSeparator
} from '@/components/ui/command';
import { Workflow } from '@/types/workflow';
import { Check, ChevronsUpDown, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming you have a utility for classnames

interface CopyWorkflowDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  allWorkflows: Workflow[];
  currentWorkflowId: string | null; // The ID of the workflow to default to
  existingFolders: string[];
  onSubmit: (sourceId: string, newName: string, newFolder: string) => void;
  showNewFolderDialog: () => void; 
}

export const CopyWorkflowDialog: React.FC<CopyWorkflowDialogProps> = ({
  isOpen,
  onOpenChange,
  allWorkflows,
  currentWorkflowId,
  existingFolders,
  onSubmit,
  showNewFolderDialog,
}) => {
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);
  const [newWorkflowName, setNewWorkflowName] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('');
  
  const [sourcePopoverOpen, setSourcePopoverOpen] = useState(false);
  const [sourceSearchQuery, setSourceSearchQuery] = useState('');
  
  const [folderPopoverOpen, setFolderPopoverOpen] = useState(false);
  const [folderSearchQuery, setFolderSearchQuery] = useState('');

  const selectedSourceWorkflow = useMemo(() => {
    return allWorkflows.find(wf => wf.id === selectedSourceId);
  }, [selectedSourceId, allWorkflows]);

  // Effect to reset state when dialog opens or currentWorkflowId changes
  useEffect(() => {
    if (isOpen) {
      const initialSource = allWorkflows.find(wf => wf.id === currentWorkflowId);
      setSelectedSourceId(currentWorkflowId);
      setNewWorkflowName(initialSource ? `${initialSource.name} Copy` : 'Workflow Copy');
      setSelectedFolder(initialSource?.folder || 'Workflows'); // Default to source folder or 'Workflows'
      setSourceSearchQuery('');
      setFolderSearchQuery('');
    }
  }, [isOpen, currentWorkflowId, allWorkflows]);

  const handleInternalSubmit = () => {
    if (selectedSourceId && newWorkflowName.trim() && selectedFolder.trim()) {
      onSubmit(selectedSourceId, newWorkflowName.trim(), selectedFolder.trim());
    } else {
      // Optional: Add some validation feedback
      console.warn("Missing required fields for copying workflow");
    }
  };

  const filteredWorkflows = useMemo(() => {
    return sourceSearchQuery
      ? allWorkflows.filter(w => w.name.toLowerCase().includes(sourceSearchQuery.toLowerCase()))
      : allWorkflows;
  }, [allWorkflows, sourceSearchQuery]);

  const filteredFolders = useMemo(() => {
    return folderSearchQuery
      ? existingFolders.filter(f => f.toLowerCase().includes(folderSearchQuery.toLowerCase()))
      : existingFolders;
  }, [existingFolders, folderSearchQuery]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Copy Workflow</DialogTitle>
          <DialogDescription>
            Create a new workflow based on an existing one.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Source Workflow Selector */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="source-workflow" className="text-right">
              Copy From
            </Label>
            <Popover open={sourcePopoverOpen} onOpenChange={setSourcePopoverOpen}>
              <PopoverTrigger asChild className="col-span-3">
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={sourcePopoverOpen}
                  className="w-full justify-between"
                >
                  {selectedSourceWorkflow ? selectedSourceWorkflow.name : "Select workflow..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0">
                <Command>
                  <CommandInput 
                    placeholder="Search workflows..." 
                    value={sourceSearchQuery}
                    onValueChange={setSourceSearchQuery}
                  />
                  <CommandList>
                    <CommandEmpty>No workflows found.</CommandEmpty>
                    <CommandGroup>
                      {filteredWorkflows.map((workflow) => (
                        <CommandItem
                          key={workflow.id}
                          value={workflow.name} // Value for searching
                          onSelect={() => {
                            setSelectedSourceId(workflow.id);
                            setSourcePopoverOpen(false);
                            setSourceSearchQuery('');
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedSourceId === workflow.id ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {workflow.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          
          {/* New Workflow Name */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              New Name
            </Label>
            <Input
              id="name"
              value={newWorkflowName}
              onChange={(e) => setNewWorkflowName(e.target.value)}
              className="col-span-3"
              placeholder="Enter new workflow name"
            />
          </div>

          {/* Folder Selector */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="folder" className="text-right">
              Folder
            </Label>
            <Popover open={folderPopoverOpen} onOpenChange={setFolderPopoverOpen}>
              <PopoverTrigger asChild className="col-span-3">
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={folderPopoverOpen}
                  className="w-full justify-between"
                >
                  {selectedFolder || "Select folder..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0">
                <Command>
                  <CommandInput 
                    placeholder="Search folders..." 
                    value={folderSearchQuery}
                    onValueChange={setFolderSearchQuery}
                  />
                  <CommandList>
                    <CommandEmpty>No folders found.</CommandEmpty>
                    <CommandGroup>
                      {filteredFolders.map((folder) => (
                        <CommandItem
                          key={folder}
                          value={folder}
                          onSelect={() => {
                            setSelectedFolder(folder);
                            setFolderPopoverOpen(false);
                            setFolderSearchQuery('');
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedFolder === folder ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {folder}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup>
                      <CommandItem
                        onSelect={() => {
                          showNewFolderDialog(); // Call the passed-in function
                          setFolderPopoverOpen(false); // Close the current popover
                        }}
                        className="flex items-center gap-2 cursor-pointer text-blue-600"
                      >
                        <PlusCircle className="h-4 w-4" />
                        <span>New Folder...</span>
                      </CommandItem>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button 
            onClick={handleInternalSubmit} 
            disabled={!selectedSourceId || !newWorkflowName.trim() || !selectedFolder.trim()}
          >
            Create Copy
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 