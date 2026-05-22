'use client'

import Link from 'next/link'
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useCart } from '@/lib/cart-context'

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR').format(price)
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

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, subtotal, deliveryFee, total, clearCart } = useCart()

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="text-center max-w-md mx-auto">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Votre panier est vide</h1>
            <p className="text-muted-foreground mb-6">
              Ajoutez des produits pour passer commande.
            </p>
            <Link href="/">
              <Button className="bg-primary hover:bg-primary/90">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continuer mes achats
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center text-primary hover:underline mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Continuer mes achats
        </Link>

        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-8">Mon panier</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle>Produits ({items.length})</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-destructive hover:text-destructive"
                  onClick={clearCart}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Vider
                </Button>
              </CardHeader>
              <CardContent className="space-y-0">
                {items.map((item, index) => (
                  <div 
                    key={item.product.id} 
                    className={`flex gap-4 py-4 ${index > 0 ? 'border-t' : ''}`}
                  >
                    {/* Product image */}
                    <Link href={`/product/${item.product.id}`}>
                      <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-secondary/10 to-primary/10 flex items-center justify-center shrink-0 cursor-pointer hover:from-secondary/20 hover:to-primary/20 transition-colors">
                        <span className="text-3xl">
                          {getCategoryEmoji(item.product.category)}
                        </span>
                      </div>
                    </Link>

                    {/* Product info */}
                    <div className="flex-1 min-w-0">
                      <Link href={`/product/${item.product.id}`}>
                        <h3 className="font-medium text-foreground hover:text-primary transition-colors cursor-pointer">
                          {item.product.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        {formatPrice(item.product.price)} FCFA/{item.product.unit}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-2 bg-muted rounded-lg">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => removeFromCart(item.product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-right shrink-0">
                      <p className="font-bold text-foreground">
                        {formatPrice(item.product.price * item.quantity)} FCFA
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Résumé de la commande</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Sous-total</span>
                  <span>{formatPrice(subtotal)} FCFA</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Frais de livraison</span>
                  <span>{formatPrice(deliveryFee)} FCFA</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(total)} FCFA</span>
                </div>

                <Link href="/checkout">
                  <Button
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg h-14 mt-2"
                    size="lg"
                  >
                    Passer la commande
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </Link>

                <p className="text-xs text-center text-muted-foreground">
                  Livraison en 45 minutes à Bouaké
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
