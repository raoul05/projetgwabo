import { createClient } from '@/lib/supabase/client'
import type { Order } from '@/lib/supabase/types'

interface OrderFilters {
  status?: string
  search?: string
  limit?: number
  offset?: number
  customerPhone?: string
}

export async function getOrders(filters: OrderFilters = {}): Promise<Order[]> {
  const supabase = createClient()

  let query = supabase
    .from('orders')
    .select('*, items:order_items(*)')
    .order('created_at', { ascending: false })

  if (filters.status && filters.status !== 'all') {
    query = query.eq('status', filters.status)
  }

  if (filters.customerPhone) {
    query = query.eq('customer_phone', filters.customerPhone)
  }

  if (filters.search) {
    query = query.or(
      `order_number.ilike.%${filters.search}%,customer_name.ilike.%${filters.search}%,customer_phone.ilike.%${filters.search}%`
    )
  }

  if (filters.limit) {
    query = query.limit(filters.limit)
  }

  if (filters.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 50) - 1)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching orders:', error)
    return []
  }

  return data || []
}

export async function getOrderById(id: string): Promise<Order | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('orders')
    .select('*, items:order_items(*)')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching order:', error)
    return null
  }

  return data
}

export async function updateOrderStatus(
  id: string, 
  status: Order['status']
): Promise<boolean> {
  const supabase = createClient()

  const { error } = await supabase
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) {
    console.error('Error updating order status:', error)
    return false
  }

  return true
}

export async function getOrdersByCustomer(phone: string): Promise<Order[]> {
  return getOrders({ customerPhone: phone })
}

export async function getOrderStats(): Promise<{
  total: number
  pending: number
  confirmed: number
  delivering: number
  delivered: number
  cancelled: number
}> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('orders')
    .select('status')

  if (error || !data) {
    return { total: 0, pending: 0, confirmed: 0, delivering: 0, delivered: 0, cancelled: 0 }
  }

  return {
    total: data.length,
    pending: data.filter(o => o.status === 'pending').length,
    confirmed: data.filter(o => o.status === 'confirmed').length,
    delivering: data.filter(o => o.status === 'delivering').length,
    delivered: data.filter(o => o.status === 'delivered').length,
    cancelled: data.filter(o => o.status === 'cancelled').length,
  }
}
