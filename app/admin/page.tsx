'use client'

import { 
  DollarSign, 
  ShoppingCart, 
  Truck, 
  CheckCircle, 
  Users, 
  Package,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useData } from '@/contexts/data-context'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts'

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR').format(price)
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  delivering: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

const statusLabels: Record<string, string> = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  delivering: 'En livraison',
  delivered: 'Livrée',
  cancelled: 'Annulée',
}

export default function AdminDashboard() {
  const { orders, products, customers } = useData()

  // 1. Calculate dynamic statistics with base scaling
  const baseRevenue = 2450000 - 25500 // Base reference minus delivered demo orders
  const totalRevenue = baseRevenue + orders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.total, 0)

  const baseTotalOrders = 156 - 5
  const totalOrdersCount = baseTotalOrders + orders.length

  const baseDeliveredOrders = 138 - 1 // ORD-001 is delivered
  const deliveredOrdersCount = baseDeliveredOrders + orders.filter(o => o.status === 'delivered').length

  const basePendingDeliveries = 12 - 3 // ORD-002, ORD-003, ORD-004 are active
  const pendingDeliveriesCount = Math.max(0, basePendingDeliveries + orders.filter(o => o.status === 'pending' || o.status === 'confirmed' || o.status === 'delivering').length)

  const baseActiveCustomers = 89 - 5
  const activeCustomersCount = baseActiveCustomers + customers.length

  const activeProductsCount = products.filter(p => p.isActive).length

  const statCards = [
    {
      title: 'Revenu total',
      value: `${formatPrice(totalRevenue)} FCFA`,
      icon: DollarSign,
      change: '+12.5%',
      trend: 'up',
    },
    {
      title: 'Commandes totales',
      value: totalOrdersCount,
      icon: ShoppingCart,
      change: '+8.2%',
      trend: 'up',
    },
    {
      title: 'Livraisons en cours',
      value: pendingDeliveriesCount,
      icon: Truck,
      change: '-2',
      trend: 'down',
    },
    {
      title: 'Commandes livrées',
      value: deliveredOrdersCount,
      icon: CheckCircle,
      change: '+15',
      trend: 'up',
    },
    {
      title: 'Clients actifs',
      value: activeCustomersCount,
      icon: Users,
      change: '+5',
      trend: 'up',
    },
    {
      title: 'Produits actifs',
      value: activeProductsCount,
      icon: Package,
      change: '0',
      trend: 'neutral',
    },
  ]

  // 2. Generate dynamic sales chart data
  const baseSales = [
    { month: 'Jan', sales: 180000 },
    { month: 'Fév', sales: 220000 },
    { month: 'Mar', sales: 195000 },
    { month: 'Avr', sales: 280000 },
    { month: 'Mai', sales: 310000 },
    { month: 'Juin', sales: 265000 },
    { month: 'Juil', sales: 340000 },
    { month: 'Août', sales: 295000 },
    { month: 'Sep', sales: 320000 },
    { month: 'Oct', sales: 380000 },
    { month: 'Nov', sales: 420000 },
    { month: 'Déc', sales: 450000 },
  ]

  const salesData = baseSales.map(m => ({ ...m }))
  orders.forEach(order => {
    if (order.status === 'delivered') {
      const date = new Date(order.createdAt)
      const monthIdx = date.getMonth()
      if (monthIdx >= 0 && monthIdx < 12) {
        salesData[monthIdx].sales += order.total
      }
    }
  })

  // 3. Generate dynamic top products
  const productSalesMap = new Map<string, { sales: number; revenue: number }>()
  const baseTopProducts = [
    { name: 'Riz local', sales: 45, revenue: 54000 },
    { name: 'Poulet entier', sales: 38, revenue: 133000 },
    { name: 'Huile végétale', sales: 32, revenue: 64000 },
    { name: 'Tomates fraîches', sales: 28, revenue: 14000 },
    { name: 'Attieke', sales: 25, revenue: 12500 },
  ]
  baseTopProducts.forEach(bp => {
    productSalesMap.set(bp.name, { sales: bp.sales, revenue: bp.revenue })
  })

  orders.forEach(order => {
    if (order.status === 'delivered') {
      order.items.forEach(item => {
        const existing = productSalesMap.get(item.product.name) || { sales: 0, revenue: 0 }
        productSalesMap.set(item.product.name, {
          sales: existing.sales + item.quantity,
          revenue: existing.revenue + (item.product.price * item.quantity)
        })
      })
    }
  })

  const topProducts = Array.from(productSalesMap.entries())
    .map(([name, stats]) => ({
      name,
      sales: stats.sales,
      revenue: stats.revenue
    }))
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5)

  const recentOrders = orders.slice(0, 5)

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Tableau de bord</h1>
        <p className="text-muted-foreground mt-1">
          Bienvenue sur le panneau d&apos;administration GWABO
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <div className={`flex items-center text-xs font-medium ${
                  stat.trend === 'up' ? 'text-green-600' : 
                  stat.trend === 'down' ? 'text-red-600' : 'text-muted-foreground'
                }`}>
                  {stat.change}
                  {stat.trend === 'up' && <ArrowUpRight className="h-3 w-3 ml-0.5" />}
                  {stat.trend === 'down' && <ArrowDownRight className="h-3 w-3 ml-0.5" />}
                </div>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Évolution des ventes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value / 1000}k`}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`${formatPrice(value)} FCFA`, 'Ventes']}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#085041" 
                    strokeWidth={2}
                    dot={{ fill: '#085041', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Produits les plus vendus
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProducts} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
                  <XAxis 
                    type="number"
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    type="category"
                    dataKey="name" 
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    width={100}
                  />
                  <Tooltip 
                    formatter={(value: number) => [value, 'Ventes']}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="sales" fill="#1D9E75" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            Commandes récentes
          </CardTitle>
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
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Statut</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="py-3 px-4 text-sm font-medium">{order.id}</td>
                    <td className="py-3 px-4 text-sm">{order.customer.name}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{order.customer.phone}</td>
                    <td className="py-3 px-4 text-sm font-medium">{formatPrice(order.total)} FCFA</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                        {statusLabels[order.status]}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {order.createdAt.toLocaleDateString('fr-FR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
