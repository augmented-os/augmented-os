import { supabase } from '@/integrations/supabase/client';

// Fetch all integration definitions from the new table
export async function fetchIntegrations() {
  const { data, error } = await supabase
    .from('integration_definitions')
    .select('id, name, integration_id, config_schema, auth_type, icon_url, description, methods, type')
    .order('name', { ascending: true });
  if (error) throw error;
  return data;
}

// Fetch all integration instances with their definition data
export async function fetchIntegrationInstances() {
  const { data, error } = await supabase
    .from('integration_instances')
    .select(`
      *,
      integration_definition:integration_definition_id (
        icon_url,
        description
      )
    `)
    .order('name', { ascending: true });
  if (error) throw error;
  return data;
}

// Helper function to get instances for a specific definition
// Used by IntegrationConfig component
export async function getInstancesForDefinition(definitionId: string) {
  const { data, error } = await supabase
    .from('integration_instances')
    .select(`
      id, name, description, status, config, credentials, 
      integration_definition:integration_definition_id (
        icon_url,
        description
      )
    `)
    .eq('integration_definition_id', definitionId)
    .order('name', { ascending: true });
  if (error) throw error;
  return data;
}

// Fetch a single integration definition with all its details
export async function fetchIntegrationDefinition(id: string) {
  const { data, error } = await supabase
    .from('integration_definitions')
    .select('id, name, integration_id, config_schema, auth_type, icon_url, description, methods')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

// Fetch a single integration instance with its definition
export async function fetchIntegrationInstance(id: string) {
  const { data, error } = await supabase
    .from('integration_instances')
    .select(`
      *,
      integration_definition:integration_definition_id (
        icon_url,
        description
      )
    `)
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

// Fetch AI-specific integration definitions
export async function fetchAIIntegrations() {
  const { data, error } = await supabase
    .from('integration_definitions')
    .select('id, name, integration_id, config_schema, auth_type, icon_url, description, methods, type, ai_config')
    .eq('type', 'ai')  // Filter by type = 'ai'
    .order('name', { ascending: true });
  if (error) throw error;
  return data;
}

// Fetch AI-specific integration instances
export async function fetchAIIntegrationInstances() {
  const { data, error } = await supabase
    .from('integration_instances')
    .select(`
      *,
      integration_definition:integration_definition_id (
        icon_url,
        description,
        type
      )
    `)
    .eq('integration_definition.type', 'ai')  // Filter by type = 'ai'
    .order('name', { ascending: true });
  if (error) throw error;
  return data;
}

// Helper function to get AI instances for a specific definition
export async function getAIInstancesForDefinition(definitionId: string) {
  const { data, error } = await supabase
    .from('integration_instances')
    .select(`
      id, name, description, status, config, credentials, 
      integration_definition:integration_definition_id (
        icon_url,
        description,
        type
      )
    `)
    .eq('integration_definition_id', definitionId)
    .eq('integration_definition.type', 'ai')  // Ensure we only get AI types
    .order('name', { ascending: true });
  if (error) throw error;
  return data;
}

// Update integration instance
export async function updateIntegrationInstance(id: string, updates: any) {
  const { data, error } = await supabase
    .from('integration_instances')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  
  // Fetch the updated record with the joined data
  return await fetchIntegrationInstance(id);
} 