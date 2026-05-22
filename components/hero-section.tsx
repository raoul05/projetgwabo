import Link from 'next/link'
import { ArrowRight, Clock, Truck, Star, Award, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-[#074639] to-secondary py-16 md:py-24 lg:py-32">
      {/* Visual background decorations - premium organic blobs */}
      <div className="absolute inset-0 opacity-15">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-400 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-accent/40 blur-3xl" />
        <div className="absolute top-[30%] left-[20%] w-[30%] h-[30%] rounded-full bg-white/20 blur-2xl" />
      </div>

      {/* Decorative vector grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column - Content */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Trust badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4.5 py-2 text-white text-xs font-semibold tracking-wider uppercase mb-6 shadow-sm">
              <Star className="h-4 w-4 fill-accent text-accent animate-pulse-subtle" />
              <span>L'Épicerie #1 de Bouaké</span>
            </div>

            {/* Premium heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.15] mb-6 tracking-tight">
              Vos courses fraîches <br className="hidden md:inline" />
              livrées en <span className="text-accent underline decoration-accent/30 decoration-wavy underline-offset-8">45 minutes</span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-white/85 mb-8 max-w-xl leading-relaxed">
              GWABO sélectionne le meilleur des marchés de Bouaké pour vous livrer directement à domicile. Produits frais, hygiène irréprochable et livraison ultra-rapide.
            </p>

            {/* Call To Actions */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-10">
              <Link href="#products" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-white text-sm font-bold tracking-wide uppercase px-8 py-6 rounded-full transition-all duration-300 hover:scale-102 hover:shadow-lg hover:shadow-accent/20">
                  Commander maintenant
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/category/fruits-legumes" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-white border-white/25 hover:bg-white/10 text-sm font-bold tracking-wide uppercase px-8 py-6 rounded-full transition-all">
                  Découvrir le marché
                </Button>
              </Link>
            </div>

            {/* Trust highlights */}
            <div className="flex flex-wrap gap-x-8 gap-y-4 pt-4 border-t border-white/10 w-full">
              <div className="flex items-center gap-3 text-white/90">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 shadow-xs">
                  <Clock className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-xs text-white/60 uppercase font-bold tracking-wider">Rapidité</p>
                  <p className="text-sm font-semibold">Moins de 45 min</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-white/90">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 shadow-xs">
                  <Truck className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-xs text-white/60 uppercase font-bold tracking-wider">Frais fixes</p>
                  <p className="text-sm font-semibold">500 FCFA partout</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-white/90">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 shadow-xs">
                  <ShieldCheck className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-xs text-white/60 uppercase font-bold tracking-wider">Qualité</p>
                  <p className="text-sm font-semibold">Sélection rigoureuse</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Premium Layout of Visual Mockups */}
          <div className="lg:col-span-5 relative hidden lg:flex items-center justify-center h-full">
            {/* Background glowing circle */}
            <div className="absolute w-72 h-72 rounded-full bg-emerald-500/10 blur-2xl animate-pulse-subtle" />

            {/* Primary high-fidelity mockup */}
            <div className="relative z-10 w-full max-w-md aspect-square rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-primary/40 group hover:scale-[1.01] transition-all duration-500">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80" 
                alt="Fresh grocery market Bouake"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#085041]/60 via-transparent to-transparent" />
            </div>

            {/* Overlapping Floating Cards - Glassmorphism */}
            <div className="absolute -left-6 bottom-10 z-20 glass rounded-2xl p-4.5 max-w-[240px] shadow-xl animate-bounce-subtle">
              <div className="flex gap-3 items-start">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-white">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Fraîcheur</p>
                  <p className="text-sm font-bold text-foreground mt-0.5 leading-snug">Sélectionné le matin même au marché</p>
                </div>
              </div>
            </div>

            <div className="absolute -right-6 top-10 z-20 glass rounded-2xl p-4.5 max-w-[200px] shadow-xl">
              <div className="flex gap-3 items-center">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-white">
                  <Star className="h-4.5 w-4.5 fill-current" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-bold tracking-wider">Avis clients</p>
                  <p className="text-sm font-extrabold text-foreground leading-none mt-0.5">4.9/5 (Bouaké)</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
