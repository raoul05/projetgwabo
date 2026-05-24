'use client'

import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { AdminSidebar } from '@/components/admin-sidebar'
import { ProtectedRoute } from '@/components/protected-route'

export default function AdminClientLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname()

    if (pathname === '/admin/login') {
        return <>{children}</>
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-background flex">
                <AdminSidebar />

                <main className="flex-1 lg:ml-64 pt-16 lg:pt-0 min-h-screen">
                    {children}
                </main>
            </div>
        </ProtectedRoute>
    )
}