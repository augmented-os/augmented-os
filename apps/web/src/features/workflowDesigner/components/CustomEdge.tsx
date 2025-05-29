import React, { useMemo } from 'react';
import { BaseEdge, EdgeLabelRenderer, getBezierPath, useReactFlow, EdgeProps, MarkerType, useNodes, EdgeMarker } from 'reactflow';
import { X } from 'lucide-react';
import { NodeData } from '@/types/workflow';

// Define custom marker interface that extends MarkerType
interface CustomMarker {
  type: MarkerType | string;
  color?: string;
  width?: number;
  height?: number;
  [key: string]: any;
}

const CustomEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  selected,
  sourceHandleId,
  source,
}) => {
  const { setEdges } = useReactFlow();
  const nodes = useNodes<NodeData>();

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // --- Calculate Dynamic Edge Color --- 
  const dynamicColor = useMemo(() => {
    // Default color
    let color = '#9ca3af'; // Default grey

    if (sourceHandleId && source) {
      const sourceNode = nodes.find(n => n.id === source);
      // Expecting handleId format: ${nodeId}-${branchId}
      // Check if handleId actually contains the source node ID prefix
      if (sourceNode && sourceHandleId.startsWith(`${source}-`)) {
        const branchId = sourceHandleId.substring(source.length + 1);
        // Access branches from the top level of data
        const branches = sourceNode.data?.branches; 
        if (Array.isArray(branches)) {
          const branch = branches.find(b => b.id === branchId);
          if (branch && branch.color) {
            color = branch.color;
          }
        }
      }
    }
    // Return the determined color (branch color or default grey)
    return color;
  }, [source, sourceHandleId, nodes]); // Dependencies for memoization

  const onEdgeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEdges((edges) => edges.filter((edge) => edge.id !== id));
  };

  // Apply blue glow styling when edge is selected
  const edgeStyle = useMemo(() => ({
    ...style,
    stroke: selected ? '#0EA5E9' : (dynamicColor || style.stroke || '#9ca3af'),
    strokeWidth: selected ? 3 : style.strokeWidth || 2,
    filter: selected ? 'drop-shadow(0 0 5px rgba(14, 165, 233, 0.7))' : undefined,
  }), [selected, dynamicColor, style]);

  // --- Calculate Marker End --- 
  const finalMarkerEnd: EdgeMarker | undefined = useMemo(() => {
    const defaultColor = dynamicColor || '#9ca3af';
    const selectedColor = '#0EA5E9';
    // Base color determined by selection or dynamic color
    const baseColor = selected ? selectedColor : defaultColor;

    // Default marker type
    let finalType: MarkerType = MarkerType.Arrow;
    const finalConfig: Omit<EdgeMarker, 'type' | 'color'> = {};

    // Case 1: markerEnd is a valid object
    if (typeof markerEnd === 'object' && markerEnd !== null) {
      const markerConfig = markerEnd as EdgeMarker; // Assert type as we did before

      // Use provided type if it's a valid MarkerType, otherwise default to Arrow
      if (markerConfig.type && Object.values(MarkerType).includes(markerConfig.type as MarkerType)) {
        finalType = markerConfig.type as MarkerType;
      }

      // Copy other valid properties (width, height, etc.)
      if (markerConfig.width != null) finalConfig.width = markerConfig.width;
      if (markerConfig.height != null) finalConfig.height = markerConfig.height;
      if (markerConfig.markerUnits) finalConfig.markerUnits = markerConfig.markerUnits;
      if (markerConfig.orient) finalConfig.orient = markerConfig.orient;
      if (markerConfig.strokeWidth != null) finalConfig.strokeWidth = markerConfig.strokeWidth;
    }
    // Case 2: markerEnd is a non-empty string
    else if (typeof markerEnd === 'string' && markerEnd) {
      // Use provided type if it's a valid MarkerType, otherwise default to Arrow
      if (Object.values(MarkerType).includes(markerEnd as MarkerType)) {
        finalType = markerEnd as MarkerType;
      }
    }

    // Construct the final marker object using the determined type, color, and config
    return {
      type: finalType,
      color: baseColor,
      ...finalConfig,
    };
  }, [markerEnd, selected, dynamicColor]);

  return (
    <>
      {/* @ts-expect-error Type mismatch likely due to complex type inference for BaseEdge prop */}
      <BaseEdge 
        path={edgePath} 
        markerEnd={finalMarkerEnd}
        style={edgeStyle}
      />
      <EdgeLabelRenderer>
        <div
          className="absolute flex items-center justify-center w-5 h-5 bg-white rounded-full shadow-md cursor-pointer border border-gray-200 transition-opacity opacity-0 hover:opacity-100"
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
          }}
          onClick={onEdgeClick}
        >
          <X className="h-3 w-3 text-gray-500" />
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export default CustomEdge;
