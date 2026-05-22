export type Category = {
  id: string
  name: string
  slug: string
  icon: string | null
  created_at: string
}

export type Product = {
  id: string
  name: string
  description: string | null
  price: number
  unit: string
  image: string | null
  images: string[]
  video_url: string | null
  category_id: string | null
  stock: number
  is_available: boolean
  origin: string | null
  created_at: string
  updated_at: string
  category?: Category
}

export type Customer = {
  id: string
  name: string
  phone: string
  email: string | null
  district: string | null
  address: string | null
  gps_location: string | null
  total_orders: number
  total_spent: number
  created_at: string
}

export type Order = {
  id: string
  order_number: string
  customer_id: string | null
  customer_name: string
  customer_phone: string
  district: string
  address: string | null
  gps_location: string | null
  subtotal: number
  delivery_fee: number
  total: number
  payment_method: string
  status: 'pending' | 'confirmed' | 'preparing' | 'delivering' | 'delivered' | 'cancelled'
  notes: string | null
  created_at: string
  updated_at: string
  items?: OrderItem[]
}

export type OrderItem = {
  id: string
  order_id: string
  product_id: string | null
  product_name: string
  quantity: number
  unit_price: number
  total_price: number
  created_at: string
}

export type Employee = {
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
