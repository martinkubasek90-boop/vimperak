import { NextRequest, NextResponse } from "next/server";
import { getPublicReports } from "@/lib/public-content";
import { submitReport } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const idsParam = req.nextUrl.searchParams.get("ids");
    const ids = idsParam
      ? idsParam.split(",").map((item) => item.trim()).filter(Boolean)
      : undefined;
    const reports = await getPublicReports(ids);
    return NextResponse.json({ reports });
  } catch (error) {
    console.error("[reports:get]", error);
    return NextResponse.json({ error: "Failed to load reports" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      title?: string;
      description?: string;
      category?: string;
      lat?: number;
      lng?: number;
      address?: string;
      photo_url?: string;
      reporter_email?: string;
    };

    if (!body.title || !body.description || !body.category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = await submitReport({
      title: body.title,
      description: body.description,
      category: body.category,
      lat: body.lat,
      lng: body.lng,
      address: body.address,
      photo_url: body.photo_url,
      reporter_email: body.reporter_email,
    });

    if (!result.success || !result.id) {
      return NextResponse.json({ error: "Report submission failed" }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      report: {
        id: String(result.id),
        title: body.title,
        description: body.description,
        category: body.category,
        status: "přijato",
        lat: body.lat,
        lng: body.lng,
        address: body.address,
        photo_url: body.photo_url,
        reporter_email: body.reporter_email,
        created_at: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("[reports:post]", error);
    return NextResponse.json({ error: "Report submission failed" }, { status: 500 });
  }
}
