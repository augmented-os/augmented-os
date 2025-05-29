import React from 'react';
import {
  Type,
  Hash,
  ToggleRight,
  Calendar,
  Clock,
  Key,
  Link2,
  FileText,
  FileJson,
  ListFilter,
  AlertCircle, // Fallback
  LucideProps
} from 'lucide-react';
import { cn } from "@/lib/utils"; // Assuming shadcn/ui utility exists

// Map icon names (from useFieldTypes) to Lucide components
const iconMap: { [key: string]: React.ComponentType<LucideProps> } = {
  Type,
  Hash,
  ToggleRight,
  Calendar,
  Clock,
  Key,
  Link2,
  FileText,
  FileJson,
  ListFilter,
  AlertCircle // Ensure fallback is in the map if needed directly
};

interface FieldTypeIconProps {
  iconName: string;
  className?: string;
}

/**
 * Renders a Lucide icon based on the field type's icon name string.
 */
export function FieldTypeIcon({ iconName, className }: FieldTypeIconProps) {
  // Default to AlertCircle if the iconName is not found
  const IconComponent = iconMap[iconName] || AlertCircle;

  return <IconComponent className={cn("h-4 w-4", className)} />;
} 