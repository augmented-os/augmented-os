import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ChevronRight, Trash2, Plus, Cpu, FileText } from 'lucide-react';
import { Node } from 'reactflow';
import { NODE_TYPES, AITaskNodeData } from '@/types/workflow';
import { useConfigSection } from '@/features/workflowDesigner/hooks';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Check, Puzzle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { fetchAIIntegrations, getAIInstancesForDefinition } from '@/data/integrationService';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
import ModelConfiguration from './AIModelConfig';
import PromptConfiguration from './AIPromptConfig';

// Configuration type for AI Task node (now includes parameters, tools, outputFormat)
export interface AINodeConfig {
  systemPrompt?: string;
  contexts?: { title: string; description?: string; content: string }[];
  userPrompt?: string;
  provider_id?: string;       // ID of the AI provider/integration_definition
  integration_instance_id?: string; // ID of the integration instance
  integration_instance_name?: string; // Name of the integration instance (for display)
  model_id?: string;         // ID of the AI model to use
  model_name?: string;       // Name of the AI model (for display)
  icon_url?: string;         // Icon URL of the selected provider
  parameters?: {            // Model parameters
    temperature?: number;
    maxTokens?: number;
  };
  tools?: any[];             // Placeholder for future tools configuration
  outputFormat?: string;     // Output format (text, json, etc.)
}

// Interface for AI Integration Definition
interface AIIntegrationDefinition {
  id: string;
  name: string;
  integration_id: string; // Provider ID
  icon_url?: string;
  description?: string;
  config_schema?: any;
  methods?: any[];
  ai_config?: {
    availableModels?: AIModel[];
  };
  type?: string;
}

// Interface for AI Integration Instance
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

// Interface for AI Model
interface AIModel {
  id: string;
  name: string;
  description?: string;
  provider_id?: string;
}

interface AIConfigProps {
  nodeData: Node<AITaskNodeData>;
  onUpdate: (node: Node<AITaskNodeData>) => void;
  isDisabled?: boolean;
  sectionId: string;
  onActionInputSchemaChange: (schema: any[] | null) => void;
  onActionOutputSchemaChange: (schema: any[] | null) => void;
}

export const AIConfig: React.FC<AIConfigProps> = ({
  nodeData,
  onUpdate,
  isDisabled = false,
  sectionId,
  onActionInputSchemaChange,
  onActionOutputSchemaChange,
}) => {
  if (nodeData.data.type !== NODE_TYPES.AI_TASK) return null;
  
  const effectivelyDisabled = isDisabled;

  const [currentNodeConfig, setCurrentNodeConfig] = useState<AINodeConfig>((nodeData.data.config || {}) as AINodeConfig);
  
  const [aiIntegrations, setAIIntegrations] = useState<AIIntegrationDefinition[]>([]);
  const [aiInstances, setAIInstances] = useState<AIIntegrationInstance[]>([]);
  const [aiModels, setAIModels] = useState<AIModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [instancesLoading, setInstancesLoading] = useState(false);

  useEffect(() => {
    setCurrentNodeConfig((nodeData.data.config || {}) as AINodeConfig);
  }, [nodeData.data.config]);

  useEffect(() => {
    const fetchAIData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedData = await fetchAIIntegrations();
        if (!fetchedData || fetchedData.length === 0) {
          // setError('No AI integration providers found.'); // Optionally set error
        } else {
           setAIIntegrations(fetchedData);
        }
      } catch (err: any) {
        console.error("Error fetching AI Integrations:", err);
        setError(err.message || 'Failed to load AI integration providers.');
      } finally {
        setIsLoading(false); // Ensure loading stops even if no providers found
      }
    };
    fetchAIData();
  }, []);

  useEffect(() => {
    const providerId = currentNodeConfig.provider_id;
    if (providerId) {
      setInstancesLoading(true);
      setError(null); // Clear previous errors
      setAIInstances([]); // Clear old instances
      setAIModels([]); // Clear old models
      getAIInstancesForDefinition(providerId)
        .then(data => {
           const transformedData = data.map((item: any) => ({ id: item.id, name: item.name, description: item.description, integration_definition_id: item.integration_definition_id, integration_definition: { icon_url: item.integration_definition?.icon_url, description: item.integration_definition?.description, type: item.integration_definition?.type }, config: item.config, status: item.status, credentials: item.credentials }));
           setAIInstances(transformedData);
           // If only one instance, maybe auto-select it?
        })
        .catch(err => {
          console.error("Error fetching AI instances:", err);
          setError(err.message || `Failed to load integrations for provider.`);
          setAIInstances([]);
        }) .finally(() => {
            setInstancesLoading(false);
        });
    } else {
      setAIInstances([]);
      setAIModels([]); // Also clear models if no provider
    }
  }, [currentNodeConfig.provider_id]);

  useEffect(() => {
    const providerId = currentNodeConfig.provider_id;
    if (providerId) {
       const provider = aiIntegrations.find(p => p.id === providerId);
       if (provider?.ai_config?.availableModels) {
         setAIModels(provider.ai_config.availableModels);
       } else {
         setAIModels([]); // No models defined for this provider
       }
    } else {
       setAIModels([]); // Clear models if no provider
    }
  }, [currentNodeConfig.provider_id, aiIntegrations]);

  const handleChildUpdate = (updatedConfig: AINodeConfig) => {
    console.log("AIConfig received update from child:", updatedConfig);
    setCurrentNodeConfig(updatedConfig);
    
    // Prepare the updated node data structure for the parent
    const updatedNodeData: AITaskNodeData = {
      ...nodeData.data,
      config: updatedConfig as any, // Update the config part
    };
    const updatedNode: Node<AITaskNodeData> = { 
      ...nodeData, 
      data: updatedNodeData 
    };
    
    console.log("AIConfig calling parent onUpdate with:", updatedNode);
    onUpdate(updatedNode);
  };

  return (
    <div className={`mt-4 ${effectivelyDisabled ? 'opacity-70 pointer-events-none' : ''}`}>
      <ModelConfiguration
        initialConfig={currentNodeConfig}
        onUpdateNode={handleChildUpdate}
        isDisabled={effectivelyDisabled}
        aiIntegrations={aiIntegrations}
        aiInstances={aiInstances}
        aiModels={aiModels}
        error={error}
        instancesLoading={instancesLoading}
        sectionId={`${sectionId}-model`}
        nodeId={nodeData.id}
      />

      <PromptConfiguration
        initialConfig={currentNodeConfig}
        onUpdateNode={handleChildUpdate}
        isDisabled={effectivelyDisabled}
        sectionId={`${sectionId}-prompt`}
        nodeId={nodeData.id}
      />
    </div>
  );
};
