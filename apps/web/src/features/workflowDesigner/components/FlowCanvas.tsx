import { useRef, useEffect } from 'react';
import ReactFlow, {
  Background, 
  BackgroundVariant,
  Node, 
  Edge,
  MarkerType,
  SelectionMode,
  PanOnScrollMode,
  Panel,
  ReactFlowInstance,
  useReactFlow
} from 'reactflow';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RefreshCw, Maximize, Plus } from 'lucide-react';
import { useFlowViewport } from '../hooks';
import { WorkflowNode } from './WorkflowNode';
import CustomEdge from '@/features/workflowDesigner/components/CustomEdge';
import NodeTypesOverlay from './NodeTypesOverlay';
import { NodeData } from '@/types/workflow';

// Define node and edge types
const nodeTypes = { custom: WorkflowNode };
const edgeTypes = { custom: CustomEdge };

interface FlowCanvasProps {
  nodes: Node[];
  edges: Edge[];
  snapGrid: [number, number];
  isPanelVisible: boolean;
  isOverlayVisible: boolean;
  zoomLevel: number;
  reactFlowInstance: ReactFlowInstance | null;
  onInit: (instance: ReactFlowInstance) => void;
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onConnect: (params: any) => void;
  onClick: (event: React.MouseEvent) => void;
  onDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  handleOverlayToggle: () => void;
  handleOverlayClose: () => void;
  updateZoomLevel: (zoom: number) => void;
  onAddNode: (type: string, label: string) => void;
  markAsModified?: () => void;
}

export const FlowCanvas: React.FC<FlowCanvasProps> = ({
  nodes,
  edges,
  snapGrid,
  isPanelVisible,
  isOverlayVisible,
  zoomLevel,
  reactFlowInstance,
  onInit,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onClick,
  onDrop,
  onDragOver,
  handleOverlayToggle,
  handleOverlayClose,
  updateZoomLevel,
  onAddNode,
  markAsModified
}) => {
  const reactFlowRef = useRef<HTMLDivElement>(null);
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const { resetView, zoomIn, zoomOut, fitView } = useFlowViewport(reactFlowInstance);
  const flowInstance = useReactFlow();

  // Add this ref to remember the last "committed" positions
  const lastPosRef = useRef<Record<string, { x: number; y: number }>>(
    Object.fromEntries(nodes.map(n => [n.id, n.position]))
  );

  // Update lastPosRef if the external nodes array changes significantly
  // (e.g., on load, delete, add) to prevent stale comparisons.
  useEffect(() => {
    lastPosRef.current = Object.fromEntries(nodes.map(n => [n.id, n.position]));
  }, [nodes]);

  // Add ref for tracking node positions before drag
  const nodePosOnDragStart = useRef<Record<string, { x: number; y: number }>>({});

  // Handler specifically for drag start - store initial position
  const handleNodeDragStart = (_e: any, node: Node) => {
    const startPos = { ...node.position };
    console.log(`[FlowCanvas:handleNodeDragStart] Node ID: ${node.id}, Storing start position:`, startPos);
    nodePosOnDragStart.current[node.id] = startPos; // Store position when drag starts
  };

  // Handler specifically for drag stop - compare positions
  const handleNodeDragStop = (_e: any, node: Node) => {
    console.log(`[FlowCanvas:handleNodeDragStop] Node ID: ${node.id}, Final position:`, node.position);
    const startPos = nodePosOnDragStart.current[node.id];
    console.log(`[FlowCanvas:handleNodeDragStop] Retrieved start position:`, startPos);

    if (!markAsModified) {
        console.log('[FlowCanvas:handleNodeDragStop] markAsModified function is NOT available!');
        // Clear the stored start position anyway
        if (startPos) {
            delete nodePosOnDragStart.current[node.id];
        }
        return;
    }
    console.log('[FlowCanvas:handleNodeDragStop] markAsModified function IS available.');

    const positionChanged = startPos && (startPos.x !== node.position.x || startPos.y !== node.position.y);
    console.log(`[FlowCanvas:handleNodeDragStop] Position changed?`, positionChanged);

    // Check if position actually changed since drag start
    if (positionChanged) {
        console.warn('[FlowCanvas:onNodeDragStop] >>> Position changed! Calling markAsModified! <<<');
        markAsModified();
    } else {
        console.log('[FlowCanvas:handleNodeDragStop] Position did not change.');
    }

    // Clear the stored start position for this node (optional, good practice)
    if (startPos) {
        delete nodePosOnDragStart.current[node.id];
    }
  };

  // Track zoom changes
  useEffect(() => {
    if (reactFlowInstance) {
      // Get initial zoom level
      const zoom = reactFlowInstance.getViewport().zoom;
      updateZoomLevel(zoom);
      
      // Use MutationObserver to detect zoom changes
      const observer = new MutationObserver(() => {
        if (reactFlowInstance) {
          const newZoom = reactFlowInstance.getViewport().zoom;
          updateZoomLevel(newZoom);
        }
      });
      
      // Observe zoom-related DOM changes if there's a transform property
      const flowPane = document.querySelector('.react-flow__viewport');
      if (flowPane) {
        observer.observe(flowPane, { attributes: true, attributeFilter: ['style'] });
      }
      
      return () => {
        observer.disconnect();
      };
    }
  }, [reactFlowInstance, updateZoomLevel]);

  // Handle button clicks that need to convert MouseEvent to proper function calls
  const handleFitView = (e: React.MouseEvent) => {
    e.preventDefault();
    // Pass animation duration specifically for button click
    fitView({
      padding: 0.2, // Standardized padding
      duration: 300, // Animation only for button click
      minZoom: 0.2,
      maxZoom: 1.5,
      includeHiddenNodes: true
    });
  };

  return (
    <div
      ref={reactFlowRef}
      className={`w-full h-full min-h-0 overflow-hidden`}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStart={handleNodeDragStart}
        onNodeDragStop={handleNodeDragStop}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onInit={onInit}
        fitViewOptions={{ 
          padding: 0.2, // Standardized padding
          duration: 0,
          minZoom: 0.2,
          maxZoom: 1.5,
          includeHiddenNodes: true
        }}
        snapToGrid={true}
        snapGrid={snapGrid}
        minZoom={0.5}
        maxZoom={1.5}
        onClick={onClick}
        onDrop={onDrop}
        onDragOver={onDragOver}
        defaultEdgeOptions={{
          type: 'custom',
          style: { stroke: '#9ca3af', strokeWidth: 2 },
          markerEnd: {
            type: MarkerType.Arrow,
            color: '#9ca3af',
          },
        }}
        selectionKeyCode="Shift"
        selectNodesOnDrag={false}
        panOnScroll={true}
        panOnDrag={[0, 1, 2]}
        panOnScrollMode={PanOnScrollMode.Free}
        selectionOnDrag={false}
        selectionMode={SelectionMode.Full}
        multiSelectionKeyCode="Shift"
        className="selection:bg-blue-100 h-full"
        proOptions={{ hideAttribution: true }}
        deleteKeyCode={["Delete", "Backspace"]}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        elementsSelectable={true}
        nodesDraggable={true}
        nodesConnectable={true}
        zoomOnScroll={true}
        zoomOnPinch={true}
        onSelectionContextMenu={(event) => event.preventDefault()}
      >
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={20} 
          size={1.5} 
          color="#e5e7eb" 
        />

        <Panel position="bottom-center" className="mb-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex items-center p-1.5 gap-1.5">
            <Button variant="ghost" className="rounded-full h-11 w-11 p-0 flex items-center justify-center [&_svg]:!w-6 [&_svg]:!h-6 text-gray-400" onClick={zoomIn} title="Zoom In">
              <ZoomIn />
            </Button>
            <Button variant="ghost" className="rounded-full h-11 w-11 p-0 flex items-center justify-center [&_svg]:!w-6 [&_svg]:!h-6 text-gray-400" onClick={zoomOut} title="Zoom Out">
              <ZoomOut />
            </Button>
            <Button variant="ghost" className="rounded-full h-11 w-11 p-0 flex items-center justify-center [&_svg]:!w-6 [&_svg]:!h-6 text-gray-400" onClick={handleFitView} title="Fit View">
              <Maximize />
            </Button>
          </div>
        </Panel>

        {/* Only show the "Add Step" button when panel is not visible */}
        {!isPanelVisible && (
          <Panel position="top-right" className="mr-4 mt-4">
            <Button 
              ref={addButtonRef}
              variant="outline" 
              className="bg-white rounded-lg shadow-sm border border-gray-200 flex items-center gap-2 px-4 py-2"
              onClick={handleOverlayToggle}
            >
              <Plus className="h-4 w-4" />
              <span>Add Step</span>
            </Button>
          </Panel>
        )}
      </ReactFlow>

      {/* Add NodeTypesOverlay */}
      <NodeTypesOverlay
        visible={isOverlayVisible}
        buttonRef={addButtonRef}
        onClose={handleOverlayClose}
        zoom={zoomLevel}
        onAddNode={onAddNode}
        nodes={nodes}
      />
    </div>
  );
};
