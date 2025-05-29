import React from 'react';
import { Handle, Position } from 'reactflow';
import { getIconComponent } from '@/features/workflowDesigner/utils/icons';
import { NODE_TYPES, NodeType, NodeData } from '@/types/workflow';

// Define node type styles
const nodeTypeStyles = {
  [NODE_TYPES.WORKFLOW_INPUT]: {
    background: 'bg-[#E6EDF5]',
    border: 'border-gray-200',
    text: 'text-gray-700',
    icon: 'text-gray-900'
  },
  [NODE_TYPES.WORKFLOW_OUTPUT]: {
    background: 'bg-[#E6EDF5]',
    border: 'border-gray-200',
    text: 'text-gray-700',
    icon: 'text-gray-900'
  },
  default: {
    background: 'bg-white',
    border: 'border-gray-200',
    text: 'text-gray-900',
    icon: 'text-gray-600'
  }
};

// Map of node types to icon names
const nodeTypeToIconMap: Record<NodeType | 'default', string> = {
  [NODE_TYPES.WORKFLOW_INPUT]: 'input',
  [NODE_TYPES.WORKFLOW_OUTPUT]: 'output',
  [NODE_TYPES.DATA_STORE]: 'database',
  [NODE_TYPES.DOCUMENT]: 'file',
  [NODE_TYPES.INTEGRATION]: 'server',
  [NODE_TYPES.AI_TASK]: 'brain',
  [NODE_TYPES.MANUAL_TASK]: 'user',
  [NODE_TYPES.CODE_TASK]: 'code',
  [NODE_TYPES.WORKFLOW]: 'gitbranch',
  [NODE_TYPES.DECISION]: 'gitmerge',
  [NODE_TYPES.DELAY]: 'clock',
  [NODE_TYPES.WAIT_EVENT]: 'timer',
  // Fallback mappings for backwards compatibility
  'default': 'server'
};

// Helper function to create unique handle IDs
const getBranchHandleId = (nodeId: string, branchId: string): string => {
  return `${nodeId}-${branchId}`;
};

export const WorkflowNode = ({ data, selected, id }: { data: NodeData, selected: boolean, id: string }) => {
  // Destructure necessary props directly from data, excluding config for branch logic
  const { label, sublabel, type = 'default', branches: nodeBranches } = data;
  
  // Determine the icon name solely from the node type
  const iconName = nodeTypeToIconMap[type as NodeType] || nodeTypeToIconMap.default;
  const Icon = getIconComponent(iconName);
  
  // Get styles based on node type
  const styleType = type === NODE_TYPES.WORKFLOW_INPUT || type === NODE_TYPES.WORKFLOW_OUTPUT ? type : 'default';
  const styles = nodeTypeStyles[styleType] || nodeTypeStyles.default;
  
  // Integration or AI Task icon logic
  const integrationIconUrl = type === NODE_TYPES.INTEGRATION && (data as any)?.config?.icon_url;
  const aiIconUrl = type === NODE_TYPES.AI_TASK && (data as any)?.config?.icon_url;
  const customIconUrl = integrationIconUrl || aiIconUrl;
  
  // Log using data.branches directly
  console.log(`[CustomNode ${id}] Rendering. Node type: ${type}`);
  const hasConditionalBranches = Array.isArray(nodeBranches) && nodeBranches.length > 0;
  console.log(`[CustomNode ${id}] Has conditional branches: ${hasConditionalBranches}`);
  if (hasConditionalBranches) {
    console.log(`[CustomNode ${id}] Branches data:`, JSON.stringify(nodeBranches, null, 2));
  }
  const shouldRenderBranchSection = hasConditionalBranches && type !== NODE_TYPES.WORKFLOW_OUTPUT;
  console.log(`[CustomNode ${id}] Condition to render branch section: ${shouldRenderBranchSection} (hasBranches: ${hasConditionalBranches}, type !== OUTPUT: ${type !== NODE_TYPES.WORKFLOW_OUTPUT})`);

  // Use data.branches directly for rendering logic
  const branchesToRender = nodeBranches || [];

  return (
    <div 
      className={`
        ${styles.background} 
        ${selected ? 'border-2 border-blue-500 shadow-[0_0_0_2px_rgba(14,165,233,0.3)]' : `border ${styles.border}`} 
        transition-all 
        rounded-lg w-64 shadow-sm hover:shadow-md transition-shadow
        ${styleType === NODE_TYPES.WORKFLOW_INPUT ? 'cursor-not-allowed' : 'cursor-move'}
      `}
      style={{
        borderColor: selected ? '#3b82f6' : '',
        boxShadow: selected ? '0 0 0 1px rgba(59, 130, 246, 0.5)' : ''
      }}
    >
      {/* Top Target Handle (no change) */}
      {styleType !== NODE_TYPES.WORKFLOW_INPUT && (
        <Handle 
          type="target" 
          position={Position.Top} 
          className={`w-3 h-3 border-2 ${selected ? 'border-blue-500 bg-blue-100' : 'border-gray-300 bg-white'}`}
        />
      )}
      
      <div className="flex items-center gap-3 p-3">
        {customIconUrl ? (
          <img src={customIconUrl} alt="Node Icon" className="h-5 w-5 rounded-sm object-contain" />
        ) : (
          Icon && <Icon className={`h-5 w-5 ${selected ? 'text-blue-600' : styles.icon}`} />
        )}
        <div className="flex-1">
          <div className={`font-medium text-sm ${styles.text}`}>{label}</div>
          {sublabel && <div className="text-xs text-gray-500">{sublabel}</div>}
        </div>
        {/* Optional Menu Button logic would go here if needed */}
      </div>
      
      {/* --- Conditional Source Handles Section (Using Branches) --- */}
      {shouldRenderBranchSection && (
        <div className="flex border-t border-gray-200">
          {/* Iterate over branches derived directly from data.branches */}
          {branchesToRender.map((branch, index) => {
            // *** Add log inside the map function ***
            console.log(`[CustomNode ${id}] Rendering branch in map: ${branch.name || 'Unnamed'} (ID: ${branch.id})`); 
            const branchColor = branch.color || '#000000'; // Fallback color
            const isFirst = index === 0;
            const handleId = getBranchHandleId(id, branch.id); // Generate unique handle ID
            
            // Function to convert hex to rgba with alpha
            const hexToRgba = (hex: string, alpha: number): string => {
              const r = parseInt(hex.slice(1, 3), 16);
              const g = parseInt(hex.slice(3, 5), 16);
              const b = parseInt(hex.slice(5, 7), 16);
              return `rgba(${r}, ${g}, ${b}, ${alpha})`;
            };

            return (
              <div 
                key={branch.id} // Use branch ID as key
                className={`
                  flex-1 relative px-3 py-2 text-center text-xs font-medium 
                  ${!isFirst ? 'border-l border-gray-200' : ''} 
                  hover:bg-gray-50 group // Added group for potential hover effects later
                `}
                style={{ 
                  color: branchColor, // Use branch color for text
                  backgroundColor: hexToRgba(branchColor, 0.15) // Faded background color
                }} 
              >
                {branch.name || 'Condition'} {/* Use branch name */}
                <Handle
                  type="source"
                  position={Position.Bottom}
                  id={handleId} // Assign unique handle ID
                  className="!w-2 !h-2 !min-w-0 !min-h-0 !border-2"
                  style={{ 
                    borderColor: branchColor, // Style handle with branch color
                    backgroundColor: 'white',
                    bottom: '-4px', 
                    left: '50%', 
                    transform: 'translateX(-50%)',
                  }} 
                />
              </div>
            );
          })}
        </div>
      )}
      {/* --- End Conditional Source Handles Section --- */}

      {/* Default Bottom Source Handle (only if NO conditional branches) */}
      {!hasConditionalBranches && styleType !== NODE_TYPES.WORKFLOW_OUTPUT && (
        <Handle 
          type="source" 
          position={Position.Bottom} 
          className={`w-3 h-3 border-2 ${selected ? 'border-blue-500 bg-blue-100' : 'border-gray-300 bg-white'}`}
          // No specific ID needed for the default handle unless required elsewhere
        />
      )}
    </div>
  );
}; 