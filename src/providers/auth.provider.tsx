'use client'

import { ReactNode, useContext, createContext, useEffect} from "react";
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
    const {setUser, cleanUser } = useAuthStore();

    const {data: user, isLoading, isError} = useQuery({
        queryKey: ['auth', 'me'],
        queryFn: authApi.getCurrentUser,
        retry: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    useEffect(() => {
        if(user) {
            setUser(user);
        } else if(isError) {
            cleanUser();
        }
    }, [user, isError, setUser]);
    return (
        <AuthContext.Provider value={{ user: user ?? null, isLoading, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuthContext = () => useContext(AuthContext);