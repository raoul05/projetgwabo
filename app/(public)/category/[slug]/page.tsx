'use client'

import { use } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ProductsSection } from '@/components/products-section'
import { useData } from '@/contexts/data-context'
import { notFound } from 'next/navigation'

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = use(params)
  const { categories } = useData()
  const category = categories.find(c => c.slug === slug)

  if (!category) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="bg-primary/5 py-8">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{category.icon}</span>
              <h1 className="text-3xl font-bold text-foreground">{category.name}</h1>
            </div>
          </div>
        </div>
        <ProductsSection 
          title={`Tous les produits - ${category.name}`}
          categorySlug={slug}
          showAll
        />
      </main>
      <Footer />
    </div>
  )
}
