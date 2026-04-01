import { NextRequest, NextResponse } from "next/server";
import { sanitizeHomePreferences, type HomePreferences } from "@/lib/user-preferences";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://YOUR_PROJECT.supabase.co" &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ homePreferences: null, mode: "guest" });
  }

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ homePreferences: null, mode: "guest" });
    }

    const { data, error } = await supabase
      .from("user_app_preferences")
      .select("home_preferences")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      console.error("[preferences:get]", error);
      return NextResponse.json({ error: "Failed to load preferences" }, { status: 500 });
    }

    return NextResponse.json({
      homePreferences: data?.home_preferences
        ? sanitizeHomePreferences(data.home_preferences as Partial<HomePreferences>)
        : null,
      mode: "account",
    });
  } catch (error) {
    console.error("[preferences:get]", error);
    return NextResponse.json({ error: "Failed to load preferences" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: true, persisted: false, mode: "guest" });
  }

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ ok: true, persisted: false, mode: "guest" });
    }

    const body = (await req.json()) as {
      homePreferences?: Partial<HomePreferences>;
    };
    const homePreferences = sanitizeHomePreferences(body.homePreferences);

    const { error } = await supabase.from("user_app_preferences").upsert(
      {
        user_id: user.id,
        home_preferences: homePreferences,
      },
      { onConflict: "user_id" },
    );

    if (error) {
      console.error("[preferences:post]", error);
      return NextResponse.json({ error: "Failed to save preferences" }, { status: 500 });
    }

    return NextResponse.json({ ok: true, persisted: true, mode: "account" });
  } catch (error) {
    console.error("[preferences:post]", error);
    return NextResponse.json({ error: "Failed to save preferences" }, { status: 500 });
  }
}
