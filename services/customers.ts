import { createClient } from '@/lib/supabase/client'
import type { Customer } from '@/lib/supabase/types'

interface CustomerFilters {
  search?: string
  limit?: number
  offset?: number
}

export async function getCustomers(filters: CustomerFilters = {}): Promise<Customer[]> {
  const supabase = createClient()

  let query = supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false })

  if (filters.search) {
    query = query.or(
      `name.ilike.%${filters.search}%,phone.ilike.%${filters.search}%,district.ilike.%${filters.search}%`
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
    console.error('Error fetching customers:', error)
    return []
  }

  return data || []
}

export async function getCustomerByPhone(phone: string): Promise<Customer | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('phone', phone)
    .single()

  if (error) {
    return null
  }

  return data
}

export async function getCustomerById(id: string): Promise<Customer | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching customer:', error)
    return null
  }

  return data
}

export async function createCustomer(customerData: {
  name: string
  phone: string
  district?: string
  address?: string
  gps_location?: string
}): Promise<Customer | null> {
  const supabase = createClient()

  // Check if customer already exists
  const existing = await getCustomerByPhone(customerData.phone)
  if (existing) {
    return existing
  }

  const { data, error } = await supabase
    .from('customers')
    .insert({
      ...customerData,
      total_orders: 0,
      total_spent: 0,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating customer:', error)
    return null
  }

  return data
}

export async function updateCustomer(
  id: string,
  updates: Partial<{
    name: string
    phone: string
    email: string
    district: string
    address: string
    gps_location: string
  }>
): Promise<Customer | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('customers')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating customer:', error)
    return null
  }

  return data
}

export async function getCustomerCount(): Promise<number> {
  const supabase = createClient()

  const { count, error } = await supabase
    .from('customers')
    .select('*', { count: 'exact', head: true })

  if (error) {
    console.error('Error counting customers:', error)
    return 0
  }

  return count || 0
}
