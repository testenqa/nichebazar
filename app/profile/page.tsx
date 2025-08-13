'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabaseBrowser } from '@/lib/supabase/client'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      const { data } = await supabaseBrowser.auth.getUser()
      if (mounted) setUser(data.user || null)
    }
    load()
    return () => { mounted = false }
  }, [])

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Profile</h1>
      {!user ? (
        <div className="text-gray-600">Not logged in.</div>
      ) : (
        <div className="space-y-4 bg-white border rounded-lg p-6">
          <div>
            <div className="text-gray-500 text-sm">Email</div>
            <div className="text-gray-900">{user.email}</div>
          </div>
          <div>
            <div className="text-gray-500 text-sm">User ID</div>
            <div className="text-gray-900 break-all">{user.id}</div>
          </div>
          <div className="pt-2 flex gap-3">
            <Link href="/my/businesses" className="px-3 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50">My Businesses</Link>
            <Link href="/business/register" className="px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">Add Business</Link>
          </div>
        </div>
      )}
    </main>
  )
}
