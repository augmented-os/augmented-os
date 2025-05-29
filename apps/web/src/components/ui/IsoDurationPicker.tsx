import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Input } from './input';
import { Label } from './label';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from './popover';
import { Button } from './button';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IsoDurationPickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

// Helper to parse ISO 8601 duration (P[n]DT[n]H[n]M)
function parseIsoDuration(iso: string) {
  const match = /^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?)?$/.exec(iso || '');
  return {
    days: match && match[1] ? parseInt(match[1], 10) : 0,
    hours: match && match[2] ? parseInt(match[2], 10) : 0,
    minutes: match && match[3] ? parseInt(match[3], 10) : 0,
  };
}

// Helper to build ISO 8601 duration from values
function buildIsoDuration({ days, hours, minutes }: { days: number; hours: number; minutes: number }) {
  let result = 'P';
  if (days) result += days + 'D';
  if (hours || minutes) {
    result += 'T';
    if (hours) result += hours + 'H';
    if (minutes) result += minutes + 'M';
  }
  if (result === 'P') result = 'P0D';
  return result;
}

// Format duration for display
function formatDuration({ days, hours, minutes }: { days: number; hours: number; minutes: number }) {
  if (days === 0 && hours === 0 && minutes === 0) return 'None';
  
  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  
  return parts.join(' ');
}

export const IsoDurationPicker: React.FC<IsoDurationPickerProps> = ({ 
  value, 
  onChange, 
  label, 
  disabled,
  className
}) => {
  const [open, setOpen] = useState(false);
  const [fields, setFields] = useState(() => parseIsoDuration(value));
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [popoverWidth, setPopoverWidth] = useState<number | undefined>(undefined);

  useLayoutEffect(() => {
    if (open && triggerRef.current) {
      setPopoverWidth(triggerRef.current.offsetWidth);
    }
  }, [open]);

  useEffect(() => {
    setFields(parseIsoDuration(value));
  }, [value]);

  const handleFieldChange = (field: 'days' | 'hours' | 'minutes', val: number) => {
    const newFields = { ...fields, [field]: Math.max(0, val) };
    setFields(newFields);
    onChange(buildIsoDuration(newFields));
  };

  const displayValue = formatDuration(fields);
  const displayLabel = label || "Deadline";
  
  return (
    <div className={cn("flex flex-col gap-1 m-0 p-0", className)}>
      {displayLabel && <Label htmlFor="duration-display" className="text-xs mb-0.5 block">{displayLabel}</Label>}
      <Popover open={open && !disabled} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="duration-display"
            ref={triggerRef}
            variant="outline"
            className={cn(
              "w-full justify-between text-sm font-normal h-9 px-3 py-0 flex items-center",
              !displayValue && "text-muted-foreground"
            )}
            disabled={disabled}
          >
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 opacity-70" />
              <span>{displayValue}</span>
            </div>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-50">
              <path d="M4.93179 5.43179C4.75605 5.60753 4.75605 5.89245 4.93179 6.06819C5.10753 6.24392 5.39245 6.24392 5.56819 6.06819L7.49999 4.13638L9.43179 6.06819C9.60753 6.24392 9.89245 6.24392 10.0682 6.06819C10.2439 5.89245 10.2439 5.60753 10.0682 5.43179L7.81819 3.18179C7.73379 3.0974 7.61933 3.04999 7.49999 3.04999C7.38064 3.04999 7.26618 3.0974 7.18179 3.18179L4.93179 5.43179ZM10.0682 9.56819C10.2439 9.39245 10.2439 9.10753 10.0682 8.93179C9.89245 8.75606 9.60753 8.75606 9.43179 8.93179L7.49999 10.8636L5.56819 8.93179C5.39245 8.75606 5.10753 8.75606 4.93179 8.93179C4.75605 9.10753 4.75605 9.39245 4.93179 9.56819L7.18179 11.8182C7.26618 11.9026 7.38064 11.95 7.49999 11.95C7.61933 11.95 7.73379 11.9026 7.81819 11.8182L10.0682 9.56819Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
            </svg>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="p-2"
          align="start"
          sideOffset={0}
          style={popoverWidth ? { width: popoverWidth } : undefined}
        >
          <div className="space-y-2">
            <div>
              <Label htmlFor="days-input" className="text-xs block mb-1">Days</Label>
              <Input
                id="days-input"
                type="number"
                value={fields.days}
                onChange={(e) => handleFieldChange('days', parseInt(e.target.value) || 0)}
                min={0}
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label htmlFor="hours-input" className="text-xs block mb-1">Hours</Label>
              <Input
                id="hours-input"
                type="number"
                value={fields.hours}
                onChange={(e) => handleFieldChange('hours', parseInt(e.target.value) || 0)}
                min={0}
                max={23}
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label htmlFor="minutes-input" className="text-xs block mb-1">Minutes</Label>
              <Input
                id="minutes-input"
                type="number"
                value={fields.minutes}
                onChange={(e) => handleFieldChange('minutes', parseInt(e.target.value) || 0)}
                min={0}
                max={59}
                className="h-8 text-sm"
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}; 