import React from 'react';
import { cn } from '@/lib/utils';

interface TextDisplayProps {
  label?: string;
  value: unknown;
  className?: string;
}

export const TextDisplay: React.FC<TextDisplayProps> = ({ 
  label, 
  value, 
  className 
}) => {
  return (
    <div className={cn("text-display", className)}>
      {label && (
        <div className="text-sm font-medium text-gray-500 mb-1">{label}</div>
      )}
      <div className="text-sm text-gray-900">
        {String(value || '')}
      </div>
    </div>
  );
}; 