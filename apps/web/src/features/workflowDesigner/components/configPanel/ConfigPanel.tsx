import React from 'react';
import { Edge, Node } from 'reactflow';
import { NodeData } from '@/types/workflow'; // Keep NodeData import
import { useToast } from '@/components/ui/use-toast'; // Keep toast for potential messages

// Import the new components
import { NodeConfig } from './NodeConfig';
import { EdgeConfig } from './EdgeConfig';

// Keep the original props interface
interface ConfigPanelProps {
  elementType?: 'node' | 'edge'; // Make elementType optional to handle no selection
  elementData?: Node | Edge;    // Make elementData optional
  onUpdate?: (updatedElement: Node | Edge) => void;
  multipleElements?: {type: 'node' | 'edge', data: Node | Edge}[];
  onBulkUpdate?: (updatedElements: (Node | Edge)[]) => void;
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({ 
  elementType,
  elementData,
  onUpdate,
  multipleElements,
  onBulkUpdate
}) => {
  const { toast } = useToast(); // Keep toast if needed for messages here
  const hasMultipleSelections = multipleElements && multipleElements.length > 1;


  // --- Render Logic (Orchestration) ---
  const renderContent = () => {
    if (hasMultipleSelections) {
      // Determine if the selection contains only nodes, only edges, or mixed
      const hasNodes = multipleElements.some(el => el.type === 'node');
      const hasEdges = multipleElements.some(el => el.type === 'edge');

      if (hasNodes && !hasEdges) {
        // Only nodes selected
        const selectedNodes = multipleElements.map(el => el.data as Node<NodeData>);
        // Pass the first node as primary data, and the full list for bulk logic
        return (
          <NodeConfig 
            nodeData={selectedNodes[0]} 
            onUpdate={onUpdate as (updatedNode: Node<NodeData>) => void} // Needs type assertion or better handling
            multipleNodes={selectedNodes}
            onBulkUpdate={onBulkUpdate as (updatedNodes: Node<NodeData>[]) => void} // Needs type assertion
          />
        );
      } else if (!hasNodes && hasEdges) {
        // Only edges selected
        const selectedEdges = multipleElements.map(el => el.data as Edge);
        return (
          <EdgeConfig 
            edgeData={selectedEdges[0]} 
            onUpdate={onUpdate as (updatedEdge: Edge) => void} // Needs type assertion
            multipleEdges={selectedEdges}
            onBulkUpdate={onBulkUpdate as (updatedEdges: Edge[]) => void} // Needs type assertion
          />
        );
      } else {
        // Mixed selection - show a message or limited common fields
        return <p className="text-sm text-gray-500 p-4">Mixed selection (nodes and edges). Bulk editing for mixed types is not supported.</p>;
      }
    } else if (elementType === 'node' && elementData && onUpdate) {
      // Single node selected
      const node = elementData as Node<NodeData>; // Cast once

      // Always render NodeConfig for single node selection
      return (
        <NodeConfig 
          nodeData={node} // Use the casted node
          onUpdate={onUpdate as (updatedNode: Node<NodeData>) => void} // Type assertion
          // No multipleNodes or onBulkUpdate needed here
        />
      );
    } else if (elementType === 'edge' && elementData && onUpdate) {
      // Single edge selected
      return (
        <EdgeConfig 
          edgeData={elementData as Edge} 
          onUpdate={onUpdate as (updatedEdge: Edge) => void} // Type assertion
          // No multipleEdges or onBulkUpdate needed here
        />
      );
    } else {
      // No element selected or missing required props
      return <p className="text-sm text-gray-500 p-4">Select a node or connection to configure.</p>;
    }
  };

  return (
    <div className="bg-white shadow rounded-lg border border-gray-200 flex flex-col flex-1 min-h-0">
      <div className="flex-1 p-4 min-h-0 overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default ConfigPanel;