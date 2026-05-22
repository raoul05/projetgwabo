'use client'

import Link from 'next/link'
import { useData } from '@/contexts/data-context'
import { Card, CardContent } from '@/components/ui/card'
import { ChevronRight } from 'lucide-react'

// Curated modern pastel color mapping for category background tags
const colorMapping: Record<string, { bg: string; border: string; accent: string }> = {
  'fruits-legumes': { bg: 'bg-emerald-50/50 hover:bg-emerald-100/40', border: 'border-emerald-100/30', accent: 'text-emerald-600' },
  'viandes-poissons': { bg: 'bg-rose-50/50 hover:bg-rose-100/40', border: 'border-rose-100/30', accent: 'text-rose-600' },
  'cereales-grains': { bg: 'bg-amber-50/50 hover:bg-amber-100/40', border: 'border-amber-100/30', accent: 'text-amber-600' },
  'huiles-epices': { bg: 'bg-yellow-50/50 hover:bg-yellow-100/40', border: 'border-yellow-100/30', accent: 'text-yellow-600' },
  'boissons': { bg: 'bg-blue-50/50 hover:bg-blue-100/40', border: 'border-blue-100/30', accent: 'text-blue-600' },
  'produits-laitiers': { bg: 'bg-sky-50/50 hover:bg-sky-100/40', border: 'border-sky-100/30', accent: 'text-sky-600' },
  'tubercules': { bg: 'bg-orange-50/50 hover:bg-orange-100/40', border: 'border-orange-100/30', accent: 'text-orange-600' },
  'condiments': { bg: 'bg-teal-50/50 hover:bg-teal-100/40', border: 'border-teal-100/30', accent: 'text-teal-600' },
}

export function CategoriesSection() {
  const { categories } = useData()

  return (
    <section className="py-16 bg-card/30 border-y border-border/10">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
              Explorer nos catégories
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Les meilleurs produits locaux de Bouaké sélectionnés pour vous
            </p>
          </div>
          <Link 
            href="/category/fruits-legumes" 
            className="flex items-center gap-1 text-sm font-bold text-primary hover:text-secondary group transition-colors"
          >
            <span>Voir tout le catalogue</span>
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-5">
          {categories.map((category) => {
            const style = colorMapping[category.slug] || { 
              bg: 'bg-muted/40 hover:bg-muted/60', 
              border: 'border-border/30', 
              accent: 'text-primary' 
            }
            
            return (
              <Link key={category.id} href={`/category/${category.slug}`} className="group">
                <Card className={`overflow-hidden border cursor-pointer rounded-2xl transition-all duration-300 hover:scale-103 shadow-xs hover:shadow-md ${style.bg} ${style.border}`}>
                  <CardContent className="p-5 flex flex-col items-center justify-center text-center">
                    {/* Circle icon wrapper */}
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-xs group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                      <span className="text-3xl filter drop-shadow-sm select-none">
                        {category.icon}
                      </span>
                    </div>
                    {/* Category Name */}
                    <p className="text-xs font-bold tracking-wider uppercase text-foreground/80 group-hover:text-primary transition-colors mt-4.5 line-clamp-1">
                      {category.name}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
