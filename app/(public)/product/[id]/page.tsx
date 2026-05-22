'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { 
  ArrowLeft, 
  Minus, 
  Plus, 
  ShoppingCart, 
  Truck, 
  Clock, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ProductCard } from '@/components/product-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { useCart } from '@/lib/cart-context'
import { useData } from '@/contexts/data-context'
import { ProductUnit } from '@/lib/types'

const decimalUnits: ProductUnit[] = ['kg', 'g', 'L', 'cl', 'ml']

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR').format(price)
}

export default function ProductDetailPage() {
  const params = useParams()
  const productId = params.id as string
  const { products, categories } = useData()
  const product = products.find(p => p.id === productId)
  const { addToCart, getItemQuantity, updateQuantity } = useCart()
  const [selectedQuantity, setSelectedQuantity] = useState(1)

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="text-center max-w-md mx-auto">
            <div className="text-6xl mb-4">🔍</div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Produit introuvable</h1>
            <p className="text-muted-foreground mb-6">
              Ce produit n&apos;existe pas ou a été retiré.
            </p>
            <Link href="/">
              <Button className="bg-primary hover:bg-primary/90">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour à la boutique
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const category = categories.find(c => c.slug === product.category)
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id && p.isActive)
    .slice(0, 4)

  const cartQuantity = getItemQuantity(product.id)
  const isDecimalUnit = decimalUnits.includes(product.unit)
  const step = isDecimalUnit ? 0.5 : 1

  const handleQuantityChange = (value: number) => {
    const clamped = Math.max(step, Math.round(value / step) * step)
    setSelectedQuantity(Number(clamped.toFixed(1)))
  }

  const handleAddToCart = () => {
    addToCart(product, selectedQuantity)
    setSelectedQuantity(isDecimalUnit ? 1 : 1)
  }

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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-muted/30 border-b">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-primary transition-colors">Accueil</Link>
              <ChevronRight className="h-3 w-3" />
              {category && (
                <>
                  <Link 
                    href={`/category/${category.slug}`} 
                    className="hover:text-primary transition-colors"
                  >
                    {category.name}
                  </Link>
                  <ChevronRight className="h-3 w-3" />
                </>
              )}
              <span className="text-foreground font-medium">{product.name}</span>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Image */}
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-secondary/10 to-primary/10 flex items-center justify-center border overflow-hidden">
              <span className="text-[10rem] md:text-[12rem] opacity-60 select-none">
                {getCategoryEmoji(product.category)}
              </span>
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              {/* Category badge */}
              {category && (
                <Link href={`/category/${category.slug}`}>
                  <Badge variant="secondary" className="mb-3 w-fit hover:bg-secondary/80 transition-colors cursor-pointer">
                    {category.icon} {category.name}
                  </Badge>
                </Link>
              )}

              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                {product.name}
              </h1>

              {product.description && (
                <p className="text-muted-foreground text-lg mb-4">
                  {product.description}
                </p>
              )}

              {/* Price */}
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-3xl font-bold text-primary">
                  {formatPrice(product.price)} FCFA
                </span>
                <span className="text-muted-foreground text-lg">
                  / {product.unit}
                </span>
              </div>

              {/* Stock */}
              <div className="flex items-center gap-2 mb-6">
                {product.stock > 0 ? (
                  <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                    ✓ En stock ({product.stock} disponibles)
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    Rupture de stock
                  </Badge>
                )}
              </div>

              <Separator className="mb-6" />

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="text-sm font-medium text-foreground mb-3 block">
                  Quantité ({product.unit})
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border rounded-xl overflow-hidden bg-card">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-12 w-12 rounded-none hover:bg-muted"
                      onClick={() => handleQuantityChange(selectedQuantity - step)}
                      disabled={selectedQuantity <= step}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    {isDecimalUnit ? (
                      <Input
                        type="number"
                        step={step}
                        min={step}
                        value={selectedQuantity}
                        onChange={(e) => handleQuantityChange(Number(e.target.value))}
                        className="w-20 h-12 text-center border-0 rounded-none text-lg font-semibold focus-visible:ring-0"
                      />
                    ) : (
                      <span className="w-16 h-12 flex items-center justify-center text-lg font-semibold">
                        {selectedQuantity}
                      </span>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-12 w-12 rounded-none hover:bg-muted"
                      onClick={() => handleQuantityChange(selectedQuantity + step)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <span className="text-muted-foreground text-sm">
                    = {formatPrice(product.price * selectedQuantity)} FCFA
                  </span>
                </div>
              </div>

              {/* Add to Cart */}
              <div className="flex gap-3 mb-8">
                <Button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground h-14 text-lg"
                  size="lg"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Ajouter au panier
                </Button>
              </div>

              {/* Cart indicator */}
              {cartQuantity > 0 && (
                <div className="flex items-center justify-between bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6">
                  <span className="text-sm text-primary font-medium">
                    {cartQuantity} {product.unit} dans votre panier
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(product.id, cartQuantity - step)}
                      className="h-8 w-8 p-0"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center text-sm font-medium">{cartQuantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(product.id, cartQuantity + step)}
                      className="h-8 w-8 p-0"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Features */}
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center text-center p-3 rounded-xl bg-muted/50">
                  <Truck className="h-5 w-5 text-primary mb-1" />
                  <span className="text-xs text-muted-foreground">Livraison rapide</span>
                </div>
                <div className="flex flex-col items-center text-center p-3 rounded-xl bg-muted/50">
                  <Clock className="h-5 w-5 text-primary mb-1" />
                  <span className="text-xs text-muted-foreground">En 45 minutes</span>
                </div>
                <div className="flex flex-col items-center text-center p-3 rounded-xl bg-muted/50">
                  <ShieldCheck className="h-5 w-5 text-primary mb-1" />
                  <span className="text-xs text-muted-foreground">Frais garantis</span>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
                Produits similaires
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
                {relatedProducts.map((relProduct) => (
                  <ProductCard key={relProduct.id} product={relProduct} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
