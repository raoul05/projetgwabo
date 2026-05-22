export type ProductUnit = 'kg' | 'g' | 'L' | 'cl' | 'ml' | 'piece' | 'sachet' | 'plateau' | 'botte'

export interface Product {
  id: string
  name: string
  price: number
  unit: ProductUnit
  image: string
  category: string
  description?: string
  stock: number
  isActive: boolean
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Customer {
  id: string
  name: string
  phone: string
  address: string
  district: string
  gpsLocation?: string
  createdAt: Date
}

export type PaymentMethod = 'orange_money' | 'mtn_money' | 'moov_money' | 'wave' | 'cash'

export type OrderStatus = 'pending' | 'confirmed' | 'delivering' | 'delivered' | 'cancelled'

export interface Order {
  id: string
  customer: Customer
  items: CartItem[]
  subtotal: number
  deliveryFee: number
  total: number
  paymentMethod: PaymentMethod
  status: OrderStatus
  notes?: string
  createdAt: Date
}

export type EmployeeRole = 'admin' | 'accountant' | 'order_manager' | 'delivery_agent' | 'customer_support'

export interface Employee {
  id: string
  name: string
  email: string
  phone: string
  role: EmployeeRole
  isActive: boolean
  createdAt: Date
}

export interface Category {
  id: string
  name: string
  icon: string
  slug: string
}
