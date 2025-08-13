import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const email: string = String(body.email || '').trim().toLowerCase()
    const password: string = String(body.password || '')

    if (!isValidEmail(email) || password.length < 6) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 400 })
    }

    // Create user as confirmed using service role
    const { data, error } = await supabaseServer.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (error) return NextResponse.json({ error: error.message, code: error.name }, { status: 400 })
    const user = data.user
    if (!user) return NextResponse.json({ error: 'User not returned' }, { status: 500 })

    // Upsert profile
    const { error: profileErr } = await supabaseServer
      .from('profiles')
      .upsert({ id: user.id, email, role: 'buyer' }, { onConflict: 'id' })

    if (profileErr) return NextResponse.json({ error: profileErr.message }, { status: 400 })

    return NextResponse.json({ ok: true, user: { id: user.id, email } }, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Signup failed' }, { status: 400 })
  }
}
