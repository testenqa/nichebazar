'use client'

import { useCart } from '@/lib/cart/CartContext'
import { supabaseBrowser } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function CartPage() {
  const { items, removeItem, setQuantity, clear, totalItems } = useCart()
  const router = useRouter()
  const [checkingOut, setCheckingOut] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const total = items.reduce((sum, i) => sum + (i.price ?? 0) * i.quantity, 0)

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Cart</h1>
      {!mounted ? (
        <div className="text-gray-600">Loading…</div>
      ) : items.length === 0 ? (
        <div className="text-gray-600">Your cart is empty.</div>
      ) : (
        <div className="space-y-6">
          <ul className="divide-y divide-gray-200 bg-white rounded-lg border">
            {items.map((i) => (
              <li key={i.productId} className="p-4 flex gap-4 items-center">
                {i.imageUrl ? (
                  <img src={i.imageUrl} alt={i.name} className="h-16 w-16 rounded object-cover border" />
                ) : (
                  <div className="h-16 w-16 rounded bg-gray-100 flex items-center justify-center">🛍️</div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">{i.name}</div>
                  <div className="text-sm text-gray-600">{i.businessName}</div>
                </div>
                <div className="flex items-center gap-2">
                  <input type="number" min={1} value={i.quantity} onChange={(e)=>setQuantity(i.productId, Number(e.target.value||1))} className="w-16 rounded border px-2 py-1" />
                  {typeof i.price === 'number' && (
                    <div className="w-24 text-right text-gray-900">₹{(i.price * i.quantity).toFixed(2)}</div>
                  )}
                  <button onClick={()=>removeItem(i.productId)} className="px-3 py-1.5 rounded-md border text-gray-700 hover:bg-gray-50">Remove</button>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between">
            <div className="text-gray-700">Items: {totalItems}</div>
            <div className="text-xl font-semibold">Total: ₹{total.toFixed(2)}</div>
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={clear} className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-50">Clear cart</button>
            <button
              disabled={checkingOut}
              onClick={async () => {
                setCheckingOut(true)
                const { data } = await supabaseBrowser.auth.getSession()
                if (!data.session) {
                  router.push('/auth/login?next=/checkout')
                  setCheckingOut(false)
                  return
                }
                router.push('/checkout')
                setCheckingOut(false)
              }}
              className="px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {checkingOut ? 'Checking…' : 'Checkout'}
            </button>
          </div>
        </div>
      )}
    </main>
  )
}


