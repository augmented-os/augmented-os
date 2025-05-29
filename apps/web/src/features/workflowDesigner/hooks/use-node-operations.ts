import { useCallback, useRef } from 'react';
import { 
  Node, 
  Edge, 
  ReactFlowInstance,
  NodeChange,
  applyNodeChanges, 
  EdgeChange, 
  applyEdgeChanges,
  Connection,
  addEdge,
  MarkerType,
  XYPosition
} from 'reactflow';
import { nanoid } from 'nanoid';
import { NodeData } from '../types';
import { NODE_TYPES } from '@/types/workflow';

// Define types of changes that constitute a modification
const NODE_MODIFYING_CHANGE_TYPES: NodeChange['type'][] = ['position', 'remove', 'add'];
const EDGE_MODIFYING_CHANGE_TYPES: EdgeChange['type'][] = ['remove', 'add'];

/**
 * Custom hook for node operations in the workflow designer
 */
export function useNodeOperations(
  nodes: Node[],
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>,
  edges: Edge[],
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>,
  reactFlowInstance: ReactFlowInstance | null,
  snapGrid: [number, number] = [20, 20],
  markAsModified?: () => void
) {

  // Handle node changes with protection for input/output nodes
  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      // Optional: Keep logging if helpful
      console.log('[handleNodesChange] Raw changes received:', JSON.stringify(changes));

      // Keep filtering for input/output node deletion
      const filteredChanges = changes.filter(change => {
        if (change.type === 'remove') {
          const node = nodes.find(n => n.id === change.id);
          return !node || node.data.type !== NODE_TYPES.WORKFLOW_INPUT;
        }
        return true;
      });

      // *** SIMPLIFIED MODIFICATION CHECK ***
      // Only consider add/remove as modifications within this handler.
      // Drag modifications are handled by onNodeDragStop in FlowCanvas.
      const modificationDetected = changes.some((c) => {
          return c.type === 'add' || c.type === 'remove';
      });

      // Apply the filtered visual changes
      setNodes((nds) => applyNodeChanges(filteredChanges, nds));

      // Optional: Keep logging if helpful
      console.log(`[handleNodesChange] Final check -> modificationDetected: ${modificationDetected}`);

      // Mark as modified if add/remove detected
      if (modificationDetected && markAsModified) {
        console.warn('[handleNodesChange - Add/Remove] >>> Calling markAsModified! <<<');
        markAsModified();
      }
    },
    [nodes, setNodes, markAsModified] // Dependencies remain the same
  );

  // Handle edge changes
  const handleEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      // Check if any changes actually modify the workflow structure
      const hasModifyingChanges = changes.some(change => 
        EDGE_MODIFYING_CHANGE_TYPES.includes(change.type)
      );
      
      setEdges((eds) => applyEdgeChanges(changes, eds));
      
      // Mark as modified ONLY for relevant change types
      if (hasModifyingChanges && markAsModified) {
        markAsModified();
      }
    },
    [setEdges, markAsModified]
  );

  // Handle connecting nodes
  const onConnect = useCallback((connection: Connection) => {
    // Extract sourceHandle and source node ID
    const { sourceHandle, source } = connection;
    let edgeData = {};
    let specificSourceHandle = undefined;

    // Check if the connection originates from a specific branch handle
    if (source && sourceHandle && sourceHandle.startsWith(`${source}-`)) {
      const branchId = sourceHandle.substring(source.length + 1);
      edgeData = { branchId: branchId }; // Store branchId in edge data
      specificSourceHandle = sourceHandle; // Preserve the specific source handle
      console.log(`[onConnect] Edge from branch: ${branchId}, Handle: ${specificSourceHandle}`);
    } else {
       console.log(`[onConnect] Edge from default handle or unknown source.`);
       // Ensure sourceHandle is explicitly null/undefined for default connections if needed by loader
       // If connection object already has null, we don't need to force it.
       specificSourceHandle = connection.sourceHandle; // Use whatever came in (null/undefined for default)
    }

    const newEdge: Edge = {
      ...connection,
      id: `edge-${nanoid(8)}`, // Ensure unique edge ID
      type: 'custom', // Use our custom edge
      sourceHandle: specificSourceHandle, // Set the correct sourceHandle
      data: edgeData, // Add branchId to data payload if applicable
      markerEnd: { type: MarkerType.ArrowClosed },
    };

    console.log('[onConnect] Creating new edge:', newEdge);
    setEdges((eds) => addEdge(newEdge, eds));
    
    // Mark as modified when connecting nodes
    if (markAsModified) {
      markAsModified();
    }
  }, [setEdges, markAsModified]);

  // Handle adding a node from the panel or overlay
  const onAddNode = useCallback(
    (type: string, label: string) => {
      if (!reactFlowInstance) return;

      // Prevent adding multiple workflow input nodes
      if (type === NODE_TYPES.WORKFLOW_INPUT) {
        const hasInputNode = nodes.some(node => node.data.type === NODE_TYPES.WORKFLOW_INPUT);
        if (hasInputNode) {
          console.warn('Only one workflow input node is allowed');
          return;
        }
      }
      
      // Center of the current viewport
      const center = reactFlowInstance.screenToFlowPosition({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      });
      
      const newNodeId = `node-${Date.now()}`;
      
      // Typical node dimensions
      const nodeWidth = 132; // Half of 264px
      const nodeHeight = 25; // Adjusted to better align with mouse pointer
      
      const newNode = {
        id: newNodeId,
        type: 'custom',
        data: { 
          label, 
          sublabel: type,
          type: type, // Using the node type to determine the icon
          hasMenu: true
        },
        position: {
          x: Math.round((center.x - nodeWidth) / snapGrid[0]) * snapGrid[0],
          y: Math.round((center.y - nodeHeight) / snapGrid[1]) * snapGrid[1],
        },
      };
      
      setNodes((nds) => [...nds, newNode]);
      
      // Mark as modified when adding a node
      if (markAsModified) {
        markAsModified();
      }
      
      return newNode;
    },
    [reactFlowInstance, setNodes, snapGrid, nodes, markAsModified]
  );

  // Handle drop event when adding new nodes
  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      if (!reactFlowInstance) {
        return;
      }

      try {
        const reactFlowBounds = event.currentTarget.getBoundingClientRect();
        const data = event.dataTransfer.getData('application/reactflow');
        
        if (!data) return;
        
        const { type, label, icon, description } = JSON.parse(data);
        
        // Prevent adding multiple workflow input nodes
        if (type === NODE_TYPES.WORKFLOW_INPUT) {
          const hasInputNode = nodes.some(node => node.data.type === NODE_TYPES.WORKFLOW_INPUT);
          if (hasInputNode) {
            console.warn('Only one workflow input node is allowed');
            return;
          }
        }
        
        // Get the raw drop position
        const position = reactFlowInstance.screenToFlowPosition({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });

        // Create a new node at the drop position using the node data
        const newNodeId = `${type}_${nodes.length + 1}`;
        
        const newNodeData: NodeData = {
          label,
          sublabel: description,
          type: type // Set the type instead of icon
        };

        // Offset for centering - typical node is around 264px wide and 76px tall
        // Apply half of these values as offset (with snapping)
        const nodeWidth = 132; // Half of 264px
        const nodeHeight = 25; // Adjusted to better align with mouse pointer

        // Calculate centered position with snap grid
        const centeredPosition = {
          x: Math.round((position.x - nodeWidth) / snapGrid[0]) * snapGrid[0],
          y: Math.round((position.y - nodeHeight) / snapGrid[1]) * snapGrid[1],
        };

        // Add the new node to the node state
        reactFlowInstance.addNodes({
          id: newNodeId,
          type: 'custom',
          position: centeredPosition,
          data: newNodeData,
        });
        
        // Mark as modified when dropping a node
        if (markAsModified) {
          markAsModified();
        }
      } catch (error) {
        console.error('Error adding new node:', error);
      }
    },
    [reactFlowInstance, setNodes, snapGrid, nodes, markAsModified]
  );
  
  // Handle drag over for drop target
  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Create a new node programmatically
  const createNode = useCallback(
    (type: string, position: XYPosition, data: any = {}) => {
      // Prevent adding multiple workflow input nodes
      if (type === NODE_TYPES.WORKFLOW_INPUT) {
        const hasInputNode = nodes.some(node => node.data.type === NODE_TYPES.WORKFLOW_INPUT);
        if (hasInputNode) {
          console.warn('Only one workflow input node is allowed');
          return null;
        }
      }
    
      const newNode = {
        id: nanoid(),
        type: 'custom',
        position,
        data: { 
          ...data,
          type: type
        },
      };
      
      setNodes((nds) => [...nds, newNode]);
      
      // Mark as modified when creating a node
      if (markAsModified) {
        markAsModified();
      }
      
      return newNode;
    },
    [setNodes, nodes, markAsModified]
  );

  return {
    handleNodesChange,
    handleEdgesChange,
    onConnect,
    onAddNode,
    onDrop,
    onDragOver,
    createNode
  };
} 