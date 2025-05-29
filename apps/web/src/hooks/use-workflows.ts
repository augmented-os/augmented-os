import { useState, useEffect, useCallback } from 'react';
import { Node, Edge } from 'reactflow';
import { 
  fetchWorkflows, 
  fetchWorkflowById, 
  createWorkflow, 
  updateWorkflow, 
  deleteWorkflow,
  fetchAllFolders
} from '@/data/workflowService';
import { NODE_TYPES, Workflow } from "@/types/workflow";

const GRID_STEP = 20;
const DEFAULT_NEW_WORKFLOW_NODES: Node[] = [
  {
    id: 'input-1', 
    type: 'custom',
    position: { 
      x: Math.round(260 / GRID_STEP) * GRID_STEP,
      y: Math.round(80 / GRID_STEP) * GRID_STEP 
    }, 
    data: { 
      label: 'Workflow Input', 
      type: NODE_TYPES.WORKFLOW_INPUT,
      description: 'Starting point for the workflow data.',
    },
  },
];
const DEFAULT_NEW_WORKFLOW_EDGES: Edge[] = [];

interface WorkflowFolder {
  id: string;
  name: string;
}

interface UseWorkflowsOptions {
  initialWorkflowId?: string;
  autoFetch?: boolean;
  targetWorkflowId?: string;
}

export function useWorkflows(options: UseWorkflowsOptions = {}) {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [currentWorkflow, setCurrentWorkflow] = useState<Workflow | null>(null);
  const [folders, setFolders] = useState<WorkflowFolder[]>([]);
  const [loading, setLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Fetch all workflows
  const fetchAllWorkflows = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWorkflows();
      setWorkflows(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error fetching workflows'));
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch a specific workflow
  const fetchWorkflow = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWorkflowById(id);
      setCurrentWorkflow(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Unknown error fetching workflow ${id}`));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch all folders
  const fetchFolders = useCallback(async () => {
    try {
      const data = await fetchAllFolders();
      setFolders(data);
      return data;
    } catch (err) {
      console.error('Error fetching folders:', err);
      return [];
    }
  }, []);

  // Create a new workflow
  const createNewWorkflow = useCallback(async (
    name: string,
    folder: string = 'Workflows',
    description?: string
  ) => {
    setIsUpdating(true);
    setError(null);
    try {
      const data = await createWorkflow(
        name, 
        DEFAULT_NEW_WORKFLOW_NODES, 
        DEFAULT_NEW_WORKFLOW_EDGES, 
        folder, 
        description
      );
      setWorkflows(prev => [...prev, data]);
      setCurrentWorkflow(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error creating workflow'));
      return null;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  // Update a workflow
  const updateExistingWorkflow = useCallback(async (
    id: string,
    updates: {
      name?: string;
      nodes?: Node[];
      edges?: Edge[];
      folder?: string;
      description?: string;
    }
  ) => {
    setIsUpdating(true);
    setError(null);
    try {
      const data = await updateWorkflow(id, updates);
      
      // Update workflows list
      setWorkflows(prev => 
        prev.map(workflow => workflow.id === id ? data : workflow)
      );
      
      // Update current workflow if it was the one updated
      if (currentWorkflow?.id === id) {
        setCurrentWorkflow(data);
      }
      
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Unknown error updating workflow ${id}`));
      return null;
    } finally {
      setIsUpdating(false);
    }
  }, [currentWorkflow]);

  // Delete a workflow
  const removeWorkflow = useCallback(async (id: string) => {
    setIsUpdating(true);
    setError(null);
    try {
      await deleteWorkflow(id);
      
      // Remove from workflows list
      setWorkflows(prev => prev.filter(workflow => workflow.id !== id));
      
      // Clear current workflow if it was the one deleted
      if (currentWorkflow?.id === id) {
        setCurrentWorkflow(null);
      }
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Unknown error deleting workflow ${id}`));
      return false;
    } finally {
      setIsUpdating(false);
    }
  }, [currentWorkflow]);

  // Initial data fetching
  useEffect(() => {
    let didCancel = false;

    const initialize = async () => {
      if (options.autoFetch === false) {
        // If not auto-fetching, but a target/initial ID is provided, attempt to load it.
        if (options.targetWorkflowId) {
          await fetchWorkflow(options.targetWorkflowId);
        } else if (options.initialWorkflowId) {
          await fetchWorkflow(options.initialWorkflowId);
        }
        return;
      }

      // Auto-fetch is true
      const allWfs = await fetchAllWorkflows(); // setWorkflows is called inside
      if (didCancel) return;
      await fetchFolders(); // setFolders is called inside
      if (didCancel) return;

      let idToLoad: string | undefined | null = options.targetWorkflowId;

      if (!idToLoad && options.initialWorkflowId) {
        idToLoad = options.initialWorkflowId;
      }

      if (!idToLoad) {
        const lastActiveId = sessionStorage.getItem('lastActiveWorkflowId');
        if (lastActiveId) {
          const exists = allWfs && allWfs.some(wf => wf.id === lastActiveId);
          if (exists) {
            idToLoad = lastActiveId;
          }
        }
      }

      if (idToLoad) {
        // Only fetch if it's not already the current one,
        // or if currentWorkflow is null (to handle initial load correctly)
        if (!currentWorkflow || currentWorkflow.id !== idToLoad) {
            await fetchWorkflow(idToLoad);
        }
      } else if (allWfs && allWfs.length > 0) {
        // Only set if currentWorkflow is still null after all checks
        if (!currentWorkflow && !didCancel) {
            setCurrentWorkflow(allWfs[0]);
        }
      } else {
        // No workflows found at all, ensure currentWorkflow is null
        if (!didCancel) {
            setCurrentWorkflow(null);
        }
      }
    };

    initialize();

    return () => {
      didCancel = true;
    };
  }, [
    options.autoFetch,
    options.targetWorkflowId,
    options.initialWorkflowId,
    fetchWorkflow,      // Stable useCallback
    fetchAllWorkflows,  // Stable useCallback
    fetchFolders,       // Stable useCallback
    // currentWorkflow and workflows removed from deps to stabilize initialization
  ]);

  return {
    workflows,
    currentWorkflow,
    folders,
    loading,
    isUpdating,
    error,
    fetchAllWorkflows,
    fetchWorkflow,
    fetchFolders,
    createWorkflow: createNewWorkflow,
    updateWorkflow: updateExistingWorkflow,
    deleteWorkflow: removeWorkflow,
    setCurrentWorkflow
  };
} 