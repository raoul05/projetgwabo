'use client'

import { useData } from '@/contexts/data-context'
import { ProductCard } from './product-card'

interface ProductsSectionProps {
  title: string
  categorySlug?: string
  limit?: number
  showAll?: boolean
}

export function ProductsSection({ 
  title, 
  categorySlug, 
  limit = 8,
  showAll = false 
}: ProductsSectionProps) {
  const { products } = useData()
  let filteredProducts = products.filter(p => p.isActive)
  
  if (categorySlug) {
    filteredProducts = filteredProducts.filter(p => p.category === categorySlug)
  }

  const displayProducts = showAll ? filteredProducts : filteredProducts.slice(0, limit)

  return (
    <section className="py-12 md:py-16" id="products">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
          {title}
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-6">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {displayProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Aucun produit disponible dans cette catégorie.</p>
          </div>
        )}
      </div>
    </section>
  )
}
