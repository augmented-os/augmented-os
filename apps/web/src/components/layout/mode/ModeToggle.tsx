import React from 'react';
import { CircleDot, Zap } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

type ModeToggleProps = {
  currentMode: 'build' | 'work';
  toggleMode: () => void;
};

const ModeToggle = ({ currentMode, toggleMode }: ModeToggleProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="text-sm h-9 ml-auto"
        >
          {currentMode === 'build' ? (
            <>
              <CircleDot size={16} className="mr-1.5 text-primary" />
              <span className="text-primary">Build</span>
            </>
          ) : (
            <>
              <Zap size={16} className="mr-1.5 text-primary" />
              <span className="text-primary">Work</span>
            </>
          )}
          <span className="ml-1">▾</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => currentMode !== 'build' && toggleMode()}
          className={currentMode === 'build' ? 'font-semibold' : ''}
        >
          <CircleDot size={16} className={`mr-2 ${currentMode === 'build' ? 'text-primary' : ''}`} />
          <span className={currentMode === 'build' ? 'text-primary' : ''}>Build</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => currentMode !== 'work' && toggleMode()}
          className={currentMode === 'work' ? 'font-semibold' : ''}
        >
          <Zap size={16} className={`mr-2 ${currentMode === 'work' ? 'text-primary' : ''}`} />
          <span className={currentMode === 'work' ? 'text-primary' : ''}>Work</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ModeToggle;
