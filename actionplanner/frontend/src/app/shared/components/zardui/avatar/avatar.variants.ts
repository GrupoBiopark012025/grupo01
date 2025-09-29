import { cva, VariantProps } from 'class-variance-authority';

export const avatarVariants = cva(
  "inline-flex items-center justify-center font-medium text-white select-none shrink-0 bg-muted overflow-hidden",
  {
    variants: {
      zSize: {
        sm: 'size-8 text-xs',
        default: 'size-10 text-sm',
        lg: 'size-12 text-base',
        xl: 'size-16 text-lg',
      },
      zShape: {
        circle: 'rounded-full',
        square: 'rounded-md',
        rounded: 'rounded-xl',
      },
      zVariant: {
        default: 'bg-gradient-to-r from-blue-500 to-purple-600',
        primary: 'bg-primary',
        secondary: 'bg-secondary text-secondary-foreground',
        muted: 'bg-muted text-muted-foreground',
        custom: 'bg-[#C51736]',
      }
    },
    defaultVariants: {
      zSize: 'default',
      zShape: 'circle',
      zVariant: 'default',
    },
  },
);

export type ZardAvatarVariants = VariantProps<typeof avatarVariants>;
