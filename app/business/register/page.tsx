'use client'

import { useMemo, useState, useEffect } from 'react'
import Link from 'next/link'
import { businessCategories } from '@/data/businesses'
import { supabaseBrowser } from '@/lib/supabase/client'

const INDIAN_STATES = [
  // States
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
  // Union Territories
  'Andaman and Nicobar Islands','Chandigarh','Dadra and Nagar Haveli and Daman and Diu','Delhi','Jammu and Kashmir','Ladakh','Lakshadweep','Puducherry',
] as const

export default function BusinessRegistrationPage() {
  const [form, setForm] = useState({
    ownerName: '',
    name: '',
    instagramHandle: '',
    description: '',
    productsServices: '',
    category: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    email: '',
    website: '',
    imageUrl: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    const loadUserEmail = async () => {
      const { data } = await supabaseBrowser.auth.getUser()
      const userEmail = data.user?.email || ''
      if (mounted && userEmail) {
        setForm(prev => ({ ...prev, email: userEmail }))
      }
    }
    loadUserEmail()
    return () => { mounted = false }
  }, [])

  const categoryOptions = useMemo(() => businessCategories.map(c => c.name), [])

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [key]: e.target.value }))
  }

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPreview(URL.createObjectURL(file))

    const fd = new FormData()
    fd.append('file', file)
    try {
      setUploading(true)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Upload failed')
      setForm(prev => ({ ...prev, imageUrl: data.url }))
    } catch (err: any) {
      setErrorMsg(err?.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    if (!form.ownerName || !form.name || !form.description || !form.productsServices || !form.category || !form.address || !form.city || !form.state || !form.phone || !form.email) {
      setStatus('error')
      setErrorMsg('Please fill in all required fields.')
      return
    }

    try {
      setStatus('loading')
      const res = await fetch('/api/businesses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Failed to submit')
      setStatus('success')
    } catch (err: any) {
      setStatus('error')
      setErrorMsg(err?.message || 'Something went wrong')
    }
  }

  const requiredLabel = (label: string) => (
    <span>
      {label} <span className="text-red-500" aria-hidden>*</span>
    </span>
  )

  const emailLocked = Boolean(form.email)

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Register Your Business</h1>
        <p className="text-gray-600 mt-2">Provide your business details so customers can find and contact you.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {status === 'success' && (
          <div className="mb-0 rounded-md bg-green-50 border border-green-200 p-4 text-green-800">
            <div>Your business has been submitted. We will review and publish it shortly.</div>
            <div className="mt-3">
              <Link href="/" className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">Go to Home</Link>
            </div>
          </div>
        )}
        {status === 'error' && (
          <div className="mb-6 rounded-md bg-red-50 border border-red-200 p-3 text-red-800">
            {errorMsg || 'Please review the form and try again.'}
          </div>
        )}

        {status !== 'success' && (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Owner and Basic Info */}
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{requiredLabel('Name of Business Owner')}</label>
                  <input value={form.ownerName} onChange={update('ownerName')} required className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{requiredLabel('Name of Business')}</label>
                  <input value={form.name} onChange={update('name')} required className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Instagram Handle</label>
                  <input placeholder="@yourbusiness" value={form.instagramHandle} onChange={update('instagramHandle')} className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{requiredLabel('Phone Number / Whatsapp')}</label>
                  <input placeholder="(555) 555-5555" value={form.phone} onChange={update('phone')} required className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">{requiredLabel('Email')}</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={update('email')}
                    required
                    disabled={emailLocked}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                  />
                  {emailLocked && (
                    <p className="text-xs text-gray-500 mt-1">This email is linked to your account.</p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  <input type="url" value={form.website} onChange={update('website')} placeholder="https://example.com" className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
              </div>
            </section>

            {/* Description and Offerings */}
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">About Your Business</h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{requiredLabel('Business Description')}</label>
                  <textarea value={form.description} onChange={update('description')} required rows={4} className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{requiredLabel('Products and Services')}</label>
                  <textarea value={form.productsServices} onChange={update('productsServices')} required rows={4} className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
              </div>
            </section>

            {/* Category and Images */}
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Category & Media</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{requiredLabel('Category')}</label>
                  <select value={form.category} onChange={update('category')} required className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="" disabled>Select a category</option>
                    {categoryOptions.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image / Logo</label>
                  <div className="space-y-2">
                    <input type="file" accept="image/*" onChange={onFileChange} className="block w-full text-sm text-gray-700 file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                    {preview && (
                      <img src={preview} alt="Preview" className="h-24 w-24 object-cover rounded-md border" />
                    )}
                    {uploading && <p className="text-xs text-gray-500">Uploading…</p>}
                    {form.imageUrl && (
                      <p className="text-xs text-green-700 break-all">Uploaded URL: {form.imageUrl}</p>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Location */}
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Location</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">{requiredLabel('Address')}</label>
                  <input value={form.address} onChange={update('address')} required className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{requiredLabel('City')}</label>
                  <input value={form.city} onChange={update('city')} required className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{requiredLabel('State')}</label>
                  <select value={form.state} onChange={update('state')} required className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="" disabled>Select a state / UT</option>
                    {INDIAN_STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Zip/Postal Code</label>
                  <input value={form.zipCode} onChange={update('zipCode')} className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
              </div>
            </section>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setForm({ ownerName:'', name:'', instagramHandle:'', description:'', productsServices:'', category:'', address:'', city:'', state:'', zipCode:'', phone:'', email: form.email, website:'', imageUrl:'' });
                  setPreview(null)
                  setStatus('idle')
                  setErrorMsg(null)
                }}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Reset
              </button>
              <button type="submit" disabled={status==='loading' || uploading} className="px-5 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors disabled:opacity-60">
                {status==='loading' ? 'Submitting…' : 'Submit'}
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  )
}
