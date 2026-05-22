import { createClient } from '@/lib/supabase/client'
import type { Category } from '@/lib/supabase/types'

export async function getCategories(): Promise<Category[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  return data || []
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Error fetching category:', error)
    return null
  }

  return data
}

export async function getCategoryById(id: string): Promise<Category | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching category:', error)
    return null
  }

  return data
}

export async function createCategory(categoryData: {
  name: string
  slug: string
  icon?: string
}): Promise<Category | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('categories')
    .insert(categoryData)
    .select()
    .single()

  if (error) {
    console.error('Error creating category:', error)
    return null
  }

  return data
}
