import React from 'react';
import { Check } from 'lucide-react';

// Predefined color palette for branches/actions
// Moved from CollapsibleBranchSection/ManualTaskActionsEditor
const BRANCH_COLORS = {
  decision: [
    { value: '#22c55e', label: 'Success/True', description: 'For positive or successful outcomes' },
    { value: '#f97316', label: 'Alert/Alternative', description: 'For alternative or warning paths' },
    { value: '#ef4444', label: 'Error/False', description: 'For negative or error cases' },
    { value: '#a855f7', label: 'Important', description: 'For distinctive but neutral outcomes' },
  ],
  neutral: [
    { value: '#64748b', label: 'Slate', description: 'Neutral business path' },
    { value: '#84cc16', label: 'Lime', description: 'Subtle positive indication' },
    { value: '#14b8a6', label: 'Teal', description: 'Neutral processing step' },
    { value: '#7c3aed', label: 'Violet', description: 'Special processing path' },
    { value: '#ec4899', label: 'Pink', description: 'Attention grabbing path' },
    { value: '#f59e0b', label: 'Amber', description: 'Caution or review path' },
    { value: '#6366f1', label: 'Indigo', description: 'Alternative process path' },
    { value: '#06b6d4', label: 'Cyan', description: 'Information processing path' },
  ]
};

interface ColorPaletteProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

export const ColorPalette: React.FC<ColorPaletteProps> = ({ selectedColor, onColorSelect }) => (
  // Added p-3 for padding inside the popover
  <div className="space-y-3 p-3">
    <div className="space-y-1.5">
      <div className="text-xs font-medium text-gray-500">Primary Actions</div>
      <div className="flex flex-wrap gap-1.5">
        {BRANCH_COLORS.decision.map(color => (
          <button
            key={color.value}
            type="button"
            title={`${color.label}: ${color.description}`}
            className={`w-6 h-6 rounded-full border ${selectedColor === color.value ? 'ring-2 ring-offset-2 ring-black/30' : 'ring-0'}`}
            style={{ backgroundColor: color.value }}
            onClick={() => onColorSelect(color.value)}
          >
            {selectedColor === color.value && <Check className="h-3.5 w-3.5 text-white m-auto" />}
          </button>
        ))}
      </div>
    </div>
    <div className="space-y-1.5">
      <div className="text-xs font-medium text-gray-500">Additional Options</div>
      <div className="flex flex-wrap gap-1.5">
        {BRANCH_COLORS.neutral.map(color => (
          <button
            key={color.value}
            type="button"
            title={`${color.label}: ${color.description}`}
            className={`w-6 h-6 rounded-full border ${selectedColor === color.value ? 'ring-2 ring-offset-2 ring-black/30' : 'ring-0'}`}
            style={{ backgroundColor: color.value }}
            onClick={() => onColorSelect(color.value)}
          >
            {selectedColor === color.value && <Check className="h-3.5 w-3.5 text-white m-auto" />}
          </button>
        ))}
      </div>
    </div>
  </div>
); 