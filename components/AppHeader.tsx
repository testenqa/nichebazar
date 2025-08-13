'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { supabaseBrowser } from '@/lib/supabase/client'
import { useCart } from '@/lib/cart/CartContext'

export default function AppHeader() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  const [menuOpen, setMenuOpen] = useState<boolean>(false)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const { totalItems } = useCart()

  useEffect(() => {
    let mounted = true
    const init = async () => {
      const { data } = await supabaseBrowser.auth.getSession()
      const hasSession = !!data.session
      if (mounted) setIsLoggedIn(hasSession)
      if (mounted) setIsAdmin(Boolean(data.session?.user?.app_metadata?.role === 'admin'))
    }
    init()
    const { data: sub } = supabaseBrowser.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session)
      setIsAdmin(Boolean(session?.user?.app_metadata?.role === 'admin'))
    })
    return () => {
      mounted = false
      sub.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!menuRef.current) return
      if (!menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    if (menuOpen) document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [menuOpen])

  const handleLogout = async () => {
    await supabaseBrowser.auth.signOut()
    window.location.assign('/')
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center">
            <Link href="/" className="text-3xl font-bold text-gray-900">
              <span className="text-blue-600">Niche</span>Bazar
            </Link>
            <p className="ml-4 text-gray-600 hidden sm:block">Discover amazing businesses in your area</p>
          </div>
          <nav className="flex items-center space-x-2 sm:space-x-4">
            <Link href="/about" className="px-3 sm:px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors">About</Link>
            <Link href="/contact" className="px-3 sm:px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors">Contact</Link>
            <Link href="/cart" className="px-3 sm:px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors relative">
              Cart
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 text-xs bg-blue-600 text-white rounded-full h-5 min-w-[20px] px-1 flex items-center justify-center">{totalItems}</span>
              )}
            </Link>
            {isLoggedIn ? (
              <>
                <Link href="/business/register" className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Add Business</Link>
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setMenuOpen((v) => !v)}
                    className="px-3 sm:px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors border border-gray-200 rounded-lg"
                    aria-haspopup="menu"
                    aria-expanded={menuOpen}
                  >
                    Account
                  </button>
                  {menuOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-20">
                      {isAdmin && (
                        <Link href="/admin/businesses" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setMenuOpen(false)}>Admin</Link>
                      )}
                      <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setMenuOpen(false)}>Profile</Link>
                      <Link href="/my/businesses" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setMenuOpen(false)}>My Businesses</Link>
                      <button onClick={handleLogout} className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Log out</button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="px-3 sm:px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors">Log in</Link>
                <Link href="/auth/signup" className="px-3 sm:px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors">Sign up</Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
