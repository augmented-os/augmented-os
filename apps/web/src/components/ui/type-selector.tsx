import * as React from "react";
import { Database, File, LucideIcon, Code } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// Define the available type options
export type TypeOption = {
  value: string;
  label: string;
  icon: LucideIcon;
  colorClass: string;
  bgClass: string;
  borderClass: string;
};

export const DEFAULT_TYPE_OPTIONS: TypeOption[] = [
  {
    value: "document",
    label: "Document",
    icon: File,
    colorClass: "text-blue-600",
    bgClass: "bg-blue-100",
    borderClass: "border-blue-200"
  },
  {
    value: "data",
    label: "Data",
    icon: Database,
    colorClass: "text-emerald-600",
    bgClass: "bg-emerald-100",
    borderClass: "border-emerald-200"
  },
  {
    value: "custom",
    label: "Custom",
    icon: Code,
    colorClass: "text-purple-600",
    bgClass: "bg-purple-100",
    borderClass: "border-purple-200"
  }
];

export interface TypeSelectorProps {
  /**
   * The current selected type value
   */
  value: string;
  /**
   * Callback when type value changes
   */
  onValueChange: (value: string) => void;
  /**
   * Whether the selector is disabled
   */
  disabled?: boolean;
  /**
   * Available type options (defaults to document/data options)
   */
  options?: TypeOption[];
  /**
   * Additional className for the trigger element
   */
  className?: string;
  /**
   * Use compact mode (icon only)
   */
  compact?: boolean;
}

/**
 * TypeSelector component with integrated icon display
 * Used for selecting between different content types like documents, data, etc.
 */
export function TypeSelector({
  value,
  onValueChange,
  disabled = false,
  options = DEFAULT_TYPE_OPTIONS,
  className,
  compact = true
}: TypeSelectorProps) {
  // Find the current selected option
  const selectedOption = options.find(opt => opt.value === value) || options[0];
  const Icon = selectedOption.icon;

  return (
    <Select
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
    >
      <SelectTrigger 
        className={cn(
          "h-8 w-14 border-0 rounded-none flex-shrink-0", 
          "pl-4 pr-1.5 justify-between",
          selectedOption.bgClass,
          className
        )}
      >
        <Icon className={cn("h-4 w-4", selectedOption.colorClass)} />
        
        {/* Keep SelectValue but hide it visually in compact mode */}
        <span className="sr-only">
          <SelectValue placeholder="Select type" />
        </span>
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            <div className="flex items-center gap-2">
              <option.icon className={cn("h-3.5 w-3.5", option.colorClass)} />
              <span>{option.label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
} 