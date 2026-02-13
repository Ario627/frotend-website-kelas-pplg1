'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils/cn';

interface PixelLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function PixelLoader({ size = 'md', className }: PixelLoaderProps) {
  const sizeStyles = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-3 h-3',
  };

  return (
    <div className={cn('flex items-center justify-center gap-1', className)}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={cn(sizeStyles[size], 'bg-[rgb(var(--mint))]')}
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.15,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

export function PixelLoaderFullscreen() {
  return (
    <div className="fixed inset-0 bg-[rgb(var(--cream))] flex items-center justify-center z-50">
      <motion.div 
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <PixelLoader size="lg" />
        <motion.p 
          className="font-pixel text-xs text-[rgb(var(--slate))] mt-4"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Loading...
        </motion.p>
      </motion.div>
    </div>
  );
}