import { createClient } from '@/lib/supabase/client'

export interface DashboardStats {
  totalRevenue: number
  totalOrders: number
  pendingDeliveries: number
  deliveredOrders: number
  activeCustomers: number
  activeProducts: number
}

export interface SalesDataPoint {
  month: string
  sales: number
}

export interface TopProduct {
  name: string
  sales: number
  revenue: number
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = createClient()

  try {
    // Get order stats
    const { data: orders } = await supabase
      .from('orders')
      .select('status, total')

    const totalRevenue = orders?.reduce((sum, o) => sum + Number(o.total), 0) || 0
    const totalOrders = orders?.length || 0
    const pendingDeliveries = orders?.filter(o => ['pending', 'confirmed', 'delivering'].includes(o.status)).length || 0
    const deliveredOrders = orders?.filter(o => o.status === 'delivered').length || 0

    // Get customer count
    const { count: customerCount } = await supabase
      .from('customers')
      .select('*', { count: 'exact', head: true })

    // Get active product count
    const { count: productCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('is_available', true)

    return {
      totalRevenue,
      totalOrders,
      pendingDeliveries,
      deliveredOrders,
      activeCustomers: customerCount || 0,
      activeProducts: productCount || 0,
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return {
      totalRevenue: 0,
      totalOrders: 0,
      pendingDeliveries: 0,
      deliveredOrders: 0,
      activeCustomers: 0,
      activeProducts: 0,
    }
  }
}

export async function getSalesData(): Promise<SalesDataPoint[]> {
  const supabase = createClient()

  try {
    const { data: orders } = await supabase
      .from('orders')
      .select('total, created_at')
      .not('status', 'eq', 'cancelled')
      .order('created_at')

    if (!orders || orders.length === 0) return []

    // Group by month
    const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc']
    const salesByMonth: Record<string, number> = {}

    orders.forEach(order => {
      const date = new Date(order.created_at)
      const key = `${date.getFullYear()}-${date.getMonth()}`
      const label = monthNames[date.getMonth()]
      if (!salesByMonth[key]) {
        salesByMonth[key] = 0
      }
      salesByMonth[key] += Number(order.total)
    })

    return Object.entries(salesByMonth).map(([key, sales]) => {
      const month = parseInt(key.split('-')[1])
      return {
        month: monthNames[month],
        sales,
      }
    })
  } catch (error) {
    console.error('Error fetching sales data:', error)
    return []
  }
}

export async function getTopProducts(limit = 5): Promise<TopProduct[]> {
  const supabase = createClient()

  try {
    const { data: items } = await supabase
      .from('order_items')
      .select('product_name, quantity, total_price')

    if (!items || items.length === 0) return []

    // Aggregate by product name
    const productStats: Record<string, { sales: number; revenue: number }> = {}

    items.forEach(item => {
      if (!productStats[item.product_name]) {
        productStats[item.product_name] = { sales: 0, revenue: 0 }
      }
      productStats[item.product_name].sales += item.quantity
      productStats[item.product_name].revenue += Number(item.total_price)
    })

    return Object.entries(productStats)
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, limit)
  } catch (error) {
    console.error('Error fetching top products:', error)
    return []
  }
}

export async function getRevenueByPaymentMethod(): Promise<{ method: string; revenue: number }[]> {
  const supabase = createClient()

  try {
    const { data: orders } = await supabase
      .from('orders')
      .select('payment_method, total')
      .eq('status', 'delivered')

    if (!orders) return []

    const revenueByMethod: Record<string, number> = {}

    orders.forEach(order => {
      if (!revenueByMethod[order.payment_method]) {
        revenueByMethod[order.payment_method] = 0
      }
      revenueByMethod[order.payment_method] += Number(order.total)
    })

    const methodLabels: Record<string, string> = {
      orange_money: 'Orange Money',
      mtn_money: 'MTN Money',
      moov_money: 'Moov Money',
      wave: 'Wave',
      cash: 'Espèces',
    }

    return Object.entries(revenueByMethod).map(([method, revenue]) => ({
      method: methodLabels[method] || method,
      revenue,
    }))
  } catch (error) {
    console.error('Error fetching revenue by payment method:', error)
    return []
  }
}
