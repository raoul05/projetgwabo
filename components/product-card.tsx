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

const getCategoryEmoji = (slug: string) => {
  const emojiMap: Record<string, string> = {
    'fruits-legumes': '🥬',
    'viandes-poissons': '🥩',
    'cereales-grains': '🌾',
    'huiles-epices': '🫒',
    'boissons': '🧃',
    'produits-laitiers': '🥛',
    'tubercules': '🥔',
    'condiments': '🧂',
  }
  return emojiMap[slug] || '📦'
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, updateQuantity, getItemQuantity } = useCart()
  const quantity = getItemQuantity(product.id)
  const isDecimal = decimalUnits.includes(product.unit)
  const step = isDecimal ? 0.5 : 1

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price)
  }

  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300">
      {/* Clickable image/name area */}
      <Link href={`/product/${product.id}`}>
        <div className="aspect-square relative bg-muted overflow-hidden cursor-pointer">
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-secondary/20 to-primary/20 group-hover:from-secondary/30 group-hover:to-primary/30 transition-colors">
            <span className="text-6xl opacity-50 group-hover:opacity-70 group-hover:scale-110 transition-all duration-300">
              {getCategoryEmoji(product.category)}
            </span>
          </div>
        </div>
      </Link>
      <CardContent className="p-4">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-medium text-foreground line-clamp-2 min-h-[2.5rem] hover:text-primary transition-colors cursor-pointer">
            {product.name}
          </h3>
        </Link>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-lg font-bold text-primary">
            {formatPrice(product.price)}
          </span>
          <span className="text-sm text-muted-foreground">FCFA/{product.unit}</span>
        </div>
        
        <div className="mt-4">
          {quantity === 0 ? (
            <Button
              onClick={() => addToCart(product, step)}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
          ) : (
            <div className="flex items-center justify-between bg-muted rounded-lg p-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => updateQuantity(product.id, quantity - step)}
                className="h-8 w-8"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="font-medium text-sm">
                {isDecimal ? quantity.toFixed(1) : quantity} {product.unit}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => addToCart(product, step)}
                className="h-8 w-8"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
