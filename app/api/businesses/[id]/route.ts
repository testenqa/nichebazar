import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  try {
    const body = await request.json().catch(() => ({}))
    const action: 'approve' | 'reject' | undefined = body?.action

    if (action === 'reject') {
      const rejection_comment = typeof body?.comment === 'string' ? body.comment.slice(0, 1000) : null
      const { data, error } = await supabaseServer
        .from('businesses')
        .update({ is_verified: false, rejected: true, rejection_comment })
        .eq('id', id)
        .select()
        .single()
      if (error) return NextResponse.json({ error: error.message }, { status: 400 })
      return NextResponse.json({ data })
    }

    // default: approve
    const { data, error } = await supabaseServer
      .from('businesses')
      .update({ is_verified: true, rejected: false, rejection_comment: null })
      .eq('id', id)
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ data })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to update' }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  // Soft-delete behavior is now handled by PATCH with action=reject
  return NextResponse.json({ error: 'Deletion is disabled. Use PATCH with action=\'reject\'.' }, { status: 405 })
}
