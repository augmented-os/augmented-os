import { Node, Edge } from 'reactflow';
import { supabase } from '@/integrations/supabase/client';
import { SchemaField } from '@/types/workflow';

// Helper function to get or create folder ID
async function getOrCreateFolderId(folderName: string): Promise<string> {
  if (!folderName || folderName.trim() === '') {
    folderName = 'Workflows';
  }
  const trimmedFolderName = folderName.trim();

  const { data: existingFolder, error: selectError } = await supabase
    .from('poc_workflow_folders')
    .select('id')
    .eq('name', trimmedFolderName)
    .single();

  if (selectError && selectError.code !== 'PGRST116') {
    throw selectError;
  }

  if (existingFolder) {
    return existingFolder.id;
  } else {
    const { data: newFolder, error: insertError } = await supabase
      .from('poc_workflow_folders')
      .insert({ name: trimmedFolderName })
      .select('id')
      .single();

    if (insertError) {
      throw insertError;
    }
    if (!newFolder) {
      throw new Error('  > Failed to create folder and retrieve ID.');
    }
    return newFolder.id;
  }
}

/**
 * Fetch all workflows from Supabase, joining folder name
 */
export async function fetchWorkflows() {
  const { data, error } = await supabase
    .from('poc_workflows')
    .select(`
      id,
      name,
      description,
      nodes,
      edges,
      created_at,
      updated_at,
      workflow_folder_id,
      poc_workflow_folders ( name ),
      input_schema,
      output_schema
    `); 
  
  if (error) {
    throw error;
  }

  const mappedData = data?.map(wf => {
    const folderObject = wf.poc_workflow_folders as { name?: string } | null;
    return {
      ...wf,
      folder: folderObject?.name ?? null,
      poc_workflow_folders: undefined
    };
  }) || [];

  return mappedData;
}

/**
 * Fetch a single workflow by ID, joining folder name
 */
export async function fetchWorkflowById(id: string) {
  const { data, error } = await supabase
    .from('poc_workflows')
    .select(`
      id,
      name,
      description,
      nodes,
      edges,
      created_at,
      updated_at,
      workflow_folder_id,
      poc_workflow_folders ( name ),
      input_schema,
      output_schema
    `)
    .eq('id', id)
    .single();
  
  if (error) {
    throw error;
  }

  const mappedData = data ? (() => {
    const folderObject = data.poc_workflow_folders as { name?: string } | null;
    return {
      ...data,
      folder: folderObject?.name ?? null,
      poc_workflow_folders: undefined
    };
  })() : null;

  return mappedData;
}

/**
 * Create a new workflow in Supabase
 */
export async function createWorkflow(
  name: string,
  nodes: Node[],
  edges: Edge[],
  folderName: string,
  description?: string,
  input_schema?: SchemaField[] | null,
  output_schema?: SchemaField[] | null
) {
  const workflow_folder_id = await getOrCreateFolderId(folderName);

  const { data, error } = await supabase
    .from('poc_workflows')
    .insert({
      name,
      description,
      nodes,
      edges,
      workflow_folder_id,
      input_schema,
      output_schema
    })
    .select(`
      id,
      name,
      description,
      nodes,
      edges,
      created_at,
      updated_at,
      workflow_folder_id,
      poc_workflow_folders ( name ),
      input_schema,
      output_schema
    `)
    .single();
  
  if (error) {
    throw error;
  }
  
  // Map the response to include the folder name
  const mappedData = data ? (() => {
    const folderObject = data.poc_workflow_folders as { name?: string } | null;
    return {
      ...data,
      folder: folderObject?.name ?? null,
      poc_workflow_folders: undefined
    };
  })() : null;
  
  return mappedData;
}

/**
 * Update an existing workflow
 */
export async function updateWorkflow(
  id: string,
  updates: {
    name?: string;
    nodes?: Node[];
    edges?: Edge[];
    folder?: string; // UI concept - will be converted to workflow_folder_id
    description?: string;
    input_schema?: SchemaField[] | null;
    output_schema?: SchemaField[] | null;
  }
) {
  const updatesToSend: Record<string, unknown> = { ...updates };

  // If folder name is provided, convert it to a folder ID
  if (updates.folder !== undefined) {
    const folderName = updates.folder;
    delete updatesToSend.folder; // Remove the folder name
    const workflow_folder_id = await getOrCreateFolderId(folderName);
    updatesToSend.workflow_folder_id = workflow_folder_id;
  }

  const { data, error } = await supabase
    .from('poc_workflows')
    .update(updatesToSend)
    .eq('id', id)
    .select(`
      id,
      name,
      description,
      nodes,
      edges,
      created_at,
      updated_at,
      workflow_folder_id,
      poc_workflow_folders ( name ),
      input_schema,
      output_schema
    `)
    .single();
  
  if (error) {
    throw error;
  }
  
  // Map the response to include the folder name
  const mappedData = data ? (() => {
    const folderObject = data.poc_workflow_folders as { name?: string } | null;
    return {
      ...data,
      folder: folderObject?.name ?? null,
      poc_workflow_folders: undefined
    };
  })() : null;
  
  return mappedData;
}

/**
 * Delete a workflow
 */
export async function deleteWorkflow(id: string) {
  const { error } = await supabase
    .from('poc_workflows')
    .delete()
    .eq('id', id);
  
  if (error) {
    throw error;
  }
  
  return true;
}

/**
 * Fetch all workflow folders from Supabase
 */
export async function fetchAllFolders() {
  const { data, error } = await supabase
    .from('poc_workflow_folders')
    .select('id, name')
    .order('name');
  
  if (error) {
    throw error;
  }
  
  return data || [];
} 