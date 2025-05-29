import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  useReactFlow,
  addEdge,
  Node,
  Edge,
  Connection,
  ReactFlowInstance,
  MarkerType
} from 'reactflow';
import "reactflow/dist/style.css";
import { useWorkflows } from "@/hooks/use-workflows";
import { useToast } from "@/components/ui/use-toast";
import { WorkflowDesigner } from "../features/workflowDesigner";
import { Workflow, NODE_TYPES, NodeData, SchemaField } from '@/types/workflow'; // Make sure NODE_TYPES, NodeData, SchemaField are imported

export default function Index() {
  const { 
    currentWorkflow, 
    loading, 
    error, 
    updateWorkflow, 
    fetchWorkflow,
    createWorkflow,
    workflows,
    folders,
    fetchFolders
  } = useWorkflows({ 
    autoFetch: true 
  });

  // Add a global refresh function that components can call
  useEffect(() => {
    // TypeScript: add window.refreshFolders property
    (window as unknown as { refreshFolders?: () => void }).refreshFolders = fetchFolders;
    
    return () => {
      // Clean up when component unmounts
      delete (window as { refreshFolders?: () => void }).refreshFolders;
    };
  }, [fetchFolders]);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const { toast } = useToast();
  const [isWorkflowModified, setIsWorkflowModified] = useState(false);
  
  useEffect(() => {
    if (currentWorkflow) {
      console.log('[Index.tsx Effect] currentWorkflow changed:', currentWorkflow.id);
      const incomingNodes = currentWorkflow.nodes || [];
      const incomingEdges = currentWorkflow.edges || [];
      
      // *** Add log for incoming nodes data ***
      console.log('[Index.tsx Effect] Incoming Nodes raw:', JSON.stringify(incomingNodes, null, 2)); 
      const inputNodeData = incomingNodes.find(n => n.id === 'node-input')?.data;
      console.log('[Index.tsx Effect] Incoming node-input data.config:', JSON.stringify(inputNodeData?.config, null, 2));
      // *** End log ***
      
      // Keep the raw log for comparison
      console.log('[Index.tsx Effect] Incoming Edges raw:', JSON.stringify(incomingEdges, null, 2)); 

      // Helper function to create unique handle IDs (consistent with CustomNode)
      const getBranchHandleId = (nodeId: string, branchId: string): string => {
        return `${nodeId}-${branchId}`;
      };

      // --- Process Edges for Conditional Handles (New Approach) ---
      const processedEdges = incomingEdges.map(edge => {
        const branchId = edge.data?.branchId;
        const defaultMarker = { type: MarkerType.ArrowClosed }; // Define default marker
        
        if (branchId && edge.source) { 
          const handleId = getBranchHandleId(edge.source, branchId);
          console.log(`[Index.tsx Effect] Edge ${edge.id} linked to branch ${branchId}, setting sourceHandle: ${handleId}`);
          return {
            ...edge,
            sourceHandle: handleId, 
            type: edge.type || 'custom', 
            markerEnd: edge.markerEnd || defaultMarker, // Preserve existing or add default marker
          };
        } else {
          // If no branchId, ensure sourceHandle is undefined for default connection
          console.log(`[Index.tsx Effect] Edge ${edge.id} has no branchId, setting sourceHandle: undefined`);
          const { sourceHandle, ...rest } = edge; 
          return { 
             ...rest, 
             sourceHandle: undefined, 
             markerEnd: edge.markerEnd || defaultMarker // Preserve existing or add default marker
          }; 
        }
      });
      // --- End Edge Processing ---
      console.log('[Index.tsx Effect] Processed Edges:', JSON.stringify(processedEdges, null, 2)); // Log processed edges
      
      // Compare stringified versions
      const incomingNodesString = JSON.stringify(incomingNodes);
      const processedEdgesString = JSON.stringify(processedEdges);
      
      setNodes(prevNodes => {
        const currentNodesString = JSON.stringify(prevNodes);
        if (incomingNodesString !== currentNodesString) {
          console.log('[Index.tsx Effect] Updating nodes state.');
          return incomingNodes;
        }
        console.log('[Index.tsx Effect] Nodes state is identical, skipping update.');
        return prevNodes;
      });

      setEdges(prevEdges => {
        const currentEdgesString = JSON.stringify(prevEdges);
        if (processedEdgesString !== currentEdgesString) {
          console.log('[Index.tsx Effect] Updating edges state.');
          return processedEdges;
        }
        console.log('[Index.tsx Effect] Edges state is identical, skipping update.');
        return prevEdges;
      });

    } else {
      console.log('[Index.tsx Effect] No currentWorkflow, clearing state.');
      setNodes([]);
      setEdges([]);
    }
  }, [currentWorkflow, setNodes, setEdges]);

  const saveWorkflow = useCallback(() => {
    if (!currentWorkflow) {
      console.error("Attempted to save without a current workflow.");
      toast({ title: "Save Error", description: "No workflow is currently loaded.", variant: "destructive" });
      return;
    }
    if (!reactFlowInstance) {
      console.error("Attempted to save without reactFlowInstance.");
      toast({ title: "Save Error", description: "React Flow instance not available.", variant: "destructive" });
      return;
    }

    // --- Synchronization Logic --- 
    let rootInputSchema: SchemaField[] | undefined | null = null; 
    let rootOutputSchema: SchemaField[] | undefined | null = null;

    const inputNode = nodes.find(node => (node.data as NodeData)?.type === NODE_TYPES.WORKFLOW_INPUT);
    if (inputNode) {
      // For workflow input schema, source is likely not relevant anyway, but keep original structure.
      rootInputSchema = (inputNode.data as NodeData).output_schema; 
      console.log("Syncing workflow input_schema from node:", rootInputSchema);
    }

    const outputNode = nodes.find(node => (node.data as NodeData)?.type === NODE_TYPES.WORKFLOW_OUTPUT);
    if (outputNode) {
      const outputNodeInputSchema = (outputNode.data as NodeData).input_schema;
      if (Array.isArray(outputNodeInputSchema)) {
        // Filter out the 'source' key when creating the top-level workflow output schema
        rootOutputSchema = outputNodeInputSchema.map(({ source, ...rest }) => rest);
        console.log("Syncing workflow output_schema (filtered) from node:", rootOutputSchema);
      } else {
         rootOutputSchema = null; // Or [] depending on DB requirements
      }
    }
    // --- End Synchronization Logic ---

    const flow = reactFlowInstance.toObject();

    // Prepare data for Supabase update
    const updatedWorkflowData = {
      nodes: flow.nodes, 
      edges: flow.edges, 
      input_schema: rootInputSchema, 
      output_schema: rootOutputSchema, // Use the potentially filtered schema
    };

    console.log("Saving workflow:", currentWorkflow.id, updatedWorkflowData);

    updateWorkflow(currentWorkflow.id, updatedWorkflowData)
      .then(() => {
        toast({ title: "Workflow Saved", description: "Your changes have been saved." });
        setIsWorkflowModified(false);
        // Optionally re-fetch or update local state if needed after save
      })
      .catch((err) => {
        console.error("Error saving workflow:", err);
        toast({ title: "Save Failed", description: "Could not save the workflow.", variant: "destructive" });
      });

  }, [currentWorkflow, reactFlowInstance, nodes, updateWorkflow, toast]);

  const handleSelectWorkflow = useCallback((workflowId: string) => {
    // Add log here to confirm ID before fetch
    console.log(`[Index.tsx handleSelectWorkflow] Intending to fetch workflow ID: ${workflowId}`); 
    fetchWorkflow(workflowId);
  }, [fetchWorkflow]);

  // Handler for creating a new workflow
  const handleCreateWorkflow = useCallback(async (name: string, folder: string) => {
    if (!name || !folder) {
      toast({ title: "Creation Failed", description: "Workflow name and folder cannot be empty.", variant: "destructive" });
      return;
    }
    
    console.log(`Index.tsx: Creating new workflow named: ${name} in folder: ${folder}`);
    try {
      const newWorkflow = await createWorkflow(
        name, 
        folder // This is always required now
      );
      
      if (newWorkflow) {
        toast({ title: "Workflow Created", description: `Successfully created "${name}".` });
        
        // Explicitly fetch folder list after creating a workflow
        // This ensures UI is consistent with the database
        fetchFolders();
      } else {
        // Error is likely handled within the hook, but double-check
        toast({ title: "Creation Failed", description: "Could not create workflow.", variant: "destructive" });
      }
    } catch (err) {
      console.error("Error calling createWorkflow:", err);
      toast({ title: "Creation Failed", description: "An unexpected error occurred.", variant: "destructive" });
    }
  }, [createWorkflow, toast, fetchFolders]);

  const handleFolderChange = useCallback(async (folderName: string) => {
    if (!currentWorkflow) return;
    
    console.log(`Index.tsx: Changing folder to: ${folderName}`);
    try {
      await updateWorkflow(currentWorkflow.id, {
        folder: folderName
      });
      toast({ title: "Folder Updated", description: `Workflow moved to "${folderName}".` });
    } catch (err) {
      console.error("Error updating folder:", err);
      toast({ title: "Update Failed", description: "Could not update the folder.", variant: "destructive" });
    }
  }, [currentWorkflow, updateWorkflow, toast]);

  // Handler for renaming the current workflow
  const handleRenameWorkflow = useCallback(async (newName: string) => {
    if (!currentWorkflow || !newName.trim()) return;
    
    console.log(`Index.tsx: Renaming workflow to: ${newName}`);
    try {
      await updateWorkflow(currentWorkflow.id, {
        name: newName.trim()
      });
      toast({ title: "Workflow Renamed", description: `Workflow renamed to "${newName}".` });
    } catch (err) {
      console.error("Error renaming workflow:", err);
      toast({ title: "Rename Failed", description: "Could not rename the workflow.", variant: "destructive" });
    }
  }, [currentWorkflow, updateWorkflow, toast]);

  if (loading) {
    // Keep loading state simple, Layout is handled by parent route
    return <div className="flex h-full items-center justify-center">Loading workflow...</div>;
  }

  if (error) {
    return <div className="flex h-full items-center justify-center text-red-500">Error: {error.message}</div>;
  }

  if (!currentWorkflow) {
    return <div className="flex h-full items-center justify-center">No workflow selected or found.</div>;
  }
  
  // Handle the canvas loading state within the main return if needed, or simplify
  if (nodes.length === 0 && currentWorkflow.nodes && currentWorkflow.nodes.length > 0) {
    console.log("[Index.tsx Render] Waiting for nodes/edges state to sync with currentWorkflow...");
    // Return the specific loading indicator for the content area
    return (
      <div className="flex-1 flex items-center justify-center p-6">Loading canvas...</div>
    ); 
  }

  // Return only the WorkflowDesigner, not wrapped in Layout
  return (
    <WorkflowDesigner 
      key={currentWorkflow.id}
      nodes={nodes}
      edges={edges}
      setNodes={setNodes}
      setEdges={setEdges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      reactFlowInstance={reactFlowInstance}
      setReactFlowInstance={setReactFlowInstance}
      onSave={saveWorkflow}
      workflowName={currentWorkflow.name}
      workflowId={currentWorkflow.id}
      workflowFolder={currentWorkflow.folder}
      onWorkflowChange={handleSelectWorkflow}
      allWorkflows={workflows}
      onCreateWorkflow={handleCreateWorkflow}
      onFolderChange={handleFolderChange}
      onRenameWorkflow={handleRenameWorkflow}
      allFolders={folders.map(f => f.name)}
      isWorkflowModified={isWorkflowModified}
      setIsWorkflowModified={setIsWorkflowModified}
    />
  );
}
