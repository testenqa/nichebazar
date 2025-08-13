'use client'

import { useEffect, useMemo, useState, Fragment } from 'react'

type Biz = {
  id: string
  name: string
  email: string | null
  phone: string | null
  city: string | null
  state: string | null
  address: string | null
  zip_code: string | null
  category: string
  is_verified: boolean
  rejected?: boolean | null
  rejection_comment?: string | null
  created_at: string
  owner_name: string | null
  instagram_handle: string | null
  description: string | null
  products_services: string | null
  website: string | null
  image_url: string | null
}

export default function AdminBusinessesPage() {
  const [rows, setRows] = useState<Biz[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openDetails, setOpenDetails] = useState<Record<string, boolean>>({})

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/businesses', { cache: 'no-store' })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || 'Failed to load')
      setRows(Array.isArray(json?.data) ? json.data : [])
    } catch (e: any) {
      setError(e?.message || 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const pending = useMemo(() => rows.filter(r => !r.is_verified && !r.rejected), [rows])
  const approved = useMemo(() => rows.filter(r => r.is_verified), [rows])
  const rejected = useMemo(() => rows.filter(r => r.rejected), [rows])

  const approve = async (id: string) => {
    const res = await fetch(`/api/businesses/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'approve' }) })
    if (res.ok) load()
  }

  const reject = async (id: string) => {
    const comment = window.prompt('Add a rejection comment (optional):') || ''
    const res = await fetch(`/api/businesses/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'reject', comment }) })
    if (res.ok) load()
  }

  const toggle = (id: string) => setOpenDetails(prev => ({ ...prev, [id]: !prev[id] }))

  const DetailsRow = ({ b, colSpan }: { b: Biz, colSpan: number }) => (
    <tr>
      <td colSpan={colSpan} className="bg-gray-50">
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-500">Owner</div>
              <div className="text-gray-900">{b.owner_name || '-'}</div>
            </div>
            <div>
              <div className="text-gray-500">Email</div>
              <div className="text-gray-900 break-all">{b.email || '-'}</div>
            </div>
            <div>
              <div className="text-gray-500">Phone</div>
              <div className="text-gray-900">{b.phone || '-'}</div>
            </div>
            <div>
              <div className="text-gray-500">Category</div>
              <div className="text-gray-900">{b.category}</div>
            </div>
            <div className="md:col-span-2">
              <div className="text-gray-500">Description</div>
              <div className="text-gray-900 whitespace-pre-wrap">{b.description || '-'}</div>
            </div>
            <div className="md:col-span-2">
              <div className="text-gray-500">Products and Services</div>
              <div className="text-gray-900 whitespace-pre-wrap">{b.products_services || '-'}</div>
            </div>
            <div>
              <div className="text-gray-500">Instagram</div>
              <div className="text-gray-900">{b.instagram_handle || '-'}</div>
            </div>
            <div>
              <div className="text-gray-500">Website</div>
              <div className="text-gray-900 break-all">{b.website || '-'}</div>
            </div>
            <div className="md:col-span-2">
              <div className="text-gray-500">Address</div>
              <div className="text-gray-900">{[b.address, b.city, b.state, b.zip_code].filter(Boolean).join(', ') || '-'}</div>
            </div>
            {b.image_url && (
              <div className="md:col-span-2">
                <div className="text-gray-500">Image</div>
                <img src={b.image_url} alt="Business" className="mt-1 h-24 w-24 object-cover rounded border" />
              </div>
            )}
            {b.rejected && (
              <div className="md:col-span-2">
                <div className="text-gray-500">Rejection Comment</div>
                <div className="text-gray-900 whitespace-pre-wrap">{b.rejection_comment || '-'}</div>
              </div>
            )}
          </div>
        </div>
      </td>
    </tr>
  )

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin — Business Submissions</h1>
        <p className="text-gray-600 mt-2">Review, approve or reject newly submitted businesses.</p>
      </div>

      {loading && <div className="text-gray-600">Loading…</div>}
      {error && <div className="mb-4 rounded-md bg-red-50 border border-red-200 p-3 text-red-800">{error}</div>}

      {!loading && (
        <div className="space-y-10">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Pending Approval ({pending.length})</h2>
            {pending.length === 0 ? (
              <p className="text-gray-600">No pending submissions.</p>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pending.map((b) => (
                      <Fragment key={b.id}>
                        <tr>
                          <td className="px-4 py-3">
                            <div className="font-medium text-gray-900">{b.name}</div>
                            <div className="text-xs text-gray-500">Submitted {new Date(b.created_at).toLocaleString()}</div>
                          </td>
                          <td className="px-4 py-3">{b.category}</td>
                          <td className="px-4 py-3">{b.city}, {b.state}</td>
                          <td className="px-4 py-3">
                            <div className="text-sm text-gray-700">{b.email}</div>
                            <div className="text-sm text-gray-700">{b.phone}</div>
                          </td>
                          <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                            <button onClick={() => toggle(b.id)} className="px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50">
                              {openDetails[b.id] ? 'Hide details' : 'Details'}
                            </button>
                            <button onClick={() => reject(b.id)} className="px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50">Reject</button>
                            <button onClick={() => approve(b.id)} className="px-3 py-1.5 rounded-md bg-green-600 text-white hover:bg-green-700">Approve</button>
                          </td>
                        </tr>
                        {openDetails[b.id] && <DetailsRow b={b} colSpan={5} />}
                      </Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Approved ({approved.length})</h2>
            {approved.length === 0 ? (
              <p className="text-gray-600">No approved businesses yet.</p>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {approved.map((b) => (
                      <Fragment key={b.id}>
                        <tr>
                          <td className="px-4 py-3">
                            <div className="font-medium text-gray-900">{b.name}</div>
                            <div className="text-xs text-green-700">Verified</div>
                          </td>
                          <td className="px-4 py-3">{b.category}</td>
                          <td className="px-4 py-3">{b.city}, {b.state}</td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm text-gray-700">{b.email}</div>
                            <div className="text-sm text-gray-700">{b.phone}</div>
                          </td>
                          <td className="px-4 py-3 text-right whitespace-nowrap">
                            <button onClick={() => toggle(b.id)} className="px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50">
                              {openDetails[b.id] ? 'Hide details' : 'Details'}
                            </button>
                          </td>
                        </tr>
                        {openDetails[b.id] && <DetailsRow b={b} colSpan={5} />}
                      </Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Rejected ({rejected.length})</h2>
            {rejected.length === 0 ? (
              <p className="text-gray-600">No rejected submissions.</p>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {rejected.map((b) => (
                      <Fragment key={b.id}>
                        <tr>
                          <td className="px-4 py-3">
                            <div className="font-medium text-gray-900">{b.name}</div>
                            <div className="text-xs text-red-700">Rejected</div>
                          </td>
                          <td className="px-4 py-3">{b.category}</td>
                          <td className="px-4 py-3">{b.city}, {b.state}</td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm text-gray-700">{b.email}</div>
                            <div className="text-sm text-gray-700">{b.phone}</div>
                          </td>
                          <td className="px-4 py-3 text-right whitespace-nowrap">
                            <button onClick={() => toggle(b.id)} className="px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50">
                              {openDetails[b.id] ? 'Hide details' : 'Details'}
                            </button>
                          </td>
                        </tr>
                        {openDetails[b.id] && <DetailsRow b={b} colSpan={5} />}
                      </Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      )}
    </main>
  )
}
