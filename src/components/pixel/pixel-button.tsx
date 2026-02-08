import { cn } from '@/lib/utils/cn';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { forwardRef, type ButtonHTMLAttributes } from 'react';

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2',
    'font-pixel text-xs',
    'transition-all duration-150',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--mint))] focus-visible:ring-offset-2',
  ],
  {
    variants: {
      variant: {
        default: [
          'bg-white text-[rgb(var(--charcoal))]',
          'border-[1.5px] border-[rgb(var(--charcoal))/0.15]',
          'shadow-[3px_3px_0_rgb(var(--shadow)/0.3)]',
          'hover:translate-x-[-1px] hover:translate-y-[-1px]',
          'hover:shadow-[4px_4px_0_rgb(var(--shadow)/0.35)]',
          'active:translate-x-[1px] active:translate-y-[1px]',
          'active:shadow-[2px_2px_0_rgb(var(--shadow)/0.25)]',
        ],
        mint: [
          'bg-[rgb(var(--mint))] text-[rgb(var(--charcoal))]',
          'border-[1.5px] border-[rgb(var(--charcoal))/0.1]',
          'shadow-[3px_3px_0_rgb(var(--shadow)/0.3)]',
          'hover:brightness-[0.97] hover:translate-x-[-1px] hover:translate-y-[-1px]',
          'hover:shadow-[4px_4px_0_rgb(var(--shadow)/0.35)]',
          'active:translate-x-[1px] active:translate-y-[1px]',
        ],
        peach: [
          'bg-[rgb(var(--peach))] text-[rgb(var(--charcoal))]',
          'border-[1.5px] border-[rgb(var(--charcoal))/0.1]',
          'shadow-[3px_3px_0_rgb(var(--shadow)/0.3)]',
          'hover:brightness-[0.97] hover:translate-x-[-1px] hover:translate-y-[-1px]',
        ],
        blush: [
          'bg-[rgb(var(--blush))] text-[rgb(var(--charcoal))]',
          'border-[1.5px] border-[rgb(var(--charcoal))/0.1]',
          'shadow-[3px_3px_0_rgb(var(--shadow)/0.3)]',
          'hover:brightness-[0.97] hover:translate-x-[-1px] hover:translate-y-[-1px]',
        ],
        outline: [
          'bg-transparent text-[rgb(var(--charcoal))]',
          'border-[1.5px] border-[rgb(var(--charcoal))/0.2]',
          'hover:bg-[rgb(var(--lavender))/0.5]',
          'hover:translate-x-[-1px] hover:translate-y-[-1px]',
        ],
        ghost: [
          'bg-transparent text-[rgb(var(--slate))]',
          'hover:bg-[rgb(var(--lavender))/0.4]',
          'hover:text-[rgb(var(--charcoal))]',
        ],
      },
      size: {
        sm: 'h-8 px-3 text-[10px]',
        md: 'h-10 px-4',
        lg: 'h-12 px-6 text-xs',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface PixelButtonProps 
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  asChild?: boolean;
}

export const PixelButton = forwardRef<HTMLButtonElement, PixelButtonProps>(
  ({ className, variant, size, isLoading, asChild = false, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </Comp>
    );
  }
);

PixelButton.displayName = 'PixelButton';