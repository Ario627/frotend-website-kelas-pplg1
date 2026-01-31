'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/store/auth-store';
import { useRouter } from 'next/navigation';
import { toast } from './use-toast';
import type { LoginCredentials, RegistrationData, RegristrationStatus } from '@/types/user.types';
import { useState } from 'react';



interface AuthState {
  pendingApproval: boolean;
  rejectedReason?: string;
  userStatus?: RegristrationStatus;
}

export function useAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { setUser, cleanUser } = useAuthStore();
  const [authState, setAuthState] = useState<AuthState>({
    pendingApproval: false,
  })

  const { data: user, isLoading, isError } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: authApi.getCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: false
  })

  const loginMutation = useMutation({
    mutationFn: (credential: LoginCredentials) => authApi.login(credential),
    onSuccess: (data) => {
      if (data.status === 'pending') {
        setAuthState({
          pendingApproval: true,
          userStatus: 'pending',
        });
        toast({
          title: 'Menunggu Persetujuan',
          description: 'Sabar ya lagi di cek',
        });
      }
      else if (data.status === 'rejected') {
        setAuthState({
          pendingApproval: false,
          userStatus: 'rejected',
          rejectedReason: data.message,
        });
        toast({
          title: 'Akun ditolak',
          description: data.message,
          variant: 'destructive',
        });
      }
      else if (data.status === 'approved' && data.user) {
        setUser(data.user);
        queryClient.setQueryData(['auth', 'me'], data.user);
        toast({
          title: 'Login berhasil',
          description: `Selamat atas diterimanya, ${data.user.name}`
        });
        router.push('/dashboard');
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
          description: 'Silakan tunggu persetujuan admin.',
        });
      }
      else if (data.status === 'approved' && data.user) {
        setUser(data.user);
        queryClient.setQueryData(['auth', 'me'], data.user);
        router.push('/dashboard');
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

  return {
    user,
    isLoading,
    isAuthenticated: !!user && !isError && user.regristrationStatus === 'approved',
    isAdmin: user?.role === 'admin' && user.regristrationStatus === 'approved',
    isPending: authState.pendingApproval || authState.userStatus === 'pending',
    isRejected: authState.userStatus === 'rejected',
    rejectedReason: authState.rejectedReason,
    userStatus: user?.regristrationStatus || authState.userStatus,
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

