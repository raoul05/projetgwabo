'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, 
  ArrowRight,
  MapPin, 
  MessageCircle, 
  Loader2, 
  Check,
  ShoppingBag,
  CreditCard,
  Truck
} from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useCart } from '@/lib/cart-context'
import { useData } from '@/contexts/data-context'
import { districts, paymentMethods } from '@/lib/data'
import { PaymentMethod } from '@/lib/types'
import { isSupabaseConfigured } from '@/lib/supabase/client'

type CheckoutStep = 'delivery' | 'payment' | 'confirm'

const steps: { key: CheckoutStep; label: string; icon: React.ElementType }[] = [
  { key: 'delivery', label: 'Livraison', icon: Truck },
  { key: 'payment', label: 'Paiement', icon: CreditCard },
  { key: 'confirm', label: 'Confirmation', icon: Check },
]

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR').format(price)
}



export default function CheckoutPage() {
  const { items, subtotal, deliveryFee, total, clearCart } = useCart()
  const { addOrder } = useData()
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('delivery')
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerAddress, setCustomerAddress] = useState('')
  const [customerDistrict, setCustomerDistrict] = useState('')
  const [deliveryNotes, setDeliveryNotes] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('orange_money')
  const [gpsLocation, setGpsLocation] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null)

  const currentStepIndex = steps.findIndex(s => s.key === currentStep)

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
    } else {
      alert('La géolocalisation n\'est pas supportée par votre navigateur.')
    }
  }

  const isDeliveryValid = customerName.trim() && customerPhone.trim() && customerAddress.trim() && customerDistrict

  const goToStep = (step: CheckoutStep) => {
    if (step === 'payment' && !isDeliveryValid) return
    setCurrentStep(step)
  }

  const generateWhatsAppMessage = (orderNumber: string) => {
    const orderItems = items
      .map(item => `- ${item.product.name} x${item.quantity} (${formatPrice(item.product.price * item.quantity)} FCFA)`)
      .join('\n')

    const paymentMethodName = paymentMethods.find(p => p.id === paymentMethod)?.name || paymentMethod

    const message = `
🛒 *NOUVELLE COMMANDE GWABO*
📋 *N° Commande:* ${orderNumber}

👤 *Client:* ${customerName}
📱 *Téléphone:* ${customerPhone}
📍 *Adresse:* ${customerAddress}
🏘️ *Quartier:* ${customerDistrict}
${gpsLocation ? `📌 *GPS:* ${gpsLocation}` : ''}
${deliveryNotes ? `📝 *Notes:* ${deliveryNotes}` : ''}

📦 *Produits commandés:*
${orderItems}

💰 *Sous-total:* ${formatPrice(subtotal)} FCFA
🚚 *Livraison:* ${formatPrice(deliveryFee)} FCFA
💵 *TOTAL:* ${formatPrice(total)} FCFA

💳 *Mode de paiement:* ${paymentMethodName}

Merci de confirmer ma commande ! 🙏
    `.trim()

    return encodeURIComponent(message)
  }

  const handleSubmitOrder = async () => {
    if (!isDeliveryValid) return

    setIsSubmitting(true)

    // Save the order locally first, which also deducts stocks
    const localOrder = addOrder({
      customerName,
      customerPhone,
      district: customerDistrict,
      address: customerAddress,
      notes: deliveryNotes || undefined,
      gpsLocation: gpsLocation || undefined,
      items: items.map(item => ({ product: item.product, quantity: item.quantity })),
      subtotal,
      deliveryFee,
      total,
      paymentMethod,
    })

    const orderNumber = localOrder.id

    try {
      if (isSupabaseConfigured()) {
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customer_name: customerName,
            customer_phone: customerPhone,
            district: customerDistrict,
            address: customerAddress,
            gps_location: gpsLocation || null,
            subtotal,
            delivery_fee: deliveryFee,
            total,
            payment_method: paymentMethod,
            notes: deliveryNotes || null,
            items: items.map(item => ({
              product_id: item.product.id.startsWith('p-') ? null : item.product.id,
              product_name: item.product.name,
              quantity: item.quantity,
              unit_price: item.product.price
            }))
          })
        })

        if (!response.ok) {
          throw new Error('API order insertion failed')
        }

        const data = await response.json()
        const finalOrderNumber = (data && data.success && data.order && data.order.order_number)
          ? data.order.order_number
          : orderNumber

        setOrderSuccess(finalOrderNumber)

        const whatsappNumber = '22507000000'
        const message = generateWhatsAppMessage(finalOrderNumber)
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`
        window.open(whatsappUrl, '_blank')
      } else {
        // Mode B (Demo Fallback)
        setOrderSuccess(orderNumber)

        const whatsappNumber = '22507000000'
        const message = generateWhatsAppMessage(orderNumber)
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`
        window.open(whatsappUrl, '_blank')
      }

      clearCart()
    } catch (error) {
      console.error('Order saving error, falling back to local session:', error)
      
      // Fallback: continue showing success with the locally generated order number so user is not blocked
      setOrderSuccess(orderNumber)
      
      const whatsappNumber = '22507000000'
      const message = generateWhatsAppMessage(orderNumber)
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`
      window.open(whatsappUrl, '_blank')
      
      clearCart()
    } finally {
      setIsSubmitting(false)
    }
  }

  // Success state
  if (orderSuccess) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="text-center max-w-md mx-auto">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <Check className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Commande envoyée !</h1>
            <p className="text-muted-foreground mb-2">
              Votre commande <span className="font-bold text-primary">{orderSuccess}</span> a été enregistrée.
            </p>
            <p className="text-muted-foreground mb-8">
              Nous vous contacterons bientôt pour confirmer votre commande.
            </p>
            <div className="flex flex-col gap-3">
              <Link href="/">
                <Button className="w-full bg-primary hover:bg-primary/90">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Continuer mes achats
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // Empty cart redirect
  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="text-center max-w-md mx-auto">
            <div className="text-6xl mb-4">🛒</div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Votre panier est vide</h1>
            <p className="text-muted-foreground mb-6">
              Ajoutez des produits avant de passer commande.
            </p>
            <Link href="/">
              <Button className="bg-primary hover:bg-primary/90">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voir les produits
              </Button>
            </Link>
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
        {/* Back link */}
        <Link href="/cart" className="inline-flex items-center text-primary hover:underline mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour au panier
        </Link>

        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-8">Finaliser la commande</h1>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-10">
          {steps.map((step, index) => (
            <div key={step.key} className="flex items-center">
              <button
                onClick={() => {
                  if (index <= currentStepIndex || (index === 1 && isDeliveryValid)) {
                    goToStep(step.key)
                  }
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  step.key === currentStep
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                    : index < currentStepIndex
                    ? 'bg-primary/10 text-primary cursor-pointer hover:bg-primary/20'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                <step.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{step.label}</span>
              </button>
              {index < steps.length - 1 && (
                <div className={`w-8 sm:w-16 h-0.5 mx-1 ${
                  index < currentStepIndex ? 'bg-primary' : 'bg-border'
                }`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Step 1: Delivery */}
            {currentStep === 'delivery' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-primary" />
                    Informations de livraison
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="checkout-name">Nom complet *</Label>
                      <Input
                        id="checkout-name"
                        placeholder="Votre nom"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="checkout-phone">Téléphone *</Label>
                      <Input
                        id="checkout-phone"
                        placeholder="+225 07 XX XX XX"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="checkout-district">Quartier *</Label>
                    <Select value={customerDistrict} onValueChange={setCustomerDistrict}>
                      <SelectTrigger id="checkout-district">
                        <SelectValue placeholder="Sélectionnez votre quartier" />
                      </SelectTrigger>
                      <SelectContent>
                        {districts.map((district) => (
                          <SelectItem key={district} value={district}>
                            {district}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="checkout-address">Adresse complète *</Label>
                    <Textarea
                      id="checkout-address"
                      placeholder="Décrivez votre adresse (près de...)"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Position GPS (optionnel)</Label>
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

                  <div className="space-y-2">
                    <Label htmlFor="checkout-notes">Notes de livraison (optionnel)</Label>
                    <Textarea
                      id="checkout-notes"
                      placeholder="Instructions spéciales pour le livreur..."
                      value={deliveryNotes}
                      onChange={(e) => setDeliveryNotes(e.target.value)}
                    />
                  </div>

                  <div className="pt-4">
                    <Button
                      onClick={() => goToStep('payment')}
                      disabled={!isDeliveryValid}
                      className="w-full bg-primary hover:bg-primary/90 h-12"
                    >
                      Continuer vers le paiement
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Payment */}
            {currentStep === 'payment' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    Mode de paiement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup 
                    value={paymentMethod} 
                    onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}
                    className="space-y-3"
                  >
                    {paymentMethods.map((method) => (
                      <div 
                        key={method.id} 
                        className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                          paymentMethod === method.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/30 hover:bg-muted/50'
                        }`}
                        onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                      >
                        <RadioGroupItem value={method.id} id={`pay-${method.id}`} />
                        <Label htmlFor={`pay-${method.id}`} className="flex items-center gap-3 cursor-pointer flex-1">
                          <span className="text-2xl">{method.icon}</span>
                          <span className="font-medium">{method.name}</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>

                  <div className="flex gap-3 pt-6">
                    <Button
                      variant="outline"
                      onClick={() => goToStep('delivery')}
                      className="flex-1 h-12"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Retour
                    </Button>
                    <Button
                      onClick={() => goToStep('confirm')}
                      className="flex-1 bg-primary hover:bg-primary/90 h-12"
                    >
                      Vérifier la commande
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Confirm */}
            {currentStep === 'confirm' && (
              <div className="space-y-4">
                {/* Delivery Summary */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Truck className="h-4 w-4 text-primary" />
                        Livraison
                      </CardTitle>
                      <Button variant="ghost" size="sm" onClick={() => goToStep('delivery')}>
                        Modifier
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="text-sm space-y-1">
                    <p><span className="text-muted-foreground">Nom:</span> {customerName}</p>
                    <p><span className="text-muted-foreground">Téléphone:</span> {customerPhone}</p>
                    <p><span className="text-muted-foreground">Quartier:</span> {customerDistrict}</p>
                    <p><span className="text-muted-foreground">Adresse:</span> {customerAddress}</p>
                    {gpsLocation && <p><span className="text-muted-foreground">GPS:</span> ✓ Position enregistrée</p>}
                    {deliveryNotes && <p><span className="text-muted-foreground">Notes:</span> {deliveryNotes}</p>}
                  </CardContent>
                </Card>

                {/* Payment Summary */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-primary" />
                        Paiement
                      </CardTitle>
                      <Button variant="ghost" size="sm" onClick={() => goToStep('payment')}>
                        Modifier
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p className="flex items-center gap-2">
                      <span className="text-xl">{paymentMethods.find(p => p.id === paymentMethod)?.icon}</span>
                      {paymentMethods.find(p => p.id === paymentMethod)?.name}
                    </p>
                  </CardContent>
                </Card>

                {/* Items Summary */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <ShoppingBag className="h-4 w-4 text-primary" />
                      Produits ({items.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {items.map((item) => (
                      <div key={item.product.id} className="flex justify-between text-sm">
                        <span>{item.product.name} x{item.quantity}</span>
                        <span className="font-medium">{formatPrice(item.product.price * item.quantity)} FCFA</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => goToStep('payment')}
                    className="flex-1 h-12"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Retour
                  </Button>
                  <Button
                    onClick={handleSubmitOrder}
                    disabled={isSubmitting}
                    className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground h-14 text-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <MessageCircle className="h-5 w-5 mr-2" />
                        Confirmer la commande
                      </>
                    )}
                  </Button>
                </div>

                <p className="text-xs text-center text-muted-foreground pt-2">
                  Votre commande sera envoyée via WhatsApp pour confirmation rapide.
                </p>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Résumé</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground truncate mr-2">
                        {item.product.name} x{item.quantity}
                      </span>
                      <span className="font-medium whitespace-nowrap">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
                <Separator />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Sous-total</span>
                  <span>{formatPrice(subtotal)} FCFA</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Livraison</span>
                  <span>{formatPrice(deliveryFee)} FCFA</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(total)} FCFA</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
