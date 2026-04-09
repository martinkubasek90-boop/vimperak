import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

function createSupabaseAdminClient() {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_URL === "https://YOUR_PROJECT.supabase.co"
  ) {
    return null;
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

function computeReminderAt(date: string, time: string | undefined, reminderType: "2h" | "1d") {
  const eventDate = new Date(`${date}T${time || "18:00"}:00`);
  return new Date(
    eventDate.getTime() - (reminderType === "1d" ? 24 * 60 * 60 * 1000 : 2 * 60 * 60 * 1000),
  ).toISOString();
}

export async function POST(req: NextRequest) {
  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json({ ok: true, persisted: false });
  }

  try {
    const body = (await req.json()) as {
      installationId?: string;
      eventId?: string;
      title?: string;
      date?: string;
      time?: string;
      place?: string;
      url?: string;
      reminderType?: "2h" | "1d";
    };

    if (!body.installationId || !body.eventId || !body.title || !body.date || !body.place || !body.url) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const reminderType = body.reminderType ?? "1d";
    const remindAt = computeReminderAt(body.date, body.time, reminderType);

    const { error: cleanupError } = await supabase
      .from("event_reminders")
      .delete()
      .eq("installation_id", body.installationId)
      .eq("event_id", body.eventId)
      .neq("reminder_type", reminderType);

    if (cleanupError) {
      throw cleanupError;
    }

    const { error } = await supabase.from("event_reminders").upsert(
      {
        installation_id: body.installationId,
        event_id: body.eventId,
        reminder_type: reminderType,
        remind_at: remindAt,
        event_title: body.title,
        event_date: body.date,
        event_time: body.time,
        event_place: body.place,
        event_url: body.url,
        sent_at: null,
      },
      { onConflict: "installation_id,event_id,reminder_type" },
    );

    if (error) {
      throw error;
    }

    return NextResponse.json({ ok: true, persisted: true, remindAt });
  } catch (error) {
    console.error("[reminders:post]", error);
    return NextResponse.json({ error: "Failed to schedule reminder" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json({ ok: true, persisted: false });
  }

  try {
    const body = (await req.json()) as {
      installationId?: string;
      eventId?: string;
      reminderType?: "2h" | "1d";
    };

    if (!body.installationId || !body.eventId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    let query = supabase
      .from("event_reminders")
      .delete()
      .eq("installation_id", body.installationId)
      .eq("event_id", body.eventId);

    if (body.reminderType) {
      query = query.eq("reminder_type", body.reminderType);
    }

    const { error } = await query;
    if (error) throw error;

    return NextResponse.json({ ok: true, persisted: true });
  } catch (error) {
    console.error("[reminders:delete]", error);
    return NextResponse.json({ error: "Failed to remove reminder" }, { status: 500 });
  }
}
