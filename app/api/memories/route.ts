import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/memories - Get user's memories
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('memories')
      .select(`
        *,
        memory_recipients (
          recipient_id,
          recipients (
            id,
            name,
            email
          )
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ memories: data });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/memories - Create a new memory
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, content, media_url, media_type, scheduled_release_date, recipient_ids } = await request.json();

    // Create memory
    const { data: memory, error: memoryError } = await supabase
      .from('memories')
      .insert({
        user_id: user.id,
        title,
        content,
        media_url,
        media_type,
        scheduled_release_date,
      })
      .select()
      .single();

    if (memoryError) {
      return NextResponse.json({ error: memoryError.message }, { status: 400 });
    }

    // Link recipients if provided
    if (recipient_ids && recipient_ids.length > 0) {
      const memoryRecipients = recipient_ids.map((recipient_id: string) => ({
        memory_id: memory.id,
        recipient_id,
      }));

      const { error: linkError } = await supabase
        .from('memory_recipients')
        .insert(memoryRecipients);

      if (linkError) {
        console.error('Error linking recipients:', linkError);
      }
    }

    return NextResponse.json({ memory }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
