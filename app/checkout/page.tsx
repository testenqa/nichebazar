'use client'

import { useCart } from '@/lib/cart/CartContext'
import { useEffect, useState } from 'react'
import { supabaseBrowser } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type Address = {
  fullName: string
  line1: string
  line2?: string
  city: string
  state: string
  postalCode: string
  phone: string
}

export default function CheckoutPage() {
  const { items, totalItems } = useCart()
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState<Address>({ fullName: '', line1: '', city: '', state: '', postalCode: '', phone: '' })
  const router = useRouter()

  const total = items.reduce((sum, i) => sum + (i.price ?? 0) * i.quantity, 0)

  useEffect(() => {
    let mounted = true
    const enforceAuth = async () => {
      const { data } = await supabaseBrowser.auth.getSession()
      if (!data.session) {
        router.replace('/auth/login?next=/checkout')
      } else if (mounted) {
        setEmail(data.session.user.email || '')
      }
    }
    enforceAuth()
    return () => { mounted = false }
  }, [router])

  const onChange = (key: keyof Address) => (e: React.ChangeEvent<HTMLInputElement>) => setAddress(prev => ({ ...prev, [key]: e.target.value }))

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Checkout</h1>
      {items.length === 0 ? (
        <div className="text-gray-600">Your cart is empty.</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className="lg:col-span-2 space-y-6">
            <div className="bg-white border rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact</h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Email</label>
                  <input value={email} disabled className="w-full rounded border px-3 py-2 bg-gray-100 text-gray-600" />
                </div>
              </div>
            </div>

            <div className="bg-white border rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-600 mb-1">Full name</label>
                  <input value={address.fullName} onChange={onChange('fullName')} className="w-full rounded border px-3 py-2" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-600 mb-1">Address line 1</label>
                  <input value={address.line1} onChange={onChange('line1')} className="w-full rounded border px-3 py-2" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-600 mb-1">Address line 2 (optional)</label>
                  <input value={address.line2 || ''} onChange={onChange('line2')} className="w-full rounded border px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">City</label>
                  <input value={address.city} onChange={onChange('city')} className="w-full rounded border px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">State</label>
                  <input value={address.state} onChange={onChange('state')} className="w-full rounded border px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Postal Code</label>
                  <input value={address.postalCode} onChange={onChange('postalCode')} className="w-full rounded border px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Phone</label>
                  <input value={address.phone} onChange={onChange('phone')} className="w-full rounded border px-3 py-2" />
                </div>
              </div>
            </div>
          </section>

          <aside className="space-y-4">
            <div className="bg-white border rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order summary</h2>
              <ul className="divide-y divide-gray-200">
                {items.map(i => (
                  <li key={i.productId} className="py-2 flex items-center justify-between text-sm">
                    <span className="text-gray-700">{i.name} × {i.quantity}</span>
                    <span className="text-gray-900">₹{((i.price ?? 0) * i.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-gray-600">Items: {totalItems}</span>
                <span className="text-lg font-semibold">Total: ₹{total.toFixed(2)}</span>
              </div>
              <button className="mt-4 w-full px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">Proceed to Payment</button>
            </div>
          </aside>
        </div>
      )}
    </main>
  )
}


