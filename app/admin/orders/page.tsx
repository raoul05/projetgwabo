'use client'

import { useState, useEffect } from 'react'
import { 
  Search, 
  Filter, 
  Eye,
  Phone,
  MapPin,
  Clock
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useData } from '@/contexts/data-context'
import { paymentMethods } from '@/lib/data'
import { Order, OrderStatus } from '@/lib/types'

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR').format(price)
}

const statusColors: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  delivering: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

const statusLabels: Record<OrderStatus, string> = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  delivering: 'En livraison',
  delivered: 'Livrée',
  cancelled: 'Annulée',
}

function OrderDetailsDialog({ order }: { order: Order }) {
  const { updateOrderStatus } = useData()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(order.status)
  const paymentMethod = paymentMethods.find(p => p.id === order.paymentMethod)

  // Reset when opened
  useEffect(() => {
    if (isOpen) {
      setSelectedStatus(order.status)
    }
  }, [isOpen, order])

  const handleUpdateStatus = () => {
    updateOrderStatus(order.id, selectedStatus)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Commande {order.id}</span>
            <Badge className={statusColors[order.status]}>
              {statusLabels[order.status]}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Info */}
          <div>
            <h3 className="font-semibold mb-3">Informations client</h3>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Nom:</span>
                <span className="font-medium">{order.customer.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{order.customer.phone}</span>
              </div>
              <div className="flex items-center gap-2 sm:col-span-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{order.customer.address}, {order.customer.district}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Order Items */}
          <div>
            <h3 className="font-semibold mb-3">Produits commandés</h3>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                  <div>
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatPrice(item.product.price)} FCFA x {item.quantity}
                    </p>
                  </div>
                  <span className="font-medium">
                    {formatPrice(item.product.price * item.quantity)} FCFA
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Order Summary */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Sous-total</span>
              <span>{formatPrice(order.subtotal)} FCFA</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Livraison</span>
              <span>{formatPrice(order.deliveryFee)} FCFA</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span>Total</span>
              <span className="text-primary">{formatPrice(order.total)} FCFA</span>
            </div>
          </div>

          <Separator />

          {/* Payment & Date */}
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Mode de paiement:</span>
              <p className="font-medium">{paymentMethod?.icon} {paymentMethod?.name}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Date de commande:</span>
              <p className="font-medium flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {order.createdAt.toLocaleString('fr-FR')}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Select value={selectedStatus} onValueChange={(v) => setSelectedStatus(v as OrderStatus)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="confirmed">Confirmée</SelectItem>
                <SelectItem value="delivering">En livraison</SelectItem>
                <SelectItem value="delivered">Livrée</SelectItem>
                <SelectItem value="cancelled">Annulée</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleUpdateStatus} className="bg-primary hover:bg-primary/90 text-primary-foreground">Mettre à jour</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}


export default function OrdersPage() {
  const { orders } = useData()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.phone.includes(searchQuery)
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const statusCounts = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    delivering: orders.filter(o => o.status === 'delivering').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Gestion des commandes</h1>
        <p className="text-muted-foreground mt-1">
          Gérez et suivez toutes les commandes
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Toutes', value: statusCounts.all, key: 'all' },
          { label: 'En attente', value: statusCounts.pending, key: 'pending' },
          { label: 'Confirmées', value: statusCounts.confirmed, key: 'confirmed' },
          { label: 'En livraison', value: statusCounts.delivering, key: 'delivering' },
          { label: 'Livrées', value: statusCounts.delivered, key: 'delivered' },
          { label: 'Annulées', value: statusCounts.cancelled, key: 'cancelled' },
        ].map((stat) => (
          <Card 
            key={stat.key}
            className={`cursor-pointer transition-colors ${statusFilter === stat.key ? 'ring-2 ring-primary' : ''}`}
            onClick={() => setStatusFilter(stat.key)}
          >
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par ID, client ou téléphone..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="confirmed">Confirmée</SelectItem>
                <SelectItem value="delivering">En livraison</SelectItem>
                <SelectItem value="delivered">Livrée</SelectItem>
                <SelectItem value="cancelled">Annulée</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Commandes ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Client</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Téléphone</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Montant</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Paiement</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Statut</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => {
                  const paymentMethod = paymentMethods.find(p => p.id === order.paymentMethod)
                  return (
                    <tr key={order.id} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="py-3 px-4 text-sm font-medium">{order.id}</td>
                      <td className="py-3 px-4 text-sm">{order.customer.name}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{order.customer.phone}</td>
                      <td className="py-3 px-4 text-sm font-medium">{formatPrice(order.total)} FCFA</td>
                      <td className="py-3 px-4 text-sm">
                        <span>{paymentMethod?.icon}</span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={statusColors[order.status]}>
                          {statusLabels[order.status]}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {order.createdAt.toLocaleDateString('fr-FR')}
                      </td>
                      <td className="py-3 px-4">
                        <OrderDetailsDialog order={order} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Aucune commande trouvée.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
