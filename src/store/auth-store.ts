import type { User, RegistrationResponse } from "@/types/user.types";
import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  isHydrated: boolean;
  pendingApprovalEmail: string | null;
  setUser: (user: User) => void;
  cleanUser: () => void;
  setHydrated: (state: boolean) => void;
  setPendingApprovalEmail: (email: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isHydrated: false,
      pendingApprovalEmail: null,
      setUser: (user) => set({ user, pendingApprovalEmail: null }),
      cleanUser: () => set({ user: null }),
      setHydrated: (value) => set({ isHydrated: value }),
      setPendingApprovalEmail: (email) => set({ pendingApprovalEmail: email }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
      partialize: (state) => ({
        user: state.user ? {
          id: state.user.id,
          name: state.user.name,
          role: state.user.role,
        } : null,
        pendingApprovalEmail: state.pendingApprovalEmail,
      })
    }
  )
)
