import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Form spacing variants for consistent layout spacing
 */
export const formSpacingVariants = cva('', {
  variants: {
    spacing: {
      compact: 'gap-3',
      normal: 'gap-6',
      spacious: 'gap-8',
    },
  },
  defaultVariants: {
    spacing: 'normal',
  },
});

/**
 * Form field state variants for consistent field styling
 */
export const formFieldVariants = cva('space-y-2', {
  variants: {
    state: {
      default: '',
      error: 'text-destructive',
      disabled: 'opacity-60 pointer-events-none',
    },
  },
  defaultVariants: {
    state: 'default',
  },
});

/**
 * Input variants for consistent input styling across field types
 */
export const inputVariants = cva(
  'w-full transition-colors focus:ring-2 focus:ring-primary focus:ring-offset-2',
  {
    variants: {
      state: {
        default: 'border-input',
        error: 'border-destructive focus:ring-destructive',
        disabled: 'opacity-60 cursor-not-allowed',
      },
      size: {
        sm: 'h-8 px-2 text-sm',
        md: 'h-10 px-3',
        lg: 'h-12 px-4 text-lg',
      },
    },
    defaultVariants: {
      state: 'default',
      size: 'md',
    },
  }
);

/**
 * Button variants for form actions with consistent styling
 */
export const formButtonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'underline-offset-4 hover:underline text-primary',
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-3 rounded-md',
        lg: 'h-11 px-8 rounded-md',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

/**
 * Form container variants for different form layouts
 */
export const formContainerVariants = cva(
  'bg-card rounded-lg border border-border shadow-sm',
  {
    variants: {
      size: {
        sm: 'max-w-md p-4',
        md: 'max-w-2xl p-6',
        lg: 'max-w-4xl p-8',
        full: 'w-full p-6',
      },
      spacing: {
        compact: 'space-y-3',
        normal: 'space-y-6',
        spacious: 'space-y-8',
      },
    },
    defaultVariants: {
      size: 'md',
      spacing: 'normal',
    },
  }
);

/**
 * Section variants for form sections
 */
export const formSectionVariants = cva(
  'border border-border rounded-lg overflow-hidden bg-card',
  {
    variants: {
      collapsible: {
        true: '',
        false: '',
      },
      expanded: {
        true: '',
        false: '',
      },
    },
    defaultVariants: {
      collapsible: false,
      expanded: true,
    },
  }
);

/**
 * Section header variants
 */
export const sectionHeaderVariants = cva(
  'px-4 py-3 bg-muted/50 border-b border-border flex items-center justify-between',
  {
    variants: {
      interactive: {
        true: 'cursor-pointer hover:bg-muted/70 transition-colors',
        false: '',
      },
    },
    defaultVariants: {
      interactive: false,
    },
  }
);

/**
 * Label variants for consistent label styling
 */
export const labelVariants = cva(
  'text-sm font-medium text-foreground',
  {
    variants: {
      required: {
        true: "after:content-['*'] after:ml-1 after:text-destructive",
        false: '',
      },
      size: {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
      },
    },
    defaultVariants: {
      required: false,
      size: 'md',
    },
  }
);

/**
 * Helper text variants for error and help text
 */
export const helperTextVariants = cva('text-sm', {
  variants: {
    type: {
      help: 'text-muted-foreground',
      error: 'text-destructive',
      success: 'text-green-600',
      warning: 'text-yellow-600',
    },
  },
  defaultVariants: {
    type: 'help',
  },
});

// Export types for component props
export type FormSpacingVariants = VariantProps<typeof formSpacingVariants>;
export type FormFieldVariants = VariantProps<typeof formFieldVariants>;
export type InputVariants = VariantProps<typeof inputVariants>;
export type FormButtonVariants = VariantProps<typeof formButtonVariants>;
export type FormContainerVariants = VariantProps<typeof formContainerVariants>;
export type FormSectionVariants = VariantProps<typeof formSectionVariants>;
export type SectionHeaderVariants = VariantProps<typeof sectionHeaderVariants>;
export type LabelVariants = VariantProps<typeof labelVariants>;
export type HelperTextVariants = VariantProps<typeof helperTextVariants>;

/**
 * Utility function to get spacing classes based on layout configuration
 */
export const getFormSpacing = (spacing?: 'compact' | 'normal' | 'spacious') => {
  return formSpacingVariants({ spacing });
};

/**
 * Utility function to get grid column classes
 */
export const getGridColumns = (columns?: number) => {
  if (!columns || columns < 1) return '';
  const clampedColumns = Math.min(columns, 12);
  return `grid-cols-${clampedColumns}`;
};

/**
 * Utility function to combine form field classes
 */
export const getFormFieldClasses = (
  error?: string,
  disabled?: boolean,
  className?: string
) => {
  return cn(
    formFieldVariants({
      state: error ? 'error' : disabled ? 'disabled' : 'default',
    }),
    className
  );
};

/**
 * Utility function to combine input classes
 */
export const getInputClasses = (
  error?: string,
  disabled?: boolean,
  size?: 'sm' | 'md' | 'lg',
  className?: string
) => {
  return cn(
    inputVariants({
      state: error ? 'error' : disabled ? 'disabled' : 'default',
      size,
    }),
    className
  );
};

/**
 * Utility function to get button variant from action style
 */
export const getButtonVariant = (style: 'primary' | 'secondary' | 'danger') => {
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