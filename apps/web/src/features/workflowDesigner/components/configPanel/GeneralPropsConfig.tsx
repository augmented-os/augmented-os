import React, { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { useConfigSection } from '@/features/workflowDesigner/hooks';

interface GeneralPropsSectionProps {
  nodeLabel: string;
  setNodeLabel: (val: string) => void;
  nodeSublabel: string;
  setNodeSublabel: (val: string) => void;
  nodeDescription: string;
  setNodeDescription: (val: string) => void;
  onSave: () => void;
  onCancelEdit?: () => void;
  sectionId: string;
  elementId: string;
}

export const GeneralPropsSection: React.FC<GeneralPropsSectionProps> = ({
  nodeLabel,
  setNodeLabel,
  nodeSublabel,
  setNodeSublabel,
  nodeDescription,
  setNodeDescription,
  onSave,
  onCancelEdit,
  sectionId,
  elementId,
}) => {
  console.log('Rendering GeneralPropsSection');
  const configState = useConfigSection(sectionId, elementId);
  console.log(`[GeneralPropsSection - ${sectionId}] Hook State: isEditing=${configState.isEditing}, isDisabled=${configState.isDisabled}`);
  const { isEditing, isDisabled, startEditing, stopEditing } = configState;

  const [initialState, setInitialState] = useState({ label: '', sublabel: '', description: '' });

  useEffect(() => {
    if (isEditing) {
      setInitialState(currentBuffer => 
        (currentBuffer.label === '' && currentBuffer.sublabel === '' && currentBuffer.description === '')
          ? { label: nodeLabel, sublabel: nodeSublabel, description: nodeDescription }
          : currentBuffer
      );
    } else {
      setInitialState({ label: '', sublabel: '', description: '' });
    }
  }, [isEditing, nodeLabel, nodeSublabel, nodeDescription]);

  const handleEditClick = () => {
    if (!isDisabled) {
      startEditing();
    }
  };

  const handleSaveClick = () => {
    onSave();
    stopEditing();
  };

  const handleCancelClick = () => {
    setNodeLabel(initialState.label);
    setNodeSublabel(initialState.sublabel);
    setNodeDescription(initialState.description);
    if (onCancelEdit) {
      onCancelEdit();
    }
    stopEditing();
  };

  if (isEditing) {
    return (
      <div className="space-y-4 p-4 border rounded-md bg-gray-50/50 mb-4">
        <div>
          <label htmlFor="node-label" className="block text-sm font-medium text-gray-700">Label</label>
          <Input
            id="node-label"
            value={nodeLabel}
            onChange={(e) => setNodeLabel(e.target.value)}
            placeholder="Enter node label"
            className="mt-1"
          />
        </div>
        <div>
          <label htmlFor="node-sublabel" className="block text-sm font-medium text-gray-700">Sublabel</label>
          <Input
            id="node-sublabel"
            value={nodeSublabel}
            onChange={(e) => setNodeSublabel(e.target.value)}
            placeholder="Enter node sublabel"
            className="mt-1"
          />
        </div>
        <div>
          <label htmlFor="node-description" className="block text-sm font-medium text-gray-700">Description</label>
          <Textarea
            id="node-description"
            value={nodeDescription}
            onChange={(e) => setNodeDescription(e.target.value)}
            placeholder="Optional description for the node"
            className="mt-1"
            rows={3}
          />
        </div>
        <div className="flex justify-end gap-2 mt-2">
          <Button variant="outline" size="sm" onClick={handleCancelClick}>Cancel</Button>
          <Button size="sm" onClick={handleSaveClick}>Save</Button>
        </div>
      </div>
    );
  } else {
    const hasSublabel = !!nodeSublabel;
    const hasDescription = !!nodeDescription;
    return (
      <div className="relative group mb-4 pl-0.5">
        <h2 className="text-lg font-semibold text-gray-800 truncate mb-1" title={nodeLabel}>
          {nodeLabel || 'Untitled Node'}
        </h2>
        {hasSublabel && (
          <p className="text-sm text-gray-600">{nodeSublabel}</p>
        )}
        {hasDescription && (
          <p className="text-sm text-gray-800 whitespace-pre-wrap italic mt-1">{nodeDescription}</p>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-0 right-0 h-7 w-7 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleEditClick}
          title={isDisabled ? "Close other sections to edit" : "Edit Properties"}
          disabled={isDisabled}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </div>
    );
  }
}; 