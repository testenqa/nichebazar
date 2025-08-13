import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import { Product } from '@/types/product';
import { PostgrestSingleResponse } from '@supabase/supabase-js';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const businessId = searchParams.get('businessId');

  if (!businessId) {
    return NextResponse.json({ error: 'Business ID is required' }, { status: 400 });
  }

  const { data, error } = await supabaseServer
    .from('products')
    .select('*')
    .eq('business_id', businessId)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: data || [] });
}

export async function POST(req: Request) {
  const { name, photo, dimensions, size, price, businessId } = await req.json();

  if (!name || !businessId || !price) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const { data, error }: PostgrestSingleResponse<Product> = await supabaseServer
    .from('products')
    .insert([{ name, photo, dimensions, size, price, business_id: businessId }])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }

  return NextResponse.json({ product: data }, { status: 201 });
}