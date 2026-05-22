import { createClient } from '@/lib/supabase/client'

export interface EmployeeRecord {
  id: string
  name: string
  phone: string
  email: string | null
  role: 'admin' | 'accountant' | 'order_manager' | 'delivery_agent' | 'customer_support'
  is_active: boolean
  pin_hash: string | null
  password_hash: string | null
  created_at: string
}

export async function getEmployees(): Promise<EmployeeRecord[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('employees')
    .select('id, name, phone, email, role, is_active, created_at')
    .order('name')

  if (error) {
    console.error('Error fetching employees:', error)
    return []
  }

  return (data || []) as EmployeeRecord[]
}

export async function getEmployeeById(id: string): Promise<EmployeeRecord | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('employees')
    .select('id, name, phone, email, role, is_active, created_at')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching employee:', error)
    return null
  }

  return data as EmployeeRecord
}

export async function createEmployee(employeeData: {
  name: string
  phone: string
  email?: string
  role: EmployeeRecord['role']
  pin?: string
  password?: string
}): Promise<EmployeeRecord | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('employees')
    .insert({
      name: employeeData.name,
      phone: employeeData.phone,
      email: employeeData.email || null,
      role: employeeData.role,
      is_active: true,
      // In production, hash these server-side
      pin_hash: employeeData.pin || null,
      password_hash: employeeData.password || null,
    })
    .select('id, name, phone, email, role, is_active, created_at')
    .single()

  if (error) {
    console.error('Error creating employee:', error)
    return null
  }

  return data as EmployeeRecord
}

export async function updateEmployee(
  id: string,
  updates: Partial<{
    name: string
    phone: string
    email: string
    role: EmployeeRecord['role']
    is_active: boolean
  }>
): Promise<EmployeeRecord | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('employees')
    .update(updates)
    .eq('id', id)
    .select('id, name, phone, email, role, is_active, created_at')
    .single()

  if (error) {
    console.error('Error updating employee:', error)
    return null
  }

  return data as EmployeeRecord
}

export async function deactivateEmployee(id: string): Promise<boolean> {
  const supabase = createClient()

  const { error } = await supabase
    .from('employees')
    .update({ is_active: false })
    .eq('id', id)

  if (error) {
    console.error('Error deactivating employee:', error)
    return false
  }

  return true
}

export const roleLabels: Record<EmployeeRecord['role'], string> = {
  admin: 'Administrateur',
  accountant: 'Comptable',
  order_manager: 'Gestionnaire de commandes',
  delivery_agent: 'Agent de livraison',
  customer_support: 'Support client',
}
