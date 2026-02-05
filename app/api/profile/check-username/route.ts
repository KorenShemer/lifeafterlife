import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json();

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required', available: false },
        { status: 400 }
      );
    }

    // Validate username format
    if (username.length < 3) {
      return NextResponse.json(
        { error: 'Username must be at least 3 characters', available: false },
        { status: 400 }
      );
    }

    if (!/^[a-z0-9_-]+$/.test(username)) {
      return NextResponse.json(
        { error: 'Username can only contain lowercase letters, numbers, underscores, and dashes', available: false },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Check if username exists
    const { data, error } = await supabase
      .from('users')
      .select('username')
      .eq('username', username)
      .maybeSingle();

    if (error) {
      console.error('Username check error:', error);
      return NextResponse.json(
        { error: 'Failed to check username', available: true }, // Allow on error
        { status: 500 }
      );
    }

    // If data exists, username is taken
    if (data) {
      return NextResponse.json({
        available: false,
        error: 'Username already taken',
      });
    }

    // Username is available
    return NextResponse.json({
      available: true,
    });
  } catch (error) {
    console.error('Check username error:', error);
    return NextResponse.json(
      { error: 'Internal server error', available: true },
      { status: 500 }
    );
  }
}