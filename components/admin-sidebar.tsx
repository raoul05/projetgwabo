'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Warehouse, 
  Users, 
  UserCircle,
  DollarSign,
  BarChart3,
  Menu,
  LogOut,
  ExternalLink
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'

const sidebarItems = [
  { name: 'Tableau de bord', href: '/admin', icon: LayoutDashboard },
  { name: 'Commandes', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Produits', href: '/admin/products', icon: Package },
  { name: 'Inventaire', href: '/admin/inventory', icon: Warehouse },
  { name: 'Employés', href: '/admin/employees', icon: Users },
  { name: 'Clients', href: '/admin/customers', icon: UserCircle },
  { name: 'Finances', href: '/admin/finance', icon: DollarSign },
  { name: 'Analytiques', href: '/admin/analytics', icon: BarChart3 },
]

const roleLabels: Record<string, string> = {
  admin: 'Administrateur',
  accountant: 'Comptable',
  order_manager: 'Gest. commandes',
  delivery_agent: 'Agent livraison',
  customer_support: 'Support client',
}

function SidebarContent() {
  const pathname = usePathname()
  const router = useRouter()
  const { employee, logoutEmployee } = useAuth()

  const handleLogout = () => {
    logoutEmployee()
    router.push('/admin/login')
  }

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-primary">
            <span className="text-xl font-bold text-sidebar-primary-foreground">G</span>
          </div>
          <div>
            <span className="text-xl font-bold text-sidebar-foreground">GWABO</span>
            <p className="text-xs text-sidebar-foreground/60">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Employee info */}
      {employee && (
        <div className="px-4 py-3 border-b border-sidebar-border">
          <p className="text-sm font-medium text-sidebar-foreground truncate">{employee.name}</p>
          <p className="text-xs text-sidebar-foreground/60">{roleLabels[employee.role] || employee.role}</p>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/admin' && pathname.startsWith(item.href))
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border space-y-1">
        <Link href="/">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
          >
            <ExternalLink className="h-5 w-5 mr-3" />
            Voir le site
          </Button>
        </Link>
        <Button 
          variant="ghost" 
          className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 mr-3" />
          Déconnexion
        </Button>
      </div>
    </div>
  )
}

export function AdminSidebar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 bg-sidebar border-b border-sidebar-border flex items-center px-4">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-sidebar-foreground">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 bg-sidebar border-sidebar-border">
            <SidebarContent />
          </SheetContent>
        </Sheet>
        <div className="flex items-center gap-2 ml-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
            <span className="text-sm font-bold text-sidebar-primary-foreground">G</span>
          </div>
          <span className="font-bold text-sidebar-foreground">GWABO Admin</span>
        </div>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block fixed top-0 left-0 bottom-0 w-64 bg-sidebar border-r border-sidebar-border">
        <SidebarContent />
      </aside>
    </>
  )
}
