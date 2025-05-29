import { LucideIcon } from 'lucide-react';

export type IconCategory = 'workflow' | 'integration' | 'general';

export interface IconRegistry {
  [category: string]: {
    [name: string]: LucideIcon;
  };
}

// The central icon registry
const iconRegistry: IconRegistry = {};

/**
 * Registers a set of icons under a specific category
 */
export function registerIcons(category: IconCategory, icons: Record<string, LucideIcon>) {
  if (!iconRegistry[category]) {
    iconRegistry[category] = {};
  }
  
  iconRegistry[category] = {
    ...iconRegistry[category],
    ...icons
  };
}

/**
 * Gets an icon by name from a specific category
 */
export function getIcon(category: IconCategory, name: string): LucideIcon | undefined {
  return iconRegistry[category]?.[name];
}

/**
 * Gets all icon names from a specific category
 */
export function getIconNames(category: IconCategory): string[] {
  return Object.keys(iconRegistry[category] || {});
}

/**
 * Gets all icons from a specific category
 */
export function getAllIcons(category: IconCategory): Record<string, LucideIcon> {
  return iconRegistry[category] || {};
}

/**
 * Checks if an icon exists in a specific category
 */
export function hasIcon(category: IconCategory, name: string): boolean {
  return !!iconRegistry[category]?.[name];
}

/**
 * Get all categories in the registry
 */
export function getIconCategories(): string[] {
  return Object.keys(iconRegistry);
}

/**
 * Check if a category exists
 */
export function hasCategory(category: string): boolean {
  return !!iconRegistry[category];
}

/**
 * Type for icon names within a specific category (useful with TypeScript)
 */
export type IconName<Category extends string> = 
  Category extends keyof typeof iconRegistry 
    ? keyof typeof iconRegistry[Category] 
    : never; 