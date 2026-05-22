import { createClient } from '@/lib/supabase/client'
import type { Product } from '@/lib/supabase/types'

interface ProductFilters {
  category?: string
  search?: string
  limit?: number
  offset?: number
  onlyAvailable?: boolean
}

export async function getProducts(filters: ProductFilters = {}): Promise<Product[]> {
  const supabase = createClient()
  
  let query = supabase
    .from('products')
    .select('*, category:categories(*)')
    .order('name')

  if (filters.onlyAvailable !== false) {
    query = query.eq('is_available', true)
  }

  if (filters.category) {
    const { data: cat } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', filters.category)
      .single()

    if (cat) {
      query = query.eq('category_id', cat.id)
    }
  }

  if (filters.search) {
    query = query.ilike('name', `%${filters.search}%`)
  }

  if (filters.limit) {
    query = query.limit(filters.limit)
  }

  if (filters.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 50) - 1)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }

  return data || []
}

export async function getProductById(id: string): Promise<Product | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching product:', error)
    return null
  }

  return data
}

export async function createProduct(productData: {
  name: string
  description?: string
  price: number
  unit: string
  category_id?: string
  stock: number
  is_available?: boolean
  images?: string[]
  video_url?: string
}): Promise<Product | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('products')
    .insert({
      ...productData,
      is_available: productData.is_available ?? true,
    })
    .select('*, category:categories(*)')
    .single()

  if (error) {
    console.error('Error creating product:', error)
    return null
  }

  return data
}

export async function updateProduct(
  id: string, 
  updates: Partial<{
    name: string
    description: string
    price: number
    unit: string
    category_id: string
    stock: number
    is_available: boolean
    image: string
    images: string[]
    video_url: string
  }>
): Promise<Product | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('products')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*, category:categories(*)')
    .single()

  if (error) {
    console.error('Error updating product:', error)
    return null
  }

  return data
}

export async function deleteProduct(id: string): Promise<boolean> {
  const supabase = createClient()

  // Soft delete — mark as unavailable
  const { error } = await supabase
    .from('products')
    .update({ is_available: false })
    .eq('id', id)

  if (error) {
    console.error('Error deleting product:', error)
    return false
  }

  return true
}

export async function updateStock(id: string, newStock: number): Promise<boolean> {
  const supabase = createClient()

  const { error } = await supabase
    .from('products')
    .update({ stock: Math.max(0, newStock), updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) {
    console.error('Error updating stock:', error)
    return false
  }

  return true
}
