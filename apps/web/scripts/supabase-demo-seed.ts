/**
 * Supabase Demo Seed File
 * 
 * This script can be used to populate the Supabase database with demo workflow data.
 * Run this script with ts-node: npx ts-node scripts/supabase-demo-seed.ts
 */

import { initialNodes, initialEdges } from "../src/data/demoWorkflow";
import { createWorkflow } from "../src/data/workflowService";

/**
 * Seeds the Supabase database with demo workflow data
 */
async function seedSupabaseDemo() {
  try {
    console.log('Starting to seed Supabase with demo workflow...');
    
    const result = await createWorkflow(
      "Demo Workflow", 
      initialNodes, 
      initialEdges, 
      "Demos", 
      "Default workflow for demonstration"
    );
    
    console.log('Demo workflow created successfully!');
    console.log('Workflow ID:', result.id);
    
    return result;
  } catch (error) {
    console.error('Error seeding demo workflow:', error);
    throw error;
  }
}

// Only run the seed function if this file is executed directly
// This prevents the seed from running when the file is imported elsewhere
if (require.main === module) {
  seedSupabaseDemo()
    .then(() => {
      console.log('Seed completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seed failed:', error);
      process.exit(1);
    });
}

// Export the seed function so it can be used programmatically if needed
export { seedSupabaseDemo }; 