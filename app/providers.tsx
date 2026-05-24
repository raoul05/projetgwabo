'use client'

import { CartProvider } from '@/lib/cart-context'
import { DataProvider } from '@/contexts/data-context'
import { AuthProvider } from '@/contexts/auth-context'

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <DataProvider>
                <CartProvider>
                    {children}
                </CartProvider>
            </DataProvider>
        </AuthProvider>
    )
}