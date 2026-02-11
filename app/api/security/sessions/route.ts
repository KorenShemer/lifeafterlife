import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// GET all sessions
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("user_sessions")
      .select("*")
      .eq("user_id", user.id)
      .order("last_active", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE session(s)
export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");
    const signOutAll = searchParams.get("all") === "true";

    if (signOutAll) {
      // Sign out all sessions except current
      const { error } = await supabase
        .from("user_sessions")
        .delete()
        .eq("user_id", user.id)
        .neq("is_current", true);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: "All sessions signed out" });
    }

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID required" },
        { status: 400 }
      );
    }

    // Sign out specific session
    const { error } = await supabase
      .from("user_sessions")
      .delete()
      .eq("id", sessionId)
      .eq("user_id", user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST new session (on login)
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { device_name, device_type, location, ip_address, user_agent } = body;

    // Mark all other sessions as not current
    await supabase
      .from("user_sessions")
      .update({ is_current: false })
      .eq("user_id", user.id);

    // Create new session
    const { data, error } = await supabase
      .from("user_sessions")
      .insert({
        user_id: user.id,
        device_name,
        device_type,
        location,
        ip_address,
        user_agent,
        is_current: true,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}