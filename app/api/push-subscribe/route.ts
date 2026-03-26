import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";

export const dynamic = "force-dynamic";

// In production store subscriptions in Supabase/DB.
const subscriptions: webpush.PushSubscription[] = [];

function initVapid() {
  webpush.setVapidDetails(
    process.env.VAPID_CONTACT ?? "mailto:info@vimperk.app",
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  );
}

export async function POST(req: NextRequest) {
  try {
    initVapid();
    const subscription: webpush.PushSubscription = await req.json();
    if (!subscription?.endpoint) {
      return NextResponse.json({ error: "Invalid subscription" }, { status: 400 });
    }

    const exists = subscriptions.some((s) => s.endpoint === subscription.endpoint);
    if (!exists) subscriptions.push(subscription);

    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: "Vimperk — notifikace aktivní ✓",
        body: "Budete informováni o důležitých zprávách z Vimperka.",
        icon: "/icons/icon-192.png",
        url: "/",
      })
    );

    return NextResponse.json({ success: true, total: subscriptions.length });
  } catch (err) {
    console.error("[push-subscribe]", err);
    return NextResponse.json({ error: "Subscription failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { endpoint } = await req.json();
  const idx = subscriptions.findIndex((s) => s.endpoint === endpoint);
  if (idx > -1) subscriptions.splice(idx, 1);
  return NextResponse.json({ success: true });
}
