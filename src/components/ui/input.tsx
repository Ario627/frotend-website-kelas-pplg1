import { forwardRef, type InputHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';

const inputVariants = cva(
  [
    'flex w-full',
    'bg-elevated border-2 border-border-subtle',
    'text-sm text-foreground placeholder:text-foreground-muted',
    'transition-all duration-fast ease-out-expo',
    'focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20',
    'hover:border-border-default',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'file:border-0 file:bg-transparent file:text-sm file:font-medium',
  ],
  {
    variants: {
      inputSize: {
        sm: 'h-9 px-3 text-xs',
        md: 'h-11 px-4',
        lg: 'h-12 px-5 text-base',
      },
      hasError: {
        true: 'border-error focus:border-error focus:ring-error/20',
        false: '',
      },
    },
    defaultVariants: {
      inputSize: 'md',
      hasError: false,
    },
  }
);

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  hasError?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, inputSize, hasError, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ inputSize, hasError, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input, inputVariants };