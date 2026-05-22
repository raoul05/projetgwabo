import Link from 'next/link'
import { ArrowRight, Clock, Truck, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-secondary">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white" />
        <div className="absolute bottom-20 right-20 w-48 h-48 rounded-full bg-white" />
        <div className="absolute top-1/2 left-1/3 w-24 h-24 rounded-full bg-white" />
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 relative">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm mb-6">
            <Star className="h-4 w-4 fill-current" />
            <span>Marketplace #1 à Bouaké</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 text-balance">
            Vos courses fraîches livrées en{' '}
            <span className="text-accent">45 minutes</span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-xl">
            GWABO vous livre les meilleurs produits frais du marché directement chez vous à Bouaké. Fruits, légumes, viandes et plus encore.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Link href="#products">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-8">
                Commander maintenant
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/category/fruits-legumes">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10 text-lg px-8">
                Voir les produits
              </Button>
            </Link>
          </div>

          {/* Features */}
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2 text-white">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                <Clock className="h-5 w-5" />
              </div>
              <span>Livraison en 45min</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                <Truck className="h-5 w-5" />
              </div>
              <span>Frais de livraison: 500 FCFA</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
