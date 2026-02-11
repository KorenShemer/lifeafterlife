import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/settings - Get user settings
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("user_settings")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error && error.code !== "PGRST116") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // If no settings exist, create default ones
    if (!data) {
      const { data: newSettings, error: createError } = await supabase
        .from("user_settings")
        .insert({
          user_id: user.id,
          last_verified: new Date().toISOString(),
        })
        .select()
        .single();

      if (createError) {
        return NextResponse.json(
          { error: createError.message },
          { status: 400 },
        );
      }

      return NextResponse.json({ settings: newSettings });
    }

    return NextResponse.json({ settings: data });
  } catch (_) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// PUT /api/settings - Update user settings
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      routine_checkin_days,
      first_warning_offset_days,
      final_warning_offset_days,
      check_in_frequency,
      grace_period,
      notification_preferences,
      timezone,
    } = await request.json();

    // Use UPDATE instead of UPSERT - settings should exist from GET
    const { data, error } = await supabase
      .from("user_settings")
      .update({
        ...(routine_checkin_days !== undefined && { routine_checkin_days }),
        ...(first_warning_offset_days !== undefined && {
          first_warning_offset_days,
        }),
        ...(final_warning_offset_days !== undefined && {
          final_warning_offset_days,
        }),
        ...(check_in_frequency !== undefined && { check_in_frequency }),
        ...(grace_period !== undefined && { grace_period }),
        ...(notification_preferences !== undefined && {
          notification_preferences,
        }),
        ...(timezone !== undefined && { timezone }),
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ settings: data });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
