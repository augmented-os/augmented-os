import { useCallback, useState, useRef, useMemo, useEffect } from 'react';
import { 
  Node, 
  Edge, 
  ReactFlowInstance
} from 'reactflow';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Command, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList,
  CommandSeparator
} from '@/components/ui/command';
import { ChevronDown, Save, PlusCircle, Folder as FolderIcon, Edit, Pencil } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { WorkflowUIProvider } from './contexts/WorkflowUIContext';
import { ConfigPanel } from '@/features/workflowDesigner/components/configPanel';
import { FlowCanvas } from './components/FlowCanvas';
import ReactFlowWrapper from './components/ReactFlowWrapper';
import { NewWorkflowDialog } from './components/NewWorkflowDialog';
import { RenameWorkflowDialog } from './components/RenameWorkflowDialog';
import { CopyWorkflowDialog } from './components/CopyWorkflowDialog';
import { 
  useNodeOperations, 
  useSelectionManagement
} from './hooks';
import { useWorkflows } from '@/hooks/use-workflows';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Workflow } from '@/types/workflow';
import { WorkflowHeader } from './components/WorkflowHeader';
import { v4 as uuidv4 } from 'uuid';
import { 
  createWorkflow as createWorkflowService, 
  // We might need fetchAllWorkflows if the hook doesn't expose a direct adder
} from '@/data/workflowService'; 

interface WorkflowDesignerProps {
  nodes: Node[];
  edges: Edge[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge<any>[]>>;
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  reactFlowInstance: ReactFlowInstance | null;
  setReactFlowInstance: React.Dispatch<React.SetStateAction<ReactFlowInstance | null>>;
  onSave?: () => void;
  onPublish?: () => void;
  workflowName?: string;
  workflowId?: string;
  workflowFolder?: string;
  onWorkflowChange?: (workflowId: string) => void;
  onCreateWorkflow?: (name: string, folder: string) => void;
  onRenameWorkflow?: (newName: string) => void;
  allWorkflows: Workflow[]; // Now using the imported type
  onFolderChange?: (folderName: string) => void;
  allFolders?: string[]; 
  isWorkflowModified: boolean;
  setIsWorkflowModified: React.Dispatch<React.SetStateAction<boolean>>;
}

export const WorkflowDesignerInner: React.FC<WorkflowDesignerProps> = ({
  nodes,
  edges,
  setNodes,
  setEdges,
  onNodesChange,
  onEdgesChange,
  reactFlowInstance,
  setReactFlowInstance,
  onSave,
  onPublish,
  workflowName = 'Untitled Workflow',
  workflowFolder = 'Workflows',
  workflowId,
  onWorkflowChange,
  onCreateWorkflow,
  onRenameWorkflow,
  allWorkflows, 
  onFolderChange,
  allFolders = [],
  isWorkflowModified,
  setIsWorkflowModified,
}) => {
  // console.log(`WorkflowDesigner: Received workflowFolder prop: ${workflowFolder}`);
  
  const [snapGrid] = useState<[number, number]>([20, 20]);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [isNewWorkflowDialogOpen, setIsNewWorkflowDialogOpen] = useState(false);
  const [isNewFolderDialogOpen, setIsNewFolderDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  
  // New state for rename workflow dialog
  const [isRenameWorkflowDialogOpen, setIsRenameWorkflowDialogOpen] = useState(false);
  
  // New state for copy workflow dialog
  const [isCopyWorkflowDialogOpen, setIsCopyWorkflowDialogOpen] = useState(false);
  const [sourceWorkflowIdToCopy, setSourceWorkflowIdToCopy] = useState<string | null>(null);
  
  // Reset modification state only when the workflow ID changes
  useEffect(() => {
    if (typeof setIsWorkflowModified === 'function') {
      setIsWorkflowModified(false);
    } else {
      console.error("setIsWorkflowModified is not a function", { setIsWorkflowModified });
    }
  }, [workflowId, setIsWorkflowModified]);
  
  // Handle workflow selection
  const handleWorkflowSelect = (selectedId: string) => {
    if (onWorkflowChange && selectedId !== workflowId) {
      // Ensure changes are saved or user is prompted before switching
      if (isWorkflowModified) {
        // TODO: Implement a confirmation dialog (e.g., using ShadCN Alert Dialog)
        // For now, just log a warning and prevent switching
        console.warn("Unsaved changes detected. Please save before switching workflows.");
        // Potentially show a toast notification here
        return; 
      }
      onWorkflowChange(selectedId);
    }
  };
  
  // Mark the workflow as modified
  const markAsModified = useCallback(() => {
    if (typeof setIsWorkflowModified === 'function') {
      setIsWorkflowModified(true);
    } else {
      console.error("markAsModified: setIsWorkflowModified is not a function", { setIsWorkflowModified });
    }
  }, [setIsWorkflowModified]);
  
  // Reset the modification state
  const resetModified = useCallback(() => {
    if (typeof setIsWorkflowModified === 'function') {
      setIsWorkflowModified(false);
    } else {
      console.error("resetModified: setIsWorkflowModified is not a function", { setIsWorkflowModified });
    }
  }, [setIsWorkflowModified]);

  // --- NEW: Handler to update node/edge state from ConfigPanel ---
  const handleElementUpdate = useCallback((updatedElement: Node | Edge) => {
    console.log("WorkflowDesigner: handleElementUpdate called");
    
    // Check element type and update appropriate state
    if ('position' in updatedElement) {
      // It's a node
      setNodes(nodes => nodes.map(node => 
        node.id === updatedElement.id ? updatedElement as Node : node
      ));
    } else {
      // It's an edge
      setEdges(edges => edges.map(edge => 
        edge.id === updatedElement.id ? updatedElement as Edge : edge
      ));
    }
    
    // Mark as modified
    markAsModified();
  }, [setNodes, setEdges, markAsModified]);

  // New handler for bulk updates of multiple elements
  const handleBulkElementUpdate = useCallback((updatedElements: (Node | Edge)[]) => {
    console.log("WorkflowDesigner: handleBulkElementUpdate called");
    
    // Process nodes and edges separately
    const updatedNodes = updatedElements.filter(el => 'position' in el) as Node[];
    const updatedEdges = updatedElements.filter(el => !('position' in el)) as Edge[];
    
    // Update nodes if any
    if (updatedNodes.length > 0) {
      setNodes(nodes => nodes.map(node => {
        const updatedNode = updatedNodes.find(n => n.id === node.id);
        return updatedNode || node;
      }));
    }
    
    // Update edges if any
    if (updatedEdges.length > 0) {
      setEdges(edges => edges.map(edge => {
        const updatedEdge = updatedEdges.find(e => e.id === edge.id);
        return updatedEdge || edge;
      }));
    }
    
    // Mark as modified
    markAsModified();
  }, [setNodes, setEdges, markAsModified]);

  // Use our custom hooks - pass markAsModified to the hooks
  const { 
    handleNodesChange, 
    handleEdgesChange, 
    onConnect, 
    onDrop, 
    onDragOver,
    onAddNode
  } = useNodeOperations(
    nodes, 
    setNodes, 
    edges, 
    setEdges, 
    reactFlowInstance, 
    snapGrid,
    markAsModified
  );

  const {
    isOverlayVisible,
    zoomLevel,
    activeTab,
    handleTabClick,
    handleOverlayToggle,
    handleOverlayClose,
    updateZoomLevel,
    onClick,
    handleElementSelection,
    selectedElementId,
    editingSection
  } = useSelectionManagement(reactFlowInstance);
  
  // Handler for save button
  const handleSave = useCallback(() => {
    // Check modification state *before* attempting save
    if (isWorkflowModified && onSave) {
      onSave(); // Call the provided save function
      // Reset the modification state *after* successfully calling onSave
      resetModified();
    } else if (!isWorkflowModified) {
      console.log("Save skipped: No modifications detected.");
    } else if (!onSave) {
      console.error("Save handler (onSave) is missing.");
    }
  }, [isWorkflowModified, onSave, resetModified]);
  
  // Handler for publish button
  const handlePublish = useCallback(() => {
    if (onPublish) {
      onPublish();
    } else if (onSave) {
      // Fall back to onSave if onPublish not provided
      console.log("Publish handler missing, falling back to save...");
      onSave();
    }
    // Reset modified state after attempting publish/save
    resetModified();
  }, [onPublish, onSave, resetModified]);
  
  // Handle reactflow initialization
  const onInit = useCallback((instance: ReactFlowInstance) => {
    setReactFlowInstance(instance);
  }, [setReactFlowInstance]);

  // --- Derive Selection State (Moved Before Use) --- 
  const derivedSelectedNodes = useMemo(() => nodes.filter(n => n.selected), [nodes]);
  const derivedSelectedEdges = useMemo(() => edges.filter(e => e.selected), [edges]);
  const derivedSelectedElements = useMemo(() => [
    ...derivedSelectedNodes.map(n => ({ type: 'node' as const, data: n })),
    ...derivedSelectedEdges.map(e => ({ type: 'edge' as const, data: e }))
  ], [derivedSelectedNodes, derivedSelectedEdges]);
  
  const derivedSingleSelectedElement = useMemo(() => {
    if (derivedSelectedElements.length === 1) {
      return derivedSelectedElements[0];
    }
    return null;
  }, [derivedSelectedElements]);
  // --- End Derive Selection State ---

  // Update UI mode when selection changes
  useEffect(() => {
    if (derivedSingleSelectedElement) {
      // When a single element is selected, update the UI mode
      handleElementSelection(derivedSingleSelectedElement.data.id);
    }
    // We don't check for multiple selections because ConfigPanel already handles that case
  }, [derivedSingleSelectedElement, derivedSelectedElements.length]);

  // Effect to fit view when workflow nodes/edges change
  useEffect(() => {
    if (reactFlowInstance && workflowId) {
      // Use a minimal timeout to ensure React Flow has rendered the changes
      const timer = setTimeout(() => {
        reactFlowInstance.fitView({ padding: 0.2 }); // Standardized padding
        console.log(`WorkflowDesigner: fitView executed for workflowId: ${workflowId}.`);
      }, 0); 
      return () => clearTimeout(timer); // Cleanup timer on unmount or dependency change
    }
  }, [reactFlowInstance, workflowId]); // Depend on instance and workflowId

  // --- Updated Panel Visibility Logic --- 
  const shouldShowPanel = !!selectedElementId || !!activeTab;
  // --- End Updated Panel Visibility Logic ---

  // Use provided folder list or fall back to deriving from workflows
  const existingFolders = useMemo(() => {
    if (allFolders && allFolders.length > 0) {
      return allFolders;
    }
    
    // Fallback to deriving from workflows (folder names)
    const folders = allWorkflows.map(w => w.folder || 'Workflows'); 
    const uniqueFolders = [...new Set(folders)].sort();
    return uniqueFolders;
  }, [allWorkflows, allFolders]);

  // Handler for folder selection
  const handleFolderSelect = useCallback((folderName: string) => {
    if (onFolderChange && folderName !== workflowFolder) {
      onFolderChange(folderName);
    }
  }, [onFolderChange, workflowFolder]);

  // Handler for creating a new folder
  const handleNewFolderCreate = useCallback(() => {
    if (!newFolderName.trim()) return;
    
    // Call onFolderChange with the new folder name
    if (onFolderChange) {
      onFolderChange(newFolderName.trim());
      
      // Trigger hook re-fetch after a small delay to allow the DB operation to complete
      setTimeout(() => {
        const win = window as any;
        if (win.refreshFolders) {
          win.refreshFolders();
        }
      }, 300);
    }
    
    // Reset and close
    setNewFolderName('');
    setIsNewFolderDialogOpen(false);
  }, [newFolderName, onFolderChange]);

  // Show new folder dialog
  const showNewFolderDialog = useCallback(() => {
    setIsNewFolderDialogOpen(true);
  }, []);

  // Handler for renaming the current workflow
  const handleRenameWorkflow = (newName: string) => {
    if (workflowId && onRenameWorkflow) {
      onRenameWorkflow(newName);
      setIsRenameWorkflowDialogOpen(false);
    }
  };
  
  // Handler to open rename dialog
  const openRenameDialog = () => {
    if (!isWorkflowModified) {
      setIsRenameWorkflowDialogOpen(true);
    }
  };

  // Handler for submitting the new workflow dialog
  const handleNewWorkflowSubmit = (name: string, folder: string) => {
    if (onCreateWorkflow) {
      onCreateWorkflow(name, folder);
      
      // Check if this is a new folder that should be refreshed
      if (!existingFolders.includes(folder)) {
        // Trigger hook re-fetch after a small delay to allow the DB operation to complete
        setTimeout(() => {
          const win = window as any;
          if (win.refreshFolders) {
            win.refreshFolders();
          }
        }, 300);
      }
    }
    setIsNewWorkflowDialogOpen(false); 
  };

  const { createWorkflow } = useWorkflows(); // Use createWorkflow instead of addWorkflow

  // Get fetchAllWorkflows from the hook to refresh list after copy
  const { fetchAllWorkflows } = useWorkflows(); 

  // New handler to open the copy dialog
  const handleOpenCopyDialog = useCallback(() => {
    setSourceWorkflowIdToCopy(workflowId || null); // Default to current workflow
    setIsCopyWorkflowDialogOpen(true);
  }, [workflowId]);

  // Corrected handler to create the workflow copy using the service directly
  const handleCopyWorkflowSubmit = useCallback(async (sourceId: string, newName: string, newFolder: string) => {
    console.log(`Attempting to copy workflow. Source ID: ${sourceId}, New Name: ${newName}, New Folder: ${newFolder}`);
    const sourceWorkflow = allWorkflows.find(w => w.id === sourceId);

    if (!sourceWorkflow) {
      console.error("Source workflow not found for copying.");
      // TODO: Show error to user (e.g., toast)
      return;
    }

    // Deep copy nodes and edges 
    const copiedNodes = sourceWorkflow.nodes ? JSON.parse(JSON.stringify(sourceWorkflow.nodes)) : [];
    const copiedEdges = sourceWorkflow.edges ? JSON.parse(JSON.stringify(sourceWorkflow.edges)) : [];
    const copiedInputSchema = sourceWorkflow.input_schema ? JSON.parse(JSON.stringify(sourceWorkflow.input_schema)) : null;
    const copiedOutputSchema = sourceWorkflow.output_schema ? JSON.parse(JSON.stringify(sourceWorkflow.output_schema)) : null;

    try {
      // Call the workflow service function directly
      const newWorkflow = await createWorkflowService(
        newName,
        copiedNodes,
        copiedEdges,
        newFolder, // Pass folderName, service handles ID creation/lookup
        sourceWorkflow.description, // Copy description
        copiedInputSchema,         // Copy schemas
        copiedOutputSchema
      );

      if (newWorkflow) {
        console.log("Workflow copied successfully via service:", newWorkflow);
        setIsCopyWorkflowDialogOpen(false);

        // Refresh the workflow list using the hook's function
        await fetchAllWorkflows(); 

        // Optionally, switch to the new workflow after creation
        if (onWorkflowChange) {
          // Need a slight delay or check if the workflow exists in the refreshed list
          // before changing to it, as fetch might be asynchronous.
          // For simplicity now, just change - may need refinement.
          onWorkflowChange(newWorkflow.id);
          resetModified(); 
        }
      } else {
         console.error("Create workflow service returned null or undefined.");
         // TODO: Show error to user
      }
    } catch (error) {
      console.error("Error copying workflow via service:", error);
      // TODO: Show error to user (e.g., toast)
    }
  }, [allWorkflows, onWorkflowChange, resetModified, fetchAllWorkflows]); // Dependencies updated

  return (
    <>
      <div className="flex flex-col h-full min-h-0">
        <WorkflowHeader 
          isWorkflowModified={isWorkflowModified}
          workflowFolder={workflowFolder}
          workflowName={workflowName}
          workflowId={workflowId}
          allWorkflows={allWorkflows}
          existingFolders={existingFolders}
          activeTab={activeTab}
          handleSave={handleSave}
          handlePublish={handlePublish}
          handleFolderSelect={handleFolderSelect}
          showNewFolderDialog={showNewFolderDialog}
          handleWorkflowSelect={handleWorkflowSelect}
          openRenameDialog={openRenameDialog}
          setIsNewWorkflowDialogOpen={setIsNewWorkflowDialogOpen}
          handleTabClick={handleTabClick}
          handleOpenCopyDialog={handleOpenCopyDialog}
        />
        {/* Main content area: Canvas + Optional Panel */}
        <div className="flex-1 flex min-h-0">
          {/* Canvas takes remaining space */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <ReactFlowWrapper>
              <FlowCanvas
                nodes={nodes}
                edges={edges}
                snapGrid={snapGrid}
                isPanelVisible={shouldShowPanel}
                isOverlayVisible={isOverlayVisible}
                zoomLevel={zoomLevel}
                reactFlowInstance={reactFlowInstance}
                onInit={onInit}
                onNodesChange={handleNodesChange}
                onEdgesChange={handleEdgesChange}
                onConnect={onConnect}
                onClick={onClick}
                onDrop={onDrop}
                onDragOver={onDragOver}
                handleOverlayToggle={handleOverlayToggle}
                handleOverlayClose={handleOverlayClose}
                updateZoomLevel={updateZoomLevel}
                onAddNode={onAddNode}
                markAsModified={markAsModified}
              />
            </ReactFlowWrapper>
          </div>
          {shouldShowPanel && (
            <div className="w-[400px] flex-shrink-0 border-l border-gray-200 bg-white shadow-lg z-10 h-full flex flex-col min-h-0 ">
              {activeTab ? (
                 <Tabs value={activeTab}>
                  <TabsList className="px-6 pt-6 pb-2 w-full justify-start border-b">
                    <TabsTrigger value="properties" className={activeTab === 'properties' ? '' : 'text-gray-500'} onClick={() => handleTabClick('properties')}>Properties</TabsTrigger>
                    <TabsTrigger value="data" className={activeTab === 'data' ? '' : 'text-gray-500'} onClick={() => handleTabClick('data')}>Data</TabsTrigger>
                  </TabsList>
                  <TabsContent value="properties">
                    <div className="p-6">
                      <h2 className="text-xl font-semibold mb-2">Properties</h2>
                      <p className="text-sm text-gray-500 mb-3">Configure the properties for this node</p>
                    </div>
                  </TabsContent>
                  <TabsContent value="data">
                    <div className="p-6">
                      <h2 className="text-xl font-semibold mb-2">Data Settings</h2>
                      <p className="text-sm text-gray-500 mb-3">Configure the data for this node</p>
                    </div>
                  </TabsContent>
                </Tabs>
              ) : derivedSingleSelectedElement ? (
                <ConfigPanel elementType={derivedSingleSelectedElement.type} elementData={derivedSingleSelectedElement.data} onUpdate={handleElementUpdate} onBulkUpdate={handleBulkElementUpdate} />
              ) : derivedSelectedElements.length > 1 ? (
                <ConfigPanel elementType={'node'} elementData={derivedSelectedElements[0].data} multipleElements={derivedSelectedElements} onUpdate={handleElementUpdate} onBulkUpdate={handleBulkElementUpdate} />
              ) : null }
            </div>
          )}
        </div>
      </div>
      <NewWorkflowDialog isOpen={isNewWorkflowDialogOpen} onOpenChange={setIsNewWorkflowDialogOpen} onSubmit={handleNewWorkflowSubmit} existingFolders={existingFolders} />
      <Dialog open={isNewFolderDialogOpen} onOpenChange={setIsNewFolderDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
            <DialogDescription>Enter a name for the new folder.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="folder-name">Folder Name</Label>
                <Input id="folder-name" placeholder="My Folder" value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewFolderDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleNewFolderCreate} disabled={!newFolderName.trim()}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <RenameWorkflowDialog isOpen={isRenameWorkflowDialogOpen} onOpenChange={setIsRenameWorkflowDialogOpen} onSubmit={handleRenameWorkflow} currentName={workflowName} />
      <CopyWorkflowDialog isOpen={isCopyWorkflowDialogOpen} onOpenChange={setIsCopyWorkflowDialogOpen} allWorkflows={allWorkflows} currentWorkflowId={sourceWorkflowIdToCopy} existingFolders={allFolders} onSubmit={handleCopyWorkflowSubmit} showNewFolderDialog={showNewFolderDialog} />
    </>
  );
};

/**
 * Wrapper component: supplies shared UI state for the inner designer.
 * It calls no hooks, so all hooks in the inner component execute under the provider.
 */
export const WorkflowDesigner: React.FC<WorkflowDesignerProps> = (props) => (
  <WorkflowUIProvider>
    <WorkflowDesignerInner {...props} />
  </WorkflowUIProvider>
);

export default WorkflowDesigner; 