import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/profile - Get current user's profile
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ profile });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/profile - Update user profile
export async function PUT(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { 
      username, 
      full_name, 
      phone, 
      date_of_birth, 
      bio, 
      avatar_url,
      profile_completed 
    } = await request.json();

    // Check if username is already taken (if changing username)
    if (username) {
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('username', username.toLowerCase())
        .neq('id', user.id)
        .single();

      if (existingUser) {
        return NextResponse.json(
          { error: 'Username already taken' },
          { status: 400 }
        );
      }
    }

    const updates: any = {
      updated_at: new Date().toISOString(),
    };

    if (username !== undefined) updates.username = username.toLowerCase();
    if (full_name !== undefined) updates.full_name = full_name;
    if (phone !== undefined) updates.phone = phone;
    if (date_of_birth !== undefined) updates.date_of_birth = date_of_birth;
    if (bio !== undefined) updates.bio = bio;
    if (avatar_url !== undefined) updates.avatar_url = avatar_url;
    if (profile_completed !== undefined) {
      updates.profile_completed = profile_completed;
      if (profile_completed) {
        updates.onboarding_completed_at = new Date().toISOString();
      }
    }

    const { data: profile, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ profile });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/profile/check-username - Check if username is available
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { username } = await request.json();

    if (!username || username.length < 3 || username.length > 30) {
      return NextResponse.json(
        { available: false, error: 'Username must be 3-30 characters' },
        { status: 400 }
      );
    }

    const cleanUsername = username.toLowerCase().trim();
    
    // Check format
    if (!/^[a-z0-9_-]+$/.test(cleanUsername)) {
      return NextResponse.json(
        { available: false, error: 'Username can only contain lowercase letters, numbers, underscores, and dashes' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('users')
      .select('username')
      .eq('username', cleanUsername)
      .single();

    if (error && error.code !== 'PGRST116') {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ 
      available: !data,
      username: cleanUsername 
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}