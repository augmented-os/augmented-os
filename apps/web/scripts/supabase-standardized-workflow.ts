import { supabase } from '../src/integrations/supabase/client';
import { NODE_TYPES } from '../src/types/workflow';

/**
 * This script creates a standardized workflow with consistent node typing
 */
async function createStandardizedWorkflow() {
  // Standardized workflow definition
  const workflow = {
    name: 'Standardized Demo Workflow',
    folder: 'Demos',
    description: 'Workflow with standardized node types',
    nodes: [
      {
        id: 'input-1',
        type: 'custom',
        data: { 
          label: 'Workflow Input', 
          sublabel: 'Input',
          type: NODE_TYPES.WORKFLOW_INPUT
        },
        position: { x: 500, y: 20 },
      },
      {
        id: '1',
        type: 'custom',
        data: { 
          label: 'New Row', 
          sublabel: 'Google Sheets',
          type: NODE_TYPES.DATA_STORE,
          hasMenu: true,
          provider: 'google-sheets'
        },
        position: { x: 500, y: 140 },
      },
      {
        id: '2',
        type: 'custom',
        data: { 
          label: 'Ask ChatGPT', 
          sublabel: 'OpenAI',
          type: NODE_TYPES.AI_TASK,
          hasMenu: true,
          provider: 'openai'
        },
        position: { x: 500, y: 260 },
      },
      {
        id: '3',
        type: 'custom',
        data: { 
          label: 'Code', 
          sublabel: 'Code',
          type: NODE_TYPES.CODE_TASK,
          hasMenu: true,
          language: 'javascript'
        },
        position: { x: 500, y: 380 },
      },
      {
        id: 'output-1',
        type: 'custom',
        data: { 
          label: 'End', 
          sublabel: 'Output',
          type: NODE_TYPES.WORKFLOW_OUTPUT
        },
        position: { x: 500, y: 500 },
      }
    ],
    edges: [
      { 
        id: 'e-input-1', 
        source: 'input-1', 
        target: '1', 
        type: 'custom',
        style: { stroke: '#9ca3af', strokeWidth: 2 },
        markerEnd: {
          type: 'arrow',
          width: 15,
          height: 15,
          color: '#9ca3af',
        },
      },
      { 
        id: 'e1-2', 
        source: '1', 
        target: '2', 
        type: 'custom',
        style: { stroke: '#9ca3af', strokeWidth: 2 },
        markerEnd: {
          type: 'arrow',
          width: 15,
          height: 15,
          color: '#9ca3af',
        },
      },
      { 
        id: 'e2-3', 
        source: '2', 
        target: '3', 
        type: 'custom',
        style: { stroke: '#9ca3af', strokeWidth: 2 },
        markerEnd: {
          type: 'arrow',
          width: 15,
          height: 15,
          color: '#9ca3af',
        },
      },
      { 
        id: 'e3-output', 
        source: '3', 
        target: 'output-1', 
        type: 'custom',
        style: { stroke: '#9ca3af', strokeWidth: 2 },
        markerEnd: {
          type: 'arrow',
          width: 15,
          height: 15,
          color: '#9ca3af',
        },
      }
    ]
  };

  console.log('Creating standardized workflow in Supabase...');
  
  const { data, error } = await supabase
    .from('poc_workflows')
    .insert(workflow)
    .select();
  
  if (error) {
    console.error('Error creating workflow:', error);
    throw error;
  }
  
  console.log('Workflow created successfully!');
  console.log('Workflow ID:', data[0].id);
  
  return data[0];
}

// Run the script
createStandardizedWorkflow()
  .then(() => {
    console.log('Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });

export { createStandardizedWorkflow }; 