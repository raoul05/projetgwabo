import Link from 'next/link'
import { Truck, Clock, ShieldCheck, Phone } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Features */}
      <div className="border-b border-primary-foreground/20">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center text-center gap-2">
              <Truck className="h-8 w-8" />
              <p className="font-medium">Livraison rapide</p>
              <p className="text-sm opacity-80">En 45 minutes</p>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <Clock className="h-8 w-8" />
              <p className="font-medium">7j/7</p>
              <p className="text-sm opacity-80">De 7h à 21h</p>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <ShieldCheck className="h-8 w-8" />
              <p className="font-medium">Produits frais</p>
              <p className="text-sm opacity-80">Qualité garantie</p>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <Phone className="h-8 w-8" />
              <p className="font-medium">Support client</p>
              <p className="text-sm opacity-80">+225 07 00 00 00</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-foreground">
                <span className="text-xl font-bold text-primary">G</span>
              </div>
              <span className="text-xl font-bold">GWABO</span>
            </div>
            <p className="text-sm opacity-80">
              Votre marketplace local à Bouaké pour des courses fraîches livrées en 45 minutes.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-medium mb-4">Liens rapides</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li><Link href="/" className="hover:opacity-100">Accueil</Link></li>
              <li><Link href="/category/fruits-legumes" className="hover:opacity-100">Produits</Link></li>
              <li><Link href="/cart" className="hover:opacity-100">Panier</Link></li>
              <li><Link href="/admin" className="hover:opacity-100">Mon compte</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-medium mb-4">Catégories</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li><Link href="/category/fruits-legumes" className="hover:opacity-100">Fruits & Légumes</Link></li>
              <li><Link href="/category/viandes-poissons" className="hover:opacity-100">Viandes & Poissons</Link></li>
              <li><Link href="/category/cereales-grains" className="hover:opacity-100">Céréales & Grains</Link></li>
              <li><Link href="/category/boissons" className="hover:opacity-100">Boissons</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-medium mb-4">Contact</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li>Bouaké, Côte d&apos;Ivoire</li>
              <li>+225 07 00 00 00</li>
              <li>contact@gwabo.ci</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/20 text-center text-sm opacity-80">
          <p>&copy; {new Date().getFullYear()} GWABO. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}
