import React, { useMemo, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { 
  Command, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList,
  CommandSeparator
} from '@/components/ui/command';
import { ChevronDown, Save, PlusCircle, Folder as FolderIcon, Pencil, Copy } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Workflow } from '@/types/workflow'; // Assuming Workflow type is needed

interface WorkflowHeaderProps {
  isWorkflowModified: boolean;
  workflowFolder: string;
  workflowName: string;
  workflowId?: string; // Needed for organizedWorkflows calculation
  allWorkflows: Workflow[]; // Needed for organizedWorkflows calculation
  existingFolders: string[]; // Needed for folder dropdown and filteredFolders
  activeTab: string | null;
  
  // Handlers passed down from WorkflowDesigner
  handleSave: () => void;
  handlePublish: () => void;
  handleFolderSelect: (folderName: string) => void;
  showNewFolderDialog: () => void;
  handleWorkflowSelect: (workflowId: string) => void;
  openRenameDialog: () => void;
  setIsNewWorkflowDialogOpen: (isOpen: boolean) => void;
  handleTabClick: (tabValue: string) => void; 
  handleOpenCopyDialog: () => void; // Added prop for copy dialog
}

export const WorkflowHeader: React.FC<WorkflowHeaderProps> = ({
  isWorkflowModified,
  workflowFolder,
  workflowName,
  workflowId,
  allWorkflows,
  existingFolders,
  activeTab,
  handleSave,
  handlePublish,
  handleFolderSelect,
  showNewFolderDialog,
  handleWorkflowSelect,
  openRenameDialog,
  setIsNewWorkflowDialogOpen,
  handleTabClick,
  handleOpenCopyDialog, // Destructure new prop
}) => {
  // State moved from WorkflowDesigner
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [folderPopoverOpen, setFolderPopoverOpen] = useState(false);
  const [folderSearchQuery, setFolderSearchQuery] = useState('');

  // Derived state calculation moved from WorkflowDesigner
  const filteredFolders = useMemo(() => {
    if (!folderSearchQuery) return existingFolders;
    return existingFolders.filter(folder => 
      folder.toLowerCase().includes(folderSearchQuery.toLowerCase())
    );
  }, [existingFolders, folderSearchQuery]);

  // Derived state calculation moved from WorkflowDesigner
  const organizedWorkflows = useMemo(() => {
    const filtered = searchQuery
      ? allWorkflows.filter(w => w.name.toLowerCase().includes(searchQuery.toLowerCase()))
      : allWorkflows;
      
    const folders = new Map<string, Workflow[]>();
    const currentWorkflow = workflowId ? filtered.find(w => w.id === workflowId) : null;
    const otherWorkflows = filtered.filter(w => w.id !== workflowId);
    
    otherWorkflows.forEach(workflow => {
      const folderName = workflow.folder || 'Workflows';
      if (!folders.has(folderName)) {
        folders.set(folderName, []);
      }
      folders.get(folderName)!.push(workflow);
    });
    
    folders.forEach((workflows) => {
      workflows.sort((a, b) => a.name.localeCompare(b.name));
    });
    
    const sortedFolders = Array.from(folders.entries())
      .sort(([folderA], [folderB]) => folderA.localeCompare(folderB));
    
    return {
      currentWorkflow,
      folderGroups: sortedFolders
    };
  }, [allWorkflows, searchQuery, workflowId]);

  return (
    <header className="flex items-center justify-between px-4 py-2 border-b bg-white">
      <div className="flex items-center gap-2">
        
        {/* Folder Dropdown Logic */}
        {isWorkflowModified ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="font-medium text-gray-700 px-1 flex items-center gap-1 hover:bg-gray-100 focus:ring-0 text-base"
                  disabled={true}
                >
                  <FolderIcon className="h-4 w-4 mr-1 text-gray-500" />
                  {workflowFolder || 'Workflows'}
                  <ChevronDown className="h-4 w-4 ml-1 text-gray-300" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="text-xs">Save changes before changing folders</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <Popover open={folderPopoverOpen} onOpenChange={setFolderPopoverOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                className="font-medium text-gray-700 px-1 flex items-center gap-1 hover:bg-gray-100 focus:ring-0 text-base"
              >
                <FolderIcon className="h-4 w-4 mr-1 text-gray-500" />
                {workflowFolder || 'Workflows'}
                <ChevronDown className="h-4 w-4 ml-1 text-gray-400" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-0" align="start">
              <Command>
                <div className="relative">
                  <CommandInput 
                    placeholder="Search folders..." 
                    value={folderSearchQuery}
                    onValueChange={setFolderSearchQuery}
                  />
                  {folderSearchQuery && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2"
                      onClick={() => setFolderSearchQuery('')}
                    >
                      <span className="sr-only">Clear search</span>
                      ×
                    </Button>
                  )}
                </div>
                <CommandList className="max-h-[300px]">
                  <CommandEmpty>No folders found.</CommandEmpty>
                  
                  <CommandGroup>
                    {filteredFolders.map((folder) => (
                      <CommandItem
                        key={folder} // Use folder name as key
                        onSelect={() => handleFolderSelect(folder)}
                        className={`flex items-center gap-2 px-4 py-2 cursor-pointer ${folder === workflowFolder ? 'bg-purple-50' : ''}`}
                      >
                        <div className={`w-3 h-3 rounded-full ${folder === workflowFolder ? 'bg-purple-500' : 'bg-gray-300'}`} />
                        <span className={`flex-1 truncate ${folder === workflowFolder ? 'font-medium' : ''}`}>{folder}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  
                  <CommandSeparator />
                  
                  <CommandGroup>
                    <CommandItem 
                      onSelect={showNewFolderDialog} 
                      className="flex items-center gap-2 px-4 py-2 cursor-pointer text-blue-600"
                    >
                      <PlusCircle className="h-4 w-4" />
                      <span>New Folder...</span>
                    </CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        )}

        <span className="text-gray-500 text-base">/</span>
        
        {/* Workflow Dropdown Logic */}
        <div className="flex items-center gap-2">
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                className="text-gray-700 px-1 flex items-center gap-1 hover:bg-gray-100 focus:ring-0 text-base font-semibold"
              >
                {workflowName}
                <ChevronDown className="h-4 w-4 ml-1 text-gray-400" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="start">
              <Command className="flex flex-col">
                <div className="relative">
                  <CommandInput 
                    placeholder="Search workflows..." 
                    value={searchQuery}
                    onValueChange={setSearchQuery}
                  />
                  {searchQuery && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2"
                      onClick={() => setSearchQuery('')}
                    >
                      <span className="sr-only">Clear search</span>
                      ×
                    </Button>
                  )}
                </div>
                
                <div className="overflow-y-auto" style={{ maxHeight: "300px" }}>
                  <CommandList>
                    <CommandEmpty>No workflows found.</CommandEmpty>
                    
                    {organizedWorkflows.currentWorkflow && (
                      <>
                        <CommandGroup heading="Current">
                          <CommandItem
                            key={organizedWorkflows.currentWorkflow.id}
                            onSelect={() => {}} // No action needed here
                            className="flex items-center gap-2 px-4 py-2 cursor-default bg-purple-50"
                          >
                            <div className="w-3 h-3 rounded-full bg-purple-500" />
                            <span className="flex-1 truncate">
                              {organizedWorkflows.currentWorkflow.name}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 p-0 text-gray-500 hover:text-purple-600 hover:bg-transparent"
                              onClick={openRenameDialog} // Use prop
                              disabled={isWorkflowModified}
                            >
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Rename</span>
                            </Button>
                          </CommandItem>
                        </CommandGroup>
                        <CommandSeparator />
                      </>
                    )}
                    
                    {organizedWorkflows.folderGroups.map(([folder, workflows]) => (
                      <CommandGroup key={folder} heading={folder}>
                        {workflows.map((workflow) => (
                          <CommandItem
                            key={workflow.id}
                            onSelect={() => handleWorkflowSelect(workflow.id)} // Use prop
                            className="flex items-center gap-2 px-4 py-2 cursor-pointer"
                          >
                            <div className="w-3 h-3 rounded-full bg-gray-300" />
                            <span className="flex-1 truncate">
                              {workflow.name}
                            </span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    ))}
                  </CommandList>
                </div>
                
                <div className="border-t border-gray-200">
                  <CommandList>
                    <CommandGroup>
                      <CommandItem 
                        onSelect={() => {
                          setIsNewWorkflowDialogOpen(true); // Use prop
                        }} 
                        className="flex items-center gap-2 px-4 py-2 cursor-pointer"
                      >
                        <PlusCircle className="h-4 w-4" />
                        <span>New Workflow...</span>
                      </CommandItem>
                      <CommandItem 
                        onSelect={handleOpenCopyDialog} // Use new prop
                        className="flex items-center gap-2 px-4 py-2 cursor-pointer"
                      >
                        <Copy className="h-4 w-4" /> {/* Added icon */}
                        <span>Copy Workflow...</span> {/* Added menu item */}
                      </CommandItem>
                    </CommandGroup>
                  </CommandList>
                </div>
              </Command>
            </PopoverContent>
          </Popover>
          
          {/* Save Button */}
          <Button
            className={`text-sm px-3 py-1 h-8 flex items-center gap-1 ${isWorkflowModified 
              ? 'bg-blue-500 hover:bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed hover:bg-gray-100'} text-base`}
            onClick={handleSave} // Use prop
            disabled={!isWorkflowModified}
          >
            <Save className="h-3.5 w-3.5" />
            Save
          </Button>
        </div>
      </div>
      
      {/* Right Side: Tabs and Publish Button - #TODO Hidden for now*/}
      {false && (
        <div className="flex items-center gap-4">
          <Tabs value={activeTab || ''} onValueChange={handleTabClick}>
            <TabsList className="bg-transparent">
              <TabsTrigger value="support" className="data-[state=active]:bg-gray-100 text-sm">Support</TabsTrigger>
              <TabsTrigger value="runs" className="data-[state=active]:bg-gray-100 text-sm">Runs</TabsTrigger>
              <TabsTrigger value="versions" className="data-[state=active]:bg-gray-100 text-sm">Versions</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button 
            className="bg-blue-500 hover:bg-blue-600 text-white text-sm"
            onClick={handlePublish} // Use prop
          >
            Publish
          </Button>
        </div>
      )}
    </header>
  );
}; 