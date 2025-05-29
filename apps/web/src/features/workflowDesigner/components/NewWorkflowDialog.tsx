import React, { useState, useMemo, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle } from 'lucide-react';
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";

interface NewWorkflowDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (name: string, folder: string) => void;
  existingFolders: string[];
}

export const NewWorkflowDialog: React.FC<NewWorkflowDialogProps> = ({ 
  isOpen, 
  onOpenChange, 
  onSubmit, 
  existingFolders = []
}) => {
  const [workflowName, setWorkflowName] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [folderPopoverOpen, setFolderPopoverOpen] = useState(false);

  // Set a default folder when existingFolders changes
  useEffect(() => {
    if (!selectedFolder && existingFolders.length > 0) {
      setSelectedFolder(existingFolders[0]);
    }
  }, [existingFolders, selectedFolder]);

  const resetState = () => {
    setWorkflowName('');
    setSelectedFolder(existingFolders[0] || '');
    setNewFolderName('');
    setIsCreatingFolder(false);
  };

  const handleCreateClick = () => {
    const finalName = workflowName.trim();
    // Use the new folder name if in creation mode, otherwise use selected folder
    const finalFolder = isCreatingFolder ? newFolderName.trim() : selectedFolder.trim();

    if (finalName && finalFolder) { 
      onSubmit(finalName, finalFolder);
      resetState();
    } else {
      console.warn("Workflow name and folder cannot be empty.");
    }
  };

  const handleCancelClick = () => {
    resetState();
    onOpenChange(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetState();
    }
    onOpenChange(open);
  };

  // Handle folder selection or "New Folder" option
  const handleFolderSelect = (value: string) => {
    if (value === "__create_new__") {
      setIsCreatingFolder(true);
      setNewFolderName('');
    } else {
      setSelectedFolder(value);
      setIsCreatingFolder(false);
      setFolderPopoverOpen(false);
    }
  };

  // Go back to folder selection
  const handleBackToFolderSelect = () => {
    setIsCreatingFolder(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Workflow</DialogTitle>
          <DialogDescription>
            Enter a name for your new workflow and select a folder.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="workflow-name">Workflow Name</Label>
            <Input
              id="workflow-name"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              placeholder="e.g., Customer Onboarding Process"
              autoFocus
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="workflow-folder">Folder</Label>
            
            {!isCreatingFolder ? (
              // Folder selection
              <Popover open={folderPopoverOpen} onOpenChange={setFolderPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={folderPopoverOpen}
                    className="w-full justify-between font-normal"
                  >
                    {selectedFolder || "Select folder..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                  <Command>
                    <CommandInput placeholder="Search folders..." />
                    <CommandList>
                      <CommandGroup>
                        {existingFolders.map((folder) => (
                          <CommandItem
                            key={folder}
                            value={folder}
                            onSelect={() => handleFolderSelect(folder)}
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
                          onSelect={() => handleFolderSelect("__create_new__")}
                          className="text-blue-600 flex items-center"
                        >
                          <PlusCircle className="mr-2 h-4 w-4" />
                          New Folder
                        </CommandItem>
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            ) : (
              // New folder creation - simplified
              <div className="space-y-2">
                <Input
                  placeholder="Enter new folder name"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  autoFocus
                />
                <Button
                  variant="ghost"
                  type="button"
                  onClick={handleBackToFolderSelect}
                  size="sm"
                  className="px-0 text-sm text-muted-foreground"
                >
                  ← Back to folder selection
                </Button>
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={handleCancelClick}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCreateClick} 
            disabled={!workflowName.trim() || (!selectedFolder.trim() && !isCreatingFolder) || (isCreatingFolder && !newFolderName.trim())}
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 