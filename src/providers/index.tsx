'use client';

import { QueryProvider } from "./query-provider";
import { AuthProvider } from "./auth.provider";
import React from "react";

export function Providers({children}: {children: React.ReactNode}) {
    return (
        <QueryProvider>
            <AuthProvider>
                {children}
            </AuthProvider>
        </QueryProvider>
    );
}