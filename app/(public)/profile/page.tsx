'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  User, 
  Phone, 
  MapPin, 
  Edit2, 
  Save, 
  ShoppingBag,
  ArrowLeft,
  LogIn
} from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { districts } from '@/lib/data'

interface CustomerProfile {
  name: string
  phone: string
  address: string
  district: string
  gpsLocation: string
}

const PROFILE_STORAGE_KEY = 'gwabo-customer-profile'

function loadProfile(): CustomerProfile | null {
  if (typeof window === 'undefined') return null
  try {
    const stored = localStorage.getItem(PROFILE_STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

function saveProfile(profile: CustomerProfile) {
  try {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile))
  } catch (error) {
    console.error('Error saving profile:', error)
  }
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<CustomerProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  // Form state
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [district, setDistrict] = useState('')
  const [gpsLocation, setGpsLocation] = useState('')

  useEffect(() => {
    const stored = loadProfile()
    if (stored) {
      setProfile(stored)
      setName(stored.name)
      setPhone(stored.phone)
      setAddress(stored.address)
      setDistrict(stored.district)
      setGpsLocation(stored.gpsLocation)
    } else {
      setIsEditing(true) // New user, show form
    }
    setIsLoaded(true)
  }, [])

  const handleSave = () => {
    if (!name.trim() || !phone.trim()) {
      alert('Veuillez remplir votre nom et numéro de téléphone.')
      return
    }
    const newProfile: CustomerProfile = { name, phone, address, district, gpsLocation }
    saveProfile(newProfile)
    setProfile(newProfile)
    setIsEditing(false)
  }

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setGpsLocation(`https://maps.google.com/?q=${latitude},${longitude}`)
        },
        () => {
          alert('Impossible de récupérer votre position GPS.')
        }
      )
    }
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="animate-pulse space-y-4 max-w-2xl mx-auto">
            <div className="h-8 bg-muted rounded w-48" />
            <div className="h-64 bg-muted rounded-xl" />
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
          Retour à la boutique
        </Link>

        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-8">Mon profil</h1>

          {/* Profile Card */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Informations personnelles
                </CardTitle>
                {profile && !isEditing && (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    <Edit2 className="h-4 w-4 mr-2" />
                    Modifier
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="profile-name">Nom complet *</Label>
                      <Input
                        id="profile-name"
                        placeholder="Votre nom"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profile-phone">Téléphone *</Label>
                      <Input
                        id="profile-phone"
                        placeholder="+225 07 XX XX XX"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="profile-district">Quartier</Label>
                    <Select value={district} onValueChange={setDistrict}>
                      <SelectTrigger id="profile-district">
                        <SelectValue placeholder="Sélectionnez votre quartier" />
                      </SelectTrigger>
                      <SelectContent>
                        {districts.map((d) => (
                          <SelectItem key={d} value={d}>{d}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="profile-address">Adresse</Label>
                    <Textarea
                      id="profile-address"
                      placeholder="Votre adresse complète"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Position GPS</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Lien Google Maps"
                        value={gpsLocation}
                        onChange={(e) => setGpsLocation(e.target.value)}
                        className="flex-1"
                      />
                      <Button variant="outline" onClick={handleGetLocation}>
                        <MapPin className="h-4 w-4 mr-2" />
                        Localiser
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    {profile && (
                      <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1">
                        Annuler
                      </Button>
                    )}
                    <Button onClick={handleSave} className="flex-1 bg-primary hover:bg-primary/90">
                      <Save className="h-4 w-4 mr-2" />
                      Enregistrer
                    </Button>
                  </div>
                </div>
              ) : profile ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{profile.name}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {profile.phone}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid sm:grid-cols-2 gap-4 text-sm">
                    {profile.district && (
                      <div>
                        <span className="text-muted-foreground">Quartier</span>
                        <p className="font-medium">{profile.district}</p>
                      </div>
                    )}
                    {profile.address && (
                      <div>
                        <span className="text-muted-foreground">Adresse</span>
                        <p className="font-medium">{profile.address}</p>
                      </div>
                    )}
                    {profile.gpsLocation && (
                      <div>
                        <span className="text-muted-foreground">Position GPS</span>
                        <p className="font-medium text-primary">✓ Enregistrée</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Link href="/orders">
              <Card className="hover:shadow-md transition-shadow cursor-pointer group h-full">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                    <ShoppingBag className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Mes commandes</h3>
                    <p className="text-sm text-muted-foreground">Voir l&apos;historique</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link href="/cart">
              <Card className="hover:shadow-md transition-shadow cursor-pointer group h-full">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <LogIn className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Mon panier</h3>
                    <p className="text-sm text-muted-foreground">Voir le panier</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
