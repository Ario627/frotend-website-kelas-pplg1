'use client';

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { PixelCard } from "@/components/pixel/pixel-card";
import { PixelButton } from "@/components/pixel/pixel-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterFormData } from "@/lib/validators/auth.schema";
import { Eye, EyeOff, Lock, Mail, User, Key, Clock, CheckCircle } from 'lucide-react';

export default function RegisterPage() {
  const {
    register: registerUser,
    isRegisterLoading,
    isPending,
    registerError,
    resetAuthState
  } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormData) => {
    registerUser({
      email: data.email,
      password: data.password,
      name: data.name,
      secertCode: data.secretCode,
    }, {
      onSuccess: () => {
        setRegistrationComplete(true);
      }
    });
  };

  const handleRegisterAnother = () => {
    resetAuthState();
    setRegistrationComplete(false);
    reset();
  }

  if (isPending || registrationComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-[rgb(var(--cream))] to-[rgb(var(--lavender))]">
        <PixelCard className="w-full max-w-md p-8 text-center" hover={false}>
          <div className="w-20 h-20 mx-auto mb-6 bg-[rgb(var(--success))]/20 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-[rgb(var(--success))]" />
          </div>

          <h1 className="font-pixel text-lg text-[rgb(var(--charcoal))] mb-3">
            Pendaftaran Berhasil! 🎉
          </h1>

          <p className="text-sm text-[rgb(var(--slate))] mb-6">
            Akun Anda telah berhasil dibuat dan sedang menunggu persetujuan dari admin.
          </p>

          <div className="bg-[rgb(var(--warning))]/10 pixel-border p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-[rgb(var(--warning))]" />
              <span className="font-pixel text-xs text-[rgb(var(--charcoal))]">Status: Menunggu</span>
            </div>
            <p className="text-xs text-[rgb(var(--slate))]">
              Anda akan menerima notifikasi atau dapat mencoba login setelah akun disetujui.
            </p>
          </div>

          <div className="space-y-3">
            <Link href="/portal/gate">
              <PixelButton variant="mint" className="w-full">
                Coba Login
              </PixelButton>
            </Link>

            <Link href="/">
              <PixelButton variant="outline" className="w-full">
                Kembali ke Beranda
              </PixelButton>
            </Link>
          </div>

          <p className="text-xs text-[rgb(var(--slate))] mt-6">
            💡 Hubungi admin kelas untuk mempercepat proses persetujuan
          </p>
        </PixelCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Subtle pixel decorations */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[rgb(var(--mint))]" />
        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-[rgb(var(--peach))]" />
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-[rgb(var(--blush))]" />
        <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-[rgb(var(--sky))]" />
      </div>

      <PixelCard className="w-full max-w-md p-8" hover={false}>
        <div className="text-center mb-8">
          <h1 className="font-pixel text-lg text-[rgb(var(--charcoal))]">
            Pendaftaran Admin
          </h1>
          <p className="text-sm text-[rgb(var(--slate))] mt-2">
            Daftar untuk orang yang terpilih
          </p>
        </div>

        {/* Info Banner */}
        <div className="bg-[rgb(var(--info))]/10 pixel-border p-3 mb-6">
          <p className="text-xs text-[rgb(var(--charcoal))]">
            ⚠️ <strong>Perhatian:</strong> Pendaftaran memerlukan persetujuan admin sebelum dapat login.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name" className="font-pixel text-xs">
              Nama Lengkap
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[rgb(var(--slate))]" />
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                className="pl-10 pixel-border"
                {...register('name')}
              />
            </div>
            {errors.name && (
              <p className="text-xs text-[rgb(var(--error))]">{errors.name.message}</p>
            )}
          </div>

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

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="font-pixel text-xs">
              Konfirmasi Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[rgb(var(--slate))]" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="pl-10 pr-10 pixel-border"
                {...register('confirmPassword')}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgb(var(--slate))] hover:text-[rgb(var(--charcoal))]"
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-[rgb(var(--error))]">{errors.confirmPassword.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="secretCode" className="font-pixel text-xs">
              Kode Rahasia (Opsional)
            </Label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[rgb(var(--slate))]" />
              <Input
                id="secretCode"
                type="password"
                placeholder="Kode dari admin"
                className="pl-10 pixel-border"
                {...register('secretCode')}
              />
            </div>
            <p className="text-xs text-[rgb(var(--slate))]">
              Dengan kode rahasia, akun dapat langsung disetujui
            </p>
          </div>

          {registerError && (
            <div className="p-3 bg-[rgb(var(--error))]/20 pixel-border text-sm text-[rgb(var(--charcoal))]">
              Pendaftaran gagal. Silakan coba lagi.
            </div>
          )}

          <PixelButton
            type="submit"
            variant="mint"
            className="w-full"
            isLoading={isRegisterLoading}
          >
            Daftar
          </PixelButton>
        </form>

        <div className="mt-6 text-center space-y-2">
          <Link
            href="/portal/gate"
            className="text-xs text-[rgb(var(--mint))] hover:underline block"
          >
            Sudah punya akun? Masuk
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
  )
}
