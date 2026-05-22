'use client'

import { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { Loader2 } from 'lucide-react'

type EmployeeRole = 'admin' | 'accountant' | 'order_manager' | 'delivery_agent' | 'customer_support'

interface ProtectedRouteProps {
  children: ReactNode
  allowedRoles?: EmployeeRole[]
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const router = useRouter()
  const { employee, isEmployeeLoggedIn, isHydrated, hasRole } = useAuth()

  // Wait for hydration
  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Chargement...</p>
        </div>
      </div>
    )
  }

  // Not logged in
  if (!isEmployeeLoggedIn) {
    router.push('/admin/login')
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Redirection vers la connexion...</p>
        </div>
      </div>
    )
  }

  // Check role permissions
  if (allowedRoles && !hasRole(allowedRoles) && employee?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Accès refusé</h1>
          <p className="text-muted-foreground mb-6">
            Vous n&apos;avez pas les permissions nécessaires pour accéder à cette page.
          </p>
          <button
            onClick={() => router.push('/admin')}
            className="text-primary hover:underline text-sm"
          >
            Retour au tableau de bord
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
