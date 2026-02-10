'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { PixelCard } from '@/components/pixel/pixel-card';
import { PixelButton } from '@/components/pixel/pixel-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Lock, Mail, Clock, XCircle, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { 
    login, 
    isLoginLoading, 
    loginError, 
    isPending, 
    isRejected, 
    rejectedReason,
    resetAuthState 
  } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  const handleTryAgain = () => {
    resetAuthState();
    reset();
  };

  // Tampilan jika status pending
  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-[rgb(var(--cream))] to-[rgb(var(--lavender))]">
        <PixelCard className="w-full max-w-md p-8 text-center" hover={false}>
          <div className="w-20 h-20 mx-auto mb-6 bg-[rgb(var(--warning))]/20 rounded-full flex items-center justify-center">
            <Clock className="w-10 h-10 text-[rgb(var(--warning))]" />
          </div>
          
          <h1 className="font-pixel text-lg text-[rgb(var(--charcoal))] mb-3">
            Menunggu Persetujuan
          </h1>
          
          <p className="text-sm text-[rgb(var(--slate))] mb-6">
            Akun Anda sedang dalam proses review oleh admin. 
            Anda akan dapat login setelah akun disetujui.
          </p>

          <div className="bg-[rgb(var(--warning))]/10 pixel-border p-4 mb-6">
            <p className="text-xs text-[rgb(var(--charcoal))]">
              💡 <strong>Tips:</strong> Hubungi admin kelas untuk mempercepat proses persetujuan.
            </p>
          </div>

          <div className="space-y-3">
            <PixelButton
              variant="outline"
              className="w-full"
              onClick={handleTryAgain}
            >
              <RefreshCw size={16} />
              Coba Login Lagi
            </PixelButton>
            
            <Link href="/">
              <PixelButton variant="mint" className="w-full">
                Kembali ke Beranda
              </PixelButton>
            </Link>
          </div>
        </PixelCard>
      </div>
    );
  }

  // Tampilan jika status rejected
  if (isRejected) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-[rgb(var(--cream))] to-[rgb(var(--lavender))]">
        <PixelCard className="w-full max-w-md p-8 text-center" hover={false}>
          <div className="w-20 h-20 mx-auto mb-6 bg-[rgb(var(--error))]/20 rounded-full flex items-center justify-center">
            <XCircle className="w-10 h-10 text-[rgb(var(--error))]" />
          </div>
          
          <h1 className="font-pixel text-lg text-[rgb(var(--charcoal))] mb-3">
            Pendaftaran Ditolak
          </h1>
          
          <p className="text-sm text-[rgb(var(--slate))] mb-4">
            Maaf, pendaftaran akun Anda telah ditolak oleh admin.
          </p>

          {rejectedReason && (
            <div className="bg-[rgb(var(--error))]/10 pixel-border p-4 mb-6 text-left">
              <p className="text-xs font-pixel text-[rgb(var(--charcoal))] mb-1">Alasan:</p>
              <p className="text-sm text-[rgb(var(--slate))]">{rejectedReason}</p>
            </div>
          )}

          <div className="space-y-3">
            <Link href="/portal/enroll">
              <PixelButton variant="mint" className="w-full">
                Daftar Ulang
              </PixelButton>
            </Link>
            
            <PixelButton
              variant="outline"
              className="w-full"
              onClick={handleTryAgain}
            >
              Coba Login Lagi
            </PixelButton>
            
            <Link href="/" className="block">
              <span className="text-xs text-[rgb(var(--slate))] hover:text-[rgb(var(--charcoal))]">
                ← Kembali ke Beranda
              </span>
            </Link>
          </div>
        </PixelCard>
      </div>
    );
  }

  // Tampilan form login normal
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-[rgb(var(--cream))] to-[rgb(var(--lavender))]">
      {/* Subtle pixel decorations */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[rgb(var(--mint))]" />
        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-[rgb(var(--peach))]" />
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-[rgb(var(--blush))]" />
      </div>

      <PixelCard className="w-full max-w-md p-8" hover={false}>
        <div className="text-center mb-8">
          <h1 className="font-pixel text-lg text-[rgb(var(--charcoal))]">
            Login Admin
          </h1>
          <p className="text-sm text-[rgb(var(--slate))] mt-2">
            Masuk ke dashboard administrasi
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="font-pixel text-xs">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[rgb(var(--slate))]" />
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                className="pl-10 pixel-border"
                {...register('email')}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-[rgb(var(--error))]">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="font-pixel text-xs">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[rgb(var(--slate))]" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="pl-10 pr-10 pixel-border"
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgb(var(--slate))] hover:text-[rgb(var(--charcoal))]"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-[rgb(var(--error))]">{errors.password.message}</p>
            )}
          </div>

          {loginError && (
            <div className="p-3 bg-[rgb(var(--error))]/20 pixel-border text-sm text-[rgb(var(--charcoal))]">
              Login gagal. Periksa email dan password Anda.
            </div>
          )}

          <PixelButton
            type="submit"
            variant="mint"
            className="w-full"
            isLoading={isLoginLoading}
          >
            Masuk
          </PixelButton>
        </form>

        <div className="mt-6 text-center space-y-2">
          <Link 
            href="/portal/enroll" 
            className="text-xs text-black hover:underline block"
          >
            Belum punya akun? Daftar
          </Link>
          <Link 
            href="/" 
            className="text-xs text-[rgb(var(--slate))] hover:text-[rgb(var(--charcoal))] transition-colors block"
          >
            ← Kembali ke Beranda
          </Link>
        </div>
      </PixelCard>
    </div>
  );
}