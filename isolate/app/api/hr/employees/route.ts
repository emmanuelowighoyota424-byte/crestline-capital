import { NextResponse } from 'next/server';
import { getSupabaseClient, supabaseNotConfigured } from '@/lib/supabase/lazy';

export async function GET() {
  const supabase = getSupabaseClient();
  if (!supabase) return supabaseNotConfigured();

  try {
    const { data, error } = await supabase
      .from('employee')
      .select('*, department(*)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch employees' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const supabase = getSupabaseClient();
  if (!supabase) return supabaseNotConfigured();

  try {
    const body = await request.json();
    const { data, error } = await supabase
      .from('employee')
      .insert([body])
      .select();

    if (error) throw error;
    return NextResponse.json(data[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create employee' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const supabase = getSupabaseClient();
  if (!supabase) return supabaseNotConfigured();

  try {
    const body = await request.json();
    const { id, ...updates } = body;
    
    const { data, error } = await supabase
      .from('employee')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) throw error;
    return NextResponse.json(data[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update employee' }, { status: 500 });
  }
}
