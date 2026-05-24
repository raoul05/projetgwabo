'use client'

import Link from 'next/link'
import { ArrowRight, Leaf, ShieldCheck, Smile, Star, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-tr from-[#FAF8F2] via-[#FDFCF7] to-[#F5F8F2] py-16 md:py-24 lg:py-28">
      {/* Self-contained float animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(4deg); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-14px) rotate(-6deg); }
        }
        .animate-float-slow {
          animation: float-slow 7s ease-in-out infinite;
        }
        .animate-float-medium {
          animation: float-medium 5s ease-in-out infinite;
        }
      `}} />

      {/* Floating leaves/blobs background decorations */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Soft blur backgrounds */}
        <div className="absolute top-[-10%] left-[-5%] w-[45%] h-[45%] rounded-full bg-emerald-500/5 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-amber-500/5 blur-3xl" />

        {/* Decorative Floating Leaves */}
        <div className="absolute top-[15%] left-[5%] animate-float-slow opacity-15 text-emerald-800 hidden md:block">
          <Leaf className="h-10 w-10 rotate-12" />
        </div>
        <div className="absolute bottom-[20%] left-[45%] animate-float-medium opacity-20 text-emerald-600 hidden lg:block">
          <Leaf className="h-7 w-7 -rotate-45" />
        </div>
        <div className="absolute top-[10%] right-[35%] animate-float-slow opacity-15 text-emerald-700 hidden lg:block">
          <Leaf className="h-8 w-8 rotate-90" />
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column - Content */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            {/* Soft green capsule badge */}
            <div className="inline-flex items-center gap-2 bg-[#E8F5E9] border border-emerald-100 rounded-full px-4 py-1.5 text-[#2E7D32] text-xs font-extrabold tracking-wide mb-6 shadow-xs select-none">
              <Leaf className="h-3.5 w-3.5 fill-[#2E7D32]" />
              <span>Frais, naturel et livré chez vous</span>
            </div>

            {/* Premium organic heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-black text-slate-800 leading-[1.12] mb-5 tracking-tight font-serif">
              Le <span className="text-[#1D7A41]">marché</span> de Bouaké<br />
              dans votre poche
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base text-slate-600/90 mb-8 max-w-xl leading-relaxed">
              Découvrez les meilleurs produits frais, fruits, légumes et essentiels du quotidien. GWABO sélectionne le meilleur des marchés de Bouaké pour vous livrer directement à domicile.
            </p>

            {/* Call To Actions */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link href="#products" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-[#1D7A41] hover:bg-[#155A2F] text-white text-xs font-black tracking-widest uppercase px-7 py-5.5 rounded-full transition-all duration-300 hover:scale-[1.01] hover:shadow-md hover:shadow-emerald-900/10 group">
                  Commander maintenant
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </Link>
              <Link href="/category/fruits-legumes" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-[#F2B723] hover:bg-[#D9A116] text-slate-900 text-xs font-black tracking-widest uppercase px-7 py-5.5 rounded-full transition-all duration-300 hover:scale-[1.01] hover:shadow-md group">
                  Voir les produits
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column - Collage and Floating Glass Cards */}
          <div className="lg:col-span-6 relative flex items-center justify-center min-h-[360px] sm:min-h-[440px] lg:min-h-[460px]">
            {/* Glow effect behind collage */}
            <div className="absolute w-72 h-72 rounded-full bg-emerald-500/5 blur-3xl animate-pulse-subtle z-0" />

            {/* Collage main image */}
            <div className="relative z-10 w-full max-w-md aspect-[4/3] sm:aspect-square rounded-[36px] overflow-hidden border border-black/[0.04] shadow-xl group hover:scale-[1.01] transition-all duration-500">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="https://images.unsplash.com/photo-1610832958506-ee5633613044?w=800&auto=format&fit=crop&q=80" 
                alt="Marché de produits frais à Bouaké"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-103"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/[0.04] via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Card 1: 100% Naturel (Top left) */}
            <div className="absolute top-4 left-0 sm:left-4 z-20 bg-white/95 backdrop-blur-md rounded-2xl py-2.5 px-3.5 max-w-[200px] shadow-lg border border-black/[0.03] animate-float-slow flex items-center gap-2.5">
              <div className="flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-full bg-[#E8F5E9] text-[#2E7D32]">
                <Check className="h-4.5 w-4.5 stroke-[3]" />
              </div>
              <div>
                <p className="text-xs font-black text-slate-800 leading-none">100% Naturel</p>
                <p className="text-[9px] font-bold text-slate-500 mt-1 leading-none">Sans produits chimiques</p>
              </div>
            </div>

            {/* Card 2: Livraison rapide (Bottom left) */}
            <div className="absolute bottom-6 left-0 sm:left-6 z-20 bg-white/95 backdrop-blur-md rounded-2xl py-2.5 px-3.5 max-w-[220px] shadow-lg border border-black/[0.03] animate-float-medium flex items-center gap-2.5">
              <div className="flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-full bg-[#FFF3E0] text-[#E65100]">
                <span className="text-base select-none">🚚</span>
              </div>
              <div>
                <p className="text-xs font-black text-slate-800 leading-none">Livraison rapide</p>
                <p className="text-[9px] font-bold text-slate-500 mt-1 leading-none">Frais et livré le jour même</p>
              </div>
            </div>

            {/* Card 3: 4.9/5 Note (Bottom right) */}
            <div className="absolute right-0 sm:right-6 bottom-16 sm:bottom-20 z-20 bg-white/95 backdrop-blur-md rounded-2xl py-3 px-3.5 min-w-[155px] shadow-lg border border-black/[0.03] animate-float-slow flex flex-col gap-2.5">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-500">
                  <Star className="h-4 w-4 fill-current stroke-current" />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-800 leading-none">4.9/5</p>
                  <p className="text-[9px] font-bold text-slate-500 mt-0.5 leading-none">12K Avis clients</p>
                </div>
              </div>

              {/* Overlapping customer avatars */}
              <div className="flex items-center">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=85" 
                  alt="Client" 
                  className="w-6.5 h-6.5 rounded-full border-2 border-white object-cover shadow-xs select-none"
                />
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=85" 
                  alt="Client" 
                  className="w-6.5 h-6.5 rounded-full border-2 border-white object-cover shadow-xs -ml-2 select-none"
                />
                <img 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=85" 
                  alt="Client" 
                  className="w-6.5 h-6.5 rounded-full border-2 border-white object-cover shadow-xs -ml-2 select-none"
                />
                <img 
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=85" 
                  alt="Client" 
                  className="w-6.5 h-6.5 rounded-full border-2 border-white object-cover shadow-xs -ml-2 select-none"
                />
                <div className="w-6.5 h-6.5 rounded-full bg-[#1D7A41] text-white flex items-center justify-center text-[9px] font-black border-2 border-white -ml-2 z-10 shrink-0 select-none">
                  +
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Horizontal Core Pillars Banner */}
        <div className="relative z-20 mt-16 max-w-5xl mx-auto">
          <div className="bg-white/90 backdrop-blur-md rounded-[28px] py-6 px-6 sm:px-8 border border-black/[0.04] shadow-md grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 justify-items-stretch select-none">
            {/* Pillar 1 */}
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E8F5E9] text-[#2E7D32]">
                <Leaf className="h-5 w-5 fill-[#2E7D32]" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-black text-slate-800 leading-tight">100% Frais</h4>
                <p className="text-[10px] font-bold text-slate-500 mt-0.5 leading-snug">Produits naturels et certifiés</p>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E8F5E9] text-[#2E7D32]">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-black text-slate-800 leading-tight">Paiement sécurisé</h4>
                <p className="text-[10px] font-bold text-slate-500 mt-0.5 leading-snug">Mobile Money & espèces</p>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="flex items-center gap-3.5 border-t border-slate-100 pt-4 sm:border-t-0 sm:pt-0 lg:border-t-0 lg:pt-0 col-span-1 lg:col-span-1">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E8F5E9] text-[#2E7D32]">
                <Leaf className="h-5 w-5 rotate-90" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-black text-slate-800 leading-tight">Emballage soigné</h4>
                <p className="text-[10px] font-bold text-slate-500 mt-0.5 leading-snug">Écologique et recyclable</p>
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="flex items-center gap-3.5 border-t border-slate-100 pt-4 sm:border-t-0 sm:pt-0 lg:border-t-0 lg:pt-0 col-span-1 lg:col-span-1">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E8F5E9] text-[#2E7D32]">
                <Smile className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-black text-slate-800 leading-tight">Clients satisfaits</h4>
                <p className="text-[10px] font-bold text-slate-500 mt-0.5 leading-snug">Des milliers nous font confiance</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
