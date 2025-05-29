"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface ComboboxProps {
  options: { value: string; label: string }[];
  value: string; // Current selected value (or typed value)
  onChange: (value: string) => void; // Function to update the value
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
  // Allow controlling the popover open state if needed externally
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = "Select option...",
  searchPlaceholder = "Search option...",
  emptyMessage = "No option found.",
  className,
  open: externalOpen,
  onOpenChange: externalOnOpenChange
}: ComboboxProps) {
  // Internal state if open state is not controlled externally
  const [internalOpen, setInternalOpen] = React.useState(false);

  // Determine if the component is controlled or uncontrolled
  const isControlled = externalOpen !== undefined && externalOnOpenChange !== undefined;
  const open = isControlled ? externalOpen : internalOpen;
  const setOpen = isControlled ? externalOnOpenChange : setInternalOpen;

  const handleSelect = (currentValue: string) => {
    // When an item is selected from the list
    onChange(currentValue);
    setOpen(false);
  }

  const handleInputChange = (search: string) => {
    // Update the value state directly as the user types in CommandInput
    // This allows creating new folder names
    onChange(search);
  }

  // Find the label for the currently selected value, default to the value itself or placeholder
  const displayLabel = options.find((option) => option.value.toLowerCase() === value?.toLowerCase())?.label || value || placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between font-normal", className)} // Use font-normal as base
        >
          <span className="truncate"> {/* Prevent long text overflow */} 
             {displayLabel}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
         className="w-[--radix-popover-trigger-width] p-0" // Match trigger width
         style={{ minWidth: 'var(--radix-popover-trigger-width)'}} // Ensure minWidth for dynamic content
      >
        <Command 
          // Add custom filter to show all options when input is empty
          // And filter based on label text when typing
          filter={(optionValue, search) => {
            // If search is empty, show all options (return 1)
            if (!search) return 1;
            // Find the option corresponding to the item's value
            const option = options.find(opt => opt.value.toLowerCase() === optionValue.toLowerCase());
            // Check if the option's label includes the search term (case-insensitive)
            return option?.label.toLowerCase().includes(search.toLowerCase()) ? 1 : 0;
          }} 
        >
          <CommandInput 
            placeholder={searchPlaceholder} 
            value={value} // Bind input value to the state
            onValueChange={handleInputChange} // Update state on typing
          />
          <CommandList> 
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value} // Important for Command internals
                  onSelect={() => handleSelect(option.value)} // Select using the option's value
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value?.toLowerCase() === option.value.toLowerCase() ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
} 