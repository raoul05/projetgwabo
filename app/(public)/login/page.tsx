'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { User, Phone, ArrowRight, ShoppingBag } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useAuth } from '@/contexts/auth-context'

export default function LoginPage() {
  const router = useRouter()
  const { loginCustomer, isCustomerLoggedIn } = useAuth()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

  // Already logged in
  if (isCustomerLoggedIn) {
    router.push('/profile')
    return null
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !phone.trim()) {
      alert('Veuillez remplir votre nom et numéro de téléphone.')
      return
    }
    loginCustomer(name.trim(), phone.trim())

    // Also save to profile storage for backward compatibility
    try {
      localStorage.setItem('gwabo-customer-profile', JSON.stringify({
        name: name.trim(),
        phone: phone.trim(),
        address: '',
        district: '',
        gpsLocation: '',
      }))
    } catch {}

    router.push('/profile')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Bienvenue sur GWABO</CardTitle>
            <CardDescription>
              Entrez vos informations pour commencer à commander
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-name" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Nom complet
                </Label>
                <Input
                  id="login-name"
                  placeholder="Votre nom complet"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Numéro de téléphone
                </Label>
                <Input
                  id="login-phone"
                  type="tel"
                  placeholder="+225 07 XX XX XX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 h-12">
                Continuer
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t text-center">
              <p className="text-sm text-muted-foreground mb-3">
                Vous êtes employé GWABO ?
              </p>
              <Link href="/admin/login">
                <Button variant="outline" size="sm">
                  Connexion employé
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
