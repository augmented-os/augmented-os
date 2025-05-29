import React from 'react';
import { Button } from '@/components/ui/button';
import { ActionButton } from '../types/schemas';
import { evaluateCondition } from '../utils/conditions';
import { cn } from '@/lib/utils';

interface FormActionsProps {
  /** Array of action buttons to render */
  actions: ActionButton[];
  /** Callback function when an action is triggered */
  onAction: (actionKey: string) => void;
  /** Whether the form is currently submitting (for submit button state) */
  isSubmitting?: boolean;
  /** Current form data for evaluating visibleIf conditions */
  formData?: Record<string, unknown>;
}

export const FormActions: React.FC<FormActionsProps> = ({
  actions,
  onAction,
  isSubmitting = false,
  formData = {}
}) => {
  const handleActionClick = (action: ActionButton) => {
    // Show confirmation dialog if confirmation text exists
    if (action.confirmation) {
      const confirmed = window.confirm(action.confirmation);
      if (!confirmed) {
        return;
      }
    }

    // Call onAction with the actionKey
    onAction(action.actionKey);
  };

  // Filter actions based on visibleIf conditions
  const visibleActions = actions.filter(action => {
    if (!action.visibleIf) {
      return true;
    }
    return evaluateCondition(action.visibleIf, formData);
  });

  if (visibleActions.length === 0) {
    return null;
  }

  // Get button variant based on action style
  const getButtonVariant = (style: ActionButton['style']) => {
    switch (style) {
      case 'primary':
        return 'default';
      case 'secondary':
        return 'outline';
      case 'danger':
        return 'destructive';
      default:
        return 'default';
    }
  };

  return (
    <div className="flex gap-3 justify-end">
      {visibleActions.map(action => {
        // Handle disabled state correctly
        const isDisabled = action.disabled || (action.actionKey === 'submit' && isSubmitting);
        
        return (
          <Button
            key={action.actionKey}
            type={action.actionKey === 'submit' ? 'submit' : 'button'}
            variant={getButtonVariant(action.style)}
            onClick={() => handleActionClick(action)}
            disabled={isDisabled}
            className={cn(
              "min-w-[100px]",
              action.actionKey === 'submit' && isSubmitting && "cursor-not-allowed"
            )}
          >
            {action.label}
          </Button>
        );
      })}
    </div>
  );
}; 