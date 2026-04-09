import { NextRequest, NextResponse } from "next/server";
import { castVote } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { optionId?: string };
    if (!body.optionId) {
      return NextResponse.json({ error: "Missing optionId" }, { status: 400 });
    }

    const result = await castVote(body.optionId);
    if (!result.success) {
      return NextResponse.json({ error: "Vote failed" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[vote]", error);
    return NextResponse.json({ error: "Vote failed" }, { status: 500 });
  }
}
