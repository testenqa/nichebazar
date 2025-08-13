import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'

const BUCKET = 'business-images'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const ext = file.name.split('.').pop() || 'bin'
    const safeName = file.name.replace(/[^a-zA-Z0-9_.-]/g, '_')
    const filePath = `public/${Date.now()}-${Math.random().toString(36).slice(2)}-${safeName}`

    // Convert Web File/Blob to Buffer for Node environment
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { error: uploadError } = await supabaseServer.storage
      .from(BUCKET)
      .upload(filePath, buffer, {
        contentType: file.type || `image/${ext}`,
        upsert: false,
      })

    if (uploadError) {
      // Common causes: bucket does not exist or insufficient permissions
      return NextResponse.json({ error: `Upload failed: ${uploadError.message}. Ensure bucket "${BUCKET}" exists and allows uploads.` }, { status: 400 })
    }

    const { data } = supabaseServer.storage.from(BUCKET).getPublicUrl(filePath)
    return NextResponse.json({ url: data.publicUrl, path: filePath })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Upload failed' }, { status: 500 })
  }
}
