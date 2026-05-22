import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { CartProvider } from '@/lib/cart-context'
import { AuthProvider } from '@/contexts/auth-context'
import { DataProvider } from '@/contexts/data-context'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: 'GWABO - Livraison de Courses en 45 Minutes | Bouaké',
  description: 'GWABO is your local marketplace in Bouaké, Côte d\'Ivoire. Order your fresh products from home and get delivered in 45 minutes.',
  keywords: ['courses en ligne', 'livraison', 'Bouaké', 'Côte d\'Ivoire', 'épicerie africaine', 'produits frais'],
}

export const viewport: Viewport = {
  themeColor: '#085041',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className="bg-background">
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>
          <DataProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </DataProvider>
        </AuthProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
