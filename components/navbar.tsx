'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Search, ShoppingCart, User, Menu, Package, ClipboardList, Heart } from 'lucide-react'
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
  const pathname = usePathname()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/category/fruits-legumes?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  // Determine active category slug from pathname
  const activeCategorySlug = pathname?.startsWith('/category/') 
    ? pathname.split('/category/')[1]?.split('?')[0] 
    : null

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-card/85 backdrop-blur-md shadow-xs">
      <div className="container mx-auto px-4">
        {/* Top Header */}
        <div className="flex h-16 items-center justify-between gap-4 md:gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary transition-all duration-300 group-hover:scale-105 shadow-sm shadow-primary/20">
              <span className="text-xl font-black text-primary-foreground">G</span>
            </div>
            <span className="text-xl font-black tracking-tight text-primary">
              GWABO
            </span>
          </Link>

          {/* Desktop Large Search */}
          <div className="hidden flex-1 max-w-xl md:block">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/80 transition-colors" />
              <Input
                type="search"
                placeholder="Rechercher des tomates, du manioc..."
                className="w-full h-11 pl-11 pr-4 bg-muted/40 border border-muted-foreground/15 rounded-full transition-all duration-200 focus:bg-card focus:border-primary focus:ring-4 focus:ring-primary/10 text-sm shadow-inner-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-3">
            {/* Search - Mobile Trigger */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-foreground hover:bg-muted/60 rounded-full h-10 w-10"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Favorites - Desktop */}
            <Link href="/profile" className="hidden sm:inline-block">
              <Button variant="ghost" size="icon" className="text-foreground hover:bg-muted/60 rounded-full h-10 w-10 relative">
                <Heart className="h-5 w-5" />
              </Button>
            </Link>

            {/* Profile - Desktop */}
            <Link href="/profile">
              <Button variant="ghost" size="icon" className="text-foreground hover:bg-muted/60 rounded-full h-10 w-10">
                <User className="h-5 w-5" />
              </Button>
            </Link>

            {/* Shopping Cart */}
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="text-foreground hover:bg-muted/60 rounded-full h-10 w-10 relative">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <Badge className="absolute -right-1 -top-1 h-5 min-w-[20px] rounded-full p-0 px-1 flex items-center justify-center bg-accent text-accent-foreground text-[10px] font-bold border-2 border-card shadow-sm transition-all duration-300 animate-pulse-subtle">
                    {itemCount > 99 ? '99+' : itemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Mobile Hamburger menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-foreground hover:bg-muted/60 rounded-full h-10 w-10">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 border-l border-border/40 bg-card">
                <nav className="flex flex-col gap-1 mt-8">
                  {/* Account links */}
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2 px-3">
                    Mon compte
                  </p>
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-foreground hover:bg-muted/60 transition-all duration-200"
                  >
                    <User className="h-4 w-4 text-primary" />
                    <span className="font-medium text-sm">Mon profil</span>
                  </Link>
                  <Link
                    href="/orders"
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-foreground hover:bg-muted/60 transition-all duration-200"
                  >
                    <ClipboardList className="h-4 w-4 text-primary" />
                    <span className="font-medium text-sm">Mes commandes</span>
                  </Link>
                  <Link
                    href="/cart"
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-foreground hover:bg-muted/60 transition-all duration-200"
                  >
                    <ShoppingCart className="h-4 w-4 text-primary" />
                    <span className="font-medium text-sm">Mon panier</span>
                    {itemCount > 0 && (
                      <Badge className="ml-auto bg-accent text-accent-foreground text-[11px] font-bold">
                        {itemCount}
                      </Badge>
                    )}
                  </Link>

                  <div className="h-px bg-border/60 my-4" />

                  {/* Categories */}
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2 px-3">
                    Catégories
                  </p>
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/category/${category.slug}`}
                      className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                        activeCategorySlug === category.slug 
                          ? 'bg-primary/10 text-primary font-bold' 
                          : 'text-foreground hover:bg-muted/60'
                      }`}
                    >
                      <span className="text-base">{category.icon}</span>
                      <span className="text-sm font-medium">{category.name}</span>
                    </Link>
                  ))}

                  <div className="h-px bg-border/60 my-4" />

                  {/* Admin link */}
                  <Link
                    href="/admin"
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-muted-foreground hover:bg-muted/60 transition-all duration-200 text-sm"
                  >
                    <Package className="h-4 w-4" />
                    <span className="font-medium">Administration</span>
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Mobile Search Input Dropdown */}
        {isSearchOpen && (
          <div className="pb-4 md:hidden animate-in slide-in-from-top duration-200">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/80" />
              <Input
                type="search"
                placeholder="Rechercher des tomates, du manioc..."
                className="w-full h-10 pl-11 bg-muted/40 border border-muted-foreground/15 rounded-full transition-all focus:bg-card focus:border-primary text-sm shadow-inner-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </form>
          </div>
        )}

        {/* Horizontal Swipable Categories Navigation - Desktop & Mobile */}
        <nav className="flex items-center gap-2 py-3 overflow-x-auto no-scrollbar scroll-smooth border-t border-border/20">
          <Link
            href="/"
            className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide uppercase transition-all duration-200 shrink-0 ${
              !activeCategorySlug 
                ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20 scale-102' 
                : 'bg-muted/60 text-muted-foreground hover:bg-primary/10 hover:text-primary'
            }`}
          >
            🏠 Tout voir
          </Link>
          
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold tracking-wide uppercase transition-all duration-200 shrink-0 ${
                activeCategorySlug === category.slug 
                  ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20 scale-102' 
                  : 'bg-muted/60 text-muted-foreground hover:bg-primary/10 hover:text-primary font-medium'
              }`}
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
