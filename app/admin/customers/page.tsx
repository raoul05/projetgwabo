'use client'

import { useState } from 'react'
import { 
  Search, 
  UserCircle,
  Phone,
  MapPin,
  ShoppingBag,
  Calendar
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useData } from '@/contexts/data-context'

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR').format(price)
}

export default function CustomersPage() {
  const { customers, orders } = useData()
  const [searchQuery, setSearchQuery] = useState('')

  const customerList = customers.map(customer => {
    const customerOrders = orders.filter(o => o.customer.phone === customer.phone)
    const totalSpent = customerOrders.reduce((sum, o) => sum + o.total, 0)
    const lastOrder = customerOrders.length > 0
      ? [...customerOrders].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0]
      : null
    
    return {
      ...customer,
      orderCount: customerOrders.length,
      totalSpent,
      lastOrderDate: lastOrder ? lastOrder.createdAt : null,
    }
  })

  const filteredCustomers = customerList.filter(customer => {
    return (
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery) ||
      customer.district.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  const totalCustomers = customerList.length
  const totalRevenue = customerList.reduce((sum, c) => sum + c.totalSpent, 0)
  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Gestion des clients</h1>
        <p className="text-muted-foreground mt-1">
          {totalCustomers} clients enregistrés
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <UserCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalCustomers}</p>
                <p className="text-sm text-muted-foreground">Clients totaux</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                <ShoppingBag className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatPrice(totalRevenue)}</p>
                <p className="text-sm text-muted-foreground">Revenu total (FCFA)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                <Calendar className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatPrice(Math.round(avgOrderValue))}</p>
                <p className="text-sm text-muted-foreground">Panier moyen (FCFA)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom, téléphone ou quartier..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des clients ({filteredCustomers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Client</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Téléphone</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Quartier</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Commandes</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Total dépensé</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Dernière commande</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary/10 text-primary text-sm">
                            {customer.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{customer.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        {customer.phone}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {customer.district}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline">{customer.orderCount} commandes</Badge>
                    </td>
                    <td className="py-3 px-4 text-sm font-medium">
                      {formatPrice(customer.totalSpent)} FCFA
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {customer.lastOrderDate?.toLocaleDateString('fr-FR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredCustomers.length === 0 && (
            <div className="text-center py-12">
              <UserCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Aucun client trouvé.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
