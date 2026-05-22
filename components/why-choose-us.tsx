import { Truck, ShieldCheck, Clock, CreditCard } from 'lucide-react'

const features = [
  {
    icon: Truck,
    title: 'Livraison rapide',
    description: 'Recevez vos courses en 45 minutes maximum à Bouaké.',
  },
  {
    icon: ShieldCheck,
    title: 'Produits frais garantis',
    description: 'Nous sélectionnons les meilleurs produits frais du marché pour vous.',
  },
  {
    icon: Clock,
    title: 'Service 7j/7',
    description: 'Commandez quand vous voulez, de 7h à 21h tous les jours.',
  },
  {
    icon: CreditCard,
    title: 'Paiement flexible',
    description: 'Orange Money, MTN, Wave, Moov ou paiement à la livraison.',
  },
]

export function WhyChooseUsSection() {
  return (
    <section className="py-12 md:py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Pourquoi choisir GWABO ?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Nous nous engageons à vous offrir la meilleure expérience de courses en ligne à Bouaké.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-card rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
                <feature.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
