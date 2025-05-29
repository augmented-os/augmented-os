import React, { useState, useEffect } from 'react';
import { Node } from 'reactflow';
import { IntegrationNodeData, BaseIntegrationConfig, NODE_TYPES, SchemaField } from '@/types/workflow';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Check, ChevronRight, Pencil, Puzzle, Link2, Settings2, ChevronDown } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { fetchIntegrations, getInstancesForDefinition } from '@/data/integrationService';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
import { useConfigSection } from '@/features/workflowDesigner/hooks';

// Update IntegrationDefinition type to match new structure
interface IntegrationDefinition {
  id: string;
  name: string;
  integration_id: string; // Use as provider equivalent if needed
  config_schema: any;
  auth_type: string;
  icon_url?: string;
  description?: string;
  methods?: any[];
}

// Define the structure for config_schema fields
interface ConfigSchemaField {
  id: string;
  name: string;
  dataType: 'string' | 'number' | 'boolean'; // Extend as needed
  description?: string;
  optional?: boolean;
}

// Define the structure for the provider display list
interface ProviderDisplayInfo {
  key: string; // Original provider key (e.g., 'google-sheets')
  displayName: string; // Derived display name (e.g., 'Google Sheets')
  iconUrl?: string; // Icon URL from the first integration of this provider
}

/**
 * Strips the provider prefix from an action name
 * E.g., "Slack: Send Message" -> "Send Message"
 */
const stripProviderPrefix = (name: string): string => {
  // Look for the pattern "Provider: Action" and return just "Action"
  const colonIndex = name.indexOf(':');
  if (colonIndex !== -1 && colonIndex < name.length - 1) {
    return name.substring(colonIndex + 1).trim();
  }
  return name;
};

interface IntegrationConfigProps {
  nodeData: Node<IntegrationNodeData>;
  onUpdate: (config: BaseIntegrationConfig) => void;
  isDisabled?: boolean; // Indicates if another section is being edited
  onActionOutputSchemaChange: (schema: SchemaField[] | null) => void; // For Step Outputs
  onActionInputSchemaChange: (schema: SchemaField[] | null) => void; // For Step Inputs
  sectionId: string; // Add section ID
}

// Mock connection data (replace with actual fetching if needed)
const MOCK_CONNECTIONS = [
  { id: 'conn-1', name: 'Default Connection' },
  { id: 'conn-2', name: 'Secondary Connection' },
];

/**
 * Renders the configuration UI for Integration nodes.
 */
export const IntegrationConfig: React.FC<IntegrationConfigProps> = ({
  nodeData,
  onUpdate,
  isDisabled = false,
  onActionOutputSchemaChange,
  onActionInputSchemaChange,
  sectionId
}) => {
  // --- Type Guard ---
  if (nodeData.data.type !== NODE_TYPES.INTEGRATION) {
    return null;
  }

  // Use our new config section hook
  const { isDisabled: isSectionDisabled, isEditing, startEditing, stopEditing } = 
    useConfigSection(sectionId, nodeData.id);
  
  // Combine the passed isDisabled with our state machine's isDisabled
  const effectivelyDisabled = isDisabled || isSectionDisabled;

  // --- State ---
  const [definitions, setDefinitions] = useState<IntegrationDefinition[]>([]);
  const [selectedDefinitionId, setSelectedDefinitionId] = useState<string | undefined>(nodeData.data.config?.integration_definition_id);
  const [selectedMethodId, setSelectedMethodId] = useState<string | undefined>(nodeData.data.config?.method_id);
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | undefined>(nodeData.data.config?.integration_instance_id);
  const [instances, setInstances] = useState<any[]>([]);
  const [dynamicConfigValues, setDynamicConfigValues] = useState<Record<string, any>>(
    Object.entries(nodeData.data.config || {})
          .filter(([key]) => key !== 'integration_id' && key !== 'connection_id' && key !== 'icon_url')
          .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialConfig, setInitialConfig] = useState<BaseIntegrationConfig | null>(null); // For cancel
  const [instancesLoading, setInstancesLoading] = useState(false);
  const [methodInputs, setMethodInputs] = useState<Record<string, string>>({});

  // --- Data Fetching & Processing ---
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedData = await fetchIntegrations();
        if (!fetchedData || fetchedData.length === 0) {
          throw new Error('No integrations found.');
        }
        setDefinitions(fetchedData);

        // Process providers
        const providerMap = new Map<string, ProviderDisplayInfo>();
        fetchedData.forEach(int => {
          if (!providerMap.has(int.integration_id)) {
            let displayName = int.name.split(':')[0].trim();
            if (!displayName) displayName = int.integration_id;
            providerMap.set(int.integration_id, { key: int.integration_id, displayName: displayName, iconUrl: int.icon_url });
          }
        });
        const processedProviders = Array.from(providerMap.values()).sort((a, b) => a.displayName.localeCompare(b.displayName));
        
        // Set initial state based on nodeData
        const currentConfig = nodeData.data.config;
        setInitialConfig(currentConfig ? { ...currentConfig } : null);
        if (currentConfig) {
          const currentIntegration = fetchedData.find(int => int.id === currentConfig.integration_id);
          setSelectedDefinitionId(currentConfig.integration_definition_id);
          setSelectedMethodId(currentConfig.method_id);
          setSelectedInstanceId(currentConfig.integration_instance_id);
          setDynamicConfigValues(
            Object.entries(currentConfig)
                  .filter(([key]) => !['integration_id', 'connection_id', 'icon_url'].includes(key))
                  .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
          );
          
          // Set up output schema for existing configuration
          if (currentConfig.integration_definition_id && currentConfig.method_id) {
            const definition = fetchedData.find(def => def.id === currentConfig.integration_definition_id);
            const method = definition?.methods?.find(m => m.id === currentConfig.method_id);
            
            // Handle input schema for Step Inputs
            if (method?.inputSchema?.properties) {
              const inputSchemaFields = Object.entries(method.inputSchema.properties).map(([key, prop]: [string, any]) => ({
                id: key,
                name: key,
                dataType: prop.type || 'string',
                required: method.inputSchema.required?.includes(key) || false,
                description: prop.description || '',
                severity: 'info' // Default severity
              }));
              
              // Call the callback with the input schema fields
              onActionInputSchemaChange(inputSchemaFields);
            }
            
            // Handle output schema for Step Outputs
            if (method?.outputSchema?.properties) {
              const schemaFields = Object.entries(method.outputSchema.properties).map(([key, prop]: [string, any]) => ({
                id: key,
                name: key,
                dataType: prop.type || 'string',
                required: method.outputSchema.required?.includes(key) || false,
                description: prop.description || '',
                severity: 'info' // Default severity
              }));
              
              // Call the callback with the schema fields
              onActionOutputSchemaChange(schemaFields);
            }
          }
        } else {
          setSelectedDefinitionId(undefined);
          setSelectedMethodId(undefined);
          setSelectedInstanceId(undefined);
          setDynamicConfigValues({});
        }

      } catch (err: any) {
        setError(err.message || 'Failed to load integration data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [nodeData, onActionOutputSchemaChange, onActionInputSchemaChange]); // Add both callbacks to dependencies

  // Fetch instances when definition changes
  useEffect(() => {
    if (selectedDefinitionId) {
      setInstancesLoading(true);
      getInstancesForDefinition(selectedDefinitionId)
        .then(data => {
          setInstances(data);
          setInstancesLoading(false);
        })
        .catch(err => {
          console.error("Error fetching instances:", err);
          setInstances([]);
          setInstancesLoading(false);
        });
    } else {
      setInstances([]);
    }
  }, [selectedDefinitionId]);

  // Update useEffect to initialize method inputs when a method is selected
  useEffect(() => {
    if (selectedDefinition && selectedMethodId) {
      const method = selectedDefinition.methods?.find(m => m.id === selectedMethodId);
      if (method?.inputSchema?.properties) {
        // Initialize inputs with empty values or existing values
        const initialInputs: Record<string, string> = {};
        Object.keys(method.inputSchema.properties).forEach(key => {
          initialInputs[key] = dynamicConfigValues[key] || '';
        });
        setMethodInputs(initialInputs);
      }
    }
  }, [selectedMethodId, dynamicConfigValues, selectedDefinitionId, definitions]);

  // --- Computed Values ---
  const selectedDefinition = definitions.find(def => def.id === selectedDefinitionId);
  const methods = selectedDefinition?.methods || [];
  const selectedIntegration = instances.find(int => int.id === selectedInstanceId);
  const availableActions = selectedDefinition
    ? definitions.filter(int => int.integration_id === selectedDefinition.integration_id)
    : [];
  const requiresConnection = selectedIntegration?.requires_connection ?? false;

  // Group definitions by provider (integration_id)
  const groupedDefinitions = definitions.reduce((acc, def) => {
    if (!acc[def.integration_id]) acc[def.integration_id] = [];
    acc[def.integration_id].push(def);
    return acc;
  }, {} as Record<string, IntegrationDefinition[]>);
  const providerOptions = Object.entries(groupedDefinitions);

  // Build providerGroups for display info (icon, displayName)
  const providerGroups = providerOptions.map(([provider, defs]) => ({
    key: provider,
    displayName: provider.charAt(0).toUpperCase() + provider.slice(1), // Simple prettify
    iconUrl: defs[0]?.icon_url,
    definitions: defs,
  }));

  // --- Get info for the currently SAVED configuration for header display ---
  const currentConfig = nodeData.data.config;
  const currentIntegrationId = currentConfig?.integration_id;
  const currentIntegrationDef = definitions.find(int => int.id === currentIntegrationId);
  // Use providerGroups for display info
  const currentProviderGroup = providerGroups.find(g => g.key === currentIntegrationDef?.integration_id);
  const currentProviderInfo = currentProviderGroup
    ? { displayName: currentProviderGroup.displayName, iconUrl: currentProviderGroup.iconUrl }
    : undefined;
  const headerTitle = currentProviderInfo?.displayName ? `${currentProviderInfo.displayName} Configuration` : 'Integration Configuration';
  const editHeaderTitle = currentProviderInfo?.displayName ? `Edit ${currentProviderInfo.displayName} Configuration` : 'Edit Integration Configuration';

  // For selectedDefinition, get its provider group for display info
  const selectedProviderGroup = providerGroups.find(g => g.key === selectedDefinition?.integration_id);
  const selectedProviderInfo = selectedProviderGroup
    ? { displayName: selectedProviderGroup.displayName, iconUrl: selectedProviderGroup.iconUrl }
    : undefined;

  // --- Event Handlers ---
  const handleDefinitionChange = (value: string) => {
    setSelectedDefinitionId(value);
    setSelectedMethodId(undefined);
    setSelectedInstanceId(undefined);
    setDynamicConfigValues({});
    
    // Update the node immediately so the preview shows the new icon
    const newDefinition = definitions.find(def => def.id === value);
    if (newDefinition) {
      // Create a partial update for the config to show in preview
      const temporaryConfig = {
        ...initialConfig,
        integration_definition_id: value,
        method_id: undefined,
        integration_instance_id: undefined
      };
      setInitialConfig(temporaryConfig);
      
      // Also update the node UI immediately
      const previewUpdate = {
        integration_definition_id: value,
        method_id: undefined,
        integration_instance_id: undefined,
        icon_url: newDefinition.icon_url
      };
      onUpdate(previewUpdate);
    }
  };

  const handleMethodChange = (value: string) => {
    setSelectedMethodId(value);
    
    // When method changes, initialize input fields based on method schema
    if (selectedDefinition) {
      const method = selectedDefinition.methods?.find(m => m.id === value);
      
      // Use inputSchema for form fields
      if (method?.inputSchema?.properties) {
        const initialInputs: Record<string, string> = {};
        Object.keys(method.inputSchema.properties).forEach(key => {
          // Use existing values from dynamicConfigValues if available
          initialInputs[key] = dynamicConfigValues[key] || '';
        });
        setMethodInputs(initialInputs);
        
        // Also pass inputSchema to parent for Step Inputs
        const inputSchemaFields = Object.entries(method.inputSchema.properties).map(([key, prop]: [string, any]) => ({
          id: key,
          name: key,
          dataType: prop.type || 'string',
          required: method.inputSchema.required?.includes(key) || false,
          description: prop.description || '',
          severity: 'info' // Default severity
        }));
        
        // Call the callback with the input schema fields for Step Inputs
        onActionInputSchemaChange(inputSchemaFields);
      } else {
        // Clear method inputs if the new method has no input schema
        setMethodInputs({});
        onActionInputSchemaChange(null);
      }
      
      // Pass the outputSchema to onActionOutputSchemaChange for Step Outputs
      // This defines what data this node makes available to downstream nodes
      const outputSchema = method?.outputSchema;
      if (outputSchema && outputSchema.properties) {
        // Convert to SchemaField[] format for the parent component
        const schemaFields = Object.entries(outputSchema.properties).map(([key, prop]: [string, any]) => ({
          id: key,
          name: key,
          dataType: prop.type || 'string',
          required: outputSchema.required?.includes(key) || false,
          description: prop.description || '',
          severity: 'info' // Default severity
        }));
        
        // Call the callback with the schema fields for Step Outputs
        onActionOutputSchemaChange(schemaFields);
      } else {
        onActionOutputSchemaChange(null);
      }
      
      // Update the preview with the new method
      const temporaryConfig = {
        ...initialConfig,
        integration_definition_id: selectedDefinitionId,
        method_id: value,
        integration_instance_id: selectedInstanceId
      };
      setInitialConfig(temporaryConfig);
      
      // Also update the node UI immediately
      const previewUpdate = {
        integration_definition_id: selectedDefinitionId,
        method_id: value,
        integration_instance_id: selectedInstanceId,
        icon_url: selectedDefinition.icon_url
      };
      onUpdate(previewUpdate);
    } else {
      onActionInputSchemaChange(null);
      onActionOutputSchemaChange(null);
    }
  };

  const handleInstanceChange = (value: string) => {
    setSelectedInstanceId(value);
    
    // When integration instance changes, load its values into method inputs
    const selectedInstance = instances.find(inst => inst.id === value);
    if (selectedInstance && selectedInstance.config) {
      // Extract existing values from the instance config
      const instanceConfig = selectedInstance.config;
      
      // Update dynamic config values with instance config
      setDynamicConfigValues(prevConfig => ({
        ...prevConfig,
        ...instanceConfig
      }));
      
      // Also update method inputs if a method is already selected
      if (selectedMethodId && selectedDefinition) {
        const method = selectedDefinition.methods?.find(m => m.id === selectedMethodId);
        
        // Use inputSchema for form fields (these come from the selected instance)
        if (method?.inputSchema?.properties) {
          const initialInputs: Record<string, string> = {};
          Object.keys(method.inputSchema.properties).forEach(key => {
            initialInputs[key] = instanceConfig[key] || '';
          });
          setMethodInputs(initialInputs);
          
          // Also pass inputSchema to parent for Step Inputs
          const inputSchemaFields = Object.entries(method.inputSchema.properties).map(([key, prop]: [string, any]) => ({
            id: key,
            name: key,
            dataType: prop.type || 'string',
            required: method.inputSchema.required?.includes(key) || false,
            description: prop.description || '',
            severity: 'info' // Default severity
          }));
          
          // Call the callback with the input schema fields for Step Inputs
          onActionInputSchemaChange(inputSchemaFields);
        } else {
          onActionInputSchemaChange(null);
        }
        
        // Pass the outputSchema to onActionOutputSchemaChange for Step Outputs
        // This defines what data this node makes available to downstream nodes
        const outputSchema = method?.outputSchema;
        if (outputSchema && outputSchema.properties) {
          // Convert to SchemaField[] format for the parent component
          const schemaFields = Object.entries(outputSchema.properties).map(([key, prop]: [string, any]) => ({
            id: key,
            name: key,
            dataType: prop.type || 'string',
            required: outputSchema.required?.includes(key) || false,
            description: prop.description || '',
            severity: 'info' // Default severity
          }));
          
          // Call the callback with the schema fields for Step Outputs
          onActionOutputSchemaChange(schemaFields);
        } else {
          onActionOutputSchemaChange(null);
        }
        
        // Update the preview with the new instance
        const temporaryConfig = {
          ...initialConfig,
          integration_definition_id: selectedDefinitionId,
          method_id: selectedMethodId,
          integration_instance_id: value,
          ...instanceConfig
        };
        setInitialConfig(temporaryConfig);
        
        // Also update the node UI immediately
        const previewUpdate = {
          integration_definition_id: selectedDefinitionId,
          method_id: selectedMethodId,
          integration_instance_id: value,
          icon_url: selectedDefinition.icon_url,
          ...instanceConfig
        };
        onUpdate(previewUpdate);
      }
    }
  };

  const handleDynamicConfigChange = (fieldName: string, value: any) => {
    setDynamicConfigValues(prev => ({ ...prev, [fieldName]: value }));
  };

  const handleMethodInputChange = (key: string, value: string) => {
    setMethodInputs(prev => ({ ...prev, [key]: value }));
    handleDynamicConfigChange(key, value);
  };

  const handleEdit = () => {
     if (!effectivelyDisabled) {
      // Restore initial state before starting edit
      setInitialConfig(nodeData.data.config ? { ...nodeData.data.config } : null);
      const configToRestore = nodeData.data.config;
      const integrationToRestore = definitions.find(int => int.id === configToRestore?.integration_id);
      setSelectedDefinitionId(configToRestore?.integration_definition_id);
      setSelectedMethodId(configToRestore?.method_id);
      setSelectedInstanceId(configToRestore?.integration_instance_id);
      setDynamicConfigValues(
        Object.entries(configToRestore || {})
              .filter(([key]) => !['integration_id', 'connection_id', 'icon_url'].includes(key))
              .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
      );
      startEditing();
     }
  };

  const handleCancel = () => {
    // Restore from initialConfig buffer
    const configToRestore = initialConfig;
    const integrationToRestore = definitions.find(int => int.id === configToRestore?.integration_id);
    setSelectedDefinitionId(configToRestore?.integration_definition_id);
    setSelectedMethodId(configToRestore?.method_id);
    setSelectedInstanceId(configToRestore?.integration_instance_id);
    setDynamicConfigValues(
      Object.entries(configToRestore || {})
            .filter(([key]) => !['integration_id', 'connection_id', 'icon_url'].includes(key))
            .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
    );
    stopEditing();
  };

  const handleUpdate = () => {
    if (!selectedInstanceId) {
        console.error("Cannot update without selecting an integration instance.");
        return;
    }

    // Get the selected definition to include its icon
    const definition = definitions.find(def => def.id === selectedDefinitionId);

    const updatedConfig = {
      integration_definition_id: selectedDefinitionId,
      method_id: selectedMethodId,
      integration_instance_id: selectedInstanceId,
      icon_url: definition?.icon_url, // Include the icon URL from the definition
      ...dynamicConfigValues
    };

    onUpdate(updatedConfig);
    stopEditing();
  };

  // --- Rendering Logic ---

  const renderPreview = () => {
    // If we're editing, use the currently selected values
    // Otherwise, use initialConfig for preview consistency after cancel
    let definitionId = initialConfig?.integration_definition_id;
    let methodId = initialConfig?.method_id;
    let instanceId = initialConfig?.integration_instance_id;
    
    // When in editing mode, use the currently selected values
    if (isEditing) {
      definitionId = selectedDefinitionId;
      methodId = selectedMethodId;
      instanceId = selectedInstanceId;
    }
    
    // Get the selected items for display
    const selectedDefinition = definitions.find(def => def.id === definitionId);
    const selectedMethod = selectedDefinition?.methods?.find(m => m.id === methodId);
    const selectedInstance = instances.find(inst => inst.id === instanceId);
    
    // Only include real config params (not IDs and system fields)
    const configEntries = Object.entries(initialConfig || {})
      .filter(([key]) => !['integration_definition_id', 'method_id', 'integration_instance_id', 'icon_url'].includes(key));
    
    const hasConfig = !!selectedDefinition;
    const previewIconUrl = selectedDefinition?.icon_url;
    const previewHeaderTitle = selectedDefinition?.name ? `${selectedDefinition.name} Integration` : 'Integration Configuration';

    return (
      <div className="border rounded-md overflow-hidden bg-gradient-to-b from-white to-gray-50 shadow-sm">
        <button
          onClick={handleEdit}
          disabled={effectivelyDisabled}
          className="flex justify-between items-center w-full h-12 px-3 border-b bg-slate-50 text-left disabled:opacity-70 disabled:cursor-not-allowed hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-colors"
        >
          <div className="flex items-center gap-2">
            {previewIconUrl ? (
              <img src={previewIconUrl} alt="" className="h-4 w-4 rounded-sm object-contain" />
            ) : (
              <Puzzle className="h-4 w-4 text-gray-500" />
            )}
            <span className={`font-medium text-sm ${effectivelyDisabled ? 'text-gray-500' : 'text-gray-800'}`}>{previewHeaderTitle}</span>
          </div>
          {!effectivelyDisabled && <ChevronRight className="h-4 w-4 text-gray-500" />}
        </button>
        {hasConfig ? (
          <div className="p-4 space-y-4">
            {/* Integration details */}
            <div className="grid grid-cols-[120px_1fr] gap-y-4 py-1.5 px-2 bg-white rounded-md border border-gray-50">
              <div className="flex items-center gap-2">
                <Link2 className="h-4 w-4 text-gray-500" />
                <span className="text-xs font-medium uppercase tracking-wide text-gray-500">Integration</span>
              </div>
              <div className="flex justify-end">
                <Badge variant="outline" className="bg-white font-medium text-green-700 border-green-200">
                  {selectedInstance?.name || 'Unknown'}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2">
                <Settings2 className="h-4 w-4 text-gray-500" />
                <span className="text-xs font-medium uppercase tracking-wide text-gray-500">Action</span>
              </div>
              <div className="flex justify-end">
                <Badge variant="outline" className="bg-white font-medium text-blue-700 border-blue-200">
                  {selectedMethod?.name || 'Unknown'}
                </Badge>
              </div>
            </div>
            
            {/* Only show additional config params if there are any */}
            {configEntries.length > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 mb-3 px-2">
                  <Settings2 className="h-4 w-4 text-gray-500" />
                  <span className="text-xs font-medium uppercase tracking-wide text-gray-500">Parameters</span>
                </div>
                <div className="border rounded-md overflow-hidden bg-slate-50/50">
                  <div className="grid grid-cols-[1fr_1.5fr] text-xs">
                    <div className="bg-slate-100 py-1.5 px-3 font-medium text-gray-600 border-b border-gray-200">Parameter</div>
                    <div className="bg-slate-100 py-1.5 px-3 font-medium text-gray-600 border-b border-gray-200 text-right">Value</div>
                    {configEntries.map(([key, value], index) => (
                      <React.Fragment key={key}>
                        <div className={`py-1.5 px-3 font-medium text-gray-700 ${index < configEntries.length - 1 ? 'border-b border-gray-100' : ''}`}>
                          {key.replace(/_/g, ' ')}
                        </div>
                        <div className={`py-1.5 px-3 text-right ${index < configEntries.length - 1 ? 'border-b border-gray-100' : ''}`}>
                          <code className="bg-white px-2 py-0.5 rounded text-gray-700 border border-gray-200 text-xs">{String(value)}</code>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <div className="bg-gray-100 p-3 rounded-full mb-2"><Puzzle className="h-5 w-5 text-gray-400" /></div>
            <p className="text-sm text-gray-500 mb-1">No configuration set</p>
            <p className="text-xs text-gray-400">Click the edit button to configure integration</p>
          </div>
        )}
      </div>
    );
  }

  // --- Render Edit --- 
  const renderEditForm = () => {
    // Get the actively selected definition for the current edit session
    const activeDefinition = definitions.find(def => def.id === selectedDefinitionId);
    
    // Use the actively selected definition for the header
    const dynamicEditHeaderTitle = activeDefinition?.name
      ? `Edit ${activeDefinition.name} Configuration`
      : 'Edit Integration Configuration';
      
    const dynamicEditIconUrl = activeDefinition?.icon_url;

    // Get the selected method for form field generation
    const selectedMethod = activeDefinition?.methods?.find(m => m.id === selectedMethodId);
    
    // Get the inputSchema for form fields (what the user configures)
    const methodInputSchema = selectedMethod?.inputSchema;

    return (
      <div className="border rounded-md overflow-hidden bg-white shadow-sm">
        {/* Edit Header */}
        <div className="flex justify-between items-center h-12 px-3 border-b bg-blue-50">
          <div className="flex items-center gap-2">
            {dynamicEditIconUrl ? (
                <img src={dynamicEditIconUrl} alt="" className="h-4 w-4 rounded-sm object-contain" />
            ) : (
                 <Puzzle className="h-4 w-4 text-blue-600" />
            )}
            <span className="font-medium text-sm text-blue-800">{dynamicEditHeaderTitle}</span>
          </div>
        </div>
        <div className="p-4 space-y-4">
          {/* Dropdowns Grouped */}
          <div className="border rounded-md p-3 bg-slate-50/80 space-y-3">
            {/* Provider Dropdown */}
            <div>
              <Label htmlFor="provider-select" className="text-xs font-medium">Provider</Label>
              <Select value={selectedDefinitionId} onValueChange={handleDefinitionChange} disabled={definitions.length === 0}>
                <SelectTrigger id="provider-select" className="text-sm"><SelectValue placeholder="Select a provider..." /></SelectTrigger>
                <SelectContent>
                  {definitions.map(def => (
                    <SelectItem key={def.id} value={def.id} className="text-sm">
                      <div className="flex items-center gap-2">
                        {def.icon_url && <img src={def.icon_url} alt="" className="h-4 w-4" />} 
                        {def.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Integration Dropdown */}
            <div>
              <Label htmlFor="instance-select" className="text-xs font-medium">Integration</Label>
              <Select 
                value={selectedInstanceId} 
                onValueChange={handleInstanceChange} 
                disabled={!selectedDefinitionId || instances.length === 0 || instancesLoading}
              >
                <SelectTrigger id="instance-select" className="text-sm">
                  <SelectValue placeholder={
                    instancesLoading ? "Loading integrations..." : 
                    instances.length === 0 ? "No integrations available" : 
                    "Select an integration..."
                  } />
                </SelectTrigger>
                <SelectContent>
                  {instancesLoading ? (
                    <div className="p-2 text-sm text-center text-gray-500">Loading integrations...</div>
                  ) : instances.length === 0 ? (
                    <div className="p-2 text-sm text-center text-gray-500">
                      No integrations available for this provider.
                    </div>
                  ) : (
                    <SelectGroup>
                      <SelectLabel>Available Integrations</SelectLabel>
                      {instances.map(instance => (
                        <SelectItem key={instance.id} value={instance.id} className="text-sm">{instance.name}</SelectItem>
                      ))}
                    </SelectGroup>
                  )}
                </SelectContent>
              </Select>
            </div>
            
            {/* Method Dropdown */}
            <div>
              <Label htmlFor="method-select" className="text-xs font-medium">Action</Label>
              <Select value={selectedMethodId} onValueChange={handleMethodChange} disabled={!selectedDefinition || selectedDefinition.methods?.length === 0}>
                <SelectTrigger id="method-select" className="text-sm"><SelectValue placeholder="Select an action..." /></SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Actions for {selectedDefinition?.name || 'selected provider'}</SelectLabel>
                    {methods.map(method => (
                      <SelectItem key={method.id} value={method.id} className="text-sm">{method.name}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Action-specific inputs - Only show if no instance is selected */}
          {selectedMethodId && selectedDefinition && !selectedInstanceId && methodInputSchema && (
            <div className="border-t pt-4 mt-4">
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <Settings2 className="h-4 w-4 text-blue-500" />Action Configuration
              </h4>
              <div className="space-y-3">
                {methodInputSchema.properties ? (
                  Object.entries(methodInputSchema.properties).map(([key, prop]: [string, any]) => {
                    // Get value from selectedInstance if available
                    const selectedInstance = instances.find(inst => inst.id === selectedInstanceId);
                    const instanceValue = selectedInstance?.config?.[key] || '';
                    
                    return (
                      <div key={key} className="mb-1">
                        <Label htmlFor={`method-${key}`} className="text-xs font-medium capitalize">
                          {key} {!methodInputSchema.required?.includes(key) && 
                            <span className="text-gray-400">(Optional)</span>
                          }
                        </Label>
                        {prop.description && <p className="text-xs text-gray-500 mb-1">{prop.description}</p>}
                        <Input 
                          id={`method-${key}`} 
                          type={prop.type === 'number' ? 'number' : 'text'} 
                          value={methodInputs[key] || instanceValue || ''} 
                          onChange={(e) => handleMethodInputChange(key, e.target.value)} 
                          className="text-sm"
                          required={methodInputSchema.required?.includes(key)}
                        />
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-gray-500 mt-2">This action requires no specific configuration.</p>
                )}
              </div>
            </div>
          )}
          {/* Action Buttons */}
          <div className="flex justify-end gap-2 mt-4 border-t pt-4">
            <Button variant="outline" size="sm" onClick={handleCancel}>Cancel</Button>
            <Button size="sm" onClick={handleUpdate} disabled={!selectedInstanceId} className="bg-slate-900 hover:bg-slate-800"><Check className="mr-1 h-4 w-4" /> Update</Button>
          </div>
        </div>
      </div>
    );
  };

  // --- Main Return --- (Uses isEditing from hook)
  if (isLoading) {
    return <p>Loading integration settings...</p>;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-2">
      {isEditing ? renderEditForm() : renderPreview()}
    </div>
  );
};

// Add export if needed, but per guide, keep internal to configPanel
// export default IntegrationConfig; 