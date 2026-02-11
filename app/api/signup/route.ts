import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// POST /api/profile/check-username - Check if username is available
export async function POST(request: NextRequest) {
  try {
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

    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('users')
      .select('username')
      .eq('username', cleanUsername)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 means no rows returned, which is what we want
      console.error('Error checking username:', error);
      return NextResponse.json(
        { available: false, error: 'Error checking username availability' },
        { status: 500 }
      );
    }

    // If data exists, username is taken. If no data (error PGRST116), it's available
    return NextResponse.json({ 
      available: !data,
      username: cleanUsername 
    });
  } catch (error) {
    console.error('Username check error:', error);
    return NextResponse.json(
      { available: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}