import { cn } from '@/lib/utils/cn';
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type HTMLAttributes } from 'react';

const cardVariants = cva(
  [
    'rounded-none p-4',
    'border-[1.5px] border-[rgb(var(--charcoal))/0.1]',
    'shadow-[3px_3px_0_rgb(var(--shadow)/0.25)]',
    'transition-all duration-150',
  ],
  {
    variants: {
      variant: {
        default: 'bg-white',
        mint: 'bg-[rgb(var(--mint))/0.4]',
        peach: 'bg-[rgb(var(--peach))/0.4]',
        blush: 'bg-[rgb(var(--blush))/0.4]',
        sky: 'bg-[rgb(var(--sky))/0.4]',
        ghost: 'bg-[rgb(var(--lavender))/0.3] border-transparent shadow-none',
      },
      hover: {
        true: [
          'cursor-pointer',
          'hover:translate-x-[-1px] hover:translate-y-[-1px]',
          'hover:shadow-[4px_4px_0_rgb(var(--shadow)/0.3)]',
        ],
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      hover: true,
    },
  }
);

export interface PixelCardProps 
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export const PixelCard = forwardRef<HTMLDivElement, PixelCardProps>(
  ({ className, variant, hover, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, hover, className }))}
        {...props}
      />
    );
  }
);

PixelCard.displayName = 'PixelCard';