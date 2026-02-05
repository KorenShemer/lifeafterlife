import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/profile - Get current user's profile
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
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
    console.error('❌ GET Profile Error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/profile - Update user profile
export async function PUT(request: NextRequest) {
  console.log('🔵 PUT /api/profile called');
  
  try {
    console.log('🔵 Creating Supabase client...');
    const supabase = await createClient();
    
    console.log('🔵 Getting authenticated user...');
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError) {
      console.error('❌ Auth error:', authError);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (!user) {
      console.error('❌ No user found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('✅ User authenticated:', user.id, user.email);

    console.log('🔵 Parsing request body...');
    const body = await request.json();
    console.log('✅ Request body:', JSON.stringify(body, null, 2));

    const { 
      username, 
      full_name, 
      phone, 
      date_of_birth, 
      bio, 
      avatar_url,
      profile_completed 
    } = body;

    // Check if username is already taken (if changing username)
    if (username) {
      console.log('🔵 Checking if username is taken:', username);
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('id')
        .eq('username', username.toLowerCase())
        .neq('id', user.id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('❌ Username check error:', checkError);
      }

      if (existingUser) {
        console.log('❌ Username already taken');
        return NextResponse.json(
          { error: 'Username already taken' },
          { status: 400 }
        );
      }
      console.log('✅ Username available');
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

    console.log('🔵 Updates to apply:', JSON.stringify(updates, null, 2));

    console.log('🔵 Updating profile in database...');
    const { data: profile, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      console.error('❌ Supabase update error:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      return NextResponse.json({ 
        error: error.message, 
        code: error.code,
        hint: error.hint 
      }, { status: 400 });
    }

    console.log('✅ Profile updated successfully!');
    console.log('✅ Updated profile:', JSON.stringify(profile, null, 2));
    
    return NextResponse.json({ profile });
  } catch (error) {
    console.error('❌❌❌ CAUGHT ERROR ❌❌❌');
    console.error('Error:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      console.error('Error name:', error.name);
    }
    
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}