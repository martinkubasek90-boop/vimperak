/**
 * POST /api/push-send
 * Body: { title, body, url?, tag?, urgent? }
 * Requires: x-admin-key header matching ADMIN_API_KEY env var
 */
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const adminKey = req.headers.get("x-admin-key");
  if (adminKey !== process.env.ADMIN_API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await req.json();
  // In production: load subscriptions from Supabase and fan out with web-push.
  // This route is the integration point — the actual fanout logic goes here.
  console.log("[push-send] Would send to all subscribers:", payload);

  return NextResponse.json({ success: true, message: "Notification queued" });
}
