import React, { useState, useEffect, useCallback } from 'react';
import { Node } from 'reactflow';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { NodeData, SchemaField, NODE_TYPES, DataStoreNodeConfig, Branch, IntegrationNodeData, BaseIntegrationConfig, ManualTaskConfig, ManualTaskNodeData, AssigneeType } from '@/types/workflow';
import { useToast } from '@/components/ui/use-toast';
// Remove direct SchemaEditor import if only used within CollapsibleSchemaSection
// import { SchemaEditor } from '@/components/shared/SchemaEditor';
// Remove Collapsible imports as they are handled by the new component
// import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
// import { ChevronRight } from 'lucide-react'; 
// Remove Badge import if SchemaPreview is removed
// import { Badge } from "@/components/ui/badge"; 

// Import the new reusable component
import { CollapsibleSchemaSection } from './SchemaConfig';
import { Separator } from "@/components/ui/separator";
// Restore Pencil icon import
import { Pencil } from 'lucide-react'; 
// Add icons for schemas
import { LogIn, LogOut } from 'lucide-react';
// Add icon for branches
import { GitBranch } from 'lucide-react';
// Import the new branch section component
import { CollapsibleBranchSection } from './BranchConfig';
// --- Add import for DataStoreConfig --- 
import { DataStoreConfig } from './DataStoreConfig';
// --- Add import for IntegrationConfig --- 
import { IntegrationConfig } from './IntegrationConfig';
// --- Add import for ReadOnlySchemaDisplay --- 
import { ReadOnlySchemaDisplay } from './ReadOnlySchemaDisplay';
// --- Add import for ManualTaskConfigPanel --- 
import { ManualTaskConfigPanel } from './ManualTaskConfigPanel';
// --- Add import for DocumentConfig --- 
import { DocumentConfig, DocumentNodeConfig } from './DocumentConfig'; // Add DocumentConfig and its type
import { DocumentNodeData } from '@/types/workflow';
// --- Add import for ManualTaskConfig type --- 
// import { ManualTaskConfig, ManualTaskNodeData } from '@/types/workflow'; // Already imported above
// Import the hook
import { useConfigSection } from '@/features/workflowDesigner/hooks';
import { GeneralPropsSection } from './GeneralPropsConfig';
import { inputSchemaEditable, outputSchemaEditable } from '@/features/workflowDesigner/utils/schemaEditingRules';
// --- Add import for AIConfig ---
import { AIConfig } from './AIConfig';
import type { AINodeConfig } from './AIConfig';
import { AITaskNodeData } from '@/types/workflow';

// Define section ID constants (moved outside component for potential export later)
const SECTION_IDS = {
  GENERAL_PROPS: 'generalProps',
  INPUT_SCHEMA: 'inputSchema',
  OUTPUT_SCHEMA: 'outputSchema',
  BRANCHES: 'branches',
  DATA_STORE: 'dataStore',
  MANUAL_TASK: 'manualTask',
  INTEGRATION: 'integration',
  DOCUMENT: 'document', // <-- Add section ID for Document
  AI_TASK: 'aiTask', // Add section ID for AI task
};

// Define props for NodeConfig
interface NodeConfigProps {
  nodeData: Node<NodeData>;
  onUpdate: (updatedNode: Node<NodeData>) => void;
  multipleNodes?: Node<NodeData>[];
  onBulkUpdate?: (updatedNodes: Node<NodeData>[]) => void;
}

// --- Remove Local Schema Preview Component --- 
// interface SchemaPreviewProps { ... }
// const SchemaPreview: React.FC<SchemaPreviewProps> = ({ schema }) => { ... };
// --- End Remove Schema Preview Component ---

export const NodeConfig: React.FC<NodeConfigProps> = ({ 
  nodeData,
  onUpdate,
  multipleNodes = [],
  onBulkUpdate
}) => {
  const { toast } = useToast();
  const isBulkEdit = multipleNodes.length > 1;

  // State for fields managed directly by NodeConfig
  const [nodeLabel, setNodeLabel] = useState('');
  const [nodeSublabel, setNodeSublabel] = useState('');
  const [nodeDescription, setNodeDescription] = useState('');
  const [nodeInputSchema, setNodeInputSchema] = useState<SchemaField[]>([]);
  const [nodeOutputSchema, setNodeOutputSchema] = useState<SchemaField[]>([]);

  // State to track previous node ID and selection mode
  const [prevNodeId, setPrevNodeId] = useState<string | null>(null);
  const [prevIsBulkEdit, setPrevIsBulkEdit] = useState<boolean | null>(null);

  // --- Remove direct useConfigSection call for General Props ---
  // const { isEditing: isEditingGeneralProps, isDisabled: isGeneralPropsDisabled, startEditing: startEditingGeneralProps, stopEditing: stopEditingGeneralProps } = useConfigSection(SECTION_IDS.GENERAL_PROPS, nodeData.id);

  // --- Effect to Load Data and Reset States ---
  useEffect(() => {
    const data = nodeData.data;
    const currentNodeId = nodeData.id;
    const currentIsBulkEdit = isBulkEdit;

    if (currentNodeId !== prevNodeId || currentIsBulkEdit !== prevIsBulkEdit) {
      console.log(`NodeConfig Effect: Loading state for node ${currentNodeId}, type: ${data?.type}`);
      setNodeLabel(data?.label || '');
      setNodeSublabel(data?.sublabel || '');
      setNodeDescription(data?.description || '');
      setNodeInputSchema(Array.isArray(data?.input_schema) ? data.input_schema : []);
      setNodeOutputSchema(Array.isArray(data?.output_schema) ? data.output_schema : []);
      
      setPrevNodeId(currentNodeId);
      setPrevIsBulkEdit(currentIsBulkEdit);
    }
    // Keep dependencies as they relate to *when* to reload state from props
  }, [nodeData, isBulkEdit, prevNodeId, prevIsBulkEdit]); 

  // --- Callbacks for Schema Editors --- 
  const handleInputSchemaChange = useCallback((newSchema: SchemaField[]) => {
    setNodeInputSchema(newSchema);
  }, []);

  const handleOutputSchemaChange = useCallback((newSchema: SchemaField[]) => {
    setNodeOutputSchema(newSchema);
  }, []);

  // --- New Handler for Action Schema Updates ---
  const handleActionSchemaUpdate = useCallback((schema: SchemaField[] | null) => {
    console.log("NodeConfig: Received action schema update:", schema);
    setNodeOutputSchema(schema || []); // Update the OUTPUT schema state, not input schema
  }, []);

  // --- New Handler for Action Input Schema Updates ---
  const handleActionInputSchemaUpdate = useCallback((schema: SchemaField[] | null) => {
    console.log("NodeConfig: Received action input schema update:", schema);
    setNodeInputSchema(schema || []); // Update the INPUT schema state
  }, []);

  // --- Central Update Trigger Function (Handles General Props & Schema Updates) ---
  const triggerNodeUpdate = useCallback(() => {
    if (!onUpdate) {
        console.error("NodeConfig: onUpdate handler is missing.");
        toast({ title: "Update Failed", description: "Unable to update node.", variant: "destructive"});
        return;
    }
    
    // Construct the updated data, preserving the existing config object
    const updatedNodeData: NodeData = {
      ...nodeData.data,
      label: nodeLabel,
      sublabel: nodeSublabel,
      description: nodeDescription,
      input_schema: nodeInputSchema,
      output_schema: nodeOutputSchema,
    } as NodeData; // Use type assertion carefully or build based on type

    // Refined way to preserve config based on type
    let finalUpdatedData: NodeData;
    switch (nodeData.data.type) {
        case NODE_TYPES.DECISION:
            finalUpdatedData = { ...updatedNodeData, type: NODE_TYPES.DECISION, config: nodeData.data.config };
            break;
        case NODE_TYPES.DATA_STORE:
             finalUpdatedData = { ...updatedNodeData, type: NODE_TYPES.DATA_STORE, config: nodeData.data.config };
            break;
        case NODE_TYPES.INTEGRATION:
             finalUpdatedData = { ...updatedNodeData, type: NODE_TYPES.INTEGRATION, config: nodeData.data.config };
            break;
        case NODE_TYPES.MANUAL_TASK:
             finalUpdatedData = { ...updatedNodeData, type: NODE_TYPES.MANUAL_TASK, config: nodeData.data.config };
            break;
        // ... other cases with specific config
        case NODE_TYPES.WORKFLOW_INPUT:
             const { config: _inputConfig, ...inputData } = updatedNodeData;
             finalUpdatedData = { ...inputData, type: NODE_TYPES.WORKFLOW_INPUT };
             break;
        case NODE_TYPES.WORKFLOW_OUTPUT:
             const { config: _outputConfig, ...outputData } = updatedNodeData;
             finalUpdatedData = { ...outputData, type: NODE_TYPES.WORKFLOW_OUTPUT };
             break;
        default:
             const currentConfig = (nodeData.data as any).config;
             finalUpdatedData = { ...updatedNodeData, type: nodeData.data.type, config: currentConfig }; 
             break;
    }

    const updatedNode: Node<NodeData> = { ...nodeData, data: finalUpdatedData };

    console.log(`NodeConfig: Triggering generic onUpdate with:`, updatedNode);
    onUpdate(updatedNode);
    toast({ title: "Node Updated", description: `Node "${nodeLabel || 'Unnamed'}" configuration updated.` });
  }, [onUpdate, nodeData, nodeLabel, nodeSublabel, nodeDescription, nodeInputSchema, nodeOutputSchema, toast]);

  // --- Branch Handlers (Updated for Strict Types) ---
  const handleBranchesUpdate = useCallback((updatedBranches: Branch[]) => {
    if (!onUpdate) {
      console.error("NodeConfig: onUpdate handler is missing for branches update.");
      toast({ title: "Update Failed", description: "Unable to update node branches.", variant: "destructive"});
      return;
    }

    // Only Decision nodes should have branches directly modified here
    if (nodeData.data.type === NODE_TYPES.DECISION) {
      const updatedNodeData: NodeData = {
        ...nodeData.data,
        label: nodeLabel,
        sublabel: nodeSublabel,
        description: nodeDescription,
        input_schema: nodeInputSchema,
        output_schema: nodeOutputSchema,
        branches: updatedBranches,
      };
      const updatedNode: Node<NodeData> = { ...nodeData, data: updatedNodeData };
      console.log(`NodeConfig: Triggering onUpdate from handleBranchesUpdate with:`, updatedNode);
      onUpdate(updatedNode);
      toast({ title: "Conditional Steps Updated", description: `Configuration for \"${nodeLabel || 'Unnamed'}\" updated.` });
    } else {
      // For non-decision nodes, do nothing (branches not supported)
      console.warn("Attempting to update branches on non-decision node:", nodeData.data.type);
    }
  }, [nodeData, nodeLabel, nodeSublabel, nodeDescription, nodeInputSchema, nodeOutputSchema, onUpdate, toast]);

  // --- DataStore Handler (Updated for Strict Types) --- 
  const handleDataStoreConfigUpdate = useCallback((dataStoreConfig: DataStoreNodeConfig) => {
    if (nodeData.data.type !== NODE_TYPES.DATA_STORE) return; // Type guard
    if (!onUpdate) {
      console.error("NodeConfig: onUpdate handler is missing for data store config update.");
      toast({ title: "Update Failed", description: "Unable to update data store configuration.", variant: "destructive"});
      return;
    }

    // dataStoreConfig IS the new config object
    const newConfig: DataStoreNodeConfig = dataStoreConfig;
    
    // Determine sublabel based on the new config
    const newSublabel = newConfig.table && newConfig.action
        ? `${newConfig.action.charAt(0).toUpperCase() + newConfig.action.slice(1)} ${newConfig.table}`
        : nodeSublabel; // Keep original if config is incomplete

    const updatedNodeData: NodeData = {
      ...nodeData.data, // Includes original type, config, etc.
      label: nodeLabel, // Use potentially updated label/desc from local state
      sublabel: newSublabel, // Set potentially updated sublabel
      description: nodeDescription, 
      config: newConfig, // Set the new, strongly-typed config
      input_schema: nodeInputSchema, // Keep potentially updated schemas
      output_schema: nodeOutputSchema,
    };
    const updatedNode: Node<NodeData> = { ...nodeData, data: updatedNodeData };

    console.log(`NodeConfig: Triggering onUpdate from handleDataStoreConfigUpdate with:`, updatedNode);
    onUpdate(updatedNode);
    toast({ title: "Data Store Updated", description: `Configuration for "${nodeLabel || 'Unnamed'}" updated.` });
    // Let DataStoreConfig manage its own closing state

  }, [nodeData, nodeLabel, nodeSublabel, nodeDescription, nodeInputSchema, nodeOutputSchema, onUpdate, toast]);

  // --- Integration Config Handler ---
  const handleIntegrationConfigUpdate = useCallback((config: BaseIntegrationConfig) => {
    if (!onUpdate || nodeData.data.type !== NODE_TYPES.INTEGRATION) return;

    // Find the integration definition to potentially get a name/label
    // This requires access to the fetched integrations, which aren't currently
    // available in NodeConfig. For now, we'll rely on existing label/sublabel state.
    // TODO: Potentially pass integrations down or fetch them here if needed for sublabel updates.

    // Construct the updated node data
    const updatedNodeData: IntegrationNodeData = {
      ...nodeData.data, // Start with existing data (preserves type, etc.)
      label: nodeLabel, // Use potentially updated label/desc from local state
      sublabel: nodeSublabel, // Keep current sublabel (consider updating if needed)
      description: nodeDescription,
      config: config, // Set the new integration config object
      input_schema: nodeInputSchema, // Use the schema potentially updated by handleActionSchemaUpdate
      output_schema: nodeOutputSchema, // Keep current output schema
      icon_url: config.icon_url, // Update icon URL from config
    };

    const updatedNode: Node<IntegrationNodeData> = {
      ...nodeData,
      data: updatedNodeData,
    };

    console.log(`NodeConfig: Triggering onUpdate from handleIntegrationConfigUpdate with:`, updatedNode);
    onUpdate(updatedNode as Node<NodeData>); // Call the main onUpdate passed to NodeConfig
    toast({ title: "Integration Updated", description: `Configuration for "${nodeLabel || 'Unnamed'}" updated.` });

    // Dependencies should include everything used inside the callback
  }, [onUpdate, nodeData, nodeLabel, nodeSublabel, nodeDescription, nodeInputSchema, nodeOutputSchema, toast]);

  // --- Manual Task Config Handler --- 
  const handleManualTaskConfigUpdate = useCallback((config: ManualTaskConfig) => {
    if (nodeData.data.type !== NODE_TYPES.MANUAL_TASK) return; // Type guard
    if (!onUpdate) {
      console.error("NodeConfig: onUpdate handler is missing for manual task config update.");
      toast({ title: "Update Failed", description: "Unable to update manual task configuration.", variant: "destructive"});
      return;
    }

    const updatedNodeData: NodeData = {
      ...nodeData.data, // Includes original type, config, etc.
      label: nodeLabel, // Use potentially updated label/desc from local state
      sublabel: nodeSublabel, 
      description: nodeDescription, 
      config: config, // Set the new, strongly-typed config
      input_schema: nodeInputSchema, // Keep potentially updated schemas
      output_schema: nodeOutputSchema,
    };
    const updatedNode: Node<NodeData> = { ...nodeData, data: updatedNodeData };

    console.log(`NodeConfig: Triggering onUpdate from handleManualTaskConfigUpdate with:`, updatedNode);
    onUpdate(updatedNode);
    toast({ title: "Manual Task Updated", description: `Configuration for "${nodeLabel || 'Unnamed'}" updated.` });
    // Let ManualTaskConfigPanel manage its own closing state
  }, [nodeData, nodeLabel, nodeSublabel, nodeDescription, nodeInputSchema, nodeOutputSchema, onUpdate, toast]);

  // --- Manual Task Branch Update Handler ---
  const handleManualTaskBranchesUpdate = useCallback((branches: any[]) => {
    if (nodeData.data.type !== NODE_TYPES.MANUAL_TASK) return; // Type guard
    if (!onUpdate) {
      console.error("NodeConfig: onUpdate handler is missing for manual task branches update.");
      toast({ title: "Update Failed", description: "Unable to update manual task branches.", variant: "destructive"});
      return;
    }

    // Format branches with proper structure if needed
    const formattedBranches: Branch[] = branches.map(branch => ({
      id: branch.id,
      name: branch.name,
      color: branch.color || '#22c55e',
      condition: branch.condition || ''
    }));

    const updatedNodeData: NodeData = {
      ...nodeData.data,
      label: nodeLabel,
      sublabel: nodeSublabel,
      description: nodeDescription,
      input_schema: nodeInputSchema,
      output_schema: nodeOutputSchema,
      branches: formattedBranches, // Update branches
    };
    const updatedNode: Node<NodeData> = { ...nodeData, data: updatedNodeData };

    console.log(`NodeConfig: Triggering onUpdate from handleManualTaskBranchesUpdate with:`, updatedNode);
    onUpdate(updatedNode);
    toast({ title: "Manual Task Outcomes Updated", description: `Outcomes for "${nodeLabel || 'Unnamed'}" updated.` });
  }, [nodeData, nodeLabel, nodeSublabel, nodeDescription, nodeInputSchema, nodeOutputSchema, onUpdate, toast]);

  // --- Document Config Handler ---
  const handleDocumentConfigUpdate = useCallback((config: DocumentNodeConfig) => {
    if (!onUpdate || nodeData.data.type !== NODE_TYPES.DOCUMENT) return;

    const newSublabel = config.action
      ? `${config.action.charAt(0).toUpperCase() + config.action.slice(1)} Document`
      : nodeSublabel;

    // DocumentNodeData expects config: BaseIntegrationConfig
    const updatedNodeData: DocumentNodeData = {
      ...nodeData.data,
      label: nodeLabel,
      sublabel: newSublabel,
      description: nodeDescription,
      config: config as any, // Accept as BaseIntegrationConfig (safe for now)
      input_schema: nodeInputSchema,
      output_schema: nodeOutputSchema,
    };
    const updatedNode: Node<NodeData> = { ...nodeData, data: updatedNodeData };

    console.log(`NodeConfig: Triggering onUpdate from handleDocumentConfigUpdate with:`, updatedNode);
    onUpdate(updatedNode);
    toast({ title: "Document Action Updated", description: `Configuration for \"${nodeLabel || 'Unnamed'}\" updated.` });

  }, [nodeData, nodeLabel, nodeSublabel, nodeDescription, nodeInputSchema, nodeOutputSchema, onUpdate, toast]);

  // --- AI Config Handler ---
  const handleAINodeUpdate = useCallback((updatedNode: Node<AITaskNodeData>) => {
    if (!onUpdate || nodeData.data.type !== NODE_TYPES.AI_TASK) return;
    
    // Config is now inside updatedNode.data.config
    // We don't need to reconstruct the node here, as AIConfig already did it.
    console.log(`NodeConfig: Received updated AI node:`, updatedNode);

    // Directly pass the updated node to the parent's onUpdate
    onUpdate(updatedNode); 
    toast({ title: "AI Configuration updated" });
  }, [nodeData, nodeLabel, nodeDescription, nodeInputSchema, nodeOutputSchema, onUpdate]);

  // --- Update General Props Handlers for the refactored component --- 
  const handleSaveGeneralProps = useCallback(() => {
    triggerNodeUpdate();
    // The stopEditing call is now handled within GeneralPropsSection or its parent hook context implicitly
    // We might need to explicitly call stopEditingGeneralProps if it was sourced from NodeConfig, 
    // but it should ideally come from the hook within GeneralPropsSection.
    // For now, assuming the hook handles stopping.
  }, [triggerNodeUpdate]);
  
  const handleCancelEditGeneralProps = useCallback(() => {
    // State reset is now handled inside GeneralPropsSection using its initialState buffer
    // We might still need to call stopEditing from here if the hook instance is managed here
    // but ideally, GeneralPropsSection calls stopEditing internally on cancel.
  }, []);

  // --- Add dynamic titles/descriptions for schemas based on node type ---
  const isWorkflowInput = nodeData.data.type === NODE_TYPES.WORKFLOW_INPUT;
  const isWorkflowOutput = nodeData.data.type === NODE_TYPES.WORKFLOW_OUTPUT;

  const inputSchemaTitle = isWorkflowOutput ? "Workflow Outputs" : "Step Inputs";
  const inputSchemaDescription = isWorkflowOutput 
      ? "Define the final data structure produced by the workflow." 
      : "Define the input fields this node requires.";

  const outputSchemaTitle = isWorkflowInput ? "Workflow Inputs" : "Step Outputs";
  const outputSchemaDescription = isWorkflowInput 
      ? "Define the initial data structure required by the workflow." 
      : "Define the output fields this node produces.";

  // Determine when to disable editing of step inputs/outputs via central rules
  const nodeType = nodeData.data.type;
  // Read the current action from config if available
  const currentConfig = (nodeData.data as any).config || {};
  const currentAction = currentConfig.action as string | undefined;
  const disableInputSchema = !inputSchemaEditable[nodeType]?.(currentAction);
  const disableOutputSchema = !outputSchemaEditable[nodeType]?.(currentAction);

  // --- Render Logic ---
  const isEditingBranches = useConfigSection(SECTION_IDS.BRANCHES, nodeData.id).isEditing;
  const isEditingDataStore = useConfigSection(SECTION_IDS.DATA_STORE, nodeData.id).isEditing;
  const isEditingIntegration = useConfigSection(SECTION_IDS.INTEGRATION, nodeData.id).isEditing;
  const isEditingManualTask = useConfigSection(SECTION_IDS.MANUAL_TASK, nodeData.id).isEditing;
  const isEditingDocument = useConfigSection(SECTION_IDS.DOCUMENT, nodeData.id).isEditing;
  const isEditingAI = useConfigSection(SECTION_IDS.AI_TASK, nodeData.id).isEditing;

  // Combine isDisabled checks
  const isAnyOtherSectionEditing = (
    isEditingBranches ||
    isEditingDataStore ||
    isEditingIntegration ||
    isEditingManualTask ||
    isEditingDocument ||
    isEditingAI
  );

  return (
    <div className="space-y-4">
      {/* General Properties Section (now as a component) */}
      <GeneralPropsSection
        nodeLabel={nodeLabel}
        setNodeLabel={setNodeLabel}
        nodeSublabel={nodeSublabel}
        setNodeSublabel={setNodeSublabel}
        nodeDescription={nodeDescription}
        setNodeDescription={setNodeDescription}
        // Pass sectionId and elementId
        sectionId={SECTION_IDS.GENERAL_PROPS}
        elementId={nodeData.id}
        // Update handlers
        onSave={handleSaveGeneralProps} 
        onCancelEdit={handleCancelEditGeneralProps} 
        // Remove props related to internal state management
        // isEditingGeneralProps={isEditingGeneralProps}
        // isOtherSectionOpen={isOtherSectionOpen}
        // handleEditGeneralProps={handleEditGeneralProps}
        // handleCancelGeneralProps={handleCancelGeneralProps}
        // triggerNodeUpdate={() => { ... }}
      />

      {/* Input Schema Section (conditionally rendered and titled) */}
      {nodeData.data.type !== NODE_TYPES.WORKFLOW_INPUT && (
        <CollapsibleSchemaSection
          title={inputSchemaTitle}
          description={inputSchemaDescription}
          schema={nodeInputSchema}
          onChange={handleInputSchemaChange}
          onUpdate={triggerNodeUpdate}
          onCancel={() => setNodeInputSchema(Array.isArray(nodeData.data?.input_schema) ? nodeData.data.input_schema : [])}
          icon={LogIn}
          disabled={disableInputSchema}
          sectionId={SECTION_IDS.INPUT_SCHEMA}
          elementId={nodeData.id}
        />
      )}

      {/* Custom Node Type Sections (middle, only one shows at a time) */}
      {nodeData.data.type === NODE_TYPES.DATA_STORE && (
        <DataStoreConfig
          nodeData={nodeData}
          onUpdate={handleDataStoreConfigUpdate}
          sectionId={SECTION_IDS.DATA_STORE}
        />
      )}
      {nodeData.data.type === NODE_TYPES.INTEGRATION && (
        <IntegrationConfig
          nodeData={nodeData as Node<IntegrationNodeData>}
          onUpdate={handleIntegrationConfigUpdate}
          onActionOutputSchemaChange={handleActionSchemaUpdate}
          onActionInputSchemaChange={handleActionInputSchemaUpdate}
          sectionId={SECTION_IDS.INTEGRATION}
        />
      )}
      {nodeData.data.type === NODE_TYPES.MANUAL_TASK && (
        <ManualTaskConfigPanel
          nodeData={nodeData as Node<ManualTaskNodeData>}
          onUpdate={handleManualTaskConfigUpdate}
          onUpdateBranches={handleManualTaskBranchesUpdate}
          sectionId={SECTION_IDS.MANUAL_TASK}
        />
      )}
      {nodeData.data.type === NODE_TYPES.DOCUMENT && (
        <DocumentConfig
          nodeData={nodeData as Node<DocumentNodeData>}
          onUpdate={handleDocumentConfigUpdate}
          isDisabled={isAnyOtherSectionEditing && !isEditingDocument}
          sectionId={SECTION_IDS.DOCUMENT}
          onActionInputSchemaChange={handleActionInputSchemaUpdate}
          onActionOutputSchemaChange={handleActionSchemaUpdate}
        />
      )}
      {nodeData.data.type === NODE_TYPES.AI_TASK && (
        <AIConfig
          nodeData={nodeData as Node<AITaskNodeData>}
          onUpdate={handleAINodeUpdate}
          isDisabled={isAnyOtherSectionEditing && !isEditingAI}
          sectionId={SECTION_IDS.AI_TASK}
          onActionInputSchemaChange={handleActionInputSchemaUpdate}
          onActionOutputSchemaChange={handleActionSchemaUpdate}
        />
      )}
      {/* Add other custom node types here as needed */}

      {/* Output Schema Section (conditionally rendered and titled) */}
      {nodeData.data.type !== NODE_TYPES.WORKFLOW_OUTPUT && (
        <CollapsibleSchemaSection
          title={outputSchemaTitle}
          description={outputSchemaDescription}
          schema={nodeOutputSchema}
          onChange={handleOutputSchemaChange}
          onUpdate={triggerNodeUpdate}
          onCancel={() => setNodeOutputSchema(Array.isArray(nodeData.data?.output_schema) ? nodeData.data.output_schema : [])}
          icon={LogOut}
          disabled={disableOutputSchema}
          sectionId={SECTION_IDS.OUTPUT_SCHEMA}
          elementId={nodeData.id}
        />
      )}

      {/* Branches Section (always last, rendered for all types except Workflow Output and Manual Task) */}
      {nodeData.data.type !== NODE_TYPES.WORKFLOW_OUTPUT && nodeData.data.type !== NODE_TYPES.MANUAL_TASK && (
        <CollapsibleBranchSection
          title="Conditional Steps" // Updated title
          description="Define conditional paths for the next step."
          branches={nodeData.data.branches || []} // Default to empty array if undefined
          onUpdate={handleBranchesUpdate}
          icon={GitBranch}
          sectionId={SECTION_IDS.BRANCHES}
          elementId={nodeData.id}
        />
      )}
    </div>
  );
};