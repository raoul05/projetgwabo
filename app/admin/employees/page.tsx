'use client'

import { useState, useEffect } from 'react'
import { 
  Search, 
  Plus,
  Edit2,
  UserCircle,
  Mail,
  Phone,
  Shield
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useData } from '@/contexts/data-context'
import { Employee, EmployeeRole } from '@/lib/types'

const roleLabels: Record<EmployeeRole, string> = {
  admin: 'Administrateur',
  accountant: 'Comptable',
  order_manager: 'Gestionnaire commandes',
  delivery_agent: 'Livreur',
  customer_support: 'Support client',
}

const roleColors: Record<EmployeeRole, string> = {
  admin: 'bg-red-100 text-red-800',
  accountant: 'bg-blue-100 text-blue-800',
  order_manager: 'bg-purple-100 text-purple-800',
  delivery_agent: 'bg-green-100 text-green-800',
  customer_support: 'bg-yellow-100 text-yellow-800',
}

function EmployeeFormDialog({ employee, trigger }: { employee?: Employee, trigger: React.ReactNode }) {
  const { addEmployee, updateEmployee } = useData()
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: employee?.name || '',
    email: employee?.email || '',
    phone: employee?.phone || '',
    role: employee?.role || 'customer_support',
    isActive: employee?.isActive ?? true,
  })

  // Reset when dialog opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: employee?.name || '',
        email: employee?.email || '',
        phone: employee?.phone || '',
        role: employee?.role || 'customer_support',
        isActive: employee?.isActive ?? true,
      })
    }
  }, [isOpen, employee])

  const handleSubmit = () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) return

    const employeeData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: formData.role as EmployeeRole,
      isActive: formData.isActive,
    }

    if (employee) {
      updateEmployee(employee.id, employeeData)
    } else {
      addEmployee(employeeData)
    }
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{employee ? 'Modifier l\'employé' : 'Ajouter un employé'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom complet</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Kouamé Jean"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="jean@gwabo.ci"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+225 07 XX XX XX"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Rôle</Label>
            <Select value={formData.role} onValueChange={(v) => setFormData({ ...formData, role: v as EmployeeRole })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(roleLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="active">Employé actif</Label>
            <Switch
              id="active"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleSubmit} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
              {employee ? 'Enregistrer' : 'Ajouter'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function EmployeesPage() {
  const { employees } = useData()
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = 
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === 'all' || emp.role === roleFilter
    return matchesSearch && matchesRole
  })

  const activeCount = employees.filter(e => e.isActive).length

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Gestion des employés</h1>
          <p className="text-muted-foreground mt-1">
            {activeCount} employés actifs sur {employees.length}
          </p>
        </div>
        <EmployeeFormDialog 
          trigger={
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un employé
            </Button>
          }
        />
      </div>

      {/* Stats by Role */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {Object.entries(roleLabels).map(([role, label]) => {
          const count = employees.filter(e => e.role === role).length
          return (
            <Card 
              key={role}
              className={`cursor-pointer transition-colors ${roleFilter === role ? 'ring-2 ring-primary' : ''}`}
              onClick={() => setRoleFilter(roleFilter === role ? 'all' : role)}
            >
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold">{count}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom ou email..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Shield className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les rôles</SelectItem>
                {Object.entries(roleLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Employees Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEmployees.map((employee) => (
          <Card key={employee.id} className={!employee.isActive ? 'opacity-60' : ''}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-14 w-14">
                  <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                    {employee.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold truncate">{employee.name}</h3>
                    {!employee.isActive && (
                      <Badge variant="secondary">Inactif</Badge>
                    )}
                  </div>
                  <Badge className={`mt-1 ${roleColors[employee.role]}`}>
                    {roleLabels[employee.role]}
                  </Badge>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{employee.email}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{employee.phone}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t flex gap-2">
                <EmployeeFormDialog
                  employee={employee}
                  trigger={
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit2 className="h-4 w-4 mr-1" />
                      Modifier
                    </Button>
                  }
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEmployees.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <UserCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Aucun employé trouvé.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
