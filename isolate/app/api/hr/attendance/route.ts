import { NextResponse } from 'next/server';
import { getSupabaseClient, supabaseNotConfigured } from '@/lib/supabase/lazy';

export async function GET() {
  const supabase = getSupabaseClient();
  if (!supabase) return supabaseNotConfigured();

  try {
    const { data, error } = await supabase
      .from('attendance')
      .select('*, employee(*)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch attendance' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const supabase = getSupabaseClient();
  if (!supabase) return supabaseNotConfigured();

  try {
    const body = await request.json();
    const { data, error } = await supabase
      .from('attendance')
      .insert([body])
      .select();

    if (error) throw error;
    return NextResponse.json(data[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to record attendance' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const supabase = getSupabaseClient();
  if (!supabase) return supabaseNotConfigured();

  try {
    const body = await request.json();
    const { id, check_out_time } = body;
    
    const { data, error } = await supabase
      .from('attendance')
      .update({ check_out_time })
      .eq('id', id)
      .select();

    if (error) throw error;
    return NextResponse.json(data[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update checkout' }, { status: 500 });
  }
}
