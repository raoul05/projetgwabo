'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, ShoppingCart, User, Menu, Package, ClipboardList } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { useCart } from '@/lib/cart-context'
import { categories } from '@/lib/data'

export function Navbar() {
  const { itemCount } = useCart()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // For now, just navigate to first category — will be improved with search page
      router.push(`/category/fruits-legumes?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <span className="text-xl font-bold text-primary-foreground">G</span>
            </div>
            <span className="text-xl font-bold text-primary">GWABO</span>
          </Link>

          {/* Search - Desktop */}
          <div className="hidden flex-1 max-w-xl md:block">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher des produits..."
                className="pl-10 bg-muted/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Search toggle - Mobile */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Profile */}
            <Link href="/profile">
              <Button variant="ghost" size="icon" className="relative">
                <User className="h-5 w-5" />
              </Button>
            </Link>

            {/* Cart */}
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-accent text-accent-foreground text-xs">
                    {itemCount > 99 ? '99+' : itemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <nav className="flex flex-col gap-1 mt-8">
                  {/* Account links */}
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-3">
                    Mon compte
                  </p>
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-foreground hover:bg-muted transition-colors"
                  >
                    <User className="h-4 w-4" />
                    <span>Mon profil</span>
                  </Link>
                  <Link
                    href="/orders"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-foreground hover:bg-muted transition-colors"
                  >
                    <ClipboardList className="h-4 w-4" />
                    <span>Mes commandes</span>
                  </Link>
                  <Link
                    href="/cart"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-foreground hover:bg-muted transition-colors"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span>Mon panier</span>
                    {itemCount > 0 && (
                      <Badge className="ml-auto bg-accent text-accent-foreground text-xs">
                        {itemCount}
                      </Badge>
                    )}
                  </Link>

                  <div className="h-px bg-border my-3" />

                  {/* Categories */}
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-3">
                    Catégories
                  </p>
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/category/${category.slug}`}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-foreground hover:bg-muted transition-colors"
                    >
                      <span>{category.icon}</span>
                      <span>{category.name}</span>
                    </Link>
                  ))}

                  <div className="h-px bg-border my-3" />

                  {/* Admin link */}
                  <Link
                    href="/admin"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-muted transition-colors text-sm"
                  >
                    <Package className="h-4 w-4" />
                    <span>Administration</span>
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Mobile search */}
        {isSearchOpen && (
          <div className="pb-4 md:hidden">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher des produits..."
                className="pl-10 bg-muted/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </form>
          </div>
        )}

        {/* Categories bar - Desktop */}
        <nav className="hidden md:flex items-center gap-6 py-3 overflow-x-auto">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors whitespace-nowrap"
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
