import { Navbar } from '@/components/navbar'
import { HeroSection } from '@/components/hero-section'
import { CategoriesSection } from '@/components/categories-section'
import { ProductsSection } from '@/components/products-section'
import { WhyChooseUsSection } from '@/components/why-choose-us'
import { Footer } from '@/components/footer'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <CategoriesSection />
        <ProductsSection title="Produits populaires" limit={8} />
        <WhyChooseUsSection />
        <ProductsSection 
          title="Fruits & Légumes" 
          categorySlug="fruits-legumes" 
          limit={4} 
        />
        <ProductsSection 
          title="Viandes & Poissons" 
          categorySlug="viandes-poissons" 
          limit={4} 
        />
      </main>
      <Footer />
    </div>
  )
}
