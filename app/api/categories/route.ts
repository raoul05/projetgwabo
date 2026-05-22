import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')

    if (error) {
      console.error('Error fetching categories:', error)
      return NextResponse.json({ error: 'Erreur lors de la récupération des catégories' }, { status: 500 })
    }

    return NextResponse.json({ categories })

  } catch (error) {
    console.error('Categories GET error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
