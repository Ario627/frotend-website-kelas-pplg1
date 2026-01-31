import { cn } from '@/lib/utils/cn';
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

interface PixelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'mint' | 'peach' | 'blush' | 'sky' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const variantStyles = {
  default: 'bg-white text-[rgb(var(--charcoal))] hover:bg-[rgb(var(--lavender))]',
  mint: 'bg-[rgb(var(--mint))] text-[rgb(var(--charcoal))] hover:brightness-95',
  peach: 'bg-[rgb(var(--peach))] text-[rgb(var(--charcoal))] hover:brightness-95',
  blush: 'bg-[rgb(var(--blush))] text-[rgb(var(--charcoal))] hover:brightness-95',
  sky: 'bg-[rgb(var(--sky))] text-[rgb(var(--charcoal))] hover:brightness-95',
  outline: 'bg-transparent border-2 border-[rgb(var(--charcoal))] hover:bg-[rgb(var(--cream))]',
};

const sizeStyles = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export const PixelButton = forwardRef<HTMLButtonElement, PixelButtonProps>(
  ({ className, variant = 'default', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'font-pixel pixel-border pixel-hover inline-flex items-center justify-center gap-2',
          'transition-all duration-100 disabled:opacity-50 disabled:cursor-not-allowed',
          'focus:outline-none focus:ring-2 focus:ring-[rgb(var(--mint))] focus:ring-offset-2',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

PixelButton.displayName = 'PixelButton';