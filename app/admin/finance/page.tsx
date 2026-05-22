'use client'

import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  CreditCard,
  Wallet,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { paymentMethods, salesData } from '@/lib/data'
import { useData } from '@/contexts/data-context'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR').format(price)
}

const COLORS = ['#085041', '#1D9E75', '#F4722B', '#3b82f6', '#8b5cf6']

export default function FinancePage() {
  const { orders } = useData()

  // Calculate financial data
  const totalRevenue = orders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.total, 0)
  const pendingRevenue = orders.filter(o => ['pending', 'confirmed', 'delivering'].includes(o.status)).reduce((sum, o) => sum + o.total, 0)
  const cancelledRevenue = orders.filter(o => o.status === 'cancelled').reduce((sum, o) => sum + o.total, 0)
  const deliveryFees = orders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.deliveryFee, 0)

  // Payment method breakdown
  const paymentBreakdown = paymentMethods.map(method => {
    const methodOrders = orders.filter(o => o.paymentMethod === method.id && o.status === 'delivered')
    return {
      name: method.name,
      value: methodOrders.reduce((sum, o) => sum + o.total, 0),
      count: methodOrders.length,
    }
  }).filter(p => p.value > 0)

  // Recent transactions
  const recentTransactions = orders
    .filter(o => o.status === 'delivered')
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 10)

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
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Finances</h1>
        <p className="text-muted-foreground mt-1">
          Aperçu financier et revenus
        </p>
      </div>

      {/* Financial Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex items-center text-xs font-medium text-green-600">
                +12.5%
                <ArrowUpRight className="h-3 w-3 ml-0.5" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold text-green-600">{formatPrice(totalRevenue)}</p>
              <p className="text-xs text-muted-foreground">Revenu total (FCFA)</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100">
                <Wallet className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold text-yellow-600">{formatPrice(pendingRevenue)}</p>
              <p className="text-xs text-muted-foreground">Revenu en attente (FCFA)</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                <TrendingDown className="h-5 w-5 text-red-600" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold text-red-600">{formatPrice(cancelledRevenue)}</p>
              <p className="text-xs text-muted-foreground">Commandes annulées (FCFA)</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <CreditCard className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold text-blue-600">{formatPrice(deliveryFees)}</p>
              <p className="text-xs text-muted-foreground">Frais de livraison (FCFA)</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Revenus mensuels
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dynamicSalesData}>
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
                    formatter={(value: number) => [`${formatPrice(value)} FCFA`, 'Revenu']}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="sales" fill="#085041" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Modes de paiement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {paymentBreakdown.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`${formatPrice(value)} FCFA`]}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {paymentBreakdown.map((method, index) => (
                <div key={method.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm">{method.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Transactions récentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Client</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Mode paiement</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Montant</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Statut</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((order) => {
                  const payment = paymentMethods.find(p => p.id === order.paymentMethod)
                  return (
                    <tr key={order.id} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="py-3 px-4 text-sm font-medium">{order.id}</td>
                      <td className="py-3 px-4 text-sm">{order.customer.name}</td>
                      <td className="py-3 px-4 text-sm">
                        <span>{payment?.icon} {payment?.name}</span>
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-green-600">
                        +{formatPrice(order.total)} FCFA
                      </td>
                      <td className="py-3 px-4">
                        <Badge className="bg-green-100 text-green-800">Payé</Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {order.createdAt.toLocaleDateString('fr-FR')}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
