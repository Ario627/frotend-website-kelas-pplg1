'use client';

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Eye, EyeOff, Mail, Clock, XCircle, RefreshCw, Lock } from 'lucide-react'
import Link from 'next/link';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { PixelButton } from "@/components/pixel/pixel-button";
import { PixelCard } from "@/components/pixel/pixel-card";
import { zodResolver } from '@hookform/resolvers/zod';
import Image from "next/image";
import Juru from "@/app/(auth)/logos/juru.png";
import { PixelCornerDecoration, PixelStars, PixelFrame } from "@/components/decorations/pixel-decorations";


const logicx = z.object({
  email: z.email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

type LOgicFormData = z.infer<typeof logicx>;

function PixelDecorations() {
  return (
    <>
      {/* Top Left Decorations */}
      <div className="fixed top-0 left-0 w-64 h-64 pointer-events-none overflow-hidden">
        {/* Large pixel block */}
        <div className="absolute top-8 left-8 w-16 h-16 bg-[rgb(var(--mint))]/30 pixel-float" />
        <div className="absolute top-12 left-12 w-8 h-8 bg-[rgb(var(--peach))]/40 pixel-float" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-28 left-6 w-6 h-6 bg-[rgb(var(--blush))]/30 pixel-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-20 left-32 w-4 h-4 bg-[rgb(var(--sky))]/50 pixel-float" style={{ animationDelay: '0.3s' }} />
        <div className="absolute top-6 left-40 w-10 h-10 bg-[rgb(var(--lavender))]/40 pixel-float" style={{ animationDelay: '0.7s' }} />
        
        {/* Pixel art stars/sparkles */}
        <div className="absolute top-16 left-24 text-2xl pixel-float" style={{ animationDelay: '0.2s' }}>✦</div>
        <div className="absolute top-32 left-16 text-lg text-[rgb(var(--mint))] pixel-float" style={{ animationDelay: '0.8s' }}>✧</div>
      </div>

      {/* Top Right Decorations */}
      <div className="fixed top-0 right-0 w-64 h-64 pointer-events-none overflow-hidden">
        {/* Large pixel block */}
        <div className="absolute top-10 right-10 w-14 h-14 bg-[rgb(var(--peach))]/30 pixel-float" style={{ animationDelay: '0.4s' }} />
        <div className="absolute top-16 right-20 w-8 h-8 bg-[rgb(var(--mint))]/40 pixel-float" style={{ animationDelay: '0.9s' }} />
        <div className="absolute top-6 right-36 w-6 h-6 bg-[rgb(var(--blush))]/50 pixel-float" style={{ animationDelay: '0.1s' }} />
        <div className="absolute top-28 right-8 w-10 h-10 bg-[rgb(var(--sky))]/30 pixel-float" style={{ animationDelay: '0.6s' }} />
        <div className="absolute top-24 right-28 w-4 h-4 bg-[rgb(var(--lavender))]/60 pixel-float" style={{ animationDelay: '1.2s' }} />
        
        {/* Pixel art stars/sparkles */}
        <div className="absolute top-20 right-16 text-xl text-[rgb(var(--peach))] pixel-float" style={{ animationDelay: '0.3s' }}>✦</div>
        <div className="absolute top-8 right-28 text-lg pixel-float" style={{ animationDelay: '1s' }}>✧</div>
      </div>

      {/* Bottom decorations (optional) */}
      <div className="fixed bottom-0 left-0 w-full h-32 pointer-events-none overflow-hidden">
        <div className="absolute bottom-8 left-1/4 w-4 h-4 bg-[rgb(var(--mint))]/20 pixel-float" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-12 right-1/4 w-6 h-6 bg-[rgb(var(--peach))]/20 pixel-float" style={{ animationDelay: '0.8s' }} />
        <div className="absolute bottom-6 left-1/3 w-3 h-3 bg-[rgb(var(--blush))]/30 pixel-float" style={{ animationDelay: '1.1s' }} />
      </div>
    </>
  );
}

// Pixel Art Character/Mascot (Optional - lebih advance)
function PixelMascot() {
  return (
    <div className="fixed top-20 left-12 pointer-events-none hidden lg:block">
      <div className="relative pixel-float">
        {/* Simple pixel character menggunakan div */}
        <div className="grid grid-cols-5 gap-0.5">
          {/* Row 1 - Hair */}
          <div className="w-3 h-3 bg-transparent" />
          <div className="w-3 h-3 bg-[rgb(var(--charcoal))]/60" />
          <div className="w-3 h-3 bg-[rgb(var(--charcoal))]/60" />
          <div className="w-3 h-3 bg-[rgb(var(--charcoal))]/60" />
          <div className="w-3 h-3 bg-transparent" />
          {/* Row 2 - Hair */}
          <div className="w-3 h-3 bg-[rgb(var(--charcoal))]/60" />
          <div className="w-3 h-3 bg-[rgb(var(--charcoal))]/60" />
          <div className="w-3 h-3 bg-[rgb(var(--charcoal))]/60" />
          <div className="w-3 h-3 bg-[rgb(var(--charcoal))]/60" />
          <div className="w-3 h-3 bg-[rgb(var(--charcoal))]/60" />
          {/* Row 3 - Face */}
          <div className="w-3 h-3 bg-[rgb(var(--peach))]" />
          <div className="w-3 h-3 bg-[rgb(var(--peach))]" />
          <div className="w-3 h-3 bg-[rgb(var(--peach))]" />
          <div className="w-3 h-3 bg-[rgb(var(--peach))]" />
          <div className="w-3 h-3 bg-[rgb(var(--peach))]" />
          {/* Row 4 - Eyes */}
          <div className="w-3 h-3 bg-[rgb(var(--peach))]" />
          <div className="w-3 h-3 bg-[rgb(var(--charcoal))]" />
          <div className="w-3 h-3 bg-[rgb(var(--peach))]" />
          <div className="w-3 h-3 bg-[rgb(var(--charcoal))]" />
          <div className="w-3 h-3 bg-[rgb(var(--peach))]" />
          {/* Row 5 - Mouth */}
          <div className="w-3 h-3 bg-[rgb(var(--peach))]" />
          <div className="w-3 h-3 bg-[rgb(var(--peach))]" />
          <div className="w-3 h-3 bg-[rgb(var(--blush))]" />
          <div className="w-3 h-3 bg-[rgb(var(--peach))]" />
          <div className="w-3 h-3 bg-[rgb(var(--peach))]" />
        </div>
        {/* Speech bubble */}
        <div className="absolute -right-20 top-0 bg-white pixel-border px-2 py-1 text-xs whitespace-nowrap">
          Hai! 👋
        </div>
      </div>
    </div>
  );
}

// Pixel Grid Pattern Background
function PixelGridPattern() {
  return (
    <div className="fixed inset-0 pointer-events-none opacity-[0.03]">
      <div 
        className="w-full h-full"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
        }}
      />
    </div>
  );
}

export default function LoginPage() {
  const {
    user,
    login,
    isLoginLoading,
    isPending,
    isRejected,
    rejectedReason,
    resetAuthState,
    loginError
  } = useAuth();

  useEffect(() => {
    resetAuthState();
  }, []);

  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<LOgicFormData>({ resolver: zodResolver(logicx) });

  const onSubmit = (data: LOgicFormData) => {
    login(data);
  }
  const handleTryAgain = () => {
    resetAuthState();
    reset();
  }

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

  console.log({
  isPending,
  userStatus: user?.regristrationStatus,
  });


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

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-[rgb(var(--cream))] to-[rgb(var(--lavender))]">

      <PixelDecorations />
      <PixelGridPattern />
      <PixelMascot />

      <div className="fixed top-6 left-6 hidden md:block">
        <Link href="/" className="font-pixel text-lg text-[rgb(var(--charcoal))] flex items-center gap-2 pixel-hover p-2">
          <span className="text-[rgb(var(--mint))] text-2xl">✦</span>
          <span>Kelas Kita</span>
        </Link>
      </div>

      {/* Info text di pojok kanan */}
      <div className="fixed top-6 right-6 hidden md:block text-right">
        <p className="text-xs text-[rgb(var(--slate))]">Portal Administrasi</p>
      </div>

      {/* Subtle pixel decorations */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[rgb(var(--mint))]" />
        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-[rgb(var(--peach))]" />
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-[rgb(var(--blush))]" />
      </div>

       

      <PixelCard className="w-full max-w-md p-8" hover={false}>
        <div className="text-center mb-8">
          <h1 className="font-pixel text-lg text-[rgb(var(--charcoal))]">
            Portal Admin
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
            className="w-full cursor-pointer"
            isLoading={isLoginLoading}
          >
            Masuk
          </PixelButton>
        </form>

        {/* Info box */}
        <div className="mt-6 p-3 bg-[rgb(var(--info))]/10 pixel-border">
          <p className="text-xs text-[rgb(var(--slate))]">
            ℹ️ Akun baru memerlukan persetujuan admin sebelum dapat login.
          </p>
        </div>

        <div className="mt-6 text-center space-y-2">
          <Link
            href="/portal/enroll"
            className="text-xs text-[rgb(var(--mint))] hover:underline block"
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
