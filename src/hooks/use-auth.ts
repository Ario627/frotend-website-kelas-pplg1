'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/store/auth-store';
import { useRouter } from 'next/navigation';
import { toast } from './use-toast';
import type { LoginCredentials, RegistrationData, RegistrationStatus } from '@/types/user.types';
import { useState } from 'react';



interface AuthState {
  pendingApproval: boolean;
  rejectedReason?: string;
  userStatus?: RegistrationStatus;
}

export function useAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { setUser, cleanUser, isHydrated } = useAuthStore();
  const storedUser = useAuthStore((state) => state.user);
  const [authState, setAuthState] = useState<AuthState>({
    pendingApproval: false,
  })

  const { data: user, isLoading, isError } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: authApi.getCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: isHydrated && !!storedUser, // Only fetch if hydrated and has stored user
  })

  const loginMutation = useMutation({
    mutationFn: (credential: LoginCredentials) => authApi.login(credential),
    onSuccess: (data) => {
      const user = data.user;

      if(user?.registrationStatus === 'pending') {
        setAuthState({
          pendingApproval: true,
          userStatus: 'pending',
        });
        toast({
          title: 'Menunggu Persetujuan',
          description: 'Akun Anda sedang menunggu persetujuan dari admin.',
        });
        return;
      }

      if(user?.registrationStatus === 'rejected') {
        setAuthState({
          pendingApproval: false,
          userStatus: 'rejected',
        });
        toast({
          title: 'Akun Ditolak',
          description: 'Silahkan hubungi admin untuk koordinasi lebih lanjut',
          variant: 'destructive',
        });
        return;
      }

      setUser(user!);
      queryClient.setQueryData(['auth', 'me'], user);

      toast({
        title: 'Login Berhasil',
        description: `Selamat datang kembali, ${user?.name}!`,
      });

      if (user?.role === 'admin') {
        router.push('/dashboard');
      } else {
        router.push('/');
      }

    },

    onError: (error: any) => {
      const message = error.response?.data?.message || 'Login gagal';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    },
  });

  const RegistrationMutation = useMutation({
    mutationFn: (data: RegistrationData) => authApi.register(data),
    onSuccess: (data) => {
      if (data.status === 'pending') {
        setAuthState({
          pendingApproval: true,
          userStatus: 'pending',
        });
        toast({
          title: 'Registrasi Berhasil',
          description: 'KetuaKelas1357900Silakan tunggu persetujuan admin.',
        });
      }
      else if (data.status === 'approved' && data.user) {
        setUser(data.user);
        queryClient.setQueryData(['auth', 'me'], data.user);
      }
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Registrasi gagal';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      cleanUser();
      setAuthState({ pendingApproval: false });
      queryClient.clear();
      router.push('/');
      toast({
        title: 'Logout berhasil',
        description: 'Sampai jumpa lagi!',
      });
    },
  });

  const resetAuthState = () => {
    setAuthState({
      pendingApproval: false,
      rejectedReason: undefined,
      userStatus: undefined,
    });
  };

  // Use fetched user or fallback to stored user
  const currentUser = user ?? storedUser;

  return {
    user: currentUser,
    isLoading: !isHydrated || isLoading,
    isAuthenticated: !!currentUser && !isError && currentUser.registrationStatus === 'approved',
    isAdmin: currentUser?.role === 'admin' && currentUser.registrationStatus === 'approved',
    isPending: authState.pendingApproval || authState.userStatus === 'pending',
    isRejected: authState.userStatus === 'rejected',
    rejectedReason: authState.rejectedReason,
    userStatus: currentUser?.registrationStatus || authState.userStatus,
    login: loginMutation.mutate,
    register: RegistrationMutation.mutate,
    logout: logoutMutation.mutate,
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: RegistrationMutation.isPending,
    loginError: loginMutation.error,
    registerError: RegistrationMutation.error,
    resetAuthState,
  };
}

