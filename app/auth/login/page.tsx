'use client'

import { useState } from 'react'
import { supabaseBrowser } from '@/lib/supabase/client'
import Link from 'next/link'

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<'idle'|'loading'|'error'>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)
    setStatus('loading')
    try {
      const normalizedEmail = normalizeEmail(email)
      const { error } = await supabaseBrowser.auth.signInWithPassword({ email: normalizedEmail, password })
      if (error) {
        setStatus('error')
        setErrorMsg(error.message)
        return
      }
      const sp = new URLSearchParams(window.location.search)
      const next = sp.get('next') || '/'
      window.location.assign(next)
    } catch (err: any) {
      setStatus('error')
      setErrorMsg(err?.message || 'Login failed')
    } finally {
      setStatus((prev) => (prev === 'loading' ? 'idle' : prev))
    }
  }

  return (
    <main className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-6">Log in</h1>
      {status === 'error' && (
        <div className="rounded-md bg-red-50 border border-red-200 p-3 text-red-800 mb-4">{errorMsg}</div>
      )}
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <button type="submit" disabled={status==='loading'} className="w-full px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-60">{status==='loading' ? 'Signing in…' : 'Log in'}</button>
      </form>
      <p className="text-sm text-gray-600 mt-4">No account? <Link href="/auth/signup" className="underline">Sign up</Link></p>
    </main>
  )
}
