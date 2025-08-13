import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const id: string | undefined = body.id
    const email: string | undefined = body.email
    const role: 'buyer' | 'vendor' | 'both' | undefined = body.role

    if (!id || !email) {
      return NextResponse.json({ error: 'Missing id or email' }, { status: 400 })
    }

    const { data, error } = await supabaseServer
      .from('profiles')
      .upsert({
        id,
        email,
        role: role ?? 'buyer',
      }, { onConflict: 'id' })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ data })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Invalid request' }, { status: 400 })
  }
}
