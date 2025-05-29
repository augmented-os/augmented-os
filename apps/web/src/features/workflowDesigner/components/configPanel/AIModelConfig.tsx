import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { AlertCircle, ChevronRight, Cpu, Database, Equal, Settings2, Sigma, FileEdit, Thermometer, Text } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import { AINodeConfig } from './AIConfig'; // Import the main config type

// Interfaces (import from AIConfig or a shared type file in a real implementation)
interface AIIntegrationDefinition {
  id: string;
  name: string;
  integration_id: string;
  icon_url?: string;
  description?: string;
  config_schema?: any;
  methods?: any[];
  ai_config?: {
    availableModels?: AIModel[];
  };
  type?: string;
}

interface AIIntegrationInstance {
  id: string;
  name: string;
  description?: string;
  integration_definition_id?: string;
  integration_definition?: {
    icon_url?: string;
    description?: string;
    type?: string;
  };
  config?: any;
  status?: any;
  credentials?: any;
}

interface AIModel {
  id: string;
  name: string;
  description?: string;
  provider_id?: string;
}

interface ModelConfigurationProps {
  initialConfig: Partial<AINodeConfig>; 
  onUpdateNode: (updatedConfig: AINodeConfig) => void; // Function to update the whole node config
  isDisabled: boolean;
  aiIntegrations: AIIntegrationDefinition[];
  aiInstances: AIIntegrationInstance[];
  aiModels: AIModel[];
  error: string | null;
  instancesLoading: boolean;
  sectionId: string; // Needed for useConfigSection hook
  nodeId: string; // Needed for useConfigSection hook
}

// --- Preview Component (Inline) --- 
const ModelConfigPreviewInternal: React.FC<{ config: Partial<AINodeConfig> }> = ({ config }) => {
  const hasModelConfig = config.provider_id || config.integration_instance_id || config.model_id || 
                       (config.parameters && (config.parameters.temperature !== undefined || config.parameters.maxTokens !== undefined));

  if (!hasModelConfig) {
    return (
        <div className="flex flex-col items-center justify-center p-6 text-center bg-gray-50">
            <div className="bg-gray-100 p-3 rounded-full mb-2">
              <Cpu className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500 mb-1">No model configured</p>
            <p className="text-xs text-gray-400">Click the edit button to configure model settings</p>
        </div>
    );
  }

  return (
    <div className="p-4 space-y-4 bg-gray-50">
        <div className="grid grid-cols-[120px_1fr] gap-y-4 py-1.5 px-2 bg-white rounded-md border border-gray-50">
            {/* Integration Instance Row */}
            {config.integration_instance_id && (
                 <>
                    <div className="flex items-center gap-2">
                       <Database className="h-4 w-4 text-gray-500" />
                       <span className="text-xs font-medium uppercase tracking-wide text-gray-500">Integration</span>
                    </div>
                    <div className="text-right flex justify-end">
                        <Badge variant="outline" className="bg-white font-medium text-indigo-700 border-indigo-200 flex items-center gap-1.5 w-fit max-w-full">
                            {config.icon_url && (
                                <img 
                                    src={config.icon_url} 
                                    alt="Provider" 
                                    className="w-3.5 h-3.5 object-contain flex-shrink-0"
                                />
                            )}
                            <span className="truncate" title={config.integration_instance_name || config.integration_instance_id}>
                                {config.integration_instance_name || config.integration_instance_id}
                            </span>
                        </Badge>
                    </div>
                </>
            )}

            {/* Model Row */}
            {config.model_id && (
                 <>
                    <div className="flex items-center gap-2">
                       <Settings2 className="h-4 w-4 text-gray-500" />
                       <span className="text-xs font-medium uppercase tracking-wide text-gray-500">Model</span>
                    </div>
                    <div className="text-right flex justify-end">
                       <Badge variant="outline" className="bg-white font-medium text-blue-700 border-blue-200 truncate w-fit max-w-full" title={config.model_name || config.model_id}>
                         {config.model_name || config.model_id}
                       </Badge>
                    </div>
                </>
            )}

             {/* Temperature Row */}
             {config.parameters?.temperature !== undefined && (
                 <>
                   <div className="flex items-center gap-2">
                      <Thermometer className="h-4 w-4 text-gray-500" />
                      <span className="text-xs font-medium uppercase tracking-wide text-gray-500">Temperature</span>
                   </div>
                   <div className="text-right flex justify-end">
                     <Badge variant="outline" className="bg-white font-medium text-gray-700 border-gray-200 w-fit">
                       {config.parameters.temperature.toFixed(2)}
                     </Badge>
                   </div>
               </>
            )}
            
             {/* Max Tokens Row */}
             {config.parameters?.maxTokens !== undefined && (
                 <>
                   <div className="flex items-center gap-2">
                      <Text className="h-4 w-4 text-gray-500" /> 
                      <span className="text-xs font-medium uppercase tracking-wide text-gray-500">Max Tokens</span>
                   </div>
                   <div className="text-right flex justify-end">
                     <Badge variant="outline" className="bg-white font-medium text-gray-700 border-gray-200 w-fit">
                       {config.parameters.maxTokens}
                     </Badge>
                   </div>
               </>
            )}
        </div>
    </div>
  );
};

const ModelConfiguration: React.FC<ModelConfigurationProps> = ({
  initialConfig,
  onUpdateNode,
  isDisabled,
  aiIntegrations,
  aiInstances,
  aiModels,
  error,
  instancesLoading,
  sectionId,
  nodeId
}) => {

  // Internal state for editing this specific section
  const [isEditing, setIsEditing] = useState(false);
  const [currentModelConfig, setCurrentModelConfig] = useState<Partial<AINodeConfig>>(initialConfig);
  const [bufferedConfig, setBufferedConfig] = useState<Partial<AINodeConfig>>(initialConfig); // For cancel

  // Sync with external changes if not editing
  useEffect(() => {
    if (!isEditing) {
      setCurrentModelConfig(initialConfig);
      setBufferedConfig(initialConfig);
    }
  }, [initialConfig, isEditing]);

  // Start editing
  const startEditing = () => {
      setBufferedConfig(currentModelConfig); // Buffer current state before editing
      setIsEditing(true);
  };

  // Stop editing (used by Cancel/Save)
  const stopEditing = () => {
      setIsEditing(false);
  };

  // Handle internal updates
  const handleModelConfigUpdate = (modelUpdate: Partial<AINodeConfig>) => {
    setCurrentModelConfig(prevConfig => ({
      ...prevConfig,
      ...modelUpdate
    }));

    // If provider changed, trigger immediate node update for icon & clear dependents
    if ('provider_id' in modelUpdate) {
        const selectedProvider = aiIntegrations.find(p => p.id === modelUpdate.provider_id);
        const immediateUpdate: Partial<AINodeConfig> = {
            provider_id: modelUpdate.provider_id,
            icon_url: selectedProvider?.icon_url,
            integration_instance_id: undefined,
            integration_instance_name: undefined,
            model_id: undefined,
            model_name: undefined
        };
        setCurrentModelConfig(prev => ({ ...prev, ...immediateUpdate }));
        // Also update the parent immediately for the icon change
        onUpdateNode({ ...initialConfig, ...currentModelConfig, ...immediateUpdate });
    }
  };
  
  // --- Save and Cancel Handlers ---
  const handleCancel = () => {
    setCurrentModelConfig(bufferedConfig); // Restore from buffer
    stopEditing();
  };

  const handleUpdate = () => {
    // Merge the updated model config with the *initial* full config 
    // to ensure other parts (like prompt config) aren't lost.
    const finalConfig = { 
      ...initialConfig, // Start with the original full config
      ...currentModelConfig // Apply the changes made in this section
    };
    onUpdateNode(finalConfig as AINodeConfig); // Update the parent node
    stopEditing();
  };

  // Helper functions (modified for internal state)
  const getSelectedProviderName = (): string => {
    if (!currentModelConfig.provider_id) return 'AI Provider';
    const provider = aiIntegrations.find(p => p.id === currentModelConfig.provider_id);
    return provider?.name || 'Unknown Provider';
  };

  const getSelectedInstanceName = (): string => {
    if (!currentModelConfig.integration_instance_id) return 'Select Integration';
    const instance = aiInstances.find(i => i.id === currentModelConfig.integration_instance_id);
    return instance?.name || 'Unknown Integration';
  };

  const getSelectedModelName = (): string => {
    if (!currentModelConfig.model_id) return 'Select Model';
    const model = aiModels.find(m => m.id === currentModelConfig.model_id);
    return model?.name || 'Unknown Model';
  };

  // Handler for provider selection
  const handleProviderChange = (value: string) => {
    const selectedProvider = aiIntegrations.find(p => p.id === value);
    handleModelConfigUpdate({
      provider_id: value,
      icon_url: selectedProvider?.icon_url,
      // Reset dependent fields
      integration_instance_id: undefined,
      integration_instance_name: undefined,
      model_id: undefined,
      model_name: undefined
    });
  };

  // Handler for instance selection
  const handleInstanceChange = (value: string) => {
    const selectedInstance = aiInstances.find(i => i.id === value);
    handleModelConfigUpdate({
      integration_instance_id: value,
      integration_instance_name: selectedInstance?.name
    });
  };

  // Handler for model selection
  const handleModelChange = (value: string) => {
    const selectedModel = aiModels.find(m => m.id === value);
    handleModelConfigUpdate({
      model_id: value,
      model_name: selectedModel?.name
    });
  };

  // Parameters handlers
  const handleTemperatureChange = (value: number[]) => {
    handleModelConfigUpdate({
      parameters: {
        ...(currentModelConfig.parameters || {}),
        temperature: value[0]
      }
    });
  };

  const handleMaxTokensChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value;
    // Allow empty input to clear the value (meaning use default)
    if (rawValue === '') {
        handleModelConfigUpdate({
            parameters: {
                ...(currentModelConfig.parameters || {}),
                maxTokens: undefined // Set to undefined
            }
        });
        return;
    }
    const value = parseInt(rawValue);
    // Only update if it's a valid number >= 1
    if (!isNaN(value) && value >= 1) { 
        handleModelConfigUpdate({
            parameters: {
                ...(currentModelConfig.parameters || {}),
                maxTokens: value
            }
        });
    }
  };

  // --- Render Logic --- 
  const previewIconColor = isDisabled ? 'text-gray-400' : 'text-gray-500';
  const headerTextColor = isDisabled ? 'text-gray-500' : 'text-gray-800';
  const editIconColor = isDisabled ? 'text-gray-500' : 'text-blue-600';

  const renderEditForm = () => (
    <div className="border rounded-md overflow-hidden bg-white shadow-sm">
        {/* Edit Header */} 
        <div className="flex justify-between items-center h-12 px-3 border-b bg-blue-50">
            <div className="flex items-center gap-2">
                {currentModelConfig.icon_url ? (
                    <img src={currentModelConfig.icon_url} alt="Provider" className="h-4 w-4 object-contain" />
                ) : (
                    <Cpu className={`h-4 w-4 ${editIconColor}`} />
                )}
                <span className={`font-medium text-sm text-blue-800`}>
                    Edit {getSelectedProviderName()} Configuration
                </span>
            </div>
        </div>

        <div className="p-3 space-y-3.5">
             {/* Provider/Integration/Model Selection Box */} 
             <div className="border rounded-md p-3 space-y-3">
                {/* AI Provider */} 
                <div>
                    <div className="flex items-center gap-1.5 mb-1">
                        <Cpu className="h-3.5 w-3.5 text-gray-600" />
                        <Label htmlFor="mc-provider-select" className="text-xs font-medium uppercase tracking-wide text-gray-600">AI Provider</Label>
                    </div>
                    <Select
                      value={currentModelConfig.provider_id}
                      onValueChange={handleProviderChange}
                      disabled={isDisabled}
                    >
                        <SelectTrigger id="mc-provider-select" className="h-9">
                            <SelectValue placeholder="Select AI Provider" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Available Providers</SelectLabel>
                                {aiIntegrations.map((provider) => (
                                    <SelectItem key={provider.id} value={provider.id}>
                                        <div className="flex items-center gap-2">
                                            {provider.icon_url && (
                                                <img src={provider.icon_url} alt={provider.name} className="w-4 h-4 object-contain"/>
                                            )}
                                            <span>{provider.name}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {/* Instance Selection */} 
                {currentModelConfig.provider_id && (
                    <div>
                       <div className="flex items-center gap-1.5 mb-1">
                            <Database className="h-3.5 w-3.5 text-gray-600" />
                            <Label htmlFor="mc-instance-select" className="text-xs font-medium uppercase tracking-wide text-gray-600">Integration</Label>
                        </div>
                        <Select
                            value={currentModelConfig.integration_instance_id}
                            onValueChange={handleInstanceChange}
                            disabled={isDisabled || instancesLoading}
                        >
                            <SelectTrigger id="mc-instance-select" className="h-9">
                                <SelectValue placeholder={instancesLoading ? "Loading..." : "Select Integration"} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Available Integrations</SelectLabel>
                                    {aiInstances.map((instance) => (
                                        <SelectItem key={instance.id} value={instance.id}>{instance.name}</SelectItem>
                                    ))}
                                    {aiInstances.length === 0 && !instancesLoading && (
                                        <SelectItem value="_none" disabled>No integrations found/configured.</SelectItem>
                                    )}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                )}

                {/* Model Selection */} 
                {currentModelConfig.provider_id && (
                    <div>
                       <div className="flex items-center gap-1.5 mb-1">
                            <Settings2 className="h-3.5 w-3.5 text-gray-600" />
                            <Label htmlFor="mc-model-select" className="text-xs font-medium uppercase tracking-wide text-gray-600">Model</Label>
                        </div>
                        <Select
                            value={currentModelConfig.model_id}
                            onValueChange={handleModelChange}
                            disabled={isDisabled || !currentModelConfig.integration_instance_id} // Maybe disable if no instance?
                        >
                             <SelectTrigger id="mc-model-select" className="h-9">
                                <SelectValue placeholder="Select Model" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Available Models</SelectLabel>
                                    {aiModels.map((model) => (
                                        <SelectItem key={model.id} value={model.id}>{model.name}</SelectItem>
                                    ))}
                                    {aiModels.length === 0 && currentModelConfig.provider_id && (
                                        <SelectItem value="_none" disabled>No models listed for this provider.</SelectItem>
                                    )}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                )}
             </div>

            {/* Parameters */} 
            {currentModelConfig.model_id && (
                 <div>
                     <div className="flex items-center gap-1.5 mb-2">
                        <Sigma className="h-3.5 w-3.5 text-gray-600" />
                        <Label className="text-xs font-medium uppercase tracking-wide text-gray-600">Model Parameters</Label>
                    </div>
                    <div className="border rounded-md p-3 space-y-3">
                        {/* Temperature */} 
                        <div>
                            <div className="flex justify-between mb-1">
                                <Label htmlFor="mc-temp-slider" className="text-xs font-medium text-gray-600">Temperature</Label>
                                <span className="text-xs text-gray-500">
                                    {currentModelConfig.parameters?.temperature?.toFixed(2) ?? '-'}
                                </span>
                            </div>
                            <Slider
                                id="mc-temp-slider"
                                defaultValue={[currentModelConfig.parameters?.temperature ?? 0.7]}
                                min={0}
                                max={2}
                                step={0.01}
                                onValueChange={handleTemperatureChange}
                                disabled={isDisabled}
                                className="[&>span:first-child]:h-1 [&>span:first-child]:bg-gray-200 [&_[role=slider]]:bg-blue-600 [&_[role=slider]]:w-3 [&_[role=slider]]:h-3 [&_[role=slider]]:border-0 [&_[role=slider]:focus-visible]:ring-0 [&_[role=slider]:focus-visible]:ring-offset-0 [&_[role=slider]:focus-visible]:scale-105"
                            />
                            <p className="text-xs text-gray-500 pt-1">
                                Controls randomness: Lower is more focused, higher is more creative.
                            </p>
                        </div>

                        {/* Max Tokens */} 
                        <div>
                            <Label htmlFor="mc-maxtokens-input" className="text-xs font-medium text-gray-600">Max Tokens</Label>
                            <Input
                                id="mc-maxtokens-input"
                                type="number"
                                value={currentModelConfig.parameters?.maxTokens ?? ''} 
                                onChange={handleMaxTokensChange}
                                placeholder="Model default"
                                className="w-full h-9 mt-1"
                                min={1}
                                disabled={isDisabled}
                            />
                             <p className="text-xs text-gray-500 pt-1">
                                Max length of the response. Leave blank for default.
                            </p>
                        </div>
                        {/* Tools section placeholder */}
                    </div>
                </div>
            )}

            {/* Error message */} 
            {error && (
                <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error Loading Data</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
        </div>

        {/* Edit Mode Buttons */} 
        <div className="flex justify-end gap-2 p-3 bg-gray-50 border-t">
            <Button variant="outline" size="sm" onClick={handleCancel} disabled={isDisabled}>
                Cancel
            </Button>
            <Button 
                size="sm" 
                onClick={handleUpdate} 
                disabled={isDisabled || !currentModelConfig.provider_id || !currentModelConfig.integration_instance_id || !currentModelConfig.model_id} // Basic validation
                className="bg-slate-900 hover:bg-slate-800"
             >
                Update
            </Button>
        </div>
    </div>
  );

  return (
    <Collapsible 
      open={isEditing}
      onOpenChange={(isOpen) => {
        if (isOpen && !isDisabled) {
            startEditing();
        } else if (!isOpen) {
            if (JSON.stringify(currentModelConfig) !== JSON.stringify(bufferedConfig)) {
                handleCancel(); 
            }
            stopEditing(); 
        }
      }}
      className="space-y-0"
    >
      <CollapsibleTrigger asChild>
        {/* Use button style matching DataStoreConfig preview header */}
         <button
            onClick={!isEditing ? startEditing : undefined} // Only trigger edit on click when not editing
            disabled={isDisabled} // Use the top-level isDisabled
            className="flex justify-between items-center w-full h-12 px-3 border rounded-t-md text-left disabled:opacity-70 disabled:cursor-not-allowed bg-slate-50 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-colors data-[state=open]:hidden" // Hide trigger when open
          >
            <div className="flex items-center gap-2">
                {currentModelConfig.icon_url ? (
                    <img src={currentModelConfig.icon_url} alt="Provider" className="h-4 w-4 object-contain" />
                ) : (
                    <Cpu className={`h-4 w-4 ${previewIconColor}`} />
                )}
                <span className={`font-medium text-sm ${headerTextColor}`}>
                    {getSelectedProviderName()} Configuration
                </span>
            </div>
            {/* Show Chevron only if not disabled */} 
            {!isDisabled && (
                 <ChevronRight className={`h-4 w-4 transition-transform duration-200 text-gray-500`} />
            )}
          </button>
      </CollapsibleTrigger>

      {/* Preview Mode */} 
      {!isEditing && (
          <div className="mt-0 border border-t-0 rounded-b-md">
            <ModelConfigPreviewInternal config={currentModelConfig} />
         </div>
      )}

      {/* Edit Mode */} 
      <CollapsibleContent className="pt-0 rounded-b-md"> {/* Remove border/bg here, handled by renderEditForm */} 
         {isEditing && renderEditForm()} {/* Conditionally render edit form */} 
      </CollapsibleContent>
    </Collapsible>
  );
};

export default ModelConfiguration; 