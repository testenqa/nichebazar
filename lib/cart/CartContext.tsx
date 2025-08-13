'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { CartItem, CartState } from '@/types/cart'

type CartContextValue = {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void
  removeItem: (productId: string) => void
  clear: () => void
  setQuantity: (productId: string, quantity: number) => void
  totalItems: number
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

const STORAGE_KEY = 'nb_cart_v1'

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (!raw) return []
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed as CartItem[]
      if (Array.isArray(parsed?.items)) return parsed.items as CartItem[]
      return []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      const state: CartState = { items }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {}
  }, [items])

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return
      try {
        const raw = e.newValue
        if (!raw) return setItems([])
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) setItems(parsed)
        else if (Array.isArray(parsed?.items)) setItems(parsed.items)
      } catch {}
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const addItem = useCallback((item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    setItems(prev => {
      const idx = prev.findIndex(i => i.productId === item.productId)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = { ...next[idx], quantity: next[idx].quantity + (item.quantity ?? 1) }
        return next
      }
      return [...prev, { ...item, quantity: item.quantity ?? 1 } as CartItem]
    })
  }, [])

  const removeItem = useCallback((productId: string) => {
    setItems(prev => prev.filter(i => i.productId !== productId))
  }, [])

  const setQuantity = useCallback((productId: string, quantity: number) => {
    setItems(prev => prev.map(i => i.productId === productId ? { ...i, quantity: Math.max(1, quantity) } : i))
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const totalItems = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items])

  const value = useMemo<CartContextValue>(() => ({ items, addItem, removeItem, clear, setQuantity, totalItems }), [items, addItem, removeItem, clear, setQuantity, totalItems])

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}


