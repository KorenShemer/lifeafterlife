import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/checkins - Get user's check-ins
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('checkins')
      .select('*')
      .eq('user_id', user.id)
      .order('checked_in_at', { ascending: false })
      .limit(10);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ checkins: data });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/checkins - Create a new check-in and reset last_verified
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { method = 'manual', notes } = body;

    const now = new Date().toISOString();

    // Insert checkin row
    const { data, error } = await supabase
      .from('checkins')
      .insert({
        user_id: user.id,
        method,
        status: 'completed',
        notes,
        checked_in_at: now,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Update last_verified so the countdown resets
    const { error: settingsError } = await supabase
      .from('user_settings')
      .update({
        last_verified: now,
        updated_at: now,
      })
      .eq('user_id', user.id);

    if (settingsError) {
      // Non-fatal: checkin was saved, just log the settings update failure
      console.error('Failed to update last_verified:', settingsError.message);
    }

    return NextResponse.json({ checkin: data }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}