import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RenameWorkflowDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (newName: string) => void;
  currentName: string;
}

export const RenameWorkflowDialog: React.FC<RenameWorkflowDialogProps> = ({ 
  isOpen, 
  onOpenChange, 
  onSubmit, 
  currentName 
}) => {
  const [workflowName, setWorkflowName] = useState(currentName);

  // Reset input when dialog opens with a new current name
  useEffect(() => {
    if (isOpen) {
      setWorkflowName(currentName);
    }
  }, [currentName, isOpen]);

  const handleRenameClick = () => {
    const finalName = workflowName.trim();
    if (finalName && finalName !== currentName) {
      onSubmit(finalName);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Rename Workflow</DialogTitle>
          <DialogDescription>
            Enter a new name for your workflow.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="workflow-name">Workflow Name</Label>
            <Input
              id="workflow-name"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              placeholder="Enter workflow name"
              autoFocus
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleRenameClick} 
            disabled={!workflowName.trim() || workflowName.trim() === currentName}
          >
            Rename
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 