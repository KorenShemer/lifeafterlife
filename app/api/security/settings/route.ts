import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("security_settings")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error && error.code !== "PGRST116") { // Not found is ok
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Return default settings if none exist
    const settings = data || {
      two_factor_enabled: false,
      biometric_enabled: false,
      login_alerts: true,
      verification_reminders: true,
      security_alerts: true,
    };

    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      two_factor_enabled,
      biometric_enabled,
      login_alerts,
      verification_reminders,
      security_alerts,
    } = body;

    const { data, error } = await supabase
      .from("security_settings")
      .upsert({
        user_id: user.id,
        two_factor_enabled,
        biometric_enabled,
        login_alerts,
        verification_reminders,
        security_alerts,
        updated_at: new Date().toISOString(),
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