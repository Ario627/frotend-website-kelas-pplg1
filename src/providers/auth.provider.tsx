'use client'

import { ReactNode, useContext, createContext, useEffect, useCallback } from "react";
import type { User } from "@/types/user.types";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth-store";
import { authApi } from "@/lib/api/auth";

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoading: false,
    isAuthenticated: false,
});

export function AuthProvider({children}: {children: ReactNode}) {
    const { setUser, cleanUser, isHydrated } = useAuthStore();
    const storedUser = useAuthStore((state) => state.user);

    const { data: user, isLoading, isError } = useQuery({
        queryKey: ['auth', 'me'],
        queryFn: authApi.getCurrentUser,
        retry: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
        // Only run query if store is hydrated and we have a stored user (meaning user was logged in)
        enabled: isHydrated && !!storedUser,
    });

    useEffect(() => {
        if (user) {
            setUser(user);
        } else if (isError && isHydrated) {
            cleanUser();
        }
    }, [user, isError, isHydrated, setUser, cleanUser]);

    return (
        <AuthContext.Provider value={{ user: user ?? storedUser ?? null, isLoading: !isHydrated || isLoading, isAuthenticated: !!(user || storedUser) }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuthContext = () => useContext(AuthContext);