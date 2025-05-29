import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, ArrowUp, ArrowDown, Trash2 } from 'lucide-react';
import { nanoid } from 'nanoid';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ColorPalette } from '@/components/ui/ColorPalette';

interface Action {
  id: string;
  name: string;
  color: string;
}

interface ManualTaskActionsEditorProps {
  actions: Action[];
  onChange: (actions: Action[]) => void;
}

export const ManualTaskActionsEditor: React.FC<ManualTaskActionsEditorProps> = ({ actions, onChange }) => {
  const [localActions, setLocalActions] = useState<Action[]>([]);
  const [openPickerId, setOpenPickerId] = useState<string | null>(null);

  useEffect(() => {
    setLocalActions(actions.map(a => ({ ...a })));
  }, [actions]);

  const handleActionChange = (id: string, field: keyof Action, value: string) => {
    const newActions = localActions.map(action => action.id === id ? { ...action, [field]: value } : action);
    setLocalActions(newActions);
    onChange(newActions);
    if (field === 'color') {
      setOpenPickerId(null);
    }
  };

  const addAction = () => {
    const newActions = [
      ...localActions,
      { id: `act-${nanoid(8)}`, name: '', color: '#22c55e' }
    ];
    setLocalActions(newActions);
    onChange(newActions);
  };

  const removeAction = (id: string) => {
    const newActions = localActions.filter(action => action.id !== id);
    setLocalActions(newActions);
    onChange(newActions);
  };

  const moveAction = (index: number, direction: 'up' | 'down') => {
    const currentActions = [...localActions];
    const item = currentActions[index];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= currentActions.length) return;
    currentActions[index] = currentActions[swapIndex];
    currentActions[swapIndex] = item;
    setLocalActions(currentActions);
    onChange(currentActions);
  };

  return (
    <div className="space-y-3">
      {localActions.map((action, index) => (
        <div key={action.id} className="p-2 border rounded bg-gray-50/80 flex flex-col">
          <div className="flex items-center gap-2 w-full">
            <Popover open={openPickerId === action.id} onOpenChange={(isOpen) => setOpenPickerId(isOpen ? action.id : null)}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  className="w-6 h-6 p-0 border flex-shrink-0"
                  style={{ backgroundColor: action.color }}
                  title="Choose Color"
                >
                  <span className="sr-only">Select Color</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <ColorPalette
                  selectedColor={action.color}
                  onColorSelect={color => handleActionChange(action.id, 'color', color)}
                />
              </PopoverContent>
            </Popover>
            <Input
              id={`action-name-${action.id}`}
              value={action.name}
              onChange={e => handleActionChange(action.id, 'name', e.target.value)}
              placeholder="Outcome Name (e.g., Approve)"
              className="text-sm flex-grow h-8"
            />
            <div className="flex flex-col gap-0.5">
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 text-gray-400 hover:text-blue-600"
                onClick={() => moveAction(index, 'up')}
                disabled={index === 0}
                title="Move Up"
              >
                <ArrowUp className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 text-gray-400 hover:text-blue-600"
                onClick={() => moveAction(index, 'down')}
                disabled={index === localActions.length - 1}
                title="Move Down"
              >
                <ArrowDown className="h-3 w-3" />
              </Button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-gray-400 hover:text-red-500 flex-shrink-0"
              onClick={() => removeAction(action.id)}
              title="Remove Outcome"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={addAction} className="mt-2">
        <Plus className="h-4 w-4 mr-1" />
        Add Outcome
      </Button>
    </div>
  );
}; 