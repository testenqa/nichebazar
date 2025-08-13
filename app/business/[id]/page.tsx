'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

export default function BusinessDetailsPage() {
  const params = useParams()
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id
  const [row, setRow] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      if (!id) return
      setLoading(true)
      try {
        const res = await fetch('/api/businesses', { cache: 'no-store' })
        const json = await res.json()
        const items = Array.isArray(json?.data) ? json.data : []
        const found = items.find((b: any) => String(b.id) === String(id)) || null
        if (mounted) setRow(found)
      } catch (_) {
        if (mounted) setRow(null)
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
      </div>
    </main>
  )
}
