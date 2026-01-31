'use client';

import { useToast } from '@/hooks/use-toast';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export function Toaster() {
  const { toasts, dismiss } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-100 flex flex-col gap-2 w-full max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            'pixel-border p-4 bg-white shadow-lg animate-in slide-in-from-right-full',
            toast.variant === 'destructive' && 'bg-[rgb(var(--error))]/10 border-[rgb(var(--error))]'
          )}
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              {toast.title && <p className="font-pixel text-sm text-[rgb(var(--charcoal))]">{toast.title}</p>}
              {toast.description && <p className="text-sm text-[rgb(var(--slate))] mt-1">{toast.description}</p>}
            </div>
            <button onClick={() => dismiss(toast.id)} className="text-[rgb(var(--slate))] hover:text-[rgb(var(--charcoal))]">
              <X size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}