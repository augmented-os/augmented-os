import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Node } from 'reactflow';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { ChevronRight, UserCheck, Check, ChevronDown, AlertTriangle, FileText, ListChecks } from 'lucide-react';
import { 
  NodeData, 
  ManualTaskNodeData, 
  ManualTaskConfig, 
  AssigneeType, 
  TaskPriority, 
  NODE_TYPES 
} from '@/types/workflow';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { IsoDurationPicker } from '@/components/ui/IsoDurationPicker';
import { ManualTaskActionsEditor } from './ManualTaskActionsEditor';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter, 
  DialogTrigger, 
  DialogClose
} from "@/components/ui/dialog";
import { useConfigSection } from '@/features/workflowDesigner/hooks';

// Placeholder for fetching available UI components
// const useAvailableUIComponents = () => {
//   // Replace with actual hook/fetch logic
//   return { data: ['order-approval-form-v1', 'document-review-form', 'data-entry-form'], isLoading: false };
// };

// Placeholder for fetching available escalation policies
// const useAvailableEscalationPolicies = () => {
//   // Replace with actual hook/fetch logic
//   return { data: ['default-escalation', 'high-priority-alert', 'manager-notification'], isLoading: false };
// };

// Placeholder for rendering a UI component preview
// const UIComponentRenderer = ({ componentId, mockData }: { componentId: string; mockData?: any }) => {
//   // Replace with actual rendering logic
//   return (
//     <div className="p-4 border rounded bg-gray-100">
//       <p className="text-sm font-semibold">Preview: {componentId}</p>
//       <pre className="text-xs mt-2">{JSON.stringify(mockData || { message: 'No mock data provided' }, null, 2)}</pre>
//     </div>
//   );
// };

// --- Mock Data based on demoSchema.json ---
const mockTaskData = {
  order: {
    id: 'ord_123abc',
    status: 'Pending Approval',
    total_amount: 129.97,
    order_date: new Date().toISOString(),
  },
  customer: {
    id: 'cus_789xyz',
    name: 'Alice Wonderland',
    email: 'alice.w@example.com'
  },
  items: [
    { product_id: 'prod_abc', name: 'Widget Pro', quantity: 1, unit_price: 99.99 },
    { product_id: 'prod_def', name: 'Gizmo Standard', quantity: 2, unit_price: 14.99 },
  ]
};

interface ManualTaskConfigPanelProps {
  nodeData: Node<NodeData>;
  onUpdate: (config: ManualTaskConfig) => void;
  onUpdateBranches?: (branches: any[]) => void;
  isDisabled?: boolean;
  sectionId: string;
}

export const ManualTaskConfigPanel: React.FC<ManualTaskConfigPanelProps> = ({
  nodeData,
  onUpdate,
  onUpdateBranches,
  isDisabled = false,
  sectionId
}) => {
  const { toast } = useToast();

  // --- Type Guard ---
  if (nodeData.data.type !== NODE_TYPES.MANUAL_TASK) {
    return null;
  }
  const taskNodeData = nodeData.data as ManualTaskNodeData;
  
  // Use our new config section hook
  const { isDisabled: isSectionDisabled, isEditing, startEditing, stopEditing } = 
    useConfigSection(sectionId, nodeData.id);
  
  // Combine the passed isDisabled with our state machine's isDisabled
  const effectivelyDisabled = isDisabled || isSectionDisabled;
  
  // --- State ---
  const [formState, setFormState] = useState<ManualTaskConfig>( // Initialize form state directly
    taskNodeData.config || {
      assignment: { type: AssigneeType.ROLE, assignees: [] },
      instructions: '',
      uiComponentId: '',
      allowedActions: [],
      priority: TaskPriority.MEDIUM,
    }
  );
  const [actionsState, setActionsState] = useState(() => { // Initialize actions state directly
    if (nodeData.data.branches && nodeData.data.branches.length > 0) {
      return nodeData.data.branches.map((branch: any) => ({ id: branch.id, name: branch.name, color: branch.color || '#22c55e' }));
    }
    if (taskNodeData.config?.allowedActions) {
      return taskNodeData.config.allowedActions.map((name: string, idx: number) => ({ id: `act-${idx}`, name, color: '#22c55e' }));
    }
    return [];
  });
  const [initialConfig, setInitialConfig] = useState<ManualTaskConfig | null>(null); // For cancel
  const instructionsTextareaRef = useRef<HTMLTextAreaElement>(null);

  // --- Effects ---
  // Reset form state if node selection changes
  useEffect(() => {
    const currentConfig = taskNodeData.config || {
        assignment: { type: AssigneeType.ROLE, assignees: [] },
        instructions: '',
        uiComponentId: '',
        allowedActions: [],
        priority: TaskPriority.MEDIUM,
      };
    setFormState(currentConfig);
    setInitialConfig({ ...currentConfig }); // Update cancel buffer
    // stopEditing is handled implicitly by state machine
  }, [nodeData.id, taskNodeData.config]); // No stopEditing dependency needed

  // Effect to auto-resize instructions textarea
  useEffect(() => {
    if (instructionsTextareaRef.current) {
      instructionsTextareaRef.current.style.height = 'auto';
      instructionsTextareaRef.current.style.height = `${instructionsTextareaRef.current.scrollHeight}px`;
    }
  }, [formState.instructions]);

  // --- Handlers ---
  const handleEdit = () => {
    if (!effectivelyDisabled) {
      // Set the cancel buffer before starting edit
      setInitialConfig(formState);
      startEditing();
    }
  };

  const handleInputChange = (field: keyof ManualTaskConfig, value: any) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  };

  const handleAssignmentChange = (field: keyof ManualTaskConfig['assignment'], value: any) => {
    setFormState(prev => ({ ...prev, assignment: { ...prev.assignment, [field]: value } }));
  };

  const handleSave = () => {
    // Basic Validation
    if (!formState.instructions) { toast({ title: "Validation Error", description: "Instructions are required.", variant: "destructive" }); return; }
    if (!formState.assignment.type) { toast({ title: "Validation Error", description: "Assignment Type is required.", variant: "destructive" }); return; }
    if (formState.assignment.type !== AssigneeType.DYNAMIC_RULE && formState.assignment.assignees.length === 0) { toast({ title: "Validation Error", description: "Assignees are required unless using a dynamic rule.", variant: "destructive" }); return; }
    if (formState.assignment.type === AssigneeType.DYNAMIC_RULE && !formState.assignment.rule) { toast({ title: "Validation Error", description: "Assignment Rule is required for dynamic assignment.", variant: "destructive" }); return; }

    // Set a default UI Component ID to avoid validation errors
    const configToSave = {
      ...formState,
      uiComponentId: formState.uiComponentId || 'default-task-ui'
    };

    console.log("Saving Manual Task Config:", configToSave);
    onUpdate(configToSave);
    stopEditing(); // Inform the state machine we're done editing
    toast({ title: "Manual Task Updated", description: "Configuration saved successfully." });
  };

  const handleCancel = () => {
    // Restore from initialConfig buffer if it exists
    if (initialConfig) {
      setFormState(initialConfig);
    }
    stopEditing(); // Inform the state machine we're done editing
  };

  const handleActionsChange = (actions) => {
    setActionsState(actions);
    setFormState(prev => ({
      ...prev,
      allowedActions: actions.map(a => a.name),
    }));
    if (typeof onUpdateBranches === 'function') {
      onUpdateBranches(actions.map(a => ({ id: a.id, name: a.name, color: a.color, condition: '' })));
    }
  };

  // --- Render Logic ---
  const renderPreview = () => {
    const formatReadableDuration = (isoDuration: string) => {
      if (!isoDuration) return 'No deadline';
      const match = /^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?)?$/.exec(isoDuration);
      const days = match && match[1] ? parseInt(match[1], 10) : 0;
      const hours = match && match[2] ? parseInt(match[2], 10) : 0;
      const minutes = match && match[3] ? parseInt(match[3], 10) : 0;
      if (days === 0 && hours === 0 && minutes === 0) return 'No deadline';
      const parts: string[] = [];
      if (days > 0) parts.push(`${days}d`);
      if (hours > 0) parts.push(`${hours}h`);
      if (minutes > 0) parts.push(`${minutes}m`);
      return parts.join(' ');
    };

    // Use initialConfig for preview consistency after cancel
    const configForPreview = initialConfig || formState;

    return (
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-[140px_1fr] gap-y-4 py-1.5 px-2 bg-white rounded-md border border-gray-50">
          {/* Assignment Preview */}
          <div className="flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-gray-500" />
            <span className="text-xs font-medium uppercase tracking-wide text-gray-500">Assignment</span>
          </div>
          <div className="flex flex-col items-end">
            {configForPreview.assignment.type === AssigneeType.DYNAMIC_RULE ? (
              <span className="text-xs font-mono text-blue-700 bg-blue-50 border border-blue-100 rounded px-2 py-0.5">Rule: {configForPreview.assignment.rule || 'Not Set'}</span>
            ) : (
              <span className="text-xs font-mono text-indigo-700 bg-indigo-50 border border-indigo-100 rounded px-2 py-0.5">{configForPreview.assignment.type}: {configForPreview.assignment.assignees?.join(', ') || 'None'}</span>
            )}
          </div>
          {/* Priority/Deadline Preview */}
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-gray-500" />
            <span className="text-xs font-medium uppercase tracking-wide text-gray-500">Priority</span>
          </div>
          <div className="flex flex-col items-end">
            <span className={`text-xs font-mono rounded px-2 py-0.5 border ${configForPreview.priority === TaskPriority.CRITICAL ? 'bg-red-50 border-red-200 text-red-700' : configForPreview.priority === TaskPriority.HIGH ? 'bg-orange-50 border-orange-200 text-orange-700' : configForPreview.priority === TaskPriority.MEDIUM ? 'bg-yellow-50 border-yellow-200 text-yellow-700' : 'bg-gray-50 border-gray-200 text-gray-700'}`}>
              {configForPreview.priority || 'Not Set'}{configForPreview.dueDuration ? ` - ${formatReadableDuration(configForPreview.dueDuration)}` : ''}
            </span>
          </div>
          {/* Outcomes Preview */}
          {nodeData.data.branches && nodeData.data.branches.length > 0 && (
            <>
              <div className="flex items-center gap-2">
                <ListChecks className="h-4 w-4 text-gray-500" />
                <span className="text-xs font-medium uppercase tracking-wide text-gray-500">Outcomes</span>
              </div>
              <div className="flex flex-wrap gap-1.5 items-center justify-end">
                {nodeData.data.branches.map((branch) => {
                  const hexToRgba = (hex: string, alpha: number) => {
                    const bigint = parseInt(hex.slice(1), 16);
                    const r = (bigint >> 16) & 255; const g = (bigint >> 8) & 255; const b = bigint & 255;
                    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
                  };
                  const color = branch.color || '#64748b';
                  const bgColor = hexToRgba(color, 0.1); const borderColor = hexToRgba(color, 0.4); const textColor = color;
                  return (
                    <span key={branch.id} className="inline-flex items-center px-2 py-0.5 rounded border text-xs font-medium" style={{ backgroundColor: bgColor, borderColor: borderColor, color: textColor }}>
                      {branch.name}
                    </span>
                  );
                })}
              </div>
            </>
          )}
          {/* Instructions Preview */}
          <div className="flex items-center gap-2"><FileText className="h-4 w-4 text-gray-500" /><span className="text-xs font-medium uppercase tracking-wide text-gray-500">Instructions</span></div>
          <div></div> {/* Empty cell */} 
          <div className="col-span-2 w-full">
            <div className="bg-gray-50 border border-gray-100 rounded p-3 text-xs text-gray-700 max-h-32 overflow-y-auto whitespace-pre-line">{configForPreview.instructions || <span className="italic text-gray-400">Not Set</span>}</div>
          </div>
        </div>
        {/* Preview Task UI Button */}
        <Dialog>
          <DialogTrigger asChild><Button variant="outline" size="sm" className="mt-2">Preview Task UI</Button></DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Task Preview: {nodeData.data.label || 'Manual Task'}</DialogTitle>
              <DialogDescription className="pt-2">{configForPreview.instructions || <span className="italic">No instructions provided.</span>}</DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 border-b pb-1">Task Data</h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div className="font-medium text-gray-600">Order ID:</div><div>{mockTaskData.order.id}</div>
                <div className="font-medium text-gray-600">Customer:</div><div>{mockTaskData.customer.name} ({mockTaskData.customer.email})</div>
                <div className="font-medium text-gray-600">Order Total:</div><div>${mockTaskData.order.total_amount.toFixed(2)}</div>
                <div className="font-medium text-gray-600">Status:</div><div>{mockTaskData.order.status}</div>
              </div>
              <h3 className="text-sm font-semibold text-gray-700 border-b pb-1 mt-4">Order Items</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                {mockTaskData.items.map(item => (<li key={item.product_id}>{item.quantity} x {item.name} (@ ${item.unit_price.toFixed(2)} each)</li>))}
              </ul>
            </div>
            <DialogFooter className="gap-2">
              {(nodeData.data.branches || []).map(branch => (<Button key={branch.id} variant="outline">{branch.name}</Button>))}
              {(nodeData.data.branches?.length === 0) && (<span className="text-sm text-gray-500 italic mr-auto">No outcomes defined.</span>)}
              <DialogClose asChild><Button type="button" variant="secondary">Close Preview</Button></DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  };

  // Dummy data for assignees grouped by type
  const USER_OPTIONS = [
    { value: 'pete', label: 'Pete' }, 
    { value: 'diana', label: 'Diana' }, 
    { value: 'harj', label: 'Harj' },
  ];

  const ROLE_OPTIONS = [
    { value: 'admin_team', label: 'Admin Team' }, 
    { value: 'finance_team', label: 'Finance Team' },
    { value: 'partners', label: 'Partners' },
  ];

  const GROUP_OPTIONS = [
  ];

  const renderEditForm = () => (
    <div className="p-4 space-y-6">
      {/* Assignment Section */}
      <fieldset className="border rounded-md p-3 bg-gray-50/80">
        <legend className="text-xs font-semibold uppercase tracking-wide px-1 text-gray-700">Assignment</legend>
        <div className="flex flex-col">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="assignment-type" className="text-xs mb-0.5 block">Type</Label>
              <Select value={formState.assignment.type} onValueChange={(value) => handleAssignmentChange('type', value as AssigneeType)}>
                <SelectTrigger id="assignment-type" className="h-9 text-sm font-normal"><SelectValue placeholder="Select assignment type" /></SelectTrigger>
                <SelectContent>{Object.values(AssigneeType).map(type => (<SelectItem key={type} value={type}>{type}</SelectItem>))}</SelectContent>
              </Select>
            </div>
            {formState.assignment.type !== AssigneeType.DYNAMIC_RULE && (
              <div>
                <Label htmlFor="assignees" className="text-xs mb-0.5 block">Assignees</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <button type="button" className="w-full flex justify-between items-center border rounded px-3 py-2 bg-white text-sm h-9 font-normal">
                      <span>{formState.assignment.assignees.length > 0 ? formState.assignment.assignees.map(val => {
                        // Find the option across all option arrays
                        const allOptions = [...USER_OPTIONS, ...ROLE_OPTIONS, ...GROUP_OPTIONS];
                        return allOptions.find(opt => opt.value === val)?.label || val;
                      }).join(', ') : 'Select assignees'}</span>
                      <ChevronDown className="h-4 w-4 ml-2 text-gray-400 shrink-0" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 p-2">
                    {(() => {
                      // Select options based on assignment type
                      let options = [];
                      switch(formState.assignment.type) {
                        case AssigneeType.USER:
                          options = USER_OPTIONS;
                          break;
                        case AssigneeType.ROLE:
                          options = ROLE_OPTIONS;
                          break;
                        case AssigneeType.GROUP:
                          options = GROUP_OPTIONS;
                          break;
                        default:
                          options = [...USER_OPTIONS, ...ROLE_OPTIONS, ...GROUP_OPTIONS];
                      }

                      return options.map(opt => (
                        <button 
                          key={opt.value} 
                          type="button" 
                          className="flex items-center w-full px-2 py-1.5 rounded hover:bg-gray-100 text-sm" 
                          onClick={() => {
                            const exists = formState.assignment.assignees.includes(opt.value);
                            const newAssignees = exists 
                              ? formState.assignment.assignees.filter(a => a !== opt.value) 
                              : [...formState.assignment.assignees, opt.value];
                            handleAssignmentChange('assignees', newAssignees);
                          }}
                        >
                          <Checkbox 
                            checked={formState.assignment.assignees.includes(opt.value)} 
                            onCheckedChange={() => {}} 
                            className="mr-2" 
                            tabIndex={-1} 
                            aria-hidden 
                          />
                          {opt.label}
                          {formState.assignment.assignees.includes(opt.value) && (
                            <Check className="h-4 w-4 text-blue-600 ml-auto" />
                          )}
                        </button>
                      ));
                    })()}
                  </PopoverContent>
                </Popover>
              </div>
            )}
            {formState.assignment.type === AssigneeType.DYNAMIC_RULE && (
              <div className="col-span-2">
                <Label htmlFor="assignment-rule" className="text-xs mb-0.5 block">Rule (Expression)</Label>
                <Input id="assignment-rule" value={formState.assignment.rule || ''} onChange={(e) => handleAssignmentChange('rule', e.target.value)} placeholder="e.g., ${workflow.input.managerId}" className="h-9 text-sm font-normal" />
              </div>
            )}
          </div>
          <div className="flex items-center gap-8 mt-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="allow-reassignment" checked={formState.allowReassignment || false} onCheckedChange={(checked) => handleInputChange('allowReassignment', !!checked)} />
              <Label htmlFor="allow-reassignment" className="text-sm">Allow Reassignment</Label>
            </div>
          </div>
        </div>
      </fieldset>

      {/* Deadline Section */}
      <fieldset className="border rounded-md p-3 bg-gray-50/80">
        <legend className="text-xs font-semibold uppercase tracking-wide px-1 text-gray-700">Deadline</legend>
        <div className="flex flex-col">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="priority" className="text-xs mb-0.5 block">Priority</Label>
              <Select value={formState.priority} onValueChange={(value) => handleInputChange('priority', value as TaskPriority)}>
                <SelectTrigger id="priority" className="h-9 text-sm font-normal"><SelectValue placeholder="Select priority" /></SelectTrigger>
                <SelectContent>{Object.values(TaskPriority).map(p => (<SelectItem key={p} value={p}>{p}</SelectItem>))}</SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <IsoDurationPicker value={formState.dueDuration || ''} onChange={val => handleInputChange('dueDuration', val)} label="Due Duration" className="mt-[-3px]" />
            </div>
          </div>
        </div>
      </fieldset>

      {/* Instructions Section */}
      <fieldset className="border rounded-md p-3 bg-gray-50/80">
        <legend className="text-xs font-semibold uppercase tracking-wide px-1 text-gray-700">Instructions</legend>
        <Textarea ref={instructionsTextareaRef} id="instructions" value={formState.instructions} onChange={(e) => handleInputChange('instructions', e.target.value)} placeholder="Detailed instructions for the assignee..." className="resize-y text-sm font-normal w-full bg-white overflow-hidden" required />
      </fieldset>

      {/* Outcomes Section */}
      <fieldset className="border rounded-md p-3 bg-gray-50/80">
        <legend className="text-xs font-semibold uppercase tracking-wide px-1 text-gray-700">Outcomes</legend>
        <ManualTaskActionsEditor actions={actionsState} onChange={handleActionsChange} />
      </fieldset>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </div>
    </div>
  );
  
  // --- Final Render --- (Use isEditing from hook)
  const headerIconColor = effectivelyDisabled ? 'text-gray-400' : isEditing ? 'text-blue-600' : 'text-gray-500';
  const headerTextColor = effectivelyDisabled ? 'text-gray-500' : isEditing ? 'text-blue-800' : 'text-gray-800';

  return (
    <div className={`mb-4 border rounded-md overflow-hidden ${isEditing ? 'bg-white shadow-sm' : 'bg-gradient-to-b from-white to-gray-50 shadow-sm'}`}>
      {/* Header */}
      {!isEditing ? (
        <button 
          type="button"
          onClick={handleEdit}
          disabled={effectivelyDisabled}
          className="flex justify-between items-center w-full h-12 px-3 border-b bg-slate-50 text-left disabled:opacity-70 disabled:cursor-not-allowed hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-colors"
          title={!effectivelyDisabled ? "Edit Manual Task Configuration" : "Another section is being edited"}
        >
          <div className="flex items-center gap-2">
             <UserCheck className={`h-4 w-4 ${headerIconColor}`} />
             <span className={`font-medium text-sm ${headerTextColor}`}>
                  Manual Task Configuration
             </span>
          </div>
          {!effectivelyDisabled && <ChevronRight className="h-4 w-4 text-gray-500" />}
        </button>
      ) : (
        <div className="flex justify-between items-center h-12 px-3 border-b bg-blue-50">
          <div className="flex items-center gap-2">
             <UserCheck className="h-4 w-4 text-blue-600" />
             <span className="font-medium text-sm text-blue-800">
                  Edit Manual Task Configuration
             </span>
          </div>
        </div>
      )}

      {/* Content */}
      {isEditing ? renderEditForm() : renderPreview()}
    </div>
  );
}; 