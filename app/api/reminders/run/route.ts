import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendPushToAll } from "@/lib/push-delivery";

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

function isAuthorized(req: NextRequest) {
  const authorization = req.headers.get("authorization");
  const bearerToken = authorization?.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length).trim()
    : "";
  const cronSecret = process.env.CRON_SECRET;
  const adminKey = req.headers.get("x-admin-key");

  if (cronSecret && bearerToken === cronSecret) {
    return true;
  }

  if (process.env.ADMIN_API_KEY && adminKey === process.env.ADMIN_API_KEY) {
    return true;
  }

  return false;
}

function getDeliveryCount(report: Awaited<ReturnType<typeof sendPushToAll>>) {
  return report.web.delivered + report.android.delivered + report.ios.delivered;
}

function hasEventWindowPassed(date: string, time: string) {
  const parsed = new Date(`${date}T${time || "18:00"}:00`);
  if (Number.isNaN(parsed.getTime())) return true;
  return parsed.getTime() <= Date.now() + 30 * 60 * 1000;
}

async function runReminderScheduler(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json({ ok: true, processed: 0, persisted: false });
  }

  try {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from("event_reminders")
      .select("id, installation_id, event_title, event_date, event_time, event_place, event_url")
      .is("sent_at", null)
      .lte("remind_at", now)
      .order("remind_at", { ascending: true })
      .limit(100);

    if (error) throw error;

    let processed = 0;
    let delivered = 0;
    let deferred = 0;
    let expired = 0;

    for (const item of data ?? []) {
      const report = await sendPushToAll({
        title: "Připomínka akce",
        body: `${item.event_title} začíná v ${item.event_time} · ${item.event_place}`,
        url: item.event_url,
        tag: `event-reminder-${item.id}`,
        installationIds: [item.installation_id],
      });

      const deliveryCount = getDeliveryCount(report);

      if (deliveryCount > 0 || hasEventWindowPassed(item.event_date, item.event_time)) {
        const { error: updateError } = await supabase
          .from("event_reminders")
          .update({ sent_at: new Date().toISOString() })
          .eq("id", item.id);

        if (updateError) throw updateError;
      } else {
        deferred += 1;
      }

      processed += 1;
      delivered += deliveryCount;
      if (deliveryCount === 0 && hasEventWindowPassed(item.event_date, item.event_time)) {
        expired += 1;
      }
    }

    return NextResponse.json({ ok: true, processed, delivered, deferred, expired, persisted: true });
  } catch (error) {
    console.error("[reminders:run]", error);
    return NextResponse.json({ error: "Failed to process reminders" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  return runReminderScheduler(req);
}

export async function POST(req: NextRequest) {
  return runReminderScheduler(req);
}
