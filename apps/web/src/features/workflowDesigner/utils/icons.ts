import { LucideIcon } from 'lucide-react';
import { iconRegistry, workflowIcons, type WorkflowIconName } from '@/lib/icons';

/**
 * Get the Icon component for a given icon name
 */
export function getIconComponent(iconName: string): LucideIcon {
  // Try to get from the central registry first
  const registryIcon = iconRegistry.getIcon(iconName as any, 'workflow');
  if (registryIcon) {
    return registryIcon;
  }
  
  // Fallback to direct access from workflow icons
  return workflowIcons[iconName as WorkflowIconName] || workflowIcons.server;
}

// SVG path definitions for drag-and-drop preview
const iconPathMap: Record<string, string> = {
  'database': '<ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>',
  'file': '<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line>',
  'code': '<path d="M16 18h2a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v2"></path><path d="M10 14H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-2"></path><path d="m10 10 2-2 2 2"></path>',
  'message': '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>',
  'brain': '<path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-1.04Z"></path><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24A2.5 2.5 0 0 0 14.5 2Z"></path>',
  'user': '<circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="10" r="3"></circle><path d="M7 21v-2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2"></path>',
  'gitmerge': '<circle cx="18" cy="18" r="3"></circle><circle cx="6" cy="6" r="3"></circle><path d="M13 6h3a2 2 0 0 1 2 2v7"></path><path d="M11 18H8a2 2 0 0 1-2-2V9"></path>',
  'gitbranch': '<line x1="6" y1="3" x2="6" y2="15"></line><circle cx="18" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><path d="M18 9a9 9 0 0 1-9 9"></path>',
  'timer': '<circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>',
  'clock': '<circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>',
  'output': '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>',
  'input': '<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" x2="3" y1="12" y2="12"/>',
  'server': '<path d="M5 9a2 2 0 0 0-2 2v1c0 1 .6 1.5 1 1.5s1-.5 1-1.5 .6-1.5 1-1.5 1 .5 1 1.5v.5c0 1.5-.5 3-2 4.5.5.5 1.4 1 2.5 1 3 0 4.5-3 4.5-5.5S13 8 10.5 8c-2 0-4.5 1.5-5.5 5z"></path><path d="M21 9a2 2 0 0 0-2 2v1c0 1-.6 1.5-1 1.5s-1-.5-1-1.5-.6-1.5-1-1.5-1 .5-1 1.5v.5c0 1.5.5 3 2 4.5-.5.5-1.4 1-2.5 1-3 0-4.5-3 4.5-5.5S13 8 15.5 8c2 0 4.5 1.5 5.5 5"></path>'
};

/**
 * Get the SVG path string for a given icon name
 */
export function getIconPath(iconName: string): string {
  return iconPathMap[iconName] || iconPathMap['server']; // Default fallback
}

/**
 * List of all available icon names
 */
export const availableIcons = Object.keys(workflowIcons);

/**
 * Type definition for the icon name string
 */
export type IconName = WorkflowIconName; 