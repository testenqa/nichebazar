'use client'

import { useEffect, useState } from 'react'
import { supabaseBrowser } from '@/lib/supabase/client'

export default function MyBusinessesPage() {
  const [email, setEmail] = useState<string>('')
  const [rows, setRows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      const { data } = await supabaseBrowser.auth.getUser()
      const userEmail = data.user?.email?.toLowerCase() || ''
      if (mounted) setEmail(userEmail)
      if (!userEmail) { setRows([]); setLoading(false); return }
      setLoading(true)
      try {
        const res = await fetch(`/api/businesses?onlyVerified=true&email=${encodeURIComponent(userEmail)}`, { cache: 'no-store' })
        const json = await res.json()
        setRows(Array.isArray(json?.data) ? json.data : [])
      } catch (_) {
        setRows([])
      } finally {
        setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Approved Businesses</h1>
      {loading ? (
        <div className="text-gray-600">Loading…</div>
      ) : rows.length === 0 ? (
        <div className="text-gray-600">No approved businesses found for {email || 'your account'}.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {rows.map((b) => (
            <div key={b.id} className="border rounded-lg p-4 bg-white">
              <div className="flex items-center gap-4">
                {b.image_url ? (
                  <img src={b.image_url} alt={b.name} className="h-16 w-16 rounded object-cover border" />
                ) : (
                  <div className="h-16 w-16 rounded bg-gray-100 flex items-center justify-center text-2xl">🏷️</div>
                )}
                <div>
                  <div className="text-lg font-semibold text-gray-900">{b.name}</div>
                  <div className="text-sm text-green-700">Approved</div>
                </div>
              </div>
              <div className="mt-3 text-sm text-gray-700 whitespace-pre-wrap">{b.description || '-'}</div>
              <div className="mt-3 text-sm text-gray-700">{[b.address, b.city, b.state, b.zip_code].filter(Boolean).join(', ')}</div>
              <div className="mt-2 text-sm text-gray-700">Email: {b.email || '-'}</div>
              <div className="text-sm text-gray-700">Phone: {b.phone || '-'}</div>
              {b.website && (
                <a href={b.website} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-sm mt-2 inline-block">Visit website</a>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
