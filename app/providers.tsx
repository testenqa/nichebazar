'use client'

import { CartProvider } from '@/lib/cart/CartContext'
import { ToastProvider } from '@/lib/toast/ToastContext'
import Toaster from '@/components/Toaster'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <CartProvider>
        {children}
        <Toaster />
      </CartProvider>
    </ToastProvider>
  )
}


