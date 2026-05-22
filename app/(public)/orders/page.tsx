'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, 
  ShoppingBag, 
  Clock, 
  ChevronDown,
  ChevronUp,
  Phone,
  MapPin,
  Package
} from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { demoOrders, paymentMethods } from '@/lib/data'
import { OrderStatus } from '@/lib/types'

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR').format(price)
}

const statusColors: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
  delivering: 'bg-purple-100 text-purple-800 border-purple-200',
  delivered: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
}

const statusLabels: Record<OrderStatus, string> = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  delivering: 'En livraison',
  delivered: 'Livrée',
  cancelled: 'Annulée',
}

const statusIcons: Record<OrderStatus, string> = {
  pending: '⏳',
  confirmed: '✅',
  delivering: '🚚',
  delivered: '📦',
  cancelled: '❌',
}

export default function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)

  // In production, fetch from API based on customer phone
  const orders = demoOrders

  const filteredOrders = orders.filter(order => {
    if (statusFilter === 'all') return true
    return order.status === statusFilter
  })

  const toggleExpand = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Link href="/profile" className="inline-flex items-center text-primary hover:underline mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour au profil
        </Link>

        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Mes commandes</h1>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes ({orders.length})</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="confirmed">Confirmées</SelectItem>
                <SelectItem value="delivering">En livraison</SelectItem>
                <SelectItem value="delivered">Livrées</SelectItem>
                <SelectItem value="cancelled">Annulées</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="h-10 w-10 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">Aucune commande</h2>
              <p className="text-muted-foreground mb-6">
                {statusFilter !== 'all' 
                  ? 'Aucune commande avec ce statut.' 
                  : 'Vous n\'avez pas encore passé de commande.'}
              </p>
              <Link href="/">
                <Button className="bg-primary hover:bg-primary/90">
                  Commencer à acheter
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const isExpanded = expandedOrder === order.id
                const paymentMethod = paymentMethods.find(p => p.id === order.paymentMethod)

                return (
                  <Card key={order.id} className="overflow-hidden">
                    {/* Order Header */}
                    <button
                      onClick={() => toggleExpand(order.id)}
                      className="w-full text-left"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-foreground">{order.id}</span>
                              <Badge className={`${statusColors[order.status]} border`}>
                                {statusIcons[order.status]} {statusLabels[order.status]}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {order.createdAt.toLocaleDateString('fr-FR', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </span>
                              <span className="font-semibold text-foreground">
                                {formatPrice(order.total)} FCFA
                              </span>
                            </div>
                          </div>
                          <div className="text-muted-foreground">
                            {isExpanded ? (
                              <ChevronUp className="h-5 w-5" />
                            ) : (
                              <ChevronDown className="h-5 w-5" />
                            )}
                          </div>
                        </div>
                      </CardHeader>
                    </button>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <CardContent className="pt-0">
                        <Separator className="mb-4" />
                        
                        {/* Order Items */}
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                            <Package className="h-4 w-4" />
                            Produits commandés
                          </h4>
                          <div className="space-y-2">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex justify-between items-center text-sm py-2 border-b last:border-0">
                                <div>
                                  <span className="font-medium">{item.product.name}</span>
                                  <span className="text-muted-foreground ml-2">x{item.quantity}</span>
                                </div>
                                <span className="font-medium">
                                  {formatPrice(item.product.price * item.quantity)} FCFA
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Totals */}
                        <div className="bg-muted/50 rounded-lg p-4 mb-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">Sous-total</span>
                            <span>{formatPrice(order.subtotal)} FCFA</span>
                          </div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-muted-foreground">Livraison</span>
                            <span>{formatPrice(order.deliveryFee)} FCFA</span>
                          </div>
                          <Separator className="my-2" />
                          <div className="flex justify-between font-bold">
                            <span>Total</span>
                            <span className="text-primary">{formatPrice(order.total)} FCFA</span>
                          </div>
                        </div>

                        {/* Delivery & Payment Info */}
                        <div className="grid sm:grid-cols-2 gap-4 text-sm">
                          <div className="space-y-2">
                            <h4 className="font-semibold text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              Livraison
                            </h4>
                            <p>{order.customer.address}</p>
                            <p className="text-muted-foreground">{order.customer.district}</p>
                          </div>
                          <div className="space-y-2">
                            <h4 className="font-semibold text-muted-foreground flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              Contact & Paiement
                            </h4>
                            <p>{order.customer.phone}</p>
                            <p className="text-muted-foreground">
                              {paymentMethod?.icon} {paymentMethod?.name}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
