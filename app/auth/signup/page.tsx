'use client'

import { useState } from 'react'
import { supabaseBrowser } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)
    setStatus('loading')
    try {
      const normalizedEmail = email.trim().toLowerCase()
      if (!isValidEmail(normalizedEmail)) {
        throw new Error('Please enter a valid email address')
      }

      // Create a confirmed user via server API (uses service role)
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail, password })
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || 'Signup failed')

      setStatus('success')
      // Redirect to login page after a short delay to show success message
      setTimeout(() => {
        router.push('/auth/login')
      }, 1500)
    } catch (e: any) {
      setStatus('error')
      setErrorMsg(e?.message || 'Signup failed')
    }
  }

  return (
    <main className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-6">Create your account</h1>
      {status === 'success' ? (
        <div className="rounded-md bg-green-50 border border-green-200 p-3 text-green-800 mb-4">
          Account created. Redirecting…
        </div>
      ) : null}
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
          <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required minLength={6} className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <button type="submit" disabled={status==='loading'} className="w-full px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-60">{status==='loading' ? 'Creating…' : 'Sign up'}</button>
      </form>
      <p className="text-sm text-gray-600 mt-4">Already have an account? <Link href="/auth/login" className="underline">Log in</Link></p>
    </main>
  )
}
