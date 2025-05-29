import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Search, 
  LucideIcon
} from 'lucide-react';
import { getIconPath } from '@/features/workflowDesigner/utils/icons';
import { workflowIcons } from '@/lib/icons';
import { NODE_TYPES } from '@/types/workflow';
import { Node as FlowNode } from 'reactflow';

interface NodeTypeInfo {
  type: string;
  label: string;
  description: string;
  iconName: string;
}

interface NodeTypesOverlayProps {
  visible: boolean;
  buttonRef: React.RefObject<HTMLButtonElement>;
  onClose: () => void;
  zoom: number;
  onAddNode: (type: string, label: string) => void;
  nodes: FlowNode[]; // Add nodes to check for existing workflow input
}

// Updated list of node types according to the standardized constants
const nodeTypes: NodeTypeInfo[] = [
  {
    type: NODE_TYPES.WORKFLOW_INPUT,
    label: 'Workflow Input',
    description: 'Starting point for workflow',
    iconName: 'input'
  },
  {
    type: NODE_TYPES.DATA_STORE,
    label: 'Data Store',
    description: 'Load or save business data',
    iconName: 'database'
  },
  {
    type: NODE_TYPES.DOCUMENT,
    label: 'Documents',
    description: 'Create or edit business docs',
    iconName: 'file'
  },
  {
    type: NODE_TYPES.INTEGRATION,
    label: 'Integration',
    description: 'Interact with external systems',
    iconName: 'server'
  },
  {
    type: NODE_TYPES.AI_TASK,
    label: 'AI Task',
    description: 'AI-powered processing',
    iconName: 'brain'
  },
  {
    type: NODE_TYPES.MANUAL_TASK,
    label: 'Manual Task',
    description: 'Create and assign task to team',
    iconName: 'user'
  },
  {
    type: NODE_TYPES.CODE_TASK,
    label: 'Code Task',
    description: 'Script-based automation',
    iconName: 'code'
  },
  {
    type: NODE_TYPES.WORKFLOW,
    label: 'Workflow',
    description: 'Embed another workflow',
    iconName: 'gitbranch'
  },
  {
    type: NODE_TYPES.DECISION,
    label: 'Decision',
    description: 'Use rule to select next task',
    iconName: 'gitmerge'
  },
  {
    type: NODE_TYPES.DELAY,
    label: 'Delay',
    description: 'Schedule a time to continue',
    iconName: 'clock'
  },
  {
    type: NODE_TYPES.WAIT_EVENT,
    label: 'Wait for Event',
    description: 'Wait for event to continue',
    iconName: 'timer'
  },
  {
    type: NODE_TYPES.WORKFLOW_OUTPUT,
    label: 'Workflow Output',
    description: 'Format output data for workflow',
    iconName: 'output'
  }
];

export const NodeTypesOverlay: React.FC<NodeTypesOverlayProps> = ({ 
  visible, 
  buttonRef,
  onClose, 
  zoom,
  onAddNode,
  nodes
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle client-side only rendering
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Position the overlay below the button
  useEffect(() => {
    if (visible && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: buttonRect.bottom + 8, // 8px gap below button
        left: buttonRect.right - 280 // Align to right edge of button with less offset
      });
    }
  }, [visible, buttonRef]);

  // Focus the search input when overlay becomes visible
  useEffect(() => {
    if (visible && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    } else {
      // Clear search when closing the overlay
      setSearchQuery('');
    }
  }, [visible]);

  // Close the overlay when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        overlayRef.current && 
        !overlayRef.current.contains(event.target as Element) &&
        buttonRef.current && 
        !buttonRef.current.contains(event.target as Element)
      ) {
        onClose();
      }
    };

    // Close overlay on ESC key
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (visible && mounted) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [visible, onClose, buttonRef, mounted]);

  // Handle drag start for a node
  const handleDragStart = (e: React.DragEvent, node: NodeTypeInfo) => {
    // Set the drag data - include description for sublabel and use type for icon determination
    e.dataTransfer.setData('application/reactflow', JSON.stringify({
      type: node.type,
      label: node.label,
      description: node.description
    }));
    
    try {
      // Create a simple drag preview using a single element
      const dragEl = document.createElement('div');
      dragEl.style.cssText = 'position:absolute;left:-9999px;top:-9999px;';
      dragEl.innerHTML = `
        <div style="background:white;border:1px solid #e5e7eb;border-radius:8px;padding:12px;width:260px;box-shadow:0 1px 2px rgba(0,0,0,0.05);">
          <div style="display:flex;align-items:center;gap:12px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              ${getIconPath(node.iconName)}
            </svg>
            <div style="flex:1;">
              <div style="font-weight:500;font-size:14px;">${node.label}</div>
              <div style="font-size:12px;color:#6b7280;">${node.description}</div>
            </div>
          </div>
        </div>
      `;
      
      document.body.appendChild(dragEl);
      
      // Set drag image and clean up after a short delay
      const preview = dragEl.firstChild as HTMLElement;
      if (preview) {
        e.dataTransfer.setDragImage(preview, 130, 30);
      }
      
      setTimeout(() => document.body.removeChild(dragEl), 300);
    } catch (error) {
      console.error("Error creating drag preview:", error);
    }
  };

  // Filter node types based on search query and existing workflow input node
  const filteredNodeTypes = nodeTypes.filter(node => {
    // Check if this is a workflow input node and if one already exists
    if (node.type === NODE_TYPES.WORKFLOW_INPUT) {
      const hasInputNode = nodes.some(n => n.data.type === NODE_TYPES.WORKFLOW_INPUT);
      if (hasInputNode) {
        return false; // Don't show workflow input in the overlay if one already exists
      }
    }
    
    // Filter by search query
    return node.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
      node.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.type.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Don't render anything if not visible or not yet mounted
  if (!visible || !mounted) return null;

  // Create custom nodes without the handles (which are causing the dots)
  const renderCustomNodeWithoutHandles = (node: NodeTypeInfo) => {
    const Icon = workflowIcons[node.iconName as keyof typeof workflowIcons];
    
    return (
      <div className="bg-white border border-gray-200 transition-all rounded-lg p-3 w-full shadow-sm hover:shadow-md cursor-grab">
        <div className="flex items-center gap-3">
          <Icon className="h-5 w-5 text-gray-600" />
          <div className="flex-1">
            <div className="font-medium text-sm">{node.label}</div>
            <div className="text-xs text-gray-500">{node.description}</div>
          </div>
        </div>
      </div>
    );
  };

  // Create the overlay content
  const overlayContent = (
    <div 
      ref={overlayRef}
      className="absolute z-10 rounded-lg bg-transparent backdrop-blur-sm shadow-lg border border-gray-100"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        width: '264px', // Reduced width to match the screenshot
        maxHeight: '80vh',
        overflow: 'auto'
      }}
    >
      <div className="p-2">
        {/* Search input */}
        <div className="sticky top-0 mb-3 w-full">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search steps types..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full rounded-md py-1.5 pl-8 pr-3 text-sm bg-white/90 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>
        </div>
        
        <div className="flex flex-col gap-3 w-full">
          {filteredNodeTypes.length > 0 ? (
            filteredNodeTypes.map((node) => (
              <div 
                key={`${node.type}-${node.label}`}
                className="w-full"
                draggable
                onDragStart={(e) => handleDragStart(e, node)}
              >
                {/* Use our custom node rendering to avoid the handles */}
                {renderCustomNodeWithoutHandles(node)}
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-sm text-gray-500">
              No matching steps found
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Make sure document.body is available before using createPortal
  return typeof document !== 'undefined' ? createPortal(overlayContent, document.body) : null;
};

export default NodeTypesOverlay; 