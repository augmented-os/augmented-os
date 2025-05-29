import { LucideIcon } from 'lucide-react';
import { workflowIcons, WorkflowIconName } from './workflow';
import { appIcons, AppIconName } from './app';

// Export types from individual icon modules
export type { WorkflowIconName, AppIconName };

// Export icon sets
export { workflowIcons, appIcons };

// Combined icon type for any registered icon
export type IconName = WorkflowIconName | AppIconName;
export type IconCategory = 'app' | 'workflow';

// Icon registry interface for type safety
interface IconRegistry {
  getIcon(name: IconName, category?: IconCategory): LucideIcon | undefined;
}

// Icon registry implementation
class IconRegistryImpl implements IconRegistry {
  getIcon(name: IconName, category?: IconCategory): LucideIcon | undefined {
    if (category === 'app' || !category) {
      const appIcon = appIcons[name as AppIconName];
      if (appIcon) return appIcon;
    }
    
    if (category === 'workflow' || !category) {
      const workflowIcon = workflowIcons[name as WorkflowIconName];
      if (workflowIcon) return workflowIcon;
    }
    
    return undefined;
  }
}

// Export singleton instance
export const iconRegistry = new IconRegistryImpl();

// Export utility function for direct usage
export function getIcon(name: IconName, category?: IconCategory): LucideIcon | undefined {
  return iconRegistry.getIcon(name, category);
}

// Export all icon modules
export * from './app';
export * from './workflow';

// Note: Additional icon modules like 'registry' and 'integrations' 
// can be imported and re-exported here when they are created

// Importing these modules is not necessary right now, but can be added in the future:
// export * from './registry';
// export * from './integrations'; 