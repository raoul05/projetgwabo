'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Minus, Plus, Heart, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useCart } from '@/lib/cart-context'
import { Product, ProductUnit } from '@/lib/types'

interface ProductCardProps {
  product: Product
}

const decimalUnits: ProductUnit[] = ['kg', 'g', 'L', 'cl', 'ml']

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, updateQuantity, getItemQuantity } = useCart()
  const quantity = getItemQuantity(product.id)
  const isDecimal = decimalUnits.includes(product.unit)
  const step = isDecimal ? 0.5 : 1
  const [isWishlisted, setIsWishlisted] = useState(false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price)
  }

  // Calculate discount percentage if originalPrice exists
  const hasDiscount = product.originalPrice && product.originalPrice > product.price
  const discountPercent = hasDiscount 
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0

  return (
    <Card className="overflow-hidden bg-card border border-muted/80 rounded-2xl group transition-all duration-300 hover:shadow-lg flex flex-col h-full">
      {/* Clickable Square Image Area with Hover Zoom */}
      <div className="block overflow-hidden aspect-square bg-muted relative select-none">
        <Link href={`/product/${product.id}`} className="block w-full h-full cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-t from-black/[0.02] to-transparent z-10" />
          
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80'}
            alt={product.name}
            className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        {/* 25% OFF / Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-3 left-3 bg-[#FF3B30] text-white rounded-full w-11 h-11 flex flex-col items-center justify-center text-[10px] font-black leading-tight shadow-md z-20 border border-white/20 select-none">
            <span>{discountPercent}%</span>
            <span className="text-[7px] font-extrabold uppercase tracking-widest -mt-0.5">OFF</span>
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setIsWishlisted(!isWishlisted)
          }}
          aria-label="Ajouter aux favoris"
          className="absolute top-3 right-3 z-20 p-1.5 rounded-full bg-white/90 hover:bg-white text-muted-foreground hover:text-red-500 shadow-sm border border-black/[0.03] backdrop-blur-xs transition-all active:scale-90 cursor-pointer"
        >
          <Heart 
            className={`h-3.5 w-3.5 transition-colors ${
              isWishlisted ? 'fill-red-500 text-red-500' : 'text-foreground'
            }`} 
          />
        </button>
      </div>

      {/* Card Content */}
      <CardContent className="p-3.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title and Star Rating Row */}
          <div className="flex justify-between items-start gap-1.5 mb-1">
            <Link href={`/product/${product.id}`} className="flex-1 min-w-0">
              <h3 className="font-bold text-sm text-foreground hover:text-[#7DB315] transition-colors cursor-pointer line-clamp-1 leading-snug">
                {product.name}
              </h3>
            </Link>
            
            {/* 5 Golden Stars */}
            <div className="flex items-center gap-0.5 shrink-0 pt-0.5 select-none">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className="h-3 w-3 fill-[#FFC72C] text-[#FFC72C] stroke-[#FFC72C]" 
                />
              ))}
            </div>
          </div>

          {/* Price Tag & Unit */}
          {hasDiscount ? (
            <div className="mt-1 flex items-baseline gap-1.5 flex-wrap">
              <span className="text-xs font-semibold text-[#FF5E13] line-through select-none">
                {formatPrice(product.originalPrice!)}
              </span>
              <span className="text-sm font-extrabold text-foreground">
                {formatPrice(product.price)}
              </span>
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                FCFA/{product.unit}
              </span>
            </div>
          ) : (
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-[10px] font-semibold text-muted-foreground select-none">
                Dès
              </span>
              <span className="text-sm font-extrabold text-foreground">
                {formatPrice(product.price)}
              </span>
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                FCFA/{product.unit}
              </span>
            </div>
          )}
        </div>

        {/* Action controls (Bottom Row) */}
        <div className="mt-4 flex items-center justify-between gap-2">
          {/* Persistent Quantity Selector */}
          <div className="flex items-center justify-between border border-muted-foreground/15 rounded-lg bg-card shadow-xs h-9 w-[84px] shrink-0 p-0.5 select-none">
            <Button
              variant="ghost"
              size="icon"
              disabled={quantity === 0}
              onClick={() => updateQuantity(product.id, quantity - step)}
              className="h-7 w-7 rounded-md hover:bg-muted text-muted-foreground disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="font-bold text-xs text-foreground min-w-[16px] text-center">
              {isDecimal ? quantity.toFixed(1) : quantity}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => addToCart(product, step)}
              className="h-7 w-7 rounded-md hover:bg-muted text-muted-foreground"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          {/* Add to Cart Button */}
          <Button
            onClick={() => addToCart(product, step)}
            className="flex-1 h-9 bg-[#7DB315] hover:bg-[#6B9E11] text-white rounded-lg text-xs font-bold tracking-wide uppercase transition-all active:scale-[0.98]"
          >
            {quantity > 0 ? `Ajouté (${isDecimal ? quantity.toFixed(1) : quantity})` : 'Ajouter'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
