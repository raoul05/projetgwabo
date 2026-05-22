'use client'

import Link from 'next/link'
import { Minus, Plus, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useCart } from '@/lib/cart-context'
import { Product, ProductUnit } from '@/lib/types'

interface ProductCardProps {
  product: Product
}

const decimalUnits: ProductUnit[] = ['kg', 'g', 'L', 'cl', 'ml']

const categoryNameMap: Record<string, string> = {
  'fruits-legumes': 'Fruits & Légumes',
  'viandes-poissons': 'Viandes & Poissons',
  'cereales-grains': 'Céréales & Grains',
  'huiles-epices': 'Huiles & Épices',
  'boissons': 'Boissons',
  'produits-laitiers': 'Produits Laitiers',
  'tubercules': 'Tubercules',
  'condiments': 'Condiments',
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, updateQuantity, getItemQuantity } = useCart()
  const quantity = getItemQuantity(product.id)
  const isDecimal = decimalUnits.includes(product.unit)
  const step = isDecimal ? 0.5 : 1

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price)
  }

  const categoryName = categoryNameMap[product.category] || 'Épicerie'

  return (
    <Card className="overflow-hidden bg-card border border-muted/80 rounded-2xl group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5 flex flex-col h-full">
      {/* Clickable Image Area with Hover Zoom */}
      <Link href={`/product/${product.id}`} className="block overflow-hidden aspect-square bg-muted relative cursor-pointer">
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent z-10" />
        
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80'}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-106"
          loading="lazy"
        />

        {/* Muted category tag badge inside image (optional, minimal styling) */}
        <span className="absolute top-3 left-3 z-20 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 bg-white/95 text-primary rounded-full shadow-xs backdrop-blur-xs select-none">
          {categoryName.split(' ')[0]}
        </span>
      </Link>

      {/* Card Content */}
      <CardContent className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category breadcrumb */}
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">
            {categoryName}
          </p>

          {/* Product Name */}
          <Link href={`/product/${product.id}`}>
            <h3 className="font-bold text-sm text-foreground line-clamp-2 leading-snug hover:text-primary transition-colors cursor-pointer min-h-[2.5rem]">
              {product.name}
            </h3>
          </Link>
        </div>

        <div>
          {/* Price Tag & Unit */}
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-base font-extrabold text-primary">
              {formatPrice(product.price)}
            </span>
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
              FCFA / {product.unit}
            </span>
          </div>

          {/* Action button: Ajouter au panier or Quantity Selector */}
          <div className="mt-4">
            {quantity === 0 ? (
              <Button
                onClick={() => addToCart(product, step)}
                className="w-full h-9.5 bg-accent hover:bg-accent/90 text-white rounded-full text-xs font-bold tracking-wide uppercase shadow-xs transition-all active:scale-[0.98]"
              >
                <ShoppingCart className="h-3.5 w-3.5 mr-1.5" />
                Ajouter
              </Button>
            ) : (
              <div className="flex items-center justify-between bg-muted/60 border border-muted-foreground/10 rounded-full p-1 h-9.5">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => updateQuantity(product.id, quantity - step)}
                  className="h-7 w-7 rounded-full hover:bg-card text-foreground"
                >
                  <Minus className="h-3.5 w-3.5" />
                </Button>
                <span className="font-extrabold text-xs text-foreground min-w-[50px] text-center">
                  {isDecimal ? quantity.toFixed(1) : quantity} {product.unit}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => addToCart(product, step)}
                  className="h-7 w-7 rounded-full hover:bg-card text-foreground"
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
