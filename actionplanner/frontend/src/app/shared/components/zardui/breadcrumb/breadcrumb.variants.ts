import { cva, VariantProps } from 'class-variance-authority';

export const breadcrumbVariants = cva(
  "flex items-center space-x-1 text-sm text-muted-foreground",
  {
    variants: {
      zSize: {
        sm: 'text-xs',
        default: 'text-sm',
        lg: 'text-base',
      },
    },
    defaultVariants: {
      zSize: 'default',
    },
  },
);

export const breadcrumbItemVariants = cva(
  "flex items-center",
  {
    variants: {
      zActive: {
        true: 'text-foreground font-medium',
        false: 'text-muted-foreground hover:text-foreground transition-colors',
      },
    },
    defaultVariants: {
      zActive: false,
    },
  },
);

export const breadcrumbSeparatorVariants = cva(
  "flex items-center justify-center text-muted-foreground/50",
  {
    variants: {
      zSize: {
        sm: 'text-xs mx-1',
        default: 'text-sm mx-2',
        lg: 'text-base mx-3',
      },
    },
    defaultVariants: {
      zSize: 'default',
    },
  },
);

export type ZardBreadcrumbVariants = VariantProps<typeof breadcrumbVariants>;
export type ZardBreadcrumbItemVariants = VariantProps<typeof breadcrumbItemVariants>;
export type ZardBreadcrumbSeparatorVariants = VariantProps<typeof breadcrumbSeparatorVariants>;
