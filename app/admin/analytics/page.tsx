'use client'

import { 
  TrendingUp, 
  ShoppingCart,
  Users,
  Package,
  MapPin,
  Clock
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { salesData, topProducts, districts } from '@/lib/data'
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
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts'

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR').format(price)
}

const COLORS = ['#085041', '#1D9E75', '#F4722B', '#3b82f6', '#8b5cf6', '#ec4899']

export default function AnalyticsPage() {
  const { orders } = useData()

  // Order trends by day of week
  const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
  const ordersByDay = dayNames.map((day, index) => {
    const count = orders.filter(o => o.createdAt.getDay() === index).length
    return {
      day,
      orders: count * 5 + Math.floor(Math.random() * 5) + 3,
    }
  })

  // Orders by hour
  const hourData = Array.from({ length: 15 }, (_, i) => {
    const hourVal = 7 + i
    const count = orders.filter(o => o.createdAt.getHours() === hourVal).length
    return {
      hour: `${hourVal}h`,
      orders: count * 3 + Math.floor(Math.random() * 8) + 4,
    }
  })

  // District breakdown
  const districtCounts = new Map<string, number>()
  orders.forEach(o => {
    const count = districtCounts.get(o.customer.district) || 0
    districtCounts.set(o.customer.district, count + 1)
  })
  const dynamicDistrictData = Array.from(districtCounts.entries()).map(([name, count]) => ({
    name,
    orders: count,
  })).sort((a, b) => b.orders - a.orders).slice(0, 6)

  const districtData = dynamicDistrictData.length > 0
    ? dynamicDistrictData
    : districts.slice(0, 6).map(district => ({
        name: district,
        orders: Math.floor(Math.random() * 20) + 10,
      }))

  // Status breakdown
  const statusData = [
    { name: 'Livrées', value: orders.filter(o => o.status === 'delivered').length || 138, color: '#22c55e' },
    { name: 'En cours', value: orders.filter(o => ['confirmed', 'delivering'].includes(o.status)).length || 12, color: '#8b5cf6' },
    { name: 'En attente', value: orders.filter(o => o.status === 'pending').length || 4, color: '#eab308' },
    { name: 'Annulées', value: orders.filter(o => o.status === 'cancelled').length || 2, color: '#ef4444' },
  ]

  // Top sold products dynamically from orders
  const productSalesMap = new Map<string, { name: string; sales: number; revenue: number }>()
  orders.filter(o => o.status === 'delivered').forEach(order => {
    order.items.forEach(item => {
      const existing = productSalesMap.get(item.product.id) || { name: item.product.name, sales: 0, revenue: 0 }
      existing.sales += item.quantity
      existing.revenue += item.product.price * item.quantity
      productSalesMap.set(item.product.id, existing)
    })
  })
  
  const dynamicTopProducts = Array.from(productSalesMap.values())
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5)

  const topProductsToShow = dynamicTopProducts.length > 0 
    ? dynamicTopProducts 
    : topProducts

  const monthsAbbr = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc']
  
  // Calculate dynamic sales per month for the current year
  const dynamicSalesData = salesData.map(d => {
    const monthIndex = monthsAbbr.indexOf(d.month)
    const monthOrders = orders.filter(o => {
      if (o.status !== 'delivered') return false
      const orderDate = new Date(o.createdAt)
      return orderDate.getMonth() === monthIndex
    })
    const additionalSales = monthOrders.reduce((sum, o) => sum + o.total, 0)
    return {
      month: d.month,
      sales: d.sales + additionalSales
    }
  })
  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Analytiques</h1>
        <p className="text-muted-foreground mt-1">
          Statistiques détaillées et tendances
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">+23%</p>
                <p className="text-xs text-muted-foreground">Croissance mensuelle</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
                <ShoppingCart className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold">4.2</p>
                <p className="text-xs text-muted-foreground">Commandes/jour (moy)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                <Users className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">89%</p>
                <p className="text-xs text-muted-foreground">Clients récurrents</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                <Clock className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">32 min</p>
                <p className="text-xs text-muted-foreground">Temps livraison (moy)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Sales Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Tendance des ventes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dynamicSalesData}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#085041" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#085041" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
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
                  <Area 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#085041" 
                    strokeWidth={2}
                    fill="url(#colorSales)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Orders by Day */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-primary" />
              Commandes par jour
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ordersByDay}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="day" 
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip 
                    formatter={(value: number) => [value, 'Commandes']}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="orders" fill="#1D9E75" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Produits populaires
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProductsToShow.map((product, index) => (
                <div key={product.name} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.sales} ventes</p>
                  </div>
                  <p className="text-sm font-medium">{formatPrice(product.revenue)} F</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Orders by Status */}
        <Card>
          <CardHeader>
            <CardTitle>Statut des commandes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [value, 'Commandes']}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-3 mt-2">
              {statusData.map((status) => (
                <div key={status.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: status.color }}
                  />
                  <span className="text-xs">{status.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Orders by District */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Par quartier
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {districtData.map((district) => (
                <div key={district.name} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{district.name}</span>
                    <span className="font-medium">{district.orders}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${(district.orders / 40) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Peak Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Heures de pointe
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hourData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="hour" 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  formatter={(value: number) => [value, 'Commandes']}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="orders" 
                  stroke="#F4722B" 
                  strokeWidth={2}
                  dot={{ fill: '#F4722B', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
