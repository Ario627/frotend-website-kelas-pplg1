'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { motion } from 'motion/react';
import * as Dialog from '@radix-ui/react-dialog';
import { useCreateAnnouncement } from "@/hooks/use-announcement";
import { PixelButton } from "../pixel/pixel-button";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Label } from "@radix-ui/react-label";
import { X, Plus } from 'lucide-react';

const createSchema = z.object({
  title: z.string().min(5, 'Judul minimal 5 karakter').max(200, 'Judul maksimal 200 karakter'),
  content: z.string().min(10, 'Konten minimal 10 karakter'),
  priority: z.enum(['low', 'medium', 'high']),
});

type FormData = z.infer<typeof createSchema>;

interface CreateAnnouncementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateAnnouncementDialog({
  open,
  onOpenChange
}: CreateAnnouncementDialogProps) {
  const createMutation = useCreateAnnouncement();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      priority: 'medium',
    },
  });

  const onSubmit = (data: FormData) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        reset();
        onOpenChange(false);
      },
    });
  };

  const handleClose = () => {
    if (!createMutation.isPending) {
      reset();
      onOpenChange(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleClose}>
      <Dialog.Portal>
        <Dialog.Overlay asChild>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[rgb(var(--charcoal))]/30 backdrop-blur-sm z-50"
          />
        </Dialog.Overlay>

        <Dialog.Content asChild>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-50 w-auto sm:w-full sm:max-w-lg max-h-[85vh] overflow-y-auto bg-white border border-[rgb(var(--border))] shadow-[4px_4px_0_rgb(var(--shadow)/0.3)] p-4 sm:p-6"
          >
            
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <Dialog.Title className="font-pixel text-xs sm:text-sm text-[rgb(var(--charcoal))]">
                Buat Pengumuman
              </Dialog.Title>
              <Dialog.Close
                className="p-1.5 hover:bg-[rgb(var(--lavender))] transition-colors"
                disabled={createMutation.isPending}
              >
                <X size={18} className="text-[rgb(var(--slate))]" />
              </Dialog.Close>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
              
              <div className="space-y-1.5">
                <Label htmlFor="title" className="text-xs font-medium">
                  Judul <span className="text-[rgb(var(--error))]">*</span>
                </Label>
                <Input
                  id="title"
                  {...register('title')}
                  placeholder="Judul pengumuman"
                  disabled={createMutation.isPending}
                />
                {errors.title && (
                  <p className="text-[10px] text-[rgb(var(--error))]">
                    {errors.title.message}
                  </p>
                )}
              </div>

              
              <div className="space-y-1.5">
                <Label htmlFor="content" className="text-xs font-medium">
                  Konten <span className="text-[rgb(var(--error))]">*</span>
                </Label>
                <Textarea
                  id="content"
                  {...register('content')}
                  placeholder="Tulis pengumuman di sini..."
                  rows={4}
                  disabled={createMutation.isPending}
                />
                {errors.content && (
                  <p className="text-[10px] text-[rgb(var(--error))]">
                    {errors.content.message}
                  </p>
                )}
              </div>

              
              <div className="space-y-1.5">
                <Label htmlFor="priority" className="text-xs font-medium">
                  Prioritas
                </Label>
                <select
                  id="priority"
                  {...register('priority')}
                  disabled={createMutation.isPending}
                  className="w-full h-10 px-3 text-sm border border-[rgb(var(--border))] bg-white focus:outline-none focus:ring-2 focus:ring-[rgb(var(--mint))]"
                >
                  <option value="low">Biasa</option>
                  <option value="medium">Sedang</option>
                  <option value="high">Penting</option>
                </select>
              </div>

              
              <div className="flex justify-end gap-3 pt-4 border-t border-[rgb(var(--border))]">
                <PixelButton
                  type="button"
                  variant="ghost"
                  onClick={handleClose}
                  disabled={createMutation.isPending}
                >
                  Batal
                </PixelButton>
                <PixelButton
                  type="submit"
                  variant="mint"
                  isLoading={createMutation.isPending}
                >
                  <Plus size={14} />
                  Buat
                </PixelButton>
              </div>
            </form>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
