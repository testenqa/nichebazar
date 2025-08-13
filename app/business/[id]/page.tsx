'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Product } from '@/types/product'

export default function BusinessDetailsPage() {
  const params = useParams()
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id
  const [row, setRow] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    let mounted = true
    const load = async () => {
      if (!id) return
      setLoading(true)
      try {
        const [businessRes, productsRes] = await Promise.all([
          fetch('/api/businesses', { cache: 'no-store' }),
          fetch(`/api/products?businessId=${id}`, { cache: 'no-store' })
        ])
        
        const businessJson = await businessRes.json()
        const productsJson = await productsRes.json()
        
        const items = Array.isArray(businessJson?.data) ? businessJson.data : []
        const found = items.find((b: any) => String(b.id) === String(id)) || null
        
        if (mounted) {
          setRow(found)
          setProducts(Array.isArray(productsJson?.data) ? productsJson.data : [])
        }
      } catch (_) {
        if (mounted) {
          setRow(null)
          setProducts([])
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [id])

  if (loading) return <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">Loading…</main>
  if (!row) return <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">Business not found.</main>

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-start gap-6">
        {row.image_url ? (
          <img src={row.image_url} alt={row.name} className="h-40 w-40 rounded object-cover border" />
        ) : (
          <div className="h-40 w-40 rounded bg-gray-100 flex items-center justify-center text-5xl">🏷️</div>
        )}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{row.name}</h1>
          <div className="text-sm text-gray-600 mt-1">Category: {row.category}</div>
          {row.is_verified && <div className="text-sm text-green-700 mt-1">Approved</div>}
          {row.rejected && <div className="text-sm text-red-700 mt-1">Rejected</div>}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-900">About</h2>
          <div className="text-gray-700 whitespace-pre-wrap">{row.description || '-'}</div>
          <div>
            <div className="text-sm text-gray-500">Products and Services</div>
            <div className="text-gray-700 whitespace-pre-wrap">{row.products_services || '-'}</div>
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-900">Contact</h2>
          <div className="text-gray-700">Email: {row.email || '-'}</div>
          <div className="text-gray-700">Phone: {row.phone || '-'}</div>
          {row.website && (
            <a href={row.website} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Visit website</a>
          )}
        </section>

        <section className="space-y-2 md:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900">Location</h2>
          <div className="text-gray-700">{[row.address, row.city, row.state, row.zip_code].filter(Boolean).join(', ') || '-'}</div>
        </section>

        {row.instagram_handle && (
          <section className="space-y-2 md:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900">Social</h2>
            <a href={`https://instagram.com/${row.instagram_handle.replace(/^@/, '')}`} target="_blank" rel="noreferrer" className="text-pink-600 hover:underline">Instagram</a>
          </section>
        )}

        {row.rejected && row.rejection_comment && (
          <section className="space-y-2 md:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900">Rejection Comment</h2>
            <div className="text-gray-700 whitespace-pre-wrap">{row.rejection_comment}</div>
          </section>
        )}

        {products.length > 0 && (
          <section className="space-y-4 md:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900">Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow overflow-hidden">
                  {product.photo ? (
                    <img src={product.photo} alt={product.name} className="h-48 w-full object-cover" />
                  ) : (
                    <div className="h-48 w-full bg-gray-100 flex items-center justify-center text-4xl">📦</div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900">{product.name}</h3>
                    <div className="mt-2 text-sm text-gray-600">
                      {product.dimensions && <div>Dimensions: {product.dimensions}</div>}
                      {product.size && <div>Size: {product.size}</div>}
                    </div>
                    <div className="mt-2 text-lg font-medium text-gray-900">${product.price.toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
