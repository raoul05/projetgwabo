'use client'

import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { AdminSidebar } from '@/components/admin-sidebar'
import { ProtectedRoute } from '@/components/protected-route'

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  // Don't wrap login page in ProtectedRoute or sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <AdminSidebar />
        <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  )
}
