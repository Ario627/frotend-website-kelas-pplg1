import { cn } from '@/lib/utils/cn';
import { HTMLAttributes, forwardRef } from 'react';

interface PixelCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'mint' | 'peach' | 'blush' | 'sky';
  hover?: boolean;
}

const variantStyles = {
  default: 'bg-white',
  mint: 'bg-[rgb(var(--mint))]',
  peach: 'bg-[rgb(var(--peach))]',
  blush: 'bg-[rgb(var(--blush))]',
  sky: 'bg-[rgb(var(--sky))]',
};

export const PixelCard = forwardRef<HTMLDivElement, PixelCardProps>(
  ({ className, variant = 'default', hover = true, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'pixel-border rounded-none p-4',
          variantStyles[variant],
          hover && 'pixel-hover cursor-pointer',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

PixelCard.displayName = 'PixelCard';