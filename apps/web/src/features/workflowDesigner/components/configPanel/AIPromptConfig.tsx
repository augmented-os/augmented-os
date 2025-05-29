import React, { useEffect, useState } from 'react';
import { Braces, ChevronRight, FileText, Plus, Trash2 } from "lucide-react";
import { AINodeConfig } from './AIConfig';
import { Badge } from '@/components/ui/badge';
import { TypeSelector } from "@/components/ui";
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { BookOpen, User, File } from 'lucide-react';

// Define our extended context type for internal use only
type ContextItemWithType = {
  title: string;
  content: string;
  description?: string;
  type?: string;
};

interface PromptConfigurationProps {
  initialConfig: Partial<AINodeConfig>;
  onUpdateNode: (updatedConfig: AINodeConfig) => void;
  isDisabled: boolean;
  sectionId: string;
  nodeId: string;
}

const PromptConfigPreviewInternal: React.FC<{ config: Partial<AINodeConfig> }> = ({ config }) => {
  const hasPromptConfig = config.systemPrompt || config.contexts?.length || config.userPrompt;

  if (!hasPromptConfig) {
    return (
        <div className="flex flex-col items-center justify-center p-6 text-center bg-gray-50">
            <div className="bg-gray-100 p-3 rounded-full mb-2">
              <FileText className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500 mb-1">No prompt configured</p>
            <p className="text-xs text-gray-400">Click the edit button to configure prompts</p>
        </div>
    );
  }

  // Use a table-based layout with spacing matching AIModelConfig
  return (
    <div className="p-4 bg-gray-50">
      <div className="bg-white rounded-md border border-gray-50 py-1.5 px-2">
        <table className="w-full border-separate border-spacing-y-3">
          <tbody>
            {/* System Prompt Row */}
            {config.systemPrompt && (
              <tr>
                <td className="align-middle">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <span className="text-xs font-medium uppercase tracking-wide text-gray-500">System Prompt</span>
                  </div>
                </td>
                <td className="align-middle text-right">
                  <Badge variant="outline" className="bg-white font-medium text-indigo-700 border-indigo-200 px-2 py-0.5">
                    Custom
                  </Badge>
                </td>
              </tr>
            )}
            
            {/* User Prompt Row */}
            {config.userPrompt && (
              <tr>
                <td className="align-middle">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-xs font-medium uppercase tracking-wide text-gray-500">User Prompt</span>
                  </div>
                </td>
                <td className="align-middle text-right">
                  <Badge variant="outline" className="bg-white font-medium text-indigo-700 border-indigo-200 px-2 py-0.5">
                    Custom
                  </Badge>
                </td>
              </tr>
            )}
            
            {/* Output Format Row - Removed */}
            
            {/* Context */}
            {config.contexts && config.contexts.length > 0 && (
              <tr>
                <td className="align-middle">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-gray-500" />
                    <span className="text-xs font-medium uppercase tracking-wide text-gray-500">Context</span>
                  </div>
                </td>
                <td className="align-middle text-right">
                  {config.contexts.map((context, index) => (
                    <Badge
                      key={`context-${index}`}
                      variant="outline"
                      className="bg-white font-medium text-gray-700 border-gray-200 truncate ml-1 px-2 py-0.5"
                      title={context.title || 'Untitled'}
                    >
                      {context.title || 'Untitled'}
                    </Badge>
                  ))}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const PromptConfiguration: React.FC<PromptConfigurationProps> = ({
  initialConfig,
  onUpdateNode,
  isDisabled,
  sectionId,
  nodeId
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentPromptConfig, setCurrentPromptConfig] = useState<Partial<AINodeConfig>>(initialConfig);
  const [bufferedConfig, setBufferedConfig] = useState<Partial<AINodeConfig>>(initialConfig);
  const [promptType, setPromptType] = useState<'custom' | 'document'>('custom');
  const [userPromptType, setUserPromptType] = useState<'custom' | 'document'>('custom');
  // Store context types - initialize with a preference for 'document' by default
  const [contextTypes, setContextTypes] = useState<Record<number, string>>({});

  // Helper to detect if a context looks like a document reference
  const detectIfDocumentType = (content: string, title: string): boolean => {
    // If it's short (less than 50 chars) and doesn't have many spaces, likely a document ID
    const isShortWithFewSpaces = content.length < 50 && content.split(' ').length <= 3;
    
    // If it contains {{, likely a template variable
    const hasTemplateSyntax = content.includes('{{') && content.includes('}}');
    
    // If title mentions document
    const titleHasDocument = title.toLowerCase().includes('document');
    
    // If it looks like a UUID or numeric ID 
    const looksLikeId = /^[a-zA-Z0-9_-]{5,}$/.test(content.trim());
    
    return isShortWithFewSpaces || hasTemplateSyntax || titleHasDocument || looksLikeId;
  };

  // Update internal state when initialConfig changes and not editing
  useEffect(() => {
    if (!isEditing) {
      setCurrentPromptConfig(initialConfig);
      setBufferedConfig(initialConfig);
      
      // Detect prompt types based on content
      if (initialConfig.systemPrompt && initialConfig.systemPrompt.includes('{{document}}')) {
        setPromptType('document');
      } else {
        setPromptType('custom');
      }

      // Detect user prompt types based on content
      if (initialConfig.userPrompt && initialConfig.userPrompt.includes('{{document}}')) {
        setUserPromptType('document');
      } else {
        setUserPromptType('custom');
      }

      // Initialize context types - default to 'document' unless clearly data
      if (initialConfig.contexts && initialConfig.contexts.length > 0) {
        const types: Record<number, string> = {};
        initialConfig.contexts.forEach((ctx, idx) => {
          // Default to document type unless it's clearly not
          const isDocumentType = detectIfDocumentType(ctx.content, ctx.title);
          types[idx] = isDocumentType ? 'document' : 'data';
        });
        setContextTypes(types);
      }
    }
  }, [initialConfig, isEditing]);

  const startEditing = () => {
      setBufferedConfig(currentPromptConfig);
      setIsEditing(true);
  };

  const stopEditing = () => {
      setIsEditing(false);
  };

  const handlePromptConfigUpdate = (promptUpdate: Partial<AINodeConfig>) => {
    // Always set the outputFormat to 'json' whenever updating
    setCurrentPromptConfig(prevConfig => ({
      ...prevConfig,
      ...promptUpdate,
      outputFormat: 'json'
    }));
  };

  const handleSystemPromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handlePromptConfigUpdate({ systemPrompt: e.target.value });
  };

  const handlePromptTypeChange = (value: string) => {
    const newType = value as 'custom' | 'document';
    setPromptType(newType);
    
    // Only change the prompt text if switching to document type and there's no document markup
    if (newType === 'document' && (!currentPromptConfig.systemPrompt || !currentPromptConfig.systemPrompt.includes('{{document}}'))) {
      handlePromptConfigUpdate({ systemPrompt: "You are analyzing the following document: {{document}}" });
    }
  };

  const handleUserPromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handlePromptConfigUpdate({ userPrompt: e.target.value });
  };

  const handleUserPromptTypeChange = (value: string) => {
    const newType = value as 'custom' | 'document';
    setUserPromptType(newType);
    
    // Only change the prompt text if switching to document type and there's no document markup
    if (newType === 'document' && (!currentPromptConfig.userPrompt || !currentPromptConfig.userPrompt.includes('{{document}}'))) {
      handlePromptConfigUpdate({ userPrompt: "Please extract the key information from this document." });
    }
  };

  const handleAddContext = () => {
    const currentContexts = currentPromptConfig.contexts || [];
    const newContext = { title: '', content: '' };
    
    // Add the new context
    handlePromptConfigUpdate({ 
      contexts: [...currentContexts, newContext]
    });
    
    // Set its type separately in our type tracking state
    setContextTypes(prev => ({
      ...prev,
      [currentContexts.length]: 'document'
    }));
  };

  const handleRemoveContext = (index: number) => {
    const updatedContexts = (currentPromptConfig.contexts || []).filter((_, idx) => idx !== index);
    handlePromptConfigUpdate({ contexts: updatedContexts });
    
    // Update the context types
    const newContextTypes: Record<number, string> = {};
    Object.entries(contextTypes).forEach(([idxStr, type]) => {
      const idx = parseInt(idxStr);
      if (idx < index) {
        newContextTypes[idx] = type;
      } else if (idx > index) {
        newContextTypes[idx - 1] = type;
      }
    });
    setContextTypes(newContextTypes);
  };

  const handleContextChange = (index: number, field: string, value: string) => {
    if (field === 'type') {
      // Handle type changes separately
      setContextTypes(prev => ({
        ...prev,
        [index]: value
      }));
      return;
    }
    
    const updatedContexts = (currentPromptConfig.contexts || []).map((ctx, idx) => {
      if (idx === index) {
        return { ...ctx, [field]: value };
      }
      return ctx;
    });
    handlePromptConfigUpdate({ contexts: updatedContexts });
  };

  const handleOutputFormatChange = (value: string) => {
    handlePromptConfigUpdate({ outputFormat: value });
  };

  const getContextType = (index: number): string => {
    return contextTypes[index] || "document";
  };
  
  const handleCancel = () => {
    setCurrentPromptConfig(bufferedConfig);
    stopEditing();
  };

  const handleUpdate = () => {
    // Make sure we have the JSON output format
    const finalConfig = { 
      ...initialConfig, 
      ...currentPromptConfig,
      outputFormat: 'json'
    };
    onUpdateNode(finalConfig as AINodeConfig);
    stopEditing();
  };

  const previewIconColor = isDisabled ? 'text-gray-400' : 'text-gray-500';
  const headerTextColor = isDisabled ? 'text-gray-500' : 'text-gray-800';
  const editIconColor = isDisabled ? 'text-gray-500' : 'text-blue-600';

  const renderEditForm = () => (
        <div className="border rounded-md overflow-hidden bg-white shadow-sm">
            {/* Edit Header */} 
            <div className="flex justify-between items-center h-12 px-3 border-b bg-blue-50">
                 <div className="flex items-center gap-2">
                    <FileText className={`h-4 w-4 ${editIconColor}`} />
                    <span className={`font-medium text-sm text-blue-800`}>
                        Edit Prompt Configuration
                    </span>
                </div>
            </div>
            <div className="p-3 space-y-3.5">
                {/* System Prompt - fieldset/legend */} 
                <fieldset className="border rounded-md p-3 bg-gray-50/80">
                    <legend className="text-xs font-semibold uppercase tracking-wide px-1 text-gray-700">System Prompt</legend>
                    
                    <div className="space-y-3">
                        <Select
                            value={promptType}
                            onValueChange={handlePromptTypeChange}
                            disabled={isDisabled}
                        >
                            <SelectTrigger className="h-8 w-full bg-white">
                                <SelectValue placeholder="Select prompt type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="custom">Custom</SelectItem>
                                <SelectItem value="document">Document</SelectItem>
                            </SelectContent>
                        </Select>
                        
                        <Textarea
                            value={currentPromptConfig.systemPrompt || ''}
                            onChange={handleSystemPromptChange}
                            className="w-full min-h-[100px] resize-y bg-white text-sm"
                            placeholder="Enter system prompt..."
                            disabled={isDisabled}
                        />
                    </div>
                </fieldset>

                {/* User Prompt - fieldset/legend */} 
                <fieldset className="border rounded-md p-3 bg-gray-50/80">
                    <legend className="text-xs font-semibold uppercase tracking-wide px-1 text-gray-700">User Prompt</legend>
                    
                    <div className="space-y-3">
                        <Select
                            value={userPromptType}
                            onValueChange={handleUserPromptTypeChange}
                            disabled={isDisabled}
                        >
                            <SelectTrigger className="h-8 w-full bg-white">
                                <SelectValue placeholder="Select prompt type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="custom">Custom</SelectItem>
                                <SelectItem value="document">Document</SelectItem>
                            </SelectContent>
                        </Select>
                        
                        <Textarea
                            value={currentPromptConfig.userPrompt || ''}
                            onChange={handleUserPromptChange}
                            className="w-full min-h-[100px] resize-y bg-white text-sm"
                            placeholder="Enter user prompt..."
                            disabled={isDisabled}
                        />
                    </div>
                </fieldset>

                {/* Contexts - Redesigned with integrated type selector */} 
                <fieldset className="border rounded-md p-3 bg-gray-50/80">
                    <legend className="text-xs font-semibold uppercase tracking-wide px-1 text-gray-700">Context</legend>
                    
                    <div className="space-y-3">
                        {(currentPromptConfig.contexts || []).map((ctx, idx) => (
                            <div key={idx} className="p-3 border rounded-md bg-white">
                                <div className="flex items-center justify-between mb-3">
                                    <Input
                                        placeholder="Title"
                                        value={ctx.title}
                                        onChange={(e) => handleContextChange(idx, 'title', e.target.value)}
                                        disabled={isDisabled}
                                        className="h-8 max-w-[70%]"
                                    />
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleRemoveContext(idx)}
                                        className="flex-shrink-0 h-7 w-7 hover:bg-gray-200/80 text-gray-500 hover:text-red-600"
                                        disabled={isDisabled}
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                </div>
                                
                                {getContextType(idx) === 'document' ? (
                                    <div className="flex items-center bg-blue-50 border border-blue-200 rounded-md overflow-hidden">
                                        <TypeSelector
                                            value={getContextType(idx)}
                                            onValueChange={(value) => handleContextChange(idx, 'type', value)}
                                            disabled={isDisabled}
                                        />
                                        <Input
                                            value={ctx.content}
                                            onChange={(e) => handleContextChange(idx, 'content', e.target.value)}
                                            disabled={isDisabled}
                                            className="h-8 flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                                            placeholder="document_id"
                                        />
                                        <div className="pr-2 text-blue-400 flex items-center" title="Document Variable">
                                            <Braces className="h-4 w-4" />
                                        </div>
                                    </div>
                                ) : getContextType(idx) === 'data' ? (
                                    <div className="flex items-start bg-emerald-50 border border-emerald-200 rounded-md overflow-hidden">
                                        <TypeSelector
                                            value={getContextType(idx)}
                                            onValueChange={(value) => handleContextChange(idx, 'type', value)}
                                            disabled={isDisabled}
                                        />
                                        <Textarea
                                            placeholder="Enter data or content"
                                            value={ctx.content}
                                            onChange={(e) => handleContextChange(idx, 'content', e.target.value)}
                                            className="min-h-[80px] resize-y bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 w-full"
                                            disabled={isDisabled}
                                        />
                                    </div>
                                ) : (
                                    <div className="flex items-start bg-purple-50 border border-purple-200 rounded-md overflow-hidden">
                                        <TypeSelector
                                            value={getContextType(idx)}
                                            onValueChange={(value) => handleContextChange(idx, 'type', value)}
                                            disabled={isDisabled}
                                        />
                                        <Textarea
                                            placeholder="Enter custom content"
                                            value={ctx.content}
                                            onChange={(e) => handleContextChange(idx, 'content', e.target.value)}
                                            className="min-h-[80px] resize-y bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 w-full"
                                            disabled={isDisabled}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleAddContext}
                            className="w-full"
                            disabled={isDisabled}
                        >
                            <Plus className="h-4 w-4 mr-2" /> Add Context
                        </Button>
                    </div>
                </fieldset>

                {/* Output Format section removed - always using JSON */}
            </div>
             {/* Edit Mode Buttons */} 
            <div className="flex justify-end gap-2 p-3 bg-gray-50 border-t">
                <Button variant="outline" size="sm" onClick={handleCancel} disabled={isDisabled}>
                    Cancel
                </Button>
                <Button 
                    size="sm" 
                    onClick={handleUpdate} 
                    disabled={isDisabled} 
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
            if (JSON.stringify(currentPromptConfig) !== JSON.stringify(bufferedConfig)) {
                handleCancel();
            }
            stopEditing();
        }
      }}
      className="space-y-0 mt-4"
    >
       <CollapsibleTrigger asChild>
        <button
          onClick={!isEditing ? startEditing : undefined}
          disabled={isDisabled}
          className="flex justify-between items-center w-full h-12 px-3 border rounded-t-md text-left disabled:opacity-70 disabled:cursor-not-allowed bg-slate-50 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-colors data-[state=open]:hidden"
        >
          <span className="flex items-center gap-2">
             <FileText className={`h-4 w-4 ${previewIconColor}`} />
             <span className={`font-medium text-sm ${headerTextColor}`}>
                Prompt Configuration
             </span>
          </span>
           {!isDisabled && (
                <ChevronRight className={`h-4 w-4 transition-transform duration-200 text-gray-500`} />
            )}
        </button>
      </CollapsibleTrigger>

      {!isEditing && (
          <div className="mt-0 border border-t-0 rounded-b-md">
             <PromptConfigPreviewInternal config={currentPromptConfig} />
         </div>
      )}

      <CollapsibleContent className="pt-0 rounded-b-md">
         {isEditing && renderEditForm()}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default PromptConfiguration; 