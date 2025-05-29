import React, { useState, useEffect } from 'react';
import { Edge } from 'reactflow';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

// Define props for EdgeConfig
interface EdgeConfigProps {
  edgeData: Edge;
  onUpdate: (updatedEdge: Edge) => void;
  multipleEdges?: Edge[]; // Array of selected edges if multiple
  onBulkUpdate?: (updatedEdges: Edge[]) => void;
}

export const EdgeConfig: React.FC<EdgeConfigProps> = ({ 
  edgeData, 
  onUpdate,
  multipleEdges = [], // Default to empty array
  onBulkUpdate
}) => {
  const { toast } = useToast();
  const isBulkEdit = multipleEdges.length > 1;

  // --- State Management (Edge Specific) ---
  const [edgeType, setEdgeType] = useState('custom');
  const [edgeLabel, setEdgeLabel] = useState('');
  const [edgeStrokeWidth, setEdgeStrokeWidth] = useState<string>('2');
  const [edgeAnimated, setEdgeAnimated] = useState('false');

  // --- Synchronization Effect (Edge Specific) ---
  useEffect(() => {
    // Use the first edge's data as base for bulk edit form
    const data = edgeData;
    setEdgeType(data.type || 'custom');
    setEdgeLabel(String(data.label || ''));
    setEdgeStrokeWidth(String(data.style?.strokeWidth || 2));
    setEdgeAnimated(data.animated ? 'true' : 'false');
  }, [edgeData, multipleEdges]);

  // --- Save Handler (Edge Specific) ---
  const handleEdgeSave = () => {
    // Handle bulk update case for edges
    if (isBulkEdit && onBulkUpdate) {
      const updatedEdges = multipleEdges.map(edge => {
        return {
          ...edge,
          type: edgeType || 'custom',
          label: edgeLabel || undefined,
          style: { ...edge.style, strokeWidth: Number(edgeStrokeWidth) || 2 },
          animated: edgeAnimated === 'true',
        };
      });
      
      onBulkUpdate(updatedEdges);
      toast({
        title: "Edges Updated",
        description: `Updated ${updatedEdges.length} edges.`
      });
      return;
    }

    // Single edge update case
    const updatedEdge: Edge = {
      ...edgeData,
      type: edgeType || 'custom',
      label: edgeLabel || undefined,
      style: { ...edgeData.style, strokeWidth: Number(edgeStrokeWidth) || 2 },
      animated: edgeAnimated === 'true',
    };

    if (onUpdate) {
      onUpdate(updatedEdge);
      toast({
        title: "Edge Updated",
        description: "Connection configuration updated."
      });
    } else {
      console.error("EdgeConfig: onUpdate handler is missing.");
      toast({
        title: "Update Failed",
        description: "Unable to update edge. Handler missing.",
        variant: "destructive"
      });
    }
  };

  // --- Render Logic (Edge Specific) ---
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="edge-label" className="block text-sm font-medium text-gray-700">Label</label>
        <Input 
          id="edge-label" 
          value={edgeLabel} 
          onChange={(e) => setEdgeLabel(e.target.value)} 
          placeholder="Optional edge label"
          className="mt-1"
        />
      </div>

      <div>
        <label htmlFor="edge-type" className="block text-sm font-medium text-gray-700">Type</label>
        <Select value={edgeType} onValueChange={setEdgeType}>
          <SelectTrigger id="edge-type" className="mt-1">
            <SelectValue placeholder="Select edge type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="straight">Straight</SelectItem>
            <SelectItem value="step">Step</SelectItem>
            <SelectItem value="smoothstep">Smooth Step</SelectItem>
            <SelectItem value="simplebezier">Simple Bezier</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label htmlFor="edge-stroke" className="block text-sm font-medium text-gray-700">Stroke Width</label>
        <Input 
          id="edge-stroke" 
          type="number" 
          value={edgeStrokeWidth} 
          onChange={(e) => setEdgeStrokeWidth(e.target.value)} 
          className="mt-1"
          min="1"
          max="10"
        />
      </div>

      <div>
        <label htmlFor="edge-animated" className="block text-sm font-medium text-gray-700">Animated</label>
        <Select value={edgeAnimated} onValueChange={setEdgeAnimated}>
          <SelectTrigger id="edge-animated" className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Yes</SelectItem>
            <SelectItem value="false">No</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button onClick={handleEdgeSave} className="w-full">
        {isBulkEdit ? `Update ${multipleEdges.length} Edges` : 'Update Connection'}
      </Button>
    </div>
  );
}; 