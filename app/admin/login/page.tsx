'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Lock, Phone, Shield, ArrowRight, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/contexts/auth-context'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { isSupabaseConfigured, createClient } from '@/lib/supabase/client'
import { demoEmployees } from '@/lib/data'

export default function AdminLoginPage() {
  const router = useRouter()
  const { loginEmployee, isEmployeeLoggedIn } = useAuth()

  // Employee form
  const [empPhone, setEmpPhone] = useState('')
  const [empPin, setEmpPin] = useState('')
  const [empError, setEmpError] = useState('')

  // Admin form
  const [adminPhone, setAdminPhone] = useState('')
  const [adminPassword, setAdminPassword] = useState('')
  const [adminPin, setAdminPin] = useState('')
  const [adminError, setAdminError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  if (isEmployeeLoggedIn) {
    router.push('/admin')
    return null
  }

  const handleEmployeeLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setEmpError('')

    if (!empPhone.trim() || empPin.length !== 6) {
      setEmpError('Veuillez remplir tous les champs.')
      return
    }

    try {
      const inputPhone = empPhone.trim()

      if (isSupabaseConfigured()) {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('employees')
          .select('id, name, phone, email, role, is_active, pin_hash')
          .eq('phone', inputPhone)
          .single()

        if (error || !data) {
          setEmpError('Numéro de téléphone non enregistré.')
          return
        }

        if (!data.is_active) {
          setEmpError('Ce compte a été désactivé.')
          return
        }

        if (data.pin_hash !== empPin) {
          setEmpError('Code PIN incorrect.')
          return
        }

        loginEmployee({
          id: data.id,
          name: data.name,
          phone: data.phone,
          role: data.role as any,
        })
      } else {
        // Mode B (Demo Fallback)
        // Find matching demo employee
        const cleanInputPhone = inputPhone.replace(/[\s.-]/g, '')
        const found = demoEmployees.find(emp => emp.phone.replace(/[\s.-]/g, '') === cleanInputPhone)

        if (!found) {
          setEmpError('Numéro de téléphone non enregistré en mode démo. Utilisez un des numéros de test : +225 07 00 00 01 à 05.')
          return
        }

        if (!found.isActive) {
          setEmpError('Ce compte démo a été désactivé.')
          return
        }

        // Allow any 6-digit pin for demo fallback
        loginEmployee({
          id: found.id,
          name: found.name,
          phone: found.phone,
          role: found.role as any,
        })
      }

      router.push('/admin')
    } catch (err) {
      console.error('Login error:', err)
      setEmpError('Une erreur est survenue lors de la connexion.')
    }
  }

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setAdminError('')

    if (!adminPhone.trim() || !adminPassword.trim() || adminPin.length !== 6) {
      setAdminError('Veuillez remplir tous les champs.')
      return
    }

    try {
      const inputPhone = adminPhone.trim()

      if (isSupabaseConfigured()) {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('employees')
          .select('id, name, phone, email, role, is_active, pin_hash, password_hash')
          .eq('phone', inputPhone)
          .single()

        if (error || !data) {
          setAdminError('Numéro de téléphone non enregistré.')
          return
        }

        if (!data.is_active) {
          setAdminError('Ce compte a été désactivé.')
          return
        }

        if (data.role !== 'admin') {
          setAdminError("Accès refusé. Rôle d'administrateur requis.")
          return
        }

        if (data.password_hash !== adminPassword || data.pin_hash !== adminPin) {
          setAdminError('Mot de passe ou code PIN incorrect.')
          return
        }

        loginEmployee({
          id: data.id,
          name: data.name,
          phone: data.phone,
          role: data.role as any,
        })
      } else {
        // Mode B (Demo Fallback)
        const cleanInputPhone = inputPhone.replace(/[\s.-]/g, '')
        const found = demoEmployees.find(emp => emp.phone.replace(/[\s.-]/g, '') === cleanInputPhone)

        if (!found) {
          setAdminError('Numéro de téléphone non enregistré en mode démo. Utilisez un des numéros de test : +225 07 00 00 01 à 05.')
          return
        }

        if (found.role !== 'admin') {
          setAdminError("Accès refusé. Rôle d'administrateur requis.")
          return
        }

        // Allow any password / PIN in demo mode
        loginEmployee({
          id: found.id,
          name: found.name,
          phone: found.phone,
          role: found.role as any,
        })
      }

      router.push('/admin')
    } catch (err) {
      console.error('Admin login error:', err)
      setAdminError('Une erreur est survenue lors de la connexion.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary to-secondary p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white" />
        <div className="absolute bottom-20 right-20 w-48 h-48 rounded-full bg-white" />
        <div className="absolute top-1/2 left-1/3 w-24 h-24 rounded-full bg-white" />
      </div>

      <Card className="w-full max-w-md relative">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <span className="text-2xl font-bold text-primary-foreground">G</span>
            </div>
          </div>
          <CardTitle className="text-2xl">GWABO Administration</CardTitle>
          <CardDescription>
            Connectez-vous pour accéder au panneau d&apos;administration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="employee" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="employee">Employé</TabsTrigger>
              <TabsTrigger value="admin">Administrateur</TabsTrigger>
            </TabsList>

            {/* Employee Login */}
            <TabsContent value="employee">
              <form onSubmit={handleEmployeeLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="emp-phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Numéro de téléphone
                  </Label>
                  <Input
                    id="emp-phone"
                    type="tel"
                    placeholder="+225 07 XX XX XX"
                    value={empPhone}
                    onChange={(e) => setEmpPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Code PIN (6 chiffres)
                  </Label>
                  <InputOTP maxLength={6} value={empPin} onChange={setEmpPin}>
                    <InputOTPGroup className="w-full flex justify-center gap-2">
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                {empError && (
                  <p className="text-sm text-destructive">{empError}</p>
                )}

                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 h-12">
                  Se connecter
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </form>
            </TabsContent>

            {/* Admin Login */}
            <TabsContent value="admin">
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Numéro de téléphone
                  </Label>
                  <Input
                    id="admin-phone"
                    type="tel"
                    placeholder="+225 07 XX XX XX"
                    value={adminPhone}
                    onChange={(e) => setAdminPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="admin-password" className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Mot de passe
                  </Label>
                  <div className="relative">
                    <Input
                      id="admin-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Votre mot de passe"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Code PIN admin (6 chiffres)
                  </Label>
                  <InputOTP maxLength={6} value={adminPin} onChange={setAdminPin}>
                    <InputOTPGroup className="w-full flex justify-center gap-2">
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                {adminError && (
                  <p className="text-sm text-destructive">{adminError}</p>
                )}

                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 h-12">
                  Se connecter
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 pt-6 border-t text-center">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                Retour à la boutique
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
