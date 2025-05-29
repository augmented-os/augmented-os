import React, { useState, useEffect, useCallback } from 'react';
import { Node } from 'reactflow';
// Import specific types needed
import {
  NodeData,
  NODE_TYPES,
  DataStoreNodeConfig,
  DataStoreAction
} from '@/types/workflow';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Info, Equal, Database, ArrowRight, Filter, FileEdit, PlusCircle, Trash2, ChevronRight, X, Settings2, ArrowDown, ArrowUp, Sigma, ListFilter } from 'lucide-react';
import { useConfigSection } from '@/features/workflowDesigner/hooks';
import { useSchemas } from '@/hooks/use-schemas';
import { useTables } from '@/hooks/useTables';
import { useColumns } from '@/hooks/useColumns';

const EXCLUDED_UPDATE_COLUMNS = ['id', 'created_at', 'updated_at'];

const getActionLabel = (action: DataStoreAction | ''): string => {
  switch (action) {
    case 'insert': return 'Insert Record';
    case 'update': return 'Update Record(s)';
    case 'archive': return 'Archive Record(s)';
    case 'get': return 'Get Record(s)';
    default: return 'No action';
  }
};

const getActionIcon = (action: DataStoreAction | '') => {
  switch (action) {
    case 'insert': return <FileEdit className="h-3.5 w-3.5 text-emerald-500" />;
    case 'update': return <ArrowRight className="h-3.5 w-3.5 text-blue-500" />;
    case 'archive': return <X className="h-3.5 w-3.5 text-amber-500" />;
    case 'get': return <ListFilter className="h-3.5 w-3.5 text-purple-500" />;
    default: return null;
  }
};

interface DataStoreConfigProps {
  nodeData: Node<NodeData>; // Type uses the main NodeData union
  onUpdate: (dataStoreConfig: DataStoreNodeConfig) => void; // Expect specific config type
  isDisabled?: boolean;
  sectionId: string; // Add section ID prop
}

export const DataStoreConfig: React.FC<DataStoreConfigProps> = ({
  nodeData,
  onUpdate,
  isDisabled = false,
  sectionId
}) => {
  // Type Guard: Ensure this component only renders for Data Store nodes
  if (nodeData.data.type !== NODE_TYPES.DATA_STORE) {
    return null;
  }
  // Config might still be undefined initially
  const config = nodeData.data.config; // Keep this for easier reference, but know it can be undefined

  // Use our new config section hook
  const {
    isDisabled: isSectionDisabled,
    isEditing,
    startEditing,
    stopEditing
  } = useConfigSection(sectionId, nodeData.id);

  // Combine the passed isDisabled with our state machine's isDisabled
  const effectivelyDisabled = isDisabled || isSectionDisabled;

  // Initial config for cancel buffer should be strictly typed
  const [initialConfig, setInitialConfig] = useState<DataStoreNodeConfig>({});

  // New state for schema selection
  const [selectedSchema, setSelectedSchema] = useState<string>('');
  // Form state
  const [selectedTable, setSelectedTable] = useState<string>(''); // Initialize safely
  const [selectedAction, setSelectedAction] = useState<DataStoreAction | ''>(''); // Initialize safely
  const [columnMappings, setColumnMappings] = useState<Record<string, string>>({}); // Initialize safely
  const [filterColumn, setFilterColumn] = useState<string>(''); // Initialize safely
  const [filterValue, setFilterValue] = useState<string>(''); // Initialize safely
  const [sortBy, setSortBy] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | ''>('');
  const [limit, setLimit] = useState<string>('');

  // Data fetching hooks
  const { data: schemas, isLoading: schemasLoading, error: schemasError } = useSchemas();
  const { data: tables, isLoading: tablesLoading, error: tablesError } = useTables(selectedSchema);
  const tableNames = tables?.map(t => t.name) ?? [];
  const { data: columnList, isLoading: columnsLoading, error: columnsError } = useColumns(selectedSchema, selectedTable);
  const columnNames = columnList?.map(c => c.name) ?? [];

  // --- Effect for Loading Initial Config ---
  useEffect(() => {
    if (nodeData.data.type !== NODE_TYPES.DATA_STORE) return;

    // Use optional chaining here
    const currentConfig = nodeData.data.config; // This can be undefined
    console.log("DataStoreConfig: useEffect triggered. Loading raw config:", currentConfig);

    // Safely construct loadedConfig using ?. and ??
    const loadedConfig: DataStoreNodeConfig = {
      schema: currentConfig?.schema ?? '',
      table: currentConfig?.table ?? '',
      action: currentConfig?.action ?? '',
      mappings: currentConfig?.mappings ? { ...currentConfig.mappings } : {},
      filterColumn: currentConfig?.filterColumn ?? '',
      filterValue: currentConfig?.filterValue ?? '',
      sortBy: currentConfig?.sortBy ?? '',
      sortDirection: currentConfig?.sortDirection ?? undefined, 
      limit: currentConfig?.limit ?? undefined, // Keep as number or undefined
    };
    setInitialConfig(loadedConfig); // Save the potentially defaulted config

    setSelectedSchema(loadedConfig.schema);
    setSelectedTable(loadedConfig.table);
    setSelectedAction(loadedConfig.action);
    setColumnMappings(loadedConfig.mappings); // Set directly from loadedConfig
    setFilterColumn(loadedConfig.filterColumn);
    setFilterValue(loadedConfig.filterValue);
    setSortBy(loadedConfig.sortBy);
    setSortDirection(loadedConfig.sortDirection ? loadedConfig.sortDirection : '');
    setLimit(loadedConfig.limit !== undefined ? String(loadedConfig.limit) : '');

    console.log("DataStoreConfig: Initial state set:", loadedConfig);

  }, [nodeData]); // Dependency remains nodeData

  const handleMappingChange = (columnName: string, value: string) => {
    setColumnMappings(prev => ({ ...prev, [columnName]: value }));
  };

  const handleAddMapping = (columnName: string) => {
    if (!(columnName in columnMappings)) {
      setColumnMappings(prev => ({ ...prev, [columnName]: '' }));
    }
  };

  const handleRemoveMapping = (columnName: string) => {
    setColumnMappings(prev => {
      const { [columnName]: _, ...newMappings } = prev;
      return newMappings;
    });
  };

  // --- Event Handlers ---
  const handleEdit = () => {
    if (effectivelyDisabled) return;
    if (nodeData.data.type === NODE_TYPES.DATA_STORE) {
      // Also apply safe access here when reading for the cancel buffer
      const currentConfig = nodeData.data.config;
      setInitialConfig({
        schema: currentConfig?.schema ?? '',
        table: currentConfig?.table ?? '',
        action: currentConfig?.action ?? '',
        mappings: currentConfig?.mappings ? { ...currentConfig.mappings } : {},
        filterColumn: currentConfig?.filterColumn ?? '',
        filterValue: currentConfig?.filterValue ?? '',
        sortBy: currentConfig?.sortBy ?? '',
        sortDirection: currentConfig?.sortDirection ?? undefined,
        limit: currentConfig?.limit ?? undefined,
      });
    }
    startEditing(); // Start editing in the state machine
  };

  const handleCancel = () => {
    // Restore state directly from the saved initialConfig
    setSelectedSchema(initialConfig.schema || '');
    setSelectedTable(initialConfig.table || '');
    setSelectedAction(initialConfig.action || '');
    setColumnMappings(initialConfig.mappings || {});
    setFilterColumn(initialConfig.filterColumn || '');
    setFilterValue(initialConfig.filterValue || '');
    setSortBy(initialConfig.sortBy || '');
    setSortDirection(initialConfig.sortDirection ? initialConfig.sortDirection : '');
    setLimit(initialConfig.limit !== undefined ? String(initialConfig.limit) : '');
    stopEditing(); // Stop editing in the state machine
    console.log("DataStoreConfig: Edit cancelled, state restored.");
  };

  const handleUpdate = () => {
    // Construct the strictly typed config object to pass to the parent
    const dataStoreConfig: DataStoreNodeConfig = {
      schema: selectedSchema,
      table: selectedTable,
      action: selectedAction,
      // Conditionally include mappings only for insert/update
      ...(selectedAction === 'insert' || selectedAction === 'update' ? { mappings: columnMappings } : {}),
      // Conditionally include filter for update/archive/get
      ...(selectedAction !== 'insert' && {
          filterColumn: filterColumn || undefined,
          filterValue: filterValue || undefined
      }),
      // Conditionally include sort/limit for 'get'
      ...(selectedAction === 'get' && {
          sortBy: sortBy || undefined,
          // FIX: Map empty string state back to undefined for config type
          sortDirection: sortDirection === '' ? undefined : sortDirection, 
          // Parse limit string back to number, or undefined if empty/invalid
          limit: limit && !isNaN(parseInt(limit, 10)) ? parseInt(limit, 10) : undefined,
      })
    };
    console.log("DataStoreConfig: Updating config", dataStoreConfig);
    onUpdate(dataStoreConfig);
    stopEditing(); // Stop editing in the state machine
  };

  // --- Render Helper Functions (largely unchanged, but state is typed) ---
  const renderFilterSection = () => {
    if (!selectedTable || (selectedAction !== 'update' && selectedAction !== 'archive' && selectedAction !== 'get')) {
      return null;
    }
    const columns = columnNames;

    return (
      <div className="p-3 border rounded-md space-y-3 bg-gray-50/80">
        <Label className="text-sm font-medium">Filter Record(s) Where</Label>
        <div className="flex items-center gap-2">
          <Select value={filterColumn} onValueChange={setFilterColumn} disabled={!isEditing}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select column..." />
            </SelectTrigger>
            <SelectContent>
              {columns.map(col => (
                <SelectItem key={col} value={col}>{col}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Equal className="h-4 w-4 text-gray-500 shrink-0" />
          <Input
            placeholder="Value or {{input.variable}}"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            className="flex-1"
            disabled={!isEditing}
          />
        </div>
      </div>
    );
  };

  const renderColumnMappingSection = () => {
    if (!selectedTable || (selectedAction !== 'insert' && selectedAction !== 'update')) {
      return null;
    }

    let columnsToMap = columnNames;

    // Filter columns for UPDATE action
    if (selectedAction === 'update') {
      columnsToMap = columnsToMap.filter(col =>
        col !== filterColumn && !EXCLUDED_UPDATE_COLUMNS.includes(col.toLowerCase())
      );
    }

    return (
      <div className="p-3 border rounded-md space-y-3 bg-gray-50/80">
        <Label className="text-sm font-medium">Set Column Values</Label>
        {columnsToMap.map(col => (
          <div key={col} className="flex items-center gap-2">
            <Label htmlFor={`map-${col}`} className="w-1/3 text-right text-sm pr-2 shrink-0 truncate" title={col}>{col}</Label>
            <Input
              id={`map-${col}`}
              placeholder="Value or {{input.variable}}"
              value={columnMappings[col] || ''}
              onChange={(e) => handleMappingChange(col, e.target.value)}
              className="flex-1"
              disabled={!isEditing}
            />
          </div>
        ))}
        {columnsToMap.length === 0 && selectedAction === 'update' && (
          <p className="text-xs text-gray-500 italic">Select a different filter column to map values.</p>
        )}
         {columnsToMap.length === 0 && selectedAction === 'insert' && (
          <p className="text-xs text-gray-500 italic">Selected table has no columns to map.</p>
        )}
      </div>
    );
  };

  // --- Render Preview State ---
  const renderPreview = () => {
    // Read directly from the *initialConfig* state for preview consistency after cancel
    const configForPreview = initialConfig;
    // Check initialConfig itself before accessing properties
    const hasConfig = !!configForPreview && !!configForPreview.table && !!configForPreview.action;
    // Safely access mappings, even if configForPreview is null/undefined initially
    const mappingEntries = Object.entries(configForPreview?.mappings || {});

    const previewIconColor = effectivelyDisabled ? 'text-gray-400' : 'text-gray-500'; // Updated color logic
    const headerTextColor = effectivelyDisabled ? 'text-gray-500' : 'text-gray-800';

    return (
      <div className="border rounded-md overflow-hidden bg-gradient-to-b from-white to-gray-50 shadow-sm">
        {/* Make the whole header a button if not editing and not disabled */}
        {!isEditing ? (
          <button
            onClick={handleEdit}
            disabled={effectivelyDisabled}
            className="flex justify-between items-center w-full h-12 px-3 border-b bg-slate-50 text-left disabled:opacity-70 disabled:cursor-not-allowed hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Database className={`h-4 w-4 ${previewIconColor}`} />
              <span className={`font-medium text-sm ${headerTextColor}`}>
                Data Store Configuration
              </span>
            </div>
            {/* Show Chevron only if not disabled */}
            {!effectivelyDisabled && (
              <ChevronRight className={`h-4 w-4 transition-transform duration-200 text-gray-500`} />
            )}
          </button>
        ) : (
          // Render non-clickable header when editing
          <div className="flex justify-between items-center h-12 px-3 border-b bg-blue-50">
            <div className="flex items-center gap-2">
              <Database className={`h-4 w-4 text-blue-600`} />
              <span className={`font-medium text-sm text-blue-800`}>
                  Edit Data Store Configuration
              </span>
            </div>
          </div>
        )}

        {hasConfig ? (
          <div className="p-4 space-y-4">
            {/* Schema, Table and Action - Using grid for clean alignment */}
            <div className="grid grid-cols-[140px_1fr] gap-y-4 py-1.5 px-2 bg-white rounded-md border border-gray-50">
              {/* Schema Row */}
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-gray-500" />
                <span className="text-xs font-medium uppercase tracking-wide text-gray-500">Schema</span>
              </div>
              <div className="flex justify-end">
                <Badge variant="outline" className="bg-white font-medium text-gray-700 border-gray-200">
                  {configForPreview.schema ?? 'N/A'}
                </Badge>
              </div>
              {/* Table Row */}
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-gray-500" />
                <span className="text-xs font-medium uppercase tracking-wide text-gray-500">Table</span>
              </div>
              <div className="flex justify-end">
                <Badge variant="outline" className="bg-white font-medium text-indigo-700 border-indigo-200">
                  {configForPreview?.table ?? 'N/A'}
                </Badge>
              </div>

              {/* Action Row */}
              <div className="flex items-center gap-2">
                <Settings2 className="h-4 w-4 text-gray-500" />
                <span className="text-xs font-medium uppercase tracking-wide text-gray-500">Action</span>
              </div>
              <div className="flex justify-end">
                <Badge
                  variant="outline"
                  className={`
                    bg-white font-medium flex items-center gap-1.5 px-2
                    ${configForPreview?.action === 'insert' ? 'text-emerald-700 border-emerald-200' : ''}
                    ${configForPreview?.action === 'update' ? 'text-blue-700 border-blue-200' : ''}
                    ${configForPreview?.action === 'archive' ? 'text-amber-700 border-amber-200' : ''}
                    ${configForPreview?.action === 'get' ? 'text-purple-700 border-purple-200' : ''}
                  `}
                >
                  {/* Safe access */}
                  {getActionIcon(configForPreview?.action ?? '')}
                  {getActionLabel(configForPreview?.action ?? '')}
                </Badge>
              </div>

              {/* Filter Condition - Conditionally render based on safe access */}
              {configForPreview && (configForPreview.action === 'update' || configForPreview.action === 'archive' || configForPreview.action === 'get') && configForPreview.filterColumn && (
                <>
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-gray-500" />
                    <span className="text-xs font-medium uppercase tracking-wide text-gray-500">Filter</span>
                  </div>
                  <div className="flex justify-end">
                    <Badge
                      variant="outline"
                      className="bg-white font-medium text-gray-700 border-gray-200 flex items-center"
                    >
                      <span className="font-mono text-xs">{configForPreview.filterColumn ?? ''}</span>
                      <span className="mx-1.5 text-gray-400">=</span>
                      <span className="font-mono text-xs truncate max-w-[180px]" title={configForPreview.filterValue ?? ''}>
                        {configForPreview.filterValue ?? ''}
                      </span>
                    </Badge>
                  </div>
                </>
              )}
            </div>

            {/* Sorting and Limit Preview for 'get' action */}
            {configForPreview && configForPreview.action === 'get' && (configForPreview.sortBy || configForPreview.limit !== undefined) && (
              <div className="mt-4 grid grid-cols-[140px_1fr] gap-y-4 py-1.5 px-2 bg-white rounded-md border border-gray-50">
                {/* Sort Row */}
                {configForPreview.sortBy && (
                  <>
                    <div className="flex items-center gap-2">
                      {configForPreview.sortDirection === 'desc' ? <ArrowDown className="h-4 w-4 text-gray-500" /> : <ArrowUp className="h-4 w-4 text-gray-500" />}
                      <span className="text-xs font-medium uppercase tracking-wide text-gray-500">Sort By</span>
                    </div>
                    <div className="flex justify-end">
                      <Badge variant="outline" className="bg-white font-medium text-gray-700 border-gray-200">
                        {configForPreview.sortBy} ({configForPreview.sortDirection || 'asc'})
                      </Badge>
                    </div>
                  </>
                )}
                 {/* Limit Row */}
                 {configForPreview.limit !== undefined && (
                  <>
                    <div className="flex items-center gap-2">
                       <Sigma className="h-4 w-4 text-gray-500" />
                       <span className="text-xs font-medium uppercase tracking-wide text-gray-500">Limit</span>
                    </div>
                    <div className="flex justify-end">
                      <Badge variant="outline" className="bg-white font-medium text-gray-700 border-gray-200">
                        {configForPreview.limit}
                      </Badge>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Column Mappings - Conditionally render based on safe access */}
            {configForPreview && (configForPreview.action === 'update' || configForPreview.action === 'insert') && mappingEntries.length > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 mb-3 px-2">
                  <FileEdit className="h-3.5 w-3.5 text-gray-500" />
                  <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    {configForPreview.action === 'insert' ? 'Inserted Values' : 'Updated Values'}
                  </span>
                </div>
                <div className="border rounded-md overflow-hidden bg-slate-50/50">
                  <div className="grid grid-cols-[1fr_1.5fr] text-xs">
                    <div className="bg-slate-100 py-1.5 px-3 font-medium text-gray-600 border-b border-gray-200">
                      Column
                    </div>
                    <div className="bg-slate-100 py-1.5 px-3 font-medium text-gray-600 border-b border-gray-200 text-right">
                      Value
                    </div>
                    {mappingEntries.map(([column, value], index) => (
                      <>
                        <div key={column} className={`py-1.5 px-3 font-medium text-gray-700 ${index < mappingEntries.length - 1 ? 'border-b border-gray-100' : ''}`}>
                          {column}
                        </div>
                        <div className={`py-1.5 px-3 text-right ${index < mappingEntries.length - 1 ? 'border-b border-gray-100' : ''}`}>
                          <code className="bg-white px-2 py-0.5 rounded text-gray-700 border border-gray-200 text-xs">
                            {value as string}
                          </code>
                        </div>
                      </>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <div className="bg-gray-100 p-3 rounded-full mb-2">
              <Database className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500 mb-1">No configuration set</p>
            <p className="text-xs text-gray-400">Click the edit button to configure data store operations</p>
          </div>
        )}
      </div>
    );
  };

  // --- Render Edit State ---
  const renderEditForm = () => {
    const columnsToFilter = columnNames;
    const availableColumns = selectedAction === 'update'
      ? columnNames.filter(col =>
          col !== filterColumn && !EXCLUDED_UPDATE_COLUMNS.includes(col.toLowerCase())
        )
      : columnNames;
    const mappedColumns = Object.keys(columnMappings);
    const unmappedColumns = availableColumns.filter(col => !mappedColumns.includes(col));
    const editIconColor = effectivelyDisabled ? 'text-gray-500' : 'text-blue-600'; // Color for editing mode

    return (
      <div className="border rounded-md overflow-hidden bg-white shadow-sm">
        {/* Edit Header */}
        <div className="flex justify-between items-center h-12 px-3 border-b bg-blue-50">
            <div className="flex items-center gap-2">
              <Database className={`h-4 w-4 ${editIconColor}`} />
              <span className={`font-medium text-sm text-blue-800`}>
                  Edit Data Store Configuration
              </span>
            </div>
        </div>

        <div className="p-3 space-y-3.5">
          {/* Schema Selection */}
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <Database className="h-3.5 w-3.5 text-gray-600" />
              <Label htmlFor="ds-schema-select" className="text-xs font-medium uppercase tracking-wide text-gray-600">Schema</Label>
            </div>
            <Select
              value={selectedSchema}
              onValueChange={(value) => {
                setSelectedSchema(value);
                // Reset dependent state
                setSelectedTable('');
                setSelectedAction('');
                setColumnMappings({});
                setFilterColumn('');
                setFilterValue('');
                setSortBy('');
                setSortDirection('');
                setLimit('');
              }}
              disabled={!schemas || !isEditing}
            >
              <SelectTrigger id="ds-schema-select" className="h-9">
                <SelectValue placeholder={schemasLoading ? 'Loading...' : 'Select schema...'} />
              </SelectTrigger>
              <SelectContent>
                {schemas?.map(s => (
                  <SelectItem key={s.name} value={s.name}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {schemasError && <span className="text-xs text-red-600">Error loading schemas</span>}
          </div>

          {/* Table and Action Selection Box */}
          <div className="border rounded-md p-3 space-y-3">
            {/* Table Selection */}
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <Database className="h-3.5 w-3.5 text-gray-600" />
                <Label htmlFor="ds-table-select" className="text-xs font-medium uppercase tracking-wide text-gray-600">Table</Label>
              </div>
              <Select
                value={selectedTable}
                onValueChange={(value) => {
                  setSelectedTable(value);
                  setColumnMappings({}); // Reset mappings when table changes
                }}
                disabled={!selectedSchema || tablesLoading}
              >
                <SelectTrigger id="ds-table-select" className="h-9">
                  <SelectValue placeholder={tablesLoading ? 'Loading...' : 'Select table...'} />
                </SelectTrigger>
                <SelectContent>
                  {tableNames.map(name => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {tablesError && <span className="text-xs text-red-600">Error loading tables</span>}
            </div>

            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <Settings2 className="h-3.5 w-3.5 text-gray-600" />
                <Label htmlFor="ds-action-select" className="text-xs font-medium uppercase tracking-wide text-gray-600">Action</Label>
              </div>
              <Select
                value={selectedAction}
                onValueChange={(value) => {
                  setSelectedAction(value as DataStoreAction);
                  // Reset filters if action changes to insert
                  if (value === 'insert') {
                    setFilterColumn('');
                    setFilterValue('');
                  }
                  // Reset sort/limit if action is not 'get'
                  if (value !== 'get') {
                    setSortBy('');
                    setSortDirection('');
                    setLimit('');
                  }
                }}
                disabled={!selectedTable} // Disable action until table is selected
              >
                <SelectTrigger id="ds-action-select" className="h-9">
                  <SelectValue placeholder="Select action..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="insert">Insert Record</SelectItem>
                  <SelectItem value="update">Update Record(s)</SelectItem>
                  <SelectItem value="archive">Archive Record(s)</SelectItem>
                  <SelectItem value="get">Get Record(s)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filter Section - Update & Archive & Get - Now in the top section */}
            {selectedTable && (selectedAction === 'update' || selectedAction === 'archive' || selectedAction === 'get') && (
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <Filter className="h-3.5 w-3.5 text-gray-600" />
                  <Label className="text-xs font-medium uppercase tracking-wide text-gray-600">Filter (Optional for Get)</Label>
                </div>

                <div className="grid grid-cols-[1fr_40px_1fr] gap-2 items-center">
                  <Select value={filterColumn} onValueChange={setFilterColumn}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select column..." />
                    </SelectTrigger>
                    <SelectContent>
                      {columnsToFilter.map(col => (
                        <SelectItem key={col} value={col}>{col}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="flex justify-center">
                    <Equal className="h-4 w-4 text-gray-400" />
                  </div>

                  <Input
                    placeholder="Value or {{input.variable}}"
                    value={filterValue}
                    onChange={(e) => setFilterValue(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Sort & Limit Section for 'get' action */}
          {selectedTable && selectedAction === 'get' && (
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <ListFilter className="h-3.5 w-3.5 text-gray-600" />
                <Label className="text-xs font-medium uppercase tracking-wide text-gray-600">Sort & Limit (Optional)</Label>
              </div>
              <div className="grid grid-cols-[2fr_1fr_1fr] gap-2 items-center">
                 {/* Sort By Column */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by column..." />
                  </SelectTrigger>
                  <SelectContent>
                    {columnsToFilter.map(col => (
                      <SelectItem key={col} value={col}>{col}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {/* Sort Direction */}
                <Select value={sortDirection} onValueChange={(v) => setSortDirection(v as 'asc' | 'desc' | '')} disabled={!sortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Dir"/>
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="asc">Ascending</SelectItem>
                     <SelectItem value="desc">Descending</SelectItem>
                  </SelectContent>
                </Select>
                {/* Limit */}
                <Input
                  type="number"
                  placeholder="Limit"
                  value={limit}
                  onChange={(e) => setLimit(e.target.value)}
                  min="1"
                  step="1"
                />
              </div>
            </div>
          )}

          {/* Archive Action Note */}
          {selectedAction === 'archive' && (
            <Alert className="bg-amber-50 border-amber-200">
              <Info className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-amber-800">Archive Requirement</AlertTitle>
              <AlertDescription className="text-amber-700">
                Ensure the selected table has a boolean column (e.g., 'is_archived') to use the Archive action.
                This action will set that column to 'true' for the matched record(s).
              </AlertDescription>
            </Alert>
          )}

          {/* Column Mappings Section - COMPLETELY REDESIGNED */}
          {selectedTable && (selectedAction === 'insert' || selectedAction === 'update') && (
            <div className="border rounded-md p-3 space-y-3">
              <div className="flex items-center gap-1.5 mb-1">
                <FileEdit className="h-3.5 w-3.5 text-gray-600" />
                <Label className="text-xs font-medium uppercase tracking-wide text-gray-600">
                  {selectedAction === 'insert' ? 'Values to Insert' : 'Values to Update'}
                </Label>
              </div>

              {/* Mappings area */}
              <div className="space-y-2">
                {mappedColumns.map(columnName => (
                  <div key={columnName} className="flex items-center gap-2">
                    <Select
                      value={columnName}
                      onValueChange={(newColumn) => {
                        // Move the value from old column to new column
                        const value = columnMappings[columnName] || '';
                        handleRemoveMapping(columnName);
                        handleAddMapping(newColumn);
                        handleMappingChange(newColumn, value);
                      }}
                    >
                      <SelectTrigger className="w-1/3">
                        <SelectValue>{columnName}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {/* Include ALL available columns to match standard dropdown behavior */}
                        {availableColumns.map(col => (
                          <SelectItem key={col} value={col}>{col}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex justify-center w-8">
                      <Equal className="h-3.5 w-3.5 text-gray-400" />
                    </div>
                    <div className="flex-1 flex items-center gap-1">
                      <Input
                        placeholder="Value or {{input.variable}}"
                        value={columnMappings[columnName] || ''}
                        onChange={(e) => handleMappingChange(columnName, e.target.value)}
                        className="h-9"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveMapping(columnName)}
                        className="h-7 w-7 shrink-0 text-gray-400 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}

                {/* Add Column button - Simplified with no dropdown */}
                {unmappedColumns.length > 0 && (
                  <div className="flex justify-end mt-2">
                    <Button
                      onClick={() => {
                        // Just add a blank column with the first available unmapped column
                        handleAddMapping(unmappedColumns[0]);
                      }}
                      variant="outline"
                      size="sm"
                      className="mt-1"
                    >
                      <PlusCircle className="h-4 w-4 mr-1" />
                      Add Column
                    </Button>
                  </div>
                )}

                {/* No Columns Available Message */}
                {availableColumns.length === 0 && (
                  <div className="text-center py-2">
                    <p className="text-sm text-gray-500">No columns available for this operation</p>
                  </div>
                )}

                {/* All Columns Mapped Message */}
                {availableColumns.length > 0 && unmappedColumns.length === 0 && (
                  <div className="text-center py-2">
                    <p className="text-sm text-gray-500">All available columns have been added</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Edit Mode Buttons - Remove border-t */}
        <div className="flex justify-end gap-2 p-3">
          <Button variant="outline" size="sm" onClick={handleCancel}>Cancel</Button>
          <Button
            size="sm"
            onClick={handleUpdate}
            disabled={
              !selectedTable ||
              !selectedAction ||
              ((selectedAction === 'update' || selectedAction === 'archive') && (!filterColumn || !filterValue))
            }
            className="bg-slate-900 hover:bg-slate-800"
          >
            Update
          </Button>
        </div>
      </div>
    );
  };
  // --- End Render Helper Functions ---

  // --- Main Return ---
  return (
    <div className="space-y-2">
      {isEditing ? renderEditForm() : renderPreview()}
    </div>
  );
};