'use client'

import Link from 'next/link'
import { useData } from '@/contexts/data-context'
import { Card, CardContent } from '@/components/ui/card'

export function CategoriesSection() {
  const { categories } = useData()
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Catégories
          </h2>
          <Link 
            href="/category/fruits-legumes" 
            className="text-sm text-primary hover:underline"
          >
            Voir tout
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((category) => (
            <Link key={category.id} href={`/category/${category.slug}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer group">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                    {category.icon}
                  </div>
                  <p className="text-sm font-medium text-foreground line-clamp-2">
                    {category.name}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
