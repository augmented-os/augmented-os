import { WorkflowDesigner } from '@/features/workflowDesigner';
import { useWorkflows } from '@/hooks/use-workflows';
import { useState, useEffect, useCallback } from 'react'; // Added useCallback
// Import necessary React Flow hooks and types
import { 
  Node, 
  Edge, 
  ReactFlowInstance, 
  useNodesState, 
  useEdgesState, 
  MarkerType 
} from 'reactflow';
import { useParams, useNavigate, useBlocker } from 'react-router-dom'; // Added useParams, useNavigate, and useBlocker
import { Button } from '@/components/ui/button';

export default function WorkflowsPage() {
  const { id: workflowIdFromUrl } = useParams<{ id?: string }>(); // Get id from URL
  const navigate = useNavigate(); // For updating URL

  const [isWorkflowModified, setIsWorkflowModified] = useState(false); // State for modified status

  // Navigation blocker
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isWorkflowModified &&
      currentLocation.pathname !== nextLocation.pathname
  );

  const {
    currentWorkflow,
    workflows, 
    folders,
    fetchWorkflow, 
    updateWorkflow,
    createWorkflow,
    setCurrentWorkflow, // Assuming useWorkflows exposes this, if not, alternative needed
  } = useWorkflows({ 
    autoFetch: true, 
    targetWorkflowId: workflowIdFromUrl // Pass URL id to the hook
  });

  // Use React Flow hooks for state management
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

  // Effect to sync nodes/edges state when currentWorkflow changes (Adapted from Index.tsx)
  useEffect(() => {
    if (currentWorkflow) {
      const incomingNodes = currentWorkflow.nodes || [];
      const incomingEdges = currentWorkflow.edges || [];

      // Edge processing logic from Index.tsx
      const getBranchHandleId = (nodeId: string, branchId: string): string => {
        return `${nodeId}-${branchId}`;
      };
      const processedEdges = incomingEdges.map(edge => {
        const branchId = edge.data?.branchId;
        const defaultMarker = { type: MarkerType.ArrowClosed };
        if (branchId && edge.source) { 
          const handleId = getBranchHandleId(edge.source, branchId);
          return {
            ...edge,
            sourceHandle: handleId, 
            type: edge.type || 'custom', 
            markerEnd: edge.markerEnd || defaultMarker, 
          };
        } else {
          const { sourceHandle, ...rest } = edge; 
          return { 
             ...rest, 
             sourceHandle: undefined, 
             markerEnd: edge.markerEnd || defaultMarker 
          }; 
        }
      });
      // End Edge Processing

      setNodes(incomingNodes);
      setEdges(processedEdges);

      // Optional: Fit view after setting nodes/edges if needed
      // if (reactFlowInstance) {
      //   setTimeout(() => reactFlowInstance.fitView({ padding: 0.2 }), 0);
      // }

    } else {
      setNodes([]);
      setEdges([]);
    }
  // Depend on currentWorkflow AND the setters to avoid stale closures if necessary
  //}, [currentWorkflow, setNodes, setEdges, reactFlowInstance]); 
  // Sticking to just currentWorkflow as per original Index.tsx for now
  }, [currentWorkflow, setNodes, setEdges]);
  
  // Effect to update sessionStorage when currentWorkflow changes
  useEffect(() => {
    if (currentWorkflow && currentWorkflow.id) {
      sessionStorage.setItem('lastActiveWorkflowId', currentWorkflow.id);
    }
  }, [currentWorkflow, setNodes, setEdges]);

  // Effect to synchronize URL with currentWorkflow.id
  useEffect(() => {
    if (currentWorkflow && currentWorkflow.id && currentWorkflow.id !== workflowIdFromUrl) {
      navigate(`/build/workflows/${currentWorkflow.id}`, { replace: true });
    }
    // If there's no workflowIdFromUrl and currentWorkflow gets set (e.g. to default or session one),
    // update the URL as well.
    if (!workflowIdFromUrl && currentWorkflow && currentWorkflow.id) {
      navigate(`/build/workflows/${currentWorkflow.id}`, { replace: true });
    }
  }, [currentWorkflow, workflowIdFromUrl, navigate]);
  
  // Save handler based on Index.tsx (without schema sync for now)
  const handleSave = useCallback(() => {
     if (!currentWorkflow || !reactFlowInstance) {
       console.error("Save condition not met", { currentWorkflow, reactFlowInstance });
       return;
     }
     const flow = reactFlowInstance.toObject();
     console.log("Saving flow: ", flow);
     updateWorkflow(currentWorkflow.id, { nodes: flow.nodes, edges: flow.edges })
       .then(() => {
         console.log("Workflow saved via WorkflowsPage");
         setIsWorkflowModified(false); // Reset modified state after save
       })
       .catch(err => console.error("Error saving workflow:", err));
  }, [currentWorkflow, reactFlowInstance, updateWorkflow, setIsWorkflowModified]); // Added setIsWorkflowModified

  // Main content rendering logic
  let mainContent;
  if (!currentWorkflow) {
    mainContent = (
      <div className="flex h-full w-full items-center justify-center text-sm text-gray-500">
        Pick or create a workflow…
      </div>
    );
  } else {
    mainContent = (
      <WorkflowDesigner
        key={currentWorkflow.id}
        // Core props for React Flow state
        nodes={nodes} 
        edges={edges}
        setNodes={setNodes} // Pass setter from useNodesState
        setEdges={setEdges} // Pass setter from useEdgesState
        reactFlowInstance={reactFlowInstance}
        setReactFlowInstance={setReactFlowInstance}
        // Pass handlers from useNodesState/useEdgesState
        onNodesChange={onNodesChange} 
        onEdgesChange={onEdgesChange}
        
        // Workflow context props
        workflowId={currentWorkflow.id}
        workflowName={currentWorkflow.name}
        workflowFolder={currentWorkflow.folder}
        allWorkflows={workflows}
        allFolders={folders?.map(f => f.name) || []}
        
        // Action Handlers
        onWorkflowChange={fetchWorkflow} 
        onSave={handleSave} 
        onCreateWorkflow={createWorkflow} 
        onFolderChange={(folder) => updateWorkflow(currentWorkflow.id, { folder })}
        onRenameWorkflow={(name) => updateWorkflow(currentWorkflow.id, { name })}
        isWorkflowModified={isWorkflowModified} // Pass state down
        setIsWorkflowModified={setIsWorkflowModified} // Pass setter down
      />
    );
  }

  return (
    <>
      {mainContent}
      {blocker && blocker.state === "blocked" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h2 className="text-xl font-semibold mb-4">Unsaved Changes</h2>
            <p className="mb-6">You have unsaved changes. Are you sure you want to leave?</p>
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => blocker.reset?.()}>
                Stay
              </Button>
              <Button variant="destructive" onClick={() => blocker.proceed?.()}>
                Leave
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 