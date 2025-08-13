import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const onlyVerified = searchParams.get('onlyVerified') === 'true'
  const emailFilter = (searchParams.get('email') || '').trim().toLowerCase()

  let query = supabaseServer
    .from('businesses')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  if (onlyVerified) {
    // @ts-ignore - chained query typed loosely by SDK
    query = query.eq('is_verified', true)
  }

  if (emailFilter) {
    // @ts-ignore
    query = query.eq('email', emailFilter)
  }

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const name: string = (body.name || '').trim()
    const email: string = (body.email || '').trim().toLowerCase()

    if (!name || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data: existing, error: findErr } = await supabaseServer
      .from('businesses')
      .select('id, is_verified')
      .ilike('name', name)
      .eq('email', email)
      .limit(1)
      .maybeSingle()

    if (findErr) {
      return NextResponse.json({ error: findErr.message }, { status: 400 })
    }

    if (existing) {
      return NextResponse.json({ error: 'A submission for this business already exists with this email.' }, { status: 409 })
    }

    const payload = {
      owner_name: body.ownerName ?? null,
      name,
      instagram_handle: body.instagramHandle ?? null,
      description: body.description,
      products_services: body.productsServices ?? null,
      category: body.category,
      address: body.address ?? null,
      city: body.city ?? null,
      state: body.state ?? null,
      zip_code: body.zipCode ?? null,
      phone: body.phone ?? null,
      email,
      website: body.website ?? null,
      image_url: body.imageUrl ?? null,
      tags: body.tags ? String(body.tags).split(',').map((t: string) => t.trim()) : [],
      is_verified: false,
      rejected: false,
      rejection_comment: null,
    }

    const { data, error } = await supabaseServer.from('businesses').insert(payload).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ data }, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Invalid request' }, { status: 400 })
  }
}
