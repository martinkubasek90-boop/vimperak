/**
 * POST /api/push-send
 * Body: { title, body, url?, tag?, urgent? }
 * Requires: x-admin-key header matching ADMIN_API_KEY env var
 */
import { NextRequest, NextResponse } from "next/server";
import { sendPushToAll } from "@/lib/push-delivery";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const adminKey = req.headers.get("x-admin-key");
    if (adminKey !== process.env.ADMIN_API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await req.json() as {
      title?: string;
      body?: string;
      url?: string;
      tag?: string;
      urgent?: boolean;
      topics?: string[];
    };

    if (!payload.title || !payload.body) {
      return NextResponse.json({ error: "Missing title or body" }, { status: 400 });
    }

    const report = await sendPushToAll({
      title: payload.title,
      body: payload.body,
      url: payload.url,
      tag: payload.tag,
      urgent: payload.urgent,
      topics: payload.topics,
    });

    return NextResponse.json({
      success: true,
      message: "Notification fanout finished",
      report,
    });
  } catch (error) {
    console.error("[push-send]", error);
    return NextResponse.json({ error: "Push send failed" }, { status: 500 });
  }
}
