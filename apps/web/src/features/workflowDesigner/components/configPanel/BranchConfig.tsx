import React, { useState, useEffect } from 'react';
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Trash2, Plus, ArrowUp, ArrowDown } from 'lucide-react';
import { nanoid } from 'nanoid';
import { ElementType } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// Import Branch type from central types
import { Branch } from '@/types/workflow';
import { ColorPalette } from '@/components/ui/ColorPalette';
import { useConfigSection } from '@/features/workflowDesigner/hooks';

// --- Local Branch Preview Component ---
interface BranchPreviewProps {
  branches: Branch[];
}

const BranchPreview: React.FC<BranchPreviewProps> = ({ branches }) => {
  if (!branches || branches.length === 0) {
    return <p className="text-sm text-gray-400 italic px-3 py-2 bg-gray-50">No conditional steps defined.</p>;
  }

  return (
    <div className="space-y-1 bg-gray-50 p-3">
      {branches.map((branch) => (
        <div key={branch.id} className="flex justify-between items-center text-sm border-b border-gray-100 last:border-b-0 py-1">
          <div className="flex items-center gap-2 flex-grow min-w-0 pr-2">
            <Badge 
              variant="outline" 
              className="text-xs font-normal border flex-shrink-0"
              style={{ backgroundColor: branch.color || '#e5e7eb', borderColor: branch.color ? 'transparent' : '#d1d5db' }}
            >
              &nbsp;
            </Badge>
            <span className="text-gray-700 font-medium truncate" title={branch.name}>
              {branch.name || 'Unnamed Step'}
            </span>
          </div>
          <div className="flex items-center flex-shrink-0">
            <span className="text-xs text-gray-500 truncate" title={branch.condition}>
                {branch.condition === 'otherwise' ? 'Otherwise' : branch.condition}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

// --- Collapsible Branch Section Component ---
interface CollapsibleBranchSectionProps {
  title: string;
  description: string;
  branches: Branch[];
  onUpdate: (updatedBranches: Branch[]) => void;
  disabled?: boolean;
  icon?: ElementType;
  sectionId: string;
  elementId: string;
}

export const CollapsibleBranchSection: React.FC<CollapsibleBranchSectionProps> = ({
  title,
  description,
  branches = [],
  onUpdate,
  disabled = false,
  icon: Icon,
  sectionId,
  elementId
}) => {
  const [localBranches, setLocalBranches] = useState<Branch[]>([]);
  const [openPickerId, setOpenPickerId] = useState<string | null>(null);
  const [initialBranchesOnEdit, setInitialBranchesOnEdit] = useState<Branch[] | null>(null);

  // Use the config section hook
  const { isDisabled, isEditing, startEditing, stopEditing } = useConfigSection(sectionId, elementId);
  
  // Combine passed disabled prop with the global state
  const effectiveDisabled = disabled || isDisabled;
  
  // Effect to manage initial state buffering when editing starts/stops or element changes
  useEffect(() => {
    if (isEditing && initialBranchesOnEdit === null) {
      // Editing just started, buffer the initial state
      const deepCopy = branches.map(b => ({ ...b }));
      setInitialBranchesOnEdit(deepCopy);
      setLocalBranches(deepCopy);
      console.log("Branch Section: Editing started, buffered initial state:", deepCopy);
    } else if (!isEditing && initialBranchesOnEdit !== null) {
      // Editing stopped, clear the buffer
      setInitialBranchesOnEdit(null);
      console.log("Branch Section: Editing stopped, cleared buffer.");
    }
    // Intentionally excluding localBranches from dependencies
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [isEditing, branches, elementId]); // Rerun if editing state, base branches, or node changes

  // Effect to reset buffer if the elementId changes (selected node changes)
  useEffect(() => {
    console.log(`Branch Section: Element ID changed to ${elementId}. Resetting buffer.`);
    setInitialBranchesOnEdit(null); // Clear buffer on node change
    // No need to stop editing here, useConfigSection likely handles this when elementId changes
  }, [elementId]);

  const handleBranchChange = (id: string, field: keyof Branch, value: string) => {
    setLocalBranches(prev => 
      prev.map(branch => 
        branch.id === id ? { ...branch, [field]: value } : branch
      )
    );
  };

  const addBranch = () => {
    setLocalBranches(prev => [
      ...prev,
      { id: `br-${nanoid(8)}`, name: '', color: '#cccccc', condition: '' }
    ]);
  };

  const removeBranch = (id: string) => {
    setLocalBranches(prev => prev.filter(branch => branch.id !== id));
  };

  const moveBranch = (index: number, direction: 'up' | 'down') => {
    setLocalBranches(prev => {
      const newBranches = [...prev];
      const item = newBranches[index];
      const swapIndex = direction === 'up' ? index - 1 : index + 1;

      if (swapIndex < 0 || swapIndex >= newBranches.length) {
        return newBranches;
      }

      newBranches[index] = newBranches[swapIndex];
      newBranches[swapIndex] = item;

      return newBranches;
    });
  };

  const handleUpdateClick = () => {
    onUpdate(localBranches);
    stopEditing(); // Call stopEditing
  };

  const handleCancelClick = () => {
    if (initialBranchesOnEdit) {
      console.log("Branch Section: Cancel clicked, reverting to:", initialBranchesOnEdit);
      setLocalBranches(initialBranchesOnEdit); // Revert to the state when editing started
    } else {
      console.log("Branch Section: Cancel clicked, but no initial state buffered.");
      // Fallback: reset to current prop state if buffer somehow missing
      setLocalBranches(branches.map(b => ({ ...b }))); 
    }
    // onCancel(); // No longer needed
    stopEditing(); // Call stopEditing
  };

  const branchCount = isEditing ? localBranches.length : branches.length; // Show local count while editing

  return (
    <div className={`mt-4 ${effectiveDisabled ? 'opacity-70' : ''}`}>
      <Collapsible 
        open={isEditing} // Use isEditing directly from the hook
        className="space-y-0" 
      >
        <CollapsibleTrigger 
          asChild // Render as button
        >
          <button
            type="button"
            onClick={() => { if (!effectiveDisabled) startEditing(); }} // Call startEditing on click
            disabled={effectiveDisabled} // Use effectiveDisabled
            className="flex justify-between items-center w-full h-12 px-3 text-left text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-t-md border border-gray-200 disabled:opacity-70 disabled:cursor-not-allowed data-[state=open]:bg-gray-200 data-[state=closed]:hover:bg-gray-200"
          >
            <span className="flex items-center gap-2">
              {Icon && <Icon className={`h-4 w-4 ${isEditing ? 'text-blue-600' : 'text-gray-500'}`} />}
              {title} ({branchCount} step{branchCount === 1 ? '' : 's'})
            </span>
            <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${isEditing ? 'rotate-90' : ''}`} />
          </button>
        </CollapsibleTrigger>
        
        {/* --- Preview Mode --- */}
        {!isEditing && (
          <div className="mt-0 border border-gray-200 border-t-0 rounded-b-md">
            {/* Always show preview based on original branches prop when not editing */} 
            <BranchPreview branches={branches} /> 
          </div>
        )}

        {/* --- Edit Mode --- */}
        <CollapsibleContent className="pt-0 border border-gray-200 border-t-0 rounded-b-md bg-white" hidden={!isEditing}>
          {/* Render content only when isEditing is true */} 
          {/* Note: Content is wrapped directly inside CollapsibleContent */} 
          {/* The hidden prop on CollapsibleContent handles visibility */}
          <div className="p-3 space-y-3"> 
            {description && <p className="text-sm text-gray-600 mb-2">{description}</p>}
            
            {localBranches.map((branch, index) => (
              <div key={branch.id} className="p-2 border rounded bg-gray-50/80 flex flex-col">
                {/* Row 1: Color, Name, Reorder */}
                <div className="flex items-center gap-2 w-full">
                  <div className="flex-shrink-0 relative">
                    <Popover open={openPickerId === branch.id} onOpenChange={(isOpen) => setOpenPickerId(isOpen ? branch.id : null)}>
                      <PopoverTrigger asChild>
                        <Button type="button" size="icon" variant="outline" className="w-6 h-6 p-0 border flex-shrink-0" style={{ backgroundColor: branch.color || '#cccccc' }} title="Choose Color">
                          <span className="sr-only">Select Color</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <ColorPalette selectedColor={branch.color} onColorSelect={(color) => { handleBranchChange(branch.id, 'color', color); setOpenPickerId(null); }} />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <Input id={`branch-name-${branch.id}`} value={branch.name} onChange={(e) => handleBranchChange(branch.id, 'name', e.target.value)} placeholder="Step Name" className="text-sm flex-grow h-8" />
                  <div className="flex flex-col gap-0.5">
                    <Button variant="ghost" size="icon" className="h-4 w-4 text-gray-400 hover:text-blue-600" onClick={() => moveBranch(index, 'up')} disabled={index === 0} title="Move Up"><ArrowUp className="h-3 w-3" /></Button>
                    <Button variant="ghost" size="icon" className="h-4 w-4 text-gray-400 hover:text-blue-600" onClick={() => moveBranch(index, 'down')} disabled={index === localBranches.length - 1} title="Move Down"><ArrowDown className="h-3 w-3" /></Button>
                  </div>
                </div>
                {/* Row 2: Condition, Delete */}  
                <div className="flex items-center gap-2 w-full mt-1">
                  <Input id={`branch-condition-${branch.id}`} value={branch.condition} onChange={(e) => handleBranchChange(branch.id, 'condition', e.target.value)} placeholder="Condition (e.g., ${var} > 100 or 'otherwise')" className="text-sm flex-grow h-8" />
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-red-500 flex-shrink-0" onClick={() => removeBranch(branch.id)} title="Remove Step"><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            ))}

            <Button variant="outline" size="sm" onClick={addBranch} className="mt-2">
              <Plus className="h-4 w-4 mr-1" />
              Add Step
            </Button>

            {/* Update/Cancel Buttons */}
            <div className="flex justify-end gap-2 pt-3 border-t mt-4">
              <Button variant="outline" size="sm" onClick={handleCancelClick}>Cancel</Button>
              <Button size="sm" onClick={handleUpdateClick}>Update</Button>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};