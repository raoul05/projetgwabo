'use client'

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react'
import { Product, CartItem } from './types'

interface CartContextType {
  items: CartItem[]
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getItemQuantity: (productId: string) => number
  subtotal: number
  deliveryFee: number
  total: number
  itemCount: number
  isHydrated: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const DELIVERY_FEE = 500
const CART_STORAGE_KEY = 'gwabo-cart'

function loadCartFromStorage(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed)) {
        return parsed
      }
    }
  } catch (error) {
    console.error('Error loading cart from localStorage:', error)
  }
  return []
}

function saveCartToStorage(items: CartItem[]) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  } catch (error) {
    console.error('Error saving cart to localStorage:', error)
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isHydrated, setIsHydrated] = useState(false)

  // Load cart from localStorage on mount (client-side only)
  useEffect(() => {
    const storedItems = loadCartFromStorage()
    setItems(storedItems)
    setIsHydrated(true)
  }, [])

  // Persist cart to localStorage whenever items change (after hydration)
  useEffect(() => {
    if (isHydrated) {
      saveCartToStorage(items)
    }
  }, [items, isHydrated])

  const addToCart = useCallback((product: Product, quantity: number = 1) => {
    setItems(prev => {
      const existing = prev.find(item => item.product.id === product.id)
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...prev, { product, quantity }]
    })
  }, [])

  const removeFromCart = useCallback((productId: string) => {
    setItems(prev => prev.filter(item => item.product.id !== productId))
  }, [])

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems(prev => prev.filter(item => item.product.id !== productId))
      return
    }
    setItems(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    )
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const getItemQuantity = useCallback((productId: string) => {
    return items.find(item => item.product.id === productId)?.quantity || 0
  }, [items])

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )

  const deliveryFee = items.length > 0 ? DELIVERY_FEE : 0
  const total = subtotal + deliveryFee
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getItemQuantity,
        subtotal,
        deliveryFee,
        total,
        itemCount,
        isHydrated,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
