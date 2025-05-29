import React, { useState, useEffect, useCallback } from 'react';
import { Node } from 'reactflow';
import { NODE_TYPES, DocumentNodeData, SchemaField } from '@/types/workflow';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { FileEdit, Eye, PlusCircle, ChevronRight, X, Settings2, FileText } from 'lucide-react';
import { useConfigSection } from '@/features/workflowDesigner/hooks';

// Updated Document actions
const DOCUMENT_ACTIONS = [
  { value: 'get', label: 'Get Document', icon: <Eye className="h-3.5 w-3.5 text-blue-500" /> },
  { value: 'get-many', label: 'Get Documents by ID', icon: <Eye className="h-3.5 w-3.5 text-blue-400" /> },
  { value: 'get-filter', label: 'Get Documents by Filter', icon: <Eye className="h-3.5 w-3.5 text-blue-300" /> },
  { value: 'edit-diff', label: 'Edit Document by Diff', icon: <FileEdit className="h-3.5 w-3.5 text-emerald-500" /> },
  { value: 'edit-overwrite', label: 'Overwrite Document', icon: <FileEdit className="h-3.5 w-3.5 text-orange-500" /> },
  { value: 'create', label: 'Create Document', icon: <PlusCircle className="h-3.5 w-3.5 text-purple-500" /> },
] as const;
type DocumentAction = typeof DOCUMENT_ACTIONS[number]['value'];

// Dedicated config type for Document node
export interface DocumentNodeConfig {
  action?: DocumentAction | '';
  documentId?: string;
}

interface DocumentConfigProps {
  nodeData: Node<DocumentNodeData>;
  onUpdate: (config: DocumentNodeConfig) => void;
  isDisabled?: boolean;
  sectionId: string;
  onActionInputSchemaChange: (schema: SchemaField[] | null) => void;
  onActionOutputSchemaChange: (schema: SchemaField[] | null) => void;
}

export const DocumentConfig: React.FC<DocumentConfigProps> = ({
  nodeData,
  onUpdate,
  isDisabled = false,
  sectionId,
  onActionInputSchemaChange,
  onActionOutputSchemaChange,
}) => {
  // Type guard
  if (nodeData.data.type !== NODE_TYPES.DOCUMENT) return null;
  const config = (nodeData.data.config || {}) as DocumentNodeConfig;

  // Config section state
  const { isDisabled: isSectionDisabled, isEditing, startEditing, stopEditing } = useConfigSection(sectionId, nodeData.id);
  const effectivelyDisabled = isDisabled || isSectionDisabled;

  // Local state for form
  const [initialConfig, setInitialConfig] = useState<DocumentNodeConfig>({});
  const [action, setAction] = useState<DocumentAction | ''>('');
  const [documentId, setDocumentId] = useState<string>('');

  // --- Helper to update schema ---
  const updateInputSchema = useCallback((selectedAction: DocumentAction | '') => {
    let schema: SchemaField[] | null = null;
    let outputSchema: SchemaField[] | null = null;

    switch (selectedAction) {
      case 'get':
        schema = [
          { id: 'documentId', name: 'Document ID', dataType: 'string', description: 'The ID of the document to get.' },
        ];
        outputSchema = [
          { id: 'document', name: 'Document', dataType: 'string', description: 'The document content.' },
        ];
        break;
      case 'get-many':
        schema = [
          { id: 'documentIds', name: 'Document IDs', dataType: 'array', description: 'The IDs of the documents to get (array of strings).' },
        ];
        outputSchema = [
          { id: 'documents', name: 'Documents', dataType: 'array', description: 'The array of document contents.' },
        ];
        break;
      case 'get-filter':
        schema = [
          { id: 'filter', name: 'Filter', dataType: 'string', description: 'A filter string to select documents.' },
        ];
        outputSchema = [
          { id: 'documents', name: 'Documents', dataType: 'array', description: 'The array of document contents.' },
        ];
        break;
      case 'edit-diff':
        schema = [
          { id: 'documentId', name: 'Document ID', dataType: 'string', description: 'The ID of the document to apply changes to.' },
          { id: 'diff', name: 'Diff', dataType: 'string', description: 'The changes (diff) to apply to the document.' },
        ];
        break;
      case 'edit-overwrite':
        schema = [
          { id: 'documentId', name: 'Document ID', dataType: 'string', description: 'The ID of the document to overwrite.' },
          { id: 'text', name: 'Text', dataType: 'string', description: 'The new text content for the document.' },
        ];
        break;
      case 'create':
        schema = [
          { id: 'text', name: 'Text', dataType: 'string', description: 'The initial text content for the new document.' },
        ];
        outputSchema = [
          { id: 'documentId', name: 'Document ID', dataType: 'string', description: 'The ID of the newly created document.' },
        ];
        break;
      default:
        schema = null;
        outputSchema = null;
    }

    console.log(`DocumentConfig: Updating input schema for action '${selectedAction}':`, schema);
    onActionInputSchemaChange(schema);
    onActionOutputSchemaChange(outputSchema || null);

  }, [onActionInputSchemaChange, onActionOutputSchemaChange]);

  // Load config into state AND update schema
  useEffect(() => {
    const loadedConfig: DocumentNodeConfig = {
      action: config.action ?? '',
      documentId: config.documentId ?? '',
    };
    setInitialConfig(loadedConfig);
    setAction(loadedConfig.action || '');
    setDocumentId(loadedConfig.documentId || '');
    updateInputSchema(loadedConfig.action || ''); // Update schema based on loaded action
    // Use config values directly in dependencies to detect changes
  }, [nodeData, config.action, config.documentId, updateInputSchema]);

  // Edit/cancel/update handlers
  const handleEdit = () => {
    setInitialConfig({ action, documentId });
    startEditing();
  };
  const handleCancel = () => {
    setAction(initialConfig.action || '');
    setDocumentId(initialConfig.documentId || '');
    stopEditing();
  };
  const handleUpdate = () => {
    const updatedConfig: DocumentNodeConfig = { action };
    // Only add documentId to config if action requires it (view/edit)
    if (action === 'get' || action === 'edit-diff' || action === 'edit-overwrite') {
      updatedConfig.documentId = documentId;
    }
    onUpdate(updatedConfig);
    // Schema update is implicitly handled by useEffect when config changes,
    // or by onValueChange if action changes just before update.
    // Explicitly calling here might be redundant but ensures consistency.
    updateInputSchema(action);
    stopEditing();
  };

  // Render preview
  const renderPreview = () => {
    const configForPreview = initialConfig;
    const hasConfig = !!configForPreview && !!configForPreview.action;
    const actionMeta = DOCUMENT_ACTIONS.find(a => a.value === configForPreview.action);
    return (
      <div className="border rounded-md overflow-hidden bg-gradient-to-b from-white to-gray-50 shadow-sm">
        <button
          onClick={handleEdit}
          disabled={effectivelyDisabled}
          className="flex justify-between items-center w-full h-12 px-3 border-b bg-slate-50 text-left disabled:opacity-70 disabled:cursor-not-allowed hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-colors"
        >
          <div className="flex items-center gap-2">
            <FileText className={`h-4 w-4 ${effectivelyDisabled ? 'text-gray-400' : 'text-gray-500'}`} />
            <span className={`font-medium text-sm ${effectivelyDisabled ? 'text-gray-500' : 'text-gray-800'}`}>Document Configuration</span>
          </div>
          {!effectivelyDisabled && <ChevronRight className="h-4 w-4 text-gray-500" />}
        </button>
        {hasConfig ? (
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-[140px_1fr] gap-y-4 py-1.5 px-2 bg-white rounded-md border border-gray-50">
              <div className="flex items-center gap-2">
                <Settings2 className="h-4 w-4 text-gray-500" />
                <span className="text-xs font-medium uppercase tracking-wide text-gray-500">Action</span>
              </div>
              <div className="flex justify-end">
                <Badge variant="outline" className="bg-white font-medium flex items-center gap-1.5 px-2 text-blue-700 border-blue-200">
                  {actionMeta?.icon}
                  {actionMeta?.label || configForPreview.action}
                </Badge>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <div className="bg-gray-100 p-3 rounded-full mb-2">
              <FileText className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500 mb-1">No configuration set</p>
            <p className="text-xs text-gray-400">Click the edit button to configure document operation</p>
          </div>
        )}
      </div>
    );
  };

  // Render edit form
  const renderEditForm = () => {
    return (
      <div className="border rounded-md overflow-hidden bg-white shadow-sm">
        <div className="flex justify-between items-center h-12 px-3 border-b bg-blue-50">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-sm text-blue-800">Edit Document Configuration</span>
          </div>
        </div>
        <div className="p-3 space-y-3.5">
          <div className="border rounded-md p-3 space-y-3">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <Settings2 className="h-3.5 w-3.5 text-gray-600" />
                <Label htmlFor="doc-action-select" className="text-xs font-medium uppercase tracking-wide text-gray-600">Action</Label>
              </div>
              <Select
                value={action}
                onValueChange={v => {
                  const newAction = v as DocumentAction;
                  setAction(newAction);
                  updateInputSchema(newAction); // Update schema when action changes
                  if (v === 'create') setDocumentId('');
                }}
              >
                <SelectTrigger id="doc-action-select" className="h-9">
                  <SelectValue placeholder="Select action..." />
                </SelectTrigger>
                <SelectContent>
                  {DOCUMENT_ACTIONS.map(a => (
                    <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 p-3">
          <Button variant="outline" size="sm" onClick={handleCancel}>Cancel</Button>
          <Button
            size="sm"
            onClick={handleUpdate}
            disabled={!action}
            className="bg-slate-900 hover:bg-slate-800"
          >
            Update
          </Button>
        </div>
      </div>
    );
  };

  return <div className="space-y-2">{isEditing ? renderEditForm() : renderPreview()}</div>;
};
